import apiClient from './api-client';
import type {
  Company,
  Resource,
  DashboardStats,
  CompanyStatus,
  ResourceCategory,
  TimelineEvent,
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

  delete: async (id: string) => {
    await apiClient.delete(`/resources/${id}`);
  },
};

// ─────────────────────────────────────────
// DASHBOARD — student
// ─────────────────────────────────────────
export const dashboardApi = {
  getStats: async () => {
    const res = await apiClient.get<DashboardStats>('/dashboard/stats');
    return res.data;
  },
};

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

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/timeline/${id}`);
  },
};
