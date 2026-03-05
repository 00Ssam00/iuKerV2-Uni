import { CitaMedicaRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';

import { ConsultaCitasPacienteRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/ConsultaCitasPacienteRespuestaDTO.js';
import { ICitaMedica } from './ICitaMedica.js';

export interface ICitasMedicasRepositorio {
  obtenerCitas(limite?: number): Promise<CitaMedicaRespuestaDTO[]>;
  obtenerCitaPorId(idCita: string): Promise<CitaMedicaRespuestaDTO | null>;
  agendarCita(datosCitaMedica: ICitaMedica): Promise<CitaMedicaRespuestaDTO | null>;
  eliminarCita(idCita: string): Promise<void>;

  // Métodos para validaciones de traslape
  validarDisponibilidadMedico(
    medico: string,
    fecha: string,
    horaInicio: string,
    idCitaExcluir?: string
  ): Promise<boolean>;

  validarCitasPaciente(
    tipoDocPaciente: number,
    numeroDocPaciente: string,
    fecha: string,
    horaInicio: string,
    idCitaExcluir?: string
  ): Promise<boolean>;

  validarTurnoMedico(medico: string, fecha: string, horaInicio: string): Promise<boolean>;

  // Métodos para reprogramación y cancelación
  reprogramarCita(idCitaAnterior: string, nuevasCitas: ICitaMedica): Promise<CitaMedicaRespuestaDTO | null>;
  cancelarCita(idCita: string): Promise<CitaMedicaRespuestaDTO | null>;
  finalizarCita(idCita: string): Promise<CitaMedicaRespuestaDTO | null>;

  eliminarCitasPorPaciente(tipoDocPaciente: number, numeroDocPaciente: string): Promise<void>;
  obtenerCitasPorPaciente(numeroDoc: string, limite?: number): Promise<ConsultaCitasPacienteRespuestaDTO[]>;
  eliminarCitasPorMedico(tarjetaProfesional : string) : Promise <void>;
}
