import { axiosInstance } from "../axiosInstance/axiosInstance";

export interface Subscription {
  id: number;
  userId: number;
  planId: number;
  plan?: {
    id: number;
    name: string;
    duration: number;
    price: number;
    features: string[];
    isPopular: boolean;
    isDefault: boolean;
  };
  startsAt: string;
  expiresAt: string | null;
  status: "active" | "expired" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionInput {
  planId: number;
}

export const subscriptionService = {
  async getActiveSubscription(userId: number): Promise<Subscription | null> {
    try {
      const response = await axiosInstance.get<Subscription>(
        `/users/${userId}/subscriptions/active`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    const response = await axiosInstance.get<Subscription[]>(
      `/users/${userId}/subscriptions`
    );
    return response.data;
  },

  async createSubscription(
    userId: number,
    input: CreateSubscriptionInput
  ): Promise<Subscription> {
    const response = await axiosInstance.post<Subscription>(
      `/users/${userId}/subscriptions`,
      input
    );
    return response.data;
  },

  async cancelSubscription(
    userId: number,
    subscriptionId: number
  ): Promise<Subscription> {
    const response = await axiosInstance.delete<Subscription>(
      `/users/${userId}/subscriptions/${subscriptionId}`
    );
    return response.data;
  },
};

