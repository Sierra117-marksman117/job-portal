'use client';

import React, { useState } from 'react';
import { Navbar, Role } from './Navbar';
import { JobCard, JobItem } from './JobCard';
import { SkillMatrix } from './SkillMatrix';
import { ResumeModal } from './ResumeModal';
import { RecruiterPipeline, ApplicationItem } from './RecruiterPipeline';
import { AdminGovernance, CompanyItem, AuditItem } from './AdminGovernance';
import { RegisterModal, RegisteredUserResult } from './RegisterModal';
import { CandidateProfileModal, CandidateProfile } from './CandidateProfileModal';
import { PostJobModal } from './PostJobModal';
import { VivaDossierModal } from './VivaDossierModal';
import { applyToJob } from '@/app/actions';
import { calculateSkillFit } from '@/lib/matching';
import { useToast } from './Toast';
import { Search, Bookmark, BookmarkCheck, Calendar, Video, CheckCircle2, FileText } from 'lucide-react';

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

interface MySubmittedApp {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  location: string;
  ctc: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'REJECTED';
  matchScore: number;
  appliedDate: string;
  interviewDate?: string;
  interviewSlot?: string;
  interviewRound?: string;
  interviewLink?: string;
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
  const [activeNavTab, setActiveNavTab] = useState<string>('DISCOVER');

  // Modals
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState<boolean>(false);
  const [isVivaOpen, setIsVivaOpen] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [minCtcFilter, setMinCtcFilter] = useState<number>(0);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<Set<string>>(new Set(['job-2']));

  // Candidate Profile State
  const [candidate, setCandidate] = useState<CandidateProfile>({
    name: candidateName,
    email: candidateEmail,
    title: 'Senior Backend Systems Engineer',
    skills: ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker', 'REST APIs', 'Redis', 'Next.js'],
    experience: 3.5,
    location: 'Bengaluru, India',
    bio: 'Senior backend engineer architecting high-throughput distributed Java 21 microservices, PostgreSQL query optimizations, and event-driven architectures.',
    resumeFileName: 'Rohan_Sharma_Verified_CV_2026.pdf',
  });

  // Track Submitted Applications
  const [myApplications, setMyApplications] = useState<MySubmittedApp[]>([
    {
      id: 'app-seed-1',
      jobId: 'job-1',
      jobTitle: 'Senior Backend Systems Engineer',
      companyName: 'FinWave Technologies',
      companyLogo: 'FW',
      location: 'Bengaluru, Karnataka (Hybrid)',
      ctc: '₹22.0 - ₹28.0 LPA',
      status: 'INTERVIEW_SCHEDULED',
      matchScore: 92,
      appliedDate: '24 Oct 2026',
      interviewDate: '2026-10-28',
      interviewSlot: '11:00 AM - 11:45 AM IST',
      interviewRound: 'Technical Round 1: Core Systems & Concurrency',
      interviewLink: 'https://meet.google.com/tg-finwave-eng',
    },
  ]);

  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set(['job-1']));
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const [customRecruiterName, setCustomRecruiterName] = useState<string | undefined>(undefined);
  const [customAdminName, setCustomAdminName] = useState<string | undefined>(undefined);

  const { showToast } = useToast();

  // Filter Jobs
  const filteredJobs = jobs.filter((job) => {
    if (activeNavTab === 'SAVED' && !bookmarkedJobIds.has(job.id)) return false;

    if (locationFilter !== 'ALL' && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }

    if (minCtcFilter > 0 && job.ctcMin < minCtcFilter) {
      return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.name.toLowerCase().includes(q);
      const matchSkills = job.requiredSkills.some((s) => s.toLowerCase().includes(q));
      return matchTitle || matchCompany || matchSkills;
    }

    return true;
  });

  const activeJob = filteredJobs[selectedJobIndex] || filteredJobs[0] || jobs[0];

  const handleApply = async () => {
    if (!activeJob) return;
    setIsApplying(true);

    try {
      const res = await applyToJob(activeJob.id, candidate.email);
      if (res.alreadyApplied) {
        showToast('You have already applied for this opening. Status: In Review.', 'info');
      } else {
        setAppliedJobIds((prev) => new Set([...prev, activeJob.id]));
        const newApp: MySubmittedApp = {
          id: `app-${Date.now()}`,
          jobId: activeJob.id,
          jobTitle: activeJob.title,
          companyName: activeJob.company.name,
          companyLogo: activeJob.company.logo,
          location: activeJob.location,
          ctc: `₹${activeJob.ctcMin} - ₹${activeJob.ctcMax} LPA`,
          status: 'APPLIED',
          matchScore: activeJob.fit.score,
          appliedDate: 'Just now',
        };
        setMyApplications((prev) => [newApp, ...prev]);
        showToast(`Application submitted to ${activeJob.company.name}! Match fit: ${activeJob.fit.score}%`, 'success');
      }
    } catch {
      showToast('Error submitting application. Please try again.', 'warning');
    } finally {
      setIsApplying(false);
    }
  };

  const handleToggleBookmark = (jobId: string, jobTitle: string) => {
    setBookmarkedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
        showToast(`'${jobTitle}' removed from saved jobs.`, 'info');
      } else {
        next.add(jobId);
        showToast(`'${jobTitle}' bookmarked!`, 'success');
      }
      return next;
    });
  };

  const handleProfileSave = (updated: CandidateProfile) => {
    setCandidate(updated);
    setJobs((prevJobs) =>
      prevJobs.map((job) => ({
        ...job,
        fit: calculateSkillFit(updated.skills, job.requiredSkills),
      }))
    );
  };

  const handleJobCreated = (newJob: JobItem) => {
    setJobs((prev) => [newJob, ...prev]);
    setAdminData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        jobCount: prev.stats.jobCount + 1,
      },
    }));
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
      const skills = user.skills && user.skills.length > 0 ? user.skills : ['Java 21', 'PostgreSQL'];
      const updatedProfile: CandidateProfile = {
        name: user.name,
        email: user.email,
        title: user.title || 'Software Engineer',
        skills,
        experience: 3.0,
        location: user.location || 'Bengaluru, India',
        resumeFileName: `${user.name.replace(/\s+/g, '_')}_CV.pdf`,
      };
      setCandidate(updatedProfile);
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
      {/* Sticky Navigation Header */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenViva={() => setIsVivaOpen(true)}
        customCandidateName={candidate.name}
        customRecruiterName={customRecruiterName}
        customAdminName={customAdminName}
        activeNavTab={activeNavTab}
        onNavTabChange={setActiveNavTab}
      />

      {/* Dynamic Views Based on Active Role */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* CANDIDATE VIEW */}
        {currentRole === 'CANDIDATE' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* SUBMITTED APPLICATIONS TAB VIEW */}
            {activeNavTab === 'APPLICATIONS' ? (
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">My Job Applications ({myApplications.length})</h2>
                    <p className="text-xs text-slate-500">Track application lifecycle, interview dates, and recruiter decisions in real time</p>
                  </div>
                  <button
                    onClick={() => setActiveNavTab('DISCOVER')}
                    className="btn-press px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs"
                  >
                    Browse More Openings
                  </button>
                </div>

                <div className="space-y-4">
                  {myApplications.map((app) => (
                    <div key={app.id} className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                            {app.companyLogo}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">{app.jobTitle}</h3>
                            <p className="text-xs text-slate-600 mt-0.5">{app.companyName} • {app.location}</p>
                            <span className="text-xs font-semibold mono text-slate-800 mt-1 block">{app.ctc}</span>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                            app.status === 'INTERVIEW_SCHEDULED'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : app.status === 'SHORTLISTED'
                              ? 'bg-blue-50 border-blue-200 text-blue-800'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}>
                            {app.status.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-1">Applied: {app.appliedDate}</span>
                        </div>
                      </div>

                      {/* Application Lifecycle Pipeline Progress Indicator */}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-2">
                          <span className="text-emerald-700">1. Applied ✓</span>
                          <span className={app.status !== 'APPLIED' ? 'text-emerald-700' : 'text-slate-400'}>2. Shortlisted</span>
                          <span className={app.status === 'INTERVIEW_SCHEDULED' ? 'text-emerald-700' : 'text-slate-400'}>3. Interview Slot</span>
                          <span className="text-slate-300">4. Decision</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                          <div className="bg-emerald-600 h-full" style={{ width: app.status === 'INTERVIEW_SCHEDULED' ? '75%' : app.status === 'SHORTLISTED' ? '50%' : '25%' }} />
                        </div>
                      </div>

                      {/* Interview Banner if Scheduled */}
                      {app.status === 'INTERVIEW_SCHEDULED' && app.interviewDate && (
                        <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
                          <div className="flex items-center gap-2.5">
                            <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                            <div>
                              <span className="font-bold block">Interview Confirmed: {app.interviewDate} ({app.interviewSlot})</span>
                              <span className="text-[11px] text-emerald-800">{app.interviewRound}</span>
                            </div>
                          </div>
                          {app.interviewLink && (
                            <a
                              href={app.interviewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-press px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Google Meet</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (

              /* DUAL PANEL DISCOVERY & INSPECTOR WORKSPACE */
              <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
                
                {/* Left Stream: Job Requisitions */}
                <section className="w-full lg:w-[55%] border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col bg-white shrink-0">
                  {/* Search and Multi-Filter Ribbon */}
                  <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3 bg-slate-50/40">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="Search roles by title, stack, or company (e.g. Java 21, Postgres, Docker)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-900/5 transition-all shadow-2xs"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {/* Location Dropdown */}
                        <select
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium text-[11px] shadow-2xs focus:outline-none"
                        >
                          <option value="ALL">📍 All Locations</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Gurugram">Gurugram</option>
                          <option value="Pune">Pune</option>
                          <option value="Remote">Remote</option>
                        </select>

                        {/* CTC Filter */}
                        <select
                          value={minCtcFilter}
                          onChange={(e) => setMinCtcFilter(Number(e.target.value))}
                          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium text-[11px] shadow-2xs focus:outline-none"
                        >
                          <option value="0">💼 Any CTC</option>
                          <option value="20">&gt; ₹20 LPA</option>
                          <option value="24">&gt; ₹24 LPA</option>
                        </select>

                        {/* Saved Jobs Toggle */}
                        <button
                          onClick={() => setActiveNavTab(activeNavTab === 'SAVED' ? 'DISCOVER' : 'SAVED')}
                          className={`btn-press px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors ${
                            activeNavTab === 'SAVED'
                              ? 'bg-slate-900 text-white'
                              : 'bg-white border border-slate-200 text-slate-700'
                          }`}
                        >
                          <Bookmark className="w-3 h-3" />
                          <span>Saved ({bookmarkedJobIds.size})</span>
                        </button>
                      </div>

                      <span className="text-slate-500 font-medium mono text-[11px]">
                        {filteredJobs.length} {activeNavTab === 'SAVED' ? 'saved' : 'available'} roles
                      </span>
                    </div>
                  </div>

                  {/* Job List */}
                  <div className="flex-1 overflow-y-auto custom-scroll divide-y divide-slate-100">
                    {filteredJobs.length === 0 ? (
                      <div className="p-12 text-center text-slate-500 text-xs">
                        No job requisitions found matching your criteria.
                      </div>
                    ) : (
                      filteredJobs.map((job, idx) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          isSelected={activeJob?.id === job.id}
                          onSelect={() => setSelectedJobIndex(idx)}
                        />
                      ))
                    )}
                  </div>
                </section>

                {/* Right Detail Panel */}
                {activeJob && (
                  <aside className="w-full lg:w-[45%] flex flex-col justify-between bg-white overflow-y-auto custom-scroll shrink-0">
                    <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
                      
                      {/* Role Header */}
                      <div className="border-b border-slate-200 pb-5 sm:pb-6">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                          <span className="font-bold text-slate-700 uppercase tracking-wide">
                            {activeJob.company.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>{activeJob.location}</span>
                            {activeJob.company.verified && (
                              <span className="text-emerald-700 font-bold ml-1">✓ Verified</span>
                            )}
                          </span>
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
                          Position Architecture & Responsibilities
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
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          {appliedJobIds.has(activeJob.id)
                            ? 'Application Submitted (In Review)'
                            : `Apply with ${candidate.name}'s Profile (${activeJob.fit.score}% Match)`}
                        </span>
                      </button>
                      
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => handleToggleBookmark(activeJob.id, activeJob.title)}
                          className="btn-press flex-1 py-2.5 min-h-[44px] rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold shadow-2xs flex items-center justify-center gap-1.5"
                        >
                          {bookmarkedJobIds.has(activeJob.id) ? (
                            <>
                              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-4 h-4 text-slate-500" />
                              <span>Save Job</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setIsResumeOpen(true)}
                          className="btn-press flex-1 py-2.5 min-h-[44px] rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold shadow-2xs flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span>Preview Resume (PDF)</span>
                        </button>
                      </div>
                    </div>
                  </aside>
                )}

              </div>
            )}
          </div>
        )}

        {/* RECRUITER VIEW: PIPELINE & APPLICANT MANAGEMENT */}
        {currentRole === 'RECRUITER' && (
          <RecruiterPipeline
            initialApplications={initialPipeline}
            onOpenPostJob={() => setIsPostJobOpen(true)}
            recruiterCompanyName={customRecruiterName ? `${customRecruiterName.split(' ')[0]}'s Company` : 'FinWave Technologies'}
          />
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

      {/* Candidate Profile & Skills Customizer Modal */}
      <CandidateProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        candidate={candidate}
        onSave={handleProfileSave}
      />

      {/* Recruiter Post Job Modal */}
      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onJobCreated={handleJobCreated}
        recruiterCompanyName={customRecruiterName ? `${customRecruiterName.split(' ')[0]}'s Tech` : 'FinWave Technologies'}
      />

      {/* College Project Viva & Architecture Dossier Modal */}
      <VivaDossierModal
        isOpen={isVivaOpen}
        onClose={() => setIsVivaOpen(false)}
      />
    </div>
  );
}
