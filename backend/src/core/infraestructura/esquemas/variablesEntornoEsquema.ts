import {z} from 'zod';

export const variablesEntornoEsquema = z.object({
    PUERTO: z
        .coerce
        .number()
        .int()
        .positive()
        .default(3000),
    PGHOST: z
        .string()
        .min(1, {message: 'Se debe indicar un host para Postgres'}),
    PGPORT: z
        .coerce
        .number()
        .int()
        .positive()
        .min(1, { message: 'El puerto debe ser mayor o igual a 1' })
        .max(65535, { message: 'El puerto debe ser menor o igual a 65535' }),
    PGUSER: z
        .string()
        .min(1, {message: 'Se debe indicar un usuario para Postgres'}),
    PGPASSWORD: z
        .string()
        .min(1, {message: 'Se debe indicar la contrasena del usuario Postgres'}),
    PGDBNAME: z
        .string()
        .min(1, {message: 'Se debe indicar el nombre de la Base de Datos Postgres'}),
});