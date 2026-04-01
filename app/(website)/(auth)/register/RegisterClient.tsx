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
} from "react-icons/fa";
import { postUser } from "@/actions/server/auth";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import SocialButtons from "@/components/auth/SocialButtons";
import { toast } from "react-toastify";
import ImageUpload from "@/components/ImageUpload/page"; // Ensure this path is correct

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

  // New state to hold the uploaded image URL from ImageBB
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get("callbackUrl") || "/";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const noSpacePattern = /^[\S]+$/;
  const min8Pattern = /^.{8,}$/;
  const casePattern = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
  const numberPattern = /^(?=.*\d).+$/;
  const specialCharPattern = /^(?=.*[!@#$%^&*(),.?":;{}|<>]).+$/;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData: RegisterFormData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      imageUrl: uploadedImageUrl, // Using the state variable instead of a text input
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      role,
    };

    // Validation Logic
    if (
      !formData.name ||
      !formData.imageUrl ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      toast.error("Please fill up all fields and upload a profile picture");
      return;
    } else if (!emailPattern.test(formData.email)) {
      toast.error("Invalid email");
      return;
    } else if (!min8Pattern.test(formData.password)) {
      toast.error("Password must be at least 8 characters long");
      return;
    } else if (!noSpacePattern.test(formData.password)) {
      toast.error("Password must not contain any whitespaces");
      return;
    } else if (!casePattern.test(formData.password)) {
      toast.error(
        "Password must contain at least one uppercase and one lowercase letter",
      );
      return;
    } else if (!numberPattern.test(formData.password)) {
      toast.error("Password must contain at least one number");
      return;
    } else if (!specialCharPattern.test(formData.password)) {
      toast.error("Password must contain at least one special character");
      return;
    }

    const result = await postUser(formData);

    if (result.success) {
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
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
            Create <span className="text-(--primary)">Flexify</span> Account
          </h1>
          <p className="mt-2 text-gray-400">Start your fitness journey today</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Profile Image Upload - COMPACT RESHAPE */}
          <div className="space-y-1.5">
            {" "}
            {/* Tighter spacing */}
            <label className="text-sm text-gray-300">Profile Picture</label>
            <ImageUpload
              onUploadSuccess={(url) => setUploadedImageUrl(url)}
              // This is the magic line. We overwrite the 200px min-height to 100px.
              // We also make the icon and text smaller if we use the same structure I provided earlier.
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
                name="name"
                className="w-full py-3 pl-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-(--primary)"
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-300">Phone Number</label>
            <div className="relative mt-1">
              <FaMobileAlt className="absolute text-gray-400 left-3 top-4" />
              <input
                type="text"
                name="phone"
                className="w-full py-3 pl-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-(--primary)"
                placeholder="+880123456789"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
              <input
                type="email"
                name="email"
                className="w-full py-3 pl-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-(--primary)"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full py-3 pl-10 pr-10 text-white border rounded-lg outline-none bg-black/40 border-white/10 focus:border-(--primary)"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-4 text-gray-400 hover:text-white"
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
              className="accent-(--primary)"
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
            disabled={!agree || !uploadedImageUrl}
            className="w-full py-3 font-semibold text-black transition rounded-lg bg-(--primary) hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
