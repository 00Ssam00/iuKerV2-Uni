import DataTable from '../components/dataTable';
import { CITAS_URL } from '../constants/api';
import type { Pagina, NavParams } from '../App';

interface CitasMedicasProps {
  onNavigate: (p: Pagina, params?: NavParams) => void;
  initialSearch?: string;
}

const CitasMedicas = ({ onNavigate, initialSearch }: CitasMedicasProps) => {
  return (
    <DataTable
      baseUrl={CITAS_URL}
      primaryColor='#15425b'
      onNavigate={onNavigate}
      initialSearch={initialSearch}
    />
  );
};

export default CitasMedicas;
