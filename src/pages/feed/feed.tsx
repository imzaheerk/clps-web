import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageLayout,
  PageHeader,
  LoadingState,
  EmptyState,
  FeedItemCard,
} from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalFeed } from "@/hooks/useLocalFeed";
import {
  DEFAULT_DISCOVERY_RADIUS_KM,
  discoveryRadiusLabel,
} from "@/constants/discoveryRadius";
import type { FeedItem } from "@/services/feedService/feedService";

export default function LocalFeed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items, total, loading, loadByPincode } = useLocalFeed();

  useEffect(() => {
    if (user?.pincode) {
      loadByPincode(user.pincode, { limit: 40, currentUserId: user.id });
    }
  }, [user?.id, user?.pincode, loadByPincode]);

  const openItem = (item: FeedItem) => {
    if (item.type === "event") {
      navigate(`/events/${item.id}`);
    } else {
      navigate(`/announcements/${item.id}`);
    }
  };

  return (
    <PageLayout maxWidth="xl">
      <PageHeader
        icon="pi pi-bolt"
        title="Local feed"
        description={`Announcements and events within ${discoveryRadiusLabel(user?.discoveryRadiusKm ?? DEFAULT_DISCOVERY_RADIUS_KM)} of your area`}
        action={
          <div className="app-feed-header-actions">
            <button
              type="button"
              className="resend-btn resend-btn-secondary"
              onClick={() => navigate("/announcements/create")}
            >
              <i className="pi pi-megaphone" />
              Post update
            </button>
            <button
              type="button"
              className="resend-btn resend-btn-primary"
              onClick={() => navigate("/events/create")}
            >
              <i className="pi pi-calendar-plus" />
              Create event
            </button>
          </div>
        }
      />

      {!user?.pincode ? (
        <EmptyState
          icon="pi-map-marker"
          title="Set your pincode"
          description="Add your pincode in profile settings to see local activity in your feed."
          actionLabel="Go to profile"
          onAction={() => navigate("/profile")}
        />
      ) : loading ? (
        <LoadingState message="Loading your local feed…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon="pi-bolt"
          title="Nothing here yet"
          description="Be the first to share an announcement or host an event in your area."
          actionLabel="Create event"
          onAction={() => navigate("/events/create")}
        />
      ) : (
        <>
          <p className="app-feed-count">
            {total} item{total === 1 ? "" : "s"} in your area
          </p>
          <div className="app-feed-grid">
            {items.map((item) => (
              <FeedItemCard
                key={`${item.type}-${item.id}`}
                item={item}
                onOpen={() => openItem(item)}
              />
            ))}
          </div>
        </>
      )}
    </PageLayout>
  );
}
