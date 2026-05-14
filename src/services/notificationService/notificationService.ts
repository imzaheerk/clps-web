import { axiosInstance } from "../axiosInstance/axiosInstance";

export interface Notification {
  id: number;
  userId: number;
  viewerId?: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
}

export interface NotificationQuery {
  limit?: number;
  offset?: number;
}

export const notificationService = {
  async getNotifications(
    userId: number,
    query?: NotificationQuery
  ): Promise<NotificationListResponse> {
    const params = new URLSearchParams();
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.offset) params.append("offset", query.offset.toString());

    const response = await axiosInstance.get<NotificationListResponse>(
      `/notifications/user/${userId}?${params.toString()}`
    );
    return response.data;
  },

  async getNotificationCount(userId: number): Promise<number> {
    const response = await axiosInstance.get<{ count: number }>(
      `/notifications/user/${userId}/count`
    );
    return response.data.count;
  },

  async markAsRead(notificationId: number, userId: number): Promise<Notification> {
    const response = await axiosInstance.put<Notification>(
      `/notifications/${notificationId}/user/${userId}/read`
    );
    return response.data;
  },

  async markAllAsRead(userId: number): Promise<void> {
    await axiosInstance.put(`/notifications/user/${userId}/read-all`);
  },
};
