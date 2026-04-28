import {z} from 'zod';

export const variablesEntornoEsquema = z.object({
    PUERTO: z
        .coerce
        .number()
        .int()
        .positive()
        .default(3000),
    DATABASE_URL: z
        .string()
        .url({message: 'DATABASE_URL debe ser una URL de conexión válida (ej: postgresql://usuario:clave@host/db)'}),
    FRONTEND_URL: z
        .string()
        .url()
        .default('http://localhost:5173'),
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
});