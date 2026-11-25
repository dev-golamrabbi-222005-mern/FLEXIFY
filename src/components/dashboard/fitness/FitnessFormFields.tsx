"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileFormValues } from "./fitnessProfileSchema";

interface FitnessFormFieldsProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

export default function FitnessFormFields({ register, errors }: FitnessFormFieldsProps) {
  return (
    <>
      {/* Physical Stats Section */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <h2 className="col-span-full text-xl font-bold border-b border-[var(--border-color)] pb-2 text-[var(--primary)] uppercase">
          Physical Stats
        </h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Age</label>
          <input type="number" {...register("age", { valueAsNumber: true })} className="input-style" />
          {errors.age && <span className="text-xs text-red-500">{errors.age.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Gender</label>
          <select {...register("gender")} className="input-style">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Height (cm)</label>
          <input type="number" {...register("height", { valueAsNumber: true })} className="input-style" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Weight (kg)</label>
          <input type="number" {...register("weight", { valueAsNumber: true })} className="input-style" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Sleep Hours</label>
          <input type="number" {...register("sleepHours", { valueAsNumber: true })} className="input-style" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Water Intake (Liter)</label>
          <input type="number" {...register("waterIntake", { valueAsNumber: true })} className="input-style" />
        </div>
      </section>

      {/* Fitness & Lifestyle Section */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <h2 className="col-span-full text-xl font-bold border-b border-[var(--border-color)] pb-2 text-[var(--primary)] uppercase">
          Fitness & Lifestyle
        </h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Fitness Goal</label>
          <select {...register("goal")} className="input-style">
            <option value="Weight Loss">Weight Loss</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Maintain Fitness">Maintain Fitness</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Activity Level</label>
          <select {...register("activityLevel")} className="input-style">
            <option value="Sedentary">Sedentary</option>
            <option value="Lightly Active">Lightly Active</option>
            <option value="Moderately Active">Moderately Active</option>
            <option value="Very Active">Very Active</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Workout Days / Week</label>
          <select {...register("workoutDays")} className="input-style">
            <option value="3 Days">3 Days</option>
            <option value="4 Days">4 Days</option>
            <option value="5 Days">5 Days</option>
            <option value="6 Days">6 Days</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Diet Type</label>
          <select {...register("dietType")} className="input-style">
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Vegan">Vegan</option>
          </select>
        </div>
      </section>

      {/* Health & History Section */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <h2 className="col-span-full text-xl font-bold border-b border-[var(--border-color)] pb-2 text-[var(--primary)] uppercase">
          Health & History
        </h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Injuries</label>
          <input {...register("injuries")} className="input-style" placeholder="Knee pain / None" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Medical Condition</label>
          <input {...register("medicalCondition")} className="input-style" placeholder="Asthma / None" />
        </div>
      </section>
    </>
  );
}
