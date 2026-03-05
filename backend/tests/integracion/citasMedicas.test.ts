import { describe, expect, jest } from '@jest/globals';

const idParaTestearCitas: string = '6e27c176-ed61-4083-888d-876fb4a29055';

jest.mock('../../src/core/infraestructura/repositorios/postgres/CitasMedicasRepositorio.js', () => {
  return {
    CitasMedicasRepositorio: jest.fn().mockImplementation(() => ({
      obtenerCitas: async (limite?: number) => {
        const datosSimulados = [
          {
            idCita: idParaTestearCitas,
            paciente: 'Juan Pérez',
            tipoDocPaciente: 'Cédula',
            numeroDocPaciente: '100001',
            medico: 'Carlos Rodríguez',
            ubicacion: 'Edificio E, Piso 3',
            consultorio: 'C101',
            fecha: '2025-11-25T05:00:00.000Z',
            horaInicio: '08:00:00',
            codigoEstadoCita: 1,
            estadoCita: 'Activa',
            idCitaAnterior: null,
          },
          {
            idCita: '62d95327-68ce-4bb1-a129-6747406c2f3f',
            paciente: 'Laura Gómez',
            tipoDocPaciente: 'Cédula Extranjería',
            numeroDocPaciente: '100002',
            medico: 'Sofía Martínez',
            ubicacion: 'Edificio A, Piso 5',
            consultorio: 'C102',
            fecha: '2025-11-25T05:00:00.000Z',
            horaInicio: '09:00:00',
            codigoEstadoCita: 1,
            estadoCita: 'Activa',
            idCitaAnterior: null,
          },
          {
            idCita: 'ca8dc0d3-e7c8-4ccf-b376-0070d6044b99',
            paciente: 'Andrés Ramírez',
            tipoDocPaciente: 'Tarjeta Identidad',
            numeroDocPaciente: '100003',
            medico: 'Julián García',
            ubicacion: 'Edificio B, Piso 6',
            consultorio: 'C202',
            fecha: '2025-11-28T05:00:00.000Z',
            horaInicio: '10:30:00',
            codigoEstadoCita: 1,
            estadoCita: 'Activa',
            idCitaAnterior: null,
          },
          {
            idCita: '2577e5e1-f9f3-40bb-b545-0df597fd823a',
            paciente: 'María López',
            tipoDocPaciente: 'Pasaporte',
            numeroDocPaciente: '100004',
            medico: 'Valentina Ruiz',
            ubicacion: 'Edificio D, Piso 2',
            consultorio: 'C201',
            fecha: '2025-11-29T05:00:00.000Z',
            horaInicio: '14:00:00',
            codigoEstadoCita: 1,
            estadoCita: 'Activa',
            idCitaAnterior: null,
          },
        ];

        return typeof limite === 'number' ? datosSimulados.slice(0, limite) : datosSimulados;
      },

      obtenerCitaPorId: async (idCita: string) => {
        if (idCita === idParaTestearCitas) {
          return {
            idCita: idParaTestearCitas,
            paciente: 'Juan Pérez',
            tipoDocPaciente: 'Cédula',
            numeroDocPaciente: '100001',
            medico: 'Carlos Rodríguez',
            ubicacion: 'Edificio E, Piso 3',
            consultorio: 'C101',
            fecha: '2025-11-25T05:00:00.000Z',
            horaInicio: '08:00:00',
            codigoEstadoCita: 1,
            estadoCita: 'Activa',
            idCitaAnterior: null,
          };
        }
        return null;
      },

      eliminarCita: async (id: string) => (id === idParaTestearCitas ? true : false),
    })),
  };
});

import request from 'supertest';
import { app } from '../../src/core/infraestructura/app.js';
import { pool } from '../../src/core/infraestructura/repositorios/postgres/clientePostgres.js';

describe('Pruebas de integración - Módulo citas medicas', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await pool.end();
  });

  test('GET /api/citas-medicas - Retorna todas la citas medicas simuladas', async () => {
    const respuesta = await request(app.server).get('/api/citas-medicas');
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      cantidadCitas: respuesta.body.cantidadCitas,
      citasEncontradas: respuesta.body.citasEncontradas,
    });
  });

  test('GET /api/citas-medicas/:idCita - Retorna una cita médica específica simulada', async () => {
    const idCita = idParaTestearCitas;
    const respuesta = await request(app.server).get(`/api/citas-medicas/${idCita}`);
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      mensaje: 'Cita encontrada',
      citaEncontrada: {
        idCita: idParaTestearCitas,
        paciente: 'Juan Pérez',
        tipoDocPaciente: 'Cédula',
        numeroDocPaciente: '100001',
        medico: 'Carlos Rodríguez',
        ubicacion: 'Edificio E, Piso 3',
        consultorio: 'C101',
        fecha: '2025-11-25T05:00:00.000Z',
        horaInicio: '08:00:00',
        codigoEstadoCita: 1,
        estadoCita: 'Activa',
        idCitaAnterior: null,
      },
    });
  });

  test('GET /api/citas-medicas/:idCita - Retorna 404 como error si no existe', async () => {
    const idCitaFalso = 'f5581292-15c1-4d8a-9295-46f72df39b79';
    const respuesta = await request(app.server).get(`/api/citas-medicas/${idCitaFalso}`);
    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual({
      mensaje: 'La cita solicita no existe en el sistema',
      codigoInterno: 'CITA001',
    });
  });

  test('DELETE /api/citas-medicas/eliminacion/:idCita - Elimina la cita correctamente', async () => {
    const idCita = idParaTestearCitas;
    const respuesta = await request(app.server).delete(`/api/citas-medicas/eliminacion/${idCita}`);
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      mensaje: 'Cita eliminada correctamente',
      idCita: idParaTestearCitas,
    });
  });

  test('DELETE /api/citas-medicas/eliminacion/:idCita - Retorna 404 como error si no existe', async () => {
    const idCita = 'bdea6188-4636-4c98-aae6-5df366aba1ab';
    const respuesta = await request(app.server).delete(`/api/citas-medicas/eliminacion/${idCita}`);
    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual({
      mensaje: 'La cita solicita no existe en el sistema',
      codigoInterno: 'CITA001',
    });
  });
});
