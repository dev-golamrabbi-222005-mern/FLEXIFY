# Dashboard UI/UX, Pusher Real-Time, Performance & Architecture Overhaul

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Flexify dashboard into a high-performance, industry-standard fitness platform with watermark-accented KPI cards, generous section breathing room (`gap-8 md:gap-12 lg:gap-16`), a modular senior-designed Settings page, a resilient Pusher real-time notification engine, sub-second `/exercises` data loading, and modular file decomposition enforcing the `< 250 lines` rule.

**Architecture:** Component-driven Next.js 16 (App Router, Turbopack/Webpack) with React 19, Tailwind CSS, TanStack Query v5 caching, MongoDB indexed queries, and dual-layer Pusher real-time dispatch (Role & User channels with in-app notification persistence).

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, TanStack Query v5, MongoDB Atlas, Pusher Channels, Lucide Icons, Framer Motion.

---

## Global Constraints

- Zero production code without prior failing tests (TDD).
- Strict adherence to the maximum `< 250 lines` per file rule for all modified and refactored components.
- Section spacing across all dashboard views must adhere to `space-y-8 md:space-y-12 lg:space-y-14` or `gap-8 md:gap-12 lg:gap-16`.
- Every task must be committed and pushed to branch `abdullah` using the format: `[ADDED/MODIFIED/FIXED/DELETED]: short description`.
- Verification before completion: `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), test suites pass.

---

## Review Focus & Failure Modes

1. **Pusher channel/event mismatch:** Triggers using outdated event names like `new-payment` on `admin-updates` fail silently when the UI listens to `new-update` on `role-admin`. Test: Unified event bus dispatch and verification.
2. **Notification persistence loss on refresh:** Ephemeral React state loses notifications on page navigation. Test: In-memory/local storage or DB fallback ensures persistence.
3. **Un-debounced exercise search queue explosion:** Rapid typing in `/exercises` spams MongoDB with 5+ concurrent regex scans over TLS. Test: 300ms debounce test proves only 1 request fires after typing pauses.
4. **MongoDB unindexed regex scans:** `countDocuments({})` scanning 873 items on every filter change. Test: Projection and `estimatedDocumentCount` reduce query latency under 100ms.
5. **Settings page state fragmentation:** Breaking 1,300 lines into tabs must not break shared user context or avatar upload states. Test: Unit test verifying tab switching preserves query cache invalidation.

---

## Tasks Breakdown

### Task 1: KPI Cards Redesign with Watermark Background Icons (All 3 Roles)

**Files:**
- Modify: `app/dashboard/components/user/dashboard/DashboardCards.tsx:103-153`
- Modify: `app/dashboard/components/dashboard-shared.tsx:25-115`
- Test: `tests/ui/kpi_cards.test.js`

**Interfaces:**
- Consumes: `StatCardProps { icon: React.ElementType, label: string, value: string | number, sub?: string, iconColor: string, iconBg: string, trend?: { val: number }, delay?: number }`
- Produces: Polished `StatCard` with `relative overflow-hidden` and an absolute bottom-right watermark icon (`size={76-88}`, `opacity-[0.06] dark:opacity-[0.10]`, rotated `-12deg`, pointer-events-none).

- [ ] **Step 1: Write the failing test for KPI card watermark icon rendering**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement bottom-right watermark background icon in `DashboardCards.tsx` and `dashboard-shared.tsx`**
- [ ] **Step 4: Verify visually across User, Coach, and Admin dashboards**
- [ ] **Step 5: Run tests and commit**
  `git commit -m "[MODIFIED]: Add watermark background icon styling to KPI cards across all roles"`

---

### Task 2: Breathing Room & Visual Rhythm - Systematic Section Spacing

**Files:**
- Modify: `app/dashboard/components/user/dashboard/UserDashboard.tsx`
- Modify: `app/dashboard/components/coach/dashboard/CoachDashboard.tsx`
- Modify: `app/dashboard/components/admin/AdminDashboard.tsx`
- Modify: `app/dashboard/(users)/your-workouts/page.tsx`
- Modify: `app/dashboard/(users)/my-challenges/page.tsx`
- Modify: `app/dashboard/(users)/nutrition-tracker/page.tsx`
- Modify: `app/dashboard/(users)/schedule/page.tsx`
- Modify: `app/dashboard/(users)/create-workout/page.tsx`

**Interfaces:**
- Standardize top-level container classes: `space-y-8 md:space-y-12 lg:space-y-14`
- Standardize grid and flex section gaps: `gap-8 md:gap-10 lg:gap-12`

- [ ] **Step 1: Update section spacing in User Dashboard (`space-y-6` -> `space-y-10 md:space-y-12`)**
- [ ] **Step 2: Update section spacing in Coach Dashboard (`space-y-6` -> `space-y-10 md:space-y-12`)**
- [ ] **Step 3: Update section spacing in Admin Dashboard (`space-y-6` -> `space-y-10 md:space-y-12`)**
- [ ] **Step 4: Apply generous spacing across subpages (workouts, challenges, nutrition, schedule)**
- [ ] **Step 5: Verify zero horizontal overflow and responsive scaling on mobile/tablet/desktop**
- [ ] **Step 6: Commit**
  `git commit -m "[MODIFIED]: Expand dashboard section spacing to generous 8-16 scale for visual breathing room"`

---

### Task 3: Complete UI/UX Redesign & Modular Decomposition of Settings Page

**Files:**
- Decompose: `app/dashboard/settings/page.tsx` (1,309 lines) into:
  - Create: `components/dashboard/settings/SettingsHeader.tsx` (< 120 lines)
  - Create: `components/dashboard/settings/ProfileTab.tsx` (< 200 lines)
  - Create: `components/dashboard/settings/UserFitnessTab.tsx` (< 200 lines)
  - Create: `components/dashboard/settings/CoachScheduleTab.tsx` (< 220 lines)
  - Create: `components/dashboard/settings/AdminInfoTab.tsx` (< 120 lines)
  - Create: `components/dashboard/settings/NotificationsTab.tsx` (< 150 lines)
  - Create: `components/dashboard/settings/SecurityTab.tsx` (< 180 lines)
  - Create: `components/dashboard/settings/AppearanceTab.tsx` (< 130 lines)
  - Create: `components/dashboard/settings/SettingsFields.tsx` (< 160 lines)
  - Modify: `app/dashboard/settings/page.tsx` (< 120 lines orchestrator)
- Test: `tests/ui/settings_decomposition.test.js`

**Design Highlights:**
- Fix the cluttered 3-card top row shown in screenshot `media_1795631912620_4c63fe4b.png`.
- Unified Profile Banner: Avatar upload with clean dropzone/crop badge, user status pill, and member since timestamp.
- Tab Navigation: Horizontal pill bar with Framer Motion layoutId highlight or vertical sidebar with icons and description.
- Form Inputs: Clean 2-column grid, icon-prefixed input fields, floating save action bar with dirty-state indicator.

- [ ] **Step 1: Write unit test validating sub-components export contracts and under-250 lines threshold**
- [ ] **Step 2: Extract common field controls into `SettingsFields.tsx`**
- [ ] **Step 3: Build modular tab components (`ProfileTab`, `UserFitnessTab`, `CoachScheduleTab`, `AdminInfoTab`, `SecurityTab`, `AppearanceTab`, `NotificationsTab`)**
- [ ] **Step 4: Rewrite `app/dashboard/settings/page.tsx` as lightweight orchestrator (< 100 lines)**
- [ ] **Step 5: Verify tab switching, image upload, form submission, and toast feedback**
- [ ] **Step 6: Run tests and commit**
  `git commit -m "[MODIFIED]: Complete UI/UX redesign and modular component decomposition of Settings page"`

---

### Task 4: Pusher Real-Time Notification System Fix, Scoping & In-App Drawer

**Files:**
- Modify: `lib/pusher.ts`
- Modify: `app/dashboard/Share/DashboardNavbar.tsx`
- Modify: `app/api/payment/success/route.ts`
- Modify: `app/api/user/fitness-profile/route.ts`
- Modify: `app/api/coach/apply/route.ts`
- Modify: `app/api/admin/coaches/status/route.ts`
- Modify: `app/api/challenges/progress/route.ts`
- Create: `lib/notifications/dispatch.ts` (Unified notification helper)
- Create: `components/dashboard/notifications/NotificationDrawer.tsx`
- Test: `tests/realtime/pusher_dispatch.test.js`

**Notification Scopes:**
1. **User Scopes:**
   - Challenge/Workout completion (`new-update` on `user-{email}`)
   - Coach workout plan assignment (`new-update` on `user-{email}`)
   - Payment confirmation & plan upgrade (`new-update` on `user-{email}`)
2. **Coach Scopes:**
   - Trainee booked session or completed workout (`new-update` on `user-{coachEmail}`)
   - Trainee subscription activated (`new-update` on `user-{coachEmail}`)
   - Coach application status changed (Approved/Rejected) (`new-update` on `user-{coachEmail}`)
   - Real-time trainee chat messages (`receive_message` on `chat-{id}`)
3. **Admin Scopes:**
   - New coach application submitted (`new-update` on `role-admin`)
   - New payment received ($ amount, plan, user) (`new-update` on `role-admin`)
   - User milestone or system inquiry submitted (`new-update` on `role-admin`)

- [ ] **Step 1: Write test for `dispatchNotification` helper ensuring uniform channel formatting and event payload**
- [ ] **Step 2: Create `lib/notifications/dispatch.ts` to centralize all Pusher triggers**
- [ ] **Step 3: Fix mismatched channels (`admin-updates` -> `role-admin`, `new-payment` -> `new-update`)**
- [ ] **Step 4: Implement local storage or cookie cache in `DashboardNavbar.tsx` so notifications persist across page reloads**
- [ ] **Step 5: Build `NotificationDrawer.tsx` with unread count badge, sound effect/toast, and clear-all functionality**
- [ ] **Step 6: Run test suite and commit**
  `git commit -m "[FIXED]: Normalize Pusher notification channels, implement unified dispatcher and notification drawer"`

---

### Task 5: Lightning-Fast `/exercises` Performance & Large Files Refactoring (< 250 Lines)

**Files:**
- Modify: `app/api/exercises/route.ts`
- Modify: `app/(website)/(marketing)/exercises/page.tsx`
- Decompose: `app/(website)/(marketing)/exercises/[id]/page.tsx` (2,621 lines -> modular tabs)
- Create: `lib/hooks/useDebounce.ts`
- Create: `scripts/ensure-mongo-indexes.js`
- Test: `tests/performance/exercises_api.test.js`

**Performance Optimizations:**
1. **API Optimization:**
   - Replace `collection.countDocuments({})` with `collection.estimatedDocumentCount()` when no filter is provided (instant 0ms vs 1200ms collection scan).
   - Add `.project({ name: 1, level: 1, equipment: 1, images: 1, primaryMuscles: 1, category: 1, id: 1 })` to exclude huge instruction arrays on listing queries (payload drops by 85%).
   - Create compound index in MongoDB Atlas: `{ name: "text", level: 1, equipment: 1, category: 1 }`.
2. **Frontend Optimization:**
   - 300ms Debounce on search input: prevents firing requests on every keystroke.
   - TanStack Query `staleTime: 1000 * 60 * 5` (5 minutes) and `placeholderData: keepPreviousData`: eliminates skeleton flashes on page switches.
   - Next.js Image priority optimization for first 4 cards.
3. **Decomposition of Top Large Files (> 250 lines):**
   - Refactor `app/(website)/(marketing)/exercises/[id]/page.tsx` into:
     - `components/exercises/detail/ExerciseOverview.tsx`
     - `components/exercises/detail/ExerciseInstructions.tsx`
     - `components/exercises/detail/ExerciseMusclesView.tsx`
     - `components/exercises/detail/ExerciseWorkoutSession.tsx`

- [ ] **Step 1: Write performance test asserting API response under 300ms with projection**
- [ ] **Step 2: Add projection and estimated count optimization to `app/api/exercises/route.ts`**
- [ ] **Step 3: Create `lib/hooks/useDebounce.ts` and integrate into `ExercisesPage`**
- [ ] **Step 4: Run index creation script on MongoDB Atlas**
- [ ] **Step 5: Decompose `exercises/[id]/page.tsx` into modular components each < 250 lines**
- [ ] **Step 6: Measure and verify page load speed**
- [ ] **Step 7: Commit**
  `git commit -m "[MODIFIED]: Optimize exercises query latency with projection, debounce and modular component architecture"`

---

### Task 6: Architectural Realignment - `src/` Directory and `actions/` Placement

**Analysis & Proposal:**
- **Why `src/`?** In Next.js, `src/` is optional. Having `app/`, `components/`, `lib/` at root is standard Next.js convention. However, migrating to `src/` provides cleaner separation from root config.
- **`actions/server/` Placement:** Having `actions/` sit at root is awkward. Relocating `actions/` into `lib/actions/` (or `src/actions/`) creates a cohesive, industry-standard structure.
- **Migration Plan:**
  - Option A (Recommended): Relocate `actions/server/` into `lib/actions/` immediately, keeping clean root structure without disrupting git history across 121 routes.
  - Option B: Full migration of `app/`, `components/`, `lib/`, `types/`, `actions/` into `src/` with updated `tsconfig.json` path mappings.

- [ ] **Step 1: Relocate `actions/server` into `lib/actions` and update 3 import references**
- [ ] **Step 2: Verify zero broken imports with `npx tsc --noEmit`**
- [ ] **Step 3: Commit**
  `git commit -m "[MODIFIED]: Consolidate server actions into lib/actions for clean project hierarchy"`

---

## Final Verification Checklist

- [ ] `node tests/security/sanitize.test.js` passes
- [ ] `node tests/validators/contracts.test.js` passes
- [ ] `node tests/ai/copilot.test.js` passes
- [ ] `node tests/user/dashboard_data.test.js` passes
- [ ] `node tests/performance/exercises_api.test.js` passes
- [ ] `npx tsc --noEmit` exits with 0 errors
- [ ] `npm run lint` exits with 0 errors
- [ ] `npx next build --webpack` compiles all 121 routes cleanly
- [ ] All code files touched stay strictly under 250 lines
- [ ] Pushed to GitHub branch `abdullah`
