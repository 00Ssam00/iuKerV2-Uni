import { describe, expect, jest, test, beforeAll, afterAll } from '@jest/globals';

process.env.PGHOST = 'localhost';
process.env.PGPORT = '5432';
process.env.PGUSER = 'test';
process.env.PGPASSWORD = 'test';
process.env.PGDBNAME = 'testdb';
process.env.NODE_ENV = 'test';

const tarjetaExistente = 'TP-001';

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
    crearAsignacion: jest.fn(),
    existeAsignacion: jest.fn(),
    consultorioOcupado: jest.fn(),
    medicoYaTieneAsignacion: jest.fn(),
    eliminarAsignacion: async (_tarjeta: string) => undefined,
  })),
}));

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/MedicosRepositorio', () => ({
  MedicosRepositorio: jest.fn().mockImplementation(() => ({
    listarMedicos: jest.fn(),
    obtenerMedicoPorTarjetaProfesional: jest.fn(),
    crearMedico: jest.fn(),
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
    obtenerConsultorioPorId: jest.fn(),
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

describe('Pruebas de integración - Módulo asignaciones', () => {
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

  test('DELETE /api/asignaciones/:tarjetaProfesionalMedico - Elimina la asignación correctamente', async () => {
    // Act
    const respuesta = await request(app.server).delete(`/api/asignaciones/${tarjetaExistente}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      mensaje: `Eliminado el medico con id '${tarjetaExistente}'`,
    });
  });

  test('DELETE /api/asignaciones/:tarjetaProfesionalMedico - Retorna 200 incluso si no existe (sin validación de existencia)', async () => {
    // Arrange
    const tarjetaInexistente = 'TP-999';

    // Act
    const respuesta = await request(app.server).delete(`/api/asignaciones/${tarjetaInexistente}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      mensaje: `Eliminado el medico con id '${tarjetaInexistente}'`,
    });
  });
});
