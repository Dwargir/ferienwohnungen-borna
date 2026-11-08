import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Telefon, Sprechblase, Schliessen } from './Icons';
import { KONTAKT } from '../data/wohnungen';

const links = [
  { to: '/', label: 'Startseite', kurz: 'Start' },
  { to: '/simply-good', label: 'Simply Good', kurz: 'Simply Good' },
  { to: '/simply-nice', label: 'Simply Nice', kurz: 'Simply Nice' },
  { to: '/verfuegbarkeit', label: 'Belegung & Preise', kurz: 'Belegung' },
  { to: '/kontakt', label: 'Anfragen', kurz: 'Anfragen' },
];

// Die Leiste bleibt beim Scrollen immer oben sichtbar – am Computer und auf dem Handy.
export default function Navbar() {
  const { pathname } = useLocation();
  const [kontaktOffen, setKontaktOffen] = useState(false);
  useEffect(() => setKontaktOffen(false), [pathname]);

  const linkStil = (aktiv: boolean) =>
    `no-underline whitespace-nowrap py-1 border-b-2 ${aktiv ? 'border-see font-semibold' : 'border-transparent hover:border-linie'}`;

  return (
    <header className="sticky top-0 z-40 bg-kalk/95 backdrop-blur border-b border-linie">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 md:h-16 flex items-center justify-between gap-6">
        <Link to="/" className="no-underline font-semibold text-lg leading-tight">
          Ferienwohnungen Borna
        </Link>

        <nav className="hidden md:flex items-center gap-7 klein" aria-label="Hauptmenü">
          {links.map((l) => (
            <Link key={l.to} to={l.to} aria-current={pathname === l.to ? 'page' : undefined} className={linkStil(pathname === l.to)}>
              {l.label}
            </Link>
          ))}
          <a href={KONTAKT.telefonLink} className="flex items-center gap-2 no-underline font-semibold text-wasser">
            <Telefon className="w-4 h-4" />
            {KONTAKT.telefon}
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setKontaktOffen(!kontaktOffen)}
          className="md:hidden w-10 h-10 -mr-1 rounded-full bg-see text-white flex items-center justify-center"
          aria-expanded={kontaktOffen}
          aria-label={kontaktOffen ? 'Kontakt schließen' : 'Anrufen oder schreiben'}
        >
          {kontaktOffen ? <Schliessen className="w-5 h-5" /> : <Telefon className="w-5 h-5" />}
        </button>
      </div>

      {/* Handy: Kontakt-Klappe mit großer Nummer, falls Anrufen nicht direkt klappt */}
      {kontaktOffen && (
        <div className="md:hidden px-5 pb-4 font-sans">
          <div className="bg-white border border-linie rounded-md p-4">
            <div className="text-sm text-schilf">Telefon und WhatsApp</div>
            <div className="text-2xl font-semibold tabular-nums select-all">{KONTAKT.telefon}</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={KONTAKT.telefonLink} className="knopf !px-3">
                <Telefon className="w-4 h-4" /> Anrufen
              </a>
              <a href={`https://wa.me/${KONTAKT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="knopf knopf-hell !px-3">
                <Sprechblase className="w-4 h-4" /> WhatsApp
              </a>
            </div>
            <a href={`mailto:${KONTAKT.email}`} className="block mt-3 text-sm verweis">{KONTAKT.email}</a>
          </div>
        </div>
      )}

      {/* Handy: alle Seiten direkt sichtbar, ohne Menü */}
      <nav className="md:hidden flex justify-between gap-3 px-5 pb-2 text-[0.8125rem] font-sans overflow-x-auto" aria-label="Hauptmenü">
        {links.map((l) => (
          <Link key={l.to} to={l.to} aria-current={pathname === l.to ? 'page' : undefined} className={linkStil(pathname === l.to)}>
            {l.kurz}
          </Link>
        ))}
      </nav>
    </header>
  );
}
