import { FastifyInstance } from 'fastify';
import { CitasMedicasControlador } from '../controladores/CitasMedicasControlador.js';
import { CitasMedicasRepositorio } from '../repositorios/postgres/CitasMedicasRepositorio.js';
import { CitasMedicasCasosUso } from '../../aplicacion/citaMedica/CitasMedicasCasosUso.js';
import { CancelacionReprogramacionCitasCasosUso } from '../../aplicacion/servicios/cancelacionReprogramacionCita/CancelacionReprogramacionCitasCasosUso.js';
import { AgendamientoCitasCasosUso } from '../../aplicacion/servicios/agendamientoCitasMedicas/AgendamientoCitasCasosUso.js';
import { ConsultaDisponibilidadCasosUso } from '../../aplicacion/servicios/consultaDisponibilidad/ConsultaDisponibilidadCasosUso.js';
import { MedicosRepositorio } from '../repositorios/postgres/MedicosRepositorio.js';
import { PacientesRepositorio } from '../repositorios/postgres/PacientesRepositorio.js';

function citasMedicasEnrutador(app: FastifyInstance, citasMedicasController: CitasMedicasControlador) {
  // Rutas específicas antes de las paramétricas para evitar colisiones
  app.get('/citas-medicas/horario', citasMedicasController.obtenerHorarioMedico);
  app.get('/citas-medicas/disponibilidad', citasMedicasController.obtenerDisponibilidad);
  app.get('/citas-medicas/proximo-disponible', citasMedicasController.obtenerProximoDisponible);
  app.get('/citas-medicas', citasMedicasController.obtenerCitas);
  app.get('/citas-medicas/:idCita', citasMedicasController.obtenerCitaPorId);
  app.post('/citas-medicas', citasMedicasController.agendarCita);
  app.put('/citas-medicas/reprogramacion/:idCita', citasMedicasController.reprogramarCita);
  app.put('/citas-medicas/finalizacion/:idCita', citasMedicasController.finalizarCita);
  app.put('/citas-medicas/cancelacion/:idCita', citasMedicasController.cancelarCita);
  app.delete('/citas-medicas/eliminacion/:idCita', citasMedicasController.eliminarCita);
}

export async function construirCitasEnrutador(app: FastifyInstance) {
  const citasMedicasRepositorio = new CitasMedicasRepositorio();
  const citasCasosUso = new CitasMedicasCasosUso(citasMedicasRepositorio);

  const medicoRepositorio = new MedicosRepositorio();
  const pacientesRepositorio = new PacientesRepositorio();

  const cancelacionReprogramacionCasosUso = new CancelacionReprogramacionCitasCasosUso(
    citasMedicasRepositorio,
    medicoRepositorio
  );

  const agendamientoCitaCasosUso = new AgendamientoCitasCasosUso(
    citasMedicasRepositorio,
    medicoRepositorio,
    pacientesRepositorio
  );

  const consultaDisponibilidadCasosUso = new ConsultaDisponibilidadCasosUso(
    citasMedicasRepositorio,
    medicoRepositorio,
  );

  const citasMedicasController = new CitasMedicasControlador(
    citasCasosUso,
    cancelacionReprogramacionCasosUso,
    agendamientoCitaCasosUso,
    consultaDisponibilidadCasosUso,
  );
  citasMedicasEnrutador(app, citasMedicasController);
}
