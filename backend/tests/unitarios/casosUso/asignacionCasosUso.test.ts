import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { AsignacionCasosUso } from '../../../src/core/aplicacion/servicios/asignacionMedico/AsignacionCasosUso.js';
import { IAsignacionMedicoRepositorio } from '../../../src/core/dominio/asignacionMedico/IAsignacionMedicoRepositorio.js';
import { IMedicosRepositorio } from '../../../src/core/dominio/medico/IMedicosRepositorio.js';
import { IConsultoriosRepositorio } from '../../../src/core/dominio/consultorio/IConsultoriosRepositorio.js';
import { IAsignacionMedico } from '../../../src/core/dominio/asignacionMedico/IAsignacionMedico.js';

describe('AsignacionCasosUso', () => {
  let casosUso: AsignacionCasosUso;
  let mockAsignacionRepositorio: jest.Mocked<IAsignacionMedicoRepositorio>;
  let mockMedicoRepositorio: jest.Mocked<IMedicosRepositorio>;
  let mockConsultorioRepositorio: jest.Mocked<IConsultoriosRepositorio>;

  const asignacionMock: IAsignacionMedico = {
    tarjetaProfesionalMedico: 'TP-001',
    idConsultorio: 'C101',
    diaSemana: 1,
    inicioJornada: '08:00',
    finJornada: '17:00',
  };

  beforeEach(() => {
    mockAsignacionRepositorio = {
      crearAsignacion: jest.fn() as any,
      existeAsignacion: jest.fn() as any,
      consultorioOcupado: jest.fn() as any,
      medicoYaTieneAsignacion: jest.fn() as any,
      eliminarAsignacion: jest.fn() as any,
      obtenerTodasLasAsignaciones: jest.fn() as any,
    } as jest.Mocked<IAsignacionMedicoRepositorio>;

    mockMedicoRepositorio = {
      listarMedicos: jest.fn() as any,
      obtenerMedicoPorTarjetaProfesional: jest.fn() as any,
      crearMedico: jest.fn() as any,
      actualizarMedico: jest.fn() as any,
      eliminarMedico: jest.fn() as any,
    } as jest.Mocked<IMedicosRepositorio>;

    mockConsultorioRepositorio = {
      listarConsultorios: jest.fn() as any,
      obtenerConsultorioPorId: jest.fn() as any,
      agregarConsultorio: jest.fn() as any,
      actualizarConsultorio: jest.fn() as any,
      eliminarConsultorio: jest.fn() as any,
    } as jest.Mocked<IConsultoriosRepositorio>;

    casosUso = new AsignacionCasosUso(
      mockAsignacionRepositorio,
      mockMedicoRepositorio,
      mockConsultorioRepositorio
    );

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('eliminarAsignacion', () => {
    it('debería llamar al repositorio con la tarjeta profesional correcta', async () => {
      (mockAsignacionRepositorio.eliminarAsignacion as jest.Mock).mockResolvedValue(undefined);

      await casosUso.eliminarAsignacion('TP-001');

      expect(mockAsignacionRepositorio.eliminarAsignacion).toHaveBeenCalledWith('TP-001');
    });

    it('debería llamar exactamente una vez al repositorio', async () => {
      (mockAsignacionRepositorio.eliminarAsignacion as jest.Mock).mockResolvedValue(undefined);

      await casosUso.eliminarAsignacion('TP-001');

      expect(mockAsignacionRepositorio.eliminarAsignacion).toHaveBeenCalledTimes(1);
    });

    it('debería propagar errores del repositorio', async () => {
      (mockAsignacionRepositorio.eliminarAsignacion as jest.Mock).mockRejectedValue(new Error('Error de BD'));

      await expect(casosUso.eliminarAsignacion('TP-001')).rejects.toThrow('Error de BD');
    });

    it('no debería llamar a los repositorios de médico ni consultorio', async () => {
      (mockAsignacionRepositorio.eliminarAsignacion as jest.Mock).mockResolvedValue(undefined);

      await casosUso.eliminarAsignacion('TP-001');

      expect(mockMedicoRepositorio.obtenerMedicoPorTarjetaProfesional).not.toHaveBeenCalled();
      expect(mockConsultorioRepositorio.obtenerConsultorioPorId).not.toHaveBeenCalled();
    });
  });

  describe('obtenerTodasLasAsignaciones', () => {
    it('debería retornar todas las asignaciones del repositorio', async () => {
      const asignacionesMock: IAsignacionMedico[] = [
        asignacionMock,
        { tarjetaProfesionalMedico: 'TP-002', idConsultorio: 'C102', diaSemana: 2, inicioJornada: '09:00', finJornada: '18:00' },
      ];
      (mockAsignacionRepositorio.obtenerTodasLasAsignaciones as jest.Mock).mockResolvedValue(asignacionesMock);

      const resultado = await casosUso.obtenerTodasLasAsignaciones();

      expect(resultado).toEqual(asignacionesMock);
      expect(mockAsignacionRepositorio.obtenerTodasLasAsignaciones).toHaveBeenCalledTimes(1);
    });

    it('debería retornar arreglo vacío cuando no hay asignaciones', async () => {
      (mockAsignacionRepositorio.obtenerTodasLasAsignaciones as jest.Mock).mockResolvedValue([]);

      const resultado = await casosUso.obtenerTodasLasAsignaciones();

      expect(resultado).toEqual([]);
    });

    it('debería propagar errores del repositorio', async () => {
      (mockAsignacionRepositorio.obtenerTodasLasAsignaciones as jest.Mock).mockRejectedValue(new Error('Error de BD'));

      await expect(casosUso.obtenerTodasLasAsignaciones()).rejects.toThrow('Error de BD');
    });
  });

  describe('crearAsignacion - validación medicoYaTieneAsignacion', () => {
    it('debería lanzar error ASIG002 si el médico ya tiene asignación', async () => {
      (mockMedicoRepositorio.obtenerMedicoPorTarjetaProfesional as jest.Mock).mockResolvedValue({ tarjetaProfesionalMedico: 'TP-001' });
      (mockConsultorioRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue({ idConsultorio: 'C101' });
      (mockAsignacionRepositorio.existeAsignacion as jest.Mock).mockResolvedValue(false);
      (mockAsignacionRepositorio.consultorioOcupado as jest.Mock).mockResolvedValue(false);
      (mockAsignacionRepositorio.medicoYaTieneAsignacion as jest.Mock).mockResolvedValue(true);

      await expect(casosUso.crearAsignacion(asignacionMock)).rejects.toMatchObject({
        codigoInterno: 'ASIG002',
      });
    });

    it('debería crear la asignación si el médico no tiene ninguna previa', async () => {
      (mockMedicoRepositorio.obtenerMedicoPorTarjetaProfesional as jest.Mock).mockResolvedValue({ tarjetaProfesionalMedico: 'TP-001' });
      (mockConsultorioRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue({ idConsultorio: 'C101' });
      (mockAsignacionRepositorio.existeAsignacion as jest.Mock).mockResolvedValue(false);
      (mockAsignacionRepositorio.consultorioOcupado as jest.Mock).mockResolvedValue(false);
      (mockAsignacionRepositorio.medicoYaTieneAsignacion as jest.Mock).mockResolvedValue(false);
      (mockAsignacionRepositorio.crearAsignacion as jest.Mock).mockResolvedValue({ idAsignacion: 'uuid-123' });

      const resultado = await casosUso.crearAsignacion(asignacionMock);

      expect(resultado).toBe('uuid-123');
      expect(mockAsignacionRepositorio.crearAsignacion).toHaveBeenCalledTimes(1);
    });

    it('debería verificar medicoYaTieneAsignacion después de las otras validaciones', async () => {
      (mockMedicoRepositorio.obtenerMedicoPorTarjetaProfesional as jest.Mock).mockResolvedValue({ tarjetaProfesionalMedico: 'TP-001' });
      (mockConsultorioRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue({ idConsultorio: 'C101' });
      (mockAsignacionRepositorio.existeAsignacion as jest.Mock).mockResolvedValue(false);
      (mockAsignacionRepositorio.consultorioOcupado as jest.Mock).mockResolvedValue(false);
      (mockAsignacionRepositorio.medicoYaTieneAsignacion as jest.Mock).mockResolvedValue(true);

      await expect(casosUso.crearAsignacion(asignacionMock)).rejects.toBeDefined();

      expect(mockAsignacionRepositorio.medicoYaTieneAsignacion).toHaveBeenCalledWith('TP-001');
      expect(mockAsignacionRepositorio.crearAsignacion).not.toHaveBeenCalled();
    });
  });
});
