import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm h-full flex flex-col animate-pulse">
      <div className="relative aspect-square bg-[var(--bg-primary)] opacity-50" />

      <div className="p-5 flex flex-col flex-grow space-y-4">
        <div className="space-y-2">
          <div className="h-5 bg-[var(--bg-primary)] rounded-md w-full" />
          <div className="h-5 bg-[var(--bg-primary)] rounded-md w-2/3" />
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex gap-2">
            <div className="h-6 bg-[var(--bg-primary)] rounded-full w-16" />
            <div className="h-6 bg-[var(--bg-primary)] rounded-full w-20" />
          </div>

          <div className="h-3 bg-[var(--bg-primary)] rounded-md w-24 pt-2" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
