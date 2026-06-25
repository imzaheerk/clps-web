import { useState } from "react";

import { Header, ConnectedPeopleSection } from "@/components";

import StartupNoticeModal from "@/components/StartupNoticeModal";

import {

  HeroSection,

  CommunityStatsSection,

  ShippedModulesSection,

  HowChecknownHelpsSection,

  ProductHighlightsSection,

  HowItWorksSection,

  UseCasesSection,

  MobileAppSection,

  PricingSnapshotSection,

  FinalCtaSection,

  FooterSection,

} from "./sections";



export default function Landing() {

  const [showStartupNotice, setShowStartupNotice] = useState(true);



  return (

    <div className="landing-resend min-h-screen flex flex-col relative overflow-x-hidden">

      <StartupNoticeModal

        visible={showStartupNotice}

        onHide={() => setShowStartupNotice(false)}

      />



      <div className="landing-resend-bg pointer-events-none" aria-hidden="true">

        <div className="landing-resend-ray landing-resend-ray-left" />

        <div className="landing-resend-ray landing-resend-ray-right" />

        <div className="landing-resend-glow landing-resend-glow-top" />

        <div className="landing-resend-glow landing-resend-glow-bottom" />

      </div>



      <div className="landing-resend-content flex flex-col flex-1">

        <Header />



        <HeroSection />

        <ConnectedPeopleSection />

        <ShippedModulesSection />

        <CommunityStatsSection />

        <HowChecknownHelpsSection />

        <ProductHighlightsSection />

        <HowItWorksSection />

        <UseCasesSection />

        <MobileAppSection />

        <PricingSnapshotSection />

        <FinalCtaSection />

        <FooterSection />

      </div>

    </div>

  );

}

