import FlexifyHero from "@/components/home/FlexifyHero";
import Precision from "@/components/home/Precision";
import Pricing from "@/components/home/Pricing";
import SuccessStory from "@/components/home/SuccessStories";
import StatsSection from "@/components/StatsSection";


export default function Home() {
  return (
    <div>
      <FlexifyHero/>
      <SuccessStory/>
      <Precision/>
      <Pricing/>
      <StatsSection></StatsSection>
    </div>
  );
}
