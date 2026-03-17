import { HistorialPacienteRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/HistorialPacienteRespuestaDTO.js';
import { historialSolicitudDTO } from '../../infraestructura/esquemas/historialPacienteEsquema.js';

export interface IHistorialPacienteCasosUso {
  registrarHistorial(datos: historialSolicitudDTO): Promise<HistorialPacienteRespuestaDTO | null>;
  obtenerHistorialPorCita(idCita: string): Promise<HistorialPacienteRespuestaDTO | null>;
  obtenerHistorialPorPaciente(numeroDoc: string): Promise<HistorialPacienteRespuestaDTO[]>;
}
