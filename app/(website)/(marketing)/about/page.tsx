import SectionTitle from "@/app/(website)/components/ui/section-title";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaLinkedinIn, FaMediumM } from "react-icons/fa";
import { FaGithub, FaPassport } from "react-icons/fa6";

const About = () => {
  const teamMembers = [
    {
      name: "Md. Golam Rabbi",
      role: "Team Leader & Project Manager",
      image: "https://i.ibb.co.com/LhdHkbN6/1000096205-removebg-preview.jpg",
      portfolio: "http://dev-golamrabbi-portfolio.web.app/",
      facebook: "https://web.facebook.com/md.GolamRabbi22Abdullah",
      linkedin: "https://www.linkedin.com/in/md-golam-rabbi-2005-abdullah/",
      github: "https://github.com/dev-golamrabbi-222005-mern/",
    },
    {
      name: "Jubayer Hossain",
      role: "Frontend Developer",
      image: "https://i.postimg.cc/FzTr6D42/JUBAYER_Photo.jpg",
      portfolio: "https://jubayer-portfolio-seven.vercel.app/",
      facebook: "https://www.facebook.com/jubayer.natore",
      linkedin: "https://www.linkedin.com/in/jubayer-hossain1/",
      github: "https://github.com/jubayer726",
    },
    {
      name: "Md Ashiqur Rahman Pranto",
      role: "Backend Developer",
      image: "https://i.ibb.co.com/Kx1bTKhB/IMG-20220522-WA0002-1.jpg",
      portfolio: "https://ashiqur-rahman-pranto.netlify.app/",
      facebook: "https://www.facebook.com/ashiqurrahmanpranto1",
      linkedin: "https://www.linkedin.com/in/md-ashiqur-rahman-pranto/",
      github: "https://github.com/ashiqurrahman696",
    },
    {
      name: "Md Altaf Mahmud",
      role: "Frontend Developer",
      image: "https://i.ibb.co.com/8W7XwbL/1000096371-removebg-preview.jpg",
      portfolio: "https://md-mahmud-1426-protfolio.netlify.app/",
      facebook: "https://www.facebook.com/amshuvo1426",
      linkedin: "https://www.linkedin.com/in/md-altaf-mahmud/",
      github: "https://github.com/amshuvo2002",
    },
    {
      name: "Md Siam Khan",
      role: "Backend Developer",
      image: "https://i.ibb.co.com/1Y210CTQ/1000009644-2.png",
      portfolio: "https://my-portfolio-ruby-eight-42.vercel.app/",
      facebook: "https://www.facebook.com/siam.khan.9",
      linkedin: "https://www.linkedin.com/in/siam-khan-9b1a4b1b3/",
      github: "https://github.com/siamkhan",
    },
    {
      name: "Md Nayeem Babu",
      role: "Frontend Developer",
      image:
        "https://i.ibb.co.com/TD3hfrGG/Whats-App-Image-2026-02-26-at-12-20-47-PM.jpg",
      portfolio: "https://portfolio-showpiece.vercel.app/",
      facebook: "https://www.facebook.com/nayeem.babu.9",
      linkedin: "https://www.linkedin.com/in/nayeem-babu-9b1a4b1b3/",
      github: "https://github.com/nayeembabu",
    },
  ];

  return (
    <div className="mx-auto my-6 md:my-8 lg:my-10 max-w-7xl px-4 md:px-6">
      <title>About - Flexify</title>
      <section className="pb-8 md:pb-12 lg:pb-16">
        {/* About Section */}
        <div className="grid items-center grid-cols-1 gap-10 md:grid-cols-2">
          {/* Left Text */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              About <span className="text-(--primary)"> Flexify </span>
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

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src="https://i.postimg.cc/5tSRf1g7/vision.webp"
              alt="about illustration"
              className="w-full max-w-md shadow-md rounded-xl"
            />
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16">
        {/* 🔹 Mission + Vision */}
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

      {/* 🔹 Why Flexify */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="text-center mb-10">
          <SectionTitle
            title="Why Flexify?"
            subtitle="Flexify is designed to bridge the gap between generic fitness
                plans and real personalized guidance."
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
              <p className="text-sm text-[var(--text-secondary)] hover:text-white">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Team Section */}
      <section className="pt-8 md:pt-12 lg:pt-16">
        <SectionTitle
          title="Meet the Team"
          subtitle="Meet our passionate team of six professionals led by our Founder &
              Lead Developer. Together we build Flexify with creativity and
              technology."
        />

        {/* Team Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-[var(--card-bg)] rounded-xl shadow text-center p-6 hover:shadow-lg hover:scale-105 transition hover:bg-[var(--primary)] hover:text-white"
            >
              <img
                src={member.image}
                alt={member.name}
                className="object-cover w-24 h-24 mx-auto mb-3 rounded-full"
              />

              <h3 className="text-xl font-bold transition hover:text-white">
                {member.name}
              </h3>

              <p className="font-semibold transition hover:text-white/80">
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
      </section>
    </div>
  );
};

export default About;
