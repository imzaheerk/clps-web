import type { ResendGlow } from "@/components/ResendFeatureBlock";

export default function ResendFeatureIcon({ glow = "violet" }: { glow?: ResendGlow }) {
  return (
    <div className={`resend-orb-icon resend-orb-icon--${glow}`} aria-hidden="true">
      <div className="resend-orb-icon-ambient" />
      <div className="resend-orb-icon-frame">
        <div className="resend-orb-icon-lens">
          <span className="resend-orb-ring resend-orb-ring--1" />
          <span className="resend-orb-ring resend-orb-ring--2" />
          <span className="resend-orb-ring resend-orb-ring--3" />
          <span className="resend-orb-ring resend-orb-ring--4" />
          <span className="resend-orb-lens-shine" />
        </div>
        <div className="resend-orb-icon-floor-glow" />
      </div>
    </div>
  );
}
