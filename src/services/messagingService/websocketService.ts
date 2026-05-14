
export interface WebSocketMessage {
  type: "new_message" | "chat_request" | "subscribed" | "unsubscribed" | "pong";
  conversationId?: number;
  message?: any;
  chatRequest?: any;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private token: string | null = null;
  private listeners: Map<string, Set<(data: WebSocketMessage) => void>> = new Map();
  private isConnecting = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    if (this.isConnecting) {
      console.log("WebSocket connection already in progress");
      return;
    }

    if (!token) {
      console.error("WebSocket connection failed: No token provided");
      return;
    }

    this.token = token;
    this.isConnecting = true;

    try {
      // Determine WebSocket URL based on environment
      // In development, Vite proxy handles the connection
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.hostname;
      // Use the same port as the current page (Vite dev server)
      const port = window.location.port || (protocol === "wss:" ? "443" : "80");
      // Vite proxy will forward /api to backend, so we use /api/ws/messaging
      // Use token query parameter for WebSocket authentication
      const wsUrl = `${protocol}//${host}:${port}/api/ws/messaging?token=${encodeURIComponent(token)}`;

      console.log("Connecting to WebSocket:", wsUrl.replace(token, "***"));
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log("📥 WebSocket message received:", data);
          this.handleMessage(data);
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error, event.data);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
      };

      this.ws.onclose = (event) => {
        console.log("WebSocket closed", event.code, event.reason);
        this.isConnecting = false;
        this.stopHeartbeat();
        this.attemptReconnect();
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    if (!this.token) return;

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect(this.token!);
    }, this.reconnectDelay);
  }

  private handleMessage(data: WebSocketMessage) {
    // Handle all listeners for this message type
    const typeListeners = this.listeners.get(data.type);
    if (typeListeners) {
      typeListeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error("Error in WebSocket listener:", error);
        }
      });
    }

    // Also handle generic listeners
    const allListeners = this.listeners.get("*");
    if (allListeners) {
      allListeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error("Error in WebSocket listener:", error);
        }
      });
    }
  }

  subscribe(conversationId: number) {
    const doSubscribe = () => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const subscribeMsg = {
          type: "subscribe",
          conversationId,
        };
        this.ws.send(JSON.stringify(subscribeMsg));
        console.log(`📡 Subscribed to conversation ${conversationId}`, subscribeMsg);
        return true;
      }
      return false;
    };

    if (!doSubscribe()) {
      console.warn("⚠️ WebSocket not connected, will retry subscription");
      // Retry subscription when connection is ready
      const retryInterval = setInterval(() => {
        if (doSubscribe()) {
          clearInterval(retryInterval);
        }
      }, 200);

      // Stop retrying after 10 seconds
      setTimeout(() => clearInterval(retryInterval), 10000);
    }
  }

  unsubscribe(conversationId: number) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: "unsubscribe",
        conversationId,
      }));
    }
  }

  on(type: string, callback: (data: WebSocketMessage) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const typeListeners = this.listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(callback);
        if (typeListeners.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  off(type: string, callback: (data: WebSocketMessage) => void) {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.delete(callback);
      if (typeListeners.size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
    this.token = null;
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();
