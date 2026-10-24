'use client';

import React, { useState, useEffect } from 'react';
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
import { GuidedTour } from './GuidedTour';
import { applyToJob } from '@/app/actions';
import { calculateSkillFit } from '@/lib/matching';
import { useToast } from './Toast';
import {
  Search,
  MapPin,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Video,
  FileText,
  Star,
  CheckCircle2,
  Building2,
  Share2,
  SlidersHorizontal,
  Zap,
  Compass,
  X,
} from 'lucide-react';

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
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobs[0]?.id || 'job-1');
  const [activeNavTab, setActiveNavTab] = useState<string>('DISCOVER');

  // Modals & Interactive Guided Tour
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState<boolean>(false);
  const [isVivaOpen, setIsVivaOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [showTourBanner, setShowTourBanner] = useState<boolean>(false);

  // Check if first-time visitor for interactive tour prompt
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    try {
      const dismissed = localStorage.getItem('talentgrid_tour_dismissed');
      if (!dismissed) {
        timer = setTimeout(() => {
          setShowTourBanner(true);
        }, 500);
      }
    } catch {
      // In case localStorage is blocked
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Search & Multi-Filters (Naukri / Indeed style)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [experienceFilter, setExperienceFilter] = useState<string>('ALL');
  const [minCtcFilter, setMinCtcFilter] = useState<number>(0);
  const [highMatchOnly, setHighMatchOnly] = useState<boolean>(false);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<Set<string>>(new Set(['job-2', 'job-4']));

  // Candidate Profile State
  const [candidate, setCandidate] = useState<CandidateProfile>({
    name: candidateName,
    email: candidateEmail,
    title: 'Senior Backend Systems Engineer',
    skills: ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker', 'REST APIs', 'Redis', 'Next.js'],
    experience: 3.5,
    location: 'Bengaluru, India',
    bio: 'Senior backend systems engineer architecting high-throughput distributed Java 21 microservices, PostgreSQL query optimizations, and event-driven architectures across Indian tech hubs.',
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
      ctc: '₹22.0 - ₹28.0 Lacs P.A.',
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

  // Multi-field Filter Engine
  const filteredJobs = jobs.filter((job) => {
    if (activeNavTab === 'SAVED' && !bookmarkedJobIds.has(job.id)) return false;
    if (highMatchOnly && job.fit.score < 80) return false;

    if (locationFilter !== 'ALL' && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }

    if (minCtcFilter > 0 && job.ctcMin < minCtcFilter) {
      return false;
    }

    if (experienceFilter !== 'ALL') {
      if (experienceFilter === '1-3' && !job.experienceYears.includes('1.') && !job.experienceYears.includes('2.')) return false;
      if (experienceFilter === '3-5' && !job.experienceYears.includes('3.') && !job.experienceYears.includes('4.')) return false;
      if (experienceFilter === '5+' && !job.experienceYears.includes('5.') && !job.experienceYears.includes('6.') && !job.experienceYears.includes('8.')) return false;
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

  const activeJob = filteredJobs.find((j) => j.id === selectedJobId) || filteredJobs[0] || jobs[0];

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
          ctc: `₹${activeJob.ctcMin} - ₹${activeJob.ctcMax} Lacs P.A.`,
          status: 'APPLIED',
          matchScore: activeJob.fit.score,
          appliedDate: 'Just now',
        };
        setMyApplications((prev) => [newApp, ...prev]);
        showToast(`⚡ Easy Apply dispatched to ${activeJob.company.name}! Match fit: ${activeJob.fit.score}%`, 'success');
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

  const handleAddSkillFromGap = (skill: string) => {
    if (candidate.skills.includes(skill)) return;
    const updatedSkills = [...candidate.skills, skill];
    const updatedProfile: CandidateProfile = {
      ...candidate,
      skills: updatedSkills,
    };
    setCandidate(updatedProfile);
    setJobs((prevJobs) =>
      prevJobs.map((job) => ({
        ...job,
        fit: calculateSkillFit(updatedSkills, job.requiredSkills),
      }))
    );
    showToast(`Added ${skill} to ${candidate.name}'s profile! Match score recalculated.`, 'success');
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
    setSelectedJobId(newJob.id);
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
    <div className="min-h-screen flex flex-col bg-[#f3f2ef]">
      {/* Sticky Navigation Header */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenViva={() => setIsVivaOpen(true)}
        onStartTour={() => setIsTourOpen(true)}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        customCandidateName={candidate.name}
        customRecruiterName={customRecruiterName}
        customAdminName={customAdminName}
        activeNavTab={activeNavTab}
        onNavTabChange={setActiveNavTab}
        savedJobsCount={bookmarkedJobIds.size}
        applicationsCount={myApplications.length}
      />

      {/* Main Operational Surface */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* CANDIDATE VIEW: NAUKRI / INDEED / LINKEDIN DUAL CONSOLE */}
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
                    className="btn-press px-3.5 py-1.5 rounded-lg bg-[#0a66c2] text-white font-bold text-xs"
                  >
                    Browse More Openings
                  </button>
                </div>

                <div className="space-y-4">
                  {myApplications.map((app) => (
                    <div key={app.id} className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                            {app.companyLogo}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">{app.jobTitle}</h3>
                            <p className="text-xs text-slate-600 mt-0.5">{app.companyName} • {app.location}</p>
                            <span className="text-xs font-semibold mono text-slate-800 mt-1 block">{app.ctc}</span>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${
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

              /* NAUKRI / INDEED / LINKEDIN DUAL PANE DISCOVERY WORKSPACE */
              <div className="flex-1 flex flex-col overflow-hidden max-w-[1600px] w-full mx-auto">
                
                {/* 1. NAUKRI & INDEED UNIFIED SEARCH CONSOLE */}
                <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 shadow-2xs shrink-0">
                  <div className="max-w-6xl mx-auto space-y-2.5">
                    
                    {/* Unified 3-Box Search Bar (Responsive: stacks gracefully on mobile & tablet) */}
                    <div id="tour-search-bar" className="flex flex-col lg:flex-row items-stretch border border-slate-300 rounded-xl overflow-hidden shadow-2xs bg-white divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                      
                      {/* Input 1: Keywords */}
                      <div className="flex-1 flex items-center px-3.5 py-1 min-h-[44px] bg-white">
                        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <input
                          type="text"
                          aria-label="Search skills, designations, or companies"
                          placeholder="Search skills, designations, companies (e.g. Java 21, Spring Boot, SRE)..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent py-1 min-h-[40px]"
                        />
                      </div>

                      {/* Input 2: Location */}
                      <div className="flex items-center px-3.5 py-1 min-h-[44px] bg-white w-full lg:w-auto lg:min-w-[200px]">
                        <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <select
                          aria-label="Filter by location"
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                          className="w-full text-xs text-slate-800 font-medium focus:outline-none bg-transparent cursor-pointer py-1 min-h-[40px]"
                        >
                          <option value="ALL">All Locations (India)</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Gurugram">Gurugram</option>
                          <option value="Pune">Pune</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>

                      {/* Input 3: Experience */}
                      <div className="flex items-center px-3.5 py-1 min-h-[44px] bg-white w-full lg:w-auto lg:min-w-[180px]">
                        <Briefcase className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <select
                          aria-label="Filter by experience"
                          value={experienceFilter}
                          onChange={(e) => setExperienceFilter(e.target.value)}
                          className="w-full text-xs text-slate-800 font-medium focus:outline-none bg-transparent cursor-pointer py-1 min-h-[40px]"
                        >
                          <option value="ALL">Any Experience</option>
                          <option value="1-3">1 - 3 Years</option>
                          <option value="3-5">3 - 5 Years (SDE-2)</option>
                          <option value="5+">5+ Years (Senior)</option>
                        </select>
                      </div>

                      {/* Search Action CTA */}
                      <button
                        type="button"
                        className="btn-press px-6 py-2.5 min-h-[44px] bg-[#0a66c2] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <span>Search Jobs</span>
                      </button>
                    </div>

                    {/* Quick Filter Pills (Naukri signature) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mr-1">
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Filters:</span>
                        </span>

                        <button
                          onClick={() => setHighMatchOnly(!highMatchOnly)}
                          className={`btn-press min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center justify-center transition-colors ${
                            highMatchOnly
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          ✓ High Profile Fit (&gt;80%)
                        </button>

                        <button
                          onClick={() => setMinCtcFilter(minCtcFilter === 24 ? 0 : 24)}
                          className={`btn-press min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center justify-center transition-colors ${
                            minCtcFilter === 24
                              ? 'bg-blue-50 border-blue-300 text-[#0a66c2]'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          💼 &gt; ₹24 Lacs P.A.
                        </button>

                        <button
                          onClick={() => setLocationFilter(locationFilter === 'Bengaluru' ? 'ALL' : 'Bengaluru')}
                          className={`btn-press min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center justify-center transition-colors ${
                            locationFilter === 'Bengaluru'
                              ? 'bg-blue-50 border-blue-300 text-[#0a66c2]'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          📍 Bengaluru
                        </button>

                        <button
                          onClick={() => setActiveNavTab(activeNavTab === 'SAVED' ? 'DISCOVER' : 'SAVED')}
                          className={`btn-press min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center justify-center gap-1.5 transition-colors ${
                            activeNavTab === 'SAVED'
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Saved ({bookmarkedJobIds.size})</span>
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 font-medium">
                        Showing <strong className="text-slate-900">{filteredJobs.length}</strong> matching roles
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. DUAL COLUMN WORKSPACE: FEED (LEFT) + DETAIL (RIGHT) */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-3 sm:p-5 gap-4">
                  
                  {/* Left Column: Job Cards List (Indeed / LinkedIn Feed) */}
                  <section className="w-full lg:w-[46%] flex flex-col bg-transparent overflow-hidden shrink-0">
                    <div className="flex items-center justify-between pb-2.5 px-1 text-xs">
                      <span className="font-semibold text-slate-700">
                        Top Job Matches for <strong className="text-slate-900">{candidate.name}</strong>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Sorted by Compatibility
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scroll space-y-2.5 pr-1">
                      {filteredJobs.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 text-xs bg-white rounded-xl border border-slate-200">
                          No requisitions match your search criteria. Try clearing filters.
                        </div>
                      ) : (
                        filteredJobs.map((job) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            isSelected={activeJob?.id === job.id}
                            onSelect={() => setSelectedJobId(job.id)}
                            isBookmarked={bookmarkedJobIds.has(job.id)}
                            onToggleBookmark={() => handleToggleBookmark(job.id, job.title)}
                          />
                        ))
                      )}
                    </div>
                  </section>

                  {/* Right Column: Full Job Spec & LinkedIn "How you match" Inspector */}
                  {activeJob && (
                    <aside className="w-full lg:w-[54%] bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between overflow-y-auto custom-scroll shrink-0">
                      <div className="p-6 sm:p-7 space-y-6">
                        
                        {/* Top Header Card (LinkedIn Style) */}
                        <div className="border-b border-slate-200 pb-5 space-y-3.5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                              <div className="w-13 h-13 rounded-xl bg-slate-900 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
                                {activeJob.company.logo}
                              </div>

                              <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                                  {activeJob.title}
                                </h2>
                                
                                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 mt-1">
                                  <span className="font-semibold text-slate-900 text-sm">{activeJob.company.name}</span>
                                  {activeJob.company.verified && (
                                    <span className="text-emerald-700 font-bold" title="Verified Employer">✓</span>
                                  )}
                                  <span className="text-slate-300">•</span>
                                  <span className="inline-flex items-center gap-0.5 text-amber-700 font-semibold">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                    <span>{activeJob.rating || 4.3}</span>
                                  </span>
                                  <span className="text-slate-400">({activeJob.reviewCount || 412} reviews)</span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{activeJob.location}</span>
                                  </span>
                                  <span className="text-slate-300">•</span>
                                  <span>{activeJob.postedAgo || '2d ago'}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-emerald-700 font-semibold">{activeJob.applicationCount} applicants</span>
                                </div>
                              </div>
                            </div>

                            {/* Bookmark Quick Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleBookmark(activeJob.id, activeJob.title)}
                              className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0 border border-slate-200"
                              aria-label="Bookmark this role"
                            >
                              {bookmarkedJobIds.has(activeJob.id) ? (
                                <BookmarkCheck className="w-5 h-5 text-[#0a66c2]" />
                              ) : (
                                <Bookmark className="w-5 h-5" />
                              )}
                            </button>
                          </div>

                          {/* Action Buttons Ribbon (LinkedIn / Indeed format) */}
                          <div className="flex flex-wrap items-center gap-2.5 pt-2">
                            <button
                              id="tour-apply-btn"
                              onClick={handleApply}
                              disabled={isApplying || appliedJobIds.has(activeJob.id)}
                              className={`btn-press px-6 py-2.5 min-h-[42px] font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors ${
                                appliedJobIds.has(activeJob.id)
                                  ? 'bg-emerald-700 text-white pointer-events-none'
                                  : 'bg-[#0a66c2] hover:bg-blue-700 text-white'
                              }`}
                            >
                              <Zap className="w-4 h-4 fill-white text-white" />
                              <span>
                                {appliedJobIds.has(activeJob.id)
                                  ? 'Application Submitted (In Review)'
                                  : `Easy Apply with ${candidate.name}'s Profile`}
                              </span>
                            </button>

                            <button
                              onClick={() => setIsResumeOpen(true)}
                              className="btn-press px-4 py-2.5 min-h-[42px] rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs shadow-2xs flex items-center gap-1.5"
                            >
                              <FileText className="w-4 h-4 text-slate-500" />
                              <span>Preview Resume (PDF)</span>
                            </button>

                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                showToast('Job link copied to clipboard!', 'info');
                              }}
                              className="btn-press p-2.5 min-h-[42px] min-w-[42px] rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 flex items-center justify-center"
                              title="Share Job"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Indeed-style Job Highlights Card */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
                          <div>
                            <span className="text-[11px] text-slate-500 block">Annual Compensation</span>
                            <span className="font-bold text-slate-900 mono block mt-0.5">
                              ₹{activeJob.ctcMin} - ₹{activeJob.ctcMax} LPA
                            </span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-500 block">Experience Level</span>
                            <span className="font-bold text-slate-900 block mt-0.5">{activeJob.experienceYears}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-500 block">Work Model</span>
                            <span className="font-bold text-slate-900 block mt-0.5">{activeJob.workMode || 'Hybrid'}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-500 block">Openings Available</span>
                            <span className="font-bold text-emerald-800 block mt-0.5">{activeJob.openingsCount || 3} Positions</span>
                          </div>
                        </div>

                        {/* LinkedIn "How you match" Component with Gap Adding */}
                        <div id="tour-skill-matrix">
                          <SkillMatrix
                            job={activeJob}
                            candidateName={candidate.name}
                            onAddSkill={handleAddSkillFromGap}
                          />
                        </div>

                        {/* Naukri-style Benefits Pills */}
                        {activeJob.benefits && activeJob.benefits.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                              Perks & Benefits Offered
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {activeJob.benefits.map((benefit) => (
                                <span
                                  key={benefit}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50/70 border border-blue-200 text-blue-900 text-xs font-medium"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0a66c2]" />
                                  <span>{benefit}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Detailed Role Architecture & Responsibilities */}
                        <div className="space-y-3 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-5">
                          <h4 className="text-sm font-bold text-slate-900">
                            Role Description & Production Context
                          </h4>
                          <p className="text-slate-600 leading-normal text-xs">
                            {activeJob.description}
                          </p>

                          <div className="space-y-2 pt-2">
                            <h5 className="font-bold text-slate-900 text-xs">Core Responsibilities:</h5>
                            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                              <li>Architect low-latency distributed services handling high-throughput event spikes.</li>
                              <li>Design resilient database schemas with multi-region failover and connection optimization.</li>
                              <li>Build automated unit, integration, and telemetry pipelines across Docker and Kubernetes.</li>
                              <li>Drive architectural RFCs, code quality standards, and mentor junior engineering associates.</li>
                            </ul>
                          </div>

                          <div className="space-y-2 pt-2">
                            <h5 className="font-bold text-slate-900 text-xs">Interview Evaluation Stages:</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                                <span className="font-bold text-slate-900 block">Round 1</span>
                                <span className="text-slate-500">Core Systems & Concurrency (45m)</span>
                              </div>
                              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                                <span className="font-bold text-slate-900 block">Round 2</span>
                                <span className="text-slate-500">Distributed Architecture & LLD (60m)</span>
                              </div>
                              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                                <span className="font-bold text-slate-900 block">Round 3</span>
                                <span className="text-slate-500">Engineering Leadership & Bar-Raiser</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* About the Hiring Company */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-600" />
                            <h5 className="font-bold text-slate-900 text-xs">
                              About {activeJob.company.name}
                            </h5>
                          </div>
                          <p className="text-slate-600 leading-relaxed text-[11px]">
                            {activeJob.company.name} is a high-growth Indian technology organization engineering mission-critical digital rails and enterprise platforms. Operating out of {activeJob.company.location} with verified statutory corporate governance.
                          </p>
                        </div>

                      </div>

                      {/* Sticky Footer CTA */}
                      <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 mono block">
                            ₹{activeJob.ctcMin} - ₹{activeJob.ctcMax} Lacs P.A.
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {activeJob.company.name} • {activeJob.location}
                          </span>
                        </div>

                        <button
                          onClick={handleApply}
                          disabled={isApplying || appliedJobIds.has(activeJob.id)}
                          className={`btn-press px-5 py-2 min-h-[40px] font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors ${
                            appliedJobIds.has(activeJob.id)
                              ? 'bg-emerald-700 text-white pointer-events-none'
                              : 'bg-[#0a66c2] hover:bg-blue-700 text-white'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5 fill-white text-white" />
                          <span>
                            {appliedJobIds.has(activeJob.id)
                              ? 'Submitted'
                              : 'Easy Apply Now'}
                          </span>
                        </button>
                      </div>
                    </aside>
                  )}

                </div>

              </div>
            )}
          </div>
        )}

        {/* RECRUITER VIEW: PIPELINE & APPLICANT MANAGEMENT */}
        {currentRole === 'RECRUITER' && (
          <RecruiterPipeline
            initialApplications={initialPipeline}
            onOpenPostJob={() => setIsPostJobOpen(true)}
            recruiterCompanyName={customRecruiterName ? `${customRecruiterName.split(' ')[0]}'s Tech` : 'FinWave Technologies'}
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

      {/* Interactive Step-by-Step Guided Website Tour */}
      <GuidedTour
        isOpen={isTourOpen}
        onClose={() => {
          setIsTourOpen(false);
          try {
            localStorage.setItem('talentgrid_tour_dismissed', 'true');
          } catch {
            // ignore
          }
        }}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
      />

      {/* First-Time Visitor Guide Banner Prompt */}
      {showTourBanner && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-full px-4 py-2 shadow-xl border border-slate-700 flex items-center gap-3 text-xs animate-in slide-in-from-bottom duration-300 max-w-[calc(100vw-24px)]">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <Compass className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">New to TalentGrid? Take an interactive guided tour</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setShowTourBanner(false);
                setIsTourOpen(true);
              }}
              className="btn-press min-h-[40px] px-3.5 py-1.5 rounded-full bg-[#0a66c2] hover:bg-blue-600 font-bold text-white shadow-xs transition-colors text-xs flex items-center justify-center"
            >
              Start Tour
            </button>
            <button
              onClick={() => {
                setShowTourBanner(false);
                try {
                  localStorage.setItem('talentgrid_tour_dismissed', 'true');
                } catch {
                  // ignore
                }
              }}
              aria-label="Dismiss tour prompt"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
