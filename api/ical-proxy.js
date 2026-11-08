// api/ical-proxy.js
// Holt die Belegungskalender von Booking.com, damit der Browser sie anzeigen kann.
// Aus Sicherheitsgründen werden nur Adressen von ical.booking.com weitergeleitet.

const ERLAUBTE_HOSTS = ['ical.booking.com'];

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
    if (!response.ok) {
      throw new Error(`Booking.com API error: ${response.status}`);
    }
    const data = await response.text();
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    // 5 Minuten zwischenspeichern, damit Booking.com nicht bei jedem Besuch gefragt wird
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(502).json({ error: 'Failed to fetch iCal data' });
  }
}
