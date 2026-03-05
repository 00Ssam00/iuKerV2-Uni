import { z } from 'zod';
import { crearMedicoEsquema } from './medicoEsquema.js';
import { CrearConsultorioEsquema } from './consultorioEsquema.js';
import { EsquemasComunes } from './esquemasComunes.js';

const TarjetaProfesionalSchema = crearMedicoEsquema.shape.tarjetaProfesional;
const ConsultorioIdSchema = CrearConsultorioEsquema.shape.idConsultorio;

export const asignacionEsquema = z
  .object({
    tarjetaProfesionalMedico: TarjetaProfesionalSchema.max(50),

    idConsultorio: ConsultorioIdSchema.max(5),

    diaSemana: z
      .number()
      .int('El día de la semana debe ser un número entero (sin decimales).')
      .min(1, 'El día de la semana debe ser 1 (Lunes) o mayor.')
      .max(7, 'El día de la semana debe ser 7 (Domingo) o menor.'),

    inicioJornada: EsquemasComunes.Hora,
    finJornada: EsquemasComunes.Hora,
  })
  .strict()

  // Inicio debe ser anterior a Fin.
  .refine((data) => data.inicioJornada < data.finJornada, {
    message:
      'La hora de inicio de la jornada tiene que ser anterior a la hora de fin.',
    path: ['inicioJornada'],
  });

export type AsignacionSolicitudDTO = z.infer<typeof asignacionEsquema>;
