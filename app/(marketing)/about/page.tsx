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
      role: "Founder & Developer",
      image: "https://i.postimg.cc/FzTr6D42/JUBAYER_Photo.jpg",
      portfolio: "https://jubayer-portfolio-seven.vercel.app/",
      facebook: "https://www.facebook.com/jubayer.natore",
      linkedin: "https://www.linkedin.com/in/jubayer-hossain1/",
      github: "https://github.com/jubayer726",
    },
    {
      name: "Md Ashiqur Rahman Pranto",
      role: "Founder & Developer",
      image: "https://i.ibb.co.com/Kx1bTKhB/IMG-20220522-WA0002-1.jpg",
      portfolio: "https://ashiqur-rahman-pranto.netlify.app/",
      facebook: "https://www.facebook.com/ashiqurrahmanpranto1",
      linkedin: "https://www.linkedin.com/in/md-ashiqur-rahman-pranto/",
      github: "https://github.com/ashiqurrahman696",
    },
    {
      name: "Md Altaf Mahmud",
      role: "Founder & Developer",
      image: "https://lh3.googleusercontent.com/a/ACg8ocJKJ5VsIdSszgl0_wLT7TR1xMlIO3J9NYVXPjkVeRk_3FLaUdMPcg=s411-c-no",
      portfolio: "https://md-mahmud-1426-protfolio.netlify.app/",
      facebook: "https://www.facebook.com/amshuvo1426",
      linkedin: "https://www.linkedin.com/in/md-altaf-mahmud/",
      github: "https://github.com/amshuvo2002",
    },
    {
      name: "Md Siam Khan",
      role: "Founder & Developer",
      image: "https://i.postimg.cc/J0tXV88W/images.jpg",
      portfolio: "",
      facebook: "https://www.facebook.com/siam.khan.9",
      linkedin: "https://www.linkedin.com/in/siam-khan-9b1a4b1b3/",
      github: "https://github.com/siamkhan",
    },
    {
      name: "Md Nayeem Babu",
      role: "Founder & Developer",
      image: "https://i.postimg.cc/J0tXV88W/images.jpg",
      portfolio: "",
      facebook: "https://www.facebook.com/nayeem.babu.9",
      linkedin: "https://www.linkedin.com/in/nayeem-babu-9b1a4b1b3/",
      github: "https://github.com/nayeembabu",
    },
  ];

  return (
    <div className="bg-[var(--bg-primary)]">
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Text */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
              About Flexify
            </h2>

            <p className="text-[var(--text-secondary)] text-base md:text-lg text-start mb-6">
              Flexify is a modern fitness planner platform built by a passionate
              team of six dedicated developers, led by our Founder & Lead
              Developer. Our mission is to make fitness simple, accessible, and
              personalized for everyone. We combine smart technology with
              user-friendly design to help people track workouts, plan routines,
              and stay motivated.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src="https://i.postimg.cc/5tSRf1g7/vision.webp"
              alt="about illustration"
              className="rounded-xl shadow-md w-full max-w-md"
            />
          </div>
        </div>

        {/* Meet Team Section */}
        <section className="pt-16">
          <div className="text-center px-2">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
              Meet the Team
            </h2>

            <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-10 text-sm md:text-base">
              Meet our passionate team of six professionals led by our Founder &
              Lead Developer. Together we build Flexify with creativity and
              technology.
            </p>
          </div>

          {/* Team Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-[var(--card-bg)] rounded-xl shadow text-center p-6 hover:shadow-lg hover:scale-105 transition hover:bg-[var(--primary)] hover:text-white"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 mx-auto rounded-full object-cover mb-3"
                />

                <h3 className="text-xl font-bold hover:text-white transition">
                  {member.name}
                </h3>

                <p className="font-semibold hover:text-white/80 transition">
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
      </section>
    </div>
  );
};

export default About;
