import SectionTitle from "@/app/Components/ui/section-title";
import { IoMdTrendingUp } from "react-icons/io";
import { IoServer } from "react-icons/io5";
import { MdSettingsInputComponent } from "react-icons/md";

const Precision = () => {
  return (
    <section className="pb-8 md:pb-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <SectionTitle
          title="Precision Programming"
          subtitle="Our intelligent system builds your perfect routine in three logical
          steps, adapting in real-time to your biological feedback."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {/* Card 01 */}
          <div
            className="group bg-[var(--card-bg)] rounded-2xl p-8 text-left relative
                       transition-all duration-300
                       hover:bg-[var(--primary)]
                       hover:-translate-y-2
                       hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
          >
            <span
              className="absolute top-6 right-6 text-5xl font-bold opacity-20 
                             transition-colors
                             group-hover:text-white"
            >
              01
            </span>

            <div
              className="w-12 h-12 border border-[var(--primary)] rounded-xl 
                         flex items-center justify-center mb-6
                         transition-all duration-300
                         group-hover:border-white"
            >
              <span className="text-[var(--primary)] text-xl transition-colors group-hover:text-white">
                <IoServer />
              </span>
            </div>

            <h3
              className="text-xl font-bold mb-3 
                         text-[var(--text-primary)]
                         transition-colors
                         group-hover:text-white"
            >
              Input Metrics
            </h3>

            <p
              className="text-[var(--text-secondary)]
                         transition-colors
                         group-hover:text-white/90"
            >
              Log your biology, preferences, and performance goals into our
              secure portal for initial processing.
            </p>
          </div>

          {/* Card 02 */}
          <div
            className="group bg-[var(--card-bg)] rounded-2xl p-8 text-left relative
                       transition-all duration-300
                       hover:bg-[var(--primary)]
                       hover:-translate-y-2
                       hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
          >
            <span
              className="absolute top-6 right-6 text-5xl font-bold opacity-20 
                             transition-colors
                             group-hover:text-white"
            >
              02
            </span>

            <div
              className="w-12 h-12 border border-[var(--primary)] rounded-xl 
                         flex items-center justify-center mb-6
                         transition-all duration-300
                         group-hover:border-white"
            >
              <span className="text-[var(--primary)] text-xl transition-colors group-hover:text-white">
                <MdSettingsInputComponent />
              </span>
            </div>

            <h3
              className="text-xl font-bold mb-3 
                         text-[var(--text-primary)]
                         transition-colors
                         group-hover:text-white"
            >
              Algorithmic Design
            </h3>

            <p
              className="text-[var(--text-secondary)]
                         transition-colors
                         group-hover:text-white/90"
            >
              Our engine applies 500+ logic rules to your profile to architect a
              custom training and nutrition blueprint.
            </p>
          </div>

          {/* Card 03 */}
          <div
            className="group bg-[var(--card-bg)] rounded-2xl p-8 text-left relative
                       transition-all duration-300
                       hover:bg-[var(--primary)]
                       hover:-translate-y-2
                       hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
          >
            <span
              className="absolute top-6 right-6 text-5xl font-bold opacity-20 
                             transition-colors
                             group-hover:text-white"
            >
              03
            </span>

            <div
              className="w-12 h-12 border border-[var(--primary)] rounded-xl 
                         flex items-center justify-center mb-6
                         transition-all duration-300
                         group-hover:border-white"
            >
              <span className="text-[var(--primary)] text-xl transition-colors group-hover:text-white">
                <IoMdTrendingUp />
              </span>
            </div>

            <h3
              className="text-xl font-bold mb-3 
                         text-[var(--text-primary)]
                         transition-colors
                         group-hover:text-white"
            >
              Dynamic Evolution
            </h3>

            <p
              className="text-[var(--text-secondary)]
                         transition-colors
                         group-hover:text-white/90"
            >
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
