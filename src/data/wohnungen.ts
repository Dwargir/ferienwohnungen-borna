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
  titelbild: string;
  beschreibung: string[];
  raeume: { name: string; text: string }[];
  betten: string[];
  ausstattung: string[];
  hinweise: string[];
  angebot?: string;
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
    preis: 86.4,
    personen: 3,
    groesse: '50 m²',
    schlafzimmer: 1,
    titelbild: '/images/simply-good-main.jpg',
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
      'Föhn', 'Bügeleisen', 'Hygieneartikel', 'Parkplatz vor dem Haus', 'Leihräder', 'Fahrradgarage',
    ],
    hinweise: [
      'Rauchen bitte nur auf der Terrasse',
      'Kostenloser Parkplatz direkt vor der Wohnung',
      'Kaminholz auf Anfrage',
    ],
    angebot: 'Ab 7 Nächten ist eine Nacht gratis.',
  },
  {
    id: 'simply-nice',
    name: 'Simply Nice',
    etage: 'Dachgeschoss',
    kurz: 'Zwei getrennte Schlafzimmer',
    preis: 89,
    personen: 3,
    schlafzimmer: 2,
    titelbild: '/images/simply-nice-main.jpg',
    beschreibung: [
      'Simply Nice liegt im Dachgeschoss der Stadtvilla und hat zwei getrennte Schlafzimmer – gut, wenn zwei Paare oder eine Familie zusammen verreisen und trotzdem jeder seinen Rückzugsort haben möchte.',
      'Dazu gibt es ein Bad mit Wanne und Dusche, eine ausgestattete Küche und Smart-TV. Bettwäsche und Handtücher sind inklusive.',
    ],
    raeume: [
      { name: 'Schlafzimmer 1', text: 'Bett und Schlafcouch' },
      { name: 'Schlafzimmer 2', text: 'Bett und Schlafcouch' },
      { name: 'Küche', text: 'Mikrowelle, Toaster, Wasserkocher, Kaffeemaschine, Kaffee und Tee' },
      { name: 'Bad', text: 'Badewanne und Dusche, Duschgel, Föhn' },
    ],
    betten: ['Je ein Bett pro Schlafzimmer', 'Schlafcouch in beiden Zimmern', 'Babybett (auf Anfrage)'],
    ausstattung: [
      'WLAN', 'Smart-TV', 'Badewanne und Dusche', 'Kaffeemaschine', 'Bettwäsche und Handtücher',
      'Föhn', 'Bügeleisen', 'Hygieneartikel', 'Parkplatz', 'Fahrradgarage',
    ],
    hinweise: [
      'Rauchen in der Wohnung nicht gestattet',
      'Autobahn A72, Abfahrt Borna-Nord',
    ],
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
