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
  tipoDoc: number;
  numeroDoc: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexo: string;
  especialidad: string;
  email: string;
  telefono: string;
  horario?: string;
}

export interface MedicoDTO {
  tarjetaProfesional: string;
  tipoDoc: number;
  numeroDoc: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexo: string;
  especialidad: string;
  email: string;
  telefono: string;
}

export interface MedicosApiResponse {
  medicos: Medico[];
  cantidad?: number;
}

export interface Paciente {
  numeroDoc: string;
  tipoDoc: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexo: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface PacienteDTO {
  numeroDoc: string;
  tipoDoc: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexo: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface PacientesApiResponse {
  pacientes: Paciente[];
  cantidadPacientesObtenidos?: number;
}

export interface Consultorio {
  idConsultorio: string;
  ubicacion: string | null;
}

export interface ConsultorioDTO {
  idConsultorio: string;
  ubicacion?: string | null;
}

export interface ConsultoriosApiResponse {
  consultoriosEncontrados: Consultorio[];
  cantidadConsultoriosEncontrados?: number;
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

export interface CitasAgrupadas {
  [grupo: string]: CitaMedica[];
}

export interface Asignacion {
  tarjetaProfesionalMedico: string;
  idConsultorio: string;
  diaSemana: number;
  inicioJornada: string;
  finJornada: string;
}

export interface AsignacionDTO {
  tarjetaProfesionalMedico: string;
  idConsultorio: string;
  diaSemana: number;
  inicioJornada: string;
  finJornada: string;
}
