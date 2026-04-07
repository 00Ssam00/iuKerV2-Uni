import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Medico, MedicoDTO, MedicosApiResponse, Asignacion } from '../types/index';
import { MEDICOS_URL, ASIGNACIONES_URL } from '../constants/api';

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
      const medicosRes = await axios.get<MedicosApiResponse>(MEDICOS_URL);

      let asignaciones: Asignacion[] = [];
      try {
        const asignacionesRes = await axios.get<{ asignaciones: Asignacion[] }>(ASIGNACIONES_URL);
        asignaciones = asignacionesRes.data.asignaciones;
      } catch {
        // Si no existe el endpoint, continuamos sin asignaciones
      }

      const medicosConHorario = medicosRes.data.medicos.map(medico => {
        const asignacionesMedico = asignaciones.filter(a =>
          a.tarjetaProfesional === medico.tarjetaProfesional
        );

        if (asignacionesMedico.length === 0) {
          return { ...medico, horario: 'Sin asignar' };
        }

        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const horarios = asignacionesMedico.map(a =>
          `${diasSemana[a.diaSemana]}: ${a.inicioJornada}-${a.finJornada}`
        ).join(' | ');

        return { ...medico, horario: horarios };
      });

      setData(medicosConHorario);
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
      const medicosRes = await axios.get<MedicosApiResponse>(MEDICOS_URL);

      let asignaciones: Asignacion[] = [];
      try {
        const asignacionesRes = await axios.get<{ asignaciones: Asignacion[] }>(ASIGNACIONES_URL);
        asignaciones = asignacionesRes.data.asignaciones;
      } catch {
        // Si no existe el endpoint, continuamos sin asignaciones
      }

      const medicosConHorario = medicosRes.data.medicos.map(medico => {
        const asignacionesMedico = asignaciones.filter(a =>
          a.tarjetaProfesional === medico.tarjetaProfesional
        );

        if (asignacionesMedico.length === 0) {
          return { ...medico, horario: 'Sin asignar' };
        }

        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const horarios = asignacionesMedico.map(a =>
          `${diasSemana[a.diaSemana]}: ${a.inicioJornada}-${a.finJornada}`
        ).join(' | ');

        return { ...medico, horario: horarios };
      });

      const filtrados = medicosConHorario.filter(m =>
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
