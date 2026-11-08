import { note } from '../data/wohnungen';
import type { Wohnung } from '../data/wohnungen';

// Bewertung von Booking.com: Note im Kästchen, daneben Anzahl und Link
export default function Bewertung({ w, gross = false, link = true }: { w: Wohnung; gross?: boolean; link?: boolean }) {
  const { bewertung: b } = w;
  const inhalt = (
    <>
      <span
        className={`shrink-0 inline-flex items-center justify-center rounded-md rounded-bl-none bg-[#003b95] text-white font-semibold tabular-nums ${gross ? 'w-12 h-12 text-xl' : 'w-9 h-9 text-base'}`}
        aria-hidden="true"
      >
        {note(b.note)}
      </span>
      <span className="leading-tight">
        <span className="block font-semibold">{b.note >= 9 ? 'Hervorragend' : b.note >= 8.5 ? 'Fabelhaft' : 'Sehr gut'}</span>
        <span className="block klein text-schilf">
          {b.anzahl} Bewertungen auf Booking.com
        </span>
      </span>
    </>
  );
  const label = `${note(b.note)} von 10 Punkten, ${b.anzahl} Bewertungen auf Booking.com`;
  return link ? (
    <a href={b.link} target="_blank" rel="noopener noreferrer" aria-label={`${label} – auf Booking.com lesen`} className="inline-flex items-center gap-3 no-underline hover:underline underline-offset-4">
      {inhalt}
    </a>
  ) : (
    <span className="inline-flex items-center gap-3" aria-label={label}>{inhalt}</span>
  );
}
