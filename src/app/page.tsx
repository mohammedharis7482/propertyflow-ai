import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import FadeUp from "@/components/shared/FadeUp";

import HeroSection from "@/components/sections/HeroSection";
import FeaturedPropertiesSection from "@/components/sections/FeaturedPropertiesSection";
import PropertyCategoriesSection from "@/components/sections/PropertyCategoriesSection";
import PopularLocationsSection from "@/components/sections/PopularLocationsSection";
import WhyPropertyFlowSection from "@/components/sections/WhyPropertyFlowSection";
import AIAssistantShowcaseSection from "@/components/sections/AIAssistantShowcaseSection";
import TopAgentsSection from "@/components/sections/TopAgentsSection";
import MarketInsightsSection from "@/components/sections/MarketInsightsSection";
import CTASection from "@/components/sections/CTASection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />

        <FadeUp>
          <FeaturedPropertiesSection />
        </FadeUp>

        <FadeUp>
          <PropertyCategoriesSection />
        </FadeUp>

        <FadeUp>
          <PopularLocationsSection />
        </FadeUp>

        <FadeUp>
          <WhyPropertyFlowSection />
        </FadeUp>

        <FadeUp>
          <AIAssistantShowcaseSection />
        </FadeUp>

        <FadeUp>
          <TopAgentsSection />
        </FadeUp>

        <FadeUp>
          <MarketInsightsSection />
        </FadeUp>

        <FadeUp>
          <CTASection />
        </FadeUp>
      </main>

      <Footer />
    </>
  );
}
