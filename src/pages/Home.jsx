import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ParticleCanvas from '../components/ParticleCanvas';
import { ROOMS } from '../data/roomsData';

export default function Home() {
  const navigate = useNavigate();

  // ==================== 1. HERO VIDEO SLIDER ====================
  // ==================== 1. HERO VIDEO SLIDER ====================
  const [heroIndex, setHeroIndex] = useState(0);
  const heroVideoRefs = [useRef(null), useRef(null), useRef(null)];
  const [heroProgress, setHeroProgress] = useState(0);
  const [isTextActive, setIsTextActive] = useState(true);
  const [videosLoaded, setVideosLoaded] = useState([false, false, false]);

  const HERO_CONDITIONS = [
    {
      title: "Welcome to Hotel Shree Daan",
      desc: "Hotel Shree Daan provide a standard single rooms, standard double rooms, also executive single, double rooms etc."
    },
    {
      title: "Enjoy Holidays At Hotel Shree Daan",
      desc: "Slope mornings are excellent... particularly in case you're awakening in one of our lodging's refined rooms!"
    },
    {
      title: "Stay with us and feel like Home",
      desc: "Discover a hotel that defines a new dimension of luxury. and We put a smile back on your face."
    }
  ];

  const handleVideoCanPlay = (index) => {
    setVideosLoaded(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  useEffect(() => {
    // Play active slide video from start, pause and reset others
    heroVideoRefs.forEach((ref, idx) => {
      const video = ref.current;
      if (video) {
        if (idx === heroIndex) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });

    // Handle text transition fade-out/fade-in
    setIsTextActive(false);
    const textTimer = setTimeout(() => {
      setIsTextActive(true);
    }, 400);

    setHeroProgress(0);

    return () => {
      clearTimeout(textTimer);
    };
  }, [heroIndex]);

  const goNextHero = () => setHeroIndex(prev => (prev + 1) % 3);
  const goPrevHero = () => setHeroIndex(prev => (prev - 1 + 3) % 3);

  const handleVideoTimeUpdate = (e, idx) => {
    if (idx === heroIndex) {
      const video = e.target;
      if (video.duration && video.duration > 0) {
        setHeroProgress((video.currentTime / video.duration) * 100);
      }
    }
  };

  const handleVideoEnded = (idx) => {
    if (idx === heroIndex) {
      goNextHero();
    }
  };

  // ==================== 2. WELCOME 3D SLIDER ====================
  const welcomeImages = [
    { src: '/assets/images/about1.jpg', alt: 'Hotel Shree Daan Suite' },
    { src: '/assets/images/about2.jpg', alt: 'Hotel Shree Daan Deluxe Room' },
    { src: '/assets/images/RECEPTION.jpg.jpeg', alt: 'Hotel Reception' },
    { src: '/assets/images/HALL 1.jpg.jpeg', alt: 'Banquet Hall' },
    { src: '/assets/images/pic 73.jpg.jpeg', alt: 'Luxury Spa & Wellness' },
    { src: '/assets/images/pic 37.jpg.jpeg', alt: 'Aromatic Spa Therapy' },
    { src: '/assets/images/pic 60.jpg.jpeg', alt: 'Herbal Therapy Room' }
  ];
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const [welcomeAutoplay, setWelcomeAutoplay] = useState(true);

  useEffect(() => {
    if (!welcomeAutoplay) return;
    const interval = setInterval(() => {
      setWelcomeIndex(prev => (prev + 1) % welcomeImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [welcomeAutoplay]);

  const goNextWelcome = () => setWelcomeIndex(prev => (prev + 1) % welcomeImages.length);
  const goPrevWelcome = () => setWelcomeIndex(prev => (prev - 1 + welcomeImages.length) % welcomeImages.length);

  // ==================== 3. SERVICES 3D AUTO-SLIDER ====================
  const servicesImages = [
    { src: '/assets/images/test_rooms/executive.jpg', alt: 'Executive Room' },
    { src: '/assets/images/test_rooms/executive-double.jpg', alt: 'Executive Double' },
    { src: '/assets/images/test_rooms/music room image.jpg', alt: 'Music Room' },
    { src: '/assets/images/test_rooms/premier-suite2.jpg', alt: 'Premier Suite' },
    { src: '/assets/images/test_rooms/standard-double.jpg', alt: 'Standard Double Room' },
    { src: '/assets/images/test_rooms/standard-single.jpg', alt: 'Standard Single Room' },
    { src: '/assets/images/HALL 1.jpg.jpeg', alt: 'Banquet Hall' },
    { src: '/assets/images/pic 73.jpg.jpeg', alt: 'Hotel Shree Daan Gallery 73' },
    { src: '/assets/images/RECEPTION.jpg.jpeg', alt: 'Hotel Reception' },
    { src: '/assets/images/pic 60.jpg.jpeg', alt: 'Hotel Shree Daan Gallery 60' },
    { src: '/assets/images/pic 37.jpg.jpeg', alt: 'Hotel Shree Daan Gallery 37' },
    { src: '/assets/images/PIC 10.JPG.jpeg', alt: 'Hotel Shree Daan Gallery 10' },
    { src: '/assets/images/service-slider-3.jpg', alt: 'Service Experience' },
    { src: '/assets/images/spa_home_1.jpg', alt: 'Spa Therapy' },
    { src: '/assets/images/spa_home_2.jpg', alt: 'Spa Wellness' },
    { src: '/assets/images/about-slider3.jpg', alt: 'About Shree Daan' },
    { src: '/assets/images/recreational-hero-bg.png', alt: 'Recreational Zone' },
    { src: '/assets/images/about2.jpg', alt: 'Shree Daan Ambiance' }
  ];
  const [servicesIndex, setServicesIndex] = useState(0);
  const [servicesAutoplay, setServicesAutoplay] = useState(true);
  const [servicesProgress, setServicesProgress] = useState(0);
  const servicesDuration = 3500;

  useEffect(() => {
    if (!servicesAutoplay) return;

    setServicesProgress(0);
    const step = 100 / (servicesDuration / 50);
    const progressInterval = setInterval(() => {
      setServicesProgress(prev => {
        if (prev >= 100) return 100;
        return prev + step;
      });
    }, 50);

    const autoInterval = setInterval(() => {
      setServicesIndex(prev => (prev + 1) % servicesImages.length);
    }, servicesDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(autoInterval);
    };
  }, [servicesIndex, servicesAutoplay]);

  const goNextServices = () => setServicesIndex(prev => (prev + 1) % servicesImages.length);
  const goPrevServices = () => setServicesIndex(prev => (prev - 1 + servicesImages.length) % servicesImages.length);

  // Play hero reveal load-in on page mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const items = document.querySelectorAll('#hero .reveal-up');
      items.forEach((el, i) => {
        setTimeout(() => el.classList.add('in-view'), i * 160);
      });
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ===== HERO SLIDER ===== */}
      <section id="hero">
        <div className="hero-slides">
          {/* Slide 1 */}
          <div className={`hero-slide hero-bg--facade ${heroIndex === 0 ? 'active' : ''} ${videosLoaded[0] ? 'has-video' : ''}`} data-slide="0">
            <video
              ref={heroVideoRefs[0]}
              className={`hero-video ${videosLoaded[0] ? 'is-playing' : ''}`}
              autoPlay
              muted
              playsInline
              preload="auto"
              onCanPlay={() => handleVideoCanPlay(0)}
              onTimeUpdate={(e) => handleVideoTimeUpdate(e, 0)}
              onEnded={() => handleVideoEnded(0)}
              data-fallback-plane
            >
              <source src="/assets/videos/IMG_4688(1).mp4" type="video/mp4" />
            </video>
            <span className="hero-caption">Luxury Hotel Exterior</span>
          </div>

          {/* Slide 2 */}
          <div className={`hero-slide hero-bg--lobby ${heroIndex === 1 ? 'active' : ''} ${videosLoaded[1] ? 'has-video' : ''}`} data-slide="1">
            <video
              ref={heroVideoRefs[1]}
              className={`hero-video ${videosLoaded[1] ? 'is-playing' : ''}`}
              autoPlay
              muted
              playsInline
              preload="auto"
              onCanPlay={() => handleVideoCanPlay(1)}
              onTimeUpdate={(e) => handleVideoTimeUpdate(e, 1)}
              onEnded={() => handleVideoEnded(1)}
              data-fallback-plane
            >
              <source src="/assets/videos/entrance 2.mp4" type="video/mp4" />
            </video>
            <span className="hero-caption">Luxury Hotel Lobby</span>
          </div>

          {/* Slide 3 */}
          <div className={`hero-slide hero-bg--room ${heroIndex === 2 ? 'active' : ''} ${videosLoaded[2] ? 'has-video' : ''}`} data-slide="2">
            <video
              ref={heroVideoRefs[2]}
              className={`hero-video ${videosLoaded[2] ? 'is-playing' : ''}`}
              autoPlay
              muted
              playsInline
              preload="auto"
              onCanPlay={() => handleVideoCanPlay(2)}
              onTimeUpdate={(e) => handleVideoTimeUpdate(e, 2)}
              onEnded={() => handleVideoEnded(2)}
              data-fallback-plane
            >
              <source src="/assets/videos/entrance 3.mp4" type="video/mp4" />
            </video>
            <span className="hero-caption">Premium Rooms &amp; Suites</span>
          </div>
        </div>

        <div className="hero-gradient"></div>
        <ParticleCanvas />

        {/* Hero Content Overlay (Dynamic Text) */}
        <div className="hero-content-overlay">
          <div className={`hero-content-inner ${isTextActive ? 'active' : ''}`}>
            <div className="hero-eyebrow">
              <span className="badge-sparkle">✦</span> HOTEL SHREE DAAN <span className="badge-sparkle">✦</span>
            </div>
            <h1 className="hero-title-main" dangerouslySetInnerHTML={{ __html: HERO_CONDITIONS[heroIndex].title }}></h1>
            <p className="hero-desc-sub" dangerouslySetInnerHTML={{ __html: HERO_CONDITIONS[heroIndex].desc }}></p>
            <div className="hero-btns-row">
              <button className="btn btn-gold" onClick={() => navigate('/booking')}>Book Your Stay</button>
              <button className="btn btn-outline" style={{ borderColor: 'rgba(255, 255, 255, 0.4)', color: 'var(--white)', backgroundColor: 'transparent' }} onClick={() => navigate('/rooms')}>Explore Rooms</button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button className="slider-arrow prev" onClick={goPrevHero} aria-label="Previous slide">‹</button>
        <button className="slider-arrow next" onClick={goNextHero} aria-label="Next slide">›</button>

        {/* Bottom Navigation Dots & Progress */}
        <div className="hero-slide-dots">
          {[0, 1, 2].map(idx => (
            <span
              key={idx}
              className={`dot ${heroIndex === idx ? 'active' : ''}`}
              onClick={() => setHeroIndex(idx)}
              style={heroIndex === idx ? { width: '24px', borderRadius: '4px' } : {}}
            ></span>
          ))}
        </div>
        <div className="hero-progress-container" style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', zIndex: '10' }}>
          <div style={{ width: `${Math.min(heroProgress, 100)}%`, height: '100%', background: 'var(--gold)', transition: 'width 0.05s linear' }}></div>
        </div>

        <div className="scroll-indicator">
          <span></span>
          <div><div></div></div>
        </div>
      </section>

      {/* ===== MARQUEE STRIP ===== */}
      <div className="marquee-strip">
        <div className="marquee-track">
          <span>Est. Heritage Hospitality</span><span className="dot-sep">✦</span>
          <span>5-Star Comfort</span><span className="dot-sep">✦</span>
          <span>24-Hour Service</span><span className="dot-sep">✦</span>
          <span>Golden Sparsh Spa</span><span className="dot-sep">✦</span>
          <span>Est. Heritage Hospitality</span><span className="dot-sep">✦</span>
          <span>5-Star Comfort</span><span className="dot-sep">✦</span>
          <span>24-Hour Service</span><span className="dot-sep">✦</span>
          <span>Golden Sparsh Spa</span><span className="dot-sep">✦</span>
          <span>Est. Heritage Hospitality</span><span className="dot-sep">✦</span>
          <span>5-Star Comfort</span><span className="dot-sep">✦</span>
          <span>24-Hour Service</span><span className="dot-sep">✦</span>
          <span>Golden Sparsh Spa</span><span className="dot-sep">✦</span>
          <span>Est. Heritage Hospitality</span><span className="dot-sep">✦</span>
          <span>5-Star Comfort</span><span className="dot-sep">✦</span>
          <span>24-Hour Service</span><span className="dot-sep">✦</span>
          <span>Golden Sparsh Spa</span><span className="dot-sep">✦</span>
        </div>
      </div>

      {/* ===== WELCOME SECTION ===== */}
      <section className="section">
        <div className="section-head reveal-up">
          <p className="eyebrow">Welcome</p>
          <h2>Welcome to <em>Hotel Shree Daan</em></h2>
        </div>
        <div className="welcome-grid reveal-up">
          <div className="welcome-copy">
            <p>Be it a business stay, social stay, leisure travel, meeting, workshop, seminar, training session or social events, there is simply no occasion that Hotel Shree Daan cannot play the perfect host to.</p>
            <p>Equipped with all modern amenities that cater to different needs, we can customize our facilities to ensure that your stay is as unique an experience as you wish it to be. All backed by state-of-the-art communications systems and presentation facilities.</p>
            <Link to="/about" className="btn btn-ghost">Read More</Link>
          </div>
          <div className="welcome-media">
            <div
              className="welcome-3d-slider"
              id="welcome3dSlider"
              onMouseEnter={() => setWelcomeAutoplay(false)}
              onMouseLeave={() => setWelcomeAutoplay(true)}
            >
              <div className="welcome-3d-viewport">
                <div className="welcome-3d-slides" id="welcome3dSlides">
                  {welcomeImages.map((img, idx) => {
                    let diff = idx - welcomeIndex;
                    const total = welcomeImages.length;
                    if (diff > total / 2) diff -= total;
                    if (diff < -total / 2) diff += total;

                    let className = 'welcome-3d-slide';
                    if (diff === 0) className += ' active';
                    else if (diff === 1 || (welcomeIndex === total - 1 && idx === 0)) className += ' next-slide';
                    else if (diff === -1 || (welcomeIndex === 0 && idx === total - 1)) className += ' prev-slide';

                    return (
                      <div key={idx} className={className} data-index={idx}>
                        <img src={img.src} alt={img.alt} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3D Navigation Controls */}
              <button className="welcome-arrow welcome-prev" onClick={() => { goPrevWelcome(); setWelcomeAutoplay(true); }} aria-label="Previous slide">‹</button>
              <button className="welcome-arrow welcome-next" onClick={() => { goNextWelcome(); setWelcomeAutoplay(true); }} aria-label="Next slide">›</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ROW ===== */}
      <section className="section section--stats">
        <div className="stats-grid reveal-up">
          <div className="stat-card">
            <h3 data-count="10">0</h3>
            <p>Year Of<br />success</p>
          </div>
          <div className="stat-card">
            <h3 data-count="19">0</h3>
            <p>Our Total<br />Rooms</p>
          </div>
          <div className="stat-card">
            <h3 data-count="14">0</h3>
            <p>Our Staff<br />Members</p>
          </div>
          <div className="stat-card">
            <h3 data-count="15000">0</h3>
            <p>Happy<br />Customers</p>
          </div>
        </div>
      </section>

      {/* ===== FEATURED ROOMS ===== */}
      <section id="rooms" className="section">
        <div className="section-head reveal-up">
          <p className="eyebrow">Rooms &amp; Suites</p>
          <h2>Choose Your <em>Retreat</em></h2>
        </div>

        <div className="rooms-track" id="roomsTrack">
          {ROOMS.map(r => (
            <div key={r.id} className="room-card reveal-up in-view">
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
                    : `₹${r.price.toLocaleString('en-IN')} / night`}
                </p>
                <button className="btn btn-gold" onClick={() => navigate(`/booking?room=${r.id}`)}>
                  {r.id === 'banquet-hall' ? 'Contact Hotel' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '50px' }} className="reveal-up">
          <Link to="/rooms" className="btn btn-ghost" style={{ color: 'var(--maroon)', borderColor: 'var(--maroon)' }}>View All Rooms</Link>
        </div>
      </section>

      {/* ===== SPA PREVIEW ===== */}
      <section className="section section--spa">
        <div className="spa-bg"></div>
        <div className="spa-container">
          <div className="spa-content">
            <p className="eyebrow eyebrow--light reveal-up">Wellness &amp; Rejuvenation</p>
            <h2 className="reveal-up">Golden Sparsh Spa</h2>
            <p className="spa-copy reveal-up">Immerse yourself in hot steam, quiet saunas, and traditional Ayurvedic massage rituals drawn from age-old Vedic practices, offered in low-lit tranquil luxury.</p>
            <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '8px' }} className="reveal-up">
              <span className="spa-price" style={{ marginLeft: 0, fontSize: '1.1rem', color: 'var(--gold-glow)' }}>Signature therapies starting from ₹1,400</span>
              <span className="spa-timing" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em' }}><span className="badge-sparkle">✦</span> TIMING: 8:30 AM to 8:30 PM</span>
            </div>
            <Link to="/spa" className="btn btn-gold reveal-up">View Spa Services</Link>
          </div>

          <div className="spa-visual reveal-up">
            <div className="spa-card-3d card-1">
              <img src="/assets/images/spa_home_1.jpg" alt="Maharaja Package" />
              <div className="card-tag">Maharaja Package</div>
            </div>
            <div className="spa-card-3d card-2">
              <img src="/assets/images/spa_home_2.jpg" alt="Serenity Package" />
              <div className="card-tag">Serenity Package</div>
            </div>
            <div className="spa-card-3d card-3">
              <img src="/assets/images/spa-long.jpg" alt="Executive Package" />
              <div className="card-tag">Executive Package</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUR SERVICES SECTION (3D AUTO-SLIDER) ===== */}
      <section className="section section--services-3d" id="homeServices3d">
        <div className="services-header-bar reveal-up">
          <div className="services-title-box">
            <h2 className="services-main-head"><span className="text-maroon">OUR</span> SERVICES</h2>
            <p className="services-sub-head">GREAT LOCATION &amp; BEST SERVICES</p>
          </div>
          <div className="services-btn-box">
            <Link to="/services" className="btn-view-services">VIEW ALL SERVICES</Link>
          </div>
        </div>

        <div className="services-orig-grid reveal-up">
          {/* Card 1: Breakfast */}
          <Link to="/services" className="service-orig-card">
            <div className="service-orig-icon-wrap">
              <span className="service-emoji">🍳</span>
            </div>
            <h3>Breakfast</h3>
            <p>Complimentary fresh morning buffet</p>
            <span className="service-orig-link">EXPLORE MORE <span>→</span></span>
          </Link>

          {/* Card 2: Wellness Centre */}
          <Link to="/spa" className="service-orig-card">
            <div className="service-orig-icon-wrap">
              <span className="service-emoji">🧘‍♀️</span>
            </div>
            <h3>Wellness Centre</h3>
            <p>Experience a holistic approach to health</p>
            <span className="service-orig-link">EXPLORE MORE <span>→</span></span>
          </Link>

          {/* Card 3: Free WiFi */}
          <Link to="/services" className="service-orig-card">
            <div className="service-orig-icon-wrap">
              <span className="service-emoji">📶</span>
            </div>
            <h3>Free WiFi</h3>
            <p>High-speed fiber connectivity</p>
            <span className="service-orig-link">EXPLORE MORE <span>→</span></span>
          </Link>
        </div>

        {/* 3D Auto-Sliding Showcase directly below the 3 cards */}
        <div className="services-3d-wrapper reveal-up" style={{ marginTop: '50px' }}>
          <div
            className="services-3d-viewport"
            id="services3dViewport"
            onMouseEnter={() => setServicesAutoplay(false)}
            onMouseLeave={() => setServicesAutoplay(true)}
          >
            <div className="services-3d-stage" id="services3dStage">
              {servicesImages.map((img, idx) => {
                let diff = idx - servicesIndex;
                const total = servicesImages.length;
                if (diff > total / 2) diff -= total;
                if (diff < -total / 2) diff += total;

                // Inline position styling matching the vanilla updates
                let transformStyle = '';
                let opacityStyle = '0';
                let zIndexStyle = '1';
                let pointerEventsStyle = 'none';

                const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

                if (diff === 0) {
                  transformStyle = `translate3d(0, 0, 0) scale(1) rotateY(0deg)`;
                  opacityStyle = '1';
                  zIndexStyle = '15';
                  pointerEventsStyle = 'auto';
                } else if (diff === 1 || (servicesIndex === total - 1 && idx === 0)) {
                  const translateX = isMobile ? '65%' : '440px';
                  transformStyle = `translate3d(${translateX}, 0, -180px) rotateY(-22deg) scale(0.85)`;
                  opacityStyle = '0.7';
                  zIndexStyle = '8';
                  pointerEventsStyle = 'auto';
                } else if (diff === -1 || (servicesIndex === 0 && idx === total - 1)) {
                  const translateX = isMobile ? '-65%' : '-440px';
                  transformStyle = `translate3d(${translateX}, 0, -180px) rotateY(22deg) scale(0.85)`;
                  opacityStyle = '0.7';
                  zIndexStyle = '8';
                  pointerEventsStyle = 'auto';
                } else if (diff === 2 || (servicesIndex === total - 2 && idx === 0) || (servicesIndex === total - 1 && idx === 1)) {
                  const translateX = isMobile ? '110%' : '760px';
                  transformStyle = `translate3d(${translateX}, 0, -320px) rotateY(-35deg) scale(0.7)`;
                  opacityStyle = isMobile ? '0' : '0.25';
                  zIndexStyle = '3';
                  pointerEventsStyle = 'none';
                } else if (diff === -2 || (servicesIndex === 0 && idx === total - 2) || (servicesIndex === 1 && idx === total - 1)) {
                  const translateX = isMobile ? '-110%' : '-760px';
                  transformStyle = `translate3d(${translateX}, 0, -320px) rotateY(35deg) scale(0.7)`;
                  opacityStyle = isMobile ? '0' : '0.25';
                  zIndexStyle = '3';
                  pointerEventsStyle = 'none';
                } else {
                  transformStyle = `translate3d(0, 0, -500px) scale(0.5)`;
                  opacityStyle = '0';
                  zIndexStyle = '1';
                  pointerEventsStyle = 'none';
                }

                return (
                  <div
                    key={idx}
                    className={`service-3d-card ${diff === 0 ? 'active' : ''}`}
                    data-index={idx}
                    style={{
                      transform: transformStyle,
                      opacity: opacityStyle,
                      zIndex: zIndexStyle,
                      pointerEvents: pointerEventsStyle,
                      transition: 'transform 0.6s var(--ease), opacity 0.6s var(--ease)'
                    }}
                  >
                    <div className="service-3d-card-inner">
                      <img src={img.src} alt={img.alt} />
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Navigation Arrows */}
            <button className="services-3d-arrow services-3d-prev" onClick={() => { goPrevServices(); setServicesAutoplay(true); }} aria-label="Previous Service">‹</button>
            <button className="services-3d-arrow services-3d-next" onClick={() => { goNextServices(); setServicesAutoplay(true); }} aria-label="Next Service">›</button>
          </div>

          <div className="services-3d-controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
            <div className="services-3d-dots" id="services3dDots" style={{ display: 'flex', gap: '8px' }}>
              {servicesImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`services-dot ${servicesIndex === idx ? 'active' : ''}`}
                  onClick={() => { setServicesIndex(idx); setServicesAutoplay(true); }}
                  aria-label={`Slide ${idx + 1}`}
                ></button>
              ))}
            </div>
            <div className="services-3d-progress" style={{ width: '120px', height: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', borderRadius: '10px' }}>
              <div style={{ width: `${Math.min(servicesProgress, 100)}%`, height: '100%', background: 'var(--gold)', transition: 'width 0.05s linear' }}></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
