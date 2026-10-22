'use client';

import React from 'react';

export interface JobItem {
  id: string;
  title: string;
  description: string;
  location: string;
  ctcMin: number;
  ctcMax: number;
  experienceYears: string;
  requiredSkills: string[];
  company: {
    id: string;
    name: string;
    location: string;
    logo: string;
    verified: boolean;
  };
  applicationCount: number;
  fit: {
    score: number;
    matched: string[];
    gaps: string[];
  };
}

interface JobCardProps {
  job: JobItem;
  isSelected: boolean;
  onSelect: () => void;
}

export function JobCard({ job, isSelected, onSelect }: JobCardProps) {
  const isHighMatch = job.fit.score >= 80;

  return (
    <div
      onClick={onSelect}
      className={`card-press p-5 sm:p-6 cursor-pointer border-l-4 transition-colors ${
        isSelected
          ? 'bg-blue-50/40 border-l-blue-600'
          : 'border-l-transparent hover:bg-slate-50/80 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
            {job.company.logo}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              {job.company.name} • {job.location}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs sm:text-sm font-bold text-slate-900 block mono">
            ₹{job.ctcMin} - ₹{job.ctcMax} LPA
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold mt-1 border ${
              isHighMatch
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            {isHighMatch && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
            {job.fit.score}% Match
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      <div className="flex items-center gap-1.5 mt-3.5 flex-wrap text-xs">
        {job.requiredSkills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium"
          >
            {skill}
          </span>
        ))}
        {job.requiredSkills.length > 4 && (
          <span className="text-[11px] text-slate-400">+{job.requiredSkills.length - 4} more</span>
        )}
        <span className="text-[11px] text-slate-500 ml-auto font-medium">
          {job.applicationCount} candidates applied
        </span>
      </div>
    </div>
  );
}
