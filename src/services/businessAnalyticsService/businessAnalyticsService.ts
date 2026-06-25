import { axiosInstance } from "../axiosInstance/axiosInstance";

export type BusinessAnalyticsEventType =
  | "impression"
  | "profile_click"
  | "message_request";

export interface BusinessAnalyticsTotals {
  impressions: number;
  profileClicks: number;
  messageRequests: number;
}

export interface BusinessAnalyticsDailyRow {
  date: string;
  impressions: number;
  profileClicks: number;
  messageRequests: number;
}

export interface BusinessAnalytics {
  businessId: number;
  periodDays: number;
  totals: BusinessAnalyticsTotals;
  daily: BusinessAnalyticsDailyRow[];
}

export const businessAnalyticsService = {
  async recordEvent(
    businessId: number,
    eventType: BusinessAnalyticsEventType
  ): Promise<void> {
    try {
      await axiosInstance.post(`/businesses/${businessId}/analytics/events`, {
        eventType,
      });
    } catch {
      // Analytics should not block UX
    }
  },

  async getAnalytics(
    businessId: number,
    days = 30
  ): Promise<BusinessAnalytics> {
    const { data } = await axiosInstance.get<BusinessAnalytics>(
      `/businesses/${businessId}/analytics`,
      { params: { days } }
    );
    return data;
  },
};
