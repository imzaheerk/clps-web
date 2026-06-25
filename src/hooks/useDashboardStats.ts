import { useCallback, useEffect, useState } from "react";
import { announcementService } from "@/services/announcementService/announcementService";
import type { AnnouncementCategoryStats } from "@/services/announcementService/announcementService";
import { businessService } from "@/services/businessService/businessService";
import { messagingService } from "@/services/messagingService/messagingService";
import { notificationService } from "@/services/notificationService/notificationService";
import { numberRevealService } from "@/services/numberRevealService/numberRevealService";

export interface DashboardActivityItem {
  id: string;
  label: string;
  detail: string;
  time: string;
  tone: "sky" | "violet" | "amber" | "emerald";
}

export interface DashboardStats {
  conversations: number;
  unreadNotifications: number;
  pendingChatRequests: number;
  localAnnouncements: number;
  announcementCategoryCounts: AnnouncementCategoryStats["counts"] | null;
  myBusinesses: number;
  pendingNumberReveal: number;
  weeklyActivity: number[];
  recentActivity: DashboardActivityItem[];
  lastUpdated: Date;
}

const EMPTY_STATS: DashboardStats = {
  conversations: 0,
  unreadNotifications: 0,
  pendingChatRequests: 0,
  localAnnouncements: 0,
  announcementCategoryCounts: null,
  myBusinesses: 0,
  pendingNumberReveal: 0,
  weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
  recentActivity: [],
  lastUpdated: new Date(),
};

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function buildWeeklyActivity(timestamps: string[]) {
  const buckets = Array.from({ length: 7 }, () => 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (const raw of timestamps) {
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) continue;
    date.setHours(0, 0, 0, 0);
    const dayDiff = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (dayDiff >= 0 && dayDiff < 7) {
      buckets[6 - dayDiff] += 1;
    }
  }

  return buckets;
}

function dayLabels() {
  const labels: string[] = [];
  const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(formatter.format(date));
  }
  return labels;
}

export function getDashboardDayLabels() {
  return dayLabels();
}

export function useDashboardStats(userId: number | null, pincode?: string | null) {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setStats(EMPTY_STATS);
      setLoading(false);
      return;
    }

    try {
      const [
        conversationsRes,
        notificationCount,
        notificationsRes,
        pendingRequestsRes,
        businessesRes,
        numberRevealRes,
        announcementsRes,
        categoryStatsRes,
      ] = await Promise.all([
        messagingService.getConversations().catch(() => ({ conversations: [], total: 0 })),
        notificationService.getNotificationCount(userId).catch(() => 0),
        notificationService
          .getNotifications(userId, { limit: 12 })
          .catch(() => ({ notifications: [], total: 0 })),
        messagingService.getPendingChatRequests().catch(() => ({ requests: [], total: 0 })),
        businessService.getMyBusinesses({ limit: 20 }).catch(() => ({ businesses: [], total: 0 })),
        numberRevealService.getMyNumberRevealRequests().catch(() => []),
        pincode
          ? announcementService
              .getAnnouncementsByPincode(pincode, { limit: 20, currentUserId: userId })
              .catch(() => ({ announcements: [], total: 0 }))
          : Promise.resolve({ announcements: [], total: 0 }),
        pincode
          ? announcementService.getCategoryStatsByPincode(pincode).catch(() => null)
          : Promise.resolve(null),
      ]);

      const activityTimestamps = [
        ...notificationsRes.notifications.map((item) => item.createdAt),
        ...conversationsRes.conversations.map((item) => item.updatedAt),
        ...pendingRequestsRes.requests.map((item) => item.createdAt),
      ];

      const pendingNumberReveal = numberRevealRes.filter((item) => item.status === "pending").length;

      const recentActivity: DashboardActivityItem[] = [
        ...notificationsRes.notifications.slice(0, 5).map((item) => ({
          id: `notification-${item.id}`,
          label: item.isRead ? "Notification" : "New alert",
          detail: item.message,
          time: formatRelativeTime(item.createdAt),
          sortAt: new Date(item.createdAt).getTime(),
          tone: item.isRead ? ("sky" as const) : ("amber" as const),
        })),
        ...conversationsRes.conversations.slice(0, 4).map((item) => {
          const other =
            item.user1Id === userId
              ? item.user2.name || "Connection"
              : item.user1.name || "Connection";
          return {
            id: `conversation-${item.id}`,
            label: "Conversation",
            detail: `Chat with ${other}`,
            time: formatRelativeTime(item.updatedAt),
            sortAt: new Date(item.updatedAt).getTime(),
            tone: "violet" as const,
          };
        }),
      ]
        .sort((a, b) => b.sortAt - a.sortAt)
        .slice(0, 5)
        .map(({ sortAt: _sortAt, ...item }) => item);

      setStats({
        conversations: conversationsRes.total || conversationsRes.conversations.length,
        unreadNotifications: notificationCount,
        pendingChatRequests: pendingRequestsRes.total || pendingRequestsRes.requests.length,
        localAnnouncements: announcementsRes.total || announcementsRes.announcements.length,
        announcementCategoryCounts: categoryStatsRes?.counts ?? null,
        myBusinesses: businessesRes.total || businessesRes.businesses.length,
        pendingNumberReveal,
        weeklyActivity: buildWeeklyActivity(activityTimestamps),
        recentActivity,
        lastUpdated: new Date(),
      });
    } catch {
      setStats((prev) => ({ ...prev, lastUpdated: new Date() }));
    } finally {
      setLoading(false);
    }
  }, [pincode, userId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  useEffect(() => {
    if (!userId) return undefined;

    const onVisible = () => {
      if (!document.hidden) load();
    };

    const interval = window.setInterval(load, 60000);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("notification-updated", load);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("notification-updated", load);
    };
  }, [load, userId]);

  return { stats, loading, refresh: load };
}
