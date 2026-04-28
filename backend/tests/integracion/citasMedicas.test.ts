import { describe, expect, jest, test, beforeAll, afterAll } from '@jest/globals';

process.env.DATABASE_URL = 'postgresql://test:test@localhost/testdb';
process.env.NODE_ENV = 'test';

const idParaTestearCitas: string = '6e27c176-ed61-4083-888d-876fb4a29055';

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/CitasMedicasRepositorio.js', () => ({
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
    agendarCita: jest.fn(),
    validarDisponibilidadMedico: jest.fn(),
    validarCitasPaciente: jest.fn(),
    validarTurnoMedico: jest.fn(),
    reprogramarCita: jest.fn(),
    cancelarCita: jest.fn(),
    finalizarCita: async (idCita: string) => {
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
          codigoEstadoCita: 4,
          estadoCita: 'Finalizada',
          idCitaAnterior: null,
        };
      }
      return null;
    },
    eliminarCitasPorPaciente: jest.fn(),
    obtenerCitasPorPaciente: jest.fn(),
    eliminarCitasPorMedico: jest.fn(),
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

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/AsignacionMedicoRepositorio', () => ({
  AsignacionMedicoRepositorio: jest.fn().mockImplementation(() => ({
    obtenerAsignaciones: jest.fn(),
    asignarMedico: jest.fn(),
    eliminarAsignacion: jest.fn(),
  })),
}));

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/clientePostgres', () => ({
  pool: { end: jest.fn() },
  ejecutarConsulta: jest.fn(),
}));

const { default: request } = await import('supertest');
const { app } = await import('../../src/core/infraestructura/app.js');
const { pool } = await import('../../src/core/infraestructura/repositorios/postgres/clientePostgres.js');

describe('Pruebas de integración - Módulo citas medicas', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await pool.end();
  });

  test('GET /api/citas-medicas - Retorna todas la citas medicas simuladas', async () => {
    // Act
    const respuesta = await request(app.server).get('/api/citas-medicas');

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      cantidadCitas: respuesta.body.cantidadCitas,
      citasEncontradas: respuesta.body.citasEncontradas,
    });
  });

  test('GET /api/citas-medicas/:idCita - Retorna una cita médica específica simulada', async () => {
    // Arrange
    const idCita = idParaTestearCitas;

    // Act
    const respuesta = await request(app.server).get(`/api/citas-medicas/${idCita}`);

    // Assert
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
    // Arrange
    const idCitaFalso = 'f5581292-15c1-4d8a-9295-46f72df39b79';

    // Act
    const respuesta = await request(app.server).get(`/api/citas-medicas/${idCitaFalso}`);

    // Assert
    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual({
      mensaje: 'La cita solicita no existe en el sistema',
      codigoInterno: 'CITA001',
    });
  });

  test('DELETE /api/citas-medicas/eliminacion/:idCita - Elimina la cita correctamente', async () => {
    // Arrange
    const idCita = idParaTestearCitas;

    // Act
    const respuesta = await request(app.server).delete(`/api/citas-medicas/eliminacion/${idCita}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      mensaje: 'Cita eliminada correctamente',
      idCita: idParaTestearCitas,
    });
  });

  test('DELETE /api/citas-medicas/eliminacion/:idCita - Retorna 404 como error si no existe', async () => {
    // Arrange
    const idCita = 'bdea6188-4636-4c98-aae6-5df366aba1ab';

    // Act
    const respuesta = await request(app.server).delete(`/api/citas-medicas/eliminacion/${idCita}`);

    // Assert
    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual({
      mensaje: 'La cita solicita no existe en el sistema',
      codigoInterno: 'CITA001',
    });
  });

  // HU-11 — Finalización de Cita Médica con Control de Estado
  test('PUT /api/citas-medicas/finalizacion/:idCita - Finaliza la cita correctamente', async () => {
    // Arrange
    const idCita = idParaTestearCitas;

    // Act
    const respuesta = await request(app.server).put(`/api/citas-medicas/finalizacion/${idCita}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.mensaje).toBe('Cita finalizada correctamente');
    expect(respuesta.body.citaFinalizada).toBeDefined();
    expect(respuesta.body.citaFinalizada.codigoEstadoCita).toBe(4);
    expect(respuesta.body.citaFinalizada.estadoCita).toBe('Finalizada');
  });

  test('PUT /api/citas-medicas/finalizacion/:idCita - Retorna 500 si la cita no existe', async () => {
    // Arrange
    const idCitaInexistente = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

    // Act
    const respuesta = await request(app.server).put(`/api/citas-medicas/finalizacion/${idCitaInexistente}`);

    // Assert
    expect(respuesta.status).toBe(500);
    expect(respuesta.body.mensaje).toBe('Fallo interno en el servidor.');
  });
});
