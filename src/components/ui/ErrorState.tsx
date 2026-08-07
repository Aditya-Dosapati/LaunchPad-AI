import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'LaunchPad AI Engine Offline',
  message = 'Unable to connect to LaunchPad AI query nodes. Please check network credentials or retry.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center glass-panel rounded-2xl border border-red-500/15 dark:border-red-500/10 bg-red-500/5 animate-fade-in">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500 dark:text-red-400 mb-3.5 animate-bounce">
        <AlertCircle size={22} />
      </div>
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{title}</h3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed font-medium">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800 active:bg-zinc-100 rounded-lg shadow-sm hover:shadow-black/5 transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <RefreshCw size={12} className="hover:rotate-45 transition-transform" />
          Retry Connection
        </button>
      )}
    </div>
  );
};
