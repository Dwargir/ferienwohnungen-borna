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

// Export-Links aus dem Booking.com-Extranet:
// Preise & Verfügbarkeit → Kalender synchronisieren → Kalender exportieren
// Stand: 8. November 2026 (neu erzeugt)
const KALENDER: { wohnung: WohnungId; url: string }[] = [
  { wohnung: 'simply-good', url: 'https://ical.booking.com/v1/export?t=2722b773-cfd4-44ce-8308-6ab7a3b139a6' },
  { wohnung: 'simply-nice', url: 'https://ical.booking.com/v1/export?t=f2d8ec97-c71e-469e-a06b-f6382d4bc212' },
];

export type Status = 'laedt' | 'ok' | 'fehler';
/*
  Zusätzlich gesperrte Tage, falls Booking.com sie (noch) nicht mitschickt.
  von = erste gesperrte Nacht, bis = Tag danach (wie bei einer Abreise).
  Beispiel: 24. bis 26. Dezember gesperrt → { wohnung: 'simply-good', von: '2026-12-24', bis: '2026-12-27' }
*/
const ZUSAETZLICH_GESPERRT: Belegung[] = [];

type Zustand = { belegungen: Belegung[]; status: Status; statusJe: Partial<Record<WohnungId, Status>> };

let zustand: Zustand = { belegungen: [], status: 'laedt', statusJe: {} };
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
  const belegungen = [...ergebnisse.flatMap((e) => (e.status === 'fulfilled' ? e.value : [])), ...ZUSAETZLICH_GESPERRT];
  const statusJe: Partial<Record<WohnungId, Status>> = {};
  ergebnisse.forEach((e, i) => (statusJe[KALENDER[i].wohnung] = e.status === 'fulfilled' ? 'ok' : 'fehler'));
  const fehler = ergebnisse.some((e) => e.status === 'rejected');
  setze({ belegungen, status: fehler ? 'fehler' : 'ok', statusJe });
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

// Status für bestimmte Wohnungen: 'ok' nur, wenn alle geladen wurden
export function statusFuer(z: Zustand, ids: WohnungId[]): Status {
  const liste = ids.map((id) => z.statusJe[id] ?? (z.status === 'laedt' ? 'laedt' : 'fehler'));
  if (liste.includes('fehler')) return 'fehler';
  if (liste.includes('laedt')) return 'laedt';
  return 'ok';
}
