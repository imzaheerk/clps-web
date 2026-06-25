import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnnouncementCard, PageLayout, PageHeader, LoadingState, EmptyState } from "@/components";
import ResendModal from "@/components/ResendModal";
import { useAuth } from "@/contexts/AuthContext";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import {
  ANNOUNCEMENT_CATEGORIES,
  type Announcement,
  type AnnouncementCategory,
} from "@/services/announcementService/announcementService";

export default function Announcements() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    announcements,
    total,
    loading,
    loadAnnouncementsByPincode,
    loadAnnouncementsByUserId,
    deleteAnnouncement,
    reactToAnnouncement,
    removeReaction,
  } = useAnnouncements();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const [showMyAnnouncements, setShowMyAnnouncements] = useState(false);
  const [category, setCategory] = useState<AnnouncementCategory | "">("");

  const refetchAnnouncements = useCallback(() => {
    const categoryFilter = category || undefined;
    if (showMyAnnouncements && user?.id) {
      loadAnnouncementsByUserId(user.id, {
        limit: 50,
        currentUserId: user.id,
        category: categoryFilter,
        silent: true,
      });
    } else if (user?.pincode) {
      loadAnnouncementsByPincode(user.pincode, {
        limit: 50,
        currentUserId: user?.id,
        category: categoryFilter,
        silent: true,
      });
    }
  }, [showMyAnnouncements, user?.id, user?.pincode, category, loadAnnouncementsByUserId, loadAnnouncementsByPincode]);

  useEffect(() => {
    const categoryFilter = category || undefined;
    if (showMyAnnouncements && user?.id) {
      loadAnnouncementsByUserId(user.id, {
        limit: 50,
        currentUserId: user.id,
        category: categoryFilter,
      });
    } else if (!showMyAnnouncements && user?.pincode) {
      loadAnnouncementsByPincode(user.pincode, {
        limit: 50,
        currentUserId: user?.id,
        category: categoryFilter,
      });
    }
  }, [user?.id, user?.pincode, showMyAnnouncements, category, loadAnnouncementsByPincode, loadAnnouncementsByUserId]);

  const confirmDelete = async () => {
    if (!user || !announcementToDelete) return;
    setDeletingId(announcementToDelete.id);
    try {
      const success = await deleteAnnouncement(announcementToDelete.id, user.id);
      if (success) {
        setAnnouncementToDelete(null);
        refetchAnnouncements();
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (announcementId: number) => {
    navigate(`/announcements/${announcementId}/edit`);
  };

  const handleReact = useCallback(
    async (announcementId: number, type: "like" | "dislike") => {
      if (!user?.id) return;
      const ok = await reactToAnnouncement(announcementId, user.id, type);
      if (ok) refetchAnnouncements();
    },
    [user?.id, reactToAnnouncement, refetchAnnouncements]
  );

  const handleRemoveReaction = useCallback(
    async (announcementId: number) => {
      if (!user?.id) return;
      const ok = await removeReaction(announcementId, user.id);
      if (ok) refetchAnnouncements();
    },
    [user?.id, removeReaction, refetchAnnouncements]
  );

  const filteredAnnouncements = showMyAnnouncements
    ? announcements
    : announcements.filter((item) => item.userId !== user?.id);

  return (
    <PageLayout maxWidth="xl">
      {showMyAnnouncements ? (
        <button
          type="button"
          onClick={() => setShowMyAnnouncements(false)}
          className="resend-btn resend-btn-secondary self-start"
        >
          <i className="pi pi-arrow-left" />
          Back to local feed
        </button>
      ) : null}

      <PageHeader
        icon="pi pi-megaphone"
        title={showMyAnnouncements ? "My announcements" : "Local announcements"}
        description={
          showMyAnnouncements
            ? "Manage and edit your announcements"
            : "Discover updates in your local area"
        }
        action={
          <div className="flex flex-wrap gap-2">
            {!showMyAnnouncements ? (
              <button
                type="button"
                className="resend-btn resend-btn-secondary"
                onClick={() => setShowMyAnnouncements(true)}
              >
                <i className="pi pi-user" />
                My announcements
              </button>
            ) : null}
            <button
              type="button"
              className="resend-btn resend-btn-primary"
              onClick={() => navigate("/announcements/create")}
            >
              <i className="pi pi-plus" />
              Create
            </button>
          </div>
        }
      />

      <div className="app-announcement-filters">
        <button
          type="button"
          className={`app-announcement-filter-chip ${category === "" ? "is-active" : ""}`}
          onClick={() => setCategory("")}
        >
          All
        </button>
        {ANNOUNCEMENT_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={`app-announcement-filter-chip app-announcement-filter-chip--${cat.value} ${category === cat.value ? "is-active" : ""}`}
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState message="Loading announcements…" />
      ) : filteredAnnouncements.length === 0 ? (
        <EmptyState
          icon="pi pi-megaphone"
          title={showMyAnnouncements ? "No announcements yet" : "No announcements in your area"}
          description={
            category
              ? `No ${ANNOUNCEMENT_CATEGORIES.find((c) => c.value === category)?.label ?? ""} posts yet. Try another filter or create one.`
              : showMyAnnouncements
                ? "Create your first announcement to reach your local community."
                : "Be the first to post an update in your area."
          }
          action={{
            label: "Create announcement",
            onClick: () => navigate("/announcements/create"),
            icon: "pi pi-plus",
          }}
        />
      ) : (
        <>
          <div className="app-panel app-panel--compact">
            <p className="app-panel-stat m-0">
              Showing <strong>{filteredAnnouncements.length}</strong> of{" "}
              <strong>{total}</strong> announcement{total !== 1 ? "s" : ""}
              {category ? (
                <>
                  {" "}
                  in <strong>{ANNOUNCEMENT_CATEGORIES.find((c) => c.value === category)?.label}</strong>
                </>
              ) : null}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAnnouncements.map((announcement) => {
              const isOwner = showMyAnnouncements;
              return (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  currentUserId={user?.id}
                  onEdit={isOwner ? () => handleEdit(announcement.id) : undefined}
                  onDelete={isOwner ? () => setAnnouncementToDelete(announcement) : undefined}
                  onReact={user?.id ? (type) => handleReact(announcement.id, type) : undefined}
                  onRemoveReaction={user?.id ? () => handleRemoveReaction(announcement.id) : undefined}
                  onViewComments={() => navigate(`/announcements/${announcement.id}`)}
                  onOpenDetail={() => navigate(`/announcements/${announcement.id}`)}
                  showActions={isOwner}
                  isDeleting={deletingId === announcement.id}
                />
              );
            })}
          </div>
        </>
      )}

      <ResendModal
        visible={!!announcementToDelete}
        onHide={() => !deletingId && setAnnouncementToDelete(null)}
        badge="Announcement"
        title="Delete announcement?"
        description={
          announcementToDelete ? (
            <>
              Permanently remove <strong>{announcementToDelete.title}</strong>? Comments and reactions
              will be deleted too.
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
              onClick={() => setAnnouncementToDelete(null)}
              disabled={deletingId !== null}
            >
              Keep announcement
            </button>
            <button
              type="button"
              className="resend-btn resend-btn-danger"
              onClick={confirmDelete}
              disabled={deletingId !== null}
            >
              {deletingId !== null ? (
                <>
                  <i className="pi pi-spin pi-spinner" />
                  Deleting…
                </>
              ) : (
                "Delete announcement"
              )}
            </button>
          </div>
        }
      />
    </PageLayout>
  );
}
