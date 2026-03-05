import { CitaMedicaRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';

export interface ICitasMedicasCasosUso {
  obtenerCitas(limite?: number): Promise<CitaMedicaRespuestaDTO[]>;
  obtenerCitaPorId(idCita: string): Promise<CitaMedicaRespuestaDTO | null>;
  eliminarCita(idCita: string): Promise<void>;
}
