'use client';

import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { JobItem } from './JobCard';

interface SkillMatrixProps {
  job: JobItem;
  candidateName: string;
}

export function SkillMatrix({ job, candidateName }: SkillMatrixProps) {
  const isHighMatch = job.fit.score >= 80;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
            Compatibility Analysis
          </span>
          <span className="text-[11px] text-slate-500">
            Matched against {candidateName}&apos;s verified skills
          </span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${
            isHighMatch
              ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
              : 'bg-slate-200 border-slate-300 text-slate-800'
          }`}
        >
          {job.fit.score}% Compatibility
        </span>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isHighMatch ? 'bg-emerald-600' : 'bg-blue-600'
          }`}
          style={{ width: `${job.fit.score}%` }}
        />
      </div>

      {/* Overlap vs Gap Breakdown List */}
      <div className="space-y-2 pt-1 text-xs">
        {job.fit.matched.map((skill) => (
          <div
            key={skill}
            className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs"
          >
            <span className="text-slate-800 font-medium flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
              <span>{skill}</span>
            </span>
            <span className="text-slate-500 font-medium text-[11px]">Verified Match</span>
          </div>
        ))}

        {job.fit.gaps.map((skill) => (
          <div
            key={skill}
            className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs opacity-80"
          >
            <span className="text-slate-600 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 font-bold" />
              <span>{skill}</span>
            </span>
            <span className="text-amber-700 font-medium text-[11px]">Skill Gap</span>
          </div>
        ))}
      </div>
    </div>
  );
}
