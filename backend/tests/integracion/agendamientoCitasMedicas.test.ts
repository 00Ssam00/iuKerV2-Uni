import { jest } from '@jest/globals';
import { AgendamientoCitasCasosUso } from '../../src/core/aplicacion/servicios/agendamientoCitasMedicas/AgendamientoCitasCasosUso.js';
import { ICitasMedicasRepositorio } from '../../src/core/dominio/citaMedica/ICitasMedicasRepositorio.js';
import { IMedicosRepositorio } from '../../src/core/dominio/medico/IMedicosRepositorio.js';
import { IPacientesRepositorio } from '../../src/core/dominio/paciente/IPacientesRepositorio.js';
import { CitaMedicaRespuestaDTO } from '../../src/core/infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';
import { citaMedicaSolicitudDTO } from '../../src/core/infraestructura/esquemas/citaMedicaEsquema.js';
import { CodigosDeError } from '../../src/core/dominio/errores/codigosDeError.enum.js';

describe('Pruebas de Integración para el servicio de Agendamiento Citas Médicas', () => {
  let citasMedicasRepoMock: jest.Mocked<ICitasMedicasRepositorio>;
  let medicosRepoMock: jest.Mocked<IMedicosRepositorio>;
  let pacientesRepoMock: jest.Mocked<IPacientesRepositorio>;
  let agendamientoCasosUso: AgendamientoCitasCasosUso;

  beforeEach(() => {
    citasMedicasRepoMock = {
      agendarCita: jest.fn(),
      validarDisponibilidadMedico: jest.fn(),
      validarTurnoMedico: jest.fn(),
      validarCitasPaciente: jest.fn(),
      obtenerCitas: jest.fn(),
      obtenerCitaPorId: jest.fn(),
      eliminarCita: jest.fn(),
      reprogramarCita: jest.fn(),
      cancelarCita: jest.fn(),
      finalizarCita: jest.fn(),
      eliminarCitasPorPaciente: jest.fn(),
      obtenerCitasPorPaciente: jest.fn(),
      eliminarCitasPorMedico: jest.fn(),
    }

    medicosRepoMock = {
      obtenerMedicoPorTarjetaProfesional: jest.fn(),
      actualizarMedico: jest.fn(),
      crearMedico: jest.fn(),
      eliminarMedico: jest.fn(),
      listarMedicos: jest.fn(),
    }

    pacientesRepoMock = {
      obtenerPacientePorId: jest.fn(),
      actualizarPaciente: jest.fn(),
      borrarPaciente: jest.fn(),
      crearPaciente: jest.fn(),
      existePacientePorDocumento: jest.fn(),
      obtenerPacientes: jest.fn(),
    }

    agendamientoCasosUso = new AgendamientoCitasCasosUso(
      citasMedicasRepoMock,
      medicosRepoMock,
      pacientesRepoMock
    );
  });

  test('Agendamiento de cita exitoso', async () => {
    const datosCita: citaMedicaSolicitudDTO = {
      medico: 'MP001',
      tipoDocPaciente: 1,
      numeroDocPaciente: '100001',
      fecha: '2025-11-25',
      horaInicio: '09:30:00',
    };

    pacientesRepoMock.obtenerPacientePorId.mockResolvedValue({
      tipoDoc: datosCita.tipoDocPaciente,
      numeroDoc: datosCita.numeroDocPaciente,
      nombre: 'Juan',
      apellido: 'Pérez',
    } as any);

    medicosRepoMock.obtenerMedicoPorTarjetaProfesional.mockResolvedValue({
      tarjetaProfesional: datosCita.medico,
      nombre: 'Carlos',
      apellido: 'Rodríguez',
    } as any);


    citasMedicasRepoMock.validarDisponibilidadMedico.mockResolvedValue(false);
    citasMedicasRepoMock.validarTurnoMedico.mockResolvedValue(true);
    citasMedicasRepoMock.validarCitasPaciente.mockResolvedValue(false);

    const citaAgendada: CitaMedicaRespuestaDTO = {
      idCita: '12ea390d-de71-4a28-a538-66e378482d3f',
      medico: datosCita.medico,
      tipoDocPaciente: datosCita.tipoDocPaciente,
      numeroDocPaciente: datosCita.numeroDocPaciente,
      fecha: datosCita.fecha,
      horaInicio: datosCita.horaInicio,
      codigoEstadoCita: 1,
      estadoCita: 'Activa',
      paciente: 'Juan Pérez',
      consultorio: null,
      idCitaAnterior: null,
    } as unknown as CitaMedicaRespuestaDTO;

    citasMedicasRepoMock.agendarCita.mockResolvedValue(citaAgendada);

    const resultado = await agendamientoCasosUso.ejecutar(datosCita);

    expect(resultado).toEqual(citaAgendada);
    expect(pacientesRepoMock.obtenerPacientePorId).toHaveBeenCalledWith(datosCita.numeroDocPaciente);
    expect(medicosRepoMock.obtenerMedicoPorTarjetaProfesional).toHaveBeenCalledWith(datosCita.medico);
    expect(citasMedicasRepoMock.validarTurnoMedico).toHaveBeenCalledWith(
      datosCita.medico,
      datosCita.fecha,
      datosCita.horaInicio
    );
    expect(citasMedicasRepoMock.validarDisponibilidadMedico).toHaveBeenCalledWith(
      datosCita.medico,
      datosCita.fecha,
      datosCita.horaInicio
    );
    expect(citasMedicasRepoMock.validarCitasPaciente).toHaveBeenCalledWith(
      datosCita.tipoDocPaciente,
      datosCita.numeroDocPaciente,
      datosCita.fecha,
      datosCita.horaInicio
    );
    expect(citasMedicasRepoMock.agendarCita).toHaveBeenCalled();
  });

  test('Error si el paciente no existe', async () => {
    const datosCita: citaMedicaSolicitudDTO = {
      medico: 'MP001',
      tipoDocPaciente: 1,
      numeroDocPaciente: '100001',
      fecha: '2025-11-25',
      horaInicio: '08:00:00',
    };

    pacientesRepoMock.obtenerPacientePorId.mockResolvedValue(null);

    let errorCapturado: any = null;

    try {
      await agendamientoCasosUso.ejecutar(datosCita);
    } catch (error) {
      errorCapturado = error;
    }

    expect(errorCapturado).not.toBeNull();
    expect(errorCapturado.codigoInterno).toBe(CodigosDeError.PACIENTE_NO_EXISTE);
    expect(pacientesRepoMock.obtenerPacientePorId).toHaveBeenCalledWith(datosCita.numeroDocPaciente);
    expect(citasMedicasRepoMock.agendarCita).not.toHaveBeenCalled();
  });

  test('Error si el médico no existe', async () => {
    const datosCita: citaMedicaSolicitudDTO = {
      medico: 'MED-NO-EXISTE',
      tipoDocPaciente: 1,
      numeroDocPaciente: '100001',
      fecha: '2025-11-25',
      horaInicio: '08:00:00',
    };

    pacientesRepoMock.obtenerPacientePorId.mockResolvedValue({
      tipoDoc: datosCita.tipoDocPaciente,
      numeroDoc: datosCita.numeroDocPaciente,
      nombre: 'Paciente',
    } as any);

    medicosRepoMock.obtenerMedicoPorTarjetaProfesional.mockResolvedValue(null);

    let errorCapturado: any = null;

    try {
      await agendamientoCasosUso.ejecutar(datosCita);
    } catch (error) {
      errorCapturado = error;
    }

    expect(errorCapturado).not.toBeNull();
    expect(errorCapturado.codigoInterno).toBe(CodigosDeError.MEDICO_NO_EXISTE);
    expect(medicosRepoMock.obtenerMedicoPorTarjetaProfesional).toHaveBeenCalledWith(datosCita.medico);
    expect(citasMedicasRepoMock.agendarCita).not.toHaveBeenCalled();
  });

  test('Error si hay turno ocupado del médico (validarTurnoMedico)', async () => {
    const datosCita: citaMedicaSolicitudDTO = {
      medico: 'MP001',
      tipoDocPaciente: 1,
      numeroDocPaciente: '100001',
      fecha: '2025-11-25',
      horaInicio: '08:00:00',
    };

    pacientesRepoMock.obtenerPacientePorId.mockResolvedValue({ numeroDoc: datosCita.numeroDocPaciente } as any);
    medicosRepoMock.obtenerMedicoPorTarjetaProfesional.mockResolvedValue({ tarjetaProfesional: datosCita.medico } as any);
    citasMedicasRepoMock.validarTurnoMedico.mockResolvedValue(false);

    let errorCapturado: any = null;

    try {
      await agendamientoCasosUso.ejecutar(datosCita);
    } catch (error) {
      errorCapturado = error;
    }

    expect(errorCapturado).not.toBeNull();
    expect(errorCapturado.codigoInterno).toBe(CodigosDeError.MEDICO_NO_DISPONIBLE);
    expect(citasMedicasRepoMock.validarTurnoMedico).toHaveBeenCalledWith(
      datosCita.medico,
      datosCita.fecha,
      datosCita.horaInicio
    );
    expect(citasMedicasRepoMock.agendarCita).not.toHaveBeenCalled();
  });

  test('Error si el paciente ya tiene cita en el mismo horario', async () => {
    const datosCita: citaMedicaSolicitudDTO = {
      medico: 'MP001',
      tipoDocPaciente: 1,
      numeroDocPaciente: '100001',
      fecha: '2025-11-25',
      horaInicio: '08:00:00',
    };

    pacientesRepoMock.obtenerPacientePorId.mockResolvedValue({ numeroDoc: datosCita.numeroDocPaciente } as any);
    medicosRepoMock.obtenerMedicoPorTarjetaProfesional.mockResolvedValue({ tarjetaProfesional: datosCita.medico } as any);
    citasMedicasRepoMock.validarTurnoMedico.mockResolvedValue(true);
    citasMedicasRepoMock.validarDisponibilidadMedico.mockResolvedValue(false);
    citasMedicasRepoMock.validarCitasPaciente.mockResolvedValue(true);

    let errorCapturado: any = null;

    try {
      await agendamientoCasosUso.ejecutar(datosCita);
    } catch (error) {
      errorCapturado = error;
    }

    expect(errorCapturado).not.toBeNull();
    expect(errorCapturado.codigoInterno).toBe(CodigosDeError.PACIENTE_CON_CITA_EN_MISMO_HORARIO);
    expect(citasMedicasRepoMock.validarCitasPaciente).toHaveBeenCalledWith(
      datosCita.tipoDocPaciente,
      datosCita.numeroDocPaciente,
      datosCita.fecha,
      datosCita.horaInicio
    );
    expect(citasMedicasRepoMock.agendarCita).not.toHaveBeenCalled();
  });
});
