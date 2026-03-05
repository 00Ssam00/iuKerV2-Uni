import { z } from 'zod';

const Hora = z
  .string()
  .nonempty('La hora no puede estar vacía')
  .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, 'El formato de hora debe ser HH:MM (Ej: 08:00).');

const Email = z.string().nonempty('El correo electrónico es obligatorio').email('El correo electrónico no es válido');

const Nombre = z
  .string()
  .nonempty('El nombre es obligatorio')
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(50, 'El nombre no puede superar los 50 caracteres');

const Apellido = z
  .string()
  .nonempty('El apellido es obligatorio')
  .min(2, 'El apellido debe tener al menos 2 caracteres')
  .max(50, 'El apellido no puede superar los 50 caracteres');

const Fecha = z
  .string()
  .nonempty('La fecha es obligatoria')
  .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'La fecha debe estar en formato YYYY-MM-DD (ej. 2025-11-04)');

const Sexo = z
  .string()
  .nonempty('El sexo es obligatorio')
  .max(1, 'El sexo debe ser un solo carácter (M/F)')
  .refine((value) => ['M', 'F'].includes(value.toUpperCase()), {
    message: "El sexo debe ser 'M' o 'F'",
  });

const Telefono = z
  .string()
  .nonempty('El teléfono no puede estar vacío')
  .regex(/^[0-9]{7,10}$/, 'El teléfono debe tener entre 7 y 10 dígitos');

const TipoDocumento = z
  .number({ message: 'El tipo de documento es obligatorio' })
  .int()
  .min(1, 'El tipo de documento es obligatorio')
  .max(4, 'El tipo de documento debe ser 1, 2, 3 o 4');

const NumeroDocumento = z
  .string()
  .nonempty('El número de documento es obligatorio')
  .min(5, 'El número de documento debe tener al menos 5 caracteres')
  .max(20, 'El número de documento no puede superar los 20 caracteres')
  .regex(/^[A-Za-z0-9]+$/, 'El documento solo debe contener letras y números');

const tarjetaProfesional = z
  .string()
  .nonempty('La tarjeta profesional es obligatoria')
  .min(3, 'La tarjeta profesional debe tener al menos 5 caracteres')
  .max(50, 'La tarjeta profesional no puede superar los 20 caracteres')
  .regex(/^[A-Za-z0-9]+$/, 'La tarjeta profesional solo debe contener letras y números');

const idConsultorio = z
  .string('El ID del consultorio debe seguir el esquema CXXX')
  .nonempty('El ID del consultorio es obligatorio')
  .min(1, 'El ID del consultorio es obligatorio')
  .max(5, 'El ID del consultorio no puede superar los 5 caracteres')
  .regex(/^[A-Za-z0-9]+$/, 'El ID del consultorio debe seguir el esquema CXXX');

export const EsquemasComunes = {
  Hora,
  Email,
  Nombre,
  Apellido,
  Fecha,
  Sexo,
  Telefono,
  TipoDocumento,
  NumeroDocumento,
  tarjetaProfesional,
  idConsultorio,
};
