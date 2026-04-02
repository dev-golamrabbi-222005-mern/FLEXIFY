"use client";

import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Users,
  Dumbbell,
  Calendar,
  MoreVertical,
  X,
  Clock,
  UserPen,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

interface WorkoutPlan {
  _id: string;
  exerciseName: string;
  clientEmail: string;
  clientName: string;
  date: string;
  time: string;
  assignedBy: string;
}

interface PlanFormData {
  coachId: string;
  exerciseName: string;
  clientEmail: string;
  clientName: string;
  date: string;
  time: string;
  assignedBy: string;
}

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
  const {register, handleSubmit} = useForm<PlanFormData>();
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSavePlan = async(data: PlanFormData) => {
    const payload = {
      ...data,
      clientName,
      coachId: session?.user?.id,
      assignedBy: session?.user?.name,
    }
    const res = await axios.post("/api/coach/workout-plans", payload);
    if(res.data.acknowledged){
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
      <div className="mx-auto space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
              Workout Programs
            </h1>
            <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
              Design, track, and scale your coaching impact.
            </p>
          </div>

          <button
            onClick={openModal}
            className="flex items-center gap-2 btn-primary"
          >
            <Plus size={18} />
            Create Plan
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workoutPlans.map((plan: WorkoutPlan, i: number) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card-glass group flex flex-col justify-between hover:scale-[1.02] transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {plan.exerciseName}
                  </h3>
                </div>

                <button
                  className="p-2 transition rounded-lg hover:bg-gray-200/20"
                  style={{ color: "var(--text-muted)" }}
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="mb-5">
                <div
                  className="p-3 border rounded-xl"
                  style={{
                    borderColor: "var(--border-color)",
                    background: "var(--bg-secondary)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 text-xs font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Users size={14} />
                    Client
                  </div>
                  <p
                    className="mt-1 text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {plan.clientName}
                  </p>
                  <p className="text-sm text-(--text-muted)">
                    {plan.clientEmail}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-2 mb-5 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <Calendar size={16} style={{ color: "var(--primary)" }} />
                Date:
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {plan.date}
                </span>
              </div>

              <div
                className="flex items-center gap-2 mb-5 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <Clock size={16} style={{ color: "var(--primary)" }} />
                Time:
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {formatTime12h(plan.time)}
                </span>
              </div>

              <div
                className="flex items-center gap-2 mb-5 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <UserPen size={16} style={{ color: "var(--primary)" }} />
                Assigned By:
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {plan.assignedBy}
                </span>
              </div>

              <div
                className="flex gap-2 pt-4 border-t"
                style={{ borderColor: "var(--border-color)" }}
              >
                <button className="flex items-center justify-center flex-1 gap-1 text-xs btn-secondary">
                  <Edit size={14} /> Edit
                </button>

                <button className="flex items-center justify-center flex-1 gap-1 text-xs btn-secondary">
                  <Copy size={14} /> Copy
                </button>

                <button
                  onClick={() => deleteWorkoutPlan(plan._id)}
                  className="p-2 transition rounded-xl hover:bg-red-500/10"
                  style={{ color: "var(--danger)" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-lg p-8 border shadow-2xl bg-(--bg-primary) rounded-3xl border-white/50 backdrop-saturate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <Dumbbell size={24} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-(--text-primary)">
                    Create Workout Plan
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 transition-colors rounded-full hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(handleSavePlan)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar size={16} className="text-blue-500" />
                      Date
                    </label>
                    <input
                      {...register("date")}
                      type="date"
                      className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar size={16} className="text-blue-500" />
                      Time
                    </label>
                    <input
                      {...register("time")}
                      type="time"
                      className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Users size={16} className="text-green-500" />
                    Client Name
                  </label>
                  <select
                    {...register("clientEmail")}
                    onChange={(e) =>
                      setClientName(
                        e.target.options[e.target.selectedIndex].outerText,
                      )
                    }
                    className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  >
                    <option value="">Select client</option>
                    {coachUsers.map((user) => (
                      <option key={user.userEmail} value={user.userEmail}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Dumbbell size={16} className="text-purple-500" />
                    Exercise Name
                  </label>
                  <select
                    {...register("exerciseName")}
                    className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  >
                    <option value="">Select exercise</option>
                    {exercises.map((exercise) => (
                      <option key={exercise.name} value={exercise.name}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-(--primary) hover:bg-(--primary-dark) text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    Save Plan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
