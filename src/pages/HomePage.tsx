import { Link } from 'react-router-dom';
import { ArrowRight, Users, MapPin, Waves, Bike, Wifi, Car, Flame, Coffee, Tv, Bath } from 'lucide-react';
import ContactSection from '../components/ContactSection';

const apartments = [
  {
    id: 'simply-good',
    name: 'Simply Good',
    subtitle: 'Erdgeschoss',
    tagline: 'Komplettes Apartment mit Kamin & Terrasse',
    price: 86.40,
    persons: 3,
    size: 50,
    image: '/images/simply-good-main.jpg',
    highlights: ['Kamin', 'Terrasse', 'Boxspringbett 180×200', 'Gratis Parkplatz'],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: 'WLAN' },
      { icon: <Tv className="w-4 h-4" />, label: 'Smart TV' },
      { icon: <Flame className="w-4 h-4" />, label: 'Kamin' },
      { icon: <Coffee className="w-4 h-4" />, label: 'Espressomaschine' },
      { icon: <Car className="w-4 h-4" />, label: 'Parkplatz gratis' },
      { icon: <Bath className="w-4 h-4" />, label: 'Dusche' },
    ],
    color: 'from-terracotta/80 to-stone-dark/80',
  },
  {
    id: 'simply-nice',
    name: 'Simply Nice',
    subtitle: 'Dachgeschoss',
    tagline: 'Mit 2 getrennten Schlafzimmern – ideal für 2 Paare',
    price: 89.00,
    persons: 3,
    size: null,
    image: '/images/simply-nice-main.jpg',
    highlights: ['2 Schlafzimmer', 'Bad mit Wanne', 'Smart TV', 'WLAN'],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: 'WLAN' },
      { icon: <Tv className="w-4 h-4" />, label: 'Smart TV' },
      { icon: <Bath className="w-4 h-4" />, label: 'Badewanne' },
      { icon: <Coffee className="w-4 h-4" />, label: 'Kaffeemaschine' },
      { icon: <Users className="w-4 h-4" />, label: '2 Schlafzimmer' },
      { icon: <MapPin className="w-4 h-4" />, label: 'Dachgeschoss' },
    ],
    color: 'from-ocean/80 to-stone-dark/80',
  },
];

const activities = [
  { icon: '🏊', title: 'Wassersport', desc: 'Wildwasseranlage am Markkleeberger See' },
  { icon: '🚴', title: 'Radfahren', desc: 'Touren durch die Seenlandschaft' },
  { icon: '🎢', title: 'Belantis', desc: 'Freizeitpark in der Nähe' },
  { icon: '🏙️', title: 'Leipzig', desc: '20 Min. via Autobahn' },
  { icon: '⛪', title: 'Kirchen & Kultur', desc: 'Romanische Emmaus Kirche' },
  { icon: '🌊', title: 'Seenlandschaft', desc: 'Direkt vor der Haustür' },
];

export default function HomePage() {
  return (
    <div className="bg-sand">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <img src="/images/hero.jpg" alt="Ferienwohnungen Borna" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-dark/70 via-stone-dark/50 to-stone-dark/80" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-terracotta text- deep-blue px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <MapPin className="w-4 h-4" />
            Borna im Leipziger Neuseenland
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-sand-light mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Willkommen in unseren<br />
            <span className="text-terracotta-light">Ferienwohnungen</span>
          </h1>
          <p className="text-lg sm:text-xl text-sand/85 max-w-2xl mx-auto mb-8 leading-relaxed">
            Genießen Sie eine entspannte Auszeit im Leipziger Neuseenland. Unsere liebevoll eingerichteten Apartments bieten Ihnen den perfekten Rückzugsort für Ihren Urlaub.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/verfuegbarkeit" className="inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text- deep-blue px-8 py-3.5 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl">
              Verfügbarkeit prüfen
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/kontakt" className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text- deep-blue border border-white/30 px-8 py-3.5 rounded-xl font-semibold text-lg transition-all backdrop-blur-sm">
              Anfrage senden
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-terracotta py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text- deep-blue">
            {[
              { value: '2', label: 'Wohnungen' },
              { value: '3', label: 'Max. Personen' },
              { value: '50m²', label: 'Simply Good' },
              { value: '20 min', label: 'bis Leipzig' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text- deep-blue/70 text-xs uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apartment cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-dark mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Unsere Wohnungen
          </h2>
          <p className="text-stone max-w-xl mx-auto">
            Zwei einzigartige Apartments für Ihren perfekten Urlaub in Sachsen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {apartments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl shadow-sm border border-stone-light overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <img src={apt.image} alt={apt.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${apt.color} to-transparent`} />
                <div className="absolute top-4 left-4">
                  <span className="bg-terracotta text- deep-blue text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {apt.subtitle}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-3xl font-bold text- deep-blue" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {apt.name}
                  </h3>
                  <p className="text- deep-blue/80 text-sm mt-1">{apt.tagline}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-4 mb-5 pb-5 border-b border-stone-light">
                  <div className="flex items-center gap-1.5 text-sm text-stone">
                    <Users className="w-4 h-4 text-terracotta" />
                    <span>Max. {apt.persons} Personen</span>
                  </div>
                  {apt.size && (
                    <div className="flex items-center gap-1.5 text-sm text-stone">
                      <MapPin className="w-4 h-4 text-terracotta" />
                      <span>{apt.size} m²</span>
                    </div>
                  )}
                  <div className="ml-auto text-right">
                    <div className="text-2xl font-bold text-stone-dark">ab {apt.price.toFixed(2).replace('.', ',')} €</div>
                    <div className="text-xs text-stone/50">pro Nacht • zzgl. 25 € Reinigung</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-5">
                  {apt.amenities.map((a) => (
                    <div key={a.label} className="flex items-center gap-1.5 text-xs text-stone bg-sand/50 rounded-lg px-2 py-1.5">
                      <span className="text-terracotta">{a.icon}</span>
                      <span>{a.label}</span>
                    </div>
                  ))}
                </div>

                <ul className="mb-5 space-y-1.5">
                  {apt.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-stone">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3">
                  <Link to={`/${apt.id}`} className="flex-1 text-center bg-stone-dark hover:bg-stone text-sand-light px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
                    Details ansehen
                  </Link>
                  <Link to="/verfuegbarkeit" className="flex-1 text-center bg-terracotta hover:bg-terracotta-dark text- deep-blue px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
                    Verfügbarkeit prüfen
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discount banner */}
      <div className="bg-sand-dark border-y border-stone-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎁</div>
            <div>
              <div className="font-bold text-stone-dark">Langzeit-Rabatt für Simply Good</div>
              <div className="text-sm text-stone/70">Bei Buchung ab 7 Übernachtungen gibt es eine Nacht gratis!</div>
            </div>
          </div>
          <Link to="/kontakt" className="bg-terracotta text- deep-blue px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-terracotta-dark transition-all flex-shrink-0">
            Jetzt anfragen
          </Link>
        </div>
      </div>

      {/* Lake section */}
      <section className="relative h-64 overflow-hidden">
        <img src="/images/lake.jpg" alt="Leipziger Seenlandschaft" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-stone-dark/50 flex items-center justify-center">
          <div className="text-center text- deep-blue">
            <Waves className="w-10 h-10 mx-auto mb-3 text-sand-light" />
            <p className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
              Leipziger Seenlandschaft
            </p>
            <p className="text- deep-blue/70 text-sm mt-1">Direkt vor Ihrer Haustür</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactSection />
    </div>
  );
}