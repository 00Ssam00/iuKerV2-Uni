import React, { useState } from 'react';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import type { Medico } from '../../types/index';

interface MedicosTableProps {
  data: Medico[];
  loading: boolean;
  error: string | null;
  primaryColor: string;
  onEditar?: (medico: Medico) => void;
  onEliminar?: (tarjeta: string) => void;
  onRetry: () => void;
}

const MedicosTable: React.FC<MedicosTableProps> = ({
  data,
  loading,
  error,
  primaryColor,
  onEditar,
  onEliminar,
  onRetry,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
        <div className='flex flex-col items-center justify-center py-20 gap-3'>
          <div className='w-8 h-8 border-2 rounded-full animate-spin' style={{ borderColor: `${primaryColor}40`, borderTopColor: 'transparent' }}>
            <div className='w-8 h-8 border-2 border-t-transparent rounded-full animate-spin' style={{ borderColor: primaryColor, borderTopColor: 'transparent' }} />
          </div>
          <p className='text-slate-400 text-sm'>Cargando médicos...</p>
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
          <p className='text-slate-400 text-sm'>No hay médicos para mostrar</p>
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
              <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase'>Tarjeta Prof.</th>
              <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase'>Nombre</th>
              <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase'>Especialidad</th>
              <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase'>Email</th>
              <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase'>Teléfono</th>
              <th className='px-6 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-200'>
            {data.map(medico => (
              <tr key={medico.tarjetaProfesional} className='hover:bg-slate-50 transition-colors'>
                <td className='px-6 py-4 text-sm text-slate-700 font-medium'>{medico.tarjetaProfesional}</td>
                <td className='px-6 py-4 text-sm text-slate-700'>
                  {medico.nombre} {medico.apellido}
                </td>
                <td className='px-6 py-4 text-sm text-slate-600'>{medico.especialidad}</td>
                <td className='px-6 py-4 text-sm text-slate-600'>{medico.email}</td>
                <td className='px-6 py-4 text-sm text-slate-600'>{medico.telefono}</td>
                <td className='px-6 py-4 text-center'>
                  <button
                    onClick={() => (openMenuId === medico.tarjetaProfesional ? setOpenMenuId(null) : setOpenMenuId(medico.tarjetaProfesional))}
                    className='relative p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400'
                  >
                    <MoreVertical size={16} />
                  </button>
                  {openMenuId === medico.tarjetaProfesional && (
                    <div className='absolute right-4 mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-200 z-40'>
                      <button
                        onClick={() => {
                          onEditar?.(medico);
                          setOpenMenuId(null);
                        }}
                        className='w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors'
                      >
                        <Edit size={14} /> Editar
                      </button>
                      <button
                        onClick={() => {
                          onEliminar?.(medico.tarjetaProfesional);
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

export default MedicosTable;
