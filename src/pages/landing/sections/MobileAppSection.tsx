import MobileAppPhoneMockup from "@/components/MobileAppPhoneMockup";
import ScrollReveal from "@/components/ScrollReveal";
import ResendFeatureBlock, { ResendShowcaseCard } from "@/components/ResendFeatureBlock";

export default function MobileAppSection() {
  return (
    <ScrollReveal variant="blur-up">
      <ResendFeatureBlock
        glow="emerald"
        kicker="Mobile"
        title="Take Checknown Everywhere You Go"
        description="Discover nearby people, get real-time updates, and connect instantly from your phone — anytime, anywhere."
        showConnector
      >
        <ResendShowcaseCard label="Phone preview">
          <div className="resend-mobile-preview">
            <div className="resend-mobile-preview-device">
              <MobileAppPhoneMockup />
            </div>
            <div className="resend-mobile-preview-copy">
              <p className="resend-mobile-preview-quote">
                &ldquo;Your local network in your pocket — simple, fast, and always within reach.&rdquo;
              </p>
              <div className="resend-actions resend-mobile-preview-actions">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resend-btn resend-btn-primary"
                >
                  <i className="pi pi-android" />
                  Get it on Play Store
                </a>
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resend-btn resend-btn-secondary"
                >
                  <i className="pi pi-apple" />
                  Download on App Store
                </a>
              </div>
              <div className="resend-showcase-badges">
                <span className="resend-badge">Fast access</span>
                <span className="resend-badge">Instant notifications</span>
                <span className="resend-badge">Privacy controls</span>
              </div>
            </div>
          </div>
        </ResendShowcaseCard>
      </ResendFeatureBlock>
    </ScrollReveal>
  );
}
