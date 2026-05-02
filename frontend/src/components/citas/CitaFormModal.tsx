import React, { useState, useEffect, useCallback } from 'react';
import { X, Zap, User, Stethoscope, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import type { CitaMedica, CitaFormData, Medico, MedicosApiResponse } from '../../types/index';
import { MEDICOS_URL, CITAS_URL } from '../../constants/api';
import { useToast } from '../../hooks/useToast';
import { extraerMensajeAxios, extraerCamposConError } from '../../utils/formatters';

interface CitaFormModalProps {
  citaToEdit: CitaMedica | null;
  baseUrl: string;
  primaryColor: string;
  onSuccess: () => void;
  onClose: () => void;
}

interface Disponibilidad {
  jornadas: { inicioJornada: string; finJornada: string }[];
  slotsDisponibles: string[];
  slotsOcupados: string[];
}

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const tipoDocMap: Record<string, string> = { CC: '1', CE: '2', PA: '3', TI: '4' };

const inputBase  = 'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all';
const inputError = 'w-full px-3.5 py-2.5 text-sm border border-red-400 rounded-lg bg-red-50 ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all';

const CitaFormModal: React.FC<CitaFormModalProps> = ({ citaToEdit, baseUrl, primaryColor, onSuccess, onClose }) => {
  const isEditing = citaToEdit !== null;
  const { showToast } = useToast();

  const [camposConError, setCamposConError] = useState<Set<string>>(new Set());
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad | null>(null);
  const [horarioMedico, setHorarioMedico] = useState<{ diaSemana: number; inicioJornada: string; finJornada: string }[]>([]);
  const [cargandoSlots, setCargandoSlots] = useState(false);
  const [cargandoProximo, setCargandoProximo] = useState(false);
  const [slotSeleccionado, setSlotSeleccionado] = useState('');

  const cls = (campo: string) => camposConError.has(campo) ? inputError : inputBase;

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

  // Cargar lista de médicos al montar
  useEffect(() => {
    axios.get<MedicosApiResponse>(MEDICOS_URL)
      .then(res => setMedicos(res.data.medicos ?? []))
      .catch(() => setMedicos([]));

    if (citaToEdit) {
      const slot = citaToEdit.horaInicio.substring(0, 5);
      setSlotSeleccionado(slot);
      const tarjeta = citaToEdit.medicoTarjeta ?? '';
      if (tarjeta) {
        axios.get<{ diaSemana: number; inicioJornada: string; finJornada: string }[]>(
          `${CITAS_URL}/horario`, { params: { medico: tarjeta } }
        ).then(res => setHorarioMedico(res.data)).catch(() => {});
      }
    }
  }, [citaToEdit]);

  // Cargar disponibilidad cuando cambia médico o fecha
  const cargarDisponibilidad = useCallback(async (medico: string, fecha: string) => {
    if (!medico || !fecha) { setDisponibilidad(null); return; }
    setCargandoSlots(true);
    try {
      const res = await axios.get<Disponibilidad>(`${CITAS_URL}/disponibilidad`, {
        params: { medico, fecha },
      });
      setDisponibilidad(res.data);
      // Si el slot seleccionado ya no está disponible, limpiarlo
      setSlotSeleccionado(prev => {
        if (prev && res.data.slotsOcupados.includes(prev)) {
          setFormData(f => ({ ...f, horaInicio: '' }));
          return '';
        }
        return prev;
      });
    } catch {
      setDisponibilidad(null);
    } finally {
      setCargandoSlots(false);
    }
  }, []);

  useEffect(() => {
    cargarDisponibilidad(formData.medico, formData.fecha);
  }, [formData.medico, formData.fecha, cargarDisponibilidad]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCamposConError(prev => { const next = new Set(prev); next.delete(name); return next; });
    if (name === 'medico') {
      setSlotSeleccionado('');
      setDisponibilidad(null);
      setHorarioMedico([]);
      setFormData(prev => ({ ...prev, medico: value, fecha: '', horaInicio: '' }));
      if (value) {
        axios.get<{ diaSemana: number; inicioJornada: string; finJornada: string }[]>(
          `${CITAS_URL}/horario`, { params: { medico: value } }
        ).then(res => setHorarioMedico(res.data)).catch(() => setHorarioMedico([]));
      }
    } else if (name === 'fecha') {
      setSlotSeleccionado('');
      setFormData(prev => ({ ...prev, fecha: value, horaInicio: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSlotClick = (slot: string) => {
    setSlotSeleccionado(slot);
    setCamposConError(prev => { const next = new Set(prev); next.delete('horaInicio'); return next; });
    setFormData(prev => ({ ...prev, horaInicio: slot }));
  };

  const handleProximoDisponible = async () => {
    setCargandoProximo(true);
    try {
      const res = await axios.get<{ medico: string; fecha: string; horaInicio: string }>(
        `${CITAS_URL}/proximo-disponible`
      );
      const { medico, fecha, horaInicio } = res.data;
      setFormData(prev => ({ ...prev, medico, fecha, horaInicio }));
      setSlotSeleccionado(horaInicio);
      axios.get<{ diaSemana: number; inicioJornada: string; finJornada: string }[]>(
        `${CITAS_URL}/horario`, { params: { medico } }
      ).then(r => setHorarioMedico(r.data)).catch(() => {});
      showToast(`Próximo disponible: ${medico} el ${fecha} a las ${horaInicio}`, 'success');
    } catch {
      showToast('No se encontró disponibilidad en los próximos 60 días', 'error');
    } finally {
      setCargandoProximo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requeridos = ['medico', 'tipoDocPaciente', 'numeroDocPaciente', 'fecha', 'horaInicio'] as const;
    const vacios = requeridos.filter(c => !formData[c]);
    if (vacios.length > 0) {
      setCamposConError(new Set(vacios));
      showToast('Por favor complete todos los campos', 'error');
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
        showToast('Cita reagendada exitosamente', 'success');
      } else {
        await axios.post(baseUrl, payload);
        showToast('Cita agendada exitosamente', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      const campos = extraerCamposConError(err);
      if (campos.length > 0) setCamposConError(new Set(campos));
      showToast(extraerMensajeAxios(err, `Error al ${isEditing ? 'reagendar' : 'agendar'} la cita`), 'error');
    }
  };

  const medicoSeleccionadoData = medicos.find(m => m.tarjetaProfesional === formData.medico);

  // Todos los slots combinados para renderizar la grilla completa
  const todosLosSlots = disponibilidad
    ? [...disponibilidad.slotsDisponibles, ...disponibilidad.slotsOcupados].sort()
    : [];

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>

        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div>
            <h2 className='text-lg font-semibold text-slate-800'>
              {isEditing ? 'Reagendar cita' : 'Nueva cita'}
            </h2>
            <p className='text-xs text-slate-400 mt-0.5'>
              {isEditing ? 'Selecciona un nuevo horario' : 'Selecciona médico, fecha y horario'}
            </p>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400'>
            <X size={18} />
          </button>
        </div>

        <div className='p-6 space-y-5'>

          {/* Próximo disponible — solo en creación */}
          {!isEditing && (
            <button
              type='button'
              onClick={handleProximoDisponible}
              disabled={cargandoProximo}
              className='w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50'
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              <Zap size={15} />
              {cargandoProximo ? 'Buscando...' : 'Asignar próximo disponible automáticamente'}
            </button>
          )}

          {/* Sección 1: Médico */}
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <div className='w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold' style={{ backgroundColor: primaryColor }}>1</div>
              <label className='text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5'>
                <Stethoscope size={12} /> Médico
              </label>
            </div>
            <select
              name='medico'
              value={formData.medico}
              onChange={handleInputChange}
              className={cls('medico')}
            >
              <option value=''>Selecciona un médico...</option>
              {medicos.map(m => (
                <option key={m.tarjetaProfesional} value={m.tarjetaProfesional}>
                  {m.tarjetaProfesional} — {m.nombre} {m.apellido} ({m.especialidad})
                </option>
              ))}
            </select>
            {medicoSeleccionadoData && (
              <p className='mt-1.5 ml-1 text-xs text-slate-400 flex items-center gap-1 flex-wrap'>
                <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0' />
                {medicoSeleccionadoData.especialidad}
                {horarioMedico.length > 0 && (() => {
                  // DB: 1=Lun...6=Sáb, 7=Dom
                  const NOMBRES_DIAS_DB = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                  const diasUnicos = [...new Set(horarioMedico.map(j => j.diaSemana))].sort();
                  const diasTexto = diasUnicos.map(d => NOMBRES_DIAS_DB[d]).join(', ');
                  // Calcular jornada desde horarioMedico según el día de la fecha seleccionada
                  const jornadaDelDia = (() => {
                    if (!formData.fecha) return null;
                    const rawDay = new Date(`${formData.fecha}T12:00:00`).getDay();
                    const dbDay = rawDay === 0 ? 7 : rawDay;
                    const jornadas = horarioMedico.filter(j => j.diaSemana === dbDay);
                    return jornadas.length
                      ? jornadas.map(j => `${j.inicioJornada}–${j.finJornada}`).join(', ')
                      : null;
                  })();
                  return (
                    <>
                      <span className='mx-0.5'>·</span>{diasTexto}
                      {jornadaDelDia && <><span className='mx-0.5'>·</span>Jornada: {jornadaDelDia}</>}
                    </>
                  );
                })()}
              </p>
            )}
          </div>

          {/* Sección 2: Paciente */}
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <div className='w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold' style={{ backgroundColor: primaryColor }}>2</div>
              <label className='text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5'>
                <User size={12} /> Paciente
              </label>
            </div>
            <div className='grid grid-cols-3 gap-3'>
              <select
                name='tipoDocPaciente'
                value={formData.tipoDocPaciente}
                onChange={handleInputChange}
                className={cls('tipoDocPaciente')}
              >
                <option value=''>Tipo...</option>
                <option value='1'>CC</option>
                <option value='2'>CE</option>
                <option value='3'>PA</option>
                <option value='4'>TI</option>
              </select>
              <input
                type='text'
                name='numeroDocPaciente'
                value={formData.numeroDocPaciente}
                onChange={handleInputChange}
                placeholder='Número de documento'
                className={cls('numeroDocPaciente') + ' col-span-2'}
              />
            </div>
          </div>

          {/* Sección 3: Fecha */}
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <div className='w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold' style={{ backgroundColor: primaryColor }}>3</div>
              <label className='text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5'>
                <Calendar size={12} /> Fecha
              </label>
            </div>
            <input
              type='date'
              name='fecha'
              value={formData.fecha}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={cls('fecha')}
            />
            {!formData.medico && (
              <p className='mt-1.5 text-xs text-slate-400'>Selecciona un médico primero para ver sus días disponibles</p>
            )}
          </div>

          {/* Sección 4: Horario */}
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <div className='w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold' style={{ backgroundColor: primaryColor }}>4</div>
              <label className='text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5'>
                <Clock size={12} /> Horario
              </label>
              {disponibilidad && (
                <span className='ml-auto text-xs text-slate-400 flex items-center gap-2'>
                  <span className='flex items-center gap-1'>
                    <span className='w-2.5 h-2.5 rounded inline-block' style={{ backgroundColor: primaryColor + '4D' }} />
                    Ocupada
                  </span>
                  <span className='flex items-center gap-1'>
                    <span className='w-2.5 h-2.5 rounded border border-slate-300 inline-block' />
                    Disponible
                  </span>
                </span>
              )}
            </div>

            {!formData.medico || !formData.fecha ? (
              <div className='rounded-xl border border-dashed border-slate-200 bg-slate-50 py-6 flex flex-col items-center gap-1.5'>
                <Clock size={20} className='text-slate-300' />
                <p className='text-xs text-slate-400'>
                  {!formData.medico ? 'Selecciona un médico' : 'Selecciona una fecha'} para ver los horarios
                </p>
              </div>
            ) : cargandoSlots ? (
              <div className='rounded-xl border border-slate-200 py-6 flex items-center justify-center gap-2'>
                <div className='w-4 h-4 rounded-full border-2 border-t-transparent animate-spin' style={{ borderColor: primaryColor, borderTopColor: 'transparent' }} />
                <p className='text-xs text-slate-400'>Cargando horarios...</p>
              </div>
            ) : disponibilidad && disponibilidad.jornadas.length === 0 ? (
              <div className='rounded-xl border border-dashed border-slate-200 bg-slate-50 py-6 flex flex-col items-center gap-1.5'>
                <Clock size={20} className='text-slate-300' />
                <p className='text-xs text-slate-400'>El médico no trabaja este día</p>
              </div>
            ) : disponibilidad ? (
              <div className='rounded-xl border border-slate-200 p-3'>
                <div className='grid grid-cols-4 gap-2'>
                  {todosLosSlots.map(slot => {
                    const ocupado  = disponibilidad.slotsOcupados.includes(slot);
                    const selected = slotSeleccionado === slot;
                    return (
                      <button
                        key={slot}
                        type='button'
                        disabled={ocupado}
                        onClick={() => handleSlotClick(slot)}
                        className={`py-2 rounded-lg text-xs font-medium transition-all border ${
                          selected
                            ? 'text-white border-transparent shadow-sm'
                            : ocupado
                              ? 'cursor-not-allowed line-through'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-800'
                        }`}
                        style={
                          selected
                            ? { backgroundColor: primaryColor, borderColor: primaryColor }
                            : ocupado
                              ? { backgroundColor: primaryColor + '4D', borderColor: primaryColor + '4D', color: primaryColor }
                              : {}
                        }
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                {camposConError.has('horaInicio') && (
                  <p className='mt-2 text-xs text-red-500'>Selecciona un horario disponible</p>
                )}
              </div>
            ) : null}
          </div>

        </div>

        {/* Footer */}
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
