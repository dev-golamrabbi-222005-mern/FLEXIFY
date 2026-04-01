"use client";

import { useState, FormEvent, JSX } from "react";
import Link from "next/link";
import {
  FaEye,
  FaEyeSlash,
  FaMobileAlt,
  FaEnvelope,
  FaLock,
  FaUser,
  FaImage,
} from "react-icons/fa";
import { postUser } from "@/actions/server/auth";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";
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
  const [tempImageUrl, setTempImageUrl] = useState<string>("");

  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get("callbackUrl") || "/";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const noSpacePattern = /^[\S]+$/;
  const min8Pattern = /^.{8,}$/;
  const casePattern = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
  const numberPattern = /^(?=.*\d).+$/;
  const specialCharPattern = /^(?=.*[!@#$%^&*(),.?":;{}|<>]).+$/;
  const imageUrlPattern = /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)$/i;


  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

  const handleRegister = async(data: RegisterFormData) => {
    const payload = {
      ...data,
      imageUrl: tempImageUrl
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
        await toast.success(result.message);
        router.push(callbackUrl);
      }
    } else {
      await toast.error(result.message);
    }
  }
  return (
    <div
      className="relative flex items-center justify-center min-h-screen px-4 bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://i.ibb.co/W4SrF8Vn/pngtree-rows-of-dumbbells-in-the-gym-image-15662386.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 w-full max-w-md p-8 border bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Create <span className="text-(--primary)">Flexify</span> Account
          </h1>
          <p className="mt-2 text-gray-400">Start your fitness journey today</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(handleRegister)}>
          {/* Name */}
          <div>
            <label className="text-sm text-gray-300">Name</label>
            <div className="relative mt-1">
              <FaUser className="absolute text-gray-400 left-3 top-4" />
              <input
                type="text"
                {...register("name", {
                  required: true,
                })}
                className="w-full py-3 pl-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-(--primary)"
                placeholder="Your name"
              />
              {
                errors.name?.type === "required" &&
                  <p className="text-red-500">Name is required</p>
              }
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-300">Phone Number</label>
            <div className="relative mt-1">
              <FaMobileAlt className="absolute text-gray-400 left-3 top-4" />
              <input
                type="text"
                {...register("phone", {
                  required: true,
                })}
                className="w-full py-3 pl-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-(--primary)"
                placeholder="+880123456789"
              />
              {
                errors.phone?.type === "required" &&
                  <p className="text-red-500">Phone number is required</p>
              }
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-4.5 text-gray-400" />
              <input
                type="email"
                {...register("email", {
                  required: true,
                  pattern: emailPattern
                })}
                className="w-full py-3 pl-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-(--primary)"
                placeholder="you@example.com"
              />
              {
                errors.email?.type === "required" &&
                <p className="text-red-500">Email is required</p>
              }
              {
                errors.email?.type === "pattern" &&
                <p className="text-red-500">Invalid Email</p>
              }
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm text-gray-300">Profile Image URL</label>
            <div className="relative mt-1">
              <ImageUpload onUploadSuccess={(url) => setTempImageUrl(url)} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-4.5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: true,
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":;{}|<>])\S{8,}$/
                })}
                className="w-full py-3 pl-10 pr-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-(--primary)"
                placeholder="••••••••"
              />
              {
                errors.password?.type === "required" &&
                <p className="text-red-500">Password is required</p>
              }
              {
                errors.password?.type === "pattern" &&
                <p className="text-red-500">Password must be at least 8 characters and have at least one uppercase letter, one lowercase letter, one number, one special character and not contain whitespace.</p>
              }
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-4.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <span>
              I agree to the{" "}
              <span className="text-(--primary) underline cursor-pointer">
                Terms & Conditions
              </span>
            </span>
          </div>
          <button
            type="submit"
            disabled={!agree}
            className="w-full py-3 font-semibold text-black transition rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
          <Link href="/login" className="text-(--primary) hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
