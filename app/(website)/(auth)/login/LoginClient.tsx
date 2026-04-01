"use client";

import { useState, FormEvent, JSX } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { signIn } from "next-auth/react";
import SocialButtons from "@/components/auth/SocialButtons";
import { toast } from "react-toastify";

export default function LoginClient(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [isMockLoading, setIsMockLoading] = useState(false);

  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get("callbackUrl") ?? "/";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    if (!email || !password) {
      await toast.error("Email and password are required");
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.ok) {
      await toast.success("Welcome back!");
      router.push("/dashboard");
    }
  };

  const handleMockLogin = async (email: string, pass: string) => {
    setIsMockLoading(true); 
  
  try {
    const result = await signIn("credentials", {
      email,
      password: pass,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.ok) {
      toast.success("Mock Login Successful!");
      router.push("/dashboard");
    } else {
      toast.error(result?.error || "User not found. Please try again.");
    }
  } catch (error) {
    toast.error("Something went wrong with the server.");
  } finally {
    setIsMockLoading(false); 
  }
  };
  return (
    <div
      className="relative flex items-center justify-center min-h-screen px-4 bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://i.ibb.co.com/1f17SJk4/gym-backgound.jpg')",
      }}
    >
      {" "}
      <div className="absolute inset-0 h-full bg-black/70"></div>{" "}
      <div className="w-full max-w-md p-8 border bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
        {" "}
        {/* Header */}{" "}
        <div className="mb-8 text-center">
          {" "}
          <h1 className="text-3xl font-bold text-white color">
            {" "}
            Login to <span className="text-(--primary)">Flexify</span>{" "}
          </h1>{" "}
          <p className="mt-2 text-gray-400"> Continue your fitness journey </p>{" "}
        </div>{" "}
        {/* Form */}{" "}
        <div className="grid grid-cols-3 gap-3 mt-6 mb-4">
          {/* User Mock  */}
          <button
          disabled={isMockLoading}
            type="button"
            onClick={() => handleMockLogin("user@flexify.com", "User@Flexify")}
            className={` px-2 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${isMockLoading ? 'opacity-70 cursor-wait' : ''}`}
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "var(--primary)",
              border: "1px solid var(--primary)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
              e.currentTarget.style.color = "var(--primary)";
            }}
          >
           {isMockLoading ? "Processing..." : "User Login"} 
          </button>

          {/* Coach Mock  */}
          <button
            type="button"
            disabled={isMockLoading}
            onClick={() =>
              handleMockLogin("coach@flexify.com", "Coach@Flexify1")
            }
            className={`px-2 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${isMockLoading ? 'opacity-70 cursor-wait' : ''}`}
            style={{
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              color: "var(--secondary)",
              border: "1px solid var(--secondary)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "var(--secondary)";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.1)";
              e.currentTarget.style.color = "var(--secondary)";
            }}
          >
    {isMockLoading ? "Processing..." : " Coach Login"} 

          </button>

          {/* Admin Mock  */}
          <button
            type="button"
            disabled={isMockLoading}
            onClick={() =>
              handleMockLogin("admin@flexify.com", "Admin@Flexify")
            }
            className={`px-2 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${isMockLoading ? 'opacity-70 cursor-wait' : ''}`}
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "var(--danger)",
              border: "1px solid var(--danger)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "var(--danger)";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.color = "var(--danger)";
            }}
          >
            {isMockLoading ? "Processing..." : "Admin Login"}
          </button>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {" "}
          {/* Email */}{" "}
          <div>
            {" "}
            <label className="text-sm text-gray-300">Email</label>{" "}
            <div className="relative mt-1">
              {" "}
              <FaEnvelope className="absolute left-3 top-4.5 text-gray-400" />{" "}
              <input
                type="email"
                name="email"
                className="w-full pl-10 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-(--primary)"
                placeholder="you@example.com"
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* Password */}{" "}
          <div>
            {" "}
            <label className="text-sm text-gray-300">Password</label>{" "}
            <div className="relative mt-1">
              {" "}
              <FaLock className="absolute text-gray-400 left-3 top-4" />{" "}
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-(--primary)"
                placeholder="••••••••"
              />{" "}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute text-gray-400 transition cursor-pointer right-3 top-4 hover:text-gray-200"
              >
                {" "}
                {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex justify-end mt-2 mr-1">
            <Link
              href="/forgotPassword"
              title="Forgot Password"
              className="text-xs text-gray-400 hover:text-(--primary)"
            >
              Forgot Password?
            </Link>
          </div>
          {/* Submit */}{" "}
          <button
            type="submit"
            className="w-full py-3 font-semibold transition rounded-lg btn-primary"
          >
            {" "}
            Login{" "}
          </button>{" "}
        </form>{" "}
        {/* Divider */}{" "}
        <div className="flex items-center my-6">
          {" "}
          <div className="flex-1 h-px bg-white/10"></div>{" "}
          <span className="px-3 text-xs text-gray-400">OR</span>{" "}
          <div className="flex-1 h-px bg-white/10"></div>{" "}
        </div>{" "}
        {/* Social Login */} <SocialButtons /> {/* Footer */}{" "}
        <p className="mt-6 text-sm text-center text-gray-400">
          {" "}
          Don’t have an account?{" "}
          <Link href="/register" className="text-(--primary) hover:underline">
            {" "}
            Sign up{" "}
          </Link>{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
