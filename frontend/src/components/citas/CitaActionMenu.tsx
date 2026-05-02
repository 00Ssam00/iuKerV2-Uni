import React from 'react';
import { Calendar, Ban, Trash2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import type { CitaMedica } from '../../types/index';
import { getEstadoDisplay } from '../../hooks/useCitasMedicas';
import { useToast } from '../../hooks/useToast';
import { extraerMensajeAxios } from '../../utils/formatters';

interface CitaActionMenuProps {
  cita: CitaMedica;
  menuPos: { top: number; right: number };
  baseUrl: string;
  primaryColor: string;
  onReagendar: (cita: CitaMedica) => void;
  onSuccess: () => void;
  onClose: () => void;
}

const CitaActionMenu: React.FC<CitaActionMenuProps> = ({
  cita, menuPos, baseUrl, primaryColor, onReagendar, onSuccess, onClose,
}) => {
  const { showToast } = useToast();
  const bloqueada = cita.estadoCita === 'Cancelada' || cita.estadoCita === 'Finalizada';
  const puedeFinalizar = getEstadoDisplay(cita) === 'Por finalizar';

  const handleFinalizar = async () => {
    if (!window.confirm(`¿Confirmas que deseas finalizar la cita de ${cita.paciente}?`)) return;
    try {
      await axios.put(`${baseUrl}/finalizacion/${cita.idCita}`);
      showToast('Cita finalizada exitosamente', 'success');
      onSuccess();
    } catch (err) {
      showToast(extraerMensajeAxios(err, 'Error al finalizar la cita'), 'error');
    }
    onClose();
  };

  const handleCancelar = async () => {
    if (!window.confirm(`¿Está seguro que desea cancelar la cita de ${cita.paciente}?`)) return;
    try {
      await axios.put(`${baseUrl}/cancelacion/${cita.idCita}`);
      showToast('Cita cancelada exitosamente', 'success');
      onSuccess();
    } catch (err) {
      showToast(extraerMensajeAxios(err, 'Error al cancelar la cita'), 'error');
    }
    onClose();
  };

  const handleEliminar = async () => {
    if (!window.confirm(`¿Está seguro que desea eliminar la cita ${cita.idCita}?`)) return;
    try {
      await axios.delete(`${baseUrl}/eliminacion/${cita.idCita}`);
      showToast('Cita eliminada exitosamente', 'success');
      onSuccess();
    } catch (err) {
      showToast(extraerMensajeAxios(err, 'Error al eliminar la cita'), 'error');
    }
    onClose();
  };

  return (
    <>
      <div className='fixed inset-0 z-40' onClick={onClose} />
      <div
        className='fixed z-50 w-44 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden'
        style={{ top: menuPos.top, right: menuPos.right }}
      >
        {puedeFinalizar && (
          <button
            onClick={handleFinalizar}
            className='w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-emerald-600 hover:bg-emerald-50 transition-colors'
          >
            <CheckCircle size={14} />
            Finalizar cita
          </button>
        )}
        <button
          onClick={() => { if (!bloqueada) { onReagendar(cita); onClose(); } }}
          disabled={bloqueada}
          title={bloqueada ? `No se puede reagendar: la cita está ${cita.estadoCita}` : undefined}
          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors ${bloqueada ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50'}`}
        >
          <Calendar size={14} style={{ color: bloqueada ? '#cbd5e1' : primaryColor }} />
          Reagendar cita
        </button>
        <button
          onClick={() => { if (!bloqueada) handleCancelar(); }}
          disabled={bloqueada}
          title={bloqueada ? `No se puede cancelar: la cita está ${cita.estadoCita}` : undefined}
          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors ${bloqueada ? 'text-slate-300 cursor-not-allowed' : 'text-orange-500 hover:bg-orange-50'}`}
        >
          <Ban size={14} />
          Cancelar cita
        </button>
        <div className='border-t border-slate-100' />
        <button
          onClick={handleEliminar}
          className='w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 transition-colors'
        >
          <Trash2 size={14} />
          Eliminar cita
        </button>
      </div>
    </>
  );
};

export default CitaActionMenu;
