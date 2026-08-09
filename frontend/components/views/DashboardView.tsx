'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { DashboardSkeleton } from '../ui/Skeletons';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { CopilotInsightCard, CopilotAskBar, CopilotBadge } from '../ui/CopilotWidgets';
import { BarChart } from '../ui/Charts';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Users,
  Brain,
  FolderGit2,
  ChevronRight,
  Activity,
  UserPlus,
  HeartHandshake,
  ShieldCheck,
  HelpCircle,
  FileCheck2,
  Smile,
  Shield,
  Cpu,
  Database,
  Link,
  Server,
  Zap
} from 'lucide-react';
import { Toast } from '../ui/Toast';

export const DashboardView: React.FC = () => {
  const { role, demoState, setDemoState, setRoute, currentUser, documents } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const userName = currentUser?.name || (role === 'admin' ? 'Elena Rostova' : role === 'hr' ? 'Emma Watson' : role === 'manager' ? 'Sarah Connor' : 'David Chen');

  if (demoState === 'loading') {
    return <DashboardSkeleton />;
  }

  if (demoState === 'empty') {
    return (
      <EmptyState
        title="No Workspace Data Connected"
        description="Integrate Confluence spaces or GitHub repos in Settings to unlock LaunchPad Copilot metrics."
        actionText="Connect Repositories"
        onAction={() => setDemoState('normal')}
      />
    );
  }

  if (demoState === 'error') {
    return <ErrorState onRetry={() => setDemoState('normal')} />;
  }

  // ==========================================
  // ADMINISTRATOR WORKSPACE DASHBOARD
  // ==========================================
  const renderAdminDashboard = () => (
    <div className="space-y-8 text-left animate-fade-in widescreen-container pb-12">
      
      {/* 1. Header Banner */}
      <div className="relative rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900/20 bg-gradient-to-r from-orange-500/8 via-amber-500/3 to-transparent">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-extrabold uppercase tracking-wider border border-orange-500/15 flex items-center gap-1 w-fit">
              <Shield size={11} />
              Platform Administrator Command Center
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
              Welcome Back, {userName} ⚙️
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold max-w-xl">
              Monitor system health telemetry, storage usage, AI token consumption, API throughput, and integrations status.
            </p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => { setRoute('assistant'); setToastMsg('Opening AI Model Settings...'); }}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-98 cursor-pointer flex items-center gap-1.5"
            >
              <Cpu size={13} />
              AI Model Settings
            </button>
            <button 
              onClick={() => { setRoute('placeholder'); setToastMsg('Opening Security Audit Logs...'); }}
              className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl border border-zinc-200/50 dark:border-zinc-800 hover:border-orange-500/40 cursor-pointer"
            >
              Security Audit Logs
            </button>
          </div>
        </div>
      </div>

      {/* 2. Platform Telemetry Grid (Health, Users, Storage, AI Usage, Projects, Documents, API, Integrations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">System Health Uptime</p>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">99.98% Uptime</p>
          <p className="text-[10.5px] font-semibold text-emerald-500 mt-1">🟢 All Clusters Operational</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Active Users</p>
          <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 mt-1">42 Users</p>
          <p className="text-[10.5px] font-semibold text-zinc-400 mt-1">Across 4 System Roles</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Storage & Vector Index</p>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">1.2 TB Used</p>
          <p className="text-[10.5px] font-semibold text-zinc-400 mt-1">Pinecone Vector & AWS S3</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Token Usage (Today)</p>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">84.2k Tokens</p>
          <p className="text-[10.5px] font-semibold text-zinc-400 mt-1">GPT-4o & Claude 3.5 Sonnet</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Projects</p>
          <p className="text-2xl font-extrabold text-blue-500 mt-1">12 Projects</p>
          <p className="text-[10.5px] font-semibold text-zinc-400 mt-1">Indexed in Graph DB</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Indexed Documents</p>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">1,240 Docs</p>
          <p className="text-[10.5px] font-semibold text-zinc-400 mt-1">Embeddings Synced</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">API Throughput</p>
          <p className="text-2xl font-extrabold text-orange-500 mt-1">142 req/sec</p>
          <p className="text-[10.5px] font-semibold text-zinc-400 mt-1">Avg Latency: 42ms</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ecosystem Integrations</p>
          <p className="text-2xl font-extrabold text-indigo-500 mt-1">8 / 8 Active</p>
          <p className="text-[10.5px] font-semibold text-emerald-500 mt-1">GitHub, Jira, Slack, S3</p>
        </Card>
      </div>

      {/* 3. AI Platform Briefing */}
      <CopilotInsightCard title="Platform AI System Alert" icon={<Cpu size={14} />} variant="default">
        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          ⚙️ <strong className="text-zinc-900 dark:text-zinc-100">Vector Re-indexing Complete:</strong> All 1,240 codebase documents re-indexed with <strong className="text-orange-500 font-bold">OpenAI text-embedding-3-large</strong>. Search latency dropped by 18%.
        </p>
      </CopilotInsightCard>

      {/* 4. Active Integrations Grid */}
      <Card variant="secondary">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <Link size={16} className="text-orange-500" />
            Active Platform Integrations
          </CardTitle>
          <CardDescription>Connected enterprise SaaS data sources.</CardDescription>
        </CardHeader>
        <CardContent className="pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">GitHub</span>
              <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Connected</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">Jira</span>
              <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Connected</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">Confluence</span>
              <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Connected</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">Slack</span>
              <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Connected</span>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );

  // ==========================================
  // HR WORKSPACE DASHBOARD
  // ==========================================
  const renderHRDashboard = () => (
    <div className="space-y-8 text-left animate-fade-in widescreen-container pb-12">
      <div className="relative rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900/20 bg-gradient-to-r from-emerald-500/8 via-teal-500/3 to-transparent">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/15 flex items-center gap-1 w-fit">
              <HeartHandshake size={11} />
              HR Talent & Success Dashboard
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
              Welcome Back, {userName} 👥
            </h1>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // EMPLOYEE WORKSPACE DASHBOARD (Default)
  // ==========================================
  const renderEmployeeDashboard = () => (
    <div className="space-y-8 animate-fade-in widescreen-container pb-12 text-left">
      <div className="relative rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900/20 bg-gradient-to-r from-indigo-500/8 via-purple-500/3 to-transparent">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
              Good Morning, {userName} 👋
            </h1>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {role === 'admin' ? renderAdminDashboard() : role === 'hr' ? renderHRDashboard() : renderEmployeeDashboard()}
      {toastMsg && <Toast message={toastMsg} type="info" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
