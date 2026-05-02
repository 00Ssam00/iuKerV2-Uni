import React from 'react';

interface EstadoBadgeProps {
  estado: string;
  onClick?: () => void;
}

const estilos: Record<string, string> = {
  Activa:           'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Finalizada:       'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Cancelada:        'bg-red-50 text-red-600 ring-1 ring-red-200',
  Reprogramada:     'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  Actualizada:      'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  'Por finalizar':  'bg-amber-50 text-amber-700 ring-1 ring-amber-300',
};

const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado, onClick }) => {
  const clases = estilos[estado] ?? 'bg-gray-50 text-gray-600 ring-1 ring-gray-200';

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all ${clases}`}
        title='Ver historial clínico'
      >
        {estado}
      </button>
    );
  }

  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${clases}`}>
      {estado}
    </span>
  );
};

export default EstadoBadge;
