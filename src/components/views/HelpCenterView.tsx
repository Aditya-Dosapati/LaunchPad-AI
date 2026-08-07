'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { TableSkeleton } from '../ui/Skeletons';
import { ErrorState } from '../ui/ErrorState';
import { Toast } from '../ui/Toast';
import { 
  HeartHandshake, 
  Smile, 
  Sparkles, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { CopilotInsightCard } from '../ui/CopilotWidgets';

export const HelpCenterView: React.FC = () => {
  const { demoState, setDemoState, role } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');

  if (demoState === 'loading') {
    return <TableSkeleton rows={4} />;
  }

  if (demoState === 'error') {
    return <ErrorState onRetry={() => setDemoState('normal')} />;
  }

  const employeeFeedbackLog = [
    { text: 'The mentor pairing with Sarah Connor made onboarding 10x smoother!', author: 'David Chen', type: 'Public', sentiment: 'Positive' },
    { text: 'VPC peering setup guide needs clearer diagram steps.', author: 'Anonymous Onboarder', type: 'Anonymous', sentiment: 'Neutral' },
    { text: 'Suggestion: Add a weekly virtual coffee chat for new joiners.', author: 'Alex Mercer', type: 'Suggestion', sentiment: 'Positive' }
  ];

  const commonProblems = [
    { problem: 'VPC Peering diagram steps missing in SOP v1', count: 6, status: 'In Review' },
    { problem: 'MacBook setup script permission error on Day 1', count: 3, status: 'Resolved' }
  ];

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.trim()) return;
    setToastMsg('Feedback submitted. AI sentiment analysis queued.');
    setFeedbackInput('');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in widescreen-container pb-12">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          {role === 'hr' ? 'Employee Feedback & Sentiment Analytics' : 'Help & Feedback Hub'}
          <HeartHandshake size={16} className="text-emerald-500" />
        </h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
          Review employee pulse feedback, anonymous suggestions, common onboarding friction, and AI sentiment analysis.
        </p>
      </div>

      {/* Top Sentiment Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="secondary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Sentiment Analysis</p>
              <h4 className="text-xl font-bold text-emerald-500 mt-1">92% Positive</h4>
            </div>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Smile size={18} />
            </div>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-zinc-500">
            High satisfaction across 42 survey responses
          </p>
        </Card>

        <Card variant="secondary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Feedback Entries</p>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">42 Responses</h4>
            </div>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-zinc-500">
            12 Anonymous • 30 Signed
          </p>
        </Card>

        <Card variant="secondary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Common Onboarding Issues</p>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">2 Reported</h4>
            </div>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertCircle size={18} />
            </div>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-zinc-500">
            1 In Review • 1 Resolved
          </p>
        </Card>
      </div>

      {/* AI Sentiment Insight */}
      <CopilotInsightCard title="AI Sentiment & Pulse Summary" icon={<Sparkles size={14} />} variant="success">
        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          💚 <strong className="text-zinc-900 dark:text-zinc-100">Positive Trend:</strong> 92% of new joiners praise the LaunchPad AI Copilot instant search and 1-on-1 mentor pairing workflow.
        </p>
      </CopilotInsightCard>

      {/* Feedback Logs & Common Problems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Feedback Log */}
        <Card variant="secondary">
          <CardHeader>
            <CardTitle>Recent Employee Feedback & Suggestions</CardTitle>
            <CardDescription>Public and anonymous feedback entries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {employeeFeedbackLog.map((fb, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 text-xs">
                <p className="font-bold text-zinc-800 dark:text-zinc-200">&ldquo;{fb.text}&rdquo;</p>
                <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-400">
                  <span>Author: {fb.author} ({fb.type})</span>
                  <span className="text-emerald-500 font-bold">{fb.sentiment}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Common Problems Tracker */}
        <Card variant="secondary">
          <CardHeader>
            <CardTitle>Common Onboarding Friction & Problems</CardTitle>
            <CardDescription>Issues reported multiple times by onboarders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {commonProblems.map((cp, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-200">{cp.problem}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Reported by {cp.count} onboarders</p>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-extrabold ${cp.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                  {cp.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

      {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
