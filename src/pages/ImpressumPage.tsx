import { KONTAKT } from '../data/wohnungen';

export function RechtsSeite({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-12">
      <h1 className="text-4xl">{titel}</h1>
      <div className="mt-8 space-y-8 [&_h2]:text-xl [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:mt-4 [&_p]:max-w-[40rem] [&_p+p]:mt-3">
        {children}
      </div>
    </div>
  );
}

export default function ImpressumPage() {
  return (
    <RechtsSeite titel="Impressum">
      <section>
        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          {KONTAKT.name}
          <br />
          {KONTAKT.strasse}
          <br />
          {KONTAKT.ort}
        </p>
      </section>

      <section>
        <h2>Kontakt</h2>
        <p>
          Telefon: <a className="verweis" href={KONTAKT.telefonLink}>{KONTAKT.telefon}</a>
          <br />
          E-Mail: <a className="verweis" href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a>
        </p>
      </section>

      <section>
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>
          {KONTAKT.name}, {KONTAKT.strasse}, {KONTAKT.ort}
        </p>
      </section>

      <section>
        <h2>Haftung für Inhalte</h2>
        <p>
          Die Inhalte dieser Seiten wurden mit Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität
          der Inhalte kann jedoch keine Gewähr übernommen werden. Verbindlich sind allein die Angaben in der
          schriftlichen Buchungsbestätigung.
        </p>
      </section>

      <section>
        <h2>Haftung für Links</h2>
        <p>
          Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte kein Einfluss besteht. Für die
          Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.
        </p>
      </section>

      <section>
        <h2>Urheberrecht</h2>
        <p>
          Texte und Fotos auf dieser Website unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung und
          Verbreitung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung.
        </p>
      </section>
    </RechtsSeite>
  );
}
