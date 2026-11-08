import { Link, Navigate, useParams } from 'react-router-dom';
import Galerie from '../components/Galerie';
import Kalender from '../components/Kalender';
import { Telefon } from '../components/Icons';
import Bewertung from '../components/Bewertung';
import { wohnungById, wohnungen, euro, ENDREINIGUNG, MINDESTAUFENTHALT, KONTAKT } from '../data/wohnungen';
import { fotosFuer } from '../data/fotos';
import { useBelegung } from '../data/belegung';

export default function WohnungPage({ id: festeId }: { id?: string }) {
  const params = useParams();
  const w = wohnungById(festeId ?? params.id);
  const { belegungen, status } = useBelegung();
  if (!w) return <Navigate to="/" replace />;

  const fotos = fotosFuer(w.id);
  const andere = wohnungen.find((x) => x.id !== w.id)!;

  const fakten: [string, string][] = [
    ['Etage', w.etage],
    ['Personen', `bis ${w.personen}`],
    ['Schlafzimmer', String(w.schlafzimmer)],
    ...(w.groesse ? [['Größe', w.groesse] as [string, string]] : []),
    ['Mindestaufenthalt', `${MINDESTAUFENTHALT} Nächte`],
    ['Check-in', 'Schlüsselsafe'],
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="klein text-schilf">
            <Link to="/" className="hover:underline">Startseite</Link> / {w.etage}
          </p>
          <h1 className="text-4xl sm:text-5xl mt-2">{w.name}</h1>
          <p className="mt-2 text-lg">{w.kurz}</p>
          <div className="mt-4"><Bewertung w={w} /></div>
        </div>
      </div>

      <Galerie fotos={fotos} name={w.name} />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 border-y border-linie py-5">
            {fakten.map(([k, v]) => (
              <div key={k}>
                <dt className="klein text-schilf">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 space-y-4 max-w-[38rem]">
            {w.beschreibung.map((absatz) => (
              <p key={absatz}>{absatz}</p>
            ))}
          </div>

          <h2 className="text-2xl mt-14">Räume</h2>
          <dl className="mt-4 max-w-[38rem] divide-y divide-linie border-y border-linie">
            {w.raeume.map((r) => (
              <div key={r.name} className="py-3 sm:grid sm:grid-cols-[10rem_1fr] gap-4">
                <dt className="font-semibold">{r.name}</dt>
                <dd>{r.text}</dd>
              </div>
            ))}
          </dl>

          <h2 className="text-2xl mt-14">Ausstattung</h2>
          <ul className="mt-4 columns-2 sm:columns-3 gap-8 max-w-[44rem]">
            {w.ausstattung.map((a) => (
              <li key={a} className="py-1 break-inside-avoid">{a}</li>
            ))}
          </ul>

          <h2 className="text-2xl mt-14">Betten</h2>
          <ul className="mt-4 space-y-1 max-w-[38rem] list-disc pl-5 marker:text-schilf">
            {w.betten.map((b) => <li key={b}>{b}</li>)}
          </ul>

          <h2 className="text-2xl mt-14">Gut zu wissen</h2>
          <ul className="mt-4 space-y-1 max-w-[38rem] list-disc pl-5 marker:text-schilf">
            {w.hinweise.map((h) => <li key={h}>{h}</li>)}
            <li>Die Buchung ist erst nach Bestätigung verbindlich.</li>
          </ul>

          <h2 className="text-2xl mt-14" id="belegung">Belegung</h2>
          <div className="mt-4 max-w-md">
            <Kalender wohnung={w.id} belegungen={belegungen} status={status} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="bg-white border border-linie rounded-md p-6">
            <div className="text-3xl font-semibold tabular-nums">{euro(w.preis)}</div>
            <div className="klein text-schilf">pro Nacht, zzgl. {euro(ENDREINIGUNG)} Endreinigung</div>
            {w.angebot && <p className="klein mt-4 bg-sonne/25 px-3 py-2 rounded-sm">{w.angebot}</p>}
            <Link to={`/kontakt?wohnung=${w.id}`} className="knopf w-full mt-6">Diese Wohnung anfragen</Link>
            <a href={KONTAKT.telefonLink} className="knopf knopf-hell w-full mt-3">
              <Telefon className="w-4 h-4" /> {KONTAKT.telefon}
            </a>
          </div>
          <p className="mt-6 klein">
            Lieber mehr Platz oder ein anderes Stockwerk?{' '}
            <Link to={`/${andere.id}`} className="verweis">{andere.name}</Link> liegt im {andere.etage}.
          </p>
        </aside>
      </div>
    </div>
  );
}
