"use client";

import React from "react";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaGithub, FaPassport } from "react-icons/fa6";
import { TEAM_MEMBERS } from "./teamData";

export function TeamMembersGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {TEAM_MEMBERS.map((member, index) => (
        <div
          key={index}
          className="bg-[var(--card-bg)] rounded-xl shadow text-center p-6 hover:shadow-lg hover:scale-105 transition hover:bg-[var(--primary)] hover:text-white group"
        >
          <img
            src={member.image}
            alt={member.name}
            className="object-cover w-24 h-24 mx-auto mb-3 rounded-full"
          />

          <h3 className="text-xl font-bold transition group-hover:text-white">
            {member.name}
          </h3>

          <p className="font-semibold transition group-hover:text-white/80">
            {member.role}
          </p>

          <div className="flex justify-center gap-4 mt-4 text-lg">
            <Link href={member.portfolio || "/"}>
              <FaPassport className="hover:text-[var(--secondary)] cursor-pointer transition" />
            </Link>
            <Link href={member.facebook || "/"}>
              <FaFacebookF className="hover:text-[var(--secondary)] cursor-pointer transition" />
            </Link>
            <Link href={member.linkedin || "/"}>
              <FaLinkedinIn className="hover:text-[var(--secondary)] cursor-pointer transition" />
            </Link>
            <Link href={member.github || "/"}>
              <FaGithub className="hover:text-[var(--secondary)] cursor-pointer transition" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
