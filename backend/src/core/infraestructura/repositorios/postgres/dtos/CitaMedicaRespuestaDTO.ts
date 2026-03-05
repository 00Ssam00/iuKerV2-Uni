export interface CitaMedicaRespuestaDTO {
  idCita: string;
  paciente: string;
  tipoDocPaciente: string;
  numeroDocPaciente: string;
  medico: string;
  ubicacion: string;
  consultorio: string;
  fecha: string;
  horaInicio: string;
  codigoEstadoCita: number;
  estadoCita: string;
  idCitaAnterior: string | null;
}
