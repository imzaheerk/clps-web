import ScrollReveal from "@/components/ScrollReveal";
import ResendFeatureBlock from "@/components/ResendFeatureBlock";
import { ResendDashboardShowcase } from "@/components/ResendShowcaseVariants";

export default function UseCasesSection() {
  return (
    <ScrollReveal variant="blur-up">
      <ResendFeatureBlock
        glow="violet"
        kicker="Use cases"
        title="Built for Real-life Connections"
        description="Whether you're new to an area or looking to strengthen your local network, Checknown helps you connect with people around you in meaningful ways."
      >
        <ResendDashboardShowcase
          left={{
            kicker: "Community",
            title: "Local circles",
            stats: [
              { label: "NEIGHBORS", value: "48" },
              { label: "ANNOUNCEMENTS", value: "12" },
              { label: "ACTIVE CHATS", value: "7" },
            ],
            chart: "green",
          }}
          right={{
            kicker: "CONTROL",
            value: "You",
            metrics: [
              { label: "Local community first", value: "On", tone: "success" },
              { label: "Announcements that matter", value: "Live", tone: "info" },
              { label: "You're in control", value: "Enabled", tone: "violet" },
            ],
            secondary: { label: "YOUR NETWORK", value: "Growing" },
          }}
        />
        <ul className="resend-check-list resend-check-list--standalone">
          <li>Find neighbours and people in your locality.</li>
          <li>Share and discover local announcements and updates.</li>
          <li>Stay connected through messaging and notifications.</li>
        </ul>
      </ResendFeatureBlock>
    </ScrollReveal>
  );
}
