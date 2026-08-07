import React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children, className = '', ...props }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm">
      <table className={`w-full text-xs text-left text-slate-600 dark:text-slate-400 ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = '', ...props }) => {
  return (
    <thead className={`text-[10px] uppercase tracking-wider bg-slate-100/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-extrabold border-b border-slate-200/60 dark:border-slate-800/80 ${className}`} {...props}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = '', ...props }) => {
  return (
    <tbody className={`divide-y divide-slate-100 dark:divide-slate-800/60 ${className}`} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className = '', ...props }) => {
  return (
    <tr className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-900/40 ${className}`} {...props}>
      {children}
    </tr>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...props }) => {
  return (
    <td className={`px-5 py-3.5 font-medium whitespace-nowrap text-slate-800 dark:text-slate-200 ${className}`} {...props}>
      {children}
    </td>
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...props }) => {
  return (
    <th className={`px-5 py-3 select-none ${className}`} {...props}>
      {children}
    </th>
  );
};
