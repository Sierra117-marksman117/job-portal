'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, FileText, CheckCircle2 } from 'lucide-react';
import { scheduleCandidateInterview } from '@/app/actions';
import { useToast } from './Toast';
import { ApplicationItem } from './RecruiterPipeline';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationItem | null;
  onSuccess: (updatedApp: ApplicationItem) => void;
}

export function ScheduleInterviewModal({
  isOpen,
  onClose,
  application,
  onSuccess,
}: ScheduleInterviewModalProps) {
  const { showToast } = useToast();
  const [date, setDate] = useState('2026-10-28');
  const [slot, setSlot] = useState('11:00 AM - 11:45 AM IST');
  const [round, setRound] = useState('Technical Round 1: Core Systems & Concurrency');
  const [link, setLink] = useState('https://meet.google.com/tg-finwave-eng');
  const [notes, setNotes] = useState('Please review candidate Java 21 and distributed database questions.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !application) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await scheduleCandidateInterview({
        applicationId: application.id,
        date,
        slot,
        round,
        link,
        candidateName: application.candidate.name,
        jobTitle: application.job.title,
      });

      if (res.success) {
        showToast(
          `Interview scheduled with ${application.candidate.name} for ${date} (${slot})!`,
          'success'
        );
        onSuccess({
          ...application,
          status: 'INTERVIEW_SCHEDULED',
          interviewDate: date,
          interviewSlot: slot,
          interviewRound: round,
          interviewLink: link,
        });
        onClose();
      }
    } catch {
      showToast('Error scheduling interview. Please try again.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
        role="dialog"
        aria-labelledby="schedule-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 id="schedule-modal-title" className="text-base font-bold text-slate-900">
                Schedule Interview Slot
              </h2>
              <p className="text-xs text-slate-500">
                Candidate: <span className="font-semibold text-slate-700">{application.candidate.name}</span> • {application.job.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Candidate Snapshot Card */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block text-xs">{application.candidate.name}</span>
              <span className="text-[11px] text-slate-500">{application.candidate.title || 'Software Engineer'} • {application.candidate.location || 'India'}</span>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] mono">
                {application.matchScore}% Match
              </span>
            </div>
          </div>

          {/* Date & Time Slot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="interview-date" className="block text-xs font-semibold text-slate-700 mb-1">
                Interview Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="interview-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="interview-slot" className="block text-xs font-semibold text-slate-700 mb-1">
                Time Slot (IST)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select
                  id="interview-slot"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="10:00 AM - 10:45 AM IST">10:00 AM - 10:45 AM IST</option>
                  <option value="11:00 AM - 11:45 AM IST">11:00 AM - 11:45 AM IST</option>
                  <option value="02:00 PM - 02:45 PM IST">02:00 PM - 02:45 PM IST</option>
                  <option value="03:30 PM - 04:15 PM IST">03:30 PM - 04:15 PM IST</option>
                  <option value="05:00 PM - 05:45 PM IST">05:00 PM - 05:45 PM IST</option>
                </select>
              </div>
            </div>
          </div>

          {/* Round Selector */}
          <div>
            <label htmlFor="interview-round" className="block text-xs font-semibold text-slate-700 mb-1">
              Interview Evaluation Round
            </label>
            <select
              id="interview-round"
              value={round}
              onChange={(e) => setRound(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="Technical Round 1: Core Systems & Concurrency">Technical Round 1: Core Systems & Concurrency</option>
              <option value="Technical Round 2: Distributed Architecture & Databases">Technical Round 2: Distributed Architecture & Databases</option>
              <option value="System Design & Low-Level Design (LLD)">System Design & Low-Level Design (LLD)</option>
              <option value="Leadership & Cultural Alignment">Leadership & Cultural Alignment</option>
              <option value="Director Final Bar-Raiser Round">Director Final Bar-Raiser Round</option>
            </select>
          </div>

          {/* Meeting Link */}
          <div>
            <label htmlFor="interview-link" className="block text-xs font-semibold text-slate-700 mb-1">
              Virtual Meeting Link (Google Meet / Zoom)
            </label>
            <div className="relative">
              <Video className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="interview-link"
                type="url"
                required
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
                placeholder="https://meet.google.com/tg-..."
              />
            </div>
          </div>

          {/* Interviewer Notes */}
          <div>
            <label htmlFor="interview-notes" className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Evaluation Notes & Directives
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <textarea
                id="interview-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
                placeholder="Focus on candidate's Spring Boot and PostgreSQL indexing knowledge..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-press px-4 py-2 min-h-[40px] rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-press px-5 py-2 min-h-[40px] rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors text-xs flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Confirming...' : 'Dispatch Calendar Invite'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
