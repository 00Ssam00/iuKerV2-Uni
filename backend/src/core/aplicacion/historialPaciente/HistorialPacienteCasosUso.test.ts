import { HistorialPacienteCasosUso } from './HistorialPacienteCasosUso.js';
import { IHistorialPacienteRepositorio } from '../../dominio/historialPaciente/IHistorialPacienteRepositorio.js';
import { ICitasMedicasRepositorio } from '../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { CodigosDeError } from '../../dominio/errores/codigosDeError.enum.js';
import { ErrorDeAplicacion } from '../../dominio/errores/ErrorDeAplicacion.js';
import { estadoCita } from '../../../common/estadoCita.enum.js';
import { HistorialPacienteRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/HistorialPacienteRespuestaDTO.js';
import { CitaMedicaRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';

const citaFinalizada: CitaMedicaRespuestaDTO = {
  idCita: 'cita-uuid-001',
  paciente: 'Ana García',
  tipoDocPaciente: 'Cédula de ciudadanía',
  numeroDocPaciente: '1234567890',
  medico: 'Carlos Pérez',
  ubicacion: 'Piso 2',
  consultorio: 'C001',
  fecha: '2026-03-10',
  horaInicio: '08:00',
  codigoEstadoCita: estadoCita.FINALIZADA,
  estadoCita: 'Finalizada',
  idCitaAnterior: null,
};

const historialMock: HistorialPacienteRespuestaDTO = {
  idHistorial: 'hist-uuid-001',
  idCita: 'cita-uuid-001',
  paciente: 'Ana García',
  medico: 'Carlos Pérez',
  fecha: '2026-03-10',
  diagnostico: 'Diagnóstico de prueba',
  descripcion: 'Descripción de prueba',
  fechaRegistro: '2026-03-10T10:00:00',
};

const crearHistorialRepositorioMock = (
  overrides: Partial<IHistorialPacienteRepositorio> = {}
): IHistorialPacienteRepositorio => ({
  crearHistorial: jest.fn().mockResolvedValue(historialMock),
  obtenerHistorialPorCita: jest.fn().mockResolvedValue(null),
  obtenerHistorialPorPaciente: jest.fn().mockResolvedValue([historialMock]),
  ...overrides,
});

const crearCitasRepositorioMock = (
  overrides: Partial<ICitasMedicasRepositorio> = {}
): ICitasMedicasRepositorio => ({
  obtenerCitas: jest.fn(),
  obtenerCitaPorId: jest.fn().mockResolvedValue(citaFinalizada),
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
  ...overrides,
});

describe('HistorialPacienteCasosUso', () => {
  describe('registrarHistorial', () => {
    it('registra el historial cuando la cita existe, está finalizada y no tiene historial previo', async () => {
      const casosUso = new HistorialPacienteCasosUso(
        crearHistorialRepositorioMock(),
        crearCitasRepositorioMock()
      );

      const resultado = await casosUso.registrarHistorial({
        idCita: 'cita-uuid-001',
        diagnostico: 'Diagnóstico de prueba',
        descripcion: 'Descripción de prueba',
      });

      expect(resultado).toEqual(historialMock);
    });

    it('lanza CITA_NO_EXISTE cuando la cita no existe', async () => {
      const casosUso = new HistorialPacienteCasosUso(
        crearHistorialRepositorioMock(),
        crearCitasRepositorioMock({ obtenerCitaPorId: jest.fn().mockResolvedValue(null) })
      );

      await expect(
        casosUso.registrarHistorial({ idCita: 'no-existe', diagnostico: 'Diagnóstico' })
      ).rejects.toMatchObject({
        codigoInterno: CodigosDeError.CITA_NO_EXISTE,
      } as Partial<ErrorDeAplicacion>);

    });

    it('lanza CITA_NO_FINALIZADA_PARA_HISTORIAL cuando la cita no está finalizada', async () => {
      const citaActiva = { ...citaFinalizada, codigoEstadoCita: estadoCita.ACTIVADA };
      const casosUso = new HistorialPacienteCasosUso(
        crearHistorialRepositorioMock(),
        crearCitasRepositorioMock({ obtenerCitaPorId: jest.fn().mockResolvedValue(citaActiva) })
      );

      await expect(
        casosUso.registrarHistorial({ idCita: 'cita-uuid-001', diagnostico: 'Diagnóstico' })
      ).rejects.toMatchObject({
        codigoInterno: CodigosDeError.CITA_NO_FINALIZADA_PARA_HISTORIAL,
      } as Partial<ErrorDeAplicacion>);

    });

    it('lanza HISTORIAL_YA_EXISTE cuando ya hay un historial para esa cita', async () => {
      const casosUso = new HistorialPacienteCasosUso(
        crearHistorialRepositorioMock({
          obtenerHistorialPorCita: jest.fn().mockResolvedValue(historialMock),
        }),
        crearCitasRepositorioMock()
      );

      await expect(
        casosUso.registrarHistorial({ idCita: 'cita-uuid-001', diagnostico: 'Diagnóstico' })
      ).rejects.toMatchObject({
        codigoInterno: CodigosDeError.HISTORIAL_YA_EXISTE,
      } as Partial<ErrorDeAplicacion>);

    });
  });

  describe('obtenerHistorialPorCita', () => {
    it('retorna el historial cuando existe', async () => {
      const casosUso = new HistorialPacienteCasosUso(
        crearHistorialRepositorioMock({
          obtenerHistorialPorCita: jest.fn().mockResolvedValue(historialMock),
        }),
        crearCitasRepositorioMock()
      );

      const resultado = await casosUso.obtenerHistorialPorCita('cita-uuid-001');
      expect(resultado).toEqual(historialMock);
    });

    it('lanza HISTORIAL_NO_EXISTE cuando no hay historial para la cita', async () => {
      const casosUso = new HistorialPacienteCasosUso(
        crearHistorialRepositorioMock(),
        crearCitasRepositorioMock()
      );

      await expect(casosUso.obtenerHistorialPorCita('cita-sin-historial')).rejects.toMatchObject({
        codigoInterno: CodigosDeError.HISTORIAL_NO_EXISTE,
      } as Partial<ErrorDeAplicacion>);

    });
  });

  describe('obtenerHistorialPorPaciente', () => {
    it('retorna todos los historiales del paciente', async () => {
      const casosUso = new HistorialPacienteCasosUso(
        crearHistorialRepositorioMock(),
        crearCitasRepositorioMock()
      );

      const resultado = await casosUso.obtenerHistorialPorPaciente('1234567890');
      expect(resultado).toHaveLength(1);
      expect(resultado[0]).toEqual(historialMock);
    });

    it('retorna arreglo vacío si el paciente no tiene historiales', async () => {
      const casosUso = new HistorialPacienteCasosUso(
        crearHistorialRepositorioMock({
          obtenerHistorialPorPaciente: jest.fn().mockResolvedValue([]),
        }),
        crearCitasRepositorioMock()
      );

      const resultado = await casosUso.obtenerHistorialPorPaciente('sin-historial');
      expect(resultado).toEqual([]);
    });
  });
});
