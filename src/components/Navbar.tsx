import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Startseite' },
  { to: '/verfuegbarkeit', label: 'Verfügbarkeit' },
  { to: '/simply-good', label: 'Simply Good' },
  { to: '/simply-nice', label: 'Simply Nice' },
  { to: '/kontakt', label: 'Kontakt' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-sand/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center">
              <Home className="w-4 h-4 text- deep-blue" />
            </div>
            <div className="leading-tight">
              <div className="text-stone-dark font-semibold text-sm tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                Ferienwohnungen
              </div>
              <div className="text-terracotta text-xs font-medium tracking-widest uppercase">
                Borna
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  pathname === link.to
                    ? 'bg-terracotta text- deep-blue'
                    : 'text-stone hover:text-stone-dark hover:bg-stone-light/30'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md text-stone hover:bg-stone-light/30"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-sand border-t border-stone-light px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded-md text-sm font-medium transition-all ${
                pathname === link.to
                  ? 'bg-terracotta text- deep-blue'
                  : 'text-stone hover:text-stone-dark hover:bg-stone-light/30'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}