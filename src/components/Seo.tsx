import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @ts-expect-error – gemeinsame SEO-Einstellungen (JavaScript-Datei im Hauptordner)
import { SITE_URL, SEITEN } from '../../seo.config.mjs';

type Seite = { titel: string; beschreibung: string };

function setzeMeta(selektor: string, attribut: string, wert: string) {
  const el = document.head.querySelector(selektor);
  if (el) el.setAttribute(attribut, wert);
}

// Passt Titel, Beschreibung und Canonical beim Wechsel zwischen den Unterseiten an
export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const pfad = pathname.replace(/\/+$/, '') || '/';
    const s: Seite | undefined = (SEITEN as Record<string, Seite>)[pfad];
    if (!s) return;
    document.title = s.titel;
    setzeMeta('meta[name="description"]', 'content', s.beschreibung);
    setzeMeta('meta[property="og:title"]', 'content', s.titel);
    setzeMeta('meta[property="og:description"]', 'content', s.beschreibung);
    const adresse = SITE_URL + (pfad === '/' ? '/' : pfad);
    setzeMeta('link[rel="canonical"]', 'href', adresse);
    setzeMeta('meta[property="og:url"]', 'content', adresse);
  }, [pathname]);
  return null;
}
