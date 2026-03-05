import { FastifyInstance } from 'fastify';
import { IAsignacionMedicoRepositorio } from '../../dominio/asignacionMedico/IAsignacionMedicoRepositorio.js';
import { AsignacionesControlador } from '../controladores/AsignacionesControlador.js';
import { AsignacionMedicoRepositorio } from '../repositorios/postgres/AsignacionMedicoRepositorio.js';
import { AsignacionCasosUso } from '../../aplicacion/servicios/asignacionMedico/AsignacionCasosUso.js';
import { IMedicosRepositorio } from '../../dominio/medico/IMedicosRepositorio.js';
import { IConsultoriosRepositorio } from '../../dominio/consultorio/IConsultoriosRepositorio.js';
import { MedicosRepositorio } from '../repositorios/postgres/MedicosRepositorio.js';
import { ConsultorioRepositorio } from '../repositorios/postgres/ConsultoriosRepositorio.js';

function asignacionesEnrutador(
  app: FastifyInstance,
  asignacionesControlador: AsignacionesControlador
) {
  app.post('/asignaciones', asignacionesControlador.crearAsignacion);
  app.delete(
    '/asignaciones/:tarjetaProfesionalMedico',
    asignacionesControlador.eliminarAsignación
  );
}

export async function construirAsignacionesEnrutador(app: FastifyInstance) {
  const asignacionRepositorio: IAsignacionMedicoRepositorio =
    new AsignacionMedicoRepositorio();
  const medicoRepositorio: IMedicosRepositorio = new MedicosRepositorio();
  const consultorioRepositorio: IConsultoriosRepositorio =
    new ConsultorioRepositorio();

  const asignacionCasosUso = new AsignacionCasosUso(
    asignacionRepositorio,
    medicoRepositorio,
    consultorioRepositorio
  );
  const asignacionesControlador = new AsignacionesControlador(
    asignacionCasosUso
  );

  asignacionesEnrutador(app, asignacionesControlador);
}
