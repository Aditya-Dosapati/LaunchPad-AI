/**
 * LaunchPad AI — Centralized API Client
 * ──────────────────────────────────────
 * All backend API calls go through this module.
 * Handles auth headers, 401 auto-logout, error parsing.
 */

const API_BASE = '/api';

// ─────────────────────────────────────────────
// Token helpers
// ─────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('launchpad_token');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('launchpad_token', token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('launchpad_token');
}

// ─────────────────────────────────────────────
// Core fetch wrapper
// ─────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // 401 → clear token (caller can handle redirect)
    if (res.status === 401) {
      clearToken();
    }
    throw new ApiError(
      data.error || `Request failed with status ${res.status}`,
      res.status,
      data.details
    );
  }

  return data as T;
}

// ─────────────────────────────────────────────
// Auth API
// ─────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { email: string; password: string; name: string; role?: string }) =>
    apiFetch<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => apiFetch<{ user: any }>('/auth/me'),
};

// ─────────────────────────────────────────────
// Users API
// ─────────────────────────────────────────────

export const usersApi = {
  list: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters || {}).toString();
    return apiFetch<{ users: any[]; total: number }>(`/users${params ? `?${params}` : ''}`);
  },

  get: (id: string) => apiFetch<{ user: any }>(`/users/${id}`),

  create: (data: any) =>
    apiFetch<{ user: any }>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiFetch<{ user: any }>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch(`/users/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────
// Documents API
// ─────────────────────────────────────────────

export const documentsApi = {
  list: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters || {}).toString();
    return apiFetch<{ documents: any[]; total: number }>(`/documents${params ? `?${params}` : ''}`);
  },

  get: (id: string) => apiFetch<{ document: any }>(`/documents/${id}`),

  create: (data: any) =>
    apiFetch<{ document: any }>('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiFetch<{ document: any }>(`/documents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch(`/documents/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────
// Projects API
// ─────────────────────────────────────────────

export const projectsApi = {
  list: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters || {}).toString();
    return apiFetch<{ projects: any[]; total: number }>(`/projects${params ? `?${params}` : ''}`);
  },

  get: (id: string) => apiFetch<{ project: any }>(`/projects/${id}`),

  create: (data: any) =>
    apiFetch<{ project: any }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiFetch<{ project: any }>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  addMember: (projectId: string, userId: string) =>
    apiFetch<{ member: any }>(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  removeMember: (projectId: string, userId: string) =>
    apiFetch(`/projects/${projectId}/members/${userId}`, { method: 'DELETE' }),

  delete: (id: string) =>
    apiFetch(`/projects/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────
// Notifications API
// ─────────────────────────────────────────────

export const notificationsApi = {
  list: (userId?: string) => {
    const params = userId ? `?userId=${userId}` : '';
    return apiFetch<{ notifications: any[]; total: number }>(`/notifications${params}`);
  },

  create: (data: any) =>
    apiFetch<{ notification: any }>('/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  markRead: (id: string) =>
    apiFetch<{ notification: any }>(`/notifications/${id}/read`, { method: 'PATCH' }),

  markAllRead: (userId?: string) => {
    const params = userId ? `?userId=${userId}` : '';
    return apiFetch<{ updated: number }>(`/notifications/read-all${params}`, { method: 'PATCH' });
  },

  delete: (id: string) =>
    apiFetch(`/notifications/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────
// Chats API
// ─────────────────────────────────────────────

export const chatsApi = {
  list: (userId?: string) => {
    const params = userId ? `?userId=${userId}` : '';
    return apiFetch<{ chats: any[]; total: number }>(`/chats${params}`);
  },

  get: (id: string) => apiFetch<{ chat: any }>(`/chats/${id}`),

  create: (data: { userId?: string; title?: string }) =>
    apiFetch<{ chat: any }>('/chats', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  addMessage: (chatId: string, data: { sender: string; text: string; codeSnippet?: string; language?: string; sources?: string[]; confidence?: number }) =>
    apiFetch<{ message: any }>(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { title?: string }) =>
    apiFetch<{ chat: any }>(`/chats/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch(`/chats/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────
// KT Sessions API
// ─────────────────────────────────────────────

export const ktSessionsApi = {
  list: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters || {}).toString();
    return apiFetch<{ sessions: any[]; total: number }>(`/kt-sessions${params ? `?${params}` : ''}`);
  },

  get: (id: string) => apiFetch<{ session: any }>(`/kt-sessions/${id}`),

  create: (data: any) =>
    apiFetch<{ session: any }>('/kt-sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiFetch<{ session: any }>(`/kt-sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  attend: (sessionId: string, userId: string, attended?: boolean) =>
    apiFetch<{ attendance: any }>(`/kt-sessions/${sessionId}/attend`, {
      method: 'POST',
      body: JSON.stringify({ userId, attended }),
    }),

  delete: (id: string) =>
    apiFetch(`/kt-sessions/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────
// Mentor Pairings API
// ─────────────────────────────────────────────

export const mentorPairingsApi = {
  list: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters || {}).toString();
    return apiFetch<{ pairings: any[]; total: number }>(`/mentor-pairings${params ? `?${params}` : ''}`);
  },

  create: (data: { mentorId: string; menteeId: string }) =>
    apiFetch<{ pairing: any }>('/mentor-pairings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { isActive: boolean }) =>
    apiFetch<{ pairing: any }>(`/mentor-pairings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch(`/mentor-pairings/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────
// Feedback API
// ─────────────────────────────────────────────

export const feedbackApi = {
  list: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters || {}).toString();
    return apiFetch<{ feedback: any[]; total: number }>(`/feedback${params ? `?${params}` : ''}`);
  },

  get: (id: string) => apiFetch<{ feedback: any }>(`/feedback/${id}`),

  create: (data: { text: string; type?: string; sentiment?: string; authorId?: string }) =>
    apiFetch<{ feedback: any }>('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch(`/feedback/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────
// Onboarding API
// ─────────────────────────────────────────────

export const onboardingApi = {
  list: () =>
    apiFetch<{ tracks: any[]; total: number }>('/onboarding'),

  get: (userId: string) =>
    apiFetch<{ track: any }>(`/onboarding/${userId}`),

  create: (data: any) =>
    apiFetch<{ track: any }>('/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (userId: string, data: any) =>
    apiFetch<{ track: any }>(`/onboarding/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (userId: string) =>
    apiFetch(`/onboarding/${userId}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────
// Audit Logs API
// ─────────────────────────────────────────────

export const auditLogsApi = {
  list: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters || {}).toString();
    return apiFetch<{ logs: any[]; total: number }>(`/audit-logs${params ? `?${params}` : ''}`);
  },

  get: (id: string) => apiFetch<{ log: any }>(`/audit-logs/${id}`),

  create: (data: any) =>
    apiFetch<{ log: any }>('/audit-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
