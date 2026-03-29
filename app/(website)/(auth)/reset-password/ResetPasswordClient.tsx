"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {  FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

interface ApiErrorResponse {
  message: string;
}

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters!");
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        password,
      });

      if (response.status === 200) {
        await toast.success("Password reset successful! Please login with your new password.");
        router.push("/login");
      }
    } catch (err) {
      const axiosError = err as { response?: { data: ApiErrorResponse } };
      const errorMessage =
        axiosError.response?.data?.message || "Failed to reset password.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Invalid or expired reset link.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md card-glass">
        <div className="mb-8 text-center">
          <h1
            className="mb-2 text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Reset Password
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Enter a new password for{" "}
            <span className="text-accent">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label>New Password</label>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 input-style"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-400 right-4 top-4 hover:text-accent"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label>Confirm Password</label>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-12 input-style"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
