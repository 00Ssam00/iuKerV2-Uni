import { IPacientesCasosUso } from '../../aplicacion/paciente/IPacientesCasosUso.js';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PacienteDTO, pacienteEsquema } from '../esquemas/pacienteEsquema.js';
import { ZodError } from 'zod';
import { IPaciente } from '../../dominio/paciente/IPaciente.js';
import { IConsultaCitasPacienteCasosUso } from '../../aplicacion/servicios/consultaCitasPaciente/IConsultaCitasPacienteCasosUso.js';
import { EstadoHttp } from './estadoHttp.enum.js';

export class PacientesControlador {
  constructor(
    private pacientesCasosUso: IPacientesCasosUso,
    private consultaCitasPacienteCasosUso: IConsultaCitasPacienteCasosUso
  ) {}

  obtenerPacientes = async (request: FastifyRequest<{ Querystring: { limite?: number } }>, reply: FastifyReply) => {
    try {
      const { limite } = request.query;
      const pacientesObtenidos = await this.pacientesCasosUso.obtenerPacientes(limite);

      return reply.code(EstadoHttp.OK).send({
        mensaje: 'Estos son los pacientes obtenidos',
        pacientes: pacientesObtenidos,
        cantidadPacientesObtenidos: pacientesObtenidos.length,
      });
    } catch (err) {
      throw err;
    }
  };

  obtenerPacientePorId = async (request: FastifyRequest<{ Params: { numeroDoc: string } }>, reply: FastifyReply) => {
    try {
      const { numeroDoc } = request.params;
      const pacienteObtenido = await this.pacientesCasosUso.obtenerPacientePorId(numeroDoc);

      return reply.code(EstadoHttp.OK).send({
        mensaje: 'Paciente encontrado',
        paciente: pacienteObtenido,
      });
    } catch (err) {
      throw err;
    }
  };

  crearPaciente = async (request: FastifyRequest<{ Body: PacienteDTO }>, reply: FastifyReply) => {
    try {
      const nuevoPaciente = pacienteEsquema.parse(request.body);
      const pacienteCreado = await this.pacientesCasosUso.crearPaciente(nuevoPaciente);

      return reply.code(EstadoHttp.CREADO).send({
        mensaje: 'El paciente se creó correctamente',
        pacienteCreado,
      });
    } catch (err) {
      throw err;
    }
  };

  actualizarPaciente = async (
    request: FastifyRequest<{
      Params: { numeroDoc: string };
      Body: IPaciente;
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { numeroDoc } = request.params;
      const nuevoPaciente = request.body;

      const pacienteActualizado = await this.pacientesCasosUso.actualizarPaciente(numeroDoc, nuevoPaciente);

      return reply.code(EstadoHttp.OK).send({
        mensaje: 'Paciente actualizado satisfactoriamente',
        pacienteActualizado: pacienteActualizado,
      });
    } catch (err) {
      throw err;
    }
  };

  borrarPaciente = async (request: FastifyRequest<{ Params: { numeroDoc: string } }>, reply: FastifyReply) => {
    try {
      const { numeroDoc } = request.params;
      await this.pacientesCasosUso.borrarPaciente(numeroDoc);

      return reply.code(EstadoHttp.OK).send({
        mensaje: 'Paciente borrado correctamente del sistema',
        numeroDoc: numeroDoc,
      });
    } catch (err) {
      throw err;
    }
  };

  obtenerCitasPorPaciente = async (
    request: FastifyRequest<{
      Params: { numeroDoc: string };
      Querystring: { limite?: string };
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { numeroDoc } = request.params;
      const limite = request.query?.limite ? Number(request.query.limite) : undefined;

      const citas = await this.consultaCitasPacienteCasosUso.ejecutarServicio?.(numeroDoc, limite);

      return reply.code(EstadoHttp.OK).send({
        mensaje: `Citas del paciente con documento '${numeroDoc}': `,
        citas: citas,
      });
    } catch (er) {
      const { numeroDoc } = request.params;
      if (er) {
        return reply.code(EstadoHttp.NO_ENCONTRADO).send({
          mensaje: `El paciente con documento '${numeroDoc}' no existe en el sistema`,
          error: er instanceof Error ? er.message : er,
        });
      }
      return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
        mensaje: `Error al obtener las citas del paciente con documento '${numeroDoc}'`,
        error: er instanceof Error ? er.message : er,
      });
    }
  };
}
