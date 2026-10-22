'use client';

import React from 'react';
import { FileText, UserPlus } from 'lucide-react';

export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onOpenResume: () => void;
  onOpenRegister: () => void;
  customCandidateName?: string;
  customRecruiterName?: string;
  customAdminName?: string;
}

export function Navbar({
  currentRole,
  onRoleChange,
  onOpenResume,
  onOpenRegister,
  customCandidateName,
  customRecruiterName,
  customAdminName,
}: NavbarProps) {
  const seekerLabel = customCandidateName ? customCandidateName.split(' ')[0] : 'Rohan';
  const recruiterLabel = customRecruiterName ? customRecruiterName.split(' ')[0] : 'Neha';
  const adminLabel = customAdminName ? customAdminName.split(' ')[0] : 'Rajesh';

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 px-3 sm:px-8 py-2.5 sm:py-3 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Brand & Main Links */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-xs shrink-0">
              TG
            </div>
            <div>
              <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight block">TalentGrid India</span>
              <span className="text-[10px] text-slate-500 block -mt-0.5">Engineering Careers</span>
            </div>
          </div>

          {/* Mobile Right Controls: Register + CV */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            <button
              id="btn-open-register-mobile"
              onClick={onOpenRegister}
              className="btn-press flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-xs min-h-[36px]"
            >
              <UserPlus className="w-3 h-3" />
              <span>Register</span>
            </button>
            <button
              id="btn-open-resume-mobile"
              onClick={onOpenResume}
              className="btn-press flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-300 min-h-[36px]"
            >
              <FileText className="w-3 h-3" />
              <span>CV</span>
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-slate-200 text-xs font-medium text-slate-600">
            {currentRole === 'CANDIDATE' && (
              <>
                <button className="px-2.5 py-1 text-slate-900 font-semibold rounded-md">Find Openings</button>
                <button className="px-2.5 py-1 text-slate-600 hover:text-slate-900 rounded-md transition-colors">Applications (1)</button>
                <button className="px-2.5 py-1 text-slate-600 hover:text-slate-900 rounded-md transition-colors">Saved (2)</button>
              </>
            )}
            {currentRole === 'RECRUITER' && (
              <>
                <button className="px-2.5 py-1 text-slate-900 font-semibold rounded-md">Active Postings (3)</button>
                <button className="px-2.5 py-1 text-slate-600 hover:text-slate-900 rounded-md transition-colors">Pipeline (14)</button>
                <button className="px-2.5 py-1 text-slate-600 hover:text-slate-900 rounded-md transition-colors">Interviews (2)</button>
              </>
            )}
            {currentRole === 'ADMIN' && (
              <>
                <button className="px-2.5 py-1 text-slate-900 font-semibold rounded-md">Recruiter Approvals (2)</button>
                <button className="px-2.5 py-1 text-slate-600 hover:text-slate-900 rounded-md transition-colors">User Accounts</button>
                <button className="px-2.5 py-1 text-slate-600 hover:text-slate-900 rounded-md transition-colors">Audit Logs</button>
              </>
            )}
          </nav>
        </div>

        {/* PERSONA SWITCHER & ACTIONS: RESPONSIVE CONTROLS */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2">
          <div className="w-full sm:w-auto flex items-center justify-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs">
            <span className="hidden xl:inline text-slate-500 text-[11px] px-2 font-medium select-none">
              Viewing as:
            </span>
            
            <button
              id="tab-seeker"
              onClick={() => onRoleChange('CANDIDATE')}
              className={`btn-press flex-1 sm:flex-none px-2 sm:px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all ${
                currentRole === 'CANDIDATE'
                  ? 'font-semibold bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'font-medium text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${currentRole === 'CANDIDATE' ? 'bg-blue-600' : 'bg-slate-400'}`} />
              <span>{seekerLabel}</span>
              <span className="hidden xl:inline text-slate-400 font-normal"> (Seeker)</span>
            </button>
            
            <button
              id="tab-recruiter"
              onClick={() => onRoleChange('RECRUITER')}
              className={`btn-press flex-1 sm:flex-none px-2 sm:px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all ${
                currentRole === 'RECRUITER'
                  ? 'font-semibold bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'font-medium text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${currentRole === 'RECRUITER' ? 'bg-amber-600' : 'bg-slate-400'}`} />
              <span>{recruiterLabel}</span>
              <span className="hidden xl:inline text-slate-400 font-normal"> (Recruiter)</span>
            </button>
            
            <button
              id="tab-admin"
              onClick={() => onRoleChange('ADMIN')}
              className={`btn-press flex-1 sm:flex-none px-2 sm:px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all ${
                currentRole === 'ADMIN'
                  ? 'font-semibold bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'font-medium text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${currentRole === 'ADMIN' ? 'bg-purple-600' : 'bg-slate-400'}`} />
              <span>{adminLabel}</span>
              <span className="hidden xl:inline text-slate-400 font-normal"> (Admin)</span>
            </button>
          </div>

          {/* Desktop Right Buttons: Register + Verified CV */}
          <button
            id="btn-open-register"
            onClick={onOpenRegister}
            className="hidden sm:flex btn-press items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs shrink-0 min-h-[34px]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>

          <button
            id="btn-open-resume-desktop"
            onClick={onOpenResume}
            className="hidden sm:flex btn-press items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-2xs shrink-0 min-h-[34px]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Verified CV</span>
          </button>
        </div>

      </div>
    </header>
  );
}