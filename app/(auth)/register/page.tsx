

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
      className="relative flex items-center justify-center min-h-screen px-4 bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://i.ibb.co/W4SrF8Vn/pngtree-rows-of-dumbbells-in-the-gym-image-15662386.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md p-8 border bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Create <span className="text-(--primary)">Flexify</span> Account
          </h1>
          <p className="mt-2 text-gray-400">
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
                className="w-full py-3 pl-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-green-400"
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
                className="w-full py-3 pl-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-green-400"
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
                className="w-full py-3 pl-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-green-400"
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
                className="w-full py-3 pl-10 pr-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-green-400"
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
            <label className="block mb-2 text-sm text-gray-300">
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
              <span className="text-(--primary) underline cursor-pointer">
                Terms & Conditions
              </span>
            </span>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={!agree}
            className="w-full py-3 font-semibold text-black transition rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
          <button className="flex items-center justify-center w-full gap-3 py-3 font-medium text-black bg-white rounded-lg">
            <FcGoogle />
            Google
          </button>

          <button className="flex items-center justify-center w-full gap-3 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <FaFacebookF />
            Facebook
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-(--primary) hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
