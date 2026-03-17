import React from 'react';
import { ArrowLeft, FileText, User, Stethoscope, Calendar, Clock } from 'lucide-react';
import type { HistorialEntry } from '../../types/index';
import { formatDate, formatDateTime } from '../../utils/formatters';

interface HistorialDetailViewProps {
  entry: HistorialEntry;
  onBack: () => void;
  onIrACita: (idCita: string) => void;
}

const HistorialDetailView: React.FC<HistorialDetailViewProps> = ({ entry: h, onBack, onIrACita }) => (
  <main className='max-w-7xl mx-auto px-4 py-8'>
    <button
      onClick={onBack}
      className='flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors'
    >
      <ArrowLeft size={16} />
      Volver al historial
    </button>

    <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
      <div className='bg-blue-600 px-8 py-6 flex items-center gap-4'>
        <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0'>
          <FileText size={24} className='text-white' />
        </div>
        <div>
          <p className='text-blue-100 text-xs font-medium uppercase tracking-wide mb-0.5'>Historial clínico</p>
          <h1 className='text-white text-xl font-semibold'>{h.paciente}</h1>
        </div>
      </div>

      <div className='px-8 py-5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4'>
        <div className='flex items-center gap-2.5'>
          <User size={15} className='text-slate-400 flex-shrink-0' />
          <div>
            <p className='text-xs text-slate-400'>Médico</p>
            <p className='text-sm font-medium text-slate-700'>{h.medico}</p>
          </div>
        </div>
        <div className='flex items-center gap-2.5'>
          <Calendar size={15} className='text-slate-400 flex-shrink-0' />
          <div>
            <p className='text-xs text-slate-400'>Fecha de la cita</p>
            <p className='text-sm font-medium text-slate-700'>{formatDate(h.fecha)}</p>
          </div>
        </div>
        <div className='flex items-center gap-2.5'>
          <Clock size={15} className='text-slate-400 flex-shrink-0' />
          <div>
            <p className='text-xs text-slate-400'>Registrado el</p>
            <p className='text-sm font-medium text-slate-700'>{formatDateTime(h.fechaRegistro)}</p>
          </div>
        </div>
        <div className='min-w-0'>
          <p className='text-xs text-slate-400 mb-0.5'>ID cita</p>
          <button
            onClick={() => onIrACita(h.idCita)}
            className='text-xs font-mono text-blue-500 hover:text-blue-700 hover:underline truncate block max-w-full text-left transition-colors'
            title={h.idCita}
          >
            {h.idCita}
          </button>
        </div>
      </div>

      <div className='px-8 py-7 space-y-7'>
        <section>
          <div className='flex items-center gap-2 mb-3'>
            <Stethoscope size={16} className='text-blue-600' />
            <h2 className='text-sm font-semibold text-slate-700 uppercase tracking-wide'>Diagnóstico</h2>
          </div>
          <p className='text-slate-800 leading-relaxed whitespace-pre-wrap'>{h.diagnostico}</p>
        </section>

        {h.descripcion && (
          <>
            <div className='border-t border-slate-100' />
            <section>
              <div className='flex items-center gap-2 mb-3'>
                <FileText size={16} className='text-slate-400' />
                <h2 className='text-sm font-semibold text-slate-700 uppercase tracking-wide'>Descripción</h2>
              </div>
              <p className='text-slate-600 leading-relaxed whitespace-pre-wrap'>{h.descripcion}</p>
            </section>
          </>
        )}
      </div>
    </div>

    <p className='text-center mt-6 text-xs text-slate-400'>Copyright © 2026 iuKer®</p>
  </main>
);

export default HistorialDetailView;
