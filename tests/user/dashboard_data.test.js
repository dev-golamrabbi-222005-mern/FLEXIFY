const assert = require("assert");

function resolveDashboardProfile(userData, nutritionData) {
  const profile = userData?.fitnessProfile || userData?.fitness_profile;
  const sleepHours = profile?.sleepHours ? `${profile.sleepHours}h` : "8h";
  const waterGoal = userData?.calculatedGoals?.waterGoal || (profile?.waterIntake ? profile.waterIntake * 4 : 8);
  const waterDisplay = `${nutritionData?.waterIntake || 0} / ${waterGoal}`;
  return {
    sleepHours,
    waterGoal,
    waterDisplay,
  };
}

// Test 1: camelCase fitnessProfile works properly
const dataCamel = {
  fitnessProfile: { sleepHours: 7, waterIntake: 3 },
  calculatedGoals: { waterGoal: 12 },
};
const res1 = resolveDashboardProfile(dataCamel, { waterIntake: 6 });
assert.strictEqual(res1.sleepHours, "7h");
assert.strictEqual(res1.waterGoal, 12);
assert.strictEqual(res1.waterDisplay, "6 / 12");

// Test 2: snake_case fitness_profile fallback works properly
const dataSnake = {
  fitness_profile: { sleepHours: 6, waterIntake: 2 },
  calculatedGoals: null,
};
const res2 = resolveDashboardProfile(dataSnake, { waterIntake: 4 });
assert.strictEqual(res2.sleepHours, "6h");
assert.strictEqual(res2.waterGoal, 8);
assert.strictEqual(res2.waterDisplay, "4 / 8");

// Test 3: empty user data provides clean defaults without NaN or undefined
const res3 = resolveDashboardProfile(null, null);
assert.strictEqual(res3.sleepHours, "8h");
assert.strictEqual(res3.waterGoal, 8);
assert.strictEqual(res3.waterDisplay, "0 / 8");

console.log("✓ All dashboard data resolution tests passed successfully!");
