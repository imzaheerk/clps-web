import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageLayout, PageHeader, showNotification, LoadingState } from "@/components";
import {
  announcementService,
  announcementCategoryLabel,
} from "@/services/announcementService/announcementService";
import type {
  Announcement,
  Comment,
  ReactionType,
} from "@/services/announcementService/announcementService";
import { useAuth } from "@/contexts/AuthContext";
import { useAnnouncements } from "@/hooks/useAnnouncements";

export default function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { reactToAnnouncement, removeReaction } = useAnnouncements();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const loadAnnouncement = useCallback(
    async (silent = false) => {
      if (!id) return;
      if (!silent) setLoading(true);
      try {
        const data = await announcementService.getAnnouncementById(
          Number(id),
          user?.id
        );
        setAnnouncement(data);
      } catch (err: any) {
        showNotification(
          err.response?.data?.error || "Failed to load announcement",
          "error"
        );
        navigate("/announcements");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [id, user?.id, navigate]
  );

  const loadComments = useCallback(
    async (silent = false) => {
      if (!id) return;
      if (!silent) setLoadingComments(true);
      try {
        const data = await announcementService.getComments(Number(id), {
          limit: 50,
        });
        setComments(data.comments);
        setCommentsTotal(data.total);
      } catch (err: any) {
        showNotification(
          err.response?.data?.error || "Failed to load comments",
          "error"
        );
      } finally {
        if (!silent) setLoadingComments(false);
      }
    },
    [id]
  );

  useEffect(() => {
    loadAnnouncement();
  }, [loadAnnouncement]);

  useEffect(() => {
    if (announcement) loadComments();
  }, [announcement?.id, loadComments]);

  const handleReact = useCallback(
    async (type: ReactionType) => {
      if (!user?.id || !announcement) return;
      const current = announcement.userReaction;
      if (current === type) {
        const ok = await removeReaction(announcement.id, user.id);
        if (ok) loadAnnouncement(true);
      } else {
        const ok = await reactToAnnouncement(announcement.id, user.id, type);
        if (ok) loadAnnouncement(true);
      }
    },
    [user?.id, announcement, removeReaction, reactToAnnouncement, loadAnnouncement]
  );

  const handleSubmitComment = useCallback(async () => {
    if (!user?.id || !id || !newComment.trim()) return;
    setSubmittingComment(true);
    try {
      await announcementService.addComment(Number(id), user.id, newComment.trim());
      setNewComment("");
      showNotification("Comment added", "success");
      loadComments(true);
      loadAnnouncement(true);
    } catch (err: any) {
      showNotification(
        err.response?.data?.error || "Failed to add comment",
        "error"
      );
    } finally {
      setSubmittingComment(false);
    }
  }, [user?.id, id, newComment, loadComments, loadAnnouncement]);

  const handleSubmitReply = useCallback(
    async (parentCommentId: number) => {
      if (!user?.id || !id || !replyText.trim()) return;
      setSubmittingComment(true);
      try {
        await announcementService.addReply(
          Number(id),
          parentCommentId,
          user.id,
          replyText.trim()
        );
        setReplyText("");
        setReplyingToId(null);
        showNotification("Reply added", "success");
        loadComments(true);
        loadAnnouncement(true);
      } catch (err: any) {
        showNotification(
          err.response?.data?.error || "Failed to add reply",
          "error"
        );
      } finally {
        setSubmittingComment(false);
      }
    },
    [user?.id, id, replyText, loadComments, loadAnnouncement]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || !announcement) {
    return (
      <PageLayout maxWidth="lg">
        <PageHeader icon="pi pi-megaphone" title="Announcement" description="Loading post…" />
        <LoadingState message="Loading announcement…" />
      </PageLayout>
    );
  }

  const likeCount = announcement.likeCount ?? 0;
  const dislikeCount = announcement.dislikeCount ?? 0;
  const userReaction = announcement.userReaction ?? null;
  const hasMedia = announcement.media && announcement.media.length > 0;

  return (
    <PageLayout maxWidth="lg">
      <button type="button" className="resend-btn resend-btn-secondary self-start" onClick={() => navigate("/announcements")}>
        <i className="pi pi-arrow-left" />
        Back
      </button>

      <div className="app-detail-grid">
          {/* Left column: Post + Comments */}
          <div className="space-y-6 min-w-0">
            {/* Post card */}
            <article className="app-panel app-panel--flush overflow-hidden p-0">
              {hasMedia && (
                <div className="relative w-full aspect-video bg-bg-secondary overflow-hidden">
                  <img
                    src={announcement.media![0]}
                    alt={announcement.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>
              )}
              <div className="p-6">
                <span className={`app-announcement-category app-announcement-category--${announcement.category} mb-3 inline-flex`}>
                  {announcementCategoryLabel(announcement.category)}
                </span>
                <h1 className="text-xl font-bold text-text-primary mb-2">
                  {announcement.title}
                </h1>
                <p className="text-text-secondary leading-relaxed whitespace-pre-wrap mb-4">
                  {announcement.description}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bg-secondary border border-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-text-primary font-bold text-sm">
                      {(announcement.user.name || "A")[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">
                      {announcement.user.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {formatDate(announcement.createdAt)}
                    </p>
                  </div>
                </div>
                {announcement.contactInfo && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                    <i className="pi pi-phone text-primary" />
                    <div>
                      <p className="text-xs text-text-tertiary uppercase tracking-wider">Contact</p>
                      <p className="text-sm font-semibold text-text-primary break-all">
                        {announcement.contactInfo}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Comments card */}
            <section className="app-panel app-panel--flush overflow-hidden p-0">
              <div className="p-6">
                {/* Input + Post button in one row */}
                {user?.id && (
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                      placeholder="Write a comment..."
                      className="auth-resend-input flex-1 min-w-0"
                    />
                    <button
                      type="button"
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || submittingComment}
                      className="resend-btn resend-btn-primary shrink-0"
                    >
                      {submittingComment ? (
                        <i className="pi pi-spin pi-spinner" />
                      ) : (
                        "Post"
                      )}
                    </button>
                  </div>
                )}

                {loadingComments ? (
                  <div className="flex justify-center py-8">
                    <i className="pi pi-spin pi-spinner text-2xl text-primary" />
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-text-tertiary text-center py-6 text-sm">
                    No comments yet. Be the first to comment.
                  </p>
                ) : (
                  <ul className="space-y-5">
                    {comments.map((comment) => (
                      <li key={comment.id} className="flex gap-3 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                        <div className="w-9 h-9 rounded-full bg-bg-secondary border border-white/10 flex items-center justify-center text-text-primary font-bold text-sm flex-shrink-0">
                          {(comment.user.name || "?")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-text-primary text-sm">
                              {comment.user.name || "Anonymous"}
                            </span>
                            <span className="text-xs text-text-tertiary">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-text-secondary text-sm mt-0.5 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                          {user?.id && (
                            <button
                              type="button"
                              onClick={() =>
                                setReplyingToId(replyingToId === comment.id ? null : comment.id)
                              }
                              className="text-xs text-primary hover:underline mt-1.5"
                            >
                              {replyingToId === comment.id ? "Cancel" : "Reply"}
                            </button>
                          )}
                          {replyingToId === comment.id && user?.id && (
                            <div className="mt-3 flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="auth-resend-input flex-1 min-w-0"
                              />
                              <button
                                type="button"
                                onClick={() => handleSubmitReply(comment.id)}
                                disabled={!replyText.trim() || submittingComment}
                                className="resend-btn resend-btn-primary shrink-0"
                              >
                                {submittingComment ? <i className="pi pi-spin pi-spinner" /> : "Reply"}
                              </button>
                            </div>
                          )}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 pl-4 border-l-2 border-white/10 space-y-2">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-2">
                                  <span className="font-semibold text-text-primary text-xs">
                                    {reply.user.name || "Anonymous"}:
                                  </span>
                                  <span className="text-text-secondary text-xs whitespace-pre-wrap">
                                    {reply.content}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>

          {/* Right column: Reactions sidebar */}
          <aside className="lg:block">
            <div className="app-panel lg:sticky lg:top-24">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-base font-bold text-text-primary">Reactions</h2>
              </div>
              <div className="p-2 space-y-1">
                {user?.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReact("like")}
                      className={`app-reaction-btn ${userReaction === "like" ? "app-reaction-btn--like" : ""}`}
                    >
                      <i className={`${userReaction === "like" ? "pi pi-thumbs-up-fill" : "pi pi-thumbs-up"} text-lg`} />
                      <span className="font-medium text-sm">Like</span>
                      <span className="ml-auto font-bold text-sm">{likeCount}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReact("dislike")}
                      className={`app-reaction-btn ${userReaction === "dislike" ? "app-reaction-btn--dislike" : ""}`}
                    >
                      <i className={`${userReaction === "dislike" ? "pi pi-thumbs-down-fill" : "pi pi-thumbs-down"} text-lg`} />
                      <span className="font-medium text-sm">Dislike</span>
                      <span className="ml-auto font-bold text-sm">{dislikeCount}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary">
                      <i className="pi pi-thumbs-up text-lg" />
                      <span className="font-medium text-sm">Like</span>
                      <span className="ml-auto font-bold text-sm">{likeCount}</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary">
                      <i className="pi pi-thumbs-down text-lg" />
                      <span className="font-medium text-sm">Dislike</span>
                      <span className="ml-auto font-bold text-sm">{dislikeCount}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-tertiary">
                  <i className="pi pi-comments text-lg" />
                  <span className="font-medium text-sm">Comments</span>
                  <span className="ml-auto font-bold text-sm">{commentsTotal}</span>
                </div>
              </div>
            </div>
          </aside>
      </div>
    </PageLayout>
  );
}
