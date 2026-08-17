import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';
import ScrollToTop from './components/ScrollToTop';

// Page Imports
import Home from './pages/Home';
import About from './pages/About';
import Rooms from './pages/Rooms';
import Booking from './pages/Booking';
import Spa from './pages/Spa';
import SpaDetails from './pages/SpaDetails';
import Services from './pages/Services';
import Attractions from './pages/Attractions';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

// Global Layout wrapper that handles scroll-reveal and animated counters
function LayoutWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Scroll reveal observer on route change
    const targets = document.querySelectorAll('.reveal-up');
    if (!targets.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(t => io.observe(t));

    return () => {
      targets.forEach(t => io.unobserve(t));
    };
  }, [location.pathname]);

  useEffect(() => {
    const stats = document.querySelectorAll('[data-count]');
    if (!stats.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1600;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target;
          }
        }

        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.15 });

    stats.forEach(s => io.observe(s));

    return () => {
      stats.forEach(s => io.unobserve(s));
    };
  }, [location.pathname]);

  return <>{children}</>;
}

// Standard Site Layout (with Header, Footer, CursorGlow)
function SiteLayout() {
  return (
    <LayoutWrapper>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about.html" element={<About />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms.html" element={<Rooms />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking.html" element={<Booking />} />
        <Route path="/spa" element={<Spa />} />
        <Route path="/spa.html" element={<Spa />} />
        <Route path="/spa-details" element={<SpaDetails />} />
        <Route path="/spa-details.html" element={<SpaDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services.html" element={<Services />} />
        <Route path="/attractions" element={<Attractions />} />
        <Route path="/attractions.html" element={<Attractions />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery.html" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact.html" element={<Contact />} />
      </Routes>
      <Footer />
      <CursorGlow />
    </LayoutWrapper>
  );
}

// App Root
function App() {
  const [loading, setLoading] = useState(true);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!loading) return;

    document.body.style.overflow = 'hidden';
    const interval = setInterval(() => {
      setPct(prev => {
        const next = prev + Math.floor(Math.random() * 12) + 4;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            document.body.style.overflow = '';
          }, 350);
          return 100;
        }
        return next;
      });
    }, 80);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, [loading]);

  return (
    <Router>
      <ScrollToTop />
      {loading && (
        <div id="loader" className={pct === 100 ? 'loaded' : ''}>
          <div className="loader-jaali"></div>
          <div className="loader-content">
            <img src="/assets/images/hsd-logo.png" alt="Hotel Shree Daan" className="loader-logo" />
            <div className="loader-full-line-container">
              <div className="loader-line loader-line-left" style={{ width: `${pct / 2}%` }}></div>
              <div className="loader-line loader-line-right" style={{ width: `${pct / 2}%` }}></div>
            </div>
            <div className="loader-pct"><span>{pct}</span>%</div>
          </div>
        </div>
      )}
      <Routes>
        {/* Admin Dashboard */}
        <Route path="/admin" element={<LayoutWrapper><Admin /></LayoutWrapper>} />
        <Route path="/admin.html" element={<LayoutWrapper><Admin /></LayoutWrapper>} />
        {/* All Other Site Pages */}
        <Route path="/*" element={<SiteLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
