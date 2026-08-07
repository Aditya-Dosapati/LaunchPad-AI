'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CornerDownLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CopilotInsightCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'warning' | 'success';
}

export const CopilotInsightCard: React.FC<CopilotInsightCardProps> = ({
  title,
  children,
  icon = <Sparkles size={14} className="text-indigo-500 copilot-sparkle" />,
  variant = 'default'
}) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'warning': return 'border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/5';
      case 'success': return 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/5';
      default: return 'border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/5';
    }
  };

  return (
    <div className={`p-5 rounded-2xl border ${getBorderColor()} copilot-glow text-left transition-all`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="text-xs font-extrabold uppercase tracking-widest copilot-gradient-text">{title}</h4>
      </div>
      <div className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">{children}</div>
    </div>
  );
};

export const CopilotSuggestionChip: React.FC<{
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}> = ({ label, icon = <Sparkles size={11} />, onClick, variant = 'secondary' }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-98 ${
        variant === 'primary'
          ? 'bg-indigo-650 hover:bg-indigo-600 text-white'
          : 'bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400'
      }`}
    >
      {icon}
      <span>{label}</span>
      <ArrowRight size={11} className="opacity-70" />
    </button>
  );
};

export const CopilotAskBar: React.FC<{
  placeholder?: string;
  contextLabel?: string;
  mockAnswer?: string;
}> = ({
  placeholder = "Ask LaunchPad Copilot anything about the codebase...",
  contextLabel = "Contextual Knowledge RAG",
  mockAnswer = "Searching 1,240 indexed SOPs & architecture diagrams..."
}) => {
  const [val, setVal] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full space-y-2 text-left">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute left-3.5 top-3 flex items-center gap-1.5 text-indigo-500">
          <Sparkles size={15} className="copilot-sparkle" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={val}
          onChange={(e) => { setVal(e.target.value); setSubmitted(false); }}
          className="w-full text-xs font-semibold pl-10 pr-24 py-3 bg-white dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800 focus:border-indigo-500/40 rounded-2xl outline-none text-zinc-800 dark:text-zinc-200 shadow-xs transition-all"
        />
        <div className="absolute right-2 top-2 flex items-center gap-1">
          <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md">
            {contextLabel}
          </span>
          <button
            type="submit"
            className="p-1.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl shadow-2xs cursor-pointer transition-transform active:scale-95"
          >
            <CornerDownLeft size={13} />
          </button>
        </div>
      </form>

      {submitted && (
        <div className="p-3.5 rounded-xl bg-indigo-500/8 border border-indigo-500/20 text-xs text-zinc-700 dark:text-zinc-300 font-semibold animate-fade-in flex items-start gap-2">
          <ShieldCheck size={15} className="text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-indigo-600 dark:text-indigo-400 text-[10.5px]">Copilot RAG Result (96% Confidence)</p>
            <p className="mt-0.5">{mockAnswer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const CopilotBadge: React.FC = () => (
  <span className="px-2 py-0.5 text-[8.5px] font-extrabold uppercase bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white rounded-md tracking-wider shadow-2xs">
    Copilot v2.4
  </span>
);
