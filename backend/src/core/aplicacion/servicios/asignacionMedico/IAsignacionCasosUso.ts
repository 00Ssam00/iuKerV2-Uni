import { IAsignacionMedico } from '../../../dominio/asignacionMedico/IAsignacionMedico.js';

export interface IAsignacionCasosUso {
  crearAsignacion(nuevaAsignacion: IAsignacionMedico): Promise<string>;

  eliminarAsignacion(tarjetaProfesionalMedico: string): Promise<void>;
}
