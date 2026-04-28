import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AsignacionCasosUso } from '../../../src/core/aplicacion/servicios/asignacionMedico/AsignacionCasosUso.js';
import { IAsignacionMedicoRepositorio } from '../../../src/core/dominio/asignacionMedico/IAsignacionMedicoRepositorio.js';
import { IMedicosRepositorio } from '../../../src/core/dominio/medico/IMedicosRepositorio.js';
import { IConsultoriosRepositorio } from '../../../src/core/dominio/consultorio/IConsultoriosRepositorio.js';

describe('AsignacionCasosUso', () => {
  let asignacionCasosUso: AsignacionCasosUso;
  let mockAsignacionRepositorio: jest.Mocked<IAsignacionMedicoRepositorio>;
  let mockMedicosRepositorio: jest.Mocked<IMedicosRepositorio>;
  let mockConsultoriosRepositorio: jest.Mocked<IConsultoriosRepositorio>;

  beforeEach(() => {
    mockAsignacionRepositorio = {
      crearAsignacion: jest.fn(),
      existeAsignacion: jest.fn(),
      consultorioOcupado: jest.fn(),
      eliminarAsignacion: jest.fn(),
    } as jest.Mocked<IAsignacionMedicoRepositorio>;

    mockMedicosRepositorio = {
      crearMedico: jest.fn(),
      listarMedicos: jest.fn(),
      obtenerMedicoPorTarjetaProfesional: jest.fn(),
      actualizarMedico: jest.fn(),
      eliminarMedico: jest.fn(),
    } as jest.Mocked<IMedicosRepositorio>;

    mockConsultoriosRepositorio = {
      agregarConsultorio: jest.fn(),
      listarConsultorios: jest.fn(),
      obtenerConsultorioPorId: jest.fn(),
      actualizarConsultorio: jest.fn(),
      eliminarConsultorio: jest.fn(),
    } as jest.Mocked<IConsultoriosRepositorio>;

    asignacionCasosUso = new AsignacionCasosUso(
      mockAsignacionRepositorio,
      mockMedicosRepositorio,
      mockConsultoriosRepositorio
    );
  });

  // HU-24 — Eliminación de Asignaciones de un Médico a Consultorio
  describe('eliminarAsignacion', () => {
    it('debería eliminar la asignación del médico correctamente', async () => {
      // Arrange
      const tarjetaProfesional = 'MP001';
      (mockAsignacionRepositorio.eliminarAsignacion as jest.Mock).mockResolvedValue(undefined);

      // Act
      await asignacionCasosUso.eliminarAsignacion(tarjetaProfesional);

      // Assert
      expect(mockAsignacionRepositorio.eliminarAsignacion).toHaveBeenCalledWith(tarjetaProfesional);
      expect(mockAsignacionRepositorio.eliminarAsignacion).toHaveBeenCalledTimes(1);
    });

    it('debería llamar al repositorio con la tarjeta profesional exacta', async () => {
      // Arrange
      const tarjetaProfesional = 'MP-ESPECIAL-999';
      (mockAsignacionRepositorio.eliminarAsignacion as jest.Mock).mockResolvedValue(undefined);

      // Act
      await asignacionCasosUso.eliminarAsignacion(tarjetaProfesional);

      // Assert
      expect(mockAsignacionRepositorio.eliminarAsignacion).toHaveBeenCalledWith('MP-ESPECIAL-999');
    });

    it('debería propagar el error si el repositorio falla', async () => {
      // Arrange
      const tarjetaProfesional = 'MP001';
      (mockAsignacionRepositorio.eliminarAsignacion as jest.Mock).mockRejectedValue(
        new Error('Error de base de datos')
      );

      // Act & Assert
      await expect(
        asignacionCasosUso.eliminarAsignacion(tarjetaProfesional)
      ).rejects.toThrow('Error de base de datos');
    });

    it('no debería consultar el repositorio de médicos ni consultorios al eliminar', async () => {
      // Arrange
      (mockAsignacionRepositorio.eliminarAsignacion as jest.Mock).mockResolvedValue(undefined);

      // Act
      await asignacionCasosUso.eliminarAsignacion('MP001');

      // Assert
      expect(mockMedicosRepositorio.obtenerMedicoPorTarjetaProfesional).not.toHaveBeenCalled();
      expect(mockConsultoriosRepositorio.obtenerConsultorioPorId).not.toHaveBeenCalled();
    });
  });
});
