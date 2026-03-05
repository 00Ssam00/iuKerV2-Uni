import { conversionAFechaColombia } from '../../../../common/conversionAFechaColombia.js';
import { CitaMedica } from '../../../dominio/citaMedica/CitaMedica.js';
import { ICitasMedicasRepositorio } from '../../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { CodigosDeError } from '../../../dominio/errores/codigosDeError.enum.js';
import { crearErrorDeDominio } from '../../../dominio/errores/manejoDeErrores.js';
import { IMedicosRepositorio } from '../../../dominio/medico/IMedicosRepositorio.js';
import { IPacientesRepositorio } from '../../../dominio/paciente/IPacientesRepositorio.js';
import { citaMedicaSolicitudDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { CitaMedicaRespuestaDTO } from '../../../infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';
import { IAgendamientoCitasCasosUso } from './IAgendamientoCitasCasosUso.js';

export class AgendamientoCitasCasosUso implements IAgendamientoCitasCasosUso {
  constructor(
    private citasMedicasRepositorio: ICitasMedicasRepositorio,
    private medicosRepositorio: IMedicosRepositorio,
    private pacientesRepositorio: IPacientesRepositorio
  ) {}

  async ejecutar(
    datosCitaMedica: citaMedicaSolicitudDTO
  ): Promise<CitaMedicaRespuestaDTO | null> {
    await this.validarPaciente(datosCitaMedica.numeroDocPaciente);
    await this.validarMedico(datosCitaMedica.medico);
    this.validarFechaVigente(datosCitaMedica.fecha, datosCitaMedica.horaInicio);
    await this.validarTurnoMedico(
      datosCitaMedica.medico,
      datosCitaMedica.fecha,
      datosCitaMedica.horaInicio
    );
    await this.validarDisponibilidadMedico(
      datosCitaMedica.medico,
      datosCitaMedica.fecha,
      datosCitaMedica.horaInicio
    );
    await this.validarCitasPaciente(
      datosCitaMedica.tipoDocPaciente,
      datosCitaMedica.numeroDocPaciente,
      datosCitaMedica.fecha,
      datosCitaMedica.horaInicio
    );

    const citaAgendada = new CitaMedica(datosCitaMedica);

    return await this.citasMedicasRepositorio.agendarCita(citaAgendada);
  }

  private async validarPaciente(idPaciente: string): Promise<void> {
    const paciente = await this.pacientesRepositorio.obtenerPacientePorId(
      idPaciente
    );

    if (!paciente) throw crearErrorDeDominio(CodigosDeError.PACIENTE_NO_EXISTE);
  }

  private async validarMedico(idMedico: string): Promise<void> {
    const medico =
      await this.medicosRepositorio.obtenerMedicoPorTarjetaProfesional(
        idMedico
      );

    if (!medico) throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_EXISTE);
  }

  private validarFechaVigente(fecha: string, horaInicio: string): void {
    const fechaCita = conversionAFechaColombia(fecha, horaInicio);
    if (fechaCita < new Date())
      throw crearErrorDeDominio(CodigosDeError.AGENDADANDO_CITA_EN_EL_PASADO);
  }

  private async validarDisponibilidadMedico(
    medico: string,
    fecha: string,
    horaInicio: string
  ): Promise<void> {
    const medicoDisponible =
      await this.citasMedicasRepositorio.validarDisponibilidadMedico(
        medico,
        fecha,
        horaInicio
      );

    if (medicoDisponible)
      throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_DISPONIBLE);
  }

  private async validarTurnoMedico(
    medico: string,
    fecha: string,
    horaInicio: string
  ): Promise<void> {
    const turnoExistente =
      await this.citasMedicasRepositorio.validarTurnoMedico(
        medico,
        fecha,
        horaInicio
      );

    if (!turnoExistente)
      throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_DISPONIBLE);
  }

  private async validarCitasPaciente(
    tipoDocPaciente: number,
    numeroDocPaciente: string,
    fecha: string,
    horaInicio: string
  ): Promise<void> {
    const validarCitas =
      await this.citasMedicasRepositorio.validarCitasPaciente(
        tipoDocPaciente,
        numeroDocPaciente,
        fecha,
        horaInicio
      );

    if (validarCitas)
      throw crearErrorDeDominio(
        CodigosDeError.PACIENTE_CON_CITA_EN_MISMO_HORARIO
      );
  }
}
