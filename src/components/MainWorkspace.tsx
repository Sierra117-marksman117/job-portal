'use client';

import React, { useState } from 'react';
import { Navbar, Role } from './Navbar';
import { JobCard, JobItem } from './JobCard';
import { SkillMatrix } from './SkillMatrix';
import { ResumeModal } from './ResumeModal';
import { RecruiterPipeline, ApplicationItem } from './RecruiterPipeline';
import { AdminGovernance, CompanyItem, AuditItem } from './AdminGovernance';
import { RegisterModal, RegisteredUserResult } from './RegisterModal';
import { applyToJob } from '@/app/actions';
import { calculateSkillFit } from '@/lib/matching';
import { useToast } from './Toast';

interface MainWorkspaceProps {
  initialJobs: JobItem[];
  initialPipeline: ApplicationItem[];
  initialAdminData: {
    companies: CompanyItem[];
    auditLogs: AuditItem[];
    stats: {
      userCount: number;
      jobCount: number;
      applicationCount: number;
    };
  };
  candidateEmail: string;
  candidateName: string;
}

export function MainWorkspace({
  initialJobs,
  initialPipeline,
  initialAdminData,
  candidateEmail,
  candidateName,
}: MainWorkspaceProps) {
  const [currentRole, setCurrentRole] = useState<Role>('CANDIDATE');
  const [jobs, setJobs] = useState<JobItem[]>(initialJobs);
  const [adminData, setAdminData] = useState(initialAdminData);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(0);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  // Active user / persona states
  const [candidate, setCandidate] = useState({
    name: candidateName,
    email: candidateEmail,
    title: 'Senior Backend Systems Engineer',
    skills: ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker', 'REST APIs', 'Redis', 'Next.js'],
    experience: 3.5,
    location: 'Bengaluru, India',
  });
  const [customRecruiterName, setCustomRecruiterName] = useState<string | undefined>(undefined);
  const [customAdminName, setCustomAdminName] = useState<string | undefined>(undefined);

  const { showToast } = useToast();

  const activeJob = jobs[selectedJobIndex] || jobs[0];

  const handleApply = async () => {
    if (!activeJob) return;
    setIsApplying(true);

    try {
      const res = await applyToJob(activeJob.id, candidate.email);
      if (res.alreadyApplied) {
        showToast('You have already applied for this opening. Status: In Review.', 'info');
      } else {
        setAppliedJobIds((prev) => new Set([...prev, activeJob.id]));
        showToast(`Application submitted to ${activeJob.company.name}! Match fit: ${activeJob.fit.score}%`, 'success');
      }
    } catch {
      showToast('Error submitting application. Please try again.', 'warning');
    } finally {
      setIsApplying(false);
    }
  };

  const handleBookmark = () => {
    showToast(`Position '${activeJob.title}' bookmarked in ${candidate.name}'s profile.`, 'info');
  };

  const handleRegisterSuccess = (
    user: RegisteredUserResult,
    company?: {
      id: string;
      name: string;
      location: string;
      gstin: string | null;
      verified: boolean;
      logo: string | null;
    }
  ) => {
    if (user.role === 'CANDIDATE') {
      const skills = user.skills && user.skills.length > 0 ? user.skills : ['General Engineering'];
      setCandidate({
        name: user.name,
        email: user.email,
        title: user.title || 'Software Engineer',
        skills,
        experience: 3.0,
        location: user.location || 'Bengaluru, India',
      });

      // Recalculate deterministic Jaccard fit for all jobs with new candidate skills
      setJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          fit: calculateSkillFit(skills, job.requiredSkills),
        }))
      );

      setCurrentRole('CANDIDATE');
    } else if (user.role === 'RECRUITER') {
      setCustomRecruiterName(user.name);
      if (company) {
        setAdminData((prev) => ({
          ...prev,
          companies: [company, ...prev.companies],
          stats: {
            ...prev.stats,
            userCount: prev.stats.userCount + 1,
          },
        }));
      }
      setCurrentRole('RECRUITER');
    } else if (user.role === 'ADMIN') {
      setCustomAdminName(user.name);
      setAdminData((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          userCount: prev.stats.userCount + 1,
        },
      }));
      setCurrentRole('ADMIN');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Sticky Navigation Header with Role Switcher & Register Button */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        customCandidateName={candidate.name}
        customRecruiterName={customRecruiterName}
        customAdminName={customAdminName}
      />

      {/* Dynamic Views Based on Active Role */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* CANDIDATE VIEW: 55/45 ASYMMETRIC WORKSPACE */}
        {currentRole === 'CANDIDATE' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
            
            {/* Left Stream (55% on desktop, full width on mobile) */}
            <section className="w-full lg:w-[55%] border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col bg-white shrink-0">
              {/* Filter & Search Ribbon */}
              <div className="p-4 sm:p-6 border-b border-slate-200 space-y-3 bg-slate-50/40">
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Search roles (e.g. Java 21, Spring Boot, Postgres)..."
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-900/5 transition-all shadow-2xs"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium shadow-2xs text-[11px] sm:text-xs">
                      📍 Bengaluru
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium shadow-2xs text-[11px] sm:text-xs">
                      💼 ₹20L - ₹30L CTC
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-[11px] sm:text-xs">
                      ✓ Compatibility Active
                    </span>
                  </div>
                  <span className="text-slate-500 font-medium mono text-[11px]">
                    {jobs.length} verified roles
                  </span>
                </div>
              </div>

              {/* Job Stream List */}
              <div className="flex-1 overflow-y-auto custom-scroll divide-y divide-slate-100">
                {jobs.map((job, idx) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSelected={selectedJobIndex === idx}
                    onSelect={() => setSelectedJobIndex(idx)}
                  />
                ))}
              </div>
            </section>

            {/* Right Detail Panel (45% on desktop, full width on mobile) */}
            {activeJob && (
              <aside className="w-full lg:w-[45%] flex flex-col justify-between bg-white overflow-y-auto custom-scroll shrink-0">
                <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
                  
                  {/* Role Header */}
                  <div className="border-b border-slate-200 pb-5 sm:pb-6">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="font-bold text-slate-700 uppercase tracking-wide">
                        {activeJob.company.name}
                      </span>
                      <span>{activeJob.location}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {activeJob.title}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 text-xs">
                      <span className="font-bold text-slate-900 text-sm mono">
                        ₹{activeJob.ctcMin} - ₹{activeJob.ctcMax} LPA
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">{activeJob.experienceYears}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">Full-time</span>
                    </div>
                  </div>

                  {/* Real-time Skill Compatibility Analysis Component */}
                  <SkillMatrix job={activeJob} candidateName={candidate.name} />

                  {/* Position Summary */}
                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                      Position Summary
                    </h4>
                    <p className="text-slate-600 leading-normal">
                      {activeJob.description}
                    </p>
                  </div>

                </div>

                {/* Action Footer with WCAG 44px min-height compliance */}
                <div className="p-5 sm:p-6 border-t border-slate-200 bg-slate-50 space-y-2.5">
                  <button
                    id="btn-apply-job"
                    onClick={handleApply}
                    disabled={isApplying || appliedJobIds.has(activeJob.id)}
                    className={`btn-press w-full py-3 px-4 min-h-[44px] text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm ${
                      appliedJobIds.has(activeJob.id)
                        ? 'bg-emerald-700 pointer-events-none'
                        : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    <span>⚡</span>
                    <span>
                      {appliedJobIds.has(activeJob.id)
                        ? 'Application Submitted (In Review)'
                        : `Apply with ${candidate.name}'s Profile`}
                    </span>
                  </button>
                  
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={handleBookmark}
                      className="btn-press flex-1 py-2.5 min-h-[44px] rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold shadow-2xs flex items-center justify-center"
                    >
                      Save Job
                    </button>
                    <button
                      onClick={() => setIsResumeOpen(true)}
                      className="btn-press flex-1 py-2.5 min-h-[44px] rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold shadow-2xs flex items-center justify-center"
                    >
                      Preview Resume (PDF)
                    </button>
                  </div>
                </div>
              </aside>
            )}

          </div>
        )}

        {/* RECRUITER VIEW: PIPELINE & APPLICANT MANAGEMENT */}
        {currentRole === 'RECRUITER' && (
          <RecruiterPipeline initialApplications={initialPipeline} />
        )}

        {/* ADMIN VIEW: KYC GOVERNANCE & AUDIT LOGS */}
        {currentRole === 'ADMIN' && (
          <AdminGovernance
            initialCompanies={adminData.companies}
            initialAuditLogs={adminData.auditLogs}
            stats={adminData.stats}
          />
        )}

      </main>

      {/* Verified Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        candidate={candidate}
      />

      {/* Self-Service Registration Modal for All 3 Roles */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
}