'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../ui/Table';
import { Toast } from '../ui/Toast';
import { ProfileView } from './ProfileView';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Sun, 
  Link, 
  Lock, 
  HelpCircle, 
  CheckCircle2, 
  Key, 
  Monitor, 
  Smartphone, 
  Globe, 
  Sliders, 
  Eye, 
  AlertTriangle,
  Sparkles,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface SettingsViewProps {
  initialTab?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ initialTab = 'account' }) => {
  const { role, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const userName = currentUser?.name || (role === 'admin' ? 'Elena Rostova' : role === 'hr' ? 'Emma Watson' : role === 'manager' ? 'Sarah Connor' : 'David Chen');

  // Account State
  const [accName, setAccName] = useState(userName);
  const [accEmail, setAccEmail] = useState(`${userName.toLowerCase().replace(' ', '.')}@launchpad.ai`);
  const [accPhone, setAccPhone] = useState('+1 (555) 234-8901');
  const [accLang, setAccLang] = useState('English (US)');
  const [accTimeZone, setAccTimeZone] = useState('Pacific Time (US & Canada) UTC-8');

  // Notification Toggles State
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifAIUpdates, setNotifAIUpdates] = useState(true);
  const [notifHRAnnouncements, setNotifHRAnnouncements] = useState(true);
  const [notifProjectUpdates, setNotifProjectUpdates] = useState(false);
  const [notifLearningReminders, setNotifLearningReminders] = useState(true);
  const [notifSecurityAlerts, setNotifSecurityAlerts] = useState(true);

  // Appearance State
  const [themePreference, setThemePreference] = useState<'Dark' | 'Light' | 'System'>('Dark');
  const [sidebarDefault, setSidebarDefault] = useState<'Expanded' | 'Collapsed'>('Expanded');
  const [interfaceDensity, setInterfaceDensity] = useState<'Comfortable' | 'Compact'>('Comfortable');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [accentColor, setAccentColor] = useState('Indigo (Default)');

  const settingsTabs = [
    { id: 'profile', label: 'My Profile', icon: <User size={15} /> },
    { id: 'account', label: 'Account', icon: <SettingsIcon size={15} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
    { id: 'security', label: 'Security', icon: <Shield size={15} /> },
    { id: 'appearance', label: 'Appearance', icon: <Sun size={15} /> },
    { id: 'integrations', label: 'Integrations', icon: <Link size={15} /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye size={15} /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle size={15} /> }
  ];

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMsg('Account settings updated.');
  };

  const handleSaveNotifications = () => {
    setToastMsg('Notification preferences updated.');
  };

  const handleSaveAppearance = () => {
    setToastMsg('Appearance preferences updated.');
  };

  const handleSignOutAllDevices = () => {
    setToastMsg('Signed out of all other active browser sessions.');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in widescreen-container pb-12">
      
      {/* Top Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          Enterprise Settings & Account Preferences
          <SettingsIcon size={16} className="text-indigo-500" />
        </h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
          Manage your personal profile, security 2FA, notification preferences, interface appearance, and integrations.
        </p>
      </div>

      {/* Main Settings Layout (Vertical Tabs + Main Content) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Left Vertical Tab Navigation */}
        <div className="md:col-span-1 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/80 dark:bg-[#080a14]/60 p-2 space-y-1">
          {settingsTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isActive
                    ? 'bg-indigo-500/10 dark:bg-indigo-500/8 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20 shadow-2xs'
                    : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/40'
                }`}
              >
                <span className={isActive ? 'text-indigo-500' : 'text-zinc-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Active Tab Content Pane */}
        <div className="md:col-span-3 space-y-6">
          
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && <ProfileView />}

          {/* TAB 2: ACCOUNT */}
          {activeTab === 'account' && (
            <Card variant="secondary">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <SettingsIcon size={15} className="text-indigo-500" />
                  Account Settings
                </CardTitle>
                <CardDescription>Personal credentials and regional date/time preferences.</CardDescription>
              </CardHeader>
              <CardContent className="pt-1">
                <form onSubmit={handleSaveAccount} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Full Name</label>
                      <input
                        type="text"
                        required
                        value={accName}
                        onChange={(e) => setAccName(e.target.value)}
                        className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-xl outline-none text-zinc-800 dark:text-zinc-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={accEmail}
                        onChange={(e) => setAccEmail(e.target.value)}
                        className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-xl outline-none text-zinc-800 dark:text-zinc-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Phone Number</label>
                      <input
                        type="text"
                        value={accPhone}
                        onChange={(e) => setAccPhone(e.target.value)}
                        className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-xl outline-none text-zinc-800 dark:text-zinc-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Interface Language</label>
                      <select
                        value={accLang}
                        onChange={(e) => setAccLang(e.target.value)}
                        className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-xl outline-none text-zinc-800 dark:text-zinc-200 cursor-pointer"
                      >
                        <option value="English (US)">English (US)</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">System Time Zone</label>
                    <select
                      value={accTimeZone}
                      onChange={(e) => setAccTimeZone(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-xl outline-none text-zinc-800 dark:text-zinc-200 cursor-pointer"
                    >
                      <option value="Pacific Time (US & Canada) UTC-8">Pacific Time (US & Canada) UTC-8</option>
                      <option value="Eastern Time (US & Canada) UTC-5">Eastern Time (US & Canada) UTC-5</option>
                      <option value="UTC Greenwich Mean Time">UTC Greenwich Mean Time</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-xs font-bold rounded-xl text-white shadow-2xs transition-transform active:scale-98 cursor-pointer"
                    >
                      Save Account Changes
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <Card variant="secondary">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Bell size={15} className="text-indigo-500" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Control delivery channels for platform updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1 text-xs font-semibold">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800">
                  <div>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">Email Notifications</p>
                    <p className="text-[10px] text-zinc-400 font-medium">Receive weekly onboarding summaries and alerts via email.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                    className="h-4 w-4 rounded accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800">
                  <div>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">Browser Push Notifications</p>
                    <p className="text-[10px] text-zinc-400 font-medium">Receive real-time push alerts when tasks or documents require approval.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPush}
                    onChange={(e) => setNotifPush(e.target.checked)}
                    className="h-4 w-4 rounded accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800">
                  <div>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">LaunchPad AI Assistant Updates</p>
                    <p className="text-[10px] text-zinc-400 font-medium">Proactive notifications when new RAG vector models complete indexing.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifAIUpdates}
                    onChange={(e) => setNotifAIUpdates(e.target.checked)}
                    className="h-4 w-4 rounded accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800">
                  <div>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">Security & Login Alerts</p>
                    <p className="text-[10px] text-zinc-400 font-medium">Instant alerts when new browser sessions are authenticated.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSecurityAlerts}
                    onChange={(e) => setNotifSecurityAlerts(e.target.checked)}
                    className="h-4 w-4 rounded accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveNotifications}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-xs font-bold rounded-xl text-white shadow-2xs cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card variant="secondary">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Shield size={15} className="text-orange-500" />
                    Security & Authentication Settings
                  </CardTitle>
                  <CardDescription>Two-factor authentication and session controls.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-1 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center font-bold text-emerald-600 dark:text-emerald-400">
                    <div className="flex items-center gap-2">
                      <Shield size={16} />
                      <span>Two-Factor Authentication (2FA) is Enforced</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-[9px] uppercase">Active</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800">
                    <div>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">Last Password Change</p>
                      <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Changed 24 days ago (Recommended every 90 days)</p>
                    </div>
                    <button 
                      onClick={() => setToastMsg('Password change email dispatched.')}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold rounded-lg border border-zinc-200/50 dark:border-zinc-800 cursor-pointer"
                    >
                      Change Password
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card variant="secondary">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Monitor size={15} className="text-indigo-500" />
                    Active Browser Sessions & Devices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor size={18} className="text-indigo-500 shrink-0" />
                      <div>
                        <p className="font-bold text-zinc-800 dark:text-zinc-200">Chrome on macOS (San Francisco, US)</p>
                        <p className="text-[10px] text-zinc-400 font-mono">Current Session • IP: 192.168.1.104</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-extrabold rounded text-[9px]">THIS DEVICE</span>
                  </div>

                  <div className="p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone size={18} className="text-purple-500 shrink-0" />
                      <div>
                        <p className="font-bold text-zinc-800 dark:text-zinc-200">LaunchPad iOS App (iPhone 15 Pro)</p>
                        <p className="text-[10px] text-zinc-400 font-mono">Last Active: 2 hours ago • IP: 172.56.21.9</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setToastMsg('Revoked session for iPhone 15 Pro.')}
                      className="text-rose-500 font-bold hover:underline cursor-pointer"
                    >
                      Revoke
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSignOutAllDevices}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-xs font-bold rounded-xl text-white shadow-2xs cursor-pointer"
                    >
                      Sign Out of All Other Devices
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 5: APPEARANCE */}
          {activeTab === 'appearance' && (
            <Card variant="secondary">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sun size={15} className="text-indigo-500" />
                  Appearance & Interface Density
                </CardTitle>
                <CardDescription>Customize themes, colors, and sidebar behavior.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Color Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Dark', 'Light', 'System'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setThemePreference(mode as any)}
                        className={`p-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                          themePreference === mode 
                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                            : 'bg-white dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {mode} Mode
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Sidebar Default State</label>
                    <select
                      value={sidebarDefault}
                      onChange={(e) => setSidebarDefault(e.target.value as any)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-xl outline-none text-zinc-800 dark:text-zinc-200 cursor-pointer"
                    >
                      <option value="Expanded">Expanded (290px)</option>
                      <option value="Collapsed">Collapsed (80px)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Interface Density</label>
                    <select
                      value={interfaceDensity}
                      onChange={(e) => setInterfaceDensity(e.target.value as any)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-xl outline-none text-zinc-800 dark:text-zinc-200 cursor-pointer"
                    >
                      <option value="Comfortable">Comfortable (Default)</option>
                      <option value="Compact">Compact (High Information Density)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveAppearance}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-xs font-bold rounded-xl text-white shadow-2xs cursor-pointer"
                  >
                    Save Appearance
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 6: INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <Card variant="secondary">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Link size={15} className="text-orange-500" />
                  Ecosystem SaaS Connectors
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {['GitHub Repositories', 'Jira Software', 'Confluence Spaces', 'Slack Workspace', 'Microsoft Teams', 'AWS S3 Buckets'].map((name, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex items-center justify-between">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{name}</span>
                      <span className="px-2 py-0.5 rounded text-[8.5px] font-extrabold bg-emerald-500/10 text-emerald-500">Connected</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 7: PRIVACY */}
          {activeTab === 'privacy' && (
            <Card variant="secondary">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Eye size={15} className="text-indigo-500" />
                  Data Privacy & AI Telemetry Opt-in
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-1 text-xs font-semibold">
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">AI Query Anonymization</p>
                    <p className="text-[10px] text-zinc-400">Strip personal identifiers before logging vector search queries.</p>
                  </div>
                  <span className="text-emerald-500 font-extrabold">Enforced</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 8: HELP */}
          {activeTab === 'help' && (
            <Card variant="secondary">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <HelpCircle size={15} className="text-indigo-500" />
                  Help & Support Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-1 text-xs font-semibold">
                <p className="text-zinc-600 dark:text-zinc-400">Need assistance with workspace setup, RAG document indexing, or role permissions?</p>
                <button 
                  onClick={() => setToastMsg('Opening support ticket dialog...')}
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                >
                  Submit Support Ticket
                </button>
              </CardContent>
            </Card>
          )}

        </div>

      </div>

      {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
