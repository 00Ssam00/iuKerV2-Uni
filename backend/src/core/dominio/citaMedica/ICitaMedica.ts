import { estadoCita } from '../../../common/estadoCita.enum.js';

export interface ICitaMedica {
  readonly medico: string;
  readonly tipoDocPaciente: number;
  readonly numeroDocPaciente: string;
  readonly fecha: string;
  readonly horaInicio: string;
  estado: estadoCita;
  readonly idCitaAnterior?: string | null;
}
