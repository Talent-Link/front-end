export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  logoUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  type: 'Remote' | 'Hybrid' | 'On-site';
  location: string;
  status: 'Open' | 'Closed' | 'Completed';
  createdAt: string;
  applicantsCount: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  score?: number;
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    year: string;
  }[];
  skills: string[];
  resumeUrl?: string;
  appliedAt: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

export interface JobStatistics {
  totalApplications: number;
  qualifiedCandidates: number;
  approvalRate: number;
}

export interface ReportData {
  period: string;
  candidateCount: number;
  approvalRate: number;
  jobPerformance: {
    jobId: string;
    jobTitle: string;
    applicantsCount: number;
    qualifiedCount: number;
  }[];
}