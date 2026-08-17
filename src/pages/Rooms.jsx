import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROOMS } from '../data/roomsData';

export default function Rooms() {
  const navigate = useNavigate();

  // ==================== 1. 3D HERO SLIDER ====================
  const [heroIndex, setHeroIndex] = useState(0);
  const heroDuration = 6000;
  const [heroProgress, setHeroProgress] = useState(0);
  const heroImages = [
    '/assets/images/ChatGPT Image Aug 10, 2026, 12_23_57 AM.png',
    '/assets/images/ChatGPT Image Aug 9, 2026, 02_46_57 PM.png',
    '/assets/images/ChatGPT Image Aug 10, 2026, 12_26_16 AM.png'
  ];

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
                  <div className="gallery-slide-bg" style={{ backgroundImage: `url('${src}')` }}></div>
                  <div className="gallery-slide-overlay"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ambient 3D Lighting & Vignette Overlay */}
        <div className="gallery-3d-light-sweep"></div>
        <div className="gallery-3d-vignette"></div>

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

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '60px' }} className="reveal-up in-view">
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: '#5c534b' }}>
            Each room at Hotel Shree Daan is designed to be a private oasis. Featuring curated local fabrics, smart room lighting panels, glassmorphism details, and premium amenities, our suites represent the best of contemporary 5-star sanctuary.
          </p>
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
                <h3>{r.name}</h3>
                <p className="room-price">
                  {r.id === 'banquet-hall' 
                    ? 'Contact Hotel' 
                    : <>₹{r.price.toLocaleString('en-IN')} <span>/ night</span></>}
                </p>
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
