import { IConsultorio} from './IConsultorio.js';
import { ConsultorioRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/consultorioRespuestaDTO.js';

export interface IConsultoriosRepositorio {
  agregarConsultorio(datosConsultorio: IConsultorio): Promise<ConsultorioRespuestaDTO | null>;
  listarConsultorios(limite?: number): Promise<ConsultorioRespuestaDTO[]>;
  obtenerConsultorioPorId(idConsultorio: string): Promise<ConsultorioRespuestaDTO | null>;
  actualizarConsultorio(idConsultorio: string, datosConsultorio: IConsultorio): Promise<ConsultorioRespuestaDTO | null>;
  eliminarConsultorio(idConsultorio: string): Promise<void>;
}