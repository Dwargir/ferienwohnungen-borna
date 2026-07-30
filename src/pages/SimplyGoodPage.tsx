import { Link } from 'react-router-dom';
import {
  Users, Bed, Bath, Wifi, Tv, Car, Flame, Coffee,
  Wind, ShoppingBag, MapPin, Bike, ChevronRight,
  Star, Check, Info, Phone
} from 'lucide-react';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { useAppStore } from '../store/useAppStore';

const amenities = [
  { icon: <Wifi className="w-4 h-4" />, label: 'WLAN' },
  { icon: <Tv className="w-4 h-4" />, label: 'Smart TV' },
  { icon: <Flame className="w-4 h-4" />, label: 'Kamin' },
  { icon: <Coffee className="w-4 h-4" />, label: 'Kaffeemaschine' },
  { icon: <Coffee className="w-4 h-4" />, label: 'Espressomaschine' },
  { icon: <Bed className="w-4 h-4" />, label: 'Bettwäsche inkl.' },
  { icon: <Bath className="w-4 h-4" />, label: 'Handtücher inkl.' },
  { icon: <Wind className="w-4 h-4" />, label: 'Fön' },
  { icon: <Wind className="w-4 h-4" />, label: 'Bügeleisen' },
  { icon: <Car className="w-4 h-4" />, label: 'Gratis Parkplatz' },
  { icon: <Bike className="w-4 h-4" />, label: 'Leihräder' },
  { icon: <ShoppingBag className="w-4 h-4" />, label: 'Hygieneartikel' },
];

const rooms = [
  { icon: '🛋️', title: 'Wohnzimmer', desc: 'Gemütlicher Wohnbereich mit Kamin' },
  { icon: '🍳', title: 'Küche', desc: 'Voll ausgestattet mit Wasserkocher, Kaffeemaschine, Espressomaschine, Herd, Mikrowelle, Toaster, Geschirr' },
  { icon: '🛁', title: 'Badezimmer', desc: 'Mit Dusche, Duschgel, Fön, Bügeleisen' },
  { icon: '🛏️', title: 'Schlafzimmer', desc: 'Mit Deluxe Boxspringbett 180×200 cm' },
  { icon: '🌿', title: 'Terrasse', desc: 'Mit Sitzgruppe, Rauchen erlaubt' },
];

const nearby = ['Aldi', 'DM', 'Netto', 'Bäcker', 'Tankstelle', 'Café'];

const extras = [
  { label: 'Kaminholz', icon: '🪵' },
  { label: 'Kinderbett / Babybett', icon: '👶' },
  { label: 'Aufbettung (Sofa)', icon: '🛋️' },
];

export default function SimplyGoodPage() {
  const { bookings } = useAppStore();

  return (
    <div className="bg-[#f5f5f0]">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src="/images/simply-good-main.jpg"
          alt="Simply Good"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#292524]/80 via-[#292524]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            <span className="bg-coastal text- deep-blue text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">
              Erdgeschoss
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#fef3c7] mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Simply Good
            </h1>
            <p className="text-[#fef3c7]/80 mt-1 text-lg">Komplettes Apartment – Ihr Zuhause auf Zeit</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Key facts */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: <Users className="w-5 h-5" />, label: 'Max. Personen', value: '3' },
                  { icon: <Star className="w-5 h-5" />, label: 'Größe', value: '50 m²' },
                  { icon: <Bed className="w-5 h-5" />, label: 'Schlafzimmer', value: '1' },
                  { icon: <Car className="w-5 h-5" />, label: 'Mindestaufenthalt', value: '2 Nächte' },
                ].map((f) => (
                  <div key={f.label} className="text-center p-3 bg-[#fef3c7]/40 rounded-xl">
                    <div className="flex justify-center mb-1 text-deep-blue">{f.icon}</div>
                    <div className="text-lg font-bold text-[#292524]">{f.value}</div>
                    <div className="text-xs text-stone-400">{f.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Beschreibung */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h2 className="text-xl font-bold text-[#292524] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Über Simply Good
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Das Apartment befindet sich in ruhiger Lage im Erdgeschoss einer Stadtvilla am Stadtrand von Borna. Mit 50 m² bietet es genügend Platz für bis zu 3 Personen und ist liebevoll eingerichtet.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Dank Schlüsselsafe ist ein kontaktloser Check-in jederzeit möglich. Fahrräder können kostenlos und sicher in der Garage untergestellt werden. Leihräder sind ebenfalls vorhanden.
              </p>
            </div>

            {/* Räume */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h2 className="text-xl font-bold text-[#292524] mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
                Raumaufteilung
              </h2>
              <div className="space-y-3">
                {rooms.map((room) => (
                  <div key={room.title} className="flex items-start gap-4 p-3 rounded-xl bg-stone-50">
                    <span className="text-2xl flex-shrink-0">{room.icon}</span>
                    <div>
                      <div className="font-semibold text-[#292524] text-sm">{room.title}</div>
                      <div className="text-stone-500 text-sm mt-0.5">{room.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ausstattung */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h2 className="text-xl font-bold text-[#292524] mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
                Ausstattung
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {amenities.map((a) => (
                  <div key={a.label} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#fef3c7]/50 border border-amber-100">
                    <span className="text-deep-blue">{a.icon}</span>
                    <span className="text-sm text-[#292524] font-medium">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zusatzoptionen */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h2 className="text-xl font-bold text-[#292524] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Zusatzoptionen
              </h2>
              <p className="text-stone-400 text-sm mb-4">Auf Anfrage buchbar</p>
              <div className="flex flex-wrap gap-3">
                {extras.map((e) => (
                  <div key={e.label} className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5">
                    <span>{e.icon}</span>
                    <span className="text-sm text-stone-700 font-medium">{e.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hinweise */}
            <div className="bg-coastal50 border border-amber-200 rounded-2xl p-6">
              <h2 className="text-base font-bold text-[#292524] mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-deep-blue" />
                Hinweise
              </h2>
              <ul className="space-y-2">
                {[
                  'Buchung erst nach Bestätigung verbindlich',
                  'Rauchen in der Wohnung nicht gestattet – auf der Terrasse erlaubt',
                  'Fahrräder können kostenlos sicher in der Garage untergestellt werden',
                  'Gratis Parkplatz befindet sich direkt vor der Wohnung',
                  'Schlüsselsafe für kontaktlosen Check-in',
                  'Endreinigung: 25,00 €',
                ].map((note) => (
                  <li key={note} className="flex items-start gap-2 text-sm text-stone-600">
                    <Check className="w-4 h-4 text-deep-blue flex-shrink-0 mt-0.5" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lage */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h2 className="text-xl font-bold text-[#292524] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Lage – 5 min fußläufig
              </h2>
              <div className="flex flex-wrap gap-2">
                {nearby.map((place) => (
                  <div key={place} className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                    <MapPin className="w-3.5 h-3.5 text-deep-blue" />
                    <span className="text-sm text-stone-700 font-medium">{place}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-stone-50 rounded-xl">
                <p className="text-sm text-stone-600">
                  <strong>Autobahnanbindung A72</strong> (Borna Nord) – Krankenhaus, Apotheke und Bäcker in der Nähe. Mit dem Auto oder der Regionalbahn in 20–30 Min. nach Leipzig.
                </p>
              </div>
            </div>

            {/* Kalender */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h2 className="text-xl font-bold text-[#292524] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Verfügbarkeit
              </h2>
              <AvailabilityCalendar apartment="simply-good" bookings={bookings} />
              <p className="mt-3 text-xs text-stone-400 text-center">
                Buchung erst nach Bestätigung verbindlich
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preis-Box */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 sticky top-24">
              <div className="text-center mb-5 pb-5 border-b border-stone-100">
                <div className="text-4xl font-bold text-[#292524]">86,40 €</div>
                <div className="text-stone-400 text-sm mt-1">pro Nacht</div>
                <div className="text-xs text-stone-400 mt-1">zzgl. 25,00 € Endreinigung</div>
              </div>

              <div className="space-y-2 mb-5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Mindestaufenthalt</span>
                  <span className="font-medium text-[#292524]">2 Nächte</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Max. Personen</span>
                  <span className="font-medium text-[#292524]">3</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Größe</span>
                  <span className="font-medium text-[#292524]">50 m²</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Check-in</span>
                  <span className="font-medium text-[#292524]">Schlüsselsafe</span>
                </div>
              </div>

              {/* Rabatt-Hinweis */}
              <div className="bg-[#fef3c7] border border-amber-200 rounded-xl p-3 mb-5 text-center">
                <div className="text-deep-blue font-bold text-sm">🎁 Langzeit-Rabatt</div>
                <div className="text-xs text-[#292524]/70 mt-1">
                  Ab 7 Übernachtungen gibt es eine Nacht gratis!
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/kontakt?wohnung=simply-good"
                  className="block w-full text-center bg-coastal hover:bg-deep-blue text- deep-blue px-4 py-3 rounded-xl font-semibold transition-all"
                >
                  Jetzt anfragen
                </Link>
                <Link
                  to="/verfuegbarkeit"
                  className="block w-full text-center bg-stone-100 hover:bg-stone-200 text-[#292524] px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
                >
                  Verfügbarkeit prüfen
                </Link>
                <a
                  href="tel:01781895560"
                  className="flex items-center justify-center gap-2 w-full text-center border border-stone-200 hover:border-[#b45309] text-stone-600 hover:text-deep-blue px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
                >
                  <Phone className="w-4 h-4" />
                  0178 1895560
                </a>
              </div>

              <p className="text-center text-xs text-stone-400 mt-4">
                Buchung erst nach Bestätigung verbindlich
              </p>
            </div>

            {/* Betten */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
              <h3 className="font-bold text-[#292524] mb-3 flex items-center gap-2">
                <Bed className="w-4 h-4 text-deep-blue" />
                Betten
              </h3>
              <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Deluxe Boxspringbett 180×200 cm
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  Sofa als Aufbettung (auf Anfrage)
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  Babybett auf Anfrage
                </li>
              </ul>
            </div>

            {/* Andere Wohnung */}
            <div className="bg-[#292524] rounded-2xl p-5 text-center">
              <div className="text-[#fef3c7]/60 text-xs uppercase tracking-wider mb-2">Auch interessant</div>
              <h3 className="text-[#fef3c7] font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Simply Nice</h3>
              <p className="text-[#fef3c7]/60 text-xs mb-4">Dachgeschoss – 2 getrennte Schlafzimmer</p>
              <Link
                to="/simply-nice"
                className="inline-flex items-center gap-1 text-deep-blue hover:text-[#92400e] text-sm font-semibold transition-colors"
              >
                Mehr erfahren <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
