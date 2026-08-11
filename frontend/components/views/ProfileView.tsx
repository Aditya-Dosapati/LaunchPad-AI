'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Toast } from '../ui/Toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Languages, 
  Edit3, 
  Lock, 
  Upload, 
  Download,
  Building,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, role, setRoute } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  const userName = currentUser?.name || (role === 'admin' ? 'Elena Rostova' : role === 'hr' ? 'Emma Watson' : role === 'manager' ? 'Sarah Connor' : 'David Chen');
  const userAvatar = currentUser?.avatar || (role === 'admin' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' : role === 'hr' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' : role === 'manager' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');
  const jobTitle = role === 'admin' ? 'VP of Platform Intelligence' : role === 'hr' ? 'Talent Success Partner' : role === 'manager' ? 'Lead DevOps Architect' : 'Senior Software Engineer';
  const department = role === 'admin' ? 'Platform Engineering' : role === 'hr' ? 'People & Culture' : role === 'manager' ? 'DevOps & Infrastructure' : 'Frontend Architecture';
  const managerName = role === 'admin' ? 'Board of Directors' : role === 'hr' ? 'Elena Rostova' : role === 'manager' ? 'Elena Rostova' : 'Sarah Connor';
  const employeeId = role === 'admin' ? 'EMP-00101' : role === 'hr' ? 'EMP-00204' : role === 'manager' ? 'EMP-00312' : 'EMP-00482';
  const joinedDate = '2024-03-15';
  const email = `${userName.toLowerCase().replace(' ', '.')}@launchpad.ai`;

  // Form states for profile edit
  const [editName, setEditName] = useState(userName);
  const [editTitle, setEditTitle] = useState(jobTitle);
  const [editBio, setEditBio] = useState('Senior Full Stack Architect specializing in RAG vector search pipelines, Next.js micro-frontends, and enterprise AI onboarding integrations.');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    setToastMsg('Profile information updated successfully.');
  };

  const handleDownloadCard = () => {
    setIsBadgeModalOpen(true);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in widescreen-container pb-12">
      
      {/* 1. Profile Hero Banner */}
      <div className="relative rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden bg-white dark:bg-zinc-900/30 shadow-xs">
        {/* Cover Background */}
        <div className="h-36 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 relative" />

        {/* Profile Details Header */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <div className="relative shrink-0">
              <img
                src={userAvatar}
                alt={userName}
                className="h-24 w-24 rounded-2xl object-cover border-4 border-white dark:border-[#080a14] shadow-md"
              />
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#080a14]" title="Active Online" />
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">{userName}</h1>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-500/20">
                  Active
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{jobTitle} • {department}</p>
              <p className="text-[10.5px] font-bold text-zinc-400">ID: {employeeId} • Joined {joinedDate}</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-98 cursor-pointer"
            >
              <Edit3 size={13} />
              Edit Profile
            </button>
            
            <button
              onClick={() => setRoute('settings')}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl border border-zinc-200/50 dark:border-zinc-800 cursor-pointer"
            >
              <Lock size={13} />
              Password
            </button>

            <button
              onClick={handleDownloadCard}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl border border-zinc-200/50 dark:border-zinc-800 cursor-pointer"
            >
              <Download size={13} />
              Employee Card
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Grid: Personal Info & AI Workspace Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Personal & Work Info */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Personal Information */}
          <Card variant="secondary">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <User size={15} className="text-indigo-500" />
                Personal & Work Details
              </CardTitle>
              <CardDescription>Verified organization metadata and contacts.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold pt-1">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Full Name</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-bold text-xs">{userName}</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Work Email</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-bold text-xs">{email}</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Job Title</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-bold text-xs">{jobTitle}</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Department</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-bold text-xs">{department}</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Reporting Manager</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-bold text-xs">{managerName}</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Office Location</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-bold text-xs">San Francisco HQ (Building B)</span>
              </div>
            </CardContent>
          </Card>

          {/* About & Bio */}
          <Card variant="secondary">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Briefcase size={15} className="text-purple-500" />
                About & Bio Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold">
                {editBio}
              </p>

              {/* Skills Matrix */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Verified Technical Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'Next.js App Router', 'TypeScript', 'Tailwind CSS', 'Vector Databases (Pinecone)', 'Neo4j GraphDB', 'OAuth2 / OIDC', 'AWS EKS'].map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 rounded-lg border border-zinc-200/50 dark:border-zinc-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Certifications & Badges</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15 flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <Award size={14} />
                    <span>Next.js Enterprise Framework Architect</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/15 flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <Award size={14} />
                    <span>AWS Certified Solutions Architect</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: AI Workspace Intelligence */}
        <div className="space-y-6">
          
          {/* AI Workspace Specs */}
          <Card variant="copilot">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles size={15} className="text-indigo-500 copilot-sparkle" />
                AI Workspace Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-1 text-xs font-semibold">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800">
                <span className="text-zinc-400">AI Access Level</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">Level 3 (Full RAG)</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800">
                <span className="text-zinc-400">Subscription Tier</span>
                <span className="font-extrabold text-emerald-500">Enterprise AI Plan</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800">
                <span className="text-zinc-400">Vector Embeddings</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">1,240 Docs Synced</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Timeline */}
          <Card variant="secondary">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Activity size={15} className="text-indigo-500" />
                Recent Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-1 text-xs">
              <div className="flex items-start gap-2 border-b border-zinc-100 dark:border-zinc-900/60 pb-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">Passed Quiz: Next.js App Router</p>
                  <p className="text-[10px] text-zinc-400">Score: 100% • 2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-2 border-b border-zinc-100 dark:border-zinc-900/60 pb-2">
                <Sparkles size={13} className="text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">Queried Copilot on OAuth2 Flow</p>
                  <p className="text-[10px] text-zinc-400">RAG result 96% confidence • 1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-2 pb-1">
                <Award size={13} className="text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">Earned Milestone Certificate</p>
                  <p className="text-[10px] text-zinc-400">ID: CERT-00482 • 3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Profile Information"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800 rounded-xl outline-none text-zinc-800 dark:text-zinc-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Job Title</label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800 rounded-xl outline-none text-zinc-800 dark:text-zinc-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Bio Summary</label>
              <textarea
                rows={4}
                required
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800 rounded-xl outline-none text-zinc-800 dark:text-zinc-200 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-xs font-bold rounded-xl text-white shadow-2xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Employee ID Badge Modal */}
      {isBadgeModalOpen && (
        <Modal
          isOpen={isBadgeModalOpen}
          onClose={() => setIsBadgeModalOpen(false)}
          title="Digital Employee ID Card"
        >
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-full max-w-sm rounded-2xl p-6 bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-900 text-white border border-indigo-500/30 shadow-xl space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase">LaunchPad AI</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold rounded">VERIFIED</span>
              </div>

              <div className="flex items-center gap-3">
                <img src={userAvatar} alt={userName} className="h-14 w-14 rounded-xl object-cover border-2 border-indigo-500" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">{userName}</h3>
                  <p className="text-[10.5px] text-zinc-400 font-semibold">{jobTitle}</p>
                  <p className="text-[9.5px] text-indigo-400 font-mono mt-0.5">{employeeId}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-400">
                <span>Dept: {department}</span>
                <span>Issued: {joinedDate}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsBadgeModalOpen(false);
                setToastMsg('Employee badge downloaded (PDF format).');
              }}
              className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 text-xs font-bold text-white rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              Download PDF Badge
            </button>
          </div>
        </Modal>
      )}

      {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
