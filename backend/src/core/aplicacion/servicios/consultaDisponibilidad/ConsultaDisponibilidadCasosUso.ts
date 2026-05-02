import { generarSlots } from '../../../../common/generarSlots.js';
import { conversionAFechaColombia } from '../../../../common/conversionAFechaColombia.js';
import { ICitasMedicasRepositorio } from '../../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { IMedicosRepositorio } from '../../../dominio/medico/IMedicosRepositorio.js';
import { DisponibilidadRespuestaDTO, ProximoDisponibleRespuestaDTO } from '../../../infraestructura/repositorios/postgres/dtos/DisponibilidadRespuestaDTO.js';
import { IConsultaDisponibilidadCasosUso } from './IConsultaDisponibilidadCasosUso.js';

const DIAS_BUSQUEDA = 60;

export class ConsultaDisponibilidadCasosUso implements IConsultaDisponibilidadCasosUso {
  constructor(
    private citasRepositorio: ICitasMedicasRepositorio,
    private medicosRepositorio: IMedicosRepositorio,
  ) {}

  async obtenerDisponibilidad(medico: string, fecha: string): Promise<DisponibilidadRespuestaDTO> {
    const fechaColombia = conversionAFechaColombia(fecha, '00:00');
    // DB: 1=Lun...6=Sáb, 7=Dom. getDay(): 0=Dom, 1=Lun...6=Sáb
    const rawDay = fechaColombia.getDay();
    const diaSemana = rawDay === 0 ? 7 : rawDay;

    const jornadas = await this.citasRepositorio.obtenerJornadasMedico(medico, diaSemana);
    const slotsOcupados = await this.citasRepositorio.obtenerSlotsOcupados(medico, fecha);

    const todosLosSlots = jornadas.flatMap(j => generarSlots(j.inicioJornada, j.finJornada));
    const slotsDisponibles = todosLosSlots.filter(s => !slotsOcupados.includes(s));

    return { jornadas, slotsDisponibles, slotsOcupados };
  }

  async obtenerProximoDisponible(): Promise<ProximoDisponibleRespuestaDTO | null> {
    const medicos = await this.medicosRepositorio.listarMedicos();

    // Construir mapa de jornadas por médico para no re-consultar cada iteración
    const jornadasPorMedico = new Map<string, { diaSemana: number; inicioJornada: string; finJornada: string }[]>();
    for (const medico of medicos) {
      const jornadas = await this.citasRepositorio.obtenerJornadasPorMedico(medico.tarjetaProfesional);
      if (jornadas.length > 0) jornadasPorMedico.set(medico.tarjetaProfesional, jornadas);
    }

    if (jornadasPorMedico.size === 0) return null;

    const ahora = new Date();

    for (let dia = 0; dia < DIAS_BUSQUEDA; dia++) {
      const fechaCandidata = new Date(ahora);
      fechaCandidata.setDate(ahora.getDate() + dia);
      // Usar métodos locales para que fechaStr y diaSemana sean del mismo día (Colombia)
      // toISOString() devuelve UTC y puede ser un día distinto al local pasada la medianoche
      const yyyy = fechaCandidata.getFullYear();
      const mm = String(fechaCandidata.getMonth() + 1).padStart(2, '0');
      const dd = String(fechaCandidata.getDate()).padStart(2, '0');
      const fechaStr = `${yyyy}-${mm}-${dd}`;
      const rawDay = fechaCandidata.getDay();
      const diaSemana = rawDay === 0 ? 7 : rawDay;

      for (const [tarjeta, jornadas] of jornadasPorMedico) {
        const jornadasDelDia = jornadas.filter(j => j.diaSemana === diaSemana);
        if (jornadasDelDia.length === 0) continue;

        const ocupados = await this.citasRepositorio.obtenerSlotsOcupados(tarjeta, fechaStr);
        const ocupadosSet = new Set(ocupados);

        for (const jornada of jornadasDelDia) {
          const slots = generarSlots(jornada.inicioJornada, jornada.finJornada);
          for (const slot of slots) {
            if (ocupadosSet.has(slot)) continue;

            // Verificar que el slot no sea en el pasado
            const fechaSlot = conversionAFechaColombia(fechaStr, slot);
            if (fechaSlot <= ahora) continue;

            return { medico: tarjeta, fecha: fechaStr, horaInicio: slot };
          }
        }
      }
    }

    return null;
  }

  async obtenerHorarioMedico(medico: string): Promise<{ diaSemana: number; inicioJornada: string; finJornada: string }[]> {
    return this.citasRepositorio.obtenerJornadasPorMedico(medico);
  }
}
