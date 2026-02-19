import SectionTitle from "@/app/Components/ui/section-title";
import React from "react";
import { IoMdTrendingUp } from "react-icons/io";
import { IoServer } from "react-icons/io5";
import { MdSettingsInputComponent } from "react-icons/md";

const Precision = () => {
  return (
    <section className="pb-8 md:pb-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* <h2 className="text-4xl font-semibold text-gray-800">
          Precision Programming
        </h2>

        <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 mb-6 rounded"></div>

        <p className="max-w-2xl mx-auto text-gray-500 text-lg mb-16">
          Our intelligent system builds your perfect routine in three logical
          steps, adapting in real-time to your biological feedback.
        </p> */}
        <SectionTitle
          title="Precision Programming"
          subtitle="Our intelligent system builds your perfect routine in three logical
          steps, adapting in real-time to your biological feedback."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          <div className="bg-(--card-bg) rounded-2xl p-8 text-left relative">
            <span className="absolute top-6 right-6 text-5xl font-bold opacity-20">
              01
            </span>

            <div className="w-12 h-12 border border-(--primary)  rounded-xl flex items-center justify-center mb-6">
              <span className="text-orange-500 text-xl ">
                <IoServer />
              </span>
            </div>

            <h3 className="text-xl font-bold mb-3">
              Input Metrics
            </h3>
            <p className="text-(--text-secondary)">
              Log your biology, preferences, and performance goals into our
              secure portal for initial processing.
            </p>
          </div>

          <div className="bg-(--card-bg) rounded-2xl p-8 text-left relative">
            <span className="absolute top-6 right-6 text-5xl font-bold opacity-20">
              02
            </span>

            <div className="w-12 h-12 border border-(--primary) rounded-xl flex items-center justify-center mb-6">
              <span className="text-orange-500 text-xl">
                <MdSettingsInputComponent />
              </span>
            </div>

            <h3 className="text-xl font-bold  mb-3">
              Algorithmic Design
            </h3>
            <p className="text-(--text-secondary)">
              Our engine applies 500+ logic rules to your profile to architect a
              custom training and nutrition blueprint.
            </p>
          </div>

          <div className="bg-(--card-bg) rounded-2xl p-8 text-left relative">
            <span className="absolute top-6 right-6 text-5xl font-bold opacity-20">
              03
            </span>

            <div className="w-12 h-12 border border-(--primary) rounded-xl flex items-center justify-center mb-6">
              <span className="text-orange-500 text-xl">
                <IoMdTrendingUp />
              </span>
            </div>

            <h3 className="text-xl font-bold  mb-3">
              Dynamic Evolution
            </h3>
            <p className="text-(--text-secondary)">
              Your plan automatically recalibrates and adjusts as you hit new
              milestones and physiological shifts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Precision;
