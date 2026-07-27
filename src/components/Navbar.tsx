import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Startseite' },
  { to: '/simply-good', label: 'Simply Good' },
  { to: '/simply-nice', label: 'Simply Nice' },
  { to: '/verfuegbarkeit', label: 'Verfügbarkeit' },
  { to: '/kontakt', label: 'Kontakt' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-[#292524]/95 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#b45309] flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-[#fef3c7] font-semibold text-sm tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                Ferienwohnungen
              </div>
              <div className="text-[#b45309] text-xs font-medium tracking-widest uppercase">
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
                    ? 'bg-[#b45309] text-white'
                    : 'text-[#fef3c7]/80 hover:text-[#fef3c7] hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md text-[#fef3c7] hover:bg-white/10"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#292524] border-t border-white/10 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded-md text-sm font-medium transition-all ${
                pathname === link.to
                  ? 'bg-[#b45309] text-white'
                  : 'text-[#fef3c7]/80 hover:text-[#fef3c7] hover:bg-white/10'
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
