const assert = require("assert");
const fs = require("fs");
const path = require("path");

const settingsDir = path.resolve(__dirname, "../../src/components/dashboard/settings");
const pagePath = path.resolve(__dirname, "../../src/app/dashboard/settings/page.tsx");

const expectedFiles = [
  "types.ts",
  "SettingsHeader.tsx",
  "SettingsTabsNav.tsx",
  "SettingsHeroProfile.tsx",
  "ProfilePhotoCard.tsx",
  "ProfileTab.tsx",
  "FitnessInfoTab.tsx",
  "CoachScheduleTab.tsx",
  "AdminInfoTab.tsx",
  "NotificationsTab.tsx",
  "SecurityTab.tsx",
  "AppearanceTab.tsx",
];

assert(fs.existsSync(settingsDir), "Settings component directory must exist");

for (const file of expectedFiles) {
  const filePath = path.join(settingsDir, file);
  assert(fs.existsSync(filePath), `Settings component ${file} must exist`);
  const lines = fs.readFileSync(filePath, "utf-8").split("\n").length;
  assert(
    lines <= 200,
    `File ${file} has ${lines} lines, exceeding strict 200 line maximum`
  );
}

assert(fs.existsSync(pagePath), "Settings page.tsx must exist");
const pageLines = fs.readFileSync(pagePath, "utf-8").split("\n").length;
assert(
  pageLines <= 200,
  `Settings page.tsx has ${pageLines} lines, exceeding strict 200 line maximum`
);

console.log("✓ All settings components exist and are strictly <= 200 lines!");
