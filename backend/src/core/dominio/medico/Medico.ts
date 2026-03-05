import { IMedico } from './IMedico.js';

export class Medico implements IMedico {
    tarjetaProfesional : string;
    tipoDoc : number;
    numeroDoc : string;
    nombre : string;
    apellido : string;
    fechaNacimiento : string;
    sexo : string;
    especialidad : string;
    email : string;
    telefono : string;

    constructor(datosMedico : IMedico){
        this.tarjetaProfesional = datosMedico.tarjetaProfesional
        this.tipoDoc = datosMedico.tipoDoc
        this.numeroDoc = datosMedico.numeroDoc
        this.nombre = datosMedico.nombre
        this.apellido = datosMedico.apellido
        this.fechaNacimiento = datosMedico.fechaNacimiento
        this.sexo = datosMedico.sexo
        this.especialidad = datosMedico.especialidad
        this.email = datosMedico.email
        this.telefono = datosMedico.telefono
    }
};