

"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FaFacebookF,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex items-center justify-center --secondary px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
      style={{
    backgroundImage:
      "url('')",
  }}
      >

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold color">
            Login to <span className="text-green-400">Flexify</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Continue your fitness journey
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 py-3 rounded-lg bg-black/40 border border-white/10
                text-white outline-none focus:border-green-400"
                placeholder="you@example.com"
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
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/40 border border-white/10
                text-white outline-none focus:border-green-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-200 transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full btn-primary font-semibold py-3 rounded-lg transition"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Social Login */}
        <div className="flex gap-5">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg
            bg-white text-black font-medium hover:bg-gray-200 transition"
          >
            <FcGoogle />
            Google
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg
            bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            <FaFacebookF />
            Facebook
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="text-green-400 hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}