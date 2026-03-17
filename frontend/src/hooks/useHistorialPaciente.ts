import { useState } from 'react';
import axios from 'axios';
import { HISTORIAL_URL } from '../constants/api';
import type { HistorialEntry, HistorialApiResponse } from '../types/index';

interface UseHistorialPacienteResult {
  data: HistorialEntry[];
  loading: boolean;
  error: string | null;
  searched: boolean;
  buscar: (doc: string) => Promise<void>;
  recargar: (doc: string) => Promise<void>;
}

export const useHistorialPaciente = (): UseHistorialPacienteResult => {
  const [data, setData] = useState<HistorialEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const fetchHistorial = async (doc: string) => {
    try {
      setLoading(true);
      setError(null);
      setSearched(true);
      const response = await axios.get<HistorialApiResponse>(`${HISTORIAL_URL}/paciente/${doc.trim()}`);
      setData(response.data.historial ?? []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setData([]);
      } else {
        setError('Error al buscar el historial del paciente');
      }
    } finally {
      setLoading(false);
    }
  };

  const buscar = async (doc: string) => {
    if (!doc.trim()) return;
    await fetchHistorial(doc);
  };

  const recargar = async (doc: string) => {
    if (!doc.trim()) return;
    await fetchHistorial(doc);
  };

  return { data, loading, error, searched, buscar, recargar };
};
