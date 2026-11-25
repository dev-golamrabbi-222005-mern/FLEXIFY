import SectionTitle from "@/app/(website)/components/ui/section-title";
import React from "react";
import { TeamMembersGrid } from "./TeamMembersGrid";

export default function About() {
  return (
    <div className="mx-auto my-10 md:my-12 lg:my-16 max-w-7xl px-4 md:px-6">
      <title>About - Flexify</title>
      <section className="pb-8 md:pb-12 lg:pb-16">
        <div className="grid items-center grid-cols-1 gap-10 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              About <span className="text-[var(--primary)]"> Flexify </span>
            </h2>

            <p className="text-[var(--text-secondary)] text-base md:text-lg text-start mb-6">
              Flexify is a modern fitness planner platform built by a passionate
              team of six dedicated Full-Stack (MERN) developers, led by our
              Founder & Lead Developer. Our mission is to make fitness simple,
              accessible, and personalized for everyone. We combine smart
              technology with user-friendly design to help people track
              workouts, plan routines, and stay motivated.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="https://i.postimg.cc/5tSRf1g7/vision.webp"
              alt="about illustration"
              className="w-full max-w-md shadow-md rounded-xl"
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl border border-[var(--border-color)]">
            <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
              Our Mission
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Our mission is to make fitness more personalized, structured, and
              accessible for everyone by leveraging smart technology and
              user-centric design.
            </p>
          </div>

          <div className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl border border-[var(--border-color)]">
            <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
              Our Vision
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We envision a future where technology empowers individuals to
              achieve their fitness goals with intelligent guidance, real-time
              tracking, and professional support.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="text-center mb-10">
          <SectionTitle
            title="Why Flexify?"
            subtitle="Flexify is designed to bridge the gap between generic fitness plans and real personalized guidance."
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Personalized Plans",
              desc: "Workout and nutrition plans tailored to individual goals and body data.",
            },
            {
              title: "AI Smartness",
              desc: "AI-driven recommendations to optimize workouts and performance.",
            },
            {
              title: "Coach Integration",
              desc: "Direct communication with professional coaches for guidance.",
            },
            {
              title: "Progress Tracking",
              desc: "Track calories, workouts, and consistency with smart dashboards.",
            },
            {
              title: "Challenges & Motivation",
              desc: "Gamified challenges and streak systems to keep users engaged.",
            },
            {
              title: "Modern Experience",
              desc: "Responsive, multilingual, and user-friendly interface.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white"
            >
              <h4 className="font-bold text-lg mb-2">{item.title}</h4>
              <p className="text-sm text-[var(--text-secondary)]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-8 md:pt-12 lg:pt-16">
        <SectionTitle
          title="Meet the Team"
          subtitle="Meet our passionate team of six professionals led by our Founder & Lead Developer. Together we build Flexify with creativity and technology."
        />

        <TeamMembersGrid />
      </section>
    </div>
  );
}
