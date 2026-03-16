


"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const nutritionPlans = [
  { id: "1", name: "High Protein Bulk", calories: "3200 cal", protein: "180g", carbs: "350g", fat: "90g", clients: 6, status: "Active" },
  { id: "2", name: "Lean Cut Diet", calories: "1800 cal", protein: "150g", carbs: "180g", fat: "50g", clients: 4, status: "Active" },
  { id: "3", name: "Balanced Maintenance", calories: "2500 cal", protein: "130g", carbs: "280g", fat: "80g", clients: 5, status: "Active" },
  { id: "4", name: "Keto Plan", calories: "2000 cal", protein: "120g", carbs: "30g", fat: "150g", clients: 3, status: "Draft" },
];

export default function CoachNutrition() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1
            className="text-xl sm:text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Nutrition Plans
          </h1>

          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            Custom diet and nutrition guidance for your clients
          </p>
        </div>

        <button className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus size={16} />
          Create Plan
        </button>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {nutritionPlans.map((plan, i) => (

          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-glass p-5"
          >

            {/* Top */}
            <div className="flex justify-between items-start mb-4">

              <div>
                <h3
                  className="font-semibold text-base sm:text-lg"
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
                className="text-xs px-2 py-1 rounded-full font-semibold"
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">

              {[
                { label: "Calories", value: plan.calories },
                { label: "Protein", value: plan.protein },
                { label: "Carbs", value: plan.carbs },
                { label: "Fat", value: plan.fat },
              ].map((m) => (

                <div
                  key={m.label}
                  className="text-center p-3 rounded-xl"
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

              <button className="flex-1 btn-secondary flex items-center justify-center gap-1 text-xs">
                <Edit size={14} />
                Edit
              </button>

              <button
                className="p-2 rounded-xl hover:bg-red-500/10 transition"
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