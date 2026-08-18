import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GALLERY_HERO_IMAGES = [
  '/assets/images/hero-gallery-1.jpg',
  '/assets/images/hero-about-3.jpg',
  '/assets/images/pic 73.jpg.jpeg'
];

if (typeof window !== 'undefined') {
  GALLERY_HERO_IMAGES.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

export default function Gallery() {
  // ==================== 1. 3D HERO SLIDER ====================
  const [heroIndex, setHeroIndex] = useState(0);
  const heroDuration = 6000;
  const [heroProgress, setHeroProgress] = useState(0);
  const heroImages = GALLERY_HERO_IMAGES;

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

  // ==================== 2. GALLERY LIGHTBOX ====================
  const galleryItems = [
    { src: '/assets/images/chatgpt-image-aug-10-2026-11_46_14-pm.jpg', title: 'Executive Rooms', category: 'executive-rooms', style: { background: 'radial-gradient(ellipse at 40% 50%, #8a5a1f, #3d270e 60%, #14090C)' } },
    { src: '/assets/images/chatgpt-image-aug-10-2026-12_23_57-am.jpg', title: 'Executive Rooms', category: 'executive-rooms', style: { background: 'radial-gradient(ellipse at 40% 50%, #8a5a1f, #3d270e 60%, #14090C)' } },
    { src: '/assets/images/chatgpt-image-aug-11-2026-10_40_10-pm.jpg', title: 'Premier Suite', category: 'premier-suite', style: { background: 'radial-gradient(ellipse at 50% 50%, #6E1027, #3d0e1c 60%, #14090C)' } },
    { src: '/assets/images/chatgpt-image-aug-10-2026-12_25_56-am.jpg', title: 'Executive Rooms', category: 'executive-rooms', style: { background: 'radial-gradient(ellipse at 40% 50%, #8a5a1f, #3d270e 60%, #14090C)' } },
    { src: '/assets/images/chatgpt-image-aug-10-2026-12_26_16-am.jpg', title: 'Standard Rooms', category: 'standard-rooms', style: { background: 'radial-gradient(ellipse at 50% 40%, #3f5240, #1c261d 60%, #14090C)' } },
    { src: '/assets/images/chatgpt-image-aug-9-2026-02_46_57-pm.jpg', title: 'Standard Rooms', category: 'standard-rooms', style: { background: 'radial-gradient(ellipse at 50% 40%, #3f5240, #1c261d 60%, #14090C)' } },
    { src: '/assets/images/chatgpt-image-aug-12-2026-01_37_14-pm.jpg', title: 'Standard Rooms', category: 'standard-rooms', style: { background: 'radial-gradient(ellipse at 50% 40%, #3f5240, #1c261d 60%, #14090C)' } },
    { src: '/assets/images/chatgpt-image-aug-11-2026-11_30_47-pm.jpg', title: 'Banquet Halls', category: 'banquet-halls', style: { background: 'radial-gradient(ellipse at 60% 30%, #2f5a63, #14262c 60%, #14090C)' } },
    { src: '/assets/images/chatgpt-image-aug-9-2026-02_52_30-pm.jpg', title: 'Banquet Halls', category: 'banquet-halls', style: { background: 'radial-gradient(ellipse at 60% 30%, #2f5a63, #14262c 60%, #14090C)' } },
    { src: '/assets/images/chatgpt-image-aug-12-2026-05_59_38-pm.jpg', title: 'Room Kit', category: 'room-kit', style: { background: 'radial-gradient(ellipse at 40% 60%, #C9A227, #4A0A1A 55%, #14090C)' } },
    { src: '/assets/images/chatgpt-image-aug-12-2026-03_10_52-pm.jpg', title: 'Room Kit', category: 'room-kit', style: { background: 'radial-gradient(ellipse at 40% 60%, #C9A227, #4A0A1A 55%, #14090C)' } }
  ];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goNextLightbox = () => {
    setLightboxIndex(prev => (prev + 1) % galleryItems.length);
  };

  const goPrevLightbox = () => {
    setLightboxIndex(prev => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  // Keyboard accessibility for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') goNextLightbox();
      else if (e.key === 'ArrowLeft') goPrevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <>
      {/* ===== 3D GALLERY HERO SLIDER ===== */}
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
                    alt="Hotel Shree Daan Visuals & Gallery"
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
            <span className="badge-sparkle">✦</span> HOTEL SHREE DAAN VISUALS &amp; GALLERY <span className="badge-sparkle">✦</span>
          </div>
          <h1 className="gallery-hero-title">
            Photo <span>Gallery</span>
          </h1>
          <div className="gallery-hero-breadcrumb">
            <Link to="/">HOME</Link>
            <span className="sep">›</span>
            <span className="active">PHOTO GALLERY</span>
          </div>
        </div>

        {/* 3D Navigation Arrows */}
        <button className="gallery-3d-arrow gallery-prev" onClick={goPrevHero} aria-label="Previous Slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button className="gallery-3d-arrow gallery-next" onClick={goNextHero} aria-label="Next Slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        {/* Slider Controls */}
        <div className="gallery-3d-controls">
          <div className="gallery-3d-dots" id="gallery3dDots">
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

      {/* ===== GALLERY MASONRY ===== */}
      <section className="section">
        <div className="section-head reveal-up">
          <p className="eyebrow">A Glimpse Within</p>
          <h2>Hotel Shree Daan <em>Visuals</em></h2>
        </div>

        {/* Masonry Gallery Grid */}
        <div className="gallery-grid" id="galleryGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="gallery-item reveal-up in-view"
              data-index={idx}
              data-category={item.category}
              onClick={() => openLightbox(idx)}
              style={{ ...item.style, cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: '8px', paddingBottom: '75%' }}
            >
              <img src={item.src} alt={item.title} className="gallery-item-img" loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <span className="g-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>{item.title}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== LIGHTBOX MODAL (FULL IMAGE VIEW) ===== */}
      {lightboxOpen && (
        <div id="lightbox" className="lightbox" style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(13,6,8,0.98)', zIndex: 10000, alignItems: 'center', justifyContent: 'center' }}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close Lightbox">✕</button>
          <button className="lightbox-nav lightbox-prev" onClick={goPrevLightbox} aria-label="Previous Image">‹</button>
          
          <div className="lightbox-container" id="lightboxContainer" style={{ position: 'relative', maxWidth: '85vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={galleryItems[lightboxIndex].src} id="lightboxImg" className="lightbox-img" alt="Gallery Full View" style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px' }} />
            <div className="lightbox-info" style={{ width: '100%', marginTop: '12px', display: 'flex', justifyContent: 'space-between', color: 'var(--white)', fontSize: '0.9rem' }}>
              <div className="lightbox-title" id="lightboxTitle">{galleryItems[lightboxIndex].title}</div>
              <div className="lightbox-counter" id="lightboxCounter">Photo {lightboxIndex + 1} of {galleryItems.length}</div>
            </div>
          </div>
          
          <button className="lightbox-nav lightbox-next" onClick={goNextLightbox} aria-label="Next Image">›</button>
        </div>
      )}
    </>
  );
}
