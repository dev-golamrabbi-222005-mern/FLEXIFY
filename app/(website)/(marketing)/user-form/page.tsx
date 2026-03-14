"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  age: z.number().min(10).max(100),
  gender: z.enum(["Male", "Female", "Other"]),
  height: z.number().min(50),
  weight: z.number().min(20),
  goal: z.string().min(1, "Required"),
  activityLevel: z.string().min(1, "Required"),
  workoutDays: z.string().min(1, "Required"),
  sleepHours: z.number().min(1).max(24),
  waterIntake: z.number().min(0),
  injuries: z.string().optional(),
  medicalCondition: z.string().optional(),
  dietType: z.string().min(1, "Required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const FitnessProfileForm = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const response = await axios.post("/api/user/fitness-profile", data);
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Profile saved successfully! Redirecting to dashboard...",
        icon: "success",
        timer: 2000, 
        showConfirmButton: false,
      }).then(() => {
        router.push("/dashboard"); 
      });},
    onError: (err: unknown) => {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Something went wrong";
      Swal.fire("Error", message, "error");
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { gender: "Male" }
  });

  const onSubmit = (data: ProfileFormValues) => mutation.mutate(data);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-lg overflow-hidden font-sans">
        
        <div className="bg-[var(--primary)] p-8 text-white text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle, #fff 2px, transparent 2px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold uppercase">Fitness & Health Profile</h1>
            <p className="mt-1 opacity-90">Provide your details for a personalized experience</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-12 space-y-10">
          
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <h2 className="col-span-full text-xl font-bold border-b border-[var(--border-color)] pb-2 text-[var(--primary)] uppercase">
              Physical Stats
            </h2>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Age</label>
              <input type="number" {...register("age", { valueAsNumber: true })} className="input-style" placeholder="25" />
              {errors.age && <span className="text-red-500 text-xs">{errors.age.message}</span>}
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
              <input type="number" {...register("height", { valueAsNumber: true })} className="input-style" placeholder="175" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Weight (kg)</label>
              <input type="number" {...register("weight", { valueAsNumber: true })} className="input-style" placeholder="70" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Sleep Hours</label>
              <input type="number" {...register("sleepHours", { valueAsNumber: true })} className="input-style" placeholder="8" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Water Intake (Liter)</label>
              <input type="number" {...register("waterIntake", { valueAsNumber: true })} className="input-style" placeholder="3" />
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <h2 className="col-span-full text-xl font-bold border-b border-[var(--border-color)] pb-2 text-[var(--primary)] uppercase">
              Fitness & Lifestyle
            </h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Fitness Goal</label>
              <select {...register("goal")} className="input-style">
                <option value="">Select Goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Maintain Fitness">Maintain Fitness</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Activity Level</label>
              <select {...register("activityLevel")} className="input-style">
                <option value="">Select Level</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Workout Days / Week</label>
              <select {...register("workoutDays")} className="input-style">
                <option value="">Select Days</option>
                <option value="3 Days">3 Days</option>
                <option value="4 Days">4 Days</option>
                <option value="5 Days">5 Days</option>
                <option value="6 Days">6 Days</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Diet Type</label>
              <select {...register("dietType")} className="input-style">
                <option value="">Select Diet</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`bg-(--primary) rounded-2xl text-white cursor-pointer w-full text-xl font-extrabold py-6 uppercase tracking-widest transition-all shadow-xl active:scale-95 relative overflow-hidden ${mutation.isPending ? "opacity-40 cursor-wait" : "hover:brightness-110"}`}
          >
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, #fff 2px, transparent 2px)`,
                backgroundSize: "20px 20px",
              }}
            />
            <span className="relative z-10">
              {mutation.isPending ? "Saving Profile..." : "Save Fitness Profile"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FitnessProfileForm;