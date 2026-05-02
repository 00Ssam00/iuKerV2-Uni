import React, { useState, useEffect } from 'react';
import { Calendar, X, Check, Copy, MoreVertical, ChevronDown } from 'lucide-react';
import type { CitaMedica, CitasAgrupadas, Asignacion } from '../../types/index';
import { formatDateShort, formatTime } from '../../utils/formatters';
import EstadoBadge from '../shared/EstadoBadge';
import CitaActionMenu from './CitaActionMenu';
import { agruparPorFecha, agruparPorEstado, getEstadoDisplay } from '../../hooks/useCitasMedicas';

interface CitasTableGroupedProps {
  data: CitaMedica[];
  loading: boolean;
  error: string | null;
  primaryColor: string;
  baseUrl: string;
  viewMode: 'fecha' | 'estado';
  asignaciones?: Asignacion[];
  onVerHistorial: (idCita: string) => void;
  onReagendar: (cita: CitaMedica) => void;
  onSuccess: () => void;
  onRetry: () => void;
}

const CitasTableGrouped: React.FC<CitasTableGroupedProps> = ({
  data, loading, error, primaryColor, baseUrl, viewMode, asignaciones, onVerHistorial, onReagendar, onSuccess, onRetry,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(['Pasadas']));

  useEffect(() => {
    if (viewMode === 'estado') {
      setCollapsedGroups(new Set(['Reprogramadas', 'Finalizadas', 'Canceladas']));
    } else {
      setCollapsedGroups(new Set(['Pasadas']));
    }
  }, [viewMode]);

  const estadoDisplay = (cita: CitaMedica) => getEstadoDisplay(cita);

  const citasAgrupadas: CitasAgrupadas = viewMode === 'fecha' ? agruparPorFecha(data) : agruparPorEstado(data);

  const getConsultorioDeCita = (cita: CitaMedica) => {
    if (!asignaciones || asignaciones.length === 0) return '—';
    const asignacion = asignaciones.find(a => a.tarjetaProfesionalMedico === cita.medicoTarjeta);
    return asignacion?.idConsultorio ?? '—';
  };

  const toggleMenu = (citaId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (openMenuId === citaId) {
      setOpenMenuId(null);
      setMenuPos(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
      setOpenMenuId(citaId);
    }
  };

  const handleCopiarId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleGroup = (groupName: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupName)) {
      newCollapsed.delete(groupName);
    } else {
      newCollapsed.add(groupName);
    }
    setCollapsedGroups(newCollapsed);
  };

  if (loading) {
    return (
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
        <div className='flex flex-col items-center justify-center py-20 gap-3'>
          <div className='relative w-8 h-8'>
            <div className='absolute inset-0 rounded-full border-2' style={{ borderColor: `${primaryColor}40` }} />
            <div className='absolute inset-0 rounded-full border-2 border-t-transparent animate-spin' style={{ borderColor: primaryColor, borderTopColor: 'transparent' }} />
          </div>
          <p className='text-sm text-slate-400'>Cargando citas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
        <div className='flex flex-col items-center justify-center py-20 gap-4'>
          <div className='w-12 h-12 rounded-full bg-red-50 flex items-center justify-center'>
            <X size={20} className='text-red-400' />
          </div>
          <p className='text-sm text-slate-500'>{error}</p>
          <button
            onClick={onRetry}
            className='px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity'
            style={{ backgroundColor: primaryColor }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const citaMenuAbierta = openMenuId ? data.find(c => c.idCita === openMenuId) : null;

  if (Object.keys(citasAgrupadas).length === 0) {
    return (
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
        <div className='flex flex-col items-center justify-center py-20 gap-2'>
          <Calendar size={32} className='text-slate-300' />
          <p className='text-slate-400 text-sm'>No se encontraron citas médicas</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
        {Object.entries(citasAgrupadas).map(([groupName, citas], groupIndex) => (
          <div key={groupName} className={groupIndex > 0 ? 'border-t border-slate-200' : ''}>
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(groupName)}
              className='w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between'
            >
              <div className='flex items-center gap-3'>
                <ChevronDown
                  size={18}
                  className='text-slate-400 transition-transform'
                  style={{
                    transform: collapsedGroups.has(groupName) ? 'rotate(-90deg)' : 'rotate(0deg)',
                  }}
                />
                <h3 className='font-semibold text-slate-700'>{groupName}</h3>
                <span className='text-xs text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-200'>
                  {citas.length}
                </span>
              </div>
            </button>

            {/* Group Content */}
            {!collapsedGroups.has(groupName) && (
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead className='border-b border-slate-100'>
                    <tr>
                      <th className='px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase'>ID</th>
                      <th className='px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase'>Paciente</th>
                      <th className='px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase'>Tipo Documento</th>
                      <th className='px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase'>Número Documento</th>
                      <th className='px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase'>Médico</th>
                      <th className='px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase'>Consultorio</th>
                      <th className='px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase'>Fecha</th>
                      <th className='px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase'>Hora</th>
                      <th className='px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase'>Estado</th>
                      <th className='px-5 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-100'>
                    {citas.map((cita, index) => (
                      <tr key={`${cita.idCita}-${index}`} className='hover:bg-slate-50 transition-colors'>
                        <td className='px-5 py-3.5'>
                          <button
                            onClick={() => handleCopiarId(cita.idCita)}
                            className='group flex items-center gap-1.5'
                            title='Clic para copiar ID completo'
                          >
                            <span className={`font-mono text-xs px-2 py-0.5 rounded transition-colors ${
                              copiedId === cita.idCita
                                ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                            }`}>
                              {cita.idCita.slice(0, 8)}…
                            </span>
                            <span className='w-3 flex-shrink-0 flex items-center justify-center'>
                              {copiedId === cita.idCita
                                ? <Check size={12} className='text-emerald-500' />
                                : <Copy size={12} className='text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity' />
                              }
                            </span>
                          </button>
                        </td>
                        <td className='px-5 py-3.5 font-medium text-slate-700'>{cita.paciente}</td>
                        <td className='px-5 py-3.5 text-slate-500'>{cita.tipoDocPaciente}</td>
                        <td className='px-5 py-3.5 text-slate-500'>{cita.numeroDocPaciente}</td>
                        <td className='px-5 py-3.5 text-slate-700'>{cita.medico}</td>
                        <td className='px-5 py-3.5 text-slate-500'>{getConsultorioDeCita(cita)}</td>
                        <td className='px-5 py-3.5 text-slate-600'>{formatDateShort(cita.fecha)}</td>
                        <td className='px-5 py-3.5 text-slate-600 tabular-nums'>{formatTime(cita.horaInicio)}</td>
                        <td className='px-5 py-3.5'>
                          <EstadoBadge
                            estado={estadoDisplay(cita)}
                            onClick={cita.estadoCita === 'Finalizada' ? () => onVerHistorial(cita.idCita) : undefined}
                          />
                        </td>
                        <td className='px-5 py-3.5 text-center'>
                          <button
                            className='p-1.5 hover:bg-slate-100 rounded-lg transition-colors'
                            onClick={(e) => toggleMenu(cita.idCita, e)}
                          >
                            <MoreVertical size={16} className='text-slate-500' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div className='px-5 py-3 border-t border-slate-100 bg-slate-50'>
          <p className='text-xs text-slate-400'>{data.length} {data.length === 1 ? 'cita encontrada' : 'citas encontradas'}</p>
        </div>
      </div>

      {openMenuId && menuPos && citaMenuAbierta && (
        <CitaActionMenu
          cita={citaMenuAbierta}
          menuPos={menuPos}
          baseUrl={baseUrl}
          primaryColor={primaryColor}
          onReagendar={onReagendar}
          onSuccess={onSuccess}
          onClose={() => { setOpenMenuId(null); setMenuPos(null); }}
        />
      )}
    </>
  );
};

export default CitasTableGrouped;
