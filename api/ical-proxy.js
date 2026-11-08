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
      const termine = [...data.matchAll(/DTSTART[^:]*:(\d{8})[\s\S]*?DTEND[^:]*:(\d{8})/g)].map((m) => `${m[1]} bis ${m[2]}`);
      return res.status(200).json({
        ok: true,
        istKalender: data.includes('BEGIN:VCALENDAR'),
        anzahlTermine: termine.length,
        termine: termine.slice(0, 20),
        anfang: data.slice(0, 200),
      });
    }
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    // 5 Minuten zwischenspeichern, damit Booking.com nicht bei jedem Besuch gefragt wird
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(502).json({ error: 'Booking.com nicht erreichbar', details: String(error) });
  }
}
