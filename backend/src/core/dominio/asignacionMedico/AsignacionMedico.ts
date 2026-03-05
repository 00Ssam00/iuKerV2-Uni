import { IAsignacionMedico } from './IAsignacionMedico.js';

export class AsignacionMedico implements IAsignacionMedico {
  public tarjetaProfesionalMedico: string;
  public idConsultorio: string;
  public diaSemana: number;
  public inicioJornada: string;
  public finJornada: string;

  constructor(data: IAsignacionMedico) {
    this.tarjetaProfesionalMedico = data.tarjetaProfesionalMedico;
    this.idConsultorio = data.idConsultorio;
    this.diaSemana = data.diaSemana;
    this.inicioJornada = data.inicioJornada;
    this.finJornada = data.finJornada;
  }
}
