"use client";

import React from "react";
import { UseFormRegister, FieldErrors, FieldArrayWithId } from "react-hook-form";
import { CoachFormValues } from "./coachApplicationSchema";

interface ExpertiseCertificationsFieldsProps {
  register: UseFormRegister<CoachFormValues>;
  errors: FieldErrors<CoachFormValues>;
  fields: FieldArrayWithId<CoachFormValues, "certifications", "id">[];
  append: (val: { title: string; issuedBy: string; year: number }) => void;
  remove: (index: number) => void;
}

export function ExpertiseCertificationsFields({
  register,
  errors,
  fields,
  append,
  remove,
}: ExpertiseCertificationsFieldsProps) {
  return (
    <>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <h2 className="col-span-full text-lg font-bold text-[var(--primary)] border-b border-[var(--border-color)] pb-2">
          EXPERTISE
        </h2>
        <div className="space-y-1">
          <label className="text-sm font-semibold">Specialty</label>
          <select {...register("specialties")} className="input-style">
            <option value="">Select Specialty</option>
            <option value="Gymnishiam">Gymnishiam</option>
            <option value="Yoga">Yoga</option>
            <option value="Cardio">Cardio</option>
            <option value="CrossFit">CrossFit</option>
            <option value="Bodybuilding">Bodybuilding</option>
          </select>
          {errors.specialties && (
            <p className="text-xs text-red-500">{errors.specialties.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold">Experience (Years)</label>
          <input
            type="number"
            {...register("experienceYears", { valueAsNumber: true })}
            className="input-style"
          />
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
        <h2 className="text-lg font-bold text-[var(--primary)] border-b border-[var(--border-color)] pb-2">
          CERTIFICATIONS
        </h2>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col md:flex-row gap-4 items-end bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)]"
          >
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs">Title</label>
              <input
                {...register(`certifications.${index}.title` as const)}
                className="input-style"
              />
            </div>
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs">Issued By</label>
              <input
                {...register(`certifications.${index}.issuedBy` as const)}
                className="input-style"
              />
            </div>
            <div className="w-full space-y-1 md:w-32">
              <label className="text-xs">Year</label>
              <input
                type="number"
                {...register(`certifications.${index}.year` as const, {
                  valueAsNumber: true,
                })}
                className="input-style"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 font-bold text-red-500 border border-red-500 rounded-lg cursor-pointer"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ title: "", issuedBy: "", year: 2026 })}
          className="text-[var(--primary)] text-sm font-bold cursor-pointer"
        >
          + ADD ANOTHER
        </button>
      </section>
    </>
  );
}
