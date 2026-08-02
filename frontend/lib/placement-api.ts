import apiClient from './api-client';
import type {
  Company,
  Resource,
  DashboardStats,
  CompanyStatus,
  ResourceCategory,
  TimelineEvent,
  StudentUser,
  AdminStats,
} from '@/types/placement';

// ─────────────────────────────────────────
// COMPANIES — student
// ─────────────────────────────────────────
export const companiesApi = {
  getAll: async (params?: { search?: string; status?: string; sort?: string }) => {
    const res = await apiClient.get<{ companies: Company[] }>('/companies', { params });
    return res.data.companies;
  },

  create: async (data: {
    companyName: string;
    role: string;
    applicationDate?: string;
    status?: CompanyStatus;
    companyLink?: string;
    techStacks?: string[];
    notes?: string;
  }) => {
    const res = await apiClient.post<{ company: Company }>('/companies', data);
    return res.data.company;
  },

  update: async (
    id: string,
    data: Partial<{
      companyName: string;
      role: string;
      applicationDate: string;
      status: CompanyStatus;
      companyLink?: string;
      techStacks?: string[];
      notes: string;
    }>
  ) => {
    const res = await apiClient.put<{ company: Company }>(`/companies/${id}`, data);
    return res.data.company;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/companies/${id}`);
  },
};

// ─────────────────────────────────────────
// RESOURCES — student
// ─────────────────────────────────────────
export const resourcesApi = {
  getAll: async (params?: { category?: string }) => {
    const res = await apiClient.get<{ resources: Resource[] }>('/resources', { params });
    return res.data.resources;
  },

  create: async (data: { title: string; category: ResourceCategory; link: string }) => {
    const res = await apiClient.post<{ resource: Resource }>('/resources', data);
    return res.data.resource;
  },

  update: async (id: string, data: { title: string; category: ResourceCategory; link: string }) => {
    const res = await apiClient.put<{ resource: Resource }>(`/resources/${id}`, data);
    return res.data.resource;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/resources/${id}`);
  },
};

// ─────────────────────────────────────────
// DASHBOARD — student & admin
// ─────────────────────────────────────────
export const dashboardApi = {
  getStats: async () => {
    const res = await apiClient.get<DashboardStats>('/dashboard/stats');
    return res.data;
  },

  getAdminStats: async () => {
    const res = await apiClient.get<import('@/types/placement').AdminStats>('/dashboard/admin-stats');
    return res.data;
  },
};

// ─────────────────────────────────────────
// ─────────────────────────────────────────
// TIMELINE — student
// ─────────────────────────────────────────
export const timelineApi = {
  getAll: async (): Promise<TimelineEvent[]> => {
    const res = await apiClient.get<{ events: TimelineEvent[] }>('/timeline');
    return res.data.events;
  },

  create: async (data: Partial<TimelineEvent>): Promise<TimelineEvent> => {
    const res = await apiClient.post<{ event: TimelineEvent }>('/timeline', data);
    return res.data.event;
  },

  update: async (id: string, data: Partial<TimelineEvent>): Promise<TimelineEvent> => {
    const res = await apiClient.put<{ event: TimelineEvent }>(`/timeline/${id}`, data);
    return res.data.event;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/timeline/${id}`);
  },
};

// ─────────────────────────────────────────
// ADMIN API — student directory & master register
// ─────────────────────────────────────────
export const adminApi = {
  getStudents: async (params?: { search?: string }) => {
    const res = await apiClient.get<{ students: StudentUser[] }>('/admin/students', { params });
    return res.data.students;
  },

  getStudentDetail: async (id: string): Promise<{ student: StudentUser; companies: Company[] }> => {
    const res = await apiClient.get<{ student: StudentUser; companies: Company[] }>(`/admin/students/${id}`);
    return res.data;
  },

  getMasterCompanies: async (params?: { search?: string; status?: string; sort?: string; studentSearch?: string }) => {
    const res = await apiClient.get<{ companies: Company[] }>('/admin/companies', { params });
    return res.data.companies;
  },

  getStats: async (): Promise<AdminStats> => {
    const res = await apiClient.get<AdminStats>('/admin/dashboard/stats');
    return res.data;
  },

  getResources: async (params?: { category?: string }): Promise<(Resource & { student: { name: string; email: string } })[]> => {
    const res = await apiClient.get<{ resources: (Resource & { student: { name: string; email: string } })[] }>('/admin/resources', { params });
    return res.data.resources;
  },

  deleteResource: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/resources/${id}`);
  },
};
