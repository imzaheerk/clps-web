import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header, showNotification, Button } from "@/components";
import { messagingService } from "@/services/messagingService/messagingService";
import { useAuth } from "@/contexts/AuthContext";
import type { ChatRequest } from "@/services/messagingService/messagingService";

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
      showNotification(
        error.response?.data?.error || "Failed to load chat requests",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId: number, action: "accept" | "reject") => {
    if (processingId) return;

    try {
      setProcessingId(requestId);
      const result = await messagingService.respondToChatRequest({
        requestId,
        action,
      });

      if (action === "accept" && "id" in result && "user1Id" in result) {
        // It's a conversation, navigate to chat
        showNotification("Chat request accepted", "success");
        navigate(`/messaging/chat/${result.id}`);
      } else {
        showNotification(
          action === "accept" ? "Chat request accepted" : "Chat request rejected",
          "success"
        );
        loadRequests();
      }
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || `Failed to ${action} chat request`,
        "error"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const getOtherUser = (request: ChatRequest) => {
    if (request.senderId === user?.id) {
      return request.receiver;
    }
    return request.sender;
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

  const sentRequests = requests.filter((r) => r.senderId === user?.id);
  const receivedRequests = requests.filter((r) => r.receiverId === user?.id);

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col">
      <Header showAuthButtons={false} />

      <div className="flex-1 max-w-[1000px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/messaging")}
              className="mb-4 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-hover-bg transition-colors"
            >
              <i className="pi pi-arrow-left text-xl"></i>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              Chat Requests
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
          </div>
        ) : (
          <>
            {/* Pending Requests (Received) */}
            {pendingRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Pending Requests ({pendingRequests.length})
                </h2>
                <div className="space-y-2">
                  {pendingRequests.map((request) => {
                    const otherUser = getOtherUser(request);
                    return (
                      <div
                        key={request.id}
                        className="bg-bg-primary rounded-lg border border-primary p-4"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <i className="pi pi-user text-primary text-xl"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-text-primary mb-1 truncate">
                              {otherUser.name || `User ${otherUser.id}`}
                            </h3>
                            <p className="text-xs text-text-tertiary m-0">
                              Sent {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            label="Accept"
                            icon="pi pi-check"
                            onClick={() => handleRespond(request.id, "accept")}
                            variant="gradient"
                            Size="small"
                            disabled={processingId === request.id}
                            className="flex-1"
                          />
                          <Button
                            label="Reject"
                            icon="pi pi-times"
                            onClick={() => handleRespond(request.id, "reject")}
                            variant="outlined"
                            Size="small"
                            disabled={processingId === request.id}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sent Requests */}
            {sentRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Sent Requests ({sentRequests.length})
                </h2>
                <div className="space-y-2">
                  {sentRequests.map((request) => {
                    const otherUser = getOtherUser(request);
                    return (
                      <div
                        key={request.id}
                        className={`bg-bg-primary rounded-lg border p-4 ${
                          request.status === "pending"
                            ? "border-border"
                            : request.status === "accepted"
                            ? "border-green-500"
                            : "border-red-500"
                        }`}
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
                              Status:{" "}
                              <span
                                className={`font-medium ${
                                  request.status === "pending"
                                    ? "text-yellow-500"
                                    : request.status === "accepted"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {request.status.charAt(0).toUpperCase() +
                                  request.status.slice(1)}
                              </span>
                              {" • "}
                              {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Received Requests (Non-pending) */}
            {receivedRequests.filter((r) => r.status !== "pending").length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Received Requests
                </h2>
                <div className="space-y-2">
                  {receivedRequests
                    .filter((r) => r.status !== "pending")
                    .map((request) => {
                      const otherUser = getOtherUser(request);
                      return (
                        <div
                          key={request.id}
                          className={`bg-bg-primary rounded-lg border p-4 ${
                            request.status === "accepted"
                              ? "border-green-500"
                              : "border-red-500"
                          }`}
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
                                Status:{" "}
                                <span
                                  className={`font-medium ${
                                    request.status === "accepted"
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {request.status.charAt(0).toUpperCase() +
                                    request.status.slice(1)}
                                </span>
                                {" • "}
                                {formatDate(request.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {requests.length === 0 && (
              <div className="bg-bg-primary rounded-xl border border-border p-12 text-center">
                <i className="pi pi-user-plus text-5xl text-text-tertiary mb-4 block"></i>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  No chat requests
                </h3>
                <p className="text-text-secondary text-sm m-0">
                  You don't have any chat requests yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
