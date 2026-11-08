/*
  Alle Angaben zu den beiden Wohnungen an einer Stelle.
  Preise, Texte oder Ausstattung hier ändern – die ganze Website übernimmt das.
*/

export type WohnungId = 'simply-good' | 'simply-nice';

export interface Wohnung {
  id: WohnungId;
  name: string;
  etage: string;
  kurz: string;
  preis: number;
  personen: number;
  groesse?: string;
  schlafzimmer: number;
  beschreibung: string[];
  raeume: { name: string; text: string }[];
  betten: string[];
  ausstattung: string[];
  hinweise: string[];
  angebot?: string;
  // Gästebewertung auf Booking.com – bei Bedarf hier aktualisieren
  bewertung: { note: number; anzahl: number; link: string };
}

export const ENDREINIGUNG = 25;
export const MINDESTAUFENTHALT = 2;

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
    betten: ['Boxspringbett 180 × 200 cm', 'Sofa als Aufbettung (auf Anfrage)', 'Babybett (auf Anfrage)'],
    ausstattung: [
      'WLAN', 'Smart-TV', 'Kamin', 'Kaffeemaschine', 'Espressomaschine', 'Bettwäsche und Handtücher',
      'Föhn', 'Bügeleisen', 'Hygieneartikel', 'Parkplatz vor dem Haus', 'Leihräder', 'Fahrradgarage', 'Garten', 'Grillplatz',
    ],
    hinweise: [
      'Rauchen bitte nur auf der Terrasse',
      'Kostenloser Parkplatz direkt vor der Wohnung',
      'Kaminholz auf Anfrage',
    ],
    angebot: 'Ab 7 Nächten ist eine Nacht gratis.',
    bewertung: { note: 8.9, anzahl: 61, link: 'https://www.booking.com/hotel/de/simply-good-appartment.de.html' },
  },
  {
    id: 'simply-nice',
    name: 'Simply Nice',
    etage: 'Dachgeschoss',
    kurz: 'Zwei getrennte Schlafzimmer',
    preis: 92,
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
    betten: ['Zwei Einzelbetten, eins pro Schlafzimmer', 'Eine Schlafcouch als drittes Bett', 'Babybett (auf Anfrage)'],
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
    bewertung: { note: 8.7, anzahl: 29, link: 'https://www.booking.com/hotel/de/simply-nice-appartment.de.html' },
  },
];

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
