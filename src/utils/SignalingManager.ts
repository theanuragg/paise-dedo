import { WS_BASE_URL } from '@/config/config';
import { KLine, Trade } from './types';

export const BASE_URL = WS_BASE_URL;

export class SignalingManager {
  private ws: WebSocket | null = null;
  private static instance: SignalingManager;
  private bufferedMessages: unknown[] = [];
  private callback: Record<string, { callback: (data: unknown) => void; id: string }[]> = {};
  private id: number;
  private initialized: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 3000; // 3 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  
  // Public event handlers that can be set by external components
  public onOpen?: () => void;
  public onClose?: () => void;
  public onError?: (error: Event) => void;

  private constructor() {
    if (process.env.NODE_ENV !== 'test') console.log('Initializing SignalingManager');
    this.bufferedMessages = [];
    this.id = 1;
    this.connect();
    this.setupPageVisibilityListener();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new SignalingManager();
    }
    return this.instance;
  }

  private connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (process.env.NODE_ENV !== 'production') console.log('WebSocket already connected');
      return;
    }

    if (process.env.NODE_ENV !== 'production') console.log(`Attempting to connect to WebSocket (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    this.ws = new WebSocket(BASE_URL);
    this.init();
  }

  private init() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      if (process.env.NODE_ENV !== 'production') console.log('WebSocket connection established');
      this.initialized = true;
      this.reconnectAttempts = 0;

      // Clear any existing reconnect timer
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      // Start heartbeat
      this.startHeartbeat();

      // Re-register all active subscriptions
      this.reregisterSubscriptions();

      if (process.env.NODE_ENV !== 'production') console.log(`Sending ${this.bufferedMessages.length} buffered messages`);
      this.bufferedMessages.forEach(message => {
        if (process.env.NODE_ENV !== 'production') console.log('Sending buffered message');
        this.sendMessageDirect(message as object);
      });
      this.bufferedMessages = [];
      
      // Call external onOpen handler if set
      if (this.onOpen) {
        this.onOpen();
      }
    };

    this.ws.onclose = event => {
      if (process.env.NODE_ENV !== 'production') console.log('WebSocket connection closed');
      this.initialized = false;
      this.stopHeartbeat();

      // Don't clear all callbacks on close - let components manage their own cleanup
      // this.callback = {};

      // Call external onClose handler if set
      if (this.onClose) {
        this.onClose();
      }

      // Attempt to reconnect if not a normal closure
      if (
        event.code !== 1000 &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = error => {
      console.error('❌ WebSocket error');
      this.initialized = false;
      
      // Call external onError handler if set
      if (this.onError) {
        this.onError(error);
      }
    };

    this.ws.onmessage = event => {
      if (process.env.NODE_ENV !== 'production') console.log('Received message');
      try {
        const message = JSON.parse(event.data);
        const type: string | undefined = message?.type;

        if (type && process.env.NODE_ENV !== 'production') console.log('Message type:', type);

        if (type && this.callback[type]) {
          if (process.env.NODE_ENV !== 'production') console.log(`Found ${this.callback[type].length} callbacks for type ${type}`);
          this.callback[type].forEach(({ callback }) => {
            try {
              if (type === 'KLINE') {
                const newKline: Partial<KLine> = {
                  close: message.data.close,
                  end: message.data.end,
                  high: message.data.high,
                  low: message.data.low,
                  open: message.data.open,
                  quote_volume: message.data.quote_volume,
                  start: message.data.start,
                  trades: message.data.trades,
                  volume: message.data.volume,
                };
                if (process.env.NODE_ENV !== 'production') console.log('Processing KLINE');
                callback(newKline);
              } else if (type === 'TRADE') {
                callback(message as unknown as Trade);
              } else {
                if (process.env.NODE_ENV !== 'production') console.log('Processing message');
                callback(message);
              }
            } catch {
              console.error('Error in callback');
            }
          });
        } else {
          if (process.env.NODE_ENV !== 'production') console.log('No callback found for message type');
        }
      } catch {
        console.error('❌ Error parsing WebSocket message');
      }
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    if (process.env.NODE_ENV !== 'production') console.log(`Scheduling reconnect in ${this.reconnectInterval}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  private startHeartbeat() {
    this.stopHeartbeat(); // Clear any existing heartbeat

    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        if (process.env.NODE_ENV !== 'production') console.log('Checking WebSocket connection health');
        // Just check connection state, don't send PING messages
        // The server doesn't support PING messages
      } else {
        if (process.env.NODE_ENV !== 'production') console.log('WebSocket connection lost, attempting to reconnect');
        this.forceReconnect();
      }
    }, 30000); // Check connection every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private sendMessageDirect(message: object) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message - WebSocket not connected');
    }
  }

  sendMessage(message: { type: string; room?: string; data?: unknown; base_mint?: string }) {
    // For subscription messages, handle both room-based and token-based subscriptions
    let messageToSend: { type: string; room?: string; data?: unknown; id?: number; base_mint?: string };
    if (message.type === 'SUBSCRIBE' || message.type === 'UNSUBSCRIBE') {
      messageToSend = {
        type: message.type,
        room: message.room,
        base_mint: message.base_mint,
      };
    } else {
      // For other messages, keep the original behavior
      messageToSend = { ...message, data: message.data || null, id: this.id++ };
    }
    
    if (process.env.NODE_ENV !== 'production') console.log('Sending message');
    if (
      !this.initialized ||
      !this.ws ||
      this.ws.readyState !== WebSocket.OPEN
    ) {
      if (process.env.NODE_ENV !== 'production') console.log('WebSocket not ready, buffering message');
      this.bufferedMessages.push(messageToSend);
      return;
    }
    this.sendMessageDirect(messageToSend);
  }

  async registerCallback(type: string, callback: (data: unknown) => void, id: string) {
    if (process.env.NODE_ENV !== 'production') console.log(`Registering callback for type: ${type} with id: ${id}`);
    this.callback[type] = this.callback[type] || [];

    // Remove any existing callback with the same id to avoid duplicates
    const beforeCount = this.callback[type].length;
    this.callback[type] = this.callback[type].filter(cb => cb.id !== id);
    const removedCount = beforeCount - this.callback[type].length;
    if (removedCount > 0 && process.env.NODE_ENV !== 'production') console.log(`Removed ${removedCount} existing callback(s) with id: ${id}`);
    void beforeCount;

    this.callback[type].push({ callback, id });
    if (process.env.NODE_ENV !== 'production') console.log(`Total callbacks for ${type}:`, this.callback[type].length);
  }

  async deRegisterCallback(type: string, id: string) {
    if (process.env.NODE_ENV !== 'production') console.log(`De-registering callback for type: ${type} with id: ${id}`);
    if (this.callback[type]) {
      const beforeCount = this.callback[type].length;
      const index = this.callback[type].findIndex(cb => cb.id === id);
      if (index !== -1) {
        this.callback[type].splice(index, 1);
        if (process.env.NODE_ENV !== 'production') console.log(`Successfully removed callback for ${type} with id: ${id}`);
      } else {
        if (process.env.NODE_ENV !== 'production') console.log(`No callback found for ${type} with id: ${id}`);
      }
      if (process.env.NODE_ENV !== 'production') console.log(`Total callbacks for ${type} after removal:`, this.callback[type].length);
      void beforeCount;
    } else {
      if (process.env.NODE_ENV !== 'production') console.log(`No callbacks exist for type: ${type}`);
    }
  }

  // Subscribe to a specific token by base mint
  public subscribeToToken(baseMint: string) {
    if (process.env.NODE_ENV !== 'production') console.log(`Subscribing to token: ${baseMint}`);
    this.sendMessage({
      type: 'SUBSCRIBE',
      base_mint: baseMint
    });
  }

  // Unsubscribe from a specific token by base mint
  public unsubscribeFromToken(baseMint: string) {
    if (process.env.NODE_ENV !== 'production') console.log(`Unsubscribing from token: ${baseMint}`);
    this.sendMessage({
      type: 'UNSUBSCRIBE',
      base_mint: baseMint
    });
  }

  // Cleanup method for when the app is closing
  cleanup() {
    if (process.env.NODE_ENV !== 'production') console.log('Cleaning up SignalingManager');
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close(1000, 'Application closing');
      this.ws = null;
    }
    this.initialized = false;
  }

  // Force reconnect method
  forceReconnect() {
    if (process.env.NODE_ENV !== 'production') console.log('Force reconnecting WebSocket');
    this.cleanup();
    this.reconnectAttempts = 0;
    this.connect();
  }

  private setupPageVisibilityListener() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          if (process.env.NODE_ENV !== 'production') console.log('Page became visible - checking WebSocket connection');
          if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            if (process.env.NODE_ENV !== 'production') console.log('WebSocket not connected, attempting to reconnect');
            this.forceReconnect();
          }
        } else {
          if (process.env.NODE_ENV !== 'production') console.log('Page became hidden');
        }
      });
    }
  }

  private reregisterSubscriptions() {
    // This method would need to be implemented to track active subscriptions
    // For now, we'll rely on the components to re-register their subscriptions
    if (process.env.NODE_ENV !== 'production') console.log('Re-registering subscriptions after reconnection');
  }

  // Getter methods for connection status
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getConnectionState(): number | null {
    return this.ws ? this.ws.readyState : null;
  }
}
