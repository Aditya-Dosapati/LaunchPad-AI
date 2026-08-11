'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'copilot';
  hoverable?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'primary',
  hoverable = false,
  className = '',
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-white dark:bg-[#080a14]/90 border border-zinc-200/60 dark:border-zinc-800/50 shadow-2xs';
      case 'secondary':
        return 'bg-zinc-50/80 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40 shadow-2xs';
      case 'ghost':
        return 'bg-transparent border border-transparent';
      case 'copilot':
        return 'bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5 dark:bg-[#080a14] border border-indigo-500/20 dark:border-indigo-850/40 copilot-glow shadow-2xs';
    }
  };

  const hoverStyle = hoverable 
    ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700' 
    : '';

  return (
    <div
      className={`rounded-2xl p-5 md:p-6 text-left ${getVariantStyles()} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`space-y-1 mb-4 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-sm font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2 ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`space-y-3 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between ${className}`}>
    {children}
  </div>
);
