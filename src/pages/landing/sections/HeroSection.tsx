import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroGlobeModel from "@/components/HeroGlobeModel";
import ResendForwardReveal from "@/components/ResendForwardReveal";
import ScrollReveal from "@/components/ScrollReveal";

const badges = [
  { icon: "pi pi-globe", label: "Global reach" },
  { icon: "pi pi-comments", label: "Real conversations" },
  { icon: "pi pi-shield", label: "Privacy controls" },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [showForwardReveal, setShowForwardReveal] = useState(false);

  return (
    <section className="landing-hero-cinematic resend-section">
      <div className="landing-hero-globe-stage" aria-hidden="true">
        <div className="landing-hero-globe-vignette" />
        <div className="landing-hero-globe-gradient" />
        <HeroGlobeModel />
      </div>

      <ResendForwardReveal
        visible={showForwardReveal}
        onHide={() => setShowForwardReveal(false)}
      />

      <div className="resend-container-wide landing-hero-cinematic-content">
        <div className="landing-hero-cinematic-copy">
          <ScrollReveal immediate variant="pop-up" delay={0}>
            <button
              type="button"
              className="forward-announce-badge"
              onClick={() => setShowForwardReveal(true)}
            >
              <span className="forward-announce-badge-glow" aria-hidden="true" />
              <span className="forward-announce-badge-dot" aria-hidden="true" />
              <i className="pi pi-sparkles forward-announce-badge-icon" />
              Announcing Resend Forward
              <i className="pi pi-arrow-right forward-announce-badge-arrow" />
            </button>
          </ScrollReveal>

          <ScrollReveal immediate variant="blur-up" delay={60}>
            <p className="landing-hero-kicker">Connecting People Across The World</p>
          </ScrollReveal>

          <ScrollReveal immediate variant="blur-up" delay={120}>
            <h1 className="resend-h1 landing-hero-title">
              Real connections.
              <br />
              <span className="landing-hero-title-accent">Everywhere.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal immediate variant="pop-up" delay={200}>
            <p className="resend-lead landing-hero-lead">
              Discover people, businesses, and communities across the globe — with live network
              connections that bring the world closer together.
            </p>
          </ScrollReveal>

          <ScrollReveal immediate variant="pop-up" delay={280}>
            <div className="resend-actions landing-hero-actions">
              <button
                type="button"
                className="resend-btn resend-btn-primary"
                onClick={() => navigate("/signup")}
              >
                Get started
              </button>
              <button
                type="button"
                className="resend-btn resend-btn-secondary landing-hero-btn-glass"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </ScrollReveal>

          <div className="landing-hero-badges">
            {badges.map((badge, index) => (
              <ScrollReveal key={badge.label} immediate variant="fade" delay={360 + index * 80}>
                <span className="resend-badge landing-hero-badge">
                  <i className={`${badge.icon} text-xs`} />
                  {badge.label}
                </span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
