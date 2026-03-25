"use client";

import { useRef, useState, useEffect } from "react";
import { Mail, Shield, Key, Camera, Save, User, Loader2, Phone } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useForm, SubmitHandler } from "react-hook-form";

interface AdminData {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  profileImage: string;
  role: string;
  createdAt: string;
}

interface ProfileFormInputs {
  fullName: string;
  email: string;
  phone: string;
}

interface ApiError {
  error: string;
}

export default function AdminProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // ১. ব্রাউজার ট্যাব টাইটেল সেট করা
  useEffect(() => {
    document.title = "Flexify | Admin | Profile";
  }, []);

  const { data: admin, isLoading } = useQuery<AdminData>({
    queryKey: ["admin-profile"],
    queryFn: async () => (await axios.get("/api/admin/profile")).data,
  });

  const { register, handleSubmit, reset } = useForm<ProfileFormInputs>({
    values: admin ? {
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
    } : undefined
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedData: ProfileFormInputs) => {
      return axios.patch("/api/admin/profile", {
        ...updatedData,
        _id: admin?._id,
        profileImage: selectedImage || admin?.profileImage,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully.",
        icon: "success",
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (err: AxiosError<ApiError>) => {
      Swal.fire("Error", err.response?.data?.error || "Update failed", "error");
    }
  });

  // ২. onSubmit ফাংশন যা আপনার কোডে মিসিং ছিল
  const onSubmit: SubmitHandler<ProfileFormInputs> = (data) => {
    updateMutation.mutate(data);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
      <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">
      
      {/* ===== PROFILE HEADER ===== */}
      <section className="card-glass p-8 rounded-3xl border border-[var(--border-color)] shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <img
              src={selectedImage || admin?.profileImage || "/default-avatar.png"}
              alt="admin"
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-4 border-[var(--primary)] shadow-2xl transition group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-[var(--primary)] text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition"
            >
              <Camera size={20} />
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              name="profileImage"
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <h1 className="text-3xl font-black tracking-tight">{admin?.fullName}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[var(--text-secondary)]">
              <p className="flex items-center gap-2 font-medium"><Mail size={16}/> {admin?.email}</p>
              <p className="flex items-center gap-2 font-medium"><Phone size={16}/> {admin?.phone || "N/A"}</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <span className="px-4 py-1 bg-[var(--primary)] text-white text-xs font-bold uppercase rounded-full shadow-lg">
                {admin?.role}
              </span>
              <span className="px-4 py-1 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold rounded-full border border-[var(--border-color)]">
                Joined: {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-GB') : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EDIT PROFILE FORM ===== */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <section className="card-glass p-8 rounded-3xl border border-[var(--border-color)]">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <User size={22} className="text-[var(--primary)]"/> Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-secondary)] ml-1">Full Name</label>
              <input 
                {...register("fullName", { required: true })}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-2xl focus:ring-2 ring-[var(--primary)] outline-none transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-secondary)] ml-1">Email Address</label>
              <input 
                {...register("email", { required: true })}
                type="email"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-2xl focus:ring-2 ring-[var(--primary)] outline-none transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-secondary)] ml-1">Phone Number</label>
              <input 
                {...register("phone")}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-2xl focus:ring-2 ring-[var(--primary)] outline-none transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-secondary)] ml-1">Admin Role</label>
              <input 
                disabled
                value={admin?.role || "admin"}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] p-4 rounded-2xl cursor-not-allowed opacity-70"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={updateMutation.isPending}
            className="mt-8 bg-[var(--primary)] text-white px-8 py-4 rounded-2xl flex items-center gap-2 hover:opacity-90 transition shadow-xl font-bold disabled:opacity-50"
          >
            {updateMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20}/>}
            Save Changes
          </button>
        </section>

        {/* ===== SECURITY SETTINGS ===== */}
        <section className="card-glass p-8 rounded-3xl border border-[var(--border-color)]">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Shield size={22} className="text-orange-500"/> Security & Privacy
          </h2>

          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><Key size={20}/></div>
                  <p className="font-bold">Change Password</p>
                </div>
                <button type="button" className="text-[var(--primary)] font-bold text-sm hover:underline">Update</button>
             </div>

             <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Shield size={20}/></div>
                  <p className="font-bold">Two-Factor Auth</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[var(--primary)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
             </div>
          </div>
        </section>
      </form>
    </div>
  );
}