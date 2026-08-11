'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'employee' | 'manager' | 'hr' | 'admin';
export type DemoState = 'normal' | 'loading' | 'empty' | 'error';
export type AppRoute = 
  | 'dashboard'
  | 'assistant'
  | 'knowledge-base'
  | 'learning'
  | 'projects'
  | 'onboarding'
  | 'analytics'
  | 'settings'
  | 'help'
  | 'auth'
  | 'placeholder'
  | 'profile';

export interface Document {
  id: string;
  title: string;
  category: 'SOP' | 'FAQ' | 'API Docs' | 'Architecture' | 'Coding Standards' | 'Deployment' | 'General';
  content: string;
  version: string;
  author: string;
  lastUpdated: string;
  status: 'Approved' | 'Pending Review' | 'Draft';
  isBookmarked?: boolean;
  isFavorite?: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: 'Engineering' | 'Product' | 'Marketing' | 'HR' | 'Sales' | 'Operations';
  role: UserRole;
  jobTitle: string;
  status: 'Active' | 'Onboarding' | 'On Leave' | 'Suspended';
  knowledgeScore: number;
  learningProgress: number; // percentage
  onboardingStep: number;
  avatar: string;
  skills: string[];
  joinedDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  health: number; // 0-100 (Doc Health)
  teamSize: number;
  lead: string;
  techStack: string[];
  docStatus: {
    architecture: 'Complete' | 'Draft' | 'Missing';
    sop: 'Complete' | 'Draft' | 'Missing';
    api: 'Complete' | 'Draft' | 'Missing';
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  codeSnippet?: string;
  language?: string;
  sources?: string[];
  confidence?: number; // 0-100
}

export interface ChatSession {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
}

export interface SystemNotification {
  id: string;
  type: 'question' | 'document' | 'reminder' | 'announcement' | 'feedback';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AppContextType {
  theme: 'light' | 'dark';
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  route: AppRoute;
  setRoute: (route: AppRoute) => void;
  demoState: DemoState;
  setDemoState: (state: DemoState) => void;
  placeholderModule: string;
  setPlaceholderModule: (name: string) => void;
  
  // Data State
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'lastUpdated' | 'version'>) => void;
  updateDocument: (id: string, doc: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  
  employees: Employee[];
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  addEmployee: (emp: Omit<Employee, 'id' | 'joinedDate'>) => void;
  
  projects: Project[];
  updateProject: (id: string, proj: Partial<Project>) => void;

  notifications: SystemNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  chats: ChatSession[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  addChatMessage: (text: string) => void;
  createNewChat: () => void;
  deleteChat: (id: string) => void;
  searchChats: string;
  setSearchChats: (term: string) => void;

  // Modals & Drawers States
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isTicketModalOpen: boolean;
  setIsTicketModalOpen: (open: boolean) => void;
  activeEmployeeDrawer: Employee | null;
  setActiveEmployeeDrawer: (emp: Employee | null) => void;
  activeDocPreview: Document | null;
  setActiveDocPreview: (doc: Document | null) => void;
  
  // User Authentication Simulation
  currentUser: {
    name: string;
    email: string;
    avatar: string;
    skills: string[];
    department: string;
  } | null;
  setCurrentUser: (user: any) => void;
  loginUser: (user: any, role: UserRole) => void;
  logout: () => void;
}

const initialDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'Kubernetes Cluster Deployment Guide',
    category: 'Deployment',
    content: 'This SOP outlines the steps to deploy a highly available Kubernetes cluster in AWS EKS. It covers VPC peering, subnets config, worker groups configuration in Terraform, and setup of CoreDNS, kube-proxy, and AWS VPC CNI. Always verify kubectl versions before starting.',
    version: 'v2.1',
    author: 'Sarah Connor',
    lastUpdated: '2026-08-01',
    status: 'Approved',
    isBookmarked: true,
    isFavorite: true,
  },
  {
    id: 'doc-2',
    title: 'Frontend Coding Standards & ESLint Config',
    category: 'Coding Standards',
    content: 'We use Next.js, Tailwind CSS, and TypeScript for all web applications. Prettier rules are enforced on commit. Class naming follows utility-first conventions with logical group order. Avoid custom utility classes unless absolutely required by design.',
    version: 'v1.4',
    author: 'David Chen',
    lastUpdated: '2026-07-28',
    status: 'Approved',
    isFavorite: true,
  },
  {
    id: 'doc-3',
    title: 'Knowledge Graph Integration Architecture',
    category: 'Architecture',
    content: 'System architecture map detailing the integration of Neo4j vector database with our AI RAG pipeline. It includes node descriptions for Employees, Skills, Projects, and Documents, outlining how queries traverse document nodes to compute documentation health.',
    version: 'v0.9-draft',
    author: 'Alex Mercer',
    lastUpdated: '2026-08-05',
    status: 'Pending Review',
  },
  {
    id: 'doc-4',
    title: 'API Authentication Flow & JWT Rotation',
    category: 'API Docs',
    content: 'Endpoints details for JWT authentication. Contains detailed descriptions of /api/auth/login, /api/auth/refresh, and security protocols like httpOnly cookies, CORS origins list, and token expiration handling.',
    version: 'v3.0',
    author: 'Elena Rostova',
    lastUpdated: '2026-08-03',
    status: 'Approved',
  },
  {
    id: 'doc-5',
    title: 'Employee Onboarding & Access Provisioning SOP',
    category: 'SOP',
    content: 'Steps to provision developer machines, GitHub organization permissions, Slack channel subscriptions, Jira board access, and 1Password vault memberships.',
    version: 'v2.0',
    author: 'Marcus Aurelius',
    lastUpdated: '2026-06-15',
    status: 'Approved',
  },
  {
    id: 'doc-6',
    title: 'AI Assistant Token Usage & Rate Limits FAQ',
    category: 'FAQ',
    content: 'Frequently Asked Questions about AI chat quota, context window limits, prompt guidelines, and instructions on how to request a token limit increase.',
    version: 'v1.0',
    author: 'Sophia Patel',
    lastUpdated: '2026-08-04',
    status: 'Approved',
    isBookmarked: true,
  }
];

const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Sarah Connor',
    email: 'sarah.c@company.io',
    department: 'Engineering',
    role: 'manager',
    jobTitle: 'Lead DevOps Architect',
    status: 'Active',
    knowledgeScore: 94,
    learningProgress: 88,
    onboardingStep: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Docker', 'Python'],
    joinedDate: '2024-03-12'
  },
  {
    id: 'emp-2',
    name: 'David Chen',
    email: 'david.c@company.io',
    department: 'Engineering',
    role: 'employee',
    jobTitle: 'Senior Frontend Engineer',
    status: 'Active',
    knowledgeScore: 89,
    learningProgress: 92,
    onboardingStep: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    skills: ['React', 'Next.js', 'TailwindCSS', 'TypeScript', 'Redux', 'Jest'],
    joinedDate: '2025-01-18'
  },
  {
    id: 'emp-3',
    name: 'Emma Watson',
    email: 'emma.w@company.io',
    department: 'HR',
    role: 'hr',
    jobTitle: 'Talent Success Partner',
    status: 'Active',
    knowledgeScore: 82,
    learningProgress: 75,
    onboardingStep: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    skills: ['Onboarding', 'Talent Dev', 'Conflict Resolution', 'Notion'],
    joinedDate: '2023-09-01'
  },
  {
    id: 'emp-4',
    name: 'Alex Mercer',
    email: 'alex.m@company.io',
    department: 'Engineering',
    role: 'employee',
    jobTitle: 'Junior Backend Developer',
    status: 'Onboarding',
    knowledgeScore: 64,
    learningProgress: 45,
    onboardingStep: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Git', 'Docker'],
    joinedDate: '2026-07-15'
  },
  {
    id: 'emp-5',
    name: 'Elena Rostova',
    email: 'elena.r@company.io',
    department: 'Product',
    role: 'admin',
    jobTitle: 'VP of Platform Intelligence',
    status: 'Active',
    knowledgeScore: 96,
    learningProgress: 98,
    onboardingStep: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    skills: ['SaaS Architecture', 'GraphDB', 'Product Strategy', 'OpenAI API'],
    joinedDate: '2022-04-10'
  }
];

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Knowledge RAG Pipeline v2',
    description: 'Upgrading vector indexing engine to support real-time PDF parsing and hybrid graph queries.',
    progress: 75,
    health: 88,
    teamSize: 4,
    lead: 'Sarah Connor',
    techStack: ['Neo4j', 'Pinecone', 'LangChain', 'Python', 'FastAPI'],
    docStatus: {
      architecture: 'Complete',
      sop: 'Complete',
      api: 'Draft'
    }
  },
  {
    id: 'proj-2',
    name: 'Enterprise Admin Center',
    description: 'Building custom enterprise dashboard with multi-role access control, usage metrics and logs auditing.',
    progress: 42,
    health: 64,
    teamSize: 3,
    lead: 'David Chen',
    techStack: ['Next.js', 'Tailwind CSS', 'Radix UI', 'TypeScript'],
    docStatus: {
      architecture: 'Draft',
      sop: 'Missing',
      api: 'Draft'
    }
  },
  {
    id: 'proj-3',
    name: 'Telemetry & Monitoring Integration',
    description: 'Setting up OpenTelemetry collectors and PromQL/Grafana dashboards across microservices.',
    progress: 95,
    health: 98,
    teamSize: 2,
    lead: 'Sarah Connor',
    techStack: ['Kubernetes', 'Prometheus', 'Grafana', 'Go'],
    docStatus: {
      architecture: 'Complete',
      sop: 'Complete',
      api: 'Complete'
    }
  }
];

const initialNotifications: SystemNotification[] = [
  {
    id: 'n-1',
    type: 'question',
    title: 'Question Answered',
    message: 'Your question "How to deploy worker groups with Terraform?" has been answered by Sarah Connor.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'n-2',
    type: 'document',
    title: 'Document Updated',
    message: 'David Chen updated "Frontend Coding Standards" to v1.4.',
    timestamp: '4 hours ago',
    read: false,
  },
  {
    id: 'n-3',
    type: 'reminder',
    title: 'Learning Reminder',
    message: 'Your upcoming quiz "Advanced Kubernetes Concepts" is due in 2 days.',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: 'n-4',
    type: 'announcement',
    title: 'HR Announcement',
    message: 'Quarterly Knowledge Hackathon kicks off on August 15th! Sign up now.',
    timestamp: '3 days ago',
    read: false,
  },
  {
    id: 'n-5',
    type: 'feedback',
    title: 'Mentor Feedback',
    message: 'VP Elena Rostova left review comments on your draft architecture map.',
    timestamp: '4 days ago',
    read: true,
  }
];

const initialChats: ChatSession[] = [
  {
    id: 'chat-1',
    title: 'Kubernetes VPC peering setup',
    date: '2026-08-05',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'How do I set up VPC peering in our AWS EKS cluster deployment?',
        timestamp: '11:30 AM'
      },
      {
        id: 'm2',
        sender: 'ai',
        text: 'To peer VPCs in our environment, refer to the "Kubernetes Cluster Deployment Guide". You need to define a `aws_vpc_peering_connection` resource in Terraform and add routes targeting the peer subnet in your route tables.',
        timestamp: '11:31 AM',
        codeSnippet: `resource "aws_vpc_peering_connection" "k8s_peer" {
  peer_owner_id = var.peer_owner_id
  peer_vpc_id   = var.peer_vpc_id
  vpc_id        = aws_vpc.k8s_vpc.id
  auto_accept   = true

  tags = {
    Name = "k8s-vpc-peering"
  }
}`,
        language: 'hcl',
        sources: ['Kubernetes Cluster Deployment Guide (v2.1)', 'Infrastructure VPC Config SOP'],
        confidence: 96
      }
    ]
  },
  {
    id: 'chat-2',
    title: 'Tailwind custom borders config',
    date: '2026-08-03',
    messages: [
      {
        id: 'm3',
        sender: 'user',
        text: 'What is the standard border class for subtle glassmorphism in our dark mode theme?',
        timestamp: '03:15 PM'
      },
      {
        id: 'm4',
        sender: 'ai',
        text: 'Per our "Frontend Coding Standards", subtle glassmorphic borders are styled using `border border-white/10` with `backdrop-blur-md` in dark mode, and `border border-black/5` with `backdrop-blur-md` in light mode.',
        timestamp: '03:16 PM',
        codeSnippet: `<div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6">
  <h3 className="text-white font-medium">Sleek Card</h3>
</div>`,
        language: 'jsx',
        sources: ['Frontend Coding Standards & ESLint Config (v1.4)'],
        confidence: 98
      }
    ]
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always initialize to 'dark' — consistent between server and client.
  // The inline script in layout.tsx applies the correct class before first paint (no flash).
  // After mount, we read localStorage and sync the React state to match the DOM.
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  // themeMode is the user's stored preference: 'dark' | 'light' | 'system'
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>('dark');
  const [role, setRole] = useState<UserRole>('employee');
  const [route, setRoute] = useState<AppRoute>('auth');
  const [demoState, setDemoState] = useState<DemoState>('normal');
  const [placeholderModule, setPlaceholderModule] = useState<string>('');
  
  // Data lists
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [chats, setChats] = useState<ChatSession[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  const [searchChats, setSearchChats] = useState<string>('');

  // Modals & Drawers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [activeEmployeeDrawer, setActiveEmployeeDrawer] = useState<Employee | null>(null);
  const [activeDocPreview, setActiveDocPreview] = useState<Document | null>(null);

  // Auth User state (Unauthenticated null state by default)
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Restore session from localStorage on startup
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedSession = localStorage.getItem('launchpad_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed?.user && parsed?.role) {
            setCurrentUser(parsed.user);
            setRole(parsed.role);
            setRoute('dashboard');
            return;
          }
        }
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    }
    setCurrentUser(null);
    setRoute('auth');
  }, []);

  // Sync state between currentUser role and app selected role for convenience
  useEffect(() => {
    if (currentUser) {
      // Find matching employee to sync metadata
      const matched = employees.find(e => e.email === currentUser.email);
      if (matched) {
        setEmployees(prev => prev.map(e => e.id === matched.id ? { ...e, role } : e));
      }
    }
  }, [role]);

  // Resolve a themeMode to an actual 'light' | 'dark' value
  const resolveTheme = (mode: 'light' | 'dark' | 'system'): 'light' | 'dark' => {
    if (mode === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'dark';
    }
    return mode;
  };

  // setThemeMode: the single setter used by both Settings and Navbar toggle.
  // Applies the DOM class synchronously (no useEffect hop) to eliminate flicker.
  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    const resolved = resolveTheme(mode);
    // Update DOM immediately — no async useEffect delay
    const root = window.document.documentElement;
    // Suppress CSS transitions for the instant swap, restore on next frame
    root.setAttribute('data-theme-switching', '');
    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    requestAnimationFrame(() => root.removeAttribute('data-theme-switching'));
    // Batch both state updates together (React 18 auto-batching handles this)
    setThemeModeState(mode);
    setTheme(resolved);
    try {
      localStorage.setItem('launchpad_theme_mode', mode);
    } catch (e) { /* ignore */ }
  };

  // Navbar toggle: cycles dark ↔ light (leaves system mode if currently in it)
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
  };

  // On first mount: read persisted mode from localStorage and sync React state + DOM
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('launchpad_theme_mode') as 'light' | 'dark' | 'system' | null;
      const mode: 'light' | 'dark' | 'system' =
        savedMode === 'light' || savedMode === 'dark' || savedMode === 'system'
          ? savedMode
          : 'dark';
      // Use setThemeMode so the DOM class and React state update together
      setThemeMode(mode);
    } catch (e) { /* stay with default */ }
  }, []); // runs once after mount, client-only

  // Listen for OS-level color scheme changes when in System mode
  useEffect(() => {
    if (themeMode !== 'system' || typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
      const root = window.document.documentElement;
      if (e.matches) root.classList.add('dark');
      else root.classList.remove('dark');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themeMode]);

  // Apply dark class to <html> whenever resolved theme changes.
  // This covers the system-mode OS handler path above (setTheme-only updates).
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Document Operations
  const addDocument = (doc: Omit<Document, 'id' | 'lastUpdated' | 'version'>) => {
    const newDoc: Document = {
      ...doc,
      id: `doc-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      version: 'v1.0'
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const updateDocument = (id: string, updatedFields: Partial<Document>) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, ...updatedFields, lastUpdated: new Date().toISOString().split('T')[0] } : doc))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Employee Operations
  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => (emp.id === id ? { ...emp, ...updatedFields } : emp)));
  };

  const addEmployee = (emp: Omit<Employee, 'id' | 'joinedDate'>) => {
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setEmployees(prev => [...prev, newEmp]);
  };

  // Project Operations
  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects(prev => prev.map(proj => (proj.id === id ? { ...proj, ...updatedFields } : proj)));
  };

  // Notifications Operations
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Chat Operations
  const createNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    const newChat: ChatSession = {
      id: newChatId,
      title: 'New Discussion',
      date: new Date().toISOString().split('T')[0],
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
  };

  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) {
      const remaining = chats.filter(c => c.id !== id);
      if (remaining.length > 0) {
        setActiveChatId(remaining[0].id);
      }
    }
  };

  const addChatMessage = (text: string) => {
    // Standard questions responses helper for demo experience
    let aiResponse = "I couldn't find a direct answer in the knowledge base. Let me check the documentation health score of the active projects.";
    let snippet = undefined;
    let confidence = 45;
    let sources = [] as string[];

    const lowerText = text.toLowerCase();
    if (lowerText.includes('peering') || lowerText.includes('k8s') || lowerText.includes('vpc')) {
      aiResponse = "To connect VPCs, refer to the 'Kubernetes Cluster Deployment Guide'. You will need to create a peering request and update the subnets routing tables.";
      snippet = `resource "aws_vpc_peering_connection" "k8s_peer" {
  peer_owner_id = var.peer_owner_id
  peer_vpc_id   = var.peer_vpc_id
  vpc_id        = aws_vpc.k8s_vpc.id
}`;
      confidence = 96;
      sources = ['Kubernetes Cluster Deployment Guide (v2.1)'];
    } else if (lowerText.includes('coding') || lowerText.includes('eslint') || lowerText.includes('standard')) {
      aiResponse = "We strictly follow standard styling conventions using ESLint, Prettier, and utility-first Tailwind classes. Refer to 'Frontend Coding Standards' for guidelines.";
      snippet = `module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error'
  }
}`;
      confidence = 98;
      sources = ['Frontend Coding Standards & ESLint Config (v1.4)'];
    } else if (lowerText.includes('token') || lowerText.includes('rate') || lowerText.includes('limit')) {
      aiResponse = "Each user starts with a daily token budget of 500,000 tokens for RAG-based AI queries. You can request a quota extension through the Settings panel.";
      confidence = 92;
      sources = ['AI Assistant Token Usage & Rate Limits FAQ (v1.0)'];
    }

    const newUserMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newAiMsg: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      sender: 'ai',
      text: aiResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      codeSnippet: snippet,
      language: snippet ? (lowerText.includes('peer') ? 'hcl' : 'json') : undefined,
      confidence,
      sources
    };

    setChats(prev =>
      prev.map(c => {
        if (c.id === activeChatId) {
          const updatedMsgs = [...c.messages, newUserMsg, newAiMsg];
          // Title auto-generator based on first user query
          const title = c.messages.length === 0 ? text.substring(0, 30) + (text.length > 30 ? '...' : '') : c.title;
          return { ...c, title, messages: updatedMsgs };
        }
        return c;
      })
    );
  };

  const loginUser = (user: any, userRole: UserRole) => {
    setCurrentUser(user);
    setRole(userRole);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('launchpad_session', JSON.stringify({ user, role: userRole }));
      }
    } catch (e) {
      console.error('Failed to save session:', e);
    }
    setRoute('dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('launchpad_session');
      }
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
    setRoute('auth');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        toggleTheme,
        role,
        setRole,
        route,
        setRoute,
        demoState,
        setDemoState,
        placeholderModule,
        setPlaceholderModule,
        
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        
        employees,
        updateEmployee,
        addEmployee,
        
        projects,
        updateProject,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,

        chats,
        activeChatId,
        setActiveChatId,
        addChatMessage,
        createNewChat,
        deleteChat,
        searchChats,
        setSearchChats,

        isUploadModalOpen,
        setIsUploadModalOpen,
        isTicketModalOpen,
        setIsTicketModalOpen,
        activeEmployeeDrawer,
        setActiveEmployeeDrawer,
        activeDocPreview,
        setActiveDocPreview,

        currentUser,
        setCurrentUser,
        loginUser,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
