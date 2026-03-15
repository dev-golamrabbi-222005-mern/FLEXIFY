"use client";

import Image from "next/image";
import { MapPin, Star, Calendar, Dumbbell, Award } from "lucide-react";

export default function CoachDetails() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-6">

          {/* Coach Header */}
          <div className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row gap-6">

            <Image
              src="/coach.jpg"
              alt="coach"
              width={150}
              height={150}
              className="rounded-xl object-cover"
            />

            <div className="space-y-2">

              <h2 className="text-2xl font-bold">
                Sara Islam
              </h2>

              <div className="flex items-center text-gray-500 gap-2">
                <MapPin size={16} />
                Chittagong, Bangladesh
              </div>

              <div className="flex items-center gap-4">

                <div className="flex items-center text-yellow-500 gap-1">
                  <Star size={16} />
                  4.9
                </div>

                <div className="flex items-center text-green-600 gap-1">
                  <Dumbbell size={16} />
                  5 Years Experience
                </div>

              </div>

              <div className="flex gap-2 mt-3 flex-wrap">

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Yoga
                </span>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Meditation
                </span>

              </div>

            </div>

          </div>

          {/* About Coach */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="text-lg font-semibold mb-3">
              About Coach
            </h3>

            <p className="text-gray-600 leading-relaxed">
              Certified yoga instructor with 5 years of experience helping people
              achieve better flexibility, mental peace and overall health.
              Specialized in beginner friendly yoga and meditation training.
            </p>

          </div>

          {/* Certifications */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award size={18} /> Certifications
            </h3>

            <ul className="space-y-2 text-gray-600">

              <li>NASM Certified Personal Trainer</li>
              <li>Yoga Alliance Certification</li>
              <li>Advanced Meditation Training</li>

            </ul>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* Pricing Card */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="text-xl font-semibold mb-4">
              Pricing
            </h3>

            <div className="text-3xl font-bold text-green-600">
              $40 / Month
            </div>

            <p className="text-gray-500 mt-1">
              Or $30 per session
            </p>

            <button className="w-full mt-5 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
              Book Session
            </button>

          </div>

          {/* Availability */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar size={18} />
              Available Days
            </h3>

            <div className="flex flex-wrap gap-2">

              <span className="bg-gray-100 px-3 py-1 rounded">
                Mon
              </span>

              <span className="bg-gray-100 px-3 py-1 rounded">
                Wed
              </span>

              <span className="bg-gray-100 px-3 py-1 rounded">
                Fri
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}