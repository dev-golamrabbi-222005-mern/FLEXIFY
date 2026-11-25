"use client";

import { Plus } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import WorkoutPlanCard, { WorkoutPlan } from "@/components/dashboard/coach-workouts/WorkoutPlanCard";
import CreatePlanModal, { PlanFormData } from "@/components/dashboard/coach-workouts/CreatePlanModal";

interface CoachUser {
  name: string;
  userEmail: string;
  phone: string;
  image: string;
  plan: string;
}

interface Exercise {
  name: string;
  force: string;
  level: string;
  mechanic: string;
  equipment: string;
  category: string;
  trackingType: string;
}

export default function CoachWorkouts() {
  const { data: session } = useSession();
  const [clientName, setClientName] = useState<string>("");
  const { register, handleSubmit } = useForm<PlanFormData>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: workoutPlans = [], refetch: refetchPlans } = useQuery<WorkoutPlan[]>({
    queryKey: ["workout_plans"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/workout-plans?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const { data: coachUsers = [], refetch: refetchClients } = useQuery<CoachUser[]>({
    queryKey: ["coachUsers"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/coach-users?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const { data: exercises = [], refetch: refetchExercises } = useQuery<Exercise[]>({
    queryKey: ["exercises"],
    queryFn: async () => {
      const res = await axios.get(`/api/exercises?limit=0`);
      return res.data.exercises;
    },
  });

  const handleSavePlan = async (data: PlanFormData) => {
    const payload = {
      ...data,
      clientName,
      coachId: session?.user?.id,
      assignedBy: session?.user?.name,
    };
    const res = await axios.post("/api/coach/workout-plans", payload);
    if (res.data.acknowledged) {
      refetchPlans();
      refetchClients();
      refetchExercises();
      toast.success("Workout plan added successfully");
    }
    setIsModalOpen(false);
  };

  const deleteWorkoutPlan = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/coach/workout-plans/${id}`);
        toast.success("Workout plan has been deleted");
        refetchPlans();
        refetchClients();
        refetchExercises();
      } catch (error) {
        toast.error(`Failed to delete the plan: ${error}`);
      }
    }
  };

  const formatTime12h = (time24: string) => {
    const [hourStr, minute] = time24.split(":");
    if (hourStr === undefined || minute === undefined) return time24;
    let hour = Number(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  return (
    <div className="max-w-full">
      <title>Workouts | Dashboard - Flexify</title>
      <div className="mx-auto space-y-8 md:space-y-12 lg:space-y-16 max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
              Workout Programs
            </h1>
            <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
              Design, track, and scale your coaching impact.
            </p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 btn-primary">
            <Plus size={18} /> Create Plan
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workoutPlans.map((plan: WorkoutPlan, i: number) => (
            <WorkoutPlanCard
              key={plan._id}
              plan={plan}
              index={i}
              formatTime12h={formatTime12h}
              onDelete={deleteWorkoutPlan}
            />
          ))}
        </div>

        <CreatePlanModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={handleSavePlan}
          coachUsers={coachUsers}
          exercises={exercises}
          setClientName={setClientName}
        />
      </div>
    </div>
  );
}
