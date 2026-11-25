const assert = require("assert");

function generateWatermarkStyle(iconColor, size = 84) {
  return {
    position: "absolute",
    bottom: "-12px",
    right: "-12px",
    color: iconColor,
    opacity: 0.08,
    pointerEvents: "none",
    size,
    transform: "rotate(-12deg)",
  };
}

// Test 1: Watermark style returns proper positioning and non-blocking pointer events
const style = generateWatermarkStyle("#f47920");
assert.strictEqual(style.position, "absolute");
assert.strictEqual(style.bottom, "-12px");
assert.strictEqual(style.right, "-12px");
assert.strictEqual(style.pointerEvents, "none");
assert.strictEqual(style.opacity, 0.08);
assert.strictEqual(style.color, "#f47920");
assert.strictEqual(style.size, 84);

// Test 2: Custom size support for compact cards
const compactStyle = generateWatermarkStyle("#27ae60", 72);
assert.strictEqual(compactStyle.size, 72);
assert.strictEqual(compactStyle.color, "#27ae60");

console.log("✓ All KPI card watermark unit tests passed!");
