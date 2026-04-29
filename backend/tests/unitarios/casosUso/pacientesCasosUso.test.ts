import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PacientesCasosUso } from '../../../src/core/aplicacion/paciente/PacientesCasosUso.js';
import { IPacientesRepositorio } from '../../../src/core/dominio/paciente/IPacientesRepositorio.js';
import { ICitasMedicasRepositorio } from '../../../src/core/dominio/citaMedica/ICitasMedicasRepositorio.js';
import { IPaciente } from '../../../src/core/dominio/paciente/IPaciente.js';
import { pacienteRespuestaDTO } from '../../../src/core/infraestructura/repositorios/postgres/dtos/pacienteRespuestaDTO.js';

describe('PacientesCasosUso', () => {
  let pacientesCasosUso: PacientesCasosUso;
  let mockPacientesRepositorio: jest.Mocked<IPacientesRepositorio>;
  let mockCitasMedicasRepositorio: jest.Mocked<ICitasMedicasRepositorio>;

  const pacienteMock: pacienteRespuestaDTO = {
    tipoDoc: 1,
    numeroDoc: '100001',
    nombre: 'Juan',
    apellido: 'Pérez',
    fechaNacimiento: '1990-05-10T00:00:00.000Z',
    sexo: 'M',
    email: 'juan.perez@correo.com',
    telefono: '3001234567',
    direccion: 'Calle 10 # 5-20',
  };

  const datosActualizacion: IPaciente = {
    numeroDoc: '100001',
    tipoDoc: 1,
    nombre: 'Juan Actualizado',
    apellido: 'Pérez',
    fechaNacimiento: new Date('1990-05-10'),
    sexo: 'M',
    email: 'juan.nuevo@correo.com',
    telefono: '3009876543',
    direccion: 'Carrera 5 # 10-30',
  };

  beforeEach(() => {
    mockPacientesRepositorio = {
      existePacientePorDocumento: jest.fn(),
      obtenerPacientes: jest.fn(),
      obtenerPacientePorId: jest.fn(),
      crearPaciente: jest.fn(),
      actualizarPaciente: jest.fn(),
      borrarPaciente: jest.fn(),
    } as jest.Mocked<IPacientesRepositorio>;

    mockCitasMedicasRepositorio = {
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
    } as jest.Mocked<ICitasMedicasRepositorio>;

    pacientesCasosUso = new PacientesCasosUso(
      mockPacientesRepositorio,
      mockCitasMedicasRepositorio
    );
  });

  // HU-03 — Actualización de Datos del Paciente
  describe('actualizarPaciente', () => {
    it('debería actualizar el paciente correctamente cuando existe', async () => {
      // Arrange
      const pacienteActualizado: pacienteRespuestaDTO = {
        ...pacienteMock,
        nombre: 'Juan Actualizado',
        email: 'juan.nuevo@correo.com',
      };
      (mockPacientesRepositorio.obtenerPacientePorId as jest.Mock).mockResolvedValue(pacienteMock);
      (mockPacientesRepositorio.actualizarPaciente as jest.Mock).mockResolvedValue(pacienteActualizado);

      // Act
      const resultado = await pacientesCasosUso.actualizarPaciente('100001', datosActualizacion);

      // Assert
      expect(mockPacientesRepositorio.obtenerPacientePorId).toHaveBeenCalledWith('100001');
      expect(mockPacientesRepositorio.actualizarPaciente).toHaveBeenCalledWith('100001', datosActualizacion);
      expect(resultado).toEqual(pacienteActualizado);
    });

    it('debería lanzar error cuando el paciente a actualizar no existe', async () => {
      // Arrange
      (mockPacientesRepositorio.obtenerPacientePorId as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(
        pacientesCasosUso.actualizarPaciente('999999', datosActualizacion)
      ).rejects.toThrow();

      expect(mockPacientesRepositorio.obtenerPacientePorId).toHaveBeenCalledWith('999999');
      expect(mockPacientesRepositorio.actualizarPaciente).not.toHaveBeenCalled();
    });

    it('debería retornar null cuando el repositorio no retorna datos tras actualizar', async () => {
      // Arrange
      (mockPacientesRepositorio.obtenerPacientePorId as jest.Mock).mockResolvedValue(pacienteMock);
      (mockPacientesRepositorio.actualizarPaciente as jest.Mock).mockResolvedValue(null);

      // Act
      const resultado = await pacientesCasosUso.actualizarPaciente('100001', datosActualizacion);

      // Assert
      expect(resultado).toBeNull();
    });

    it('debería verificar la existencia antes de actualizar', async () => {
      // Arrange
      const ordenDeLlamadas: string[] = [];

      (mockPacientesRepositorio.obtenerPacientePorId as jest.Mock).mockImplementation(async () => {
        ordenDeLlamadas.push('obtener');
        return pacienteMock;
      });
      (mockPacientesRepositorio.actualizarPaciente as jest.Mock).mockImplementation(async () => {
        ordenDeLlamadas.push('actualizar');
        return pacienteMock;
      });

      // Act
      await pacientesCasosUso.actualizarPaciente('100001', datosActualizacion);

      // Assert
      expect(ordenDeLlamadas).toEqual(['obtener', 'actualizar']);
    });
  });

  // HU-04 — Eliminación de Paciente con Cascada de Citas
  describe('borrarPaciente', () => {
    it('debería eliminar el paciente y sus citas asociadas en cascada', async () => {
      // Arrange
      (mockPacientesRepositorio.obtenerPacientePorId as jest.Mock).mockResolvedValue(pacienteMock);
      (mockCitasMedicasRepositorio.eliminarCitasPorPaciente as jest.Mock).mockResolvedValue(undefined);
      (mockPacientesRepositorio.borrarPaciente as jest.Mock).mockResolvedValue(undefined);

      // Act
      await pacientesCasosUso.borrarPaciente('100001');

      // Assert
      expect(mockPacientesRepositorio.obtenerPacientePorId).toHaveBeenCalledWith('100001');
      expect(mockCitasMedicasRepositorio.eliminarCitasPorPaciente).toHaveBeenCalledWith(
        pacienteMock.tipoDoc,
        '100001'
      );
      expect(mockPacientesRepositorio.borrarPaciente).toHaveBeenCalledWith('100001');
    });

    it('debería lanzar error si el paciente no existe', async () => {
      // Arrange
      (mockPacientesRepositorio.obtenerPacientePorId as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(pacientesCasosUso.borrarPaciente('999999')).rejects.toThrow();

      expect(mockCitasMedicasRepositorio.eliminarCitasPorPaciente).not.toHaveBeenCalled();
      expect(mockPacientesRepositorio.borrarPaciente).not.toHaveBeenCalled();
    });

    it('debería eliminar las citas antes de borrar el paciente', async () => {
      // Arrange
      const ordenDeLlamadas: string[] = [];

      (mockPacientesRepositorio.obtenerPacientePorId as jest.Mock).mockImplementation(async () => {
        ordenDeLlamadas.push('obtener');
        return pacienteMock;
      });
      (mockCitasMedicasRepositorio.eliminarCitasPorPaciente as jest.Mock).mockImplementation(async () => {
        ordenDeLlamadas.push('eliminarCitas');
      });
      (mockPacientesRepositorio.borrarPaciente as jest.Mock).mockImplementation(async () => {
        ordenDeLlamadas.push('borrarPaciente');
      });

      // Act
      await pacientesCasosUso.borrarPaciente('100001');

      // Assert
      expect(ordenDeLlamadas).toEqual(['obtener', 'eliminarCitas', 'borrarPaciente']);
    });
  });
});
