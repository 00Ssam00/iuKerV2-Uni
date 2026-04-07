import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Paciente, PacienteDTO, PacientesApiResponse } from '../types/index';
import { PACIENTES_URL } from '../constants/api';

interface UsePacientesResult {
  data: Paciente[];
  loading: boolean;
  error: string | null;
  buscar: (query: string) => Promise<void>;
  recargar: () => Promise<void>;
  crearPaciente: (paciente: PacienteDTO) => Promise<void>;
}

export const usePacientes = (initialSearch?: string): UsePacientesResult => {
  const [data, setData] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<PacientesApiResponse>(PACIENTES_URL);
      setData(response.data.pacientes);
    } catch {
      setError('Error al cargar los pacientes');
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
      const response = await axios.get<PacientesApiResponse>(PACIENTES_URL);
      const filtrados = response.data.pacientes.filter(p =>
        p.numeroDoc.includes(query.trim()) ||
        p.nombre.toLowerCase().includes(query.trim().toLowerCase()) ||
        p.apellido.toLowerCase().includes(query.trim().toLowerCase())
      );
      setData(filtrados);
      if (filtrados.length === 0) setError('No se encontraron pacientes');
    } catch {
      setError('Error al buscar pacientes');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const crearPaciente = async (paciente: PacienteDTO) => {
    try {
      await axios.post(PACIENTES_URL, paciente);
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

  return { data, loading, error, buscar, recargar: fetchAll, crearPaciente };
};
