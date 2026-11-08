import { Link } from 'react-router-dom';
import HausSchnitt from '../components/HausSchnitt';
import KontaktWege from '../components/KontaktWege';
import { wohnungen, umgebung, euro, ENDREINIGUNG, MINDESTAUFENTHALT } from '../data/wohnungen';
import { fotosFuer } from '../data/fotos';

export default function HomePage() {
  return (
    <>
      {/* Begrüßung mit dem Haus im Querschnitt */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 grid gap-12 md:grid-cols-[1.05fr_1fr] md:items-center">
        <div>
          <h1 className="text-[2.4rem] sm:text-[3.25rem]">
            Zwei Ferienwohnungen in einer Stadtvilla in Borna
          </h1>
          <p className="mt-6 text-lg max-w-[34rem]">
            Unten wohnen Sie mit Kamin und eigener Terrasse, oben unterm Dach mit zwei getrennten Schlafzimmern.
            Die Seen des Leipziger Neuseenlands sind nah, Leipzig ist in einer halben Stunde erreicht.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/verfuegbarkeit" className="knopf">Freie Termine ansehen</Link>
            <Link to="/kontakt" className="knopf knopf-hell">Anfrage schreiben</Link>
          </div>
        </div>
        <div className="max-w-[460px] w-full md:justify-self-end">
          <HausSchnitt />
          <p className="klein text-schilf text-center mt-2">Tippen Sie auf eine Etage, um die Wohnung anzusehen.</p>
        </div>
      </section>

      {/* Die beiden Wohnungen */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-24">
        <h2 className="text-3xl">Die Wohnungen</h2>
        <div className="mt-8 grid gap-12 md:grid-cols-2">
          {wohnungen.map((w) => {
            const bild = fotosFuer(w.id)[0];
            return (
              <article key={w.id}>
                <Link to={`/${w.id}`} className="block overflow-hidden rounded-sm bg-linie aspect-[3/2]">
                  {bild && (
                    <img src={bild.src} alt={`${w.name}: ${bild.titel}`} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
                  )}
                </Link>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="text-2xl">
                    <Link to={`/${w.id}`} className="no-underline hover:underline underline-offset-4">{w.name}</Link>
                  </h3>
                  <span className="klein shrink-0">ab <strong>{euro(w.preis)}</strong> pro Nacht</span>
                </div>
                <p className="mt-1">{w.etage}. {w.kurz}.</p>
                <p className="klein mt-2 text-schilf">
                  Bis {w.personen} Personen, {w.schlafzimmer} Schlafzimmer
                  {w.groesse ? `, ${w.groesse}` : ''}
                </p>
                {w.angebot && <p className="klein mt-3 inline-block bg-sonne/25 px-2 py-1 rounded-sm">{w.angebot}</p>}
              </article>
            );
          })}
        </div>
        <p className="klein mt-8 text-schilf">
          Endreinigung einmalig {euro(ENDREINIGUNG)}. Mindestaufenthalt {MINDESTAUFENTHALT} Nächte. Bettwäsche und Handtücher sind inklusive.
        </p>
      </section>


      {/* Das Haus */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-24">
        <div className="grid gap-6 md:grid-cols-[1fr_2fr] md:items-end">
          <div>
            <h2 className="text-3xl">Das Haus</h2>
            <p className="mt-4 max-w-sm">
              Eine Stadtvilla in einer ruhigen Straße am Stadtrand, mit Garten, Hortensien und einer Terrasse hinter dem Haus.
              Geparkt wird direkt vor der Tür.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-3 grid-cols-2 md:grid-cols-[1fr_1fr_1.35fr]">
          {[
            ['/images/haus/garten.jpg', 'Weg durch den Garten mit Hortensien', 'aspect-[3/4]'],
            ['/images/haus/eingang.jpg', 'Eingang mit Sitzbank', 'aspect-[3/4]'],
            ['/images/haus/aussicht.jpg', 'Blick über die Nachbarschaft', 'col-span-2 md:col-span-1 aspect-[4/3] md:aspect-auto'],
          ].map(([src, text, form]) => (
            <figure key={src} className={form}>
              <img src={src} alt={text} loading="lazy" className="w-full h-full object-cover rounded-sm" />
              <figcaption className="sr-only">{text}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Umgebung */}
      <section className="mt-24 bg-papier border-y border-linie">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-3xl">Rund um Borna</h2>
            <p className="mt-4 max-w-sm">
              Borna liegt im Süden von Leipzig, mitten zwischen den gefluteten Tagebauseen. Vieles erreichen Sie mit dem Rad.
            </p>
            <figure className="mt-6">
              <img src="/images/haus/luftbild.jpg" alt="Luftbild: das Haus (blau markiert), dahinter Wald und die Seen" className="w-full aspect-[4/5] object-cover rounded-sm" loading="lazy" />
              <figcaption className="klein mt-2 text-schilf">Das Haus ist blau markiert, dahinter liegen Wald und Seen.</figcaption>
            </figure>
          </div>
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 content-start">
            {umgebung.map((u) => (
              <div key={u.name} className="border-t border-linie pt-3">
                <dt className="font-semibold">{u.name}</dt>
                <dd className="mt-1 text-[0.98rem]">{u.text}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-16 grid gap-3 grid-cols-[1.5fr_1fr]">
          <figure>
            <img src="/images/haus/borna-stadtpark.jpg" alt="Park in Borna mit Fontäne und Bergarbeiter-Skulptur" loading="lazy" className="w-full h-56 sm:h-96 object-cover rounded-sm" />
            <figcaption className="klein mt-2 text-schilf">Im Park in Borna</figcaption>
          </figure>
          <figure>
            <img src="/images/haus/borna-lutherdenkmal.jpg" alt="Luther-Denkmal in Borna" loading="lazy" className="w-full h-56 sm:h-96 object-cover object-[50%_65%] rounded-sm" />
            <figcaption className="klein mt-2 text-schilf">Luther-Denkmal in der Altstadt</figcaption>
          </figure>
        </div>
      </section>

      {/* So läuft die Buchung – echte Reihenfolge, daher nummeriert */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-24">
        <h2 className="text-3xl">So buchen Sie</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-3">
          {[
            ['Anfragen', 'Schicken Sie Ihren Wunschtermin per Telefon, WhatsApp, E-Mail oder über das Anfrageformular.'],
            ['Bestätigung abwarten', 'Sie bekommen eine Rückmeldung, ob der Termin frei ist. Erst mit dieser Bestätigung ist die Buchung verbindlich.'],
            ['Anreisen', 'Den Schlüssel holen Sie sich selbst aus dem Schlüsselsafe – auch bei später Ankunft.'],
          ].map(([titel, text], i) => (
            <li key={titel} className="flex gap-4">
              <span className="shrink-0 w-9 h-9 rounded-full border-2 border-see flex items-center justify-center font-semibold">{i + 1}</span>
              <div>
                <div className="font-semibold">{titel}</div>
                <p className="mt-1 text-[0.98rem]">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-24">
        <KontaktWege />
      </section>
    </>
  );
}
