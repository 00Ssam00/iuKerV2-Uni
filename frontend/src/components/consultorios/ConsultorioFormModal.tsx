import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import type { Consultorio, ConsultorioDTO } from '../../types/index';
import { CONSULTORIOS_URL } from '../../constants/api';
import { useToast } from '../../hooks/useToast';

interface ConsultorioFormModalProps {
  consultorioToEdit: Consultorio | null;
  primaryColor: string;
  onSuccess: () => void;
  onClose: () => void;
}

const ConsultorioFormModal: React.FC<ConsultorioFormModalProps> = ({
  consultorioToEdit,
  primaryColor,
  onSuccess,
  onClose,
}) => {
  const isEditing = consultorioToEdit !== null;

  const [formData, setFormData] = useState<ConsultorioDTO>({
    idConsultorio: consultorioToEdit?.idConsultorio ?? '',
    ubicacion: consultorioToEdit?.ubicacion ?? '',
  });

  const { showToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idConsultorio) {
      showToast('El ID del consultorio es obligatorio', 'error');
      return;
    }
    try {
      if (isEditing && consultorioToEdit) {
        await axios.put(`${CONSULTORIOS_URL}/${consultorioToEdit.idConsultorio}`, formData);
        showToast('Consultorio actualizado exitosamente', 'success');
      } else {
        await axios.post(CONSULTORIOS_URL, formData);
        showToast('Consultorio registrado exitosamente', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      const mensaje = axios.isAxiosError(err)
        ? err.response?.data?.mensaje ?? `Error al ${isEditing ? 'actualizar' : 'registrar'} el consultorio`
        : `Error al ${isEditing ? 'actualizar' : 'registrar'} el consultorio`;
      showToast(mensaje, 'error');
    }
  };

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div>
            <h2 className='text-lg font-semibold text-slate-800'>
              {isEditing ? 'Editar Consultorio' : 'Registrar Consultorio'}
            </h2>
            <p className='text-xs text-slate-400 mt-0.5'>
              {isEditing ? 'Modifica los datos del consultorio' : 'Completa los datos del consultorio'}
            </p>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400'>
            <X size={18} />
          </button>
        </div>

        <div className='p-6 space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
              ID del Consultorio {!isEditing && '*'}
            </label>
            <input
              type='text'
              name='idConsultorio'
              value={formData.idConsultorio}
              onChange={handleInputChange}
              disabled={isEditing}
              placeholder='Ej: C001'
              className={`w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                isEditing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            {isEditing && (
              <p className='mt-1 text-xs text-slate-400'>
                El ID del consultorio no se puede modificar
              </p>
            )}
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
              Ubicación (opcional)
            </label>
            <input
              type='text'
              name='ubicacion'
              value={formData.ubicacion ?? ''}
              onChange={handleInputChange}
              placeholder='Ej: Piso 2, Ala Derecha'
              className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
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
            onClick={handleSubmit}
            className='flex-1 py-2.5 text-sm text-white rounded-lg hover:opacity-90 active:scale-95 transition-all font-medium'
            style={{ backgroundColor: primaryColor }}
          >
            {isEditing ? 'Actualizar Consultorio' : 'Registrar Consultorio'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultorioFormModal;
