"use client";
import React from "react";

interface CountItem {
  _id: string;
  count: number;
}

interface Stats {
  muscleCounts?: CountItem[];
  equipmentCounts?: CountItem[];
  levelCounts?: CountItem[];
}

interface FilterSectionProps {
  levels: string[];
  equipments: string[];
  bodyParts: string[];
  selectedLevel: string;
  setSelectedLevel: (v: string) => void;
  selectedEquipment: string;
  setSelectedEquipment: (v: string) => void;
  selectedBodyPart: string;
  setSelectedBodyPart: (v: string) => void;
  stats: Stats | undefined;
  initialData: { part: string; count: number }[];
  isFilterActive: boolean;
}

export const FilterSection = ({
  levels, equipments, bodyParts,
  selectedLevel, setSelectedLevel,
  selectedEquipment, setSelectedEquipment,
  selectedBodyPart, setSelectedBodyPart,
  stats, initialData, isFilterActive
}: FilterSectionProps) => {

  // dynamic count logic
  const getCount = (type: "muscle" | "gear" | "level", name: string) => {
    
    if (type === "muscle") {
      if (!isFilterActive) {
        return initialData.find((g) => g.part === name)?.count || 0;
      }
      if (name === "back") {
        const backParts = ["back", "lats", "middle back", "lower back"];
        return stats?.muscleCounts
          ?.filter((m) => backParts.includes(m._id))
          ?.reduce((acc, curr) => acc + curr.count, 0) || 0;
      }
      return stats?.muscleCounts?.find((m) => m._id === name)?.count || 0;
    }

    if (type === "gear") {
      return stats?.equipmentCounts?.find((e) => e._id === name)?.count || 0;
    }

    if (type === "level") {
      return stats?.levelCounts?.find((l) => l._id === name)?.count || 0;
    }

    return 0;
  };

  return (
    <div className="space-y-4">
      {/* Level Filter */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar items-center py-1">
        <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">Level:</span>
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setSelectedLevel(selectedLevel === l ? "" : l)}
            className={`whitespace-nowrap px-5 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
              selectedLevel === l ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]"
            }`}
          >
            {l} <span className="bg-black/10 px-1 rounded ml-1 text-[9px]">{getCount("level", l)}</span>
          </button>
        ))}
      </div>

      {/* Equipment Filter */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar items-center py-1">
        <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">Gear:</span>
        {equipments.map((eq) => (
          <button
            key={eq}
            onClick={() => setSelectedEquipment(selectedEquipment === eq ? "" : eq)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
              selectedEquipment === eq ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]"
            }`}
          >
            {eq} <span className="bg-black/10 px-1 rounded ml-1 text-[9px]">{getCount("gear", eq)}</span>
          </button>
        ))}
      </div>

      {/* Muscle Filter */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar items-center py-1">
        <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">Muscle:</span>
        {bodyParts.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedBodyPart(selectedBodyPart === p ? "" : p)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
              selectedBodyPart === p ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]"
            }`}
          >
            {p} <span className="bg-black/10 px-1 rounded ml-1 text-[9px]">{getCount("muscle", p)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};