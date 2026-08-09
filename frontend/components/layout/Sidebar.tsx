'use client';

import React, { useMemo, useCallback } from 'react';
import { useApp, AppRoute } from '../../context/AppContext';
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  GraduationCap,
  FolderGit2,
  Users,
  LineChart,
  BarChart3,
  Settings as SettingsIcon,
  HelpCircle,
  ChevronLeft,
  Sparkles,
  FileSpreadsheet,
  HeartHandshake,
  ShieldCheck,
  UserCheck,
  Shield,
  Cpu,
  Link,
  Activity,
  Building2
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavItem {
  name: string;
  route: AppRoute;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

/* -------------------------------------------------------------------------- */
/* Subcomponent: SidebarTooltip                                               */
/* -------------------------------------------------------------------------- */
const SidebarTooltip: React.FC<{ label: string }> = ({ label }) => (
  <div className="absolute left-[68px] z-50 pointer-events-none whitespace-nowrap rounded-lg bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-white dark:text-zinc-900 shadow-xl border border-zinc-800 dark:border-zinc-200 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 opacity-0 scale-95 -translate-x-1">
    {label}
  </div>
);

/* -------------------------------------------------------------------------- */
/* Subcomponent: SidebarHeader                                                */
/* -------------------------------------------------------------------------- */
const SidebarHeader: React.FC<{ collapsed: boolean; onToggle: () => void }> = ({ collapsed, onToggle }) => (
  <div className="relative flex h-16 items-center px-4 border-b border-zinc-200/50 dark:border-zinc-800/40 shrink-0">
    {/* Fixed Logo Box - Never Moves */}
    <div className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 text-white shadow-md shadow-indigo-500/15 shrink-0">
      <Sparkles className="h-4.5 w-4.5 animate-pulse-slow" />
    </div>

    {/* Brand Title (Animated opacity & width) */}
    <div
      className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] flex items-center gap-1.5 ml-3 ${
        collapsed ? 'max-w-0 opacity-0 -translate-x-2 pointer-events-none' : 'max-w-[160px] opacity-100 translate-x-0'
      }`}
    >
      <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight whitespace-nowrap">
        LaunchPad
      </span>
      <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md tracking-wider shrink-0 shadow-xs">
        AI
      </span>
    </div>

    {/* Border Floating Collapse/Expand Button */}
    <button
      onClick={onToggle}
      aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      className="hidden md:flex absolute -right-3.5 top-4.5 z-40 h-7 w-7 items-center justify-center rounded-full border border-zinc-200/80 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 transition-all duration-200 shadow-md cursor-pointer hover:scale-110 hover:border-indigo-500/40"
    >
      <ChevronLeft
        className={`h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
          collapsed ? 'rotate-180' : 'rotate-0'
        }`}
      />
    </button>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Subcomponent: SidebarItem                                                  */
/* -------------------------------------------------------------------------- */
const SidebarItem: React.FC<{
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick: (item: NavItem) => void;
}> = ({ item, active, collapsed, onClick }) => (
  <button
    onClick={() => onClick(item)}
    aria-label={item.name}
    className={`w-full flex items-center h-11 px-2.5 rounded-xl text-xs tracking-tight transition-all duration-200 group relative cursor-pointer ${
      active
        ? 'bg-indigo-500/10 dark:bg-indigo-500/8 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:text-zinc-950 dark:hover:text-zinc-100 font-medium'
    }`}
  >
    {/* Active Left Pill Indicator */}
    <div
      className={`absolute left-0 top-2.5 bottom-2.5 w-1 bg-indigo-500 dark:bg-indigo-400 rounded-r-full transition-all duration-200 ${
        active ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'
      }`}
    />

    {/* Fixed 40x40 Icon Container - Never Moves */}
    <div
      className={`h-10 w-10 min-w-[40px] rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-[1.05] ${
        active ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
      }`}
    >
      {item.icon}
    </div>

    {/* Text Label & Badge Container (Animated width & opacity) */}
    <div
      className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] flex items-center justify-between flex-1 ml-2 ${
        collapsed ? 'max-w-0 opacity-0 -translate-x-1 pointer-events-none' : 'max-w-[180px] opacity-100 translate-x-0'
      }`}
    >
      <span className="truncate text-left text-[12.5px] font-semibold">{item.name}</span>
      {item.badge && (
        <span className="px-1.5 py-0.5 text-[8px] font-extrabold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-md tracking-wider shrink-0 ml-1 shadow-2xs">
          {item.badge}
        </span>
      )}
    </div>

    {/* Tooltip Overlay (Visible when collapsed) */}
    {collapsed && <SidebarTooltip label={item.name} />}
  </button>
);

/* -------------------------------------------------------------------------- */
/* Subcomponent: SidebarSection                                               */
/* -------------------------------------------------------------------------- */
const SidebarSection: React.FC<{
  section: NavSection;
  collapsed: boolean;
  route: AppRoute;
  onItemClick: (item: NavItem) => void;
}> = ({ section, collapsed, route, onItemClick }) => (
  <div className="space-y-1">
    {/* Animated Section Header */}
    <p
      className={`px-3 text-[9px] font-bold text-zinc-400 dark:text-zinc-500 tracking-widest uppercase overflow-hidden transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
        collapsed ? 'max-h-0 opacity-0 mb-0 pointer-events-none' : 'max-h-8 opacity-100 mb-2'
      }`}
    >
      {section.title}
    </p>

    {section.items.map((item, idx) => (
      <SidebarItem
        key={idx}
        item={item}
        active={route === item.route}
        collapsed={collapsed}
        onClick={onItemClick}
      />
    ))}
  </div>
);

/* -------------------------------------------------------------------------- */
/* Main Component: Sidebar                                                    */
/* -------------------------------------------------------------------------- */
export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { route, setRoute, role } = useApp();

  const handleToggle = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  const handleNavClick = useCallback(
    (item: NavItem) => {
      setRoute(item.route);
    },
    [setRoute]
  );

  const navSections = useMemo((): NavSection[] => {
    if (role === 'admin') {
      return [
        {
          title: 'Platform Administration',
          items: [
            { name: 'Dashboard', route: 'dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5 shrink-0" /> },
            { name: 'Users', route: 'onboarding', icon: <Users className="h-4.5 w-4.5 shrink-0" /> },
            { name: 'Organization', route: 'projects', icon: <Building2 className="h-4.5 w-4.5 shrink-0" /> }
          ]
        },
        {
          title: 'Engine & Knowledge',
          items: [
            { name: 'Knowledge Base', route: 'knowledge-base', icon: <BookOpen className="h-4.5 w-4.5 shrink-0" /> },
            { name: 'AI Settings', route: 'assistant', icon: <Cpu className="h-4.5 w-4.5 shrink-0" />, badge: 'LLM' },
            { name: 'Integrations', route: 'settings', icon: <Link className="h-4.5 w-4.5 shrink-0" />, badge: '8 Active' }
          ]
        },
        {
          title: 'Security & Telemetry',
          items: [
            { name: 'Security', route: 'placeholder', icon: <Shield className="h-4.5 w-4.5 shrink-0" />, badge: 'RBAC' },
            { name: 'System Analytics', route: 'analytics', icon: <Activity className="h-4.5 w-4.5 shrink-0" /> },
            { name: 'Settings', route: 'settings', icon: <SettingsIcon className="h-4.5 w-4.5 shrink-0" /> }
          ]
        }
      ];
    }

    if (role === 'hr') {
      return [
        {
          title: 'HR Overview & People',
          items: [
            { name: 'Dashboard', route: 'dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5 shrink-0" /> },
            { name: 'Employees', route: 'onboarding', icon: <Users className="h-4.5 w-4.5 shrink-0" /> },
            { name: 'Onboarding', route: 'projects', icon: <UserCheck className="h-4.5 w-4.5 shrink-0" /> }
          ]
        },
        {
          title: 'Policies & Intelligence',
          items: [
            { name: 'Policies', route: 'knowledge-base', icon: <ShieldCheck className="h-4.5 w-4.5 shrink-0" /> },
            { name: 'Knowledge Intelligence', route: 'analytics', icon: <BarChart3 className="h-4.5 w-4.5 shrink-0" />, badge: 'AI' }
          ]
        },
        {
          title: 'Analytics & Culture',
          items: [
            { name: 'Analytics', route: 'placeholder', icon: <FileSpreadsheet className="h-4.5 w-4.5 shrink-0" />, badge: 'Talent' },
            { name: 'Feedback', route: 'help', icon: <HeartHandshake className="h-4.5 w-4.5 shrink-0" />, badge: 'Pulse' },
            { name: 'Settings', route: 'settings', icon: <SettingsIcon className="h-4.5 w-4.5 shrink-0" /> }
          ]
        }
      ];
    }

    if (role === 'manager') {
      return [
        {
          title: 'Management Overview',
          items: [
            { name: 'Dashboard', route: 'dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5 shrink-0" /> },
            { name: 'Team', route: 'onboarding', icon: <Users className="h-4.5 w-4.5 shrink-0" /> },
            { name: 'Projects', route: 'projects', icon: <FolderGit2 className="h-4.5 w-4.5 shrink-0" /> }
          ]
        },
        {
          title: 'Intelligence & Content',
          items: [
            { name: 'Knowledge Intelligence', route: 'analytics', icon: <BarChart3 className="h-4.5 w-4.5 shrink-0" />, badge: 'AI' },
            { name: 'Documentation', route: 'knowledge-base', icon: <BookOpen className="h-4.5 w-4.5 shrink-0" /> },
            { name: 'Training', route: 'learning', icon: <GraduationCap className="h-4.5 w-4.5 shrink-0" /> }
          ]
        },
        {
          title: 'Analytics & System',
          items: [
            { name: 'Reports', route: 'placeholder', icon: <FileSpreadsheet className="h-4.5 w-4.5 shrink-0" />, badge: 'Export' },
            { name: 'Settings', route: 'settings', icon: <SettingsIcon className="h-4.5 w-4.5 shrink-0" /> }
          ]
        }
      ];
    }

    // Default Employee Navigation
    return [
      {
        title: 'Overview',
        items: [
          { name: 'Home', route: 'dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5 shrink-0" /> },
          { name: 'LaunchPad Copilot', route: 'assistant', icon: <MessageSquare className="h-4.5 w-4.5 shrink-0" />, badge: 'AI' }
        ]
      },
      {
        title: 'Knowledge & Learning',
        items: [
          { name: 'Company Knowledge', route: 'knowledge-base', icon: <BookOpen className="h-4.5 w-4.5 shrink-0" /> },
          { name: 'Learning Hub', route: 'learning', icon: <GraduationCap className="h-4.5 w-4.5 shrink-0" /> }
        ]
      },
      {
        title: 'Project & People',
        items: [
          { name: 'Workspace', route: 'projects', icon: <FolderGit2 className="h-4.5 w-4.5 shrink-0" /> },
          { name: 'Team', route: 'onboarding', icon: <Users className="h-4.5 w-4.5 shrink-0" /> },
          { name: 'My Insights', route: 'analytics', icon: <LineChart className="h-4.5 w-4.5 shrink-0" />, badge: 'Stats' }
        ]
      },
      {
        title: 'System & Support',
        items: [
          { name: 'Settings', route: 'settings', icon: <SettingsIcon className="h-4.5 w-4.5 shrink-0" /> },
          { name: 'Help Center', route: 'help', icon: <HelpCircle className="h-4.5 w-4.5 shrink-0" /> }
        ]
      }
    ];
  }, [role]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        onClick={handleToggle}
        className={`fixed inset-0 bg-[#060814]/40 backdrop-blur-xs z-20 md:hidden transition-opacity duration-300 ${
          collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      <aside
        role="navigation"
        aria-label="Main Navigation"
        aria-expanded={!collapsed}
        className={`fixed left-0 top-0 z-30 h-screen flex flex-col border-r border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50 dark:bg-[#080a14]/95 backdrop-blur-xl transition-[width] duration-300 ease-[cubic-bezier(.22,1,.36,1)] overflow-visible ${
          collapsed ? 'w-20' : 'w-[290px]'
        }`}
      >
        {/* Header */}
        <SidebarHeader collapsed={collapsed} onToggle={handleToggle} />

        {/* Pure Navigation Content (Full Height Scroll) */}
        <div className="flex-1 py-5 px-3 overflow-y-auto space-y-6 custom-scrollbar pb-8">
          {navSections.map((section, sIdx) => (
            <SidebarSection
              key={sIdx}
              section={section}
              collapsed={collapsed}
              route={route}
              onItemClick={handleNavClick}
            />
          ))}
        </div>
      </aside>
    </>
  );
};
