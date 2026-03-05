import { IPacientesRepositorio } from '../../../dominio/paciente/IPacientesRepositorio.js';
import { IPaciente } from '../../../dominio/paciente/IPaciente.js';
import { ejecutarConsulta } from './clientePostgres.js';
import { Paciente } from '../../../dominio/paciente/Paciente.js';
import { camelCaseASnakeCase } from '../../../../common/camelCaseASnakeCase.js';
import { mapFilaPaciente, pacienteFila } from './mappers/paciente.mapper.js';
import { pacienteRespuestaDTO } from './dtos/pacienteRespuestaDTO.js';

export class PacientesRepositorio implements IPacientesRepositorio {
  private get _queryBase(): string {
    return `
     SELECT
      tipo_doc AS "tipoDocPaciente",
      numero_doc AS "numeroDocPaciente",
      nombre,
      apellido,
      fecha_nacimiento AS "fechaNacimiento",
      sexo,
      email,
      telefono,
      direccion
    FROM pacientes
    `;
  }
  async existePacientePorDocumento(numeroDoc: string, tipoDoc: number): Promise<boolean> {
    // Consulta optimizada: solo necesitamos saber si existe una fila que coincida.
    const query = 'SELECT 1 FROM pacientes WHERE numero_doc = $1 AND tipo_doc = $2 LIMIT 1';
    const result = await ejecutarConsulta(query, [numeroDoc, tipoDoc]);

    // Si la consulta devuelve al menos una fila (length > 0), el paciente existe.
    return result.rows.length > 0;
  }

  async obtenerPacientes(limite?: number): Promise<pacienteRespuestaDTO[]> {
    let query = this._queryBase;
    const limiteParam: number[] = [];

    if (limite !== undefined) {
      query += ' LIMIT $1';
      limiteParam.push(limite);
    }

    const resultado = await ejecutarConsulta(query, limiteParam);
    const filas: pacienteFila[] = resultado.rows;
    const pacientes = filas.map(mapFilaPaciente);
    return pacientes;
  }

  async obtenerPacientePorId(numeroDoc: string): Promise<pacienteRespuestaDTO | null> {
    const query = this._queryBase + 'WHERE numero_doc = $1';
    const resultado = await ejecutarConsulta(query, [numeroDoc]);

    if (resultado.rows.length === 0) return null;

    const infoPaciente: pacienteFila = resultado.rows[0];
    const paciente = mapFilaPaciente(infoPaciente);

    return paciente;
  }

  async crearPaciente(nuevoPaciente: IPaciente): Promise<pacienteRespuestaDTO | null> {
    const columnas: string[] = Object.keys(nuevoPaciente).map((key) => camelCaseASnakeCase(key));
    const parametros: Array<string | number | Date> = Object.values(nuevoPaciente);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO pacientes (${columnas.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const resultado = await ejecutarConsulta(query, parametros);
    const pacienteCreado = await this.obtenerPacientePorId(resultado.rows[0].numero_doc);
    return pacienteCreado;
  }

  async actualizarPaciente(numeroDoc: string, datosPaciente: IPaciente): Promise<pacienteRespuestaDTO | null> {
    const columnas: string[] = Object.keys(datosPaciente).map((key) => camelCaseASnakeCase(key));
    const parametros: Array<string | number | Date> = Object.values(datosPaciente);
    const clausulaSet = columnas.map((col, i) => `${col}=$${i + 1}`).join(', ');
    parametros.push(numeroDoc);

    const query = `
      UPDATE pacientes
      SET ${clausulaSet}
      WHERE numero_doc=$${parametros.length}
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, parametros);

    if (!resultado.rows[0]) {
      throw new Error(`Error al actualizar el Paciente con ID ${numeroDoc}.`);
    }

    const pacienteActualizado = await this.obtenerPacientePorId(resultado.rows[0].numero_doc);

    return pacienteActualizado;
  }

  async borrarPaciente(numeroDoc: string): Promise<void> {
    await ejecutarConsulta('DELETE FROM pacientes WHERE numero_doc = $1', [numeroDoc]);
  }
}
