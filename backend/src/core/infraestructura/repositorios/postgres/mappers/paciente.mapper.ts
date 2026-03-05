import { pacienteRespuestaDTO } from '../dtos/pacienteRespuestaDTO.js';

export interface pacienteFila {
  tipoDocPaciente: number;
  numeroDocPaciente: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexo: string;
  email: string;
  telefono: string;
  direccion: string;
}

export function mapFilaPaciente(fila: pacienteFila): pacienteRespuestaDTO {
  return {
    tipoDocPaciente: fila.tipoDocPaciente,
    numeroDocPaciente: fila.numeroDocPaciente,
    nombre: fila.nombre,
    apellido: fila.apellido,
    fechaNacimiento: fila.fechaNacimiento,
    sexo: fila.sexo,
    email: fila.email,
    telefono: fila.telefono,
    direccion: fila.direccion,
  };
}
