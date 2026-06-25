import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageLayout, showNotification, Button, LoadingState, EmptyState, ChatSafetyMenu } from "@/components";
import { profileService } from "@/services/profileService/profileService";
import { ChatRequest, Conversation, messagingService } from "@/services/messagingService/messagingService";
import { UserOutput } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { numberRevealService } from "@/services/numberRevealService/numberRevealService";
import type { BlockStatus } from "@/services/chatSafetyService/chatSafetyService";

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
  const [blockStatus, setBlockStatus] = useState<BlockStatus | null>(null);

  const loadChatStatus = useCallback(async () => {
    if (!user?.id || !profile?.id || user.id === profile.id) return;

    try {
      setLoadingChatStatus(true);
      const status = await messagingService.checkChatStatus(profile.id);
      setChatRequest(status.chatRequest);
      setConversation(status.conversation);
      setBlockStatus(status.blockStatus);
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
      <PageLayout maxWidth="md">
        <LoadingState message="Loading profile…" />
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout maxWidth="md">
        <EmptyState
          icon="pi pi-user"
          title="Profile not found"
          description="This profile doesn't exist or was removed."
          action={{ label: "Go back", onClick: () => navigate(-1), icon: "pi pi-arrow-left" }}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="md">
      <button type="button" className="resend-btn resend-btn-secondary self-start" onClick={() => navigate(-1)}>
        <i className="pi pi-arrow-left" />
        Back
      </button>

      <section className="app-panel text-center">
        <div className="app-profile-view-head">
          <span className="app-profile-avatar app-profile-avatar--xl mx-auto mb-4">
            {(profile.name || "U")[0].toUpperCase()}
          </span>
          {user?.id && profile.id && user.id !== profile.id ? (
            <ChatSafetyMenu
              otherUserId={profile.id}
              otherUserName={profile.name}
              blockStatus={blockStatus}
              onBlockStatusChange={setBlockStatus}
              className="app-profile-safety-menu"
            />
          ) : null}
        </div>
        <h1 className="app-dash-hero-title mb-4">{profile.name || "Unknown"}</h1>
                {user?.id && profile.id && user.id !== profile.id && (
                  <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
                    {blockStatus?.isBlocked ? (
                      <div className="app-safety-banner w-full">
                        <i className="pi pi-shield" />
                        <span>
                          {blockStatus.blockedByMe
                            ? "You've blocked this user. Unblock them from the menu to connect again."
                            : "You can't contact this user."}
                        </span>
                      </div>
                    ) : conversation || chatRequest?.status === "accepted" ? (
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
                        <p className="text-text-secondary text-sm text-center">
                          Request sent. They haven&apos;t accepted yet. You can withdraw and send again tomorrow.
                        </p>
                      </>
                    ) : chatRequest?.status === "pending" ? (
                      <div className="app-status-banner app-status-banner--warning w-full">
                        <i className="pi pi-clock" />
                        <span>Request pending</span>
                      </div>
                    ) : chatRequest?.status === "withdrawn" && chatRequest.senderId === user.id ? (
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="app-status-banner app-status-banner--info w-full">
                          <i className="pi pi-info-circle" />
                          <span>Once withdrawn, you can send again tomorrow.</span>
                        </div>
                        <p className="text-text-secondary text-sm text-center">
                          Send chat request will be available again tomorrow.
                        </p>
                      </div>
                    ) : (
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
                    )}
                    {!blockStatus?.isBlocked ? (
                      <p className="app-safety-reminder-inline m-0">
                        <i className="pi pi-eye-slash" />
                        Only share your number when you trust someone — use number reveal for privacy.
                      </p>
                    ) : null}
                  </div>
                )}
      </section>

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
              <section className="app-panel">
                <div className="app-panel-head">
                  <h2 className="app-panel-title">
                    <i className="pi pi-phone" />
                    Contact information
                  </h2>
                  <p className="app-panel-copy">This number is hidden until they approve your request.</p>
                </div>
                {numberRevealStatus === "pending" ? (
                  <div className="app-status-banner app-status-banner--warning">
                    <i className="pi pi-clock" />
                    <span>Request sent. Waiting for approval.</span>
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
              </section>
            );
          }

          if (!hasPermissionToSeeInfo) return null;

          return (
            <section className="app-panel">
              <div className="app-panel-head">
                <h2 className="app-panel-title">
                  <i className="pi pi-id-card" />
                  Contact information
                </h2>
              </div>
              <div className="app-form-grid">
                <div className="app-profile-field">
                  <p className="app-profile-field-label">Mobile number</p>
                  <p className="app-profile-field-value">{profile.mobileNumber}</p>
                </div>
                {(profile.area || profile.city || profile.state) && (
                  <div className="app-profile-field">
                    <p className="app-profile-field-label">Address</p>
                    <p className="app-profile-field-value">
                      {[profile.area, profile.city, profile.state].filter(Boolean).join(", ")}
                      {profile.pincode && ` - ${profile.pincode}`}
                    </p>
                  </div>
                )}
                {profile.country && (
                  <div className="app-profile-field">
                    <p className="app-profile-field-label">Country</p>
                    <p className="app-profile-field-value">{profile.country}</p>
                  </div>
                )}
                {profile.pincode && (
                  <div className="app-profile-field">
                    <p className="app-profile-field-label">Pincode</p>
                    <p className="app-profile-field-value">{profile.pincode}</p>
                  </div>
                )}
              </div>
            </section>
          );
        })()}
    </PageLayout>
  );
}
