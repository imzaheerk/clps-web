import ScrollReveal from "@/components/ScrollReveal";
import ResendFeatureBlock from "@/components/ResendFeatureBlock";
import HeroNetworkModel from "@/components/HeroNetworkModel";

const COMMUNITY_HIGHLIGHTS = [
  {
    icon: "pi-users",
    label: "Members nearby",
    detail: "See how many people are active in your pincode once you join.",
  },
  {
    icon: "pi-briefcase",
    label: "Local businesses",
    detail: "Discover shops and services listed by neighbors in your area.",
  },
  {
    icon: "pi-megaphone",
    label: "Announcements",
    detail: "Track neighborhood updates, events, and alerts from your community.",
  },
  {
    icon: "pi-map-marker",
    label: "Cities active",
    detail: "Checknown grows city by city — start in yours and invite others.",
  },
];

export default function ConnectedPeopleSection() {
  return (
    <ScrollReveal variant="blur-up">
      <ResendFeatureBlock
        glow="emerald"
        kicker="Community"
        title="A Growing Local Community"
        description="Discover people, businesses, and updates around you — sign in to see live counts for your area."
      >
        <div className="landing-community-shell">
          <div className="landing-community-visual">
            <div className="landing-community-visual-mesh" aria-hidden="true" />
            <HeroNetworkModel />
            <div className="landing-community-visual-caption">
              <span className="landing-community-live">
                <span className="landing-community-live-dot" />
                Neighborhood preview
              </span>
            </div>
          </div>
          <div className="landing-community-features" aria-label="Community features preview">
            {COMMUNITY_HIGHLIGHTS.map((item) => (
              <article key={item.label} className="landing-community-feature-card">
                <span className="landing-community-feature-icon">
                  <i className={`pi ${item.icon}`} />
                </span>
                <div>
                  <h3 className="landing-community-feature-label">{item.label}</h3>
                  <p className="landing-community-feature-detail">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </ResendFeatureBlock>
    </ScrollReveal>
  );
}
