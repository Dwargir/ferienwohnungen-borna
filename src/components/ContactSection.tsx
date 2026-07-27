import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactSection() {
  return (
    <section className="bg-[#292524] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#fef3c7] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Kontakt & Buchung
          </h2>
          <p className="text-[#fef3c7]/60 max-w-xl mx-auto">
            Wir freuen uns auf Ihre Anfrage! Kontaktieren Sie uns per Telefon, WhatsApp oder E-Mail.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <a
            href="tel:01781895560"
            className="flex flex-col items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#b45309]/20 flex items-center justify-center group-hover:bg-[#b45309]/30 transition-colors">
              <Phone className="w-5 h-5 text-[#b45309]" />
            </div>
            <div className="text-center">
              <div className="text-[#fef3c7]/50 text-xs uppercase tracking-wider mb-1">Telefon</div>
              <div className="text-[#fef3c7] font-semibold">0178 1895560</div>
            </div>
          </a>

          <a
            href="https://wa.me/491781895560"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#b45309]/20 flex items-center justify-center group-hover:bg-[#b45309]/30 transition-colors">
              <MessageCircle className="w-5 h-5 text-[#b45309]" />
            </div>
            <div className="text-center">
              <div className="text-[#fef3c7]/50 text-xs uppercase tracking-wider mb-1">WhatsApp</div>
              <div className="text-[#fef3c7] font-semibold">0178 1895560</div>
            </div>
          </a>

          <a
            href="mailto:utafinke@web.de"
            className="flex flex-col items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#b45309]/20 flex items-center justify-center group-hover:bg-[#b45309]/30 transition-colors">
              <Mail className="w-5 h-5 text-[#b45309]" />
            </div>
            <div className="text-center">
              <div className="text-[#fef3c7]/50 text-xs uppercase tracking-wider mb-1">E-Mail</div>
              <div className="text-[#fef3c7] font-semibold text-sm">utafinke@web.de</div>
            </div>
          </a>

          <div className="flex flex-col items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="w-12 h-12 rounded-full bg-[#b45309]/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#b45309]" />
            </div>
            <div className="text-center">
              <div className="text-[#fef3c7]/50 text-xs uppercase tracking-wider mb-1">Adresse</div>
              <div className="text-[#fef3c7] font-semibold text-sm">Robert-Koch-Str. 26<br />04552 Borna</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/kontakt"
            className="inline-flex items-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Anfrage senden
          </Link>
          <p className="mt-3 text-[#fef3c7]/40 text-xs">
            Buchung erst nach Bestätigung verbindlich
          </p>
        </div>
      </div>
    </section>
  );
}
