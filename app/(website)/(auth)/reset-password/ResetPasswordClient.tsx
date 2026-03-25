"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {  FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

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
      return Swal.fire("Error", "Passwords do not match!", "error");
    }

    if (password.length < 6) {
      return Swal.fire(
        "Error",
        "Password must be at least 6 characters!",
        "error"
      );
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        password,
      });

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password reset successful! Please login with your new password.",
          confirmButtonColor: "var(--primary)",
        });
        router.push("/login");
      }
    } catch (err) {
      const axiosError = err as { response?: { data: ApiErrorResponse } };
      const errorMessage =
        axiosError.response?.data?.message || "Failed to reset password.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "var(--danger)",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Invalid or expired reset link.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card-glass">
        <div className="mb-8 text-center">
          <h1
            className="text-2xl font-bold mb-2"
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
                className="input-style pl-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-accent"
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
                className="input-style pl-12"
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
