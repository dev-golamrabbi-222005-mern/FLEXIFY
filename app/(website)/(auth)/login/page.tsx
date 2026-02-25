"use client";

import { useState, FormEvent, JSX } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { signIn } from "next-auth/react";
import SocialButtons from "@/components/auth/SocialButtons";

export default function LoginPage(): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get("callbackUrl") || "/";

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const form = e.currentTarget;

    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value;

    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;

    if (!email || !password) {
      await Swal.fire("Error", "Email and password are required", "error");
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (!result || !result.ok) {
      await Swal.fire(
        "Error",
        "Email or password not matched. Try Google login or register.",
        "error"
      );
      return;
    }

    await Swal.fire("Success", "Login successful", "success");
    router.push(callbackUrl);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 bg-center bg-cover" style={{ backgroundImage: "url('https://i.ibb.co.com/1f17SJk4/gym-backgound.jpg')" }}>
      <div className="absolute inset-0 h-full bg-black/70"></div>
      <div
        className="w-full max-w-md p-8 border bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white color">
            Login to <span className="text-(--primary)">Flexify</span>
          </h1>
          <p className="mt-2 text-gray-400">
            Continue your fitness journey
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                name="email"
                className="w-full pl-10 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-(--primary)"
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
                name="password"
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-(--primary)"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
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
        <SocialButtons/>

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