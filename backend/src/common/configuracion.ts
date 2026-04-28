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
  nodeEnv: variablesEntornoValidadas.data.NODE_ENV,
  frontendUrl: variablesEntornoValidadas.data.FRONTEND_URL,
  baseDatos: {
    urlConexion: variablesEntornoValidadas.data.DATABASE_URL,
  }
};

export type configuracionVariablesEntorno = typeof configuracion;
