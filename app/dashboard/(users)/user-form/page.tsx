"use client";
import { useState } from "react";

export default function FitnessProfileForm() {

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    activityLevel: "",
    workoutDays: "",
    sleepHours: "",
    injuries: "",
    medicalCondition: "",
    dietType: "",
    waterIntake: ""
  });

  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="mt-10 max-w-7xl mx-auto bg-[var(--bg-primary)] px-4 py-8 rounded-lg shadow-md">

      <h2 className="text-2xl font-bold mb-6">
        Fitness & Health Information
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        {/* Age */}
        <div>
          <label className="text-sm font-medium">Age</label>
          <input
            type="number"
            name="age"
            onChange={handleChange}
            className="w-full border p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-medium">Gender</label>
          <select
            name="gender"
            onChange={handleChange}
            className="w-full border p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            <option>Select</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <label className="text-sm font-medium">Height (cm)</label>
          <input
            type="number"
            name="height"
            onChange={handleChange}
            className="w-full border p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="text-sm font-medium">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            onChange={handleChange}
            className="w-full border p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
        </div>

        {/* Fitness Goal */}
        <div>
          <label className="text-sm font-medium">Fitness Goal</label>
          <select
            name="goal"
            onChange={handleChange}
            className="w-full border p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            <option>Select Goal</option>
            <option>Weight Loss</option>
            <option>Muscle Gain</option>
            <option>Maintain Fitness</option>
          </select>
        </div>

        {/* Activity Level */}
        <div>
          <label className="text-sm font-medium">Activity Level</label>
          <select
            name="activityLevel"
            onChange={handleChange}
            className="w-full border p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            <option>Select</option>
            <option>Sedentary</option>
            <option>Lightly Active</option>
            <option>Moderately Active</option>
            <option>Very Active</option>
          </select>
        </div>

        {/* Workout Days */}
        <div>
          <label className="text-sm font-medium">Workout Days / Week</label>
          <select
            name="workoutDays"
            onChange={handleChange}
            className="w-full border p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            <option>Select</option>
            <option>3 Days</option>
            <option>4 Days</option>
            <option>5 Days</option>
            <option>6 Days</option>
          </select>
        </div>

        {/* Sleep */}
        <div>
          <label className="text-sm font-medium">Sleep Hours</label>
          <input
            type="number"
            name="sleepHours"
            onChange={handleChange}
            className="w-full border p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
        </div>

        {/* Water Intake */}
        <div>
          <label className="text-sm font-medium">Water Intake (Liter)</label>
          <input
            type="number"
            name="waterIntake"
            onChange={handleChange}
            className="w-full border p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
        </div>

        {/* Injuries */}
        <div>
          <label className="text-sm font-medium">Injuries</label>
          <input
            type="text"
            name="injuries"
            onChange={handleChange}
            className="w-full border p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
            placeholder="Knee / Back / None"
          />
        </div>

        {/* Medical Condition */}
        <div>
          <label className="text-sm font-medium">Medical Condition</label>
          <input
            type="text"
            name="medicalCondition"
            onChange={handleChange}
            className="w-full border p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
            placeholder="Diabetes / None"
          />
        </div>

        {/* Diet */}
        <div className="col-span-2">
          <label className="text-sm font-medium">Diet Type</label>
          <select
            name="dietType"
            onChange={handleChange}
            className="w-full border p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            <option>Select Diet</option>
            <option>Vegetarian</option>
            <option>Non-Vegetarian</option>
            <option>Vegan</option>
          </select>
        </div>

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white p-3 rounded-lg mt-4"
        >
          Save Fitness Profile
        </button>

      </form>
    </div>
  );
}