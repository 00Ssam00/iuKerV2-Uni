import { AsignacionIdRespuestaDTO } from '../dtos/AsignacionRespuestaDTO.js';

export interface AsignacionIdFila {
  id_asignacion: string;
}

export function mapIdFilaAsignacion(
  fila: AsignacionIdFila
): AsignacionIdRespuestaDTO {
  return {
    idAsignacion: fila.id_asignacion,
  };
}
