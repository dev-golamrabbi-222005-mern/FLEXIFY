"use client";

import { useState } from "react";
import { CheckCircle, XCircle, UserCheck } from "lucide-react";

type CoachApplication = {
  id: number;
  name: string;
  email: string;
  specialization: string;
  experience: string;
  status: "Pending" | "Approved" | "Rejected";
};

export default function AdminCoachApplications() {

  const [applications, setApplications] = useState<CoachApplication[]>([
    {
      id: 1,
      name: "Rahim Uddin",
      email: "rahim@example.com",
      specialization: "Strength Training",
      experience: "5 Years",
      status: "Pending",
    },
    {
      id: 2,
      name: "Karim Hasan",
      email: "karim@example.com",
      specialization: "Yoga Instructor",
      experience: "3 Years",
      status: "Pending",
    },
  ]);

  const approveCoach = (id: number) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "Approved" } : app
      )
    );
  };

  const rejectCoach = (id: number) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "Rejected" } : app
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">

      {/* PAGE HEADER */}

      <div className="flex items-center gap-3">
        <UserCheck size={28} />
        <h1 className="text-2xl md:text-3xl font-bold">
          Coach Applications
        </h1>
      </div>

      {/* APPLICATION LIST */}

      <div className="grid gap-6">

        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-[var(--card-bg)] p-6 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >

            {/* COACH INFO */}

            <div className="space-y-1">

              <h3 className="text-lg font-semibold">
                {app.name}
              </h3>

              <p className="text-sm text-gray-500">
                {app.email}
              </p>

              <p className="text-sm">
                Specialization: <span className="font-medium">{app.specialization}</span>
              </p>

              <p className="text-sm">
                Experience: <span className="font-medium">{app.experience}</span>
              </p>

              {/* STATUS */}

              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full
                ${
                  app.status === "Approved"
                    ? "bg-green-100 text-green-600"
                    : app.status === "Rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {app.status}
              </span>

            </div>

            {/* ACTION BUTTONS */}

            {app.status === "Pending" && (
              <div className="flex gap-3">

                <button
                  onClick={() => approveCoach(app.id)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <CheckCircle size={18} />
                  Accept
                </button>

                <button
                  onClick={() => rejectCoach(app.id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <XCircle size={18} />
                  Reject
                </button>

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}