'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { TableSkeleton } from '../ui/Skeletons';
import { ErrorState } from '../ui/ErrorState';
import { Toast } from '../ui/Toast';
import { 
  GraduationCap, 
  Award, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  Play,
  Sparkles,
  UserCheck,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { CopilotInsightCard } from '../ui/CopilotWidgets';

export const LearningView: React.FC = () => {
  const { demoState, setDemoState, role } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (demoState === 'loading') {
    return <TableSkeleton rows={4} />;
  }

  if (demoState === 'error') {
    return <ErrorState onRetry={() => setDemoState('normal')} />;
  }

  const upcomingKT = [
    { title: 'AWS EKS Cluster Peering Workshop', host: 'Sarah Connor', time: 'Today at 3:00 PM', attendees: 4 },
    { title: 'Frontend Design System & Glassmorphism SOP', host: 'David Chen', time: 'Tomorrow at 11:00 AM', attendees: 3 }
  ];

  const completedKT = [
    { title: 'OAuth2 Authentication Routing Flow', host: 'Elena Rostova', date: '2026-08-01', rating: '4.9/5' },
    { title: 'Neo4j Cypher Traversal & Indexing', host: 'Alex Mercer', date: '2026-07-28', rating: '4.8/5' }
  ];

  const mentorAssignments = [
    { mentee: 'Alex Mercer (Junior Dev)', mentor: 'Sarah Connor (Lead DevOps)', status: 'Active Pairing' },
    { mentee: 'David Chen (Senior Frontend)', mentor: 'Elena Rostova (VP Platform)', status: 'Active Pairing' }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in widescreen-container pb-12">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          {role === 'manager' ? 'Team Training & Knowledge Transfer Management' : 'Employee Learning Hub'}
          <GraduationCap size={16} className="text-blue-500" />
        </h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
          Manage workshops, KT sessions, mentor assignments, and team skill gap analysis.
        </p>
      </div>

      {/* Mentor Assignment Panel */}
      <Card variant="secondary">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <UserCheck size={16} className="text-blue-500" />
              Active Mentor Assignments
            </CardTitle>
            <button 
              onClick={() => setToastMsg('Mentor pairing modal opened')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Assign New Mentor
            </button>
          </div>
          <CardDescription>Direct pairing between senior architects and onboarders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-1">
          {mentorAssignments.map((ma, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-zinc-800 dark:text-zinc-200">{ma.mentee}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Paired Mentor: {ma.mentor}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {ma.status}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Workshops & KT Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming KT Sessions */}
        <Card variant="secondary">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Calendar size={16} className="text-purple-500" />
              Upcoming KT Workshops & Sessions
            </CardTitle>
            <CardDescription>Scheduled Knowledge Transfer events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {upcomingKT.map((kt, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-200">{kt.title}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Host: {kt.host} • {kt.time}</p>
                </div>
                <span className="text-[9.5px] font-bold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded">
                  {kt.attendees} Attending
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completed KT History */}
        <Card variant="secondary">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Completed KT Session Archive
            </CardTitle>
            <CardDescription>Archived sessions with attendee feedback scores.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {completedKT.map((ckt, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-200">{ckt.title}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Host: {ckt.host} • Date: {ckt.date}</p>
                </div>
                <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                  ★ {ckt.rating}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

      {toastMsg && <Toast message={toastMsg} type="info" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
