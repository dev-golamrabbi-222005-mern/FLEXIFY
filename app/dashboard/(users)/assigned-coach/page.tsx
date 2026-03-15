
"use client";

import Image from "next/image";
import Link from "next/link";

interface Coach {
  name: string;
  specialty: string;
  image: string;
  rating?: number;
  sessionsCompleted?: number;
  upcomingSessions?: string;
  hoursThisMonth?: string;
}

export default function AssignedCoach() {
  const coach: Coach = {
    name: "Nayeem",
    specialty: "Strength & Conditioning",
    image: "/coach1.jpg", // placeholder path
    rating: 4.5,
    sessionsCompleted: 25,
    upcomingSessions: "2 (Next: Tomorrow, 10 AM)",
    hoursThisMonth: "4.5 / 8",
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Your Assigned Coach
        </h1>
        <Link
          href="/coaches"
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          View all coaches →
        </Link>
      </div>

      {/* Main Coach Card */}
      <div className="bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Coach Image */}
            <div className="relative">
              <Image
                src={''}
                width={120}
                height={120}
                alt={coach.name}
                className="rounded-full border-4 border-[var(--primary)]"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-[var(--card-bg)] rounded-full"></span>
            </div>

            {/* Coach Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                {coach.name}
              </h2>
              <p className="text-[var(--primary)] font-medium mt-1">
                {coach.specialty}
              </p>

              {/* Rating & Stats */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(coach.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1">{coach.rating} ({coach.sessionsCompleted} sessions)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-5">
                <button className="px-5 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-medium rounded-lg transition-all duration-200">
                  Message
                </button>
                <button className="px-5 py-2 border border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-[var(--text-primary)] font-medium rounded-lg transition-all duration-200">
                  Schedule Session
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="border-t border-[var(--primary)] bg-[var(--card-bg-alt)] px-6 py-4 sm:px-8 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Upcoming sessions</p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              {coach.upcomingSessions}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Hours this month</p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              {coach.hoursThisMonth}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

