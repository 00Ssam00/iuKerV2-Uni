import React, { useState } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import type { Pagina, NavParams } from '../App';
import type { CitaMedica } from '../types/index';
import { useCitasMedicas } from '../hooks/useCitasMedicas';
import { useAsignaciones } from '../hooks/useAsignaciones';
import Navbar from './shared/Navbar';
import SearchBarCitas from './citas/SearchBarCitas';
import CitasTable from './citas/CitasTable';
import CitasTableGrouped from './citas/CitasTableGrouped';
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
  const { data: asignaciones } = useAsignaciones();
  const [citaEditando, setCitaEditando] = useState<CitaMedica | null | 'nueva'>(null);
  const [idCitaHistorial, setIdCitaHistorial] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'normal' | 'fecha' | 'estado'>('normal');

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

        {/* View Mode Selector */}
        <div className='mb-4 flex gap-3'>
          <button
            onClick={() => setViewMode('normal')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'normal'
                ? 'text-white'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
            style={{
              backgroundColor: viewMode === 'normal' ? primaryColor : 'transparent',
            }}
          >
            Vista Normal
          </button>
          <button
            onClick={() => setViewMode('fecha')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'fecha'
                ? 'text-white'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
            style={{
              backgroundColor: viewMode === 'fecha' ? primaryColor : 'transparent',
            }}
          >
            <Calendar size={16} />
            Por Fecha
          </button>
          <button
            onClick={() => setViewMode('estado')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'estado'
                ? 'text-white'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
            style={{
              backgroundColor: viewMode === 'estado' ? primaryColor : 'transparent',
            }}
          >
            <TrendingUp size={16} />
            Por Estado
          </button>
        </div>

        {viewMode === 'normal' ? (
          <CitasTable
            data={data}
            loading={loading}
            error={error}
            primaryColor={primaryColor}
            baseUrl={baseUrl}
            asignaciones={asignaciones}
            onVerHistorial={setIdCitaHistorial}
            onReagendar={setCitaEditando}
            onSuccess={recargar}
            onRetry={recargar}
          />
        ) : (
          <CitasTableGrouped
            data={data}
            loading={loading}
            error={error}
            primaryColor={primaryColor}
            baseUrl={baseUrl}
            viewMode={viewMode as 'fecha' | 'estado'}
            asignaciones={asignaciones}
            onVerHistorial={setIdCitaHistorial}
            onReagendar={setCitaEditando}
            onSuccess={recargar}
            onRetry={recargar}
          />
        )}
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
