import ScrollReveal from "@/components/ScrollReveal";
import ResendFeatureBlock from "@/components/ResendFeatureBlock";
import { ResendTabShowcase } from "@/components/ResendShowcaseVariants";

export default function HowItWorksSection() {
  return (
    <ScrollReveal variant="blur-up">
      <ResendFeatureBlock
        glow="amber"
        kicker="How it works"
        title="How Checknown Works"
        description="Get started in minutes and begin building real local connections."
      >
        <ResendTabShowcase
          tabs={[
            {
              id: "profile",
              label: "Profile",
              icon: "pi-id-card",
              panelTitle: "01 — Create your profile",
              items: [
                {
                  label: "Sign up in minutes",
                  detail: "Add your basic details and set your location preferences.",
                },
                {
                  label: "Choose your privacy level",
                  detail: "Decide who can see your profile and how people can reach you.",
                },
                {
                  label: "You're ready to explore",
                  detail: "Your profile goes live within the area you choose.",
                },
              ],
            },
            {
              id: "discover",
              label: "Discover",
              icon: "pi-compass",
              panelTitle: "02 — Discover nearby people",
              items: [
                {
                  label: "Browse local profiles",
                  detail: "See people, businesses, and announcements around you.",
                },
                {
                  label: "Find what matters nearby",
                  detail: "Discover services, updates, and connections in your area.",
                },
                {
                  label: "Connect with confidence",
                  detail: "Reach out to people who feel relevant and trustworthy to you.",
                },
              ],
            },
            {
              id: "connect",
              label: "Connect",
              icon: "pi-comments",
              panelTitle: "03 — Connect and grow",
              items: [
                {
                  label: "Start conversations",
                  detail: "Send messages and respond to people who want to connect.",
                },
                {
                  label: "Share local updates",
                  detail: "Post announcements and stay informed about your neighborhood.",
                },
                {
                  label: "Build real relationships",
                  detail: "Grow meaningful connections with people close to you.",
                },
              ],
            },
          ]}
        />
      </ResendFeatureBlock>
    </ScrollReveal>
  );
}
