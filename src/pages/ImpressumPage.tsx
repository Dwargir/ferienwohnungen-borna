export default function ImpressumPage() {
  return (
    <div className="bg-[#f5f5f0] min-h-screen">
      <div className="bg-[#292524] py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#fef3c7]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Impressum
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-8 space-y-7">
          <section>
            <h2 className="text-lg font-bold text-[#292524] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Angaben gemäß § 5 TMG
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              <strong>Uta Finke</strong><br />
              Robert-Koch-Straße 26<br />
              04552 Borna
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#292524] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Kontakt
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Telefon: 0178 1895560<br />
              E-Mail: <a href="mailto:utafinke@web.de" className="text-deep-blue hover:underline">utafinke@web.de</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#292524] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Uta Finke<br />
              Robert-Koch-Straße 26<br />
              04552 Borna
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#292524] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Haftungsausschluss
            </h2>
            <h3 className="font-semibold text-[#292524] text-sm mb-2">Haftung für Inhalte</h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <h3 className="font-semibold text-[#292524] text-sm mb-2">Haftung für Links</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#292524] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Urheberrecht
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
