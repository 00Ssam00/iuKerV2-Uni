import { camelCaseASnakeCase } from '../../../../common/camelCaseASnakeCase.js';
import { conversionAFechaColombia } from '../../../../common/conversionAFechaColombia.js';
import { estadoCita } from '../../../../common/estadoCita.enum.js';
import { ICitaMedica } from '../../../dominio/citaMedica/ICitaMedica.js';
import { ICitasMedicasRepositorio } from '../../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { ejecutarConsulta } from './clientePostgres.js';
import { CitaMedicaRespuestaDTO } from './dtos/CitaMedicaRespuestaDTO.js';
import { CitaMedicaFila, mapFilaCitaMedica } from './mappers/citaMedica.mapper.js';
import { ConsultaCitasPacienteRespuestaDTO } from './dtos/ConsultaCitasPacienteRespuestaDTO.js';
import { CitaPacienteFila, mapFilaCitaPaciente } from './mappers/consultaCitasPaciente.mapper.js';

export class CitasMedicasRepositorio implements ICitasMedicasRepositorio {
  private get _queryBase(): string {
    return `
    SELECT
      c.id_cita AS "idCita",
      (p.nombre || ' ' || COALESCE (p.apellido, '')) AS paciente,
      td.descripcion AS "tipoDocPaciente",
      c.numero_doc_paciente AS "numeroDocPaciente",
      (m.nombre || ' ' || COALESCE (m.apellido, '')) AS medico,
      co.ubicacion,
      co.id_consultorio AS consultorio,
      c.fecha,
      c.hora_inicio AS "horaInicio",
      e.id_estado AS estado,
      e.descripcion AS "estadoCita",
      c.id_cita_anterior AS "idCitaAnterior"
    FROM citas_medicas c
    INNER JOIN pacientes p ON c.tipo_doc_paciente = p.tipo_doc AND c.numero_doc_paciente = p.numero_doc
    INNER JOIN medicos m ON c.medico = m.tarjeta_profesional
    INNER JOIN estados e ON c.estado = e.id_estado
    INNER JOIN tipo_documentos td ON c.tipo_doc_paciente = td.id_documento
    LEFT JOIN asignacion_medicos am
      ON m.tarjeta_profesional = am.tarjeta_profesional_medico
      AND EXTRACT(DOW FROM c.fecha) = am.dia_semana
      AND c.hora_inicio >= am.inicio_jornada
      AND c.hora_fin <= am.fin_jornada
    LEFT JOIN consultorios co ON am.id_consultorio = co.id_consultorio
    `;
  }

  async obtenerCitas(limite?: number): Promise<CitaMedicaRespuestaDTO[]> {
    let query = this._queryBase + `ORDER BY c.fecha ASC`;

    const valores: number[] = [];

    if (limite !== undefined) {
      query += ' LIMIT $1';
      valores.push(limite);
    }

    const resultado = await ejecutarConsulta(query, valores);

    const filas: CitaMedicaFila[] = resultado.rows;
    const citas = filas.map(mapFilaCitaMedica);
    return citas;
  }

  async obtenerCitaPorId(idCita: string): Promise<CitaMedicaRespuestaDTO | null> {
    const query = this._queryBase + `WHERE id_cita = $1`;
    const resultado = await ejecutarConsulta(query, [idCita]);

    if (resultado.rows.length === 0) return null;

    const infoCita: CitaMedicaFila = resultado.rows[0];
    const cita = mapFilaCitaMedica(infoCita);

    return cita;
  }

  // Verifica si existe Traslape para un medico en una fecha y hora especifica
  // Excluye citas canceladas y, si se desea, una cita especifica
  async validarDisponibilidadMedico(
    medico: string,
    fecha: string,
    horaInicio: string,
    idCitaAExcluir?: string
  ): Promise<boolean> {
    const fechaColombia = conversionAFechaColombia(fecha, horaInicio);

    let query = `
      SELECT * FROM citas_medicas
      WHERE medico = $1
      AND fecha = $2
      AND estado != ${estadoCita.CANCELADA}
      AND (
        (hora_inicio, hora_fin) OVERLAPS ($3::TIME, ($3::TIME + '30 minutes'::INTERVAL))
      )
    `;

    const params: (number | string | Date)[] = [medico, fechaColombia, horaInicio];
    // Usado para excluir la cita a la hora de reprogramar, para evitar traslape
    if (idCitaAExcluir) {
      query += ` AND id_cita != $4`;
      params.push(idCitaAExcluir);
    }

    const resultado = await ejecutarConsulta(query, params);
    return resultado.rows.length > 0;
  }

  // Verifica si existe traslape para un paciente en una fecha y hora especifica
  async validarCitasPaciente(
    tipoDocPaciente: number,
    numeroDocPaciente: string,
    fecha: string,
    horaInicio: string,
    idCitaAExcluir?: string
  ): Promise<boolean> {
    const fechaColombia = conversionAFechaColombia(fecha, horaInicio);
    let query = `
      SELECT * FROM citas_medicas
      WHERE tipo_doc_paciente = $1
      AND numero_doc_paciente = $2
      AND fecha = $3
      AND estado != ${estadoCita.CANCELADA}
      AND (
      (hora_inicio, hora_fin) OVERLAPS ($4::TIME, ($4::TIME + '30 minutes'::INTERVAL))
      )
    `;

    const params: (number | string | Date)[] = [tipoDocPaciente, numeroDocPaciente, fechaColombia, horaInicio];
    if (idCitaAExcluir) {
      query += ` AND id_cita != $5`;
      params.push(idCitaAExcluir);
    }

    const resultado = await ejecutarConsulta(query, params);
    return resultado.rows.length > 0;
  }

  async validarTurnoMedico(medico: string, fecha: string, horaInicio: string): Promise<boolean> {
    const fechaColombia = conversionAFechaColombia(fecha, horaInicio);
    const diaSemana = fechaColombia.getDay();
    const valores = [medico, diaSemana, horaInicio];

    const query = `
      SELECT COUNT(*) FROM asignacion_medicos
      WHERE tarjeta_profesional_medico = $1
      AND dia_semana = $2
      AND inicio_jornada <= $3::TIME
      AND fin_jornada >= ($3::TIME + INTERVAL '30 minutes');
    `;

    const resultado = await ejecutarConsulta(query, valores);

    return resultado.rows[0].count > 0;
  }

  async agendarCita(datosCitaMedica: ICitaMedica): Promise<CitaMedicaRespuestaDTO | null> {
    const columnas = Object.keys(datosCitaMedica).map((key) => camelCaseASnakeCase(key));
    const parametros: Array<string | number> = Object.values(datosCitaMedica);
    const placeHolders = columnas.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
    INSERT INTO citas_medicas (${columnas.join(', ')})
    VALUES (${placeHolders})
    RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, parametros);
    const citaAgendada = await this.obtenerCitaPorId(resultado.rows[0].id_cita);
    return citaAgendada;
  }

  async eliminarCita(idCita: string): Promise<void> {
    // Primero eliminar las citas que dependen de esta
    await ejecutarConsulta('DELETE FROM citas_medicas WHERE id_cita_anterior = $1', [idCita]);
    // Luego eliminar la cita original
    await ejecutarConsulta('DELETE FROM citas_medicas WHERE id_cita = $1', [idCita]);
  }

  // Reprograma una cita creando una nueva con referencia a la anterior
  async reprogramarCita(idCitaAnterior: string, nuevasCitas: ICitaMedica): Promise<CitaMedicaRespuestaDTO | null> {
    await ejecutarConsulta(`UPDATE citas_medicas SET estado = ${estadoCita.REPROGRAMADA} WHERE id_cita = $1::UUID`, [
      idCitaAnterior,
    ]);
    // Crear la nueva cita con referencia a la anterior
    const citaConReferencia: ICitaMedica = {
      ...nuevasCitas,
      idCitaAnterior: idCitaAnterior,
      estado: 1, // Nueva cita con estado Activa
    };

    return await this.agendarCita(citaConReferencia);
  }

  // Cancela una cita cambiando su estado
  async cancelarCita(idCita: string): Promise<CitaMedicaRespuestaDTO | null> {
    const query = `
      UPDATE citas_medicas
      SET estado = ${estadoCita.CANCELADA}
      WHERE id_cita = $1
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, [idCita]);
    const citaCancelada = await this.obtenerCitaPorId(resultado.rows[0].id_cita);
    return citaCancelada;
  }

  async finalizarCita(idCita: string): Promise<CitaMedicaRespuestaDTO | null> {
    const query = `
      UPDATE citas_medicas
      SET estado = ${estadoCita.FINALIZADA}
      WHERE id_cita = $1
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, [idCita]);
    const citaFinalizada = await this.obtenerCitaPorId(resultado.rows[0].id_cita);
    return citaFinalizada;
  }

  async obtenerCitasPorPaciente(numeroDoc: string, limite?: number): Promise<ConsultaCitasPacienteRespuestaDTO[]> {
    const parametros: Array<string | number> = [numeroDoc];
    let query = `
    SELECT DISTINCT c.fecha, c.hora_inicio AS "horaInicio", e.descripcion AS "estado", (m.nombre || ' ' || COALESCE (m.apellido, '')) AS "nombreMedico", co.ubicacion
    FROM citas_medicas c
    LEFT JOIN medicos m ON m.tarjeta_profesional = c.medico
    LEFT JOIN asignacion_medicos am ON am.tarjeta_profesional_medico = m.tarjeta_profesional
    LEFT JOIN consultorios co ON co.id_consultorio = am.id_consultorio
	  LEFT JOIN estados e ON c.estado = e.id_estado
    WHERE c.numero_doc_paciente = $1
    ORDER BY c.fecha ASC
    `;
    if (limite !== undefined) {
      query += ' LIMIT $2';
      parametros.push(limite);
    }

    const resultado = await ejecutarConsulta(query, parametros);

    const filas: CitaPacienteFila[] = resultado.rows;
    const citas = filas.map(mapFilaCitaPaciente);
    return citas;
  }

  async eliminarCitasPorMedico(tarjetaProfesional: string): Promise<void> {
    await ejecutarConsulta(
      'DELETE FROM citas_medicas WHERE id_cita_anterior IN (SELECT id_cita FROM citas_medicas WHERE medico = $1)',
      [tarjetaProfesional]
    );

    await ejecutarConsulta('DELETE FROM citas_medicas WHERE medico = $1', [tarjetaProfesional]);
  }

  async eliminarCitasPorPaciente(tipoDocPaciente: number, numeroDocPaciente: string): Promise<void> {
    await ejecutarConsulta(
      'DELETE FROM citas_medicas WHERE id_cita_anterior IN (SELECT id_cita FROM citas_medicas WHERE tipo_doc_paciente = $1 AND numero_doc_paciente = $2)',
      [tipoDocPaciente, numeroDocPaciente]
    );

    await ejecutarConsulta('DELETE FROM citas_medicas WHERE tipo_doc_paciente = $1 AND numero_doc_paciente = $2', [
      tipoDocPaciente,
      numeroDocPaciente,
    ]);
  }
}
