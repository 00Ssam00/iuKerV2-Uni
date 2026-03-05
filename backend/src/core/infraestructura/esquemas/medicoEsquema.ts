import { z } from 'zod';
import { EsquemasComunes } from './esquemasComunes.js';

export const crearMedicoEsquema = z.object({
  tarjetaProfesional: EsquemasComunes.tarjetaProfesional,
  tipoDoc: EsquemasComunes.TipoDocumento,
  numeroDoc: EsquemasComunes.NumeroDocumento,
  nombre: EsquemasComunes.Nombre,
  apellido: EsquemasComunes.Apellido,
  fechaNacimiento: EsquemasComunes.Fecha,
  sexo: EsquemasComunes.Sexo,

  especialidad: z
    .string()
    .min(3, { message: 'La especialidad debe tener al menos 3 caracteres' })
    .max(100, {
      message: 'La especialidad no puede superar los 100 caracteres',
    }),

  email: EsquemasComunes.Email,
  telefono: EsquemasComunes.Telefono,
});

export type MedicoSolicitudDTO = z.infer<typeof crearMedicoEsquema>;
export type MedicoActualizarSolicitudDTO = Partial<MedicoSolicitudDTO>;