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
  companyLink?: string;
  techStacks?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}



export interface Resource {
  _id: string;
  userId: string;
  title: string;
  category: ResourceCategory;
  link: string;
  createdAt: string;
}

export interface TimelineEvent {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  createdAt: string;
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

export interface AdminStats {
  totalStudents: number;
  totalApplications: number;
  totalOffers: number;
  totalRejections: number;
  statusBreakdown: Record<CompanyStatus, number>;
  topCompanies: { companyName: string; count: number }[];
  recentActivity: (Company & { student?: { name: string; email: string } })[];
  recentResources: (Resource & { student?: { name: string; email: string } })[];
}

export interface StudentUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'student';
  isEmailVerified: boolean;
  techStacks?: string[];
  resumeUrl?: string;
  totalApplications: number;
  selectedOffers: number;
  createdAt: string;
  lastActivity?: string;
}

