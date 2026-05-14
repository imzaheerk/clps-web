import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Header, showNotification, NetworkBackground, Button } from "@/components";
import { messagingService } from "@/services/messagingService/messagingService";
import { websocketService } from "@/services/messagingService/websocketService";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog } from "primereact/dialog";

import type { Message, Conversation } from "@/services/messagingService/messagingService";

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

  return (
    <div className="h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
      {/* Network Background - Global Internet Network Visualization */}
      <NetworkBackground />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Header showAuthButtons={false} />

      <div className="flex-1 flex h-[calc(100vh-4rem)] relative z-10 overflow-hidden max-h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Member List - Fixed, Hidden on mobile when chat is open */}
        <div className={`${conversationId ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 border-r border-white/10 bg-bg-primary/50 backdrop-blur-xl flex-col flex-shrink-0 overflow-hidden`}>
          {/* Sidebar Header - Fixed */}
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate("/messaging")}
                className="p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-bg-secondary/50 transition-all duration-300 md:hidden"
              >
                <i className="pi pi-arrow-left text-lg"></i>
              </button>
              <div className="p-2 bg-gradient-to-br from-primary to-cyan-600 rounded-xl shadow-lg">
                <i className="pi pi-comments text-white text-lg"></i>
              </div>
              <h2 className="text-xl font-bold text-text-primary">Messages</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-bg-secondary/50 rounded-xl p-1">
              <button
                onClick={() => navigate("/messaging")}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-gradient-to-br from-primary to-cyan-600 text-white shadow-lg"
              >
                <i className="pi pi-comments mr-2"></i>
                Chats
              </button>
              <button
                onClick={() => navigate("/messaging/requests")}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-text-secondary hover:text-text-primary"
              >
                <i className="pi pi-user-plus mr-2"></i>
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
                      className={`p-3 rounded-xl mb-2 cursor-pointer transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-primary/20 to-cyan-600/20 border-2 border-primary/50 shadow-lg"
                          : "bg-bg-secondary/30 hover:bg-bg-secondary/50 border-2 border-transparent hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary to-cyan-600 rounded-full blur-md opacity-30"></div>
                          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                            <span className="text-white font-bold text-sm">
                              {(otherUser?.name || "U")[0].toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-text-primary truncate mb-1">
                            {otherUser?.name || `User ${otherUser?.id}`}
                          </h3>
                          <div className="flex items-center gap-1">
                            <i className="pi pi-clock text-xs text-text-tertiary"></i>
                            <p className="text-xs text-text-secondary m-0">
                              {formatDate(conv.updatedAt)}
                            </p>
                          </div>
                        </div>
                        {isActive && (
                          <i className="pi pi-check-circle text-primary"></i>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Chat Interface - Separate Section */}
        <div className={`${conversationId ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0 overflow-hidden`}>
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
              <div className="relative group border-b border-white/10 bg-bg-primary/70 backdrop-blur-xl flex-shrink-0 z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-500/5 to-cyan-500/5 opacity-50"></div>
                <div className="relative p-4 flex items-center gap-4">
                  <button
                    onClick={() => navigate("/messaging")}
                    className="p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-bg-secondary/50 transition-all duration-300 group md:hidden"
                  >
                    <i className="pi pi-arrow-left text-xl group-hover:-translate-x-1 transition-transform"></i>
                  </button>
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-cyan-600 rounded-full blur-md opacity-30"></div>
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                      <span className="text-white font-bold text-lg">
                        {(otherUser?.name || "U")[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-text-primary truncate mb-1">
                      {otherUser?.name || `User ${otherUser?.id}`}
                    </h2>
                    <div className="flex items-center gap-2">
                      <i className="pi pi-clock text-xs text-text-tertiary"></i>
                      <p className="text-xs text-text-secondary m-0">
                        Messages auto-delete after 24 hours
                      </p>
                    </div>
                  </div>
                  {/* Unfriend Button */}
                  <button
                    onClick={() => setShowUnfriendModal(true)}
                    disabled={deleting}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <i className="pi pi-user-minus"></i>
                    <span className="hidden sm:inline">Unfriend</span>
                  </button>
                </div>
              </div>

              {/* Messages Area - ONLY This Section Scrolls */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 bg-gradient-to-br from-bg-secondary/30 to-bg-tertiary/30 min-h-0 max-h-full">
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
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      >
                        <div className="flex items-end gap-2 max-w-[75%] sm:max-w-[65%]">
                          {!isOwn && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-cyan-600/20 flex items-center justify-center flex-shrink-0 border-2 border-primary/30">
                              <span className="text-primary text-xs font-bold">
                                {(otherUser?.name || "U")[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div
                            className={`rounded-2xl p-4 shadow-lg ${
                              isOwn
                                ? "bg-gradient-to-br from-primary to-cyan-600 text-white"
                                : "bg-bg-primary/80 backdrop-blur-sm border border-white/10 text-text-primary"
                            }`}
                          >
                            <p className="text-sm sm:text-base m-0 mb-2 whitespace-pre-wrap break-words leading-relaxed">
                              {message.content}
                            </p>
                            <div className="flex items-center gap-1">
                              <p
                                className={`text-xs m-0 ${
                                  isOwn ? "text-white/70" : "text-text-tertiary"
                                }`}
                              >
                                {formatTime(message.createdAt)}
                              </p>
                              {isOwn && (
                                <i className="pi pi-check text-xs text-white/70"></i>
                              )}
                            </div>
                          </div>
                          {isOwn && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-cyan-600/20 flex items-center justify-center flex-shrink-0 border-2 border-primary/30">
                              <span className="text-primary text-xs font-bold">
                                {(user?.name || "U")[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - Fixed at Bottom */}
              <div className="relative group border-t border-white/10 bg-bg-primary/70 backdrop-blur-xl flex-shrink-0 z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-500/5 to-cyan-500/5 opacity-50"></div>
                <form
                  onSubmit={handleSendMessage}
                  className="relative p-4"
                >
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full px-5 py-3 bg-bg-secondary/80 backdrop-blur-sm border-2 border-white/10 rounded-2xl text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-all text-sm sm:text-base"
                        disabled={sending}
                        maxLength={5000}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-3 bg-gradient-to-br from-primary to-cyan-600 text-white rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center min-w-[60px] disabled:hover:shadow-none hover:scale-105 active:scale-95"
                    >
                      {sending ? (
                        <i className="pi pi-spin pi-spinner text-lg"></i>
                      ) : (
                        <i className="pi pi-send text-lg"></i>
                      )}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-text-tertiary">
                    <i className="pi pi-info-circle"></i>
                    <p className="m-0">Messages are automatically deleted after 24 hours</p>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Unfriend Confirmation Modal */}
      <Dialog
        visible={showUnfriendModal}
        onHide={() => !deleting && setShowUnfriendModal(false)}
        header={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
              <i className="pi pi-exclamation-triangle text-white"></i>
            </div>
            <span className="text-xl font-bold text-text-primary">Unfriend User</span>
          </div>
        }
        modal
        className="w-11/12 md:w-1/2 lg:w-1/3"
        closable={!deleting}
      >
        <div className="py-4">
          <div className="mb-6">
            <p className="text-text-secondary text-base mb-4">
              Are you sure you want to unfriend <strong className="text-text-primary">{otherUser?.name || "this user"}</strong>?
            </p>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <i className="pi pi-info-circle text-red-500 mt-0.5"></i>
                <div>
                  <p className="text-sm font-semibold text-red-500 mb-1">Warning</p>
                  <p className="text-sm text-text-secondary m-0">
                    This action will automatically delete the entire chat conversation and all messages. This cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              label="Cancel"
              onClick={() => setShowUnfriendModal(false)}
              variant="outlined"
              Size="medium"
              disabled={deleting}
            />
            <Button
              label={deleting ? "Unfriending..." : "Yes, Unfriend"}
              onClick={handleUnfriend}
              loading={deleting}
              variant="primary"
              className="bg-red-500 hover:bg-red-600"
              Size="medium"
              disabled={deleting}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
