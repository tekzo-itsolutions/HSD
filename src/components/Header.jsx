import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LoaderContext } from '../App';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false);
  const [mobileSpaOpen, setMobileSpaOpen] = useState(false);
  const location = useLocation();
  const { triggerLoader } = useContext(LoaderContext);

  const handleHomeClick = () => {
    setIsOpen(false);
    triggerLoader();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSpaClick = () => {
    setIsOpen(false);
    triggerLoader();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <header id="siteHeader" className={scrolled ? 'scrolled' : ''}>
        <div className="header-inner">
          <Link to="/" className="logo" onClick={handleHomeClick}>
            <img src="/assets/images/hsd-logo.png" alt="Hotel Shree Daan" className="logo-img" />
          </Link>
          <nav id="mainNav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={handleHomeClick}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About Us</NavLink>
            <div className="nav-item-dropdown">
              <NavLink to="/rooms" className={({ isActive }) => `nav-link-dropdown ${isActive ? 'active' : ''}`}>Rooms <span className="nav-arrow">▾</span></NavLink>
              <div className="nav-dropdown-menu">
                <Link to="/booking?room=premier">Premier Suite</Link>
                <Link to="/booking?room=executive-double">Executive Double</Link>
                <Link to="/booking?room=executive-single">Executive Single</Link>
                <Link to="/booking?room=standard-double">Standard Double</Link>
                <Link to="/booking?room=standard-single">Standard Single</Link>
                <Link to="/booking?room=banquet-hall">Banquet Hall</Link>
              </div>
            </div>      
            <div className="nav-item-dropdown">
              <NavLink to="/spa" className={({ isActive }) => `nav-link-dropdown ${isActive ? 'active' : ''}`} onClick={handleSpaClick}>Golden Sparsh Spa <span className="nav-arrow">▾</span></NavLink>
              <div className="nav-dropdown-menu">
                <Link to="/spa-details#body-scrub" onClick={handleSpaClick}>Body Scrub</Link>
                <Link to="/spa-details#bath-therapy" onClick={handleSpaClick}>Luxury Bath Therapy</Link>
                <Link to="/spa-details#rejuvenate" onClick={handleSpaClick}>Rejuvenate</Link>
                <Link to="/spa-details#body-therapy" onClick={handleSpaClick}>Body Therapy</Link>
                <Link to="/spa-details#ayurveda" onClick={handleSpaClick}>Ayurveda</Link>
                <Link to="/spa-details#spa-packages" onClick={handleSpaClick}>Spa Packages &amp; Escapes</Link>
                <Link to="/spa-details#facial-therapy" onClick={handleSpaClick}>Facial Therapy</Link>
              </div>
            </div>
            <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''}>Services</NavLink>      
            <NavLink to="/attractions" className={({ isActive }) => isActive ? 'active' : ''}>Near By Attractions</NavLink>      
            <NavLink to="/gallery" className={({ isActive }) => isActive ? 'active' : ''}>Gallery</NavLink>      
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact Us</NavLink>
          </nav>
          <button id="menuToggle" className={isOpen ? 'open' : ''} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* Backdrop overlay for mobile menu */}
      <div 
        className={`mobile-menu-backdrop ${isOpen ? 'active' : ''}`} 
        onClick={closeMenu}
        aria-hidden="true"
      ></div>

      {/* Modern Luxury Mobile Drawer */}
      <div id="mobileMenu" className={isOpen ? 'open' : ''}>
        <div className="mobile-menu-header">
          <Link to="/" className="mobile-menu-logo" onClick={handleHomeClick}>
            <img src="/assets/images/hsd-logo.png" alt="Hotel Shree Daan" />
          </Link>
          <button className="mobile-menu-close" onClick={closeMenu} aria-label="Close menu">
            ✕
          </button>
        </div>

        <div className="mobile-menu-scrollable">
          <nav className="mobile-nav-list">
            <NavLink to="/" end className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={handleHomeClick}>
              <span>Home</span>
            </NavLink>

            <NavLink to="/about" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <span>About Us</span>
            </NavLink>

            {/* Rooms Accordion */}
            <div className={`mobile-accordion ${mobileRoomsOpen ? 'open' : ''}`}>
              <div className="mobile-accordion-head">
                <NavLink to="/rooms" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                  <span>Rooms &amp; Suites</span>
                </NavLink>
                <button 
                  type="button" 
                  className="mobile-accordion-toggle" 
                  onClick={(e) => { e.preventDefault(); setMobileRoomsOpen(!mobileRoomsOpen); }}
                  aria-label="Toggle rooms submenu"
                >
                  <span className="accordion-icon">{mobileRoomsOpen ? '−' : '+'}</span>
                </button>
              </div>
              {mobileRoomsOpen && (
                <div className="mobile-accordion-body">
                  <Link to="/booking?room=premier" onClick={closeMenu}>Premier Suite</Link>
                  <Link to="/booking?room=executive-double" onClick={closeMenu}>Executive Double</Link>
                  <Link to="/booking?room=executive-single" onClick={closeMenu}>Executive Single</Link>
                  <Link to="/booking?room=standard-double" onClick={closeMenu}>Standard Double</Link>
                  <Link to="/booking?room=standard-single" onClick={closeMenu}>Standard Single</Link>
                  <Link to="/booking?room=banquet-hall" onClick={closeMenu}>Banquet Hall</Link>
                </div>
              )}
            </div>

            {/* Spa Accordion */}
            <div className={`mobile-accordion ${mobileSpaOpen ? 'open' : ''}`}>
              <div className="mobile-accordion-head">
                <NavLink to="/spa" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={handleSpaClick}>
                  <span>Golden Sparsh Spa</span>
                </NavLink>
                <button 
                  type="button" 
                  className="mobile-accordion-toggle" 
                  onClick={(e) => { e.preventDefault(); setMobileSpaOpen(!mobileSpaOpen); }}
                  aria-label="Toggle spa submenu"
                >
                  <span className="accordion-icon">{mobileSpaOpen ? '−' : '+'}</span>
                </button>
              </div>
              {mobileSpaOpen && (
                <div className="mobile-accordion-body">
                  <Link to="/spa-details#body-scrub" onClick={handleSpaClick}>Body Scrub</Link>
                  <Link to="/spa-details#bath-therapy" onClick={handleSpaClick}>Luxury Bath Therapy</Link>
                  <Link to="/spa-details#rejuvenate" onClick={handleSpaClick}>Rejuvenate</Link>
                  <Link to="/spa-details#body-therapy" onClick={handleSpaClick}>Body Therapy</Link>
                  <Link to="/spa-details#ayurveda" onClick={handleSpaClick}>Ayurveda</Link>
                  <Link to="/spa-details#spa-packages" onClick={handleSpaClick}>Spa Packages &amp; Escapes</Link>
                  <Link to="/spa-details#facial-therapy" onClick={handleSpaClick}>Facial Therapy</Link>
                </div>
              )}
            </div>

            <NavLink to="/services" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <span>Services</span>
            </NavLink>      

            <NavLink to="/attractions" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <span>Near By Attractions</span>
            </NavLink>      

            <NavLink to="/gallery" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <span>Gallery</span>
            </NavLink>      

            <NavLink to="/contact" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <span>Contact Us</span>
            </NavLink>
          </nav>

          {/* Quick CTA Actions inside Mobile Drawer */}
          <div className="mobile-menu-cta-box">
            <Link to="/booking" className="btn btn-gold btn-block" onClick={closeMenu}>
              <span>✦ Book Your Stay</span>
            </Link>

            <div className="mobile-menu-contact-info">
              <a href="tel:+917874050009" className="mobile-contact-pill">
                <span className="contact-icon">📞</span>
                <span>+91 78740 50009</span>
              </a>
              <a href="https://wa.me/917874050009" target="_blank" rel="noopener noreferrer" className="mobile-contact-pill whatsapp-pill">
                <span className="contact-icon">💬</span>
                <span>WhatsApp Us</span>
              </a>
            </div>
            
            <p className="mobile-address-note">Valsad Road, Balitha, N.H No.8, Vapi</p>
          </div>
        </div>
      </div>
    </>
  );
}
