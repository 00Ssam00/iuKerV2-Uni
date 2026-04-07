import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import type { PacienteDTO } from '../../types/index';
import { PACIENTES_URL } from '../../constants/api';
import { useToast } from '../../hooks/useToast';

interface PacienteFormModalProps {
  primaryColor: string;
  onSuccess: () => void;
  onClose: () => void;
}

const tipoDocMap: Record<string, string> = { '1': 'CC', '2': 'CE', '3': 'PA', '4': 'TI' };

const PacienteFormModal: React.FC<PacienteFormModalProps> = ({ primaryColor, onSuccess, onClose }) => {
  const [formData, setFormData] = useState<PacienteDTO>({
    numeroDoc: '',
    tipoDoc: 1,
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    sexo: 'M',
    email: '',
    telefono: '',
    direccion: '',
  });

  const { showToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tipoDoc' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.numeroDoc || !formData.nombre || !formData.apellido || !formData.fechaNacimiento ||
        !formData.email || !formData.telefono || !formData.direccion) {
      showToast('Por favor complete todos los campos', 'error');
      return;
    }
    try {
      await axios.post(PACIENTES_URL, formData);
      showToast('Paciente registrado exitosamente', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      const mensaje = axios.isAxiosError(err)
        ? err.response?.data?.mensaje ?? 'Error al registrar el paciente'
        : 'Error al registrar el paciente';
      showToast(mensaje, 'error');
    }
  };

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div>
            <h2 className='text-lg font-semibold text-slate-800'>Registrar Paciente</h2>
            <p className='text-xs text-slate-400 mt-0.5'>Completa los datos del paciente</p>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400'>
            <X size={18} />
          </button>
        </div>

        <div className='p-6 space-y-4'>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
                Tipo de Documento *
              </label>
              <select
                name='tipoDoc'
                value={formData.tipoDoc}
                onChange={handleInputChange}
                className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
              >
                <option value='1'>CC</option>
                <option value='2'>CE</option>
                <option value='3'>PA</option>
                <option value='4'>TI</option>
              </select>
            </div>
            <div>
              <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
                Número de Documento *
              </label>
              <input
                type='text'
                name='numeroDoc'
                value={formData.numeroDoc}
                onChange={handleInputChange}
                placeholder='Ej: 1234567890'
                className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
                Nombre *
              </label>
              <input
                type='text'
                name='nombre'
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder='Ej: Juan'
                className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
              />
            </div>
            <div>
              <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
                Apellido *
              </label>
              <input
                type='text'
                name='apellido'
                value={formData.apellido}
                onChange={handleInputChange}
                placeholder='Ej: Pérez'
                className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
                Fecha de Nacimiento *
              </label>
              <input
                type='date'
                name='fechaNacimiento'
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
              />
            </div>
            <div>
              <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
                Sexo *
              </label>
              <select
                name='sexo'
                value={formData.sexo}
                onChange={handleInputChange}
                className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
              >
                <option value='M'>Masculino</option>
                <option value='F'>Femenino</option>
              </select>
            </div>
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
              Email *
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='Ej: juan@email.com'
              className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
              Teléfono *
            </label>
            <input
              type='text'
              name='telefono'
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder='Ej: 3001234567'
              className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all'
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
              Dirección *
            </label>
            <input
              type='text'
              name='direccion'
              value={formData.direccion}
              onChange={handleInputChange}
              placeholder='Ej: Calle 123 # 45-67'
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
            Registrar Paciente
          </button>
        </div>
      </div>
    </div>
  );
};

export default PacienteFormModal;
