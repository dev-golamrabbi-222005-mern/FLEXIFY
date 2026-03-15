"use client";
import { CheckCircle, XCircle, UserCheck } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

interface CoachApplication {
  _id: string;
  fullName: string;
  email: string;
  specialties: string;
  experienceYears: number;
  status: "pending" | "approved" | "rejected";
}

export default function AdminCoachApplications() {

const { data: applications = [], refetch } = useQuery<CoachApplication[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/coaches?status=pending");
      return res.data;
    }
  });

  const handleStatusChange = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const response = await axios.patch("/api/admin/coaches/status", {
        id,
        status: newStatus
      });

      if (response.data.success) {
        refetch(); 
        Swal.fire(
          newStatus === "approved" ? "Approved!" : "Rejected!",
          `The coach application has been ${newStatus}.`,
          "success"
        );
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Failed to update status. Please try again.", "error");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 bg-[var(--bg-primary)] min-h-screen">

      {/* PAGE HEADER */}
      <div className="flex items-center gap-3">
        <UserCheck size={28} />
        <h1 className="text-2xl font-bold md:text-3xl">Coach Applications</h1>
      </div>

      {/* APPLICATION GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-[var(--card-bg)] p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col justify-between gap-4"
          >

            {/* COACH INFO */}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{app.fullName}</h3>
              <p className="text-sm text-gray-500">{app.email}</p>
              <p className="text-sm">
                Specialization: <span className="font-medium">{app.specialties}</span>
              </p>
              <p className="text-sm">
                Experience: <span className="font-medium">{app.experienceYears} Years</span>
              </p>

              {/* STATUS BADGE */}
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                  app.status === "approved"
                    ? "bg-green-100 text-green-600"
                    : app.status === "rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {app.status}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            {app.status === "pending" && (
              <div className="flex flex-wrap gap-3 mt-3">
                <button
                  onClick={() => handleStatusChange(app._id, "approved")}
                  className="flex items-center gap-2 px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <CheckCircle size={18} />
                  Accept
                </button>

                <button
                  onClick={() => handleStatusChange(app._id, "rejected")}
                  className="flex items-center gap-2 px-4 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
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