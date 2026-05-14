import { useState } from "react";
import { Header, AnimatedBackground, ConnectedPeopleSection } from "@/components";
import StartupNoticeModal from "@/components/StartupNoticeModal";
import {
  HeroSection,
  CommunityStatsSection,
  HowChecknownHelpsSection,
  ProductHighlightsSection,
  HowItWorksSection,
  UseCasesSection,
  MobileAppSection,
  FinalCtaSection,
  FooterSection,
} from "./sections";

export default function Landing() {
  const [showStartupNotice, setShowStartupNotice] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
      <StartupNoticeModal
        visible={showStartupNotice}
        onHide={() => setShowStartupNotice(false)}
      />

      {/* Lightweight visual background effect */}
      <AnimatedBackground variant="minimal" />

      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Connected People Section */}
      <ConnectedPeopleSection />

      {/* Community Stats Section */}
      <CommunityStatsSection />

      {/* How Checknown Helps Section */}
      <HowChecknownHelpsSection />

      {/* Product Highlights Section */}
      <ProductHighlightsSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Mobile App Section */}
      <MobileAppSection />

      {/* Final CTA Section */}
      <FinalCtaSection />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
