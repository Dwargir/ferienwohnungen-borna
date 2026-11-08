import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import WohnungPage from './pages/WohnungPage';
import VerfuegbarkeitPage from './pages/VerfuegbarkeitPage';
import KontaktPage from './pages/KontaktPage';
import ImpressumPage from './pages/ImpressumPage';
import DatenschutzPage from './pages/DatenschutzPage';

function NachObenScrollen() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NichtGefunden() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-20">
      <h1 className="text-4xl">Diese Seite gibt es nicht</h1>
      <p className="mt-4">Vielleicht hat sich die Adresse geändert.</p>
      <Link to="/" className="knopf mt-6">Zur Startseite</Link>
    </div>
  );
}

export function Seiten() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simply-good" element={<WohnungPage id="simply-good" />} />
          <Route path="/simply-nice" element={<WohnungPage id="simply-nice" />} />
          <Route path="/verfuegbarkeit" element={<VerfuegbarkeitPage />} />
          <Route path="/kontakt" element={<KontaktPage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
          <Route path="/cookie-einstellungen" element={<Navigate to="/datenschutz" replace />} />
          <Route path="*" element={<NichtGefunden />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NachObenScrollen />
      <Seiten />
    </BrowserRouter>
  );
}
