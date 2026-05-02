import React, { useState, useEffect, useRef } from 'react';
import { Calendar, TrendingUp, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
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

type ItemsPorPagina = 10 | 20 | 50;

const DataTable: React.FC<DataTableProps> = ({ baseUrl, primaryColor, onNavigate, initialSearch }) => {
  const { data, loading, error, buscar, recargar } = useCitasMedicas(baseUrl, initialSearch);
  const { data: asignaciones } = useAsignaciones();
  const [citaEditando, setCitaEditando] = useState<CitaMedica | null | 'nueva'>(null);
  const [idCitaHistorial, setIdCitaHistorial] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'normal' | 'fecha' | 'estado'>(
    () => (sessionStorage.getItem('citasViewMode') as 'normal' | 'fecha' | 'estado') ?? 'normal'
  );
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState<ItemsPorPagina>(10);
  const tablaRef = useRef<HTMLDivElement>(null);
  const [transicionando, setTransicionando] = useState(false);

  // Resetear a página 1 al cambiar vista o tamaño de página
  useEffect(() => { setPaginaActual(1); }, [viewMode, itemsPorPagina]);

  // Resetear a página 1 al recibir nuevos datos (búsqueda o recarga)
  useEffect(() => { setPaginaActual(1); }, [data.length]);

  const cambiarPagina = (nuevaPagina: number) => {
    setTransicionando(true);
    setTimeout(() => {
      setPaginaActual(nuevaPagina);
      requestAnimationFrame(() => setTransicionando(false));
    }, 120);
  };

  const totalPaginas = Math.max(1, Math.ceil(data.length / itemsPorPagina));
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const dataPaginada = data.slice(inicio, fin);

  const cambiarViewMode = (modo: 'normal' | 'fecha' | 'estado') => {
    sessionStorage.setItem('citasViewMode', modo);
    setViewMode(modo);
  };

  const cambiarItemsPorPagina = (n: ItemsPorPagina) => {
    setItemsPorPagina(n);
  };

  const mostrandoDesde = data.length === 0 ? 0 : inicio + 1;
  const mostrandoHasta = Math.min(fin, data.length);

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
            onClick={() => cambiarViewMode('normal')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'normal' ? 'text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
            style={{ backgroundColor: viewMode === 'normal' ? primaryColor : 'transparent' }}
          >
            <Clock size={16} />
            Vista General
          </button>
          <button
            onClick={() => cambiarViewMode('fecha')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'fecha' ? 'text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
            style={{ backgroundColor: viewMode === 'fecha' ? primaryColor : 'transparent' }}
          >
            <Calendar size={16} />
            Por Fecha
          </button>
          <button
            onClick={() => cambiarViewMode('estado')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'estado' ? 'text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
            style={{ backgroundColor: viewMode === 'estado' ? primaryColor : 'transparent' }}
          >
            <TrendingUp size={16} />
            Por Estado
          </button>
        </div>

        {/* min-height evita que el contenedor encoja al cambiar de página */}
        <div
          ref={tablaRef}
          style={{
            minHeight: `${itemsPorPagina * 52}px`,
            opacity: transicionando ? 0 : 1,
            transition: 'opacity 150ms ease',
          }}
        >
        {viewMode === 'normal' ? (
          <CitasTable
            data={dataPaginada}
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
            data={dataPaginada}
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
        </div>

        {/* Paginación */}
        {!loading && data.length > 0 && (
          <div className='mt-4 flex flex-wrap items-center justify-between gap-3 px-1'>

            {/* Contador */}
            <p className='text-xs text-slate-400'>
              Mostrando <span className='font-medium text-slate-600'>{mostrandoDesde}–{mostrandoHasta}</span> de{' '}
              <span className='font-medium text-slate-600'>{data.length}</span> citas
            </p>

            {/* Controles de página */}
            <div className='flex items-center gap-1'>
              <button
                onClick={() => cambiarPagina(Math.max(1, paginaActual - 1))}
                disabled={paginaActual === 1}
                className='p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPaginas || Math.abs(n - paginaActual) <= 1)
                .reduce<(number | '…')[]>((acc, n, idx, arr) => {
                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('…');
                  acc.push(n);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '…' ? (
                    <span key={`ellipsis-${idx}`} className='px-1 text-xs text-slate-400'>…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => cambiarPagina(item as number)}
                      className='min-w-[30px] h-[30px] rounded-lg text-xs font-medium transition-colors border'
                      style={
                        paginaActual === item
                          ? { backgroundColor: primaryColor, color: '#fff', borderColor: primaryColor }
                          : { backgroundColor: 'transparent', color: '#64748b', borderColor: '#e2e8f0' }
                      }
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => cambiarPagina(Math.min(totalPaginas, paginaActual + 1))}
                disabled={paginaActual === totalPaginas}
                className='p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
              >
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Elementos por página */}
            <div className='flex items-center gap-2 text-xs text-slate-400'>
              <span>Por página:</span>
              {([10, 20, 50] as ItemsPorPagina[]).map(n => (
                <button
                  key={n}
                  onClick={() => cambiarItemsPorPagina(n)}
                  className='min-w-[34px] h-[26px] rounded-md text-xs font-medium border transition-colors'
                  style={
                    itemsPorPagina === n
                      ? { backgroundColor: primaryColor, color: '#fff', borderColor: primaryColor }
                      : { backgroundColor: 'transparent', color: '#64748b', borderColor: '#e2e8f0' }
                  }
                >
                  {n}
                </button>
              ))}
            </div>

          </div>
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
