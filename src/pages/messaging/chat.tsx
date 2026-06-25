import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Header, showNotification, AppBackground, ChatSafetyMenu } from "@/components";
import ResendModal from "@/components/ResendModal";
import { messagingService } from "@/services/messagingService/messagingService";
import { websocketService } from "@/services/messagingService/websocketService";
import { useAuth } from "@/contexts/AuthContext";

import type { Message, Conversation } from "@/services/messagingService/messagingService";
import type { BlockStatus } from "@/services/chatSafetyService/chatSafetyService";
import { chatSafetyService } from "@/services/chatSafetyService/chatSafetyService";

export default function Chat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showUnfriendModal, setShowUnfriendModal] = useState(false);
  const [blockStatus, setBlockStatus] = useState<BlockStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    if (!user?.id) return;

    try {
      setLoadingConversations(true);
      const response = await messagingService.getConversations();
      const sorted = response.conversations.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setConversations(sorted);
    } catch (error: any) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    loadConversations();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !conversationId) {
      navigate("/messaging");
      return;
    }

    loadConversation();
    loadMessages();

    const convId = parseInt(conversationId);

    // Listen for new messages via WebSocket
    const unsubscribe = websocketService.on("new_message", (data) => {
      if (data.conversationId === convId && data.message) {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === data.message.id);
          if (exists) return prev;
          return [...prev, data.message];
        });
        scrollToBottom();
      }
    });

    const unsubscribeSubscribed = websocketService.on("subscribed", () => {});

    // Connect to WebSocket if needed
    if (!websocketService.isConnected()) {
      if (token) {
        websocketService.connect(token);
      } else {
        console.error("⚠️ Cannot connect WebSocket: No token available");
      }
    }

    websocketService.subscribe(convId);

    return () => {
      websocketService.unsubscribe(convId);
      unsubscribe();
      unsubscribeSubscribed();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, conversationId, navigate, token]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // Prevent body scroll on this page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const loadConversation = async () => {
    if (!conversationId) return;

    try {
      const conv = await messagingService.getConversationById(parseInt(conversationId));
      setConversation(conv);
      const otherId = conv.user1Id === user?.id ? conv.user2Id : conv.user1Id;
      const status = await chatSafetyService.getBlockStatus(otherId);
      setBlockStatus(status);
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || "Failed to load conversation",
        "error"
      );

      navigate("/messaging");
    }
  };

  const loadMessages = async () => {
    if (!conversationId) return;

    try {

      setLoading(true);


      const response = await messagingService.getMessages(parseInt(conversationId), {
        limit: 100,
        offset: 0,
      });
      setMessages(response.messages);
    } catch (error: any) {

      showNotification(
        error.response?.data?.error || "Failed to load messages",
        "error"
      );

      // Silently fail for polling
      if (!loading) {
        showNotification(
          error.response?.data?.error || "Failed to load messages",
          "error"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || sending) return;

    try {
      setSending(true);
      const message = await messagingService.sendMessage({
        conversationId: parseInt(conversationId),
        content: newMessage.trim(),
      });


      // Message will be added via WebSocket broadcast, but add it immediately for better UX

      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
      setNewMessage("");
      scrollToBottom();

      loadConversations();


    } catch (error: any) {
      showNotification(
        error.response?.data?.error || "Failed to send message",
        "error"
      );
    } finally {
      setSending(false);
    }
  };


  const handleUnfriend = async () => {
    if (!conversationId || deleting) return;

    try {
      setDeleting(true);
      await messagingService.deleteConversation(parseInt(conversationId));
      showNotification("User unfriended successfully", "success");
      loadConversations();
      setShowUnfriendModal(false);
      navigate("/messaging");
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || "Failed to unfriend user",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const getOtherUser = () => {
    if (!conversation || !user) return null;
    if (conversation.user1Id === user.id) {
      return conversation.user2;
    }
    return conversation.user1;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

  const getOtherUserFromConversation = (conv: Conversation) => {
    if (!user) return null;
    if (conv.user1Id === user.id) {
      return conv.user2;
    }
    return conv.user1;
  };

  const otherUser = getOtherUser();
  const isMessagingBlocked = blockStatus?.isBlocked ?? false;

  return (
    <div className="app-resend h-screen flex flex-col relative overflow-hidden">
      <AppBackground />
      <div className="app-resend-content flex flex-col flex-1 min-h-0">
      <Header showAuthButtons={false} />

      <div className="app-chat-layout">
        <div className={`app-chat-sidebar ${conversationId ? "hidden md:flex" : "flex"}`}>
          <div className="app-chat-sidebar-head">
            <div className="flex items-center gap-3 mb-3">
              <button type="button" onClick={() => navigate("/messaging")} className="header-app-icon-btn md:hidden" aria-label="Back">
                <i className="pi pi-arrow-left" />
              </button>
              <h2 className="text-base font-semibold text-text-primary m-0">Messages</h2>
            </div>
            <div className="app-chat-tabs">
              <button type="button" className="app-chat-tab is-active">
                <i className="pi pi-comments mr-1" />
                Chats
              </button>
              <button type="button" className="app-chat-tab" onClick={() => navigate("/messaging/requests")}>
                <i className="pi pi-user-plus mr-1" />
                Requests
              </button>
            </div>
          </div>

          {/* Member List - Fixed (No Scrolling) */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {loadingConversations ? (
              <div className="flex items-center justify-center h-full p-8">
                <i className="pi pi-spin pi-spinner text-3xl text-primary"></i>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/30">
                  <i className="pi pi-comments text-2xl text-primary"></i>
                </div>
                <p className="text-sm text-text-secondary mb-2">No conversations yet</p>
                <p className="text-xs text-text-tertiary">
                  Start chatting by accepting a request
                </p>
              </div>
            ) : (
              <div className="p-2">
                {conversations.map((conv) => {
                  const otherUser = getOtherUserFromConversation(conv);
                  const isActive = conversationId && parseInt(conversationId) === conv.id;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => navigate(`/messaging/chat/${conv.id}`)}
                      className={`app-chat-conv-item ${isActive ? "is-active" : ""}`}
                    >
                      <span className="header-app-avatar">{(otherUser?.name || "U")[0].toUpperCase()}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-text-primary truncate m-0 mb-0.5">
                          {otherUser?.name || `User ${otherUser?.id}`}
                        </h3>
                        <p className="text-xs text-text-secondary m-0">{formatDate(conv.updatedAt)}</p>
                      </div>
                      {isActive ? <i className="pi pi-check-circle text-[#ff6000]" /> : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Chat Interface - Separate Section */}
        <div className={`app-chat-main ${conversationId ? "flex" : "hidden md:flex"}`}>
          {!conversationId || !conversation ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-primary/30">
                  <i className="pi pi-comments text-4xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  Select a conversation
                </h3>
                <p className="text-text-secondary">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header - Fixed (Member Name + Auto-delete Message) - Does NOT Scroll */}
              <div className="app-chat-header-bar">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => navigate("/messaging")} className="header-app-icon-btn md:hidden" aria-label="Back to list">
                    <i className="pi pi-arrow-left" />
                  </button>
                  <span className="header-app-avatar">{(otherUser?.name || "U")[0].toUpperCase()}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-text-primary truncate m-0">{otherUser?.name || `User ${otherUser?.id}`}</h2>
                    <p className="text-xs text-text-secondary m-0">Messages auto-delete after 24 hours</p>
                  </div>
                  {otherUser ? (
                    <ChatSafetyMenu
                      otherUserId={otherUser.id}
                      otherUserName={otherUser.name}
                      conversationId={parseInt(conversationId)}
                      blockStatus={blockStatus}
                      onBlockStatusChange={setBlockStatus}
                      showUnfriend
                      onUnfriend={() => setShowUnfriendModal(true)}
                      unfriendLoading={deleting}
                    />
                  ) : null}
                </div>
              </div>

              {blockStatus?.isBlocked ? (
                <div className="app-safety-banner">
                  <i className="pi pi-shield" />
                  <span>
                    {blockStatus.blockedByMe
                      ? "You've blocked this user. Unblock them from the menu to send messages."
                      : "You can't message this user."}
                  </span>
                </div>
              ) : (
                <div className="app-safety-reminder">
                  <i className="pi pi-eye-slash" />
                  <span>Share your phone number only when you trust someone. Use number reveal requests for extra privacy.</span>
                </div>
              )}

              <div className="app-chat-messages">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <i className="pi pi-spin pi-spinner text-5xl text-primary mb-4"></i>
                      <p className="text-text-secondary">Loading messages...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-md">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-primary/30">
                        <i className="pi pi-comments text-4xl text-primary"></i>
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">
                        No messages yet
                      </h3>
                      <p className="text-text-secondary">
                        Start the conversation by sending your first message!
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwn = message.senderId === user?.id;
                    return (
                      <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`app-chat-bubble ${isOwn ? "app-chat-bubble--mine" : "app-chat-bubble--theirs"}`}>
                          <p className="m-0 mb-1 whitespace-pre-wrap break-words">{message.content}</p>
                          <p className="text-[0.65rem] m-0 opacity-70">{formatTime(message.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - Fixed at Bottom */}
              <div className="app-chat-compose">
                {isMessagingBlocked ? (
                  <p className="app-safety-compose-disabled m-0 text-center text-sm text-text-secondary">
                    Messaging is disabled for this conversation.
                  </p>
                ) : (
                <form onSubmit={handleSendMessage}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message…"
                      className="auth-resend-input flex-1 min-w-0"
                      disabled={sending}
                      maxLength={5000}
                    />
                    <button type="submit" disabled={!newMessage.trim() || sending} className="resend-btn resend-btn-primary">
                      {sending ? <i className="pi pi-spin pi-spinner" /> : <i className="pi pi-send" />}
                    </button>
                  </div>
                </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <ResendModal
        visible={showUnfriendModal}
        onHide={() => !deleting && setShowUnfriendModal(false)}
        title="Unfriend user"
        description={
          <>
            Are you sure you want to unfriend{" "}
            <strong className="text-text-primary">{otherUser?.name || "this user"}</strong>?
          </>
        }
        icon="pi-exclamation-triangle"
        tone="danger"
        footer={
          <div className="resend-modal-actions-row">
            <button
              type="button"
              className="resend-btn resend-btn-secondary"
              onClick={() => setShowUnfriendModal(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="resend-btn resend-btn-danger"
              onClick={handleUnfriend}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <i className="pi pi-spin pi-spinner" />
                  Unfriending…
                </>
              ) : (
                "Yes, unfriend"
              )}
            </button>
          </div>
        }
      >
        <div className="resend-modal-alert">
          <p className="resend-modal-alert-title">Warning</p>
          <p className="resend-modal-alert-copy">
            This will delete the entire conversation and all messages. This cannot be undone.
          </p>
        </div>
      </ResendModal>
      </div>
    </div>
  );
}
