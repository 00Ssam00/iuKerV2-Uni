import { z } from 'zod';

export const crearHistorialEsquema = z.object({
  idCita: z.string().uuid('El idCita debe ser un UUID válido'),
  diagnostico: z
    .string()
    .nonempty('El diagnóstico es obligatorio')
    .min(5, 'El diagnóstico debe tener al menos 5 caracteres')
    .max(500, 'El diagnóstico no puede superar los 500 caracteres'),
  descripcion: z
    .string()
    .max(1000, 'La descripción no puede superar los 1000 caracteres')
    .optional(),
});

export type historialSolicitudDTO = z.infer<typeof crearHistorialEsquema>;
