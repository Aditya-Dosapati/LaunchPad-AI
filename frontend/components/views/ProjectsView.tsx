'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../ui/Table';
import { TableSkeleton } from '../ui/Skeletons';
import { ErrorState } from '../ui/ErrorState';
import { Toast } from '../ui/Toast';
import { 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface HROnboardingTrack {
  id: string;
  name: string;
  department: string;
  currentProgress: number; // %
  assignedMentor: string;
  pendingKT: string;
  pendingDoc: string;
  trainingCompletion: number; // %
  readinessScore: number; // 0-100
}

export const ProjectsView: React.FC = () => {
  const { demoState, setDemoState, setRoute, role, onboardingTracks: apiTracks, dataLoading } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (demoState === 'loading' || dataLoading) {
    return <TableSkeleton rows={4} />;
  }

  if (demoState === 'error') {
    return <ErrorState onRetry={() => setDemoState('normal')} />;
  }

  const onboardingTracks: HROnboardingTrack[] = apiTracks.map(t => ({
    id: t.id,
    name: t.name,
    department: t.department,
    currentProgress: t.progress,
    assignedMentor: t.assignedMentorName || 'Not Assigned',
    pendingKT: t.pendingKT || 'None',
    pendingDoc: t.pendingDoc || 'None',
    trainingCompletion: t.trainingCompletion,
    readinessScore: t.readinessScore,
  }));

  return (
    <div className="space-y-6 text-left animate-fade-in widescreen-container pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            HR Onboarding Pipeline & Readiness Tracker
            <UserCheck size={16} className="text-emerald-500" />
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
            Track onboarding progress, assigned mentors, pending KT workshops, documentation requirements, and readiness scores.
          </p>
        </div>

        <button 
          onClick={() => setToastMsg('Onboarding template generator initialized')}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
        >
          Create Onboarding Track
        </button>
      </div>

      {/* Pipeline Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="secondary">
          <p className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest">Active Onboarders</p>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">1 In Progress</p>
          <p className="text-[10px] font-semibold text-zinc-400 mt-1">2 Recently Graduated</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest">Avg Onboarding Time</p>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">12.5 Days</p>
          <p className="text-[10px] font-semibold text-emerald-500 mt-1">Fastest: 8 Days (HR Dept)</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest">Overall Readiness Score</p>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">81.6 / 100</p>
          <p className="text-[10px] font-semibold text-zinc-400 mt-1">Target benchmark: 80.0</p>
        </Card>
      </div>

      {/* Onboarding Pipeline Table */}
      <Card variant="secondary">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Active Onboarding Pipelines</CardTitle>
          <CardDescription>Onboarders progress, mentors, pending KT, and readiness indexes.</CardDescription>
        </CardHeader>
        <CardContent className="border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Assigned Mentor</TableHead>
                <TableHead>Onboarding Progress</TableHead>
                <TableHead>Pending KT Workshop</TableHead>
                <TableHead>Pending Documentation</TableHead>
                <TableHead>Readiness Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {onboardingTracks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{t.name}</TableCell>
                  <TableCell className="text-xs font-semibold text-zinc-500">{t.assignedMentor}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${t.currentProgress}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500">{t.currentProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-zinc-500">{t.pendingKT}</TableCell>
                  <TableCell className="text-xs font-semibold text-zinc-500">{t.pendingDoc}</TableCell>
                  <TableCell className="text-xs font-extrabold text-emerald-500">{t.readinessScore}%</TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => setToastMsg(`Updating onboarding milestone for ${t.name}`)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Update Milestone
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
