"use client";

import { Eye, Dumbbell, Utensils, MessageCircle } from "lucide-react";

export default function ClientManagementTable() {
  const clients = [
    {
      id: 1,
      name: "Rahim Uddin",
      goal: "Weight Loss",
      progress: 60,
      status: "Active",
    },
    {
      id: 2,
      name: "Karim Hasan",
      goal: "Muscle Gain",
      progress: 40,
      status: "Active",
    },
    {
      id: 3,
      name: "Jony Islam",
      goal: "Fat Burn",
      progress: 80,
      status: "Completed",
    },
  ];

  return (
    <div className="mt-10 max-w-7xl mx-auto bg-[var(--bg-primary)] px-4 rounded-2xl shadow overflow-x-auto">
      <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Client Management</h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-[var(--text-primary)] text-sm">
            <th className="py-3">Client Name</th>
            <th>Goal</th>
            <th>Progress</th>
            <th>Status</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b hover:bg-[var(--primary)] transition">

              {/* Name */}
              <td className="py-4 font-medium px-2 text-[var(--text-primary)]">{client.name}</td>

              {/* Goal */}
              <td>{client.goal}</td>

              {/* Progress */}
              <td>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${client.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">
                  {client.progress}%
                </span>
              </td>

              {/* Status */}
              <td>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    client.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {client.status}
                </span>
              </td>

              {/* Actions */}
              <td className="flex justify-end gap-3 py-4">

                <button className="text-blue-500 hover:scale-110 transition">
                  <Eye size={18} />
                </button>

                <button className="text-orange-500 hover:scale-110 transition">
                  <Dumbbell size={18} />
                </button>

                <button className="text-green-500 hover:scale-110 transition">
                  <Utensils size={18} />
                </button>

                <button className="text-purple-500 hover:scale-110 transition">
                  <MessageCircle size={18} />
                </button>

              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}