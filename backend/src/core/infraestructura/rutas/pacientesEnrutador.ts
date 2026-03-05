import { FastifyInstance } from 'fastify';
import { PacientesRepositorio } from '../repositorios/postgres/PacientesRepositorio.js';
import { PacientesCasosUso } from '../../aplicacion/paciente/PacientesCasosUso.js';
import { PacientesControlador } from '../controladores/PacientesControlador.js';
import { CitasMedicasRepositorio } from '../repositorios/postgres/CitasMedicasRepositorio.js';
import { ConsultaPacienteCasosUso } from '../../aplicacion/servicios/consultaCitasPaciente/ConsultaCitasPacienteCasosUso.js';

function pacientesEnrutador(app: FastifyInstance, pacientesControlador: PacientesControlador) {
  app.get('/pacientes', pacientesControlador.obtenerPacientes);
  app.get('/pacientes/:numeroDoc', pacientesControlador.obtenerPacientePorId);
  app.get('/pacientes/:numeroDoc/citas', pacientesControlador.obtenerCitasPorPaciente);
  app.post('/pacientes', pacientesControlador.crearPaciente);
  app.put('/pacientes/:numeroDoc', pacientesControlador.actualizarPaciente);
  app.delete('/pacientes/:numeroDoc', pacientesControlador.borrarPaciente);
}

export async function construirPacientesEnrutador(app: FastifyInstance) {
  const pacientesRepositorio = new PacientesRepositorio();
  const citasMedicasRepositorio = new CitasMedicasRepositorio();
  const pacientesCasosUso = new PacientesCasosUso(pacientesRepositorio, citasMedicasRepositorio);
  const consultarCitasPacienteCasosUso = new ConsultaPacienteCasosUso(pacientesRepositorio, citasMedicasRepositorio);

  const pacientesControlador = new PacientesControlador(pacientesCasosUso, consultarCitasPacienteCasosUso);
  pacientesEnrutador(app, pacientesControlador);
}
