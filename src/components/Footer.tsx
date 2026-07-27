import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#292524] text-[#fef3c7]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-[#fef3c7] font-semibold text-lg mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ferienwohnungen Borna
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Zwei liebevoll eingerichtete Apartments im Herzen des Leipziger Neuseenlandes.
            </p>
            <p className="text-xs text-[#fef3c7]/50">
              Simply Good • Simply Nice
            </p>
          </div>

          {/* Apartments */}
          <div>
            <h4 className="text-[#b45309] font-semibold text-sm uppercase tracking-wider mb-3">
              Unsere Wohnungen
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/simply-good" className="hover:text-[#fef3c7] transition-colors">
                  Simply Good – Erdgeschoss
                </Link>
              </li>
              <li>
                <Link to="/simply-nice" className="hover:text-[#fef3c7] transition-colors">
                  Simply Nice – Dachgeschoss
                </Link>
              </li>
              <li>
                <Link to="/verfuegbarkeit" className="hover:text-[#fef3c7] transition-colors">
                  Verfügbarkeit prüfen
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="hover:text-[#fef3c7] transition-colors">
                  Kontakt & Buchung
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#b45309] font-semibold text-sm uppercase tracking-wider mb-3">
              Kontakt
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#b45309] flex-shrink-0" />
                <span>Robert-Koch-Straße 26, 04552 Borna</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#b45309] flex-shrink-0" />
                <a href="tel:01781895560" className="hover:text-[#fef3c7] transition-colors">
                  0178 1895560
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#b45309] flex-shrink-0" />
                <a
                  href="https://wa.me/491781895560"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#fef3c7] transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#b45309] flex-shrink-0" />
                <a href="mailto:utafinke@web.de" className="hover:text-[#fef3c7] transition-colors">
                  utafinke@web.de
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#fef3c7]/40">
          <span>© 2025 Ferienwohnungen Borna – Uta Finke. Alle Rechte vorbehalten.</span>
          <div className="flex gap-4">
            <Link to="/impressum" className="hover:text-[#fef3c7]/70 transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-[#fef3c7]/70 transition-colors">Datenschutz</Link>
            <Link to="/cookie-einstellungen" className="hover:text-[#fef3c7]/70 transition-colors">Cookie-Einstellungen</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
