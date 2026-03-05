import { MedicoSolicitudDTO, MedicoActualizarSolicitudDTO } from "../../infraestructura/esquemas/medicoEsquema.js";
import { MedicoRepuestaDTO } from "../../infraestructura/repositorios/postgres/dtos/MedicoRespuestaDTO.js";

export interface IMedicosCasosUso {
    crearMedico(datosMedico : MedicoSolicitudDTO) : Promise <MedicoRepuestaDTO>;
    listarMedicos(limite? : number) : Promise <MedicoRepuestaDTO[]>;
    obtenerMedicoPorTarjetaProfesional(tarjetaProfesional : string) : Promise <MedicoRepuestaDTO | null>;
    actualizarMedico(tarjetaProfesional : string, datosMedico : MedicoActualizarSolicitudDTO) : Promise <MedicoRepuestaDTO | null>;
    eliminarMedico(tarjetaProfesional : string) : Promise <void>;
}