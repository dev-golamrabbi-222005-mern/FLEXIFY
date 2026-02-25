"use client";

import { useState } from "react";
import Image from "next/image";
import SectionTitle from "@/app/Components/ui/section-title";
import ImgBMI from "../../public/bmi-calculator.jpg"

const BMI = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [status, setStatus] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) return;

    const heightInMeter = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    const result = weightInKg / (heightInMeter * heightInMeter);
    const roundedBMI = parseFloat(result.toFixed(2));

    setBmi(roundedBMI);

    if (roundedBMI < 18.5) {
      setStatus("Underweight");
    } else if (roundedBMI >= 18.5 && roundedBMI < 24.9) {
      setStatus("Normal Weight");
    } else if (roundedBMI >= 25 && roundedBMI < 29.9) {
      setStatus("Overweight");
    } else {
      setStatus("Obese");
    }
  };

  const clearBMI = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setStatus("");
  };

  return (
    <section className="pb-8 md:pb-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <SectionTitle
          title="BMI Calculator"
          subtitle="Check your Body Mass Index instantly using your height and weight."
        />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Image */}
          <div className="group flex justify-center transition-all duration-300">
            <div
              className="rounded-2xl overflow-hidden transition-all duration-300
               group-hover:-translate-y-2
               group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
            >
              <Image
                src={
                  "https://www.godigit.com/content/dam/godigit/directportal/en/bmi-calculator-for-men-women-and-kids.jpg"
                }
                alt="BMI Illustration"
                width={400}
                height={400}
                className="rounded-2xl object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* BMI Card */}
          <div className="max-w-md mx-auto w-full">
            <div
              className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
            >
              <div className="mb-4">
                <label className="block mb-2 text-[var(--text-primary)]">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-3 rounded-lg bg-transparent border border-[var(--primary)]
                             focus:outline-none text-[var(--text-primary)]"
                  placeholder="Enter height in cm"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-[var(--text-primary)]">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3 rounded-lg bg-transparent border border-[var(--primary)]
                             focus:outline-none text-[var(--text-primary)]"
                  placeholder="Enter weight in kg"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={calculateBMI}
                  className="w-full py-3 rounded-xl font-semibold
                             bg-[var(--primary)] text-white
                             transition-all duration-300
                             hover:opacity-90"
                >
                  Calculate
                </button>

                <button
                  onClick={clearBMI}
                  className="w-full py-3 rounded-xl font-semibold
                             border border-[var(--primary)]
                             text-[var(--primary)]
                             transition-all duration-300
                             hover:bg-[var(--primary)]
                             hover:text-white"
                >
                  Clear
                </button>
              </div>

              {bmi !== null && (
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    Your BMI: {bmi}
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    Status: {status}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BMI;