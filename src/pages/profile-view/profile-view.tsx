import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, showNotification, Button, NetworkBackground } from "@/components";
import { profileService } from "@/services/profileService/profileService";
import { ChatRequest, Conversation, messagingService } from "@/services/messagingService/messagingService";
import { UserOutput } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { numberRevealService } from "@/services/numberRevealService/numberRevealService";

export default function ProfileView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [withdrawingRequest, setWithdrawingRequest] = useState(false);
  const [loadingChatStatus, setLoadingChatStatus] = useState(false);
  const [chatRequest, setChatRequest] = useState<ChatRequest | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const hasLoadedRef = useRef(false);
  const [numberRevealStatus, setNumberRevealStatus] = useState<"none" | "pending" | "accepted" | "rejected">("none");
  const [requestingNumberReveal, setRequestingNumberReveal] = useState(false);

  const loadChatStatus = useCallback(async () => {
    if (!user?.id || !profile?.id || user.id === profile.id) return;

    try {
      setLoadingChatStatus(true);
      const status = await messagingService.checkChatStatus(profile.id);
      setChatRequest(status.chatRequest);
      setConversation(status.conversation);
    } catch (error) {
      // Silently fail - chat status is not critical
      console.error("Failed to load chat status:", error);
    } finally {
      setLoadingChatStatus(false);
    }
  }, [user?.id, profile?.id]);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    const loadProfile = async () => {
      if (!id) {
        showNotification("Invalid profile ID", "error");
        navigate("/search");
        return;
      }

      hasLoadedRef.current = true;
      setLoading(true);
      try {
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
          throw new Error("Invalid user ID");
        }
        const viewerId = user?.id;
        const userProfile = await profileService.getProfile(userId, viewerId);
        setProfile(userProfile);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to load profile. Please try again.";
        showNotification(errorMessage, "error");
        navigate("/search");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    return () => {
      hasLoadedRef.current = false;
    };
  }, [id, navigate, user]);

  useEffect(() => {
    if (profile?.id && user?.id && profile.id !== user.id) {
      loadChatStatus();
    }
  }, [profile?.id, user?.id, loadChatStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
        {/* Network Background - Global Internet Network Visualization */}
        <NetworkBackground />
        
        <Header showAuthButtons={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="pi pi-spin pi-spinner text-5xl text-primary mb-4 block"></i>
            <p className="text-text-secondary">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
        {/* Network Background - Global Internet Network Visualization */}
        <NetworkBackground />
        
        <Header showAuthButtons={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-24 h-24 bg-bg-primary rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/20">
              <i className="pi pi-user text-4xl text-text-tertiary"></i>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              Profile not found
            </h3>
            <p className="text-text-secondary mb-6">
              The profile you're looking for doesn't exist or has been removed.
            </p>
            <Button
              label="Go Back"
              icon="pi pi-arrow-left"
              onClick={() => navigate(-1)}
              variant="gradient"
              Size="large"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
      {/* Network Background - Global Internet Network Visualization */}
      <NetworkBackground />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Header showAuthButtons={false} />

      <div className="flex-1 max-w-[1000px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 sm:gap-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition-all duration-300 self-start group px-4 py-2 rounded-xl hover:bg-bg-primary/50"
        >
          <i className="pi pi-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          <span className="font-medium">Back</span>
        </button>

        {/* Profile Header Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-cyan-500/10 to-emerald-500/10 opacity-50"></div>
            <div className="relative p-8 sm:p-10 lg:p-12">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-cyan-600 to-cyan-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-2xl border-4 border-white/20">
                    <span className="text-white font-black text-5xl">
                      {(profile.name || "U")[0].toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-3 bg-gradient-to-r from-primary via-cyan-600 to-cyan-600 bg-clip-text text-transparent">
                  {profile.name || "Unknown"}
                </h1>
                
                {/* Chat Request Button */}
                {user?.id && profile.id && user.id !== profile.id && (
                  <div className="mt-6 flex flex-col items-center gap-2">
                    {conversation || chatRequest?.status === "accepted" ? (
                      <Button
                        label="Connect"
                        icon="pi pi-comments"
                        onClick={async () => {
                          try {
                            let conv = conversation;
                            if (!conv) {
                              const conversationsResponse = await messagingService.getConversations();
                              conv = conversationsResponse.conversations.find(
                                (c) =>
                                  (c.user1Id === user.id && c.user2Id === profile.id) ||
                                  (c.user2Id === user.id && c.user1Id === profile.id)
                              ) || null;
                            }
                            if (conv) {
                              navigate(`/messaging/chat/${conv.id}`);
                            }
                          } catch (error: any) {
                            showNotification(
                              error.response?.data?.error || "Failed to open chat",
                              "error"
                            );
                          }
                        }}
                        variant="gradient"
                        Size="large"
                      />
                    ) : chatRequest?.status === "pending" && chatRequest.senderId === user.id ? (
                      <>
                        <Button
                          label={withdrawingRequest ? "Withdrawing..." : "Withdraw request"}
                          icon={withdrawingRequest ? "pi pi-spin pi-spinner" : "pi pi-times"}
                          onClick={async () => {
                            if (!chatRequest?.id || withdrawingRequest) return;
                            try {
                              setWithdrawingRequest(true);
                              await messagingService.respondToChatRequest({ requestId: chatRequest.id, action: "withdraw" });
                              await loadChatStatus();
                              showNotification("Request withdrawn. You can send again tomorrow.", "success");
                            } catch (error: any) {
                              showNotification(
                                error.response?.data?.message || "Failed to withdraw request",
                                "error"
                              );
                            } finally {
                              setWithdrawingRequest(false);
                            }
                          }}
                          disabled={withdrawingRequest || loadingChatStatus}
                          variant="secondary"
                          Size="large"
                        />
                        <p className="text-text-secondary text-sm text-center max-w-xs">
                          Request sent. They haven&apos;t accepted yet. You can withdraw and send again tomorrow.
                        </p>
                      </>
                    ) : chatRequest?.status === "pending" ? (
                      <div className="flex items-center gap-3 px-8 py-4 bg-bg-secondary/80 backdrop-blur-sm border-2 border-warning/30 rounded-2xl">
                        <i className="pi pi-clock text-warning text-xl"></i>
                        <span className="text-warning font-semibold text-lg">Request Pending</span>
                      </div>
                    ) : chatRequest?.status === "withdrawn" && chatRequest.senderId === user.id ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3 px-6 py-4 bg-bg-secondary/80 backdrop-blur-sm border-2 border-primary/30 rounded-2xl">
                          <i className="pi pi-info-circle text-primary text-xl"></i>
                          <span className="text-text-primary font-semibold">Once withdrawn, you can send again by tomorrow.</span>
                        </div>
                        <p className="text-text-secondary text-sm text-center max-w-xs">
                          Send chat request will be available again tomorrow.
                        </p>
                      </div>
                    ) : (
                      <>
                        <Button
                          label={sendingRequest ? "Sending..." : "Send chat request"}
                          icon={sendingRequest ? "pi pi-spin pi-spinner" : "pi pi-user-plus"}
                          onClick={async () => {
                            if (!profile?.id || sendingRequest) return;
                            try {
                              setSendingRequest(true);
                              await messagingService.sendChatRequest({ receiverId: profile.id });
                              await loadChatStatus();
                              showNotification("Chat request sent", "success");
                            } catch (error: any) {
                              const msg = error.response?.data?.message || error.response?.data?.error || "";
                              if (error.response?.status === 400 && /already accepted|already connected/i.test(msg)) {
                                await loadChatStatus();
                                showNotification("You're already connected", "success");
                              } else {
                                showNotification(msg || "Failed to send chat request", "error");
                              }
                            } finally {
                              setSendingRequest(false);
                            }
                          }}
                          disabled={sendingRequest || loadingChatStatus}
                          variant="gradient"
                          Size="large"
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Card - show when own profile, fully_visible, or accepted reveal (full number) */}
        {(() => {
          const isOwnProfile = user?.id === profile?.id;
          const numberLooksMasked = (profile.mobileNumber || "").includes("x") || profile.numberVisibility === "masked";
          const hasPermissionToSeeInfo =
            isOwnProfile ||
            profile.numberVisibility === "fully_visible" ||
            (profile.numberVisibility === "masked" && /^\d{10}$/.test(profile.mobileNumber || ""));
          const isMaskedNoPermission =
            user?.id &&
            profile?.id &&
            user.id !== profile.id &&
            numberLooksMasked &&
            !hasPermissionToSeeInfo;

          if (isMaskedNoPermission) {
            const canAskAgain = numberRevealStatus === "none" || numberRevealStatus === "accepted";
            return (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-cyan-500/5 to-cyan-500/5 opacity-50"></div>
                  <div className="relative p-6 sm:p-8 lg:p-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-lg">
                        <i className="pi pi-phone text-white text-xl"></i>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-text-primary bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                        Contact Information
                      </h2>
                    </div>
                    <div className="p-6 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl border border-white/10">
                      {numberRevealStatus === "pending" ? (
                        <div className="flex items-center gap-3 py-2">
                          <i className="pi pi-clock text-warning text-xl"></i>
                          <span className="text-warning font-semibold">Request sent. Waiting for approval.</span>
                        </div>
                      ) : canAskAgain ? (
                        <Button
                          label={
                            numberRevealStatus === "accepted"
                              ? "Ask again to see number"
                              : "Request to see number"
                          }
                          icon={requestingNumberReveal ? "pi pi-spin pi-spinner" : "pi pi-eye"}
                          onClick={async () => {
                            if (!profile?.id || requestingNumberReveal) return;
                            try {
                              setRequestingNumberReveal(true);
                              await numberRevealService.requestNumberReveal(profile.id);
                              setNumberRevealStatus("pending");
                              showNotification("Request sent. They can allow permanently or reject.", "success");
                            } catch (error: any) {
                              showNotification(
                                error.response?.data?.message || "Failed to send request",
                                "error"
                              );
                            } finally {
                              setRequestingNumberReveal(false);
                            }
                          }}
                          disabled={requestingNumberReveal}
                          variant="gradient"
                          Size="large"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (!hasPermissionToSeeInfo) return null;

          return (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-cyan-500/5 to-cyan-500/5 opacity-50"></div>
            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-lg">
                  <i className="pi pi-phone text-white text-xl"></i>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-text-primary bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Mobile Number */}
                <div className="p-6 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg">
                      <i className="pi pi-phone text-white text-lg"></i>
                    </div>
                    <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide m-0">Mobile Number</p>
                  </div>
                  <p className="text-lg font-bold text-text-primary m-0">
                    {profile.mobileNumber}
                  </p>
                </div>

                {/* Location */}
                {(profile.area || profile.city || profile.state) && (
                  <div className="p-6 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg">
                        <i className="pi pi-map-marker text-white text-lg"></i>
                      </div>
                      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide m-0">Address</p>
                    </div>
                    <p className="text-lg font-bold text-text-primary m-0">
                      {[profile.area, profile.city, profile.state]
                        .filter(Boolean)
                        .join(", ")}
                      {profile.pincode && ` - ${profile.pincode}`}
                    </p>
                  </div>
                )}

                {/* Country */}
                {profile.country && (
                  <div className="p-6 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg">
                        <i className="pi pi-globe text-white text-lg"></i>
                      </div>
                      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide m-0">Country</p>
                    </div>
                    <p className="text-lg font-bold text-text-primary m-0">
                      {profile.country}
                    </p>
                  </div>
                )}

                {/* Pincode */}
                {profile.pincode && (
                  <div className="p-6 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg">
                        <i className="pi pi-map text-white text-lg"></i>
                      </div>
                      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide m-0">Pincode</p>
                    </div>
                    <p className="text-lg font-bold text-text-primary m-0">
                      {profile.pincode}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
          ); })()}
      </div>
    </div>
  );
}
