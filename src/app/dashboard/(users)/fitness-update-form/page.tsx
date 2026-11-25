"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { profileSchema, ProfileFormValues, ApiErrorResponse } from "@/components/dashboard/fitness/fitnessProfileSchema";
import FitnessFormFields from "@/components/dashboard/fitness/FitnessFormFields";

const FitnessProfileUpdateForm = () => {
  const router = useRouter();

  const { data: existingData, isLoading: isFetching } = useQuery<ProfileFormValues>({
    queryKey: ["fitness-profile"],
    queryFn: async () => {
      const res = await axios.get<ProfileFormValues>("/api/user/fitness-profile");
      return res.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (existingData) reset(existingData);
  }, [existingData, reset]);

  const mutation = useMutation<unknown, AxiosError<ApiErrorResponse>, ProfileFormValues>({
    mutationFn: async (data: ProfileFormValues) => {
      const response = await axios.post("/api/user/fitness-profile", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Your fitness profile has been updated.");
      router.push("/dashboard");
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "Failed to update";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: ProfileFormValues) => mutation.mutate(data);

  if (isFetching) return <div className="py-20 text-xl font-bold text-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen px-4 py-10">
      <title>Fitness Update Form | Dashboard - Flexify</title>
      <div className="max-w-7xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-[var(--primary)] p-8 text-white text-center">
          <h1 className="text-3xl font-bold uppercase">Update Fitness Profile</h1>
          <p className="mt-1 opacity-90">Modify your health and fitness details</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-10 md:p-12">
          <FitnessFormFields register={register} errors={errors} />

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`bg-[var(--primary)] rounded-2xl text-white w-full py-6 text-xl font-bold uppercase tracking-widest transition-all shadow-xl active:scale-95 relative overflow-hidden ${
              mutation.isPending ? "opacity-50 cursor-wait" : "hover:brightness-110"
            }`}
          >
            <span className="relative z-10">
              {mutation.isPending ? "Updating Profile..." : "Update Fitness Profile"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FitnessProfileUpdateForm;
