import { IConsultaCitasPacienteCasosUso } from './IConsultaCitasPacienteCasosUso.js';
import { IPacientesRepositorio } from '../../../dominio/paciente/IPacientesRepositorio.js';
import { ICitasMedicasRepositorio } from '../../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { crearErrorDeDominio } from '../../../dominio/errores/manejoDeErrores.js';
import { CodigosDeError } from '../../../dominio/errores/codigosDeError.enum.js';
import { ConsultaCitasPacienteRespuestaDTO } from '../../../infraestructura/repositorios/postgres/dtos/ConsultaCitasPacienteRespuestaDTO.js';

export class ConsultaPacienteCasosUso
  implements IConsultaCitasPacienteCasosUso
{
  constructor(
    private pacientesRepositorio: IPacientesRepositorio,
    private citasMedicasRepositorio: ICitasMedicasRepositorio
  ) {}

  async ejecutarServicio(
    numeroDocPaciente: string,
    limite?: number
  ): Promise<ConsultaCitasPacienteRespuestaDTO[]> {
    const paciente = await this.pacientesRepositorio.obtenerPacientePorId(
      numeroDocPaciente
    );

    if (!paciente) {
      throw crearErrorDeDominio(CodigosDeError.PACIENTE_NO_EXISTE);
    }

    const citasPorPaciente =
      await this.citasMedicasRepositorio.obtenerCitasPorPaciente(
        numeroDocPaciente,
        limite
      );

    if (limite) {
      return citasPorPaciente.slice(0, limite);
    }
    return citasPorPaciente;
  }
}
