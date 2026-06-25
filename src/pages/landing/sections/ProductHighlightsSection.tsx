import ScrollReveal from "@/components/ScrollReveal";
import ResendFeatureBlock from "@/components/ResendFeatureBlock";
import {
  ResendDashboardShowcase,
  ResendDualPanelShowcase,
  ResendTabShowcase,
} from "@/components/ResendShowcaseVariants";

const highlights = [
  {
    glow: "amber" as const,
    kicker: "Product",
    title: "Smart Local Discovery",
    description:
      "Find people in your area using location-based discovery designed for real-world relevance.",
    showcase: (
      <ResendTabShowcase
        tabs={[
          {
            id: "people",
            label: "People",
            icon: "pi-user",
            panelTitle: "Discover people nearby",
            items: [
              {
                label: "24 people near you",
                detail: "See profiles within your chosen radius, updated throughout the day.",
              },
              {
                label: "5 new today",
                detail: "Fresh local connections appear as more people join your area.",
              },
            ],
          },
          {
            id: "map",
            label: "Map",
            icon: "pi-map",
            panelTitle: "Explore your area",
            items: [
              {
                label: "2 km discovery radius",
                detail: "Adjust how far you want to look for people and local updates.",
              },
              {
                label: "3 active groups nearby",
                detail: "Browse neighborhood conversations and shared local interests.",
              },
            ],
          },
          {
            id: "filters",
            label: "Filters",
            icon: "pi-sliders-h",
            panelTitle: "Tune what you see",
            items: [
              {
                label: "Set your distance",
                detail: "Choose a comfortable range for who appears in your feed.",
              },
              {
                label: "Match by interests",
                detail: "Prioritize people who share hobbies, services, or local needs.",
              },
            ],
          },
        ]}
      />
    ),
  },
  {
    glow: "violet" as const,
    title: "Secure Messaging",
    description:
      "Start conversations instantly while keeping your privacy settings and visibility controls in your hands.",
    showcase: (
      <ResendDualPanelShowcase
        leftBadge="Private"
        leftTarget="Your inbox"
        leftTitle="Messaging protections"
        statusItems={[
          { label: "One-to-one chats", status: "Encrypted", tone: "success" },
          { label: "New contact requests", status: "Approval required", tone: "info" },
        ]}
        events={[
          {
            type: "delivered",
            title: "Delivered",
            detail: "Your message was sent with privacy controls still active.",
            time: "This morning",
            pills: ["Encrypted", "Direct chat"],
          },
          {
            type: "viewed",
            title: "Held",
            detail: "A new contact request is waiting for your approval.",
            time: "This morning",
            pills: ["Request only", "You decide"],
          },
        ]}
      />
    ),
  },
  {
    glow: "rose" as const,
    title: "Community Announcements",
    description:
      "Post and discover local updates, services, and important neighborhood information in one place.",
    showcase: (
      <ResendDashboardShowcase
        left={{
          kicker: "Audience",
          title: "Neighborhood bulletin",
          stats: [
            { label: "ALL POSTS", value: "18" },
            { label: "THIS WEEK", value: "4" },
            { label: "SCHEDULED", value: "2" },
          ],
          chart: "blue",
        }}
        right={{
          kicker: "REACH",
          value: "92%",
          metrics: [
            { label: "Bulletin posted", value: "Today", tone: "success" },
            { label: "Event reminder", value: "Scheduled", tone: "info" },
            { label: "Local services", value: "6 new", tone: "violet" },
          ],
        }}
      />
    ),
  },
  {
    glow: "emerald" as const,
    title: "Real-time Notifications",
    description:
      "Get timely updates on new connections, messages, and relevant activity around your local network.",
    showcase: (
      <ResendDualPanelShowcase
        leftBadge="Live"
        leftTarget="Your alerts"
        leftTitle="Stay in the loop"
        statusItems={[
          { label: "New connection requests", status: "On", tone: "success" },
          { label: "Message notifications", status: "Instant", tone: "info" },
        ]}
        events={[
          {
            type: "clicked",
            title: "New",
            detail: "Someone nearby wants to connect — review the request when you're ready.",
            time: "Just now",
            pills: ["Connection", "Nearby"],
          },
          {
            type: "delivered",
            title: "Delivered",
            detail: "You received a new message and were notified right away.",
            time: "1m ago",
            pills: ["Message", "Delivered"],
          },
        ]}
      />
    ),
  },
];

export default function ProductHighlightsSection() {
  return (
    <div className="resend-feature-stack">
      {highlights.map((item, index) => (
        <ScrollReveal key={item.title} variant="blur-up" delay={index * 70}>
          <ResendFeatureBlock
            glow={item.glow}
            kicker={index === 0 ? item.kicker : undefined}
            title={item.title}
            description={item.description}
            showConnector={index > 0}
          >
            {item.showcase}
          </ResendFeatureBlock>
        </ScrollReveal>
      ))}
    </div>
  );
}
