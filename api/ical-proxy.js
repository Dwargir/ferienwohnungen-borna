// api/ical-proxy.js
export default async function handler(req, res) {
  // 1. CORS-Header für alle Antworten setzen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Preflight (OPTIONS) Anfrage direkt erfolgreich beantworten
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. Nur GET-Anfragen erlauben
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 4. Die URL aus dem Query-Parameter holen
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    // 5. Die Anfrage an Booking.com stellen
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Booking.com API error: ${response.status}`);
    }

    const data = await response.text();

    // 6. Die erhaltenen iCal-Daten an den Client zurücksenden
    res.setHeader('Content-Type', 'text/calendar');
    res.status(200).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch iCal data' });
  }
}