'use client';

import React, { useState } from 'react';
import { useApp, UserRole } from '../../context/AppContext';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Laptop, 
  BarChart3, 
  Users, 
  Settings, 
  Check, 
  ShieldCheck, 
  Globe,
  Moon,
  Sun,
  Loader2
} from 'lucide-react';
import { Toast } from '../ui/Toast';

interface RoleOption {
  id: UserRole;
  name: string;
  badgeLabel: string;
  emoji: string;
  icon: React.ReactNode;
  description: string;
  colorName: 'purple' | 'blue' | 'green' | 'orange';
  defaultEmail: string;
  defaultName: string;
}

export const AuthView: React.FC = () => {
  const { loginUser, theme, toggleTheme, authLoading, authError } = useApp();
  const [step, setStep] = useState<'select-workspace' | 'login'>('select-workspace');
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [email, setEmail] = useState('david.c@company.io');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const roleOptions: RoleOption[] = [
    {
      id: 'employee',
      name: 'Employee Workspace',
      badgeLabel: 'Employee',
      emoji: '👨‍💻',
      icon: <Laptop className="h-6 w-6" />,
      description: 'Access AI Copilot, company knowledge, learning hub, projects and onboarding.',
      colorName: 'purple',
      defaultEmail: 'david.c@company.io',
      defaultName: 'David Chen'
    },
    {
      id: 'manager',
      name: 'Manager Workspace',
      badgeLabel: 'Manager',
      emoji: '📊',
      icon: <BarChart3 className="h-6 w-6" />,
      description: 'Track team progress, documentation health, onboarding status and analytics.',
      colorName: 'blue',
      defaultEmail: 'sarah.c@company.io',
      defaultName: 'Sarah Connor'
    },
    {
      id: 'hr',
      name: 'HR Workspace',
      badgeLabel: 'HR Team',
      emoji: '👥',
      icon: <Users className="h-6 w-6" />,
      description: 'Manage onboarding, employees, documentation requests and employee intelligence.',
      colorName: 'green',
      defaultEmail: 'emma.w@company.io',
      defaultName: 'Emma Watson'
    },
    {
      id: 'admin',
      name: 'Administrator Workspace',
      badgeLabel: 'Admin',
      emoji: '⚙️',
      icon: <Settings className="h-6 w-6" />,
      description: 'Manage users, AI settings, integrations, permissions and platform configuration.',
      colorName: 'orange',
      defaultEmail: 'elena.r@company.io',
      defaultName: 'Elena Rostova'
    }
  ];

  const activeRoleOption = roleOptions.find(r => r.id === selectedRole) || roleOptions[0];

  const handleWorkspaceSelect = (roleOpt: RoleOption) => {
    setSelectedRole(roleOpt.id);
    setEmail(roleOpt.defaultEmail);
    setLoginError(null);
    setStep('login');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLoginError('Please enter valid credentials.');
      return;
    }

    setLoginError(null);
    try {
      await loginUser(email, password);
      setToastMsg(`Authenticated as ${activeRoleOption.name}`);
    } catch (err: any) {
      setLoginError(err?.message || 'Invalid email or password');
    }
  };

  const handleSSO = (provider: 'Google' | 'Microsoft') => {
    setToastMsg(`Connecting to ${provider} OAuth directory...`);
    setTimeout(() => {
      const user = {
        name: activeRoleOption.defaultName,
        email: email,
        avatar: activeRoleOption.id === 'employee'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
          : activeRoleOption.id === 'manager'
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
          : activeRoleOption.id === 'hr'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        skills: ['Cloud Architecture', 'Security'],
        department: 'Platform'
      };
      loginUser(user, selectedRole);
    }, 1000);
  };

  const getRoleCardBorder = (colorName: string) => {
    if (colorName === 'purple') return 'border-purple-500/30 hover:border-purple-500 bg-purple-500/5 hover:bg-purple-500/10 hover:shadow-purple-500/15';
    if (colorName === 'blue') return 'border-blue-500/30 hover:border-blue-500 bg-blue-500/5 hover:bg-blue-500/10 hover:shadow-blue-500/15';
    if (colorName === 'green') return 'border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 hover:shadow-emerald-500/15';
    return 'border-orange-500/30 hover:border-orange-500 bg-orange-500/5 hover:bg-orange-500/10 hover:shadow-orange-500/15';
  };

  const getRoleIconBg = (colorName: string) => {
    if (colorName === 'purple') return 'bg-purple-500 text-white shadow-md shadow-purple-500/25';
    if (colorName === 'blue') return 'bg-blue-500 text-white shadow-md shadow-blue-500/25';
    if (colorName === 'green') return 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25';
    return 'bg-orange-500 text-white shadow-md shadow-orange-500/25';
  };

  const getRoleBadgeStyle = (colorName: string) => {
    if (colorName === 'purple') return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    if (colorName === 'blue') return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    if (colorName === 'green') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-4 md:p-8 overflow-y-auto bg-zinc-50 dark:bg-[#060814] transition-colors duration-300">
      
      {/* Theme toggle — fixed top-right, uses the same shared theme state */}
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        className="fixed top-4 right-4 z-50 p-2 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors shadow-2xs cursor-pointer"
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>
      
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-indigo-500/8 dark:bg-indigo-500/4 blur-[130px] pointer-events-none" />

      {/* STEP 1: WORKSPACE SELECTION SCREEN */}
      {step === 'select-workspace' ? (
        <div className="w-full max-w-5xl z-10 space-y-10 animate-fade-in py-8">
          
          {/* Header Branding */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 text-white shadow-xl shadow-indigo-500/20 border border-white/20">
              <Sparkles size={28} className="animate-pulse-slow" />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  LaunchPad AI
                </h1>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md tracking-wider shadow-xs">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-xs md:text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-1 max-w-md">
                An AI-powered Employee Success & Knowledge Intelligence Platform
              </p>
            </div>

            <div className="pt-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Select Your Enterprise Workspace</h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-medium">Choose a workspace below to proceed to login.</p>
            </div>
          </div>

          {/* 4 Prominent Interactive Workspace Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {roleOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleWorkspaceSelect(opt)}
                className={`group relative rounded-2xl p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl ${getRoleCardBorder(opt.colorName)}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${getRoleIconBg(opt.colorName)}`}>
                      {opt.icon}
                    </div>
                    <span className="text-2xl">{opt.emoji}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {opt.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed font-semibold">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase rounded-md border ${getRoleBadgeStyle(opt.colorName)}`}>
                    {opt.badgeLabel}
                  </span>
                  
                  <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Enter Workspace
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* STEP 2: DEDICATED ROLE-SPECIFIC LOGIN SCREEN */
        <div className="w-full max-w-md z-10 space-y-6 animate-fade-in py-8">
          
          {/* Back button */}
          <button
            onClick={() => { setStep('select-workspace'); setLoginError(null); }}
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Workspace Selection
          </button>

          {/* Login Card */}
          <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 p-6 md:p-8 bg-white/80 dark:bg-[#080a14]/90 backdrop-blur-xl shadow-2xl space-y-6 text-left">
            
            {/* Header Title with Workspace Badge */}
            <div className="text-center space-y-3 border-b border-zinc-100 dark:border-zinc-900/60 pb-6">
              <div className="flex justify-center">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${getRoleIconBg(activeRoleOption.colorName)}`}>
                  {activeRoleOption.icon}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
                  Log in to {activeRoleOption.name}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className={`px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase rounded-md border ${getRoleBadgeStyle(activeRoleOption.colorName)}`}>
                    {activeRoleOption.badgeLabel}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400">LaunchPad AI Platform</span>
                </div>
              </div>
            </div>

            {/* Error message */}
            {(loginError || authError) && (
              <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400">
                {loginError || authError}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Work Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-3 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.io"
                    className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 focus:border-indigo-500/40 rounded-xl outline-none text-zinc-800 dark:text-zinc-200 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-3 text-zinc-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 focus:border-indigo-500/40 rounded-xl outline-none text-zinc-800 dark:text-zinc-200 transition-all shadow-xs"
                  />
                </div>
                <p className="text-[9px] text-zinc-400 font-medium mt-1">Demo password: LaunchPad@2026</p>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 text-indigo-600 border-zinc-300 dark:border-zinc-800 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => setToastMsg(`Reset instructions dispatched to ${email}`)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 transition-transform active:scale-98 shadow-md cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {authLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Log In to {activeRoleOption.badgeLabel} Workspace
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* SSO Dividers */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-zinc-200/60 dark:bg-zinc-800/60" />
              <span className="relative px-3 text-[9.5px] font-bold text-zinc-400 bg-white dark:bg-[#080a14] uppercase tracking-widest">
                Or Continue With
              </span>
            </div>

            {/* SSO Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSSO('Google')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer shadow-xs"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                  <path fill="#ea4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.414 0-6.19-2.776-6.19-6.19s2.776-6.19 6.19-6.19c1.7 0 3.22.69 4.32 1.8l3.1-3.1C18.6 1.87 15.61 1 12.24 1 6.03 1 1 6.03 1 12.24s5.03 11.24 11.24 11.24c5.89 0 10.9-4.22 10.9-10.9 0-.82-.08-1.4-.2-2.3H12.24z"/>
                </svg>
                Continue with Google
              </button>
              
              <button
                onClick={() => handleSSO('Microsoft')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer shadow-xs"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M0 0h11v11H0z"/>
                  <path fill="#81bc06" d="M12 0h11v11H12z"/>
                  <path fill="#05a6f0" d="M0 12h11v11H0z"/>
                  <path fill="#ffba08" d="M12 12h11v11H12z"/>
                </svg>
                Continue with Microsoft
              </button>
            </div>

          </div>
        </div>
      )}

      {toastMsg && <Toast message={toastMsg} type="info" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
