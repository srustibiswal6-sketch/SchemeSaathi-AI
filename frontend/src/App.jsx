import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Schemes from './pages/Schemes';
import SchemeDetails from './pages/SchemeDetails';
import Documents from './pages/Documents';
import ApplicationGuide from './pages/ApplicationGuide';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="app-layout">
          <Navbar />
          <main className="app-main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/scheme/:id" element={<SchemeDetails />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/application/:id" element={<ApplicationGuide />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ProfileProvider>
  );
}

export default App;