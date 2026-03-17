export interface HistorialPacienteRespuestaDTO {
  idHistorial: string;
  idCita: string;
  paciente: string;
  medico: string;
  fecha: string;
  diagnostico: string;
  descripcion: string | null;
  fechaRegistro: string;
}
