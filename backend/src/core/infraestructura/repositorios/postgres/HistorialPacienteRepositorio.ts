import { IHistorialPacienteRepositorio } from '../../../dominio/historialPaciente/IHistorialPacienteRepositorio.js';
import { IHistorialPaciente } from '../../../dominio/historialPaciente/IHistorialPaciente.js';
import { HistorialPacienteRespuestaDTO } from './dtos/HistorialPacienteRespuestaDTO.js';
import { ejecutarConsulta } from './clientePostgres.js';
import { mapFilaHistorialPaciente } from './mappers/historialPaciente.mapper.js';

export class HistorialPacienteRepositorio implements IHistorialPacienteRepositorio {
  private get _queryBase(): string {
    return `
      SELECT
        h.id_historial    AS "idHistorial",
        h.id_cita         AS "idCita",
        (p.nombre || ' ' || COALESCE(p.apellido, '')) AS paciente,
        (m.nombre || ' ' || COALESCE(m.apellido, '')) AS medico,
        c.fecha,
        h.diagnostico,
        h.descripcion,
        h.fecha_registro  AS "fechaRegistro"
      FROM historial_paciente h
      INNER JOIN citas_medicas c   ON h.id_cita = c.id_cita
      INNER JOIN pacientes p       ON c.tipo_doc_paciente = p.tipo_doc
                                  AND c.numero_doc_paciente = p.numero_doc
      INNER JOIN medicos m         ON c.medico = m.tarjeta_profesional
    `;
  }

  async crearHistorial(datos: IHistorialPaciente): Promise<HistorialPacienteRespuestaDTO | null> {
    const resultado = await ejecutarConsulta(
      `INSERT INTO historial_paciente (id_cita, diagnostico, descripcion)
       VALUES ($1::UUID, $2, $3)
       RETURNING id_historial`,
      [datos.idCita, datos.diagnostico, datos.descripcion ?? null]
    );

    return await this.obtenerHistorialPorCita(datos.idCita);
  }

  async obtenerHistorialPorCita(idCita: string): Promise<HistorialPacienteRespuestaDTO | null> {
    const resultado = await ejecutarConsulta(
      `${this._queryBase} WHERE h.id_cita = $1::UUID`,
      [idCita]
    );

    if (resultado.rows.length === 0) return null;
    return mapFilaHistorialPaciente(resultado.rows[0]);
  }

  async obtenerHistorialPorPaciente(numeroDoc: string): Promise<HistorialPacienteRespuestaDTO[]> {
    const resultado = await ejecutarConsulta(
      `${this._queryBase} WHERE c.numero_doc_paciente = $1 ORDER BY c.fecha DESC`,
      [numeroDoc]
    );

    return resultado.rows.map(mapFilaHistorialPaciente);
  }
}
