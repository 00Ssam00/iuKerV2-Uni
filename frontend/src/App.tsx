import { useState } from 'react'
import CitasMedicas from './pages/citasMedicas'
import HistorialPaciente from './pages/historialPaciente'

export type Pagina = 'citas' | 'historial';
export type NavParams = { buscarId?: string };

function App() {
  const [pagina, setPagina] = useState<Pagina>('citas');
  const [navParams, setNavParams] = useState<NavParams>({});

  const handleNavigate = (p: Pagina, params: NavParams = {}) => {
    setNavParams(params);
    setPagina(p);
  };

  return pagina === 'citas'
    ? <CitasMedicas onNavigate={handleNavigate} initialSearch={navParams.buscarId} />
    : <HistorialPaciente onNavigate={handleNavigate} />;
}

export default App;
