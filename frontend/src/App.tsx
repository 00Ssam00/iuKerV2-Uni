import { useState } from 'react'
import CitasMedicas from './pages/citasMedicas'
import HistorialPaciente from './pages/historialPaciente'
import Gestion from './pages/gestion'
import PacienteFormModal from './components/pacientes/PacienteFormModal'
import { ToastProvider } from './components/shared/ToastProvider'
import { usePacientes } from './hooks/usePacientes'

export type Pagina = 'citas' | 'historial' | 'gestion';
export type NavParams = { buscarId?: string };

function App() {
  const [pagina, setPagina] = useState<Pagina>('citas');
  const [navParams, setNavParams] = useState<NavParams>({});
  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const pacientes = usePacientes();

  const handleNavigate = (p: Pagina, params: NavParams = {}) => {
    setNavParams(params);
    setPagina(p);
  };

  const primaryColor = '#2563EB';

  return (
    <ToastProvider>
      {pagina === 'citas' ? (
        <CitasMedicas onNavigate={handleNavigate} initialSearch={navParams.buscarId} />
      ) : pagina === 'historial' ? (
        <HistorialPaciente onNavigate={handleNavigate} />
      ) : (
        <Gestion onNavigate={handleNavigate} />
      )}

      {showPacienteModal && (
        <PacienteFormModal
          primaryColor={primaryColor}
          onSuccess={pacientes.recargar}
          onClose={() => setShowPacienteModal(false)}
        />
      )}
    </ToastProvider>
  );
}

export default App;
