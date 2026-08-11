'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../ui/Table';
import { Shield, Key, Lock, Activity, Eye, Terminal } from 'lucide-react';
import { Toast } from '../ui/Toast';

export const PlaceholderView: React.FC = () => {
  const { role } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const auditLogs = [
    { timestamp: '2026-08-06 20:54:12', user: 'Elena Rostova (Admin)', action: 'Re-indexed Pinecone Vector Index', ip: '192.168.1.104' },
    { timestamp: '2026-08-06 20:42:01', user: 'Sarah Connor (Manager)', action: 'Approved SOP "OAuth Keys Config"', ip: '192.168.1.88' },
    { timestamp: '2026-08-06 20:15:33', user: 'Emma Watson (HR)', action: 'Exported Weekly Talent Readiness PDF', ip: '192.168.1.92' },
    { timestamp: '2026-08-06 19:50:11', user: 'David Chen (Employee)', action: 'Queried Copilot: "OAuth2 authentication flow"', ip: '192.168.1.105' }
  ];

  const handleGenerateAPIKey = () => {
    setToastMsg('Generated new production API Key: `lp_live_9481a82f...` (Saved to vault)');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in widescreen-container pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            Security Console, RBAC & Real-Time Audit Logs
            <Shield size={16} className="text-orange-500" />
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
            Monitor authentication, active sessions, API keys, RBAC policies, and live audit event streams.
          </p>
        </div>

        <button
          onClick={handleGenerateAPIKey}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-98 cursor-pointer"
        >
          <Key size={13} />
          Generate API Key
        </button>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Authentication Provider</p>
          <p className="text-lg font-extrabold text-emerald-500 mt-1">SAML 2.0 / Okta SSO</p>
          <p className="text-[10px] text-zinc-400 mt-1 font-semibold">MFA Enforced for Admins</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active User Sessions</p>
          <p className="text-lg font-extrabold text-orange-600 dark:text-orange-400 mt-1">4 Active Sessions</p>
          <p className="text-[10px] text-zinc-400 mt-1 font-semibold">128-bit Encrypted</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">API Keys Active</p>
          <p className="text-lg font-extrabold text-indigo-500 mt-1">3 Live Production Keys</p>
          <p className="text-[10px] text-zinc-400 mt-1 font-semibold">Scoped to Graph Index</p>
        </Card>
      </div>

      {/* Real-time Audit Logs Stream */}
      <Card variant="secondary">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Terminal size={16} className="text-orange-500" />
            Live Security Audit Event Stream
          </CardTitle>
          <CardDescription>Real-time log of administrative and platform access events.</CardDescription>
        </CardHeader>
        <CardContent className="border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User Account</TableHead>
                <TableHead>Security Action Performed</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-xs font-mono font-bold text-zinc-400">{log.timestamp}</TableCell>
                  <TableCell className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{log.user}</TableCell>
                  <TableCell className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">{log.action}</TableCell>
                  <TableCell className="text-xs font-mono text-zinc-400">{log.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {toastMsg && <Toast message={toastMsg} type="info" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
