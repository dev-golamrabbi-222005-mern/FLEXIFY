"use client";

import Image from "next/image";
import body01 from "../../public/bodychallange01.png"; // full body image
import body02 from "../../public/bodychallange02.png"; // lower body image
import SectionTitle from "@/app/(website)/components/ui/section-title";

const BodyChallenge = () => {
  return (
    <section className="py-12 md:py-16 bg-[var(--bg-primary)] transition-colors duration-400">
      <div className="max-w-7xl mx-auto px-4">
        <SectionTitle
          title="7x4 Challenge"
          className="text-[var(--text-primary)]"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
          {/* Card 1 - Full Body */}
          <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8 shadow-[var(--shadow)] hover:shadow-lg transition-all duration-300 backdrop-blur-md">
            {/* Text */}
            <div className="flex-1 text-[var(--text-primary)]">
              <h3 className="text-2xl md:text-2xl font-extrabold mb-4 drop-shadow-md">
                FULL BODY <br /> 7X4 CHALLENGE
              </h3>
              <p className="mb-6 text-[var(--text-secondary)] max-w-md">
                Start your body-toning journey to target all muscle groups and
                build your dream physique in just 4 weeks.
              </p>
              <button className="btn-primary w-full px-8 py-3">START NOW</button>
            </div>

            {/* Image */}
            <div className="flex-1 relative w-full h-52">
              <Image
                src={body01}
                alt="Full Body Challenge"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Card 2 - Lower Body */}
          <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8 shadow-[var(--shadow)] hover:shadow-lg transition-all duration-300 backdrop-blur-md">
            {/* Text */}
            <div className="flex-1 text-[var(--text-primary)]">
              <h3 className="text-2xl md:text-2xl font-extrabold mb-4 drop-shadow-md">
                LOWER BODY <br /> 7X4 CHALLENGE
              </h3>
              <p className="mb-6 text-[var(--text-secondary)] max-w-md">
                In just 4 weeks, power up your legs, boost lower body strength,
                and enhance your overall athletic performance.
              </p>
              <button className="btn-primary w-full px-8 py-3">START NOW</button>
            </div>

            {/* Image */}
            <div className="flex-1 relative w-full h-52">
              <Image
                src={body02}
                alt="Lower Body Challenge"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BodyChallenge;


