import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SPA_CATEGORIES } from '../data/spaData';

function SpaCardSlider({ images }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(prev => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="card-slider-wrapper">
      {images.map((src, i) => (
        <div
          key={i}
          className={`card-slide ${idx === i ? 'active' : ''}`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}
      <div className="card-slider-dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`card-dot ${idx === i ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setIdx(i);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Spa() {
  const navigate = useNavigate();

  // ==================== 1. 3D HERO SLIDER ====================
  const [heroIndex, setHeroIndex] = useState(0);
  const heroVideoRefs = [useRef(null), useRef(null), useRef(null)];
  const heroDuration = 5000;
  const [heroProgress, setHeroProgress] = useState(0);

  useEffect(() => {
    // Play active slide video, pause others
    heroVideoRefs.forEach((ref, idx) => {
      const video = ref.current;
      if (video) {
        if (idx === heroIndex) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });

    // Reset progress and start interval
    setHeroProgress(0);
    const step = 100 / (heroDuration / 50);
    const progressInterval = setInterval(() => {
      setHeroProgress(prev => {
        if (prev >= 100) return 100;
        return prev + step;
      });
    }, 50);

    const autoInterval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % 3);
    }, heroDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(autoInterval);
    };
  }, [heroIndex]);

  const goNextHero = () => setHeroIndex(prev => (prev + 1) % 3);
  const goPrevHero = () => setHeroIndex(prev => (prev - 1 + 3) % 3);

  return (
    <>
      {/* ===== 3D SPA HERO SLIDER ===== */}
      <section id="spaHeroSlider" className="spa-hero-3d">
        <div className="spa-3d-viewport">
          <div className="spa-3d-slides" id="spa3dSlides">
            {/* Slide 1: Video 1 */}
            <div className={`spa-3d-slide ${heroIndex === 0 ? 'active' : ''}`} data-index="0">
              <video ref={heroVideoRefs[0]} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
                <source src="/assets/videos/spa 1.mp4" type="video/mp4" />
              </video>
              <div className="spa-slide-overlay"></div>
            </div>

            {/* Slide 2: Video 2 */}
            <div className={`spa-3d-slide ${heroIndex === 1 ? 'active' : ''}`} data-index="1">
              <video ref={heroVideoRefs[1]} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
                <source src="/assets/videos/spa 2.mp4" type="video/mp4" />
              </video>
              <div className="spa-slide-overlay"></div>
            </div>

            {/* Slide 3: Video 3 */}
            <div className={`spa-3d-slide ${heroIndex === 2 ? 'active' : ''}`} data-index="2">
              <video ref={heroVideoRefs[2]} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
                <source src="/assets/videos/spa 3.mp4" type="video/mp4" />
              </video>
              <div className="spa-slide-overlay"></div>
            </div>
          </div>
        </div>

        {/* Ambient 3D Lighting & Vignette Overlay */}
        <div className="spa-3d-light-sweep"></div>
        <div className="spa-3d-vignette"></div>

        {/* Hero Content Overlay */}
        <div className="spa-hero-content">
          <div className="spa-hero-badge">
            <span className="badge-sparkle">✦</span> LUXURY WELLNESS &amp; SPA ACADEMY <span className="badge-sparkle">✦</span>
          </div>
          <h1 className="spa-hero-title">
            Shree Golden Sparsh <span>- Spa &amp; Spa Academy</span>
          </h1>
          <div className="spa-hero-breadcrumb">
            <Link to="/">HOME</Link>
            <span className="sep">›</span>
            <span className="active">SHREE GOLDEN SPARSH - SPA &amp; SPA ACADEMY</span>
          </div>
        </div>

        {/* 3D Navigation Arrows */}
        <button className="spa-3d-arrow spa-prev" onClick={goPrevHero} aria-label="Previous Slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button className="spa-3d-arrow spa-next" onClick={goNextHero} aria-label="Next Slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        {/* Dots & Progress */}
        <div className="spa-3d-controls">
          <div className="spa-3d-dots" id="spa3dDots">
            {[0, 1, 2].map(idx => (
              <button
                key={idx}
                className={`spa-dot ${heroIndex === idx ? 'active' : ''}`}
                onClick={() => setHeroIndex(idx)}
              >
                <span>0{idx + 1}</span>
              </button>
            ))}
          </div>
          <div className="spa-3d-progress">
            <div className="spa-progress-bar" style={{ width: `${Math.min(heroProgress, 100)}%`, transition: 'width 0.05s linear' }}></div>
          </div>
        </div>
      </section>

      {/* ===== SPA PACKAGES ===== */}
      <section className="section section--tinted">
        <div className="section-head reveal-up">
          <p className="eyebrow">Luxury Wellness</p>
          <h2>Shree Golden Sparsh Spa &amp; Academy</h2>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '40px' }} className="reveal-up">
          <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#5c534b' }}>
            Shree Golden Sparsh Spa &amp; Spa Academy invites you to experience peace, tranquility, and physical rejuvenation. Select a chapter below to explore our dynamic treatment panels, pricing, and signature wellness programs.
          </p>
          <div style={{ marginTop: '15px', fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--maroon)', fontWeight: '600', letterSpacing: '0.05em' }}>
            <span className="badge-sparkle">✦</span> TIMING: 8:30 AM to 8:30 PM
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="rooms-grid" id="spaGrid" style={{ marginBottom: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {SPA_CATEGORIES.map(s => (
            <div key={s.id} className="room-card reveal-up in-view">
              <div className="room-image-wrap">
                <div className="room-image">
                  {s.images && s.images.length ? (
                    <SpaCardSlider images={s.images} />
                  ) : (
                    <div className="room-bg" style={{ position: 'absolute', inset: 0, background: s.image ? `url('${s.image}') center/cover no-repeat` : s.gradient }}></div>
                  )}
                </div>
                <span className="room-rating">★ {s.rating}</span>
              </div>
              <div className="room-body">
                <h3>{s.name}</h3>
                <p className="room-price">From ₹{s.price.toLocaleString('en-IN')}</p>
                <div className="room-facilities">
                  {s.facilities.map((fac, idx) => (
                    <span key={idx}>{fac}</span>
                  ))}
                </div>
                <button className="btn btn-gold" onClick={() => navigate(`/spa-details#${s.id}`)} style={{ width: '100%' }}>
                  Explore Treatments
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SPA HIGHLIGHTS & INCLUSIONS ===== */}
      <section className="section">
        <div className="section-head reveal-up">
          <p className="eyebrow">Aesthetic Sanctuary</p>
          <h2>Every Session Includes</h2>
        </div>

        <div className="services-grid">
          <div className="service-card reveal-up">
            <div style={{ fontSize: '1.8rem', marginBottom: '15px' }}>🧘</div>
            <h3>Zen Acoustics</h3>
            <p>Soothe your senses in our calm, temperature-controlled environment with sound healing acoustics and ambient lighting.</p>
          </div>
          <div className="service-card reveal-up">
            <div style={{ fontSize: '1.8rem', marginBottom: '15px' }}>🌿</div>
            <h3>Vedic Essences</h3>
            <p>All therapies use 100% natural, chemical-free herbal oils, mineral muds, organic body scrubs, and fresh flowers.</p>
          </div>
          <div className="service-card reveal-up">
            <div style={{ fontSize: '1.8rem', marginBottom: '15px' }}>🎓</div>
            <h3>Elite Therapists</h3>
            <p>Treatments are facilitated by highly qualified practitioners certified by the Shree Golden Sparsh Spa Academy.</p>
          </div>
          <div className="service-card reveal-up">
            <div style={{ fontSize: '1.8rem', marginBottom: '15px' }}>👣</div>
            <h3>Complimentary Massage</h3>
            <p>Complimentary Foot Massage to Female Guest (10-15 Minutes) included with all bookings.</p>
          </div>
        </div>
      </section>
    </>
  );
}
