'use client';

import React from 'react';
import { Briefcase, MapPin, IndianRupee, Star, Zap, Bookmark, BookmarkCheck } from 'lucide-react';

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
  rating?: number;
  reviewCount?: number;
  postedAgo?: string;
  openingsCount?: number;
  workMode?: string;
  roleCategory?: string;
  benefits?: string[];
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
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export function JobCard({
  job,
  isSelected,
  onSelect,
  isBookmarked = false,
  onToggleBookmark,
}: JobCardProps) {
  const isHighMatch = job.fit.score >= 80;
  const rating = job.rating || 4.3;
  const reviewCount = job.reviewCount || 240;
  const postedAgo = job.postedAgo || '2d ago';

  return (
    <div
      onClick={onSelect}
      className={`group p-4 sm:p-5 rounded-xl border transition-all cursor-pointer relative ${
        isSelected
          ? 'border-[#0a66c2] bg-[#f8fbff] shadow-xs ring-1 ring-[#0a66c2]/25'
          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
      }`}
    >
      {/* Top Header: Company Avatar + Title + Bookmark */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
            {job.company.logo}
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#0a66c2] transition-colors leading-snug">
              {job.title}
            </h3>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
              <span className="font-medium text-slate-800">{job.company.name}</span>
              {job.company.verified && (
                <span className="text-emerald-700 font-bold text-[10px]" title="Naukri & TalentGrid Verified Recruiter">
                  ✓
                </span>
              )}
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-0.5 text-[11px] text-amber-700 font-semibold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span>{rating}</span>
              </span>
              <span className="text-[11px] text-slate-400">({reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Bookmark Action */}
        {onToggleBookmark && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-[#0a66c2]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Naukri-style 3-Point Specs Ribbon */}
      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 mt-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span>{job.experienceYears}</span>
        </div>
        
        <span className="text-slate-300">•</span>

        <div className="flex items-center gap-0.5 font-semibold text-slate-900 mono">
          <IndianRupee className="w-3 h-3 text-slate-500" />
          <span>{job.ctcMin} - {job.ctcMax} Lacs P.A.</span>
        </div>

        <span className="text-slate-300">•</span>

        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[150px]">{job.location.split('(')[0].trim()}</span>
        </div>
      </div>

      {/* Description Snippet */}
      <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Skills Chips */}
      <div className="flex flex-wrap gap-1.5 mt-3 items-center">
        {job.requiredSkills.slice(0, 4).map((skill) => {
          const isMatched = job.fit.matched.includes(skill);
          return (
            <span
              key={skill}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              {skill}
            </span>
          );
        })}
        {job.requiredSkills.length > 4 && (
          <span className="text-[10px] text-slate-400 font-medium">
            +{job.requiredSkills.length - 4} more
          </span>
        )}
      </div>

      {/* Bottom Footer: Easy Apply • Posted Date • Match Fit */}
      <div className="flex items-center justify-between gap-2 mt-3.5 pt-2.5 border-t border-slate-100 text-[11px]">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="inline-flex items-center gap-1 text-[#0a66c2] font-bold">
            <Zap className="w-3 h-3 fill-[#0a66c2]" />
            <span>Easy Apply</span>
          </span>
          <span className="text-slate-300">•</span>
          <span>{postedAgo}</span>
          <span className="text-slate-300">•</span>
          <span>{job.applicationCount} applicants</span>
        </div>

        <div className="shrink-0">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${
              isHighMatch
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {isHighMatch && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
            <span>{job.fit.score}% Match</span>
          </span>
        </div>
      </div>
    </div>
  );
}
