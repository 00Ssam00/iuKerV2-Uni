import { IPaciente } from './IPaciente.js';

export class Paciente implements IPaciente {
  public numeroDoc: string;
  public tipoDoc: number;
  public nombre: string;
  public apellido: string;
  public fechaNacimiento: Date;
  public sexo: string;
  public email: string;
  public telefono: string;
  public direccion: string;

  constructor(data: IPaciente) {
    this.numeroDoc = data.numeroDoc;
    this.tipoDoc = data.tipoDoc;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.fechaNacimiento = data.fechaNacimiento;
    this.sexo = data.sexo;
    this.email = data.email;
    this.telefono = data.telefono;
    this.direccion = data.direccion;
  }
}
