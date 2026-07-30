import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Calendar, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-dark text-sand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text- deep-blue font-bold text-xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ferienwohnungen Borna
            </h3>
            <p className="text-sand/70 text-sm mb-6 leading-relaxed">
              Zwei liebevoll eingerichtete Apartments im Herzen des Leipziger Neuseenlandes.
            </p>
            <div className="flex items-start gap-2 text-sm text-sand/70">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-terracotta" />
              <div>
                <div>Robert-Koch-Straße 26</div>
                <div>04552 Borna</div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text- deep-blue font-semibold text-sm uppercase tracking-wider mb-4">Kontakt</h4>
            <div className="space-y-3">
              <a href="tel:+491781895560" className="flex items-center gap-2 text-sm text-sand/70 hover:text- deep-blue transition-colors group">
                <Phone className="w-4 h-4 text-terracotta group-hover:text-terracotta-light" />
                0178 1895560
              </a>
              <a href="https://wa.me/491781895560" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-sand/70 hover:text- deep-blue transition-colors group">
                <MessageCircle className="w-4 h-4 text-sage group-hover:text-sage-light" />
                WhatsApp schreiben
              </a>
              <a href="mailto:utafinke@web.de" className="flex items-center gap-2 text-sm text-sand/70 hover:text- deep-blue transition-colors group">
                <Mail className="w-4 h-4 text-terracotta group-hover:text-terracotta-light" />
                utafinke@web.de
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text- deep-blue font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Startseite' },
                { to: '/verfuegbarkeit', label: 'Verfügbarkeit prüfen' },
                { to: '/simply-good', label: 'Simply Good' },
                { to: '/simply-nice', label: 'Simply Nice' },
                { to: '/kontakt', label: 'Kontakt' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-sand/70 hover:text- deep-blue transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text- deep-blue font-semibold text-sm uppercase tracking-wider mb-4">Rechtliches</h4>
            <ul className="space-y-2 mb-6">
              {[
                { to: '/impressum', label: 'Impressum' },
                { to: '/datenschutz', label: 'Datenschutz' },
                { to: '/cookie-einstellungen', label: 'Cookie-Einstellungen' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-sand/70 hover:text- deep-blue transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/verfuegbarkeit" className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text- deep-blue bg-terracotta hover:bg-terracotta-dark rounded-lg transition-colors">
              <Calendar className="w-4 h-4" />
              Verfügbarkeit prüfen
            </Link>
          </div>
        </div>

        <div className="border-t border-stone/20 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sand/50 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Ferienwohnungen Borna · Robert-Koch-Straße 26, 04552 Borna
          </p>
          <p className="text-sand/40 text-xs text-center">
            🚭 Rauchen in den Wohnungen nicht gestattet. Auf der Terrasse erlaubt.
          </p>
        </div>
      </div>
    </footer>
  );
}