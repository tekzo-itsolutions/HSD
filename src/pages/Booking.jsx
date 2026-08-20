import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { roomData, ROOMS } from '../data/roomsData';
import { createRoomBooking } from '../api';

const BOOKING_HERO_IMAGES = [
  '/assets/images/hero-rooms-1.jpg',
  '/assets/images/hero-rooms-2.jpg',
  '/assets/images/hero-booking-3.jpg'
];

if (typeof window !== 'undefined') {
  BOOKING_HERO_IMAGES.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

export default function Booking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roomCode = searchParams.get('room') || 'premier';

  // Get current room details
  const activeRoom = roomData[roomCode] || roomData['premier'];

  // Slide state for individual room images in booking box
  const [slideIndex, setSlideIndex] = useState(0);

  // ==================== 1. 3D HERO SLIDER ====================
  const [heroIndex, setHeroIndex] = useState(0);
  const heroDuration = 6000;
  const [heroProgress, setHeroProgress] = useState(0);
  const heroImages = BOOKING_HERO_IMAGES;

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

  // Form inputs
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');

  // Booking result/Invoice
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Initialize dates
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);

    const checkInStr = tomorrow.toISOString().split('T')[0];
    const checkOutStr = dayAfter.toISOString().split('T')[0];

    setCheckIn(checkInStr);
    setCheckOut(checkOutStr);
  }, []);

  // Update checkOut min date whenever checkIn changes
  const getMinCheckOut = () => {
    if (!checkIn) return '';
    const inDate = new Date(checkIn);
    const minOut = new Date(inDate); minOut.setDate(inDate.getDate() + 1);
    return minOut.toISOString().split('T')[0];
  };

  // Fix checkout if invalid
  useEffect(() => {
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      if (outDate <= inDate) {
        const minOut = new Date(inDate); minOut.setDate(inDate.getDate() + 1);
        setCheckOut(minOut.toISOString().split('T')[0]);
      }
    }
  }, [checkIn]);

  // Calculate nights
  const nights = React.useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  // Room price number
  const priceNumber = React.useMemo(() => {
    if (roomCode === 'banquet-hall') return 0;
    const roomConf = ROOMS.find(r => r.id === roomCode);
    return roomConf ? roomConf.price : 0;
  }, [roomCode]);

  const estimatedTotal = nights * priceNumber;

  const handleRoomSelectChange = (e) => {
    setSearchParams({ room: e.target.value });
    setSlideIndex(0);
  };

  // Auto scroll smoothly to booking desk boxes with navbar offset
  useEffect(() => {
    if (searchParams.get('room')) {
      const timer = setTimeout(() => {
        const deskContainer = document.querySelector('.room-booking-container');
        if (deskContainer) {
          const offset = 95;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = deskContainer.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          window.scrollTo({
            top: Math.max(0, elementPosition - offset),
            behavior: 'smooth'
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [roomCode]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (nights <= 0) {
      alert('Please select a valid check-out date after your check-in date.');
      return;
    }

    const bookingId = 'SD-' + Date.now().toString().slice(-7);
    const formattedCheckIn = formatDate(checkIn);
    const formattedCheckOut = formatDate(checkOut);

    const bookingPayload = {
      id: bookingId,
      name: guestName || 'Guest',
      phone: guestPhone,
      email: guestEmail,
      roomType: activeRoom.name,
      roomCode: roomCode,
      checkIn: checkIn,
      checkOut: checkOut,
      checkInFormatted: formattedCheckIn,
      checkOutFormatted: formattedCheckOut,
      adults: parseInt(adults, 10),
      children: parseInt(children, 10),
      nights: nights,
      total: estimatedTotal,
      status: 'confirmed',
      payStatus: 'Pending',
      dateCreated: new Date().toISOString().split('T')[0]
    };

    // Save to MySQL Backend and LocalStorage
    try {
      await createRoomBooking(bookingPayload);
    } catch(err) {
      console.error('Error saving room booking:', err);
    }

    setConfirmedBooking(bookingPayload);
    setTimeout(() => {
      const el = document.getElementById('bookingConfirmation');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handlePrint = () => {
    window.print();
  };

  const resetForm = () => {
    setConfirmedBooking(null);
    setGuestName('');
    setGuestPhone('');
    setGuestEmail('');
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
    setCheckIn(tomorrow.toISOString().split('T')[0]);
    setCheckOut(dayAfter.toISOString().split('T')[0]);
    setAdults('2');
    setChildren('0');
  };

  // Scroll staggered cascading reveal animation for Room Features
  useEffect(() => {
    const gridEl = document.getElementById('displayRoomFeaturesGrid');
    if (!gridEl) return;

    const items = gridEl.querySelectorAll('.feature-line-item');
    if (!items.length) return;

    // Reset initial state
    items.forEach(item => item.classList.remove('revealed'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('revealed');
            }, index * 80); // 80ms cascading delay per item
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(gridEl);

    return () => {
      observer.disconnect();
    };
  }, [roomCode, activeRoom]);

  // Scroll staggered cascading reveal animation for Kindly Note
  useEffect(() => {
    const noteList = document.getElementById('kindlyNoteList');
    if (!noteList || roomCode !== 'standard-double') return;

    const noteItems = noteList.querySelectorAll('.note-line-item');
    if (!noteItems.length) return;

    // Reset initial state
    noteItems.forEach(item => item.classList.remove('revealed'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          noteItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('revealed');
            }, index * 80);
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(noteList);

    return () => {
      observer.disconnect();
    };
  }, [roomCode]);

  return (
    <>
      {/* ===== 3D RESERVATIONS HERO SLIDER ===== */}
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
                    alt="Hotel Shree Daan Reserve Stay"
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
            <span className="badge-sparkle">✦</span> LUXURY RESERVATIONS DESK <span className="badge-sparkle">✦</span>
          </div>
          <h1 className="gallery-hero-title">
            Reserve <span>Stay</span>
          </h1>
          <div className="gallery-hero-breadcrumb">
            <Link to="/">HOME</Link>
            <span className="sep">›</span>
            <span className="active">RESERVATIONS DESK</span>
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

      {/* ===== BOOKING DESK & ROOM DETAIL SECTION ===== */}
      <section id="booking" className="section section--booking section--booking-light" style={{ minHeight: '70vh', padding: '60px 0 80px' }}>
        <div className="jaali-bg"></div>
        
        <div className="section-head reveal-up in-view" style={{ marginBottom: '32px' }}>
          <p className="eyebrow">Book Your Stay</p>
          <h2>Check Availability &amp; Reserve</h2>
        </div>

        <div className="room-booking-container reveal-up in-view">
          {!confirmedBooking ? (
            <form id="bookingForm" onSubmit={handleFormSubmit}>
              {/* ROW 1: TWO SIDE-BY-SIDE BOXES */}
              <div className="booking-boxes-row">
                
                {/* Left Box: Room Slider Box */}
                <div className="room-slider-box" id="roomDetailSlider">
                  <div className="room-slider-viewport">
                    {activeRoom.slides.map((src, idx) => (
                      <div key={idx} className={`room-slide ${slideIndex === idx ? 'active' : ''}`} data-index={idx}>
                        <div className="room-slide-bg-blur" style={{ backgroundImage: `url('${src}')` }}></div>
                        <div className="room-slide-bg" style={{ backgroundImage: `url('${src}')` }}></div>
                        <div className="room-slide-overlay"></div>
                      </div>
                    ))}
                  </div>

                  <div className="gallery-3d-light-sweep"></div>
                  <div className="gallery-3d-vignette"></div>

                  {/* 3D Arrow Navigation Controls (only if slides count > 1) */}
                  {activeRoom.slides.length > 1 && (
                    <>
                      <button type="button" className="gallery-3d-arrow gallery-prev room-prev" onClick={() => setSlideIndex(prev => (prev - 1 + activeRoom.slides.length) % activeRoom.slides.length)} aria-label="Previous Slide">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      <button type="button" className="gallery-3d-arrow gallery-next room-next" onClick={() => setSlideIndex(prev => (prev + 1) % activeRoom.slides.length)} aria-label="Next Slide">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                      </button>

                      {/* Slider Dots */}
                      <div className="gallery-3d-controls" style={{ bottom: '14px' }}>
                        <div className="gallery-3d-dots" id="roomDetailDots">
                          {activeRoom.slides.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className={`gallery-dot ${slideIndex === idx ? 'active' : ''}`}
                              onClick={() => setSlideIndex(idx)}
                            >
                              <span>0{idx + 1}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Right Box: Check Availability Form Box */}
                <div className="check-availability-box">
                  <div className="box-header">
                    <h3>CHECK AVAILABILITY</h3>
                  </div>

                  {roomCode !== 'banquet-hall' ? (
                    <div id="bookingFormFields">
                      <div className="field" style={{ marginBottom: '10px' }}>
                        <label htmlFor="guestName">GUEST FULL NAME</label>
                        <input
                          type="text"
                          id="guestName"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Enter guest name"
                        />
                      </div>

                      <div className="field-row" style={{ marginBottom: '10px' }}>
                        <div className="field">
                          <label htmlFor="guestPhone">PHONE NUMBER</label>
                          <input
                            type="tel"
                            id="guestPhone"
                            required
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="guestEmail">EMAIL ADDRESS</label>
                          <input
                            type="email"
                            id="guestEmail"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>

                      <div className="field-row" style={{ marginBottom: '10px' }}>
                        <div className="field">
                          <label htmlFor="checkIn">CHECK IN DATE</label>
                          <input
                            type="date"
                            id="checkIn"
                            required
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="checkOut">CHECK OUT DATE</label>
                          <input
                            type="date"
                            id="checkOut"
                            required
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={getMinCheckOut()}
                          />
                        </div>
                      </div>

                      <div className="field-row" id="guestsRow" style={{ marginBottom: '10px' }}>
                        <div className="field">
                          <label htmlFor="adults">NO. OF ADULTS</label>
                          <select id="adults" value={adults} onChange={(e) => setAdults(e.target.value)}>
                            <option>1</option><option>2</option><option>3</option><option>4</option>
                          </select>
                        </div>
                        <div className="field">
                          <label htmlFor="children">NO. OF CHILDREN'S</label>
                          <select id="children" value={children} onChange={(e) => setChildren(e.target.value)}>
                            <option>0</option><option>1</option><option>2</option><option>3</option>
                          </select>
                        </div>
                      </div>

                      <select id="roomSelect" value={roomCode} onChange={handleRoomSelectChange} style={{ display: 'none' }}>
                        <option value="premier">Premier Suite — ₹3,600/night</option>
                        <option value="executive-single">Executive Single — ₹2,400/night</option>
                        <option value="standard-double">Standard Double — ₹2,200/night</option>
                        <option value="executive-double">Executive Double — ₹2,600/night</option>
                        <option value="standard-single">Standard Single — ₹2,000/night</option>
                        <option value="banquet-hall">Banquet Hall — Contact Hotel</option>
                      </select>
                    </div>
                  ) : (
                    <div id="banquetContactNotice" style={{ padding: '30px 15px', background: 'rgba(110, 16, 39, 0.03)', border: '1px dashed rgba(110, 16, 39, 0.2)', borderRadius: '8px', textAlign: 'center' }}>
                      <p style={{ fontSize: '1.15rem', lineHeight: '1.6', color: 'var(--maroon)', fontWeight: '600', marginBottom: '15px' }}>
                        To book the Banquet Hall, please contact the hotel directly:
                      </p>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: '700', color: 'var(--maroon)', marginBottom: '15px' }}>
                        <a href="tel:+917874050009" style={{ color: 'inherit', textDecoration: 'none' }}>+91 78740 50009</a>
                      </div>
                      <p style={{ fontSize: '0.92rem', color: '#5c534b', lineHeight: '1.5', margin: 0 }}>
                        Our dedicated events team will assist you with custom quotes, capacity setups, and layout planning.
                      </p>
                      <div className="field" style={{ marginTop: '20px', textAlign: 'left' }}>
                        <label htmlFor="roomSelect">SELECT ROOM TYPE</label>
                        <select id="roomSelect" value={roomCode} onChange={handleRoomSelectChange} style={{ background: 'var(--white)', border: '1px solid rgba(20,9,12,0.12)', height: '42px', padding: '0 12px', fontSize: '0.9rem', width: '100%', outline: 'none' }}>
                          <option value="premier">Premier Suite — ₹3,600/night</option>
                          <option value="executive-single">Executive Single — ₹2,400/night</option>
                          <option value="standard-double">Standard Double — ₹2,200/night</option>
                          <option value="executive-double">Executive Double — ₹2,600/night</option>
                          <option value="standard-single">Standard Single — ₹2,000/night</option>
                          <option value="banquet-hall">Banquet Hall — Contact Hotel</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* ROW 2: ROOM TITLE & PRICE */}
              {roomCode !== 'banquet-hall' && (
                <div className="booking-bottom-row">
                  <div className="room-title-price-block">
                    <h3>{activeRoom.name}</h3>
                    <div className="price-line">
                      <strong>{activeRoom.price}</strong>
                      <span id="perNightLabel">/ NIGHT</span>
                    </div>
                    <p className="room-meta-sub">{activeRoom.meta}</p>
                  </div>

                  <div className="book-action-block">
                    <div className="mini-summary">
                      <span>{nights} night{nights === 1 ? '' : 's'}</span> • 
                      <span> {activeRoom.name}</span> • 
                      <span>Estimated Total: </span>
                      <strong>₹{estimatedTotal.toLocaleString('en-IN')}</strong>
                    </div>
                    <button type="submit" className="btn btn-gold btn-block book-now-separate-btn">BOOK NOW</button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div id="bookingConfirmation" className="booking-confirmation">
              <div className="confirmation-card">
                <div className="confirmation-check">✓</div>
                <h3>Booking Confirmed</h3>
                <p>A printable invoice has been generated below. Thank you for choosing Hotel Shree Daan.</p>

                <div className="invoice" id="invoice">
                  <div className="invoice-head">
                    <img src="/assets/images/logo-sticky.png" alt="Hotel Shree Daan" className="invoice-logo" />
                    <div>
                      <strong>Shree Daan Hotel</strong>
                      <span>Booking Invoice</span>
                    </div>
                  </div>
                  <div className="invoice-row"><span>Booking ID</span><span>{confirmedBooking.id}</span></div>
                  <div className="invoice-row"><span>Guest Name</span><span>{confirmedBooking.name}</span></div>
                  <div className="invoice-row"><span>Room Type</span><span>{confirmedBooking.roomType}</span></div>
                  <div className="invoice-row"><span>Check-in</span><span>{confirmedBooking.checkInFormatted}</span></div>
                  <div className="invoice-row"><span>Check-out</span><span>{confirmedBooking.checkOutFormatted}</span></div>
                  <div className="invoice-row"><span>Guests</span><span>{confirmedBooking.adults} Adults, {confirmedBooking.children} Children</span></div>
                  <div className="invoice-row"><span>Nights</span><span>{confirmedBooking.nights}</span></div>
                  <div className="invoice-row invoice-total"><span>Total Amount</span><span>₹{confirmedBooking.total.toLocaleString('en-IN')}</span></div>
                  <div className="invoice-row"><span>Payment Status</span><span className="badge badge--pending">Pending</span></div>
                  <div className="invoice-row"><span>Booking Status</span><span className="badge badge--confirmed">Confirmed</span></div>
                </div>

                <div className="confirmation-actions">
                  <button className="btn btn-ghost" onClick={handlePrint}>Print Invoice</button>
                  <button className="btn btn-gold" onClick={resetForm}>Make Another Booking</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== ROOM FEATURES / SPECIFICATIONS SECTION ===== */}
      {roomCode !== 'banquet-hall' && activeRoom.featuresTitle && (
        <section className="room-features-section" id="roomFeaturesSection">
          <div className="room-features-container">
            <div className="features-premium-header">
              <div className="features-eyebrow">
                <span className="badge-sparkle">✦</span> LUXURY AMENITIES &amp; SPECIFICATIONS <span className="badge-sparkle">✦</span>
              </div>
              <h3 className="room-features-title">
                {activeRoom.name.toUpperCase()} ROOM'S / <span className="gold-text">FEATURES</span>
              </h3>
              <div className="features-title-divider">
                <span className="divider-line"></span>
                <span className="divider-diamond">✦</span>
                <span className="divider-line"></span>
              </div>
            </div>

            <div className="features-open-grid" id="displayRoomFeaturesGrid">
              {activeRoom.features.map((feat, idx) => (
                <div key={idx} className="feature-line-item">
                  <span className="feature-bullet">▶</span>
                  <span className="feature-text">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== KINDLY NOTE SECTION (ONLY FOR STANDARD DOUBLE ROOM) ===== */}
      {roomCode === 'standard-double' && (
        <section className="kindly-note-section" id="kindlyNoteSection">
          <div className="kindly-note-container">
            <div className="features-premium-header">
              <div className="features-eyebrow">
                <span className="badge-sparkle">✦</span> IMPORTANT HOTEL POLICIES <span className="badge-sparkle">✦</span>
              </div>
              <h3 className="room-features-title">KINDLY <span className="gold-text">NOTE</span></h3>
              <div className="features-title-divider">
                <span className="divider-line"></span>
                <span className="divider-diamond">✦</span>
                <span className="divider-line"></span>
              </div>
            </div>

            <div className="note-open-list" id="kindlyNoteList">
              <div className="note-line-item">
                <span className="note-check-icon">✓</span>
                <span className="note-text">RATES ARE INCLUSIVE OF BREAKFAST AND NEWSPAPER.</span>
              </div>
              <div className="note-line-item">
                <span className="note-check-icon">✓</span>
                <span className="note-text">RATES ARE EXCLUSIVE OF APPLICABLE GOVT. TAXES.</span>
              </div>
              <div className="note-line-item">
                <span className="note-check-icon">✓</span>
                <span className="note-text">MASTER / VISA CARDS ACCEPTED.</span>
              </div>
              <div className="note-line-item">
                <span className="note-check-icon">✓</span>
                <span className="note-text">TARIFF &amp; TAXES ARE SUBJECT TO CHANGE WITHOUT PRIOR NOTICE.</span>
              </div>
              <div className="note-line-item">
                <span className="note-check-icon">✓</span>
                <span className="note-text">CHECK-IN TIME 12.00 NOON CHECK-OUT TIME IS 11.00 AM.</span>
              </div>
              <div className="note-line-item">
                <span className="note-check-icon">✓</span>
                <span className="note-text">OUTSIDE FOOD &amp; DRINKS NOT ALLOWED.</span>
              </div>
              <div className="note-line-item">
                <span className="note-check-icon">✓</span>
                <span className="note-text">INDIAN NATIONALS/CITIZENS ARE REQUESTED TO SUBMIT A COPY OF PHOTO-ID AT THE TIME OF CHECK-IN.</span>
              </div>
              <div className="note-line-item">
                <span className="note-check-icon">✓</span>
                <span className="note-text">FOREIGN NATIONALS/CITIZENS ARE REQUESTED TO SUBMIT A COPY OF PASSPORT AT THE TIME OF CHECK-IN.</span>
              </div>
              <div className="note-line-item">
                <span className="note-check-icon">✓</span>
                <span className="note-text">RIGHTS OF ADMISSION RESERVED.</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
