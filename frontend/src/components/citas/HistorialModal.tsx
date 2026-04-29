import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import type { HistorialEntry } from '../../types/index';
import { HISTORIAL_URL } from '../../constants/api';
import { formatDateShort, formatDateTime } from '../../utils/formatters';

interface HistorialModalProps {
  idCita: string;
  onClose: () => void;
}

const HistorialModal: React.FC<HistorialModalProps> = ({ idCita, onClose }) => {
  const [historial, setHistorial] = useState<HistorialEntry | null | 'vacio'>(null);
  const [loading, setLoading] = useState(true);
  const [formInline, setFormInline] = useState({ diagnostico: '', descripcion: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const cargarHistorial = async () => {
      try {
        const res = await axios.get<{ historial: HistorialEntry }>(`${HISTORIAL_URL}/cita/${idCita}`, {
          signal: controller.signal,
        });
        setHistorial(res.data.historial ?? 'vacio');
      } catch (err) {
        if (axios.isCancel(err)) return;
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setHistorial('vacio');
        }
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
    return () => controller.abort();
  }, [idCita]);

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInline.diagnostico.trim()) {
      alert('El diagnóstico es obligatorio');
      return;
    }
    try {
      setSubmitting(true);
      const payload: { idCita: string; diagnostico: string; descripcion?: string } = {
        idCita,
        diagnostico: formInline.diagnostico.trim(),
      };
      if (formInline.descripcion.trim()) payload.descripcion = formInline.descripcion.trim();
      await axios.post(HISTORIAL_URL, payload);
      setFormInline({ diagnostico: '', descripcion: '' });
      const res = await axios.get<{ historial: HistorialEntry }>(`${HISTORIAL_URL}/cita/${idCita}`);
      setHistorial(res.data.historial);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.mensaje ?? 'Error al registrar el historial'
        : 'Error al registrar el historial';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <h2 className='text-lg font-semibold text-slate-800'>Historial clínico</h2>
          <button onClick={onClose} className='p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400'>
            <X size={18} />
          </button>
        </div>
        <div className='p-6'>
          {loading ? (
            <div className='flex justify-center py-8'>
              <div className='relative w-7 h-7'>
                <div className='absolute inset-0 rounded-full border-2' style={{ borderColor: '#15425b40' }} />
                <div className='absolute inset-0 rounded-full border-2 border-t-transparent animate-spin' style={{ borderColor: '#15425b', borderTopColor: 'transparent' }} />
              </div>
            </div>
          ) : historial === 'vacio' ? (
            <div className='space-y-4'>
              <div className='flex flex-col items-center gap-1 text-slate-400 pb-2'>
                <X size={24} className='text-slate-300' />
                <p className='text-sm'>Sin historial registrado — puedes crearlo aquí</p>
              </div>
              <div className='border-t border-slate-100 pt-4'>
                <form onSubmit={handleRegistrar} className='space-y-3'>
                  <div>
                    <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
                      Diagnóstico *
                    </label>
                    <textarea
                      value={formInline.diagnostico}
                      onChange={(e) => setFormInline(p => ({ ...p, diagnostico: e.target.value }))}
                      placeholder='Diagnóstico del médico'
                      rows={3}
                      className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all resize-none'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
                      Descripción <span className='text-slate-400 normal-case font-normal'>(opcional)</span>
                    </label>
                    <textarea
                      value={formInline.descripcion}
                      onChange={(e) => setFormInline(p => ({ ...p, descripcion: e.target.value }))}
                      placeholder='Notas adicionales de la consulta'
                      rows={2}
                      className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all resize-none'
                    />
                  </div>
                  <button
                    type='submit'
                    disabled={submitting}
                    className='w-full py-2.5 text-sm text-white rounded-lg hover:opacity-90 active:scale-95 transition-all font-medium disabled:opacity-60' style={{ backgroundColor: '#15425b' }}
                  >
                    {submitting ? 'Guardando...' : 'Registrar historial'}
                  </button>
                </form>
              </div>
            </div>
          ) : historial && (
            <div className='space-y-5'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-xs text-slate-400 mb-0.5'>Paciente</p>
                  <p className='font-medium text-slate-700'>{historial.paciente}</p>
                </div>
                <div>
                  <p className='text-xs text-slate-400 mb-0.5'>Médico</p>
                  <p className='font-medium text-slate-700'>{historial.medico}</p>
                </div>
                <div>
                  <p className='text-xs text-slate-400 mb-0.5'>Fecha cita</p>
                  <p className='text-slate-700'>{formatDateShort(historial.fecha)}</p>
                </div>
                <div>
                  <p className='text-xs text-slate-400 mb-0.5'>Registrado el</p>
                  <p className='text-slate-700'>{formatDateTime(historial.fechaRegistro)}</p>
                </div>
              </div>
              <div className='border-t border-slate-100 pt-5'>
                <p className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2'>Diagnóstico</p>
                <p className='text-slate-800 leading-relaxed whitespace-pre-wrap'>{historial.diagnostico}</p>
              </div>
              {historial.descripcion && (
                <div className='border-t border-slate-100 pt-5'>
                  <p className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2'>Descripción</p>
                  <p className='text-slate-600 leading-relaxed whitespace-pre-wrap'>{historial.descripcion}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialModal;
