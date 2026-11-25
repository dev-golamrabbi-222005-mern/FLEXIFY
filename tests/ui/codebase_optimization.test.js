const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../src");

const filesToCheck = [
  "app/(website)/(marketing)/exercises/[id]/page.tsx",
  "app/(website)/(marketing)/howItWorks/page.tsx",
  "components/pricing/CoachSelectModal.tsx",
  "app/dashboard/(users)/your-workouts/session/[id]/page.tsx",
];

for (const rel of filesToCheck) {
  const fullPath = path.join(root, rel);
  assert(fs.existsSync(fullPath), `File does not exist: ${rel}`);
  const lines = fs.readFileSync(fullPath, "utf-8").split("\n").length;
  assert(
    lines <= 200,
    `File ${rel} has ${lines} lines, exceeding strict 200 line limit`
  );
}

// Check subdirectories
const subdirs = [
  "components/dashboard/settings",
  "components/marketing/how-it-works",
  "components/pricing/coach-select",
  "components/workouts/session",
  "components/exercises/detail",
];

for (const sub of subdirs) {
  const dirPath = path.join(root, sub);
  assert(fs.existsSync(dirPath), `Directory does not exist: ${sub}`);
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      const filePath = path.join(dirPath, file);
      const lines = fs.readFileSync(filePath, "utf-8").split("\n").length;
      assert(
        lines <= 200,
        `Subcomponent ${sub}/${file} has ${lines} lines, exceeding strict 200 line limit`
      );
    }
  }
}

// Check performance optimizations in exercise API & page
const apiFile = path.join(root, "app/api/exercises/route.ts");
const apiCode = fs.readFileSync(apiFile, "utf-8");
assert(
  apiCode.includes("estimatedDocumentCount") || apiCode.includes("select"),
  "API route should optimize count and select projection"
);

const pageFile = path.join(root, "app/(website)/(marketing)/exercises/page.tsx");
const pageCode = fs.readFileSync(pageFile, "utf-8");
assert(
  pageCode.includes("useDebounce"),
  "Exercise page should use debounce for search queries"
);

console.log("✓ All targeted large files and subcomponents are <= 200 lines, and exercise performance optimizations verified!");
