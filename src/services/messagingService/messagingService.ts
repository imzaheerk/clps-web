import { axiosInstance } from "../axiosInstance/axiosInstance";

import type { BlockStatus } from "@/services/chatSafetyService/chatSafetyService";

export interface ChatRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  updatedAt: string;
  withdrawnAt?: string | null;
  sender: {
    id: number;
    name: string | null;
  };
  receiver: {
    id: number;
    name: string | null;
  };
}

export interface ChatRequestListResponse {
  requests: ChatRequest[];
  total: number;
}

export interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
  createdAt: string;
  updatedAt: string;
  user1: {
    id: number;
    name: string | null;
  };
  user2: {
    id: number;
    name: string | null;
  };
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    name: string | null;
  };
}

export interface MessageListResponse {
  messages: Message[];
  total: number;
}

export interface MessageQuery {
  limit?: number;
  offset?: number;
}

export interface SendChatRequestInput {
  receiverId: number;
}

export interface RespondToChatRequestInput {
  requestId: number;
  action: "accept" | "reject" | "withdraw";
}

export interface SendMessageInput {
  conversationId: number;
  content: string;
}

export const messagingService = {
  async sendChatRequest(input: SendChatRequestInput): Promise<ChatRequest> {
    // Token is automatically added by axios interceptor
    const response = await axiosInstance.post<ChatRequest>(
      `/chat-requests`,
      input
    );
    return response.data;
  },

  async respondToChatRequest(
    input: RespondToChatRequestInput
  ): Promise<ChatRequest | Conversation> {
    // Token is automatically added by axios interceptor
    const response = await axiosInstance.post<ChatRequest | Conversation>(
      `/chat-requests/respond`,
      input
    );
    return response.data;
  },

  async getChatRequests(): Promise<ChatRequestListResponse> {
    // Token is automatically added by axios interceptor
    const response = await axiosInstance.get<ChatRequestListResponse>(
      `/chat-requests`
    );
    return response.data;
  },

  async getPendingChatRequests(): Promise<ChatRequestListResponse> {
    // Token is automatically added by axios interceptor
    const response = await axiosInstance.get<ChatRequestListResponse>(
      `/chat-requests/pending`
    );
    return response.data;
  },

  async checkChatStatus(otherUserId: number): Promise<{
    chatRequest: ChatRequest | null;
    conversation: Conversation | null;
    blockStatus: BlockStatus;
  }> {
    const response = await axiosInstance.get<{
      chatRequest: ChatRequest | null;
      conversation: Conversation | null;
      blockStatus: BlockStatus;
    }>(`/chat-requests/check?userId=${otherUserId}`);
    return response.data;
  },

  async sendMessage(input: SendMessageInput): Promise<Message> {
    // Token is automatically added by axios interceptor
    const response = await axiosInstance.post<Message>(`/messages`, input);
    return response.data;
  },

  async getMessages(
    conversationId: number,
    query?: MessageQuery
  ): Promise<MessageListResponse> {
    // Token is automatically added by axios interceptor
    const params = new URLSearchParams();
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.offset) params.append("offset", query.offset.toString());

    const response = await axiosInstance.get<MessageListResponse>(
      `/conversations/${conversationId}/messages?${params.toString()}`
    );
    return response.data;
  },

  async getConversations(): Promise<ConversationListResponse> {
    // Token is automatically added by axios interceptor
    const response = await axiosInstance.get<ConversationListResponse>(
      `/conversations`
    );
    return response.data;
  },

  async getConversationById(conversationId: number): Promise<Conversation> {
    // Token is automatically added by axios interceptor
    const response = await axiosInstance.get<Conversation>(
      `/conversations/${conversationId}`
    );
    return response.data;
  },

  async deleteConversation(conversationId: number): Promise<{ message: string }> {
    const response = await axiosInstance.delete<{ message: string }>(
      `/conversations/${conversationId}`
    );
    return response.data;
  },
};
