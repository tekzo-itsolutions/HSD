import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  // ==================== 1. 3D ABOUT HERO SLIDER ====================
  const [heroIndex, setHeroIndex] = useState(0);
  const heroDuration = 6000;
  const [heroProgress, setHeroProgress] = useState(0);
  const heroImages = [
    '/assets/images/ChatGPT Image Aug 9, 2026, 02_41_30 PM.png',
    '/assets/images/ChatGPT Image Aug 9, 2026, 03_00_06 PM.png',
    '/assets/images/ChatGPT Image Aug 9, 2026, 02_52_30 PM.png'
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

  // ==================== 2. 3D ROTATING PRISM ====================
  const [prismIndex, setPrismIndex] = useState(0);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [prismAutoplay, setPrismAutoplay] = useState(true);

  useEffect(() => {
    if (!prismAutoplay) return;
    const interval = setInterval(() => {
      setPrismIndex(prev => (prev + 1) % 4);
    }, 3600);
    return () => clearInterval(interval);
  }, [prismIndex, prismAutoplay]);

  const handlePrismMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTiltY((x / rect.width) * 15);
    setTiltX(-(y / rect.height) * 15);
    setPrismAutoplay(false);
  };

  const handlePrismMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
    setPrismAutoplay(true);
  };

  const goNextPrism = (e) => {
    e.preventDefault();
    setPrismIndex(prev => (prev + 1) % 4);
  };

  const goPrevPrism = (e) => {
    e.preventDefault();
    setPrismIndex(prev => (prev - 1 + 4) % 4);
  };

  // Determine standard translateZ depth based on screen size
  const [tz, setTz] = useState(250);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) setTz(130);
      else if (window.innerWidth <= 992) setTz(180);
      else if (window.innerWidth <= 1200) setTz(200);
      else setTz(250);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ==================== 3. TESTIMONIALS SLIDER ====================
  const [testiIndex, setTestiIndex] = useState(0);
  const [testiAutoplay, setTestiAutoplay] = useState(true);
  const testimonials = [
    {
      author: 'MR. PRAKASH JAKHAR',
      text: 'I Rated this Hotel with 5 star, It is awesome Hotel for couple friendly in vapi, I visited in daman many times but Stayed in Hotel Shree Daan olny, Management service and staff service is good, staff members behavior polite and good.',
      bgColor: '#35baf6',
      avatar: (
        <svg className="guest-avatar-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#35baf6"/>
          <path d="M22 85 C22 68, 78 68, 78 85 Z" fill="#2c3e50"/>
          <path d="M42 66 L58 66 L50 82 Z" fill="#ffffff"/>
          <polygon points="48,74 52,74 52,88 48,88" fill="#e74c3c"/>
          <rect x="44" y="56" width="12" height="14" rx="2" fill="#fed8b1"/>
          <circle cx="50" cy="42" r="18" fill="#fed8b1"/>
          <path d="M32 40 C32 24, 68 24, 68 40" fill="#2c3e50" stroke="#2c3e50" stroke-width="4"/>
          <path d="M32 40 C32 30, 42 30, 46 34" fill="#2c3e50"/>
        </svg>
      )
    },
    {
      author: 'DR. ANANYA SHARMA',
      text: 'I rated this hotel with 5 star. The location is excellent, near to the highway. Standard rooms are very clean and cozy. Breakfast quality is super good, and pick & drop travel was highly cooperative.',
      bgColor: '#e8c766',
      avatar: (
        <svg className="guest-avatar-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#e8c766"/>
          <path d="M22 85 C22 70, 78 70, 78 85 Z" fill="#b13453"/>
          <path d="M42 70 L58 70 L50 85 Z" fill="#ffffff"/>
          <rect x="45" y="58" width="10" height="14" fill="#fcd0a1"/>
          <circle cx="50" cy="44" r="17" fill="#fcd0a1"/>
          <path d="M30 40 C30 22, 70 22, 70 40 C72 58, 66 70, 66 70 C66 70, 34 70, 34 40 Z" fill="#4a3b32"/>
        </svg>
      )
    },
    {
      author: 'MR. VIKRAM SEN',
      text: 'Very comfortable stay. Banquet Hall facilities are outstanding, high-speed free wifi helped us organize our corporate workshop seamlessly. Highly recommend for business groups in vapi.',
      bgColor: '#2e7d32',
      avatar: (
        <svg className="guest-avatar-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#2e7d32"/>
          <path d="M22 85 C22 68, 78 68, 78 85 Z" fill="#34495e"/>
          <path d="M42 66 L58 66 L50 82 Z" fill="#ffffff"/>
          <polygon points="48,74 52,74 52,88 48,88" fill="#c0392b"/>
          <rect x="44" y="56" width="12" height="14" rx="2" fill="#e0ac69"/>
          <circle cx="50" cy="42" r="18" fill="#e0ac69"/>
          <path d="M32 40 C32 24, 68 24, 68 40" fill="#2c3e50" stroke="#2c3e50" stroke-width="4"/>
          <rect x="36" y="38" width="11" height="7" rx="1" fill="none" stroke="#2c3e50" stroke-width="2"/>
          <rect x="53" y="38" width="11" height="7" rx="1" fill="none" stroke="#2c3e50" stroke-width="2"/>
          <line x1="47" y1="41" x2="53" y2="41" stroke="#2c3e50" stroke-width="2"/>
        </svg>
      )
    },
    {
      author: 'MRS. RIYA DESHMUKH',
      text: 'Excellent hospitality! We celebrated my daughter\'s birthday here. The restaurant staff served delicious food and decorated the table wonderfully. Safe and quiet environment for family.',
      bgColor: '#9c27b0',
      avatar: (
        <svg className="guest-avatar-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#9c27b0"/>
          <path d="M22 85 C22 70, 78 70, 78 85 Z" fill="#3f51b5"/>
          <path d="M42 70 L58 70 L50 85 Z" fill="#ffffff"/>
          <rect x="45" y="58" width="10" height="14" fill="#ffdbac"/>
          <circle cx="50" cy="44" r="17" fill="#ffdbac"/>
          <path d="M31 38 C31 20, 69 20, 69 38 C70 54, 69 66, 69 66 C69 66, 31 66, 31 38 Z" fill="#1a1a1a"/>
        </svg>
      )
    },
    {
      author: 'MR. KABIR PATEL',
      text: 'Beautiful hotel with luxury vibes at reasonable prices. The Golden Sparsh spa therapies are refreshing. Polite management and clean bathrooms. We had a great time.',
      bgColor: '#ff9800',
      avatar: (
        <svg className="guest-avatar-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#ff9800"/>
          <path d="M22 85 C22 68, 78 68, 78 85 Z" fill="#424242"/>
          <path d="M42 66 L58 66 L50 82 Z" fill="#ffffff"/>
          <rect x="44" y="56" width="12" height="14" rx="2" fill="#ffcd94"/>
          <circle cx="50" cy="42" r="18" fill="#ffcd94"/>
          <path d="M32 40 C32 24, 68 24, 68 40" fill="#3e2723" stroke="#3e2723" stroke-width="4"/>
        </svg>
      )
    }
  ];

  useEffect(() => {
    if (!testiAutoplay) return;
    const interval = setInterval(() => {
      setTestiIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testiAutoplay]);

  const goNextTesti = () => setTestiIndex(prev => (prev + 1) % testimonials.length);
  const goPrevTesti = () => setTestiIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <>
      {/* ===== 3D ABOUT HERO SLIDER ===== */}
      <section id="aboutHeroSlider" className="gallery-hero-3d">
        <div className="gallery-3d-viewport">
          <div className="gallery-3d-slides" id="about3dSlides">
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
            <span className="badge-sparkle">✦</span> WELCOME TO HOTEL SHREE DAAN <span className="badge-sparkle">✦</span>
          </div>
          <h1 className="gallery-hero-title">
            Our <span>Story</span>
          </h1>
          <div className="gallery-hero-breadcrumb">
            <Link to="/">HOME</Link>
            <span className="sep">›</span>
            <span className="active">OUR STORY</span>
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

      {/* ===== ABOUT BODY ===== */}
      <section className="section">
        <div className="about-body">
          <div className="about-grid-container">
            {/* LEFT COLUMN: HYPER-UNIQUE 3D ROTATING LUXURY PRISM SHOWCASE */}
            <div className="about-3d-prism-showcase reveal-up">
              <div
                className="prism-3d-scene"
                id="prismScene"
                onMouseMove={handlePrismMouseMove}
                onMouseLeave={handlePrismMouseLeave}
              >
                <div className="prism-glow-orb"></div>
                <div
                  className="prism-3d-cube"
                  id="aboutPrismCube"
                  style={{
                    transform: `translateZ(-${tz}px) rotateY(${-prismIndex * 90 + tiltY}deg) rotateX(${tiltX}deg)`,
                    transition: tiltX || tiltY ? 'none' : 'transform 0.8s var(--ease)'
                  }}
                >
                  {/* Face 1 */}
                  <div className={`cube-face face-front ${prismIndex === 0 ? 'active' : ''}`}>
                    <div className="face-img-box">
                      <img src="/assets/images/ChatGPT Image Aug 9, 2026, 02_41_30 PM.png" alt="Hotel Shree Daan Luxury Suite" />
                      <div className="face-gold-border"></div>
                    </div>
                  </div>

                  {/* Face 2 */}
                  <div className={`cube-face face-right ${prismIndex === 1 ? 'active' : ''}`}>
                    <div className="face-img-box">
                      <img src="/assets/images/ChatGPT Image Aug 9, 2026, 02_46_57 PM.png" alt="Hotel Shree Daan Reception &amp; Lobby" />
                      <div className="face-gold-border"></div>
                    </div>
                  </div>

                  {/* Face 3 */}
                  <div className={`cube-face face-back ${prismIndex === 2 ? 'active' : ''}`}>
                    <div className="face-img-box">
                      <img src="/assets/images/ChatGPT Image Aug 9, 2026, 02_52_30 PM.png" alt="Hotel Shree Daan Deluxe Stay" />
                      <div className="face-gold-border"></div>
                    </div>
                  </div>

                  {/* Face 4 */}
                  <div className={`cube-face face-left ${prismIndex === 3 ? 'active' : ''}`}>
                    <div className="face-img-box">
                      <img src="/assets/images/ChatGPT Image Aug 9, 2026, 03_00_06 PM.png" alt="Hotel Shree Daan Ambience" />
                      <div className="face-gold-border"></div>
                    </div>
                  </div>
                </div>

                {/* 3D Controls */}
                <button className="prism-nav-btn prev-btn" onClick={goPrevPrism} aria-label="Rotate Previous">‹</button>
                <button className="prism-nav-btn next-btn" onClick={goNextPrism} aria-label="Rotate Next">›</button>
              </div>
            </div>

            {/* RIGHT COLUMN: ABOUT TEXT & KEY AMENITIES */}
            <div className="about-content-col reveal-up">
              <p className="eyebrow">About Us</p>
              <h2 className="about-main-title">
                <span className="welcome-text">Welcome To</span> Hotel Shree Daan
              </h2>
              <p className="about-lead" style={{ color: 'var(--gold)', fontSize: '1.3rem', fontStyle: 'italic', marginBottom: '18px' }}>Best Experience lifetime happiness</p>
              <p className="about-desc">
                Be it a business stay, social Stay, Leisure travel, meeting, workshop, seminar, training session or social events, there simply no occasion that hotel shree Daan cannot play the perfect host too.
              </p>
              <p className="about-desc">
                Equipped with all modern amenities that cater to different needs, we can customize our facilities to ensure that your is as unique an experience as you wish it ti be. All backed by state of the art communications systems and presentation facilities.
              </p>

              {/* Key Amenities Row */}
              <div className="about-amenities-highlight">
                <div className="amenity-highlight-item">
                  <div className="amenity-icon">🍳</div>
                  <h4>Breakfast</h4>
                  <p>Complimentary fresh morning buffet</p>
                </div>
                <div className="amenity-highlight-item">
                  <div className="amenity-icon">🧘‍♀️</div>
                  <h4>Wellness Centre</h4>
                  <p>Experience a holistic approach to health</p>
                </div>
                <div className="amenity-highlight-item">
                  <div className="amenity-icon">📶</div>
                  <h4>Free WiFi</h4>
                  <p>High-speed fiber connectivity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Couple Friendly & Pet Friendly Rooms Callout */}
          <div className="about-rooms-callout reveal-up">
            <div className="callout-header-tag">
              <span className="tag-couple">🥂 Couple Friendly</span>
              <span className="tag-dot">✦</span>
              <span className="tag-pet">🐶 Dog Friendly Luxury</span>
            </div>
            <h3>
              We have Couple Friendly Rooms <span className="amp-symbol">&amp;</span> <span className="pet-highlight">Dog Friendly Rooms <span className="animated-dog-paw" title="Pets Welcome!"></span></span>
            </h3>
          </div>
        </div>
      </section>

      {/* ===== VALUES SECTION ===== */}
      <section className="section section--tinted">
        <div className="section-head reveal-up">
          <p className="eyebrow">Our Philosophy</p>
          <h2>Core Pillars of <em>Shree Daan</em></h2>
        </div>
        
        <div className="services-grid">
          <div className="service-card reveal-up">
            <div className="service-icon">🤝</div>
            <h3>Atithi Devo Bhava</h3>
            <p>Treating every visitor as a divine guest, an age-old Indian hospitality code woven into our standard.</p>
          </div>
          <div className="service-card reveal-up">
            <div className="service-icon">✨</div>
            <h3>Quiet Luxury</h3>
            <p>Avoiding loud excesses. We prioritize refined, understated elegance, high-quality finishes, and calm spaces.</p>
          </div>
          <div className="service-card reveal-up">
            <div className="service-icon">🌿</div>
            <h3>Sustained Care</h3>
            <p>Sourcing local organic ingredients for our fine dining kitchens and supporting regional artisans.</p>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SLIDER SECTION ===== */}
      <section className="section section--tinted testimonial-slider-section">
        <div className="section-head reveal-up">
          <p className="eyebrow">Guest Reviews</p>
          <h2>What Our Guests <em>Say About Us</em></h2>
        </div>

        <div
          className="testimonial-slider-container reveal-up"
          onMouseEnter={() => setTestiAutoplay(false)}
          onMouseLeave={() => setTestiAutoplay(true)}
        >
          <div className="testimonial-wrapper" id="testimonialWrapper">
            {testimonials.map((t, idx) => (
              <div key={idx} className={`testimonial-slide ${testiIndex === idx ? 'active' : ''}`}>
                <div className="testimonial-card-inner">
                  <div className="testimonial-avatar-col">
                    {t.avatar}
                  </div>
                  <div className="testimonial-content-col">
                    <span className="testimonial-quote-mark">“</span>
                    <p className="testimonial-text">{t.text}</p>
                    <h4 className="testimonial-author">{t.author}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Navigation Controls */}
          <div className="testimonial-controls">
            <button className="testimonial-arrow prev" onClick={goPrevTesti} aria-label="Previous Slide">‹</button>
            <div className="testimonial-dots" id="testiDots">
              {testimonials.map((_, idx) => (
                <span
                  key={idx}
                  className={`dot ${testiIndex === idx ? 'active' : ''}`}
                  onClick={() => setTestiIndex(idx)}
                ></span>
              ))}
            </div>
            <button className="testimonial-arrow next" onClick={goNextTesti} aria-label="Next Slide">›</button>
          </div>
        </div>
      </section>

      {/* ===== OUR STAFF SHOWCASE SECTION ===== */}
      <section className="section staff-showcase-section" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div className="section-head reveal-up">
          <p className="eyebrow">Dedicated Hospitality</p>
          <h2>Our <em>Staff</em></h2>
        </div>

        <div className="testimonial-frame-showcase reveal-up">
          <div className="frame-3d-wrapper">
            <div className="frame-3d-border">
              <span className="frame-corner corner-tl">✦</span>
              <span className="frame-corner corner-tr">✦</span>
              <span className="frame-corner corner-bl">✦</span>
              <span className="frame-corner corner-br">✦</span>
              <div className="frame-img-box">
                <img src="/assets/images/WhatsApp Image 2024-09-06 at 3.18.02 PM(1).jpeg" alt="Our Dedicated Staff Team" className="testimonial-frame-img" />
                <div className="frame-light-reflection"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
