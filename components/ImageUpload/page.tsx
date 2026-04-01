"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  defaultImage?: string;
}

export default function ImageUpload({
  onUploadSuccess,
  defaultImage,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Replace this with your actual imgBB API Key

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Show local preview immediately
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    // 2. Prepare FormData for imgBB
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        formData,
      );

      if (response.data.success) {
        const url = response.data.data.url;
        onUploadSuccess(url); // Send the URL back to the parent component
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onUploadSuccess(""); // Clear the URL in parent
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">
        Cover Image
      </label>

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center
          ${preview ? "border-[var(--primary)] bg-[var(--bg-secondary)]" : "border-[var(--border-color)] hover:border-[var(--primary)] bg-[var(--bg-primary)]"}
        `}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="absolute inset-0 object-cover w-full h-full transition-opacity opacity-60 group-hover:opacity-40"
            />
            <div className="relative z-10 flex flex-col items-center gap-2">
              {uploading ? (
                <>
                  <Loader2
                    className="animate-spin text-[var(--primary)]"
                    size={32}
                  />
                  <span className="px-3 py-1 text-xs font-bold tracking-widest text-white uppercase rounded-full bg-black/50">
                    Uploading to Cloud...
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="text-[var(--primary)]" size={32} />
                  <span className="px-3 py-1 text-xs font-bold tracking-widest text-white uppercase rounded-full bg-black/50">
                    Click to Change
                  </span>
                </>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute z-20 p-2 text-white transition-transform bg-red-500 rounded-full top-3 right-3 hover:scale-110"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors">
            <div className="p-4 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] group-hover:border-[var(--primary)] transition-all">
              <ImageIcon size={32} />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold tracking-widest uppercase">
                Click to upload image
              </p>
              <p className="text-[10px] opacity-60">
                PNG, JPG, or WEBP (Max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
