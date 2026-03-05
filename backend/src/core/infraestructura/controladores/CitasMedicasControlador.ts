import { FastifyReply, FastifyRequest } from 'fastify';
import { ICitasMedicasCasosUso } from '../../aplicacion/citaMedica/ICitasMedicasCasosUso.js';
import {
  citaMedicaSolicitudDTO,
  crearCitaMedicaEsquema,
} from '../esquemas/citaMedicaEsquema.js';
import { ICitaMedica } from '../../dominio/citaMedica/ICitaMedica.js';
import { ICancelacionReprogramacionCitasCasosUso } from '../../aplicacion/servicios/cancelacionReprogramacionCita/ICancelacionReprogramacionCitasCasosUso.js';
import { IAgendamientoCitasCasosUso } from '../../aplicacion/servicios/agendamientoCitasMedicas/IAgendamientoCitasCasosUso.js';
import { EstadoHttp } from './estadoHttp.enum.js';

export class CitasMedicasControlador {
  constructor(
    private citasMedicasCasosUso: ICitasMedicasCasosUso,
    private cancelacionReprogramacionCasosUso: ICancelacionReprogramacionCitasCasosUso,
    private agendamientoCitasCasosUso: IAgendamientoCitasCasosUso
  ) {}

  obtenerCitas = async (
    req: FastifyRequest<{ Querystring: { limite?: number } }>,
    res: FastifyReply
  ) => {
    try {
      const { limite } = req.query;
      const citasEncontradas = await this.citasMedicasCasosUso.obtenerCitas(
        limite
      );
      return res.code(EstadoHttp.OK).send({
        cantidadCitas: citasEncontradas.length,
        citasEncontradas,
      });
    } catch (err) {
      throw err;
    }
  };

  obtenerCitaPorId = async (
    req: FastifyRequest<{ Params: { idCita: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { idCita } = req.params;
      const citaEncontrada = await this.citasMedicasCasosUso.obtenerCitaPorId(
        idCita
      );

      return res.code(EstadoHttp.OK).send({
        mensaje: 'Cita encontrada',
        citaEncontrada,
      });
    } catch (err) {
      throw err;
    }
  };

  agendarCita = async (
    req: FastifyRequest<{ Body: citaMedicaSolicitudDTO }>,
    res: FastifyReply
  ) => {
    try {
      const datosCita = crearCitaMedicaEsquema.parse(req.body);
      const citaAgendada = await this.agendamientoCitasCasosUso.ejecutar(
        datosCita
      );

      return res.code(EstadoHttp.CREADO).send({
        mensaje: 'Cita agendada correctamente',
        citaAgendada,
      });
    } catch (err) {
      throw err;
    }
  };

  finalizarCita = async (
    req: FastifyRequest<{ Params: { idCita: string }; Body: ICitaMedica }>,
    res: FastifyReply
  ) => {
    try {
      const { idCita } = req.params;
      const citaFinalizada =
        await this.cancelacionReprogramacionCasosUso.finalizarCita(idCita);

      return res.code(EstadoHttp.OK).send({
        mensaje: 'Cita finalizada correctamente',
        citaFinalizada,
      });
    } catch (err) {
      throw err;
    }
  };

  eliminarCita = async (
    req: FastifyRequest<{ Params: { idCita: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { idCita } = req.params;
      await this.citasMedicasCasosUso.eliminarCita(idCita);

      return res.code(EstadoHttp.OK).send({
        mensaje: 'Cita eliminada correctamente',
        idCita,
      });
    } catch (err) {
      throw err;
    }
  };

  reprogramarCita = async (
    req: FastifyRequest<{
      Params: { idCita: string };
      Body: citaMedicaSolicitudDTO;
    }>,
    res: FastifyReply
  ) => {
    try {
      const { idCita } = req.params;
      const nuevosDatos = crearCitaMedicaEsquema.parse(req.body);

      const citaReprogramada =
        await this.cancelacionReprogramacionCasosUso.reprogramarCita(
          idCita,
          nuevosDatos
        );

      return res.code(EstadoHttp.OK).send({
        mensaje: 'Cita reprogramada correctamente',
        citaReprogramada,
      });
    } catch (err) {
      throw err;
    }
  };

  cancelarCita = async (
    req: FastifyRequest<{ Params: { idCita: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { idCita } = req.params;
      const citaCancelada =
        await this.cancelacionReprogramacionCasosUso.cancelarCita(idCita);

      return res.code(EstadoHttp.OK).send({
        mensaje: 'Cita cancelada correctamente',
        citaCancelada,
      });
    } catch (err) {
      throw err;
    }
  };
}
