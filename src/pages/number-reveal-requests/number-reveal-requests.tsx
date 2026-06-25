import { useState, useEffect, useCallback } from "react";
import { PageLayout, PageHeader, showNotification, Button, LoadingState, EmptyState } from "@/components";
import { numberRevealService, type NumberRevealRequestOutput } from "@/services/numberRevealService/numberRevealService";
import { useAuth } from "@/contexts/AuthContext";

export default function NumberRevealRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<NumberRevealRequestOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<number | null>(null);

  const loadRequests = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await numberRevealService.getMyNumberRevealRequests();
      setRequests(data);
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "Failed to load number reveal requests",
        "error"
      );
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleRespond = useCallback(
    async (requestId: number, accept: boolean) => {
      try {
        setRespondingId(requestId);
        await numberRevealService.respondToRequest(requestId, accept);
        showNotification(
          accept ? "They can see your number permanently." : "Request rejected.",
          "success"
        );
        await loadRequests();
      } catch (error: any) {
        showNotification(
          error.response?.data?.message || "Failed to respond",
          "error"
        );
      } finally {
        setRespondingId(null);
      }
    },
    [loadRequests]
  );

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

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const otherRequests = requests.filter((r) => r.status !== "pending");

  return (
    <PageLayout maxWidth="md">
      <PageHeader
        icon="pi pi-eye"
        title="Number reveal requests"
        description="People who want to see your phone number. Allow permanently or reject."
      />

      {loading ? (
        <LoadingState message="Loading requests…" />
      ) : requests.length === 0 ? (
        <EmptyState
          icon="pi pi-eye-slash"
          title="No requests"
          description="When someone requests your number, it will appear here."
        />
      ) : (
        <div className="flex flex-col gap-5">
          {pendingRequests.length > 0 ? (
            <section className="app-panel">
              <h2 className="app-panel-title mb-4">
                <i className="pi pi-clock" />
                Pending ({pendingRequests.length})
              </h2>
              <div className="app-tip-list">
                {pendingRequests.map((req) => {
                  const isResponding = respondingId === req.id;
                  return (
                    <div key={req.id} className="app-list-card app-list-card--highlight">
                      <div className="app-list-card-main">
                        <div className="flex items-center gap-3">
                          <span className="header-app-avatar">
                            {(req.requesterName || "U")[0].toUpperCase()}
                          </span>
                          <div>
                            <p className="app-list-card-title m-0">
                              {req.requesterName || `User ${req.requesterId}`}
                            </p>
                            <p className="app-list-card-meta m-0">
                              Wants to see your number · {formatDate(req.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="app-list-card-actions">
                        <Button
                          label="Reject"
                          icon={isResponding ? "pi pi-spin pi-spinner" : "pi pi-times"}
                          onClick={() => handleRespond(req.id, false)}
                          disabled={isResponding}
                          variant="outlined"
                          Size="small"
                          className="!border-red-500 !text-red-500 hover:!bg-red-500/10"
                        />
                        <Button
                          label="Allow"
                          icon={isResponding ? "pi pi-spin pi-spinner" : "pi pi-check"}
                          onClick={() => handleRespond(req.id, true)}
                          disabled={isResponding}
                          variant="primary"
                          Size="small"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          {otherRequests.length > 0 ? (
            <section className="app-panel">
              <h2 className="app-panel-title mb-4">Past requests</h2>
              <div className="app-tip-list">
                {otherRequests.map((req) => (
                  <div key={req.id} className="app-list-card">
                    <div className="app-list-card-main">
                      <div className="flex items-center gap-3">
                        <span className="header-app-avatar">
                          {(req.requesterName || "U")[0].toUpperCase()}
                        </span>
                        <div>
                          <p className="app-list-card-title m-0">
                            {req.requesterName || `User ${req.requesterId}`}
                          </p>
                          <p className="app-list-card-meta m-0">
                            {req.status === "accepted" ? "Can see your number" : "Rejected"} ·{" "}
                            {formatDate(req.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </PageLayout>
  );
}
