import { describe, it, expect, beforeEach, afterEach, jest as jestImport } from '@jest/globals';
import { CancelacionReprogramacionCitasCasosUso } from '../../../src/core/aplicacion/servicios/cancelacionReprogramacionCita/CancelacionReprogramacionCitasCasosUso.js';
import { ICitasMedicasRepositorio } from '../../../src/core/dominio/citaMedica/ICitasMedicasRepositorio.js';
import { IMedicosRepositorio } from '../../../src/core/dominio/medico/IMedicosRepositorio.js';
import { CitaMedicaRespuestaDTO } from '../../../src/core/infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';
import { citaMedicaSolicitudDTO } from '../../../src/core/infraestructura/esquemas/citaMedicaEsquema.js';
import { estadoCita } from '../../../src/common/estadoCita.enum.js';
import { MedicoRepuestaDTO } from '../../../src/core/infraestructura/repositorios/postgres/dtos/MedicoRespuestaDTO.js';

describe('CancelacionReprogramacionCitasCasosUso', () => {
  let casosUso: CancelacionReprogramacionCitasCasosUso;
  let mockCitasRepo: jest.Mocked<ICitasMedicasRepositorio>;
  let mockMedicosRepo: jest.Mocked<IMedicosRepositorio>;

  // Datos de prueba reutilizables
  const citaMock: CitaMedicaRespuestaDTO = {
    idCita: '976f511c-a2a6-4aa7-9089-641f6fbe20b3',
    paciente: 'Juan Pérez',
    tipoDocPaciente: 'Cédula',
    numeroDocPaciente: '100001',
    medico: 'Dr. Carlos Rodríguez',
    ubicacion: 'Edificio A, Piso 2',
    consultorio: 'C101',
    fecha: '2025-12-01T00:00:00.000Z',
    horaInicio: '10:00:00',
    codigoEstadoCita: estadoCita.ACTIVADA,
    estadoCita: 'Activa',
    idCitaAnterior: null,
  };

  const medicoMock: MedicoRepuestaDTO = {
    tarjetaProfesional: 'MED123',
    tipoDoc: 'Carlos',
    numeroDoc: 'Rodríguez',
    nombre: 'Cédula',
    apellido: '123456789',
    fechaNacimiento: '2025-12-01',
    sexo: 'F',
    especialidad: 'Medicina General',
    email: 'carlos@example.com',
    telefono: '3001234567',
  };

  const nuevosDatosMock: citaMedicaSolicitudDTO = {
    medico: 'MED123',
    tipoDocPaciente: 1,
    numeroDocPaciente: '100001',
    fecha: '2025-12-15',
    horaInicio: '14:00',
  };

  beforeEach(() => {
    // Crear mocks de los repositorios
    mockCitasRepo = {
      obtenerCitas: jestImport.fn() as any,
      obtenerCitaPorId: jestImport.fn() as any,
      agendarCita: jestImport.fn() as any,
      eliminarCita: jestImport.fn() as any,
      validarDisponibilidadMedico: jestImport.fn() as any,
      validarCitasPaciente: jestImport.fn() as any,
      validarTurnoMedico: jestImport.fn() as any,
      reprogramarCita: jestImport.fn() as any,
      cancelarCita: jestImport.fn() as any,
      finalizarCita: jestImport.fn() as any,
      eliminarCitasPorPaciente: jestImport.fn() as any,
      obtenerCitasPorPaciente: jestImport.fn() as any,
      eliminarCitasPorMedico: jestImport.fn() as any,
    } as jest.Mocked<ICitasMedicasRepositorio>;

    mockMedicosRepo = {
      crearMedico: jestImport.fn() as any,
      listarMedicos: jestImport.fn() as any,
      obtenerMedicoPorTarjetaProfesional: jestImport.fn() as any,
      actualizarMedico: jestImport.fn() as any,
      eliminarMedico: jestImport.fn() as any,
    } as jest.Mocked<IMedicosRepositorio>;

    casosUso = new CancelacionReprogramacionCitasCasosUso(
      mockCitasRepo,
      mockMedicosRepo
    );

    // Mockear console.log para evitar salida en tests
    jestImport.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jestImport.clearAllMocks();
  });

  describe('cancelarCita', () => {
    it('debería cancelar una cita activa exitosamente', async () => {
      // Arrange
      const citaCancelada = { ...citaMock, codigoEstadoCita: estadoCita.CANCELADA };
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaMock);
      (mockCitasRepo.cancelarCita as jest.Mock).mockResolvedValue(citaCancelada);

      // Act
      const resultado = await casosUso.cancelarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3');

      // Assert
      expect(mockCitasRepo.obtenerCitaPorId).toHaveBeenCalledWith('976f511c-a2a6-4aa7-9089-641f6fbe20b3');
      expect(mockCitasRepo.cancelarCita).toHaveBeenCalledWith('976f511c-a2a6-4aa7-9089-641f6fbe20b3');
      expect(resultado).toEqual(citaCancelada);
    });

    it('debería lanzar error si la cita no existe', async () => {
      // Arrange
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(casosUso.cancelarCita('cita-999')).rejects.toThrow();
      expect(mockCitasRepo.obtenerCitaPorId).toHaveBeenCalledWith('cita-999');
      expect(mockCitasRepo.cancelarCita).not.toHaveBeenCalled();
    });

    it('debería lanzar error si la cita ya está cancelada', async () => {
      // Arrange
      const citaCancelada = { ...citaMock, codigoEstadoCita: estadoCita.CANCELADA };
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaCancelada);

      // Act & Assert
      await expect(casosUso.cancelarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3')).rejects.toThrow();
      expect(mockCitasRepo.cancelarCita).not.toHaveBeenCalled();
    });

    it('debería lanzar error si la cita ya está finalizada', async () => {
      // Arrange
      const citaFinalizada = { ...citaMock, codigoEstadoCita: estadoCita.FINALIZADA };
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaFinalizada);

      // Act & Assert
      await expect(casosUso.cancelarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3')).rejects.toThrow();
      expect(mockCitasRepo.cancelarCita).not.toHaveBeenCalled();
    });

    it('debería verificar la existencia de la cita antes de cancelar', async () => {
      // Arrange
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaMock);
      (mockCitasRepo.cancelarCita as jest.Mock).mockResolvedValue({ ...citaMock, codigoEstadoCita: estadoCita.CANCELADA });

      // Act
      await casosUso.cancelarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3');

      // Assert Verificar que se llamó en el orden correcto
      const ordenObtener = (mockCitasRepo.obtenerCitaPorId as jest.Mock).mock.invocationCallOrder[0];
      const ordenCancelar = (mockCitasRepo.cancelarCita as jest.Mock).mock.invocationCallOrder[0];
      expect(ordenObtener).toBeLessThan(ordenCancelar);
    });
  });

  describe('reprogramarCita', () => {
    it('debería reprogramar una cita activa exitosamente', async () => {
      // Arrange
      const citaReprogramada = {
        ...citaMock,
        fecha: '2025-12-15T00:00:00.000Z',
        horaInicio: '14:00:00',
        codigoEstadoCita: estadoCita.ACTIVADA
      };

      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaMock);
      (mockMedicosRepo.obtenerMedicoPorTarjetaProfesional as jest.Mock).mockResolvedValue(medicoMock);
      (mockCitasRepo.validarTurnoMedico as jest.Mock).mockResolvedValue(true);
      (mockCitasRepo.validarCitasPaciente as jest.Mock).mockResolvedValue(false);
      (mockCitasRepo.validarDisponibilidadMedico as jest.Mock).mockResolvedValue(false);
      (mockCitasRepo.reprogramarCita as jest.Mock).mockResolvedValue(citaReprogramada);

      // Act
      const resultado = await casosUso.reprogramarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3', nuevosDatosMock);

      // Assert
      expect(mockCitasRepo.obtenerCitaPorId).toHaveBeenCalledWith('976f511c-a2a6-4aa7-9089-641f6fbe20b3');
      expect(mockMedicosRepo.obtenerMedicoPorTarjetaProfesional).toHaveBeenCalledWith('MED123');
      expect(mockCitasRepo.validarTurnoMedico).toHaveBeenCalledWith('MED123', '2025-12-15', '14:00');
      expect(mockCitasRepo.validarCitasPaciente).toHaveBeenCalledWith(1, '100001', '2025-12-15', '14:00', '976f511c-a2a6-4aa7-9089-641f6fbe20b3');
      expect(mockCitasRepo.validarDisponibilidadMedico).toHaveBeenCalledWith('MED123', '2025-12-15', '14:00', '976f511c-a2a6-4aa7-9089-641f6fbe20b3');
      expect(mockCitasRepo.reprogramarCita).toHaveBeenCalled();
      expect(resultado).toEqual(citaReprogramada);
    });

    it('debería lanzar error si la cita a reprogramar no existe', async () => {
      // Arrange
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(casosUso.reprogramarCita('cita-999', nuevosDatosMock)).rejects.toThrow();
      expect(mockCitasRepo.reprogramarCita).not.toHaveBeenCalled();
    });

    it('debería lanzar error si se intenta reprogramar para una fecha en el pasado', async () => {
      // Arrange
      const datosPasado = { ...nuevosDatosMock, fecha: '2020-01-01', horaInicio: '10:00' };
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaMock);

      // Act & Assert
      await expect(casosUso.reprogramarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3', datosPasado)).rejects.toThrow();
    });

    it('debería lanzar error si la cita está cancelada', async () => {
      // Arrange
      const citaCancelada = { ...citaMock, codigoEstadoCita: estadoCita.CANCELADA };
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaCancelada);

      // Act & Assert
      await expect(casosUso.reprogramarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3', nuevosDatosMock)).rejects.toThrow();
    });

    it('debería lanzar error si la cita está finalizada', async () => {
      // Arrange
      const citaFinalizada = { ...citaMock, codigoEstadoCita: estadoCita.FINALIZADA };
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaFinalizada);

      // Act & Assert
      await expect(casosUso.reprogramarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3', nuevosDatosMock)).rejects.toThrow();
    });

    it('debería lanzar error si el médico no existe', async () => {
      // Arrange
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaMock);
      (mockMedicosRepo.obtenerMedicoPorTarjetaProfesional as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(casosUso.reprogramarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3', nuevosDatosMock)).rejects.toThrow();
      expect(mockCitasRepo.reprogramarCita).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el médico no tiene turno disponible', async () => {
      // Arrange
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaMock);
      (mockMedicosRepo.obtenerMedicoPorTarjetaProfesional as jest.Mock).mockResolvedValue(medicoMock);
      (mockCitasRepo.validarTurnoMedico as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(casosUso.reprogramarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3', nuevosDatosMock)).rejects.toThrow();
      expect(mockCitasRepo.reprogramarCita).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el paciente tiene otra cita en el mismo horario', async () => {
      // Arrange
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaMock);
      (mockMedicosRepo.obtenerMedicoPorTarjetaProfesional as jest.Mock).mockResolvedValue(medicoMock);
      (mockCitasRepo.validarTurnoMedico as jest.Mock).mockResolvedValue(true);
      (mockCitasRepo.validarCitasPaciente as jest.Mock).mockResolvedValue(true); // Traslape

      // Act & Assert
      await expect(casosUso.reprogramarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3', nuevosDatosMock)).rejects.toThrow();
      expect(mockCitasRepo.reprogramarCita).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el médico tiene otra cita en el mismo horario', async () => {
      // Arrange
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaMock);
      (mockMedicosRepo.obtenerMedicoPorTarjetaProfesional as jest.Mock).mockResolvedValue(medicoMock);
      (mockCitasRepo.validarTurnoMedico as jest.Mock).mockResolvedValue(true);
      (mockCitasRepo.validarCitasPaciente as jest.Mock).mockResolvedValue(false);
      (mockCitasRepo.validarDisponibilidadMedico as jest.Mock).mockResolvedValue(true); // Traslape

      // Act & Assert
      await expect(casosUso.reprogramarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3', nuevosDatosMock)).rejects.toThrow();
      expect(mockCitasRepo.reprogramarCita).not.toHaveBeenCalled();
    });

    it('debería pasar el ID de la cita actual para excluirla de las validaciones de traslape', async () => {
      // Arrange
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaMock);
      (mockMedicosRepo.obtenerMedicoPorTarjetaProfesional as jest.Mock).mockResolvedValue(medicoMock);
      (mockCitasRepo.validarTurnoMedico as jest.Mock).mockResolvedValue(true);
      (mockCitasRepo.validarCitasPaciente as jest.Mock).mockResolvedValue(false);
      (mockCitasRepo.validarDisponibilidadMedico as jest.Mock).mockResolvedValue(false);
      (mockCitasRepo.reprogramarCita as jest.Mock).mockResolvedValue(citaMock);

      // Act
      await casosUso.reprogramarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3', nuevosDatosMock);

      // Assert Verificar que se pasa el ID para excluir la cita actual
      expect(mockCitasRepo.validarCitasPaciente).toHaveBeenCalledWith(
        1, '100001', '2025-12-15', '14:00', '976f511c-a2a6-4aa7-9089-641f6fbe20b3'
      );
      expect(mockCitasRepo.validarDisponibilidadMedico).toHaveBeenCalledWith(
        'MED123', '2025-12-15', '14:00', '976f511c-a2a6-4aa7-9089-641f6fbe20b3'
      );
    });

    it('debería crear la nueva cita con estado ACTIVADA', async () => {
      // Arrange
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaMock);
      (mockMedicosRepo.obtenerMedicoPorTarjetaProfesional as jest.Mock).mockResolvedValue(medicoMock);
      (mockCitasRepo.validarTurnoMedico as jest.Mock).mockResolvedValue(true);
      (mockCitasRepo.validarCitasPaciente as jest.Mock).mockResolvedValue(false);
      (mockCitasRepo.validarDisponibilidadMedico as jest.Mock).mockResolvedValue(false);
      (mockCitasRepo.reprogramarCita as jest.Mock).mockResolvedValue(citaMock);

      // Act
      await casosUso.reprogramarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3', nuevosDatosMock);

      // Assert
      expect(mockCitasRepo.reprogramarCita).toHaveBeenCalledWith(
        '976f511c-a2a6-4aa7-9089-641f6fbe20b3',
        expect.objectContaining({
          estado: estadoCita.ACTIVADA,
          idCitaAnterior: '976f511c-a2a6-4aa7-9089-641f6fbe20b3',
        })
      );
    });
  });

  describe('finalizarCita', () => {
    it('debería finalizar una cita activa exitosamente', async () => {
      // Arrange
      const citaFinalizada = { ...citaMock, codigoEstadoCita: estadoCita.FINALIZADA };
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaMock);
      (mockCitasRepo.finalizarCita as jest.Mock).mockResolvedValue(citaFinalizada);

      // Act
      const resultado = await casosUso.finalizarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3');

      // Assert
      expect(mockCitasRepo.obtenerCitaPorId).toHaveBeenCalledWith('976f511c-a2a6-4aa7-9089-641f6fbe20b3');
      expect(mockCitasRepo.finalizarCita).toHaveBeenCalledWith('976f511c-a2a6-4aa7-9089-641f6fbe20b3');
      expect(resultado).toEqual(citaFinalizada);
    });

    it('debería lanzar error si la cita no existe', async () => {
      // Arrange
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(casosUso.finalizarCita('cita-999')).rejects.toThrow();
      expect(mockCitasRepo.finalizarCita).not.toHaveBeenCalled();
    });

    it('debería lanzar error si la cita está reprogramada', async () => {
      // Arrange
      const citaReprogramada = { ...citaMock, codigoEstadoCita: estadoCita.REPROGRAMADA };
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaReprogramada);

      // Act & Assert
      await expect(casosUso.finalizarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3')).rejects.toThrow();
      expect(mockCitasRepo.finalizarCita).not.toHaveBeenCalled();
    });

    it('debería lanzar error si la cita ya está cancelada', async () => {
      // Arrange
      const citaCancelada = { ...citaMock, codigoEstadoCita: estadoCita.CANCELADA };
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaCancelada);

      // Act & Assert
      await expect(casosUso.finalizarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3')).rejects.toThrow();
      expect(mockCitasRepo.finalizarCita).not.toHaveBeenCalled();
    });

    it('debería lanzar error si la cita ya está finalizada', async () => {
      // Arrange
      const citaFinalizada = { ...citaMock, codigoEstadoCita: estadoCita.FINALIZADA };
      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaFinalizada);

      // Act & Assert
      await expect(casosUso.finalizarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3')).rejects.toThrow();
      expect(mockCitasRepo.finalizarCita).not.toHaveBeenCalled();
    });

    it('debería verificar el estado de la cita antes de finalizar', async () => {
      // Arrange
      const ordenDeLlamadas: string[] = [];

      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockImplementation(async () => {
        ordenDeLlamadas.push('obtener');
        return citaMock;
      });

      (mockCitasRepo.finalizarCita as jest.Mock).mockImplementation(async () => {
        ordenDeLlamadas.push('finalizar');
        return { ...citaMock, codigoEstadoCita: estadoCita.FINALIZADA };
      });

      // Act
      await casosUso.finalizarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3');

      // Assert
      expect(ordenDeLlamadas).toEqual(['obtener', 'finalizar']);
    });
  });

  describe('Casos de borde y validaciones', () => {
    it('debería manejar correctamente fechas límite (hoy)', async () => {
      // Arrange
      const hoy = new Date();
      const fechaHoy = hoy.toISOString().split('T')[0];
      const datosFuturoInmediato = { ...nuevosDatosMock, fecha: fechaHoy, horaInicio: '23:59' };

      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockResolvedValue(citaMock);
      (mockMedicosRepo.obtenerMedicoPorTarjetaProfesional as jest.Mock).mockResolvedValue(medicoMock);
      (mockCitasRepo.validarTurnoMedico as jest.Mock).mockResolvedValue(true);
      (mockCitasRepo.validarCitasPaciente as jest.Mock).mockResolvedValue(false);
      (mockCitasRepo.validarDisponibilidadMedico as jest.Mock).mockResolvedValue(false);
      (mockCitasRepo.reprogramarCita as jest.Mock).mockResolvedValue(citaMock);

      // Act & Assert No debería lanzar error si la hora es futura
      await expect(casosUso.reprogramarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3', datosFuturoInmediato)).resolves.toBeDefined();
    });

    it('debería realizar todas las validaciones en el orden correcto al reprogramar', async () => {
      // Arrange
      const ordenValidaciones: string[] = [];

      (mockCitasRepo.obtenerCitaPorId as jest.Mock).mockImplementation(async () => {
        ordenValidaciones.push('1-obtenerCita');
        return citaMock;
      });

      (mockMedicosRepo.obtenerMedicoPorTarjetaProfesional as jest.Mock).mockImplementation(async () => {
        ordenValidaciones.push('2-verificarMedico');
        return medicoMock;
      });

      (mockCitasRepo.validarTurnoMedico as jest.Mock).mockImplementation(async () => {
        ordenValidaciones.push('3-validarTurno');
        return true;
      });

      (mockCitasRepo.validarCitasPaciente as jest.Mock).mockImplementation(async () => {
        ordenValidaciones.push('4-validarPaciente');
        return false;
      });

      (mockCitasRepo.validarDisponibilidadMedico as jest.Mock).mockImplementation(async () => {
        ordenValidaciones.push('5-validarDisponibilidad');
        return false;
      });

      (mockCitasRepo.reprogramarCita as jest.Mock).mockImplementation(async () => {
        ordenValidaciones.push('6-reprogramar');
        return citaMock;
      });

      // Act
      await casosUso.reprogramarCita('976f511c-a2a6-4aa7-9089-641f6fbe20b3', nuevosDatosMock);

      // Assert
      expect(ordenValidaciones).toEqual([
        '1-obtenerCita',
        '2-verificarMedico',
        '3-validarTurno',
        '4-validarPaciente',
        '5-validarDisponibilidad',
        '6-reprogramar',
      ]);
    });
  });
});