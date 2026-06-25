import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout, PageHeader, showNotification, LoadingState, EmptyState } from "@/components";
import ResendModal from "@/components/ResendModal";
import { useSubscription } from "@/hooks/useSubscription";

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, loading, cancelSubscription, loading: cancelling } = useSubscription(
    user?.id || null,
    true
  );
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const confirmCancel = async () => {
    if (!subscription) return;
    const success = await cancelSubscription(subscription.id);
    if (success) {
      showNotification("Subscription cancelled. You are now on the free plan.", "success");
      setShowCancelDialog(false);
    } else {
      showNotification("Failed to cancel subscription", "error");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading && !subscription) {
    return (
      <PageLayout maxWidth="md">
        <PageHeader icon="pi pi-credit-card" title="Subscription" description="Your current plan" />
        <LoadingState message="Loading subscription…" />
      </PageLayout>
    );
  }

  if (!subscription) {
    return (
      <PageLayout maxWidth="md">
        <PageHeader icon="pi pi-credit-card" title="Subscription" description="Manage your plan" />
        <EmptyState
          icon="pi pi-credit-card"
          title="No active subscription"
          description="Choose a plan to unlock premium features."
          action={{ label: "View plans", onClick: () => navigate("/plans"), icon: "pi pi-star" }}
        />
      </PageLayout>
    );
  }

  const plan = subscription.plan;
  const isActive = subscription.status === "active";
  const isFree = plan?.isDefault || plan?.price === 0;
  const isPremium = !isFree && plan && plan.price > 0;

  return (
    <PageLayout maxWidth="md">
      <PageHeader
        icon="pi pi-credit-card"
        title="Subscription"
        description="Manage your plan and billing"
        action={
          <button type="button" className="resend-btn resend-btn-secondary" onClick={() => navigate("/plans")}>
            <i className="pi pi-star" />
            All plans
          </button>
        }
      />

      <section className={`app-panel app-sub-plan ${isPremium ? "app-sub-plan--premium" : ""}`}>
        <div className="app-sub-plan-head">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="app-panel-title m-0">{plan?.name || "Plan"}</h2>
              {isPremium ? (
                <span className="resend-pill resend-pill--premium">
                  <i className="pi pi-star-fill" />
                  Premium
                </span>
              ) : (
                <span className="resend-pill">Free</span>
              )}
              <span className={`resend-pill ${isActive ? "resend-pill--success" : "resend-pill--danger"}`}>
                {subscription.status}
              </span>
            </div>
            <p className="app-panel-copy m-0">
              {plan?.features.length || 0} features included
            </p>
          </div>
          <div className="app-sub-price">
            {isPremium ? (
              <>
                <span className="app-sub-price-value">₹{plan?.price}</span>
                <span className="app-sub-price-period">
                  {plan?.duration === 30 ? "/ month" : plan?.duration === 365 ? "/ year" : ""}
                </span>
              </>
            ) : (
              <span className="app-sub-price-value">Free</span>
            )}
          </div>
        </div>
      </section>

      <section className="app-panel">
        <h3 className="app-section-title mb-4">Details</h3>
        <div className="app-form-grid">
          <div className="app-profile-field">
            <p className="app-profile-field-label">Start date</p>
            <p className="app-profile-field-value">{formatDate(subscription.startsAt)}</p>
          </div>
          {!isFree && subscription.expiresAt ? (
            <div className="app-profile-field">
              <p className="app-profile-field-label">Expires</p>
              <p className="app-profile-field-value">{formatDate(subscription.expiresAt)}</p>
            </div>
          ) : null}
        </div>

        {plan && plan.features.length > 0 ? (
          <div className="mt-5 pt-5 border-t border-white/10">
            <h4 className="app-profile-field-label mb-3">Features</h4>
            <ul className="app-feature-list">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <i className="pi pi-check" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {isActive && !isFree ? (
        <div className="app-action-row">
          <button type="button" className="resend-btn resend-btn-primary flex-1" onClick={() => navigate("/plans")}>
            <i className="pi pi-sync" />
            Change plan
          </button>
          <button
            type="button"
            className="resend-btn resend-btn-danger flex-1"
            onClick={() => setShowCancelDialog(true)}
            disabled={cancelling}
          >
            Cancel subscription
          </button>
        </div>
      ) : null}

      {!isActive ? (
        <EmptyState
          icon="pi pi-exclamation-circle"
          title="Subscription expired"
          description="Renew your plan to keep premium features."
          action={{ label: "View plans", onClick: () => navigate("/plans"), icon: "pi pi-star" }}
        />
      ) : null}

      <ResendModal
        visible={showCancelDialog}
        onHide={() => setShowCancelDialog(false)}
        title="Cancel subscription?"
        description="You will be downgraded to the free plan."
        icon="pi-exclamation-triangle"
        tone="danger"
        footer={
          <div className="resend-modal-actions-row">
            <button type="button" className="resend-btn resend-btn-secondary" onClick={() => setShowCancelDialog(false)}>
              Keep plan
            </button>
            <button type="button" className="resend-btn resend-btn-danger" onClick={confirmCancel} disabled={cancelling}>
              {cancelling ? (
                <>
                  <i className="pi pi-spin pi-spinner" />
                  Cancelling…
                </>
              ) : (
                "Yes, cancel"
              )}
            </button>
          </div>
        }
      />
    </PageLayout>
  );
}
