"use client";

import React, { useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { Camera, X, Loader2, AlertCircle } from "lucide-react";
import { FoodItem } from "@/types/food";

interface AnalyzeFoodResponse {
  food: Omit<FoodItem, "id">;
}

interface FoodPhotoAiScannerProps {
  onAiAnalyzed: (food: FoodItem | null) => void;
}

export function FoodPhotoAiScanner({ onAiAnalyzed }: FoodPhotoAiScannerProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setAnalyzing(true);
      onAiAnalyzed(null);
      setAiError(null);
      try {
        const { data } = await axios.post<AnalyzeFoodResponse>("/api/analyze-food", {
          base64,
          mediaType: file.type,
        });
        const newFood: FoodItem = {
          id: `ai-${Date.now()}`,
          name: data.food.name,
          calories: data.food.calories,
          protein: data.food.protein,
          carbs: data.food.carbs,
          fats: data.food.fats,
          description: data.food.description || "AI Analyzed",
        };
        onAiAnalyzed(newFood);
      } catch (err) {
        const error = err as AxiosError<{ error: string }>;
        setAiError(error.response?.data?.error || "Could not identify the food.");
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setImagePreview(null);
    onAiAnalyzed(null);
    setAiError(null);
  };

  return (
    <div className="space-y-4">
      {!imagePreview ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="group border-2 border-dashed border-[var(--border-color)] rounded-2xl p-12 text-center cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
        >
          <div className="w-14 h-14 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Camera
              size={28}
              className="text-[var(--text-secondary)] group-hover:text-[var(--primary)]"
            />
          </div>
          <p className="font-bold text-sm text-[var(--text-primary)]">Upload or Take a Photo</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Our AI will calculate the calories for you</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-lg">
            <img src={imagePreview} alt="food" className="w-full h-full object-cover" />
            {analyzing && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                <Loader2 size={32} className="text-white animate-spin" />
                <p className="text-white text-xs font-bold tracking-widest uppercase">
                  AI is Analyzing...
                </p>
              </div>
            )}
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      {aiError && (
        <div className="flex items-center gap-2 text-red-500 text-xs p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl">
          <AlertCircle size={14} />
          <span className="font-medium">{aiError}</span>
        </div>
      )}
    </div>
  );
}
