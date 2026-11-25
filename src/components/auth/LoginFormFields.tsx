"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export function LoginFormFields({
  onSubmit,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {/* Email */}
      <div>
        <label className="text-sm text-gray-300">Email</label>
        <div className="relative mt-1">
          <FaEnvelope className="absolute left-3 top-4.5 text-gray-400" />
          <input
            type="email"
            name="email"
            required
            className="w-full pl-10 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-(--primary)"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="text-sm text-gray-300">Password</label>
        <div className="relative mt-1">
          <FaLock className="absolute text-gray-400 left-3 top-4" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-(--primary)"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute text-gray-400 transition cursor-pointer right-3 top-4 hover:text-gray-200"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="flex justify-end mt-2 mr-1">
        <Link
          href="/forgotPassword"
          title="Forgot Password"
          className="text-xs text-gray-400 hover:text-(--primary)"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 font-semibold transition rounded-lg btn-primary"
      >
        Login
      </button>
    </form>
  );
}
