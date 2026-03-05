import { IConsultorio } from "../../dominio/consultorio/IConsultorio.js";
import { ConsultorioRespuestaDTO } from "../../infraestructura/repositorios/postgres/dtos/consultorioRespuestaDTO.js";

export interface IConsultorioCasosUso {
  agregarConsultorio(consultorio: IConsultorio): Promise<ConsultorioRespuestaDTO | null>;
  listarConsultorios(limite?: number): Promise<ConsultorioRespuestaDTO[]>;
  obtenerConsultorioPorId(idConsultorio: string): Promise<ConsultorioRespuestaDTO | null>;
  actualizarConsultorio(idConsultorio: string, consultorio: IConsultorio): Promise<ConsultorioRespuestaDTO | null>;
  eliminarConsultorio(idConsultorio: string): Promise<void>;
}