import axios from 'axios';

/**
 * Extrae el mensaje de error más descriptivo de una respuesta Axios.
 * Prioridad: mensaje de campo específico Zod > error general > mensaje genérico > fallback.
 */
export const extraerMensajeAxios = (err: unknown, fallback: string): string => {
  if (!axios.isAxiosError(err)) return fallback;
  const data = err.response?.data;
  if (!data) return fallback;
  if (Array.isArray(data.detalles) && data.detalles.length > 0) {
    return data.detalles[0].mensaje ?? data.error ?? data.mensaje ?? fallback;
  }
  return data.error ?? data.mensaje ?? fallback;
};

/** Devuelve los nombres de los campos que fallaron en una validación Zod del backend. */
export const extraerCamposConError = (err: unknown): string[] => {
  if (!axios.isAxiosError(err)) return [];
  const detalles = err.response?.data?.detalles;
  if (!Array.isArray(detalles)) return [];
  return detalles.map((d: { ruta: string }) => d.ruta).filter(Boolean);
};

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return '-'; }
};

export const formatDateShort = (dateString: string | null): string => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
  } catch { return '-'; }
};

export const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return '-'; }
};

export const formatTime = (timeString: string | null): string => {
  if (!timeString) return '-';
  return timeString.slice(0, 5);
};
