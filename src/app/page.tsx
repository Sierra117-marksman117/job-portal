import React from 'react';
import { getJobsWithCompatibility, getRecruiterPipeline, getAdminData } from './actions';
import { ToastProvider } from '@/components/Toast';
import { MainWorkspace } from '@/components/MainWorkspace';
import { JobItem } from '@/components/JobCard';
import { ApplicationItem } from '@/components/RecruiterPipeline';
import { CompanyItem, AuditItem } from '@/components/AdminGovernance';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rohanSkills = ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker', 'REST APIs', 'Redis', 'Next.js'];

  let jobs: JobItem[] = [];
  let pipeline: ApplicationItem[] = [];
  let adminData: {
    companies: CompanyItem[];
    auditLogs: AuditItem[];
    stats: { userCount: number; jobCount: number; applicationCount: number };
  } = {
    companies: [],
    auditLogs: [],
    stats: { userCount: 48, jobCount: 3, applicationCount: 14 },
  };

  try {
    jobs = await getJobsWithCompatibility(rohanSkills);
    pipeline = await getRecruiterPipeline();
    adminData = await getAdminData();
  } catch (err) {
    console.error('Page-level data load exception caught gracefully:', err);
  }

  return (
    <ToastProvider>
      <MainWorkspace
        initialJobs={jobs}
        initialPipeline={pipeline}
        initialAdminData={adminData}
        candidateEmail="rohan.sharma.dev@example.com"
        candidateName="Rohan Sharma"
      />
    </ToastProvider>
  );
}
