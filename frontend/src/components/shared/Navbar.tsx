import React from 'react';
import type { Pagina, NavParams } from '../../App';

interface NavbarProps {
  activePage: Pagina;
  primaryColor?: string;
  onNavigate: (p: Pagina, params?: NavParams) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, primaryColor = '#2563EB', onNavigate }) => (
  <header className='bg-white border-b border-slate-200 shadow-sm'>
    <div className='flex flex-col items-center pt-3 pb-4'>
      <img src='/logoVerticalNoCreditos.svg' alt='iuKer' style={{ height: '130px', width: 'auto' }} />
      <nav className='flex gap-1 mt-5'>
        <button
          onClick={() => activePage !== 'citas' && onNavigate('citas')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activePage === 'citas' ? 'text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
          style={activePage === 'citas' ? { backgroundColor: primaryColor } : undefined}
        >
          Citas Médicas
        </button>
        <button
          onClick={() => activePage !== 'historial' && onNavigate('historial')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activePage === 'historial' ? 'text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
          style={activePage === 'historial' ? { backgroundColor: primaryColor } : undefined}
        >
          Historial
        </button>
        <button
          onClick={() => activePage !== 'gestion' && onNavigate('gestion')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activePage === 'gestion' ? 'text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
          style={activePage === 'gestion' ? { backgroundColor: primaryColor } : undefined}
        >
          Gestión
        </button>
      </nav>
    </div>
  </header>
);

export default Navbar;
