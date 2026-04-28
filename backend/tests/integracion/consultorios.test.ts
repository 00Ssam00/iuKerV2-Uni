import { describe, expect, jest, test, beforeAll, afterAll } from '@jest/globals';

process.env.DATABASE_URL = 'postgresql://test:test@localhost/testdb';
process.env.NODE_ENV = 'test';

const idConsultorioParaTest = 'C101';

const consultorioMockData = {
  idConsultorio: idConsultorioParaTest,
  ubicacion: 'Edificio A, Piso 2',
};

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/ConsultoriosRepositorio', () => ({
  ConsultorioRepositorio: jest.fn().mockImplementation(() => ({
    listarConsultorios: jest.fn(),
    obtenerConsultorioPorId: async (idConsultorio: string) => {
      if (idConsultorio === idConsultorioParaTest) return consultorioMockData;
      return null;
    },
    agregarConsultorio: jest.fn(),
    actualizarConsultorio: jest.fn(),
    eliminarConsultorio: async () => undefined,
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

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/MedicosRepositorio', () => ({
  MedicosRepositorio: jest.fn().mockImplementation(() => ({
    crearMedico: jest.fn(),
    listarMedicos: jest.fn(),
    obtenerMedicoPorTarjetaProfesional: jest.fn(),
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

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/AsignacionMedicoRepositorio', () => ({
  AsignacionMedicoRepositorio: jest.fn().mockImplementation(() => ({
    crearAsignacion: jest.fn(),
    existeAsignacion: jest.fn(),
    consultorioOcupado: jest.fn(),
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

describe('Pruebas de integración - Módulo Consultorios (HU-22)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await pool.end();
  });

  // HU-22 — Eliminación de Consultorio del Sistema
  describe('HU-22 — Eliminar consultorio', () => {
    test('DELETE /api/consultorios/:idConsultorio - Elimina el consultorio correctamente', async () => {
      // Act
      const respuesta = await request(app.server)
        .delete(`/api/consultorios/${idConsultorioParaTest}`);

      // Assert
      expect(respuesta.status).toBe(200);
      expect(respuesta.body.mensaje).toBe('Consultorio eliminado correctamente');
      expect(respuesta.body.idConsultorio).toBe(idConsultorioParaTest);
    });

    test('DELETE /api/consultorios/:idConsultorio - Retorna 404 si el consultorio no existe', async () => {
      // Arrange
      const idInexistente = 'C999';

      // Act
      const respuesta = await request(app.server)
        .delete(`/api/consultorios/${idInexistente}`);

      // Assert
      expect(respuesta.status).toBe(404);
      expect(respuesta.body.codigoInterno).toBe('CONS001');
    });
  });
});
