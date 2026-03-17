import Fastify from 'fastify';
import { FastifyError } from 'fastify';
import cors from '@fastify/cors';
import { configuracion } from '../../common/configuracion.js';
import { construirCitasEnrutador } from './rutas/citasMedicasEnrutador.js';
import { construirPacientesEnrutador } from './rutas/pacientesEnrutador.js';
import { construirMedicosEnrutador } from './rutas/medicosEnrutador.js';
import { construirConsultorioEnrutador } from './rutas/consultoriosEnrutador.js';
import { construirAsignacionesEnrutador } from '../infraestructura/rutas/asignacionesEnrutador.js';
import { construirHistorialEnrutador } from './rutas/historialPacienteEnrutador.js';
import { manejadorGlobalDeErrores } from './controladores/manejoGlobalDeErrores.js';

export const app = Fastify({ logger: true });

// Registrar CORS
const corsConfig = {
  origin: configuracion.nodeEnv === 'development'
    ? true
    : configuracion.frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.register(cors, corsConfig);

// Traducción de ErrorDeAplicacion a respuestas HTTP.
app.setErrorHandler(manejadorGlobalDeErrores);

app.register(
  async (appInstance) => {
    construirConsultorioEnrutador(appInstance);
    construirCitasEnrutador(appInstance);
    construirMedicosEnrutador(appInstance);
    construirPacientesEnrutador(appInstance);
    //Servicios
    construirAsignacionesEnrutador(appInstance);
    construirHistorialEnrutador(appInstance);
  },
  { prefix: '/api' }
);

export const startServer = async (): Promise<void> => {
  try {
    await app.listen({ port: configuracion.httpPuerto });
    app.log.info('✅ El servidor esta corriendo...');
  } catch (err) {
    app.log.error(`Error al ejecutar el servidor\n ${err}`);
    const serverError: FastifyError = {
      code: 'FST_ERR_INIT_SERVER',
      name: 'ServidorError',
      statusCode: 500,
      message: `El servidor no se pudo iniciar: ${(err as Error).message}`,
    };
    throw serverError;
  }
};
