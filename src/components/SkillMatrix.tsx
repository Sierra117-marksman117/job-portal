'use client';

import React from 'react';
import { Check, Plus, AlertCircle, Sparkles, Building2, GraduationCap } from 'lucide-react';
import { JobItem } from './JobCard';

interface SkillMatrixProps {
  job: JobItem;
  candidateName: string;
  onAddSkill?: (skill: string) => void;
}

export function SkillMatrix({ job, candidateName, onAddSkill }: SkillMatrixProps) {
  const isHighMatch = job.fit.score >= 80;
  const totalSkills = job.requiredSkills.length;
  const matchedCount = job.fit.matched.length;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-4">
      {/* LinkedIn "How you match" Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#0a66c2]" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              How you match with this job
            </h4>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {matchedCount} of {totalSkills} skills match <span className="font-semibold text-slate-800">{candidateName}</span>&apos;s verified profile
          </p>
        </div>

        <div className="text-right shrink-0">
          <span
            className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border mono ${
              isHighMatch
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            {job.fit.score}% Match Fit
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Jaccard Quotient</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isHighMatch ? 'bg-emerald-600' : 'bg-[#0a66c2]'
          }`}
          style={{ width: `${job.fit.score}%` }}
        />
      </div>

      {/* Skills Match vs Missing Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
          Required Tech Stack Evaluation
        </span>

        <div className="flex flex-wrap gap-1.5">
          {/* Matched Skills with Green Check */}
          {job.fit.matched.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 text-emerald-700 font-bold" />
              <span>{skill}</span>
            </span>
          ))}

          {/* Missing Skills with Add Action */}
          {job.fit.gaps.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-dashed border-amber-300 text-slate-700 text-xs font-medium shadow-2xs"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{skill} (Missing)</span>
              {onAddSkill && (
                <button
                  type="button"
                  onClick={() => onAddSkill(skill)}
                  className="text-xs font-bold text-[#0a66c2] hover:text-blue-800 ml-0.5 inline-flex items-center gap-0.5 min-h-[40px] px-2.5 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
                  title={`Add ${skill} to candidate profile`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Candidate Competitive Criteria (LinkedIn Insights) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Experience: <strong>{job.experienceYears}</strong> (Matches profile)</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Work Mode: <strong>{job.workMode || 'Hybrid'}</strong> (Bengaluru Hub)</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Company: <strong>Tier-1 Engineering Entity</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Education: <strong>B.Tech / B.E. / M.Tech</strong></span>
        </div>
      </div>
    </div>
  );
}
