import { axiosInstance } from "../axiosInstance/axiosInstance";

export type ReportReason =
  | "spam"
  | "harassment"
  | "inappropriate_content"
  | "scam"
  | "other";

export interface BlockStatus {
  isBlocked: boolean;
  blockedByMe: boolean;
  blockedByThem: boolean;
}

export interface UserBlock {
  id: number;
  blockerId: number;
  blockedId: number;
  createdAt: string;
  blockedUser: {
    id: number;
    name: string | null;
  };
}

export interface CreateReportInput {
  reportedUserId: number;
  reason: ReportReason;
  details?: string;
  conversationId?: number;
}

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "inappropriate_content", label: "Inappropriate content" },
  { value: "scam", label: "Scam or fraud" },
  { value: "other", label: "Other" },
];

export const chatSafetyService = {
  async getBlockStatus(otherUserId: number): Promise<BlockStatus> {
    const { data } = await axiosInstance.get<BlockStatus>(
      `/safety/block-status/${otherUserId}`
    );
    return data;
  },

  async getBlockedUsers(): Promise<{ blocks: UserBlock[]; total: number }> {
    const { data } = await axiosInstance.get<{ blocks: UserBlock[]; total: number }>(
      "/safety/blocks"
    );
    return data;
  },

  async blockUser(blockedUserId: number): Promise<UserBlock> {
    const { data } = await axiosInstance.post<UserBlock>(
      `/safety/block/${blockedUserId}`
    );
    return data;
  },

  async unblockUser(blockedUserId: number): Promise<void> {
    await axiosInstance.delete(`/safety/block/${blockedUserId}`);
  },

  async reportUser(input: CreateReportInput): Promise<void> {
    await axiosInstance.post("/safety/reports", input);
  },
};
