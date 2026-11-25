/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("assert");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function testDemoUsers() {
  console.log("Running Demo Users Authentication Test...");

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "flexify";
  assert(uri, "MONGODB_URI must be defined");

  const client = new MongoClient(uri);
  await client.connect();
  const users = client.db(dbName).collection("users");

  const testCases = [
    { email: "user@flexify.com", pass: "User@Flexify", expectedRole: "user" },
    { email: "coach@flexify.com", pass: "Coach@Flexify1", expectedRole: "coach" },
    { email: "admin@flexify.com", pass: "Admin@Flexify", expectedRole: "admin" },
  ];

  for (const tc of testCases) {
    const user = await users.findOne({ email: tc.email });
    assert(user, `User ${tc.email} must exist in MongoDB`);
    assert.strictEqual(user.role, tc.expectedRole, `User ${tc.email} role must be ${tc.expectedRole}`);
    
    const isValid = await bcrypt.compare(tc.pass, user.password);
    assert.strictEqual(isValid, true, `Password for ${tc.email} must match hash`);
    console.log(`Verified ${tc.email} (${tc.expectedRole}) - Password match: TRUE`);
  }

  await client.close();
  console.log("✅ ALL DEMO USER AUTHENTICATION TESTS PASSED!");
}

testDemoUsers().catch((err) => {
  console.error("Test Failed:", err);
  process.exit(1);
});
