import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  // ==================== 1. 3D HERO SLIDER ====================
  const [heroIndex, setHeroIndex] = useState(0);
  const heroDuration = 6000;
  const [heroProgress, setHeroProgress] = useState(0);
  const heroImages = [
    '/assets/images/ChatGPT Image Aug 9, 2026, 02_46_57 PM.png',
    '/assets/images/spa-long.jpg',
    '/assets/images/pic 73.jpg.jpeg'
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

  // ==================== 2. CONTACT FORM ====================
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API request or store in localStorage inquiry log if needed
    const inquiryId = 'INQ' + Math.floor(1000 + Math.random() * 9000);
    try {
      const existingInquiries = JSON.parse(localStorage.getItem('hsd_contact_inquiries')) || [];
      existingInquiries.unshift({
        id: inquiryId,
        name,
        email,
        phone,
        message,
        dateCreated: new Date().toISOString().split('T')[0]
      });
      localStorage.setItem('hsd_contact_inquiries', JSON.stringify(existingInquiries));
    } catch(err) {
      console.error('Error saving inquiry:', err);
    }

    setSuccess(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <>
      {/* ===== 3D CONTACT HERO SLIDER ===== */}
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
            <span className="badge-sparkle">✦</span> HOTEL SHREE DAAN CONTACT &amp; LOCATION <span className="badge-sparkle">✦</span>
          </div>
          <h1 className="gallery-hero-title">
            Contact <span>Us</span>
          </h1>
          <div className="gallery-hero-breadcrumb">
            <Link to="/">HOME</Link>
            <span className="sep">›</span>
            <span className="active">CONTACT US</span>
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

      {/* ===== ULTRA LUXURY 3D CONTACT SECTION ===== */}
      <section className="contact-3d-section">
        {/* Section Head */}
        <div className="contact-3d-head reveal-up">
          <div className="contact-3d-badge">
            <span>✦</span> CONCIERGE &amp; RESERVATIONS DESK <span>✦</span>
          </div>
          <h2 className="contact-3d-title">Get In Touch With <span>Our Team</span></h2>
          <p className="contact-3d-subtitle">Have a query or looking to reserve your luxury stay? Reach out to Hotel Shree Daan's 24/7 hospitality concierge team anytime.</p>
        </div>

        <div className="contact-3d-container">
          {/* ROW 1: TWO SIDE-BY-SIDE MATCHING BOXES */}
          <div className="contact-3d-grid">
            
            {/* Left Column Box: Send a Message Form */}
            <div className="contact-3d-card-box reveal-up">
              <div className="contact-3d-form-header">
                <h3>Send a Message</h3>
                <p>Fill out the inquiry form below and our guest experience team will connect with you immediately.</p>
              </div>

              <form id="contactForm" onSubmit={handleSubmit}>
                <div className="field-3d">
                  <label htmlFor="cName">Full Name</label>
                  <input
                    type="text"
                    id="cName"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="field-3d">
                  <label htmlFor="cEmail">Email Address</label>
                  <input
                    type="email"
                    id="cEmail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="field-3d">
                  <label htmlFor="cPhone">Phone Number</label>
                  <input
                    type="tel"
                    id="cPhone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="field-3d">
                  <label htmlFor="cMessage">Message</label>
                  <textarea
                    id="cMessage"
                    rows="4"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                  ></textarea>
                </div>
                
                <button type="submit" className="btn-3d-submit">
                  <span>Send Direct Message</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                
                {success && (
                  <p className="form-note" style={{ color: 'var(--gold-glow)', marginTop: '14px', textAlign: 'center' }}>
                    ✓ Thank you! Your message has been sent directly to our Concierge Desk.
                  </p>
                )}
              </form>
            </div>

            {/* Right Column Box: Concierge & Contact Details */}
            <div className="contact-3d-card-box reveal-up" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div className="contact-3d-form-header">
                  <h3>Concierge Details</h3>
                  <p>Direct contact hotline, email desk, and location details for Hotel Shree Daan.</p>
                </div>

                <div className="contact-info-list">
                  {/* Address Item */}
                  <div className="info-card-3d">
                    <div className="info-icon-3d">📍</div>
                    <div className="info-content-3d">
                      <h4>Hotel Address</h4>
                      <p>Hotel Shree Daan, Valsad Road, Balitha, N.H No.8, Vapi - 396 191, Gujarat, India</p>
                    </div>
                  </div>

                  {/* Phone & Reservations Card */}
                  <div className="info-card-3d">
                    <div className="info-icon-3d">📞</div>
                    <div className="info-content-3d">
                      <h4>Direct Concierge &amp; Phone</h4>
                      <p><a href="tel:+917874050009">+91 78740 50009</a> (Front Desk Hotline)</p>
                      <div className="status-badge-live">
                        <span className="status-dot-pulse"></span> Desk Hotline Active
                      </div>
                    </div>
                  </div>

                  {/* Email Card */}
                  <div className="info-card-3d">
                    <div className="info-icon-3d">✉️</div>
                    <div className="info-content-3d">
                      <h4>Email Desk</h4>
                      <p><a href="mailto:reservations@shreedaanhotel.com">reservations@shreedaanhotel.com</a></p>
                    </div>
                  </div>

                  {/* Hours & Service Card */}
                  <div className="info-card-3d">
                    <div className="info-icon-3d">🕒</div>
                    <div className="info-content-3d">
                      <h4>Hours &amp; Operations</h4>
                      <p>Front Desk Concierge — 24 Hours / 7 Days<br />Dining &amp; Room Service — 6:30 AM – 11:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp 3D Direct Connect Card */}
              <div className="whatsapp-3d-card" style={{ marginTop: '14px' }}>
                <div className="whatsapp-left">
                  <div className="whatsapp-icon-bg">💬</div>
                  <div className="whatsapp-text">
                    <h5>Instant WhatsApp Support</h5>
                    <p>Chat directly with our Concierge Desk</p>
                  </div>
                </div>
                <a href="https://wa.me/917874050009" target="_blank" rel="noopener noreferrer" className="btn-whatsapp-action">
                  <span>Chat Now</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>

            </div>

          </div>

          {/* ROW 2: FULL WIDTH BIG INTERACTIVE MAP */}
          <div className="map-card-3d-full reveal-up" style={{ marginTop: '36px' }}>
            <div className="map-card-header">
              <div className="map-header-left">
                <span className="map-badge">📍 INTERACTIVE MAP &amp; LOCATION</span>
                <h3 className="map-full-title">Find Us On Google Maps — Hotel Shree Daan, Vapi</h3>
              </div>
              <a href="https://maps.google.com/maps?q=Hotel+Shree+Daan%2C+Valsad+Road%2C+N.H+396+191+8%2C+Koparli+Road%2C+Balitha%2C+Vapi%2C+Gujarat+396191" target="_blank" rel="noopener noreferrer" className="map-directions-btn">
                <span>Get Directions ↗</span>
              </a>
            </div>
            <iframe
              title="Hotel Location Map"
              src="https://maps.google.com/maps?q=Hotel+Shree+Daan%2C+Valsad+Road%2C+N.H+396+191+8%2C+Koparli+Road%2C+Balitha%2C+Vapi%2C+Gujarat+396191&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              className="map-iframe"
            />
          </div>

        </div>
      </section>
    </>
  );
}
