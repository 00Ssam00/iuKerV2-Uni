import { FastifyRequest, FastifyReply } from 'fastify';
import { IMedicosCasosUso } from '../../aplicacion/medico/IMedicosCasosUso.js';
import { MedicoSolicitudDTO, MedicoActualizarSolicitudDTO, crearMedicoEsquema } from '../esquemas/medicoEsquema.js';
import { EstadoHttp } from './estadoHttp.enum.js';

export class MedicosControlador {
  constructor(private medicosCasosUso: IMedicosCasosUso) {}

  crearMedico = async (request: FastifyRequest<{ Body: MedicoSolicitudDTO }>, reply: FastifyReply) => {
    try {
      const nuevoMedico = crearMedicoEsquema.parse(request.body);
      const nuevaTarjetaProfesional = await this.medicosCasosUso.crearMedico(nuevoMedico);

      return reply.code(EstadoHttp.CREADO).send({
        mensaje: 'El médico se creo correctamente',
        tarjetaProfesional: nuevaTarjetaProfesional,
      });
    } catch (er) {
      throw er;
    }
  };

  listarMedicos = async (request: FastifyRequest<{ Querystring: { limite?: number } }>, reply: FastifyReply) => {
    try {
      const { limite } = request.query;
      const medicosEncontrados = await this.medicosCasosUso.listarMedicos(limite);

      return reply.code(EstadoHttp.OK).send({
        mensaje: 'Médicos encontrados correctamente',
        medicos: medicosEncontrados,
        cantidad: medicosEncontrados.length,
      });
    } catch (er) {
      throw er;
    }
  };

  obtenerMedicoPorTarjetaProfesional = async (
    request: FastifyRequest<{ Params: { tarjetaProfesional: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { tarjetaProfesional } = request.params;
      const medicoEncontrado = await this.medicosCasosUso.obtenerMedicoPorTarjetaProfesional(tarjetaProfesional);

      return reply.code(EstadoHttp.OK).send({
        mensaje: 'Médico encontrado correctamente',
        medico: medicoEncontrado,
      });
    } catch (er) {
      throw er;
    }
  };

  actualizarMedico = async (
    request: FastifyRequest<{
      Params: { tarjetaProfesional: string };
      Body: MedicoActualizarSolicitudDTO;
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { tarjetaProfesional } = request.params;
      const nuevoMedico = request.body;
      const medicoActualizado = await this.medicosCasosUso.actualizarMedico(tarjetaProfesional, nuevoMedico);

      return reply.code(EstadoHttp.OK).send({
        mensaje: 'Médico actualizado correctamente',
        medico: medicoActualizado,
      });
    } catch (er) {
      throw er;
    }
  };

  eliminarMedico = async (request: FastifyRequest<{ Params: { tarjetaProfesional: string } }>, reply: FastifyReply) => {
    try {
      const { tarjetaProfesional } = request.params;
      await this.medicosCasosUso.eliminarMedico(tarjetaProfesional);

      return reply.code(EstadoHttp.OK).send({
        mensaje: 'Médico eliminado correctamente',
        tarjetaProfesional: tarjetaProfesional,
      });
    } catch (er) {
      throw er;
    }
  };
}
