---
name: job-portal
description: Institutional architecture, design system tokens, and testing protocols for the TalentGrid India recruitment platform. Use whenever developing, refactoring, or verifying features in this project.
---

# TalentGrid India — Institutional Project Skill

## 1. Project Vision & Identity
TalentGrid India is a high-trust, production-grade engineering recruitment platform connecting Indian software talent with Tier-1 engineering organizations (Bengaluru, Gurugram, Hyderabad, Pune). 

### Core Personas (Indian Tech Ecosystem Context)
* **Job Seeker:** **Rohan Sharma** *(Senior Backend Systems Engineer, SDE-2 @ TechLabs, Bengaluru | 3.5 yrs exp | Java 21, Spring Boot 3, PostgreSQL, Docker)*
* **Recruiter:** **Neha Verma** *(Lead Talent Acquisition Partner @ FinWave Technologies, HSR Layout, Bengaluru)*
* **Administrator:** **Rajesh Kumar** *(Super Admin & Platform Governance Officer)*

---

## 2. Design System Tokens (High-Trust Enterprise Standard)

### A. Color Palette
```css
/* Base Surfaces */
--canvas: #f8fafc;        /* Slate-50 app background */
--surface: #ffffff;       /* Pure white elevated cards & panels */
--surface-sub: #f1f5f9;   /* Slate-100 inset controls & tabs */
--border: #e2e8f0;        /* 1px hairline structural boundary */
--border-strong: #cbd5e1; /* Active input focus & modal boundaries */

/* Typography */
--text-primary: #0f172a;  /* Slate-900 high-contrast authoritative text */
--text-secondary: #475569;/* Slate-600 readable body text */
--text-muted: #64748b;    /* Slate-500 metadata, timestamps, & labels */

/* Semantics & Status Tokens */
--action-primary: #0f172a;/* Executive slate-900 primary action buttons */
--badge-match-bg: #ecfdf5;/* Emerald-50 background for >80% skill fit */
--badge-match-tx: #065f46;/* Emerald-800 text */
--badge-gap-bg: #fffbeb;  /* Amber-50 background for skill gaps */
--badge-gap-tx: #92400e;  /* Amber-800 text */
```

### B. Typography Hierarchy
* **Interface & Headings:** `Plus Jakarta Sans` (Tight tracking, geometric aperture, humane readability).
* **Data, Numerics & Tech Tags:** `JetBrains Mono` (Tabular numbers for compensation like `₹24.0 LPA`, fit percentages like `92%`, and skill codes).

### C. Design Engineering Micro-Interactions (Emil Kowalski Philosophy)
* **Button & Press Feedback:** All interactive buttons must have `transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1)` and `active:scale-[0.975]`.
* **Minimum Touch Target:** Mobile buttons must strictly enforce `min-height: 44px` (WCAG AAA touch compliance).
* **Modal Entrance:** Never animate from `scale(0)`. Use `scale(0.96) translateY(8px)` with opacity fade-in over `220ms`.
* **Notifications:** Use non-blocking Sonner-style reactive toasts (`translateY(16px)` $\to$ `translateY(0)`). Never invoke blocking native `alert()`.

---

## 3. Architecture Patterns & Stack

### Technical Stack
* **Framework:** Next.js (App Router, React Server Components, TypeScript)
* **Styling:** Tailwind CSS + Lucide React Icons
* **Database & ORM:** Prisma ORM with SQLite (`prisma/dev.db` for zero-friction local execution)
* **Security & Auth:** BCrypt password hashing + role session cookies (`CANDIDATE`, `RECRUITER`, `ADMIN`)

### Domain Folder Structure
```
job-portal/
├── prisma/
│   ├── schema.prisma            # Relational schema (User, Job, Application, Company)
│   └── seed.ts                  # Seeds Rohan, Neha, Rajesh & 3 verified roles
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Global HTML shell with fonts & toast container
│   │   ├── page.tsx             # Main dual-panel job discovery & inspector
│   │   ├── recruiter/page.tsx   # Recruiter hiring pipeline & applicant queue
│   │   ├── admin/page.tsx       # KYC recruiter approvals & system audit logs
│   │   └── api/                 # Next.js Server Actions & API route handlers
│   ├── components/
│   │   ├── Navbar.tsx           # Responsive header with interactive Persona Switcher
│   │   ├── JobCard.tsx          # Press-reactive job item with match percentage
│   │   ├── SkillMatrix.tsx      # Real-time compatibility radar & gap analyzer
│   │   ├── ResumeModal.tsx      # Auto-generated verified CV with window.print()
│   │   └── Toast.tsx            # Reactive Sonner toast manager
│   └── lib/
│       ├── prisma.ts            # Global Prisma Client singleton
│       └── matching.ts          # Deterministic skill quotient calculation engine
└── .agents/
    └── skills/
        └── job-portal/
            └── SKILL.md         # This institutional skill document
```

---

## 4. Business Logic Algorithms

### A. Skill Compatibility Quotient
```typescript
export function calculateSkillFit(candidateSkills: string[], requiredSkills: string[]): {
  score: number;
  matched: string[];
  gaps: string[];
} {
  const cSet = new Set(candidateSkills.map(s => s.toLowerCase().trim()));
  const matched = requiredSkills.filter(r => cSet.has(r.toLowerCase().trim()));
  const gaps = requiredSkills.filter(r => !cSet.has(r.toLowerCase().trim()));
  const score = Math.round((matched.length / requiredSkills.length) * 100);
  return { score, matched, gaps };
}
```

---

## 5. Verification & TDD Rules

Before claiming any task complete:
1. **TypeScript Typecheck:** `npx tsc --noEmit` must pass with zero errors.
2. **ESLint Validation:** `npm run lint` must pass.
3. **Playwright Responsive Check:**
   - Execute verification script across `375px`, `414px`, `768px`, `1280px`, and `1920px`.
   - Confirm `isOverflowingX === false` for all buttons.
   - Confirm all primary action touch targets maintain $\ge 44\text{px}$ height.
