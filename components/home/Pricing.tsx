import SectionTitle from "@/app/Components/ui/section-title";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Pricing = () => {
    return (
      <section
        className="pb-8 md:pb-12 bg-[var(--bg-primary)]"
        id="pricing"
      >
        <div className="mx-auto max-w-7xl px-6 pb-12 shadow-md">
          {/* <div className="flex flex-col items-center mb-16 text-center">
                <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">Choose Your Architecture</h2>
                <p className="mt-4 text-[var(--text-secondary)]">Plans designed to fit every level of logical optimization.</p>
            </div> */}
          <SectionTitle
            title="Choose Your Architecture"
            subtitle="Plans designed to fit every level of logical optimization."
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Basic */}
            <div className="flex flex-col p-8 bg-(--card-bg) shadow-sm shadow- rounded-3xl">
              <h3 className="text-xl font-bold">Observer</h3>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-(--text-secondary)">/mo</span>
              </div>
              <p className="mt-4 text-sm text-(--text-secondary)">
                Standard rule-set access for casual fitness.
              </p>
              <ul className="flex flex-col gap-4 mt-8 text-sm">
                <li className="flex items-center gap-3">
                  <span className="text-xl material-symbols-outlined text-(--primary)">
                    <FaCheckCircle />
                  </span>{" "}
                  100 Logic Rules
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl material-symbols-outlined text-(--primary)">
                    <FaCheckCircle />
                  </span>{" "}
                  Weekly Recalibration
                </li>
                <li className="flex items-center gap-3 text-(--text-secondary)">
                  <span className="text-xl material-symbols-outlined">
                    <FaTimesCircle />
                  </span>{" "}
                  Advanced Biometrics
                </li>
                <li className="flex items-center gap-3 text-(--text-secondary)">
                  <span className="text-xl material-symbols-outlined">
                    <FaTimesCircle />
                  </span>{" "}
                  Nutrition Rule-Set
                </li>
              </ul>
              <button className="px-4 py-3 mt-10 font-bold border rounded-xl border-(--primary) text-(--text-primary) hover:bg-(--primary)/5">
                Start Standard
              </button>
            </div>
            {/* Pro (Featured) */}
            <div className="relative z-10 flex flex-col p-8 scale-105 bg-(--card-bg) shadow-2xl shadow- rounded-3xl ring-2 ring-(--primary)">
              <div className="absolute px-4 py-1 text-xs font-bold text-white uppercase -translate-x-1/2 rounded-full -top-4 left-1/2 bg-(--primary)">
                Recommended
              </div>
              <h3 className="text-xl font-bold">Architect</h3>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-(--text-primary)">
                  $49
                </span>
                <span className="text-gray-500">/mo</span>
              </div>
              <p className="mt-4 text-sm text-(--text-secondary)">
                Full logic engine for high-performance results.
              </p>
              <ul className="flex flex-col gap-4 mt-8 text-sm">
                <li className="flex items-center gap-3">
                  <span className="text-xl material-symbols-outlined text-(--primary)">
                    <FaCheckCircle />
                  </span>{" "}
                  500+ Logic Rules
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl material-symbols-outlined text-(--primary)">
                    <FaCheckCircle />
                  </span>{" "}
                  Daily Dynamic Recalibration
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl material-symbols-outlined text-(--primary)">
                    <FaCheckCircle />
                  </span>{" "}
                  Nutrition Logic Integration
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl material-symbols-outlined text-(--primary)">
                    <FaCheckCircle />
                  </span>{" "}
                  Recovery Protocol Analysis
                </li>
              </ul>
              <button className="px-4 py-3 mt-10 font-bold text-white shadow-lg rounded-xl bg-(--primary) shadow-(--primary)/30 hover:bg-orange-600">
                Start Architecture
              </button>
            </div>
            {/* Elite */}
            <div className="flex flex-col p-8 bg-(--card-bg) shadow-sm shadow- rounded-3xl">
              <h3 className="text-xl font-bold">Synthesizer</h3>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <p className="mt-4 text-sm text-(--text-secondary)">
                Full platform access with DNA-level logic inputs.
              </p>
              <ul className="flex flex-col gap-4 mt-8 text-sm">
                <li className="flex items-center gap-3">
                  <span className="text-xl material-symbols-outlined text-(--primary)">
                    <FaCheckCircle />
                  </span>{" "}
                  Unlimited Logic Engine
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl material-symbols-outlined text-(--primary)">
                    <FaCheckCircle />
                  </span>{" "}
                  Real-time Wearable Sync
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl material-symbols-outlined text-(--primary)">
                    <FaCheckCircle />
                  </span>{" "}
                  DNA Profile Logic Rules
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl material-symbols-outlined text-(--primary)">
                    <FaCheckCircle />
                  </span>{" "}
                  1-on-1 Human Strategist
                </li>
              </ul>
              <button className="px-4 py-3 mt-10 font-bold border rounded-xl border-(--primary) text-(--primary) hover:bg-(--primary)/5">
                Start Synthesizing
              </button>
            </div>
          </div>
        </div>
      </section>
    );
};

export default Pricing;