"use client";

import { useState, JSX } from "react";
import Link from "next/link";
import {
  FaEye,
  FaEyeSlash,
  FaMobileAlt,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { postUser } from "@/actions/server/auth";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import SocialButtons from "@/components/auth/SocialButtons";
import { toast } from "react-toastify";
import ImageUpload from "@/components/ImageUpload/page";
import { useForm } from "react-hook-form";

interface RegisterFormData {
  name: string;
  phone: string;
  email: string;
  imageUrl: string;
  password: string;
  role: string;
}

export default function RegisterPage(): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [role, setRole] = useState<"user" | "coach">("user");
  const [agree, setAgree] = useState<boolean>(false);
  
  // Consolidated image state from golamrabbi branch
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get("callbackUrl") || "/";

  // Validation Patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":;{}|<>])\S{8,}$/;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const handleRegister = async (data: RegisterFormData) => {
    // Manual check for the image upload since it's outside the standard form inputs
    if (!uploadedImageUrl) {
      toast.error("Please upload a profile picture");
      return;
    }

    const payload = {
      ...data,
      role, // Using the role state
      imageUrl: uploadedImageUrl,
    };

    const result = await postUser(payload);

    if (result.success) {
      const signInResult = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
        callbackUrl,
      });

      if (signInResult?.ok) {
        toast.success(result.message);
        router.push(callbackUrl);
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen py-12 px-4 bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://i.ibb.co/W4SrF8Vn/pngtree-rows-of-dumbbells-in-the-gym-image-15662386.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 w-full max-w-md p-8 border bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Create <span className="text-[var(--primary)]">Flexify</span> Account
          </h1>
          <p className="mt-2 text-gray-400">Start your fitness journey today</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(handleRegister)}>
          {/* Profile Image Upload - Merged compact UI */}
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300">Profile Picture</label>
            <ImageUpload
              onUploadSuccess={(url) => setUploadedImageUrl(url)}
              className="min-h-[10px] py-4"
            />
            {uploadedImageUrl && (
              <p className="text-[10px] text-emerald-400 font-medium">
                ✓ Image ready
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-300">Name</label>
            <div className="relative mt-1">
              <FaUser className="absolute text-gray-400 left-3 top-4" />
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full py-3 pl-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-[var(--primary)]"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-300">Phone Number</label>
            <div className="relative mt-1">
              <FaMobileAlt className="absolute text-gray-400 left-3 top-4" />
              <input
                type="text"
                {...register("phone", { required: "Phone number is required" })}
                className="w-full py-3 pl-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-[var(--primary)]"
                placeholder="+880123456789"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: emailPattern, message: "Invalid email" },
                })}
                className="w-full py-3 pl-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-[var(--primary)]"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: passwordPattern,
                    message: "Password must be 8+ chars with uppercase, lowercase, number, and special character.",
                  },
                })}
                className="w-full py-3 pl-10 pr-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-[var(--primary)]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-4 text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 leading-tight">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="accent-[var(--primary)]"
            />
            <span>
              I agree to the{" "}
              <span className="text-[var(--primary)] underline cursor-pointer">
                Terms & Conditions
              </span>
            </span>
          </div>

          <button
            type="submit"
            disabled={!agree || !uploadedImageUrl}
            className="w-full py-3 font-semibold text-black transition rounded-lg bg-[var(--primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Register
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <SocialButtons />

        <p className="mt-6 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--primary)] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}