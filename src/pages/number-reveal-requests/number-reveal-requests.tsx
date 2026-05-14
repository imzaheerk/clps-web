import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header, showNotification, Button, NetworkBackground } from "@/components";
import { numberRevealService, type NumberRevealRequestOutput } from "@/services/numberRevealService/numberRevealService";
import { useAuth } from "@/contexts/AuthContext";

export default function NumberRevealRequests() {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
      <NetworkBackground />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <Header showAuthButtons={false} />

      <div className="flex-1 max-w-[900px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition-all duration-300 self-start px-4 py-2 rounded-xl hover:bg-bg-primary/50"
        >
          <i className="pi pi-arrow-left"></i>
          <span className="font-medium">Back</span>
        </button>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-cyan-500/10 to-cyan-500/10 opacity-50"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-lg">
                  <i className="pi pi-eye text-white text-xl"></i>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-text-primary bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                    Number reveal requests
                  </h1>
                  <p className="text-text-secondary text-sm mt-1">
                    People who want to see your phone number. Allow permanently or reject.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="inline-flex p-6 bg-primary/10 rounded-3xl mb-4">
                    <i className="pi pi-eye-slash text-4xl text-primary"></i>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">No number reveal requests</h3>
                  <p className="text-text-secondary">When someone requests to see your number, they’ll show up here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingRequests.length > 0 && (
                    <div>
                      <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                        <i className="pi pi-clock text-warning"></i>
                        Pending ({pendingRequests.length})
                      </h2>
                      <div className="space-y-4">
                        {pendingRequests.map((req) => {
                          const isResponding = respondingId === req.id;
                          return (
                            <div
                              key={req.id}
                              className="p-5 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl border-2 border-primary/30 hover:border-primary/50 transition-all duration-300"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold">
                                      {(req.requesterName || "U")[0].toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-bold text-text-primary">
                                      {req.requesterName || `User ${req.requesterId}`}
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                      Wants to see your number · {formatDate(req.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <Button
                                    label="Reject"
                                    icon={isResponding ? "pi pi-spin pi-spinner" : "pi pi-times"}
                                    onClick={() => handleRespond(req.id, false)}
                                    disabled={isResponding}
                                    variant="outlined"
                                    Size="small"
                                    className="!border-red-500/50 !text-red-500 hover:!bg-red-500/10"
                                  />
                                  <Button
                                    label="Allow permanently"
                                    icon={isResponding ? "pi pi-spin pi-spinner" : "pi pi-check"}
                                    onClick={() => handleRespond(req.id, true)}
                                    disabled={isResponding}
                                    variant="gradient"
                                    Size="small"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {otherRequests.length > 0 && (
                    <div>
                      <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                        <i className="pi pi-list"></i>
                        Past requests
                      </h2>
                      <div className="space-y-3">
                        {otherRequests.map((req) => (
                          <div
                            key={req.id}
                            className="p-4 bg-bg-secondary/30 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-cyan-600/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-primary font-bold text-sm">
                                  {(req.requesterName || "U")[0].toUpperCase()}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-text-primary truncate">
                                  {req.requesterName || `User ${req.requesterId}`}
                                </p>
                                <p className="text-xs text-text-secondary">
                                  {req.status === "accepted" ? "Can see your number" : "Rejected"}
                                  {" · "}
                                  {formatDate(req.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
