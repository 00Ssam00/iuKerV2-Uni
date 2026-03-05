import { describe, expect, beforeEach, jest } from '@jest/globals';
import { CitasMedicasCasosUso } from '../../../src/core/aplicacion/citaMedica/CitasMedicasCasosUso.js';
import { ICitasMedicasRepositorio } from '../../../src/core/dominio/citaMedica/ICitasMedicasRepositorio.js';
import { CitaMedicaRespuestaDTO } from '../../../src/core/infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';
import { CodigosDeError } from '../../../src/core/dominio/errores/codigosDeError.enum.js';

describe('Pruebas unitarias CitasMedicasCasosUso', () => {
  let citasMedicasRepoMock: jest.Mocked<ICitasMedicasRepositorio>;
  let citasMedicasCasosUso: CitasMedicasCasosUso;

  beforeEach(() => {
    citasMedicasRepoMock = {
      obtenerCitas: jest.fn(),
      obtenerCitaPorId: jest.fn(),
      agendarCita: jest.fn(),
      eliminarCita: jest.fn(),
      validarDisponibilidadMedico: jest.fn(),
      validarCitasPaciente: jest.fn(),
      validarTurnoMedico: jest.fn(),
      reprogramarCita: jest.fn(),
      cancelarCita: jest.fn(),
      finalizarCita: jest.fn(),
      eliminarCitasPorPaciente: jest.fn(),
      obtenerCitasPorPaciente: jest.fn(),
      eliminarCitasPorMedico: jest.fn(),
    };
    citasMedicasCasosUso = new CitasMedicasCasosUso(citasMedicasRepoMock);
  });

  test('Obtener todas las citas médicas - Sin limite', async () => {
    const respestaEsperada: CitaMedicaRespuestaDTO[] = [
      {
        idCita: 'feaac82c-2904-429a-a344-4591cc765bdb',
        paciente: 'Juan Pérez',
        tipoDocPaciente: 'Cédula',
        numeroDocPaciente: '100001',
        medico: 'Carlos Rodríguez',
        ubicacion: 'Edificio E, Piso 3',
        consultorio: 'C101',
        fecha: '2025-11-25T05:00:00.000Z',
        horaInicio: '08:00:00',
        codigoEstadoCita: 1,
        estadoCita: 'Activa',
        idCitaAnterior: null,
      },
      {
        idCita: '4c053792-9d42-486d-a13e-5fcd517fd7df',
        paciente: 'Juan Pérez',
        tipoDocPaciente: 'Cédula',
        numeroDocPaciente: '100001',
        medico: 'Sofía Martínez',
        ubicacion: 'Edificio A, Piso 5',
        consultorio: 'C102',
        fecha: '2025-11-25T05:00:00.000Z',
        horaInicio: '10:30:00',
        codigoEstadoCita: 3,
        estadoCita: 'Reprogramada',
        idCitaAnterior: null,
      },
      {
        idCita: '21d0d45e-4072-4e06-bb43-235fad910d5c',
        paciente: 'Laura Gómez',
        tipoDocPaciente: 'Cédula Extranjería',
        numeroDocPaciente: '100002',
        medico: 'Sofía Martínez',
        ubicacion: 'Edificio A, Piso 5',
        consultorio: 'C102',
        fecha: '2025-11-25T05:00:00.000Z',
        horaInicio: '09:00:00',
        codigoEstadoCita: 1,
        estadoCita: 'Activa',
        idCitaAnterior: null,
      },
    ];

    citasMedicasRepoMock.obtenerCitas.mockResolvedValue(respestaEsperada);

    const resultado = await citasMedicasCasosUso.obtenerCitas();

    expect(citasMedicasRepoMock.obtenerCitas).toHaveBeenCalled();
    expect(resultado).toEqual(respestaEsperada);
  });

  test('Obtener todas las citas médicas - Retorna array vacío cuando no hay citas', async () => {
    const respestaEsperada: CitaMedicaRespuestaDTO[] = [];

    citasMedicasRepoMock.obtenerCitas.mockResolvedValue(respestaEsperada);

    const resultado = await citasMedicasCasosUso.obtenerCitas();

    expect(citasMedicasRepoMock.obtenerCitas).toHaveBeenCalled();
    expect(resultado).toEqual(respestaEsperada);
    expect(resultado).toHaveLength(0);
  });

  test('Obtener todas las citas médicas - con limite', async () => {
    const respestaEsperada: CitaMedicaRespuestaDTO[] = [
      {
        idCita: 'feaac82c-2904-429a-a344-4591cc765bdb',
        paciente: 'Juan Pérez',
        tipoDocPaciente: 'Cédula',
        numeroDocPaciente: '100001',
        medico: 'Carlos Rodríguez',
        ubicacion: 'Edificio E, Piso 3',
        consultorio: 'C101',
        fecha: '2025-11-25T05:00:00.000Z',
        horaInicio: '08:00:00',
        codigoEstadoCita: 1,
        estadoCita: 'Activa',
        idCitaAnterior: null,
      },
      {
        idCita: '4c053792-9d42-486d-a13e-5fcd517fd7df',
        paciente: 'Juan Pérez',
        tipoDocPaciente: 'Cédula',
        numeroDocPaciente: '100001',
        medico: 'Sofía Martínez',
        ubicacion: 'Edificio A, Piso 5',
        consultorio: 'C102',
        fecha: '2025-11-25T05:00:00.000Z',
        horaInicio: '10:30:00',
        codigoEstadoCita: 3,
        estadoCita: 'Reprogramada',
        idCitaAnterior: null,
      },
    ];

    const limite = 2;
    citasMedicasRepoMock.obtenerCitas.mockResolvedValue(respestaEsperada.slice(0, limite));
    const resultado = await citasMedicasCasosUso.obtenerCitas(limite);

    expect(citasMedicasRepoMock.obtenerCitas).toHaveBeenCalled();
    expect(citasMedicasRepoMock.obtenerCitas).toHaveBeenCalledWith(limite);
    expect(resultado).toEqual(respestaEsperada.slice(0, limite));
  });

  test('Obtener cita por id', async () => {
    const respestaEsperada: CitaMedicaRespuestaDTO = {
      idCita: 'feaac82c-2904-429a-a344-4591cc765bdb',
      paciente: 'Juan Pérez',
      tipoDocPaciente: 'Cédula',
      numeroDocPaciente: '100001',
      medico: 'Carlos Rodríguez',
      ubicacion: 'Edificio E, Piso 3',
      consultorio: 'C101',
      fecha: '2025-11-25T05:00:00.000Z',
      horaInicio: '08:00:00',
      codigoEstadoCita: 1,
      estadoCita: 'Activa',
      idCitaAnterior: null,
    };

    const id = 'feaac82c-2904-429a-a344-4591cc765bdb';

    citasMedicasRepoMock.obtenerCitaPorId.mockResolvedValue(respestaEsperada);

    const resultado = await citasMedicasCasosUso.obtenerCitaPorId(id);
    expect(citasMedicasRepoMock.obtenerCitaPorId).toHaveBeenCalledWith(id);
    expect(resultado).toEqual(respestaEsperada);
  });

  test('Debe lanzar un error cuando la cita no existe', async () => {
    const idInexistente = 'id-falso-123';

    citasMedicasRepoMock.obtenerCitaPorId.mockResolvedValue(null);

    let errorCapturado: any = null;

    try {
      await citasMedicasCasosUso.obtenerCitaPorId(idInexistente);
    } catch (error) {
      errorCapturado = error;
    }

    expect(errorCapturado).not.toBeNull();
    expect(errorCapturado.codigoInterno).toBe(CodigosDeError.CITA_NO_EXISTE);
  });

  test('Debe eliminar la cita correctamente cuando existe', async () => {
    const idCita = 'feaac82c-2904-429a-a344-4591cc765bdb';

    const citaExistente: CitaMedicaRespuestaDTO = {
      idCita,
      paciente: 'Juan Pérez',
      tipoDocPaciente: 'Cédula',
      numeroDocPaciente: '100001',
      medico: 'Carlos Rodríguez',
      ubicacion: 'Edificio E, Piso 3',
      consultorio: 'C101',
      fecha: '2025-11-25T05:00:00.000Z',
      horaInicio: '08:00:00',
      codigoEstadoCita: 1,
      estadoCita: 'Activa',
      idCitaAnterior: null,
    };

    citasMedicasRepoMock.obtenerCitaPorId.mockResolvedValue(citaExistente);

    citasMedicasRepoMock.eliminarCita.mockResolvedValue(undefined);

    await citasMedicasCasosUso.eliminarCita(idCita);

    expect(citasMedicasRepoMock.obtenerCitaPorId).toHaveBeenCalledWith(idCita);
    expect(citasMedicasRepoMock.eliminarCita).toHaveBeenCalledWith(idCita);
  });

  test('Debe lanzar un error cuando la cita no existe', async () => {
    const idInexistente = 'no-existe-123';

    citasMedicasRepoMock.obtenerCitaPorId.mockResolvedValue(null);

    let errorCapturado: any = null;

    try {
      await citasMedicasCasosUso.eliminarCita(idInexistente);
    } catch (error) {
      errorCapturado = error;
    }

    expect(errorCapturado).not.toBeNull();

    expect(JSON.stringify(errorCapturado)).toContain(CodigosDeError.CITA_NO_EXISTE);

    expect(citasMedicasRepoMock.eliminarCita).not.toHaveBeenCalled();
  });
});
