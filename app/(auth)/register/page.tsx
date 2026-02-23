

"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import {
  FaFacebookF,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaImage,
} from "react-icons/fa";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [role, setRole] = useState<"user" | "coach">("user");
  const [agree, setAgree] = useState<boolean>(false);

  return (
    <div
      className="min-h-screen flex items-center  justify-center px-4 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://i.ibb.co/W4SrF8Vn/pngtree-rows-of-dumbbells-in-the-gym-image-15662386.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Create <span className="text-green-400">Flexify</span> Account
          </h1>
          <p className="text-gray-400 mt-2">
            Start your fitness journey today
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-300">Name</label>
            <div className="relative mt-1">
              <FaUser className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-green-400"
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-green-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm text-gray-300">Profile Image URL</label>
            <div className="relative mt-1">
              <FaImage className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-green-400"
                placeholder="https://image-url.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-green-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Register as
            </label>
            <div className="flex gap-6 text-gray-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={role === "user"}
                  onChange={() => setRole("user")}
                />
                User
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={role === "coach"}
                  onChange={() => setRole("coach")}
                />
                Coach
              </label>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <span>
              I agree to the{" "}
              <span className="text-green-400 underline cursor-pointer">
                Terms & Conditions
              </span>
            </span>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={!agree}
            className="w-full py-3 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold transition"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Social */}
        <div className="flex gap-4">
          <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-white text-black font-medium">
            <FcGoogle />
            Google
          </button>

          <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">
            <FaFacebookF />
            Facebook
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}