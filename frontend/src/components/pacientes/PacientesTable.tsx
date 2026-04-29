import React, { useState } from 'react';
import { MoreVertical, Trash } from 'lucide-react';
import type { Paciente } from '../../types/index';

interface PacientesTableProps {
  data: Paciente[];
  loading: boolean;
  error: string | null;
  primaryColor: string;
  onEliminar?: (numeroDoc: string) => void;
  onRetry: () => void;
}

const PacientesTable: React.FC<PacientesTableProps> = ({
  data,
  loading,
  error,
  primaryColor,
  onEliminar,
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

  if (loading) {
    return (
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
        <div className='flex flex-col items-center justify-center py-20 gap-3'>
          <div className='relative w-8 h-8'>
            <div className='absolute inset-0 rounded-full border-2' style={{ borderColor: `${primaryColor}40` }} />
            <div className='absolute inset-0 rounded-full border-2 border-t-transparent animate-spin' style={{ borderColor: primaryColor, borderTopColor: 'transparent' }} />
          </div>
          <p className='text-slate-400 text-sm'>Cargando pacientes...</p>
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
          <p className='text-slate-400 text-sm'>No hay pacientes para mostrar</p>
        </div>
      </div>
    );
  }

  const pacienteMenu = openMenuId ? data.find(p => p.numeroDoc === openMenuId) : null;

  return (
    <>
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-50 border-b border-slate-200'>
              <tr>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase w-20'>Tipo Documento</th>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase w-20'>Número Documento</th>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase'>Nombre</th>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase'>Teléfono</th>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase'>Email</th>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase'>Dirección</th>
                <th className='px-6 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase'>Acciones</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200'>
              {data.map(paciente => (
                <tr key={paciente.numeroDoc} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4 text-sm text-slate-700 font-medium'>{paciente.tipoDoc}</td>
                  <td className='px-6 py-4 text-sm text-slate-700 font-medium'>{paciente.numeroDoc}</td>
                  <td className='px-6 py-4 text-sm text-slate-700'>{paciente.nombre} {paciente.apellido}</td>
                  <td className='px-6 py-4 text-sm text-slate-600'>{paciente.telefono || '—'}</td>
                  <td className='px-6 py-4 text-sm text-slate-600'>{paciente.email || '—'}</td>
                  <td className='px-6 py-4 text-sm text-slate-600 max-w-xs truncate'>{paciente.direccion || '—'}</td>
                  <td className='px-6 py-4 text-center'>
                    <button
                      onClick={(e) => toggleMenu(paciente.numeroDoc, e)}
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

      {openMenuId && menuPos && pacienteMenu && (
        <>
          <div className='fixed inset-0 z-30' onClick={() => { setOpenMenuId(null); setMenuPos(null); }} />
          <div
            className='fixed z-40 w-32 bg-white rounded-lg shadow-lg border border-slate-200'
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <button
              onClick={() => { onEliminar?.(pacienteMenu.numeroDoc); setOpenMenuId(null); setMenuPos(null); }}
              className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors'
            >
              <Trash size={14} /> Eliminar
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default PacientesTable;
