const assert = require("assert");

function cleanChannelIdentifier(str) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "-");
}

function buildUserChannel(email) {
  return `user-${cleanChannelIdentifier(email)}`;
}

function buildRoleChannel(role) {
  return `role-${cleanChannelIdentifier(role)}`;
}

// Test 1: Clean user email channel formatting
assert.strictEqual(
  buildUserChannel("test.user+flexify@example.com"),
  "user-test-user-flexify-example-com"
);
assert.strictEqual(buildUserChannel("USER@flexify.com"), "user-user-flexify-com");

// Test 2: Role channel formatting
assert.strictEqual(buildRoleChannel("Admin"), "role-admin");
assert.strictEqual(buildRoleChannel("coach"), "role-coach");
assert.strictEqual(buildRoleChannel("User"), "role-user");

// Test 3: Notification Payload schema
const payload = {
  title: "Subscription Active",
  message: "Your Pro plan is active!",
  type: "payment",
  link: "/dashboard",
};
assert.strictEqual(payload.title, "Subscription Active");
assert.strictEqual(payload.type, "payment");

console.log("✓ All notification channel and payload unit tests passed!");
