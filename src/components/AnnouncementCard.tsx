import { useState } from "react";
import type { Announcement, ReactionType } from "@/services/announcementService/announcementService";

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

  const handleImageClick = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  const closeExpandedImage = () => {
    setExpandedImage(null);
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
      <div className="relative group h-full">
        {/* Main Card - dark post style like reference */}
        <div
          className="relative backdrop-blur-xl bg-bg-primary/90 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden cursor-pointer"
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
          {/* Media Section - optional, compact */}
          {announcement.media && announcement.media.length > 0 ? (
            <div
              className="relative w-full aspect-video overflow-hidden bg-bg-secondary cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (announcement.media?.[0]) handleImageClick(announcement.media[0]);
              }}
            >
              <img
                src={announcement.media[0]}
                alt={announcement.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : null}

          {/* Content Section - title, body, author, comment input, actions */}
          <div className="relative p-5 flex-1 flex flex-col">
            {/* Title */}
            <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2">
              {announcement.title}
            </h3>
            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed mb-4 whitespace-pre-wrap line-clamp-3">
              {announcement.description}
            </p>

            {/* Author + timestamp */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-bg-secondary border border-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-text-primary font-bold text-sm">
                  {(announcement.user.name || "A")[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm truncate">
                  {announcement.user.name || "Anonymous"}
                </p>
                <p className="text-xs text-text-tertiary">
                  {formatDate(announcement.createdAt)}
                </p>
              </div>
              <div data-card-actions className="flex gap-1.5 flex-shrink-0">
                {showActions && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.();
                      }}
                      className="p-2 text-text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <i className="pi pi-pencil text-sm"></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.();
                      }}
                      disabled={isDeleting}
                      className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <i className={`pi ${isDeleting ? "pi-spin pi-spinner" : "pi-trash"} text-sm`}></i>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Write a comment... - clickable, goes to detail */}
            <div
              data-comment-input
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail?.();
              }}
              className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary/80 border border-white/10 text-text-tertiary hover:bg-white/5 hover:border-white/20 transition-colors cursor-pointer"
              role={onOpenDetail ? "button" : undefined}
            >
              <i className="pi pi-comments text-lg"></i>
              <span className="text-sm">Write a comment...</span>
            </div>

            {/* Like, Dislike, Comments - actions */}
            <div
              data-card-actions
              className="flex items-center gap-2 pt-3 border-t border-white/10"
            >
              {canReact && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      userReaction === "like"
                        ? onRemoveReaction?.()
                        : onReact?.("like");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                      userReaction === "like"
                        ? "bg-green-500/20 text-green-400 border border-green-500/40"
                        : "bg-bg-secondary/60 text-text-secondary border border-white/10 hover:bg-white/5 hover:text-text-primary"
                    }`}
                    title={userReaction === "like" ? "Remove like" : "Like"}
                  >
                    <i className={`text-sm ${userReaction === "like" ? "pi pi-thumbs-up-fill" : "pi pi-thumbs-up"}`}></i>
                    <span className="text-sm font-bold">{likeCount}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      userReaction === "dislike"
                        ? onRemoveReaction?.()
                        : onReact?.("dislike");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all border ${
                      userReaction === "dislike"
                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                        : "bg-bg-secondary/60 border-white/10 text-text-secondary hover:bg-white/5 hover:text-red-400"
                    }`}
                    title={userReaction === "dislike" ? "Remove dislike" : "Dislike"}
                  >
                    <i className={`text-sm ${userReaction === "dislike" ? "pi pi-thumbs-down-fill" : "pi pi-thumbs-down"}`}></i>
                    <span className="text-sm font-bold">{dislikeCount}</span>
                  </button>
                </>
              )}
              {!canReact && (likeCount > 0 || dislikeCount > 0) && (
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                  {likeCount > 0 && (
                    <span className="flex items-center gap-1">
                      <i className="pi pi-thumbs-up"></i>
                      <span className="font-semibold">{likeCount}</span>
                    </span>
                  )}
                  {dislikeCount > 0 && (
                    <span className="flex items-center gap-1">
                      <i className="pi pi-thumbs-down"></i>
                      <span className="font-semibold">{dislikeCount}</span>
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
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-secondary/60 border border-white/10 text-text-secondary hover:bg-white/5 hover:text-primary transition-all"
                  title="View comments"
                >
                  <i className="pi pi-comments text-sm"></i>
                  <span className="text-sm font-bold">{commentCount}</span>
                  <span className="text-xs hidden sm:inline">comments</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 backdrop-blur-md"
          onClick={closeExpandedImage}
        >
          <button
            onClick={closeExpandedImage}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-all p-3 hover:bg-white/10 rounded-full"
          >
            <i className="pi pi-times text-2xl"></i>
          </button>
          <img
            src={expandedImage}
            alt="Expanded view"
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl ring-4 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
