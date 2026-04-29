const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'; // en producción usar https://iukerback.up.railway.app

export const CITAS_URL = `${BASE_URL}/api/citas-medicas`;
export const HISTORIAL_URL = `${BASE_URL}/api/historial-paciente`;
export const MEDICOS_URL = `${BASE_URL}/api/medicos`;
export const PACIENTES_URL = `${BASE_URL}/api/pacientes`;
export const CONSULTORIOS_URL = `${BASE_URL}/api/consultorios`;
export const ASIGNACIONES_URL = `${BASE_URL}/api/asignaciones`;
