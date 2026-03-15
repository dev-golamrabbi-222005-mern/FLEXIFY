"use client";

import BeforeAfterPhotos from "../../components/coach/client-progress/BeforeAfterPhotos";
import BMIProgress from "../../components/coach/client-progress/BMIProgress";
import WeightTracking from "../../components/coach/client-progress/WeightTracking";
import WorkoutCompletion from "../../components/coach/client-progress/WorkoutCompletion";

export default function ClientProgressSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10 bg-[var(--bg-primary)] px-4">

      {/* Weight Tracking */}
      <WeightTracking/>

      {/* BMI Progress */}
      <BMIProgress/>

      {/* Workout Completion */}
      <WorkoutCompletion/>

      {/* Before / After Photos */}
      <BeforeAfterPhotos/>

    </div>
  );
}