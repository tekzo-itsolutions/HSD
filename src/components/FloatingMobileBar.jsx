import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function FloatingMobileBar() {
  const location = useLocation();

  // Hide floating bar on admin page
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="floating-mobile-bar" id="floatingMobileBar">
      <a 
        href="tel:+917874050009" 
        className="floating-bar-btn floating-call-btn" 
        aria-label="Call Hotel Shree Daan"
      >
        <span className="floating-icon">📞</span>
        <span className="floating-text">Call</span>
      </a>

      <a 
        href="https://wa.me/917874050009?text=Hello%20Hotel%20Shree%20Daan,%20I%20would%20like%20to%20inquire%20about%20a%20room%20or%20spa%20booking." 
        target="_blank" 
        rel="noopener noreferrer" 
        className="floating-bar-btn floating-wa-btn" 
        aria-label="Chat on WhatsApp"
      >
        <span className="floating-icon">💬</span>
        <span className="floating-text">WhatsApp</span>
      </a>

      <Link 
        to="/booking" 
        className="floating-bar-btn floating-book-btn" 
        aria-label="Book a Room"
      >
        <span className="floating-icon">✦</span>
        <span className="floating-text">Book Now</span>
      </Link>
    </div>
  );
}
