/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("assert");
const path = require("path");
const jiti = require("jiti")(path.join(process.cwd(), "dummy.js"));
const sanitize = jiti("./src/lib/security/sanitize.ts");

function runTests() {
  console.log("Running Sanitize Unit Tests...");

  const { sanitizeRegex, isValidObjectId, toSafeObjectId, sanitizeNoSqlInput } = sanitize;

  // 1. sanitizeRegex
  assert.strictEqual(sanitizeRegex("hello.world*"), "hello\\.world\\*");
  assert.strictEqual(sanitizeRegex("test[a-z]+(foo)"), "test\\[a-z\\]\\+\\(foo\\)");
  assert.strictEqual(sanitizeRegex("$100?"), "\\$100\\?");

  // 2. isValidObjectId
  assert.strictEqual(isValidObjectId("507f1f77bcf86cd799439011"), true);
  assert.strictEqual(isValidObjectId("invalid-id"), false);
  assert.strictEqual(isValidObjectId(null), false);
  assert.strictEqual(isValidObjectId({ $gt: "" }), false);
  assert.strictEqual(isValidObjectId("12345"), false);

  // 3. toSafeObjectId
  const validObj = toSafeObjectId("507f1f77bcf86cd799439011");
  assert.strictEqual(validObj !== null, true);
  assert.strictEqual(validObj.toString(), "507f1f77bcf86cd799439011");
  assert.strictEqual(toSafeObjectId("invalid-id"), null);
  assert.strictEqual(toSafeObjectId(undefined), null);

  // 4. sanitizeNoSqlInput
  const maliciousInput = {
    username: "john",
    $where: "sleep(5000)",
    nested: {
      "user.name": "admin",
      $gt: 0,
      safeField: "safeValue"
    },
    arrayField: [
      { $regex: ".*" },
      { normal: "data" }
    ]
  };

  const sanitized = sanitizeNoSqlInput(maliciousInput);
  assert.strictEqual(sanitized.username, "john");
  assert.strictEqual(sanitized.$where, undefined);
  assert.strictEqual(sanitized.nested.$gt, undefined);
  assert.strictEqual(sanitized.nested["user.name"], undefined);
  assert.strictEqual(sanitized.nested.safeField, "safeValue");
  assert.strictEqual(sanitized.arrayField[0].$regex, undefined);
  assert.strictEqual(sanitized.arrayField[1].normal, "data");

  console.log("✅ ALL SANITIZE UNIT TESTS PASSED!");
}

try {
  runTests();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
