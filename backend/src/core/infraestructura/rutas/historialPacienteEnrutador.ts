import { FastifyInstance } from 'fastify';
import { HistorialPacienteControlador } from '../controladores/HistorialPacienteControlador.js';
import { HistorialPacienteRepositorio } from '../repositorios/postgres/HistorialPacienteRepositorio.js';
import { CitasMedicasRepositorio } from '../repositorios/postgres/CitasMedicasRepositorio.js';
import { HistorialPacienteCasosUso } from '../../aplicacion/historialPaciente/HistorialPacienteCasosUso.js';

function historialPacienteEnrutador(
  app: FastifyInstance,
  controlador: HistorialPacienteControlador
) {
  app.post('/historial-paciente', controlador.registrarHistorial);
  app.get('/historial-paciente/cita/:idCita', controlador.obtenerHistorialPorCita);
  app.get('/historial-paciente/paciente/:numeroDoc', controlador.obtenerHistorialPorPaciente);
}

export function construirHistorialEnrutador(app: FastifyInstance) {
  const historialRepositorio = new HistorialPacienteRepositorio();
  const citasRepositorio = new CitasMedicasRepositorio();
  const casosUso = new HistorialPacienteCasosUso(historialRepositorio, citasRepositorio);
  const controlador = new HistorialPacienteControlador(casosUso);
  historialPacienteEnrutador(app, controlador);
}
