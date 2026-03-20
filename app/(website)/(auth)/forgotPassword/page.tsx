
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // এখানে API call যাবে
    console.log("Reset link sent to:", email);

    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <div
        className="w-full max-w-md p-8 rounded-2xl"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >

        {/* Title */}
        <h1
          className="text-2xl font-bold mb-2 text-center"
          style={{ color: "var(--text-primary)" }}
        >
          Forgot Password
        </h1>

        <p
          className="text-sm text-center mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          Enter your email and we will send you a password reset link
        </p>

        {sent ? (
          <div className="text-center space-y-4">

            <p
              className="text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              ✅ Reset link sent to your email.
            </p>

            <Link
              href="/login"
              className="text-sm underline"
              style={{ color: "var(--primary)" }}
            >
              Back to Login
            </Link>

          </div>
        ) : (

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>

              <label
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Email
              </label>

              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 rounded-xl outline-none"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />

            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-medium"
              style={{
                background: "var(--primary)",
                color: "white",
              }}
            >
              Send Reset Link
            </button>

            {/* Login link */}
            <p
              className="text-sm text-center"
              style={{ color: "var(--text-muted)" }}
            >
              Remember your password?{" "}
              <Link
                href="/login"
                style={{ color: "var(--primary)" }}
              >
                Login
              </Link>
            </p>

          </form>

        )}

      </div>

    </div>
  );
}