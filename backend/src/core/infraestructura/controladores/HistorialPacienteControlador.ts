import { FastifyRequest, FastifyReply } from 'fastify';
import { IHistorialPacienteCasosUso } from '../../aplicacion/historialPaciente/IHistorialPacienteCasosUso.js';
import { historialSolicitudDTO, crearHistorialEsquema } from '../esquemas/historialPacienteEsquema.js';
import { EstadoHttp } from './estadoHttp.enum.js';

export class HistorialPacienteControlador {
  constructor(private readonly historialCasosUso: IHistorialPacienteCasosUso) {}

  registrarHistorial = async (
    req: FastifyRequest<{ Body: historialSolicitudDTO }>,
    res: FastifyReply
  ) => {
    const datos = crearHistorialEsquema.parse(req.body);
    const historialRegistrado = await this.historialCasosUso.registrarHistorial(datos);
    return res.code(EstadoHttp.CREADO).send({
      mensaje: 'Historial registrado correctamente',
      historialRegistrado,
    });
  };

  obtenerHistorialPorCita = async (
    req: FastifyRequest<{ Params: { idCita: string } }>,
    res: FastifyReply
  ) => {
    const { idCita } = req.params;
    const historial = await this.historialCasosUso.obtenerHistorialPorCita(idCita);
    return res.code(EstadoHttp.OK).send({
      mensaje: 'Historial encontrado',
      historial,
    });
  };

  obtenerHistorialPorPaciente = async (
    req: FastifyRequest<{ Params: { numeroDoc: string } }>,
    res: FastifyReply
  ) => {
    const { numeroDoc } = req.params;
    const historial = await this.historialCasosUso.obtenerHistorialPorPaciente(numeroDoc);
    return res.code(EstadoHttp.OK).send({
      cantidadRegistros: historial.length,
      historial,
    });
  };
}
