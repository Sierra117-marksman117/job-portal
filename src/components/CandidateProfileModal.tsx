'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, User, Tag, Upload, FileCheck, Plus, CheckCircle2 } from 'lucide-react';
import { useToast } from './Toast';

export interface CandidateProfile {
  name: string;
  email: string;
  title: string;
  skills: string[];
  experience: number;
  location: string;
  bio?: string;
  resumeFileName?: string;
}

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateProfile;
  onSave: (updatedProfile: CandidateProfile) => void;
}

const POPULAR_SKILLS = [
  'Java 21',
  'Spring Boot 3',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'Next.js',
  'TypeScript',
  'Redis',
  'Kafka',
  'REST APIs',
  'Go',
  'Python',
  'Microservices',
  'AWS',
  'Terraform',
];

export function CandidateProfileModal({
  isOpen,
  onClose,
  candidate,
  onSave,
}: CandidateProfileModalProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(candidate.name);
  const [title, setTitle] = useState(candidate.title);
  const [experience, setExperience] = useState<number>(candidate.experience || 3.5);
  const [location, setLocation] = useState(candidate.location || 'Bengaluru, India');
  const [bio, setBio] = useState(candidate.bio || 'Senior backend systems engineer with 3.5+ years building distributed Java microservices and high-throughput transaction pipelines.');
  const [skills, setSkills] = useState<string[]>(candidate.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [resumeFileName, setResumeFileName] = useState<string>(candidate.resumeFileName || 'Rohan_Sharma_Verified_CV_2026.pdf');
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills([...skills, trimmed]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Resume file size must be less than 5 MB.', 'warning');
        return;
      }
      setResumeFileName(file.name);
      setUploadSuccess(true);
      showToast(`Resume '${file.name}' parsed and verified successfully!`, 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skills.length === 0) {
      showToast('Please specify at least 1 technical skill.', 'warning');
      return;
    }

    const updated: CandidateProfile = {
      ...candidate,
      name,
      title,
      experience: Number(experience),
      location,
      bio,
      skills,
      resumeFileName,
    };

    onSave(updated);
    showToast(`Profile updated! Skill compatibility quotient recalculated.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
        role="dialog"
        aria-labelledby="profile-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 id="profile-modal-title" className="text-base font-bold text-slate-900">
                Candidate Profile & Qualifications
              </h2>
              <p className="text-xs text-slate-500">
                Edit profile to re-score matching algorithms across all active requisitions
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
          {/* Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="cand-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name *
              </label>
              <input
                id="cand-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div>
              <label htmlFor="cand-title" className="block text-xs font-semibold text-slate-700 mb-1">
                Current Professional Title *
              </label>
              <input
                id="cand-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          {/* Location & Experience */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cand-loc" className="block text-xs font-semibold text-slate-700 mb-1">
                Base Location
              </label>
              <input
                id="cand-loc"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div>
              <label htmlFor="cand-exp" className="block text-xs font-semibold text-slate-700 mb-1">
                Experience (Years) *
              </label>
              <input
                id="cand-exp"
                type="number"
                step="0.5"
                min="0"
                max="30"
                required
                value={experience}
                onChange={(e) => setExperience(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 mono focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Technical Skill Stack ({skills.length} verified skills)
            </label>
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg border border-slate-300 bg-slate-50/60 min-h-[44px]">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px] font-medium shadow-2xs"
                >
                  <Tag className="w-2.5 h-2.5 text-blue-500" />
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

            {/* Quick Presets */}
            <div className="mt-2 flex flex-wrap gap-1 items-center">
              <span className="text-[10px] text-slate-400 font-medium">Add Quick:</span>
              {POPULAR_SKILLS.filter((s) => !skills.includes(s))
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
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(newSkillInput);
                  }
                }}
                placeholder="Add custom skill (e.g. GraphQL, Elixir) & press Enter..."
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(newSkillInput)}
                className="btn-press px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Professional Bio */}
          <div>
            <label htmlFor="cand-bio" className="block text-xs font-semibold text-slate-700 mb-1">
              Executive Bio & Architectural Focus
            </label>
            <textarea
              id="cand-bio"
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          {/* Resume Upload Simulation Section */}
          <div className="p-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block truncate max-w-[240px]">
                  {resumeFileName}
                </span>
                <span className="text-[11px] text-slate-500">
                  {uploadSuccess ? '✓ New file validated & parsed' : 'Verified candidate resume stored'}
                </span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-press px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 text-xs flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Upload New PDF</span>
            </button>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-press px-4 py-2 min-h-[40px] rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-press px-5 py-2 min-h-[40px] rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors text-xs flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Save & Recalculate Matches</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
