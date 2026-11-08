import { useCallback, useEffect, useRef, useState } from 'react';
import type { Foto } from '../data/fotos';
import { Kamera, Links, Rechts, Schliessen } from './Icons';

interface Props {
  fotos: Foto[];
  name: string;
}

const SICHTBAR = 5; // so viele Felder zeigt die Übersicht

export default function Galerie({ fotos, name }: Props) {
  const [offen, setOffen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const oeffnen = (i: number) => {
    setOffen(i);
    dialog.current?.showModal();
  };
  const schliessen = () => dialog.current?.close();
  const weiter = useCallback(
    (schritt: number) => setOffen((i) => (i === null ? i : (i + schritt + fotos.length) % fotos.length)),
    [fotos.length],
  );

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const taste = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') weiter(1);
      if (e.key === 'ArrowLeft') weiter(-1);
    };
    const zu = () => setOffen(null);
    d.addEventListener('keydown', taste);
    d.addEventListener('close', zu);
    return () => {
      d.removeEventListener('keydown', taste);
      d.removeEventListener('close', zu);
    };
  }, [weiter]);

  // Freie Plätze, solange noch nicht genug eigene Fotos da sind
  const platzhalter = Math.max(0, SICHTBAR - fotos.length);
  const weitere = fotos.length - SICHTBAR;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 sm:grid-rows-2 gap-2 sm:h-[460px]">
        {fotos.slice(0, SICHTBAR).map((f, i) => (
          <button
            key={f.src}
            type="button"
            onClick={() => oeffnen(i)}
            className={`relative overflow-hidden rounded-sm bg-linie group ${
              i === 0 ? 'col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto' : 'aspect-[4/3] sm:aspect-auto'
            }`}
            aria-label={`Foto vergrößern${f.titel ? `: ${f.titel}` : ''}`}
          >
            <img src={f.src} alt={f.titel || name} loading={i === 0 ? 'eager' : 'lazy'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
            {i === SICHTBAR - 1 && weitere > 0 && (
              <span className="absolute inset-0 bg-see/60 text-white flex items-center justify-center klein font-semibold">
                {weitere} weitere Fotos
              </span>
            )}
          </button>
        ))}
        {Array.from({ length: platzhalter }).map((_, i) => {
          const erstes = fotos.length === 0 && i === 0;
          return (
            <div
              key={`platz-${i}`}
              className={`border-2 border-dashed border-linie rounded-sm flex flex-col items-center justify-center gap-1 text-schilf klein bg-papier/60 ${
                erstes ? 'col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto' : 'aspect-[4/3] sm:aspect-auto'
              }`}
            >
              <Kamera className="w-6 h-6" />
              Foto folgt
            </div>
          );
        })}
      </div>

      <dialog
        ref={dialog}
        className="m-auto w-full max-w-5xl bg-transparent p-0 backdrop:bg-see/90"
        onClick={(e) => e.target === dialog.current && schliessen()}
        aria-label={`Fotos von ${name}`}
      >
        {offen !== null && fotos[offen] && (
          <figure className="relative">
            <img src={fotos[offen].src} alt={fotos[offen].titel || name} className="w-full max-h-[80vh] object-contain" />
            <figcaption className="mt-3 flex items-center justify-between text-white klein">
              <span>{fotos[offen].titel}</span>
              <span className="tabular-nums">{offen + 1} von {fotos.length}</span>
            </figcaption>
            {fotos.length > 1 && (
              <>
                <button type="button" onClick={() => weiter(-1)} aria-label="Vorheriges Foto" className="absolute left-2 top-[40%] p-3 rounded-full bg-white/90 text-see">
                  <Links />
                </button>
                <button type="button" onClick={() => weiter(1)} aria-label="Nächstes Foto" className="absolute right-2 top-[40%] p-3 rounded-full bg-white/90 text-see">
                  <Rechts />
                </button>
              </>
            )}
            <button type="button" onClick={schliessen} aria-label="Schließen" className="absolute -top-12 right-0 p-2 text-white">
              <Schliessen className="w-7 h-7" />
            </button>
          </figure>
        )}
      </dialog>
    </>
  );
}
