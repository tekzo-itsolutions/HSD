import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ATTRACTIONS_LIST = [
  {
    title: 'Daman Beach',
    distance: '13 km away',
    images: ['/assets/images/Daman1.jpg', '/assets/images/Daman2.jpg', '/assets/images/Daman3.jpg'],
    desc: 'Relax on the golden sands of Daman Beach, enjoy stunning Arabian Sea views, peaceful sunsets, and a refreshing coastal escape just moments away.'
  },
  {
    title: 'Dudhni Lake',
    distance: '40 km away',
    images: ['/assets/images/Dudhni1.jpg', '/assets/images/Dudhni2.jpg', '/assets/images/Dudhni3.jpg'],
    desc: 'Experience the tranquil beauty of Dudhni Lake, known for its peaceful waters, exciting boating activities, and picturesque surroundings—an ideal destination for relaxation and adventure.'
  },
  {
    title: 'Udvada',
    distance: '15 km away',
    images: ['/assets/images/udvada1.jpg', '/assets/images/udvada2.jpg', '/assets/images/udvada3.jpg'],
    desc: 'A historic coastal town that serves as a major pilgrimage site for Parsis. It houses the Iranshah Atash Behram, which holds the oldest continuously burning sacred fire in India. It is also highly regarded for its authentic, traditional Parsi cuisine.'
  },
  {
    title: 'Silvassa',
    distance: '18 km away',
    images: ['/assets/images/Silvassa1.jpg', '/assets/images/Silvassa2.jpg', '/assets/images/Silvassa3.jpg'],
    desc: 'Silvassa offers lush greenery, adventure activities, and scenic lake views. Visit the Lion Safari, Vasona Deer Park, and Dudhni Lake just a few minutes away from Vapi.'
  },
  {
    title: 'Valsad (Tithal Beach)',
    distance: '35 km away',
    images: ['/assets/images/tithal1.jpg', '/assets/images/tithal12.jpg', '/assets/images/tithal3.jpg'],
    desc: 'Famous for stunning sunrise and sunset views, black-sand beaches, and the Swaminarayan temple near the coastline, perfect for peaceful beach walks and relaxation.'
  },
  {
    title: 'Wilson Hills',
    distance: '71 km away',
    images: ['/assets/images/wilson hills1.jpg', '/assets/images/wilson hills2.jpg', '/assets/images/wilson hills3.jpg'],
    desc: 'Escape to the scenic beauty of Wilson Hill, where lush greenery, cool breezes, and breathtaking panoramic views create the perfect getaway for nature lovers and adventure seekers.'
  }
];

function AttractionCardSlider({ images, distance }) {
  const [idx, setIdx] = useState(0);
  const totalSlides = images?.length || 0;

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setIdx(prev => (prev + 1) % totalSlides);
    }, 3500);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const goNext = (e) => {
    e.stopPropagation();
    setIdx(prev => (prev + 1) % totalSlides);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setIdx(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="attraction-img-wrapper">
      <div className="attraction-card-slider" style={{ position: 'relative', width: '100%', height: '100%' }}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className={`attraction-img card-slide ${idx === i ? 'active' : ''}`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: idx === i ? 1 : 0,
              visibility: idx === i ? 'visible' : 'hidden',
              transition: 'opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1)',
              zIndex: idx === i ? 2 : 1
            }}
          />
        ))}
      </div>
      <button className="card-slider-arrow card-slider-prev" onClick={goPrev} aria-label="Previous image" style={{ zIndex: 5 }}>
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button className="card-slider-arrow card-slider-next" onClick={goNext} aria-label="Next image" style={{ zIndex: 5 }}>
        <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
      <div className="card-slider-dots" style={{ zIndex: 5 }}>
        {images.map((_, i) => (
          <span
            key={i}
            className={`card-slider-dot ${idx === i ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setIdx(i);
            }}
          />
        ))}
      </div>
      <span className="attraction-distance" style={{ zIndex: 5 }}>{distance}</span>
    </div>
  );
}

const ATTRACTIONS_HERO_IMAGES = [
  '/assets/images/damans1.jpg',
  '/assets/images/silvasas1.jpg',
  '/assets/images/wilsons hill2.jpg'
];

if (typeof window !== 'undefined') {
  ATTRACTIONS_HERO_IMAGES.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

export default function Attractions() {
  // ==================== 1. 3D HERO SLIDER ====================
  const [heroIndex, setHeroIndex] = useState(0);
  const heroDuration = 6000;
  const [heroProgress, setHeroProgress] = useState(0);
  const heroImages = ATTRACTIONS_HERO_IMAGES;

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

  return (
    <>
      {/* ===== 3D ATTRACTIONS HERO SLIDER ===== */}
      <section id="attractionsHeroSlider" className="gallery-hero-3d">
        <div className="gallery-3d-viewport">
          <div className="gallery-3d-slides" id="attractions3dSlides">
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
                <div key={idx} className={className} data-index={idx} style={{ backgroundColor: '#1a0f12' }}>
                  <img
                    src={src}
                    alt={`Attraction slide ${idx + 1}`}
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="sync"
                    className="gallery-slide-bg"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block'
                    }}
                  />
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
            <span className="badge-sparkle">✦</span> DISCOVER REGIONAL WONDERS <span className="badge-sparkle">✦</span>
          </div>
          <h1 className="gallery-hero-title">
            Nearby <span>Attractions</span>
          </h1>
          <div className="gallery-hero-breadcrumb">
            <Link to="/">HOME</Link>
            <span className="sep">›</span>
            <span className="active">NEARBY ATTRACTIONS</span>
          </div>
        </div>

        {/* 3D Navigation Arrows */}
        <button className="gallery-3d-arrow gallery-prev" onClick={goPrevHero} aria-label="Previous Slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button className="gallery-3d-arrow gallery-next" onClick={goNextHero} aria-label="Next Slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        {/* Slider Controls & Auto Progress Bar */}
        <div className="gallery-3d-controls">
          <div className="gallery-3d-dots" id="attractions3dDots">
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

      {/* ===== ATTRACTIONS LIST ===== */}
      <section className="section">
        <div className="section-head reveal-up">
          <p className="eyebrow">Within 80 km</p>
          <h2>Explore <em>Local Wonders</em></h2>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto 40px', textAlign: 'center', color: '#4b3b33' }} className="reveal-up">
          <p>
            From sun-kissed beaches and breathtaking mountain landscapes to historic landmarks, vibrant local markets, scenic viewpoints, and hidden gems, discover the very best our destination has to offer. Whether you're seeking adventure, relaxation, nature, or cultural experiences, every journey begins just moments from our hotel. Let every day bring a new adventure and create unforgettable memories with the perfect blend of comfort, exploration, and hospitality.
          </p>
        </div>

        <div className="attractions-grid">
          {ATTRACTIONS_LIST.map((item, idx) => (
            <div key={idx} className="attraction-card reveal-up">
              <AttractionCardSlider images={item.images} distance={item.distance} />
              <div className="attraction-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
