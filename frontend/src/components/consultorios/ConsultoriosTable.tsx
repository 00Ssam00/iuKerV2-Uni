import React, { useState } from 'react';
import { MoreVertical, Edit, Trash, Link, Unlink } from 'lucide-react';
import type { Consultorio, Asignacion, Medico } from '../../types/index';

interface ConsultoriosTableProps {
  data: Consultorio[];
  loading: boolean;
  error: string | null;
  primaryColor: string;
  asignaciones?: Asignacion[];
  medicos?: Medico[];
  onEditar?: (consultorio: Consultorio) => void;
  onEliminar?: (id: string) => void;
  onAsignar?: (consultorio: Consultorio) => void;
  onDesasignar?: (tarjetaMedico: string) => void;
  onRetry: () => void;
}

const ConsultoriosTable: React.FC<ConsultoriosTableProps> = ({
  data,
  loading,
  error,
  primaryColor,
  asignaciones = [],
  medicos = [],
  onEditar,
  onEliminar,
  onAsignar,
  onDesasignar,
  onRetry,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);

  const toggleMenu = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
      setMenuPos(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
      setOpenMenuId(id);
    }
  };

  const getMedicoAsignado = (consultorioId: string) => {
    const asignacion = asignaciones.find(a => a.idConsultorio === consultorioId);
    if (!asignacion) return null;
    const medico = medicos.find(m => m.tarjetaProfesional === asignacion.tarjetaProfesionalMedico);
    return medico ? { tarjeta: medico.tarjetaProfesional, label: `${medico.tarjetaProfesional} - ${medico.especialidad}` } : null;
  };

  if (loading) {
    return (
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
        <div className='flex flex-col items-center justify-center py-20 gap-3'>
          <div className='relative w-8 h-8'>
            <div className='absolute inset-0 rounded-full border-2' style={{ borderColor: `${primaryColor}40` }} />
            <div className='absolute inset-0 rounded-full border-2 border-t-transparent animate-spin' style={{ borderColor: primaryColor, borderTopColor: 'transparent' }} />
          </div>
          <p className='text-slate-400 text-sm'>Cargando consultorios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
        <div className='flex flex-col items-center justify-center py-20 gap-4'>
          <p className='text-slate-700 font-medium text-center'>{error}</p>
          <button
            onClick={onRetry}
            className='px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-all'
            style={{ backgroundColor: primaryColor }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
        <div className='flex flex-col items-center justify-center py-20 gap-2'>
          <p className='text-slate-400 text-sm'>No hay consultorios para mostrar</p>
        </div>
      </div>
    );
  }

  const consultorioMenu = openMenuId ? data.find(c => c.idConsultorio === openMenuId) : null;
  const medicoDelMenuAbierto = consultorioMenu ? getMedicoAsignado(consultorioMenu.idConsultorio) : null;

  return (
    <>
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-50 border-b border-slate-200'>
              <tr>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase'>ID</th>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase'>Ubicación</th>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase'>Médico Asignado</th>
                <th className='px-6 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase'>Acciones</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200'>
              {data.map(consultorio => (
                <tr key={consultorio.idConsultorio} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4 text-sm text-slate-700 font-medium'>{consultorio.idConsultorio}</td>
                  <td className='px-6 py-4 text-sm text-slate-600'>{consultorio.ubicacion || '—'}</td>
                  <td className='px-6 py-4 text-sm'>
                    {getMedicoAsignado(consultorio.idConsultorio) === null ? (
                      <span className='text-slate-400'>Sin asignar</span>
                    ) : (
                      <span className='text-slate-700 font-medium'>{getMedicoAsignado(consultorio.idConsultorio)?.label}</span>
                    )}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <button
                      onClick={(e) => toggleMenu(consultorio.idConsultorio, e)}
                      className='p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400'
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openMenuId && menuPos && consultorioMenu && (
        <>
          <div className='fixed inset-0 z-30' onClick={() => { setOpenMenuId(null); setMenuPos(null); }} />
          <div
            className='fixed z-40 w-44 bg-white rounded-lg shadow-lg border border-slate-200'
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <button
              onClick={() => { onAsignar?.(consultorioMenu); setOpenMenuId(null); setMenuPos(null); }}
              className='w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors'
            >
              <Link size={14} /> Asignar Médico
            </button>
            <button
              onClick={() => { onEditar?.(consultorioMenu); setOpenMenuId(null); setMenuPos(null); }}
              className='w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors border-t border-slate-200'
            >
              <Edit size={14} /> Editar
            </button>
            {medicoDelMenuAbierto && (
              <button
                onClick={() => { onDesasignar?.(medicoDelMenuAbierto.tarjeta); setOpenMenuId(null); setMenuPos(null); }}
                className='w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2 transition-colors border-t border-slate-200'
              >
                <Unlink size={14} /> Desasignar Médico
              </button>
            )}
            <button
              onClick={() => { onEliminar?.(consultorioMenu.idConsultorio); setOpenMenuId(null); setMenuPos(null); }}
              className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-slate-200'
            >
              <Trash size={14} /> Eliminar
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ConsultoriosTable;
