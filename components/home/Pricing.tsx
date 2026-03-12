import SectionTitle from "@/app/(website)/components/ui/section-title";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const PLANS = [
  {
    name: "Free",
    price: "0",
    desc: "Start your fitness journey at zero cost.",
    cta: "Get Started Free",
    ctaStyle: "border",
    featured: false,
    features: [
      { label: "BMI Tool", val: true },
      { label: "Workout Library", val: "Limited" },
      { label: "Dashboard Access", val: "Limited" },
      { label: "AI Workout Plan", val: false },
      { label: "Plan Customization", val: false },
      { label: "Nutrition Tracker", val: false },
      { label: "Advanced Analytics", val: false },
      { label: "Personal Coach", val: false },
      { label: "Coach Messaging", val: false },
      { label: "Custom Plan by Coach", val: false },
    ],
  },
  {
    name: "Pro",
    price: "12",
    desc: "AI-powered tools for serious training.",
    cta: "Start Pro",
    ctaStyle: "filled",
    featured: true,
    features: [
      { label: "BMI Tool", val: true },
      { label: "Workout Library", val: "Full" },
      { label: "Dashboard Access", val: "Full" },
      { label: "AI Workout Plan", val: true },
      { label: "Plan Customization", val: true },
      { label: "Nutrition Tracker", val: true },
      { label: "Advanced Analytics", val: true },
      { label: "Personal Coach", val: false },
      { label: "Coach Messaging", val: false },
      { label: "Custom Plan by Coach", val: false },
    ],
  },
  {
    name: "Elite",
    price: "29",
    desc: "Everything Pro & your own personal coach.",
    cta: "Go Elite",
    ctaStyle: "border-primary",
    featured: false,
    features: [
      { label: "BMI Tool", val: true },
      { label: "Workout Library", val: "Full" },
      { label: "Dashboard Access", val: "Full" },
      { label: "AI Workout Plan", val: true },
      { label: "Plan Customization", val: true },
      { label: "Nutrition Tracker", val: true },
      { label: "Advanced Analytics", val: true },
      { label: "Personal Coach", val: true },
      { label: "Coach Messaging", val: true },
      { label: "Custom Plan by Coach", val: true },
    ],
  },
];

function FeatureValue({ val }: { val: boolean | string }) {
  if (val === true)
    return <FaCheckCircle className="text-[var(--primary)] text-lg mx-auto" />;
  if (val === false)
    return <FaTimesCircle className="text-red-400 text-lg mx-auto" />;
  return (
    <span
      className="text-xs font-black uppercase tracking-wider"
      style={{ color: "var(--primary)" }}
    >
      {val}
    </span>
  );
}

const Pricing = () => {
  return (
    <section className="pb-8 md:pb-12 bg-[var(--bg-primary)]" id="pricing">
      <div className="px-6 mx-auto max-w-7xl">
        <SectionTitle
          title="Choose Your Plan"
          subtitle="Simple, transparent pricing for every stage of your fitness journey."
        />

        <div
          className="mt-12 rounded-3xl overflow-hidden"
          style={{ border: "3px solid var(--border-color)" }}
        >
          {/* ── Header row ── */}
          <div
            className="grid grid-cols-4"
            style={{ background: "var(--bg-secondary)" }}
          >
            {/* Feature column header */}
            <div className="px-6 py-5 flex items-center justify-center">
              <span
                className="text-2xl font-extrabold uppercase tracking-widest"
                style={{ color: "var(--text-secondary)" }}
              >
                Features
              </span>
            </div>

            {/* Plan headers */}
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="relative px-6 py-5 text-center flex flex-col items-center"
                style={{
                  background: plan.featured
                    ? "rgba(244,121,32,0.06)"
                    : "transparent",
                  borderLeft: "1px solid var(--border-color)",
                  borderTop: plan.featured
                    ? "3px solid var(--primary)"
                    : "3px solid transparent",
                }}
              >
                {plan.featured && (
                  <div
                    className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-b-lg text-[9px] font-black uppercase tracking-widest text-white"
                    style={{ background: "var(--primary)" }}
                  >
                    Recommended
                  </div>
                )}
                <p
                  className="font-black text-base mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-0.5 mb-1">
                  <span
                    className="text-3xl font-black"
                    style={{
                      color: plan.featured
                        ? "var(--primary)"
                        : "var(--text-primary)",
                    }}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    /mo
                  </span>
                </div>
                <p
                  className="text-[13px] leading-snug mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {plan.desc}
                </p>
                <button
                  className="btn-primary btn-primary:hover w-full"
                  style={
                    plan.ctaStyle === "filled"
                      ? {
                          background: "var(--primary)",
                          color: "#fff",
                          boxShadow: "0 4px 16px rgba(244,121,32,0.35)",
                        }
                      : {
                          border: "1.5px solid var(--primary)",
                          color: "var(--primary)",
                          background: "transparent",
                        }
                  }
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* ── Feature rows ── */}
          {PLANS[0].features.map((f, fi) => (
            <div
              key={f.label}
              className="grid grid-cols-4"
              style={{
                borderTop: "1px solid var(--border-color)",
                background:
                  fi % 2 === 0 ? "var(--bg-primary)" : "var(--bg-secondary)",
              }}
            >
              {/* Feature label */}
              <div className="px-6 py-4 flex items-center">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {f.label}
                </span>
              </div>

              {/* Value per plan */}
              {PLANS.map((plan) => {
                const feature = plan.features[fi];
                return (
                  <div
                    key={plan.name}
                    className="px-6 py-4 flex items-center justify-center"
                    style={{
                      borderLeft: "1px solid var(--border-color)",
                      background: plan.featured
                        ? "rgba(244,121,32,0.03)"
                        : "transparent",
                    }}
                  >
                    <FeatureValue val={feature.val} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
