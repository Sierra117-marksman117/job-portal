'use client';

import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Code2, Database, HelpCircle, Layers, Copy, Check } from 'lucide-react';
import { useToast } from './Toast';

interface VivaDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VivaDossierModal({ isOpen, onClose }: VivaDossierModalProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'OOP' | 'ERD' | 'CLASS' | 'VIVA'>('OOP');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Architecture snippet copied to clipboard!', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
        role="dialog"
        aria-labelledby="viva-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="viva-modal-title" className="text-base font-bold text-white tracking-tight">
                  Academic Viva & OOP Architecture Dossier
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  College Project Viva Guide
                </span>
              </div>
              <p className="text-xs text-slate-400">
                TalentGrid India • Object-Oriented Software Engineering & Database Design Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('OOP')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'OOP'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>OOP Principles & Patterns</span>
          </button>

          <button
            onClick={() => setActiveTab('CLASS')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'CLASS'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>UML Class Diagram</span>
          </button>

          <button
            onClick={() => setActiveTab('ERD')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ERD'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database ER Diagram</span>
          </button>

          <button
            onClick={() => setActiveTab('VIVA')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'VIVA'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">Viva Q&A Cheat Sheet</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: OOP PRINCIPLES & DESIGN PATTERNS */}
          {activeTab === 'OOP' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  1. Core Object-Oriented Principles Implemented
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  How every foundational OOP concept requested in Tarun&apos;s academic rubric is structured in production:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Inheritance */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold text-[11px]">
                      Inheritance
                    </span>
                    <span className="mono text-[10px] text-slate-400">User Hierarchy</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Abstract Base User → JobSeeker, Recruiter, Admin
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Common identity properties (<code>id, name, email, passwordHash, role</code>) inherit from base <code>User</code>. <code>JobSeeker</code> extends with skills, experience, and applications. <code>Recruiter</code> inherits corporate company association and job posting capabilities.
                  </p>
                </div>

                {/* Polymorphism */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-bold text-[11px]">
                      Polymorphism
                    </span>
                    <span className="mono text-[10px] text-slate-400">Dynamic Dispatch</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Role-Based Workspace View & Matching Dispatch
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Runtime polymorphic rendering executes via active role context (<code>CandidateView</code>, <code>RecruiterPipeline</code>, <code>AdminGovernance</code>). Skill compatibility algorithm dynamically accepts arbitrary candidate skill arrays and target requisition schemas.
                  </p>
                </div>

                {/* Abstraction & Interfaces */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px]">
                      Abstraction & Interfaces
                    </span>
                    <span className="mono text-[10px] text-slate-400">Contract Segregation</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Notifiable, Searchable, Applicable Contracts
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Entities implement strict interfaces: <code>Searchable</code> enforces <code>getSearchTokens()</code>; <code>Applicable</code> governs submission lifecycle; <code>Notifiable</code> unifies toasts, email alerts, and audit logging.
                  </p>
                </div>

                {/* Encapsulation */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[11px]">
                      Encapsulation
                    </span>
                    <span className="mono text-[10px] text-slate-400">Data Protection</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    BCrypt Hashing & Private State Boundaries
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Plaintext passwords never persist or escape API boundaries. Credentials use salted BCrypt hashing. Relational mutations run through isolated server actions with server-side validation.
                  </p>
                </div>
              </div>

              {/* Design Patterns Banner */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  2. Design Patterns Applied (Enterprise Rubric Bonus)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block text-xs">1. Singleton Pattern</span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      <code>prisma.ts</code> maintains exactly one connection pool to prevent connection exhaustion.
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block text-xs">2. DAO (Data Access Object)</span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      <code>actions.ts</code> abstracts persistence logic away from presentation components.
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block text-xs">3. Factory Pattern</span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      <code>registerUser</code> and <code>createJobRequisition</code> instantiate polymorphic role records.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UML CLASS DIAGRAM */}
          {activeTab === 'CLASS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">UML Class & Architecture Model</h3>
                  <p className="text-slate-500 text-xs">Class hierarchy with properties, methods, and interface contracts:</p>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      `class User { +String id; +String name; +String email; +String passwordHash; +Role role; +getDashboard(); }
class JobSeeker extends User { +List<String> skills; +Float experience; +applyToJob(Job j); }
class Recruiter extends User { +Company company; +postJob(Job j); +scheduleInterview(App a); }
class Admin extends User { +approveCompany(Company c); +viewAuditLogs(); }
class Job { +String id; +String title; +Float ctcMin, ctcMax; +List<String> requiredSkills; }
class Application { +String id; +Job job; +JobSeeker candidate; +String status; +Int matchScore; }`,
                      'uml'
                    )
                  }
                  className="btn-press px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-[11px] flex items-center gap-1"
                >
                  {copiedKey === 'uml' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Diagram Code</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                <pre>{`+---------------------------------------------------------------------------------+
|                                 <<abstract>>                                    |
|                                     User                                        |
+---------------------------------------------------------------------------------+
| - id: String                                                                    |
| - name: String                                                                  |
| - email: String                                                                 |
| - passwordHash: String                                                          |
| - role: Role (CANDIDATE | RECRUITER | ADMIN)                                    |
+---------------------------------------------------------------------------------+
| + getDashboard(): Component                                                     |
| + validateCredentials(inputPassword): Boolean                                   |
+---------------------------------------------------------------------------------+
                                       ▲
         +-----------------------------+-----------------------------+
         |                                                           |
+----------------------------------+        +----------------------------------+
|            JobSeeker             |        |            Recruiter             |
+----------------------------------+        +----------------------------------+
| - skills: List<String>           |        | - company: Company               |
| - experience: Float              |        | - postedJobs: List<Job>          |
| - applications: List<Application>|        +----------------------------------+
+----------------------------------+        | + postRequisition(data): Job     |
| + calculateSkillFit(job): Score  |        | + scheduleInterview(app, slot)   |
| + apply(jobId): Application      |        | + updateApplicantStatus(id, stat)|
+----------------------------------+        +----------------------------------+
         |                                                           |
         | implements Applicable                                     | implements Notifiable
         ▼                                                           ▼
+---------------------------------------------------------------------------------+
|                                 Application                                     |
+---------------------------------------------------------------------------------+
| - id: String                                                                    |
| - candidate: JobSeeker                                                          |
| - job: Job                                                                      |
| - matchScore: Integer (0-100%)                                                  |
| - status: Status (APPLIED | SHORTLISTED | INTERVIEW_SCHEDULED | REJECTED)        |
| - interviewDate, interviewSlot, interviewLink: String?                          |
+---------------------------------------------------------------------------------+`}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: ER DIAGRAM */}
          {activeTab === 'ERD' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Relational Database Entity Model (SQLite / Prisma)</h3>
                  <p className="text-slate-500 text-xs">Foreign keys, indices, and cardinality relations:</p>
                </div>
              </div>

              <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                <pre>{`[User] (1) <--------------------- (N) [Application] (N) ---------------------> (1) [Job]
  id (PK)                                  id (PK)                                   id (PK)
  email (UNIQUE)                           candidateId (FK -> User.id)               companyId (FK -> Company.id)
  passwordHash                             jobId (FK -> Job.id)                      title
  role                                     matchScore (INT)                          ctcMin (FLOAT)
  skills (TEXT/JSON)                       status (VARCHAR)                          ctcMax (FLOAT)
  companyId (FK -> Company.id)             interviewDate (VARCHAR)                   requiredSkills (TEXT/JSON)
                                           interviewSlot (VARCHAR)                   experienceYears (VARCHAR)
                                           interviewRound (VARCHAR)                  status (ACTIVE | CLOSED)
                                           interviewLink (VARCHAR)
                                                   |
                                                   | triggers
                                                   ▼
[Company] (1) <----------------- (N) [Job]    [AuditLog]
  id (PK)                                      id (PK)
  name (VARCHAR)                               eventType (AUTH | APPLICATION | INTERVIEW)
  gstin (VARCHAR)                              message (TEXT)
  verified (BOOLEAN)                           timestamp (DATETIME)`}</pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-slate-900 block">Referential Integrity</span>
                  <span className="text-slate-600 block mt-0.5">
                    Foreign keys on <code>Application.candidateId</code> and <code>Application.jobId</code> enforce strict data consistency.
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-slate-900 block">Deterministic Compatibility</span>
                  <span className="text-slate-600 block mt-0.5">
                    Match score is stored directly on <code>Application</code> records for instant historical query filtering.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VIVA Q&A CHEAT SHEET */}
          {activeTab === 'VIVA' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  College Viva Examiner Q&A Guide (100/100 Preparation)
                </h3>
                <p className="text-slate-500 text-xs">
                  Exact answers Tarun can recite if external examiners ask about architecture, OOP, or algorithms:
                </p>
              </div>

              <div className="space-y-3">
                {/* Q1 */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[10px]">Q1</span>
                    <span className="font-bold text-slate-900 text-xs">
                      How does the Job-Skill Matching Algorithm work mathematically?
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed pl-8">
                    <strong>Answer:</strong> &ldquo;We calculate the deterministic Jaccard Compatibility Quotient between candidate skill sets and job requirement vectors. Both arrays undergo whitespace trimming and case normalization. We divide the number of matched intersection skills by the total required job skills: <code>score = round((intersection.length / required.length) * 100)</code>. This yields an exact percentage (e.g. 85%) and partitions skills into matched chips and gap chips.&rdquo;
                  </p>
                </div>

                {/* Q2 */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[10px]">Q2</span>
                    <span className="font-bold text-slate-900 text-xs">
                      Where is Polymorphism demonstrated in this system?
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed pl-8">
                    <strong>Answer:</strong> &ldquo;Polymorphism exists at two levels: at the presentation layer, the active role dynamically switches the workspace rendering between <code>CandidateView</code>, <code>RecruiterPipeline</code>, and <code>AdminGovernance</code>. At the service layer, the matching quotient operates polymorphically over heterogeneous user inputs without coupling to a fixed candidate model.&rdquo;
                  </p>
                </div>

                {/* Q3 */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[10px]">Q3</span>
                    <span className="font-bold text-slate-900 text-xs">
                      How do you prevent SQL Injection and protect user credentials?
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed pl-8">
                    <strong>Answer:</strong> &ldquo;We use Prisma ORM which utilizes parameterized queries under the hood, mathematically preventing SQL injection attacks. For authentication, passwords are never stored in plaintext—they are salted and hashed using the BCrypt hashing algorithm before database persistence.&rdquo;
                  </p>
                </div>

                {/* Q4 */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[10px]">Q4</span>
                    <span className="font-bold text-slate-900 text-xs">
                      What design patterns did you implement and why?
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed pl-8">
                    <strong>Answer:</strong> &ldquo;We implemented the Singleton Pattern for the database client connection pool in <code>prisma.ts</code> to prevent connection exhaustion. We used the Data Access Object (DAO) pattern in <code>actions.ts</code> to decouple data mutations from presentation views, and the Factory Pattern in <code>registerUser</code> to generate polymorphic user and company records.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Tarun Yadav • TalentGrid India College Engineering Viva Dossier
          </span>
          <button
            onClick={onClose}
            className="btn-press px-4 py-2 min-h-[40px] rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
