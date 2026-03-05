import { FastifyReply, FastifyRequest, FastifyError } from 'fastify';
import { ErrorDeAplicacion } from '../../dominio/errores/ErrorDeAplicacion.js';
import { EstadoHttp } from './estadoHttp.enum.js';
import { ZodError } from 'zod';

export const manejadorGlobalDeErrores = (
  error: ErrorDeAplicacion | ZodError | FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof ErrorDeAplicacion) {
    return reply.code(error.estado).send({
      mensaje: error.message,
      codigoInterno: error.codigoInterno,
    });
  }

  if (error instanceof ZodError) {
    return reply.code(EstadoHttp.PETICION_INVALIDA).send({
      mensaje:
        'Error de validación en la petición. Revise los parámetros enviados.',
      error: error.issues[0]?.message || 'Error de validación desconocido.',
      detalles: error.issues.map((issue) => ({
        ruta: issue.path.join('.'),
        mensaje: issue.message,
      })),
    });
  }

  if (error instanceof Error) {
    request.log.error(error);

    return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
      mensaje: 'Fallo interno en el servidor.',
      error: 'Ha ocurrido un error inesperado.',
    });
  }

  return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
    mensaje: 'Error interno desconocido.',
    error: (error as any)?.toString() || 'Error desconocido del servidor.',
  });
};
