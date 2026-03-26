"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

// 1. Define the interface for your plan
interface NutritionPlan {
  _id: string; // Use string for the frontend ID
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  clients: number;
  status: "Active" | "Draft";
}

export default function CoachNutrition() {
  // 2. Add the type to useQuery
  const { data: nutritionPlans = [], refetch } = useQuery<NutritionPlan[]>({
    queryKey: ["nutrition_plans"],
    queryFn: async () => {
      const res = await axios.get("/api/coach/nutrition-plans");
      return res.data;
    },
  });

  // 3. Use 'string' for the ID on the frontend instead of ObjectId
  const deleteNutritionPlan = async (id: string) => {
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
        await axios.delete(`/api/coach/nutrition-plans/${id}`);
        await refetch(); // Await refetch to ensure UI updates after deletion
        Swal.fire("Deleted!", "Nutrition plan has been deleted", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete the plan", "error");
      }
    }
  };

  return (
    <div className="px-4 mx-auto space-y-8 max-w-7xl sm:px-6">
        <title>Nutrition | Dashboard - Flexify</title>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-xl font-bold sm:text-2xl"
            style={{ color: "var(--text-primary)" }}
          >
            Nutrition Plans
          </h1>

          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Custom diet and nutrition guidance for your clients
          </p>
        </div>

        <button className="flex items-center justify-center w-full gap-2 btn-primary sm:w-auto">
          <Plus size={16} />
          Create Plan
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {nutritionPlans.map((plan, i) => (
          <motion.div
            key={plan._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 card-glass"
          >
            {/* Top */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3
                  className="text-base font-semibold sm:text-lg"
                  style={{ color: "var(--text-primary)" }}
                >
                  {plan.name}
                </h3>

                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {plan.clients} clients assigned
                </span>
              </div>

              <span
                className="px-2 py-1 text-xs font-semibold rounded-full"
                style={{
                  background:
                    plan.status === "Active"
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(148,163,184,0.15)",
                  color:
                    plan.status === "Active"
                      ? "var(--primary)"
                      : "var(--text-muted)",
                }}
              >
                {plan.status}
              </span>
            </div>

            {/* Nutrition Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5 sm:grid-cols-4">
              {[
                { label: "Calories", value: plan.calories },
                { label: "Protein", value: plan.protein },
                { label: "Carbs", value: plan.carbs },
                { label: "Fat", value: plan.fat },
              ].map(
                (
                  m, // TypeScript can now infer 'm' because the array is defined locally
                ) => (
                  <div
                    key={m.label}
                    className="p-3 text-center rounded-xl"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {m.value}
                    </p>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {m.label}
                    </span>
                  </div>
                ),
              )}
            </div>

            {/* Actions */}
            <div
              className="flex gap-2 pt-4 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <button className="flex items-center justify-center flex-1 gap-1 text-xs btn-secondary">
                <Edit size={14} />
                Edit
              </button>

              <button
                onClick={() => deleteNutritionPlan(plan._id)}
                className="p-2 transition rounded-xl hover:bg-red-500/10"
                style={{ color: "var(--danger)" }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
