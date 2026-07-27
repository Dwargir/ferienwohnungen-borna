import { useAppStore } from '../store/useAppStore';
import { Cookie, Check, X, Shield } from 'lucide-react';

export default function CookieSettingsPage() {
  const { cookieConsent, setCookieConsent } = useAppStore();

  return (
    <div className="bg-[#f5f5f0] min-h-screen">
      <div className="bg-[#292524] py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#fef3c7]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Cookie-Einstellungen
          </h1>
          <p className="text-[#fef3c7]/60 mt-2">Verwalten Sie Ihre Datenschutzeinstellungen</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Status */}
        {cookieConsent.accepted !== null && (
          <div className={`rounded-2xl p-4 flex items-center gap-3 ${cookieConsent.accepted ? 'bg-green-50 border border-green-200' : 'bg-stone-50 border border-stone-200'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cookieConsent.accepted ? 'bg-green-100' : 'bg-stone-200'}`}>
              {cookieConsent.accepted ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-stone-500" />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#292524]">
                {cookieConsent.accepted ? 'Cookies akzeptiert' : 'Cookies abgelehnt'}
              </div>
              {cookieConsent.timestamp && (
                <div className="text-xs text-stone-400">
                  Eingestellt am: {new Date(cookieConsent.timestamp).toLocaleDateString('de-DE', {
                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Technisch notwendige Cookies */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-5 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="font-bold text-[#292524]">Technisch notwendige Cookies</h2>
                  <p className="text-xs text-stone-400">Immer aktiv – nicht deaktivierbar</p>
                </div>
              </div>
              <div className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                Aktiv
              </div>
            </div>
          </div>
          <div className="p-5 text-sm text-stone-600">
            <p className="mb-3">
              Diese Cookies sind für den Betrieb der Website unbedingt erforderlich. Sie ermöglichen grundlegende Funktionen wie die Seiten-Navigation und den Zugriff auf sichere Bereiche der Website. Die Website kann ohne diese Cookies nicht ordnungsgemäß funktionieren.
            </p>
            <div className="bg-stone-50 rounded-xl p-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-stone-400">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Zweck</th>
                    <th className="pb-2">Laufzeit</th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr>
                    <td className="py-1 font-mono">ferienwohnungen-borna-store</td>
                    <td className="py-1">Speichert Anfragen und Cookie-Einwilligung lokal</td>
                    <td className="py-1">Unbegrenzt (localStorage)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Analyse-Cookies */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-5 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-stone-400" />
                </div>
                <div>
                  <h2 className="font-bold text-[#292524]">Analyse-Cookies</h2>
                  <p className="text-xs text-stone-400">Nicht eingesetzt</p>
                </div>
              </div>
              <div className="bg-stone-100 text-stone-500 text-xs font-semibold px-3 py-1 rounded-full">
                Nicht aktiv
              </div>
            </div>
          </div>
          <div className="p-5 text-sm text-stone-600">
            <p>
              Auf dieser Website werden <strong>keine</strong> Analyse-Tools oder Tracking-Dienste (z.B. Google Analytics) eingesetzt. Ihre Besuche werden nicht statistisch ausgewertet.
            </p>
          </div>
        </div>

        {/* Marketing-Cookies */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-5 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-stone-400" />
                </div>
                <div>
                  <h2 className="font-bold text-[#292524]">Marketing-Cookies</h2>
                  <p className="text-xs text-stone-400">Nicht eingesetzt</p>
                </div>
              </div>
              <div className="bg-stone-100 text-stone-500 text-xs font-semibold px-3 py-1 rounded-full">
                Nicht aktiv
              </div>
            </div>
          </div>
          <div className="p-5 text-sm text-stone-600">
            <p>
              Es werden keine Marketing- oder Werbecookies auf dieser Website verwendet. Es findet kein Tracking für Werbezwecke statt.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <h2 className="font-bold text-[#292524] mb-4">Ihre Einwilligung</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCookieConsent(true)}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${cookieConsent.accepted === true ? 'bg-green-500 text-white' : 'bg-[#b45309] hover:bg-[#92400e] text-white'}`}
            >
              <Check className="w-4 h-4" />
              Cookies akzeptieren
            </button>
            <button
              onClick={() => setCookieConsent(false)}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all ${cookieConsent.accepted === false ? 'bg-stone-700 text-white border-stone-700' : 'border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-800'}`}
            >
              <X className="w-4 h-4" />
              Cookies ablehnen
            </button>
          </div>
          <p className="text-xs text-stone-400 mt-3 text-center">
            Ihre Einstellung wird lokal gespeichert und kann jederzeit geändert werden.
          </p>
        </div>

        <div className="text-center">
          <a href="/datenschutz" className="text-sm text-[#b45309] hover:underline">
            Vollständige Datenschutzerklärung ansehen
          </a>
        </div>
      </div>
    </div>
  );
}
