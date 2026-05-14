import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { Header, showNotification } from "@/components";

import { messagingService } from "@/services/messagingService/messagingService";
import { useAuth } from "@/contexts/AuthContext";
import type { Conversation } from "@/services/messagingService/messagingService";

export default function Conversations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    loadConversations();
  }, [user, navigate]);

  const loadConversations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await messagingService.getConversations();
      setConversations(response.conversations);
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || "Failed to load conversations",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (conversation: Conversation) => {
    if (conversation.user1Id === user?.id) {
      return conversation.user2;
    }
    return conversation.user1;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col">
      <Header showAuthButtons={false} />

      <div className="flex-1 max-w-[1000px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
            Messages
          </h1>
          <button
            onClick={() => navigate("/messaging/requests")}
            className="px-4 py-2.5 bg-gradient-to-r from-primary to-cyan-600 text-white rounded-xl hover:opacity-95 hover:shadow-lg transition-all text-sm font-semibold shadow-md border border-primary/20"
          >
            <i className="pi pi-user-plus mr-2"></i>
            Chat Requests
          </button>
        </div>

        {/* Conversations List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-bg-primary rounded-2xl border border-border p-12 text-center shadow-lg">
            <i className="pi pi-comments text-5xl text-text-tertiary mb-4 block"></i>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No conversations
            </h3>
            <p className="text-text-secondary text-sm m-0">
              Start a conversation by sending a chat request to someone.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);
              return (
                <div
                  key={conversation.id}
                  onClick={() => navigate(`/messaging/chat/${conversation.id}`)}
                  className="bg-bg-primary rounded-xl border border-border p-4 transition-all cursor-pointer hover:border-primary/50 hover:bg-hover-bg shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <i className="pi pi-user text-primary text-xl"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-text-primary mb-1 truncate">
                        {otherUser.name || `User ${otherUser.id}`}
                      </h3>
                      <p className="text-xs text-text-tertiary m-0">
                        Last updated {formatDate(conversation.updatedAt)}
                      </p>
                    </div>
                    <i className="pi pi-chevron-right text-text-tertiary"></i>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
