import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import type { CitaMedica, CitaFormData, MedicosApiResponse } from '../../types/index';
import { MEDICOS_URL } from '../../constants/api';

interface CitaFormModalProps {
  citaToEdit: CitaMedica | null;
  baseUrl: string;
  primaryColor: string;
  onSuccess: () => void;
  onClose: () => void;
}

const tipoDocMap: Record<string, string> = { CC: '1', CE: '2', PA: '3', TI: '4' };

const CitaFormModal: React.FC<CitaFormModalProps> = ({ citaToEdit, baseUrl, primaryColor, onSuccess, onClose }) => {
  const isEditing = citaToEdit !== null;

  const [formData, setFormData] = useState<CitaFormData>(() => {
    if (citaToEdit) {
      return {
        medico: citaToEdit.medicoTarjeta ?? '',
        tipoDocPaciente: tipoDocMap[citaToEdit.tipoDocPaciente] || '1',
        numeroDocPaciente: citaToEdit.numeroDocPaciente,
        fecha: citaToEdit.fecha.split('T')[0],
        horaInicio: citaToEdit.horaInicio.substring(0, 5),
      };
    }
    return { medico: '', tipoDocPaciente: '', numeroDocPaciente: '', fecha: '', horaInicio: '' };
  });

  const [medicoSugerido, setMedicoSugerido] = useState('');

  const medicoActualNombre = citaToEdit
    ? (citaToEdit.medicoTarjeta ? `${citaToEdit.medicoTarjeta} - ${citaToEdit.medico}` : citaToEdit.medico)
    : '';

  useEffect(() => {
    if (!isEditing) {
      axios.get<MedicosApiResponse>(`${MEDICOS_URL}?limite=1`)
        .then(res => { const m = res.data.medicos?.[0]; if (m) setMedicoSugerido(m.tarjetaProfesional); })
        .catch(() => setMedicoSugerido(''));
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medico || !formData.tipoDocPaciente || !formData.numeroDocPaciente || !formData.fecha || !formData.horaInicio) {
      alert('Por favor complete todos los campos');
      return;
    }
    try {
      const payload = {
        medico: formData.medico,
        tipoDocPaciente: parseInt(formData.tipoDocPaciente),
        numeroDocPaciente: formData.numeroDocPaciente,
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
      };
      if (isEditing && citaToEdit) {
        await axios.put(`${baseUrl}/reprogramacion/${citaToEdit.idCita}`, payload);
        alert('Cita reagendada exitosamente');
      } else {
        await axios.post(baseUrl, payload);
        alert('Cita agendada exitosamente');
      }
      onSuccess();
      onClose();
    } catch (err) {
      const mensaje = axios.isAxiosError(err)
        ? err.response?.data?.mensaje ?? `Error al ${isEditing ? 'reagendar' : 'agendar'} la cita`
        : `Error al ${isEditing ? 'reagendar' : 'agendar'} la cita`;
      alert(mensaje);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div>
            <h2 className='text-lg font-semibold text-slate-800'>{isEditing ? 'Reagendar cita' : 'Nueva cita'}</h2>
            <p className='text-xs text-slate-400 mt-0.5'>{isEditing ? 'Modifica los datos de la cita' : 'Completa los datos para agendar'}</p>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400'>
            <X size={18} />
          </button>
        </div>

        <div className='p-6 space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
              Código del Médico *
            </label>
            <input
              type='text'
              name='medico'
              value={formData.medico}
              onChange={handleInputChange}
              placeholder={medicoSugerido ? `Ej: ${medicoSugerido}` : 'Ej: MP002'}
              className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
            />
            {isEditing && medicoActualNombre && (
              <p className='mt-1 text-xs text-slate-400'>
                Médico actual: <span className='text-slate-600 font-medium'>{medicoActualNombre}</span>
              </p>
            )}
            {!isEditing && medicoSugerido && (
              <p className='mt-1 text-xs text-slate-400'>
                Próximo disponible:{' '}
                <button
                  type='button'
                  onClick={() => setFormData(p => ({ ...p, medico: medicoSugerido }))}
                  className='text-blue-500 hover:underline font-medium'
                >
                  {medicoSugerido}
                </button>
              </p>
            )}
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
              Tipo de Documento *
            </label>
            <select
              name='tipoDocPaciente'
              value={formData.tipoDocPaciente}
              onChange={handleInputChange}
              className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all appearance-none'
            >
              <option value=''>Seleccione...</option>
              <option value='1'>Cédula de Ciudadanía</option>
              <option value='2'>Cédula de Extranjería</option>
              <option value='3'>Pasaporte</option>
              <option value='4'>Tarjeta de Identidad</option>
            </select>
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
              Número de Documento *
            </label>
            <input
              type='text'
              name='numeroDocPaciente'
              value={formData.numeroDocPaciente}
              onChange={handleInputChange}
              placeholder='Ej: 100001'
              className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>Fecha *</label>
              <input
                type='date'
                name='fecha'
                value={formData.fecha}
                onChange={handleInputChange}
                className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
              />
            </div>
            <div>
              <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>Hora *</label>
              <input
                type='time'
                name='horaInicio'
                value={formData.horaInicio}
                onChange={handleInputChange}
                className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
              />
            </div>
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
            onClick={handleSubmit}
            className='flex-1 py-2.5 text-sm text-white rounded-lg hover:opacity-90 active:scale-95 transition-all font-medium'
            style={{ backgroundColor: primaryColor }}
          >
            {isEditing ? 'Reagendar' : 'Agendar cita'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitaFormModal;
