import { jest } from '@jest/globals';
import { HistorialPacienteControlador } from '../../../src/core/infraestructura/controladores/HistorialPacienteControlador.js';
import { IHistorialPacienteCasosUso } from '../../../src/core/aplicacion/historialPaciente/IHistorialPacienteCasosUso.js';
import { HistorialPacienteRespuestaDTO } from '../../../src/core/infraestructura/repositorios/postgres/dtos/HistorialPacienteRespuestaDTO.js';
import { FastifyRequest, FastifyReply } from 'fastify';
import { EstadoHttp } from '../../../src/core/infraestructura/controladores/estadoHttp.enum.js';

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

const crearCasosUsoMock = (
  overrides: Partial<IHistorialPacienteCasosUso> = {}
): IHistorialPacienteCasosUso => ({
  registrarHistorial: jest.fn().mockResolvedValue(historialMock) as any,
  obtenerHistorialPorCita: jest.fn().mockResolvedValue(historialMock) as any,
  obtenerHistorialPorPaciente: jest.fn().mockResolvedValue([historialMock]) as any,
  ...overrides,
});

const crearResMock = () => ({
  code: jest.fn().mockReturnThis() as any,
  send: jest.fn().mockReturnThis() as any,
});

describe('HistorialPacienteControlador', () => {
  describe('registrarHistorial', () => {
    it('responde con 201 y el historial registrado', async () => {
      const controlador = new HistorialPacienteControlador(crearCasosUsoMock());
      const req = {
        body: { idCita: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', diagnostico: 'Diagnóstico de prueba' },
      } as FastifyRequest<{ Body: { idCita: string; diagnostico: string } }>;
      const res = crearResMock();

      await controlador.registrarHistorial(req as any, res as unknown as FastifyReply);

      expect(res.code).toHaveBeenCalledWith(EstadoHttp.CREADO);
      expect(res.send).toHaveBeenCalledWith({
        mensaje: 'Historial registrado correctamente',
        historialRegistrado: historialMock,
      });
    });

    it('delega al caso de uso con los datos del body', async () => {
      const casosUso = crearCasosUsoMock();
      const controlador = new HistorialPacienteControlador(casosUso);
      const datos = {
        idCita: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        diagnostico: 'Diagnóstico de prueba',
        descripcion: 'Detalle adicional',
      };
      const req = { body: datos } as FastifyRequest<{ Body: typeof datos }>;
      const res = crearResMock();

      await controlador.registrarHistorial(req as any, res as unknown as FastifyReply);

      expect(casosUso.registrarHistorial).toHaveBeenCalledWith(datos);
    });
  });

  describe('obtenerHistorialPorCita', () => {
    it('responde con 200 y el historial encontrado', async () => {
      const controlador = new HistorialPacienteControlador(crearCasosUsoMock());
      const req = {
        params: { idCita: 'cita-uuid-001' },
      } as FastifyRequest<{ Params: { idCita: string } }>;
      const res = crearResMock();

      await controlador.obtenerHistorialPorCita(req, res as unknown as FastifyReply);

      expect(res.code).toHaveBeenCalledWith(EstadoHttp.OK);
      expect(res.send).toHaveBeenCalledWith({
        mensaje: 'Historial encontrado',
        historial: historialMock,
      });
    });

    it('delega al caso de uso con el idCita del param', async () => {
      const casosUso = crearCasosUsoMock();
      const controlador = new HistorialPacienteControlador(casosUso);
      const req = {
        params: { idCita: 'cita-uuid-001' },
      } as FastifyRequest<{ Params: { idCita: string } }>;
      const res = crearResMock();

      await controlador.obtenerHistorialPorCita(req, res as unknown as FastifyReply);

      expect(casosUso.obtenerHistorialPorCita).toHaveBeenCalledWith('cita-uuid-001');
    });
  });

  describe('obtenerHistorialPorPaciente', () => {
    it('responde con 200, cantidadRegistros y el arreglo de historiales', async () => {
      const controlador = new HistorialPacienteControlador(crearCasosUsoMock());
      const req = {
        params: { numeroDoc: '1234567890' },
      } as FastifyRequest<{ Params: { numeroDoc: string } }>;
      const res = crearResMock();

      await controlador.obtenerHistorialPorPaciente(req, res as unknown as FastifyReply);

      expect(res.code).toHaveBeenCalledWith(EstadoHttp.OK);
      expect(res.send).toHaveBeenCalledWith({
        cantidadRegistros: 1,
        historial: [historialMock],
      });
    });

    it('responde con cantidadRegistros 0 cuando el paciente no tiene historiales', async () => {
      const controlador = new HistorialPacienteControlador(
        crearCasosUsoMock({ obtenerHistorialPorPaciente: jest.fn().mockResolvedValue([]) as any })
      );
      const req = {
        params: { numeroDoc: 'sin-historial' },
      } as FastifyRequest<{ Params: { numeroDoc: string } }>;
      const res = crearResMock();

      await controlador.obtenerHistorialPorPaciente(req, res as unknown as FastifyReply);

      expect(res.send).toHaveBeenCalledWith({
        cantidadRegistros: 0,
        historial: [],
      });
    });

    it('delega al caso de uso con el numeroDoc del param', async () => {
      const casosUso = crearCasosUsoMock();
      const controlador = new HistorialPacienteControlador(casosUso);
      const req = {
        params: { numeroDoc: '1234567890' },
      } as FastifyRequest<{ Params: { numeroDoc: string } }>;
      const res = crearResMock();

      await controlador.obtenerHistorialPorPaciente(req, res as unknown as FastifyReply);

      expect(casosUso.obtenerHistorialPorPaciente).toHaveBeenCalledWith('1234567890');
    });
  });
});
