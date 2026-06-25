import { useNavigate } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import ResendFeatureBlock, { ResendShowcaseCard } from "@/components/ResendFeatureBlock";

const spotlightFeatures = [
  "Extended discovery radius (5 km + city-wide)",
  "Business analytics and performance insights",
  "Priority visibility in local results",
];

const serviceTiles = [
  { icon: "pi pi-search", title: "Smart discovery", detail: "Find the right people and services nearby." },
  { icon: "pi pi-shield", title: "Privacy controls", detail: "Mask your number and control who can contact you." },
  { icon: "pi pi-chart-line", title: "Growth insights", detail: "Track business reach and interaction trends." },
];

export default function PricingSnapshotSection() {
  const navigate = useNavigate();

  return (
    <ScrollReveal variant="blur-up">
      <section id="pricing" className="landing-pricing-anchor">
        <ResendFeatureBlock
          glow="amber"
          kicker="Pricing"
          title="Simple Plans, Clear Value"
          description="Start free and upgrade when you want more reach, insights, and visibility."
          showConnector
        >
          <ResendShowcaseCard label="Pricing snapshot">
            <div className="landing-pricing-v2-shell">
              <article className="landing-pricing-v2-spotlight">
                <span className="landing-pricing-v2-orb" aria-hidden="true" />
                <div className="landing-pricing-v2-top">
                  <span className="resend-pill resend-pill--premium">Premium</span>
                  <p className="landing-pricing-v2-price">From INR 49</p>
                  <p className="landing-pricing-v2-caption">
                    Unlock more local reach, better visibility, and deeper insights.
                  </p>
                </div>
                <ul className="landing-pricing-v2-feature-list">
                  {spotlightFeatures.map((point) => (
                    <li key={point}>
                      <i className="pi pi-check" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="landing-pricing-v2-cta-row">
                  <button type="button" className="resend-btn resend-btn-primary" onClick={() => navigate("/plans")}>
                    Explore plans
                  </button>
                  <button type="button" className="resend-btn resend-btn-secondary" onClick={() => navigate("/signup")}>
                    Start free
                  </button>
                </div>
              </article>

              <div className="landing-pricing-v2-side">
                <article className="landing-pricing-v2-free">
                  <div className="landing-pricing-v2-free-head">
                    <h3>Free</h3>
                    <span className="landing-pricing-v2-free-price">INR 0</span>
                  </div>
                  <p>Perfect to get started with core local networking features.</p>
                  <div className="landing-pricing-v2-tags">
                    <span>People search</span>
                    <span>Announcements</span>
                    <span>Events</span>
                    <span>Safe chat</span>
                  </div>
                </article>

                <div className="landing-pricing-v2-tiles">
                  {serviceTiles.map((tile) => (
                    <article key={tile.title} className="landing-pricing-v2-tile">
                      <span className="landing-pricing-v2-tile-icon">
                        <i className={tile.icon} />
                      </span>
                      <div>
                        <p className="landing-pricing-v2-tile-title">{tile.title}</p>
                        <p className="landing-pricing-v2-tile-detail">{tile.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </ResendShowcaseCard>
        </ResendFeatureBlock>
      </section>
    </ScrollReveal>
  );
}
