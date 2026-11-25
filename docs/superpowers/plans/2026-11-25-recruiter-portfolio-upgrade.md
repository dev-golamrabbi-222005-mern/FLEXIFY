# Recruiter-Ready Portfolio & Security Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate database query injection surfaces across MongoDB and execute strategic recruiter-ready upgrades (NoSQL sanitizer, Zod contracts, Gemini AI Workout Copilot, guaranteed 1-click demo accounts, and portfolio README overhaul) with end-to-end test verification.

**Architecture:** Layered defense-in-depth architecture. Inbound requests pass through a security sanitization and Zod contract validation layer (`lib/security/sanitize.ts` and `lib/validators/contracts.ts`) preventing NoSQL operator injection and ReDoS. The AI layer integrates Google Gemini API via server route `/api/ai/copilot` and a reactive UI widget in the user dashboard. Recruiter 1-click demo accounts are verified and pre-seeded. Documentation is packaged into an engineering case study in `README.md`.

**Tech Stack:** Next.js 16.1.6 (App Router), React 19, TypeScript 5.9, MongoDB Node Driver 6.16, Zod, Google Gemini API, Tailwind CSS v4, Pusher.

**Spec:** `/Users/macbook/.gemini/antigravity/brain/ec83977b-1bad-4ab3-8da2-801281630959/portfolio_upgrade_and_engineering_roadmap.md`

## Global Constraints

- Zero TypeScript compilation errors (`npx tsc --noEmit` must exit 0).
- Zero ESLint errors (`npm run lint` must exit 0).
- Production build must succeed across all routes (`npm run build` exit 0).
- All MongoDB queries must escape user-supplied regex and validate ObjectIds.
- AI Copilot must handle missing API key gracefully with smart local fitness heuristics.

## Review Focus

- Malformed or invalid 12/24 hex strings in `_id` parameters causing unhandled BSON errors.
- Regex metacharacters in search queries (`/api/foods`, `/api/admin/users`, `/api/user`) causing ReDoS or MongoDB syntax crashes.
- NoSQL operator injection via malicious object payloads (`{"$gt": ""}`).
- AI Copilot API failing when `GEMINI_API_KEY` is not present in environment.
- 1-Click demo logins failing if demo accounts are missing from database.

---

### Task 1: Database Query Injection Sanitization & Hardening

**Files:**
- Create: `lib/security/sanitize.ts`
- Modify: `app/api/foods/route.ts`
- Modify: `app/api/admin/users/route.ts`
- Modify: `app/api/user/route.ts`
- Modify: `app/api/admin/coaches/status/route.ts`
- Test: `tests/security/sanitize.test.ts` (or `scratch/test_sanitize.js`)

**Interfaces:**
- Produces:
  ```ts
  export function sanitizeRegex(str: string): string;
  export function isValidObjectId(id: unknown): boolean;
  export function toSafeObjectId(id: unknown): ObjectId | null;
  export function sanitizeNoSqlInput<T>(input: T): T;
  ```

- [ ] **Step 1: Write test for sanitization functions**
- [ ] **Step 2: Run test to verify it fails before implementation**
- [ ] **Step 3: Implement `lib/security/sanitize.ts`**
- [ ] **Step 4: Apply `sanitizeRegex` and `toSafeObjectId` across query and search routes**
- [ ] **Step 5: Run tests to verify all sanitization tests pass**

---

### Task 2: Zod Contract Validation Layer

**Files:**
- Create: `lib/validators/contracts.ts`
- Modify: `app/api/contact/route.ts`
- Modify: `app/api/user/goals/route.ts`
- Test: `scratch/test_contracts.js`

**Interfaces:**
- Produces:
  ```ts
  export const ContactInquirySchema = z.object({ ... });
  export const UserGoalSchema = z.object({ ... });
  export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string };
  ```

- [ ] **Step 1: Write contract validation test**
- [ ] **Step 2: Implement schemas and validation helper in `lib/validators/contracts.ts`**
- [ ] **Step 3: Integrate validation into routes**
- [ ] **Step 4: Verify rejection of invalid or malicious payloads**

---

### Task 3: Gemini AI Workout & Recovery Copilot (Hero Feature)

**Files:**
- Create: `app/api/ai/copilot/route.ts`
- Create: `app/dashboard/components/ai/FlexifyAICopilot.tsx`
- Modify: `app/dashboard/components/user/dashboard/DashboardCards.tsx`
- Test: `scratch/test_ai_copilot.js`

**Interfaces:**
- Produces:
  - `POST /api/ai/copilot`: accepts `{ prompt: string, sorenessLevel?: string, energyLevel?: string, goal?: string }`, returns `{ advice: string, adaptedWorkout?: Array<{ name: string, sets: number, reps: string, notes: string }>, recoveryTips: string[] }`.
  - Fallback engine: When `GEMINI_API_KEY` is not configured, provides intelligent rules-based sports science recovery adaptations.

- [ ] **Step 1: Write test for AI Copilot API route (testing payload handling and fallback)**
- [ ] **Step 2: Implement `app/api/ai/copilot/route.ts` with Gemini API client & intelligent fallback**
- [ ] **Step 3: Implement `FlexifyAICopilot.tsx` with modern glassmorphism UI, quick-prompt pills, and interactive recommendation cards**
- [ ] **Step 4: Mount `FlexifyAICopilot` into User Dashboard**
- [ ] **Step 5: Run end-to-end test on AI Copilot endpoint**

---

### Task 4: Recruiter 1-Click Demo Accounts & Seeder

**Files:**
- Create: `actions/server/seedDemoUsers.ts`
- Modify: `app/(website)/(auth)/login/LoginClient.tsx`
- Test: `scratch/test_demo_login.js`

**Interfaces:**
- Produces:
  - Guaranteed active accounts in MongoDB:
    - User: `user@flexify.com` / `User@Flexify`
    - Coach: `coach@flexify.com` / `Coach@Flexify1`
    - Admin: `admin@flexify.com` / `Admin@Flexify`
  - Seamless 1-click login button triggers in `LoginClient.tsx`

- [ ] **Step 1: Create automated seeder verifying/inserting demo users with bcrypt passwords**
- [ ] **Step 2: Run seeder and verify accounts exist in MongoDB**
- [ ] **Step 3: Update `LoginClient.tsx` UI feedback and direct auto-fill for recruiters**
- [ ] **Step 4: Test 1-click credentials via automated auth request**

---

### Task 5: Portfolio Packaging & README.md Overhaul

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document system architecture with Mermaid sequence & component diagrams**
- [ ] **Step 2: Add 1-Click Recruiter Quick-Start table with verified credentials**
- [ ] **Step 3: Add Engineering Decisions & Trade-Offs section (Pusher, MongoDB caching, RBAC)**
- [ ] **Step 4: Add Resume Case Study bullet points ready for candidate's CV**

---

### Task 6: Comprehensive Verification & Final Report

**Files:**
- Script: `scratch/verify_all_upgrades.js`
- Artifact: `project_health_and_audit_report.md`

- [ ] **Step 1: Run full verification suite against all new endpoints**
- [ ] **Step 2: Run `npx tsc --noEmit` and `npm run lint`**
- [ ] **Step 3: Run `npm run build`**
- [ ] **Step 4: Update task checklist and deliver final audit report**
