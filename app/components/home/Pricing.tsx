import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Pricing = () => {
    return (
        <section className="px-6 py-24 bg-[#f8f4e3] dark:bg-[#1e1e1e]" id="pricing">
        <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center mb-16 text-center">
                <h2 className="text-4xl font-bold tracking-tight text-[#374151] dark:text-[#e5e7eb]">Choose Your Architecture</h2>
                <p className="mt-4 text-[#4B5563] dark:text-[#9CA3AF]">Plans designed to fit every level of logical optimization.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Basic */}
                <div className="flex flex-col p-8 bg-[rgba(255,255,255,0.7)] shadow-sm shadow- rounded-3xl dark:bg-[rgba(45,45,45,0.7)]">
                    <h3 className="text-xl font-bold">Observer</h3>
                    <div className="flex items-baseline gap-1 mt-4">
                        <span className="text-4xl font-bold">$19</span>
                        <span className="text-gray-500">/mo</span>
                    </div>
                    <p className="mt-4 text-sm text-[#4B5563] dark:text-[#9CA3AF]">Standard rule-set access for casual fitness.</p>
                    <ul className="flex flex-col gap-4 mt-8 text-sm">
                        <li className="flex items-center gap-3"><span className="text-xl material-symbols-outlined text-[#F97316]"><FaCheckCircle /></span> 100 Logic Rules</li>
                        <li className="flex items-center gap-3"><span className="text-xl material-symbols-outlined text-[#F97316]"><FaCheckCircle /></span> Weekly Recalibration</li>
                        <li className="flex items-center gap-3 text-[#9CA3AF]"><span className="text-xl material-symbols-outlined"><FaTimesCircle /></span> Advanced Biometrics</li>
                        <li className="flex items-center gap-3 text-[#9CA3AF]"><span className="text-xl material-symbols-outlined"><FaTimesCircle /></span> Nutrition Rule-Set</li>
                    </ul>
                    <button className="px-4 py-3 mt-10 font-bold border rounded-xl border-[#F97316] text-[#F97316] hover:bg-[#F97316]/5">Start Standard</button>
                </div>
                {/* Pro (Featured) */}
                <div className="relative z-10 flex flex-col p-8 scale-105 bg-[rgba(255,255,255,0.7)] shadow-2xl shadow- rounded-3xl ring-2 ring-[#F97316] dark:bg-[rgba(45,45,45,0.7)]">
                    <div className="absolute px-4 py-1 text-xs font-bold text-white uppercase -translate-x-1/2 rounded-full -top-4 left-1/2 bg-[#F97316]">Recommended</div>
                    <h3 className="text-xl font-bold">Architect</h3>
                    <div className="flex items-baseline gap-1 mt-4">
                        <span className="text-4xl font-bold text-[#F97316]">$49</span>
                        <span className="text-gray-500">/mo</span>
                    </div>
                    <p className="mt-4 text-sm text-[#4B5563] dark:text-[#9CA3AF]">Full logic engine for high-performance results.</p>
                    <ul className="flex flex-col gap-4 mt-8 text-sm">
                        <li className="flex items-center gap-3"><span className="text-xl material-symbols-outlined text-[#F97316]"><FaCheckCircle /></span> 500+ Logic Rules</li>
                        <li className="flex items-center gap-3"><span className="text-xl material-symbols-outlined text-[#F97316]"><FaCheckCircle /></span> Daily Dynamic Recalibration</li>
                        <li className="flex items-center gap-3"><span className="text-xl material-symbols-outlined text-[#F97316]"><FaCheckCircle /></span> Nutrition Logic Integration</li>
                        <li className="flex items-center gap-3"><span className="text-xl material-symbols-outlined text-[#F97316]"><FaCheckCircle /></span> Recovery Protocol Analysis</li>
                    </ul>
                    <button className="px-4 py-3 mt-10 font-bold text-white shadow-lg rounded-xl bg-[#F97316] shadow-[#F97316]/30 hover:bg-orange-600">Start Architecture</button>
                </div>
                {/* Elite */}
                <div className="flex flex-col p-8 bg-[rgba(255,255,255,0.7)] shadow-sm shadow- rounded-3xl dark:bg-[rgba(45,45,45,0.7)]">
                    <h3 className="text-xl font-bold">Synthesizer</h3>
                    <div className="flex items-baseline gap-1 mt-4">
                        <span className="text-4xl font-bold">$99</span>
                        <span className="text-gray-500">/mo</span>
                    </div>
                    <p className="mt-4 text-sm text-[#4B5563] dark:text-[#9CA3AF]">Full platform access with DNA-level logic inputs.</p>
                    <ul className="flex flex-col gap-4 mt-8 text-sm">
                        <li className="flex items-center gap-3"><span className="text-xl material-symbols-outlined text-[#F97316]"><FaCheckCircle /></span> Unlimited Logic Engine</li>
                        <li className="flex items-center gap-3"><span className="text-xl material-symbols-outlined text-[#F97316]"><FaCheckCircle /></span> Real-time Wearable Sync</li>
                        <li className="flex items-center gap-3"><span className="text-xl material-symbols-outlined text-[#F97316]"><FaCheckCircle /></span> DNA Profile Logic Rules</li>
                        <li className="flex items-center gap-3"><span className="text-xl material-symbols-outlined text-[#F97316]"><FaCheckCircle /></span> 1-on-1 Human Strategist</li>
                    </ul>
                    <button className="px-4 py-3 mt-10 font-bold border rounded-xl border-[#F97316] text-[#F97316] hover:bg-[#F97316]/5">Start Synthesizing</button>
                </div>
            </div>
        </div>
        </section>
    );
};

export default Pricing;