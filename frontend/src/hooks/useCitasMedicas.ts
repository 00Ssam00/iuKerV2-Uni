import { useState, useEffect } from 'react';
import axios from 'axios';
import type { CitaMedica, CitasApiResponse } from '../types/index';

interface UseCitasMedicasResult {
  data: CitaMedica[];
  loading: boolean;
  error: string | null;
  buscar: (id: string) => Promise<void>;
  recargar: () => Promise<void>;
}

export const useCitasMedicas = (baseUrl: string, initialSearch?: string): UseCitasMedicasResult => {
  const [data, setData] = useState<CitaMedica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<CitasApiResponse>(baseUrl);
      setData(response.data.citasEncontradas);
    } catch {
      setError('Error al cargar las citas médicas');
    } finally {
      setLoading(false);
    }
  };

  const buscar = async (id: string) => {
    if (!id.trim()) {
      await fetchAll();
      return;
    }
    const esUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim());
    if (!esUUID) {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<CitasApiResponse>(baseUrl);
        const filtradas = response.data.citasEncontradas.filter(c => c.numeroDocPaciente === id.trim());
        setData(filtradas);
        if (filtradas.length === 0) setError('No se encontraron citas para ese número de documento');
      } catch {
        setError('Error al buscar citas por número de documento');
        setData([]);
      } finally {
        setLoading(false);
      }
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${baseUrl}/${id}`);
      if (response.data.citasEncontradas && Array.isArray(response.data.citasEncontradas)) {
        setData(response.data.citasEncontradas);
      } else if (response.data.citaEncontrada) {
        setData([response.data.citaEncontrada]);
      } else if (response.data.idCita) {
        setData([response.data]);
      } else {
        setError('Formato de respuesta no válido');
        setData([]);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.status === 404 ? 'No se encontró la cita con ese ID' : 'Error al buscar la cita');
      } else {
        setError('Error al buscar la cita');
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSearch) {
      buscar(initialSearch);
    } else {
      fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, buscar, recargar: fetchAll };
};
