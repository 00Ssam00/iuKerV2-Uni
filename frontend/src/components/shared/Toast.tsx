import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, InfoIcon, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3500 }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: <CheckCircle size={20} className='text-green-600' />,
          text: 'text-green-800',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: <AlertCircle size={20} className='text-red-600' />,
          text: 'text-red-800',
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: <InfoIcon size={20} className='text-blue-600' />,
          text: 'text-blue-800',
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`
        fixed top-8 left-1/2 -translate-x-1/2 z-50
        max-w-md w-full mx-auto
        flex items-start gap-3 px-4 py-3 rounded-lg
        border shadow-lg transition-all duration-200
        ${styles.bg} ${styles.border} ${styles.text}
        ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
      `}
    >
      <div className='flex-shrink-0 mt-0.5'>{styles.icon}</div>
      <p className='flex-1 text-sm font-medium'>{message}</p>
      <button
        onClick={() => {
          setIsClosing(true);
          setTimeout(onClose, 200);
        }}
        className='flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors'
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
