import React from 'react';
import { HelpCircle, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'No LaunchPad AI Intelligence Indexed',
  description = 'Connect your GitHub, Confluence, or Jira workspace to index team documents and initialize LaunchPad AI.',
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center glass-panel rounded-2xl border border-dashed border-zinc-200/50 dark:border-zinc-800/80 bg-zinc-500/5 dark:bg-zinc-550/5 animate-fade-in">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 mb-3.5">
        {icon || <HelpCircle size={22} />}
      </div>
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{title}</h3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed font-medium">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-sm hover:shadow-indigo-500/25 transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus size={14} />
          {actionText}
        </button>
      )}
    </div>
  );
};
