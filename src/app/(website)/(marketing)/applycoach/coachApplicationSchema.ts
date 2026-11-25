import * as z from "zod";

export const coachSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  gender: z.enum(["male", "female", "other"]),
  profileImage: z.string().url("Valid image URL is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  specialties: z.string().min(1, "Specialties are required"),
  experienceYears: z.number().min(0),
  education: z.string().min(2, "Education is required"),
  certifications: z.array(
    z.object({
      title: z.string().min(1, "Title required"),
      issuedBy: z.string().min(1, "Issuer required"),
      year: z.number().min(1900).max(2026),
    })
  ),
  trainingTypes: z.array(z.string()).min(1, "Select at least one type"),
  availableDays: z.array(z.string()).min(1, "Select at least one day"),
  preferredClients: z.array(z.string()).min(1, "Select level"),
  languages: z.string().min(1, "Languages required"),
  pricing: z.object({
    monthly: z.number().min(0),
    perSession: z.number().min(0),
  }),
  maxClients: z.number().min(1),
});

export type CoachFormValues = z.infer<typeof coachSchema>;
