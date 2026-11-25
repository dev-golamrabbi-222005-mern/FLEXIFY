"use client";

import { useState, FormEvent, JSX } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import SocialButtons from "@/components/auth/SocialButtons";
import { toast } from "react-toastify";
import { MockLoginSection } from "@/components/auth/MockLoginSection";
import { LoginFormFields } from "@/components/auth/LoginFormFields";

export default function LoginClient(): JSX.Element {
  const [isMockLoading, setIsMockLoading] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get("callbackUrl") ?? "/";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

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
    } else {
      toast.error(result?.error || "Invalid credentials. Please try again.");
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
    } catch {
      toast.error("Something went wrong with the server.");
    } finally {
      setIsMockLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen w-full px-4 py-12 bg-center bg-cover"
      style={{
        backgroundImage: "url('https://i.ibb.co.com/1f17SJk4/gym-backgound.jpg')",
      }}
    >
      <div className="absolute inset-0 h-full bg-black/70"></div>
      <div className="relative z-10 w-full max-w-md p-8 border bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Login to <span className="text-(--primary)">Flexify</span>
          </h1>
          <p className="mt-2 text-gray-400">Continue your fitness journey</p>
        </div>

        <MockLoginSection
          isMockLoading={isMockLoading}
          onMockLogin={handleMockLogin}
        />

        <LoginFormFields onSubmit={handleSubmit} />

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <SocialButtons />

        <p className="mt-6 text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <Link href="/register" className="text-(--primary) hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
