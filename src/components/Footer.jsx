import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoaderContext } from '../App';

export default function Footer() {
  const { triggerLoader } = useContext(LoaderContext);

  const handleHomeClick = () => {
    triggerLoader();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSpaClick = () => {
    triggerLoader();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <footer id="siteFooter">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" onClick={handleHomeClick}>
            <img src="/assets/images/hsd-logo.png" alt="Hotel Shree Daan" className="logo-img" />
          </Link>
          <p>Luxury stay begins here.</p>
          <p className="footer-address">Hotel Shree Daan, Valsad Road, Balitha, N.H No.8, Vapi - 396 191<br />
            <a href="tel:+917874050009">+91 78740 50009</a></p>
        </div>

        <div className="footer-col">
          <h5>Quick Links</h5>
          <Link to="/" onClick={handleHomeClick}>Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/rooms">Rooms</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer-col">
          <h5>Explore</h5>      
          <Link to="/services">Services</Link>      
          <Link to="/attractions">Near By Attractions</Link>      
          <Link to="/gallery">Gallery</Link>      
          <Link to="/spa" onClick={handleSpaClick}>Golden Sparsh Spa</Link>      
          <Link to="/booking">Book Room</Link>
        </div>

        <div className="footer-col">
          <h5>Our Services</h5>
          <ul className="footer-services">
            <li><Link to="/services">Breakfast</Link></li>
            <li><Link to="/services">Free WIFI</Link></li>
            <li><Link to="/services">Pick &amp; Drop</Link></li>
            <li><Link to="/services">Equipped with LED Rooms</Link></li>
            <li><Link to="/services">Doctor On Call</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Follow</h5>
          <div className="social-links">
            <a href="https://www.instagram.com/hotelshreedaanvapi/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Instagram</title><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.97.24 2.427.403a4.92 4.92 0 011.675.99 4.92 4.92 0 01.99 1.675c.163.457.347 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.427a4.92 4.92 0 01-.99 1.675 4.92 4.92 0 01-1.675.99c-.457.163-1.257.347-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.427-.403a4.92 4.92 0 01-1.675-.99 4.92 4.92 0 01-.99-1.675c-.163-.457-.347-1.257-.403-2.427C2.175 15.585 2.163 15.205 2.163 12s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.427a4.92 4.92 0 01.99-1.675 4.92 4.92 0 011.675-.99c.457-.163 1.257-.347 2.427-.403C8.416 2.175 8.796 2.163 12 2.163zm0 1.838c-3.17 0-3.548.012-4.798.069-1.04.048-1.603.217-1.976.362-.5.187-.855.412-1.23.787-.375.375-.6.73-.787 1.23-.145.373-.314.936-.362 1.976-.057 1.25-.069 1.628-.069 4.798s.012 3.548.069 4.798c.048 1.04.217 1.603.362 1.976.187.5.412.855.787 1.23.375.375.73.6 1.23.787.373.145.936.314 1.976.362 1.25.057 1.628.069 4.798.069s3.548-.012 4.798-.069c1.04-.048 1.603-.217 1.976-.362.5-.187.855-.412 1.23-.787.375-.375.6-.73.787-1.23.145-.373.314-.936.362-1.976.057-1.25.069-1.628.069-4.798s-.012-3.548-.069-4.798c-.048-1.04-.217-1.603-.362-1.976-.187-.5-.412-.855-.787-1.23-.375-.375-.73-.6-1.23-.787-.373-.145-.936-.314-1.976-.362-1.25-.057-1.628-.069-4.798-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z"/></svg>
            </a>
            <a href="https://www.facebook.com/Hotel-Shree-Daan-1691261227763974/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Facebook</title><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 16.67 5.36 20.48 9.8 21v-6.6H7.3v-2.33h2.5V9.8c0-2.47 1.47-3.83 3.68-3.83 1.07 0 2.2.19 2.2.19v2.42h-1.24c-1.22 0-1.6.76-1.6 1.54v1.85h2.73l-.44 2.33h-2.29V21C18.64 20.48 22 16.67 22 12.07z"/></svg>
            </a>
            <a href="#" aria-label="X" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>X</title><path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7A1 1 0 105.7 7.11L10.59 12l-4.89 4.89a1 1 0 101.41 1.41L12 13.41l4.89 4.89a1 1 0 001.41-1.41L13.41 12l4.89-4.89a1 1 0 000-1.4z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Shree Daan Hotel. All rights reserved.</span>
        <span>Crafted with quiet luxury <a href="https://www.tekzoitsolution.in" target="_blank" rel="noopener">Tekzo It Solution</a>.</span>
      </div>
    </footer>
  );
}
