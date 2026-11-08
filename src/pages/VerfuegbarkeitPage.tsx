import { Link } from 'react-router-dom';
import Kalender from '../components/Kalender';
import KontaktWege from '../components/KontaktWege';
import { useBelegung, statusFuer } from '../data/belegung';
import { wohnungen, euro, ENDREINIGUNG, MINDESTAUFENTHALT, PREISSTUFEN, DIREKT_VORTEIL, DIREKT_HINWEIS } from '../data/wohnungen';

export default function VerfuegbarkeitPage() {
  const zustand = useBelegung();
  const { belegungen } = zustand;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12">
      <h1 className="text-4xl sm:text-5xl">Belegung und Preise</h1>
      <p className="mt-4 max-w-[38rem] text-lg">
        Die Kalender zeigen, welche Nächte schon vergeben sind. Ist Ihr Wunschtermin frei, schicken Sie einfach eine Anfrage.
      </p>

      <div className="mt-12 grid gap-14 md:grid-cols-2">
        {wohnungen.map((w) => (
          <section key={w.id}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl">
                <Link to={`/${w.id}`} className="hover:underline underline-offset-4">{w.name}</Link>
              </h2>
              <span className="klein">{w.etage}</span>
            </div>
            <div className="mt-4">
              <Kalender wohnung={w.id} belegungen={belegungen} status={statusFuer(zustand, [w.id])} />
            </div>
            <Link to={`/kontakt?wohnung=${w.id}`} className="knopf mt-4">{w.name} anfragen</Link>
          </section>
        ))}
      </div>

      <h2 className="text-3xl mt-24">Preise pro Nacht</h2>
      <p className="mt-3 text-lg font-semibold text-wasser">{DIREKT_VORTEIL}</p>
      <p className="mt-1 max-w-[38rem]">{DIREKT_HINWEIS}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-3xl text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-see klein text-schilf">
              <th className="py-2 pr-6 font-normal"><span className="sr-only">Zeitraum</span></th>
              {wohnungen.map((w) => (
                <th key={w.id} className="py-2 pr-6 font-normal">
                  <span className="block text-base font-semibold text-see">{w.name}</span>
                  {w.etage}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PREISSTUFEN.map((p) => (
              <tr key={p.key} className="border-b border-linie">
                <th scope="row" className="py-3 pr-6 font-normal">{p.name}</th>
                {wohnungen.map((w) => (
                  <td key={w.id} className="py-3 pr-6 tabular-nums font-semibold">{euro(w.preise[p.key])}</td>
                ))}
              </tr>
            ))}
            <tr className="border-b border-linie">
              <th scope="row" className="py-3 pr-6 font-normal">Endreinigung, einmalig</th>
              {wohnungen.map((w) => (
                <td key={w.id} className="py-3 pr-6 tabular-nums">{euro(ENDREINIGUNG)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {wohnungen.filter((w) => w.angebot).map((w) => (
        <p key={w.id} className="klein mt-4 inline-block bg-sonne/25 px-3 py-1.5 rounded-sm">{w.name}: {w.angebot}</p>
      ))}
      <ul className="mt-6 klein text-schilf space-y-1 max-w-3xl">
        <li>Bettwäsche und Handtücher sind im Preis enthalten.</li>
        <li>Mindestaufenthalt {MINDESTAUFENTHALT} Nächte.</li>
        <li>Babybett: 10 € für den ganzen Aufenthalt. Kaminholz (Simply Good): 10 € pro Korb. Aufbettung auf Anfrage.</li>
        <li>Die Buchung ist erst nach schriftlicher Bestätigung verbindlich.</li>
      </ul>

      <div className="mt-24">
        <KontaktWege />
      </div>
    </div>
  );
}
