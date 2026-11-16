/*
  Fotos der Wohnungen.
  Sie werden im Admin (/admin/) hochgeladen, sortiert und beschriftet
  und liegen im Ordner bilder/.
*/
import { wohnungen } from './wohnungen';
import type { WohnungId, Foto } from './wohnungen';

export type { Foto };

export function fotosFuer(id: WohnungId): Foto[] {
  return wohnungen.find((w) => w.id === id)?.fotos ?? [];
}
