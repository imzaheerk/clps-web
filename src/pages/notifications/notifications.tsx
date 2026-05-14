import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  showNotification,
  Button,
  PageLayout,
  PageHeader,
  LoadingState,
  EmptyState,
} from "@/components";
import { notificationService } from "@/services/notificationService/notificationService";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import type { Notification } from "@/services/notificationService/notificationService";
import "primeicons/primeicons.css";

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription } = useSubscription(user?.id ?? null, !!user?.id);
  const isPremium =
    !!subscription?.status &&
    subscription.status === "active" &&
    subscription?.plan &&
    !subscription.plan.isDefault &&
    Number(subscription.plan.price) > 0;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    loadNotifications();
  }, [user, navigate]);

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await notificationService.getNotifications(user.id, {
        limit: 50,
        offset: 0,
      });
      setNotifications(response.notifications);
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || "Failed to load notifications",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    if (!user?.id) return;

    try {
      await notificationService.markAsRead(notificationId, user.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      // Refresh notification count in header by triggering a reload
      window.dispatchEvent(new Event("notification-updated"));
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || "Failed to mark notification as read",
        "error"
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      // Refresh notification count in header
      window.dispatchEvent(new Event("notification-updated"));
      showNotification("All notifications marked as read", "success");
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || "Failed to mark all as read",
        "error"
      );
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    const type = (notification.type || "").toLowerCase();
    const viewerId = notification.viewerId;

    if (type === "profile_view" && viewerId) {
      navigate(`/profile/${viewerId}`);
      return;
    }
    if (type === "chat_request") {
      navigate("/messaging/requests");
      return;
    }
    if (type === "chat_request_accepted") {
      navigate("/messaging");
      return;
    }
    if (type === "number_reveal_request") {
      navigate("/number-reveal-requests");
      return;
    }
    if (type === "number_reveal_accepted") {
      navigate("/number-reveal-requests");
      return;
    }
  };

  return (
    <PageLayout maxWidth="md" showAuthButtons={false}>
      <PageHeader
        icon="pi pi-bell"
        title="Notifications"
        description={
          unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
            : undefined
        }
        action={
          unreadCount > 0 ? (
            <Button
              label="Mark all as read"
              icon="pi pi-check"
              onClick={handleMarkAllAsRead}
              variant="gradient"
              Size="medium"
            />
          ) : undefined
        }
      />

      {/* Notifications List */}
      {loading ? (
        <LoadingState message="Loading notifications..." size="medium" />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="pi pi-bell"
          title="No Notifications"
          description="You don't have any notifications yet."
          size="medium"
        />
      ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`relative group transition-all duration-300 cursor-pointer ${
                  notification.isRead ? "opacity-70" : ""
                }`}
              >
                {!notification.isRead && !isPremium && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}
                <div
                  className={`relative overflow-hidden p-5 sm:p-6 transition-all duration-300 ${
                    isPremium
                      ? "rounded-2xl border-2 border-amber-400 bg-amber-500/10 shadow-md shadow-amber-500/10 hover:border-amber-400 hover:bg-amber-500/15 hover:shadow-lg hover:shadow-amber-500/15 dark:border-amber-500/80 dark:bg-amber-500/5 dark:hover:bg-amber-500/10"
                      : notification.isRead
                      ? "rounded-3xl border border-white/10 bg-bg-primary/60 hover:bg-bg-primary/70 backdrop-blur-xl"
                      : "rounded-3xl border border-primary/30 bg-bg-primary/80 hover:border-primary/50 hover:bg-bg-primary/90 backdrop-blur-xl"
                  }`}
                >
                  {isPremium && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 dark:from-amber-500 dark:via-yellow-500 dark:to-amber-500" />
                  )}
                  {!notification.isRead && !isPremium && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-t-3xl" />
                  )}
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        isPremium
                          ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                          : notification.isRead
                          ? "bg-gradient-to-br from-gray-400 to-gray-600"
                          : "bg-gradient-to-br from-primary to-cyan-600 shadow-lg"
                      }`}
                    >
                      <i className="pi pi-bell text-white text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-base mb-2 ${
                          notification.isRead ? "font-semibold" : "font-black"
                        } text-text-primary`}
                      >
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <i className="pi pi-clock text-xs text-text-tertiary" />
                        <p className="text-xs text-text-tertiary m-0">
                          {formatDate(notification.createdAt)}
                        </p>
                        {!notification.isRead && (
                          <>
                            <span className="text-text-tertiary">•</span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                                isPremium
                                  ? "bg-amber-500/25 text-amber-700 dark:text-amber-300"
                                  : "bg-primary/20 text-primary"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isPremium ? "bg-amber-500" : "bg-primary"
                                }`}
                              />
                              New
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="flex-shrink-0">
                        <div
                          className={`w-3 h-3 rounded-full shadow-md ${
                            isPremium ? "bg-amber-500" : "bg-primary"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </PageLayout>
  );
}
