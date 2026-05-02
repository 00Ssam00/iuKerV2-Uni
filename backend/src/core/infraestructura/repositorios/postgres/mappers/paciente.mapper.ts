import { pacienteRespuestaDTO } from '../dtos/pacienteRespuestaDTO.js';

export interface pacienteFila {
  tipoDoc: string;
  tipoDocId: number;
  numeroDoc: string;
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
    tipoDoc: fila.tipoDoc,
    tipoDocId: fila.tipoDocId,
    numeroDoc: fila.numeroDoc,
    nombre: fila.nombre,
    apellido: fila.apellido,
    fechaNacimiento: fila.fechaNacimiento,
    sexo: fila.sexo,
    email: fila.email,
    telefono: fila.telefono,
    direccion: fila.direccion,
  };
}
