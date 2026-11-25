"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Target, Flame } from "lucide-react";
import { Exercise, Tab } from "./types";
import { ExerciseImageViewer } from "./ExerciseImageViewer";
import { DetailHeader } from "./DetailHeader";
import { DetailBottomBar } from "./DetailBottomBar";
import { InstructionsTab } from "./InstructionsTab";
import { MusclesTab } from "./MusclesTab";
import { EquipmentTab } from "./EquipmentTab";
import { HistoryTab } from "./HistoryTab";

export function DetailView({
  ex,
  targetSets,
  targetReps,
  targetWeight,
  onEditGoal,
  onStart,
}: {
  ex: Exercise;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  onEditGoal: () => void;
  onStart: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("Instructions");
  const tabs: Tab[] = ["Instructions", "Muscles", "Equipment", "History"];

  return (
    <div className="mx-auto my-10 md:my-12 lg:my-16 max-w-7xl px-4 md:px-6">
      <DetailHeader
        ex={ex}
        targetSets={targetSets}
        targetReps={targetReps}
        onEditGoal={onEditGoal}
      />

      {/* Image + Stats — 12-col grid */}
      <div className="grid grid-cols-12 gap-5 mb-5 items-stretch">
        <div className="col-span-12 lg:col-span-9">
          <ExerciseImageViewer images={ex.images} name={ex.name} />
        </div>

        <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 h-full">
          {[
            { icon: Target, label: "Sets", val: targetSets, unit: "" },
            { icon: Zap, label: "Reps", val: targetReps, unit: " / set" },
            { icon: Flame, label: "Weight", val: targetWeight, unit: " kg" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-xl p-3 text-center flex flex-col items-center justify-center"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <s.icon
                size={20}
                className="mx-auto mb-1"
                style={{ color: "var(--primary)" }}
              />
              <p
                className="font-black text-xl leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                {s.val}
                <span
                  className="text-xl font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {s.unit}
                </span>
              </p>
              <p
                className="text-[15px] mt-0.5 font-bold uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b mb-5 overflow-x-auto"
        style={{ borderColor: "var(--border-color)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all
              ${activeTab === tab
                ? "border-[var(--primary)] font-black"
                : "border-transparent hover:text-[var(--text-primary)]"
              }`}
            style={{
              color:
                activeTab === tab ? "var(--primary)" : "var(--text-secondary)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Instructions" && (
            <InstructionsTab
              instructions={ex.instructions}
              primaryMuscles={ex.primaryMuscles}
              secondaryMuscles={ex.secondaryMuscles}
              equipment={ex.equipment}
            />
          )}
          {activeTab === "Muscles" && (
            <MusclesTab
              primaryMuscles={ex.primaryMuscles}
              secondaryMuscles={ex.secondaryMuscles}
            />
          )}
          {activeTab === "Equipment" && (
            <EquipmentTab equipment={ex.equipment} />
          )}
          {activeTab === "History" && <HistoryTab />}
        </motion.div>
      </AnimatePresence>

      <DetailBottomBar
        targetSets={targetSets}
        targetReps={targetReps}
        targetWeight={targetWeight}
        onEditGoal={onEditGoal}
        onStart={onStart}
      />
    </div>
  );
}
