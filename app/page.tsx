import FlexifyHero from "@/components/home/FlexifyHero";
import Precision from "@/components/home/Precision";
import Pricing from "@/components/home/Pricing";
import SuccessStory from "@/components/home/SuccessStories";
import StatsSection from "@/components/home/StatsSection";
import BMI from "@/components/home/BMI";
import Motivation from "@/components/home/Motivation";

export default function Home() {
  return (
    <div>
      <FlexifyHero/>
      <Precision/>
      <StatsSection/>
      <Pricing/>
      <SuccessStory/>
      <BMI/>
      <Motivation/>
    </div>
  );
}
