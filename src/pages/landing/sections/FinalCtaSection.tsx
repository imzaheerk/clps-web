import { useNavigate } from "react-router-dom";
import FinalCtaNetworkModel from "@/components/FinalCtaNetworkModel";
import ScrollReveal from "@/components/ScrollReveal";
import ResendFeatureBlock, { ResendShowcaseCard } from "@/components/ResendFeatureBlock";

const connectCards = [
  {
    icon: "pi-map-marker",
    tone: "cyan",
    title: "Discover locally",
    detail: "Find people and businesses in your pincode",
  },
  {
    icon: "pi-comments",
    tone: "orange",
    title: "Message safely",
    detail: "Chat with privacy controls you choose",
  },
  {
    icon: "pi-users",
    tone: "violet",
    title: "Grow together",
    detail: "Build a trusted network around you",
  },
];

export default function FinalCtaSection() {
  const navigate = useNavigate();

  return (
    <ScrollReveal variant="blur-up">
      <ResendFeatureBlock
        glow="sky"
        kicker="Get started"
        title="Ready to Build Real Local Connections?"
        description="Join Checknown to discover nearby people, share important updates, and grow your trusted local network."
        showConnector
      >
        <ResendShowcaseCard label="Start connecting">
          <div className="cta-connect-shell">
            <div className="cta-connect-visual">
              <div className="cta-connect-visual-mesh" aria-hidden="true" />
              <FinalCtaNetworkModel />
              <div className="cta-connect-visual-caption">
                <span className="cta-connect-live">
                  <span className="cta-connect-live-dot" />
                  Live network
                </span>
              </div>
            </div>

            <div className="cta-connect-panel">
              <div className="cta-connect-cards">
                {connectCards.map((card) => (
                  <article
                    key={card.title}
                    className={`cta-connect-card cta-connect-card--${card.tone}`}
                  >
                    <span className="cta-connect-card-icon">
                      <i className={`pi ${card.icon}`} />
                    </span>
                    <div className="cta-connect-card-copy">
                      <h3 className="cta-connect-card-title">{card.title}</h3>
                      <p className="cta-connect-card-detail">{card.detail}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="cta-connect-actions">
                <button
                  type="button"
                  className="resend-btn resend-btn-primary"
                  onClick={() => navigate("/signup")}
                >
                  Create free account
                </button>
                <button
                  type="button"
                  className="resend-btn resend-btn-secondary"
                  onClick={() => navigate("/login")}
                >
                  Explore features
                </button>
              </div>
            </div>
          </div>
        </ResendShowcaseCard>
      </ResendFeatureBlock>
    </ScrollReveal>
  );
}
