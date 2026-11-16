/*
  SEO-Einstellungen: Adresse der Website, Seitentitel und Beschreibungen für Google.
  Wird beim Bauen (scripts/seo-seiten.mjs) und von der Seite selbst genutzt.

  WICHTIG: SITE_URL auf die endgültige Domain setzen, sobald sie bei IONOS verbunden ist.
*/
export const SITE_URL = 'https://www.borna-fewo.de';
export const SITE_NAME = 'Ferienwohnungen Borna';

export const SEITEN = {
  '/': {
    titel: 'Ferienwohnungen in Borna – Leipziger Neuseenland',
    beschreibung:
      'Zwei Ferienwohnungen in einer Stadtvilla in Borna: mit Kamin und Terrasse oder mit zwei Schlafzimmern. Ruhig, mit Parkplatz, 30 Minuten nach Leipzig.',
    bild: 'haus-garten.jpg',
  },
  '/simply-good': {
    titel: 'Simply Good – Ferienwohnung mit Kamin und Terrasse in Borna',
    beschreibung:
      'Simply Good: 50 m² Ferienwohnung im Erdgeschoss einer Stadtvilla in Borna, mit Kamin, eigener Terrasse, Boxspringbett und Parkplatz. Für bis zu 3 Personen.',
    bild: 'good-02-wohnzimmer-mit-kamin.jpg',
  },
  '/simply-nice': {
    titel: 'Simply Nice – Ferienwohnung mit zwei Schlafzimmern in Borna',
    beschreibung:
      'Simply Nice: 50 m² Ferienwohnung im Dachgeschoss in Borna mit zwei getrennten Schlafzimmern, Bad mit Wanne und Küche. Für bis zu 3 Personen.',
    bild: 'nice-01-schlafzimmer-mit-sitzecke.jpg',
  },
  '/verfuegbarkeit': {
    titel: 'Belegung und Preise – Ferienwohnungen Borna',
    beschreibung:
      'Freie Termine und Preise der Ferienwohnungen Simply Good und Simply Nice in Borna. Günstigere Preise bei Direktbuchung, alle Extras auf einen Blick.',
    bild: 'haus-garten.jpg',
  },
  '/kontakt': {
    titel: 'Ferienwohnung in Borna anfragen – Preis sofort berechnen',
    beschreibung:
      'Wunschtermin im Kalender wählen, Preis sofort sehen und die Anfrage per E-Mail oder WhatsApp senden. Ferienwohnungen Borna, Robert-Koch-Straße 26.',
    bild: 'haus-eingang.jpg',
  },
  '/impressum': {
    titel: 'Impressum – Ferienwohnungen Borna',
    beschreibung: 'Impressum der Ferienwohnungen Borna, Uta Finke, Robert-Koch-Straße 26, 04552 Borna.',
    noindex: false,
  },
  '/datenschutz': {
    titel: 'Datenschutz – Ferienwohnungen Borna',
    beschreibung: 'Datenschutzerklärung der Ferienwohnungen Borna.',
  },
};
