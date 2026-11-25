"use client";

import React, { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FaUser, FaMobileAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import ImageUpload from "@/components/ImageUpload";

interface RegisterFormFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  agree: boolean;
  onAgreeChange: (val: boolean) => void;
  onImageSuccess: (url: string) => void;
  uploadedImageUrl: string;
}

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function RegisterFormFields({
  register,
  errors,
  agree,
  onAgreeChange,
  onImageSuccess,
  uploadedImageUrl,
}: RegisterFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="space-y-1.5">
        <label className="text-sm text-gray-300">
          Profile Picture <span className="text-xs text-gray-400">(Optional)</span>
        </label>
        <ImageUpload
          onUploadSuccess={onImageSuccess}
          className="min-h-[10px] py-4"
        />
        {uploadedImageUrl && (
          <p className="text-[10px] text-emerald-400 font-medium">
            ✓ Image ready
          </p>
        )}
      </div>

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
            <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>
          )}
        </div>
      </div>

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
            <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>
          )}
        </div>
      </div>

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
            <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
          )}
        </div>
      </div>

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
              {errors.password.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={agree}
          onChange={() => onAgreeChange(!agree)}
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
        disabled={!agree}
        className="w-full py-3 font-semibold text-black transition rounded-lg bg-[var(--primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Register
      </button>
    </>
  );
}
