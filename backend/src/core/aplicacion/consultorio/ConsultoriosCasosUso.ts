import { IConsultorio } from '../../dominio/consultorio/IConsultorio.js';
import { IConsultoriosRepositorio } from '../../dominio/consultorio/IConsultoriosRepositorio.js';
import { ConsultorioRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/consultorioRespuestaDTO.js';
import { IConsultorioCasosUso } from './IConsultoriosCasosUso.js';
import { CodigosDeError } from '../../dominio/errores/codigosDeError.enum.js';
import { crearErrorDeDominio } from '../../dominio/errores/manejoDeErrores.js';

export class ConsultorioCasosUso implements IConsultorioCasosUso {
  constructor(private consultorioRepositorio: IConsultoriosRepositorio) {}

  async agregarConsultorio(datosConsultorio: IConsultorio): Promise<ConsultorioRespuestaDTO | null> {
    const existeConsultorio = await this.consultorioRepositorio.obtenerConsultorioPorId(datosConsultorio.idConsultorio);

    if (existeConsultorio) {
      throw crearErrorDeDominio(CodigosDeError.CONCULTORIO_YA_EXISTE);
    }

    const idNuevoConsultorio = await this.consultorioRepositorio.agregarConsultorio(datosConsultorio);
    return idNuevoConsultorio;
  }

  async listarConsultorios(limite?: number): Promise<ConsultorioRespuestaDTO[]> {
    return await this.consultorioRepositorio.listarConsultorios(limite);
  }

  async obtenerConsultorioPorId(idConsultorio: string): Promise<ConsultorioRespuestaDTO | null> {
    const consultorioObtenido = await this.consultorioRepositorio.obtenerConsultorioPorId(idConsultorio);

    if (!consultorioObtenido) {
      throw crearErrorDeDominio(CodigosDeError.CONSULTORIO_NO_EXISTE);
    }

    return consultorioObtenido;
  }

  async actualizarConsultorio(
    idConsultorio: string,
    consultorio: IConsultorio
  ): Promise<ConsultorioRespuestaDTO | null> {
    const existeConsultorio = await this.consultorioRepositorio.obtenerConsultorioPorId(idConsultorio);

    if (!existeConsultorio) {
      throw crearErrorDeDominio(CodigosDeError.CONSULTORIO_NO_EXISTE);
    }

    const consultorioActualizado = await this.consultorioRepositorio.actualizarConsultorio(idConsultorio, consultorio);
    return consultorioActualizado || null;
  }

  async eliminarConsultorio(idConsultorio: string): Promise<void> {
    const existeConsultorio = await this.consultorioRepositorio.obtenerConsultorioPorId(idConsultorio);

    if (!existeConsultorio) {
      throw crearErrorDeDominio(CodigosDeError.CONSULTORIO_NO_EXISTE);
    }

    await this.consultorioRepositorio.eliminarConsultorio(idConsultorio);
  }
}
