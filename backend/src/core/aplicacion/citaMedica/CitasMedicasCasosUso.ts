import { ICitasMedicasRepositorio } from '../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { CitaMedicaRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';
import { ICitasMedicasCasosUso } from './ICitasMedicasCasosUso.js';
import { crearErrorDeDominio } from '../../dominio/errores/manejoDeErrores.js';
import { CodigosDeError } from '../../dominio/errores/codigosDeError.enum.js';

export class CitasMedicasCasosUso implements ICitasMedicasCasosUso {
  constructor(private citasMedicasRepositorio: ICitasMedicasRepositorio) {}

  async obtenerCitas(limite?: number): Promise<CitaMedicaRespuestaDTO[]> {
    return await this.citasMedicasRepositorio.obtenerCitas(limite);
  }

  async obtenerCitaPorId(
    idCita: string
  ): Promise<CitaMedicaRespuestaDTO | null> {
    const citaEncontrada = await this.citasMedicasRepositorio.obtenerCitaPorId(
      idCita
    );

    if (!citaEncontrada) {
      throw crearErrorDeDominio(CodigosDeError.CITA_NO_EXISTE);
    }

    return citaEncontrada;
  }

  async eliminarCita(idCita: string): Promise<void> {
    const validarExistencia = await this.obtenerCitaPorId(idCita);

    if (!validarExistencia) {
      throw crearErrorDeDominio(CodigosDeError.CITA_NO_EXISTE);
    }

    await this.citasMedicasRepositorio.eliminarCita(idCita);
  }
}
