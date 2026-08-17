import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
  }, [location]);

  return (
    <>
      <header id="siteHeader" className={scrolled ? 'scrolled' : ''}>
        <div className="header-inner">
          <Link to="/" className="logo">
            <img src="/assets/images/hsd-logo.png" alt="Hotel Shree Daan" className="logo-img" />
          </Link>
          <nav id="mainNav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
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
              <NavLink to="/spa" className={({ isActive }) => `nav-link-dropdown ${isActive ? 'active' : ''}`}>Golden Sparsh Spa <span className="nav-arrow">▾</span></NavLink>
              <div className="nav-dropdown-menu">
                <Link to="/spa-details#body-scrub">Body Scrub</Link>
                <Link to="/spa-details#bath-therapy">Luxury Bath Therapy</Link>
                <Link to="/spa-details#rejuvenate">Rejuvenate</Link>
                <Link to="/spa-details#body-therapy">Body Therapy</Link>
                <Link to="/spa-details#ayurveda">Ayurveda</Link>
                <Link to="/spa-details#spa-packages">Spa Packages &amp; Escapes</Link>
                <Link to="/spa-details#facial-therapy">Facial Therapy</Link>
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

      <div id="mobileMenu" className={isOpen ? 'open' : ''}>
        <nav>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About Us</NavLink>
          <NavLink to="/rooms" className={({ isActive }) => isActive ? 'active' : ''}>Rooms</NavLink>      
          <NavLink to="/spa" className={({ isActive }) => isActive ? 'active' : ''}>Golden Sparsh Spa</NavLink>   
          <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''}>Services</NavLink>      
          <NavLink to="/attractions" className={({ isActive }) => isActive ? 'active' : ''}>Near By Attractions</NavLink>      
          <NavLink to="/gallery" className={({ isActive }) => isActive ? 'active' : ''}>Gallery</NavLink>      
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact Us</NavLink>
        </nav>
      </div>
    </>
  );
}
