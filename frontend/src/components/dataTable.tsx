import React, { useState } from 'react';
import type { Pagina, NavParams } from '../App';
import type { CitaMedica } from '../types/index';
import { useCitasMedicas } from '../hooks/useCitasMedicas';
import Navbar from './shared/Navbar';
import SearchBarCitas from './citas/SearchBarCitas';
import CitasTable from './citas/CitasTable';
import CitaFormModal from './citas/CitaFormModal';
import HistorialModal from './citas/HistorialModal';

interface DataTableProps {
  baseUrl: string;
  primaryColor: string;
  onNavigate: (p: Pagina, params?: NavParams) => void;
  initialSearch?: string;
}

const DataTable: React.FC<DataTableProps> = ({ baseUrl, primaryColor, onNavigate, initialSearch }) => {
  const { data, loading, error, buscar, recargar } = useCitasMedicas(baseUrl, initialSearch);
  const [citaEditando, setCitaEditando] = useState<CitaMedica | null | 'nueva'>(null);
  const [idCitaHistorial, setIdCitaHistorial] = useState<string | null>(null);

  return (
    <div className='min-h-screen bg-slate-50'>
      <Navbar activePage='citas' primaryColor={primaryColor} onNavigate={onNavigate} />
      <main className='max-w-7xl mx-auto px-4 py-8'>
        <SearchBarCitas
          primaryColor={primaryColor}
          onSearch={buscar}
          onNuevaCita={() => setCitaEditando('nueva')}
          initialValue={initialSearch}
        />
        <CitasTable
          data={data}
          loading={loading}
          error={error}
          primaryColor={primaryColor}
          baseUrl={baseUrl}
          onVerHistorial={setIdCitaHistorial}
          onReagendar={setCitaEditando}
          onSuccess={recargar}
          onRetry={recargar}
        />
        <p className='text-center mt-6 text-xs text-slate-400'>Copyright © 2026 iuKer®</p>
      </main>

      {citaEditando !== null && (
        <CitaFormModal
          citaToEdit={citaEditando === 'nueva' ? null : citaEditando}
          baseUrl={baseUrl}
          primaryColor={primaryColor}
          onSuccess={recargar}
          onClose={() => setCitaEditando(null)}
        />
      )}
      {idCitaHistorial && (
        <HistorialModal
          idCita={idCitaHistorial}
          onClose={() => setIdCitaHistorial(null)}
        />
      )}
    </div>
  );
};

export default DataTable;
