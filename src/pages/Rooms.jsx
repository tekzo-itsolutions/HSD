import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROOMS } from '../data/roomsData';

const ROOMS_HERO_IMAGES = [
  '/assets/images/hero-rooms-1.jpg',
  '/assets/images/hero-rooms-2.jpg',
  '/assets/images/hero-rooms-3.jpg'
];

// Preload rooms hero images into browser cache immediately
if (typeof window !== 'undefined') {
  ROOMS_HERO_IMAGES.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

export default function Rooms() {
  const navigate = useNavigate();

  // ==================== 1. 3D HERO SLIDER ====================
  const [heroIndex, setHeroIndex] = useState(0);
  const heroDuration = 6000;
  const [heroProgress, setHeroProgress] = useState(0);
  const heroImages = ROOMS_HERO_IMAGES;

  useEffect(() => {
    setHeroProgress(0);
    const step = 100 / (heroDuration / 50);
    const progressInterval = setInterval(() => {
      setHeroProgress(prev => {
        if (prev >= 100) return 100;
        return prev + step;
      });
    }, 50);

    const autoInterval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroImages.length);
    }, heroDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(autoInterval);
    };
  }, [heroIndex]);

  const goNextHero = () => setHeroIndex(prev => (prev + 1) % heroImages.length);
  const goPrevHero = () => setHeroIndex(prev => (prev - 1 + heroImages.length) % heroImages.length);

  // ==================== 2. 3D CARD MOUSE TILT ====================
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((centerY - y) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0deg)';
  };

  return (
    <>
      {/* ===== 3D ROOMS HERO SLIDER ===== */}
      <section id="galleryHeroSlider" className="gallery-hero-3d">
        <div className="gallery-3d-viewport">
          <div className="gallery-3d-slides" id="gallery3dSlides">
            {heroImages.map((src, idx) => {
              let diff = idx - heroIndex;
              const total = heroImages.length;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              let className = 'gallery-3d-slide';
              if (diff === 0) className += ' active';
              else if (diff === 1 || (heroIndex === total - 1 && idx === 0)) className += ' next-slide';
              else if (diff === -1 || (heroIndex === 0 && idx === total - 1)) className += ' prev-slide';

              return (
                <div key={idx} className={className} data-index={idx}>
                  <img
                    src={src}
                    alt="Hotel Shree Daan Luxury Room"
                    className="gallery-slide-img"
                    loading="eager"
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                  <div className="gallery-slide-overlay"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ambient 3D Lighting Sweep Overlay */}
        <div className="gallery-3d-light-sweep"></div>

        {/* Hero Content Overlay */}
        <div className="gallery-hero-content">
          <div className="gallery-hero-badge">
            <span className="badge-sparkle">✦</span> LUXURY ACCOMMODATIONS &amp; SUITES <span className="badge-sparkle">✦</span>
          </div>
          <h1 className="gallery-hero-title">
            Our <span>Rooms</span>
          </h1>
          <div className="gallery-hero-breadcrumb">
            <Link to="/">HOME</Link>
            <span className="sep">›</span>
            <span className="active">ROOMS &amp; SUITES</span>
          </div>
        </div>

        {/* 3D Navigation Arrows */}
        <button className="gallery-3d-arrow gallery-prev" onClick={goPrevHero} aria-label="Previous Slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button className="gallery-3d-arrow gallery-next" onClick={goNextHero} aria-label="Next Slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        {/* Slider Controls & Auto Progress Bar */}
        <div className="gallery-3d-controls">
          <div className="gallery-3d-dots" id="about3dDots">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                className={`gallery-dot ${heroIndex === idx ? 'active' : ''}`}
                onClick={() => setHeroIndex(idx)}
              >
                <span>0{idx + 1}</span>
              </button>
            ))}
          </div>
          <div className="gallery-3d-progress">
            <div className="gallery-progress-bar" style={{ width: `${Math.min(heroProgress, 100)}%`, transition: 'width 0.05s linear' }}></div>
          </div>
        </div>
      </section>

      {/* ===== ROOMS GRID SECTION ===== */}
      <section className="section">
        <div className="section-head reveal-up">
          <p className="eyebrow">Accommodations</p>
          <h2>Rooms &amp; Suites</h2>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '30px' }} className="reveal-up in-view">
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: '#5c534b' }}>
            Each room at Hotel Shree Daan is designed to be a private oasis. Featuring curated local fabrics, smart room lighting panels, glassmorphism details, and premium amenities, our suites represent the best of contemporary 5-star sanctuary.
          </p>
        </div>

        {/* COMPULSORY CALLING ALERT BANNER */}
        <div className="compulsory-call-banner reveal-up in-view" style={{ maxWidth: '900px', margin: '0 auto 40px' }}>
          <div className="call-banner-left">
            <span className="call-banner-icon">📞</span>
            <div className="call-banner-info">
              <h4>CALLING IS COMPULSORY FOR ROOM BOOKINGS</h4>
              <p>Prior phone call to front desk is mandatory to confirm all room reservations &amp; availability.</p>
            </div>
          </div>
          <a href="tel:+918698988034" className="btn btn-call-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call Front Desk: +91 86989 88034
          </a>
        </div>

        <div className="rooms-grid" id="roomsGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {ROOMS.map(r => (
            <div key={r.id} className="room-card reveal-up in-view" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <div className="room-image-wrap">
                <div className="room-image">
                  <div className="room-bg" style={{ position: 'absolute', inset: 0, background: r.image ? `url('${r.image}') center/cover no-repeat` : r.gradient }}></div>
                </div>
                <span className="room-rating">★ {r.rating}</span>
              </div>
              <div className="room-body">
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{ background: 'rgba(201, 162, 39, 0.12)', color: 'var(--gold-dark)', border: '1px solid rgba(201, 162, 39, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                    🐾 Pet Friendly
                  </span>
                  {r.id !== 'banquet-hall' && (
                    <span style={{ background: 'rgba(110, 16, 39, 0.08)', color: 'var(--maroon)', border: '1px solid rgba(110, 16, 39, 0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                      👥 Max 3 Persons
                    </span>
                  )}
                </div>
                <h3>{r.name}</h3>
                <p className="room-price">
                  {r.id === 'banquet-hall' 
                    ? 'Contact Hotel' 
                    : <>₹{r.price.toLocaleString('en-IN')} <span>/ night</span></>}
                </p>
                {r.id !== 'banquet-hall' && (
                  <p style={{ fontSize: '0.78rem', color: '#7a7067', margin: '-4px 0 12px 0' }}>
                    Up to 10 Yrs Free • Above 10 Yrs ₹450/night extra
                  </p>
                )}
                <button className="btn btn-gold" style={{ width: '100%' }} onClick={() => navigate(`/booking?room=${r.id}`)}>
                  {r.id === 'banquet-hall' ? 'Contact Hotel' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== COMPLIMENTARY SERVICES ===== */}
      <section className="section">
        <div className="section-head reveal-up">
          <p className="eyebrow">Inclusions</p>
          <h2>Every Room Includes</h2>
        </div>

        <div className="services-grid">
          <div className="service-card reveal-up in-view">
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🐾</div>
            <h3>Pet Friendly Stay</h3>
            <p>Pets are warmly welcomed! Enjoy your trip with your furry family members in our dedicated pet-friendly rooms.</p>
          </div>
          <div className="service-card reveal-up in-view">
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>☕</div>
            <h3>Welcome Platter</h3>
            <p>Assorted local sweets, seasonal fruits, and specialty herbal teas upon check-in.</p>
          </div>
          <div className="service-card reveal-up in-view">
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>👔</div>
            <h3>Pressing Service</h3>
            <p>Complimentary pressing of up to two garments per day, handled with utmost care.</p>
          </div>
          <div className="service-card reveal-up in-view">
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🧴</div>
            <h3>Vedic Toiletries</h3>
            <p>Premium body care products made from essential oils and organic plant extracts.</p>
          </div>
        </div>
      </section>
    </>
  );
}
