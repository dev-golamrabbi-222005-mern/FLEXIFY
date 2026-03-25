


"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { ObjectId } from "mongodb";

// const nutritionPlans = [
//   { id: "1", name: "High Protein Bulk", calories: "3200 cal", protein: "180g", carbs: "350g", fat: "90g", clients: 6, status: "Active" },
//   { id: "2", name: "Lean Cut Diet", calories: "1800 cal", protein: "150g", carbs: "180g", fat: "50g", clients: 4, status: "Active" },
//   { id: "3", name: "Balanced Maintenance", calories: "2500 cal", protein: "130g", carbs: "280g", fat: "80g", clients: 5, status: "Active" },
//   { id: "4", name: "Keto Plan", calories: "2000 cal", protein: "120g", carbs: "30g", fat: "150g", clients: 3, status: "Draft" },
// ];

export default function CoachNutrition() {
  const {data: nutritionPlans = [], refetch} = useQuery({
    queryKey: ["nutrition_plans"],
    queryFn: async() => {
      const res = await axios.get("/api/coach/nutrition-plans");
      return res.data;
    }
  });

  const deleteNutritionPlan = async(id: ObjectId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/coach/nutrition-plans/${id}`);
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: "Nutrition plan has been deleted",
          icon: "success"
        });
      }
    });
  }

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

          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
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
              ].map((m) => (

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

              ))}

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