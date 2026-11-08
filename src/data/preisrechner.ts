/*
  Preisberechnung für eine Anfrage.
  Eine Nacht wird nach dem Tag berechnet, an dem sie beginnt:
  - Freitag und Samstag: Wochenendpreis
  - Weihnachtsnächte (siehe WEIHNACHTSNAECHTE): Weihnachtspreis
  - alle anderen Nächte: Preis Sonntag bis Donnerstag
*/
import { ENDREINIGUNG, KAMINHOLZ_PRO_KORB, BABYBETT_PRO_AUFENTHALT } from './wohnungen';
import type { Wohnung } from './wohnungen';

// Nächte mit Weihnachtspreis, als Monat-Tag (Nacht vom 24. auf den 25. = '12-24')
export const WEIHNACHTSNAECHTE = ['12-24', '12-25', '12-26'];

export function isoDatum(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function ausIso(iso: string) {
  const [j, m, t] = iso.split('-').map(Number);
  return new Date(j, m - 1, t);
}

export function naechte(von: string, bis: string): string[] {
  const liste: string[] = [];
  const d = ausIso(von);
  const ende = ausIso(bis);
  while (d < ende) {
    liste.push(isoDatum(d));
    d.setDate(d.getDate() + 1);
  }
  return liste;
}

export function nachtPreis(w: Wohnung, iso: string) {
  if (WEIHNACHTSNAECHTE.includes(iso.slice(5))) return { stufe: 'weihnachten' as const, preis: w.preise.weihnachten };
  const tag = ausIso(iso).getDay(); // 5 = Freitag, 6 = Samstag
  if (tag === 5 || tag === 6) return { stufe: 'wochenende' as const, preis: w.preise.wochenende };
  return { stufe: 'werktags' as const, preis: w.preise.werktags };
}

export interface Extras {
  koerbeKaminholz: number;
  babybett: boolean;
}

export function berechne(w: Wohnung, von: string, bis: string, extras: Extras = { koerbeKaminholz: 0, babybett: false }) {
  const liste = naechte(von, bis).map((n) => ({ nacht: n, ...nachtPreis(w, n) }));
  const zeilen = (['werktags', 'wochenende', 'weihnachten'] as const)
    .map((stufe) => {
      const passende = liste.filter((n) => n.stufe === stufe);
      return { stufe, anzahl: passende.length, einzel: w.preise[stufe], summe: passende.reduce((a, n) => a + n.preis, 0) };
    })
    .filter((z) => z.anzahl > 0);
  const uebernachtung = liste.reduce((a, n) => a + n.preis, 0);
  const rabatt = w.gratisNachtAb && liste.length >= w.gratisNachtAb ? Math.min(...liste.map((n) => n.preis)) : 0;
  const zusatz: { text: string; betrag: number }[] = [];
  if (w.kaminholz && extras.koerbeKaminholz > 0) {
    zusatz.push({
      text: `Kaminholz, ${extras.koerbeKaminholz} ${extras.koerbeKaminholz === 1 ? 'Korb' : 'Körbe'} × ${KAMINHOLZ_PRO_KORB} €`,
      betrag: extras.koerbeKaminholz * KAMINHOLZ_PRO_KORB,
    });
  }
  if (extras.babybett) zusatz.push({ text: 'Babybett, für den ganzen Aufenthalt', betrag: BABYBETT_PRO_AUFENTHALT });
  const zusatzSumme = zusatz.reduce((a, z) => a + z.betrag, 0);
  return {
    anzahl: liste.length,
    zeilen,
    rabatt,
    zusatz,
    reinigung: ENDREINIGUNG,
    gesamt: uebernachtung - rabatt + zusatzSumme + ENDREINIGUNG,
  };
}
