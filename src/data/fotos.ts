/*
  Fotos für die Bildergalerien.

  So kommen neue Fotos auf die Seite:
  1. Foto in den passenden Ordner legen:
       src/fotos/simply-good/   oder   src/fotos/simply-nice/
  2. Dateiname = Reihenfolge + Bildunterschrift, zum Beispiel:
       01-wohnzimmer-mit-kamin.jpg   →  „Wohnzimmer mit Kamin“
       02-kueche.jpg                 →  „Küche“
  3. Fertig. Nach dem nächsten Veröffentlichen erscheint das Foto automatisch.

  Tipp: Fotos vorher auf etwa 2000 Pixel Breite verkleinern (jpg oder webp),
  dann lädt die Seite auch auf dem Handy schnell.
*/
import type { WohnungId } from './wohnungen';

export interface Foto {
  src: string;
  titel: string;
}

const dateien = import.meta.glob('../fotos/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// Häufige Wörter, die man im Dateinamen ohne Umlaut schreibt
const UMLAUT_WOERTER: Record<string, string> = {
  kueche: 'Küche', kuechenzeile: 'Küchenzeile', esskueche: 'Essküche', wohnkueche: 'Wohnküche',
  baeder: 'Bäder', fruehstueck: 'Frühstück', fruehling: 'Frühling', gaestebad: 'Gästebad',
  balkontuer: 'Balkontür', haustuer: 'Haustür', tuer: 'Tür', fuer: 'für', ueber: 'über',
  gruen: 'grün', garten: 'Garten', schoen: 'schön', grosses: 'großes', grosse: 'große',
};

function titelAusDateiname(pfad: string) {
  const name = pfad.split('/').pop()!.replace(/\.[a-z]+$/i, '');
  const text = name
    .replace(/^\d+[\s_-]*/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\w+/g, (wort) => UMLAUT_WOERTER[wort.toLowerCase()] ?? wort)
    .trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

export function fotosFuer(id: WohnungId): Foto[] {
  return Object.entries(dateien)
    .filter(([pfad]) => pfad.includes(`/fotos/${id}/`))
    .sort(([a], [b]) => a.localeCompare(b, 'de', { numeric: true }))
    .map(([pfad, src]) => ({ src, titel: titelAusDateiname(pfad) }));
}
