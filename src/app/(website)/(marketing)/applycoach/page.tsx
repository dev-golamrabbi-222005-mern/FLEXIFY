"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { coachSchema, CoachFormValues } from "./coachApplicationSchema";
import { BasicInfoFields } from "./BasicInfoFields";
import { ExpertiseCertificationsFields } from "./ExpertiseCertificationsFields";
import { PreferencesPricingFields } from "./PreferencesPricingFields";

interface ApiErrorResponse {
  message: string;
}

export default function ApplyCoachPage() {
  const { data: session } = useSession();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CoachFormValues>({
    resolver: zodResolver(coachSchema),
    defaultValues: {
      fullName: "",
      email: "",
      profileImage: "",
      phone: "",
      gender: "male",
      bio: "",
      location: "",
      specialties: "",
      experienceYears: 0,
      education: "",
      languages: "",
      certifications: [{ title: "", issuedBy: "", year: 2026 }],
      trainingTypes: [],
      availableDays: [],
      preferredClients: [],
      pricing: { monthly: 0, perSession: 0 },
      maxClients: 1,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  useEffect(() => {
    if (session?.user) {
      reset({
        fullName: session.user.name || "",
        email: session.user.email || "",
        profileImage: session.user.image || "",
        gender: "male",
        bio: "",
        location: "",
        specialties: "",
        experienceYears: 0,
        education: "",
        languages: "",
        certifications: [{ title: "", issuedBy: "", year: 2026 }],
        trainingTypes: [],
        availableDays: [],
        preferredClients: [],
        pricing: { monthly: 0, perSession: 0 },
        maxClients: 1,
      });
    }
  }, [session, reset]);

  const mutation = useMutation({
    mutationFn: async (data: CoachFormValues) => {
      const response = await axios.post("/api/coach/apply", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      reset();
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: CoachFormValues) => mutation.mutate(data);

  return (
    <div className="min-h-screen py-10 px-6 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[var(--primary)] p-8 text-white text-center">
          <h1 className="text-3xl font-extrabold tracking-widest uppercase">
            Apply to be a Coach
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-12 md:p-12">
          <BasicInfoFields register={register} errors={errors} />

          <ExpertiseCertificationsFields
            register={register}
            errors={errors}
            fields={fields}
            append={append}
            remove={remove}
          />

          <PreferencesPricingFields register={register} errors={errors} />

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-5 text-xl uppercase btn-primary disabled:opacity-50 cursor-pointer"
          >
            {mutation.isPending ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
