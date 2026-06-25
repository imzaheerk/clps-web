import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification, PageLayout, PageHeader, LoadingState, EmptyState, Button } from "@/components";
import { messagingService } from "@/services/messagingService/messagingService";
import { useAuth } from "@/contexts/AuthContext";
import type { ChatRequest } from "@/services/messagingService/messagingService";

function formatDate(dateString: string) {
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
}

function statusPill(status: string) {
  if (status === "pending") return <span className="resend-pill">Pending</span>;
  if (status === "accepted") return <span className="resend-pill resend-pill--success">Accepted</span>;
  return <span className="resend-pill resend-pill--danger">Rejected</span>;
}

export default function ChatRequests() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState<ChatRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ChatRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }
    loadRequests();
  }, [user, navigate]);

  const loadRequests = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [allRequests, pending] = await Promise.all([
        messagingService.getChatRequests(),
        messagingService.getPendingChatRequests(),
      ]);
      setRequests(allRequests.requests);
      setPendingRequests(pending.requests);
    } catch (error: any) {
      showNotification(error.response?.data?.error || "Failed to load chat requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId: number, action: "accept" | "reject") => {
    if (processingId) return;
    try {
      setProcessingId(requestId);
      const result = await messagingService.respondToChatRequest({ requestId, action });
      if (action === "accept" && "id" in result && "user1Id" in result) {
        showNotification("Chat request accepted", "success");
        navigate(`/messaging/chat/${result.id}`);
      } else {
        showNotification(action === "accept" ? "Chat request accepted" : "Chat request rejected", "success");
        loadRequests();
      }
    } catch (error: any) {
      showNotification(error.response?.data?.error || `Failed to ${action} chat request`, "error");
    } finally {
      setProcessingId(null);
    }
  };

  const getOtherUser = (request: ChatRequest) =>
    request.senderId === user?.id ? request.receiver : request.sender;

  const sentRequests = requests.filter((r) => r.senderId === user?.id);
  const receivedHistory = requests.filter((r) => r.receiverId === user?.id && r.status !== "pending");

  const renderRequestRow = (request: ChatRequest, showActions = false) => {
    const otherUser = getOtherUser(request);
    const isProcessing = processingId === request.id;
    return (
      <div key={request.id} className={`app-list-card ${showActions ? "app-list-card--highlight" : ""}`}>
        <div className="app-list-card-main">
          <div className="flex items-center gap-3">
            <span className="header-app-avatar">{(otherUser.name || "U")[0].toUpperCase()}</span>
            <div>
              <p className="app-list-card-title m-0">{otherUser.name || `User ${otherUser.id}`}</p>
              <p className="app-list-card-meta m-0 flex flex-wrap items-center gap-2">
                {statusPill(request.status)}
                <span>{formatDate(request.createdAt)}</span>
              </p>
            </div>
          </div>
        </div>
        {showActions ? (
          <div className="app-list-card-actions">
            <Button
              label="Reject"
              icon={isProcessing ? "pi pi-spin pi-spinner" : "pi pi-times"}
              onClick={() => handleRespond(request.id, "reject")}
              variant="outlined"
              Size="small"
              disabled={isProcessing}
              className="!border-red-500 !text-red-500 hover:!bg-red-500/10"
            />
            <Button
              label="Accept"
              icon={isProcessing ? "pi pi-spin pi-spinner" : "pi pi-check"}
              onClick={() => handleRespond(request.id, "accept")}
              variant="primary"
              Size="small"
              disabled={isProcessing}
            />
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <PageLayout maxWidth="md">
      <PageHeader
        icon="pi pi-user-plus"
        title="Chat requests"
        description="Incoming and sent connection requests"
        action={
          <button type="button" className="resend-btn resend-btn-secondary" onClick={() => navigate("/messaging")}>
            <i className="pi pi-arrow-left" />
            Messages
          </button>
        }
      />

      {loading ? (
        <LoadingState message="Loading requests…" />
      ) : requests.length === 0 ? (
        <EmptyState
          icon="pi pi-user-plus"
          title="No chat requests"
          description="When someone wants to connect, their request will appear here."
          action={{ label: "Find people", onClick: () => navigate("/search"), icon: "pi pi-search" }}
        />
      ) : (
        <div className="app-results-stack">
          {pendingRequests.length > 0 ? (
            <section className="app-panel">
              <h2 className="app-section-title mb-4">
                Pending ({pendingRequests.length})
              </h2>
              <div className="app-tip-list">
                {pendingRequests.map((r) => renderRequestRow(r, true))}
              </div>
            </section>
          ) : null}

          {sentRequests.length > 0 ? (
            <section className="app-panel">
              <h2 className="app-section-title mb-4">Sent ({sentRequests.length})</h2>
              <div className="app-tip-list">{sentRequests.map((r) => renderRequestRow(r))}</div>
            </section>
          ) : null}

          {receivedHistory.length > 0 ? (
            <section className="app-panel">
              <h2 className="app-section-title mb-4">Received history</h2>
              <div className="app-tip-list">{receivedHistory.map((r) => renderRequestRow(r))}</div>
            </section>
          ) : null}
        </div>
      )}
    </PageLayout>
  );
}
