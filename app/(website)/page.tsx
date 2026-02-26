import FlexifyHero from "@/components/home/FlexifyHero";
import Precision from "@/components/home/Precision";
import Pricing from "@/components/home/Pricing";
import SuccessStory from "@/components/home/SuccessStories";
import StatsSection from "@/components/home/StatsSection";
import BMI from "@/components/home/BMI";
import Motivation from "@/components/home/Motivation";
import BecomeCoachCTA from "@/components/home/BecomeCoachCTA";
import PopularWorkouts from "@/components/home/PopularWorkouts";
import TopCoaches from "@/components/home/Topcoaches";

export default function Home() {
  return (
    <div>
      <FlexifyHero/>
      <StatsSection/>
      <Precision/>
      <BMI/>
      <PopularWorkouts/>
      <SuccessStory/>
      <BecomeCoachCTA/>
      <TopCoaches/>
      <Pricing/>
      <Motivation/>
    </div>
  );
}
