import { useState } from 'react';
import { Links, Rechts } from './Icons';
import type { Belegung } from '../data/belegung';
import type { WohnungId } from '../data/wohnungen';

interface Props {
  wohnung: WohnungId;
  belegungen: Belegung[];
  status: 'laedt' | 'ok' | 'fehler';
}

const HALB = 'linear-gradient(135deg, var(--color-see) 50%, var(--color-papier) 50%)';
const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function tageImMonat(jahr: number, monat: number) {
  const erster = new Date(jahr, monat, 1);
  const versatz = (erster.getDay() + 6) % 7; // Montag = 0
  const anzahl = new Date(jahr, monat + 1, 0).getDate();
  const zellen: (Date | null)[] = Array(versatz).fill(null);
  for (let t = 1; t <= anzahl; t++) zellen.push(new Date(jahr, monat, t));
  return zellen;
}

export default function Kalender({ wohnung, belegungen, status }: Props) {
  const heute = new Date();
  const [monat, setMonat] = useState({ j: heute.getFullYear(), m: heute.getMonth() });
  const eigene = belegungen.filter((b) => b.wohnung === wohnung);
  const heuteIso = iso(heute);

  // Eine Nacht ist belegt, wenn Anreise <= Tag < Abreise
  const nachtBelegt = (tag: string) => eigene.some((b) => b.von <= tag && tag < b.bis);
  const istAbreise = (tag: string) => eigene.some((b) => b.bis === tag);

  const kannZurueck = monat.j > heute.getFullYear() || monat.m > heute.getMonth();
  const blaettern = (schritt: number) =>
    setMonat(({ j, m }) => {
      const d = new Date(j, m + schritt, 1);
      return { j: d.getFullYear(), m: d.getMonth() };
    });

  return (
    <div className="bg-white border border-linie rounded-md p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => blaettern(-1)}
          disabled={!kannZurueck}
          aria-label="Vorheriger Monat"
          className="p-2 -m-2 rounded disabled:opacity-25 hover:bg-kalk"
        >
          <Links />
        </button>
        <div className="font-semibold" aria-live="polite">
          {MONATE[monat.m]} {monat.j}
        </div>
        <button type="button" onClick={() => blaettern(1)} aria-label="Nächster Monat" className="p-2 -m-2 rounded hover:bg-kalk">
          <Rechts />
        </button>
      </div>

      {status === 'fehler' && (
        <p role="status" className="klein mb-3 bg-sonne/25 rounded-sm px-3 py-2">
          Die Belegung kann gerade nicht angezeigt werden. Bitte fragen Sie Ihren Wunschtermin direkt an –
          per Telefon, WhatsApp oder über das Anfrageformular.
        </p>
      )}
      <div className={`grid grid-cols-7 gap-1 klein text-center ${status !== 'ok' ? 'opacity-30 pointer-events-none select-none' : ''}`} aria-hidden={status !== 'ok'}>
        {WOCHENTAGE.map((t) => (
          <div key={t} className="py-1 text-schilf">{t}</div>
        ))}
        {tageImMonat(monat.j, monat.m).map((d, i) => {
          if (!d) return <div key={`leer-${i}`} />;
          const tag = iso(d);
          const vorbei = tag < heuteIso;
          const belegt = nachtBelegt(tag);
          const abreise = !belegt && istAbreise(tag);
          let stil = 'bg-papier';
          let titel = 'frei';
          if (vorbei) {
            stil = 'text-see/30';
            titel = 'vorbei';
          } else if (belegt) {
            stil = 'bg-see text-white';
            titel = 'belegt';
          } else if (abreise) {
            stil = 'text-see';
            titel = 'Abreisetag – Anreise möglich';
          }
          return (
            <div
              key={tag}
              title={titel}
              style={abreise && !vorbei ? { background: HALB } : undefined}
              className={`h-9 flex items-center justify-center rounded-sm tabular-nums ${stil} ${tag === heuteIso ? 'ring-2 ring-sonne' : ''}`}
            >
              <span className={abreise ? 'bg-papier/90 px-1 rounded-sm' : ''}>{d.getDate()}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 klein">
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-papier border border-linie" /> frei</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-see" /> belegt</span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm border border-linie" style={{ background: HALB }} /> Abreisetag, Anreise möglich
        </span>
      </div>
      {status === 'laedt' && <p className="klein mt-3 text-schilf">Belegung wird geladen …</p>}
    </div>
  );
}
