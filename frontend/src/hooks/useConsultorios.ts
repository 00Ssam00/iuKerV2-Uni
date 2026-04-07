import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Consultorio, ConsultorioDTO, ConsultoriosApiResponse } from '../types/index';
import { CONSULTORIOS_URL } from '../constants/api';

interface UseConsultoriosResult {
  data: Consultorio[];
  loading: boolean;
  error: string | null;
  buscar: (query: string) => Promise<void>;
  recargar: () => Promise<void>;
  crearConsultorio: (consultorio: ConsultorioDTO) => Promise<void>;
  actualizarConsultorio: (id: string, consultorio: ConsultorioDTO) => Promise<void>;
}

export const useConsultorios = (initialSearch?: string): UseConsultoriosResult => {
  const [data, setData] = useState<Consultorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ConsultoriosApiResponse>(CONSULTORIOS_URL);
      setData(response.data.consultoriosEncontrados);
    } catch {
      setError('Error al cargar los consultorios');
    } finally {
      setLoading(false);
    }
  };

  const buscar = async (query: string) => {
    if (!query.trim()) {
      await fetchAll();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ConsultoriosApiResponse>(CONSULTORIOS_URL);
      const filtrados = response.data.consultoriosEncontrados.filter(c =>
        c.idConsultorio.toLowerCase().includes(query.trim().toLowerCase()) ||
        (c.ubicacion && c.ubicacion.toLowerCase().includes(query.trim().toLowerCase()))
      );
      setData(filtrados);
      if (filtrados.length === 0) setError('No se encontraron consultorios');
    } catch {
      setError('Error al buscar consultorios');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const crearConsultorio = async (consultorio: ConsultorioDTO) => {
    try {
      await axios.post(CONSULTORIOS_URL, consultorio);
      await fetchAll();
    } catch (err) {
      throw err;
    }
  };

  const actualizarConsultorio = async (id: string, consultorio: ConsultorioDTO) => {
    try {
      await axios.put(`${CONSULTORIOS_URL}/${id}`, consultorio);
      await fetchAll();
    } catch (err) {
      throw err;
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

  return { data, loading, error, buscar, recargar: fetchAll, crearConsultorio, actualizarConsultorio };
};
