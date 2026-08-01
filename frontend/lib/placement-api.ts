import apiClient from './api-client';
import type {
  Company,
  Resource,
  DashboardStats,
  CompanyStatus,
  ResourceCategory,
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
// ADMIN API — student directory & master register
// ─────────────────────────────────────────
export const adminApi = {
  getStudents: async () => {
    const res = await apiClient.get<{ students: import('@/types/placement').StudentUser[] }>('/auth/students');
    return res.data.students;
  },

  getMasterCompanies: async (params?: { search?: string; status?: string; sort?: string }) => {
    const res = await apiClient.get<{ companies: Company[] }>('/companies', { params: { ...params, all: 'true' } });
    return res.data.companies;
  },
};

