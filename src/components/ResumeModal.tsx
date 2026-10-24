'use client';

import React from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { useToast } from './Toast';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: {
    name: string;
    email: string;
    title?: string;
    skills?: string[];
    experience?: number;
    location?: string;
  };
}

export function ResumeModal({ isOpen, onClose, candidate }: ResumeModalProps) {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const candidateName = candidate?.name || 'Rohan Sharma';
  const candidateEmail = candidate?.email || 'rohan.sharma.dev@example.com';
  const candidateTitle = candidate?.title || 'Senior Backend Systems Engineer';
  const candidateLocation = candidate?.location || 'Bengaluru, India';
  const candidateSkills =
    candidate?.skills && candidate.skills.length > 0
      ? candidate.skills.join(', ')
      : 'Java 21, Spring Boot 3, PostgreSQL, Docker, Microservices, REST APIs, Redis, Next.js, Apache Kafka';

  const handlePrint = () => {
    showToast('Opening print dialog for verified resume export...', 'info');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6"
    >
      <div className="modal-enter bg-white border border-slate-300 max-w-2xl w-full rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto custom-scroll">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 id="resume-modal-title" className="text-sm sm:text-base font-bold text-slate-900">
              {candidateName} — Verified Engineering Resume
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Auto-Generated Profile Document (Ready for Print / PDF Export)
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close resume preview"
            className="text-slate-400 hover:text-slate-700 min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Surface */}
        <div
          id="printable-cv"
          className="bg-white text-slate-900 p-4 sm:p-6 rounded-xl border border-slate-200 text-xs space-y-4 shadow-2xs"
        >
          {/* Candidate Profile Header with Non-Colliding Responsive Verification Badge */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 uppercase break-words">
                {candidateName}
              </h1>
              <p className="text-slate-700 font-semibold text-xs sm:text-sm">
                {candidateTitle} • {candidateLocation}
              </p>
              <p className="text-slate-500 text-[11px] break-all sm:break-normal">
                {candidateEmail} • +91 98765 43210
              </p>
            </div>

            {/* TALENTGRID VERIFIED BADGE — FIXED PLACEMENT WITHOUT COLLISION */}
            <div className="self-start sm:self-auto shrink-0 pt-0.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[10px] font-bold text-emerald-800 tracking-wider uppercase shadow-2xs whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                TALENTGRID VERIFIED
              </span>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
              Core Tech Stack
            </h2>
            <p className="text-slate-700 leading-relaxed font-medium">
              {candidateSkills}
            </p>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Professional Experience
            </h2>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 font-bold text-slate-900">
                  <span className="text-xs sm:text-sm">TechLabs India — SDE-2</span>
                  <span className="text-slate-500 font-normal text-[11px] shrink-0">
                    2023 - Present (Bengaluru)
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Architected order dispatch engine handling 45K daily orders using Spring Boot 3 & PostgreSQL with 99.98% uptime. Optimized indexing and connection pooling to reduce p99 query latency from 85ms to 24ms.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 font-bold text-slate-900">
                  <span className="text-xs sm:text-sm">Vanguard Systems — Associate Software Engineer</span>
                  <span className="text-slate-500 font-normal text-[11px] shrink-0">
                    2021 - 2023 (Pune)
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Developed RESTful microservices for customer data ingestion and refactored legacy SQL stored procedures, reducing batch runtimes by 34%.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
              Education
            </h2>
            <p className="text-slate-700 font-medium">
              B.Tech in Computer Science & Engineering (8.7 CGPA)
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="btn-press px-4 py-2 min-h-[40px] rounded-lg bg-slate-100 text-xs text-slate-700 hover:bg-slate-200 font-semibold"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="btn-press px-4 py-2 min-h-[40px] rounded-lg bg-slate-900 text-xs text-white font-bold hover:bg-slate-800 shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}