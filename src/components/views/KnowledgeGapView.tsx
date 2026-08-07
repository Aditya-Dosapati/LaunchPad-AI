'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../ui/Table';
import { BarChart } from '../ui/Charts';
import { TableSkeleton } from '../ui/Skeletons';
import { ErrorState } from '../ui/ErrorState';
import { Toast } from '../ui/Toast';
import { 
  TrendingUp, 
  HelpCircle, 
  Sparkles,
  FileWarning,
  BarChart2,
  ArrowRight,
  Brain
} from 'lucide-react';
import { CopilotInsightCard } from '../ui/CopilotWidgets';

export const KnowledgeGapView: React.FC = () => {
  const { demoState, setDemoState, setIsUploadModalOpen } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (demoState === 'loading') {
    return <TableSkeleton rows={4} />;
  }

  if (demoState === 'error') {
    return <ErrorState onRetry={() => setDemoState('normal')} />;
  }

  const trendsData = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 19 },
    { label: 'Wed', value: 32 },
    { label: 'Thu', value: 8 },
    { label: 'Fri', value: 14 }
  ];

  const repeatedQuestions = [
    { text: 'Where is the OAuth secret keys config saved in dev?', count: 14, cluster: 'Security / Auth', status: 'Missing SOP' },
    { text: 'How do I set up VPC peering in our AWS EKS cluster?', count: 9, cluster: 'Deployment', status: 'Covered' },
    { text: 'Which Prometheus endpoint tracks request latency?', count: 7, cluster: 'Telemetry', status: 'Draft SOP' }
  ];

  const pendingSOPs = [
    { title: 'OAuth Security Keys Config Guide', reason: 'Zero exact matches in vector DB, 14 repeated queries', occurrences: 14 },
    { title: 'Grafana Latency Query PromQL SOP', reason: 'High search count, low RAG confidence rating (42%)', occurrences: 7 }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in widescreen-container pb-12">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          Knowledge Intelligence & Deficit Analytics
          <BarChart2 size={16} className="text-blue-500" />
        </h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
          Identify repeated questions, knowledge gap scores, documentation health, and AI recommendations.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="secondary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Knowledge Gap Score</p>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">32.6% Deficiency</h4>
            </div>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-zinc-500">
            <span className="text-rose-500 font-bold">+2.4%</span> unresolved queries
          </p>
        </Card>

        <Card variant="secondary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Documentation Health</p>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">88.2 / 100</h4>
            </div>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-zinc-500">
            <span className="text-emerald-500 font-bold">Good</span> 5 SOPs approved recently
          </p>
        </Card>

        <Card variant="secondary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Question Clusters</p>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">3 Main Topics</h4>
            </div>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <HelpCircle size={16} />
            </div>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-zinc-500">
            Security, Deployment, Telemetry
          </p>
        </Card>
      </div>

      {/* AI Manager Recommendations */}
      <CopilotInsightCard title="Knowledge Intelligence Manager Recommendations" icon={<Brain size={14} />} variant="warning">
        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          💡 <strong className="text-zinc-900 dark:text-zinc-100">OAuth / Security documentation</strong> is currently the <strong className="text-rose-500">#1 knowledge gap</strong> across your team. Approving the OAuth Security Keys guide will close 60% of open team inquiries.
        </p>
      </CopilotInsightCard>

      {/* Repeated Questions & Question Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="secondary">
          <CardHeader>
            <CardTitle>Top Repeated Employee Questions</CardTitle>
            <CardDescription>Common inquiries returning low confidence or missing SOPs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {repeatedQuestions.map((q, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/60 pb-2.5">
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate pr-2">{q.text}</p>
                  <p className="text-[9.5px] text-zinc-450 mt-0.5">{q.cluster} • {q.count} queries</p>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-extrabold ${q.status === 'Covered' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                  {q.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Question Timeline Bar Chart */}
        <Card variant="secondary">
          <CardHeader>
            <CardTitle>Daily Question Volume Timeline</CardTitle>
            <CardDescription>Inquiries logged across engineering teams.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <BarChart data={trendsData} height={160} color="#3B82F6" />
          </CardContent>
        </Card>
      </div>

      {/* Pending SOPs */}
      <Card variant="secondary">
        <CardHeader>
          <CardTitle>AI-Generated Pending SOP Requests</CardTitle>
          <CardDescription>Drafting these SOPs will resolve recurring team questions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-1">
          {pendingSOPs.map((sop, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-900/60 pb-3 gap-3">
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-200">{sop.title}</p>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">{sop.reason}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9.5px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md shrink-0">{sop.occurrences} searches</span>
                <button 
                  onClick={() => {
                    setIsUploadModalOpen(true);
                    setToastMsg(`Drafting template for "${sop.title}"`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Draft SOP
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
