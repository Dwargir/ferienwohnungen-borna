/*
  Standardwerte der Website.
  Im Betrieb kommen die Inhalte aus /inhalt.json, die über den Admin (/admin/) bearbeitet wird.
  Die Werte hier gelten nur, falls inhalt.json fehlt oder ein Feld leer ist.
*/

export interface Foto {
  src: string;
  titel: string;
}

const bild = (datei: string, titel: string): Foto => ({ src: `/bilder/${datei}`, titel });

export type WohnungId = 'simply-good' | 'simply-nice';

export interface Wohnung {
  id: WohnungId;
  name: string;
  etage: string;
  kurz: string;
  preis: number; // günstigster Preis pro Nacht (für „ab …“)
  preise: { werktags: number; wochenende: number; weihnachten: number };
  personen: number;
  groesse?: string;
  schlafzimmer: number;
  beschreibung: string[];
  raeume: { name: string; text: string }[];
  betten: string[];
  ausstattung: string[];
  hinweise: string[];
  angebot?: string;
  gratisNachtAb?: number; // ab so vielen Nächten ist die günstigste Nacht gratis
  kaminholz: boolean;
  // Gästebewertung auf Booking.com
  bewertung: { note: number; anzahl: number; link: string };
  fotos: Foto[];
  gesperrt: string[]; // zusätzlich gesperrte Nächte (JJJJ-MM-TT), im Admin pflegbar
}

export let ENDREINIGUNG = 25;
export let MINDESTAUFENTHALT = 2;
export let KAMINHOLZ_PRO_KORB = 10;   // Euro pro Korb
export let BABYBETT_PRO_AUFENTHALT = 10; // Euro für den ganzen Aufenthalt

export const KONTAKT = {
  name: 'Uta Finke',
  strasse: 'Robert-Koch-Straße 26',
  ort: '04552 Borna',
  telefon: '0178 1895560',
  telefonLink: 'tel:+491781895560',
  whatsapp: '491781895560',
  email: 'utafinke@web.de',
  karte: 'https://www.google.com/maps/search/?api=1&query=Robert-Koch-Stra%C3%9Fe+26+04552+Borna',
};

export const wohnungen: Wohnung[] = [
  {
    id: 'simply-good',
    name: 'Simply Good',
    etage: 'Erdgeschoss',
    kurz: 'Mit Kamin und eigener Terrasse',
    preis: 95,
    preise: { werktags: 95, wochenende: 112, weihnachten: 117 },
    personen: 3,
    groesse: '50 m²',
    schlafzimmer: 1,
    beschreibung: [
      'Die Wohnung liegt ruhig im Erdgeschoss einer Stadtvilla am Stadtrand von Borna. Auf 50 m² ist Platz für bis zu drei Personen.',
      'Über einen Schlüsselsafe können Sie jederzeit selbst einchecken. Fahrräder stehen sicher und kostenlos in der Garage, Leihräder sind vorhanden.',
    ],
    raeume: [
      { name: 'Wohnzimmer', text: 'Gemütlicher Wohnbereich mit Kamin' },
      { name: 'Küche', text: 'Herd, Mikrowelle, Toaster, Wasserkocher, Kaffee- und Espressomaschine, Geschirr' },
      { name: 'Schlafzimmer', text: 'Boxspringbett 180 × 200 cm' },
      { name: 'Bad', text: 'Dusche, Duschgel, Föhn' },
      { name: 'Terrasse', text: 'Mit Sitzgruppe, Rauchen erlaubt' },
    ],
    betten: ['Boxspringbett 180 × 200 cm', 'Sofa als Aufbettung (auf Anfrage)', 'Babybett für 10 € pro Aufenthalt'],
    ausstattung: [
      'WLAN', 'Smart-TV', 'Kamin', 'Kaffeemaschine', 'Espressomaschine', 'Bettwäsche und Handtücher',
      'Föhn', 'Bügeleisen', 'Hygieneartikel', 'Parkplatz vor dem Haus', 'Leihräder', 'Fahrradgarage', 'Garten', 'Grillplatz',
    ],
    hinweise: [
      'Rauchen bitte nur auf der Terrasse',
      'Kostenloser Parkplatz direkt vor der Wohnung',
      'Kaminholz für 10 € pro Korb',
    ],
    angebot: 'Ab 7 Nächten ist eine Nacht gratis.',
    gratisNachtAb: 7,
    kaminholz: true,
    bewertung: { note: 8.9, anzahl: 61, link: 'https://www.booking.com/hotel/de/simply-good-appartment.de.html' },
    fotos: [
      bild('good-01-wohnzimmer.jpg', 'Wohnzimmer'),
      bild('good-02-wohnzimmer-mit-kamin.jpg', 'Wohnzimmer mit Kamin'),
      bild('good-03-schlafzimmer.jpg', 'Schlafzimmer'),
      bild('good-04-kueche-mit-tuer-zur-terrasse.jpg', 'Küche mit Tür zur Terrasse'),
      bild('good-05-bad.jpg', 'Bad'),
      bild('good-06-terrasse.jpg', 'Terrasse'),
    ],
    gesperrt: ['2026-12-24', '2026-12-25', '2026-12-26'],
  },
  {
    id: 'simply-nice',
    name: 'Simply Nice',
    etage: 'Dachgeschoss',
    kurz: 'Zwei getrennte Schlafzimmer',
    preis: 92,
    preise: { werktags: 92, wochenende: 109, weihnachten: 112 },
    personen: 3,
    groesse: '50 m²',
    schlafzimmer: 2,
    beschreibung: [
      'Simply Nice liegt im Dachgeschoss der Stadtvilla. Auf 50 m² gibt es zwei getrennte Schlafzimmer mit je einem Einzelbett und eine Schlafcouch – Platz für bis zu drei Personen, und jeder hat seinen Rückzugsort.',
      'Dazu gibt es ein Bad mit Wanne und Dusche, eine ausgestattete Küche und Smart-TV. Bettwäsche und Handtücher sind inklusive.',
    ],
    raeume: [
      { name: 'Schlafzimmer 1', text: 'Einzelbett, Sitzecke mit Schlafcouch' },
      { name: 'Schlafzimmer 2', text: 'Einzelbett, Sessel, Dachfenster' },
      { name: 'Küche', text: 'Mikrowelle, Toaster, Wasserkocher, Kaffeemaschine, Kaffee und Tee' },
      { name: 'Bad', text: 'Badewanne und Dusche, Duschgel, Föhn' },
    ],
    betten: ['Zwei Einzelbetten, eins pro Schlafzimmer', 'Eine Schlafcouch als drittes Bett', 'Babybett für 10 € pro Aufenthalt'],
    ausstattung: [
      'WLAN', 'Smart-TV', 'Badewanne und Dusche', 'Kaffeemaschine', 'Bettwäsche und Handtücher',
      'Föhn', 'Bügeleisen', 'Hygieneartikel', 'Parkplatz', 'Fahrradgarage',
    ],
    hinweise: [
      'Anreise ab 15 Uhr, Abreise bis 11 Uhr',
      'Rauchen in der Wohnung nicht gestattet',
      'Haustiere sind nicht erlaubt',
      'Nur über die Treppe erreichbar',
      'Autobahn A72, Abfahrt Borna-Nord',
    ],
    kaminholz: false,
    bewertung: { note: 8.7, anzahl: 29, link: 'https://www.booking.com/hotel/de/simply-nice-appartment.de.html' },
    fotos: [
      bild('nice-01-schlafzimmer-mit-sitzecke.jpg', 'Schlafzimmer mit Sitzecke'),
      bild('nice-02-zimmer-unter-dem-dach.jpg', 'Zimmer unter dem Dach'),
      bild('nice-03-zimmer-mit-schlafcouch.jpg', 'Zimmer mit Schlafcouch'),
      bild('nice-04-kueche.jpg', 'Küche'),
      bild('nice-05-fernseher-und-sideboard.jpg', 'Fernseher und Sideboard'),
    ],
    gesperrt: [],
  },
];

// Startseite
export const startseite = {
  titel: 'Ferienwohnungen in Borna',
  einleitung: 'Zwei gemütliche Wohnungen in einer Stadtvilla mit Garten – mitten im Leipziger Neuseenland.',
  wohnungenUeberschrift: 'Unsere beiden Wohnungen für Ihre perfekte Auszeit',
  lageUeberschrift: 'Ruhig wohnen, schnell überall',
  lageText: 'Das Haus liegt in einer ruhigen Straße am Stadtrand von Borna. Geparkt wird direkt vor der Tür.',
  titelbild: bild('haus-garten.jpg', 'Das Haus mit blühenden Hortensien im Garten'),
  lageBilder: [
    bild('haus-eingang.jpg', 'Eingang mit Sitzbank'),
    bild('haus-aussicht.jpg', 'Blick über die Nachbarschaft'),
    bild('haus-luftbild.jpg', 'Luftbild mit den Seen am Horizont'),
  ],
  lagePunkte: [
    { wert: '5 Min.', text: 'zu Fuß zu Bäcker, Supermarkt und Café' },
    { wert: '30 Min.', text: 'mit Auto oder S-Bahn nach Leipzig' },
    { wert: 'Seen', text: 'zum Baden und Radfahren gleich in der Nähe' },
  ],
};

export const umgebung = [
  { name: 'Einkaufen', text: 'Aldi, Netto, dm, Bäcker, Café und Tankstelle – fünf Minuten zu Fuß.' },
  { name: 'Leipzig', text: '20 bis 30 Minuten mit dem Auto über die A72 oder mit der S-Bahn.' },
  { name: 'Neuseenland', text: 'Baden, Radfahren und Wassersport an den Seen rund um Borna. Am Markkleeberger See gibt es eine Wildwasseranlage.' },
  { name: 'Ausflüge', text: 'Freizeitpark Belantis, Bergbau-Technik-Park, die Skatstadt Altenburg und das Kohrener Land.' },
  { name: 'In Borna', text: 'Romanische Emmauskirche, Stadtmuseum und der Lutherweg.' },
  { name: 'Weiter weg', text: 'Chemnitz liegt etwa 50 km entfernt, Dresden gut eine Stunde.' },
];

export function wohnungById(id: string | undefined) {
  return wohnungen.find((w) => w.id === id);
}

export function euro(betrag: number) {
  return betrag.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

export function note(n: number) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

// Stärken aus Booking.com für die Startseite – Werte bei Bedarf hier aktualisieren
export const highlights = [
  { wert: '9,3', titel: 'Lage', text: 'So bewerten Gäste die ruhige Lage am Stadtrand.' },
  { wert: '9,4', titel: 'Gastgeberin', text: 'Gäste loben die herzliche Betreuung.' },
  { wert: 'WLAN', titel: 'Ideal zum Arbeiten', text: 'Kostenloses WLAN und ein ruhiger Platz – gut für Geschäftsreisen.' },
  { wert: 'Level 2', titel: 'Nachhaltiger reisen', text: 'Ausgezeichnet im Programm von Booking.com.' },
];

// Bezeichnungen der Preisstufen (Preise pro Nacht)
export const PREISSTUFEN = [
  { key: 'werktags', name: 'Sonntag bis Donnerstag' },
  { key: 'wochenende', name: 'Freitag und Samstag' },
  { key: 'weihnachten', name: 'Weihnachten' },
] as const;

export let DIREKT_VORTEIL = 'Profitieren Sie von unseren Preisen für Direktbuchungen.';
export const DIREKT_HINWEIS = 'Diese Preise gelten, wenn Sie direkt bei uns anfragen und buchen – per Telefon, WhatsApp oder E-Mail.';

/* ---------- Inhalte aus inhalt.json übernehmen ---------- */

// Hilfen: nur übernehmen, was wirklich da ist
const txt = (v: unknown, alt: string) => (typeof v === 'string' && v.trim() ? v.trim() : alt);
const zahl = (v: unknown, alt: number) => (typeof v === 'number' && isFinite(v) && v >= 0 ? v : alt);
const liste = <T,>(v: unknown, umwandeln: (x: Record<string, unknown>) => T | null, alt: T[]) => {
  if (!Array.isArray(v)) return alt;
  const neu = v.map((x) => (x && typeof x === 'object' ? umwandeln(x as Record<string, unknown>) : null)).filter((x): x is T => x !== null);
  return neu;
};
const textListe = (v: unknown, alt: string[]) =>
  liste(v, (x) => (typeof x.text === 'string' && x.text.trim() ? x.text.trim() : null), alt.map((t) => t)) as string[];
const fotoListe = (v: unknown, alt: Foto[]) =>
  liste(v, (x) => (typeof x.datei === 'string' && /^[a-z0-9._-]+$/i.test(x.datei) ? { src: `/bilder/${x.datei}`, titel: typeof x.text === 'string' ? x.text : '' } : null), alt);
const datumListe = (v: unknown, alt: string[]) => (Array.isArray(v) ? v.filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) : alt);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function uebernehmeInhalt(i: any) {
  if (!i || typeof i !== 'object') return;

  const k = i.kontakt ?? {};
  KONTAKT.name = txt(k.name, KONTAKT.name);
  KONTAKT.strasse = txt(k.strasse, KONTAKT.strasse);
  KONTAKT.ort = txt(k.ort, KONTAKT.ort);
  KONTAKT.email = txt(k.email, KONTAKT.email);
  if (txt(k.telefon, '')) {
    KONTAKT.telefon = k.telefon.trim();
    const ziffern = KONTAKT.telefon.replace(/[^0-9+]/g, '');
    const international = ziffern.startsWith('+') ? ziffern.slice(1) : ziffern.startsWith('00') ? ziffern.slice(2) : '49' + ziffern.replace(/^0/, '');
    KONTAKT.telefonLink = `tel:+${international}`;
    KONTAKT.whatsapp = international;
  }
  KONTAKT.karte = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${KONTAKT.strasse} ${KONTAKT.ort}`)}`;

  const a = i.allgemein ?? {};
  ENDREINIGUNG = zahl(a.endreinigung, ENDREINIGUNG);
  MINDESTAUFENTHALT = Math.max(1, Math.round(zahl(a.mindestaufenthalt, MINDESTAUFENTHALT)));
  KAMINHOLZ_PRO_KORB = zahl(a.kaminholz_pro_korb, KAMINHOLZ_PRO_KORB);
  BABYBETT_PRO_AUFENTHALT = zahl(a.babybett, BABYBETT_PRO_AUFENTHALT);
  DIREKT_VORTEIL = txt(a.direkt_vorteil, DIREKT_VORTEIL);

  const st = i.startseite ?? {};
  startseite.titel = txt(st.titel, startseite.titel);
  startseite.einleitung = txt(st.einleitung, startseite.einleitung);
  startseite.wohnungenUeberschrift = txt(st.wohnungen_ueberschrift, startseite.wohnungenUeberschrift);
  startseite.lageUeberschrift = txt(st.lage_ueberschrift, startseite.lageUeberschrift);
  startseite.lageText = txt(st.lage_text, startseite.lageText);
  const titelbild = fotoListe(st.titelbild, [startseite.titelbild]);
  if (titelbild[0]) startseite.titelbild = titelbild[0];
  const lb = fotoListe(st.lage_bilder, startseite.lageBilder);
  if (lb.length) startseite.lageBilder = lb;
  const lp = liste(st.lage_punkte, (x) => (txt(x.wert, '') && txt(x.text, '') ? { wert: String(x.wert).trim(), text: String(x.text).trim() } : null), startseite.lagePunkte);
  if (lp.length) startseite.lagePunkte = lp;

  const hl = liste(i.highlights, (x) => (txt(x.titel, '') ? { wert: txt(x.wert, ''), titel: String(x.titel).trim(), text: txt(x.text, '') } : null), highlights);
  highlights.splice(0, highlights.length, ...hl);

  if (Array.isArray(i.wohnungen)) {
    for (const w of wohnungen) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = i.wohnungen.find((x: any) => x && x._id === w.id);
      if (!d) continue;
      w.name = txt(d.name, w.name);
      w.etage = txt(d.etage, w.etage);
      w.kurz = txt(d.kurz, w.kurz);
      w.preise = {
        werktags: zahl(d.preis_werktags, w.preise.werktags),
        wochenende: zahl(d.preis_wochenende, w.preise.wochenende),
        weihnachten: zahl(d.preis_weihnachten, w.preise.weihnachten),
      };
      w.preis = Math.min(w.preise.werktags, w.preise.wochenende);
      w.personen = Math.round(zahl(d.personen, w.personen));
      w.groesse = txt(d.groesse, w.groesse ?? '') || undefined;
      w.schlafzimmer = Math.round(zahl(d.schlafzimmer, w.schlafzimmer));
      if (txt(d.beschreibung, '')) w.beschreibung = String(d.beschreibung).split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
      w.raeume = liste(d.raeume, (x) => (txt(x.name, '') ? { name: String(x.name).trim(), text: txt(x.text, '') } : null), w.raeume);
      w.betten = textListe(d.betten, w.betten);
      w.ausstattung = textListe(d.ausstattung, w.ausstattung);
      w.hinweise = textListe(d.hinweise, w.hinweise);
      w.angebot = typeof d.angebot === 'string' ? d.angebot.trim() || undefined : w.angebot;
      w.gratisNachtAb = typeof d.gratis_nacht_ab === 'number' ? (d.gratis_nacht_ab > 0 ? d.gratis_nacht_ab : undefined) : w.gratisNachtAb;
      w.bewertung = {
        note: zahl(d.bewertung_note, w.bewertung.note),
        anzahl: Math.round(zahl(d.bewertung_anzahl, w.bewertung.anzahl)),
        link: txt(d.bewertung_link, w.bewertung.link),
      };
      w.fotos = fotoListe(d.fotos, w.fotos);
      w.gesperrt = datumListe(d.gesperrt, w.gesperrt);
    }
  }
}

export async function ladeInhalt() {
  try {
    const antwort = await fetch('/inhalt.json', { cache: 'no-store' });
    if (antwort.ok) uebernehmeInhalt(await antwort.json());
  } catch {
    // ohne inhalt.json gelten die Standardwerte
  }
}
