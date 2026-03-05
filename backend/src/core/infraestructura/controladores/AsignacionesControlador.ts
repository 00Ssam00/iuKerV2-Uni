import { FastifyRequest, FastifyReply } from 'fastify';
import { IAsignacionCasosUso } from '../../aplicacion/servicios/asignacionMedico/IAsignacionCasosUso.js';
import {
  asignacionEsquema,
  AsignacionSolicitudDTO,
} from '../esquemas/asignacionEsquema.js';
import { EstadoHttp } from './estadoHttp.enum.js';

export class AsignacionesControlador {
  constructor(private asignacionCasosUso: IAsignacionCasosUso) {}

  crearAsignacion = async (
    request: FastifyRequest<{ Body: AsignacionSolicitudDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevaAsignacionValidada = asignacionEsquema.parse(request.body);
      const idNuevaAsignacion = await this.asignacionCasosUso.crearAsignacion(
        nuevaAsignacionValidada
      );

      return reply.code(EstadoHttp.CREADO).send({
        mensaje: 'Asignación creada exitosamente',
        idNuevaAsignacion: idNuevaAsignacion,
      });
    } catch (err) {
      throw err;
    }
  };

  eliminarAsignación = async (
    request: FastifyRequest<{ Params: { tarjetaProfesionalMedico: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { tarjetaProfesionalMedico } = request.params;
      await this.asignacionCasosUso.eliminarAsignacion(
        tarjetaProfesionalMedico
      );

      return reply.code(EstadoHttp.OK).send({
        mensaje: `Eliminado el medico con id '${tarjetaProfesionalMedico}'`,
      });
    } catch (err) {
      throw err;
    }
  };
}
