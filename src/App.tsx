import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import HomePage from './pages/HomePage';
import SimplyGoodPage from './pages/SimplyGoodPage';
import SimplyNicePage from './pages/SimplyNicePage';
import VerfuegbarkeitPage from './pages/VerfuegbarkeitPage';
import KontaktPage from './pages/KontaktPage';
import ImpressumPage from './pages/ImpressumPage';
import DatenschutzPage from './pages/DatenschutzPage';
import CookieSettingsPage from './pages/CookieSettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simply-good" element={<SimplyGoodPage />} />
          <Route path="/simply-nice" element={<SimplyNicePage />} />
          <Route path="/verfuegbarkeit" element={<VerfuegbarkeitPage />} />
          <Route path="/kontakt" element={<KontaktPage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
          <Route path="/cookie-einstellungen" element={<CookieSettingsPage />} />
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
              <div>
                <div className="text-7xl mb-4">🏠</div>
                <h1 className="text-3xl font-bold text-[#292524] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Seite nicht gefunden
                </h1>
                <p className="text-stone-500 mb-6">Diese Seite existiert leider nicht.</p>
                <a href="/" className="bg-coastal text- deep-blue px-6 py-2.5 rounded-xl font-semibold hover:bg-deep-blue transition-all">
                  Zur Startseite
                </a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  );
}
