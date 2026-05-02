import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import type { Paciente, PacienteDTO } from '../../types/index';
import { PACIENTES_URL } from '../../constants/api';
import { useToast } from '../../hooks/useToast';
import { extraerMensajeAxios, extraerCamposConError } from '../../utils/formatters';

interface PacienteFormModalProps {
  primaryColor: string;
  onSuccess: () => void;
  onClose: () => void;
  pacienteToEdit?: Paciente;
}

const inputBase   = 'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all';
const inputError  = 'w-full px-3.5 py-2.5 text-sm border border-red-400 rounded-lg bg-red-50 ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all';
const inputReadonly = 'w-full px-3.5 py-2.5 text-sm border border-slate-100 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed';

const PacienteFormModal: React.FC<PacienteFormModalProps> = ({ primaryColor, onSuccess, onClose, pacienteToEdit }) => {
  const esEdicion = !!pacienteToEdit;

  const [formData, setFormData] = useState<PacienteDTO>({
    numeroDoc:      pacienteToEdit?.numeroDoc      ?? '',
    tipoDoc:        pacienteToEdit?.tipoDoc        ?? 1,
    nombre:         pacienteToEdit?.nombre         ?? '',
    apellido:       pacienteToEdit?.apellido       ?? '',
    fechaNacimiento: pacienteToEdit?.fechaNacimiento?.split('T')[0] ?? '',
    sexo:           pacienteToEdit?.sexo           ?? 'M',
    email:          pacienteToEdit?.email          ?? '',
    telefono:       pacienteToEdit?.telefono       ?? '',
    direccion:      pacienteToEdit?.direccion      ?? '',
  });

  const [camposConError, setCamposConError] = useState<Set<string>>(new Set());
  const { showToast } = useToast();
  const hoy = new Date().toISOString().split('T')[0];

  const limpiarError = (campo: string) =>
    setCamposConError(prev => { const next = new Set(prev); next.delete(campo); return next; });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    limpiarError(name);
    setFormData(prev => ({ ...prev, [name]: name === 'tipoDoc' ? parseInt(value) : value }));
  };

  const cls = (campo: string, readonly = false) => {
    if (readonly) return inputReadonly;
    return camposConError.has(campo) ? inputError : inputBase;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación frontend: detectar campos vacíos y marcarlos en rojo
    const requeridos = esEdicion
      ? (['email', 'telefono', 'direccion'] as const)
      : (['numeroDoc', 'nombre', 'apellido', 'fechaNacimiento', 'email', 'telefono', 'direccion'] as const);

    const vacios = requeridos.filter(c => !String(formData[c] ?? '').trim());
    if (vacios.length > 0) {
      setCamposConError(new Set(vacios));
      showToast('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    if (!esEdicion && formData.fechaNacimiento) {
      const fecha = new Date(formData.fechaNacimiento + 'T00:00:00');
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      if (fecha >= hoy) {
        setCamposConError(new Set(['fechaNacimiento']));
        showToast('La fecha de nacimiento no puede ser una fecha futura', 'error');
        return;
      }
    }

    try {
      if (esEdicion) {
        await axios.put(`${PACIENTES_URL}/${formData.numeroDoc}`, {
          tipoDoc:   formData.tipoDoc,
          email:     formData.email,
          telefono:  formData.telefono,
          direccion: formData.direccion,
        });
        showToast('Paciente actualizado exitosamente', 'success');
      } else {
        await axios.post(PACIENTES_URL, formData);
        showToast('Paciente registrado exitosamente', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      const campos = extraerCamposConError(err);
      if (campos.length > 0) setCamposConError(new Set(campos));
      showToast(extraerMensajeAxios(err, esEdicion ? 'Error al actualizar el paciente' : 'Error al registrar el paciente'), 'error');
    }
  };

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div>
            <h2 className='text-lg font-semibold text-slate-800'>
              {esEdicion ? 'Editar Paciente' : 'Registrar Paciente'}
            </h2>
            <p className='text-xs text-slate-400 mt-0.5'>
              {esEdicion ? 'Modifica los datos actualizables del paciente' : 'Completa los datos del paciente'}
            </p>
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
              <select name='tipoDoc' value={formData.tipoDoc} onChange={handleInputChange} className={cls('tipoDoc')}>
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
                type='text' name='numeroDoc' value={formData.numeroDoc}
                onChange={handleInputChange} placeholder='Ej: 1234567890'
                readOnly={esEdicion} className={cls('numeroDoc', esEdicion)}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>Nombre *</label>
              <input
                type='text' name='nombre' value={formData.nombre}
                onChange={handleInputChange} placeholder='Ej: Juan'
                readOnly={esEdicion} className={cls('nombre', esEdicion)}
              />
            </div>
            <div>
              <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>Apellido *</label>
              <input
                type='text' name='apellido' value={formData.apellido}
                onChange={handleInputChange} placeholder='Ej: Pérez'
                readOnly={esEdicion} className={cls('apellido', esEdicion)}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>Fecha de Nacimiento *</label>
              <input
                type='date' name='fechaNacimiento' value={formData.fechaNacimiento}
                onChange={handleInputChange}
                readOnly={esEdicion} max={hoy} className={cls('fechaNacimiento', esEdicion)}
              />
            </div>
            <div>
              <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>Sexo *</label>
              {esEdicion ? (
                <input type='text' value={formData.sexo === 'M' ? 'Masculino' : 'Femenino'} readOnly className={inputReadonly} />
              ) : (
                <select name='sexo' value={formData.sexo} onChange={handleInputChange} className={cls('sexo')}>
                  <option value='M'>Masculino</option>
                  <option value='F'>Femenino</option>
                </select>
              )}
            </div>
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>Email *</label>
            <input
              type='email' name='email' value={formData.email}
              onChange={handleInputChange} placeholder='Ej: juan@email.com'
              className={cls('email')}
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>Teléfono *</label>
            <input
              type='text' name='telefono' value={formData.telefono}
              onChange={handleInputChange} placeholder='Ej: 3001234567'
              className={cls('telefono')}
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>Dirección *</label>
            <input
              type='text' name='direccion' value={formData.direccion}
              onChange={handleInputChange} placeholder='Ej: Calle 123 # 45-67'
              className={cls('direccion')}
            />
          </div>

          {esEdicion && (
            <p className='text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg'>
              Los campos en gris no se pueden modificar.
            </p>
          )}
        </div>

        <div className='px-6 pb-6 flex gap-3'>
          <button type='button' onClick={onClose}
            className='flex-1 py-2.5 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium'>
            Cancelar
          </button>
          <button onClick={handleSubmit}
            className='flex-1 py-2.5 text-sm text-white rounded-lg hover:opacity-90 active:scale-95 transition-all font-medium'
            style={{ backgroundColor: primaryColor }}>
            {esEdicion ? 'Guardar Cambios' : 'Registrar Paciente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PacienteFormModal;
