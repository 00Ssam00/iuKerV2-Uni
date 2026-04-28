import { describe, expect, jest, test, beforeAll, afterAll } from '@jest/globals';

process.env.DATABASE_URL = 'postgresql://test:test@localhost/testdb';
process.env.NODE_ENV = 'test';

const numeroDocParaTest = '100001';

const pacienteMockData = {
  tipoDocPaciente: 1,
  numeroDocPaciente: numeroDocParaTest,
  nombre: 'Juan',
  apellido: 'Pérez',
  fechaNacimiento: '1990-05-10T00:00:00.000Z',
  sexo: 'M',
  email: 'juan.perez@correo.com',
  telefono: '3001234567',
  direccion: 'Calle 10 # 5-20',
};

jest.unstable_mockModule('../../src/core/infraestructura/repositorios/postgres/PacientesRepositorio', () => ({
  PacientesRepositorio: jest.fn().mockImplementation(() => ({
    obtenerPacientes: jest.fn(),
    existePacientePorDocumento: async () => false,
    obtenerPacientePorId: async (numeroDoc: string) => {
      if (numeroDoc === numeroDocParaTest) return pacienteMockData;
      return null;
    },
    crearPaciente: jest.fn(),
    actualizarPaciente: async (numeroDoc: string, datos: any) => {
      if (numeroDoc === numeroDocParaTest) {
        return { ...pacienteMockData, ...datos };
      }
      return null;
    },
    borrarPaciente: async () => undefined,
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
    eliminarCitasPorPaciente: async () => undefined,
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

describe('Pruebas de integración - Módulo Pacientes (HU-03 y HU-04)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await pool.end();
  });

  // HU-03 — Actualización de Datos del Paciente
  describe('HU-03 — Actualizar paciente', () => {
    test('PUT /api/pacientes/:numeroDoc - Actualiza el paciente correctamente', async () => {
      // Arrange
      const datosActualizacion = {
        nombre: 'Juan Actualizado',
        email: 'juan.nuevo@correo.com',
      };

      // Act
      const respuesta = await request(app.server)
        .put(`/api/pacientes/${numeroDocParaTest}`)
        .send(datosActualizacion);

      // Assert
      expect(respuesta.status).toBe(200);
      expect(respuesta.body.mensaje).toBe('Paciente actualizado satisfactoriamente');
      expect(respuesta.body.pacienteActualizado).toBeDefined();
    });

    test('PUT /api/pacientes/:numeroDoc - Retorna 404 si el paciente no existe', async () => {
      // Arrange
      const numeroDocInexistente = '999999';

      // Act
      const respuesta = await request(app.server)
        .put(`/api/pacientes/${numeroDocInexistente}`)
        .send({ nombre: 'Fantasma' });

      // Assert
      expect(respuesta.status).toBe(404);
      expect(respuesta.body.codigoInterno).toBe('PAC002');
    });
  });

  // HU-04 — Eliminación de Paciente con Cascada de Citas
  describe('HU-04 — Eliminar paciente con cascada', () => {
    test('DELETE /api/pacientes/:numeroDoc - Elimina el paciente y sus citas correctamente', async () => {
      // Act
      const respuesta = await request(app.server)
        .delete(`/api/pacientes/${numeroDocParaTest}`);

      // Assert
      expect(respuesta.status).toBe(200);
      expect(respuesta.body.mensaje).toBe('Paciente borrado correctamente del sistema');
      expect(respuesta.body.numeroDoc).toBe(numeroDocParaTest);
    });

    test('DELETE /api/pacientes/:numeroDoc - Retorna 404 si el paciente no existe', async () => {
      // Arrange
      const numeroDocInexistente = '999999';

      // Act
      const respuesta = await request(app.server)
        .delete(`/api/pacientes/${numeroDocInexistente}`);

      // Assert
      expect(respuesta.status).toBe(404);
      expect(respuesta.body.codigoInterno).toBe('PAC002');
    });
  });
});
