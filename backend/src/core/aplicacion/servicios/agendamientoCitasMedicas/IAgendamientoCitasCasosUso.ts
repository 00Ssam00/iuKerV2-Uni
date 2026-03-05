import { citaMedicaSolicitudDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { CitaMedicaRespuestaDTO } from '../../../infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';

export interface IAgendamientoCitasCasosUso {
  ejecutar(datosCitaMedica: citaMedicaSolicitudDTO): Promise<CitaMedicaRespuestaDTO | null>;
}
