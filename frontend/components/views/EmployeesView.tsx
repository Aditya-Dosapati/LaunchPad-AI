'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../ui/Table';
import { Drawer } from '../ui/Drawer';
import { TableSkeleton } from '../ui/Skeletons';
import { ErrorState } from '../ui/ErrorState';
import { Toast } from '../ui/Toast';
import { 
  User, 
  Search, 
  Eye, 
  UserCheck, 
  Shield, 
  Lock,
  UserPlus
} from 'lucide-react';

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: 'Employee' | 'Manager' | 'HR' | 'Admin';
  permissions: string[];
  status: 'Active' | 'Suspended';
  mfaEnabled: boolean;
  avatar: string;
}

export const EmployeesView: React.FC = () => {
  const { demoState, setDemoState, role, employees, dataLoading } = useApp();
  const [searchVal, setSearchVal] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [activeDrawer, setActiveDrawer] = useState<AdminUserRow | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (demoState === 'loading' || dataLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (demoState === 'error') {
    return <ErrorState onRetry={() => setDemoState('normal')} />;
  }

  const getPermissionsForRole = (r: string): string[] => {
    switch (r) {
      case 'admin': return ['Full Platform Access', 'LLM Provider Config', 'RBAC Management'];
      case 'hr': return ['Onboarding Pipeline', 'Talent Analytics', 'Policy Publishing'];
      case 'manager': return ['Team Analytics', 'SOP Approval', 'Mentor Assignment'];
      default: return ['Copilot Search', 'Learning Hub', 'Document View'];
    }
  };

  const adminUsers: AdminUserRow[] = employees.map(emp => ({
    id: emp.id,
    name: emp.name,
    email: emp.email,
    role: (emp.role.charAt(0).toUpperCase() + emp.role.slice(1)) as AdminUserRow['role'],
    permissions: getPermissionsForRole(emp.role),
    status: emp.status === 'Active' ? 'Active' : emp.status === 'Suspended' ? 'Suspended' : 'Active',
    mfaEnabled: emp.role === 'admin' || emp.role === 'manager' || emp.role === 'hr',
    avatar: emp.avatar,
  }));

  const roleOptions = ['All', 'Employee', 'Manager', 'HR', 'Admin'];

  const getRoleBadge = (r: AdminUserRow['role']) => {
    switch (r) {
      case 'Admin':
        return <span className="px-2 py-0.5 text-[8.5px] font-extrabold text-orange-600 bg-orange-500/10 rounded-md">Admin</span>;
      case 'HR':
        return <span className="px-2 py-0.5 text-[8.5px] font-extrabold text-emerald-600 bg-emerald-500/10 rounded-md">HR</span>;
      case 'Manager':
        return <span className="px-2 py-0.5 text-[8.5px] font-extrabold text-blue-600 bg-blue-500/10 rounded-md">Manager</span>;
      case 'Employee':
        return <span className="px-2 py-0.5 text-[8.5px] font-extrabold text-purple-600 bg-purple-500/10 rounded-md">Employee</span>;
    }
  };

  const filteredUsers = adminUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchVal.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchVal.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 text-left animate-fade-in widescreen-container pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            User Management & RBAC Permissions
            <Shield size={16} className="text-orange-500" />
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
            Manage system users across Employees, Managers, HR, and Admins. Assign granular RBAC permissions.
          </p>
        </div>

        <button 
          onClick={() => setToastMsg('User provisioning modal opened')}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
        >
          <UserPlus size={14} />
          Provision User Account
        </button>
      </div>

      {/* Controls: Search & Role Filter */}
      <div className="flex flex-col sm:flex-row gap-4 bg-zinc-50 dark:bg-zinc-900/10 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/40">
        <div className="relative flex-1 group">
          <Search size={13} className="absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full text-xs font-semibold pl-9 pr-4 py-2 bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800 focus:border-orange-500/20 rounded-xl text-zinc-800 dark:text-zinc-200 outline-none shadow-xs"
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs font-semibold px-3.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer"
        >
          {roleOptions.map((r, idx) => (
            <option key={idx} value={r}>{r} Role</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Account</TableHead>
              <TableHead>System Role</TableHead>
              <TableHead>Assigned Permissions</TableHead>
              <TableHead>MFA Status</TableHead>
              <TableHead>Account Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((usr) => (
              <TableRow key={usr.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={usr.avatar} alt={usr.name} className="h-8 w-8 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-800" />
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{usr.name}</p>
                      <p className="text-[10px] text-zinc-400 font-semibold">{usr.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(usr.role)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {usr.permissions.map((p, pIdx) => (
                      <span key={pIdx} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-[9.5px] font-bold text-zinc-600 dark:text-zinc-400 rounded">
                        {p}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-xs font-bold">
                  {usr.mfaEnabled ? (
                    <span className="text-emerald-500">🔒 MFA Enforced</span>
                  ) : (
                    <span className="text-amber-500">⚠️ Optional</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 rounded-md text-[8.5px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {usr.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => setActiveDrawer(usr)}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-orange-500 cursor-pointer"
                  >
                    <Eye size={14} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* User Detail Drawer */}
      {activeDrawer && (
        <Drawer
          isOpen={!!activeDrawer}
          onClose={() => setActiveDrawer(null)}
          title={`User Permissions: ${activeDrawer.name}`}
        >
          <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-zinc-100 dark:border-zinc-900/60">
            <img src={activeDrawer.avatar} alt={activeDrawer.name} className="h-16 w-16 rounded-full border-2 border-orange-500 object-cover shadow-xs" />
            <div>
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{activeDrawer.name}</h3>
              <p className="text-[11px] font-semibold text-zinc-400">{activeDrawer.email}</p>
            </div>
            {getRoleBadge(activeDrawer.role)}
          </div>

          <div className="space-y-4 pt-6 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">RBAC Permission Matrix</label>
              <div className="space-y-2">
                {activeDrawer.permissions.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span>{p}</span>
                    <span className="text-emerald-500 font-bold">Granted</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900/60 space-y-3">
              <button
                onClick={() => {
                  setToastMsg(`Permissions updated for ${activeDrawer.name}`);
                  setActiveDrawer(null);
                }}
                className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white rounded-xl shadow-xs cursor-pointer"
              >
                Save Role & Permission Changes
              </button>
            </div>
          </div>
        </Drawer>
      )}

      {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
