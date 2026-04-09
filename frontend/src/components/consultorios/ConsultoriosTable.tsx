import React, { useState } from 'react';
import { MoreVertical, Edit, Trash, Link } from 'lucide-react';
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
  onRetry,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getMedicoAsignado = (consultorioId: string) => {
    const asignacion = asignaciones.find(a => a.idConsultorio === consultorioId);
    if (!asignacion) return 'Sin asignar';

    const medico = medicos.find(m => m.tarjetaProfesional === asignacion.tarjetaProfesional);
    return medico ? `${medico.tarjetaProfesional} - ${medico.especialidad}` : 'Sin asignar';
  };

  if (loading) {
    return (
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
        <div className='flex flex-col items-center justify-center py-20 gap-3'>
          <div className='w-8 h-8 border-2 rounded-full animate-spin' style={{ borderColor: `${primaryColor}40`, borderTopColor: 'transparent' }}>
            <div className='w-8 h-8 border-2 border-t-transparent rounded-full animate-spin' style={{ borderColor: primaryColor, borderTopColor: 'transparent' }} />
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

  return (
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
                  {getMedicoAsignado(consultorio.idConsultorio) === 'Sin asignar' ? (
                    <span className='text-slate-400'>Sin asignar</span>
                  ) : (
                    <span className='text-slate-700 font-medium'>{getMedicoAsignado(consultorio.idConsultorio)}</span>
                  )}
                </td>
                <td className='px-6 py-4 text-center'>
                  <button
                    onClick={() => (openMenuId === consultorio.idConsultorio ? setOpenMenuId(null) : setOpenMenuId(consultorio.idConsultorio))}
                    className='relative p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400'
                  >
                    <MoreVertical size={16} />
                  </button>
                  {openMenuId === consultorio.idConsultorio && (
                    <div className='absolute right-4 mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-40'>
                      <button
                        onClick={() => {
                          onAsignar?.(consultorio);
                          setOpenMenuId(null);
                        }}
                        className='w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-2 transition-colors'
                      >
                        <Link size={14} /> Asignar Médico
                      </button>
                      <button
                        onClick={() => {
                          onEditar?.(consultorio);
                          setOpenMenuId(null);
                        }}
                        className='w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors border-t border-slate-200'
                      >
                        <Edit size={14} /> Editar
                      </button>
                      <button
                        onClick={() => {
                          onEliminar?.(consultorio.idConsultorio);
                          setOpenMenuId(null);
                        }}
                        className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-slate-200'
                      >
                        <Trash size={14} /> Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsultoriosTable;
