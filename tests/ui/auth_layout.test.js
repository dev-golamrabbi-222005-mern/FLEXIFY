const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../src");

// 1. Verify layout existence and properties
const layoutPath = path.join(root, "app/(auth)/layout.tsx");
assert(fs.existsSync(layoutPath), "AuthLayout file must exist at src/app/(auth)/layout.tsx");
const layoutContent = fs.readFileSync(layoutPath, "utf-8");
assert(!layoutContent.includes("Share/Navbar"), "AuthLayout must NOT import or render global Navbar");
assert(!layoutContent.includes("Share/Footer"), "AuthLayout must NOT import or render global Footer");
assert(layoutContent.includes('href="/"'), "AuthLayout must have clickable logo linking to homepage ('/')");
assert(layoutContent.includes("AuthShowcase"), "AuthLayout must render the interactive AuthShowcase on the 50% left side");

// 2. Verify routes existence
const authRoutes = ["login", "register", "forgotPassword", "reset-password"];
for (const r of authRoutes) {
  const pagePath = path.join(root, `app/(auth)/${r}/page.tsx`);
  assert(fs.existsSync(pagePath), `Page must exist for route ${r} at src/app/(auth)/${r}/page.tsx`);
}

// 3. Verify strict <= 200 lines for all auth components
const authFiles = [
  "app/(auth)/layout.tsx",
  "app/(auth)/login/LoginClient.tsx",
  "app/(auth)/register/RegisterClient.tsx",
  "components/auth/AuthShowcase.tsx",
  "components/auth/MockLoginSection.tsx",
  "components/auth/LoginFormFields.tsx",
  "components/auth/RegisterFormFields.tsx",
];

for (const rel of authFiles) {
  const fullPath = path.join(root, rel);
  assert(fs.existsSync(fullPath), `File does not exist: ${rel}`);
  const lines = fs.readFileSync(fullPath, "utf-8").split("\n").length;
  assert(
    lines <= 200,
    `File ${rel} has ${lines} lines, exceeding strict 200 line limit`
  );
}

console.log("✓ AuthLayout, route migration and decomposition verified successfully!");
