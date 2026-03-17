import { HistorialPacienteRespuestaDTO } from '../dtos/HistorialPacienteRespuestaDTO.js';

export interface HistorialPacienteFila {
  idHistorial: string;
  idCita: string;
  paciente: string;
  medico: string;
  fecha: string;
  diagnostico: string;
  descripcion: string | null;
  fechaRegistro: string;
}

export function mapFilaHistorialPaciente(fila: HistorialPacienteFila): HistorialPacienteRespuestaDTO {
  return {
    idHistorial: fila.idHistorial,
    idCita: fila.idCita,
    paciente: fila.paciente,
    medico: fila.medico,
    fecha: fila.fecha,
    diagnostico: fila.diagnostico,
    descripcion: fila.descripcion,
    fechaRegistro: fila.fechaRegistro,
  };
}
