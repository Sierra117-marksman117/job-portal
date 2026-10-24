'use client';

import React from 'react';
import { Briefcase, FileText, UserPlus, GraduationCap, UserCheck, Bookmark, ClipboardList, PlusCircle } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onOpenResume: () => void;
  onOpenRegister: () => void;
  onOpenProfile?: () => void;
  onOpenViva?: () => void;
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
    <header className="border-b border-slate-200/90 bg-white sticky top-0 z-40 px-3 sm:px-6 py-2 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Brand & Main Links */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-3 sm:gap-5">
          <div className="flex items-center gap-2.5">
            {/* LinkedIn/Naukri styled brand emblem */}
            <div className="w-8 h-8 rounded-lg bg-[#0a66c2] text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-xs shrink-0">
              TG
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-sm tracking-tight block">
                  TalentGrid India
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-blue-50 text-[#0a66c2] text-[9px] font-bold uppercase tracking-wider border border-blue-200">
                  Tech Careers
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block -mt-0.5 font-medium">
                Naukri • Indeed • LinkedIn Standards
              </span>
            </div>
          </div>

          {/* Academic Viva Button (Tarun's Rubric) */}
          {onOpenViva && (
            <button
              onClick={onOpenViva}
              className="btn-press flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-2xs transition-colors shrink-0"
              title="Open Academic Viva Dossier & OOP Architecture"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
              <span>Viva & OOPs</span>
            </button>
          )}

          {/* Navigation Links per Role (LinkedIn/Naukri Tab Icons) */}
          <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-slate-200 text-xs font-medium text-slate-600">
            {currentRole === 'CANDIDATE' && onNavTabChange && (
              <>
                <button
                  onClick={() => onNavTabChange('DISCOVER')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
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
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
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
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
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
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-1.5 sm:gap-2">
          {/* Persona Switcher Tabs */}
          <div className="w-full sm:w-auto flex items-center justify-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs">
            <span className="hidden xl:inline text-slate-500 text-[11px] px-2 font-medium select-none">
              Role:
            </span>
            
            <button
              id="tab-seeker"
              onClick={() => onRoleChange('CANDIDATE')}
              className={`btn-press flex-1 sm:flex-none px-2 sm:px-3 py-1 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all ${
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
              className={`btn-press flex-1 sm:flex-none px-2 sm:px-3 py-1 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all ${
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
              className={`btn-press flex-1 sm:flex-none px-2 sm:px-3 py-1 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all ${
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
              className="btn-press flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-2xs shrink-0 min-h-[34px]"
              title="Edit Profile, Skills & Resume"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#0a66c2]" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          )}

          {/* Naukri-style "For Employers / Post a Job" Button */}
          {onOpenPostJob && (
            <button
              onClick={onOpenPostJob}
              className="hidden sm:flex btn-press items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-2xs shrink-0 min-h-[34px]"
              title="Post an opening on TalentGrid India"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#0a66c2]" />
              <span>Post a Job</span>
            </button>
          )}

          {/* Register & CV Actions */}
          <button
            id="btn-open-register"
            onClick={onOpenRegister}
            className="hidden sm:flex btn-press items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a66c2] hover:bg-blue-700 text-white text-xs font-bold shadow-xs shrink-0 min-h-[34px]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>

          <button
            id="btn-open-resume-desktop"
            onClick={onOpenResume}
            className="hidden sm:flex btn-press items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-2xs shrink-0 min-h-[34px]"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>CV</span>
          </button>
        </div>

      </div>
    </header>
  );
}
