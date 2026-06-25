import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  PageLayout,
  PageHeader,
  showNotification,
  LoadingState,
  BusinessAnalyticsCharts,
} from "@/components";
import { businessService } from "@/services/businessService/businessService";
import { businessAnalyticsService } from "@/services/businessAnalyticsService/businessAnalyticsService";
import { messagingService } from "@/services/messagingService/messagingService";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import type { Business } from "@/services/businessService/businessService";
import type { BusinessAnalytics } from "@/services/businessAnalyticsService/businessAnalyticsService";

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  shop: "Shop",
  driver: "Driver",
  plumber: "Plumber",
};

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription } = useSubscription(user?.id ?? null, !!user?.id);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<BusinessAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  const isOwner = user?.id != null && business?.userId === user.id;
  const isPremium =
    subscription?.status === "active" &&
    subscription?.plan &&
    !subscription.plan.isDefault &&
    subscription.plan.price > 0;

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const b = await businessService.getBusinessById(Number(id));
        setBusiness(b);
      } catch (e: any) {
        showNotification(e.response?.data?.error || "Business not found", "error");
        navigate("/search");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  useEffect(() => {
    if (!business || isOwner || !user) return;
    businessAnalyticsService.recordEvent(business.id, "profile_click");
  }, [business?.id, isOwner, user?.id]);

  const loadAnalytics = useCallback(async () => {
    if (!business || !isOwner || !isPremium) return;
    setAnalyticsLoading(true);
    try {
      const data = await businessAnalyticsService.getAnalytics(business.id, 30);
      setAnalytics(data);
    } catch (e: any) {
      const msg = e.response?.data?.message || "Failed to load analytics";
      showNotification(msg, "error");
    } finally {
      setAnalyticsLoading(false);
    }
  }, [business?.id, isOwner, isPremium]);

  useEffect(() => {
    if (isOwner && isPremium && business) {
      loadAnalytics();
    }
  }, [isOwner, isPremium, business, loadAnalytics]);

  const handleMessageOwner = async () => {
    if (!business || !user || isOwner) return;
    setSendingRequest(true);
    try {
      await messagingService.sendChatRequest({ receiverId: business.userId });
      await businessAnalyticsService.recordEvent(business.id, "message_request");
      showNotification("Chat request sent to the business owner", "success");
    } catch (e: any) {
      const msg = e.response?.data?.message || "Failed to send chat request";
      showNotification(msg, "error");
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading || !business) {
    return (
      <PageLayout maxWidth="md">
        <LoadingState message="Loading business…" />
      </PageLayout>
    );
  }

  const hoursStr =
    business.businessHours && (business.businessHours as { display?: string }).display
      ? (business.businessHours as { display: string }).display
      : business.businessHours &&
          typeof (business.businessHours as { general?: string }).general === "string"
        ? (business.businessHours as { general: string }).general
        : business.businessHours
          ? Object.entries(business.businessHours)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")
          : null;

  return (
    <PageLayout maxWidth="md">
      <button type="button" className="resend-btn resend-btn-secondary self-start" onClick={() => navigate(-1)}>
        <i className="pi pi-arrow-left" />
        Back
      </button>

      <PageHeader
        icon="pi pi-briefcase"
        title={business.name}
        description={CATEGORY_LABELS[business.category] || business.category}
        action={
          isOwner ? (
            <button
              type="button"
              className="resend-btn resend-btn-secondary"
              onClick={() => navigate(`/business/${business.id}/edit`)}
            >
              <i className="pi pi-pencil" />
              Edit
            </button>
          ) : user ? (
            <button
              type="button"
              className="resend-btn resend-btn-primary"
              onClick={handleMessageOwner}
              disabled={sendingRequest}
            >
              {sendingRequest ? (
                <i className="pi pi-spin pi-spinner" />
              ) : (
                <i className="pi pi-comments" />
              )}
              Message owner
            </button>
          ) : undefined
        }
      />

      {isOwner ? (
        <section className="app-panel app-business-analytics-panel">
          <div className="app-panel-head">
            <h2 className="app-panel-title">
              <i className="pi pi-chart-bar" />
              Listing analytics
              <span className="resend-pill resend-pill--premium">Premium</span>
            </h2>
            <p className="app-panel-copy">
              Views, profile clicks, and message requests in the last 30 days.
            </p>
          </div>
          {!isPremium ? (
            <div className="app-business-analytics-upsell">
              <p>Upgrade to premium to see how neighbours discover and contact your business.</p>
              <Link to="/subscription" className="resend-btn resend-btn-primary">
                <i className="pi pi-star" />
                View plans
              </Link>
            </div>
          ) : analyticsLoading ? (
            <LoadingState message="Loading analytics…" />
          ) : analytics ? (
            <BusinessAnalyticsCharts analytics={analytics} />
          ) : null}
        </section>
      ) : null}

      <section className="app-panel">
        <div className="flex flex-wrap gap-2 mb-4">
          {business.aadharVerified ? <span className="resend-pill resend-pill--success">Aadhar verified</span> : null}
          {business.licenceVerified ? <span className="resend-pill resend-pill--success">Licence verified</span> : null}
        </div>

        <p className="text-sm text-text-secondary whitespace-pre-wrap mb-5">{business.description}</p>

        <div className="app-form-grid">
          {business.address ? (
            <div className="app-profile-field span-2">
              <p className="app-profile-field-label">Address</p>
              <p className="app-profile-field-value">{business.address}</p>
              {business.latitude != null && business.longitude != null ? (
                <a
                  href={`https://www.google.com/maps?q=${business.latitude},${business.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#ff6000] hover:underline mt-2 inline-flex items-center gap-1"
                >
                  <i className="pi pi-map" />
                  View on map
                </a>
              ) : null}
            </div>
          ) : null}

          {hoursStr ? (
            <div className="app-profile-field span-2">
              <p className="app-profile-field-label">Business hours</p>
              <p className="app-profile-field-value">{hoursStr}</p>
            </div>
          ) : null}

          {business.website ? (
            <div className="app-profile-field">
              <p className="app-profile-field-label">Website</p>
              <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-[#ff6000] text-sm">
                Visit site
              </a>
            </div>
          ) : null}

          {business.socialLinks?.facebook ? (
            <div className="app-profile-field">
              <p className="app-profile-field-label">Facebook</p>
              <a href={business.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-[#ff6000] text-sm">
                Profile
              </a>
            </div>
          ) : null}

          {business.socialLinks?.instagram ? (
            <div className="app-profile-field">
              <p className="app-profile-field-label">Instagram</p>
              <a href={business.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[#ff6000] text-sm">
                Profile
              </a>
            </div>
          ) : null}
        </div>

        <p className="text-xs text-text-secondary mt-5 mb-0">
          Listed by{" "}
          <button
            type="button"
            className="text-[#ff6000] hover:underline"
            onClick={() => navigate(`/profile/${business.userId}`)}
          >
            {business.user?.name || "User"}
          </button>
        </p>
      </section>
    </PageLayout>
  );
}
