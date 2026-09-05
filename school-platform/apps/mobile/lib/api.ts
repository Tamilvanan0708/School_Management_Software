const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

let token: string | null = null;

export function setAuthToken(t: string | null) {
  token = t;
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `API error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    fetchApi<{ accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  students: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchApi<{ data: any[]; total: number; page: number; limit: number }>(`/students${qs}`);
    },
    get: (id: string) => fetchApi<any>(`/students/${id}`),
    getByUserId: (userId: string) => fetchApi<any>(`/students/user/${userId}`),
  },

  dashboard: {
    today: () => fetchApi<any>('/dashboard/today'),
  },

  notifications: {
    list: () => fetchApi<any>('/notifications'),
    markRead: (id: string) => fetchApi<any>(`/notifications/${id}/read`, { method: 'POST' }),
  },
};