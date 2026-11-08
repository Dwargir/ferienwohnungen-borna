import { Link, useLocation } from 'react-router-dom';
import { Telefon } from './Icons';
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

        <a
          href={KONTAKT.telefonLink}
          className="md:hidden w-10 h-10 -mr-1 rounded-full bg-see text-white flex items-center justify-center"
          aria-label={`Anrufen: ${KONTAKT.telefon}`}
        >
          <Telefon className="w-5 h-5" />
        </a>
      </div>

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
