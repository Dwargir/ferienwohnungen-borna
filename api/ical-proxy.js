// api/ical-proxy.js
// Holt die Belegungskalender von Booking.com, damit der Browser sie anzeigen kann.
// Aus Sicherheitsgründen werden nur Adressen von ical.booking.com weitergeleitet.

const ERLAUBTE_HOSTS = ['ical.booking.com', 'admin.booking.com'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;
  let ziel;
  try {
    ziel = new URL(String(url));
  } catch {
    return res.status(400).json({ error: 'Missing or invalid url parameter' });
  }
  if (ziel.protocol !== 'https:' || !ERLAUBTE_HOSTS.includes(ziel.hostname)) {
    return res.status(403).json({ error: 'Host not allowed' });
  }

  try {
    const response = await fetch(ziel, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    const data = await response.text();
    if (!response.ok) {
      return res.status(502).json({
        error: 'Booking.com hat die Anfrage abgelehnt',
        status: response.status,
        antwort: data.slice(0, 300),
      });
    }
    // ?pruefen=1 zeigt eine kurze Zusammenfassung statt der Rohdaten
    if (req.query.pruefen) {
      const bloecke = data.split(/BEGIN:VEVENT/i).slice(1).map((b) => b.split(/END:VEVENT/i)[0]);
      const tag = (b, feld) => {
        const m = b.match(new RegExp('\\n' + feld + '[^:\\n]*:(\\d{8})', 'i'));
        return m ? m[1] : null;
      };
      const termine = bloecke.map((b) => {
        const art = (b.match(/\nSUMMARY[^:\n]*:([^\r\n]*)/i) || [])[1] || '';
        return `${tag(b, 'DTSTART')} bis ${tag(b, 'DTEND') || '(kein Ende)'} ${art}`.trim();
      });
      return res.status(200).json({
        ok: true,
        anzahlTermine: termine.length,
        termine,
        rohdaten: data.slice(0, 1500),
      });
    }
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    // 1 Minute zwischenspeichern, damit Booking.com nicht bei jedem Besuch gefragt wird
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.status(200).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(502).json({ error: 'Booking.com nicht erreichbar', details: String(error) });
  }
}
