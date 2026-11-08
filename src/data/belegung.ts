/*
  Belegung der Wohnungen.
  Wird direkt aus den Booking.com-Kalendern geladen (über /api/ical-proxy).
  Es gibt keine erfundenen Beispielbuchungen mehr.
*/
import { useSyncExternalStore } from 'react';
import type { WohnungId } from './wohnungen';

export interface Belegung {
  wohnung: WohnungId;
  von: string; // Anreisetag, JJJJ-MM-TT
  bis: string; // Abreisetag, JJJJ-MM-TT (an diesem Tag ist eine neue Anreise möglich)
}

const KALENDER: { wohnung: WohnungId; url: string }[] = [
  { wohnung: 'simply-good', url: 'https://ical.booking.com/v1/export?t=905a3d45-7b7b-4962-a1b1-a065bcdbe995' },
  { wohnung: 'simply-nice', url: 'https://ical.booking.com/v1/export?t=8a5c57c3-5612-4ae5-bae6-983bed6f59a8' },
];

type Zustand = { belegungen: Belegung[]; status: 'laedt' | 'ok' | 'fehler' };

let zustand: Zustand = { belegungen: [], status: 'laedt' };
const zuhoerer = new Set<() => void>();

function setze(neu: Zustand) {
  zustand = neu;
  zuhoerer.forEach((f) => f());
}

function datum(zeile: string) {
  const m = zeile.match(/:(\d{4})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

export function leseICal(text: string, wohnung: WohnungId): Belegung[] {
  const ergebnis: Belegung[] = [];
  let von: string | null = null;
  let bis: string | null = null;
  for (const roh of text.split(/\r?\n/)) {
    const zeile = roh.trim();
    if (zeile === 'BEGIN:VEVENT') {
      von = bis = null;
    } else if (zeile.startsWith('DTSTART')) {
      von = datum(zeile);
    } else if (zeile.startsWith('DTEND')) {
      bis = datum(zeile);
    } else if (zeile === 'END:VEVENT' && von && bis) {
      ergebnis.push({ wohnung, von, bis });
    }
  }
  return ergebnis;
}

async function lade() {
  const ergebnisse = await Promise.allSettled(
    KALENDER.map(async (k) => {
      const antwort = await fetch(`/api/ical-proxy?url=${encodeURIComponent(k.url)}`);
      if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);
      return leseICal(await antwort.text(), k.wohnung);
    }),
  );
  const belegungen = ergebnisse.flatMap((e) => (e.status === 'fulfilled' ? e.value : []));
  const fehler = ergebnisse.some((e) => e.status === 'rejected');
  setze({ belegungen, status: fehler ? 'fehler' : 'ok' });
}

let gestartet = false;
export function starteBelegungsabgleich() {
  if (gestartet) return;
  gestartet = true;
  lade();
  window.setInterval(lade, 10 * 60 * 1000);
}

export function useBelegung() {
  return useSyncExternalStore(
    (f) => {
      zuhoerer.add(f);
      return () => zuhoerer.delete(f);
    },
    () => zustand,
  );
}
