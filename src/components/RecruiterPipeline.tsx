'use client';

import React, { useState } from 'react';
import { updateApplicationStatus } from '@/app/actions';
import { useToast } from './Toast';

export interface ApplicationItem {
  id: string;
  status: string;
  matchScore: number;
  appliedAt: Date | string;
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
}

export function RecruiterPipeline({ initialApplications }: RecruiterPipelineProps) {
  const [applications, setApplications] = useState<ApplicationItem[]>(initialApplications);
  const { showToast } = useToast();

  const handleStatusChange = async (appId: string, candidateName: string, newStatus: string) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      showToast(`Candidate ${candidateName} moved to: ${newStatus}`, 'success');
    } catch {
      showToast(`Failed to update status for ${candidateName}`, 'warning');
    }
  };

  const highMatchCount = applications.filter((a) => a.matchScore >= 80).length;
  const scheduledCount = applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length;
  const avgScore = applications.length
    ? Math.round(applications.reduce((acc, a) => acc + a.matchScore, 0) / applications.length)
    : 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#f8fafc]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            FinWave Recruitment Pipeline
          </h2>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Candidates for <span className="text-slate-900 font-bold">Senior Backend Systems Engineer</span>
          </p>
        </div>
        <button
          onClick={() => showToast('Position requisition creator opened', 'info')}
          className="btn-press px-4 py-2.5 min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs shrink-0"
        >
          <span>+</span> Post New Opening
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Applicants</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 mono">{applications.length}</p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Active pipeline</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Tier-1 Fit (&gt;80%)</span>
          <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 mono">{highMatchCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Algorithm qualified</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Interviews</span>
          <p className="text-xl sm:text-2xl font-bold text-blue-700 mt-1 mono">{scheduledCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Technical round</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Avg. Fit Score</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 mono">{avgScore}%</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Across applicants</span>
        </div>
      </div>

      {/* Applicant Queue Table with Horizontal Scroll */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Candidate Information</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Fit Score</th>
                <th className="p-4 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => {
                const initials = app.candidate.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('');

                return (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs shrink-0">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            {app.candidate.name}
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                app.status === 'SHORTLISTED'
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                  : app.status === 'INTERVIEW_SCHEDULED'
                                  ? 'bg-purple-50 border-purple-200 text-purple-800'
                                  : 'bg-blue-50 border-blue-200 text-blue-800'
                              }`}
                            >
                              {app.status.replace('_', ' ')}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {app.candidate.location || 'Bengaluru'} • {app.candidate.title || 'Software Engineer'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800 mono">
                      {app.candidate.experience ? `${app.candidate.experience} Yrs` : '3.0 Yrs'}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold mono">
                        {app.matchScore}% Fit
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.status !== 'SHORTLISTED' && (
                          <button
                            onClick={() => handleStatusChange(app.id, app.candidate.name, 'SHORTLISTED')}
                            className="btn-press px-3 py-1.5 min-h-[36px] rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold shadow-2xs"
                          >
                            Shortlist
                          </button>
                        )}
                        {app.status !== 'INTERVIEW_SCHEDULED' && (
                          <button
                            onClick={() => handleStatusChange(app.id, app.candidate.name, 'INTERVIEW_SCHEDULED')}
                            className="btn-press px-3 py-1.5 min-h-[36px] rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-2xs"
                          >
                            Schedule
                          </button>
                        )}
                        {app.status === 'INTERVIEW_SCHEDULED' && (
                          <span className="text-[11px] font-medium text-emerald-600 px-2 py-1 bg-emerald-50 rounded-md">
                            Slot Confirmed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
