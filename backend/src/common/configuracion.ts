import dotenv from 'dotenv';
import { variablesEntornoEsquema } from '../core/infraestructura/esquemas/variablesEntornoEsquema.js';

dotenv.config();

const variablesEntornoValidadas = variablesEntornoEsquema.safeParse(process.env);

if(!variablesEntornoValidadas.success){
  const errores = variablesEntornoValidadas.error.issues
    .map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
  throw new Error(`Variables de entorno inválidas: ${errores}`);
}

export const configuracion = {
  httpPuerto: variablesEntornoValidadas.data.PUERTO,
  baseDatos: {
    host: variablesEntornoValidadas.data.PGHOST,
    puerto: variablesEntornoValidadas.data.PGPORT,
    usuario: variablesEntornoValidadas.data.PGUSER,
    contrasena: variablesEntornoValidadas.data.PGPASSWORD,
    nombreDb: variablesEntornoValidadas.data.PGDBNAME
  }
};

export type configuracionVariablesEntorno = typeof configuracion;
