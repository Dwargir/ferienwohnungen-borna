import { useNavigate } from 'react-router-dom';
import { wohnungen, euro } from '../data/wohnungen';

/*
  Das Haus im Querschnitt: oben Simply Nice (Dachgeschoss), unten Simply Good (Erdgeschoss).
  Jede Etage ist anklickbar und führt zur jeweiligen Wohnung.
*/
export default function HausSchnitt() {
  const navigate = useNavigate();
  const good = wohnungen.find((w) => w.id === 'simply-good')!;
  const nice = wohnungen.find((w) => w.id === 'simply-nice')!;

  const etage = (id: string) => ({
    role: 'link',
    tabIndex: 0,
    className: 'etage cursor-pointer',
    onClick: () => navigate(`/${id}`),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigate(`/${id}`);
      }
    },
  });

  return (
    <svg
      viewBox="0 0 420 370"
      className="w-full h-auto"
      role="group"
      aria-label="Das Haus mit beiden Wohnungen: oben Simply Nice, unten Simply Good"
    >
      <style>{`
        .etage .flaeche { fill: var(--color-papier); transition: fill .2s; }
        .etage:hover .flaeche, .etage:focus-visible .flaeche { fill: color-mix(in srgb, var(--color-sonne) 22%, var(--color-papier)); }
        .etage:focus { outline: none; }
        .etage:focus-visible .rahmen { stroke-width: 3; }
        .etage:hover .pfeil, .etage:focus-visible .pfeil { transform: translateX(4px); }
        .pfeil { transition: transform .2s; }
        .gross { font-family: var(--font-serif); font-weight: 600; font-size: 22px; fill: var(--color-see); }
        .klein-t { font-family: var(--font-sans); font-size: 12.5px; fill: var(--color-see); }
        .preis-t { font-family: var(--font-sans); font-size: 12.5px; font-weight: 600; fill: var(--color-wasser); }
      `}</style>

      {/* Boden */}
      <line x1="0" y1="340" x2="420" y2="340" stroke="var(--color-schilf)" strokeWidth="1.5" />
      {/* Schornstein für den Kamin unten */}
      <rect x="286" y="44" width="20" height="46" fill="var(--color-papier)" stroke="var(--color-see)" strokeWidth="2" />

      {/* Dachgeschoss – Simply Nice */}
      <g {...etage(nice.id)} aria-label={`${nice.name}, ${nice.etage}, ab ${euro(nice.preis)} pro Nacht`}>
        <path className="flaeche rahmen" d="M60 214 V128 L210 26 L360 128 V214 Z" stroke="var(--color-see)" strokeWidth="2" />
        {/* Dachfenster */}
        <path d="M110 120 l26 -18 v20 l-26 18 z" fill="var(--color-sonne)" opacity=".85" />
        <path d="M284 102 l26 18 v20 l-26 -18 z" fill="var(--color-sonne)" opacity=".85" />
        <circle cx="210" cy="78" r="9" fill="none" stroke="var(--color-see)" strokeWidth="1.5" />
        <text x="210" y="160" textAnchor="middle" className="gross">{nice.name}</text>
        <text x="210" y="181" textAnchor="middle" className="klein-t">{nice.etage}, {nice.schlafzimmer} Schlafzimmer</text>
        <g className="pfeil">
          <text x="210" y="201" textAnchor="middle" className="preis-t">ab {euro(nice.preis)} pro Nacht</text>
        </g>
      </g>

      {/* Erdgeschoss – Simply Good */}
      <g {...etage(good.id)} aria-label={`${good.name}, ${good.etage}, ab ${euro(good.preis)} pro Nacht`}>
        <rect className="flaeche rahmen" x="60" y="214" width="300" height="126" stroke="var(--color-see)" strokeWidth="2" />
        {/* Fenster und Terrassentür */}
        <rect x="78" y="236" width="26" height="40" fill="var(--color-sonne)" opacity=".85" />
        <rect x="318" y="236" width="26" height="104" fill="var(--color-sonne)" opacity=".85" />
        <line x1="331" y1="236" x2="331" y2="340" stroke="var(--color-see)" strokeWidth="1.5" />
        <text x="210" y="268" textAnchor="middle" className="gross">{good.name}</text>
        <text x="210" y="289" textAnchor="middle" className="klein-t">{good.etage} mit Kamin</text>
        <g className="pfeil">
          <text x="210" y="309" textAnchor="middle" className="preis-t">ab {euro(good.preis)} pro Nacht</text>
        </g>
      </g>

      {/* Dach mit Überstand */}
      <path d="M40 140 L210 22 L380 140" fill="none" stroke="var(--color-see)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Terrasse mit Sonnenschirm */}
      <line x1="360" y1="336" x2="414" y2="336" stroke="var(--color-see)" strokeWidth="3" />
      <line x1="392" y1="336" x2="392" y2="282" stroke="var(--color-see)" strokeWidth="1.5" />
      <path d="M368 284 Q392 262 416 284 Z" fill="var(--color-sonne)" stroke="var(--color-see)" strokeWidth="1.5" />
    </svg>
  );
}
