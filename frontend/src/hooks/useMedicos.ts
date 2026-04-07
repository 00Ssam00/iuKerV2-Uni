import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Medico, MedicoDTO, MedicosApiResponse } from '../types/index';
import { MEDICOS_URL } from '../constants/api';

interface UseMedicosResult {
  data: Medico[];
  loading: boolean;
  error: string | null;
  buscar: (query: string) => Promise<void>;
  recargar: () => Promise<void>;
  crearMedico: (medico: MedicoDTO) => Promise<void>;
}

export const useMedicos = (initialSearch?: string): UseMedicosResult => {
  const [data, setData] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<MedicosApiResponse>(MEDICOS_URL);
      setData(response.data.medicos);
    } catch {
      setError('Error al cargar los médicos');
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
      const response = await axios.get<MedicosApiResponse>(MEDICOS_URL);
      const filtrados = response.data.medicos.filter(m =>
        m.nombre.toLowerCase().includes(query.trim().toLowerCase()) ||
        m.apellido.toLowerCase().includes(query.trim().toLowerCase()) ||
        m.especialidad.toLowerCase().includes(query.trim().toLowerCase()) ||
        m.tarjetaProfesional.includes(query.trim())
      );
      setData(filtrados);
      if (filtrados.length === 0) setError('No se encontraron médicos');
    } catch {
      setError('Error al buscar médicos');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const crearMedico = async (medico: MedicoDTO) => {
    try {
      await axios.post(MEDICOS_URL, medico);
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

  return { data, loading, error, buscar, recargar: fetchAll, crearMedico };
};
