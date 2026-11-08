import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menue, Schliessen, Telefon } from './Icons';
import { KONTAKT } from '../data/wohnungen';

const links = [
  { to: '/simply-good', label: 'Simply Good' },
  { to: '/simply-nice', label: 'Simply Nice' },
  { to: '/verfuegbarkeit', label: 'Belegung & Preise' },
  { to: '/kontakt', label: 'Anfragen' },
];

export default function Navbar() {
  const [offen, setOffen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOffen(false), [pathname]);

  return (
    <header className="bg-kalk border-b border-linie">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="no-underline leading-tight">
          <span className="block font-semibold text-lg">Ferienwohnungen Borna</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 klein" aria-label="Hauptmenü">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              aria-current={pathname === l.to ? 'page' : undefined}
              className={`no-underline py-1 border-b-2 ${pathname === l.to ? 'border-see font-semibold' : 'border-transparent hover:border-linie'}`}
            >
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
          className="md:hidden p-2 -mr-2"
          onClick={() => setOffen(!offen)}
          aria-expanded={offen}
          aria-label={offen ? 'Menü schließen' : 'Menü öffnen'}
        >
          {offen ? <Schliessen className="w-6 h-6" /> : <Menue className="w-6 h-6" />}
        </button>
      </div>

      {offen && (
        <nav className="md:hidden border-t border-linie px-5 pb-4" aria-label="Hauptmenü">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={`block py-3 border-b border-linie no-underline ${pathname === l.to ? 'font-semibold' : ''}`}>
              {l.label}
            </Link>
          ))}
          <a href={KONTAKT.telefonLink} className="mt-4 knopf w-full">
            <Telefon className="w-4 h-4" /> {KONTAKT.telefon} anrufen
          </a>
        </nav>
      )}
    </header>
  );
}
