const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../src");

const filesToCheck = [
  "app/dashboard/components/user/dashboard/UserDashboard.tsx",
  "app/dashboard/components/coach/dashboard/CoachDashboard.tsx",
  "app/dashboard/components/admin/AdminDashboard.tsx",
  "app/dashboard/(users)/your-workouts/page.tsx",
  "app/dashboard/(users)/my-challenges/page.tsx",
  "app/dashboard/(users)/my-coach/page.tsx",
  "app/dashboard/(users)/nutrition-tracker/page.tsx",
  "app/dashboard/(users)/schedule/page.tsx",
  "app/dashboard/(coaches)/coach-workouts/page.tsx",
  "app/dashboard/(coaches)/coach-schedule/page.tsx",
  "app/dashboard/(admin)/admin-coach-management/page.tsx",
  "app/dashboard/(admin)/admin-content-management/page.tsx",
  "app/dashboard/(admin)/admin-management/page.tsx",
  "app/dashboard/(admin)/admin-payments-subscriptions/page.tsx",
  "app/dashboard/(admin)/admin-reports-analytics/page.tsx",
  "app/dashboard/(admin)/admin-users-connect/page.tsx",
];

const targetPattern = /space-y-8\s+md:space-y-12\s+lg:space-y-16/;

let passed = 0;
for (const rel of filesToCheck) {
  const fullPath = path.join(root, rel);
  assert(fs.existsSync(fullPath), `File does not exist: ${rel}`);
  const content = fs.readFileSync(fullPath, "utf-8");
  assert(
    targetPattern.test(content),
    `File ${rel} is missing target spacing pattern 'space-y-8 md:space-y-12 lg:space-y-16'`
  );
  passed++;
}

console.log(`✓ All ${passed} dashboard files have spacious section breathing room!`);
