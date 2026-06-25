import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout, PageHeader, showNotification, EmptyState, LoadingState } from "@/components";
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
      showNotification(error.response?.data?.error || "Failed to load conversations", "error");
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (conversation: Conversation) =>
    conversation.user1Id === user?.id ? conversation.user2 : conversation.user1;

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
    <PageLayout maxWidth="md">
      <PageHeader
        icon="pi pi-comments"
        title="Messages"
        description="Your active conversations"
        action={
          <button type="button" className="resend-btn resend-btn-primary" onClick={() => navigate("/messaging/requests")}>
            <i className="pi pi-user-plus" />
            <span className="hidden sm:inline">Requests</span>
          </button>
        }
      />

      {loading ? (
        <LoadingState message="Loading conversations…" />
      ) : conversations.length === 0 ? (
        <EmptyState
          icon="pi pi-comments"
          title="No conversations yet"
          description="Send a chat request to someone to start messaging."
          action={{ label: "Find people", onClick: () => navigate("/search"), icon: "pi pi-search" }}
        />
      ) : (
        <div className="app-tip-list">
          {conversations.map((conversation) => {
            const otherUser = getOtherUser(conversation);
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => navigate(`/messaging/chat/${conversation.id}`)}
                className="app-tip-row"
              >
                <span className="header-app-avatar">{otherUser?.name?.[0]?.toUpperCase() || "?"}</span>
                <span className="app-tip-text text-left">
                  <span className="block font-medium text-text-primary">{otherUser?.name || "Unknown"}</span>
                  <span className="block text-xs text-text-secondary mt-0.5">
                    {conversation.updatedAt ? formatDate(conversation.updatedAt) : "No messages yet"}
                  </span>
                </span>
                <i className="pi pi-arrow-right app-tip-arrow" />
              </button>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
