import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import ResendFeatureBlock, { ResendShowcaseCard } from "@/components/ResendFeatureBlock";
import LandingModuleSceneModel, {
  type LandingModuleId,
} from "@/components/LandingModuleSceneModel";

const SHIPPED_MODULES: {
  id: LandingModuleId;
  icon: string;
  title: string;
  description: string;
  badge?: string;
  premium?: boolean;
}[] = [
  {
    id: "analytics",
    icon: "pi-chart-bar",
    title: "Business analytics",
    description:
      "Views, profile clicks, and message requests per listing — premium insights for local shops.",
    badge: "New",
    premium: true,
  },
  {
    id: "discovery",
    icon: "pi-compass",
    title: "Discovery radius",
    description:
      "Choose 1 km, 2 km, 5 km, or city-wide search. Control who you discover and what appears in your feed.",
    badge: "New",
  },
  {
    id: "community",
    icon: "pi-users",
    title: "Live community counter",
    description:
      "Member, business, and city counts inside the app — available after you sign in for your area.",
  },
  {
    id: "feed",
    icon: "pi-bolt",
    title: "Local feed",
    description:
      "Announcements and events in one stream, filtered by your pincode and discovery radius.",
  },
  {
    id: "saved-searches",
    icon: "pi-bookmark",
    title: "Saved searches",
    description:
      "Save a query and get notified when new people or businesses match in your area.",
  },
  {
    id: "chat-safety",
    icon: "pi-shield",
    title: "Chat safety",
    description: "Block or report users from chat and profiles. Messaging stops both ways when blocked.",
  },
  {
    id: "announcements",
    icon: "pi-megaphone",
    title: "Announcement categories",
    description:
      "Filter by General, Events, Safety, Jobs, or Lost & Found — find what matters faster.",
  },
  {
    id: "events",
    icon: "pi-calendar",
    title: "Local events",
    description: "Browse, RSVP, and organize neighborhood events by pincode.",
  },
];

export default function ShippedModulesSection() {
  const [activeId, setActiveId] = useState<LandingModuleId>("analytics");
  const active = SHIPPED_MODULES.find((m) => m.id === activeId) ?? SHIPPED_MODULES[0];

  return (
    <ScrollReveal variant="blur-up">
      <ResendFeatureBlock
        glow="amber"
        kicker="What's live"
        title="Platform Features, Shipped"
        description="Everything below is live in Checknown today — tap a module to preview it in 3D."
        showConnector
      >
        <ResendShowcaseCard label="Interactive preview">
          <div className="landing-modules-shell">
            <div className="landing-modules-visual">
              <div className="landing-modules-visual-mesh" aria-hidden="true" />
              <LandingModuleSceneModel moduleId={activeId} />
              <div className="landing-modules-visual-caption">
                <span className="landing-modules-live">
                  <span className="landing-modules-live-dot" />
                  {active.title}
                </span>
              </div>
            </div>

            <div className="landing-modules-panel">
              <div className="landing-modules-active-copy">
                <div className="landing-modules-active-head">
                  <span className={`landing-modules-active-icon landing-modules-active-icon--${activeId}`}>
                    <i className={`pi ${active.icon}`} />
                  </span>
                  <div>
                    <h3 className="landing-modules-active-title">
                      {active.title}
                      {active.badge ? (
                        <span className="landing-modules-badge">{active.badge}</span>
                      ) : null}
                      {active.premium ? (
                        <span className="landing-modules-badge landing-modules-badge--premium">
                          Premium
                        </span>
                      ) : null}
                    </h3>
                    <p className="landing-modules-active-desc">{active.description}</p>
                  </div>
                </div>
              </div>

              <div className="landing-modules-grid" role="tablist" aria-label="Shipped features">
                {SHIPPED_MODULES.map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    role="tab"
                    aria-selected={activeId === mod.id}
                    className={`landing-module-chip${activeId === mod.id ? " is-active" : ""}`}
                    onClick={() => setActiveId(mod.id)}
                  >
                    <i className={`pi ${mod.icon}`} />
                    <span>{mod.title}</span>
                    {mod.badge ? <span className="landing-module-chip-tag">{mod.badge}</span> : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ResendShowcaseCard>
      </ResendFeatureBlock>
    </ScrollReveal>
  );
}
