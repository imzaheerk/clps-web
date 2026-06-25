import ScrollReveal from "@/components/ScrollReveal";
import ResendFeatureBlock from "@/components/ResendFeatureBlock";
import { ResendDualPanelShowcase } from "@/components/ResendShowcaseVariants";

export default function CommunityStatsSection() {
  return (
    <ScrollReveal variant="blur-up">
      <ResendFeatureBlock
        glow="sky"
        kicker="Trust & safety"
        title="Built for Safe, Local Connections"
        description="Checknown helps you discover nearby people, communicate clearly, and stay in control of your privacy."
      >
        <ResendDualPanelShowcase
          leftBadge="Protected"
          leftTarget="Your privacy settings"
          leftTitle="What you control"
          statusItems={[
            { label: "Profile verification", status: "Verified", tone: "success" },
            { label: "Nearby discovery", status: "Location-first", tone: "info" },
            { label: "Contact details", status: "Masked", tone: "violet" },
            { label: "Direct messages", status: "Encrypted", tone: "success" },
          ]}
          events={[
            {
              type: "delivered",
              title: "Verified",
              detail: "Your profile is verified and visible only within the radius you choose.",
              time: "Today",
              pills: ["2 km radius", "Profile active"],
            },
            {
              type: "viewed",
              title: "Reviewed",
              detail: "Privacy controls checked — new contact requests need your approval first.",
              time: "Today",
              pills: ["Privacy on", "Requests filtered"],
            },
            {
              type: "clicked",
              title: "Connected",
              detail: "You started a conversation with someone nearby in your area.",
              time: "Today",
              pills: ["Priya S.", "Message sent"],
            },
          ]}
        />
      </ResendFeatureBlock>
    </ScrollReveal>
  );
}
