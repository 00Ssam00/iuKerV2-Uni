import axios from 'axios';
import type { AsignacionDTO } from '../types/index';
import { ASIGNACIONES_URL } from '../constants/api';
import { useToast } from './useToast';

interface UseAsignacionesResult {
  crearAsignacion: (tarjetaMedico: string, idConsultorio: string) => Promise<void>;
  eliminarAsignacion: (tarjetaMedico: string) => Promise<void>;
}

export const useAsignaciones = (): UseAsignacionesResult => {
  const { showToast } = useToast();

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
    } catch (err) {
      const mensaje = axios.isAxiosError(err)
        ? err.response?.data?.mensaje ?? 'Error al eliminar la asignación'
        : 'Error al eliminar la asignación';
      showToast(mensaje, 'error');
      throw err;
    }
  };

  return { crearAsignacion, eliminarAsignacion };
};
