const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
    fetchApi<{ accessToken: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  students: {
    list: (params?: Record<string, string>) => { const qs = params ? '?' + new URLSearchParams(params).toString() : ''; return fetchApi<any>(`/students${qs}`); },
    get: (id: string) => fetchApi<any>(`/students/${id}`),
    getByUserId: (userId: string) => fetchApi<any>(`/students/user/${userId}`),
    create: (data: any) => fetchApi<any>('/students', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/students/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/students/${id}`, { method: 'DELETE' }),
  },

  teachers: {
    list: (params?: Record<string, string>) => { const qs = params ? '?' + new URLSearchParams(params).toString() : ''; return fetchApi<any>(`/teachers${qs}`); },
    get: (id: string) => fetchApi<any>(`/teachers/${id}`),
    create: (data: any) => fetchApi<any>('/teachers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/teachers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/teachers/${id}`, { method: 'DELETE' }),
  },

  classes: {
    list: () => fetchApi<any[]>('/classes'),
    get: (id: string) => fetchApi<any>(`/classes/${id}`),
    create: (data: any) => fetchApi<any>('/classes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/classes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/classes/${id}`, { method: 'DELETE' }),
    addSection: (classId: string, data: any) => fetchApi<any>(`/classes/${classId}/sections`, { method: 'POST', body: JSON.stringify(data) }),
    removeSection: (id: string) => fetchApi<any>(`/classes/sections/${id}`, { method: 'DELETE' }),
  },

  attendance: {
    list: (params?: Record<string, string>) => { const qs = params ? '?' + new URLSearchParams(params).toString() : ''; return fetchApi<any>(`/attendance${qs}`); },
    mark: (data: any) => fetchApi<any>('/attendance', { method: 'POST', body: JSON.stringify(data) }),
    bulkMark: (data: any) => fetchApi<any>('/attendance/bulk', { method: 'POST', body: JSON.stringify(data) }),
    getBySection: (sectionId: string, date?: string) => { const qs = date ? `?date=${date}` : ''; return fetchApi<any[]>(`/attendance/section/${sectionId}${qs}`); },
    getPercentage: (userId: string, from?: string, to?: string) => { const params = new URLSearchParams(); if (from) params.set('from', from); if (to) params.set('to', to); const qs = params.toString() ? '?' + params.toString() : ''; return fetchApi<any>(`/attendance/percentage/${userId}${qs}`); },
  },

  timetable: {
    getBySection: (sectionId: string) => fetchApi<any[]>(`/timetable/section/${sectionId}`),
    getByTeacher: (teacherId: string) => fetchApi<any[]>(`/timetable/teacher/${teacherId}`),
    create: (data: any) => fetchApi<any>('/timetable', { method: 'POST', body: JSON.stringify(data) }),
    bulkCreate: (data: any) => fetchApi<any>('/timetable/bulk', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/timetable/${id}`, { method: 'DELETE' }),
  },

  homework: {
    list: (params?: Record<string, string>) => { const qs = params ? '?' + new URLSearchParams(params).toString() : ''; return fetchApi<any>(`/homework${qs}`); },
    get: (id: string) => fetchApi<any>(`/homework/${id}`),
    getByStudent: (sectionId: string) => fetchApi<any[]>(`/homework/student/${sectionId}`),
    create: (data: any) => fetchApi<any>('/homework', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/homework/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/homework/${id}`, { method: 'DELETE' }),
  },

  assignments: {
    list: (params?: Record<string, string>) => { const qs = params ? '?' + new URLSearchParams(params).toString() : ''; return fetchApi<any>(`/assignments${qs}`); },
    get: (id: string) => fetchApi<any>(`/assignments/${id}`),
    getByStudent: (sectionId: string) => fetchApi<any[]>(`/assignments/student/${sectionId}`),
    create: (data: any) => fetchApi<any>('/assignments', { method: 'POST', body: JSON.stringify(data) }),
    submit: (id: string, data: any) => fetchApi<any>(`/assignments/${id}/submit`, { method: 'POST', body: JSON.stringify(data) }),
    grade: (submissionId: string, data: any) => fetchApi<any>(`/assignments/submissions/${submissionId}/grade`, { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/assignments/${id}`, { method: 'DELETE' }),
  },

  exams: {
    list: () => fetchApi<any[]>('/exams'),
    get: (id: string) => fetchApi<any>(`/exams/${id}`),
    create: (data: any) => fetchApi<any>('/exams', { method: 'POST', body: JSON.stringify(data) }),
    addSchedule: (examId: string, data: any) => fetchApi<any>(`/exams/${examId}/schedules`, { method: 'POST', body: JSON.stringify(data) }),
    enterMarks: (scheduleId: string, data: any) => fetchApi<any>(`/exams/schedules/${scheduleId}/marks`, { method: 'POST', body: JSON.stringify(data) }),
  },

  results: {
    list: (params?: Record<string, string>) => { const qs = params ? '?' + new URLSearchParams(params).toString() : ''; return fetchApi<any[]>(`/results${qs}`); },
    getStudentReport: (studentId: string) => fetchApi<any[]>(`/results/student/${studentId}`),
    getReportCard: (examId: string, studentId: string) => fetchApi<any>(`/results/report-card/${examId}/${studentId}`),
  },

  announcements: {
    list: (params?: Record<string, string>) => { const qs = params ? '?' + new URLSearchParams(params).toString() : ''; return fetchApi<any[]>(`/announcements${qs}`); },
    get: (id: string) => fetchApi<any>(`/announcements/${id}`),
    create: (data: any) => fetchApi<any>('/announcements', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/announcements/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/announcements/${id}`, { method: 'DELETE' }),
  },

  notifications: {
    list: (params?: Record<string, string>) => { const qs = params ? '?' + new URLSearchParams(params).toString() : ''; return fetchApi<any>(`/notifications${qs}`); },
    markRead: (id: string) => fetchApi<any>(`/notifications/${id}/read`, { method: 'POST' }),
    markAllRead: () => fetchApi<any>('/notifications/read-all', { method: 'POST' }),
  },

  calendar: {
    events: (from?: string, to?: string) => { const params = new URLSearchParams(); if (from) params.set('from', from); if (to) params.set('to', to); const qs = params.toString() ? '?' + params.toString() : ''; return fetchApi<any[]>(`/calendar/events${qs}`); },
    createEvent: (data: any) => fetchApi<any>('/calendar/events', { method: 'POST', body: JSON.stringify(data) }),
    deleteEvent: (id: string) => fetchApi<any>(`/calendar/events/${id}`, { method: 'DELETE' }),
    holidays: (from?: string, to?: string) => { const params = new URLSearchParams(); if (from) params.set('from', from); if (to) params.set('to', to); const qs = params.toString() ? '?' + params.toString() : ''; return fetchApi<any[]>(`/calendar/holidays${qs}`); },
    createHoliday: (data: any) => fetchApi<any>('/calendar/holidays', { method: 'POST', body: JSON.stringify(data) }),
    deleteHoliday: (id: string) => fetchApi<any>(`/calendar/holidays/${id}`, { method: 'DELETE' }),
  },

  leaves: {
    list: (status?: string) => { const qs = status ? '?status=' + status : ''; return fetchApi<any[]>(`/leaves${qs}`); },
    my: () => fetchApi<any[]>('/leaves/mine'),
    create: (data: any) => fetchApi<any>('/leaves', { method: 'POST', body: JSON.stringify(data) }),
    approve: (id: string, data: any) => fetchApi<any>(`/leaves/${id}/approve`, { method: 'POST', body: JSON.stringify(data) }),
  },

  communication: {
    threads: () => fetchApi<any[]>('/communication/threads'),
    getThread: (otherId: string) => fetchApi<any[]>(`/communication/threads/${otherId}`),
    send: (data: any) => fetchApi<any>('/communication/messages', { method: 'POST', body: JSON.stringify(data) }),
    markRead: (otherId: string) => fetchApi<any>(`/communication/threads/${otherId}/read`, { method: 'POST' }),
    unreadCount: () => fetchApi<number>('/communication/unread-count'),
  },

  dashboard: {
    today: () => fetchApi<any>('/dashboard/today'),
  },

  fees: {
    structures: () => fetchApi<any[]>('/fees/structures'),
    createStructure: (data: any) => fetchApi<any>('/fees/structures', { method: 'POST', body: JSON.stringify(data) }),
    assign: (data: any) => fetchApi<any>('/fees/assign', { method: 'POST', body: JSON.stringify(data) }),
    children: () => fetchApi<any[]>('/fees/students'),
    pending: () => fetchApi<any[]>('/fees/pending'),
    ledger: (studentId: string) => fetchApi<any>(`/fees/student/${studentId}/ledger`),
    pendingAll: () => fetchApi<any[]>('/fees/pending-all'),
    summary: () => fetchApi<any>('/fees/summary'),
    createOrder: (data: any) => fetchApi<any>('/fees/order', { method: 'POST', body: JSON.stringify(data) }),
    verify: (data: any) => fetchApi<any>('/fees/verify', { method: 'POST', body: JSON.stringify(data) }),
  },

  reports: {
    attendance: () => fetchApi<any[]>('/reports/attendance'),
    exam: (examId: string) => fetchApi<any>(`/reports/exam/${examId}`),
    fees: () => fetchApi<any>('/reports/fees'),
  },

  subjects: {
    list: () => fetchApi<any[]>('/subjects'),
    get: (id: string) => fetchApi<any>(`/subjects/${id}`),
    create: (data: any) => fetchApi<any>('/subjects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/subjects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/subjects/${id}`, { method: 'DELETE' }),
  },

  materials: {
    list: (params?: Record<string, string>) => { const qs = params ? '?' + new URLSearchParams(params).toString() : ''; return fetchApi<any[]>(`/materials${qs}`); },
    create: (data: any) => fetchApi<any>('/materials', { method: 'POST', body: JSON.stringify(data) }),
    upload: (id: string, file: File) => {
      const fd = new FormData(); fd.append('file', file);
      const token = localStorage.getItem('token');
      return fetch(`${API_BASE}/materials/${id}/file`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd }).then((r) => r.json());
    },
    delete: (id: string) => fetchApi<any>(`/materials/${id}`, { method: 'DELETE' }),
  },

  roles: {
    list: () => fetchApi<any[]>('/roles'),
    permissions: () => fetchApi<any[]>('/roles/permissions'),
    create: (data: any) => fetchApi<any>('/roles', { method: 'POST', body: JSON.stringify(data) }),
    setPermissions: (id: string, permissionIds: string[]) => fetchApi<any>(`/roles/${id}/permissions`, { method: 'PATCH', body: JSON.stringify({ permissionIds }) }),
  },

  school: {
    get: () => fetchApi<any>('/school'),
    update: (data: any) => fetchApi<any>('/school', { method: 'PATCH', body: JSON.stringify(data) }),
    academicYears: () => fetchApi<any[]>('/school/academic-years'),
    createYear: (data: any) => fetchApi<any>('/school/academic-years', { method: 'POST', body: JSON.stringify(data) }),
    setCurrentYear: (id: string) => fetchApi<any>(`/school/academic-years/${id}/current`, { method: 'POST' }),
    users: (role?: string) => { const qs = role ? '?role=' + role : ''; return fetchApi<any[]>(`/school/users${qs}`); },
  },

  users: {
    createParent: (data: any) => fetchApi<any>('/users/parents', { method: 'POST', body: JSON.stringify(data) }),
    linkChild: (data: any) => fetchApi<any>('/users/parents/children', { method: 'POST', body: JSON.stringify(data) }),
  },
};