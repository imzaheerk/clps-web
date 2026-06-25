import ScrollReveal from "@/components/ScrollReveal";
import ResendFeatureBlock from "@/components/ResendFeatureBlock";
import {
  ResendDashboardShowcase,
  ResendDualPanelShowcase,
  ResendTabShowcase,
} from "@/components/ResendShowcaseVariants";

const features = [
  {
    glow: "sky" as const,
    kicker: "Features",
    title: "Discover People Nearby",
    description:
      "See people in your area and explore new connections based on your location and community.",
    showcase: (
      <ResendTabShowcase
        tabs={[
          {
            id: "nearby",
            label: "Nearby",
            icon: "pi-map-marker",
            panelTitle: "People around you",
            items: [
              {
                label: "24 profiles in your area",
                detail: "Browse people close to you based on the distance you set.",
              },
              {
                label: "12 shared interest matches",
                detail: "Find people with similar hobbies, needs, or local connections.",
              },
              {
                label: "6 suggestions waiting",
                detail: "Checknown highlights people you may want to connect with.",
              },
            ],
          },
          {
            id: "groups",
            label: "Groups",
            icon: "pi-users",
            panelTitle: "Local groups",
            items: [
              {
                label: "Neighborhood group",
                detail: "Join conversations happening in your part of town.",
              },
              {
                label: "3 events this week",
                detail: "See meetups, announcements, and local plans nearby.",
              },
              {
                label: "Request to join",
                detail: "Enter groups that match your interests and location.",
              },
            ],
          },
          {
            id: "suggestions",
            label: "Suggestions",
            icon: "pi-sparkles",
            panelTitle: "Suggested for you",
            items: [
              {
                label: "6 people to meet",
                detail: "Recommendations based on proximity and shared interests.",
              },
              {
                label: "Less than 1 km away",
                detail: "Many suggestions come from people genuinely close to you.",
              },
              {
                label: "Dismiss anytime",
                detail: "You're always in control of who you engage with.",
              },
            ],
          },
        ]}
      />
    ),
  },
  {
    glow: "violet" as const,
    title: "Start Real Conversations",
    description:
      "Message people instantly, share updates, and stay in touch with the people who matter to you.",
    showcase: (
      <ResendDualPanelShowcase
        leftBadge="Active"
        leftTarget="Your messages"
        leftTitle="Recent activity"
        statusItems={[
          { label: "Message from Priya", status: "New", tone: "success" },
          { label: "Local group chat", status: "Delivered", tone: "info" },
          { label: "Neighborhood bulletin", status: "Read", tone: "violet" },
        ]}
        events={[
          {
            type: "delivered",
            title: "Delivered",
            detail: "Priya sent you a message — open it whenever you're ready.",
            time: "This morning",
            pills: ["Priya S.", "2m ago"],
          },
          {
            type: "delivered",
            title: "Delivered",
            detail: "Your reply was posted to the local group conversation.",
            time: "This morning",
            pills: ["Local group", "Sent"],
          },
          {
            type: "clicked",
            title: "Read",
            detail: "You opened a neighborhood announcement from your area.",
            time: "This morning",
            pills: ["Announcement", "Viewed"],
          },
        ]}
      />
    ),
  },
  {
    glow: "emerald" as const,
    title: "Safe & Private by Design",
    description:
      "Your privacy is protected with robust controls and a platform built with safety in mind.",
    showcase: (
      <ResendDashboardShowcase
        left={{
          kicker: "Privacy",
          title: "Your visibility settings",
          stats: [
            { label: "LOCAL VISIBILITY", value: "On" },
            { label: "FILTERED REQUESTS", value: "12" },
            { label: "MASKING", value: "Active" },
          ],
          chart: "green",
        }}
        right={{
          kicker: "PROTECTION",
          value: "100%",
          metrics: [
            { label: "Profile visible locally", value: "Active", tone: "success" },
            { label: "Contact requests filtered", value: "Enabled", tone: "info" },
            { label: "Phone number masking", value: "Protected", tone: "violet" },
          ],
          secondary: { label: "ENGAGEMENT", value: "Private" },
        }}
      />
    ),
  },
];

export default function HowChecknownHelpsSection() {
  return (
    <div className="resend-feature-stack">
      {features.map((feature, index) => (
        <ScrollReveal key={feature.title} variant="blur-up" delay={index * 80}>
          <ResendFeatureBlock
            glow={feature.glow}
            kicker={index === 0 ? feature.kicker : undefined}
            title={feature.title}
            description={feature.description}
            showConnector={index > 0}
          >
            {feature.showcase}
          </ResendFeatureBlock>
        </ScrollReveal>
      ))}
    </div>
  );
}
