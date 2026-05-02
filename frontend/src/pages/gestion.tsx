import React, { useState } from 'react';
import type { Pagina, NavParams } from '../App';
import type { Consultorio, Paciente, Medico } from '../types/index';
import { usePacientes } from '../hooks/usePacientes';
import { useMedicos } from '../hooks/useMedicos';
import { useConsultorios } from '../hooks/useConsultorios';
import { useAsignaciones } from '../hooks/useAsignaciones';
import Navbar from '../components/shared/Navbar';
import SearchBarPacientes from '../components/pacientes/SearchBarPacientes';
import PacientesTable from '../components/pacientes/PacientesTable';
import PacienteFormModal from '../components/pacientes/PacienteFormModal';
import SearchBarMedicos from '../components/medicos/SearchBarMedicos';
import MedicosTable from '../components/medicos/MedicosTable';
import MedicoFormModal from '../components/medicos/MedicoFormModal';
import SearchBarConsultorios from '../components/consultorios/SearchBarConsultorios';
import ConsultoriosTable from '../components/consultorios/ConsultoriosTable';
import ConsultorioFormModal from '../components/consultorios/ConsultorioFormModal';
import AsignacionFormModal from '../components/consultorios/AsignacionFormModal';
import axios from 'axios';
import { MEDICOS_URL, CONSULTORIOS_URL, PACIENTES_URL } from '../constants/api';
import { useToast } from '../hooks/useToast';

interface GestionProps {
  onNavigate: (p: Pagina, params?: NavParams) => void;
  activeTab?: 'pacientes' | 'medicos' | 'consultorios';
}

const Gestion: React.FC<GestionProps> = ({ onNavigate, activeTab = 'pacientes' }) => {
  const [currentTab, setCurrentTab] = useState<'pacientes' | 'medicos' | 'consultorios'>(
    () => (sessionStorage.getItem('gestionTab') as 'pacientes' | 'medicos' | 'consultorios') ?? activeTab
  );

  const cambiarTab = (tab: 'pacientes' | 'medicos' | 'consultorios') => {
    sessionStorage.setItem('gestionTab', tab);
    setCurrentTab(tab);
  };

  const [consultorioEditando, setConsultorioEditando] = useState<Consultorio | null>(null);
  const [consultorioParaAsignar, setConsultorioParaAsignar] = useState<Consultorio | null>(null);
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(null);
  const [medicoEditando, setMedicoEditando] = useState<Medico | null>(null);
  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const [showMedicoModal, setShowMedicoModal] = useState(false);
  const [showConsultorioModal, setShowConsultorioModal] = useState(false);
  const [showAsignacionModal, setShowAsignacionModal] = useState(false);

  const pacientes = usePacientes();
  const medicos = useMedicos();
  const consultorios = useConsultorios();
  const { data: asignaciones, eliminarAsignacion, recargar: recargarAsignaciones } = useAsignaciones();
  const { showToast } = useToast();

  const primaryColor = '#15425b';

  const handleEliminarPaciente = async (numeroDoc: string) => {
    if (window.confirm('¿Estás seguro? Se eliminará todo el historial asociado al paciente.')) {
      try {
        await axios.delete(`${PACIENTES_URL}/${numeroDoc}`);
        pacientes.recargar();
        showToast('Paciente eliminado exitosamente', 'success');
      } catch (err) {
        const mensaje = axios.isAxiosError(err)
          ? err.response?.data?.mensaje ?? 'Error al eliminar el paciente'
          : 'Error al eliminar el paciente';
        showToast(mensaje, 'error');
      }
    }
  };

  const handleEliminarMedico = async (tarjeta: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este médico?')) {
      try {
        await axios.delete(`${MEDICOS_URL}/${tarjeta}`);
        medicos.recargar();
        showToast('Médico eliminado exitosamente', 'success');
      } catch (err) {
        const mensaje = axios.isAxiosError(err)
          ? err.response?.data?.mensaje ?? 'Error al eliminar el médico'
          : 'Error al eliminar el médico';
        showToast(mensaje, 'error');
      }
    }
  };

  const handleEliminarConsultorio = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este consultorio?')) {
      try {
        await axios.delete(`${CONSULTORIOS_URL}/${id}`);
        consultorios.recargar();
        recargarAsignaciones();
        showToast('Consultorio eliminado exitosamente', 'success');
      } catch (err) {
        const mensaje = axios.isAxiosError(err)
          ? err.response?.data?.mensaje ?? 'Error al eliminar el consultorio'
          : 'Error al eliminar el consultorio';
        showToast(mensaje, 'error');
      }
    }
  };

  const handleDesasignarMedico = async (tarjetaMedico: string) => {
    if (window.confirm('¿Estás seguro de que deseas desasignar al médico de este consultorio?')) {
      try {
        await eliminarAsignacion(tarjetaMedico);
        consultorios.recargar();
      } catch {
        // El error ya lo maneja useAsignaciones con un toast
      }
    }
  };

  const handleAsignarMedico = (consultorio: Consultorio) => {
    setConsultorioParaAsignar(consultorio);
    setShowAsignacionModal(true);
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      <Navbar activePage='gestion' primaryColor={primaryColor} onNavigate={onNavigate} />
      <main className='max-w-7xl mx-auto px-4 py-8'>
        <div className='mb-6 border-b border-slate-200'>
          <div className='flex gap-4'>
            <button
              onClick={() => cambiarTab('pacientes')}
              className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                currentTab === 'pacientes' ? '' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
              style={currentTab === 'pacientes' ? { borderColor: primaryColor, color: primaryColor } : {}}
            >
              Pacientes
            </button>
            <button
              onClick={() => cambiarTab('medicos')}
              className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                currentTab === 'medicos' ? '' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
              style={currentTab === 'medicos' ? { borderColor: primaryColor, color: primaryColor } : {}}
            >
              Médicos
            </button>
            <button
              onClick={() => cambiarTab('consultorios')}
              className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                currentTab === 'consultorios' ? '' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
              style={currentTab === 'consultorios' ? { borderColor: primaryColor, color: primaryColor } : {}}
            >
              Consultorios
            </button>
          </div>
        </div>

        {currentTab === 'pacientes' && (
          <div>
            <SearchBarPacientes
              primaryColor={primaryColor}
              onSearch={pacientes.buscar}
              onNuevoPaciente={() => {
                setPacienteEditando(null);
                setShowPacienteModal(true);
              }}
            />
            <PacientesTable
              data={pacientes.data}
              loading={pacientes.loading}
              error={pacientes.error}
              primaryColor={primaryColor}
              onEditar={(p) => {
                setPacienteEditando(p);
                setShowPacienteModal(true);
              }}
              onEliminar={handleEliminarPaciente}
              onRetry={pacientes.recargar}
            />
          </div>
        )}

        {currentTab === 'medicos' && (
          <div>
            <SearchBarMedicos
              primaryColor={primaryColor}
              onSearch={medicos.buscar}
              onNuevoMedico={() => {
                setMedicoEditando(null);
                setShowMedicoModal(true);
              }}
            />
            <MedicosTable
              data={medicos.data}
              loading={medicos.loading}
              error={medicos.error}
              primaryColor={primaryColor}
              onEditar={(m) => {
                setMedicoEditando(m);
                setShowMedicoModal(true);
              }}
              onEliminar={handleEliminarMedico}
              onRetry={medicos.recargar}
            />
          </div>
        )}

        {currentTab === 'consultorios' && (
          <div>
            <SearchBarConsultorios
              primaryColor={primaryColor}
              onSearch={consultorios.buscar}
              onNuevoConsultorio={() => {
                setConsultorioEditando(null);
                setShowConsultorioModal(true);
              }}
            />
            <ConsultoriosTable
              data={consultorios.data}
              loading={consultorios.loading}
              error={consultorios.error}
              primaryColor={primaryColor}
              asignaciones={asignaciones}
              medicos={medicos.data}
              onEditar={c => {
                setConsultorioEditando(c);
                setShowConsultorioModal(true);
              }}
              onEliminar={handleEliminarConsultorio}
              onAsignar={handleAsignarMedico}
              onDesasignar={handleDesasignarMedico}
              onRetry={consultorios.recargar}
            />
          </div>
        )}

        <p className='text-center mt-6 text-xs text-slate-400'>Copyright © 2026 iuKer®</p>
      </main>

      {showMedicoModal && (
        <MedicoFormModal
          primaryColor={primaryColor}
          medicoToEdit={medicoEditando ?? undefined}
          onSuccess={() => {
            medicos.recargar();
            setMedicoEditando(null);
          }}
          onClose={() => {
            setShowMedicoModal(false);
            setMedicoEditando(null);
          }}
        />
      )}

      {showPacienteModal && (
        <PacienteFormModal
          primaryColor={primaryColor}
          pacienteToEdit={pacienteEditando ?? undefined}
          onSuccess={() => {
            pacientes.recargar();
            setPacienteEditando(null);
          }}
          onClose={() => {
            setShowPacienteModal(false);
            setPacienteEditando(null);
          }}
        />
      )}

      {showConsultorioModal && (
        <ConsultorioFormModal
          consultorioToEdit={consultorioEditando}
          primaryColor={primaryColor}
          onSuccess={consultorios.recargar}
          onClose={() => {
            setShowConsultorioModal(false);
            setConsultorioEditando(null);
          }}
        />
      )}

      {showAsignacionModal && consultorioParaAsignar && (
        <AsignacionFormModal
          consultorio={consultorioParaAsignar}
          medicosDisponibles={medicos.data}
          asignaciones={asignaciones}
          primaryColor={primaryColor}
          onSuccess={() => {
            consultorios.recargar();
            medicos.recargar();
          }}
          onClose={() => {
            setShowAsignacionModal(false);
            setConsultorioParaAsignar(null);
          }}
        />
      )}
    </div>
  );
};

export default Gestion;
