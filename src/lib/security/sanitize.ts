import { ObjectId } from "mongodb";

/**
 * Escapes regex metacharacters in user input to prevent ReDoS and regex injection.
 */
export function sanitizeRegex(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Validates whether a value is a strictly valid 24-character hex MongoDB ObjectId.
 */
export function isValidObjectId(id: unknown): boolean {
  if (!id || typeof id !== "string") return false;
  if (!ObjectId.isValid(id)) return false;
  // Ensure that 12-byte strings or arbitrary numbers that MongoDB accepts are not treated as valid hex IDs
  return new ObjectId(id).toString() === id;
}

/**
 * Safely converts an unknown value to a MongoDB ObjectId, or returns null if invalid.
 */
export function toSafeObjectId(id: unknown): ObjectId | null {
  if (!isValidObjectId(id)) return null;
  try {
    return new ObjectId(id as string);
  } catch {
    return null;
  }
}

/**
 * Recursively sanitizes an object or array to strip keys starting with '$' or containing '.',
 * neutralizing MongoDB NoSQL operator injection attacks.
 */
export function sanitizeNoSqlInput<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeNoSqlInput(item)) as unknown as T;
  }

  if (typeof input === "object" && !(input instanceof ObjectId) && !(input instanceof Date)) {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      // Strip operators like $gt, $ne, $where, and dot-notation paths like "user.name"
      if (!key.startsWith("$") && !key.includes(".")) {
        sanitizedObj[key] = sanitizeNoSqlInput(value);
      }
    }
    return sanitizedObj as T;
  }

  return input;
}

// CommonJS compatibility for test runners
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    sanitizeRegex,
    isValidObjectId,
    toSafeObjectId,
    sanitizeNoSqlInput,
  };
}
