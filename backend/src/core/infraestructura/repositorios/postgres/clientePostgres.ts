import { Pool } from 'pg';
import { configuracion } from '../../../../common/configuracion.js';

export const pool = new Pool({
  connectionString: configuracion.baseDatos.urlConexion,
});

export async function ejecutarConsulta(consulta: string, parametros?: Array<number | string | Date | null>) {
  return await pool.query(consulta, parametros);
}
