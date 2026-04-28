import React, { useState } from 'react';
import type { Pagina, NavParams } from '../App';
import type { Consultorio } from '../types/index';
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
import { MEDICOS_URL, CONSULTORIOS_URL } from '../constants/api';
import { useToast } from '../hooks/useToast';

interface GestionProps {
  onNavigate: (p: Pagina, params?: NavParams) => void;
  activeTab?: 'pacientes' | 'medicos' | 'consultorios';
}

const Gestion: React.FC<GestionProps> = ({ onNavigate, activeTab = 'pacientes' }) => {
  const [currentTab, setCurrentTab] = useState<'pacientes' | 'medicos' | 'consultorios'>(activeTab);
  const [consultorioEditando, setConsultorioEditando] = useState<any>(null);
  const [consultorioParaAsignar, setConsultorioParaAsignar] = useState<Consultorio | null>(null);
  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const [showMedicoModal, setShowMedicoModal] = useState(false);
  const [showConsultorioModal, setShowConsultorioModal] = useState(false);
  const [showAsignacionModal, setShowAsignacionModal] = useState(false);

  const pacientes = usePacientes();
  const medicos = useMedicos();
  const consultorios = useConsultorios();
  const { data: asignaciones } = useAsignaciones();
  const { showToast } = useToast();

  const primaryColor = '#2563EB';

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
        showToast('Consultorio eliminado exitosamente', 'success');
      } catch (err) {
        const mensaje = axios.isAxiosError(err)
          ? err.response?.data?.mensaje ?? 'Error al eliminar el consultorio'
          : 'Error al eliminar el consultorio';
        showToast(mensaje, 'error');
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
              onClick={() => setCurrentTab('pacientes')}
              className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                currentTab === 'pacientes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Pacientes
            </button>
            <button
              onClick={() => setCurrentTab('medicos')}
              className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                currentTab === 'medicos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Médicos
            </button>
            <button
              onClick={() => setCurrentTab('consultorios')}
              className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                currentTab === 'consultorios'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
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
                setShowPacienteModal(true);
              }}
            />
            <PacientesTable
              data={pacientes.data}
              loading={pacientes.loading}
              error={pacientes.error}
              primaryColor={primaryColor}
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
                setShowMedicoModal(true);
              }}
            />
            <MedicosTable
              data={medicos.data}
              loading={medicos.loading}
              error={medicos.error}
              primaryColor={primaryColor}
              onEditar={() => {
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
              onRetry={consultorios.recargar}
            />
          </div>
        )}

        <p className='text-center mt-6 text-xs text-slate-400'>Copyright © 2026 iuKer®</p>
      </main>

      {showMedicoModal && (
        <MedicoFormModal
          primaryColor={primaryColor}
          onSuccess={medicos.recargar}
          onClose={() => {
            setShowMedicoModal(false);
          }}
        />
      )}

      {showPacienteModal && (
        <PacienteFormModal
          primaryColor={primaryColor}
          onSuccess={pacientes.recargar}
          onClose={() => {
            setShowPacienteModal(false);
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
