export interface JornadaDTO {
  inicioJornada: string;
  finJornada: string;
}

export interface DisponibilidadRespuestaDTO {
  jornadas: JornadaDTO[];
  slotsDisponibles: string[];
  slotsOcupados: string[];
}

export interface ProximoDisponibleRespuestaDTO {
  medico: string;
  fecha: string;
  horaInicio: string;
}
