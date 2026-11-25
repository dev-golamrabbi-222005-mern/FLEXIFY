"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CoachFormValues } from "./coachApplicationSchema";

interface PreferencesPricingFieldsProps {
  register: UseFormRegister<CoachFormValues>;
  errors: FieldErrors<CoachFormValues>;
}

export function PreferencesPricingFields({
  register,
  errors,
}: PreferencesPricingFieldsProps) {
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)]">
        <div className="space-y-3">
          <label className="font-bold underline">Training Types</label>
          {["Online", "1-on-1", "Group"].map((t) => (
            <label key={t} className="flex items-center gap-2 font-normal cursor-pointer">
              <input
                type="checkbox"
                value={t}
                {...register("trainingTypes")}
                className="w-4 h-4 accent-[var(--primary)]"
              />{" "}
              {t}
            </label>
          ))}
          {errors.trainingTypes && (
            <p className="text-xs text-red-500">{errors.trainingTypes.message}</p>
          )}
        </div>
        <div className="space-y-3">
          <label className="font-bold underline">Available Days</label>
          <div className="grid grid-cols-2 gap-2">
            {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
              <label key={d} className="flex items-center gap-2 font-normal cursor-pointer">
                <input
                  type="checkbox"
                  value={d}
                  {...register("availableDays")}
                  className="w-4 h-4 accent-[var(--primary)]"
                />{" "}
                {d}
              </label>
            ))}
          </div>
          {errors.availableDays && (
            <p className="text-xs text-red-500">{errors.availableDays.message}</p>
          )}
        </div>
        <div className="space-y-3">
          <label className="font-bold underline">Preferred Clients</label>
          {["Beginner", "Intermediate", "Advanced"].map((l) => (
            <label key={l} className="flex items-center gap-2 font-normal cursor-pointer">
              <input
                type="checkbox"
                value={l}
                {...register("preferredClients")}
                className="w-4 h-4 accent-[var(--primary)]"
              />{" "}
              {l}
            </label>
          ))}
          {errors.preferredClients && (
            <p className="text-xs text-red-500">{errors.preferredClients.message}</p>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold">Monthly Price ($)</label>
          <input
            type="number"
            {...register("pricing.monthly", { valueAsNumber: true })}
            className="input-style"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold">Per Session ($)</label>
          <input
            type="number"
            {...register("pricing.perSession", { valueAsNumber: true })}
            className="input-style"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold">Max Clients</label>
          <input
            type="number"
            {...register("maxClients", { valueAsNumber: true })}
            className="input-style"
          />
        </div>
      </section>
    </>
  );
}
