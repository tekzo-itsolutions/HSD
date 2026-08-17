import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  // ==================== 1. 3D HERO SLIDER ====================
  const [heroIndex, setHeroIndex] = useState(0);
  const heroDuration = 6000;
  const [heroProgress, setHeroProgress] = useState(0);
  const heroImages = [
    '/assets/images/ChatGPT Image Aug 10, 2026, 11_46_14 PM.png',
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

  return (
    <>
      {/* ===== 3D SERVICES HERO SLIDER ===== */}
      <section id="servicesHeroSlider" className="gallery-hero-3d">
        <div className="gallery-3d-viewport">
          <div className="gallery-3d-slides" id="services3dSlides">
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
                  <div className="gallery-slide-bg" style={{ backgroundImage: `url('${src}')`, backgroundPosition: 'center bottom' }}></div>
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
            <span className="badge-sparkle">✦</span> HOTEL SHREE DAAN AMENITIES <span className="badge-sparkle">✦</span>
          </div>
          <h1 className="gallery-hero-title">
            Luxury <span>Services</span>
          </h1>
          <div className="gallery-hero-breadcrumb">
            <Link to="/">HOME</Link>
            <span className="sep">›</span>
            <span className="active">SERVICES</span>
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
          <div className="gallery-3d-dots" id="services3dDots">
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

      {/* ===== SERVICES DETAILED GRID ===== */}
      <section className="section section--tinted">
        <div className="section-head reveal-up">
          <p className="eyebrow">Hotel Amenities</p>
          <h2>Attentive Care, <em>Quietly Anticipated</em></h2>
        </div>

        <div className="services-premium-row">
          {/* Breakfast Card */}
          <div className="premium-service-card reveal-up">
            <div className="premium-service-image" style={{ height: '220px', overflow: 'hidden' }}>
              <img src="/assets/images/service-slider-3.jpg" alt="Breakfast" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="premium-service-content">
              <h3>BREAKFAST</h3>
              <p>A complimentary breakfast take care of the first meal of the day. Enjoy a variety of healthy breakfast with your choice of tea/coffee/milk etc.</p>
            </div>
          </div>

          {/* Wifi Hotspot Card */}
          <div className="premium-service-card reveal-up">
            <div className="premium-service-image" style={{ height: '220px', overflow: 'hidden' }}>
              <img src="/assets/images/wifi_service_hotspot.jpg" alt="Free Wifi Hotspot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="premium-service-content">
              <h3>FREE WIFI HOTSPOT</h3>
              <p>Hi-speed internet helps you stay connected. Surf social media applications with our hi-speed wi-fi hotspot connectivity.</p>
            </div>
          </div>

          {/* Doctor On Call Card */}
          <div className="premium-service-card reveal-up">
            <div className="premium-service-image" style={{ height: '220px', overflow: 'hidden' }}>
              <img src="/assets/images/doctor_on_call.jpg" alt="Doctor On Call" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="premium-service-content">
              <h3>DOCTOR ON CALL</h3>
              <p>For the good health We Provide “doctor on call” service to our customers. Customers can have this services while they are with us.</p>
            </div>
          </div>

          {/* Same Day Laundry Service Card */}
          <div className="premium-service-card reveal-up">
            <div className="premium-service-image" style={{ height: '220px', overflow: 'hidden' }}>
              <img src="/assets/images/same_day_laundry.jpg" alt="Same Day Laundry Service" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="premium-service-content">
              <h3>SAME DAY LAUNDRY SERVICE</h3>
              <p>Hotel Shree Daan Provide a Laundry Services on same day Dry - Cleaning and Laundry Services to all our guest.</p>
            </div>
          </div>

          {/* Business Lounge / Banquet Hall Card */}
          <div className="premium-service-card reveal-up">
            <div className="premium-service-image" style={{ height: '220px', overflow: 'hidden' }}>
              <img src="/assets/images/service-slider-2.jpg" alt="Business Lounge / Banquet Hall" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="premium-service-content">
              <h3>BUSINESS LOUNGE / Banquet Hall</h3>
              <p>State of the art business lounge provides our guest with all the resources that they need to perform business functions.</p>
            </div>
          </div>

          {/* Free Car Wash Card */}
          <div className="premium-service-card reveal-up">
            <div className="premium-service-image" style={{ height: '220px', overflow: 'hidden' }}>
              <img src="/assets/images/free_car_wash.jpg" alt="Free Car Wash" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="premium-service-content">
              <h3>FREE CAR WASH AS PER CUSTOMER SAY</h3>
              <p>Hotel Shree Daan provide's for make your perfect holiday, We provides the services of Free Car Washing for all our customers.</p>
            </div>
          </div>

          {/* Equipped with LED Rooms Card */}
          <div className="premium-service-card reveal-up">
            <div className="premium-service-image" style={{ height: '220px', overflow: 'hidden' }}>
              <img src="/assets/images/service-slider-1.jpg" alt="Equipped with LED Rooms" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="premium-service-content">
              <h3>EQUIPPED WITH LED ROOMS</h3>
              <p>Hotel Shree Daan provide's the all rooms are equipped with install a LED TV with multilingual channels for all our customers.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
