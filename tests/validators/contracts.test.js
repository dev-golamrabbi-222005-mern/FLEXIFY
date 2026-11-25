/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("assert");
const path = require("path");

let contracts;
try {
  const jiti = require("jiti")(path.join(process.cwd(), "dummy.js"));
  contracts = jiti("./src/lib/validators/contracts.ts");
} catch (e) {
  contracts = null;
}

function runTests() {
  console.log("Running Contracts Unit Tests...");

  if (!contracts) {
    throw new Error("FAIL: lib/validators/contracts module not found");
  }

  const { ContactInquirySchema, UserGoalSchema, validateBody } = contracts;

  // 1. ContactInquirySchema validation
  const validContact = {
    name: "Alex Smith",
    email: "alex@example.com",
    message: "I want to ask about personal training programs.",
  };
  const contactRes = validateBody(ContactInquirySchema, validContact);
  assert.strictEqual(contactRes.success, true);
  assert.strictEqual(contactRes.data.email, "alex@example.com");

  const invalidContact = {
    name: "A",
    email: "not-an-email",
    message: "Hi",
  };
  const invalidRes = validateBody(ContactInquirySchema, invalidContact);
  assert.strictEqual(invalidRes.success, false);
  assert.strictEqual(typeof invalidRes.error, "string");

  // 2. UserGoalSchema validation
  const validGoal = {
    goalType: "Weight Loss",
    targetValue: 75,
    unit: "kg",
  };
  const goalRes = validateBody(UserGoalSchema, validGoal);
  assert.strictEqual(goalRes.success, true);
  assert.strictEqual(goalRes.data.targetValue, 75);

  const invalidGoal = {
    goalType: "",
    targetValue: "not-a-number",
  };
  const invalidGoalRes = validateBody(UserGoalSchema, invalidGoal);
  assert.strictEqual(invalidGoalRes.success, false);

  console.log("✅ ALL CONTRACT TESTS PASSED!");
}

try {
  runTests();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
