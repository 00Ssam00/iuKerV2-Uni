import { MedicosCasosUso} from '../../../src/core/aplicacion/medico/MedicosCasosUso.ts'
import { IMedicosRepositorio } from '../../../src/core/dominio/medico/IMedicosRepositorio.ts';
import { IMedico } from '../../../src/core/dominio/medico/IMedico.ts';
import { IAsignacionMedicoRepositorio } from '../../../src/core/dominio/asignacionMedico/IAsignacionMedicoRepositorio.ts';
import { ICitasMedicasRepositorio } from '../../../src/core/dominio/citaMedica/ICitasMedicasRepositorio.ts';
import { MedicoRepuestaDTO } from '../../../src/core/infraestructura/repositorios/postgres/dtos/MedicoRespuestaDTO.ts';
import { jest } from '@jest/globals';

describe('Pruebas unitarias para MedicosCasosUso', () => {
    let medicoRepoMock: jest.Mocked<IMedicosRepositorio>;
    let asignacionMedicoRepoMock: jest.Mocked<IAsignacionMedicoRepositorio>;
    let citasMedicasRepoMock: jest.Mocked<ICitasMedicasRepositorio>;
    let medicosCasosUso: MedicosCasosUso;

    beforeEach(()=>{
        medicoRepoMock = {
            crearMedico: jest.fn(),
            listarMedicos: jest.fn(),
            obtenerMedicoPorTarjetaProfesional: jest.fn(),
            actualizarMedico: jest.fn(),
            eliminarMedico: jest.fn()
        };

        asignacionMedicoRepoMock = {
            crearAsignacion: jest.fn(),
            existeAsignacion: jest.fn(),
            consultorioOcupado: jest.fn(),
            eliminarAsignacion: jest.fn()
        };

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
            eliminarCitasPorMedico: jest.fn()
        }

        medicosCasosUso = new MedicosCasosUso(medicoRepoMock, asignacionMedicoRepoMock, citasMedicasRepoMock);
    });

    test('Crear un Médico', async () => {
        const respuestaEsperadaMock: MedicoRepuestaDTO = {
            tarjetaProfesional: 'MP001',
            tipoDoc: 'Cédula',
            numeroDoc: '123',
            nombre: 'Ana',
            apellido: 'Perez',
            fechaNacimiento: '1990-01-01',
            sexo: 'F',
            especialidad: 'Cardio',
            email: 'a@a.com',
            telefono: '3001112222'
        };

        medicoRepoMock.crearMedico.mockResolvedValueOnce(respuestaEsperadaMock);

        const datosPrueba: IMedico = {
            tarjetaProfesional: 'MP001',
            tipoDoc: 1,
            numeroDoc: '123',
            nombre: 'Ana',
            apellido: 'Perez',
            fechaNacimiento: '1990-01-01',
            sexo: 'F',
            especialidad: 'Cardio',
            email: 'a@a.com',
            telefono: '3001112222'
        };

        const resultado = await medicosCasosUso.crearMedico(datosPrueba);
        expect(medicoRepoMock.crearMedico).toHaveBeenCalled();
        expect(resultado).toEqual(respuestaEsperadaMock);
    });

    test('Listar todos los médicos - Sin limite', async () => {
        const respuestaEsperadaMock: MedicoRepuestaDTO[] = [
            {
            tarjetaProfesional: "MP001",
            tipoDoc: "Cédula",
            numeroDoc: "900001",
            nombre: "Carlos",
            apellido: "Rodríguez",
            fechaNacimiento: "1980-03-12T05:00:00.000Z",
            sexo: "M",
            especialidad: "Medicina General",
            email: "carlos.rodriguez@clinicaiuker.com",
            telefono: "3105556677"
            },
            {
            tarjetaProfesional: "MP002",
            tipoDoc: "Cédula",
            numeroDoc: "900002",
            nombre: "Sofía",
            apellido: "Martínez",
            fechaNacimiento: "1985-11-23T05:00:00.000Z",
            sexo: "F",
            especialidad: "Pediatría",
            email: "sofia.martinez@clinicaiuker.com",
            telefono: "3116667788"
            }
        ];

        medicoRepoMock.listarMedicos.mockResolvedValue(respuestaEsperadaMock);

        const resultado = await medicosCasosUso.listarMedicos();
        expect(medicoRepoMock.listarMedicos).toHaveBeenCalled();
        expect(resultado).toEqual(respuestaEsperadaMock);
    });

    test('Listar todos los médicos - Con limite', async () => {
        const respuestaEsperadaMock: MedicoRepuestaDTO[] = [
            {
            tarjetaProfesional: "MP001",
            tipoDoc: "Cédula",
            numeroDoc: "900001",
            nombre: "Carlos",
            apellido: "Rodríguez",
            fechaNacimiento: "1980-03-12T05:00:00.000Z",
            sexo: "M",
            especialidad: "Medicina General",
            email: "carlos.rodriguez@clinicaiuker.com",
            telefono: "3105556677"
            },
            {
            tarjetaProfesional: "MP002",
            tipoDoc: "Cédula",
            numeroDoc: "900002",
            nombre: "Sofía",
            apellido: "Martínez",
            fechaNacimiento: "1985-11-23T05:00:00.000Z",
            sexo: "F",
            especialidad: "Pediatría",
            email: "sofia.martinez@clinicaiuker.com",
            telefono: "3116667788"
            },
            {
            tarjetaProfesional: "MP003",
            tipoDoc: "Cédula",
            numeroDoc: "900003",
            nombre: "Julián",
            apellido: "García",
            fechaNacimiento: "1978-09-08T05:00:00.000Z",
            sexo: "M",
            especialidad: "Cardiología",
            email: "julian.garcia@clinicaiuker.com",
            telefono: "3127778899"
            },
            {
            tarjetaProfesional: "MP004",
            tipoDoc: "Cédula",
            numeroDoc: "900004",
            nombre: "Valentina",
            apellido: "Ruiz",
            fechaNacimiento: "1990-02-17T05:00:00.000Z",
            sexo: "F",
            especialidad: "Dermatología",
            email: "valentina.ruiz@clinicaiuker.com",
            telefono: "3138889900"
            }
        ];

        const limite = 2;

        medicoRepoMock.listarMedicos.mockResolvedValue(respuestaEsperadaMock.slice(0, limite));
        const resultado = await medicosCasosUso.listarMedicos(limite);

        expect(medicoRepoMock.listarMedicos).toHaveBeenCalled();
        expect(medicoRepoMock.listarMedicos).toHaveBeenCalledWith(limite);
        expect(resultado).toEqual(respuestaEsperadaMock.slice(0, limite));
    });

    test('Obtener Médico por Tarjeta Profesional', async () => {
        const respuestaEsperadaMock: MedicoRepuestaDTO | null = {
            tarjetaProfesional: "MP001",
            tipoDoc: "Cédula",
            numeroDoc: "900001",
            nombre: "Carlos",
            apellido: "Rodríguez",
            fechaNacimiento: "1980-03-12T05:00:00.000Z",
            sexo: "M",
            especialidad: "Medicina General",
            email: "carlos.rodriguez@clinicaiuker.com",
            telefono: "3105556677"
        }

        const tarjetaProfesional = "MP001";

        medicoRepoMock.obtenerMedicoPorTarjetaProfesional.mockResolvedValue(respuestaEsperadaMock);
        const resultado = await medicosCasosUso.obtenerMedicoPorTarjetaProfesional(tarjetaProfesional);

        expect(medicoRepoMock.obtenerMedicoPorTarjetaProfesional).toHaveBeenCalled();
        expect(medicoRepoMock.obtenerMedicoPorTarjetaProfesional).toHaveBeenCalledWith(tarjetaProfesional);
        expect(resultado).toEqual(respuestaEsperadaMock);
    });

    test('Actualizar un Médico por Tarjeta Profesional', async () => {
        const respuestaEsperadaMock: MedicoRepuestaDTO = {
            tarjetaProfesional: 'MP001',
            tipoDoc: 'Cédula',
            numeroDoc: '123',
            nombre: 'Ana',
            apellido: 'Perez',
            fechaNacimiento: '1990-01-01',
            sexo: 'F',
            especialidad: 'Cardio',
            email: 'a@a.com',
            telefono: '3001112222'
        }

        medicoRepoMock.actualizarMedico.mockResolvedValueOnce(respuestaEsperadaMock);

        const datosPrueba: Partial<IMedico> = {
            email: 'ana.actualizada@correo.com'
        };

        const tarjetaProfesional = "MP001";

        medicoRepoMock.actualizarMedico.mockResolvedValue(respuestaEsperadaMock);
        const resultado = await medicosCasosUso.actualizarMedico(tarjetaProfesional, datosPrueba);

        expect(medicoRepoMock.actualizarMedico).toHaveBeenCalled();
        expect(medicoRepoMock.actualizarMedico).toHaveBeenCalledWith(tarjetaProfesional, datosPrueba);
        expect(resultado).toEqual(respuestaEsperadaMock);
    });

    test('Eliminar un Médico por Tarjeta Profesional', async () => {
        const tarjetaProfesional = "MP001";

        asignacionMedicoRepoMock.eliminarAsignacion.mockResolvedValueOnce(undefined);
        citasMedicasRepoMock.eliminarCitasPorMedico.mockResolvedValueOnce(undefined);
        medicoRepoMock.eliminarMedico.mockResolvedValueOnce(undefined);

        await medicosCasosUso.eliminarMedico(tarjetaProfesional);

        expect(asignacionMedicoRepoMock.eliminarAsignacion).toHaveBeenCalledWith(tarjetaProfesional);
        expect(citasMedicasRepoMock.eliminarCitasPorMedico).toHaveBeenCalledWith(tarjetaProfesional);
        expect(medicoRepoMock.eliminarMedico).toHaveBeenCalledWith(tarjetaProfesional);
    });
});