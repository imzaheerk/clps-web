import { useState } from "react";
import type { Announcement, ReactionType } from "@/services/announcementService/announcementService";
import { announcementCategoryLabel } from "@/services/announcementService/announcementService";

interface AnnouncementCardProps {
  announcement: Announcement;
  currentUserId?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onReact?: (type: ReactionType) => void;
  onRemoveReaction?: () => void;
  onViewComments?: () => void;
  onOpenDetail?: () => void;
  showActions?: boolean;
  isDeleting?: boolean;
}

export default function AnnouncementCard({
  announcement,
  currentUserId,
  onEdit,
  onDelete,
  onReact,
  onRemoveReaction,
  onViewComments,
  onOpenDetail,
  showActions = false,
  isDeleting = false,
}: AnnouncementCardProps) {
  const likeCount = announcement.likeCount ?? 0;
  const dislikeCount = announcement.dislikeCount ?? 0;
  const commentCount = announcement.commentCount ?? 0;
  const userReaction = announcement.userReaction ?? null;
  const canReact = !!currentUserId && (onReact || onRemoveReaction);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "2-digit",
      year: "2-digit",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onOpenDetail) {
      const target = e.target as HTMLElement;
      if (
        target.closest("[data-card-actions]") ||
        target.closest("[data-comment-input]")
      )
        return;
      onOpenDetail();
    }
  };

  return (
    <>
      <article
        className="app-announcement-card h-full"
        onClick={handleCardClick}
        role={onOpenDetail ? "button" : undefined}
        tabIndex={onOpenDetail ? 0 : undefined}
        onKeyDown={(e) => {
          if (onOpenDetail && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onOpenDetail();
          }
        }}
      >
        {announcement.media && announcement.media.length > 0 ? (
          <div
            className="app-announcement-card-media"
            onClick={(e) => {
              e.stopPropagation();
              if (announcement.media?.[0]) setExpandedImage(announcement.media[0]);
            }}
          >
            <img src={announcement.media[0]} alt={announcement.title} />
          </div>
        ) : null}

        <div className="app-announcement-card-body">
          <div className="app-announcement-card-top">
            <span className={`app-announcement-category app-announcement-category--${announcement.category}`}>
              {announcementCategoryLabel(announcement.category)}
            </span>
          </div>
          <h3 className="app-announcement-card-title">{announcement.title}</h3>
          <p className="app-announcement-card-desc">{announcement.description}</p>

          <div className="app-announcement-card-author">
            <span className="app-profile-avatar app-profile-avatar--sm">
              {(announcement.user.name || "A")[0].toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="app-announcement-card-author-name">
                {announcement.user.name || "Anonymous"}
              </p>
              <p className="app-announcement-card-author-date">
                {formatDate(announcement.createdAt)}
              </p>
            </div>
            {showActions && (
              <div data-card-actions className="flex gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}
                  className="resend-btn resend-btn-ghost resend-btn-icon"
                  title="Edit"
                >
                  <i className="pi pi-pencil" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                  disabled={isDeleting}
                  className="resend-btn resend-btn-ghost resend-btn-icon text-red-400"
                  title="Delete"
                >
                  <i className={`pi ${isDeleting ? "pi-spin pi-spinner" : "pi-trash"}`} />
                </button>
              </div>
            )}
          </div>

          <div
            data-comment-input
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail?.();
            }}
            className="app-announcement-card-comment-prompt"
            role={onOpenDetail ? "button" : undefined}
          >
            <i className="pi pi-comments" />
            <span>Write a comment…</span>
          </div>

          <div data-card-actions className="app-announcement-card-actions">
            {canReact && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    userReaction === "like" ? onRemoveReaction?.() : onReact?.("like");
                  }}
                  className={`app-reaction-chip ${userReaction === "like" ? "app-reaction-chip--like" : ""}`}
                  title={userReaction === "like" ? "Remove like" : "Like"}
                >
                  <i className={userReaction === "like" ? "pi pi-thumbs-up-fill" : "pi pi-thumbs-up"} />
                  <span>{likeCount}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    userReaction === "dislike" ? onRemoveReaction?.() : onReact?.("dislike");
                  }}
                  className={`app-reaction-chip ${userReaction === "dislike" ? "app-reaction-chip--dislike" : ""}`}
                  title={userReaction === "dislike" ? "Remove dislike" : "Dislike"}
                >
                  <i className={userReaction === "dislike" ? "pi pi-thumbs-down-fill" : "pi pi-thumbs-down"} />
                  <span>{dislikeCount}</span>
                </button>
              </>
            )}
            {!canReact && (likeCount > 0 || dislikeCount > 0) && (
              <div className="flex items-center gap-3 text-text-secondary text-sm">
                {likeCount > 0 && (
                  <span className="flex items-center gap-1">
                    <i className="pi pi-thumbs-up" />
                    {likeCount}
                  </span>
                )}
                {dislikeCount > 0 && (
                  <span className="flex items-center gap-1">
                    <i className="pi pi-thumbs-down" />
                    {dislikeCount}
                  </span>
                )}
              </div>
            )}
            {onViewComments && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewComments();
                }}
                className="app-reaction-chip"
                title="View comments"
              >
                <i className="pi pi-comments" />
                <span>{commentCount}</span>
                <span className="hidden sm:inline text-xs">comments</span>
              </button>
            )}
          </div>
        </div>
      </article>

      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setExpandedImage(null)}
        >
          <button
            type="button"
            onClick={() => setExpandedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 p-3 hover:bg-white/10 rounded-full"
          >
            <i className="pi pi-times text-2xl" />
          </button>
          <img
            src={expandedImage}
            alt="Expanded view"
            className="max-w-full max-h-full object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
