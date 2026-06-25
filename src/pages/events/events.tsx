import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageLayout,
  PageHeader,
  LoadingState,
  EmptyState,
  EventCard,
} from "@/components";
import ResendModal from "@/components/ResendModal";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/hooks/useEvents";
import {
  EVENT_CATEGORIES,
  type EventCategory,
  type LocalEvent,
} from "@/services/eventService/eventService";

export default function Events() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    events,
    total,
    loading,
    actionLoading,
    loadByPincode,
    loadByUserId,
    deleteEvent,
    toggleRsvp,
  } = useEvents();

  const [showMine, setShowMine] = useState(false);
  const [category, setCategory] = useState<EventCategory | "">("");
  const [eventToDelete, setEventToDelete] = useState<LocalEvent | null>(null);

  const refetch = useCallback(() => {
    if (showMine && user?.id) {
      loadByUserId(user.id, { limit: 50, currentUserId: user.id, silent: true });
    } else if (user?.pincode) {
      loadByPincode(user.pincode, {
        limit: 50,
        currentUserId: user?.id,
        category: category || undefined,
        silent: true,
      });
    }
  }, [showMine, user, category, loadByPincode, loadByUserId]);

  useEffect(() => {
    if (showMine && user?.id) {
      loadByUserId(user.id, { limit: 50, currentUserId: user.id });
    } else if (!showMine && user?.pincode) {
      loadByPincode(user.pincode, {
        limit: 50,
        currentUserId: user?.id,
        category: category || undefined,
      });
    }
  }, [user?.id, user?.pincode, showMine, category, loadByPincode, loadByUserId]);

  const confirmDelete = async () => {
    if (!user || !eventToDelete) return;
    const ok = await deleteEvent(eventToDelete.id, user.id);
    if (ok) {
      setEventToDelete(null);
      refetch();
    }
  };

  const filtered = showMine
    ? events
    : events.filter((e) => e.userId !== user?.id);

  return (
    <PageLayout maxWidth="xl">
      <PageHeader
        icon="pi pi-calendar"
        title="Local events"
        description="Meetups, workshops, and community gatherings near you"
        action={
          <button
            type="button"
            className="resend-btn resend-btn-primary"
            onClick={() => navigate("/events/create")}
          >
            <i className="pi pi-plus" />
            Create event
          </button>
        }
      />

      <div className="app-event-toolbar">
        <div className="app-event-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={!showMine}
            className={`app-event-tab ${!showMine ? "is-active" : ""}`}
            onClick={() => setShowMine(false)}
          >
            Near me
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={showMine}
            className={`app-event-tab ${showMine ? "is-active" : ""}`}
            onClick={() => setShowMine(true)}
          >
            My events
          </button>
        </div>

        {!showMine ? (
          <div className="app-event-filters">
            <button
              type="button"
              className={`app-event-filter-chip ${category === "" ? "is-active" : ""}`}
              onClick={() => setCategory("")}
            >
              All
            </button>
            {EVENT_CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`app-event-filter-chip ${category === c.value ? "is-active" : ""}`}
                onClick={() => setCategory(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {loading ? (
        <LoadingState message="Loading events…" />
      ) : !showMine && !user?.pincode ? (
        <EmptyState
          icon="pi pi-map-marker"
          title="Pincode required"
          description="Add your pincode in profile to see local events near you."
          action={{
            label: "Update profile",
            onClick: () => navigate("/profile"),
            icon: "pi pi-user",
          }}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="pi pi-calendar"
          title={showMine ? "No events yet" : "No upcoming events nearby"}
          description={
            showMine
              ? "Create your first local event and invite neighbors."
              : "Be the first to host something in your area."
          }
          action={{
            label: "Create event",
            onClick: () => navigate("/events/create"),
            icon: "pi pi-plus",
          }}
        />
      ) : (
        <>
          <p className="app-event-count">
            {total} event{total === 1 ? "" : "s"}
            {user?.pincode && !showMine ? ` in pincode ${user.pincode}` : ""}
          </p>
          <div className="app-event-grid">
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currentUserId={user?.id}
                showActions={showMine}
                rsvpLoading={actionLoading}
                onOpen={() => navigate(`/events/${event.id}`)}
                onRsvp={() => user && toggleRsvp(event, user.id).then(refetch)}
                onEdit={() => navigate(`/events/${event.id}/edit`)}
                onDelete={() => setEventToDelete(event)}
              />
            ))}
          </div>
        </>
      )}

      <ResendModal
        visible={!!eventToDelete}
        onHide={() => !actionLoading && setEventToDelete(null)}
        badge="Event"
        title="Delete event?"
        description={
          eventToDelete ? (
            <>
              Remove <strong>{eventToDelete.title}</strong>? It will no longer appear in local
              listings.
            </>
          ) : undefined
        }
        icon="pi-trash"
        tone="danger"
        footer={
          <div className="resend-modal-actions-row">
            <button
              type="button"
              className="resend-btn resend-btn-secondary"
              onClick={() => setEventToDelete(null)}
              disabled={actionLoading}
            >
              Keep event
            </button>
            <button
              type="button"
              className="resend-btn resend-btn-primary"
              onClick={confirmDelete}
              disabled={actionLoading}
            >
              {actionLoading ? <i className="pi pi-spin pi-spinner" /> : <i className="pi pi-trash" />}
              Delete
            </button>
          </div>
        }
      />
    </PageLayout>
  );
}
