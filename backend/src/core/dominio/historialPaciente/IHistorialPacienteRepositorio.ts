import { HistorialPacienteRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/HistorialPacienteRespuestaDTO.js';
import { IHistorialPaciente } from './IHistorialPaciente.js';

export interface IHistorialPacienteRepositorio {
  crearHistorial(datos: IHistorialPaciente): Promise<HistorialPacienteRespuestaDTO | null>;
  obtenerHistorialPorCita(idCita: string): Promise<HistorialPacienteRespuestaDTO | null>;
  obtenerHistorialPorPaciente(numeroDoc: string): Promise<HistorialPacienteRespuestaDTO[]>;
}
