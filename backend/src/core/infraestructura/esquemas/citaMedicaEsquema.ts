import { z } from 'zod';
import { EsquemasComunes } from './esquemasComunes.js';
export const crearCitaMedicaEsquema = z.object({
  medico: z
    .string()
    .nonempty('El médico debe tener identificador profesional')
    .min(5, 'El documento profesional del médico debe tener mínimo 6 carateres')
    .max(15, 'El documento profesional del médico debe tener máximo 15 carateres')
    .regex(/^[A-Za-z0-9]+$/, 'El ID del médico solo debe contener letras y números'),

  tipoDocPaciente: EsquemasComunes.TipoDocumento,
  numeroDocPaciente: EsquemasComunes.NumeroDocumento,
  fecha: EsquemasComunes.Fecha,
  horaInicio: EsquemasComunes.Hora,
});

export type citaMedicaSolicitudDTO = z.infer<typeof crearCitaMedicaEsquema>;
