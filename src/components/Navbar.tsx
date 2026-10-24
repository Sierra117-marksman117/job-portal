'use client';

import React from 'react';
import { Briefcase, FileText, UserPlus, GraduationCap, UserCheck, Bookmark, ClipboardList, PlusCircle, Compass } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onOpenResume: () => void;
  onOpenRegister: () => void;
  onOpenProfile?: () => void;
  onOpenViva?: () => void;
  onStartTour?: () => void;
  onOpenPostJob?: () => void;
  customCandidateName?: string;
  customRecruiterName?: string;
  customAdminName?: string;
  activeNavTab?: string;
  onNavTabChange?: (tab: string) => void;
  savedJobsCount?: number;
  applicationsCount?: number;
}

export function Navbar({
  currentRole,
  onRoleChange,
  onOpenResume,
  onOpenRegister,
  onOpenProfile,
  onOpenViva,
  onStartTour,
  onOpenPostJob,
  customCandidateName,
  customRecruiterName,
  customAdminName,
  activeNavTab = 'DISCOVER',
  onNavTabChange,
  savedJobsCount = 1,
  applicationsCount = 1,
}: NavbarProps) {
  const seekerLabel = customCandidateName ? customCandidateName.split(' ')[0] : 'Rohan';
  const recruiterLabel = customRecruiterName ? customRecruiterName.split(' ')[0] : 'Neha';
  const adminLabel = customAdminName ? customAdminName.split(' ')[0] : 'Rajesh';

  return (
    <header className="border-b border-slate-200/90 bg-white sticky top-0 z-40 px-3 sm:px-6 py-2 shadow-2xs w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-2.5 sm:gap-4 w-full">
        
        {/* Brand & Main Links (Wraps cleanly without pushing viewport) */}
        <div className="w-full xl:w-auto flex flex-wrap items-center justify-between xl:justify-start gap-2.5 sm:gap-4">
          <div id="tour-brand" className="flex items-center gap-2.5">
            {/* LinkedIn/Naukri styled brand emblem */}
            <div className="w-9 h-9 rounded-lg bg-[#0a66c2] text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-xs shrink-0">
              TG
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight block">
                  TalentGrid India
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-blue-50 text-[#0a66c2] text-[9px] font-bold uppercase tracking-wider border border-blue-200">
                  Tech Careers
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block -mt-0.5 font-medium">
                Naukri • Indeed • LinkedIn Standards
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Academic Viva Button with WCAG 40px touch target */}
            {onOpenViva && (
              <button
                id="tour-viva-btn"
                onClick={onOpenViva}
                className="btn-press min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs transition-colors shrink-0"
                title="Open Academic Viva Dossier & OOP Architecture"
              >
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Viva & OOPs</span>
              </button>
            )}

            {/* Interactive Guided Tour Trigger */}
            {onStartTour && (
              <button
                id="btn-start-tour"
                onClick={onStartTour}
                className="btn-press min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0a66c2] text-xs font-bold shadow-2xs transition-colors shrink-0"
                title="Take an Interactive Guided Tour of the Platform"
              >
                <Compass className="w-4 h-4 text-[#0a66c2]" />
                <span>Website Guide</span>
              </button>
            )}
          </div>

          {/* Navigation Links per Role (LinkedIn/Naukri Tab Icons) */}
          <nav className="hidden 2xl:flex items-center gap-1 pl-4 border-l border-slate-200 text-xs font-medium text-slate-600">
            {currentRole === 'CANDIDATE' && onNavTabChange && (
              <>
                <button
                  onClick={() => onNavTabChange('DISCOVER')}
                  className={`min-h-[40px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeNavTab === 'DISCOVER'
                      ? 'text-[#0a66c2] font-bold bg-blue-50/60'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Find Jobs</span>
                </button>
                <button
                  onClick={() => onNavTabChange('APPLICATIONS')}
                  className={`min-h-[40px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeNavTab === 'APPLICATIONS'
                      ? 'text-[#0a66c2] font-bold bg-blue-50/60'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Applications ({applicationsCount})</span>
                </button>
                <button
                  onClick={() => onNavTabChange('SAVED')}
                  className={`min-h-[40px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeNavTab === 'SAVED'
                      ? 'text-[#0a66c2] font-bold bg-blue-50/60'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Saved ({savedJobsCount})</span>
                </button>
              </>
            )}
            {currentRole === 'RECRUITER' && (
              <span className="text-slate-500 text-xs pl-2 font-medium">
                Recruitment ATS & Pipeline Console
              </span>
            )}
            {currentRole === 'ADMIN' && (
              <span className="text-slate-500 text-xs pl-2 font-medium">
                Corporate Governance & Compliance Console
              </span>
            )}
          </nav>
        </div>

        {/* Right Section: Persona Switcher, Notifications, Actions */}
        <div className="w-full xl:w-auto flex flex-wrap items-center justify-between xl:justify-end gap-1.5 sm:gap-2">
          {/* Persona Switcher Tabs with 40px touch targets */}
          <div id="tour-personas" className="flex items-center justify-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs">
            <span className="hidden md:inline text-slate-500 text-[11px] px-2 font-medium select-none">
              Role:
            </span>
            
            <button
              id="tab-seeker"
              onClick={() => onRoleChange('CANDIDATE')}
              className={`btn-press min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all ${
                currentRole === 'CANDIDATE'
                  ? 'font-bold bg-white text-[#0a66c2] shadow-xs border border-slate-200/80'
                  : 'font-medium text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${currentRole === 'CANDIDATE' ? 'bg-[#0a66c2]' : 'bg-slate-400'}`} />
              <span>{seekerLabel}</span>
              <span className="hidden sm:inline text-slate-400 font-normal"> (Seeker)</span>
            </button>
            
            <button
              id="tab-recruiter"
              onClick={() => onRoleChange('RECRUITER')}
              className={`btn-press min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all ${
                currentRole === 'RECRUITER'
                  ? 'font-bold bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'font-medium text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${currentRole === 'RECRUITER' ? 'bg-amber-600' : 'bg-slate-400'}`} />
              <span>{recruiterLabel}</span>
              <span className="hidden sm:inline text-slate-400 font-normal"> (Recruiter)</span>
            </button>
            
            <button
              id="tab-admin"
              onClick={() => onRoleChange('ADMIN')}
              className={`btn-press min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all ${
                currentRole === 'ADMIN'
                  ? 'font-bold bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'font-medium text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${currentRole === 'ADMIN' ? 'bg-purple-600' : 'bg-slate-400'}`} />
              <span>{adminLabel}</span>
              <span className="hidden sm:inline text-slate-400 font-normal"> (Admin)</span>
            </button>
          </div>

          {/* Activity Notifications */}
          <NotificationCenter />

          {/* Edit Profile (Candidate Only) */}
          {currentRole === 'CANDIDATE' && onOpenProfile && (
            <button
              id="btn-open-profile"
              onClick={onOpenProfile}
              className="btn-press min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-2xs shrink-0"
              title="Edit Profile, Skills & Resume"
            >
              <UserCheck className="w-4 h-4 text-[#0a66c2]" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          )}

          {/* Naukri-style "For Employers / Post a Job" Button */}
          {onOpenPostJob && (
            <button
              onClick={onOpenPostJob}
              className="hidden lg:flex btn-press min-h-[40px] items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-2xs shrink-0"
              title="Post an opening on TalentGrid India"
            >
              <PlusCircle className="w-4 h-4 text-[#0a66c2]" />
              <span>Post a Job</span>
            </button>
          )}

          {/* Register & CV Actions */}
          <button
            id="btn-open-register"
            onClick={onOpenRegister}
            className="btn-press min-h-[40px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0a66c2] hover:bg-blue-700 text-white text-xs font-bold shadow-xs shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>

          <button
            id="btn-open-resume-desktop"
            onClick={onOpenResume}
            className="hidden sm:flex btn-press min-h-[40px] items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-2xs shrink-0"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>CV</span>
          </button>
        </div>

      </div>
    </header>
  );
}
