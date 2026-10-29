import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { roomData, ROOMS } from '../data/roomsData';
import { createRoomBooking } from '../api';

const BOOKING_HERO_IMAGES = [
  '/assets/images/hero-rooms-1.jpg',
  '/assets/images/hero-rooms-2.jpg',
  '/assets/images/hero-booking-3.jpg'
];

const WHATSAPP_NUMBER = '918698988034';
const FRONT_DESK_PHONE = '+91 86989 88034';
const EXTRA_PERSON_RATE = 450;

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
  const [childrenAbove10, setChildrenAbove10] = useState('0');
  const [childrenUpTo10, setChildrenUpTo10] = useState('0');
  const [hasPet, setHasPet] = useState(false);

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

  // Total Guests & Extra Person Calculation
  // Max 3 Guests per room
  // Children up to 10 years stay complimentary (free)
  // Guests / Children above 10 years are charged ₹450/night extra for 3rd person
  const numAdults = parseInt(adults, 10);
  const numAbove10 = parseInt(childrenAbove10, 10);
  const numUpTo10 = parseInt(childrenUpTo10, 10);

  const totalGuests = numAdults + numAbove10 + numUpTo10;
  const totalChildren = numAbove10 + numUpTo10;

  // Chargeable persons (Adults + Children Above 10 Yrs). Standard room tariff covers up to 2.
  const chargeablePersons = numAdults + numAbove10;
  const extraGuests = Math.max(0, chargeablePersons - 2);
  const extraPersonTotal = roomCode === 'banquet-hall' ? 0 : (extraGuests * EXTRA_PERSON_RATE * nights);
  const roomBaseTotal = roomCode === 'banquet-hall' ? 0 : (nights * priceNumber);
  const estimatedTotal = roomCode === 'banquet-hall' ? 0 : (roomBaseTotal + extraPersonTotal);

  // Maximum allowed counts dynamically calculated for selects
  const maxAllowedAbove10 = Math.max(0, 3 - numAdults - numUpTo10);
  const maxAllowedUpTo10 = Math.max(0, 3 - numAdults - numAbove10);

  // Handle Adult changes with Max 3 Person constraint
  const handleAdultsChange = (e) => {
    const newAdults = parseInt(e.target.value, 10);
    setAdults(e.target.value);
    const maxRemaining = 3 - newAdults;
    if (numAbove10 + numUpTo10 > maxRemaining) {
      if (numAbove10 > maxRemaining) {
        setChildrenAbove10(String(maxRemaining));
        setChildrenUpTo10('0');
      } else {
        setChildrenUpTo10(String(maxRemaining - numAbove10));
      }
    }
  };

  // Handle Children Above 10 Yrs changes
  const handleChildrenAbove10Change = (e) => {
    const newAbove = parseInt(e.target.value, 10);
    const maxAllowed = 3 - numAdults - numUpTo10;
    if (newAbove > maxAllowed) {
      const adjustedUpTo10 = Math.max(0, 3 - numAdults - newAbove);
      setChildrenUpTo10(String(adjustedUpTo10));
    }
    setChildrenAbove10(e.target.value);
  };

  // Handle Children Up to 10 Yrs (Free) changes
  const handleChildrenUpTo10Change = (e) => {
    const newUpTo = parseInt(e.target.value, 10);
    const maxAllowed = 3 - numAdults - numAbove10;
    if (newUpTo > maxAllowed) {
      const adjustedAbove10 = Math.max(0, 3 - numAdults - newUpTo);
      setChildrenAbove10(String(adjustedAbove10));
    }
    setChildrenUpTo10(e.target.value);
  };

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

  // WhatsApp Message Generator with customer booking details
  const getWhatsAppBookingUrl = (booking) => {
    if (!booking) return '';
    const occupantParts = [`${booking.adults} Adult${booking.adults > 1 ? 's' : ''}`];
    if (booking.childrenAbove10 > 0) occupantParts.push(`${booking.childrenAbove10} Child (Above 10 Yrs - ₹450/n)`);
    if (booking.childrenUpTo10 > 0) occupantParts.push(`${booking.childrenUpTo10} Child (Up to 10 Yrs - Free)`);
    else if (booking.children > 0 && !booking.childrenAbove10 && !booking.childrenUpTo10) occupantParts.push(`${booking.children} Children`);

    const msgLines = [
      `*🏨 ROOM BOOKING DETAILS — HOTEL SHREE DAAN*`,
      `══════════════════════════`,
      `*📌 Booking ID:* ${booking.id}`,
      `*👤 Guest Name:* ${booking.name}`,
      `*📞 Phone:* ${booking.phone}`,
      booking.email ? `*✉️ Email:* ${booking.email}` : null,
      `*🛏️ Room Type:* ${booking.roomType}`,
      `*📅 Check-In:* ${booking.checkInFormatted} (12:00 PM)`,
      `*📅 Check-Out:* ${booking.checkOutFormatted} (11:00 AM)`,
      `*🌙 Total Stay:* ${booking.nights} Night${booking.nights > 1 ? 's' : ''}`,
      `*👥 Occupancy:* ${occupantParts.join(', ')} (Max 3 Allowed)`,
      `*🐾 Pet Friendly:* ${booking.hasPet ? 'Yes (Traveling with Pet 🐾)' : 'Yes (Pet-Friendly Stay)'}`,
      `*👶 Child Policy:* Up to 10 Yrs Free • Above 10 Yrs ₹450/night`,
      `──────────────────────────`,
      `*💵 Base Room Rate:* ₹${(booking.roomBaseTotal || 0).toLocaleString('en-IN')}`,
      booking.extraPersonTotal > 0 ? `*➕ Extra Person Charge (Above 10 Yrs @ ₹450/night):* ₹${booking.extraPersonTotal.toLocaleString('en-IN')}` : null,
      `*💰 Total Amount:* ₹${booking.total.toLocaleString('en-IN')}`,
      `*💳 Payment:* Pay at Hotel Check-in`,
      `══════════════════════════`,
      `*⚠️ NOTE: Phone call is compulsory to confirm this booking.*`,
      `*Front Desk:* ${FRONT_DESK_PHONE}`
    ].filter(Boolean);

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msgLines.join('\n'))}`;
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
      adults: numAdults,
      children: totalChildren,
      childrenAbove10: numAbove10,
      childrenUpTo10: numUpTo10,
      totalGuests: totalGuests,
      hasPet: hasPet,
      nights: nights,
      priceNumber: priceNumber,
      roomBaseTotal: roomBaseTotal,
      extraGuests: extraGuests,
      extraPersonTotal: extraPersonTotal,
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
    setHasPet(false);
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
    setCheckIn(tomorrow.toISOString().split('T')[0]);
    setCheckOut(dayAfter.toISOString().split('T')[0]);
    setAdults('2');
    setChildrenAbove10('0');
    setChildrenUpTo10('0');
  };

  // Scroll staggered cascading reveal animation for Room Features
  useEffect(() => {
    const gridEl = document.getElementById('displayRoomFeaturesGrid');
    if (!gridEl) return;

    const items = gridEl.querySelectorAll('.feature-line-item');
    if (!items.length) return;

    items.forEach(item => item.classList.remove('revealed'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach((item, index) => {
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
        
        <div className="section-head reveal-up in-view" style={{ marginBottom: '24px' }}>
          <p className="eyebrow">Book Your Stay</p>
          <h2>Check Availability &amp; Reserve</h2>
        </div>

        {/* COMPULSORY CALLING ALERT BANNER */}
        <div className="compulsory-call-banner reveal-up in-view">
          <div className="call-banner-left">
            <span className="call-banner-icon">📞</span>
            <div className="call-banner-info">
              <h4>CALLING IS COMPULSORY TO CONFIRM BOOKINGS</h4>
              <p>Prior phone call to front desk is mandatory for room and spa booking confirmation.</p>
            </div>
          </div>
          <a href="tel:+918698988034" className="btn btn-call-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call Front Desk: +91 86989 88034
          </a>
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

                  {/* 3D Arrow Navigation Controls */}
                  {activeRoom.slides.length > 1 && (
                    <>
                      <button type="button" className="gallery-3d-arrow gallery-prev room-prev" onClick={() => setSlideIndex(prev => (prev - 1 + activeRoom.slides.length) % activeRoom.slides.length)} aria-label="Previous Slide">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      <button type="button" className="gallery-3d-arrow gallery-next room-next" onClick={() => setSlideIndex(prev => (prev + 1) % activeRoom.slides.length)} aria-label="Next Slide">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
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

                      {/* GUESTS SELECTOR - MAXIMUM 3 PERSONS WITH CHILD POLICY */}
                      <div className="field-row" id="guestsRow" style={{ marginBottom: '8px' }}>
                        <div className="field">
                          <label htmlFor="adults">NO. OF ADULTS (MAX 3)</label>
                          <select id="adults" value={adults} onChange={handleAdultsChange}>
                            <option value="1">1 Adult</option>
                            <option value="2">2 Adults</option>
                            <option value="3">3 Adults (Max Capacity)</option>
                          </select>
                        </div>
                        <div className="field">
                          <label htmlFor="childrenAbove10">CHILDREN (ABOVE 10 YRS)</label>
                          <select id="childrenAbove10" value={childrenAbove10} onChange={handleChildrenAbove10Change}>
                            <option value="0">0 Child</option>
                            {maxAllowedAbove10 >= 1 && <option value="1">1 Child (+₹450/n extra)</option>}
                            {maxAllowedAbove10 >= 2 && <option value="2">2 Children (+₹450/n extra)</option>}
                          </select>
                        </div>
                      </div>

                      <div className="field" style={{ marginBottom: '10px' }}>
                        <label htmlFor="childrenUpTo10">CHILDREN (UP TO 10 YRS — COMPLIMENTARY / FREE)</label>
                        <select id="childrenUpTo10" value={childrenUpTo10} onChange={handleChildrenUpTo10Change}>
                          <option value="0">0 Child</option>
                          {maxAllowedUpTo10 >= 1 && <option value="1">1 Child (Free / Complimentary)</option>}
                          {maxAllowedUpTo10 >= 2 && <option value="2">2 Children (Free / Complimentary)</option>}
                        </select>
                      </div>

                      {/* Capacity & Child Policy Tag */}
                      <div className="guest-capacity-note" style={{ marginBottom: '12px' }}>
                        <span className="info-icon">👥</span>
                        <div className="info-text">
                          <strong>Max 3 Persons Per Room:</strong> Children <strong>up to 10 years stay complimentary</strong>. Guests &amp; children <strong>above 10 years</strong> charged <span className="extra-highlight">₹450 / night</span> extra.
                        </div>
                      </div>

                      {/* PET FRIENDLY SELECTION */}
                      <div className="pet-friendly-field" style={{ marginBottom: '12px' }}>
                        <label className="pet-checkbox-label">
                          <input
                            type="checkbox"
                            checked={hasPet}
                            onChange={(e) => setHasPet(e.target.checked)}
                          />
                          <span className="pet-custom-checkbox"></span>
                          <span className="pet-label-text">
                            🐾 <strong>Pet Friendly:</strong> Bringing a pet? (Pets are warmly welcome at Hotel Shree Daan)
                          </span>
                        </label>
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
                        <a href="tel:+918698988034" style={{ color: 'inherit', textDecoration: 'none' }}>+91 86989 88034</a>
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
                      {extraGuests > 0 && (
                        <span className="extra-tag">
                          + ₹{extraPersonTotal.toLocaleString('en-IN')} (Above 10 Yrs Extra) • 
                        </span>
                      )}
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
                
                {/* CALLING COMPULSORY & WHATSAPP ACTION HERO BANNER */}
                <div className="confirmation-calling-notice">
                  <div className="notice-header">
                    <span className="notice-icon">⚠️</span>
                    <div className="notice-text">
                      <h4>PHONE CALLING IS COMPULSORY TO CONFIRM BOOKING</h4>
                      <p>Your room booking request <strong>{confirmedBooking.id}</strong> is received. Please call our reception immediately to confirm your stay and send details via WhatsApp.</p>
                    </div>
                  </div>
                  <div className="notice-buttons-row">
                    <a href="tel:+918698988034" className="btn btn-call-primary">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Call Front Desk (+91 86989 88034)
                    </a>
                    <a 
                      href={getWhatsAppBookingUrl(confirmedBooking)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-whatsapp-primary"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                      Send Details to WhatsApp
                    </a>
                  </div>
                </div>

                <div className="invoice" id="invoice">
                  {/* 1. Official Header with Logo */}
                  <div className="invoice-header">
                    <div className="invoice-brand-col">
                      <img src="/assets/images/logo-sticky.png" alt="Hotel Shree Daan" className="invoice-logo" />
                    </div>
                    <div className="invoice-header-right">
                      <h4 className="invoice-main-heading">RESERVATION INVOICE</h4>
                      <p className="invoice-main-sub">Golden Sparsh Spa &amp; Luxury Stay</p>
                    </div>
                  </div>

                  <div className="invoice-banner">
                    <div className="invoice-voucher-title">BOOKING CONFIRMATION SUMMARY</div>
                    <div className="invoice-date-ref">
                      <span><strong>Invoice Date:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* 2. Grid Table for Details */}
                  <div className="invoice-grid-section">
                    <div className="invoice-col">
                      <h5>GUEST INFORMATION</h5>
                      <div className="invoice-row"><span>Guest Name:</span><strong>{confirmedBooking.name}</strong></div>
                      <div className="invoice-row"><span>Contact Phone:</span><span>{confirmedBooking.phone || 'N/A'}</span></div>
                      <div className="invoice-row"><span>Email Address:</span><span>{confirmedBooking.email || 'N/A'}</span></div>
                      <div className="invoice-row"><span>Booking Reference:</span><strong className="invoice-booking-id">{confirmedBooking.id}</strong></div>
                    </div>

                    <div className="invoice-col">
                      <h5>RESERVATION DETAILS</h5>
                      <div className="invoice-row"><span>Room Type:</span><strong>{confirmedBooking.roomType}</strong></div>
                      <div className="invoice-row"><span>Check-in Date:</span><span>{confirmedBooking.checkInFormatted} (12:00 PM)</span></div>
                      <div className="invoice-row"><span>Check-out Date:</span><span>{confirmedBooking.checkOutFormatted} (11:00 AM)</span></div>
                      <div className="invoice-row">
                        <span>Occupancy:</span>
                        <span>
                          {confirmedBooking.adults} Adults
                          {confirmedBooking.childrenAbove10 > 0 ? `, ${confirmedBooking.childrenAbove10} Child (Above 10 Yrs)` : ''}
                          {confirmedBooking.childrenUpTo10 > 0 ? `, ${confirmedBooking.childrenUpTo10} Child (Up to 10 Yrs - Free)` : ''}
                          {' '}(Total: {confirmedBooking.totalGuests} / Max 3)
                        </span>
                      </div>
                      <div className="invoice-row"><span>Pet Friendly Stay:</span><strong>{confirmedBooking.hasPet ? 'Yes, Traveling with Pet 🐾' : 'Yes (Pet-Friendly Hotel)'}</strong></div>
                      <div className="invoice-row"><span>Total Stay:</span><span>{confirmedBooking.nights} Night{confirmedBooking.nights > 1 ? 's' : ''}</span></div>
                    </div>
                  </div>

                  {/* 3. Summary & Payment Table */}
                  <div className="invoice-billing-table">
                    <div className="invoice-billing-head">
                      <span>DESCRIPTION</span>
                      <span>NIGHTS</span>
                      <span>RATE / NIGHT</span>
                      <span>AMOUNT</span>
                    </div>
                    
                    <div className="invoice-billing-row">
                      <span>{confirmedBooking.roomType} (Accommodation with Breakfast &amp; Wi-Fi)</span>
                      <span>{confirmedBooking.nights}</span>
                      <span>₹{priceNumber.toLocaleString('en-IN')}</span>
                      <span>₹{(confirmedBooking.roomBaseTotal || (confirmedBooking.nights * priceNumber)).toLocaleString('en-IN')}</span>
                    </div>

                    {confirmedBooking.extraGuests > 0 && (
                      <div className="invoice-billing-row extra-charge-row" style={{ color: 'var(--maroon)', fontWeight: '600' }}>
                        <span>Extra Person Charge (Guest Above 10 Yrs @ ₹450 / night)</span>
                        <span>{confirmedBooking.nights}</span>
                        <span>₹{EXTRA_PERSON_RATE}</span>
                        <span>₹{confirmedBooking.extraPersonTotal.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="invoice-billing-total">
                      <div className="invoice-total-row">
                        <span>Total Amount Payable:</span>
                        <strong>₹{confirmedBooking.total.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 4. Status Badges */}
                  <div className="invoice-status-row">
                    <div><span>Booking Status: </span><span className="badge badge--confirmed">Registered</span></div>
                    <div><span>Payment Status: </span><span className="badge badge--pending">Pay at Hotel Check-in</span></div>
                  </div>

                  {/* 5. Hotel Policies & Terms */}
                  <div className="invoice-policies">
                    <h6>IMPORTANT HOTEL POLICIES:</h6>
                    <ul>
                      <li><strong style={{ color: 'var(--maroon)' }}>Calling Compulsory:</strong> A direct phone call to +91 86989 88034 is mandatory to confirm room availability and guarantee your booking.</li>
                      <li><strong>Maximum Capacity &amp; Child Policy:</strong> Strictly up to 3 persons allowed per room. Children <strong>up to 10 years stay complimentary</strong>. Extra guests &amp; children <strong>above 10 years</strong> incur a ₹450/night charge.</li>
                      <li><strong>Pet Friendly Hotel:</strong> Pets are warmly welcome at Hotel Shree Daan. Please inform our front desk at check-in.</li>
                      <li>Standard Check-in time is 12:00 Noon and Check-out time is 11:00 AM.</li>
                      <li>All guests must present a valid government photo ID (Aadhaar / Passport / Driving License) at check-in.</li>
                      <li>Rates are inclusive of morning breakfast and high-speed Wi-Fi access.</li>
                    </ul>
                  </div>

                  {/* 6. Footer Note & Official Address */}
                  <div className="invoice-footer-sign">
                    <p>Thank you for choosing Hotel Shree Daan. We look forward to welcoming you!</p>
                    <div className="invoice-stamp-area">
                      <span>Authorized Reservation Desk</span>
                      <strong>Hotel Shree Daan &amp; Spa</strong>
                    </div>
                  </div>

                  <div className="invoice-footer-address-bar">
                    <p className="invoice-footer-address">
                      <strong>Hotel Shree Daan:</strong> Valsad Road, Balitha, N.H No.8, Vapi - 396 191, Gujarat, India
                    </p>
                    <p className="invoice-footer-contact">
                      <strong>Hotline / WhatsApp:</strong> +91 86989 88034 &nbsp;•&nbsp; <strong>Web:</strong> www.hotelshreedaan.com
                    </p>
                  </div>
                </div>

                <div className="confirmation-actions no-print">
                  <a 
                    href={getWhatsAppBookingUrl(confirmedBooking)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-whatsapp"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', textDecoration: 'none' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    Send to WhatsApp
                  </a>
                  <button className="btn btn-ghost" onClick={handlePrint}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Print / Download Invoice
                  </button>
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
              <div className="note-line-item" style={{ background: 'rgba(110, 16, 39, 0.08)', borderLeft: '3px solid var(--maroon)' }}>
                <span className="note-check-icon" style={{ color: 'var(--maroon)' }}>📞</span>
                <span className="note-text" style={{ fontWeight: '700', color: 'var(--maroon)' }}>PHONE CALLING IS COMPULSORY TO CONFIRM ALL ROOM AND SPA BOOKINGS (+91 86989 88034).</span>
              </div>
              <div className="note-line-item" style={{ background: 'rgba(201, 162, 39, 0.08)', borderLeft: '3px solid var(--gold)' }}>
                <span className="note-check-icon" style={{ color: 'var(--gold)' }}>🐾</span>
                <span className="note-text" style={{ fontWeight: '700' }}>PET FRIENDLY HOTEL — PETS ARE WARMLY WELCOMED.</span>
              </div>
              <div className="note-line-item">
                <span className="note-check-icon">✓</span>
                <span className="note-text">MAXIMUM CAPACITY IS 3 PERSONS PER ROOM.</span>
              </div>
              <div className="note-line-item" style={{ background: 'rgba(201, 162, 39, 0.08)' }}>
                <span className="note-check-icon" style={{ color: 'var(--gold)' }}>👶</span>
                <span className="note-text" style={{ fontWeight: '700' }}>CHILDREN UP TO 10 YEARS STAY COMPLIMENTARY (FREE OF CHARGE).</span>
              </div>
              <div className="note-line-item">
                <span className="note-check-icon">✓</span>
                <span className="note-text">GUESTS / CHILDREN ABOVE 10 YEARS: ₹450 / NIGHT EXTRA PERSON CHARGE (FOR 3RD GUEST).</span>
              </div>
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
