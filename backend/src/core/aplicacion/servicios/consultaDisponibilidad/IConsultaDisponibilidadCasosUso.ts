import { DisponibilidadRespuestaDTO, ProximoDisponibleRespuestaDTO } from '../../../infraestructura/repositorios/postgres/dtos/DisponibilidadRespuestaDTO.js';

export interface IConsultaDisponibilidadCasosUso {
  obtenerDisponibilidad(medico: string, fecha: string): Promise<DisponibilidadRespuestaDTO>;
  obtenerProximoDisponible(): Promise<ProximoDisponibleRespuestaDTO | null>;
  obtenerHorarioMedico(medico: string): Promise<{ diaSemana: number; inicioJornada: string; finJornada: string }[]>;
}
