import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

interface SearchBarConsultoriosProps {
  primaryColor: string;
  onSearch: (query: string) => void;
  onNuevoConsultorio: () => void;
  initialValue?: string;
}

const SearchBarConsultorios: React.FC<SearchBarConsultoriosProps> = ({
  primaryColor,
  onSearch,
  onNuevoConsultorio,
  initialValue = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className='flex gap-3 items-center mb-6'>
      <form onSubmit={handleSubmit} className='flex-1'>
        <div className='relative'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Buscar por ID o ubicación...'
            className='w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all'
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          />
        </div>
      </form>
      <button
        onClick={onNuevoConsultorio}
        className='flex items-center gap-2 px-4 py-2.5 text-sm text-white rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all font-medium'
        style={{ backgroundColor: primaryColor }}
      >
        <Plus size={16} />
        Nuevo Consultorio
      </button>
    </div>
  );
};

export default SearchBarConsultorios;
