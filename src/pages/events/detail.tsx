import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageLayout, PageHeader, LoadingState, Button, showNotification } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/hooks/useEvents";
import {
  eventService,
  EVENT_CATEGORIES,
  type LocalEvent,
  type EventAttendee,
} from "@/services/eventService/eventService";

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggleRsvp, actionLoading } = useEvents();

  const [event, setEvent] = useState<LocalEvent | null>(null);
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [eventData, attendeeData] = await Promise.all([
        eventService.getEventById(Number(id), user?.id),
        eventService.getAttendees(Number(id)),
      ]);
      setEvent(eventData);
      setAttendees(attendeeData.attendees);
    } catch {
      showNotification("Event not found", "error");
      navigate("/events");
    } finally {
      setLoading(false);
    }
  }, [id, user?.id, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRsvp = async () => {
    if (!event || !user) return;
    const updated = await toggleRsvp(event, user.id);
    if (updated) {
      setEvent(updated);
      const attendeeData = await eventService.getAttendees(event.id);
      setAttendees(attendeeData.attendees);
    }
  };

  if (loading || !event) {
    return (
      <PageLayout maxWidth="lg">
        <LoadingState message="Loading event…" />
      </PageLayout>
    );
  }

  const isOwner = user?.id === event.userId;
  const categoryLabel =
    EVENT_CATEGORIES.find((c) => c.value === event.category)?.label ?? event.category;

  return (
    <PageLayout maxWidth="lg">
      <button
        type="button"
        className="resend-btn resend-btn-secondary self-start"
        onClick={() => navigate("/events")}
      >
        <i className="pi pi-arrow-left" />
        All events
      </button>

      <PageHeader
        icon="pi pi-calendar"
        title={event.title}
        description={`Hosted by ${event.user.name ?? "a neighbor"}`}
        action={
          isOwner ? (
            <button
              type="button"
              className="resend-btn resend-btn-secondary"
              onClick={() => navigate(`/events/${event.id}/edit`)}
            >
              <i className="pi pi-pencil" />
              Edit
            </button>
          ) : undefined
        }
      />

      <div className="app-event-detail-grid">
        <section className="app-panel app-event-detail-main">
          <div className="app-event-detail-badges">
            <span className={`app-event-category app-event-category--${event.category}`}>
              {categoryLabel}
            </span>
            {event.isFull ? <span className="app-event-badge-full">Full</span> : null}
            {event.userHasRsvp ? (
              <span className="app-event-badge-going">You&apos;re going</span>
            ) : null}
          </div>

          <p className="app-event-detail-date">
            <i className="pi pi-clock" />
            {formatEventDate(event.eventDate)}
          </p>

          {event.location ? (
            <p className="app-event-detail-location">
              <i className="pi pi-map-marker" />
              {event.location}
            </p>
          ) : null}

          <p className="app-event-detail-desc">{event.description}</p>

          <p className="app-event-detail-rsvp">
            <i className="pi pi-users" />
            {event.rsvpCount}
            {event.maxAttendees ? ` / ${event.maxAttendees}` : ""} people going
          </p>

          {!isOwner && user ? (
            <Button
              label={
                event.userHasRsvp
                  ? "Cancel RSVP"
                  : event.isFull
                    ? "Event is full"
                    : "RSVP — I'm going"
              }
              icon={event.userHasRsvp ? "pi pi-times" : "pi pi-check"}
              onClick={handleRsvp}
              loading={actionLoading}
              disabled={event.isFull && !event.userHasRsvp}
              variant={event.userHasRsvp ? "outlined" : "primary"}
              Size="large"
              className={
                event.userHasRsvp
                  ? "auth-resend-btn-outlined w-full sm:w-auto"
                  : "auth-resend-btn-primary w-full sm:w-auto"
              }
            />
          ) : null}
        </section>

        <aside className="app-panel app-event-attendees">
          <h2 className="app-panel-title">
            <i className="pi pi-users" />
            Who&apos;s going
          </h2>
          {attendees.length === 0 ? (
            <p className="app-panel-copy">No RSVPs yet — be the first!</p>
          ) : (
            <ul className="app-event-attendee-list">
              {attendees.map((a) => (
                <li key={`${a.id}-${a.rsvpAt}`}>
                  <span className="app-event-attendee-avatar">
                    {(a.name ?? "U")[0].toUpperCase()}
                  </span>
                  <span>
                    <span className="app-event-attendee-name">{a.name ?? "Neighbor"}</span>
                    <span className="app-event-attendee-time">
                      {new Date(a.rsvpAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </PageLayout>
  );
}
