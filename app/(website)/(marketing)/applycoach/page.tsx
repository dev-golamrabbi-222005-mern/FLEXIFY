"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

// Zod Schema for validation
const coachSchema = z.object({
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
  certifications: z.array(z.object({
    title: z.string().min(1, "Title required"),
    issuedBy: z.string().min(1, "Issuer required"),
    year: z.number().min(1900).max(2026),
  })),
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

type CoachFormValues = z.infer<typeof coachSchema>;

// API Response type for Error handling
interface ApiErrorResponse {
  message: string;
}

const ApplyCoachPage = () => {
  const { data: session } = useSession();

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<CoachFormValues>({
    resolver: zodResolver(coachSchema),
    defaultValues: {
      fullName: "",
      email: "",
      profileImage: "",
      phone: "",
      gender: "male",
      bio: "",
      location: "",
      specialties: "",
      experienceYears: 0,
      education: "",
      languages: "",
      certifications: [{ title: "", issuedBy: "", year: 2026 }],
      trainingTypes: [],
      availableDays: [],
      preferredClients: [],
      pricing: { monthly: 0, perSession: 0 },
      maxClients: 1,
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "certifications" });

  useEffect(() => {
    if (session?.user) {
      reset({
        fullName: session.user.name || "",
        email: session.user.email || "",
        profileImage: session.user.image || "",
        gender: "male",
        bio: "",
        location: "",
        specialties: "",
        experienceYears: 0,
        education: "",
        languages: "",
        certifications: [{ title: "", issuedBy: "", year: 2026 }],
        trainingTypes: [],
        availableDays: [],
        preferredClients: [],
        pricing: { monthly: 0, perSession: 0 },
        maxClients: 1,
      });
    }
  }, [session, reset]);

  const mutation = useMutation({
    mutationFn: async (data: CoachFormValues) => {
      const response = await axios.post("/api/coach/apply", data);
      return response.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Application submitted successfully!", "success");
      reset();
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      Swal.fire("Error", errorMessage, "error");
    },
  });

  const onSubmit = (data: CoachFormValues) => mutation.mutate(data);

  return (
    <div className="min-h-screen py-10 px-6 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-[var(--primary)] p-8 text-white text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-widest">Apply to be a Coach</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-12">
          
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <h2 className="col-span-full text-lg font-bold text-[var(--primary)] border-b border-[var(--border-color)] pb-2">BASIC INFORMATION</h2>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Full Name</label>
              <input {...register("fullName")} readOnly className="input-style bg-[var(--bg-tertiary)] opacity-70" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Email Address</label>
              <input {...register("email")} readOnly className="input-style bg-[var(--bg-tertiary)] opacity-70" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Phone Number</label>
              <input {...register("phone")} placeholder="+88017..." className="input-style" />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Gender</label>
              <select {...register("gender")} className="input-style">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Location</label>
              <input {...register("location")} placeholder="City, Country" className="input-style" />
              {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Profile Image URL</label>
              <input {...register("profileImage")} readOnly className="input-style bg-[var(--bg-tertiary)]" />
            </div>
            <div className="col-span-full space-y-1">
              <label className="text-sm font-semibold">Short Bio</label>
              <textarea {...register("bio")} rows={3} className="input-style" placeholder="Tell us about yourself..." />
              {errors.bio && <p className="text-red-500 text-xs">{errors.bio.message}</p>}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <h2 className="col-span-full text-lg font-bold text-[var(--primary)] border-b border-[var(--border-color)] pb-2">EXPERTISE</h2>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Specialties</label>
              <input {...register("specialties")} placeholder="Yoga, Gym" className="input-style" />
              {errors.specialties && <p className="text-red-500 text-xs">{errors.specialties.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Experience (Years)</label>
              <input type="number" {...register("experienceYears", { valueAsNumber: true })} className="input-style" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Education</label>
              <input {...register("education")} className="input-style" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Languages</label>
              <input {...register("languages")} className="input-style" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[var(--primary)] border-b border-[var(--border-color)] pb-2">CERTIFICATIONS</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-4 items-end bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)]">
                <div className="flex-1 w-full space-y-1">
                  <label className="text-xs">Title</label>
                  <input {...register(`certifications.${index}.title` as const)} className="input-style" />
                </div>
                <div className="flex-1 w-full space-y-1">
                  <label className="text-xs">Issued By</label>
                  <input {...register(`certifications.${index}.issuedBy` as const)} className="input-style" />
                </div>
                <div className="w-full md:w-32 space-y-1">
                  <label className="text-xs">Year</label>
                  <input type="number" {...register(`certifications.${index}.year` as const, { valueAsNumber: true })} className="input-style" />
                </div>
                <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 font-bold border border-red-500 rounded-lg">X</button>
              </div>
            ))}
            <button type="button" onClick={() => append({ title: "", issuedBy: "", year: 2026 })} className="text-[var(--primary)] text-sm font-bold">
              + ADD ANOTHER
            </button>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)]">
            <div className="space-y-3">
              <label className="underline font-bold">Training Types</label>
              {["Online", "1-on-1", "Group"].map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer font-normal">
                  <input type="checkbox" value={t} {...register("trainingTypes")} className="w-4 h-4 accent-[var(--primary)]" /> {t}
                </label>
              ))}
              {errors.trainingTypes && <p className="text-red-500 text-xs">{errors.trainingTypes.message}</p>}
            </div>
            <div className="space-y-3">
              <label className="underline font-bold">Available Days</label>
              <div className="grid grid-cols-2 gap-2">
                {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
                  <label key={d} className="flex items-center gap-2 cursor-pointer font-normal">
                    <input type="checkbox" value={d} {...register("availableDays")} className="w-4 h-4 accent-[var(--primary)]" /> {d}
                  </label>
                ))}
              </div>
              {errors.availableDays && <p className="text-red-500 text-xs">{errors.availableDays.message}</p>}
            </div>
            <div className="space-y-3">
              <label className="underline font-bold">Preferred Clients</label>
              {["Beginner", "Intermediate", "Advanced"].map((l) => (
                <label key={l} className="flex items-center gap-2 cursor-pointer font-normal">
                  <input type="checkbox" value={l} {...register("preferredClients")} className="w-4 h-4 accent-[var(--primary)]" /> {l}
                </label>
              ))}
              {errors.preferredClients && <p className="text-red-500 text-xs">{errors.preferredClients.message}</p>}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Monthly Price ($)</label>
              <input type="number" {...register("pricing.monthly", { valueAsNumber: true })} className="input-style" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Per Session ($)</label>
              <input type="number" {...register("pricing.perSession", { valueAsNumber: true })} className="input-style" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Max Clients</label>
              <input type="number" {...register("maxClients", { valueAsNumber: true })} className="input-style" />
            </div>
          </section>

          <button type="submit" disabled={mutation.isPending} className="btn-primary w-full py-5 text-xl uppercase disabled:opacity-50">
            {mutation.isPending ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyCoachPage;