/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("assert");
const path = require("path");

let copilotHandler;
try {
  const jiti = require("jiti")(path.join(process.cwd(), "dummy.js"));
  copilotHandler = jiti("./app/api/ai/copilot/route.ts");
} catch (e) {
  copilotHandler = null;
}

async function runTests() {
  console.log("Running AI Copilot Unit Tests...");

  if (!copilotHandler || !copilotHandler.POST) {
    throw new Error("FAIL: app/api/ai/copilot/route.ts POST handler not found");
  }

  // 1. Invalid payload should return 400
  const req1 = {
    json: async () => ({ prompt: "" }),
  };
  const res1 = await copilotHandler.POST(req1);
  const json1 = await res1.json();
  assert.strictEqual(res1.status, 400);
  assert.strictEqual(typeof json1.error, "string");

  // 2. Valid payload with soreness
  const req2 = {
    json: async () => ({
      prompt: "Feeling tight in hamstrings after heavy squats yesterday",
      sorenessLevel: "moderate",
      energyLevel: "medium",
      goal: "Hypertrophy",
    }),
  };
  const res2 = await copilotHandler.POST(req2);
  const json2 = await res2.json();
  assert.strictEqual(res2.status, 200);
  assert.strictEqual(typeof json2.advice, "string");
  assert.strictEqual(Array.isArray(json2.adaptedWorkout), true);
  assert.strictEqual(Array.isArray(json2.recoveryTips), true);
  assert.strictEqual(json2.recoveryTips.length >= 1, true);

  console.log("✅ ALL AI COPILOT TESTS PASSED!");
}

runTests().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
