import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification, PageLayout, PageHeader, LoadingState, EmptyState } from "@/components";
import { notificationService } from "@/services/notificationService/notificationService";
import { useAuth } from "@/contexts/AuthContext";
import type { Notification } from "@/services/notificationService/notificationService";

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
      const response = await notificationService.getNotifications(user.id, { limit: 50, offset: 0 });
      setNotifications(response.notifications);
    } catch (error: any) {
      showNotification(error.response?.data?.error || "Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    if (!user?.id) return;
    try {
      await notificationService.markAsRead(notificationId, user.id);
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)));
      window.dispatchEvent(new Event("notification-updated"));
    } catch (error: any) {
      showNotification(error.response?.data?.error || "Failed to mark notification as read", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      window.dispatchEvent(new Event("notification-updated"));
      showNotification("All notifications marked as read", "success");
    } catch (error: any) {
      showNotification(error.response?.data?.error || "Failed to mark all as read", "error");
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
    if (!notification.isRead) handleMarkAsRead(notification.id);
    const type = (notification.type || "").toLowerCase();
    const viewerId = notification.viewerId;
    if (type === "profile_view" && viewerId) navigate(`/profile/${viewerId}`);
    else if (type === "chat_request") navigate("/messaging/requests");
    else if (type === "chat_request_accepted") navigate("/messaging");
    else if (type === "number_reveal_request" || type === "number_reveal_accepted") navigate("/number-reveal-requests");
    else if (type === "saved_search_alert") {
      const match = notification.message.match(/for "(.+)"$/);
      if (match?.[1]) {
        navigate(`/search?q=${encodeURIComponent(match[1])}`);
      } else {
        navigate("/saved-searches");
      }
    }
  };

  return (
    <PageLayout maxWidth="md">
      <PageHeader
        icon="pi pi-bell"
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : "Your recent activity"}
        action={
          unreadCount > 0 ? (
            <button type="button" className="resend-btn resend-btn-secondary" onClick={handleMarkAllAsRead}>
              <i className="pi pi-check" />
              Mark all read
            </button>
          ) : undefined
        }
      />

      {loading ? (
        <LoadingState message="Loading notifications…" />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="pi pi-bell"
          title="No notifications"
          description="When something happens in your network, you'll see it here."
        />
      ) : (
        <div className="app-tip-list">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleNotificationClick(notification)}
              className={`app-notification-item ${notification.isRead ? "is-read" : "is-unread"}`}
            >
              <span className={`app-notification-icon ${notification.isRead ? "" : "is-active"}`}>
                <i className="pi pi-bell" />
              </span>
              <span className="app-notification-body">
                <span className="app-notification-message">{notification.message}</span>
                <span className="app-notification-meta">
                  {formatDate(notification.createdAt)}
                  {!notification.isRead ? <span className="app-notification-badge">New</span> : null}
                </span>
              </span>
              <i className="pi pi-chevron-right app-tip-arrow" />
            </button>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
