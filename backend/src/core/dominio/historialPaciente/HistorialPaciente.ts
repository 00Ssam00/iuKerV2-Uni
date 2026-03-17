import { IHistorialPaciente } from './IHistorialPaciente.js';

export class HistorialPaciente implements IHistorialPaciente {
  readonly idCita: string;
  readonly diagnostico: string;
  readonly descripcion?: string | null;

  constructor(datos: IHistorialPaciente) {
    this.idCita = datos.idCita;
    this.diagnostico = datos.diagnostico;
    this.descripcion = datos.descripcion ?? null;
  }
}
