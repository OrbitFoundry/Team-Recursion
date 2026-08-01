import apiClient from './api-client';
import type {
  Company,
  AdminCompany,
  Resource,
  AdminResource,
  DashboardStats,
  AdminDashboardStats,
  AdminStudent,
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
    notes?: string;
  }) => {
    const res = await apiClient.post<{ company: Company }>('/companies', data);
    return res.data.company;
  },

  update: async (
    id: string,
    data: Partial<{ companyName: string; role: string; applicationDate: string; status: CompanyStatus; notes: string }>
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
// ADMIN
// ─────────────────────────────────────────
export const adminApi = {
  getStudents: async () => {
    const res = await apiClient.get<{ students: AdminStudent[] }>('/admin/students');
    return res.data.students;
  },

  getStudentCompanies: async (studentId: string) => {
    const res = await apiClient.get<{ student: AdminStudent; companies: Company[] }>(
      `/admin/students/${studentId}/companies`
    );
    return res.data;
  },

  getAllCompanies: async (params?: {
    search?: string;
    status?: string;
    sort?: string;
    studentSearch?: string;
  }) => {
    const res = await apiClient.get<{ companies: AdminCompany[] }>('/admin/companies', { params });
    return res.data.companies;
  },

  updateCompany: async (id: string, data: Partial<Company>) => {
    const res = await apiClient.put<{ company: Company }>(`/admin/companies/${id}`, data);
    return res.data.company;
  },

  deleteCompany: async (id: string) => {
    await apiClient.delete(`/admin/companies/${id}`);
  },

  getAllResources: async () => {
    const res = await apiClient.get<{ resources: AdminResource[] }>('/admin/resources');
    return res.data.resources;
  },

  deleteResource: async (id: string) => {
    await apiClient.delete(`/admin/resources/${id}`);
  },

  getDashboardStats: async () => {
    const res = await apiClient.get<AdminDashboardStats>('/admin/dashboard/stats');
    return res.data;
  },
};
