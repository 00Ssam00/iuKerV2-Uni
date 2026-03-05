import request from 'supertest';
import { MedicoSolicitudDTO } from '../../src/core/infraestructura/esquemas/medicoEsquema.js';
import { IMedico } from '../../src/core/dominio/medico/IMedico.ts';
import { jest } from '@jest/globals';

jest.mock('../../src/core/infraestructura/repositorios/postgres/MedicosRepositorio', () => {
  return {
    MedicosRepositorio: jest.fn().mockImplementation(() => {
      return {
        listarMedicos: async (limite?: number) => {
          const datos = [
            {
              tarjetaProfesional: 'MP001',
              tipoDoc: 'Cédula',
              numeroDoc: '900001',
              nombre: 'Carlos',
              apellido: 'Rodríguez',
              fechaNacimiento: '1980-03-12T05:00:00.000Z',
              sexo: 'M',
              especialidad: 'Medicina General',
              email: 'carlos.rodriguez@clinicaiuker.com',
              telefono: '3105556677',
            },
            {
              tarjetaProfesional: 'MP002',
              tipoDoc: 'Cédula',
              numeroDoc: '900002',
              nombre: 'Sofía',
              apellido: 'Martínez',
              fechaNacimiento: '1985-11-23T05:00:00.000Z',
              sexo: 'F',
              especialidad: 'Pediatría',
              email: 'sofia.martinez@clinicaiuker.com',
              telefono: '3116667788',
            },
          ];
          return typeof limite === 'number' ? datos.slice(0, limite) : datos;
        },

        obtenerMedicoPorTarjetaProfesional: async (tarjetaProfesional: string) => {
          if (tarjetaProfesional === 'MP002') {
            return {
              tarjetaProfesional: 'MP002',
              tipoDoc: 'Cédula',
              numeroDoc: '900002',
              nombre: 'Sofía',
              apellido: 'Martínez',
              fechaNacimiento: '1985-11-23T05:00:00.000Z',
              sexo: 'F',
              especialidad: 'Pediatría',
              email: 'sofia.martinez@clinicaiuker.com',
              telefono: '3116667788',
            };
          }
          return null;
        },

        crearMedico: async (datosMedico: MedicoSolicitudDTO) => {
          return {
            tarjetaProfesional: 'MP008',
            tipoDoc: 'Cédula',
            numeroDoc: '900001',
            nombre: 'Carlos',
            apellido: 'Rodríguez',
            fechaNacimiento: '1980-03-12T05:00:00.000Z',
            sexo: 'M',
            especialidad: 'Medicina General',
            email: 'carlos.rodriguez@clinicaiuker.com',
            telefono: '3105556677',
          };
        },

        actualizarMedico: async (tarjetaProfesional: string, datosMedico: Partial<IMedico>) => {
          if (tarjetaProfesional === 'MP002') {
            return {
              tarjetaProfesional: 'MP002',
              tipoDoc: datosMedico.tipoDoc || 'Cédula',
              numeroDoc: datosMedico.numeroDoc || '900002',
              nombre: datosMedico.nombre || 'Sofía',
              apellido: datosMedico.apellido || 'Martínez',
              fechaNacimiento: datosMedico.fechaNacimiento || '1985-11-23T05:00:00.000Z',
              sexo: datosMedico.sexo || 'F',
              especialidad: datosMedico.especialidad || 'Pediatría',
              email: datosMedico.email || 'sofia.martinez@clinicaiuker.com',
              telefono: datosMedico.telefono || '3116667788',
            };
          }
        },

        eliminarMedico: async (tarjetaProfesional: string) => {
          return { tarjetaProfesional };
        },
      };
    }),
  };
});

import { app } from '../../src/core/infraestructura/app.ts';

describe('Pruebas de Integración para la entidad Médico', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    jest.resetAllMocks();
  });

  test('GET /api/medicos - Lista todos los médicos', async () => {
    const resultado = await request(app.server).get('/api/medicos');

    expect(resultado.status).toBe(200);
    expect(resultado.body.mensaje).toBe('Médicos encontrados correctamente');
    expect(Array.isArray(resultado.body.medicos)).toBe(true);
    expect(resultado.body.cantidad).toBeDefined();
  });

  test('GET /api/medicos/:tarjetaProfesional - Retorna información del médico', async () => {
    const resultado = await request(app.server).get('/api/medicos/MP002');

    expect(resultado.status).toBe(200);
    expect(resultado.body.mensaje).toBe('Médico encontrado correctamente');
    expect(resultado.body.medico).toBeTruthy();
    expect(resultado.body.medico?.tarjetaProfesional).toBe('MP002');
  });

  test('POST /api/medicos - Crear médico', async () => {
    const datosCreados = {
      tarjetaProfesional: 'MP008',
      tipoDoc: 1,
      numeroDoc: '100003',
      nombre: 'Test',
      apellido: 'User',
      fechaNacimiento: '2000-01-01',
      sexo: 'F',
      especialidad: 'Pediatría',
      email: 'test@clinicaiuker.com',
      telefono: '3000000000',
    };

    const resultado = await request(app.server).post('/api/medicos').send(datosCreados);

    expect(resultado.status).toBe(201);
    expect(resultado.body.mensaje).toBe('El médico se creo correctamente');
    expect(resultado.body.tarjetaProfesional).toBeDefined();
  });

  test('PUT /api/medicos/:tarjeta - Actualizar médico', async () => {
    const resultado = await request(app.server).put('/api/medicos/MP002').send({ email: 'nuevo@correo.com' });

    expect(resultado.status).toBe(200);
    expect(resultado.body.mensaje).toBe('Médico actualizado correctamente');
    expect(resultado.body.medico).toBeDefined();
    expect(resultado.body.medico.email).toBe('nuevo@correo.com');
  });

  test('DELETE /api/medicos/:tarjeta - Eliminar médico', async () => {
    const resultado = await request(app.server).delete('/api/medicos/MP003');

    expect(resultado.status).toBe(200);
    expect(resultado.body.mensaje).toBe('Médico eliminado correctamente');
    expect(resultado.body.tarjetaProfesional).toBe('MP003');
  });
});
