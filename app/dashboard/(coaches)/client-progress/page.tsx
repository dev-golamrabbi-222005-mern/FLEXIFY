"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const weightData = [
  { week: "W1", weight: 85 },
  { week: "W2", weight: 83 },
  { week: "W3", weight: 82 },
  { week: "W4", weight: 80 },
  { week: "W5", weight: 78 },
];

export default function ClientProgressSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10 bg-[var(--bg-primary)] px-4">

      {/* Weight Tracking */}
      <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-4">Weight Tracking</h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weightData}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BMI Progress */}
      <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-4">BMI Progress</h3>

        <div className="space-y-4">

          <div>
            <p className="text-sm text-gray-500">Current BMI</p>
            <p className="text-3xl font-bold">24.5</p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-green-500 h-3 rounded-full w-[65%]"></div>
          </div>

          <p className="text-sm text-gray-400">
            Healthy Range: 18.5 - 24.9
          </p>

        </div>
      </div>

      {/* Workout Completion */}
      <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-4">Workout Completion</h3>

        <div className="flex items-center gap-6">

          <div className="text-4xl font-bold text-green-500">
            78%
          </div>

          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full w-[78%]"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Before / After Photos */}
      <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-4">Progress Photos</h3>

        <div className="flex gap-4">

          <div>
            <p className="text-xs text-gray-500 mb-2">Before</p>
            <img
              src="https://images.unsplash.com/photo-1599058917212-d750089bc07e"
              className="rounded-lg w-40 h-40 object-cover"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">After</p>
            <img
              src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61"
              className="rounded-lg w-40 h-40 object-cover"
            />
          </div>

        </div>
      </div>

    </div>
  );
}