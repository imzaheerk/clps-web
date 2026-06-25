import { useEffect } from "react";
import type { ReactNode } from "react";

interface ResendModalProps {
  visible: boolean;
  onHide: () => void;
  title: string;
  description?: ReactNode;
  badge?: string;
  icon?: string;
  tone?: "default" | "danger" | "success";
  size?: "default" | "wide";
  children?: ReactNode;
  footer?: ReactNode;
  dismissOnOverlay?: boolean;
  showClose?: boolean;
}

export default function ResendModal({
  visible,
  onHide,
  title,
  description,
  badge,
  icon = "pi-info-circle",
  tone = "default",
  size = "default",
  children,
  footer,
  dismissOnOverlay = true,
  showClose = true,
}: ResendModalProps) {
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

  const iconClass = icon.startsWith("pi ") ? icon : `pi ${icon}`;

  return (
    <div
      className="resend-modal-overlay"
      role="presentation"
      onClick={dismissOnOverlay ? onHide : undefined}
    >
      <div
        className={`resend-modal resend-modal--${size} resend-modal--${tone}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resend-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="resend-modal-glow" aria-hidden="true" />

        {showClose ? (
          <button
            type="button"
            className="resend-modal-close"
            onClick={onHide}
            aria-label="Close dialog"
          >
            <i className="pi pi-times" />
          </button>
        ) : null}

        <div className="resend-modal-head">
          <div className="resend-modal-head-copy">
            {badge ? <span className="startup-notice-pill">{badge}</span> : null}
            <h2 id="resend-modal-title" className="resend-modal-title">
              {title}
            </h2>
            {description ? <div className="resend-modal-lead">{description}</div> : null}
          </div>
          <div className="resend-modal-icon" aria-hidden="true">
            <i className={iconClass} />
          </div>
        </div>

        {children ? <div className="resend-modal-body">{children}</div> : null}

        {footer ? <div className="resend-modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
