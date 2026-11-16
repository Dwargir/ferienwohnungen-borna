/*
  Läuft nach „vite build“ und macht die Seite für Google fertig:
  - eine eigene HTML-Datei je Unterseite (simply-good.html usw.) mit passendem Titel,
    Beschreibung, Vorschaubild für WhatsApp/Facebook und strukturierten Daten
  - lesbarer Grundinhalt in jeder Datei (Google und Besucher ohne JavaScript sehen Text)
  - sitemap.xml und robots.txt
  Die Inhalte kommen aus dist/inhalt.json (vom Admin gepflegt).
*/
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE_URL, SITE_NAME, SEITEN } from '../seo.config.mjs';

const wurzel = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(wurzel, 'dist');
const vorlage = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const inhalt = JSON.parse(fs.readFileSync(path.join(dist, 'inhalt.json'), 'utf8'));

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (p) => SITE_URL + (p === '/' ? '/' : p);
const bildUrl = (datei) => `${SITE_URL}/bilder/${encodeURIComponent(datei)}`;

const k = inhalt.kontakt ?? {};
const telefonZiffern = String(k.telefon ?? '').replace(/[^0-9+]/g, '');
const telefonInt = telefonZiffern.startsWith('+') ? telefonZiffern : '+49' + telefonZiffern.replace(/^0/, '');
const [plz, ...ortTeile] = String(k.ort ?? '').split(' ');
const wohnungen = inhalt.wohnungen ?? [];

/* ---------- strukturierte Daten ---------- */

const unterkunftId = `${SITE_URL}/#unterkunft`;
const unterkunft = {
  '@type': 'LodgingBusiness',
  '@id': unterkunftId,
  name: SITE_NAME,
  url: url('/'),
  description: SEITEN['/'].beschreibung,
  image: [bildUrl(SEITEN['/'].bild)],
  telephone: telefonInt,
  email: k.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: k.strasse,
    postalCode: plz,
    addressLocality: ortTeile.join(' '),
    addressRegion: 'Sachsen',
    addressCountry: 'DE',
  },
  amenityFeature: ['Kostenloses WLAN', 'Kostenloser Parkplatz', 'Garten', 'Fahrradgarage'].map((name) => ({
    '@type': 'LocationFeatureSpecification',
    name,
    value: true,
  })),
  containsPlace: wohnungen.map((w) => ({ '@id': `${url('/' + w._id)}#wohnung` })),
};

function wohnungDaten(w) {
  const qm = parseFloat(String(w.groesse ?? '').replace(',', '.'));
  return {
    '@type': 'Apartment',
    '@id': `${url('/' + w._id)}#wohnung`,
    name: w.name,
    description: SEITEN['/' + w._id]?.beschreibung ?? w.kurz,
    url: url('/' + w._id),
    image: (w.fotos ?? []).slice(0, 6).map((f) => bildUrl(f.datei)),
    ...(w.schlafzimmer ? { numberOfBedrooms: w.schlafzimmer, numberOfRooms: w.schlafzimmer } : {}),
    occupancy: { '@type': 'QuantitativeValue', maxValue: w.personen, unitText: 'Personen' },
    ...(qm ? { floorSize: { '@type': 'QuantitativeValue', value: qm, unitCode: 'MTK' } } : {}),
    ...(w.etage ? { floorLevel: w.etage } : {}),
    amenityFeature: (w.ausstattung ?? []).map((a) => ({ '@type': 'LocationFeatureSpecification', name: a.text, value: true })),
    containedInPlace: { '@id': unterkunftId },
  };
}

function brotkrumen(seite, name) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: url('/') },
      { '@type': 'ListItem', position: 2, name, item: url(seite) },
    ],
  };
}

function strukturierteDaten(seite) {
  const graph = [];
  if (seite === '/') {
    graph.push({ '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE_NAME, url: url('/'), inLanguage: 'de-DE' });
    graph.push(unterkunft, ...wohnungen.map(wohnungDaten));
  } else {
    const w = wohnungen.find((x) => '/' + x._id === seite);
    if (w) graph.push(wohnungDaten(w), unterkunft, brotkrumen(seite, w.name));
    else if (seite === '/verfuegbarkeit' || seite === '/kontakt') graph.push(unterkunft, brotkrumen(seite, SEITEN[seite].titel.split(' – ')[0]));
  }
  if (!graph.length) return '';
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}

/* ---------- lesbarer Grundinhalt (wird beim Laden durch die Seite ersetzt) ---------- */

const nav = `<nav><a href="/">Startseite</a> · ${wohnungen.map((w) => `<a href="/${esc(w._id)}">${esc(w.name)}</a>`).join(' · ')} · <a href="/verfuegbarkeit">Belegung und Preise</a> · <a href="/kontakt">Anfragen</a></nav>`;
const kontaktText = `<p>${esc(k.name)}, ${esc(k.strasse)}, ${esc(k.ort)} · Telefon und WhatsApp: <a href="tel:${esc(telefonInt)}">${esc(k.telefon)}</a> · E-Mail: <a href="mailto:${esc(k.email)}">${esc(k.email)}</a></p>`;
// Preise stehen bewusst nicht im Grundinhalt: sie ändern sich im Admin, die Seite zeigt sie immer aktuell.

function grundinhalt(seite) {
  const st = inhalt.startseite ?? {};
  let teil = '';
  if (seite === '/') {
    teil = `<h1>${esc(st.titel)}</h1><p>${esc(st.einleitung)}</p><h2>${esc(st.wohnungen_ueberschrift)}</h2>${wohnungen
      .map((w) => `<h3><a href="/${esc(w._id)}">${esc(w.name)}</a></h3><p>${esc(w.etage)}. ${esc(w.kurz)}. Bis ${esc(w.personen)} Personen.</p>`)
      .join('')}<h2>${esc(st.lage_ueberschrift)}</h2><p>${esc(st.lage_text)}</p>`;
  } else {
    const w = wohnungen.find((x) => '/' + x._id === seite);
    if (w) {
      teil = `<h1>${esc(w.name)} – Ferienwohnung in Borna</h1><p>${esc(w.etage)}. ${esc(w.kurz)}.</p>${String(w.beschreibung ?? '')
        .split(/\n\s*\n/)
        .map((a) => `<p>${esc(a)}</p>`)
        .join('')}<h2>Räume</h2><ul>${(w.raeume ?? []).map((r) => `<li>${esc(r.name)}: ${esc(r.text)}</li>`).join('')}</ul><h2>Ausstattung</h2><ul>${(w.ausstattung ?? []).map((a) => `<li>${esc(a.text)}</li>`).join('')}</ul>`;
    } else if (seite === '/verfuegbarkeit') {
      teil = `<h1>Belegung und Preise</h1><p>Freie Termine und aktuelle Preise der Wohnungen ${wohnungen.map((w) => esc(w.name)).join(' und ')}. Bei Direktbuchung gelten unsere günstigeren Preise.</p>`;
    } else if (seite === '/kontakt') {
      teil = `<h1>Anfrage</h1><p>Wählen Sie Ihren Wunschtermin und senden Sie die Anfrage per E-Mail oder WhatsApp.</p>`;
    } else {
      teil = `<h1>${esc(SEITEN[seite].titel.split(' – ')[0])}</h1>`;
    }
  }
  return `<div class="grundinhalt">${nav}<main>${teil}</main>${kontaktText}</div>`;
}

/* ---------- Dateien schreiben ---------- */

function kopf(seite) {
  const s = SEITEN[seite];
  const bild = s.bild ? bildUrl(s.bild) : bildUrl(SEITEN['/'].bild);
  return [
    `<title>${esc(s.titel)}</title>`,
    `<meta name="description" content="${esc(s.beschreibung)}" />`,
    `<link rel="canonical" href="${esc(url(seite))}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="de_DE" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:title" content="${esc(s.titel)}" />`,
    `<meta property="og:description" content="${esc(s.beschreibung)}" />`,
    `<meta property="og:url" content="${esc(url(seite))}" />`,
    `<meta property="og:image" content="${esc(bild)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    strukturierteDaten(seite),
  ]
    .filter(Boolean)
    .join('\n    ');
}

for (const seite of Object.keys(SEITEN)) {
  const html = vorlage
    .replace(/<!--SEO-START-->[\s\S]*?<!--SEO-END-->/, () => kopf(seite))
    .replace('<!--INHALT-->', () => grundinhalt(seite));
  const datei = seite === '/' ? 'index.html' : `${seite.slice(1)}.html`;
  fs.writeFileSync(path.join(dist, datei), html);
}

const heute = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(SEITEN)
  .map((s) => `  <url><loc>${url(s)}</loc><lastmod>${heute}</lastmod></url>`)
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`SEO: ${Object.keys(SEITEN).length} Seiten, sitemap.xml und robots.txt erstellt (${SITE_URL})`);
