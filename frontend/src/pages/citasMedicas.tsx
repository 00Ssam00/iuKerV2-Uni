import DataTable from '../components/dataTable';
import type { Pagina, NavParams } from '../App';

interface CitasMedicasProps {
  onNavigate: (p: Pagina, params?: NavParams) => void;
  initialSearch?: string;
}

const CitasMedicas = ({ onNavigate, initialSearch }: CitasMedicasProps) => {
  return (
    <DataTable
      baseUrl='http://localhost:3001/api/citas-medicas'
      primaryColor='#2563EB'
      onNavigate={onNavigate}
      initialSearch={initialSearch}
    />
  );
};

export default CitasMedicas;
