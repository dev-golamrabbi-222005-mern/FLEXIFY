import BecomeCoachCTA from "@/components/home/BecomeCoachCTA";
import BMI from "@/components/home/BMI";
import FAQ from "@/components/home/FAQ";
import FlexifyHero from "@/components/home/FlexifyHero";
import Motivation from "@/components/home/Motivation";
import PopularWorkouts from "@/components/home/PopularWorkouts";
import Precision from "@/components/home/Precision";
import Pricing from "@/components/home/Pricing";
import StatsSection from "@/components/home/StatsSection";
import SuccessStory from "@/components/home/SuccessStories";
import TopCoaches from "@/components/home/Topcoaches";


export default function Home() {
  return (
    <div>
      <FlexifyHero />
      <StatsSection />
      <Precision />
      <BMI />
      <PopularWorkouts />
      <SuccessStory />
      <TopCoaches />
      <BecomeCoachCTA />
      <Pricing />
      <FAQ />
      <Motivation />
    </div>
  );
}
