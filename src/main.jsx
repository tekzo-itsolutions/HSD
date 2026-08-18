import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/style.css'
import './styles/responsive.css'
import App from './App.jsx'

// Global instant cache warmup for all hero images across the site
const SITE_HERO_ASSETS = [
  '/assets/images/hero-rooms-1.jpg',
  '/assets/images/hero-rooms-2.jpg',
  '/assets/images/hero-rooms-3.jpg',
  '/assets/images/hero-about-1.jpg',
  '/assets/images/hero-about-2.jpg',
  '/assets/images/hero-about-3.jpg',
  '/assets/images/hero-services-1.jpg',
  '/assets/images/hero-booking-3.jpg',
  '/assets/images/hero-gallery-1.jpg',
  '/assets/images/hero-contact-2.jpg',
  '/assets/images/hero-contact-3.jpg',
  '/assets/images/damans1.jpg',
  '/assets/images/silvasas1.jpg',
  '/assets/images/wilsons hill2.jpg',
  '/assets/images/pic 73.jpg.jpeg',
  '/assets/images/spa-long.jpg'
];

if (typeof window !== 'undefined') {
  SITE_HERO_ASSETS.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
