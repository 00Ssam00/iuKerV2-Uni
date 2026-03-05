import { ConsultaCitasPacienteRespuestaDTO } from '../../../infraestructura/repositorios/postgres/dtos/ConsultaCitasPacienteRespuestaDTO.js';

export interface IConsultaCitasPacienteCasosUso {
  ejecutarServicio(
    numeroDocPaciente: string,
    limite?: number
  ): Promise<ConsultaCitasPacienteRespuestaDTO[]>;
}
