'use client';

import React, { useState } from 'react';
import { updateApplicationStatus } from '@/app/actions';
import { useToast } from './Toast';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';
import { Plus, Search, Calendar, Video, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';

export interface ApplicationItem {
  id: string;
  status: string;
  matchScore: number;
  appliedAt: Date | string;
  interviewDate?: string | null;
  interviewSlot?: string | null;
  interviewRound?: string | null;
  interviewLink?: string | null;
  candidate: {
    id: string;
    name: string;
    email: string;
    title: string | null;
    experience: number | null;
    location: string | null;
    skills: string;
  };
  job: {
    id: string;
    title: string;
    company: {
      name: string;
    };
  };
}

interface RecruiterPipelineProps {
  initialApplications: ApplicationItem[];
  onOpenPostJob?: () => void;
  recruiterCompanyName?: string;
}

export function RecruiterPipeline({
  initialApplications,
  onOpenPostJob,
  recruiterCompanyName = 'FinWave Technologies',
}: RecruiterPipelineProps) {
  const [applications, setApplications] = useState<ApplicationItem[]>(initialApplications);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<ApplicationItem | null>(null);
  const { showToast } = useToast();

  const handleStatusChange = async (appId: string, candidateName: string, newStatus: string) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      showToast(`Candidate ${candidateName} status changed to [${newStatus}]`, 'success');
    } catch {
      showToast(`Failed to update status for ${candidateName}`, 'warning');
    }
  };

  const handleInterviewScheduled = (updatedApp: ApplicationItem) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
    );
  };

  const highMatchCount = applications.filter((a) => a.matchScore >= 80).length;
  const scheduledCount = applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length;
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;

  const filteredApplications = applications.filter((app) => {
    if (activeFilter === 'HIGH_FIT' && app.matchScore < 80) return false;
    if (activeFilter !== 'ALL' && activeFilter !== 'HIGH_FIT' && app.status !== activeFilter) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = app.candidate.name.toLowerCase().includes(q);
      const matchJob = app.job.title.toLowerCase().includes(q);
      const matchSkills = app.candidate.skills.toLowerCase().includes(q);
      return matchName || matchJob || matchSkills;
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#f8fafc]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Recruitment Pipeline & Requisitions
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
              {recruiterCompanyName}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Review incoming applicants, filter by skill fit, and coordinate calendar interview slots
          </p>
        </div>

        {onOpenPostJob && (
          <button
            id="btn-post-job-trigger"
            onClick={onOpenPostJob}
            className="btn-press px-4 py-2 min-h-[40px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Post New Requisition</span>
          </button>
        )}
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Applicants</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 mono">{applications.length}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Across active roles</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Shortlisted Pool</span>
          <p className="text-xl sm:text-2xl font-bold text-blue-700 mt-1 mono">{shortlistedCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Ready for interviews</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Interviews Scheduled</span>
          <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 mono">{scheduledCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Calendar slots booked</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">High Skill Fit (&gt;80%)</span>
          <p className="text-xl sm:text-2xl font-bold text-purple-700 mt-1 mono">{highMatchCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Tier-1 candidates</span>
        </div>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search candidates by name, job, or tech skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 min-h-[40px] text-xs text-slate-900 focus:outline-none focus:border-slate-500"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Applicants' },
            { id: 'HIGH_FIT', label: 'High Fit (>80%)' },
            { id: 'APPLIED', label: 'In Review' },
            { id: 'SHORTLISTED', label: 'Shortlisted' },
            { id: 'INTERVIEW_SCHEDULED', label: 'Interviews' },
            { id: 'REJECTED', label: 'Rejected' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap text-xs min-h-[38px] flex items-center justify-center ${
                activeFilter === f.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates List / Pipeline Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
            Candidate Pipeline Queue ({filteredApplications.length})
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Sorted by Compatibility Fit</span>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No applicants match the current filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredApplications.map((app) => {
              let parsedSkills: string[] = [];
              try {
                parsedSkills = JSON.parse(app.candidate.skills);
              } catch {
                parsedSkills = app.candidate.skills.split(',').map((s) => s.trim());
              }

              return (
                <div key={app.id} className="p-5 sm:p-6 hover:bg-slate-50/60 transition-colors space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Candidate Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-slate-900 text-base">{app.candidate.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            app.status === 'SHORTLISTED'
                              ? 'bg-blue-50 border-blue-200 text-blue-800'
                              : app.status === 'INTERVIEW_SCHEDULED'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-50 border-rose-200 text-rose-800'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        {app.candidate.title || 'Software Engineer'} • {app.candidate.location || 'India'} • {app.candidate.experience || 3.0} Yrs Exp
                      </p>

                      <p className="text-xs text-slate-500">
                        Applying for: <span className="font-semibold text-slate-800">{app.job.title}</span> • {app.job.company.name}
                      </p>
                    </div>

                    {/* Fit Quotient */}
                    <div className="sm:text-right shrink-0">
                      <div className="inline-block px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm mono">
                        {app.matchScore}% Match Fit
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Skills Chips */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] text-slate-400 font-medium mr-1">Skills:</span>
                    {parsedSkills.slice(0, 7).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {parsedSkills.length > 7 && (
                      <span className="text-[10px] text-slate-400 font-semibold">
                        +{parsedSkills.length - 7} more
                      </span>
                    )}
                  </div>

                  {/* Scheduled Interview Banner (if applicable) */}
                  {app.status === 'INTERVIEW_SCHEDULED' && app.interviewDate && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-emerald-950">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                          <span className="font-bold block">
                            Interview Booked: {app.interviewDate} ({app.interviewSlot})
                          </span>
                          <span className="text-[11px] text-emerald-800">
                            Round: {app.interviewRound || 'Technical Assessment'}
                          </span>
                        </div>
                      </div>

                      {app.interviewLink && (
                        <a
                          href={app.interviewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-press px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 self-start sm:self-auto shadow-2xs"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Video Meeting</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => handleStatusChange(app.id, app.candidate.name, 'SHORTLISTED')}
                      disabled={app.status === 'SHORTLISTED'}
                      className={`btn-press px-3.5 py-1.5 min-h-[40px] rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                        app.status === 'SHORTLISTED'
                          ? 'bg-blue-100 text-blue-800 cursor-default'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>{app.status === 'SHORTLISTED' ? 'Shortlisted' : 'Shortlist Candidate'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedAppForInterview(app)}
                      className="btn-press px-3.5 py-1.5 min-h-[40px] rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-white" />
                      <span>{app.status === 'INTERVIEW_SCHEDULED' ? 'Reschedule Interview' : 'Schedule Interview'}</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(app.id, app.candidate.name, 'REJECTED')}
                      disabled={app.status === 'REJECTED'}
                      className={`btn-press px-3 py-1.5 min-h-[40px] rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors font-medium flex items-center gap-1 ${
                        app.status === 'REJECTED' ? 'text-rose-600 bg-rose-50 cursor-default' : ''
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={!!selectedAppForInterview}
        onClose={() => setSelectedAppForInterview(null)}
        application={selectedAppForInterview}
        onSuccess={handleInterviewScheduled}
      />
    </div>
  );
}
