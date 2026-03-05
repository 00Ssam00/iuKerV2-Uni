import { conversionAFechaColombia } from '../../../../common/conversionAFechaColombia.js';
import { ICitaMedica } from '../../../dominio/citaMedica/ICitaMedica.js';
import { ICitasMedicasRepositorio } from '../../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { IMedicosRepositorio } from '../../../dominio/medico/IMedicosRepositorio.js';
import { citaMedicaSolicitudDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { ICancelacionReprogramacionCitasCasosUso } from './ICancelacionReprogramacionCitasCasosUso.js';
import { estadoCita } from '../../../../common/estadoCita.enum.js';
import { CitaMedicaRespuestaDTO } from '../../../infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';
import { crearErrorDeDominio } from '../../../dominio/errores/manejoDeErrores.js';
import { CodigosDeError } from '../../../dominio/errores/codigosDeError.enum.js';

export class CancelacionReprogramacionCitasCasosUso
  implements ICancelacionReprogramacionCitasCasosUso
{
  constructor(
    private citasMedicasRepositorio: ICitasMedicasRepositorio,
    private medicosRepositorio: IMedicosRepositorio
  ) {}

  async cancelarCita(idCita: string): Promise<CitaMedicaRespuestaDTO | null> {
    // Verificar que la cita existe
    const citaExistente = await this.citasMedicasRepositorio.obtenerCitaPorId(
      idCita
    );

    if (!citaExistente) {
      throw crearErrorDeDominio(CodigosDeError.CITA_NO_EXISTE);
    }

    // Verificar que la cita no esté ya cancelada o finalizada
    if (citaExistente.codigoEstadoCita === estadoCita.CANCELADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_CANCELADA);
    }

    if (citaExistente.codigoEstadoCita === estadoCita.FINALIZADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_FINALIZADA);
    }

    return await this.citasMedicasRepositorio.cancelarCita(idCita);
  }
  // Reprograma una cita existente
  async reprogramarCita(
    idCita: string,
    nuevosDatos: citaMedicaSolicitudDTO
  ): Promise<CitaMedicaRespuestaDTO | null> {
    const citaExistente = await this.citasMedicasRepositorio.obtenerCitaPorId(
      idCita
    );

    const fechaColombia = conversionAFechaColombia(
      nuevosDatos.fecha,
      nuevosDatos.horaInicio
    );
    if (fechaColombia < new Date())
      throw crearErrorDeDominio(CodigosDeError.AGENDADANDO_CITA_EN_EL_PASADO);

    if (!citaExistente) {
      throw crearErrorDeDominio(CodigosDeError.CITA_NO_EXISTE);
    }

    if (citaExistente.codigoEstadoCita === estadoCita.CANCELADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_CANCELADA);
    }

    if (citaExistente.codigoEstadoCita === estadoCita.FINALIZADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_FINALIZADA);
    }
    // verificar que el medico si existe
    const medicoExiste =
      await this.medicosRepositorio.obtenerMedicoPorTarjetaProfesional(
        nuevosDatos.medico
      );
    if (!medicoExiste) {
      throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_EXISTE);
    }
    // Validar disponibilidad del médico (turno asignado)
    const disponible = await this.citasMedicasRepositorio.validarTurnoMedico(
      nuevosDatos.medico,
      nuevosDatos.fecha,
      nuevosDatos.horaInicio
    );

    if (!disponible) {
      throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_DISPONIBLE);
    }
    // Validar traslape del paciente (excluyendo la cita actual)
    const traslapePaciente =
      await this.citasMedicasRepositorio.validarCitasPaciente(
        nuevosDatos.tipoDocPaciente,
        nuevosDatos.numeroDocPaciente,
        nuevosDatos.fecha,
        nuevosDatos.horaInicio,
        idCita
      );

    if (traslapePaciente) {
      throw crearErrorDeDominio(
        CodigosDeError.PACIENTE_CON_CITA_EN_MISMO_HORARIO
      );
    }

    // Validar traslape del médico (excluyendo la cita actual)
    const traslapeMedico =
      await this.citasMedicasRepositorio.validarDisponibilidadMedico(
        nuevosDatos.medico,
        nuevosDatos.fecha,
        nuevosDatos.horaInicio,
        idCita
      );

    if (traslapeMedico) {
      throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_DISPONIBLE);
    }

    // Crear objeto con los nuevos datos de la cita
    const nuevaCita: ICitaMedica = {
      medico: nuevosDatos.medico,
      tipoDocPaciente: nuevosDatos.tipoDocPaciente,
      numeroDocPaciente: nuevosDatos.numeroDocPaciente,
      fecha: nuevosDatos.fecha,
      horaInicio: nuevosDatos.horaInicio,
      estado: estadoCita.ACTIVADA,
      idCitaAnterior: idCita,
    };

    // Reprogramar (marca la anterior como reprogramada y crea la nueva)
    return await this.citasMedicasRepositorio.reprogramarCita(
      idCita,
      nuevaCita
    );
  }
  async finalizarCita(idCita: string): Promise<CitaMedicaRespuestaDTO | null> {
    const cita = await this.citasMedicasRepositorio.obtenerCitaPorId(idCita);

    if (!cita) {
      throw new Error('La cita no existe en el sistema');
    }
    if (cita.codigoEstadoCita === estadoCita.REPROGRAMADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_REPROGRAMADA);
    }
    if (cita?.codigoEstadoCita === estadoCita.CANCELADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_CANCELADA);
    }
    if (cita?.codigoEstadoCita === estadoCita.FINALIZADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_FINALIZADA);
    }
    return await this.citasMedicasRepositorio.finalizarCita(idCita);
  }
}
