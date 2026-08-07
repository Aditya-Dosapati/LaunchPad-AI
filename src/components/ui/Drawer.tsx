import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden" role="dialog" aria-modal="true" aria-label={title}>
      {/* Viewport Backdrop */}
      <div 
        className="fixed inset-0 z-[9999] bg-black/40 dark:bg-black/60 backdrop-blur-md transition-opacity animate-fade-in cursor-pointer" 
        onClick={onClose} 
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-[10000] flex max-w-full pl-10">
        <div className="w-screen max-w-md transform glass-panel animate-slide-in-right border-l border-zinc-200/50 dark:border-zinc-800/80 shadow-2xl flex flex-col h-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/50">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
            <button 
              onClick={onClose}
              aria-label="Close drawer"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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
    </div>,
    document.body
  );
};
