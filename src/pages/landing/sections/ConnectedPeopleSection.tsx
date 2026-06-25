import ScrollReveal from "@/components/ScrollReveal";
import ResendFeatureBlock from "@/components/ResendFeatureBlock";
import { ResendDashboardShowcase } from "@/components/ResendShowcaseVariants";

export default function ConnectedPeopleSection() {
  return (
    <ScrollReveal variant="blur-up">
      <ResendFeatureBlock
        glow="sky"
        kicker="Community"
        title="Join a Growing Network"
        description="Thousands of people are already connected. See how our community grows and connects every day."
      >
        <ResendDashboardShowcase
          left={{
            kicker: "Network",
            title: "Community growth",
            stats: [
              { label: "LIVE NETWORK", value: "Active" },
              { label: "CONNECTIONS", value: "Growing" },
              { label: "ONBOARDING", value: "Live" },
            ],
            chart: "green",
          }}
          right={{
            kicker: "STATUS",
            value: "Live",
            metrics: [
              {
                label: "Community growth in progress",
                value: "Onboarding",
                tone: "success",
              },
              {
                label: "Connection features refining",
                value: "Updating",
                tone: "info",
              },
            ],
            secondary: { label: "EXPERIENCE", value: "Improving" },
          }}
        />
        <div className="resend-showcase-badges resend-showcase-badges--centered">
          <span className="resend-badge">
            <span className="resend-list-status resend-list-status--success" />
            Live Network
          </span>
          <span className="resend-badge">
            <span className="resend-list-status resend-list-status--success" />
            Active Connections
          </span>
        </div>
      </ResendFeatureBlock>
    </ScrollReveal>
  );
}
