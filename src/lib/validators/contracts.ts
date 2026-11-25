import { z } from "zod";

/**
 * Zod schema for public contact inquiry submissions
 */
export const ContactInquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message must be at least 5 characters long"),
  subject: z.string().optional(),
});

export type ContactInquiryInput = z.infer<typeof ContactInquirySchema>;

/**
 * Zod schema for user daily fitness goals
 */
export const UserGoalSchema = z.object({
  goalType: z.string().optional(),
  type: z.string().optional(),
  title: z.string().optional(),
  targetValue: z.coerce.number().positive("Target value must be a positive number"),
  unit: z.string().optional().default("unit"),
  date: z.string().optional(),
});

export type UserGoalInput = z.infer<typeof UserGoalSchema>;

/**
 * Zod schema for AI Copilot prompt request
 */
export const AICopilotRequestSchema = z.object({
  prompt: z.string().min(2, "Prompt must be at least 2 characters"),
  sorenessLevel: z.enum(["none", "mild", "moderate", "severe"]).optional(),
  energyLevel: z.enum(["low", "medium", "high"]).optional(),
  goal: z.string().optional(),
});

export type AICopilotRequestInput = z.infer<typeof AICopilotRequestSchema>;

/**
 * Safe validation helper returning typed data or a formatted error string
 */
export function validateBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const issues = result.error.issues || [];
  const errorMsg = issues.map((e) => `${e.path.join(".") || "field"}: ${e.message}`).join(", ");
  return { success: false, error: errorMsg };
}

// CommonJS compatibility for test runner
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ContactInquirySchema,
    UserGoalSchema,
    AICopilotRequestSchema,
    validateBody,
  };
}
