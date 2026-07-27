import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, Mail, MessageCircle, MapPin, Send, Check, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Inquiry } from '../store/useAppStore';

const apartmentOptions = [
  { value: 'simply-good', label: 'Simply Good (Erdgeschoss)' },
  { value: 'simply-nice', label: 'Simply Nice (Dachgeschoss)' },
  { value: 'both', label: 'Beide Wohnungen (Anfrage für beide)' },
];

export default function KontaktPage() {
  const location = useLocation();
  const { addInquiry } = useAppStore();

  const [form, setForm] = useState({
    apartment: 'simply-good' as 'simply-good' | 'simply-nice' | 'both',
    name: '',
    email: '',
    phone: '',
    message: '',
    startDate: '',
    endDate: '',
    adults: 2,
    children: 0,
    firewood: false,
    crib: false,
    extraBed: false,
    privacy: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const wohnung = params.get('wohnung');
    if (wohnung === 'simply-good' || wohnung === 'simply-nice' || wohnung === 'both') {
      setForm((f) => ({ ...f, apartment: wohnung }));
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.message) {
      setError('Bitte füllen Sie alle Pflichtfelder aus (Name, E-Mail, Nachricht).');
      return;
    }
    if (!form.privacy) {
      setError('Bitte stimmen Sie der Datenschutzerklärung zu.');
      return;
    }

    const inquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      apartment: form.apartment,
      startDate: form.startDate,
      endDate: form.endDate,
      adults: form.adults,
      children: form.children,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      firewood: form.firewood,
      crib: form.crib,
      extraBed: form.extraBed,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    addInquiry(inquiry);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="bg-[#f5f5f0] min-h-screen flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#292524] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Anfrage erfolgreich!
          </h2>
          <p className="text-stone-600 mb-6">
            Vielen Dank für Ihre Anfrage, <strong>{form.name}</strong>! Wir melden uns so schnell wie möglich unter <strong>{form.email}</strong> oder{' '}
            {form.phone && <strong>{form.phone}</strong>}.
          </p>
          <p className="text-stone-400 text-sm mb-6">
            Buchung erst nach schriftlicher Bestätigung verbindlich.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-[#b45309] hover:text-[#92400e] font-semibold text-sm"
          >
            Neue Anfrage senden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f0] min-h-screen">
      {/* Header */}
      <div className="bg-[#292524] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-[#fef3c7] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Kontakt & Anfrage
          </h1>
          <p className="text-[#fef3c7]/60 max-w-xl mx-auto">
            Wir freuen uns auf Ihre Anfrage! Kontaktieren Sie uns über das Formular oder direkt per Telefon.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#292524] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Buchungsanfrage senden
              </h2>

              {error && (
                <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Wohnung */}
                <div>
                  <label className="block text-sm font-semibold text-[#292524] mb-1.5">
                    Gewünschte Wohnung
                  </label>
                  <select
                    name="apartment"
                    value={form.apartment}
                    onChange={handleChange}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309] bg-white"
                  >
                    {apartmentOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#292524] mb-1.5">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ihr vollständiger Name"
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#292524] mb-1.5">
                      E-Mail <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ihre@email.de"
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309]"
                    />
                  </div>
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-sm font-semibold text-[#292524] mb-1.5">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Ihre Telefonnummer (optional)"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309]"
                  />
                </div>

                {/* Zeitraum */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#292524] mb-1.5">
                      Anreise
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#292524] mb-1.5">
                      Abreise
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      min={form.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309]"
                    />
                  </div>
                </div>

                {/* Personen */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#292524] mb-1.5">
                      Erwachsene
                    </label>
                    <select
                      name="adults"
                      value={form.adults}
                      onChange={handleChange}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309] bg-white"
                    >
                      {[1, 2, 3].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#292524] mb-1.5">
                      Kinder
                    </label>
                    <select
                      name="children"
                      value={form.children}
                      onChange={handleChange}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309] bg-white"
                    >
                      {[0, 1, 2, 3].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Zusatzoptionen */}
                <div>
                  <label className="block text-sm font-semibold text-[#292524] mb-2">
                    Zusatzoptionen
                  </label>
                  <div className="space-y-2">
                    {[
                      { name: 'firewood', label: '🪵 Kaminholz (auf Anfrage)' },
                      { name: 'crib', label: '👶 Kinderbett / Babybett (auf Anfrage)' },
                      { name: 'extraBed', label: '🛋️ Zustellbett / Aufbettung (auf Anfrage)' },
                    ].map((opt) => (
                      <label key={opt.name} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          name={opt.name}
                          checked={form[opt.name as keyof typeof form] as boolean}
                          onChange={handleChange}
                          className="w-4 h-4 rounded border-stone-300 text-[#b45309] focus:ring-[#b45309]"
                        />
                        <span className="text-sm text-stone-600 group-hover:text-[#292524] transition-colors">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nachricht */}
                <div>
                  <label className="block text-sm font-semibold text-[#292524] mb-1.5">
                    Nachricht <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Ihre Nachricht, Fragen oder besondere Wünsche..."
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309] resize-none"
                  />
                </div>

                {/* Datenschutz */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="privacy"
                    checked={form.privacy}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-stone-300 text-[#b45309] focus:ring-[#b45309] mt-0.5"
                  />
                  <span className="text-sm text-stone-500">
                    Ich habe die{' '}
                    <a href="/datenschutz" className="text-[#b45309] underline hover:no-underline">
                      Datenschutzerklärung
                    </a>{' '}
                    gelesen und stimme der Verarbeitung meiner Daten zu. <span className="text-red-400">*</span>
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white px-6 py-3.5 rounded-xl font-semibold text-base transition-all shadow-md hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Anfrage senden
                </button>

                <p className="text-xs text-stone-400 text-center">
                  Buchung erst nach Bestätigung verbindlich • Endreinigung: 25,00 €
                </p>
              </form>
            </div>
          </div>

          {/* Sidebar – Kontaktinfo */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h3 className="font-bold text-[#292524] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Direkt kontaktieren
              </h3>
              <div className="space-y-4">
                <a
                  href="tel:01781895560"
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-[#fef3c7]/60 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#b45309]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#b45309]" />
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 mb-0.5">Telefon</div>
                    <div className="font-semibold text-[#292524] text-sm">0178 1895560</div>
                  </div>
                </a>

                <a
                  href="https://wa.me/491781895560"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-green-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 mb-0.5">WhatsApp</div>
                    <div className="font-semibold text-[#292524] text-sm">0178 1895560</div>
                  </div>
                </a>

                <a
                  href="mailto:utafinke@web.de"
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-[#fef3c7]/60 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#b45309]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#b45309]" />
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 mb-0.5">E-Mail</div>
                    <div className="font-semibold text-[#292524] text-sm">utafinke@web.de</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
                  <div className="w-10 h-10 rounded-full bg-[#b45309]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#b45309]" />
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 mb-0.5">Adresse</div>
                    <div className="font-semibold text-[#292524] text-sm">
                      Robert-Koch-Straße 26<br />04552 Borna
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Karte Platzhalter */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="bg-stone-100 h-52 flex flex-col items-center justify-center text-stone-400">
                <MapPin className="w-10 h-10 mb-2 text-[#b45309]" />
                <p className="text-sm font-medium text-[#292524]">Robert-Koch-Straße 26</p>
                <p className="text-xs">04552 Borna, Sachsen</p>
                <a
                  href="https://maps.google.com/?q=Robert-Koch-Straße+26+04552+Borna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-xs text-[#b45309] underline hover:no-underline"
                >
                  In Google Maps öffnen
                </a>
              </div>
            </div>

            {/* Preisinfo */}
            <div className="bg-[#fef3c7]/80 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-bold text-[#292524] mb-3 text-sm">Preisübersicht</h3>
              <div className="space-y-2 text-sm text-stone-700">
                <div className="flex justify-between">
                  <span>Simply Good</span>
                  <span className="font-bold">ab 86,40 €/Nacht</span>
                </div>
                <div className="flex justify-between">
                  <span>Simply Nice</span>
                  <span className="font-bold">ab 89,00 €/Nacht</span>
                </div>
                <div className="flex justify-between border-t border-amber-200 pt-2 mt-2">
                  <span>Endreinigung</span>
                  <span className="font-bold">25,00 €</span>
                </div>
              </div>
              <div className="mt-3 bg-white/70 rounded-lg p-2.5 text-xs text-[#b45309] font-medium text-center">
                🎁 Simply Good: Ab 7 Nächten 1 Nacht gratis!
              </div>
            </div>

            <div className="bg-stone-100 rounded-2xl p-4 text-xs text-stone-500">
              <strong className="text-[#292524]">Hinweis:</strong> Buchung erst nach schriftlicher Bestätigung verbindlich. Mindestaufenthalt: 2 Nächte.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
