// Ein paar schlichte Symbole, selbst gezeichnet – ohne zusätzliche Bibliothek.
type P = { className?: string };

const basis = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const Telefon = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);

export const Brief = ({ className }: P) => (
  <svg {...basis} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const Sprechblase = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.6L4 20z" />
  </svg>
);

export const Links = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const Rechts = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const Menue = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const Schliessen = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const Kamera = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="M4 8h3l2-2h6l2 2h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);
