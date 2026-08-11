import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/55 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300',
    warning: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/55 dark:border-amber-800/30 text-amber-800 dark:text-amber-300',
    info: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200/55 dark:border-indigo-800/30 text-indigo-800 dark:text-indigo-300'
  };

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={16} />,
    warning: <AlertTriangle className="text-amber-500" size={16} />,
    info: <Info className="text-indigo-500" size={16} />
  };

  return (
    <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md animate-slide-in-right ${styles[type]} max-w-sm`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-sm font-semibold pr-4 leading-normal">{message}</p>
      <button 
        onClick={onClose}
        className="flex-shrink-0 ml-auto p-0.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
      >
        <X size={14} />
      </button>
    </div>
  );
};
