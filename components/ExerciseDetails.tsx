"use client";

import Image from "next/image";

interface Exercise {
  name: string;
  force: string;
  level: string;
  mechanic: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
  id: string;
}

export default function ExerciseDetails({ exercise }: { exercise: Exercise }) {
  return (
    <div className="max-w-6xl p-6 mx-auto bg-(--bg-secondary) shadow-xl rounded-2xl md:p-10">
      
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-(--text-primary) md:text-4xl">
            {exercise.name}
          </h1>
          <p className="mt-2 text-(--text-secondary) capitalize">
            {exercise.category} • {exercise.mechanic}
          </p>
        </div>

        <span className={`px-4 py-2 text-sm font-medium text-(--primary) capitalize bg-(--primary)/10 rounded-full`}>
          {exercise.level}
        </span>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2">
        {exercise.images.map((img, index) => (
          <div key={index} className="relative w-full overflow-hidden bg-(--bg-primary) h-80 rounded-xl">
            <Image
              src={img}
              alt={exercise.name}
              fill
              className="object-cover duration-300 hover:scale-110"
            />
          </div>
        ))}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-3">
        <InfoCard title="Force" value={exercise.force} />
        <InfoCard title="Equipment" value={exercise.equipment} />
        <InfoCard title="Mechanic" value={exercise.mechanic} />
      </div>

      {/* Muscles */}
      <div className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-(--text-primary)">
          Muscles Worked
        </h2>

        <div className="mb-4">
          <h3 className="mb-2 font-medium text-(--text-primary)">Primary</h3>
          <div className="flex flex-wrap gap-2">
            {exercise.primaryMuscles.map((muscle, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm text-blue-700 capitalize bg-blue-100 rounded-full"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {exercise.secondaryMuscles.length > 0 && (
          <div>
            <h3 className="mb-2 font-medium text-(--text-primary)">Secondary</h3>
            <div className="flex flex-wrap gap-2">
              {exercise.secondaryMuscles.map((muscle, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm text-purple-700 capitalize bg-purple-100 rounded-full"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div>
        <h2 className="mb-6 text-2xl font-semibold text-(--text-primary)">
          How To Perform
        </h2>

        <ol className="space-y-4">
          {exercise.instructions.map((step, index) => (
            <li
              key={index}
              className="flex gap-4 p-4 shadow-sm bg-(--bg-primary) rounded-xl items-center"
            >
              <span className="flex items-center justify-center size-8 text-sm font-bold text-white bg-(--primary) rounded-full">
                {index + 1}
              </span>
              <p className="text-(--text-primary)">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-6 text-center shadow-sm bg-(--bg-primary) rounded-xl">
      <h3 className="mb-2 text-sm text-(--text-secondary) uppercase">{title}</h3>
      <p className="text-lg font-semibold text-(--text-primary) capitalize">
        {value}
      </p>
    </div>
  );
}