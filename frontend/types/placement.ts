export type CompanyStatus =
  | 'Applied'
  | 'Online Assessment'
  | 'Technical Interview'
  | 'HR Interview'
  | 'Selected'
  | 'Rejected';

export type ResourceCategory =
  | 'DSA'
  | 'Aptitude'
  | 'Resume'
  | 'Interview Experience'
  | 'Core Subjects';

export interface Company {
  _id: string;
  userId: string;
  companyName: string;
  role: string;
  applicationDate: string;
  status: CompanyStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCompany extends Company {
  student: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface Resource {
  _id: string;
  userId: string;
  title: string;
  category: ResourceCategory;
  link: string;
  createdAt: string;
}

export interface AdminResource extends Resource {
  student: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface DashboardStats {
  totalApplied: number;
  totalActive: number;
  totalOffers: number;
  totalRejected: number;
  successRate: number;
  statusBreakdown: Record<CompanyStatus, number>;
  recentApplications: Company[];
}

export interface AdminStudent {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  applicationCount: number;
  offerCount: number;
  lastActivity: string | null;
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalApplications: number;
  totalOffers: number;
  totalRejections: number;
  statusBreakdown: Record<CompanyStatus, number>;
  topCompanies: Array<{ companyName: string; count: number }>;
  recentActivity: Array<AdminCompany & { student: { name: string; email: string } }>;
  recentResources: AdminResource[];
}
