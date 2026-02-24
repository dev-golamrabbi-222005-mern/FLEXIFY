"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const coachSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  gender: z.enum(["male", "female", "other"]),
  profileImage: z.string().url("Valid image URL is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  specialties: z.string().min(1, "Required"),
  experienceYears: z.number().min(0),
  education: z.string().min(2, "Required"),
  certifications: z.array(z.object({
    title: z.string().min(1, "Title required"),
    issuedBy: z.string().min(1, "Issuer required"),
    year: z.number(),
  })),
  trainingTypes: z.array(z.string()).min(1, "Select at least one"),
  availableDays: z.array(z.string()).min(1, "Select at least one"),
  preferredClients: z.array(z.string()).min(1, "Select at least one"),
  languages: z.string().min(1, "Required"),
  pricing: z.object({
    monthly: z.number().min(0),
    perSession: z.number().min(0),
  }),
  maxClients: z.number().min(1),
});

type CoachFormValues = z.infer<typeof coachSchema>;

const ApplyCoachPage = () => {
  const mutation = useMutation({
    mutationFn: async (data: CoachFormValues) => {
      const response = await axios.post("/api/coach/apply", { ...data, status: "pending" });
      return response.data;
    },
    onSuccess: () => alert("Application submitted! Waiting for Admin approval."),
    onError: (err: any) => alert(err.response?.data?.message || "Submission failed"),
  });

  const { register, control, handleSubmit, formState: { errors } } = useForm<CoachFormValues>({
    resolver: zodResolver(coachSchema),
    defaultValues: {
      certifications: [{ title: "", issuedBy: "", year: 2026 }],
      trainingTypes: [], availableDays: [], preferredClients: []
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "certifications" });
  const onSubmit = (data: CoachFormValues) => mutation.mutate(data);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-lg overflow-hidden font-sans">
        <div className="bg-[var(--primary)] p-8 text-white text-center">
          <h1 className="text-3xl font-bold ">APPLY TO BE A COACH</h1>
          <p className="mt-1 opacity-90">Fill up the form to join Flexify team</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-12 space-y-10">
          {/* Section 1: Basic Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <h2 className="col-span-full text-xl font-bold border-b border-[var(--border-color)] pb-2 text-[var(--primary)] uppercase">Basic Information</h2>
            <div className="flex flex-col gap-1">
              <label>Full Name</label>
              <input {...register("fullName")} placeholder="Ex: John Doe" className="input-style" />
              {errors.fullName && <span className="text-red-500 text-xs">{errors.fullName.message}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label>Email Address</label>
              <input {...register("email")} placeholder="john@example.com" className="input-style" />
            </div>
            <div className="flex flex-col gap-1">
              <label>Phone Number</label>
              <input {...register("phone")} placeholder="+880 1XXX XXXXXX" className="input-style" />
            </div>
            <div className="flex flex-col gap-1">
              <label>Gender</label>
              <select {...register("gender")} className="input-style">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label>Profile Image URL</label>
              <input {...register("profileImage")} placeholder="https://image-link.com" className="input-style" />
            </div>
            <div className="flex flex-col gap-1">
              <label>Location</label>
              <input {...register("location")} placeholder="Dhaka, Bangladesh" className="input-style" />
            </div>
            <div className="md:col-span-full flex flex-col gap-1">
              <label>Short Bio</label>
              <textarea {...register("bio")} placeholder="Tell us about your fitness journey..." rows={3} className="input-style" />
            </div>
          </section>

          {/* Section 2: Expertise */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <h2 className="col-span-full text-xl font-bold border-b border-[var(--border-color)] pb-2 text-[var(--primary)] uppercase">Professional Expertise</h2>
            <div className="flex flex-col gap-1">
              <label>Specialties (Ex: Weight Loss, HIIT)</label>
              <input {...register("specialties")} placeholder="Muscle Gain, Rehab, Yoga" className="input-style" />
            </div>
            <div className="flex flex-col gap-1">
              <label>Experience (Years)</label>
              <input type="number" {...register("experienceYears", { valueAsNumber: true })} placeholder="5" className="input-style" />
            </div>
            <div className="flex flex-col gap-1">
              <label>Education</label>
              <input {...register("education")} placeholder="B.Sc in Sports Science" className="input-style" />
            </div>
            <div className="flex flex-col gap-1">
              <label>Languages</label>
              <input {...register("languages")} placeholder="English, Bangla" className="input-style" />
            </div>
          </section>

          {/* Section 3: Certifications */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-b border-[var(--border-color)] pb-2 text-[var(--primary)] uppercase">Certifications</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)]">
                <input {...register(`certifications.${index}.title`)} placeholder="Certificate Title (NASM)" className="input-style" />
                <input {...register(`certifications.${index}.issuedBy`)} placeholder="Issued By" className="input-style" />
                <div className="flex gap-2">
                  <input type="number" {...register(`certifications.${index}.year`, { valueAsNumber: true })} className="input-style w-full" />
                  <button type="button" onClick={() => remove(index)} className="text-red-500 font-bold px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-all text-sm">X</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => append({ title: "", issuedBy: "", year: 2026 })} className="text-[var(--primary)] font-bold text-sm">+ ADD NEW CERTIFICATE</button>
          </section>

          {/* Section 4: Training & Availability */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <h2 className="col-span-full text-xl font-bold border-b border-[var(--border-color)] pb-2 text-[var(--primary)] uppercase">Settings & Pricing</h2>
            
            <div className="space-y-3">
              <label className="font-bold block underline">Training Types</label>
              {["Online", "1-on-1", "Group", "Home Workout"].map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" value={t} {...register("trainingTypes")} className="accent-[var(--primary)] w-4 h-4" /> {t}
                </label>
              ))}
            </div>

            <div className="space-y-3">
              <label className="font-bold block underline">Available Days</label>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map(d => (
                  <label key={d} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" value={d} {...register("availableDays")} className="accent-[var(--primary)] w-4 h-4" /> {d}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-bold block underline">Preferred Clients</label>
              {["Beginner", "Intermediate", "Advanced"].map(l => (
                <label key={l} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" value={l} {...register("preferredClients")} className="accent-[var(--primary)] w-4 h-4" /> {l}
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <label>Monthly Price ($)</label>
              <input type="number" {...register("pricing.monthly", { valueAsNumber: true })} placeholder="300" className="input-style" />
            </div>
            <div className="flex flex-col gap-1">
              <label>Per Session Price ($)</label>
              <input type="number" {...register("pricing.perSession", { valueAsNumber: true })} placeholder="30" className="input-style" />
            </div>
            <div className="flex flex-col gap-1">
              <label>Max Client Capacity</label>
              <input type="number" {...register("maxClients", { valueAsNumber: true })} placeholder="15" className="input-style" />
            </div>
          </section>

          <button 
            type="submit" 
            disabled={mutation.isPending}
            className={`btn-primary w-full text-xl font-black py-5 uppercase tracking-widest transition-all shadow-xl active:scale-95 ${mutation.isPending ? "opacity-40 cursor-wait" : "hover:brightness-110"}`}
          >
            {mutation.isPending ? "Processing..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyCoachPage;