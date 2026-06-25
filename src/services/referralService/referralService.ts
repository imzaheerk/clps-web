import { axiosInstance } from "../axiosInstance/axiosInstance";

export interface ReferralCodeOutput {
  referralCode: string;
  referralLink: string;
  userId: number;
  createdAt: string;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalRewardsEarned: number;
  referralCode: string | null;
  referralLink: string | null;
}

export interface ReferralUser {
  id: number;
  name: string | null;
}

export interface Referral {
  id: number;
  referrerId: number;
  referredUserId: number | null;
  referralCode: string;
  status: "pending" | "completed" | "rewarded";
  referrerReward: number;
  referredReward: number;
  referrerRewardAwarded: boolean;
  referredRewardAwarded: boolean;
  completedAt: string | null;
  referrerRewardedAt: string | null;
  referredRewardedAt: string | null;
  createdAt: string;
  updatedAt: string;
  referrer: ReferralUser;
  referredUser: ReferralUser | null;
}

export interface ReferralListResponse {
  referrals: Referral[];
  total: number;
}

export interface ShareMessageOutput {
  message: string;
  referralLink: string;
  referralCode: string;
}

export interface PendingReferralReward {
  referralId: number;
  rewardType: "referrer" | "referred";
  days: number;
  completedAt: string | null;
}

export interface PendingReferralRewards {
  hasPendingReward: boolean;
  totalPendingDays: number;
  rewards: PendingReferralReward[];
}

export const referralService = {
  async generateCode(userId: number): Promise<ReferralCodeOutput> {
    const res = await axiosInstance.post<ReferralCodeOutput>("/referrals/generate-code", {
      userId,
    });
    return res.data;
  },

  async getStats(userId: number): Promise<ReferralStats> {
    const res = await axiosInstance.get<ReferralStats>(`/referrals/stats/${userId}`);
    return res.data;
  },

  async getReferrals(
    userId: number,
    params?: { limit?: number; offset?: number }
  ): Promise<ReferralListResponse> {
    const res = await axiosInstance.get<ReferralListResponse>(
      `/referrals/referrer/${userId}`,
      { params }
    );
    return res.data;
  },

  async getShareMessage(userId: number): Promise<ShareMessageOutput> {
    const res = await axiosInstance.get<ShareMessageOutput>(
      `/referrals/share-message/${userId}`
    );
    return res.data;
  },

  async getPendingRewards(userId: number): Promise<PendingReferralRewards> {
    const res = await axiosInstance.get<PendingReferralRewards>(
      `/referrals/pending-rewards/${userId}`
    );
    return res.data;
  },

  async claimReward(
    referralId: number,
    userId: number,
    rewardType: "referrer" | "referred"
  ): Promise<void> {
    await axiosInstance.post("/referrals/award-reward", {
      referralId,
      userId,
      rewardType,
    });
  },
};

/** Build a signup link that works on this web app */
export function buildInviteSignupLink(code: string): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://checknown.com";
  return `${origin}/signup?ref=${encodeURIComponent(code)}`;
}
