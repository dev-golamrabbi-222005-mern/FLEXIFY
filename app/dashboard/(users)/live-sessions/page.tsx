"use client";

import { Video, Clock, User } from "lucide-react";

export default function LiveSessionPage() {

  const meetLink = "https://meet.google.com/pwh-fetr-kfx";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-3 sm:p-4 md:p-6">

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-[var(--card-bg)] rounded-2xl shadow-xl p-5 sm:p-6 md:p-8">

        {/* Header */}

        <div className="flex items-center justify-between mb-5 md:mb-6">

          <h2 className="text-lg md:text-xl font-semibold">
            Live Coaching Session
          </h2>

          <span className="bg-red-500/20 text-red-500 px-2 md:px-3 py-1 rounded-full text-xs font-semibold">
            LIVE
          </span>

        </div>

        {/* Coach Info */}

        <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">

          <img
            src="https://i.ibb.co.com/Pv0wP422/user.png"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
          />

          <div>

            <p className="font-semibold text-sm md:text-base">
              Coach John
            </p>

            <p className="text-xs md:text-sm text-gray-400 flex items-center gap-1">
              <User size={14} /> Personal Trainer
            </p>

          </div>

        </div>

        {/* Session Details */}

        <div className="bg-gray-500/10 rounded-xl p-3 md:p-4 mb-5 md:mb-6">

          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">

            <Clock size={16} />

            Today • 10:00 AM - 11:00 AM

          </div>

          <p className="mt-2 text-xs md:text-sm text-gray-400">
            Join the live training session with your coach and complete your
            workout together.
          </p>

        </div>

        {/* Join Button */}

        <a
          href={meetLink}
          target="_blank"
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition text-white py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base"
        >

          <Video size={18} />

          Join Video Call

        </a>

        {/* Tips */}

        <p className="text-xs text-gray-400 text-center mt-4">
          Make sure your camera and microphone are ready before joining.
        </p>

      </div>

    </div>
  );
}