import { axiosInstance } from "../axiosInstance/axiosInstance";

export type FeedItemType = "announcement" | "event";

export interface FeedItem {
  type: FeedItemType;
  id: number;
  title: string;
  excerpt: string;
  authorName: string | null;
  pincode: string;
  sortDate: string;
  category: string | null;
  likeCount?: number;
  commentCount?: number;
  rsvpCount?: number;
  eventDate?: string;
  location?: string | null;
  userHasRsvp?: boolean;
}

export interface FeedListResponse {
  items: FeedItem[];
  total: number;
}

export interface FeedQuery {
  limit?: number;
  currentUserId?: number;
  /** Client-only — not sent to API */
  silent?: boolean;
}

export const feedService = {
  async getLocalFeed(pincode: string, query?: FeedQuery): Promise<FeedListResponse> {
    const { silent: _silent, ...params } = query ?? {};
    const { data } = await axiosInstance.get<FeedListResponse>(
      `/feed/pincode/${encodeURIComponent(pincode)}`,
      { params }
    );
    return data;
  },
};
