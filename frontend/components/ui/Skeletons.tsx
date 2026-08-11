import React from 'react';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return (
    <div 
      className={`animate-pulse rounded-lg bg-zinc-200/50 dark:bg-zinc-800/60 ${className}`} 
      {...props} 
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-5 space-y-4 rounded-xl">
      <div className="flex items-center space-x-3.5">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-2.5 w-14" />
        </div>
      </div>
      <div className="space-y-1.5 pt-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-900/60">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-3.5 w-full">
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="border border-zinc-200/40 dark:border-zinc-800/60 rounded-xl overflow-hidden">
        <div className="flex border-b border-zinc-200/45 dark:border-zinc-805/50 p-4 bg-zinc-50 dark:bg-zinc-900/40">
          <Skeleton className="h-3.5 w-20 mr-8" />
          <Skeleton className="h-3.5 w-40 mr-8" />
          <Skeleton className="h-3.5 w-28 mr-8" />
          <Skeleton className="h-3.5 w-12" />
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-900/60">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex p-4 items-center">
              <Skeleton className="h-3.5 w-20 mr-8" />
              <Skeleton className="h-3.5 w-40 mr-8" />
              <Skeleton className="h-3.5 w-28 mr-8" />
              <Skeleton className="h-3.5 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-3.5 w-60" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-panel p-5 space-y-3.5 rounded-xl">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-14" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl space-y-3.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
        <div className="glass-panel p-5 rounded-xl space-y-3.5">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-2.5 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
