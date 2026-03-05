import { pacienteRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/pacienteRespuestaDTO.js';
import { IPaciente } from './IPaciente.js';

export interface IPacientesRepositorio {
  existePacientePorDocumento(numeroDoc: string, tipoDoc: number): Promise<boolean>;
  obtenerPacientes(limite?: number): Promise<pacienteRespuestaDTO[]>;
  obtenerPacientePorId(numeroDoc: string): Promise<pacienteRespuestaDTO | null>;
  crearPaciente(nuevoPaciente: IPaciente): Promise<pacienteRespuestaDTO | null>;
  actualizarPaciente(numeroDoc: string, paciente: IPaciente): Promise<pacienteRespuestaDTO | null>;
  borrarPaciente(numeroDoc: string): Promise<void>;
}
