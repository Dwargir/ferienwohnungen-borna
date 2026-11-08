import { Link } from 'react-router-dom';
import KontaktWege from '../components/KontaktWege';
import Bewertung from '../components/Bewertung';
import { wohnungen, euro, highlights } from '../data/wohnungen';
import { fotosFuer } from '../data/fotos';

/*
  Startseite: bewusst kurz.
  1. Begrüßung mit großem Foto
  2. Die zwei Wohnungen
  3. Lage in drei Sätzen
  4. Kontakt
*/

const lage = [
  { wert: '5 Min.', text: 'zu Fuß zu Bäcker, Supermarkt und Café' },
  { wert: '30 Min.', text: 'mit Auto oder S-Bahn nach Leipzig' },
  { wert: 'Seen', text: 'zum Baden und Radfahren gleich in der Nähe' },
];

export default function HomePage() {
  return (
    <>
      {/* 1. Begrüßung */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-14 grid gap-8 md:gap-14 md:grid-cols-[1fr_1.1fr] md:items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-[2.5rem] leading-[1.08] sm:text-[3.6rem]">
            Ferien&shy;wohnungen in Borna
          </h1>
          <p className="mt-5 text-xl max-w-md">
            Zwei gemütliche Wohnungen in einer Stadtvilla mit Garten – mitten im Leipziger Neuseenland.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#wohnungen" className="knopf">Wohnungen ansehen</a>
            <Link to="/verfuegbarkeit" className="knopf knopf-hell">Freie Termine</Link>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <img
            src="/images/haus/garten.jpg"
            alt="Das Haus mit blühenden Hortensien im Garten"
            className="w-full aspect-[4/3] md:aspect-[5/4] object-cover object-[50%_70%] rounded-md"
          />
        </div>
      </section>

      {/* Stärken laut Booking.com */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-12 sm:mt-16" aria-label="Was Gäste auf Booking.com sagen">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 border-y border-linie py-8">
          {highlights.map((h) => (
            <li key={h.titel}>
              <div className="text-3xl font-semibold text-wasser tabular-nums">{h.wert}</div>
              <div className="mt-1 font-semibold">{h.titel}</div>
              <p className="klein mt-1 text-schilf">{h.text}</p>
            </li>
          ))}
        </ul>
        <p className="klein mt-3 text-schilf">Bewertungen und Auszeichnungen von Booking.com</p>
      </section>

      {/* 2. Die Wohnungen */}
      <section id="wohnungen" className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-20 scroll-mt-20">
        <h2 className="text-3xl sm:text-4xl">Unsere beiden Wohnungen</h2>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {wohnungen.map((w) => {
            const bild = fotosFuer(w.id)[0];
            return (
              <Link key={w.id} to={`/${w.id}`} className="group block no-underline">
                <div className="overflow-hidden rounded-md bg-linie aspect-[4/3]">
                  {bild && (
                    <img
                      src={bild.src}
                      alt={`${w.name}: ${bild.titel}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="klein text-schilf">{w.etage}</p>
                    <h3 className="text-2xl sm:text-[1.75rem] group-hover:underline underline-offset-4 decoration-2">{w.name}</h3>
                    <p className="mt-1">{w.kurz}</p>
                    <div className="mt-3"><Bewertung w={w} link={false} /></div>
                  </div>
                  <div className="text-right shrink-0 klein pt-1.5">
                    ab <span className="text-lg font-semibold">{euro(w.preis)}</span>
                    <br />
                    pro Nacht
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Lage */}
      <section className="mt-20 sm:mt-28 bg-papier border-y border-linie">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16 grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div className="grid grid-cols-3 grid-rows-2 gap-3 h-80 sm:h-[440px]">
            <img src="/images/haus/eingang.jpg" alt="Eingang mit Sitzbank" loading="lazy" className="col-span-2 row-span-2 w-full h-full object-cover rounded-md" />
            <img src="/images/haus/aussicht.jpg" alt="Blick über die Nachbarschaft" loading="lazy" className="w-full h-full object-cover rounded-md" />
            <img src="/images/haus/luftbild.jpg" alt="Luftbild mit den Seen am Horizont" loading="lazy" className="w-full h-full object-cover rounded-md" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl">Ruhig wohnen, schnell überall</h2>
            <p className="mt-4 max-w-md">
              Das Haus liegt in einer ruhigen Straße am Stadtrand von Borna. Geparkt wird direkt vor der Tür.
            </p>
            <dl className="mt-8 space-y-5">
              {lage.map((l) => (
                <div key={l.wert} className="flex items-baseline gap-5">
                  <dt className="w-24 shrink-0 text-2xl font-semibold">{l.wert}</dt>
                  <dd>{l.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 4. Kontakt */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-20 sm:mt-28">
        <KontaktWege />
      </section>
    </>
  );
}
