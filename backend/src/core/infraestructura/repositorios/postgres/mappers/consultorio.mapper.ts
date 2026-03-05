import { ConsultorioRespuestaDTO } from '../dtos/consultorioRespuestaDTO.js';
export interface consultorioFila {
    idConsultorio: string;
    ubicacion: string;
}

export function mapFilaConsultorio(fila:consultorioFila):ConsultorioRespuestaDTO {
    return {
        idConsultorio: fila.idConsultorio,
        ubicacion: fila.ubicacion,
    };
}
