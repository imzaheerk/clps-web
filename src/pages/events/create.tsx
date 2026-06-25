import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { PageLayout, PageHeader, LoadingState, showNotification } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/hooks/useEvents";
import { eventService, EVENT_CATEGORIES, type EventCategory } from "@/services/eventService/eventService";

const inputClass = "auth-resend-input w-full";

function toDatetimeLocalValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CreateEvent() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createEvent, updateEvent, actionLoading } = useEvents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [category, setCategory] = useState<EventCategory>("community");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [loadingEvent, setLoadingEvent] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      eventService
        .getEventById(Number(id), user?.id)
        .then((data) => {
          setTitle(data.title);
          setDescription(data.description);
          setLocation(data.location ?? "");
          setEventDate(toDatetimeLocalValue(data.eventDate));
          setCategory(data.category);
          setMaxAttendees(data.maxAttendees ? String(data.maxAttendees) : "");
        })
        .catch(() => {
          showNotification("Failed to load event", "error");
          navigate("/events");
        })
        .finally(() => setLoadingEvent(false));
    }
  }, [id, isEdit, user?.id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !description.trim() || !eventDate) {
      showNotification("Please fill in title, description, and date", "error");
      return;
    }

    const isoDate = new Date(eventDate).toISOString();
    const max = maxAttendees.trim() ? Number(maxAttendees) : undefined;

    if (isEdit && id) {
      const result = await updateEvent(Number(id), user.id, {
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || undefined,
        eventDate: isoDate,
        category,
        maxAttendees: max ?? null,
      });
      if (result) navigate(`/events/${id}`);
    } else {
      if (!user.pincode) {
        showNotification("Pincode required — update your profile first", "error");
        return;
      }
      const result = await createEvent(user.id, {
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || undefined,
        eventDate: isoDate,
        category,
        maxAttendees: max,
      });
      if (result) navigate(`/events/${result.id}`);
    }
  };

  if (loadingEvent) {
    return (
      <PageLayout maxWidth="lg">
        <LoadingState message="Loading event…" />
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="lg">
      <button
        type="button"
        className="resend-btn resend-btn-secondary self-start"
        onClick={() => navigate("/events")}
      >
        <i className="pi pi-arrow-left" />
        Back to events
      </button>

      <PageHeader
        icon="pi pi-calendar-plus"
        title={isEdit ? "Edit event" : "Create event"}
        description="Host a meetup, workshop, or community gathering in your area"
      />

      <form onSubmit={handleSubmit} className="app-panel app-event-form">
        <div className="auth-resend-field">
          <label htmlFor="title" className="auth-resend-label">
            Event title
          </label>
          <InputText
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="Neighborhood clean-up drive"
            required
          />
        </div>

        <div className="auth-resend-field">
          <label htmlFor="description" className="auth-resend-label">
            Description
          </label>
          <InputTextarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} min-h-[120px]`}
            placeholder="What to expect, what to bring, etc."
            required
          />
        </div>

        <div className="auth-resend-grid">
          <div className="auth-resend-field">
            <label htmlFor="eventDate" className="auth-resend-label">
              Date & time
            </label>
            <InputText
              id="eventDate"
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div className="auth-resend-field">
            <label htmlFor="location" className="auth-resend-label">
              Location (optional)
            </label>
            <InputText
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
              placeholder="Community hall, park name…"
            />
          </div>
        </div>

        <div className="auth-resend-field">
          <span className="auth-resend-label">Category</span>
          <div className="app-event-filters">
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
        </div>

        <div className="auth-resend-field">
          <label htmlFor="maxAttendees" className="auth-resend-label">
            Max attendees (optional)
          </label>
          <InputText
            id="maxAttendees"
            value={maxAttendees}
            onChange={(e) => setMaxAttendees(e.target.value.replace(/\D/g, ""))}
            className={inputClass}
            placeholder="Leave empty for unlimited"
            keyfilter="int"
          />
        </div>

        <button
          type="submit"
          className="resend-btn resend-btn-primary w-full sm:w-auto"
          disabled={actionLoading}
        >
          {actionLoading ? (
            <i className="pi pi-spin pi-spinner" />
          ) : (
            <i className={`pi ${isEdit ? "pi-check" : "pi-calendar-plus"}`} />
          )}
          {isEdit ? "Save changes" : "Publish event"}
        </button>
      </form>
    </PageLayout>
  );
}
