"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import SocialButtons from "@/components/auth/SocialButtons";
import { registerUser } from "@/lib/actions/auth";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { RegisterFormFields } from "@/components/auth/RegisterFormFields";

export default function RegisterClient() {
  const [agree, setAgree] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = async (data: any) => {
    if (!agree) {
      toast.error("You must agree to the Terms & Conditions");
      return;
    }

    const payload = {
      ...data,
      profileImage: uploadedImageUrl || "",
    };

    const result = await registerUser(payload);

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
      className="relative flex items-center justify-center min-h-screen w-full py-12 px-4 bg-center bg-cover"
      style={{
        backgroundImage: "url('https://i.ibb.co/W4SrF8Vn/pngtree-rows-of-dumbbells-in-the-gym-image-15662386.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 w-full max-w-md p-8 border bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Create <span className="text-[var(--primary)]">Flexify</span> Account
          </h1>
          <p className="mt-2 text-gray-400">Start your fitness journey today</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(handleRegister)}>
          <RegisterFormFields
            register={register}
            errors={errors}
            agree={agree}
            onAgreeChange={(val) => setAgree(val)}
            onImageSuccess={(url) => setUploadedImageUrl(url)}
            uploadedImageUrl={uploadedImageUrl}
          />
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <SocialButtons />

        <p className="mt-6 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--primary)] hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
