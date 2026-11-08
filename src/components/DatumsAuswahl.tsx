import { useState } from 'react';
import { Links, Rechts } from './Icons';
import { isoDatum, ausIso } from '../data/preisrechner';
import { MINDESTAUFENTHALT } from '../data/wohnungen';

/*
  Kalender zum Auswählen von An- und Abreise.
  Belegte Nächte sind gesperrt. Man tippt zuerst die Anreise, dann die Abreise.
*/

interface Props {
  von: string;
  bis: string;
  onChange: (von: string, bis: string) => void;
  nachtBelegt: (iso: string) => boolean;
  belegungBekannt: boolean;
}

const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

function tageImMonat(jahr: number, monat: number) {
  const versatz = (new Date(jahr, monat, 1).getDay() + 6) % 7;
  const anzahl = new Date(jahr, monat + 1, 0).getDate();
  const zellen: (Date | null)[] = Array(versatz).fill(null);
  for (let t = 1; t <= anzahl; t++) zellen.push(new Date(jahr, monat, t));
  return zellen;
}

function plusTage(iso: string, n: number) {
  const d = ausIso(iso);
  d.setDate(d.getDate() + n);
  return isoDatum(d);
}

export function datumLang(iso: string) {
  if (!iso) return '';
  return ausIso(iso).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function DatumsAuswahl({ von, bis, onChange, nachtBelegt, belegungBekannt }: Props) {
  const heute = isoDatum(new Date());
  const start = von ? ausIso(von) : new Date();
  const [monat, setMonat] = useState({ j: start.getFullYear(), m: start.getMonth() });
  const [hinweis, setHinweis] = useState('');

  const waehltAbreise = !!von && !bis;

  // Erste belegte Nacht nach der Anreise: bis dahin kann man höchstens bleiben
  let spaetesteAbreise: string | null = null;
  if (waehltAbreise) {
    for (let i = 0; i < 400; i++) {
      const n = plusTage(von, i);
      if (nachtBelegt(n)) {
        spaetesteAbreise = n;
        break;
      }
    }
  }

  const status = (iso: string) => {
    if (iso < heute) return 'vorbei';
    if (waehltAbreise) {
      if (iso <= von) return nachtBelegt(iso) ? 'belegt' : 'frei';
      if (spaetesteAbreise && iso > spaetesteAbreise) return 'gesperrt';
      if (iso < plusTage(von, MINDESTAUFENTHALT)) return 'zukurz';
      return 'frei';
    }
    return nachtBelegt(iso) ? 'belegt' : 'frei';
  };

  const tippen = (iso: string) => {
    const s = status(iso);
    setHinweis('');
    if (s === 'vorbei' || s === 'gesperrt') return;
    if (waehltAbreise && iso > von) {
      if (s === 'zukurz') {
        setHinweis(`Bitte mindestens ${MINDESTAUFENTHALT} Nächte wählen.`);
        return;
      }
      onChange(von, iso);
      return;
    }
    if (s === 'belegt') {
      setHinweis('Diese Nacht ist leider schon belegt.');
      return;
    }
    onChange(iso, '');
  };

  const kannZurueck = monat.j > new Date().getFullYear() || monat.m > new Date().getMonth();
  const blaettern = (schritt: number) =>
    setMonat(({ j, m }) => {
      const d = new Date(j, m + schritt, 1);
      return { j: d.getFullYear(), m: d.getMonth() };
    });

  return (
    <div className="bg-white border border-linie rounded-md p-4 sm:p-5 font-sans">
      <p className="text-sm mb-3 font-semibold" aria-live="polite">
        {!von ? 'Tippen Sie auf Ihren Anreisetag.' : waehltAbreise ? 'Jetzt den Abreisetag antippen.' : 'Zeitraum gewählt. Zum Ändern einfach einen neuen Anreisetag antippen.'}
      </p>

      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => blaettern(-1)} disabled={!kannZurueck} aria-label="Vorheriger Monat" className="p-2 -m-2 rounded disabled:opacity-25 hover:bg-kalk">
          <Links />
        </button>
        <div className="font-semibold font-serif">{MONATE[monat.m]} {monat.j}</div>
        <button type="button" onClick={() => blaettern(1)} aria-label="Nächster Monat" className="p-2 -m-2 rounded hover:bg-kalk">
          <Rechts />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-sm text-center">
        {WOCHENTAGE.map((t) => <div key={t} className="py-1 text-schilf">{t}</div>)}
        {tageImMonat(monat.j, monat.m).map((d, i) => {
          if (!d) return <div key={`leer-${i}`} />;
          const iso = isoDatum(d);
          const s = status(iso);
          const istVon = iso === von;
          const istBis = iso === bis;
          const imZeitraum = von && bis && iso > von && iso < bis;
          let stil = 'bg-papier hover:bg-sonne/30';
          if (s === 'vorbei' || s === 'gesperrt') stil = 'text-see/25 cursor-default';
          else if (s === 'belegt') stil = 'bg-linie/60 text-see/40 line-through cursor-not-allowed';
          else if (s === 'zukurz') stil = 'bg-papier text-see/50';
          if (imZeitraum) stil = 'bg-wasser/20';
          if (istVon || istBis) stil = 'bg-see text-white';
          return (
            <button
              key={iso}
              type="button"
              onClick={() => tippen(iso)}
              disabled={s === 'vorbei' || s === 'gesperrt'}
              aria-pressed={istVon || istBis}
              aria-label={`${datumLang(iso)}${s === 'belegt' ? ', belegt' : ''}${istVon ? ', Anreise' : ''}${istBis ? ', Abreise' : ''}`}
              className={`h-10 rounded-sm tabular-nums ${stil} ${iso === heute ? 'ring-2 ring-sonne' : ''}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      {hinweis && <p role="alert" className="mt-3 text-sm font-semibold text-[#9b2c1f]">{hinweis}</p>}

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-papier border border-linie" /> frei</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-linie/60" /> belegt</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-see" /> Ihre Auswahl</span>
      </div>
      {!belegungBekannt && (
        <p className="mt-3 text-sm bg-sonne/25 rounded-sm px-3 py-2">
          Die Belegung kann gerade nicht angezeigt werden. Sie können trotzdem jeden Zeitraum anfragen – wir sagen Ihnen dann, ob er frei ist.
        </p>
      )}
    </div>
  );
}
