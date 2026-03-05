import { FastifyRequest, FastifyReply } from "fastify";
import { IConsultorio } from "../../dominio/consultorio/IConsultorio.js"
import { IConsultorioCasosUso } from "../../aplicacion/consultorio/IConsultoriosCasosUso.js";
import { consultorioSolicitudDTO, CrearConsultorioEsquema } from "../esquemas/consultorioEsquema.js"
import { EstadoHttp } from "./estadoHttp.enum.js";
import { ZodError } from "zod";

export class ConsultoriosControlador {
  constructor(private consultorioCasosUso: IConsultorioCasosUso) {}
  listarConsultorios = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const consultoriosEncontrados =
        await this.consultorioCasosUso.listarConsultorios(limite);

      return reply.code(EstadoHttp.OK).send({
        mensaje:"Consultorios encontrados de forma exitosa",
        cantidadConsultoriosEncontrados: consultoriosEncontrados.length,
        consultoriosEncontrados
      });
    } catch (error) {
      throw error;
    }
  };

  obtenerConsultorioPorId = async (
    request: FastifyRequest<{ Params: { idConsultorio: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idConsultorio } = request.params;
      const consultorioEncontrado =
        await this.consultorioCasosUso.obtenerConsultorioPorId(idConsultorio);

      return reply.code(EstadoHttp.OK).send({
        mensaje:"Consultorio encontrado correctamente",
        consultorioEncontrado,
      });
    } catch (error) {
      throw error;
    }
  };
  agregarConsultorio = async(
    request: FastifyRequest<{ Body:consultorioSolicitudDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevoconsultorioSolicitudDTO = CrearConsultorioEsquema.parse(request.body);
      
      const nuevoConsultorio: IConsultorio = {
        idConsultorio: nuevoconsultorioSolicitudDTO.idConsultorio,
        ubicacion: nuevoconsultorioSolicitudDTO.ubicacion,
      }

      await this.consultorioCasosUso.agregarConsultorio(nuevoConsultorio);

      return reply.code(EstadoHttp.CREADO).send({
        mensaje: "El consultorio se agrego correctamente",
        nuevoConsultorio,
      });
    } catch (error) {
      throw error;
    }
  };

  actualizarConsultorio = async(
    request: FastifyRequest<{ Params: {idConsultorio: string}; Body:IConsultorio }>,
    reply: FastifyReply
  ) => {
    try {
      const { idConsultorio } = request.params;
      const datosNuevoConsultorio = request.body;

      const consultorioActualizado = await this.consultorioCasosUso.
        actualizarConsultorio(idConsultorio, datosNuevoConsultorio);

      return reply.code(EstadoHttp.OK).send({
        mensaje:"Consultorio actualizado correctamente",
        consultorioActualizado
      })
    } catch (error) {
      throw error;
    }
  };

  eliminarConsultorio = async (
    request: FastifyRequest<{ Params: { idConsultorio: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idConsultorio } = request.params;
      // Valida que el ID se ingrese
      if (!idConsultorio || idConsultorio.trim().length === 0) {
        return reply.code(EstadoHttp.PETICION_INVALIDA).send({
          mensaje:
            'El ID del consultorio es obligatorio y no puede estar vacio',
        });
      }

      const consultorio = await this.consultorioCasosUso.obtenerConsultorioPorId(idConsultorio);

      await this.consultorioCasosUso.eliminarConsultorio(idConsultorio);

      return reply.code(EstadoHttp.OK).send({
        mensaje:"Consultorio eliminado correctamente",
        idConsultorio
      });
    } catch (error) {
      throw error;
    }
  };
}
