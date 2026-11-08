import { Link } from 'react-router-dom';
import { KONTAKT } from '../data/wohnungen';

export default function Footer() {
  return (
    <footer className="bg-see text-kalk mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid gap-10 sm:grid-cols-3">
        <div>
          <div className="font-semibold text-lg text-white">Ferienwohnungen Borna</div>
          <p className="mt-2 klein text-kalk/80">
            {KONTAKT.name}
            <br />
            {KONTAKT.strasse}
            <br />
            {KONTAKT.ort}
          </p>
        </div>
        <div className="klein space-y-2">
          <a className="block hover:underline" href={KONTAKT.telefonLink}>{KONTAKT.telefon}</a>
          <a className="block hover:underline" href={`https://wa.me/${KONTAKT.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a className="block hover:underline" href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a>
        </div>
        <div className="klein space-y-2">
          <Link className="block hover:underline" to="/impressum">Impressum</Link>
          <Link className="block hover:underline" to="/datenschutz">Datenschutz</Link>
          <p className="pt-3 text-kalk/70">Rauchen ist in den Wohnungen nicht gestattet, auf der Terrasse ist es erlaubt.</p>
        </div>
      </div>
    </footer>
  );
}
