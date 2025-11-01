import { Phone, Globe, MessageCircle, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { useLanguage } from '../LanguageContext';
import { useSession } from '../../contexts/SessionContext';

export default function WhatsAppSupportPage() {
  const { toggleLanguage, t } = useLanguage();
  const { submitWhatsAppContact } = useSession();

  const handleWhatsAppContact = () => {
    submitWhatsAppContact(true);
    // Open WhatsApp in new tab
    window.open('http://wa.me/31641431671', '_blank');
  };

  const handlePhoneClick = () => {
    window.open('http://wa.me/31641431671', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#1a1d23] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#1a1d23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <svg className="w-32 sm:w-40 md:w-44" viewBox="0 0 172 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
            <button onClick={handlePhoneClick} className="flex items-center gap-1.5 sm:gap-2 hover:text-gray-300 transition-colors">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm md:text-base">{t('phone')}</span>
            </button>
            <button onClick={toggleLanguage} className="flex items-center gap-1.5 sm:gap-2 hover:text-gray-300 transition-colors">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm md:text-base">{t('czechVersion')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Security Verification Banner */}
        <div className="bg-[#d4af37] border-2 border-[#c09d2e] rounded-lg p-4 sm:p-6 mb-6 sm:mb-10">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-[#1a1d23] rounded-full p-2 flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#d4af37]" />
            </div>
            <div>
              <h1 className="text-black mb-2 text-lg sm:text-xl md:text-2xl">{t('securityVerificationRequired')}</h1>
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                {t('securityVerificationText')}
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Contact Card */}
        <div className="bg-[#242830] border border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-[#2a3040] px-4 sm:px-8 py-4 sm:py-5 flex items-center gap-3 border-b border-gray-700">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#25D366]" />
            <h2 className="text-white text-base sm:text-lg md:text-xl">{t('whatsappSupport')}</h2>
          </div>
          
          <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            {/* Instructions */}
            <div className="bg-[#1a1d23] rounded-lg p-4 sm:p-6">
              <h3 className="text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#25D366]" />
                {t('nextSteps')}
              </h3>
              <ol className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                <li className="flex gap-2 sm:gap-3">
                  <span className="text-[#d4af37] flex-shrink-0">1.</span>
                  <span>{t('whatsappStep1')}</span>
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span className="text-[#d4af37] flex-shrink-0">2.</span>
                  <span>{t('whatsappStep2')}</span>
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span className="text-[#d4af37] flex-shrink-0">3.</span>
                  <span>{t('whatsappStep3')}</span>
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span className="text-[#d4af37] flex-shrink-0">4.</span>
                  <span>{t('whatsappStep4')}</span>
                </li>
              </ol>
            </div>

            {/* WhatsApp Button */}
            <div className="flex justify-center pt-4 sm:pt-6">
              <Button 
                onClick={handleWhatsAppContact}
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 sm:px-12 py-6 sm:py-8 rounded-full transition-all shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                {t('completeViaWhatsApp')}
              </Button>
            </div>

            <div className="text-center text-gray-400 text-xs sm:text-sm">
              <p>💬 {t('available247')}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 sm:mt-16 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm mb-4 sm:mb-6">
            <a href="#" className="text-[#d4af37] hover:underline">
              {t('safeUseRules')}
            </a>
            <a href="#" className="hover:text-gray-300">
              {t('cookieSettings')}
            </a>
            <a href="#" className="hover:text-gray-300">
              {t('loan')}
            </a>
            <button onClick={handlePhoneClick} className="hover:text-gray-300">
              {t('contacts')}
            </button>
            <a href="#" className="hover:text-gray-300">
              {t('website')}
            </a>
          </div>

          <div className="text-center text-gray-500 text-xs sm:text-sm">
            {t('copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}
