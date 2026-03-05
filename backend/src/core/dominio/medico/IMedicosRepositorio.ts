import { MedicoRepuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/MedicoRespuestaDTO.js';
import { IMedico } from './IMedico.js'

export interface IMedicosRepositorio {
    crearMedico(datosMedico : IMedico) : Promise <MedicoRepuestaDTO>;
    listarMedicos(limite? : number) : Promise <MedicoRepuestaDTO[]>;
    obtenerMedicoPorTarjetaProfesional(tarjetaProfesional : string) : Promise <MedicoRepuestaDTO | null>;
    actualizarMedico(tarjetaProfesional : string, datosMedico : Partial <IMedico>) : Promise <MedicoRepuestaDTO | null>;
    eliminarMedico(tarjetaProfesional : string) : Promise <void>;
};