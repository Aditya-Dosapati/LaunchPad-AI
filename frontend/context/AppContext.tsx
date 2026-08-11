'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  authApi,
  usersApi,
  documentsApi,
  projectsApi,
  notificationsApi,
  chatsApi,
  ktSessionsApi,
  mentorPairingsApi,
  feedbackApi,
  onboardingApi,
  setToken,
  getToken,
  clearToken,
  ApiError,
} from '../lib/api';

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

export interface KTSessionData {
  id: string;
  title: string;
  hostName: string;
  hostId: string;
  status: string;
  scheduledAt: string;
  rating: number | null;
  attendees: number;
}

export interface MentorPairingData {
  id: string;
  mentorName: string;
  mentorId: string;
  menteeName: string;
  menteeId: string;
  isActive: boolean;
}

export interface FeedbackData {
  id: string;
  text: string;
  authorName: string;
  authorId: string | null;
  type: string;
  sentiment: string;
  createdAt: string;
}

export interface OnboardingData {
  id: string;
  userId: string;
  name: string;
  department: string;
  progress: number;
  trainingCompletion: number;
  readinessScore: number;
  pendingKT: string | null;
  pendingDoc: string | null;
  assignedMentorName: string | null;
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

  // Extended data from API
  ktSessions: KTSessionData[];
  mentorPairings: MentorPairingData[];
  feedbackEntries: FeedbackData[];
  onboardingTracks: OnboardingData[];
  refreshKTSessions: () => void;
  refreshMentorPairings: () => void;
  refreshFeedback: () => void;
  refreshOnboarding: () => void;
  submitFeedback: (text: string, type?: string) => Promise<void>;

  // Modals & Drawers States
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isTicketModalOpen: boolean;
  setIsTicketModalOpen: (open: boolean) => void;
  activeEmployeeDrawer: Employee | null;
  setActiveEmployeeDrawer: (emp: Employee | null) => void;
  activeDocPreview: Document | null;
  setActiveDocPreview: (doc: Document | null) => void;
  
  // User Authentication
  currentUser: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    skills: string[];
    department: string;
    role: string;
    jobTitle: string;
    bio: string;
    phone: string;
    location: string;
    employeeId: string;
    mfaEnabled: boolean;
  } | null;
  setCurrentUser: (user: any) => void;
  loginUser: (emailOrUser: any, passwordOrRole?: any) => Promise<void>;
  logout: () => void;
  authLoading: boolean;
  authError: string | null;
  dataLoading: boolean;
}

// ─────────────────────────────────────────────
// Map API data → frontend types
// ─────────────────────────────────────────────

const mapCategoryFromApi = (cat: string): Document['category'] => {
  const map: Record<string, Document['category']> = {
    SOP: 'SOP', FAQ: 'FAQ', API_DOCS: 'API Docs', ARCHITECTURE: 'Architecture',
    CODING_STANDARDS: 'Coding Standards', DEPLOYMENT: 'Deployment', GENERAL: 'General',
  };
  return map[cat] || 'General';
};

const mapCategoryToApi = (cat: string): string => {
  const map: Record<string, string> = {
    'SOP': 'SOP', 'FAQ': 'FAQ', 'API Docs': 'API_DOCS', 'Architecture': 'ARCHITECTURE',
    'Coding Standards': 'CODING_STANDARDS', 'Deployment': 'DEPLOYMENT', 'General': 'GENERAL',
  };
  return map[cat] || 'GENERAL';
};

const mapStatusFromApi = (status: string): Document['status'] => {
  const map: Record<string, Document['status']> = {
    APPROVED: 'Approved', PENDING_REVIEW: 'Pending Review', DRAFT: 'Draft',
  };
  return map[status] || 'Draft';
};

const mapStatusToApi = (status: string): string => {
  const map: Record<string, string> = {
    'Approved': 'APPROVED', 'Pending Review': 'PENDING_REVIEW', 'Draft': 'DRAFT',
  };
  return map[status] || 'DRAFT';
};

const mapDocCompletionFromApi = (s: string): 'Complete' | 'Draft' | 'Missing' => {
  const map: Record<string, 'Complete' | 'Draft' | 'Missing'> = {
    COMPLETE: 'Complete', DRAFT: 'Draft', MISSING: 'Missing',
  };
  return map[s] || 'Missing';
};

const mapRoleFromApi = (role: string): UserRole => {
  const map: Record<string, UserRole> = {
    EMPLOYEE: 'employee', MANAGER: 'manager', HR: 'hr', ADMIN: 'admin',
  };
  return map[role] || 'employee';
};

const mapUserStatusFromApi = (status: string): Employee['status'] => {
  const map: Record<string, Employee['status']> = {
    ACTIVE: 'Active', ONBOARDING: 'Onboarding', ON_LEAVE: 'On Leave', SUSPENDED: 'Suspended',
  };
  return map[status] || 'Active';
};

const mapDepartmentFromApi = (dept: string | null): Employee['department'] => {
  if (!dept) return 'Engineering';
  const map: Record<string, Employee['department']> = {
    ENGINEERING: 'Engineering', PRODUCT: 'Product', MARKETING: 'Marketing',
    HR: 'HR', SALES: 'Sales', OPERATIONS: 'Operations',
  };
  return map[dept] || 'Engineering';
};

const mapApiDocToDoc = (d: any): Document => ({
  id: d.id,
  title: d.title,
  category: mapCategoryFromApi(d.category),
  content: d.content,
  version: d.version || 'v1.0',
  author: d.author?.name || 'Unknown',
  lastUpdated: d.updatedAt ? new Date(d.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  status: mapStatusFromApi(d.status),
  isBookmarked: d.isBookmarked,
  isFavorite: d.isFavorite,
});

const mapApiUserToEmployee = (u: any): Employee => ({
  id: u.id,
  name: u.name,
  email: u.email,
  department: mapDepartmentFromApi(u.department),
  role: mapRoleFromApi(u.role),
  jobTitle: u.jobTitle || '',
  status: mapUserStatusFromApi(u.status),
  knowledgeScore: 0,
  learningProgress: 0,
  onboardingStep: u.status === 'ONBOARDING' ? 2 : 5,
  avatar: u.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  skills: u.skills || [],
  joinedDate: u.joinedAt ? new Date(u.joinedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
});

const mapApiProjectToProject = (p: any): Project => ({
  id: p.id,
  name: p.name,
  description: p.description,
  progress: p.progress,
  health: p.health,
  teamSize: (p.members?.length || 0) + 1, // +1 for lead
  lead: p.lead?.name || 'Unknown',
  techStack: p.techStack || [],
  docStatus: {
    architecture: mapDocCompletionFromApi(p.docArchitecture),
    sop: mapDocCompletionFromApi(p.docSop),
    api: mapDocCompletionFromApi(p.docApi),
  },
});

const mapApiChatToSession = (c: any): ChatSession => ({
  id: c.id,
  title: c.title || 'New Discussion',
  date: c.updatedAt ? new Date(c.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  messages: (c.messages || []).map((m: any) => ({
    id: m.id,
    sender: m.sender === 'USER' ? 'user' : 'ai',
    text: m.text,
    timestamp: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    codeSnippet: m.codeSnippet || undefined,
    language: m.language || undefined,
    sources: m.sources?.length ? m.sources : undefined,
    confidence: m.confidence || undefined,
  })) as ChatMessage[],
});

const mapNotifTypeFromApi = (t: string): SystemNotification['type'] => {
  const map: Record<string, SystemNotification['type']> = {
    QUESTION: 'question', DOCUMENT: 'document', REMINDER: 'reminder',
    ANNOUNCEMENT: 'announcement', FEEDBACK: 'feedback',
  };
  return map[t] || 'announcement';
};

const mapApiNotifToNotif = (n: any): SystemNotification => ({
  id: n.id,
  type: mapNotifTypeFromApi(n.type),
  title: n.title,
  message: n.message,
  timestamp: n.createdAt ? formatTimeAgo(new Date(n.createdAt)) : 'just now',
  read: n.isRead,
});

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

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
  
  // Data lists — now populated from API
  const [documents, setDocuments] = useState<Document[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [searchChats, setSearchChats] = useState<string>('');

  // Extended API data
  const [ktSessions, setKtSessions] = useState<KTSessionData[]>([]);
  const [mentorPairings, setMentorPairings] = useState<MentorPairingData[]>([]);
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackData[]>([]);
  const [onboardingTracks, setOnboardingTracks] = useState<OnboardingData[]>([]);

  // Modals & Drawers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [activeEmployeeDrawer, setActiveEmployeeDrawer] = useState<Employee | null>(null);
  const [activeDocPreview, setActiveDocPreview] = useState<Document | null>(null);

  // Auth User state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  // Prevent duplicate data fetches
  const dataFetchedRef = useRef(false);

  // ─────────────────────────────────────────────
  // Data fetching functions
  // ─────────────────────────────────────────────

  const fetchAllData = useCallback(async () => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    setDataLoading(true);
    try {
      const [
        docsRes,
        usersRes,
        projRes,
        notifRes,
        chatsRes,
        ktRes,
        mentorRes,
        feedbackRes,
        onboardRes,
      ] = await Promise.allSettled([
        documentsApi.list(),
        usersApi.list(),
        projectsApi.list(),
        notificationsApi.list(),
        chatsApi.list(),
        ktSessionsApi.list(),
        mentorPairingsApi.list(),
        feedbackApi.list(),
        onboardingApi.list(),
      ]);

      if (docsRes.status === 'fulfilled') {
        setDocuments(docsRes.value.documents.map(mapApiDocToDoc));
      }
      if (usersRes.status === 'fulfilled') {
        setEmployees(usersRes.value.users.map(mapApiUserToEmployee));
      }
      if (projRes.status === 'fulfilled') {
        setProjects(projRes.value.projects.map(mapApiProjectToProject));
      }
      if (notifRes.status === 'fulfilled') {
        setNotifications(notifRes.value.notifications.map(mapApiNotifToNotif));
      }
      if (chatsRes.status === 'fulfilled') {
        const mappedChats = chatsRes.value.chats.map(mapApiChatToSession);
        setChats(mappedChats);
        if (mappedChats.length > 0) {
          setActiveChatId(mappedChats[0].id);
        }
      }
      if (ktRes.status === 'fulfilled') {
        setKtSessions(ktRes.value.sessions.map((s: any) => ({
          id: s.id,
          title: s.title,
          hostName: s.host?.name || 'Unknown',
          hostId: s.hostId,
          status: s.status,
          scheduledAt: s.scheduledAt,
          rating: s.rating,
          attendees: s.attendances?.length || 0,
        })));
      }
      if (mentorRes.status === 'fulfilled') {
        setMentorPairings(mentorRes.value.pairings.map((p: any) => ({
          id: p.id,
          mentorName: p.mentor?.name || 'Unknown',
          mentorId: p.mentorId,
          menteeName: p.mentee?.name || 'Unknown',
          menteeId: p.menteeId,
          isActive: p.isActive,
        })));
      }
      if (feedbackRes.status === 'fulfilled') {
        setFeedbackEntries(feedbackRes.value.feedback.map((f: any) => ({
          id: f.id,
          text: f.text,
          authorName: f.author?.name || 'Anonymous',
          authorId: f.authorId,
          type: f.type,
          sentiment: f.sentiment,
          createdAt: f.createdAt,
        })));
      }
      if (onboardRes.status === 'fulfilled') {
        setOnboardingTracks(onboardRes.value.tracks.map((t: any) => ({
          id: t.id,
          userId: t.userId,
          name: t.user?.name || 'Unknown',
          department: mapDepartmentFromApi(t.user?.department),
          progress: t.progress,
          trainingCompletion: t.trainingCompletion,
          readinessScore: t.readinessScore,
          pendingKT: t.pendingKT,
          pendingDoc: t.pendingDoc,
          assignedMentorName: t.assignedMentorName,
        })));
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Individual refresh functions
  const refreshKTSessions = useCallback(async () => {
    try {
      const res = await ktSessionsApi.list();
      setKtSessions(res.sessions.map((s: any) => ({
        id: s.id,
        title: s.title,
        hostName: s.host?.name || 'Unknown',
        hostId: s.hostId,
        status: s.status,
        scheduledAt: s.scheduledAt,
        rating: s.rating,
        attendees: s.attendances?.length || 0,
      })));
    } catch (err) { console.error('Failed to refresh KT sessions:', err); }
  }, []);

  const refreshMentorPairings = useCallback(async () => {
    try {
      const res = await mentorPairingsApi.list();
      setMentorPairings(res.pairings.map((p: any) => ({
        id: p.id,
        mentorName: p.mentor?.name || 'Unknown',
        mentorId: p.mentorId,
        menteeName: p.mentee?.name || 'Unknown',
        menteeId: p.menteeId,
        isActive: p.isActive,
      })));
    } catch (err) { console.error('Failed to refresh mentor pairings:', err); }
  }, []);

  const refreshFeedback = useCallback(async () => {
    try {
      const res = await feedbackApi.list();
      setFeedbackEntries(res.feedback.map((f: any) => ({
        id: f.id,
        text: f.text,
        authorName: f.author?.name || 'Anonymous',
        authorId: f.authorId,
        type: f.type,
        sentiment: f.sentiment,
        createdAt: f.createdAt,
      })));
    } catch (err) { console.error('Failed to refresh feedback:', err); }
  }, []);

  const refreshOnboarding = useCallback(async () => {
    try {
      const res = await onboardingApi.list();
      setOnboardingTracks(res.tracks.map((t: any) => ({
        id: t.id,
        userId: t.userId,
        name: t.user?.name || 'Unknown',
        department: mapDepartmentFromApi(t.user?.department),
        progress: t.progress,
        trainingCompletion: t.trainingCompletion,
        readinessScore: t.readinessScore,
        pendingKT: t.pendingKT,
        pendingDoc: t.pendingDoc,
        assignedMentorName: t.assignedMentorName,
      })));
    } catch (err) { console.error('Failed to refresh onboarding:', err); }
  }, []);

  // ─────────────────────────────────────────────
  // Auth: Restore session on mount
  // ─────────────────────────────────────────────

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        setCurrentUser(null);
        setRoute('auth');
        return;
      }
      try {
        const { user } = await authApi.me();
        const mapped = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          skills: user.skills || [],
          department: mapDepartmentFromApi(user.department),
          role: user.role,
          jobTitle: user.jobTitle || '',
          bio: user.bio || '',
          phone: user.phone || '',
          location: user.location || '',
          employeeId: user.employeeId || '',
          mfaEnabled: user.mfaEnabled || false,
        };
        setCurrentUser(mapped);
        setRole(mapRoleFromApi(user.role));
        setRoute('dashboard');
        // Fetch data after auth restored
        dataFetchedRef.current = false;
        fetchAllData();
      } catch (err) {
        console.error('Session restore failed:', err);
        clearToken();
        setCurrentUser(null);
        setRoute('auth');
      }
    };
    restoreSession();
  }, [fetchAllData]);

  // ─────────────────────────────────────────────
  // Theme
  // ─────────────────────────────────────────────

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

  // ─────────────────────────────────────────────
  // Document Operations (API-backed)
  // ─────────────────────────────────────────────

  const addDocument = async (doc: Omit<Document, 'id' | 'lastUpdated' | 'version'>) => {
    try {
      const res = await documentsApi.create({
        title: doc.title,
        content: doc.content,
        category: mapCategoryToApi(doc.category),
        status: mapStatusToApi(doc.status),
      });
      setDocuments(prev => [mapApiDocToDoc(res.document), ...prev]);
    } catch (err) {
      console.error('Failed to create document:', err);
      // Optimistic fallback
      const newDoc: Document = {
        ...doc,
        id: `doc-${Date.now()}`,
        lastUpdated: new Date().toISOString().split('T')[0],
        version: 'v1.0'
      };
      setDocuments(prev => [newDoc, ...prev]);
    }
  };

  const updateDocument = async (id: string, updatedFields: Partial<Document>) => {
    // Optimistic update
    setDocuments(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, ...updatedFields, lastUpdated: new Date().toISOString().split('T')[0] } : doc))
    );
    try {
      const apiData: any = {};
      if (updatedFields.title !== undefined) apiData.title = updatedFields.title;
      if (updatedFields.content !== undefined) apiData.content = updatedFields.content;
      if (updatedFields.category !== undefined) apiData.category = mapCategoryToApi(updatedFields.category);
      if (updatedFields.status !== undefined) apiData.status = mapStatusToApi(updatedFields.status);
      if (updatedFields.isBookmarked !== undefined) apiData.isBookmarked = updatedFields.isBookmarked;
      if (updatedFields.isFavorite !== undefined) apiData.isFavorite = updatedFields.isFavorite;
      if (updatedFields.version !== undefined) apiData.version = updatedFields.version;
      await documentsApi.update(id, apiData);
    } catch (err) {
      console.error('Failed to update document:', err);
    }
  };

  const deleteDocument = async (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    try {
      await documentsApi.delete(id);
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  // ─────────────────────────────────────────────
  // Employee Operations (API-backed)
  // ─────────────────────────────────────────────

  const updateEmployee = async (id: string, updatedFields: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => (emp.id === id ? { ...emp, ...updatedFields } : emp)));
    try {
      const apiData: any = {};
      if (updatedFields.name !== undefined) apiData.name = updatedFields.name;
      if (updatedFields.jobTitle !== undefined) apiData.jobTitle = updatedFields.jobTitle;
      if (updatedFields.skills !== undefined) apiData.skills = updatedFields.skills;
      await usersApi.update(id, apiData);
    } catch (err) {
      console.error('Failed to update employee:', err);
    }
  };

  const addEmployee = async (emp: Omit<Employee, 'id' | 'joinedDate'>) => {
    try {
      const res = await usersApi.create({
        email: emp.email,
        name: emp.name,
        role: emp.role.toUpperCase(),
        department: emp.department.toUpperCase(),
        jobTitle: emp.jobTitle,
        skills: emp.skills,
        status: emp.status.toUpperCase().replace(' ', '_'),
      });
      setEmployees(prev => [...prev, mapApiUserToEmployee(res.user)]);
    } catch (err) {
      console.error('Failed to add employee:', err);
      // Optimistic fallback
      const newEmp: Employee = {
        ...emp,
        id: `emp-${Date.now()}`,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setEmployees(prev => [...prev, newEmp]);
    }
  };

  // ─────────────────────────────────────────────
  // Project Operations (API-backed)
  // ─────────────────────────────────────────────

  const updateProject = async (id: string, updatedFields: Partial<Project>) => {
    setProjects(prev => prev.map(proj => (proj.id === id ? { ...proj, ...updatedFields } : proj)));
    try {
      const apiData: any = {};
      if (updatedFields.name !== undefined) apiData.name = updatedFields.name;
      if (updatedFields.description !== undefined) apiData.description = updatedFields.description;
      if (updatedFields.progress !== undefined) apiData.progress = updatedFields.progress;
      if (updatedFields.health !== undefined) apiData.health = updatedFields.health;
      if (updatedFields.techStack !== undefined) apiData.techStack = updatedFields.techStack;
      await projectsApi.update(id, apiData);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  // ─────────────────────────────────────────────
  // Notifications Operations (API-backed)
  // ─────────────────────────────────────────────

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    try {
      await notificationsApi.markRead(id);
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await notificationsApi.markAllRead();
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  // ─────────────────────────────────────────────
  // Chat Operations (API-backed)
  // ─────────────────────────────────────────────

  const createNewChat = async () => {
    try {
      const res = await chatsApi.create({});
      const mapped = mapApiChatToSession(res.chat);
      setChats(prev => [mapped, ...prev]);
      setActiveChatId(mapped.id);
    } catch (err) {
      console.error('Failed to create chat:', err);
      // Fallback
      const newChatId = `chat-${Date.now()}`;
      const newChat: ChatSession = { id: newChatId, title: 'New Discussion', date: new Date().toISOString().split('T')[0], messages: [] };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChatId);
    }
  };

  const deleteChat = async (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) {
      const remaining = chats.filter(c => c.id !== id);
      if (remaining.length > 0) {
        setActiveChatId(remaining[0].id);
      }
    }
    try {
      await chatsApi.delete(id);
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const addChatMessage = async (text: string) => {
    if (!activeChatId) return;

    // Generate AI response (same demo logic as before)
    let aiResponse = "I couldn't find a direct answer in the knowledge base. Let me check the documentation health score of the active projects.";
    let snippet: string | undefined = undefined;
    let confidence = 45;
    let sources: string[] = [];

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

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text,
      timestamp: nowTime,
    };
    const newAiMsg: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      sender: 'ai',
      text: aiResponse,
      timestamp: nowTime,
      codeSnippet: snippet,
      language: snippet ? (lowerText.includes('peer') ? 'hcl' : 'json') : undefined,
      confidence,
      sources,
    };

    // Optimistic update
    setChats(prev =>
      prev.map(c => {
        if (c.id === activeChatId) {
          const updatedMsgs = [...c.messages, newUserMsg, newAiMsg];
          const title = c.messages.length === 0 ? text.substring(0, 30) + (text.length > 30 ? '...' : '') : c.title;
          return { ...c, title, messages: updatedMsgs };
        }
        return c;
      })
    );

    // Post to API in background
    try {
      await chatsApi.addMessage(activeChatId, { sender: 'USER', text });
      await chatsApi.addMessage(activeChatId, {
        sender: 'AI',
        text: aiResponse,
        codeSnippet: snippet,
        language: snippet ? (lowerText.includes('peer') ? 'hcl' : 'json') : undefined,
        sources,
        confidence,
      });
      // Update chat title if it was first message
      const chat = chats.find(c => c.id === activeChatId);
      if (chat && chat.messages.length === 0) {
        await chatsApi.update(activeChatId, { title: text.substring(0, 30) + (text.length > 30 ? '...' : '') });
      }
    } catch (err) {
      console.error('Failed to save chat messages:', err);
    }
  };

  // ─────────────────────────────────────────────
  // Feedback submit
  // ─────────────────────────────────────────────

  const submitFeedback = async (text: string, type?: string) => {
    try {
      await feedbackApi.create({ text, type: type || 'PUBLIC' });
      await refreshFeedback();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  // ─────────────────────────────────────────────
  // Auth Operations
  // ─────────────────────────────────────────────

  const loginUser = async (emailOrUser: any, passwordOrRole?: any) => {
    // If called with email string + password string → real API login
    if (typeof emailOrUser === 'string' && typeof passwordOrRole === 'string') {
      setAuthLoading(true);
      setAuthError(null);
      try {
        const { token, user } = await authApi.login(emailOrUser, passwordOrRole);
        setToken(token);
        const mapped = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          skills: user.skills || [],
          department: mapDepartmentFromApi(user.department),
          role: user.role,
          jobTitle: user.jobTitle || '',
          bio: user.bio || '',
          phone: user.phone || '',
          location: user.location || '',
          employeeId: user.employeeId || '',
          mfaEnabled: user.mfaEnabled || false,
        };
        setCurrentUser(mapped);
        setRole(mapRoleFromApi(user.role));
        setRoute('dashboard');
        // Fetch all data
        dataFetchedRef.current = false;
        fetchAllData();
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Login failed';
        setAuthError(msg);
        throw err;
      } finally {
        setAuthLoading(false);
      }
    } else {
      // Legacy: called with user object + role (for SSO simulation)
      const user = emailOrUser;
      const userRole = passwordOrRole as UserRole;
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
    }
  };

  const logout = () => {
    setCurrentUser(null);
    clearToken();
    dataFetchedRef.current = false;
    setDocuments([]);
    setEmployees([]);
    setProjects([]);
    setNotifications([]);
    setChats([]);
    setKtSessions([]);
    setMentorPairings([]);
    setFeedbackEntries([]);
    setOnboardingTracks([]);
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

        ktSessions,
        mentorPairings,
        feedbackEntries,
        onboardingTracks,
        refreshKTSessions,
        refreshMentorPairings,
        refreshFeedback,
        refreshOnboarding,
        submitFeedback,

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
        logout,
        authLoading,
        authError,
        dataLoading,
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
