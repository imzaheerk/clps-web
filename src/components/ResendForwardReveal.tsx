import { useEffect, useMemo } from "react";

interface ResendForwardRevealProps {
  visible: boolean;
  onHide: () => void;
}

const comingFeatures = [
  { icon: "pi-bolt", label: "Instant forwards", detail: "Route messages smarter, faster" },
  { icon: "pi-sparkles", label: "Live network pulse", detail: "See connections light up in real time" },
  { icon: "pi-shield", label: "Privacy-first controls", detail: "You decide what the world sees" },
  { icon: "pi-send", label: "Global reach", detail: "Bridge communities across every pincode" },
];

const EMBER_COUNT = 56;

export default function ResendForwardReveal({ visible, onHide }: ResendForwardRevealProps) {
  const embers = useMemo(
    () =>
      Array.from({ length: EMBER_COUNT }, (_, i) => ({
        id: i,
        left: `${2 + Math.random() * 96}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 5}s`,
        size: `${3 + Math.random() * 7}px`,
        drift: `${-50 + Math.random() * 100}px`,
      })),
    []
  );

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onHide();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div
      className="forward-reveal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forward-reveal-title"
    >
      <div className="forward-reveal-fog forward-reveal-fog--1" aria-hidden="true" />
      <div className="forward-reveal-fog forward-reveal-fog--2" aria-hidden="true" />
      <div className="forward-reveal-fog forward-reveal-fog--3" aria-hidden="true" />
      <div className="forward-reveal-fog forward-reveal-fog--4" aria-hidden="true" />
      <div className="forward-reveal-vignette" aria-hidden="true" />
      <div className="forward-reveal-scanline" aria-hidden="true" />
      <p className="forward-reveal-watermark" aria-hidden="true">
        FORWARD
      </p>

      <div className="forward-reveal-embers" aria-hidden="true">
        {embers.map((ember) => (
          <span
            key={ember.id}
            className="forward-reveal-ember"
            style={{
              left: ember.left,
              width: ember.size,
              height: ember.size,
              animationDelay: ember.delay,
              animationDuration: ember.duration,
              ["--ember-drift" as string]: ember.drift,
            }}
          />
        ))}
      </div>

      <div className="forward-reveal-burst" aria-hidden="true" />
      <div className="forward-reveal-ring forward-reveal-ring--1" aria-hidden="true" />
      <div className="forward-reveal-ring forward-reveal-ring--2" aria-hidden="true" />

      <button
        type="button"
        className="forward-reveal-close"
        onClick={onHide}
        aria-label="Close announcement"
      >
        <i className="pi pi-times" />
        <span>Close</span>
      </button>

      <div className="forward-reveal-stage">
        <header className="forward-reveal-hero">
          <div className="forward-reveal-badge-row">
            <span className="forward-reveal-live-dot" />
            <span className="forward-reveal-badge-text">Announcing</span>
          </div>

          <h2 id="forward-reveal-title" className="forward-reveal-title">
            <span className="forward-reveal-title-line">Resend</span>
            <span className="forward-reveal-title-accent">Forward</span>
          </h2>

          <p className="forward-reveal-lead">
            Something extraordinary is arriving. Bold new features are on the way — built to celebrate
            how you connect across the world.
          </p>
        </header>

        <ul className="forward-reveal-features">
          {comingFeatures.map((feature, index) => (
            <li
              key={feature.label}
              className="forward-reveal-feature"
              style={{ ["--feature-delay" as string]: `${0.4 + index * 0.1}s` }}
            >
              <span className="forward-reveal-feature-icon">
                <i className={`pi ${feature.icon}`} />
              </span>
              <div className="forward-reveal-feature-copy">
                <p className="forward-reveal-feature-label">{feature.label}</p>
                <p className="forward-reveal-feature-detail">{feature.detail}</p>
              </div>
              <span className="forward-reveal-feature-tag">Soon</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
