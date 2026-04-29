import React from 'react';
import { Search, Plus, X, ClipboardList, FileText, User } from 'lucide-react';
import type { HistorialEntry } from '../../types/index';
import { formatDateShort, formatDateTime } from '../../utils/formatters';

interface HistorialListViewProps {
  data: HistorialEntry[];
  loading: boolean;
  error: string | null;
  searched: boolean;
  searchDoc: string;
  onSearchChange: (doc: string) => void;
  onSearch: () => void;
  onSelectEntry: (entry: HistorialEntry) => void;
  onOpenModal: () => void;
}

const HistorialListView: React.FC<HistorialListViewProps> = ({
  data, loading, error, searched, searchDoc, onSearchChange, onSearch, onSelectEntry, onOpenModal,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <main className='max-w-7xl mx-auto px-4 py-8'>
      <div className='flex gap-3 items-center mb-6'>
        <form onSubmit={handleSubmit} className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
            <input
              type='text'
              value={searchDoc}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSearch(); } }}
              placeholder='Buscar por número de documento del paciente...'
              className='w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            />
          </div>
        </form>
        <button
          onClick={onOpenModal}
          className='flex items-center gap-2 px-4 py-2.5 text-sm text-white rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all font-medium' style={{ backgroundColor: '#15425b' }}
        >
          <Plus size={16} />
          Registrar historial
        </button>
      </div>

      {loading ? (
        <div className='flex flex-col items-center justify-center py-24 gap-3'>
          <div className='relative w-8 h-8'>
            <div className='absolute inset-0 rounded-full border-2' style={{ borderColor: '#15425b40' }} />
            <div className='absolute inset-0 rounded-full border-2 border-t-transparent animate-spin' style={{ borderColor: '#15425b', borderTopColor: 'transparent' }} />
          </div>
          <p className='text-sm text-slate-400'>Buscando historial...</p>
        </div>
      ) : error ? (
        <div className='flex flex-col items-center justify-center py-24 gap-4'>
          <div className='w-12 h-12 rounded-full bg-red-50 flex items-center justify-center'>
            <X size={20} className='text-red-400' />
          </div>
          <p className='text-sm text-slate-500'>{error}</p>
        </div>
      ) : !searched ? (
        <div className='flex flex-col items-center justify-center py-24 gap-2'>
          <ClipboardList size={36} className='text-slate-300' />
          <p className='text-slate-400 text-sm'>Ingresa el número de documento para consultar el historial</p>
        </div>
      ) : data.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-24 gap-2'>
          <FileText size={36} className='text-slate-300' />
          <p className='text-slate-400 text-sm'>No hay registros de historial para este paciente</p>
        </div>
      ) : (
        <>
          <p className='text-xs text-slate-400 mb-4'>
            {data.length} {data.length === 1 ? 'documento encontrado' : 'documentos encontrados'}
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {data.map((h) => (
              <button
                key={h.idHistorial}
                onClick={() => onSelectEntry(h)}
                className='bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left group'
              >
                <div className='px-5 pt-5 pb-4 flex items-start gap-3'>
                  <div className='w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 transition-colors'>
                    <FileText size={18} style={{ color: '#15425b' }} />
                  </div>
                  <div className='min-w-0'>
                    <p className='font-semibold text-slate-800 text-sm leading-tight'>{h.paciente}</p>
                    <p className='text-xs text-slate-400 mt-0.5'>{formatDateShort(h.fecha)}</p>
                  </div>
                </div>
                <div className='px-5 pb-4 space-y-2'>
                  <div className='flex items-center gap-1.5 text-xs text-slate-500'>
                    <User size={12} className='flex-shrink-0' />
                    <span className='truncate'>{h.medico}</span>
                  </div>
                  <p className='text-sm text-slate-600 line-clamp-2 leading-relaxed'>{h.diagnostico}</p>
                </div>
                <div className='px-5 py-3 border-t border-slate-100 flex items-center justify-between'>
                  <span className='text-xs text-slate-400'>{formatDateTime(h.fechaRegistro)}</span>
                  <span className='text-xs text-blue-500 font-medium group-hover:underline'>Ver detalle →</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <p className='text-center mt-8 text-xs text-slate-400'>Copyright © 2026 iuKer®</p>
    </main>
  );
};

export default HistorialListView;
