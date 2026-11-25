"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CoachFormValues } from "./coachApplicationSchema";

interface BasicInfoFieldsProps {
  register: UseFormRegister<CoachFormValues>;
  errors: FieldErrors<CoachFormValues>;
}

export function BasicInfoFields({ register, errors }: BasicInfoFieldsProps) {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <h2 className="col-span-full text-lg font-bold text-[var(--primary)] border-b border-[var(--border-color)] pb-2">
        BASIC INFORMATION
      </h2>
      <div className="space-y-1">
        <label className="text-sm font-semibold">Full Name</label>
        <input
          {...register("fullName")}
          readOnly
          className="input-style bg-[var(--bg-tertiary)] opacity-70"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold">Email Address</label>
        <input
          {...register("email")}
          readOnly
          className="input-style bg-[var(--bg-tertiary)] opacity-70"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold">Phone Number</label>
        <input
          {...register("phone")}
          placeholder="+88017..."
          className="input-style"
        />
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone.message}</p>
        )}
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
        <input
          {...register("location")}
          placeholder="City, Country"
          className="input-style"
        />
        {errors.location && (
          <p className="text-xs text-red-500">{errors.location.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold">Profile Image URL</label>
        <input
          {...register("profileImage")}
          readOnly
          className="input-style bg-[var(--bg-tertiary)]"
        />
      </div>
      <div className="space-y-1 col-span-full">
        <label className="text-sm font-semibold">Short Bio</label>
        <textarea
          {...register("bio")}
          rows={3}
          className="input-style"
          placeholder="Tell us about yourself..."
        />
        {errors.bio && (
          <p className="text-xs text-red-500">{errors.bio.message}</p>
        )}
      </div>
    </section>
  );
}
