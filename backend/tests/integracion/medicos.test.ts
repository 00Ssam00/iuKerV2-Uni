import request from 'supertest';
import { MedicoSolicitudDTO } from '../../src/core/infraestructura/esquemas/medicoEsquema.js';
import { IMedico } from '../../src/core/dominio/medico/IMedico.ts';
import { describe, expect, jest, test } from '@jest/globals';

process.env.PGHOST = 'localhost';
process.env.PGPORT = '5432';
process.env.PGUSER = 'test';
process.env.PGPASSWORD = 'test';
process.env.PGDBNAME = 'testdb';
process.env.NODE_ENV = 'test';

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/MedicosRepositorio', () => ({
  MedicosRepositorio: jest.fn().mockImplementation(() => ({
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
    crearMedico: async (datosMedico: MedicoSolicitudDTO) => ({
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
    }),
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
    eliminarMedico: async (tarjetaProfesional: string) => ({ tarjetaProfesional }),
  })),
}));

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/AsignacionMedicoRepositorio', () => ({
  AsignacionMedicoRepositorio: jest.fn().mockImplementation(() => ({
    obtenerAsignaciones: jest.fn(),
    asignarMedico: jest.fn(),
    eliminarAsignacion: jest.fn(),
  })),
}));

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/CitasMedicasRepositorio', () => ({
  CitasMedicasRepositorio: jest.fn().mockImplementation(() => ({
    obtenerCitas: jest.fn(),
    obtenerCitaPorId: jest.fn(),
    agendarCita: jest.fn(),
    eliminarCita: jest.fn(),
    validarDisponibilidadMedico: jest.fn(),
    validarCitasPaciente: jest.fn(),
    validarTurnoMedico: jest.fn(),
    reprogramarCita: jest.fn(),
    cancelarCita: jest.fn(),
    finalizarCita: jest.fn(),
    eliminarCitasPorPaciente: jest.fn(),
    obtenerCitasPorPaciente: jest.fn(),
    eliminarCitasPorMedico: jest.fn(),
  })),
}));

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/ConsultoriosRepositorio', () => ({
  ConsultorioRepositorio: jest.fn().mockImplementation(() => ({
    listarConsultorios: jest.fn(),
    obtenerConsultorioPorId: jest.fn(),
    agregarConsultorio: jest.fn(),
    actualizarConsultorio: jest.fn(),
    eliminarConsultorio: jest.fn(),
  })),
}));

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/PacientesRepositorio', () => ({
  PacientesRepositorio: jest.fn().mockImplementation(() => ({
    obtenerPacientes: jest.fn(),
    obtenerPacientePorId: jest.fn(),
    crearPaciente: jest.fn(),
    actualizarPaciente: jest.fn(),
    borrarPaciente: jest.fn(),
    existePacientePorDocumento: jest.fn(),
  })),
}));

const { app } = await import('../../src/core/infraestructura/app.js');

describe('Pruebas de Integración para la entidad Médico', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    jest.resetAllMocks();
  });

  test('GET /api/medicos - Lista todos los médicos', async () => {
    // Act
    const resultado = await request(app.server).get('/api/medicos');

    // Assert
    expect(resultado.status).toBe(200);
    expect(resultado.body.mensaje).toBe('Médicos encontrados correctamente');
    expect(Array.isArray(resultado.body.medicos)).toBe(true);
    expect(resultado.body.cantidad).toBeDefined();
  });

  test('GET /api/medicos/:tarjetaProfesional - Retorna información del médico', async () => {
    // Act
    const resultado = await request(app.server).get('/api/medicos/MP002');

    // Assert
    expect(resultado.status).toBe(200);
    expect(resultado.body.mensaje).toBe('Médico encontrado correctamente');
    expect(resultado.body.medico).toBeTruthy();
    expect(resultado.body.medico?.tarjetaProfesional).toBe('MP002');
  });

  test('POST /api/medicos - Crear médico', async () => {
    // Arrange
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

    // Act
    const resultado = await request(app.server).post('/api/medicos').send(datosCreados);

    // Assert
    expect(resultado.status).toBe(201);
    expect(resultado.body.mensaje).toBe('El médico se creo correctamente');
    expect(resultado.body.tarjetaProfesional).toBeDefined();
  });

  test('PUT /api/medicos/:tarjeta - Actualizar médico', async () => {
    // Act
    const resultado = await request(app.server).put('/api/medicos/MP002').send({ email: 'nuevo@correo.com' });

    // Assert
    expect(resultado.status).toBe(200);
    expect(resultado.body.mensaje).toBe('Médico actualizado correctamente');
    expect(resultado.body.medico).toBeDefined();
    expect(resultado.body.medico.email).toBe('nuevo@correo.com');
  });

  test('DELETE /api/medicos/:tarjeta - Eliminar médico', async () => {
    // Act
    const resultado = await request(app.server).delete('/api/medicos/MP003');

    // Assert
    expect(resultado.status).toBe(200);
    expect(resultado.body.mensaje).toBe('Médico eliminado correctamente');
    expect(resultado.body.tarjetaProfesional).toBe('MP003');
  });
});
