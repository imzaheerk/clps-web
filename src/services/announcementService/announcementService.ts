import { axiosInstance } from "../axiosInstance/axiosInstance";

export type ReactionType = "like" | "dislike";

export interface Announcement {
  id: number;
  userId: number;
  title: string;
  description: string;
  pincode: string;
  contactInfo: string | null;
  media: string[] | null; // Array of image URLs
  isActive: boolean;
  likeCount: number;
  dislikeCount: number;
  userReaction: ReactionType | null;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string | null;
  };
}

export interface AnnouncementListResponse {
  announcements: Announcement[];
  total: number;
}

export interface AnnouncementQuery {
  limit?: number;
  offset?: number;
  currentUserId?: number;
  /** When true, refetch in background without showing full loading state (client-only, not sent to API) */
  silent?: boolean;
}

export interface CreateAnnouncementInput {
  title: string;
  description: string;
  media?: string[]; // Optional array of image URLs
}

export interface UpdateAnnouncementInput {
  title?: string;
  description?: string;
  media?: string[]; // Optional array of image URLs
  isActive?: boolean;
}

export interface CommentUser {
  id: number;
  name: string | null;
}

export interface Comment {
  id: number;
  announcementId: number;
  userId: number;
  user: CommentUser;
  content: string;
  parentCommentId: number | null;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
}

export interface CommentQuery {
  limit?: number;
  offset?: number;
}

export const announcementService = {
  async getAnnouncementsByPincode(
    pincode: string,
    query?: AnnouncementQuery
  ): Promise<AnnouncementListResponse> {
    const params = new URLSearchParams();
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.offset) params.append("offset", query.offset.toString());
    if (query?.currentUserId != null)
      params.append("currentUserId", query.currentUserId.toString());

    const response = await axiosInstance.get<AnnouncementListResponse>(
      `/announcements/pincode/${pincode}?${params.toString()}`
    );
    return response.data;
  },

  async getAnnouncementsByUserId(
    userId: number,
    query?: AnnouncementQuery
  ): Promise<AnnouncementListResponse> {
    const params = new URLSearchParams();
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.offset) params.append("offset", query.offset.toString());
    if (query?.currentUserId != null)
      params.append("currentUserId", query.currentUserId.toString());

    const response = await axiosInstance.get<AnnouncementListResponse>(
      `/announcements/user/${userId}?${params.toString()}`
    );
    return response.data;
  },

  async getAnnouncementById(
    id: number,
    currentUserId?: number
  ): Promise<Announcement> {
    const params = new URLSearchParams();
    if (currentUserId != null)
      params.append("currentUserId", currentUserId.toString());
    const qs = params.toString();
    const url = qs ? `/announcements/${id}?${qs}` : `/announcements/${id}`;
    const response = await axiosInstance.get<Announcement>(url);
    return response.data;
  },

  async reactToAnnouncement(
    announcementId: number,
    userId: number,
    type: ReactionType
  ): Promise<{ message: string; type: ReactionType }> {
    const response = await axiosInstance.post<{
      message: string;
      type: ReactionType;
    }>(`/announcements/${announcementId}/react/user/${userId}`, { type });
    return response.data;
  },

  async removeReaction(
    announcementId: number,
    userId: number
  ): Promise<{ message: string }> {
    const response = await axiosInstance.delete<{ message: string }>(
      `/announcements/${announcementId}/react/user/${userId}`
    );
    return response.data;
  },

  async getComments(
    announcementId: number,
    query?: CommentQuery
  ): Promise<CommentListResponse> {
    const params = new URLSearchParams();
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.offset) params.append("offset", query.offset.toString());
    const qs = params.toString();
    const url = qs
      ? `/announcements/${announcementId}/comments?${qs}`
      : `/announcements/${announcementId}/comments`;
    const response = await axiosInstance.get<CommentListResponse>(url);
    return response.data;
  },

  async addComment(
    announcementId: number,
    userId: number,
    content: string
  ): Promise<Comment> {
    const response = await axiosInstance.post<Comment>(
      `/announcements/${announcementId}/comments/user/${userId}`,
      { content }
    );
    return response.data;
  },

  async addReply(
    announcementId: number,
    parentCommentId: number,
    userId: number,
    content: string
  ): Promise<Comment> {
    const response = await axiosInstance.post<Comment>(
      `/announcements/${announcementId}/comments/${parentCommentId}/reply/user/${userId}`,
      { content }
    );
    return response.data;
  },

  async createAnnouncement(
    userId: number,
    input: CreateAnnouncementInput
  ): Promise<Announcement> {
    const response = await axiosInstance.post<Announcement>(
      `/announcements/user/${userId}`,
      input
    );
    return response.data;
  },

  async updateAnnouncement(
    id: number,
    userId: number,
    input: UpdateAnnouncementInput
  ): Promise<Announcement> {
    const response = await axiosInstance.put<Announcement>(
      `/announcements/${id}/user/${userId}`,
      input
    );
    return response.data;
  },

  async deleteAnnouncement(
    id: number,
    userId: number
  ): Promise<{ message: string }> {
    const response = await axiosInstance.delete<{ message: string }>(
      `/announcements/${id}/user/${userId}`
    );
    return response.data;
  },
};
