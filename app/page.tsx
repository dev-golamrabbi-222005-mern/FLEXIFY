import FlexifyHero from "@/components/home/FlexifyHero";
import Precision from "@/components/home/Precision";
import Pricing from "@/components/home/Pricing";
import SuccessStory from "@/components/home/SuccessStories";
import StatsSection from "@/components/home/StatsSection";


export default function Home() {
  return (
    <div>
      <FlexifyHero/>
      <Precision/>
      <SuccessStory/>
      <Pricing/>
      <StatsSection></StatsSection>
    </div>
  );
}
