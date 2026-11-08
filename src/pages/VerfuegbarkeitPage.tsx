import { Link } from 'react-router-dom';
import Kalender from '../components/Kalender';
import KontaktWege from '../components/KontaktWege';
import { useBelegung } from '../data/belegung';
import { wohnungen, euro, ENDREINIGUNG, MINDESTAUFENTHALT } from '../data/wohnungen';

export default function VerfuegbarkeitPage() {
  const { belegungen, status } = useBelegung();

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
              <Kalender wohnung={w.id} belegungen={belegungen} status={status} />
            </div>
            <Link to={`/kontakt?wohnung=${w.id}`} className="knopf mt-4">{w.name} anfragen</Link>
          </section>
        ))}
      </div>

      <h2 className="text-3xl mt-24">Preise</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-3xl text-left border-collapse">
          <thead className="klein text-schilf">
            <tr className="border-b-2 border-see">
              <th className="py-2 pr-6 font-normal">Wohnung</th>
              <th className="py-2 pr-6 font-normal">pro Nacht</th>
              <th className="py-2 pr-6 font-normal">Endreinigung</th>
              <th className="py-2 font-normal">Personen</th>
            </tr>
          </thead>
          <tbody>
            {wohnungen.map((w) => (
              <tr key={w.id} className="border-b border-linie align-top">
                <td className="py-4 pr-6">
                  <div className="font-semibold">{w.name}</div>
                  <div className="klein text-schilf">{w.etage}</div>
                  {w.angebot && <div className="klein mt-2 inline-block bg-sonne/25 px-2 py-0.5 rounded-sm">{w.angebot}</div>}
                </td>
                <td className="py-4 pr-6 tabular-nums font-semibold">ab {euro(w.preis)}</td>
                <td className="py-4 pr-6 tabular-nums">{euro(ENDREINIGUNG)}</td>
                <td className="py-4 tabular-nums">bis {w.personen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-6 klein text-schilf space-y-1 max-w-3xl">
        <li>Bettwäsche und Handtücher sind im Preis enthalten.</li>
        <li>Mindestaufenthalt {MINDESTAUFENTHALT} Nächte.</li>
        <li>Kaminholz, Babybett und Aufbettung gibt es auf Anfrage.</li>
        <li>Die Buchung ist erst nach schriftlicher Bestätigung verbindlich.</li>
      </ul>

      <div className="mt-24">
        <KontaktWege />
      </div>
    </div>
  );
}
