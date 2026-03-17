import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

interface SearchBarCitasProps {
  primaryColor: string;
  onSearch: (id: string) => void;
  onNuevaCita: () => void;
  initialValue?: string;
}

const SearchBarCitas: React.FC<SearchBarCitasProps> = ({ primaryColor, onSearch, onNuevaCita, initialValue = '' }) => {
  const [searchId, setSearchId] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchId);
  };

  return (
    <div className='flex gap-3 items-center mb-6'>
      <form onSubmit={handleSubmit} className='flex-1'>
        <div className='relative'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
          <input
            type='text'
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder='Buscar por ID de cita o número de documento...'
            className='w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all'
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          />
        </div>
      </form>
      <button
        onClick={onNuevaCita}
        className='flex items-center gap-2 px-4 py-2.5 text-sm text-white rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all font-medium'
        style={{ backgroundColor: primaryColor }}
      >
        <Plus size={16} />
        Nueva cita
      </button>
    </div>
  );
};

export default SearchBarCitas;
