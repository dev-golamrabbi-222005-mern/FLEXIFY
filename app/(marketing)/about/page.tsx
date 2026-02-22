import React from "react";
import { FaFacebookF, FaLinkedinIn, FaMediumM } from "react-icons/fa";
import { FaGithub, FaPassport } from "react-icons/fa6";

const About = () => {
  const teamMembers = [
    {
      name: "Md. Golam Rabbi",
      role: "Founder & Developer",
      image: "https://i.postimg.cc/J0tXV88W/images.jpg",
      facebook: "https://www.facebook.com/golamrabbi",
      linkedin: "https://www.linkedin.com/in/golam-rabbi-9b1a4b1b3/",
      github: "https://github.com/golamrabbi"
    },
    {
      name: "Jubayer Hossain",
      role: "Founder & Developer",
      image: "https://i.postimg.cc/FzTr6D42/JUBAYER_Photo.jpg",
      facebook: "https://www.facebook.com/jubayer.hossain.9",
      linkedin: "https://www.linkedin.com/in/jubayer-hossain-9b1a4b1b3/",
      github: "https://github.com/jubayerhossain"
    },
    {
      name: "Md Ashiqur Rahman Pranto",
      role: "Founder & Developer",
      image: "https://i.postimg.cc/J0tXV88W/images.jpg",
      facebook: "https://www.facebook.com/ashiqur.rahman.pranto",
      linkedin: "https://www.linkedin.com/in/ashiqur-rahman-pranto-9b1a4b1b3/",
      github: "https://github.com/ashiqurrahmanpranto"
    },
    {
      name: "Md Altaf Mahmud",
      role: "Founder & Developer",
      image: "https://i.postimg.cc/J0tXV88W/images.jpg",
      facebook: "https://www.facebook.com/altaf.mahmud.9",
      linkedin: "https://www.linkedin.com/in/altaf-mahmud-9b1a4b1b3/",
      github: "https://github.com/altafmahmud"
    },
    {
      name: "Md Siam Khan",
      role: "Founder & Developer",
      image: "https://i.postimg.cc/J0tXV88W/images.jpg",
      facebook: "https://www.facebook.com/siam.khan.9",
      linkedin: "https://www.linkedin.com/in/siam-khan-9b1a4b1b3/",
      github: "https://github.com/siamkhan"
    },
    {
      name: "Md Nayeem Babu",
      role: "Founder & Developer",
      image: "https://i.postimg.cc/J0tXV88W/images.jpg",
      facebook: "https://www.facebook.com/nayeem.babu.9",
      linkedin: "https://www.linkedin.com/in/nayeem-babu-9b1a4b1b3/",
      github: "https://github.com/nayeembabu"
    },
  ];
  return (
    <div className="bg-[var(--bg-nav-footer)]">
        <section className="py-16 px-6 md:px-20 w-7xl mx-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center ">
        {/* Left Text Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-6">
            About Flexify
          </h2>

          <p className="text-[var(--text-secondary)] text-lg leading-7 mb-4">
            Flexify is a modern fitness planner platform built by a passionate team of six dedicated developers, led by our Founder & Lead Developer. Our mission is to make fitness simple, accessible, and personalized for everyone. We combine smart technology with user-friendly design to help people track workouts, plan routines, and stay motivated on their fitness journey. Each team member brings unique skills and creativity, allowing us to build reliable, high-quality features. At Flexify, we believe consistency creates results, and we are committed to supporting users with powerful tools that turn healthy goals into daily habits.
          </p>
        </div>

        {/* Right Image Section */}
        <div className="flex justify-center">
          <img
            src="https://i.postimg.cc/5tSRf1g7/vision.webp"
            alt="about illustration"
            className="w-full max-w-md rounded"
          />
        </div>
      </div>

      <section className=" py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
            Meet the Team
          </h2>

          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mb-12">
            Meet our passionate team of six dedicated professionals, led by our Founder & Lead Developer. Together, we collaborate to design, build, and improve Flexify, combining creativity and technology to deliver a powerful, user-friendly fitness planning experience for everyone.
          </p>

          {/* Team Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-[var(--bg-primary)] rounded-xl shadow-md p-8 hover:shadow-xl transition"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 mx-auto rounded-full object-cover mb-4"
                />

                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  {member.name}
                </h3>

                <p className="text-[var(--text-secondary)] mt-1">{member.role}</p>
                <div className="flex items-center justify-center gap-4 text-lg mt-4">
                  <FaPassport className="hover:text-[var(--secondary)] cursor-pointer"/>
                  <FaFacebookF className="hover:text-[var(--secondary)] cursor-pointer" />
                  <FaLinkedinIn className="hover:text-[var(--secondary)] cursor-pointer" />
                  <FaGithub className="hover:text-[var(--secondary)] cursor-pointer" />
          </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
    </div>
  );
};

export default About;
