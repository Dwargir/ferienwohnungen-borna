import { Cookie } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function CookieBanner() {
  const { cookieConsent, setCookieConsent } = useAppStore();

  if (cookieConsent.accepted !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-[#292524] rounded-xl shadow-2xl border border-[#b45309]/30 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie className="w-6 h-6 text-[#b45309] flex-shrink-0 mt-0.5" />
        <p className="text-[#fef3c7]/80 text-sm flex-1">
          Diese Website verwendet nur technisch notwendige Cookies. Es werden keine Analyse-Tools oder Tracking-Dienste eingesetzt.{' '}
          <a href="/datenschutz" className="text-[#b45309] underline hover:no-underline">
            Datenschutzerklärung
          </a>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => setCookieConsent(false)}
            className="px-4 py-2 text-sm rounded-lg border border-white/20 text-[#fef3c7]/60 hover:border-white/40 hover:text-[#fef3c7] transition-all"
          >
            Ablehnen
          </button>
          <button
            onClick={() => setCookieConsent(true)}
            className="px-4 py-2 text-sm rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-all font-medium"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
