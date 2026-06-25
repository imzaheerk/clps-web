import type { ReactNode } from "react";
import ResendFeatureIcon from "@/components/ResendFeatureIcon";

export type ResendGlow = "sky" | "violet" | "emerald" | "amber" | "rose";

interface ResendFeatureBlockProps {
  glow?: ResendGlow;
  kicker?: string;
  title: string;
  description: string;
  showConnector?: boolean;
  children: ReactNode;
}

export function ResendShowcaseCard({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="resend-showcase-card">
      <div className="resend-showcase-card-chrome">
        <div className="resend-showcase-dots" aria-hidden="true">
          <span className="resend-showcase-dot resend-showcase-dot--red" />
          <span className="resend-showcase-dot resend-showcase-dot--yellow" />
          <span className="resend-showcase-dot resend-showcase-dot--green" />
        </div>
        {label ? <span className="resend-showcase-card-label">{label}</span> : null}
      </div>
      <div className="resend-showcase-card-body">{children}</div>
    </div>
  );
}

export function ResendListRow({
  status = "success",
  label,
  meta,
}: {
  status?: "success" | "pending" | "warning";
  label: string;
  meta?: string;
}) {
  return (
    <div className="resend-list-row">
      <span className={`resend-list-status resend-list-status--${status}`} aria-hidden="true" />
      <span className="resend-list-label">{label}</span>
      {meta ? <span className="resend-list-meta">{meta}</span> : null}
    </div>
  );
}

export function ResendStepRow({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="resend-step-row">
      <span className="resend-step-row-num">{step}</span>
      <div className="resend-step-row-content">
        <p className="resend-step-row-title">{title}</p>
        <p className="resend-step-row-text">{description}</p>
      </div>
    </div>
  );
}

export default function ResendFeatureBlock({
  glow = "violet",
  kicker,
  title,
  description,
  showConnector = false,
  children,
}: ResendFeatureBlockProps) {
  return (
    <section className="resend-feature-block">
      {showConnector ? <div className="resend-feature-connector" aria-hidden="true" /> : null}
      <div className="resend-container-wide resend-feature-block-inner">
        {kicker ? <p className="resend-feature-kicker">{kicker}</p> : null}
        <ResendFeatureIcon glow={glow} />
        <h2 className="resend-feature-title">{title}</h2>
        <p className="resend-feature-lead">{description}</p>
        <div className={`resend-feature-showcase resend-feature-showcase--${glow}`}>{children}</div>
      </div>
    </section>
  );
}
