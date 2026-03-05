import { IPacientesCasosUso } from './IPacientesCasosUso.js';
import { IPaciente } from '../../dominio/paciente/IPaciente.js';
import { Paciente } from '../../dominio/paciente/Paciente.js';
import { IPacientesRepositorio } from '../../dominio/paciente/IPacientesRepositorio.js';
import { ICitasMedicasRepositorio } from '../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { pacienteRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/pacienteRespuestaDTO.js';
import { crearErrorDeDominio } from '../../dominio/errores/manejoDeErrores.js';
import { CodigosDeError } from '../../dominio/errores/codigosDeError.enum.js';

export class PacientesCasosUso implements IPacientesCasosUso {
  constructor(
    private pacientesRepositorio: IPacientesRepositorio,
    private citasMedicasRepositorio: ICitasMedicasRepositorio
  ) {}

  async obtenerPacientes(limite?: number): Promise<pacienteRespuestaDTO[]> {
    return await this.pacientesRepositorio.obtenerPacientes(limite);
  }

  async obtenerPacientePorId(
    numeroDoc: string
  ): Promise<pacienteRespuestaDTO | null> {
    const pacienteObtenido =
      await this.pacientesRepositorio.obtenerPacientePorId(numeroDoc);

    if (!pacienteObtenido) {
      throw crearErrorDeDominio(CodigosDeError.PACIENTE_NO_EXISTE);
    }

    return pacienteObtenido;
  }

  async crearPaciente(
    nuevoPaciente: IPaciente
  ): Promise<pacienteRespuestaDTO | null> {
    const instanciaPaciente = new Paciente(nuevoPaciente);

    const existePaciente =
      await this.pacientesRepositorio.existePacientePorDocumento(
        nuevoPaciente.numeroDoc,
        nuevoPaciente.tipoDoc
      );

    if (existePaciente) {
      throw crearErrorDeDominio(CodigosDeError.PACIENTE_YA_EXISTE);
    }

    const pacienteCreado = await this.pacientesRepositorio.crearPaciente(
      instanciaPaciente
    );
    return pacienteCreado;
  }

  async actualizarPaciente(
    numeroDoc: string,
    paciente: Paciente
  ): Promise<pacienteRespuestaDTO | null> {
    const pacienteExiste = await this.pacientesRepositorio.obtenerPacientePorId(
      numeroDoc
    );

    if (!pacienteExiste) {
      throw crearErrorDeDominio(CodigosDeError.PACIENTE_NO_EXISTE);
    }

    const pacienteActualizado =
      await this.pacientesRepositorio.actualizarPaciente(numeroDoc, paciente);
    return pacienteActualizado || null;
  }

  async borrarPaciente(numeroDocPaciente: string): Promise<void> {
    const datosCitaAEliminar = await this.obtenerPacientePorId(
      numeroDocPaciente
    );

    if (datosCitaAEliminar?.tipoDocPaciente) {
      await this.citasMedicasRepositorio.eliminarCitasPorPaciente(
        datosCitaAEliminar.tipoDocPaciente,
        numeroDocPaciente
      );
    }
    await this.pacientesRepositorio.borrarPaciente(numeroDocPaciente);
  }
}
