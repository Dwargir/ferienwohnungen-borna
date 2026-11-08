import { RechtsSeite } from './ImpressumPage';
import { KONTAKT } from '../data/wohnungen';

export default function DatenschutzPage() {
  return (
    <RechtsSeite titel="Datenschutzerklärung">
      <section>
        <h2>Verantwortlich</h2>
        <p>
          {KONTAKT.name}, {KONTAKT.strasse}, {KONTAKT.ort}
          <br />
          Telefon: {KONTAKT.telefon}, E-Mail: <a className="verweis" href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a>
        </p>
      </section>

      <section>
        <h2>Kurz zusammengefasst</h2>
        <p>
          Diese Website setzt keine Cookies, verwendet keine Analyse- oder Werbedienste und lädt keine Schriften oder
          Inhalte von fremden Servern. Personenbezogene Daten erhalten wir nur, wenn Sie uns selbst schreiben oder anrufen.
        </p>
      </section>

      <section>
        <h2>Hosting und Server-Logdateien</h2>
        <p>
          Die Website wird bei Vercel Inc. (USA) gehostet. Beim Aufruf
          der Seiten werden technisch notwendige Daten verarbeitet: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite,
          Browsertyp und Betriebssystem. Das ist nötig, um die Website sicher auszuliefern (Art. 6 Abs. 1 lit. f DSGVO).
          Vercel ist nach dem EU-US Data Privacy Framework zertifiziert.
        </p>
      </section>

      <section>
        <h2>Anfragen per E-Mail, WhatsApp oder Telefon</h2>
        <p>
          Das Anfrageformular speichert und versendet selbst keine Daten. Es setzt nur einen Text zusammen und öffnet
          damit Ihr eigenes E-Mail-Programm oder WhatsApp. Erst wenn Sie dort auf „Senden“ tippen, erhalten wir Ihre
          Angaben. Wir verwenden sie ausschließlich, um Ihre Anfrage zu beantworten und eine Buchung abzuwickeln
          (Art. 6 Abs. 1 lit. b DSGVO). Die Daten werden gelöscht, sobald sie dafür nicht mehr benötigt werden und keine
          gesetzlichen Aufbewahrungsfristen bestehen.
        </p>
        <p>
          WhatsApp wird von WhatsApp Ireland Ltd. betrieben. Wenn Sie uns über WhatsApp schreiben, gelten zusätzlich
          deren Datenschutzbestimmungen.
        </p>
      </section>

      <section>
        <h2>Belegungskalender</h2>
        <p>
          Die Belegung der Wohnungen wird von unserem Server bei Booking.com abgefragt. Dabei werden keine Daten von
          Ihnen an Booking.com übertragen.
        </p>
      </section>

      <section>
        <h2>Google Maps</h2>
        <p>
          Auf der Kontaktseite gibt es einen Link zu Google Maps. Erst wenn Sie ihn anklicken, wird Google Maps geöffnet
          und es gelten die Datenschutzbestimmungen von Google.
        </p>
      </section>

      <section>
        <h2>Ihre Rechte</h2>
        <p>
          Sie haben jederzeit das Recht auf Auskunft über Ihre gespeicherten Daten sowie auf Berichtigung, Löschung,
          Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wenden Sie sich dafür einfach an{' '}
          <a className="verweis" href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a>.
        </p>
        <p>
          Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der Sächsischen
          Datenschutz- und Transparenzbeauftragten in Dresden.
        </p>
      </section>

      <p className="klein text-schilf">Stand: November 2026</p>
    </RechtsSeite>
  );
}
