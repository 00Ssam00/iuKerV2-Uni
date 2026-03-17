import { IHistorialPacienteRepositorio } from '../../dominio/historialPaciente/IHistorialPacienteRepositorio.js';
import { ICitasMedicasRepositorio } from '../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { HistorialPaciente } from '../../dominio/historialPaciente/HistorialPaciente.js';
import { HistorialPacienteRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/HistorialPacienteRespuestaDTO.js';
import { historialSolicitudDTO } from '../../infraestructura/esquemas/historialPacienteEsquema.js';
import { IHistorialPacienteCasosUso } from './IHistorialPacienteCasosUso.js';
import { crearErrorDeDominio } from '../../dominio/errores/manejoDeErrores.js';
import { CodigosDeError } from '../../dominio/errores/codigosDeError.enum.js';
import { estadoCita } from '../../../common/estadoCita.enum.js';

export class HistorialPacienteCasosUso implements IHistorialPacienteCasosUso {
  constructor(
    private readonly historialRepositorio: IHistorialPacienteRepositorio,
    private readonly citasRepositorio: ICitasMedicasRepositorio
  ) {}

  async registrarHistorial(
    datos: historialSolicitudDTO
  ): Promise<HistorialPacienteRespuestaDTO | null> {
    const cita = await this.citasRepositorio.obtenerCitaPorId(datos.idCita);

    if (!cita) {
      throw crearErrorDeDominio(CodigosDeError.CITA_NO_EXISTE);
    }

    if (cita.codigoEstadoCita !== estadoCita.FINALIZADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_NO_FINALIZADA_PARA_HISTORIAL);
    }

    const historialExistente = await this.historialRepositorio.obtenerHistorialPorCita(datos.idCita);

    if (historialExistente) {
      throw crearErrorDeDominio(CodigosDeError.HISTORIAL_YA_EXISTE);
    }

    const entidad = new HistorialPaciente({
      idCita: datos.idCita,
      diagnostico: datos.diagnostico,
      descripcion: datos.descripcion ?? null,
    });
    return await this.historialRepositorio.crearHistorial(entidad);
  }

  async obtenerHistorialPorCita(
    idCita: string
  ): Promise<HistorialPacienteRespuestaDTO | null> {
    const historial = await this.historialRepositorio.obtenerHistorialPorCita(idCita);

    if (!historial) {
      throw crearErrorDeDominio(CodigosDeError.HISTORIAL_NO_EXISTE);
    }

    return historial;
  }

  async obtenerHistorialPorPaciente(
    numeroDoc: string
  ): Promise<HistorialPacienteRespuestaDTO[]> {
    return await this.historialRepositorio.obtenerHistorialPorPaciente(numeroDoc);
  }
}
