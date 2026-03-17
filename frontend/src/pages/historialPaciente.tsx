import React, { useState } from 'react';
import type { Pagina, NavParams } from '../App';
import type { HistorialEntry } from '../types/index';
import { useHistorialPaciente } from '../hooks/useHistorialPaciente';
import Navbar from '../components/shared/Navbar';
import HistorialListView from '../components/historial/HistorialListView';
import HistorialDetailView from '../components/historial/HistorialDetailView';
import HistorialFormModal from '../components/historial/HistorialFormModal';

const HistorialPaciente: React.FC<{ onNavigate: (p: Pagina, params?: NavParams) => void }> = ({ onNavigate }) => {
  const { data, loading, error, searched, buscar, recargar } = useHistorialPaciente();
  const [selectedEntry, setSelectedEntry] = useState<HistorialEntry | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchDoc, setSearchDoc] = useState('');

  return (
    <div className='min-h-screen bg-slate-50'>
      <Navbar activePage='historial' onNavigate={onNavigate} />

      {selectedEntry ? (
        <HistorialDetailView
          entry={selectedEntry}
          onBack={() => setSelectedEntry(null)}
          onIrACita={(idCita) => onNavigate('citas', { buscarId: idCita })}
        />
      ) : (
        <HistorialListView
          data={data}
          loading={loading}
          error={error}
          searched={searched}
          searchDoc={searchDoc}
          onSearchChange={setSearchDoc}
          onSearch={() => buscar(searchDoc)}
          onSelectEntry={setSelectedEntry}
          onOpenModal={() => setShowModal(true)}
        />
      )}

      {showModal && (
        <HistorialFormModal
          onSuccess={() => recargar(searchDoc)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default HistorialPaciente;
