import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const weightData = [
  { week: "W1", weight: 85 },
  { week: "W2", weight: 83 },
  { week: "W3", weight: 82 },
  { week: "W4", weight: 80 },
  { week: "W5", weight: 78 },
];

const WeightTracking = () => {
    return (
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
        <h3 className="mb-4 font-semibold">Weight Tracking</h3>

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
    );
};

export default WeightTracking;