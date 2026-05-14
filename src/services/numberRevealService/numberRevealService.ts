import { axiosInstance } from "../axiosInstance/axiosInstance";

const BASE = "/users/number-reveal";

export interface NumberRevealRequestOutput {
  id: number;
  requesterId: number;
  requesterName: string | null;
  targetUserId: number;
  status: "pending" | "accepted" | "rejected";
  revealType?: "one_time" | "permanent";
  createdAt: string;
}

export const numberRevealService = {
  async requestNumberReveal(targetUserId: number): Promise<{ message: string }> {
    const res = await axiosInstance.post<{ message: string }>(`${BASE}/request`, {
      targetUserId,
    });
    return res.data;
  },

  async getMyNumberRevealRequests(): Promise<NumberRevealRequestOutput[]> {
    const res = await axiosInstance.get<NumberRevealRequestOutput[]>(`${BASE}/requests`);
    return res.data;
  },

  async getRequestStatus(
    targetUserId: number
  ): Promise<{ status: "none" | "pending" | "accepted" | "rejected" }> {
    const res = await axiosInstance.get<{ status: string }>(`${BASE}/status`, {
      params: { targetUserId },
    });
    return {
      status: res.data.status as "none" | "pending" | "accepted" | "rejected",
    };
  },

  async respondToRequest(requestId: number, accept: boolean): Promise<NumberRevealRequestOutput> {
    const res = await axiosInstance.post<NumberRevealRequestOutput>(
      `${BASE}/requests/${requestId}/respond`,
      { accept }
    );
    return res.data;
  },
};
