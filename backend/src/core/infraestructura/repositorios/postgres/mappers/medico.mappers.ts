import { MedicoRepuestaDTO } from "../dtos/MedicoRespuestaDTO.js";

export interface MedicoFila {
    tarjetaProfesional: string;
    tipoDoc: string;
    numeroDoc: string;
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    sexo: string;
    especialidad: string;
    email: string;
    telefono: string;
}

export function mapFilaMedico(fila: MedicoFila): MedicoRepuestaDTO {
    return {
        tarjetaProfesional: fila.tarjetaProfesional,
        tipoDoc: fila.tipoDoc,
        numeroDoc: fila.numeroDoc,
        nombre: fila.nombre,
        apellido: fila.apellido,
        fechaNacimiento: fila.fechaNacimiento,
        sexo: fila.sexo,
        especialidad: fila.especialidad,
        email: fila.email,
        telefono: fila.telefono,
    };
}