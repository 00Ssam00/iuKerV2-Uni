import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Asignacion, AsignacionDTO } from '../types/index';
import { ASIGNACIONES_URL } from '../constants/api';
import { useToast } from './useToast';

interface UseAsignacionesResult {
  data: Asignacion[];
  loading: boolean;
  error: string | null;
  crearAsignacion: (tarjetaMedico: string, idConsultorio: string) => Promise<void>;
  eliminarAsignacion: (tarjetaMedico: string) => Promise<void>;
  recargar: () => Promise<void>;
}

export const useAsignaciones = (): UseAsignacionesResult => {
  const [data, setData] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchAsignaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<{ asignaciones: Asignacion[] }>(ASIGNACIONES_URL);
      setData(response.data.asignaciones);
    } catch {
      setError('Error al cargar las asignaciones');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsignaciones();
  }, []);

  const crearAsignacion = async (tarjetaMedico: string, idConsultorio: string) => {
    try {
      const asignacionDTO: AsignacionDTO = {
        tarjetaProfesionalMedico: tarjetaMedico,
        idConsultorio,
        diaSemana: 1, // lunes
        inicioJornada: '08:00',
        finJornada: '17:00',
      };

      await axios.post(ASIGNACIONES_URL, asignacionDTO);
      showToast('Médico asignado al consultorio exitosamente', 'success');
      await fetchAsignaciones();
    } catch (err) {
      const mensaje = axios.isAxiosError(err)
        ? err.response?.data?.mensaje ?? 'Error al asignar el médico'
        : 'Error al asignar el médico';
      showToast(mensaje, 'error');
      throw err;
    }
  };

  const eliminarAsignacion = async (tarjetaMedico: string) => {
    try {
      await axios.delete(`${ASIGNACIONES_URL}/${tarjetaMedico}`);
      showToast('Asignación eliminada exitosamente', 'success');
      await fetchAsignaciones();
    } catch (err) {
      const mensaje = axios.isAxiosError(err)
        ? err.response?.data?.mensaje ?? 'Error al eliminar la asignación'
        : 'Error al eliminar la asignación';
      showToast(mensaje, 'error');
      throw err;
    }
  };

  return { data, loading, error, crearAsignacion, eliminarAsignacion, recargar: fetchAsignaciones };
};
