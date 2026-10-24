'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  GraduationCap,
  Users,
  Search,
  CheckCircle2,
  Briefcase,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Role } from './Navbar';

export interface TourStep {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  targetSelector?: string;
  requiredRole?: Role;
  icon: React.ReactNode;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to TalentGrid India',
    badge: 'College Project & Architecture',
    badgeColor: 'bg-blue-50 text-[#0a66c2] border-blue-200',
    description:
      'TalentGrid India is a high-trust, production-grade tech recruitment platform engineered to the standards of Naukri.com, Indeed, and LinkedIn. It integrates real-time skill matching algorithms, full role-based access control (RBAC), and academic OOP system design.',
    targetSelector: '#tour-brand',
    icon: <Sparkles className="w-5 h-5 text-[#0a66c2]" />,
  },
  {
    id: 'personas',
    title: 'Tri-Role Persona Switcher (RBAC)',
    badge: 'Access Control',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description:
      'Switch between all three key platform actors instantly: Rohan Sharma (Candidate seeking SDE roles), Neha Verma (Lead Recruiter managing pipelines & scheduling interviews), and Rajesh Kumar (Super Admin handling KYC compliance & audit trails).',
    targetSelector: '#tour-personas',
    icon: <Users className="w-5 h-5 text-purple-600" />,
  },
  {
    id: 'viva',
    title: 'Academic Viva & OOPs Architecture Dossier',
    badge: 'Viva Defense Ready',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description:
      'Engineered specifically for Tarun’s college presentation! Click "Viva & OOPs" anytime to inspect UML Class Diagrams, Design Pattern implementations (Factory, Strategy, Observer), and viva defense cheat sheets for examiners.',
    targetSelector: '#tour-viva-btn',
    icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: 'search',
    title: 'Naukri & Indeed Unified Search Console',
    badge: 'Discovery Engine',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    description:
      'Filter tech openings across skills (Java 21, Spring Boot 3, Next.js), major IT hubs (Bengaluru, Gurugram, Pune, Remote), and compensation tiers (> ₹24 Lacs P.A.) with zero page reloads.',
    targetSelector: '#tour-search-bar',
    requiredRole: 'CANDIDATE',
    icon: <Search className="w-5 h-5 text-amber-600" />,
  },
  {
    id: 'matching',
    title: 'LinkedIn "How You Match" & Skill Radar',
    badge: 'Jaccard Algorithmic Fit',
    badgeColor: 'bg-blue-50 text-[#0a66c2] border-blue-200',
    description:
      'Calculates real-time skill compatibility quotient using mathematical Jaccard similarity. Notice a missing skill gap? Click "+ Add" on any missing badge to append it to your profile and watch the score recalculate live!',
    targetSelector: '#tour-skill-matrix',
    requiredRole: 'CANDIDATE',
    icon: <Zap className="w-5 h-5 text-[#0a66c2]" />,
  },
  {
    id: 'apply',
    title: '1-Click Easy Apply & ATS Lifecycle',
    badge: 'Pipeline Automation',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description:
      'Submit verified credentials instantly with one click. Then switch to the "Applications" tab to track submission status, interview rounds, and Google Meet video assessment links dispatched by recruiters.',
    targetSelector: '#tour-apply-btn',
    requiredRole: 'CANDIDATE',
    icon: <Briefcase className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: 'governance',
    title: 'Recruiter ATS & Corporate KYC Governance',
    badge: 'Enterprise Standards',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    description:
      'Explore the other roles! Toggle to Neha (Recruiter) to shortlist candidates and schedule calendar interview slots, or Rajesh (Admin) to approve corporate GSTIN KYC and review SOC-2 immutable audit trails.',
    targetSelector: '#tour-personas',
    icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
  },
];

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function GuidedTour({
  isOpen,
  onClose,
  onRoleChange,
}: GuidedTourProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  const step = TOUR_STEPS[currentStepIdx];
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === TOUR_STEPS.length - 1;

  // Sync role if step requires a specific view
  useEffect(() => {
    if (isOpen && step?.requiredRole) {
      onRoleChange(step.requiredRole);
    }
  }, [isOpen, currentStepIdx, step?.requiredRole, onRoleChange]);

  // Measure and scroll target into view
  const targetSelector = step?.targetSelector;
  const updateTargetPosition = useCallback(() => {
    if (!isOpen || !targetSelector) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(targetSelector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setTargetRect(null);
    }
  }, [isOpen, targetSelector]);

  useEffect(() => {
    if (!isOpen) return;

    // Small delay to allow role switch rendering
    const timer = setTimeout(() => {
      updateTargetPosition();
    }, 180);

    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition, true);
    };
  }, [isOpen, currentStepIdx, updateTargetPosition]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (!isLast) {
          setCurrentStepIdx((prev) => prev + 1);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        if (!isFirst) {
          setCurrentStepIdx((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFirst, isLast, onClose]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  // Determine tooltip placement based on target coordinates
  let tooltipPositionClasses = 'fixed z-50 ';
  let tooltipStyle: React.CSSProperties = {};

  if (targetRect) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    if (isMobile) {
      // Bottom sheet layout on mobile devices
      tooltipPositionClasses += 'bottom-4 left-3 right-3 max-w-[calc(100vw-24px)] mx-auto';
    } else {
      const targetCenter = targetRect.left + targetRect.width / 2;
      const targetBottom = targetRect.top + targetRect.height;
      const targetTop = targetRect.top;

      const prefersBelow = targetBottom + 280 < windowHeight;

      if (prefersBelow) {
        // Place below target
        tooltipStyle = {
          top: Math.max(16, targetBottom + 14),
          left: Math.max(16, Math.min(windowWidth - 440, targetCenter - 210)),
          width: 420,
        };
      } else {
        // Place above target
        tooltipStyle = {
          top: Math.max(16, targetTop - 290),
          left: Math.max(16, Math.min(windowWidth - 440, targetCenter - 210)),
          width: 420,
        };
      }
    }
  } else {
    // Center modal fallback
    tooltipPositionClasses += 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg w-[92vw] sm:w-[460px]';
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Semi-transparent Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Target Element Spotlight Highlight */}
      {targetRect && (
        <div
          className="fixed pointer-events-none z-50 rounded-2xl transition-all duration-300 ring-4 ring-[#0a66c2] ring-offset-4 ring-offset-slate-900/60 shadow-[0_0_40px_rgba(10,102,194,0.4)]"
          style={{
            top: Math.max(0, targetRect.top - 6),
            left: Math.max(0, targetRect.left - 6),
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
        />
      )}

      {/* Interactive Floating Tour Card */}
      <div
        className={`${tooltipPositionClasses} modal-enter bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 text-slate-900 transition-all duration-300`}
        style={tooltipStyle}
      >
        {/* Header Ribbon */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0 shadow-2xs">
              {step.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Step {currentStepIdx + 1} of {TOUR_STEPS.length}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${step.badgeColor}`}
                >
                  {step.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
                {step.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Exit guided tour"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tour Step Body */}
        <div className="py-3.5 text-xs text-slate-600 leading-relaxed font-normal">
          <p>{step.description}</p>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStepIdx(idx)}
                aria-label={`Go to step ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIdx
                    ? 'w-6 bg-[#0a66c2]'
                    : idx < currentStepIdx
                    ? 'w-2 bg-blue-300 hover:bg-blue-400'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handlePrev}
                className="btn-press px-3 py-1.5 min-h-[38px] rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="btn-press px-4 py-1.5 min-h-[38px] rounded-lg bg-[#0a66c2] hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <span>{isLast ? 'Finish Tour' : 'Next Step'}</span>
              {isLast ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Skip hint */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 font-medium">
          <span>Keyboard: Press → for Next, Esc to exit</span>
          <button
            onClick={onClose}
            className="hover:text-slate-600 underline transition-colors"
          >
            Skip walkthrough
          </button>
        </div>
      </div>
    </div>
  );
}
