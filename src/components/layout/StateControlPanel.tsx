'use client';

import React, { useState } from 'react';
import { useApp, DemoState } from '../../context/AppContext';
import { Cpu, RefreshCw, AlertCircle, Database, HelpCircle, ChevronUp } from 'lucide-react';

export const StateControlPanel: React.FC = () => {
  const { demoState, setDemoState } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const states: { value: DemoState; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'normal', label: 'Normal Data', icon: <Database size={12} />, color: 'bg-indigo-500 text-white' },
    { value: 'loading', label: 'Loading Skeletons', icon: <RefreshCw size={12} className="animate-spin" />, color: 'bg-amber-500 text-white' },
    { value: 'empty', label: 'Empty States', icon: <HelpCircle size={12} />, color: 'bg-teal-500 text-white' },
    { value: 'error', label: 'System Errors', icon: <AlertCircle size={12} />, color: 'bg-rose-500 text-white' }
  ];

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none">
      {isOpen ? (
        <div className="glass-panel border border-white/10 dark:border-slate-800/80 shadow-2xl rounded-2xl p-3 bg-white dark:bg-slate-950 flex flex-col gap-2 w-56 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu size={12} className="text-indigo-500" />
              LaunchPad AI Sandbox
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[9px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Hide
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {states.map((s, idx) => {
              const active = demoState === s.value;
              return (
                <button
                  key={idx}
                  onClick={() => setDemoState(s.value)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    active 
                      ? s.color 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {s.icon}
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="h-9 w-9 rounded-full bg-slate-900/90 dark:bg-slate-900/80 hover:bg-slate-800 dark:hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-200/20 shadow-lg flex items-center justify-center transition-all hover:scale-105"
          title="Demo Controls"
        >
          <ChevronUp size={16} />
        </button>
      )}
    </div>
  );
};
