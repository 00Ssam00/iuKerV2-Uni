import { describe, expect, jest, test, beforeAll, afterAll } from '@jest/globals';

process.env.DATABASE_URL = 'postgresql://test:test@localhost/testdb';
process.env.NODE_ENV = 'test';

const tarjetaExistente = 'TP-001';
const tarjetaProfesionalParaTest = 'MP001';

const asignacionesMock = [
  {
    tarjetaProfesionalMedico: tarjetaExistente,
    idConsultorio: 'C101',
    diaSemana: 1,
    inicioJornada: '08:00',
    finJornada: '17:00',
  },
  {
    tarjetaProfesionalMedico: 'TP-002',
    idConsultorio: 'C102',
    diaSemana: 2,
    inicioJornada: '09:00',
    finJornada: '18:00',
  },
];

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/AsignacionMedicoRepositorio.js', () => ({
  AsignacionMedicoRepositorio: jest.fn().mockImplementation(() => ({
    obtenerTodasLasAsignaciones: async () => asignacionesMock,
    crearAsignacion: async () => ({ idAsignacion: 'asig-uuid-001' }),
    existeAsignacion: async () => false,
    consultorioOcupado: async () => false,
    medicoYaTieneAsignacion: jest.fn(),
    eliminarAsignacion: async (_tarjeta: string) => undefined,
  })),
}));

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/MedicosRepositorio', () => ({
  MedicosRepositorio: jest.fn().mockImplementation(() => ({
    crearMedico: jest.fn(),
    listarMedicos: jest.fn(),
    obtenerMedicoPorTarjetaProfesional: async (tarjeta: string) => {
      if (tarjeta === tarjetaProfesionalParaTest) {
        return {
          tarjetaProfesional: tarjetaProfesionalParaTest,
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
      }
      return null;
    },
    actualizarMedico: jest.fn(),
    eliminarMedico: jest.fn(),
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

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/ConsultoriosRepositorio', () => ({
  ConsultorioRepositorio: jest.fn().mockImplementation(() => ({
    listarConsultorios: jest.fn(),
    obtenerConsultorioPorId: async (idConsultorio: string) => {
      if (idConsultorio === 'C101') {
        return { idConsultorio: 'C101', ubicacion: 'Edificio A, Piso 2' };
      }
      return null;
    },
    agregarConsultorio: jest.fn(),
    actualizarConsultorio: jest.fn(),
    eliminarConsultorio: jest.fn(),
  })),
}));

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/CitasMedicasRepositorio.js', () => ({
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

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/clientePostgres', () => ({
  pool: { end: jest.fn() },
  ejecutarConsulta: jest.fn(),
}));

const { default: request } = await import('supertest');
const { app } = await import('../../src/core/infraestructura/app.js');
const { pool } = await import('../../src/core/infraestructura/repositorios/postgres/clientePostgres.js');

describe('Pruebas de integración - Módulo Asignaciones (HU-24)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await pool.end();
  });

  test('GET /api/asignaciones - Retorna todas las asignaciones simuladas', async () => {
    // Act
    const respuesta = await request(app.server).get('/api/asignaciones');

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      asignaciones: asignacionesMock,
    });
    expect(Array.isArray(respuesta.body.asignaciones)).toBe(true);
    expect(respuesta.body.asignaciones).toHaveLength(2);
  });

  // HU-24 — Eliminación de Asignaciones de un Médico a Consultorio
  describe('HU-24 — Eliminar asignación de médico', () => {
    test('DELETE /api/asignaciones/:tarjetaProfesionalMedico - Elimina las asignaciones correctamente', async () => {
      // Act
      const respuesta = await request(app.server)
        .delete(`/api/asignaciones/${tarjetaProfesionalParaTest}`);

      // Assert
      expect(respuesta.status).toBe(200);
      expect(respuesta.body.mensaje).toBe(`Eliminado el medico con id '${tarjetaProfesionalParaTest}'`);
    });

    test('DELETE /api/asignaciones/:tarjetaProfesionalMedico - Acepta cualquier tarjeta sin validar existencia', async () => {
      const tarjetaInexistente = 'MP-NO-EXISTE-999';

      // Act
      const respuesta = await request(app.server)
        .delete(`/api/asignaciones/${tarjetaInexistente}`);

      // Assert
      expect(respuesta.status).toBe(200);
      expect(respuesta.body.mensaje).toBe(`Eliminado el medico con id '${tarjetaInexistente}'`);
    });
  });
});
