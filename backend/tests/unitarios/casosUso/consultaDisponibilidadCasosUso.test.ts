import { describe, expect, beforeEach, afterEach, jest, test } from '@jest/globals';
import { ConsultaDisponibilidadCasosUso } from '../../../src/core/aplicacion/servicios/consultaDisponibilidad/ConsultaDisponibilidadCasosUso.js';
import { ICitasMedicasRepositorio } from '../../../src/core/dominio/citaMedica/ICitasMedicasRepositorio.js';
import { IMedicosRepositorio } from '../../../src/core/dominio/medico/IMedicosRepositorio.js';

describe('ConsultaDisponibilidadCasosUso', () => {
  let citasRepoMock: jest.Mocked<ICitasMedicasRepositorio>;
  let medicosRepoMock: jest.Mocked<IMedicosRepositorio>;
  let servicio: ConsultaDisponibilidadCasosUso;

  beforeEach(() => {
    citasRepoMock = {
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
      obtenerSlotsOcupados: jest.fn(),
      obtenerJornadasMedico: jest.fn(),
      obtenerJornadasPorMedico: jest.fn(),
    };

    medicosRepoMock = {
      obtenerMedicoPorTarjetaProfesional: jest.fn(),
      actualizarMedico: jest.fn(),
      crearMedico: jest.fn(),
      eliminarMedico: jest.fn(),
      listarMedicos: jest.fn(),
    };

    servicio = new ConsultaDisponibilidadCasosUso(citasRepoMock, medicosRepoMock);
  });

  describe('obtenerDisponibilidad', () => {
    test('retorna slots disponibles y ocupados correctamente', async () => {
      // Arrange — lunes 2026-05-04
      citasRepoMock.obtenerJornadasMedico.mockResolvedValue([
        { inicioJornada: '08:00', finJornada: '10:00' },
      ]);
      citasRepoMock.obtenerSlotsOcupados.mockResolvedValue(['08:30']);

      // Act
      const resultado = await servicio.obtenerDisponibilidad('MP001', '2026-05-04');

      // Assert
      expect(resultado.slotsDisponibles).toEqual(['08:00', '09:00', '09:30']);
      expect(resultado.slotsOcupados).toEqual(['08:30']);
      expect(resultado.jornadas).toEqual([{ inicioJornada: '08:00', finJornada: '10:00' }]);
    });

    test('llama al repositorio con diaSemana=1 para un lunes', async () => {
      // Arrange — 2026-05-04 es lunes: getDay()=1 → diaSemana=1
      citasRepoMock.obtenerJornadasMedico.mockResolvedValue([]);
      citasRepoMock.obtenerSlotsOcupados.mockResolvedValue([]);

      // Act
      await servicio.obtenerDisponibilidad('MP001', '2026-05-04');

      // Assert
      expect(citasRepoMock.obtenerJornadasMedico).toHaveBeenCalledWith('MP001', 1);
    });

    test('mapea correctamente el domingo: getDay()=0 → diaSemana=7', async () => {
      // Arrange — 2026-05-03 es domingo
      citasRepoMock.obtenerJornadasMedico.mockResolvedValue([]);
      citasRepoMock.obtenerSlotsOcupados.mockResolvedValue([]);

      // Act
      await servicio.obtenerDisponibilidad('MP001', '2026-05-03');

      // Assert
      expect(citasRepoMock.obtenerJornadasMedico).toHaveBeenCalledWith('MP001', 7);
    });

    test('retorna todos los slots como disponibles cuando no hay citas ocupadas', async () => {
      // Arrange
      citasRepoMock.obtenerJornadasMedico.mockResolvedValue([
        { inicioJornada: '14:00', finJornada: '16:00' },
      ]);
      citasRepoMock.obtenerSlotsOcupados.mockResolvedValue([]);

      // Act
      const resultado = await servicio.obtenerDisponibilidad('MP002', '2026-05-04');

      // Assert
      expect(resultado.slotsDisponibles).toEqual(['14:00', '14:30', '15:00', '15:30']);
      expect(resultado.slotsOcupados).toEqual([]);
    });

    test('retorna listas vacías cuando el médico no tiene jornada ese día', async () => {
      // Arrange
      citasRepoMock.obtenerJornadasMedico.mockResolvedValue([]);
      citasRepoMock.obtenerSlotsOcupados.mockResolvedValue([]);

      // Act
      const resultado = await servicio.obtenerDisponibilidad('MP001', '2026-05-04');

      // Assert
      expect(resultado.slotsDisponibles).toEqual([]);
      expect(resultado.slotsOcupados).toEqual([]);
    });
  });

  describe('obtenerProximoDisponible', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    test('retorna null cuando no hay médicos en el sistema', async () => {
      // Arrange
      medicosRepoMock.listarMedicos.mockResolvedValue([]);

      // Act
      const resultado = await servicio.obtenerProximoDisponible();

      // Assert
      expect(resultado).toBeNull();
    });

    test('retorna null cuando los médicos no tienen jornadas asignadas', async () => {
      // Arrange
      medicosRepoMock.listarMedicos.mockResolvedValue([{ tarjetaProfesional: 'MP001' } as any]);
      citasRepoMock.obtenerJornadasPorMedico.mockResolvedValue([]);

      // Act
      const resultado = await servicio.obtenerProximoDisponible();

      // Assert
      expect(resultado).toBeNull();
    });

    test('retorna el primer slot disponible con formato correcto', async () => {
      // Arrange — fijar hora actual: lunes 2026-05-04 08:00 Colombia (UTC-5)
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-05-04T08:00:00-05:00'));

      medicosRepoMock.listarMedicos.mockResolvedValue([{ tarjetaProfesional: 'MP001' } as any]);
      citasRepoMock.obtenerJornadasPorMedico.mockResolvedValue([
        { diaSemana: 1, inicioJornada: '09:00', finJornada: '10:00' },
      ]);
      citasRepoMock.obtenerSlotsOcupados.mockResolvedValue([]);

      // Act
      const resultado = await servicio.obtenerProximoDisponible();

      // Assert
      expect(resultado).not.toBeNull();
      expect(resultado!.medico).toBe('MP001');
      expect(resultado!.fecha).toBe('2026-05-04');
      expect(resultado!.horaInicio).toBe('09:00');
    });

    test('omite slots ya ocupados y retorna el siguiente libre', async () => {
      // Arrange — lunes 2026-05-04 08:00 Colombia
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-05-04T08:00:00-05:00'));

      medicosRepoMock.listarMedicos.mockResolvedValue([{ tarjetaProfesional: 'MP001' } as any]);
      citasRepoMock.obtenerJornadasPorMedico.mockResolvedValue([
        { diaSemana: 1, inicioJornada: '09:00', finJornada: '11:00' },
      ]);
      citasRepoMock.obtenerSlotsOcupados.mockResolvedValue(['09:00', '09:30']);

      // Act
      const resultado = await servicio.obtenerProximoDisponible();

      // Assert
      expect(resultado!.horaInicio).toBe('10:00');
    });
  });

  describe('obtenerHorarioMedico', () => {
    test('delega al repositorio y retorna el horario semanal completo', async () => {
      // Arrange
      const horarioEsperado = [
        { diaSemana: 1, inicioJornada: '08:00', finJornada: '12:00' },
        { diaSemana: 3, inicioJornada: '14:00', finJornada: '18:00' },
      ];
      citasRepoMock.obtenerJornadasPorMedico.mockResolvedValue(horarioEsperado);

      // Act
      const resultado = await servicio.obtenerHorarioMedico('MP001');

      // Assert
      expect(resultado).toEqual(horarioEsperado);
      expect(citasRepoMock.obtenerJornadasPorMedico).toHaveBeenCalledWith('MP001');
    });
  });
});
