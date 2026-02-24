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
    <div className="flex items-center justify-center min-h-screen px-4 --secondary">
      <div className="w-full max-w-md p-8 border bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl"
      style={{
    backgroundImage:
      "url('')",
  }}
      >

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold color">
            Login to <span className="text-(--primary)">Flexify</span>
          </h1>
          <p className="mt-2 text-gray-400">
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
                text-white outline-none focus:border-(--primary)"
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
                text-white outline-none focus:border-(--primary)"
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
            className="w-full py-3 font-semibold transition rounded-lg btn-primary"
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
            className="flex items-center justify-center w-full gap-3 py-3 font-medium text-black transition bg-white rounded-lg hover:bg-gray-200"
          >
            <FcGoogle />
            Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center w-full gap-3 py-3 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <FaFacebookF />
            Facebook
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <Link href="/register" className="text-(--primary) hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
