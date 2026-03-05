import { CitaMedicaRespuestaDTO } from '../dtos/CitaMedicaRespuestaDTO.js';

export interface CitaMedicaFila {
  idCita: string;
  paciente: string;
  tipoDocPaciente: string;
  numeroDocPaciente: string;
  medico: string;
  ubicacion: string;
  consultorio: string;
  fecha: string;
  horaInicio: string;
  estado: number;
  estadoCita: string;
  idCitaAnterior: string | null;
}

export function mapFilaCitaMedica(fila: CitaMedicaFila): CitaMedicaRespuestaDTO {
  return {
    idCita: fila.idCita,
    paciente: fila.paciente,
    tipoDocPaciente: fila.tipoDocPaciente,
    numeroDocPaciente: fila.numeroDocPaciente,
    medico: fila.medico,
    ubicacion: fila.ubicacion,
    consultorio: fila.consultorio,
    fecha: fila.fecha,
    horaInicio: fila.horaInicio,
    codigoEstadoCita: fila.estado,
    estadoCita: fila.estadoCita,
    idCitaAnterior: fila.idCitaAnterior,
  };
}
