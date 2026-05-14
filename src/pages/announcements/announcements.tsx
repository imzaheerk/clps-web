import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Button, AnnouncementCard, NetworkBackground } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import type { Announcement } from "@/services/announcementService/announcementService";

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
  const [showMyAnnouncements, setShowMyAnnouncements] = useState(false);

  const refetchAnnouncements = useCallback(() => {
    if (showMyAnnouncements && user?.id) {
      loadAnnouncementsByUserId(user.id, {
        limit: 50,
        currentUserId: user.id,
        silent: true,
      });
    } else if (user?.pincode) {
      loadAnnouncementsByPincode(user.pincode, {
        limit: 50,
        currentUserId: user?.id,
        silent: true,
      });
    }
  }, [showMyAnnouncements, user?.id, user?.pincode, loadAnnouncementsByUserId, loadAnnouncementsByPincode]);

  useEffect(() => {
    if (showMyAnnouncements && user?.id) {
      loadAnnouncementsByUserId(user.id, {
        limit: 50,
        currentUserId: user.id,
      });
    } else if (!showMyAnnouncements && user?.pincode) {
      loadAnnouncementsByPincode(user.pincode, {
        limit: 50,
        currentUserId: user?.id,
      });
    }
  }, [user?.id, user?.pincode, showMyAnnouncements, loadAnnouncementsByPincode, loadAnnouncementsByUserId]);

  const handleDelete = async (announcement: Announcement) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      setDeletingId(announcement.id);
      const success = await deleteAnnouncement(announcement.id, user.id);
      if (success) refetchAnnouncements();
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

  // Filter announcements: if showing all, exclude user's own
  const filteredAnnouncements = showMyAnnouncements
    ? announcements
    : announcements.filter((item) => item.userId !== user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
      {/* Network Background - Global Internet Network Visualization */}
      <NetworkBackground />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Header showAuthButtons={false} />

      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 sm:gap-8 relative z-10">
        {/* Header Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/80 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-sky-500/10 to-cyan-500/10 opacity-60"></div>
            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex-1">
                  {showMyAnnouncements && (
                    <button
                      onClick={() => setShowMyAnnouncements(false)}
                      className="flex items-center gap-2 mb-5 px-5 py-2.5 bg-bg-secondary/60 backdrop-blur-sm rounded-xl text-text-secondary hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-cyan-600/10 transition-all duration-300 group border border-white/10 hover:border-primary/30 shadow-lg hover:shadow-xl"
                    >
                      <i className="pi pi-arrow-left text-lg group-hover:-translate-x-1 transition-transform"></i>
                      <span className="text-sm font-bold">Back</span>
                    </button>
                  )}
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-2xl ring-4 ring-primary/20">
                      <i className="pi pi-megaphone text-white text-3xl"></i>
                    </div>
                    <div>
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-primary mb-3 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent leading-tight">
                        {showMyAnnouncements ? "My Announcements" : "Local Announcements"}
                      </h1>
                      <p className="text-text-secondary text-lg font-medium">
                        {showMyAnnouncements 
                          ? "Manage and edit your announcements" 
                          : "Discover announcements in your local area"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {showMyAnnouncements ? (
                    <Button
                      label="Create New"
                      onClick={() => navigate("/announcements/create")}
                      icon="pi pi-plus"
                      variant="gradient"
                      Size="large"
                    />
                  ) : (
                    <>
                      <Button
                        label="My Announcements"
                        onClick={() => setShowMyAnnouncements(true)}
                        variant="outlined"
                        Size="large"
                        icon="pi pi-user"
                      />
                      <Button
                        label="Create Announcement"
                        onClick={() => navigate("/announcements/create")}
                        icon="pi pi-plus"
                        variant="gradient"
                        Size="large"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative backdrop-blur-xl bg-bg-primary/80 rounded-3xl border border-white/20 shadow-2xl p-16 sm:p-20 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-500/5 to-cyan-500/5 opacity-60 rounded-3xl"></div>
              <div className="relative">
                <div className="inline-flex p-8 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-3xl mb-8 shadow-xl">
                  <i className="pi pi-spin pi-spinner text-7xl text-primary"></i>
                </div>
                <p className="text-2xl font-black text-text-primary">Loading announcements...</p>
              </div>
            </div>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative backdrop-blur-xl bg-bg-primary/80 rounded-3xl border border-white/20 shadow-2xl p-16 sm:p-20 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-500/5 to-cyan-500/5 opacity-60 rounded-3xl"></div>
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-primary/40 shadow-2xl">
                  <i className="pi pi-megaphone text-5xl text-primary"></i>
                </div>
                <h3 className="text-3xl font-black text-text-primary mb-4 bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                  {showMyAnnouncements
                    ? "No announcements yet"
                    : "No announcements in your area"}
                </h3>
                <p className="text-text-secondary mb-8 max-w-md mx-auto text-lg">
                  {showMyAnnouncements
                    ? "Create your first announcement to get started and reach your local community"
                    : "Be the first to create an announcement in your area and connect with neighbors"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Stats Bar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative backdrop-blur-xl bg-bg-primary/80 rounded-2xl border border-white/20 shadow-xl p-5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-500/5 to-cyan-500/5 opacity-60 rounded-2xl"></div>
                <div className="relative flex items-center gap-5">
                  <div className="h-3 w-20 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 rounded-full shadow-lg shadow-primary/50"></div>
                  <p className="text-text-secondary font-bold text-base">
                    Showing <span className="text-primary font-black text-lg">{filteredAnnouncements.length}</span> of <span className="text-primary font-black text-lg">{total}</span> announcement{total !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Announcements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredAnnouncements.map((announcement) => {
                const isOwner = showMyAnnouncements;
                return (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    currentUserId={user?.id}
                    onEdit={isOwner ? () => handleEdit(announcement.id) : undefined}
                    onDelete={isOwner ? () => handleDelete(announcement) : undefined}
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
          </div>
        )}
      </div>
    </div>
  );
}
