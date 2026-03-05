import { z } from 'zod';
import { EsquemasComunes } from './esquemasComunes.js';

export const pacienteEsquema = z.object({
  numeroDoc: z.string('El documento debe ser un string'),
  tipoDoc: z.number('El tipo es 1, 2, 3 o 4'),
  nombre: EsquemasComunes.Nombre,
  apellido: EsquemasComunes.Apellido,
  fechaNacimiento: EsquemasComunes.Fecha.pipe(z.coerce.date()),
  sexo: EsquemasComunes.Sexo,
  email: EsquemasComunes.Email,
  telefono: EsquemasComunes.Telefono,

  direccion: z
    .string()
    .min(8, 'La dirección es demasiado corta.')
    .nonempty('La dirección del paciente es obligatoria'),
});

export type PacienteDTO = z.infer<typeof pacienteEsquema>;
