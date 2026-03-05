import { citaMedicaSolicitudDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { CitaMedicaRespuestaDTO } from '../../../infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';

export interface ICancelacionReprogramacionCitasCasosUso {
  cancelarCita(idCita: string): Promise<CitaMedicaRespuestaDTO | null>;
  reprogramarCita(idCita: string, nuevosDatos: citaMedicaSolicitudDTO): Promise<CitaMedicaRespuestaDTO | null>;
  finalizarCita(idCita: string): Promise<CitaMedicaRespuestaDTO | null>;
}
