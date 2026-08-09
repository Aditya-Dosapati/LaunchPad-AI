'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

// Layout elements
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { FloatingAssistant } from '@/components/layout/FloatingAssistant';
import { StateControlPanel } from '@/components/layout/StateControlPanel';

// Views
import { AuthView } from '@/components/views/AuthView';
import { DashboardView } from '@/components/views/DashboardView';
import { AIChatView } from '@/components/views/AIChatView';
import { KnowledgeBaseView } from '@/components/views/KnowledgeBaseView';
import { LearningView } from '@/components/views/LearningView';
import { EmployeesView } from '@/components/views/EmployeesView';
import { ProjectsView } from '@/components/views/ProjectsView';
import { KnowledgeGapView } from '@/components/views/KnowledgeGapView';
import { SettingsView } from '@/components/views/SettingsView';
import { HelpCenterView } from '@/components/views/HelpCenterView';
import { PlaceholderView } from '@/components/views/PlaceholderView';
import { ProfileView } from '@/components/views/ProfileView';

export default function Home() {
  const { route, setRoute, currentUser } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('account');
  const [mounted, setMounted] = useState(false);

  // Sync mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Auto-check auth state
    if (!currentUser) {
      setRoute('auth');
    }
  }, [currentUser]);

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-slate-400 font-bold text-xs">
        Initializing LaunchPad AI Intelligence Engine...
      </div>
    );
  }

  // Force login page layout
  if (route === 'auth' || !currentUser) {
    return <AuthView />;
  }

  // Route dispatcher
  const renderViewContent = () => {
    switch (route) {
      case 'dashboard':
        return <DashboardView />;
      case 'assistant':
        return <AIChatView />;
      case 'knowledge-base':
        return <KnowledgeBaseView />;
      case 'learning':
        return <LearningView />;
      case 'projects':
        return <ProjectsView />;
      case 'onboarding':
        return <EmployeesView />;
      case 'analytics':
        return <KnowledgeGapView />;
      case 'settings':
        return <SettingsView initialTab={activeSettingsTab} />;
      case 'profile':
        return <ProfileView />;
      case 'help':
        return <HelpCenterView />;
      case 'placeholder':
        return <PlaceholderView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen relative flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300 light-bg-mesh dark:dark-bg-mesh">
      {/* 1. Left Sidebar (Pure Navigation) */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* 2. Right Main Layout Pane */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'pl-[80px]' : 'pl-[80px] md:pl-[290px]'
        }`}
      >
        {/* Top Navbar with Profile Dropdown */}
        <Navbar onSelectSettingsTab={(tab: string) => setActiveSettingsTab(tab)} />

        {/* Scrollable View Content */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-64px)] custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full animate-fade-in">
            {renderViewContent()}
          </div>
        </main>
      </div>

      {/* Floating AI Assistant Bar & Quick Controls */}
      <FloatingAssistant />
      <StateControlPanel />
    </div>
  );
}
