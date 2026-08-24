import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { SPA_TREATMENTS } from '../data/spaDetailsData';
import { createSpaBooking } from '../api';

const SHORT_DESCS = {
  'natural-scrub': 'Traditionally exfoliating ritual for body complexion...',
  'detan-scrub': 'Removes dirt, reduces fine lines, cleanses deeply...',
  'fruit-scrub': 'Natural fruit extract exfoliator for glowing skin...',
  'ubtan-scrub': 'Turmeric and saffron extract for tan removal...',
  'turkish-hammam': 'Middle Eastern steam bath, scrub, and deep skin softening...',
  'signature-therapy': 'Thai & oil massage combination with facial, scrub & Jacuzzi...',
  'couple-connect': 'Simultaneous couple relaxation with two therapists...',
  'pizhichil': 'Oleation and sudation treatment for arthritis, blood pressure...',
  'hamam': 'Soothing bath with milk and scrub, leaves a shimmering veil...',
  'flower-bath': 'Warm tub with epsom salts, flowers, and healing herbs...',
  'deep-tissue': 'Deep pressure targeting aches, knots, and tired muscles...',
  'aroma': 'Pure essential oils with classical relaxation techniques...',
  'swedish': 'Long, kneading strokes combined with rhythmic tapping...',
  'balinese': 'Stretches, acupressure, and aromatherapy to restore energy flow...',
  'dry-therapy': 'Active stretching, pulling and rocking without oil...',
  'rope-therapy': 'Traditional Indian foot pressure massage balancing on ropes...',
  'two-therapist-rope': 'Dual practitioner support for deep tissue pressure...',
  'hot-stone': 'Warm volcanic stones with essential oils for muscle tension...',
  'foot-reflexology': 'Restores body energy flow by targeting foot reflex points...',
  'cupping': 'Detoxifies and stimulates circulation using suction cups...',
  'shirodhara': 'Continuous stream of warm herbal oil on forehead for deep sleep...',
  'head-massage': 'Ancient Ayurvedic crown ritual to relieve stress and tension...',
  'ayurveda-stress': 'Harmonizes body & mind with Abhyanga and Shirodhara...',
  'herbal-pouch': 'Rhythmic warm oil application with heated herbal compress...',
  'hasta-padbhyangam': 'Hand and foot massage focusing on vital Ayurvedic marma points...',
  'abhyangam': 'Detoxifying full body massage using warm herbal medicated oils...',
  'shirodhara-circuits': 'Choice of Buttermilk, Decoction, Milk, or Oil flowing formulas...',
  'casa-vasta': 'Sacred rituals, sound healing & quantum tools for nervous system...',
  'space-aakash': 'Foot bath, Sandal body polish, Abhyanga and Shirodhara...',
  'fire-tejas': 'Heated back compress, Swedish massage, and choice of facial...',
  'earth-ira': 'Foot bath, Aroma fusion massage, and foot reflexology session...',
  'water-jal': 'Foot bath, ocean body scrub, body wrap, massage & hydrating facial...',
  'wind-vayu': 'Temple massage & Sandal Shea body polish with shea butter...',
  'indoceane': 'De-tan body scrub, milk bath, sandalwood massage, & cream wrap...',
  'berries-facial': 'Rich berry extracts (grape, pomegranate) for vitality & moisture...',
  'charcoal-facial': 'Exfoliating charcoal mask absorbs oil and minimizes pores...',
  'detan-facial': 'Removes tanned skin layer, reduces blemishes & acne appearance...',
  'diamond-facial': 'Anti-ageing treatment to tighten skin and restore collagen...',
  'gold-facial': 'Anti-ageing procedure targeting dark circles, lines & wrinkles...'
};

// Spa Card Media Slider for multi-image & video items
function SpaCardSlider({ images, media }) {
  const items = media || images || [];
  const [idx, setIdx] = useState(0);
  const videoRefs = useRef({});

  // Normalize items to { type: 'video' | 'image', src: string, poster?: string }
  const normalizedItems = items.map(item => {
    if (typeof item === 'string') {
      const isVideo = item.toLowerCase().endsWith('.mp4') || item.toLowerCase().endsWith('.webm');
      return { 
        type: isVideo ? 'video' : 'image', 
        src: item
      };
    }
    return item;
  });

  const currentItem = normalizedItems[idx];

  // Auto-advance logic
  useEffect(() => {
    if (normalizedItems.length <= 1) return;

    if (currentItem?.type === 'video') {
      const currentVideo = videoRefs.current[idx];
      if (currentVideo) {
        currentVideo.currentTime = 0;
        currentVideo.play().catch(() => {});
      }
      // Safety fallback timer in case onEnded doesn't fire
      const fallbackTimer = setTimeout(() => {
        setIdx(prev => (prev + 1) % normalizedItems.length);
      }, 7000);
      return () => clearTimeout(fallbackTimer);
    } else {
      const timer = setTimeout(() => {
        setIdx(prev => (prev + 1) % normalizedItems.length);
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [idx, normalizedItems.length, currentItem?.type]);

  const handleVideoEnded = () => {
    setIdx(prev => (prev + 1) % normalizedItems.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setIdx(prev => (prev - 1 + normalizedItems.length) % normalizedItems.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setIdx(prev => (prev + 1) % normalizedItems.length);
  };

  if (!normalizedItems.length) return null;

  const firstImg = normalizedItems.find(it => it.type === 'image')?.src || '/assets/images/Gemini_Generated_Image_dwvkjqdwvkjqdwvk.png';

  return (
    <div className="card-slider-wrapper" style={{ height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#0d0608' }}>
      {normalizedItems.map((item, i) => {
        const isActive = idx === i;
        const bgImg = item.type === 'video' ? (item.poster || firstImg) : item.src;
        const posterImg = item.poster || firstImg;
        return (
          <div
            key={i}
            className={`card-slide ${isActive ? 'active' : ''}`}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: isActive ? 2 : 1,
              backgroundImage: bgImg ? `url('${bgImg}')` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {item.type === 'video' && (
              <video
                ref={el => { videoRefs.current[i] = el; }}
                autoPlay
                muted
                playsInline
                preload="metadata"
                poster={posterImg}
                onEnded={handleVideoEnded}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block'
                }}
              >
                <source src={item.src} type="video/mp4" />
              </video>
            )}
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {normalizedItems.length > 1 && (
        <>
          <button
            type="button"
            className="slider-nav-arrow slider-nav-prev"
            onClick={handlePrev}
            aria-label="Previous slide"
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(15, 6, 8, 0.65)',
              border: '1px solid rgba(201, 162, 39, 0.4)',
              color: 'var(--gold-glow, #f3e5ab)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 5,
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s ease',
              padding: 0
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className="slider-nav-arrow slider-nav-next"
            onClick={handleNext}
            aria-label="Next slide"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(15, 6, 8, 0.65)',
              border: '1px solid rgba(201, 162, 39, 0.4)',
              color: 'var(--gold-glow, #f3e5ab)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 5,
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s ease',
              padding: 0
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {normalizedItems.length > 1 && (
        <div
          className="card-slider-dots"
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 5,
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '4px 8px',
            borderRadius: '12px',
            backdropFilter: 'blur(3px)'
          }}
        >
          {normalizedItems.map((item, i) => (
            <span
              key={i}
              className={`card-dot ${idx === i ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIdx(i);
              }}
              title={item.type === 'video' ? 'Video' : `Image ${i + 1}`}
              style={{
                width: idx === i ? '20px' : '7px',
                height: '7px',
                borderRadius: idx === i ? '4px' : '50%',
                background: idx === i ? '#c9a227' : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Ayurvedic Floating Leaves component
function AyurvedicLeaves() {
  const leafSVGs = [
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%232e7d32"><path d="M50,5 C30,25 15,50 15,75 C15,88 28,95 45,95 C48,95 50,91 50,88 C50,91 52,95 55,95 C72,95 85,88 85,75 C85,50 70,25 50,5 Z M50,15 C52,30 50,80 50,88 M50,30 L65,22 M50,42 L32,35 M50,54 L68,48 M50,66 L30,62 M50,78 L64,74" stroke="%2381c784" stroke-width="3.5" fill-opacity="0.85" stroke-linecap="round"/></svg>`,
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,10 C20,30 10,65 30,85 C42,97 58,97 70,85 C90,65 80,30 50,10 Z M50,10 L50,90 M50,28 C65,34 72,40 72,40 M50,45 C32,50 25,56 25,56 M50,62 C68,66 74,72 74,72" stroke="%23a5d6a7" stroke-width="4" fill="%23388e3c" fill-opacity="0.85" stroke-linecap="round"/></svg>`,
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,5 C25,20 20,40 20,65 C20,85 35,95 50,95 C65,95 80,85 80,65 C80,40 75,20 50,5 Z M50,5 L50,95 M50,25 C62,35 70,42 70,42 M50,45 C35,52 28,60 28,60 M50,65 C64,70 70,78 70,78" stroke="%2366bb6a" stroke-width="3.5" fill="%231b5e20" fill-opacity="0.85" stroke-linecap="round"/></svg>`,
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,8 C25,28 12,52 22,78 C30,94 50,96 50,96 C50,96 70,94 78,78 C88,52 75,28 50,8 Z M50,8 L50,96 M50,25 L72,36 M50,45 L28,54 M50,65 L70,72" stroke="%23c8e6c9" stroke-width="3.5" fill="%2343a047" fill-opacity="0.85" stroke-linecap="round"/></svg>`
  ];

  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // Generate 6 organic floating leaf states
    const generated = Array.from({ length: 6 }, (_, i) => {
      const leftPos = 8 + Math.random() * 84;
      const size = 18 + Math.random() * 20;
      const duration = 11 + Math.random() * 9;
      const delay = -Math.random() * 14;
      const blurVal = (0.8 + Math.random() * 1.0).toFixed(1);
      const svgSrc = leafSVGs[i % leafSVGs.length];

      return {
        left: `${leftPos}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        filter: `blur(${blurVal}px) drop-shadow(0 3px 8px rgba(34, 139, 34, 0.45))`,
        backgroundImage: `url('${svgSrc}')`,
        position: 'absolute',
        top: '-40px',
        opacity: 0,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      };
    });
    setLeaves(generated);
  }, []);

  return (
    <div className="ayurvedic-leaves-container" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {leaves.map((style, idx) => (
        <div key={idx} className="ayurvedic-leaf" style={style}></div>
      ))}
    </div>
  );
}

export default function SpaDetails() {
  const { hash } = useLocation();
  const activeTab = hash ? hash.replace('#', '') : 'body-scrub';

  // ==================== 1. 3D HERO SLIDER ====================
  const [heroIndex, setHeroIndex] = useState(0);
  const heroVideoRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [heroProgress, setHeroProgress] = useState(0);

  // Preload Ayurveda showcase video for instant zero-blank playback
  useEffect(() => {
    const v = document.createElement('video');
    v.src = '/assets/videos/IMG_4707.mp4';
    v.preload = 'auto';
    v.load();
  }, []);

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
    setHeroProgress(0);
  }, [heroIndex]);

  const goNextHero = () => setHeroIndex(prev => (prev + 1) % 5);
  const goPrevHero = () => setHeroIndex(prev => (prev - 1 + 5) % 5);

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

  // ==================== 2. MENU BOOKLET STATE ====================
  const [activeItems, setActiveItems] = useState({
    'body-scrub': 0,
    'bath-therapy': 0,
    'rejuvenate': 0,
    'body-therapy': 0,
    'ayurveda': 0,
    'spa-packages': 0,
    'facial-therapy': 0
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemSelect = (catKey, index) => {
    setActiveItems(prev => ({
      ...prev,
      [catKey]: index
    }));
    if (window.innerWidth <= 991) {
      setIsModalOpen(true);
    }
  };

  const scrollToTabs = (smooth = true) => {
    const tabsNav = document.querySelector('.spa-tabs-nav');
    if (tabsNav) {
      const offset = 85;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = tabsNav.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: Math.max(0, elementPosition - offset),
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  // Scroll to tabs navigation when hash is present or changes
  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        scrollToTabs(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  // ==================== 3. SPA BOOKING FORM ====================
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestDate, setGuestDate] = useState('');
  const [guestService, setGuestService] = useState('natural-scrub');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setGuestDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    const categoryItems = SPA_TREATMENTS[activeTab]?.items || [];
    if (categoryItems.length > 0) {
      setGuestService(categoryItems[0].id);
    }
  }, [activeTab]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const selectEl = document.getElementById('spaService');
    const serviceText = selectEl ? selectEl.options[selectEl.selectedIndex].text : 'Spa Service';
    const serviceName = serviceText.split(' — ')[0];
    const price = serviceText.includes('₹') ? parseInt(serviceText.split('₹')[1].replace(/,/g, ''), 10) : 2000;
    const spaId = 'SPA-' + Math.floor(1000 + Math.random() * 9000);

    const spaPayload = {
      id: spaId,
      name: guestName || 'Guest',
      phone: guestPhone,
      email: '',
      service: serviceName,
      serviceCode: guestService,
      date: guestDate,
      timeSlot: '03:00 PM',
      duration: '60 mins',
      price: price,
      status: 'confirmed',
      dateCreated: new Date().toISOString().split('T')[0]
    };

    try {
      await createSpaBooking(spaPayload);
    } catch(err) {
      console.error('Error saving spa booking:', err);
    }

    setSuccess(true);
    setGuestName('');
    setGuestPhone('');
    setTimeout(() => setSuccess(false), 6000);
  };

  const handleBookSession = (serviceCode) => {
    setGuestService(serviceCode);
    const formEl = document.getElementById('spaBookingForm');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const activeCategory = SPA_TREATMENTS[activeTab];
  const activeItemIdx = activeItems[activeTab] || 0;
  const activeItem = activeCategory?.items[activeItemIdx];
  const bookingServices = activeCategory?.items || [];

  return (
    <>
      {/* ===== 3D SPA HERO SLIDER ===== */}
      <section id="spaHeroSlider" className="spa-hero-3d">
        <div className="spa-3d-viewport">
          <div className="spa-3d-slides" id="spa3dSlides">
            {/* Slide 1 */}
            <div className={`spa-3d-slide ${heroIndex === 0 ? 'active' : ''}`} data-index="0">
              <video
                ref={heroVideoRefs[0]}
                autoPlay
                muted
                playsInline
                preload="metadata"
                poster="/assets/images/pic 73.jpg.jpeg"
                onTimeUpdate={(e) => handleVideoTimeUpdate(e, 0)}
                onEnded={() => handleVideoEnded(0)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src="/assets/videos/spa 1.mp4" type="video/mp4" />
              </video>
              <div className="spa-slide-overlay"></div>
            </div>

            {/* Slide 2 */}
            <div className={`spa-3d-slide ${heroIndex === 1 ? 'active' : ''}`} data-index="1">
              <video
                ref={heroVideoRefs[1]}
                autoPlay
                muted
                playsInline
                preload="none"
                poster="/assets/images/pic 37.jpg.jpeg"
                onTimeUpdate={(e) => handleVideoTimeUpdate(e, 1)}
                onEnded={() => handleVideoEnded(1)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src="/assets/videos/IMG_4696.mp4" type="video/mp4" />
              </video>
              <div className="spa-slide-overlay"></div>
            </div>

            {/* Slide 3 */}
            <div className={`spa-3d-slide ${heroIndex === 2 ? 'active' : ''}`} data-index="2">
              <video
                ref={heroVideoRefs[2]}
                autoPlay
                muted
                playsInline
                preload="none"
                poster="/assets/images/pic 60.jpg.jpeg"
                onTimeUpdate={(e) => handleVideoTimeUpdate(e, 2)}
                onEnded={() => handleVideoEnded(2)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src="/assets/videos/spa 2.mp4" type="video/mp4" />
              </video>
              <div className="spa-slide-overlay"></div>
            </div>

            {/* Slide 4 (IMG_4709) */}
            <div className={`spa-3d-slide ${heroIndex === 3 ? 'active' : ''}`} data-index="3">
              <video
                ref={heroVideoRefs[3]}
                autoPlay
                muted
                playsInline
                preload="none"
                poster="/assets/images/spa-long.jpg"
                onTimeUpdate={(e) => handleVideoTimeUpdate(e, 3)}
                onEnded={() => handleVideoEnded(3)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src="/assets/videos/IMG_4709.mp4" type="video/mp4" />
              </video>
              <div className="spa-slide-overlay"></div>
            </div>

            {/* Slide 5 (spa 3) */}
            <div className={`spa-3d-slide ${heroIndex === 4 ? 'active' : ''}`} data-index="4">
              <video
                ref={heroVideoRefs[4]}
                autoPlay
                muted
                playsInline
                preload="none"
                poster="/assets/images/spa_home_1.jpg"
                onTimeUpdate={(e) => handleVideoTimeUpdate(e, 4)}
                onEnded={() => handleVideoEnded(4)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src="/assets/videos/spa 3.mp4" type="video/mp4" />
              </video>
              <div className="spa-slide-overlay"></div>
            </div>
          </div>
        </div>



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
            {[0, 1, 2, 3, 4].map(idx => (
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
      <section className="section section--tinted" style={{ padding: '80px 0' }}>
        <div className="section-head reveal-up in-view">
          <p className="eyebrow">Luxury Wellness</p>
          <h2>Shree Golden Sparsh Spa &amp; Academy</h2>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '40px' }} className="reveal-up in-view">
          <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#5c534b' }}>
            Explore our comprehensive treatment menu below. Scroll through the chapters to view details, timing, and pricing for our massage therapies, hammams, and advanced facials.
          </p>
          <div style={{ marginTop: '15px', fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--maroon)', fontWeight: 600, letterSpacing: '0.05em' }}>
            <span className="badge-sparkle">✦</span> TIMING: 8:30 AM to 8:30 PM
          </div>
        </div>

        {/* Premium Category Tabs Navigation */}
        <div className="spa-tabs-nav reveal-up in-view" style={{ maxWidth: '1100px', margin: '0 auto 50px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', padding: '0 20px' }}>
          {Object.entries(SPA_TREATMENTS).map(([catKey, category]) => (
            <button
              key={catKey}
              className={`spa-tab-btn ${activeTab === catKey ? 'active' : ''}`}
              onClick={() => {
                window.location.hash = catKey;
                scrollToTabs(true);
              }}
            >
              {category.title}
            </button>
          ))}
        </div>

        <div className="spa-menu-container">
          {Object.entries(SPA_TREATMENTS)
            .filter(([catKey]) => catKey === activeTab)
            .map(([catKey, category]) => {
              const activeIdx = activeItems[catKey];
              const activeItem = category.items[activeIdx];

            return (
              <div key={catKey} id={catKey} className="spa-menu-category in-view">
                <AyurvedicLeaves />
                <div className="spa-category-header">{category.title}</div>
                <div className="spa-category-layout">
                  {/* Left Column Showcase Card */}
                  <div className="spa-showcase-column">
                    <div className="spa-showcase-img-wrapper" style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                      {catKey === 'body-scrub' ? (
                        <SpaCardSlider images={[
                          '/assets/images/ChatGPT Image Aug 12, 2026, 08_45_41 PM.png',
                          '/assets/images/Gemini_Generated_Image_lmp0zhlmp0zhlmp0.png',
                          '/assets/images/ChatGPT Image Aug 12, 2026, 08_49_18 PM.png'
                        ]} />
                      ) : catKey === 'ayurveda' ? (
                        <SpaCardSlider images={[
                          '/assets/videos/IMG_4707.mp4',
                          '/assets/images/Gemini_Generated_Image_dwvkjqdwvkjqdwvk.png',
                          '/assets/images/Gemini_Generated_Image_lwf1gxlwf1gxlwf1.png'
                        ]} />
                      ) : catKey === 'rejuvenate' ? (
                        <SpaCardSlider images={[
                          '/assets/images/Gemini_Generated_Image_sqlopmsqlopmsqlo.png',
                          '/assets/videos/IMG_4707.mp4'
                        ]} />
                      ) : (
                        <img className="spa-showcase-img" src={activeItem.image} alt={activeItem.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                    <div className="spa-showcase-content">
                      <div className="spa-showcase-title-row">
                        <h4 className="spa-showcase-title">{activeItem.title}</h4>
                        {!activeItem.rates && (
                          <div className="spa-showcase-price-box">
                            <span className="price spa-showcase-price">{activeItem.price}</span>
                            <span className="duration spa-showcase-duration">{activeItem.duration}</span>
                          </div>
                        )}
                      </div>

                      {activeItem.rates && (
                        <div className="spa-showcase-rates-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginBottom: '16px', padding: '12px 14px', background: 'rgba(201, 162, 39, 0.05)', borderRadius: '6px', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
                          {activeItem.rates.map((rate, rIdx) => (
                            <div key={rIdx} className="showcase-rate-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#d1c7bd', paddingBottom: '6px', borderBottom: rIdx === activeItem.rates.length - 1 ? 'none' : '1px dashed rgba(201, 162, 39, 0.15)' }}>
                              <span>{rate.duration}</span>
                              <strong>{rate.price}</strong>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="spa-showcase-desc" style={{ fontSize: '0.88rem', color: '#a89f97', lineHeight: '1.6', margin: '0 0 20px' }}>{activeItem.desc}</p>
                      <button className="btn btn-gold btn-showcase-book" style={{ width: '100%' }} onClick={() => handleBookSession(activeItem.id)}>
                        Book Treatment
                      </button>
                    </div>
                  </div>

                  {/* Right Column List of Items */}
                  <div className="spa-items-column">
                    {category.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`spa-menu-item ${activeIdx === idx ? 'active' : ''}`}
                        onClick={() => handleItemSelect(catKey, idx)}
                      >
                        <div className="spa-item-text">
                          <h5 style={{ color: activeIdx === idx ? 'var(--gold-glow)' : 'var(--ivory)' }}>
                            {item.title}
                          </h5>
                          <p>{SHORT_DESCS[item.id] || item.desc}</p>
                        </div>
                        <div className="spa-item-meta-panel">
                          <span className="dur">{item.duration}</span>
                          <span className="prc">{item.price}</span>
                          <span className="chevron">➔</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="spa-tax-notice">*Exclusive GST</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== SPA APPOINTMENT FORM ===== */}
      <section className="spa-booking-section">
        <div className="jaali-bg"></div>
        <div className="section-head reveal-up">
          <p className="eyebrow eyebrow--light">Reserve an Appointment</p>
          <h2 style={{ color: 'var(--ivory)' }}>Request a Spa Session</h2>
        </div>

        <form id="spaBookingForm" onSubmit={handleBookingSubmit} className="booking-card reveal-up" style={{ maxWidth: '1020px', margin: '0 auto', boxSizing: 'border-box', overflow: 'hidden' }}>
          <div className="booking-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="field">
              <label htmlFor="spaName">Full Name</label>
              <input
                type="text"
                id="spaName"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <div className="field">
              <label htmlFor="spaPhone">Phone Number</label>
              <input
                type="tel"
                id="spaPhone"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="Contact Number"
              />
            </div>
            <div className="field">
              <label htmlFor="spaDate">Preferred Date</label>
              <input
                type="date"
                id="spaDate"
                required
                value={guestDate}
                onChange={(e) => setGuestDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="field">
              <label htmlFor="spaService">Service Type</label>
              <select
                id="spaService"
                value={guestService}
                onChange={(e) => setGuestService(e.target.value)}
                style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', background: '#26161a', color: 'var(--ivory)', border: '1px solid rgba(201, 162, 39, 0.4)', padding: '12px', borderRadius: '4px' }}
              >
                {bookingServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title} — {service.price}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn btn-gold btn-block" style={{ marginTop: '10px' }}>Send Spa Request</button>
          {success && (
            <p className="form-note" style={{ textAlign: 'center', color: 'var(--gold-glow)', marginTop: '20px', fontWeight: '400' }}>
              Spa Appointment Requested. Our wellness desk will call you shortly to confirm your slot.
            </p>
          )}
        </form>
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

      {/* ===== MOBILE DETAIL MODAL ===== */}
      <div className={`spa-mobile-modal ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
        <div className="spa-modal-sheet" onClick={(e) => e.stopPropagation()}>
          <button className="spa-modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close details">✕</button>
          {activeItem && (
            <>
              <div className="spa-modal-img-box">
                <img src={activeItem.image} alt={activeItem.title} />
              </div>
              <div className="spa-modal-body">
                <div className="spa-modal-header-row">
                  <h4>{activeItem.title}</h4>
                  {!activeItem.rates && (
                    <div className="spa-modal-price-box">
                      <span className="price">{activeItem.price}</span>
                      <span className="duration" style={{ display: 'block' }}>{activeItem.duration}</span>
                    </div>
                  )}
                </div>
                
                {activeItem.rates && (
                  <div className="spa-modal-rates-list" style={{ display: 'flex', flexDirection: 'column' }}>
                    {activeItem.rates.map((rate, rIdx) => (
                      <div key={rIdx} className="modal-rate-row" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span>{rate.duration}</span>
                        <strong>{rate.price}</strong>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="spa-modal-desc">{activeItem.desc}</p>
                <button 
                  className="btn btn-gold btn-modal-book" 
                  onClick={() => {
                    setIsModalOpen(false);
                    handleBookSession(activeItem.id);
                  }}
                  style={{ width: '100%' }}
                >
                  Book This Treatment
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
