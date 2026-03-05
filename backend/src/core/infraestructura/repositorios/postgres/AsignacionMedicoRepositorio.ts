import { ejecutarConsulta } from './clientePostgres.js';
import { IAsignacionMedico } from '../../../dominio/asignacionMedico/IAsignacionMedico.js';
import { IAsignacionMedicoRepositorio } from '../../../dominio/asignacionMedico/IAsignacionMedicoRepositorio.js';
import { camelCaseASnakeCase } from '../../../../common/camelCaseASnakeCase.js';
import { AsignacionIdRespuestaDTO } from './dtos/AsignacionRespuestaDTO.js';
import {
  AsignacionIdFila,
  mapIdFilaAsignacion,
} from './mappers/asignacion.mapper.js';

export class AsignacionMedicoRepositorio
  implements IAsignacionMedicoRepositorio
{
  async existeAsignacion(
    tarjetaProfesionalMedico: string,
    idConsultorio: string,
    diaSemana: number,
    inicioJornada: string,
    finJornada: string
  ): Promise<boolean> {
    const query =
      'SELECT 1 FROM asignacion_medicos ' +
      'WHERE tarjeta_profesional_medico = $1 ' +
      'AND id_consultorio = $2 ' +
      'AND dia_semana = $3 ' +
      'AND inicio_jornada = $4 ' +
      'AND fin_jornada = $5 LIMIT 1';

    const result = await ejecutarConsulta(query, [
      tarjetaProfesionalMedico,
      idConsultorio,
      diaSemana,
      inicioJornada,
      finJornada,
    ]);

    return result.rows.length > 0;
  }

  async consultorioOcupado(
    idConsultorio: string,
    diaSemana: number,
    inicio_jornada: string,
    fin_jornada: string
  ): Promise<boolean> {
    const query =
      'SELECT 1 FROM asignacion_medicos ' +
      'WHERE id_consultorio = $1 ' +
      'AND dia_semana = $2 ' +
      'AND inicio_jornada >= $3 ' +
      'AND fin_jornada <= $4;';

    const result = await ejecutarConsulta(query, [
      idConsultorio,
      diaSemana,
      inicio_jornada,
      fin_jornada,
    ]);

    return result.rows.length > 0;
  }

  async crearAsignacion(
    nuevaAsignacion: IAsignacionMedico
  ): Promise<AsignacionIdRespuestaDTO> {
    const columnas: string[] = Object.keys(nuevaAsignacion).map((key) =>
      camelCaseASnakeCase(key)
    );
    const parametros: Array<string | number> = Object.values(nuevaAsignacion);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO asignacion_medicos (${columnas.join(', ')})
      VALUES (${placeholders})
      RETURNING id_asignacion
    `;

    const result = await ejecutarConsulta(query, parametros);

    const fila: AsignacionIdFila = result.rows[0];

    return mapIdFilaAsignacion(fila);
  }

  async eliminarAsignacion(tarjetaProfesionalMedico: string): Promise<void> {
    const parametros = tarjetaProfesionalMedico;
    const query =
      'DELETE FROM asignacion_medicos ' +
      'WHERE tarjeta_profesional_medico = $1';

    await ejecutarConsulta(query, [parametros]);
  }
}
