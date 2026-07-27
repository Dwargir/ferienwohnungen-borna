import { Link } from 'react-router-dom';
import { Info, ChevronRight } from 'lucide-react';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { useAppStore } from '../store/useAppStore';

const priceTable = [
  {
    id: 'simply-good',
    name: 'Simply Good',
    subtitle: 'Erdgeschoss',
    price: '86,40 €',
    cleaning: '25,00 €',
    minStay: '2 Nächte',
    maxGuests: 3,
    special: 'Ab 7 Nächten: 1 Nacht gratis!',
    link: '/simply-good',
  },
  {
    id: 'simply-nice',
    name: 'Simply Nice',
    subtitle: 'Dachgeschoss',
    price: '89,00 €',
    cleaning: '25,00 €',
    minStay: '2 Nächte',
    maxGuests: 3,
    special: null,
    link: '/simply-nice',
  },
];

export default function VerfuegbarkeitPage() {
  const { bookings } = useAppStore();

  return (
    <div className="bg-[#f5f5f0] min-h-screen">
      {/* Header */}
      <div className="bg-[#292524] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-[#fef3c7] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Verfügbarkeit prüfen
          </h1>
          <p className="text-[#fef3c7]/60 max-w-xl mx-auto">
            Prüfen Sie die Verfügbarkeit unserer beiden Apartments. Rot markierte Tage sind bereits belegt.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Hinweis */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#b45309] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#292524]/80">
            <strong>Wichtig:</strong> Buchung erst nach Bestätigung verbindlich. Bitte senden Sie eine Anfrage für Ihren gewünschten Zeitraum. Wir bestätigen Ihnen die Verfügbarkeit so schnell wie möglich.
          </div>
        </div>

        {/* Legende */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-50 border border-green-200" />
            <span className="text-sm text-stone-600">Verfügbar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-100" />
            <span className="text-sm text-stone-600">Belegt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-r from-white to-red-100 border border-stone-200" />
            <span className="text-sm text-stone-600">Anreise</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-r from-red-100 to-white border border-stone-200" />
            <span className="text-sm text-stone-600">Abreise</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded ring-2 ring-[#b45309] ring-offset-0" />
            <span className="text-sm text-stone-600">Heute</span>
          </div>
        </div>

        {/* Calendars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {(['simply-good', 'simply-nice'] as const).map((apt) => {
            const info = apt === 'simply-good'
              ? { name: 'Simply Good', sub: 'Erdgeschoss', price: '86,40 €', link: '/simply-good' }
              : { name: 'Simply Nice', sub: 'Dachgeschoss', price: '89,00 €', link: '/simply-nice' };

            return (
              <div key={apt} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="bg-[#292524] p-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-[#fef3c7] font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {info.name}
                    </h2>
                    <div className="text-[#b45309] text-xs font-medium uppercase tracking-wide">{info.sub}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#fef3c7] font-bold text-lg">ab {info.price}</div>
                    <div className="text-[#fef3c7]/50 text-xs">pro Nacht</div>
                  </div>
                </div>

                <div className="p-5">
                  <AvailabilityCalendar apartment={apt} bookings={bookings} />
                </div>

                <div className="px-5 pb-5">
                  <div className="flex gap-3">
                    <Link
                      to={`/kontakt?wohnung=${apt}`}
                      className="flex-1 text-center bg-[#b45309] hover:bg-[#92400e] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    >
                      Jetzt anfragen
                    </Link>
                    <Link
                      to={info.link}
                      className="flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-stone-200 hover:border-[#b45309] text-stone-600 hover:text-[#b45309] transition-all"
                    >
                      Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Preisliste */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-8">
          <div className="p-5 border-b border-stone-100">
            <h2 className="text-xl font-bold text-[#292524]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Preisliste
            </h2>
          </div>
          <div className="divide-y divide-stone-100">
            {priceTable.map((apt) => (
              <div key={apt.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-[#292524] text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {apt.name}
                      </h3>
                      <span className="bg-[#b45309]/10 text-[#b45309] text-xs px-2 py-0.5 rounded-full font-medium">
                        {apt.subtitle}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-stone-400 text-xs">Preis pro Nacht</div>
                        <div className="font-bold text-[#292524] text-lg">ab {apt.price}</div>
                      </div>
                      <div>
                        <div className="text-stone-400 text-xs">Endreinigung</div>
                        <div className="font-semibold text-stone-700">{apt.cleaning}</div>
                      </div>
                      <div>
                        <div className="text-stone-400 text-xs">Mindestaufenthalt</div>
                        <div className="font-semibold text-stone-700">{apt.minStay}</div>
                      </div>
                      <div>
                        <div className="text-stone-400 text-xs">Max. Personen</div>
                        <div className="font-semibold text-stone-700">{apt.maxGuests}</div>
                      </div>
                    </div>

                    {apt.special && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-[#fef3c7] border border-amber-200 rounded-lg px-3 py-1.5 text-sm">
                        <span>🎁</span>
                        <span className="text-[#292524] font-medium">{apt.special}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={apt.link}
                    className="sm:self-center inline-flex items-center gap-1 text-[#b45309] hover:text-[#92400e] font-semibold text-sm transition-colors flex-shrink-0"
                  >
                    Details ansehen <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Fußnoten */}
          <div className="bg-stone-50 p-4 text-xs text-stone-400 space-y-1">
            <p>* Alle Preise inkl. Bettwäsche und Handtücher. Endreinigung wird einmalig berechnet.</p>
            <p>* Zusatzoptionen (Kaminholz, Kinderbett, Aufbettung) auf Anfrage erhältlich.</p>
            <p>* Buchung erst nach schriftlicher Bestätigung verbindlich.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#292524] rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-[#fef3c7] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Wunschtermin gefunden?
          </h3>
          <p className="text-[#fef3c7]/60 mb-5 text-sm">
            Senden Sie uns Ihre Buchungsanfrage – wir melden uns schnellstmöglich!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/kontakt"
              className="inline-flex items-center justify-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white px-8 py-3 rounded-xl font-semibold transition-all"
            >
              Anfrage senden
            </Link>
            <a
              href="tel:01781895560"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-[#fef3c7] border border-white/20 px-8 py-3 rounded-xl font-semibold transition-all"
            >
              0178 1895560
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
