import type { FeedItem } from "@/services/feedService/feedService";
import { EVENT_CATEGORIES } from "@/services/eventService/eventService";
import { announcementCategoryLabel } from "@/services/announcementService/announcementService";

interface FeedItemCardProps {
  item: FeedItem;
  onOpen?: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function typeLabel(type: FeedItem["type"]) {
  return type === "event" ? "Event" : "Announcement";
}

function categoryLabel(item: FeedItem) {
  if (item.type === "event" && item.category) {
    return EVENT_CATEGORIES.find((c) => c.value === item.category)?.label ?? item.category;
  }
  if (item.type === "announcement" && item.category) {
    return announcementCategoryLabel(item.category);
  }
  return typeLabel(item.type);
}

export default function FeedItemCard({ item, onOpen }: FeedItemCardProps) {
  const displayDate = item.type === "event" && item.eventDate ? item.eventDate : item.sortDate;

  return (
    <article
      className={`app-feed-card app-feed-card--${item.type}`}
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
      <div className="app-feed-card-top">
        <span className={`app-feed-type app-feed-type--${item.type}`}>
          <i className={`pi ${item.type === "event" ? "pi-calendar" : "pi-megaphone"}`} />
          {categoryLabel(item)}
        </span>
        <time className="app-feed-date" dateTime={displayDate}>
          {formatDate(displayDate)}
        </time>
      </div>

      <h3 className="app-feed-card-title">{item.title}</h3>
      <p className="app-feed-card-excerpt">{item.excerpt}</p>

      <div className="app-feed-card-meta">
        <span>
          <i className="pi pi-user" />
          {item.authorName ?? "Neighbor"}
        </span>
        {item.location ? (
          <span>
            <i className="pi pi-map-marker" />
            {item.location}
          </span>
        ) : null}
        {item.type === "announcement" && item.likeCount != null ? (
          <span>
            <i className="pi pi-heart" />
            {item.likeCount}
            {item.commentCount != null ? ` · ${item.commentCount} comments` : ""}
          </span>
        ) : null}
        {item.type === "event" && item.rsvpCount != null ? (
          <span>
            <i className="pi pi-users" />
            {item.rsvpCount} going
            {item.userHasRsvp ? " · You're going" : ""}
          </span>
        ) : null}
      </div>
    </article>
  );
}
