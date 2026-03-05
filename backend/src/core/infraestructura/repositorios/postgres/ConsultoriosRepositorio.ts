import { IConsultoriosRepositorio } from "../../../dominio/consultorio/IConsultoriosRepositorio.js";
import { ejecutarConsulta } from "./clientePostgres.js";
import { IConsultorio } from "../../../dominio/consultorio/IConsultorio.js";
import { camelCaseASnakeCase } from '../../../../common/camelCaseASnakeCase.js';
import { consultorioFila, mapFilaConsultorio } from "./mappers/consultorio.mapper.js";
import { ConsultorioRespuestaDTO } from "./dtos/consultorioRespuestaDTO.js";

export class ConsultorioRepositorio implements IConsultoriosRepositorio {

  async agregarConsultorio(datosConsultorio:IConsultorio): Promise<ConsultorioRespuestaDTO | null> {
    const columnas = Object.keys(datosConsultorio).map((key) => camelCaseASnakeCase(key));
    const params: Array<string | number> = Object.values(datosConsultorio);
    const placeholders = columnas.map((_,i)=> `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO consultorios (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING id_consultorio, ubicacion;
    `;
    const resultado = await ejecutarConsulta(query,params);
    const consultorio = await this.obtenerConsultorioPorId(resultado.rows[0].id_consultorio);
    return consultorio;
  }

  async listarConsultorios(limite?: number): Promise<ConsultorioRespuestaDTO[]> {
    let query = `SELECT id_consultorio as "idConsultorio", ubicacion FROM consultorios`;
    const valores: number[] = [];

    if (limite !== undefined){
      query += " LIMIT $1";
      valores.push(limite);
    }

    const resultado = await ejecutarConsulta(query, valores);
    const filas: ConsultorioRespuestaDTO[] = resultado.rows;
    const consultorio = filas.map(mapFilaConsultorio);
    return consultorio;
  }

  async obtenerConsultorioPorId(idConsultorio: string): Promise<ConsultorioRespuestaDTO | null> {
    const query =`
      SELECT id_consultorio as "idConsultorio", ubicacion FROM consultorios WHERE id_consultorio = $1
    `;
    const resultado = await ejecutarConsulta(query,[idConsultorio]);

    if (resultado.rows.length === 0) return null;

    const infoConsultorio: consultorioFila = resultado.rows[0];
    const consultorio = mapFilaConsultorio(infoConsultorio);
    return consultorio;
  }

  async actualizarConsultorio(idConsultorio:string, datosConsultorio:IConsultorio): Promise<ConsultorioRespuestaDTO | null>{
    const columnas = Object.keys(datosConsultorio).map((key) => camelCaseASnakeCase(key));
    const params: Array<string | number> = Object.values(datosConsultorio);
    const setClause = columnas.map((col,i) => `${col}=$${i + 1}`).join(", ");
    params.push(idConsultorio);

    const query = `
      UPDATE consultorios
      SET ${setClause}
      WHERE id_consultorio = $${params.length}
      RETURNING id_consultorio as "idConsultorio", ubicacion;
    `

    const resultado = await ejecutarConsulta(query, params);
    if (resultado.rows.length === 0) return null;

    const consultorioActualizado: consultorioFila = resultado.rows[0];
    return mapFilaConsultorio(consultorioActualizado);
  }

  async eliminarConsultorio(idConsultorio: string): Promise<void> {
    await ejecutarConsulta(
      "DELETE FROM consultorios WHERE id_consultorio = $1", [idConsultorio]);
  }
}