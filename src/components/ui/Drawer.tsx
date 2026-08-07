import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label={title}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/30 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in cursor-pointer" 
        onClick={onClose} 
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform glass-panel animate-slide-in-right border-l border-slate-200/50 dark:border-slate-800/80 shadow-2xl flex flex-col h-full bg-white dark:bg-slate-950">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h2>
            <button 
              onClick={onClose}
              aria-label="Close drawer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
