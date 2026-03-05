import { z } from 'zod';
import { EsquemasComunes } from './esquemasComunes.js';

export const CrearConsultorioEsquema = z.object({
  idConsultorio: EsquemasComunes.idConsultorio,
  ubicacion: z
    .string()
    .optional()
    .transform((valor) => valor ?? null),
});

export type consultorioSolicitudDTO = z.infer<typeof CrearConsultorioEsquema>;
