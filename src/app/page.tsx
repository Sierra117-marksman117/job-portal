import React from 'react';
import { getJobsWithCompatibility, getRecruiterPipeline, getAdminData } from './actions';
import { ToastProvider } from '@/components/Toast';
import { MainWorkspace } from '@/components/MainWorkspace';

export const dynamic = 'force-dynamic';

export default async function Page() {
  // Candidate skills (Rohan Sharma)
  const rohanSkills = ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker', 'REST APIs', 'Redis', 'Next.js'];

  // Fetch real SQLite data
  const jobs = await getJobsWithCompatibility(rohanSkills);
  const pipeline = await getRecruiterPipeline();
  const adminData = await getAdminData();

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
