import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Medico, Consultorio } from '../../types/index';
import { useAsignaciones } from '../../hooks/useAsignaciones';

interface AsignacionFormModalProps {
  consultorio: Consultorio | null;
  medicosDisponibles: Medico[];
  primaryColor: string;
  onSuccess: () => void;
  onClose: () => void;
}

const AsignacionFormModal: React.FC<AsignacionFormModalProps> = ({
  consultorio,
  medicosDisponibles,
  primaryColor,
  onSuccess,
  onClose,
}) => {
  const [selectedMedico, setSelectedMedico] = useState('');
  const { crearAsignacion } = useAsignaciones();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedico || !consultorio) {
      return;
    }

    setLoading(true);
    try {
      await crearAsignacion(selectedMedico, consultorio.idConsultorio);
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const medicoSeleccionado = medicosDisponibles.find(m => m.tarjetaProfesional === selectedMedico);

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div>
            <h2 className='text-lg font-semibold text-slate-800'>Asignar Médico</h2>
            <p className='text-xs text-slate-400 mt-0.5'>
              Consultorio: <span className='font-medium text-slate-600'>{consultorio?.idConsultorio}</span>
            </p>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400' disabled={loading}>
            <X size={18} />
          </button>
        </div>

        <div className='p-6 space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
              Seleccionar Médico *
            </label>
            <select
              value={selectedMedico}
              onChange={(e) => setSelectedMedico(e.target.value)}
              disabled={loading}
              className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all disabled:opacity-50'
            >
              <option value=''>Selecciona un médico...</option>
              {medicosDisponibles.map(medico => (
                <option key={medico.tarjetaProfesional} value={medico.tarjetaProfesional}>
                  {medico.nombre} {medico.apellido} ({medico.especialidad})
                </option>
              ))}
            </select>
          </div>

          {medicoSeleccionado && (
            <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <p className='text-sm text-blue-800'>
                <span className='font-semibold'>Disponibilidad:</span> Lunes a Viernes, 8:00 AM - 5:00 PM
              </p>
              <p className='text-xs text-blue-600 mt-1'>Esta asignación permite que el médico atienda en este consultorio en el horario especificado.</p>
            </div>
          )}
        </div>

        <div className='px-6 pb-6 flex gap-3'>
          <button
            type='button'
            onClick={onClose}
            disabled={loading}
            className='flex-1 py-2.5 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50'
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedMedico || loading}
            className='flex-1 py-2.5 text-sm text-white rounded-lg hover:opacity-90 active:scale-95 transition-all font-medium disabled:opacity-50'
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? 'Asignando...' : 'Asignar Médico'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignacionFormModal;
