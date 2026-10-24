'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Building2, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { registerUser, RegisterInput } from '@/app/actions';
import { useToast } from './Toast';

export type RegisteredRole = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export interface RegisteredUserResult {
  id: string;
  name: string;
  email: string;
  role: RegisteredRole;
  title?: string;
  skills?: string[];
  location?: string;
  companyId?: string | null;
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (
    user: RegisteredUserResult,
    company?: {
      id: string;
      name: string;
      location: string;
      gstin: string | null;
      verified: boolean;
      logo: string | null;
    }
  ) => void;
}

export function RegisterModal({ isOpen, onClose, onSuccess }: RegisterModalProps) {
  const [selectedRole, setSelectedRole] = useState<RegisteredRole>('CANDIDATE');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Candidate fields
  const [title, setTitle] = useState('Frontend Engineer');
  const [experience, setExperience] = useState('3.0');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [skillsRaw, setSkillsRaw] = useState('React, TypeScript, Next.js, Node.js, Tailwind CSS');

  // Recruiter fields
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('Bengaluru, Karnataka');
  const [gstin, setGstin] = useState('29AABCR1234F1Z5');

  // Admin fields
  const [adminKey, setAdminKey] = useState('TG-ADMIN-2026');

  const { showToast } = useToast();

  // Close on ESC key
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

  const parsedSkills = skillsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, and Password).');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (selectedRole === 'RECRUITER' && !companyName.trim()) {
      setErrorMsg('Company Name is required for Recruiter registration.');
      return;
    }

    if (selectedRole === 'ADMIN' && adminKey.trim() !== 'TG-ADMIN-2026') {
      setErrorMsg("Invalid Admin Authorization Key. Use 'TG-ADMIN-2026' to proceed.");
      return;
    }

    setLoading(true);

    try {
      const inputPayload: RegisterInput = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: selectedRole,
        ...(selectedRole === 'CANDIDATE' && {
          title: title.trim(),
          skills: parsedSkills,
          experience: parseFloat(experience) || 2.0,
          location: location.trim(),
        }),
        ...(selectedRole === 'RECRUITER' && {
          companyName: companyName.trim(),
          companyLocation: companyLocation.trim(),
          gstin: gstin.trim(),
        }),
        ...(selectedRole === 'ADMIN' && {
          adminKey: adminKey.trim(),
        }),
      };

      const result = await registerUser(inputPayload);

      if (result.success && result.user) {
        showToast(
          `Welcome to TalentGrid, ${result.user.name}! Registered as ${selectedRole}.`,
          'success'
        );
        onSuccess(result.user as RegisteredUserResult, result.company);
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please check inputs.';
      setErrorMsg(msg);
      showToast(msg, 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6"
    >
      <div className="modal-enter bg-white border border-slate-300 max-w-xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 id="register-modal-title" className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Create TalentGrid Account
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Self-service registration portal for all three platform roles
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Segmented Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-100/60">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
            Select Your Platform Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Candidate Tab */}
            <button
              id="modal-tab-candidate"
              type="button"
              onClick={() => {
                setSelectedRole('CANDIDATE');
                setErrorMsg(null);
              }}
              className={`btn-press flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                selectedRole === 'CANDIDATE'
                  ? 'bg-white border-blue-500 shadow-xs ring-2 ring-blue-500/20 text-slate-900'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 ${
                  selectedRole === 'CANDIDATE' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-tight">Job Seeker</span>
              <span className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">Candidate</span>
            </button>

            {/* Recruiter Tab */}
            <button
              id="modal-tab-recruiter"
              type="button"
              onClick={() => {
                setSelectedRole('RECRUITER');
                setErrorMsg(null);
              }}
              className={`btn-press flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                selectedRole === 'RECRUITER'
                  ? 'bg-white border-amber-500 shadow-xs ring-2 ring-amber-500/20 text-slate-900'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 ${
                  selectedRole === 'RECRUITER' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-tight">Recruiter</span>
              <span className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">Enterprise</span>
            </button>

            {/* Admin Tab */}
            <button
              id="modal-tab-admin"
              type="button"
              onClick={() => {
                setSelectedRole('ADMIN');
                setErrorMsg(null);
              }}
              className={`btn-press flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-white border-purple-500 shadow-xs ring-2 ring-purple-500/20 text-slate-900'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 ${
                  selectedRole === 'ADMIN' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-tight">Super Admin</span>
              <span className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">Governance</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] font-medium leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Common Account Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="reg-name" className="block text-slate-700 font-bold mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  selectedRole === 'CANDIDATE'
                    ? 'e.g. Ananya Deshmukh'
                    : selectedRole === 'RECRUITER'
                    ? 'e.g. Vikram Malhotra'
                    : 'e.g. Kavita Rao'
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-slate-700 font-bold mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === 'CANDIDATE'
                    ? 'ananya.dev@example.com'
                    : selectedRole === 'RECRUITER'
                    ? 'vikram@finwave.in'
                    : 'kavita.admin@talentgrid.in'
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-slate-700 font-bold mb-1">
              Account Password <span className="text-rose-500">*</span>
            </label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters (hashed with BCrypt)"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          {/* CANDIDATE SPECIFIC FIELDS */}
          {selectedRole === 'CANDIDATE' && (
            <div className="space-y-3.5 pt-2 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="reg-candidate-title" className="block text-slate-700 font-bold mb-1">Target Role / Title</label>
                  <input
                    id="reg-candidate-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="reg-candidate-experience" className="block text-slate-700 font-bold mb-1">Exp. (Years)</label>
                    <input
                      id="reg-candidate-experience"
                      type="number"
                      step="0.5"
                      min="0"
                      max="30"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10 mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-candidate-location" className="block text-slate-700 font-bold mb-1">Base Hub</label>
                    <input
                      id="reg-candidate-location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="reg-candidate-skills" className="block text-slate-700 font-bold mb-1">
                  Core Skills <span className="font-normal text-slate-500">(Comma-separated for Jaccard matching)</span>
                </label>
                <input
                  id="reg-candidate-skills"
                  type="text"
                  value={skillsRaw}
                  onChange={(e) => setSkillsRaw(e.target.value)}
                  placeholder="e.g. React, TypeScript, Next.js, Docker, Java"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {parsedSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RECRUITER SPECIFIC FIELDS */}
          {selectedRole === 'RECRUITER' && (
            <div className="space-y-3.5 pt-2 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="reg-recruiter-company" className="block text-slate-700 font-bold mb-1">
                    Company / Employer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-recruiter-company"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Razorpay Software Pvt Ltd"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <div>
                  <label htmlFor="reg-recruiter-location" className="block text-slate-700 font-bold mb-1">Corporate HQ / Location</label>
                  <input
                    id="reg-recruiter-location"
                    type="text"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-recruiter-gstin" className="block text-slate-700 font-bold mb-1">
                  Statutory GSTIN Number <span className="font-normal text-slate-500">(15-character format)</span>
                </label>
                <input
                  id="reg-recruiter-gstin"
                  type="text"
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="29AABCR1234F1Z5"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10 uppercase"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Compliance Protocol:</strong> Corporate accounts are automatically enrolled in{' '}
                  <span className="font-semibold underline">KYC Pending</span> state until verified by a Platform
                  Governance Administrator.
                </span>
              </div>
            </div>
          )}

          {/* ADMIN SPECIFIC FIELDS */}
          {selectedRole === 'ADMIN' && (
            <div className="space-y-3.5 pt-2 border-t border-slate-200">
              <div>
                <label htmlFor="reg-admin-key" className="block text-slate-700 font-bold mb-1">
                  Platform Security Passkey <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg-admin-key"
                  type="text"
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Authorization Passkey"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Authorizes elevated Super Admin privileges. Default passkey: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold">TG-ADMIN-2026</code>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[11px] leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Audit Log Mandate:</strong> All Super Admin actions (KYC corporate approvals, pipeline
                  supervision, role provisioning) are timestamped and cryptographically logged.
                </span>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-press px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-registration"
              type="submit"
              disabled={loading}
              className={`btn-press px-5 py-2.5 min-h-[44px] rounded-xl text-white font-bold shadow-xs flex items-center gap-2 transition-all ${
                selectedRole === 'CANDIDATE'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : selectedRole === 'RECRUITER'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-purple-700 hover:bg-purple-800'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Complete {selectedRole === 'CANDIDATE' ? 'Job Seeker' : selectedRole === 'RECRUITER' ? 'Recruiter' : 'Admin'} Registration</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}