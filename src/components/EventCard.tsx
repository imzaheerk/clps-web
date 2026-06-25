import type { LocalEvent } from "@/services/eventService/eventService";
import { EVENT_CATEGORIES } from "@/services/eventService/eventService";

interface EventCardProps {
  event: LocalEvent;
  currentUserId?: number;
  onOpen?: () => void;
  onRsvp?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  rsvpLoading?: boolean;
  showActions?: boolean;
}

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function categoryLabel(category: string) {
  return EVENT_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export default function EventCard({
  event,
  currentUserId,
  onOpen,
  onRsvp,
  onEdit,
  onDelete,
  rsvpLoading,
  showActions,
}: EventCardProps) {
  const isOwner = currentUserId === event.userId;
  const canRsvp = !!currentUserId && !isOwner && onRsvp;

  return (
    <article
      className="app-event-card"
      onClick={onOpen}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={(e) => {
        if (onOpen && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="app-event-card-top">
        <span className={`app-event-category app-event-category--${event.category}`}>
          {categoryLabel(event.category)}
        </span>
        <time className="app-event-date" dateTime={event.eventDate}>
          {formatEventDate(event.eventDate)}
        </time>
      </div>

      <h3 className="app-event-card-title">{event.title}</h3>
      <p className="app-event-card-desc">{event.description}</p>

      <div className="app-event-card-meta">
        {event.location ? (
          <span>
            <i className="pi pi-map-marker" />
            {event.location}
          </span>
        ) : null}
        <span>
          <i className="pi pi-user" />
          {event.user.name ?? "Organizer"}
        </span>
        <span>
          <i className="pi pi-users" />
          {event.rsvpCount}
          {event.maxAttendees ? ` / ${event.maxAttendees}` : ""} going
          {event.isFull ? " · Full" : ""}
        </span>
      </div>

      <div className="app-event-card-actions" data-card-actions="true">
        {canRsvp ? (
          <button
            type="button"
            className={`resend-btn ${event.userHasRsvp ? "resend-btn-secondary" : "resend-btn-primary"}`}
            disabled={rsvpLoading || (event.isFull && !event.userHasRsvp)}
            onClick={(e) => {
              e.stopPropagation();
              onRsvp?.();
            }}
          >
            {rsvpLoading ? (
              <i className="pi pi-spin pi-spinner" />
            ) : event.userHasRsvp ? (
              <>
                <i className="pi pi-check" />
                Going
              </>
            ) : event.isFull ? (
              "Full"
            ) : (
              <>
                <i className="pi pi-calendar-plus" />
                RSVP
              </>
            )}
          </button>
        ) : null}

        {showActions && isOwner ? (
          <>
            <button
              type="button"
              className="resend-btn resend-btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
            >
              <i className="pi pi-pencil" />
              Edit
            </button>
            <button
              type="button"
              className="resend-btn resend-btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            >
              <i className="pi pi-trash" />
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}
