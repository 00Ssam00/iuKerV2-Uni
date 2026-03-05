import { FastifyInstance } from 'fastify';
import { MedicosControlador } from '../controladores/MedicosControlador.js';
import { IMedicosRepositorio } from '../../dominio/medico/IMedicosRepositorio.js';
import { MedicosCasosUso } from '../../aplicacion/medico/MedicosCasosUso.js';
import { MedicosRepositorio } from '../repositorios/postgres/MedicosRepositorio.js';
import { AsignacionMedico } from '../../dominio/asignacionMedico/AsignacionMedico.js';
import { AsignacionMedicoRepositorio } from '../repositorios/postgres/AsignacionMedicoRepositorio.js';
import { CitasMedicasRepositorio } from '../repositorios/postgres/CitasMedicasRepositorio.js';

function medicosEnrutador(
    app : FastifyInstance,
    medicosController : MedicosControlador
) {
    app.get("/medicos", medicosController.listarMedicos);
    app.get("/medicos/:tarjetaProfesional", medicosController.obtenerMedicoPorTarjetaProfesional);
    app.post("/medicos", medicosController.crearMedico);
    app.put("/medicos/:tarjetaProfesional", medicosController.actualizarMedico);
    app.delete("/medicos/:tarjetaProfesional", medicosController.eliminarMedico);
}

export async function construirMedicosEnrutador(app: FastifyInstance){
    const asignacionMedicoRepositorio = new AsignacionMedicoRepositorio();
    const citasMedicasRepositorio = new CitasMedicasRepositorio();
    const medicosRepositorio : IMedicosRepositorio = new MedicosRepositorio();
    const medicosCasosUso = new MedicosCasosUso(medicosRepositorio, asignacionMedicoRepositorio, citasMedicasRepositorio);
    const medicosController = new MedicosControlador(medicosCasosUso);

    medicosEnrutador(app, medicosController);
}