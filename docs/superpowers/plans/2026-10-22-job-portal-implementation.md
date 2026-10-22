# TalentGrid India Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, high-trust engineering recruitment platform (TalentGrid India) with 3 Indian personas (Rohan Sharma, Neha Verma, Rajesh Kumar), real-time skill matching algorithms, responsive design engineering UI, and zero-configuration SQLite database persistence.

**Architecture:** Next.js App Router full-stack web application with Tailwind CSS, Lucide icons, and Prisma ORM backed by local SQLite. State management connects candidate applications directly to the recruiter's candidate pipeline and admin audit logs in real-time.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS, Prisma ORM, SQLite, BCryptJS, Playwright.

**Spec:** [.agents/skills/job-portal/SKILL.md](file:///c:/Users/Ravi/Downloads/Tarun%20Yadav/.agents/skills/job-portal/SKILL.md)

---

## Global Constraints
- Target directory: `c:\Users\Ravi\Downloads\Tarun Yadav\job-portal`
- Database: Prisma + SQLite (`prisma/dev.db`) with zero external DB dependencies
- Personas: Indian tech ecosystem names and contexts (Rohan Sharma, Neha Verma, Rajesh Kumar; Bengaluru, Gurugram, Pune, Hyderabad; ₹ LPA compensation)
- Micro-interactions: Emil Kowalski standards (`active:scale-[0.975]`, custom cubic-bezier `(0.23, 1, 0.32, 1)`, Sonner-style reactive toasts)
- Mobile touch target minimum: 44px height for primary buttons, zero horizontal overflow across 375px to 1920px

---

## Tasks

### Task 1: Project Scaffolding & Package Setup
**Files:**
- Directory: `job-portal/`
- Config: `package.json`, `tsconfig.json`, `tailwind.config.ts`

- [ ] Initialize Next.js project inside `job-portal/` with TypeScript, Tailwind CSS, App Router, and ESLint.
- [ ] Install dependencies: `prisma`, `@prisma/client`, `lucide-react`, `bcryptjs`, `@types/bcryptjs`.
- [ ] Initialize Prisma (`npx prisma init --datasource-provider sqlite`).
- [ ] Verify clean build with `npm run build`.

---

### Task 2: TDD Skill Compatibility Engine
**Files:**
- Test: `src/lib/__tests__/matching.test.ts`
- Implement: `src/lib/matching.ts`

- [ ] Write failing test cases for `calculateSkillFit`:
  - 100% match when candidate possesses all requirements
  - Fractional percentage calculation (e.g., 4 of 5 = 80%)
  - Case-insensitive & whitespace normalization (`" Java 21 "` matches `"java 21"`)
  - Proper segregation of `matched` skills vs `gaps`
  - Zero/empty requirements edge cases
- [ ] Run test and verify it fails (Red).
- [ ] Implement `calculateSkillFit` in `src/lib/matching.ts`.
- [ ] Run test and verify it passes (Green).

---

### Task 3: Prisma Schema & Seed Data
**Files:**
- Schema: `prisma/schema.prisma`
- Seed: `prisma/seed.ts`
- Client: `src/lib/prisma.ts`

- [ ] Define relational models in `prisma/schema.prisma`:
  - `User` (id, name, email, role, bio, skills, experience, location)
  - `Company` (id, name, location, gstin, verified)
  - `Job` (id, title, description, companyId, location, ctcMin, ctcMax, requiredSkills, experienceYears, status)
  - `Application` (id, jobId, candidateId, status, matchScore, appliedAt)
  - `AuditLog` (id, event, metadata, timestamp)
- [ ] Push schema to SQLite: `npx prisma db push`.
- [ ] Write `prisma/seed.ts` populating:
  - Rohan Sharma (Candidate, SDE-2 Bengaluru)
  - Neha Verma (Recruiter @ FinWave Technologies)
  - Rajesh Kumar (Super Admin)
  - 3 Indian tech positions with realistic tech stacks and LPA figures
- [ ] Execute seed script: `npx prisma db seed`.

---

### Task 4: Responsive Navigation & Persona Switcher
**Files:**
- Implement: `src/components/Navbar.tsx`
- Layout: `src/app/layout.tsx`

- [ ] Implement responsive `Navbar` featuring:
  - Brand mark: TalentGrid India
  - Adaptive links per active persona
  - Mobile-friendly segmented role switcher (compact labels on mobile, full names on desktop)
  - Verified CV quick trigger
- [ ] Enforce WCAG 44px touch targets on mobile viewports.

---

### Task 5: Candidate Discovery & Tactical Inspector
**Files:**
- Implement: `src/components/JobCard.tsx`, `src/components/SkillMatrix.tsx`, `src/components/ResumeModal.tsx`, `src/components/Toast.tsx`
- Page: `src/app/page.tsx`

- [ ] Implement `JobCard` with Emil press physics (`active:scale-[0.99]`), compensation in LPA, and match badge.
- [ ] Implement `SkillMatrix` with animated progress fill (`cubic-bezier(0.23, 1, 0.32, 1)`), verified chips, and gap flags.
- [ ] Implement `ResumeModal` with `@media print` clean document styling.
- [ ] Implement reactive Sonner-style toast alerts for application submission and bookmarks.
- [ ] Wire 1-click apply action to persist submission and update application state.

---

### Task 6: Recruiter Hiring Pipeline & Admin Governance
**Files:**
- Implement: `src/components/RecruiterPipeline.tsx`, `src/components/AdminGovernance.tsx`

- [ ] Build Recruiter view:
  - 4 key metrics: Total Applicants, Tier-1 Fit, Interviews Scheduled, Avg. Fit Score
  - Responsive applicant table with candidate experience, match scores, and status actions (`Shortlist`, `Schedule Interview`)
- [ ] Build Admin view:
  - Recruiter KYC verification cards (`Approve` / `Reject`)
  - Live security audit stream showing BCrypt verification, match quotient runs, and RBAC dispatches.

---

### Task 7: Playwright Responsive Suite & Verification Gate
**Files:**
- Script: `scratch/verify_playwright.mjs`

- [ ] Run `npx tsc --noEmit` and confirm 0 TypeScript errors.
- [ ] Run `npm run lint` and confirm clean linting.
- [ ] Run automated Playwright responsive verification script across 5 viewports:
  - iPhone SE (`375px`)
  - iPhone 12/13 (`414px`)
  - iPad (`768px`)
  - Laptop (`1280px`)
  - HD Desktop (`1920px`)
- [ ] Assert `isOverflowingX === false` and primary action touch height $\ge 44\text{px}$.
