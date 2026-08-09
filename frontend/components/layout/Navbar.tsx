'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Sparkles, 
  Bell, 
  Moon, 
  Sun, 
  CheckCircle2,
  ChevronDown,
  X,
  Check,
  Trash2
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { ProfileDropdown } from './ProfileDropdown';

interface NavbarProps {
  onSelectSettingsTab?: (tab: string) => void;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'ai' | 'security' | 'hr' | 'system';
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectSettingsTab }) => {
  const { 
    role, 
    setRoute, 
    currentUser,
    setSearchChats
  } = useApp();

  const [isDark, setIsDark] = useState(true);
  const [isCommandKOpen, setIsCommandKOpen] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'RAG Vector Indexing Complete',
      desc: '1,240 company documents successfully indexed into Pinecone vector storage.',
      time: '10 mins ago',
      read: false,
      type: 'ai'
    },
    {
      id: 'notif-2',
      title: 'Onboarding Mentor Assignment',
      desc: 'Sarah Connor assigned you as technical onboarding lead for David Chen.',
      time: '1 hour ago',
      read: false,
      type: 'hr'
    },
    {
      id: 'notif-3',
      title: 'Security Protocol Updated',
      desc: '2026 WFH & Zero-Trust security guidelines updated by Elena Rostova.',
      time: '3 hours ago',
      read: true,
      type: 'security'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Global Cmd+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandKOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Notification click outside listener
  useEffect(() => {
    const handleNotifClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleNotifClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleNotifClickOutside);
  }, [isNotifOpen]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(prev => !prev);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
    if (profileButtonRef.current) {
      profileButtonRef.current.focus();
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const userName = currentUser?.name || (role === 'admin' ? 'Elena Rostova' : role === 'hr' ? 'Emma Watson' : role === 'manager' ? 'Sarah Connor' : 'David Chen');
  const userAvatar = currentUser?.avatar || (role === 'admin' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' : role === 'hr' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' : role === 'manager' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');

  const getWorkspaceTitle = () => {
    switch (role) {
      case 'admin': return 'Administrator Workspace';
      case 'hr': return 'HR Workspace';
      case 'manager': return 'Manager Workspace';
      case 'employee': return 'Employee Workspace';
    }
  };

  const getBadgeStyle = () => {
    switch (role) {
      case 'admin': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'hr': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'manager': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'employee': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    }
  };

  const handleExecuteCommand = (routeTarget: any, query?: string) => {
    if (query) setSearchChats(query);
    setRoute(routeTarget);
    setIsCommandKOpen(false);
    setCommandInput('');
  };

  return (
    <header className="h-16 border-b border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/80 dark:bg-[#080a14]/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-6 transition-all">
      
      {/* 1. Left Section: Workspace Pill & Quick Command Bar */}
      <div className="flex items-center gap-4">
        {/* Workspace Role Badge */}
        <div className={`px-3 py-1 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 shadow-2xs ${getBadgeStyle()}`}>
          <Sparkles size={13} className="copilot-sparkle" />
          <span>{getWorkspaceTitle()}</span>
        </div>

        {/* Command-K Trigger Search Bar */}
        <button
          onClick={() => setIsCommandKOpen(true)}
          aria-label="Open Command Search"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 text-xs font-semibold shadow-2xs transition-all hover:border-indigo-500/30 cursor-pointer"
        >
          <Search size={13} />
          <span>Search or jump to...</span>
          <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-[9.5px] font-mono font-bold rounded text-zinc-500 border border-zinc-200/60 dark:border-zinc-700 ml-2">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 2. Right Section: System Status, Theme Toggle, Notifications & Profile */}
      <div className="flex items-center gap-3 relative">
        
        {/* System Health Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10.5px] font-bold">
          <CheckCircle2 size={11} />
          <span>RAG Engine Operational</span>
        </div>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors shadow-2xs cursor-pointer"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications Trigger & Popover Drawer */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            aria-label="View Notifications"
            aria-haspopup="true"
            aria-expanded={isNotifOpen}
            className="relative p-2 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors shadow-2xs cursor-pointer"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500" />
            )}
          </button>

          {/* Notifications Popover */}
          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-[#0c0e1c]/95 backdrop-blur-xl shadow-2xl p-3 z-50 text-left animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-semibold text-zinc-400">
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="hover:text-indigo-500 cursor-pointer">
                      Mark read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button onClick={handleClearNotifications} className="hover:text-rose-500 cursor-pointer">
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Items List */}
              <div className="py-2 space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-4 font-semibold">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                      n.read 
                        ? 'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/40 dark:border-zinc-800/40 text-zinc-500' 
                        : 'bg-indigo-500/5 dark:bg-indigo-500/8 border-indigo-500/20 text-zinc-800 dark:text-zinc-200 font-semibold'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{n.title}</span>
                        <span className="text-[9px] text-zinc-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Top-Right User Profile Trigger Button */}
        <div className="relative pl-2 border-l border-zinc-200/50 dark:border-zinc-800/40">
          <button
            ref={profileButtonRef}
            onClick={toggleProfile}
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
            aria-label="User Account Options"
            className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/60 border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800 transition-all cursor-pointer group"
          >
            <img
              src={userAvatar}
              alt={userName}
              className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-800 shadow-2xs"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{userName}</p>
              <p className="text-[10px] text-zinc-400 font-semibold mt-0.5 capitalize">{role}</p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-indigo-500' : ''}`} />
          </button>

          {/* Anchored Top-Right Profile Dropdown */}
          <ProfileDropdown
            isOpen={isProfileOpen}
            onClose={closeProfile}
            onSelectTab={onSelectSettingsTab}
            className="right-0 top-full mt-2"
            triggerRef={profileButtonRef}
          />
        </div>

      </div>

      {/* Command-K Shortcut Search Modal */}
      {isCommandKOpen && (
        <Modal
          isOpen={isCommandKOpen}
          onClose={() => setIsCommandKOpen(false)}
          title="Command Palette & Quick Actions"
        >
          <div className="space-y-4 text-left">
            <div className="relative group">
              <Search size={14} className="absolute left-3.5 top-3 text-zinc-400" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search codebase..."
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800 rounded-xl outline-none text-zinc-800 dark:text-zinc-200"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <p className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest px-1">Navigation Commands</p>
              
              <button
                onClick={() => handleExecuteCommand('assistant', 'Explain Payment Service Auth')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-500/10 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2"><Sparkles size={13} className="text-indigo-500" /> Ask Copilot about Payment Service</span>
                <span className="text-[10px] text-zinc-400">Copilot Chat</span>
              </button>

              <button
                onClick={() => handleExecuteCommand('knowledge-base')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-500/10 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <span>Company Knowledge Base</span>
                <span className="text-[10px] text-zinc-400">Docs & Architecture</span>
              </button>

              <button
                onClick={() => handleExecuteCommand('profile')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-500/10 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <span>My Employee Profile</span>
                <span className="text-[10px] text-zinc-400">User Account</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </header>
  );
};
