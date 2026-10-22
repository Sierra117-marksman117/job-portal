# TalentGrid India — Engineering Recruitment Platform

> High-trust, production-grade recruitment platform designed for the Indian software engineering ecosystem. Built with Next.js 16 (App Router), Tailwind CSS, Prisma ORM, and SQLite.

---

## 🌟 Key Features

* **3 Role-Based Journeys (Instant Switcher in Header):**
  * **Job Seeker (Rohan Sharma):** Search roles, view 92% Skill Compatibility Engine, 1-click apply, print-ready PDF resume.
  * **Recruiter (Neha Verma @ FinWave Technologies):** Requisitions pipeline ordered by candidate skill match quotient, one-click shortlisting and interview scheduling.
  * **Super Admin (Rajesh Kumar):** Recruiter GSTIN KYC verification queue and real-time security audit log stream.
* **Algorithmic Skill Compatibility Engine:** Deterministic Jaccard set calculation computing real-time candidate skill overlap vs job requirements (`92% Fit`) with explicit gap highlighting.
* **Auto-Generated Resume (PDF Export):** Auto-compiled verified technical CV with `@media print` styling supporting native browser `Print to PDF`.
* **Zero-Configuration Database:** Self-contained **SQLite database (`prisma/dev.db`)** via Prisma ORM. No external server, MySQL, or Docker required.
* **Design Engineering UI Standards:** Built to Emil Kowalski standards (`active:scale-[0.975]`, custom `cubic-bezier(0.23, 1, 0.32, 1)` transitions, Sonner-style non-blocking reactive toasts, WCAG AAA 44px touch targets).

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
cd job-portal
npm install
```

### 2. Database Setup & Seeding
The database is pre-configured with SQLite. To populate the demo personas and Indian tech postings:
```bash
npx prisma db seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Run Test Suite
```bash
npx tsx --test src/lib/__tests__/matching.test.ts
```

---

## 👥 Pre-Seeded Demo Accounts

| Role | Name | Email | Password | Context |
| :--- | :--- | :--- | :--- | :--- |
| **Job Seeker** | Rohan Sharma | `rohan.sharma.dev@example.com` | `Demo@123` | SDE-2 @ TechLabs, Bengaluru (3.5 yrs exp, Java/Spring/Postgres) |
| **Recruiter** | Neha Verma | `neha.verma@finwave.example.com` | `Demo@123` | Talent Acquisition @ FinWave Technologies, Bengaluru |
| **Super Admin**| Rajesh Kumar | `rajesh.admin@talentgrid.example.com`| `Demo@123`| Platform Governance & Compliance Officer, New Delhi |

---

## 🏗️ Tech Stack

* **Framework:** Next.js 16.4.2 (App Router, Server Actions, Turbopack)
* **Frontend:** React 19, Tailwind CSS 4, Lucide React Icons
* **Database & ORM:** SQLite (`prisma/dev.db`), Prisma ORM 6.19.3
* **Security:** BCryptJS password hashing + Role-Based Access Control
* **Testing:** Node.js native test runner + Playwright responsive engine

# job-portal
