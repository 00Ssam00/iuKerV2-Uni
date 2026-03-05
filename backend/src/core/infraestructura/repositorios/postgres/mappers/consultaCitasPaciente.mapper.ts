import { ConsultaCitasPacienteRespuestaDTO } from "../dtos/ConsultaCitasPacienteRespuestaDTO.js";

export interface CitaPacienteFila {
    fecha: string,
    horaInicio: string,
    estado: string,
    nombreMedico: string,
    ubicacion: string,
}

export function mapFilaCitaPaciente(fila: CitaPacienteFila): ConsultaCitasPacienteRespuestaDTO {
    return {
        fecha: fila.fecha,
        horaInicio: fila.horaInicio,
        estado: fila.estado,
        nombreMedico: fila.nombreMedico,
        ubicacion: fila.ubicacion,
    };
}