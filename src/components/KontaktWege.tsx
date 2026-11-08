import { Link } from 'react-router-dom';
import { Brief, Sprechblase, Telefon } from './Icons';
import { KONTAKT } from '../data/wohnungen';

export default function KontaktWege({ mitFormularLink = true }: { mitFormularLink?: boolean }) {
  return (
    <div className="bg-see text-white rounded-md px-6 py-10 sm:px-12 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
      <div>
        <h2 className="text-3xl text-white">Fragen? Rufen Sie einfach an.</h2>
        <p className="mt-3 text-kalk/85 max-w-md">
          Ihre Gastgeberin ist {KONTAKT.name}. Sie erreichen sie am besten telefonisch oder per WhatsApp.
        </p>
        {mitFormularLink && (
          <p className="mt-5 klein">
            Lieber schriftlich? <Link to="/kontakt" className="underline underline-offset-4">Zum Anfrageformular</Link>
          </p>
        )}
      </div>
      <ul className="space-y-4">
        <li>
          <a href={KONTAKT.telefonLink} className="flex items-center gap-4 no-underline group">
            <span className="w-11 h-11 rounded-full bg-white text-see flex items-center justify-center"><Telefon /></span>
            <span className="text-2xl font-semibold group-hover:underline underline-offset-4 tabular-nums">{KONTAKT.telefon}</span>
          </a>
        </li>
        <li>
          <a href={`https://wa.me/${KONTAKT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 no-underline group">
            <span className="w-11 h-11 rounded-full border border-white/50 flex items-center justify-center"><Sprechblase /></span>
            <span className="group-hover:underline underline-offset-4">Nachricht per WhatsApp</span>
          </a>
        </li>
        <li>
          <a href={`mailto:${KONTAKT.email}`} className="flex items-center gap-4 no-underline group">
            <span className="w-11 h-11 rounded-full border border-white/50 flex items-center justify-center"><Brief /></span>
            <span className="group-hover:underline underline-offset-4">{KONTAKT.email}</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
