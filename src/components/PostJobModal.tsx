'use client';

import React, { useState, useEffect } from 'react';
import { X, Briefcase, Plus, Tag, CheckCircle2 } from 'lucide-react';
import { createJobRequisition } from '@/app/actions';
import { useToast } from './Toast';
import { JobItem } from './JobCard';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (newJob: JobItem) => void;
  recruiterCompanyName?: string;
}

const PRESET_SKILLS = [
  'Java 21',
  'Spring Boot 3',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'Next.js',
  'TypeScript',
  'Redis',
  'Kafka',
  'AWS',
  'REST APIs',
  'Microservices',
];

export function PostJobModal({
  isOpen,
  onClose,
  onJobCreated,
  recruiterCompanyName = 'FinWave Technologies',
}: PostJobModalProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Bengaluru, Karnataka (Hybrid)');
  const [ctcMin, setCtcMin] = useState<number>(20.0);
  const [ctcMax, setCtcMax] = useState<number>(28.0);
  const [experienceYears, setExperienceYears] = useState('3.0 - 5.0 Years');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>(['Java 21', 'Spring Boot 3', 'PostgreSQL']);
  const [customSkillInput, setCustomSkillInput] = useState('');
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

  if (!isOpen) return null;

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills([...skills, trimmed]);
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (skills.length === 0) {
      showToast('Please specify at least 1 required skill.', 'warning');
      return;
    }
    if (ctcMin > ctcMax) {
      showToast('Minimum CTC cannot exceed Maximum CTC.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await createJobRequisition({
        title,
        description: description || `Join ${recruiterCompanyName} as ${title}. Work on high-performance mission-critical distributed systems.`,
        location,
        ctcMin: Number(ctcMin),
        ctcMax: Number(ctcMax),
        experienceYears,
        requiredSkills: skills,
        companyName: recruiterCompanyName,
      });

      if (res.success && res.job) {
        showToast(`Position '${title}' published successfully!`, 'success');
        onJobCreated({
          ...res.job,
          fit: {
            score: 85,
            matched: skills.slice(0, 2),
            gaps: skills.slice(2),
          },
        });
        onClose();
      }
    } catch {
      showToast('Failed to publish job opening. Please try again.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
        role="dialog"
        aria-labelledby="post-job-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 id="post-job-modal-title" className="text-base font-bold text-slate-900">
                Post New Engineering Requisition
              </h2>
              <p className="text-xs text-slate-500">
                Entity: <span className="font-semibold text-slate-700">{recruiterCompanyName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Title */}
          <div>
            <label htmlFor="job-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Job Title *
            </label>
            <input
              id="job-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lead SRE & Platform Engineer"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          {/* Location & Experience Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="job-location" className="block text-xs font-semibold text-slate-700 mb-1">
                Location & Mode
              </label>
              <select
                id="job-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="Bengaluru, Karnataka (Hybrid)">Bengaluru, Karnataka (Hybrid)</option>
                <option value="Cyber City, Gurugram (On-site)">Cyber City, Gurugram (On-site)</option>
                <option value="Kalyani Nagar, Pune (Remote-First)">Kalyani Nagar, Pune (Remote-First)</option>
                <option value="HITEC City, Hyderabad (Hybrid)">HITEC City, Hyderabad (Hybrid)</option>
                <option value="Pan-India (100% Remote)">Pan-India (100% Remote)</option>
              </select>
            </div>

            <div>
              <label htmlFor="job-experience" className="block text-xs font-semibold text-slate-700 mb-1">
                Experience Band
              </label>
              <select
                id="job-experience"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="1.0 - 3.0 Years">1.0 - 3.0 Years (SDE-1)</option>
                <option value="3.0 - 5.0 Years">3.0 - 5.0 Years (SDE-2)</option>
                <option value="5.0 - 8.0 Years">5.0 - 8.0 Years (Senior / Lead)</option>
                <option value="8.0+ Years">8.0+ Years (Principal / Staff)</option>
              </select>
            </div>
          </div>

          {/* Compensation CTC Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ctc-min" className="block text-xs font-semibold text-slate-700 mb-1">
                Min CTC (₹ LPA) *
              </label>
              <input
                id="ctc-min"
                type="number"
                step="0.5"
                min="3"
                max="100"
                required
                value={ctcMin}
                onChange={(e) => setCtcMin(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 mono focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div>
              <label htmlFor="ctc-max" className="block text-xs font-semibold text-slate-700 mb-1">
                Max CTC (₹ LPA) *
              </label>
              <input
                id="ctc-max"
                type="number"
                step="0.5"
                min="3"
                max="120"
                required
                value={ctcMax}
                onChange={(e) => setCtcMax(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 mono focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          {/* Required Skills Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Technical Stack & Qualifications ({skills.length})
            </label>
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg border border-slate-300 bg-slate-50/60 min-h-[44px]">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px] font-medium shadow-2xs"
                >
                  <Tag className="w-2.5 h-2.5 text-slate-400" />
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-600 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Skill Presets */}
            <div className="mt-2 flex flex-wrap gap-1 items-center">
              <span className="text-[10px] text-slate-400 font-medium">Add Quick:</span>
              {PRESET_SKILLS.filter((s) => !skills.includes(s))
                .slice(0, 6)
                .map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddSkill(preset)}
                    className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 font-medium transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
            </div>

            {/* Custom Skill Input */}
            <div className="mt-2 flex gap-1.5">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(customSkillInput);
                  }
                }}
                placeholder="Type custom skill & press enter..."
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(customSkillInput)}
                className="btn-press px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="job-desc" className="block text-xs font-semibold text-slate-700 mb-1">
              Role Scope & Deliverables
            </label>
            <textarea
              id="job-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail key responsibilities, concurrency targets, and architecture expectations..."
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
            />
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
              className="btn-press px-5 py-2 min-h-[40px] rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors text-xs flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{loading ? 'Publishing Requisition...' : 'Publish to TalentGrid'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
