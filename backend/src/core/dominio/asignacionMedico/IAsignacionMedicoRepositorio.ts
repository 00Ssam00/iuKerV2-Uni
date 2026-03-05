import { IAsignacionMedico } from './IAsignacionMedico.js';
import { AsignacionIdRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/AsignacionRespuestaDTO.js';

export interface IAsignacionMedicoRepositorio {
  crearAsignacion(
    nuevaAsignacion: IAsignacionMedico
  ): Promise<AsignacionIdRespuestaDTO>;

  existeAsignacion(
    tarjetaProfesionalMedico: string,
    idConsultorio: string,
    diaSemana: number,
    inicioJornada: string,
    finJornada: string
  ): Promise<boolean>;

  consultorioOcupado(
    idConsultorio: string,
    diaSemana: number,
    inicio_jornada: string,
    fin_jornada: string
  ): Promise<boolean>;

  eliminarAsignacion(tarjetaProfesionalMedico: string): Promise<void>;
}
