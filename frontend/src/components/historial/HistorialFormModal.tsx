import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import type { HistorialFormData } from '../../types/index';
import { HISTORIAL_URL } from '../../constants/api';

interface HistorialFormModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const HistorialFormModal: React.FC<HistorialFormModalProps> = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState<HistorialFormData>({ idCita: '', diagnostico: '', descripcion: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idCita.trim() || !formData.diagnostico.trim()) {
      alert('El ID de cita y el diagnóstico son obligatorios');
      return;
    }
    try {
      setSubmitting(true);
      const payload: { idCita: string; diagnostico: string; descripcion?: string } = {
        idCita: formData.idCita.trim(),
        diagnostico: formData.diagnostico.trim(),
      };
      if (formData.descripcion.trim()) payload.descripcion = formData.descripcion.trim();
      await axios.post(HISTORIAL_URL, payload);
      onSuccess();
      onClose();
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
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div>
            <h2 className='text-lg font-semibold text-slate-800'>Registrar historial</h2>
            <p className='text-xs text-slate-400 mt-0.5'>La cita debe estar en estado Finalizada</p>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400'>
            <X size={18} />
          </button>
        </div>

        <div className='p-6 space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
              ID de la Cita *
            </label>
            <input
              type='text'
              value={formData.idCita}
              onChange={(e) => setFormData(p => ({ ...p, idCita: e.target.value }))}
              placeholder='UUID de la cita finalizada'
              className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all font-mono'
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
              Diagnóstico *
            </label>
            <textarea
              value={formData.diagnostico}
              onChange={(e) => setFormData(p => ({ ...p, diagnostico: e.target.value }))}
              placeholder='Diagnóstico del médico (mín. 5 caracteres)'
              rows={3}
              className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all resize-none'
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
              Descripción <span className='text-slate-400 normal-case font-normal'>(opcional)</span>
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData(p => ({ ...p, descripcion: e.target.value }))}
              placeholder='Notas adicionales o detalles de la consulta'
              rows={3}
              className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all resize-none'
            />
          </div>
        </div>

        <div className='px-6 pb-6 flex gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='flex-1 py-2.5 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium'
          >
            Cancelar
          </button>
          <button
            onClick={handleRegistrar}
            disabled={submitting}
            className='flex-1 py-2.5 text-sm text-white rounded-lg hover:opacity-90 active:scale-95 transition-all font-medium disabled:opacity-60' style={{ backgroundColor: '#15425b' }}
          >
            {submitting ? 'Guardando...' : 'Registrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistorialFormModal;
