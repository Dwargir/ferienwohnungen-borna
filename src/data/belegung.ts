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
const ZUSAETZLICH_GESPERRT: Belegung[] = [
  // Simply Good: 24., 25. und 26. Dezember 2026 geschlossen (Nächte 24.–26., nächste Anreise ab 27.)
  { wohnung: 'simply-good', von: '2026-12-24', bis: '2026-12-27' },
];

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

function plusTage(iso: string, n: number) {
  const [j, m, t] = iso.split('-').map(Number);
  const d = new Date(Date.UTC(j, m - 1, t + n));
  return d.toISOString().slice(0, 10);
}

// DURATION wie P1D, P3D oder P1W in Tage umrechnen
function dauerInTagen(zeile: string) {
  const m = zeile.match(/P(?:(\d+)W)?(?:(\d+)D)?/);
  if (!m) return 1;
  return Math.max(1, Number(m[1] ?? 0) * 7 + Number(m[2] ?? 0));
}

/*
  Liest einen Booking.com-Kalender.
  Robust gegen verschiedene Formen:
  - Einträge ohne Enddatum (z. B. einzelne geschlossene Tage) gelten für eine Nacht
  - Einträge mit DURATION statt Enddatum
  - umgebrochene Zeilen
  Jeder Eintrag zählt als belegt – egal ob gebucht oder geschlossen.
*/
export function leseICal(text: string, wohnung: WohnungId): Belegung[] {
  const zeilen = text.replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
  const ergebnis: Belegung[] = [];
  let imEintrag = false;
  let von: string | null = null;
  let bis: string | null = null;
  let dauer: number | null = null;
  for (const roh of zeilen) {
    const zeile = roh.trim();
    const name = zeile.split(/[;:]/)[0].toUpperCase();
    if (zeile.toUpperCase() === 'BEGIN:VEVENT') {
      imEintrag = true;
      von = bis = null;
      dauer = null;
    } else if (!imEintrag) {
      continue;
    } else if (name === 'DTSTART') {
      von = datum(zeile);
    } else if (name === 'DTEND') {
      bis = datum(zeile);
    } else if (name === 'DURATION') {
      dauer = dauerInTagen(zeile);
    } else if (zeile.toUpperCase() === 'END:VEVENT') {
      imEintrag = false;
      if (!von) continue;
      let ende = bis ?? plusTage(von, dauer ?? 1);
      if (ende <= von) ende = plusTage(von, 1);
      ergebnis.push({ wohnung, von, bis: ende });
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
