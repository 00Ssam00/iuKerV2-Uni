export interface CitaMedica {
  idCita: string;
  paciente: string;
  tipoDocPaciente: string;
  numeroDocPaciente: string;
  medico: string;
  medicoTarjeta: string;
  ubicacion: string | null;
  consultorio: string | null;
  fecha: string;
  horaInicio: string;
  codigoEstadoCita: number;
  estadoCita: string;
  idCitaAnterior: string | null;
}

export interface CitasApiResponse {
  cantidadCitas: number;
  citasEncontradas: CitaMedica[];
}

export interface Medico {
  tarjetaProfesional: string;
  nombre: string;
  apellido: string;
}

export interface MedicosApiResponse {
  medicos: Medico[];
}

export interface HistorialEntry {
  idHistorial: string;
  idCita: string;
  paciente: string;
  medico: string;
  fecha: string;
  diagnostico: string;
  descripcion: string | null;
  fechaRegistro: string;
}

export interface HistorialApiResponse {
  cantidadRegistros: number;
  historial: HistorialEntry[];
}

export interface CitaFormData {
  medico: string;
  tipoDocPaciente: string;
  numeroDocPaciente: string;
  fecha: string;
  horaInicio: string;
}

export interface HistorialFormData {
  idCita: string;
  diagnostico: string;
  descripcion: string;
}
