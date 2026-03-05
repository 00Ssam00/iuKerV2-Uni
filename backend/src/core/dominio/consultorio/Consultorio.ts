import { IConsultorio } from './IConsultorio.js';

export class Consultorio implements IConsultorio{
  idConsultorio: string;
  ubicacion?: string | null | undefined;
  constructor(datosConsultorio: IConsultorio){
    this.idConsultorio = datosConsultorio.idConsultorio;
    this.ubicacion = datosConsultorio.ubicacion;
  }
}