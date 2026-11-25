"use client";

import React from "react";
import Image from "next/image";
import { SuccessStoryItem, badgeColor } from "./successData";

interface SuccessCardProps {
  item: SuccessStoryItem;
}

export function SuccessCard({ item }: SuccessCardProps) {
  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "4/3" }}
      >
        <Image
          src={item.image}
          alt={item.alt}
          fill
          className="object-cover object-top transition-transform duration-700 hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 45vw, 30vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="px-1 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-semibold"
            style={{ color: "var(--text-primary)", fontSize: "1.1rem" }}
          >
            {item.name}
          </span>
          <span
            className="font-bold text-sm"
            style={{ color: badgeColor[item.badgeType] }}
          >
            {item.badge}
          </span>
        </div>
        <p
          className="text-[0.95rem] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>
    </div>
  );
}
