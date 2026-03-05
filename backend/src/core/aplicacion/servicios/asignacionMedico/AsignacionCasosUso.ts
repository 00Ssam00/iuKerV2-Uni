import { IAsignacionMedico } from '../../../dominio/asignacionMedico/IAsignacionMedico.js';
import { AsignacionMedico } from '../../../dominio/asignacionMedico/AsignacionMedico.js';
import { IAsignacionCasosUso } from './IAsignacionCasosUso.js';
import { IAsignacionMedicoRepositorio } from '../../../dominio/asignacionMedico/IAsignacionMedicoRepositorio.js';
import { IMedicosRepositorio } from '../../../dominio/medico/IMedicosRepositorio.js';
import { IConsultoriosRepositorio } from '../../../dominio/consultorio/IConsultoriosRepositorio.js';
import { crearErrorDeDominio } from '../../../dominio/errores/manejoDeErrores.js';
import { CodigosDeError } from '../../../dominio/errores/codigosDeError.enum.js';

export class AsignacionCasosUso implements IAsignacionCasosUso {
  constructor(
    private asignacionMedicoRepositorio: IAsignacionMedicoRepositorio,
    private medicoRepositorio: IMedicosRepositorio,
    private consultorioRepositorio: IConsultoriosRepositorio
  ) {}

  async crearAsignacion(nuevaAsignacion: IAsignacionMedico): Promise<string> {
    const medicoExiste =
      await this.medicoRepositorio.obtenerMedicoPorTarjetaProfesional(
        nuevaAsignacion.tarjetaProfesionalMedico
      );
    if (!medicoExiste) {
      throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_EXISTE);
    }

    const consultorioExiste =
      await this.consultorioRepositorio.obtenerConsultorioPorId(
        nuevaAsignacion.idConsultorio
      );
    if (!consultorioExiste) {
      throw crearErrorDeDominio(CodigosDeError.CONSULTORIO_NO_EXISTE);
    }
    //Comprobación de existencia de una asignación identica
    const existeAsignacion =
      await this.asignacionMedicoRepositorio.existeAsignacion(
        nuevaAsignacion.tarjetaProfesionalMedico,
        nuevaAsignacion.idConsultorio,
        nuevaAsignacion.diaSemana,
        nuevaAsignacion.inicioJornada,
        nuevaAsignacion.finJornada
      );
    if (existeAsignacion) {
      throw crearErrorDeDominio(
        CodigosDeError.ASIGNACION_MEDICO_CONSULTORIO_YA_EXISTE
      );
    }

    const consultorioOcupado =
      await this.asignacionMedicoRepositorio.consultorioOcupado(
        nuevaAsignacion.idConsultorio,
        nuevaAsignacion.diaSemana,
        nuevaAsignacion.inicioJornada,
        nuevaAsignacion.finJornada
      );
    if (consultorioOcupado) {
      throw crearErrorDeDominio(CodigosDeError.CONSULTORIO_OCUPADO);
    }

    //creación y persistencia
    const instanciaAsignacion = new AsignacionMedico(nuevaAsignacion);

    const idNuevaAsignacionDTO =
      await this.asignacionMedicoRepositorio.crearAsignacion(
        instanciaAsignacion
      );

    return idNuevaAsignacionDTO.idAsignacion;
  }

  async eliminarAsignacion(tarjetaProfesionalMedico: string): Promise<void> {
    await this.asignacionMedicoRepositorio.eliminarAsignacion(
      tarjetaProfesionalMedico
    );
  }
}
