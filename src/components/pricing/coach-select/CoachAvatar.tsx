"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Coach } from "./types";

export function CoachAvatar({ coach, size = 44 }: { coach: Coach; size?: number }) {
  const [imgErr, setImgErr] = useState(false);
  const src = coach.imageUrl;
  const letter = (coach.name ?? "C").charAt(0).toUpperCase();

  if (src && !imgErr) {
    return (
      <Image
        src={src}
        alt={coach.name}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
        onError={() => setImgErr(true)}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center font-black text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: "var(--primary)",
        fontSize: Math.round(size * 0.38),
      }}
    >
      {letter}
    </div>
  );
}
