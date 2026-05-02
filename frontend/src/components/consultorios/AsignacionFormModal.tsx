import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Medico, Consultorio, Asignacion } from '../../types/index';
import { useAsignaciones } from '../../hooks/useAsignaciones';

interface AsignacionFormModalProps {
  consultorio: Consultorio | null;
  medicosDisponibles: Medico[];
  asignaciones?: Asignacion[];
  primaryColor: string;
  onSuccess: () => void;
  onClose: () => void;
}

const AsignacionFormModal: React.FC<AsignacionFormModalProps> = ({
  consultorio,
  medicosDisponibles,
  asignaciones = [],
  primaryColor,
  onSuccess,
  onClose,
}) => {
  const [selectedMedico, setSelectedMedico] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [medicoAConfirmar, setMedicoAConfirmar] = useState('');
  const { crearAsignacion, eliminarAsignacion } = useAsignaciones();
  const [loading, setLoading] = useState(false);
  const [errorAsignacion, setErrorAsignacion] = useState<string | null>(null);

  // Filtrar médicos que YA están asignados
  const medicosNoAsignados = medicosDisponibles.filter(medico => {
    const yaAsignado = asignaciones.some(a => a.tarjetaProfesionalMedico === medico.tarjetaProfesional);
    return !yaAsignado;
  });

  const getMedicoActualDelConsultorio = () => {
    if (!consultorio) return null;
    const asignacion = asignaciones.find(a => a.idConsultorio === consultorio.idConsultorio);
    if (!asignacion) return null;
    return medicosDisponibles.find(m => m.tarjetaProfesional === asignacion.tarjetaProfesionalMedico);
  };

  const medicoActual = getMedicoActualDelConsultorio();

  const handleMedicoSelectChange = (medicoId: string) => {
    // Si el consultorio ya tiene un médico asignado, mostrar confirmación
    if (medicoActual && medicoId) {
      setMedicoAConfirmar(medicoId);
      setShowConfirmation(true);
    } else {
      setSelectedMedico(medicoId);
    }
  };

  const handleConfirmarSustitucion = () => {
    setSelectedMedico(medicoAConfirmar);
    setShowConfirmation(false);
    setMedicoAConfirmar('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedico || !consultorio) {
      return;
    }

    setLoading(true);
    setErrorAsignacion(null);
    try {
      if (medicoActual) {
        await eliminarAsignacion(medicoActual.tarjetaProfesional);
      }
      await crearAsignacion(selectedMedico, consultorio.idConsultorio);
      onSuccess();
      onClose();
    } catch {
      setErrorAsignacion('No se pudo completar la asignación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const medicoSeleccionado = medicosDisponibles.find(m => m.tarjetaProfesional === selectedMedico);
  const medicoAConfirmarData = medicosDisponibles.find(m => m.tarjetaProfesional === medicoAConfirmar);

  return (
    <>
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
                onChange={(e) => handleMedicoSelectChange(e.target.value)}
                disabled={loading}
                className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all disabled:opacity-50'
              >
                <option value=''>Selecciona un médico...</option>
                {medicosNoAsignados.length === 0 ? (
                  <option disabled>Todos los médicos ya están asignados</option>
                ) : (
                  medicosNoAsignados.map(medico => (
                    <option key={medico.tarjetaProfesional} value={medico.tarjetaProfesional}>
                      {medico.tarjetaProfesional} - {medico.nombre} {medico.apellido}
                    </option>
                  ))
                )}
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

          {errorAsignacion && (
            <div className='px-6 pb-2'>
              <p className='text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200'>{errorAsignacion}</p>
            </div>
          )}

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

      {showConfirmation && medicoActual && medicoAConfirmarData && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md'>
            <div className='p-6 border-b border-slate-100'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center'>
                  <span className='text-lg'>⚠️</span>
                </div>
                <h3 className='text-lg font-semibold text-slate-800'>Sustituir Médico</h3>
              </div>
              <p className='text-sm text-slate-500'>Este consultorio ya tiene un médico asignado</p>
            </div>

            <div className='p-6 space-y-4'>
              <div className='bg-slate-50 p-4 rounded-lg space-y-3'>
                <div>
                  <p className='text-xs font-semibold text-slate-500 uppercase mb-1'>Médico Actual</p>
                  <p className='text-sm font-medium text-slate-800'>{medicoActual.tarjetaProfesional} - {medicoActual.especialidad}</p>
                  <p className='text-xs text-slate-500'>{medicoActual.nombre} {medicoActual.apellido}</p>
                </div>
                <div className='border-t border-slate-200 pt-3'>
                  <p className='text-xs font-semibold text-slate-500 uppercase mb-1'>Nuevo Médico</p>
                  <p className='text-sm font-medium text-slate-800'>{medicoAConfirmarData.tarjetaProfesional} - {medicoAConfirmarData.especialidad}</p>
                  <p className='text-xs text-slate-500'>{medicoAConfirmarData.nombre} {medicoAConfirmarData.apellido}</p>
                </div>
              </div>
              <p className='text-sm text-orange-700 bg-orange-50 p-3 rounded-lg'>
                El médico actual será desasignado de este consultorio.
              </p>
            </div>

            <div className='px-6 pb-6 flex gap-3'>
              <button
                type='button'
                onClick={() => {
                  setShowConfirmation(false);
                  setMedicoAConfirmar('');
                }}
                className='flex-1 py-2.5 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium'
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarSustitucion}
                className='flex-1 py-2.5 text-sm text-white rounded-lg hover:opacity-90 active:scale-95 transition-all font-medium'
                style={{ backgroundColor: primaryColor }}
              >
                Sí, sustituir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AsignacionFormModal;
