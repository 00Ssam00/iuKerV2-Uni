import { IPaciente } from '../../dominio/paciente/IPaciente.js';
import { pacienteRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/pacienteRespuestaDTO.js';

export interface IPacientesCasosUso {
  obtenerPacientes(limite?: number): Promise<pacienteRespuestaDTO[]>;
  obtenerPacientePorId(numeroDoc: string): Promise<pacienteRespuestaDTO | null>;
  crearPaciente(nuevoPaciente: IPaciente): Promise<pacienteRespuestaDTO | null>;
  actualizarPaciente(numeroDoc: string, paciente: IPaciente): Promise<pacienteRespuestaDTO | null>;
  borrarPaciente(numeroDoc: string): Promise<void>;
}
