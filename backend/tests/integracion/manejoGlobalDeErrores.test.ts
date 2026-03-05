import Fastify, { FastifyInstance } from 'fastify';
import request from 'supertest';
import { manejadorGlobalDeErrores } from '../../src/core/infraestructura/controladores/manejoGlobalDeErrores.js';
import { ErrorDeAplicacion } from '../../src/core/dominio/errores/ErrorDeAplicacion.js';
import { EstadoHttp } from '../../src/core/infraestructura/controladores/estadoHttp.enum.js';
import { CodigosDeError } from '../../src/core/dominio/errores/codigosDeError.enum.js';
import { ZodError } from 'zod';

describe('Manejo Global de Errores (Integración)', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    app.setErrorHandler(manejadorGlobalDeErrores);

    app.get('/test/error-dominio', async () => {
      throw new ErrorDeAplicacion(EstadoHttp.CONFLICTO, 'Error de dominio simulado', CodigosDeError.PACIENTE_YA_EXISTE);
    });

    app.get('/test/error-zod', async () => {
      const issue: any = {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['campo_prueba'],
        message: 'Debe ser un string',
      };
      throw new ZodError([issue]);
    });

    app.get('/test/error-generico', async () => {
      throw new Error('Error inesperado del sistema');
    });

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('debería interceptar ErrorDeAplicacion y devolver su código y mensaje correctos', async () => {
    const response = await request(app.server).get('/test/error-dominio');

    expect(response.status).toBe(EstadoHttp.CONFLICTO);
    expect(response.body).toEqual({
      mensaje: 'Error de dominio simulado',
      codigoInterno: CodigosDeError.PACIENTE_YA_EXISTE,
    });
  });

  test('debería interceptar ZodError y devolver formato de error de validación', async () => {
    const response = await request(app.server).get('/test/error-zod');

    expect(response.status).toBe(EstadoHttp.PETICION_INVALIDA);
    expect(response.body).toHaveProperty('mensaje');
    expect(response.body).toHaveProperty('detalles');
    expect((response.body as any).detalles[0]).toEqual({
      ruta: 'campo_prueba',
      mensaje: 'Debe ser un string',
    });
  });

  test('debería interceptar errores no controlados y devolver 500', async () => {
    const response = await request(app.server).get('/test/error-generico');

    expect(response.status).toBe(EstadoHttp.ERROR_INTERNO_SERVIDOR);
    expect(response.body).toEqual({
      mensaje: 'Fallo interno en el servidor.',
      error: 'Ha ocurrido un error inesperado.',
    });
  });
});
