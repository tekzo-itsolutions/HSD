/* ==========================================================================
   SHREE DAAN HOTEL — APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. LOADER ---------- */
  (function loader() {
    const loaderEl = document.getElementById('loader');
    const pctEl = document.getElementById('loaderPct');
    const lineLeft = document.getElementById('loaderLineLeft');
    const lineRight = document.getElementById('loaderLineRight');
    if (!loaderEl || !pctEl) return;
    
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.floor(Math.random() * 12) + 4;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        setTimeout(() => {
          loaderEl.classList.add('loaded');
          document.body.style.overflow = '';
          playHeroReveal();
        }, 350);
      }
      pctEl.textContent = pct;
      if (lineLeft) lineLeft.style.width = (pct / 2) + '%';
      if (lineRight) lineRight.style.width = (pct / 2) + '%';
    }, 80);
    document.body.style.overflow = 'hidden';
  })();

  /* ---------- 2. CURSOR GLOW ---------- */
  (function cursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;
    let x = window.innerWidth / 2, y = window.innerHeight / 2, curX = x, curY = y;
    window.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
    function animate() {
      curX += (x - curX) * 0.12;
      curY += (y - curY) * 0.12;
      glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    }
    animate();
  })();

  /* ---------- 3. HEADER SCROLL & PAGE SOLID STATE ---------- */
  (function headerScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- 4. MOBILE MENU ---------- */
  (function mobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('nav a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        menu.classList.remove('open');
      });
    });

    const mobileBookBtn = document.getElementById('mobileBookBtn');
    if (mobileBookBtn) {
      mobileBookBtn.addEventListener('click', () => {
        toggle.classList.remove('open');
        menu.classList.remove('open');
        window.location.href = 'booking.html';
      });
    }
  })();

  /* ---------- 5. ACTIVE NAVIGATION SYNC ---------- */
  (function navActiveState() {
    const navLinks = document.querySelectorAll('#mainNav a, #mobileMenu nav a');
    const pathname = window.location.pathname;
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === filename || (filename === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  })();

  /* ---------- 6. SMOOTH SCROLL & CTA REDIRECTS ---------- */
  const navBookBtn = document.getElementById('navBookBtn');
  if (navBookBtn) {
    navBookBtn.addEventListener('click', () => {
      window.location.href = 'booking.html';
    });
  }

  const heroBookBtn = document.getElementById('heroBookBtn');
  if (heroBookBtn) {
    heroBookBtn.addEventListener('click', () => {
      window.location.href = 'booking.html';
    });
  }

  const heroExploreBtn = document.getElementById('heroExploreBtn');
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', () => {
      window.location.href = 'rooms.html';
    });
  }

  const spaBookBtn = document.getElementById('spaBookBtn');
  if (spaBookBtn) {
    spaBookBtn.addEventListener('click', () => {
      window.location.href = 'booking.html';
    });
  }

  /* ---------- 7. HERO VIDEO SLIDER (Home Page Only) ---------- */
  (function heroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-slide-dots .dot');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    const heroSection = document.getElementById('hero');
    
    if (!slides.length) return;
    
    let index = 0;
    let timer;
    let isHovered = false;

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
      },
      {
        title: "Luxury You Deserve. Hospitality You Remember.",
        desc: "Experience elegant stays, modern comfort, and warm hospitality—creating unforgettable moments every time you stay with us."
      }
    ];

    function go(i) {
      slides[index].classList.remove('active');
      if (dots[index]) dots[index].classList.remove('active');
      index = i;
      slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
      
      const video = slides[index].querySelector('.hero-video');
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }

      // Dynamic text conditions update
      const titleEl = document.getElementById('heroTitle');
      const descEl = document.getElementById('heroDesc');
      const innerEl = document.querySelector('.hero-content-inner');
      if (innerEl && titleEl && descEl) {
        innerEl.classList.remove('active');
        setTimeout(() => {
          const condition = HERO_CONDITIONS[i] || HERO_CONDITIONS[0];
          titleEl.innerHTML = condition.title;
          descEl.innerHTML = condition.desc;
          innerEl.classList.add('active');
        }, 400);
      }
    }
    
    function nextSlide() { 
      go((index + 1) % slides.length); 
    }
    
    function prevSlide() {
      go((index - 1 + slides.length) % slides.length);
    }

    function startAutoplay() {
      clearInterval(timer);
      timer = setInterval(() => {
        nextSlide();
      }, 6000);
    }

    if (dots.length) {
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { go(i); startAutoplay(); });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
    }

    startAutoplay();
  })();

  /* ---------- 7b. VIDEO FALLBACKS ---------- */
  (function videoFallback() {
    document.querySelectorAll('.hero-video, .about-banner-video').forEach(video => {
      const container = video.classList.contains('hero-video')
        ? video.closest('.hero-slide')
        : video.closest('.about-banner');
      
      video.addEventListener('canplay', () => {
        video.classList.add('is-playing');
        container?.classList.add('has-video');
      });
      
      video.addEventListener('error', () => {
        container?.classList.remove('has-video');
        video.remove();
      }, true);
      
      video.play().catch(() => {});
    });
  })();

  /* ---------- 8. HERO PARTICLES ---------- */
  (function particles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particlesArr;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    function makeParticles() {
      const count = window.innerWidth < 700 ? 22 : 45;
      particlesArr = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        speedY: Math.random() * 0.4 + 0.1,
        drift: Math.random() * 0.3 - 0.15,
        alpha: Math.random() * 0.5 + 0.15
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particlesArr.forEach(p => {
        p.y -= p.speedY;
        p.x += p.drift;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 199, 102, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', () => { resize(); makeParticles(); });
    resize(); makeParticles(); draw();
  })();

  /* ---------- 9. HERO LOAD-IN REVEAL ---------- */
  window.playHeroReveal = function () {
    const items = document.querySelectorAll('#hero .reveal-up');
    items.forEach((el, i) => {
      setTimeout(() => el.classList.add('in-view'), 150 + i * 160);
    });
  };

  /* ---------- 10. SCROLL REVEAL (IntersectionObserver) ---------- */
  (function scrollReveal() {
    const targets = document.querySelectorAll('.reveal-up:not(#hero .reveal-up)');
    if (!targets.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(t => io.observe(t));
  })();

  /* ---------- 11. ANIMATED COUNTERS ---------- */
  (function counters() {
    const stats = document.querySelectorAll('[data-count]');
    if (!stats.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1600;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    stats.forEach(s => io.observe(s));
  })();

  /* ---------- 12. ROOMS DATA & RENDER ---------- */
  const ROOMS = [
    {
      id: 'premier', name: 'Premier Suite', price: 3600, rating: 4.8,
      image: '../assets/images/test_rooms/shree premier suite 1.jpg',
      gradient: 'radial-gradient(ellipse at 60% 40%, #6E1027, #2c0813 60%, #14090C)',
      facilities: ['Living Area', 'Balcony', 'Mini Bar', 'Bathtub']
    },
    {
      id: 'executive-single', name: 'Executive Single', price: 2400, rating: 4.6,
      image: '../assets/images/test_rooms/executive.jpg',
      gradient: 'radial-gradient(ellipse at 40% 40%, #8a5a1f, #57332a 55%, #14090C)',
      facilities: ['City View', 'Workspace', 'Smart TV', 'Mini Bar']
    },
    {
      id: 'standard-double', name: 'Standard Double', price: 2200, rating: 4.5,
      image: '../assets/images/test_rooms/standard-double.jpg',
      gradient: 'radial-gradient(ellipse at 30% 30%, #8a5a1f, #3d270e 60%, #14090C)',
      facilities: ['King Bed', 'City View', 'Free WiFi', 'Breakfast']
    },
    {
      id: 'executive-double', name: 'Executive Double', price: 2600, rating: 4.7,
      image: '../assets/images/test_rooms/executive-double.jpg',
      gradient: 'radial-gradient(ellipse at 40% 50%, #3f5240, #1c261d 60%, #14090C)',
      facilities: ['Courtyard View', 'Private Lounge', 'Butler Service', 'Spa Access']
    },
    {
      id: 'standard-single', name: 'Standard Single', price: 2000, rating: 4.4,
      image: '../assets/images/test_rooms/standard-single.jpg',
      gradient: 'radial-gradient(ellipse at 40% 40%, #81523a, #3d1811 60%, #14090C)',
      facilities: ['Private Balcony', 'Jacuzzi', 'Dining Area', 'Personal Butler']
    },
    {
      id: 'banquet-hall', name: 'Banquet Hall', price: 4000, rating: 4.9,
      image: '../assets/images/test_rooms/shree Bord Rooms 1.jpg',
      facilities: ['300 PAX Capacity', 'Advanced AV System', 'Gourmet Catering', 'Centralized A/C']
    }
  ];

  (function renderRooms() {
    const track = document.getElementById('roomsTrack');
    const roomsGridEl = document.getElementById('roomsGrid');
    
    if (!track && !roomsGridEl) return;
    
    const targetElement = track || roomsGridEl;
    const isGrid = !!roomsGridEl;

    targetElement.innerHTML = ROOMS.map(r => `
      <div class="room-card reveal-up in-view">
        <div class="room-image-wrap">
          <div class="room-image">
            <div class="room-bg" style="position:absolute;inset:0;background:${r.image ? `url('${r.image}') center/cover no-repeat` : r.gradient};"></div>
          </div>
          <span class="room-rating">★ ${r.rating}</span>
        </div>
        <div class="room-body">
          <h3>${r.name}</h3>
          <p class="room-price">₹${r.price.toLocaleString('en-IN')} <span>/ night</span></p>
          <div class="room-facilities">${r.facilities.map(f => `<span>${f}</span>`).join('')}</div>
          <button class="btn btn-gold" data-room="${r.id}">Book Now</button>
        </div>
      </div>
    `).join('');

    // Dynamic 3D mouse tilt interaction
    targetElement.querySelectorAll('.room-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((centerY - y) / centerY) * 12; // tilt max 12 degrees
        const rotateY = ((x - centerX) / centerX) * 12;
        
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0deg)';
      });
    });

    targetElement.querySelectorAll('[data-room]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = `booking.html?room=${btn.dataset.room}`;
      });
    });
  })();

  /* ---------- 12B. SPA GRID DYNAMIC RENDERING ---------- */
  const SPA_CATEGORIES = [
    {
      id: 'body-scrub', name: 'Body Scrub', price: 1000, rating: 4.8,
      image: '../assets/images/spa_body_scrub.jpg',
      gradient: 'radial-gradient(ellipse at 40% 40%, #8a5a1f, #57332a 55%, #14090C)',
      facilities: ['Natural Scrub', 'De-Tan Scrub', 'Fruit Exfoliator', 'Turmeric Ubtan']
    },
    {
      id: 'bath-therapy', name: 'Luxury Bath Therapy', price: 6000, rating: 4.9,
      image: '../assets/images/spa_luxury_bath.jpg',
      gradient: 'radial-gradient(ellipse at 30% 30%, #8a5a1f, #3d270e 60%, #14090C)',
      facilities: ['Turkish Hammam', 'Signature Jacuzzi', 'Aromatic Flower Bath']
    },
    {
      id: 'rejuvenate', name: 'Rejuvenate', price: 3000, rating: 4.9,
      image: '../assets/images/spa_rejuvenate.jpg',
      gradient: 'radial-gradient(ellipse at 40% 50%, #3f5240, #1c261d 60%, #14090C)',
      facilities: ['Couple Connect', 'Pizhichil Therapy', 'Royal Milk Bath']
    },
    {
      id: 'body-therapy', name: 'Body Therapy', price: 2000, rating: 4.8,
      image: '../assets/images/spa_body_therapy.jpg',
      gradient: 'radial-gradient(ellipse at 40% 40%, #81523a, #3d1811 60%, #14090C)',
      facilities: ['Deep Tissue', 'Aroma Healing', 'Swedish Massage', 'Balinese Massage']
    },
    {
      id: 'ayurveda', name: 'Ayurveda', price: 1200, rating: 4.9,
      image: '../assets/images/spa_ayurveda.jpg',
      gradient: 'radial-gradient(ellipse at 50% 30%, #C9A227, #4A0A1A 55%, #14090C)',
      facilities: ['Traditional Shirodhara', 'Herbal Pouch', 'Hasta-Padbhyangam']
    },
    {
      id: 'spa-packages', name: 'Spa Packages & Escapes', price: 3500, rating: 5.0,
      image: '../assets/images/spa_packages.jpg',
      gradient: 'radial-gradient(ellipse at 40% 40%, #8a5a1f, #57332a 55%, #14090C)',
      facilities: ['Space Aakash Escape', 'Fire Tejas Escape', 'Water Jal Escape', 'Earth Ira Escape']
    },
    {
      id: 'facial-therapy', name: 'Facial Therapy', price: 800, rating: 4.7,
      image: '../assets/images/spa_facial.jpg',
      gradient: 'radial-gradient(ellipse at 30% 30%, #8a5a1f, #3d270e 60%, #14090C)',
      facilities: ['Gold Radiance', 'Diamond Firming', 'Charcoal Detox', 'Berries Hydration']
    }
  ];

  (function renderSpa() {
    const spaGridEl = document.getElementById('spaGrid');
    if (!spaGridEl) return;

    spaGridEl.innerHTML = SPA_CATEGORIES.map(s => `
      <div class="room-card reveal-up in-view" style="flex: 0 0 350px;">
        <div class="room-image-wrap">
          <div class="room-image">
            <div class="room-bg" style="position:absolute;inset:0;background:${s.image ? `url('${s.image}') center/cover no-repeat` : s.gradient};"></div>
          </div>
          <span class="room-rating">★ ${s.rating}</span>
        </div>
        <div class="room-body">
          <h3>${s.name}</h3>
          <p class="room-price">From ₹${s.price.toLocaleString('en-IN')}</p>
          <div class="room-facilities">${s.facilities.map(f => `<span>${f}</span>`).join('')}</div>
          <button class="btn btn-gold" data-spa="${s.id}" style="width: 100%;">Explore Treatments</button>
        </div>
      </div>
    `).join('');

    // Dynamic 3D mouse tilt interaction (matching rooms card tilt)
    spaGridEl.querySelectorAll('.room-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((centerY - y) / centerY) * 12;
        const rotateY = ((x - centerX) / centerX) * 12;
        
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0deg)';
      });
    });

    // Redirect to spa details page with hash anchor
    spaGridEl.querySelectorAll('[data-spa]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = `spa-details.html#${btn.dataset.spa}`;
      });
    });
  })();

  /* ---------- 13. BOOKING ENGINE ---------- */
  const checkInEl = document.getElementById('checkIn');
  const checkOutEl = document.getElementById('checkOut');
  const adultsEl = document.getElementById('adults');
  const childrenEl = document.getElementById('children');
  const roomTypeEl = document.getElementById('roomType');
  const summaryNights = document.getElementById('summaryNights');
  const summaryRoom = document.getElementById('summaryRoom');
  const summaryTotal = document.getElementById('summaryTotal');

  if (checkInEl && checkOutEl && roomTypeEl) {
    // Set sensible default dates
    (function initDates() {
      const today = new Date();
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
      const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
      checkInEl.min = today.toISOString().split('T')[0];
      checkInEl.value = tomorrow.toISOString().split('T')[0];
      checkOutEl.min = dayAfter.toISOString().split('T')[0];
      checkOutEl.value = dayAfter.toISOString().split('T')[0];
    })();

    // Check for query parameter selection
    (function checkQueryParam() {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      if (roomParam) {
        // Find matching option
        for (let i = 0; i < roomTypeEl.options.length; i++) {
          if (roomTypeEl.options[i].value === roomParam) {
            roomTypeEl.selectedIndex = i;
            break;
          }
        }
      }
    })();

    function nightsBetween() {
      const inDate = new Date(checkInEl.value);
      const outDate = new Date(checkOutEl.value);
      const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    }

    function updateBookingSummary() {
      const nights = nightsBetween();
      const selectedOption = roomTypeEl.options[roomTypeEl.selectedIndex];
      if (!selectedOption) return;
      
      const price = parseInt(selectedOption.dataset.price, 10);
      const total = nights * price;

      if (summaryNights) summaryNights.textContent = `${nights} night${nights === 1 ? '' : 's'}`;
      if (summaryRoom) summaryRoom.textContent = selectedOption.textContent.split(' — ')[0];
      if (summaryTotal) summaryTotal.textContent = `₹${total.toLocaleString('en-IN')}`;

      // Dynamically toggle Adults/Children field row for Banquet Hall
      const guestsRow = document.getElementById('guestsRow');
      if (guestsRow) {
        if (roomTypeEl.value === 'banquet-hall') {
          guestsRow.style.display = 'none';
        } else {
          guestsRow.style.display = '';
        }
      }

      // Keep checkout min a day after checkin
      if (checkInEl.value) {
        const inDate = new Date(checkInEl.value);
        const minOut = new Date(inDate); minOut.setDate(inDate.getDate() + 1);
        checkOutEl.min = minOut.toISOString().split('T')[0];
        if (new Date(checkOutEl.value) <= inDate) {
          checkOutEl.value = minOut.toISOString().split('T')[0];
        }
      }
    }
    
    [checkInEl, checkOutEl, roomTypeEl, adultsEl, childrenEl].filter(Boolean).forEach(el => {
      el.addEventListener('change', updateBookingSummary);
    });
    updateBookingSummary();
  }

  /* ---------- 14. BOOKING SUBMISSION -> INVOICE & LOCALSTORAGE ---------- */
  const bookingForm = document.getElementById('bookingForm');
  const bookingConfirmation = document.getElementById('bookingConfirmation');

  if (bookingForm && bookingConfirmation) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nights = nightsBetween();
      if (nights <= 0) {
        alert('Please select a valid check-out date after your check-in date.');
        return;
      }

      const guestNameInput = document.getElementById('guestName');
      const guestPhoneInput = document.getElementById('guestPhone');
      const guestEmailInput = document.getElementById('guestEmail');

      const guestName = guestNameInput ? guestNameInput.value.trim() : 'Guest';
      const guestPhone = guestPhoneInput ? guestPhoneInput.value.trim() : '';
      const guestEmail = guestEmailInput ? guestEmailInput.value.trim() : '';

      const selectedOption = roomTypeEl.options[roomTypeEl.selectedIndex];
      const roomTypeName = selectedOption.textContent.split(' — ')[0];
      const price = parseInt(selectedOption.dataset.price, 10);
      const total = nights * price;
      const bookingId = 'SD' + Date.now().toString().slice(-8);

      document.getElementById('invBookingId').textContent = bookingId;
      document.getElementById('invGuestName').textContent = guestName || 'Guest';
      document.getElementById('invRoomType').textContent = roomTypeName;
      document.getElementById('invCheckIn').textContent = formatDate(checkInEl.value);
      document.getElementById('invCheckOut').textContent = formatDate(checkOutEl.value);
      document.getElementById('invGuests').textContent = `${adultsEl.value} Adult${adultsEl.value > 1 ? 's' : ''}, ${childrenEl.value} Child${childrenEl.value == 1 ? '' : 'ren'}`;
      document.getElementById('invNights').textContent = nights;
      document.getElementById('invTotal').textContent = `₹${total.toLocaleString('en-IN')}`;

      // Save to LocalStorage for Admin Panel
      try {
        const existingBookings = JSON.parse(localStorage.getItem('hsd_room_bookings')) || [];
        existingBookings.unshift({
          id: bookingId,
          name: guestName || 'Guest',
          phone: guestPhone,
          email: guestEmail,
          roomType: roomTypeName,
          roomCode: roomTypeEl.value,
          checkIn: checkInEl.value,
          checkOut: checkOutEl.value,
          adults: parseInt(adultsEl.value, 10),
          children: parseInt(childrenEl.value, 10),
          nights: nights,
          total: total,
          status: 'confirmed',
          payStatus: 'Pending',
          dateCreated: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('hsd_room_bookings', JSON.stringify(existingBookings));
      } catch(err) {
        console.error('Error saving room booking:', err);
      }

      bookingForm.classList.add('hidden');
      bookingConfirmation.classList.remove('hidden');
      bookingConfirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    const newBookingBtn = document.getElementById('newBookingBtn');
    if (newBookingBtn) {
      newBookingBtn.addEventListener('click', () => {
        bookingConfirmation.classList.add('hidden');
        bookingForm.classList.remove('hidden');
        bookingForm.reset();
        
        // Re-initialize default dates & calculations
        const today = new Date();
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
        const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
        checkInEl.value = tomorrow.toISOString().split('T')[0];
        checkOutEl.value = dayAfter.toISOString().split('T')[0];
        
        updateBookingSummary();
      });
    }

    const printInvoiceBtn = document.getElementById('printInvoiceBtn');
    if (printInvoiceBtn) {
      printInvoiceBtn.addEventListener('click', () => {
        const invoiceHTML = document.getElementById('invoice').outerHTML;
        const win = window.open('', '_blank');
        win.document.write(`
          <html><head><title>Booking Invoice — Shree Daan Hotel</title>
          <style>
            body{font-family:sans-serif;padding:40px;color:#14090C;}
            .invoice{max-width:500px;margin:0 auto;}
            .invoice-head{display:flex;align-items:center;gap:14px;margin-bottom:18px;padding-bottom:18px;border-bottom:1px dashed #ccc;}
            .invoice-head .logo-mark{color:#6E1027;font-size:1.8rem;font-weight:bold;}
            .invoice-row{display:flex;justify-content:space-between;padding:8px 0;font-size:14px;}
            .invoice-total{border-top:1px solid #ccc;margin-top:8px;padding-top:14px;font-size:18px;font-weight:bold;}
            .badge{padding:3px 12px;border-radius:20px;font-size:11px;text-transform:uppercase;}
            .badge--pending{background:#FCE9C9;color:#8a5a1f;}
            .badge--confirmed{background:#D9EFDD;color:#1f6b34;}
          </style></head><body>${invoiceHTML}</body></html>
        `);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 300);
      });
    }
  }

  function formatDate(str) {
    if (!str) return '—';
    const d = new Date(str);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* ---------- 15. GALLERY (15 SQUARE PHOTOS WITH LIGHTBOX) ---------- */
  const GALLERY_ITEMS = [
    {
      label: 'Premier Suite Canopy Bed',
      category: 'premier-suite',
      src: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 50% 50%, #6E1027, #3d0e1c 60%, #14090C)'
    },
    {
      label: 'Premier Suite Luxury Seating',
      category: 'premier-suite',
      src: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 50% 50%, #6E1027, #3d0e1c 60%, #14090C)'
    },
    {
      label: 'Premier Master Bath & Shower',
      category: 'premier-suite',
      src: '../assets/images/heritage_hotel_suite_1784609202334.jpg',
      gradient: 'radial-gradient(ellipse at 50% 50%, #6E1027, #3d0e1c 60%, #14090C)'
    },
    {
      label: 'Executive King Bed Room',
      category: 'executive-rooms',
      src: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 40% 50%, #8a5a1f, #3d270e 60%, #14090C)'
    },
    {
      label: 'Executive Workspace Desk',
      category: 'executive-rooms',
      src: 'https://images.pexels.com/photos/2215067/pexels-photo-2215067.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 40% 50%, #8a5a1f, #3d270e 60%, #14090C)'
    },
    {
      label: 'Executive Room Window Lounge',
      category: 'executive-rooms',
      src: 'https://images.pexels.com/photos/2079293/pexels-photo-2079293.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 40% 50%, #8a5a1f, #3d270e 60%, #14090C)'
    },
    {
      label: 'Standard Double Bed Comfort',
      category: 'standard-rooms',
      src: 'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 50% 40%, #3f5240, #1c261d 60%, #14090C)'
    },
    {
      label: 'Standard Twin Bedroom Setup',
      category: 'standard-rooms',
      src: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 50% 40%, #3f5240, #1c261d 60%, #14090C)'
    },
    {
      label: 'Standard Cozy Queen Room',
      category: 'standard-rooms',
      src: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 50% 40%, #3f5240, #1c261d 60%, #14090C)'
    },
    {
      label: 'Grand Executive Boardroom',
      category: 'banquet-halls',
      src: 'https://images.pexels.com/photos/260686/pexels-photo-260686.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 60% 30%, #2f5a63, #14262c 60%, #14090C)'
    },
    {
      label: 'Corporate Meeting Room',
      category: 'banquet-halls',
      src: 'https://images.pexels.com/photos/1181398/pexels-photo-1181398.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 60% 30%, #2f5a63, #14262c 60%, #14090C)'
    },
    {
      label: 'Mini Discussion Boardroom',
      category: 'banquet-halls',
      src: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 60% 30%, #2f5a63, #14262c 60%, #14090C)'
    },
    {
      label: 'Premium Tea & Coffee Kit',
      category: 'room-kit',
      src: 'https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 40% 60%, #C9A227, #4A0A1A 55%, #14090C)'
    },
    {
      label: 'Herbal Bathroom Toiletries Kit',
      category: 'room-kit',
      src: 'https://images.pexels.com/photos/5472286/pexels-photo-5472286.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 40% 60%, #C9A227, #4A0A1A 55%, #14090C)'
    },
    {
      label: 'Luxury Embroidered Spa Robes',
      category: 'room-kit',
      src: 'https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'radial-gradient(ellipse at 40% 60%, #C9A227, #4A0A1A 55%, #14090C)'
    }
  ];

  let filteredGalleryItems = [...GALLERY_ITEMS];
  const galleryGrid = document.getElementById('galleryGrid');

  function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = filteredGalleryItems.map((item, i) => `
      <div class="gallery-item reveal-up in-view" data-index="${i}" style="background:${item.gradient};">
        <img src="${item.src}" alt="${escapeHtml(item.label)}" class="gallery-item-img" loading="lazy" onerror="this.style.display='none';">
        <span class="g-label">
          <span>${escapeHtml(item.label)}</span>
        </span>
      </div>
    `).join('');
  }

  // Active filter triggers
  const filterButtons = document.querySelectorAll('.gallery-filter-bar .filter-btn');
  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.dataset.filter;

        if (filterVal === 'all') {
          filteredGalleryItems = [...GALLERY_ITEMS];
        } else {
          filteredGalleryItems = GALLERY_ITEMS.filter(item => item.category === filterVal);
        }
        renderGallery();
      });
    });
  }

  // Delegated click handler for gallery items
  if (galleryGrid) {
    galleryGrid.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.gallery-item');
      if (itemEl) {
        const idx = parseInt(itemEl.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          openLightbox(idx);
        }
      }
    });
    renderGallery();
  }

  /* ---------- 15b. LIGHTBOX MODAL (FULL IMAGE VIEW) ---------- */
  let lightboxIndex = 0;
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCounter = document.getElementById('lightboxCounter');

  function openLightbox(index) {
    if (!lightbox) return;
    lightboxIndex = index;
    renderLightbox();
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  
  function renderLightbox() {
    const item = filteredGalleryItems[lightboxIndex];
    if (item) {
      if (lightboxImg) {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.label;
      }
      if (lightboxTitle) lightboxTitle.textContent = item.label;
      if (lightboxCounter) lightboxCounter.textContent = `Photo ${lightboxIndex + 1} of ${filteredGalleryItems.length}`;
    }
  }

  const lightboxClose = document.getElementById('lightboxClose');
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.id === 'lightboxContainer') closeLightbox();
    });
  }
  
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  const lightboxPrev = document.getElementById('lightboxPrev');
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxIndex = (lightboxIndex - 1 + filteredGalleryItems.length) % filteredGalleryItems.length;
      renderLightbox();
    });
  }
  
  const lightboxNext = document.getElementById('lightboxNext');
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxIndex = (lightboxIndex + 1) % filteredGalleryItems.length;
      renderLightbox();
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  /* ---------- 16. CONTACT FORM ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName')?.value || 'Guest';
      const email = document.getElementById('cEmail')?.value || '';
      const phone = document.getElementById('cPhone')?.value || '';
      const message = document.getElementById('cMessage')?.value || '';

      try {
        const msgs = JSON.parse(localStorage.getItem('hsd_messages')) || [];
        const msgId = 'MSG-' + Math.floor(100 + Math.random() * 900);
        msgs.unshift({
          id: msgId,
          name,
          email,
          phone,
          subject: 'Guest Web Inquiry',
          message,
          date: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: 'unread',
          source: 'Contact Form'
        });
        localStorage.setItem('hsd_messages', JSON.stringify(msgs));
      } catch(err) {
        console.error('Error saving message:', err);
      }

      const successMsg = document.getElementById('contactSuccess');
      if (successMsg) successMsg.classList.remove('hidden');
      e.target.reset();
      setTimeout(() => {
        if (successMsg) successMsg.classList.add('hidden');
      }, 5000);
    });
  }

  /* ---------- 17. NEWSLETTER ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = document.getElementById('newsletterSuccess');
      if (successMsg) successMsg.classList.remove('hidden');
      e.target.reset();
      setTimeout(() => {
        if (successMsg) successMsg.classList.add('hidden');
      }, 5000);
    });
  }

  /* ---------- 18. SERVICE CARD 3D TILT ---------- */
  (function tilt() {
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -10;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  })();

  /* ---------- 19. BACK TO TOP BUTTON ---------- */
  (function backToTop() {
    // Dynamically insert back to top button
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Back to top');
    btn.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; z-index: 800;
      width: 44px; height: 44px; border-radius: 50%;
      background: #6E1027; color: #F7F1E6; border: 1px solid #C9A227;
      font-size: 1.2rem; font-weight: bold; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      opacity: 0; visibility: hidden; transition: all 0.4s var(--ease);
    `;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
      } else {
        btn.style.opacity = '0';
        btn.style.visibility = 'hidden';
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* ---------- 21. 3D WELCOME SECTION SLIDER ---------- */
  (function welcome3dSlider() {
    const slider = document.getElementById('welcome3dSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.welcome-3d-slide');
    const dots = slider.querySelectorAll('.welcome-dot');
    const prevBtn = document.getElementById('welcomePrev');
    const nextBtn = document.getElementById('welcomeNext');
    if (!slides.length) return;

    let currentIndex = 0;
    let autoInterval = null;
    const total = slides.length;

    function updateSlides(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev-slide', 'next-slide');
        if (i === index) {
          slide.classList.add('active');
        } else if (i === (index - 1 + total) % total) {
          slide.classList.add('prev-slide');
        } else if (i === (index + 1) % total) {
          slide.classList.add('next-slide');
        }
      });

      dots.forEach((dot, i) => {
        if (i === index) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }

    function goToNext() {
      currentIndex = (currentIndex + 1) % total;
      updateSlides(currentIndex);
    }

    function goToPrev() {
      currentIndex = (currentIndex - 1 + total) % total;
      updateSlides(currentIndex);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoInterval = setInterval(goToNext, 4000);
    }

    function stopAutoPlay() {
      if (autoInterval) clearInterval(autoInterval);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { goToNext(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { goToPrev(); startAutoPlay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlides(currentIndex);
        startAutoPlay();
      });
    });

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    // Interactive 3D Parallax Tilt on Mouse Movement
    slider.addEventListener('mousemove', (e) => {
      const rect = slider.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / rect.height) * 12;
      const rotateY = (x / rect.width) * 14;

      const activeSlide = slider.querySelector('.welcome-3d-slide.active');
      if (activeSlide) {
        activeSlide.style.transform = `translate3d(0, 0, 0) rotateX(${rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg) scale(1.02)`;
      }
    });

    slider.addEventListener('mouseleave', () => {
      const activeSlide = slider.querySelector('.welcome-3d-slide.active');
      if (activeSlide) {
        activeSlide.style.transform = `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)`;
      }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) { goToNext(); startAutoPlay(); }
      if (touchEndX - touchStartX > 40) { goToPrev(); startAutoPlay(); }
    }, { passive: true });

    updateSlides(0);
    startAutoPlay();
  })();

  /* ---------- 22. 3D OUR SERVICES AUTO-SLIDER ---------- */
  (function services3dSlider() {
    const section = document.getElementById('homeServices3d') || document.querySelector('.section--services-3d') || document.querySelector('.services-3d-wrapper');
    if (!section) return;

    const cards = document.querySelectorAll('.service-3d-card');
    const prevBtn = document.getElementById('services3dPrev');
    const nextBtn = document.getElementById('services3dNext');
    const progressBar = document.getElementById('services3dProgressBar');
    if (!cards.length) return;

    let currentIndex = 0;
    const total = cards.length;
    let progressTimer = null;
    let progress = 0;
    const DURATION = 3500;
    const INTERVAL_STEP = 50;

    // Build dots dynamically for all cards
    const dotsContainer = document.getElementById('services3dDots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = i === 0 ? 'services-dot active' : 'services-dot';
        dot.setAttribute('data-dot', i);
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          currentIndex = i;
          update3dPositions(currentIndex);
          startAutoPlay();
        });
        dotsContainer.appendChild(dot);
      }
    }
    const dots = document.querySelectorAll('.services-dot');

    function update3dPositions(centerIndex) {
      cards.forEach((card, i) => {
        card.classList.remove('active');
        
        let diff = i - centerIndex;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        const isMobile = window.innerWidth <= 768;

        if (diff === 0) {
          card.classList.add('active');
          card.style.transform = `translate3d(0, 0, 0) scale(1) rotateY(0deg)`;
          card.style.opacity = '1';
          card.style.zIndex = '15';
          card.style.pointerEvents = 'auto';
        } else if (diff === 1) {
          const translateX = isMobile ? '65%' : '440px';
          card.style.transform = `translate3d(${translateX}, 0, -180px) rotateY(-22deg) scale(0.85)`;
          card.style.opacity = '0.7';
          card.style.zIndex = '8';
          card.style.pointerEvents = 'auto';
        } else if (diff === -1) {
          const translateX = isMobile ? '-65%' : '-440px';
          card.style.transform = `translate3d(${translateX}, 0, -180px) rotateY(22deg) scale(0.85)`;
          card.style.opacity = '0.7';
          card.style.zIndex = '8';
          card.style.pointerEvents = 'auto';
        } else if (diff === 2) {
          const translateX = isMobile ? '110%' : '760px';
          card.style.transform = `translate3d(${translateX}, 0, -320px) rotateY(-35deg) scale(0.7)`;
          card.style.opacity = isMobile ? '0' : '0.25';
          card.style.zIndex = '3';
          card.style.pointerEvents = 'none';
        } else if (diff === -2) {
          const translateX = isMobile ? '-110%' : '-760px';
          card.style.transform = `translate3d(${translateX}, 0, -320px) rotateY(35deg) scale(0.7)`;
          card.style.opacity = isMobile ? '0' : '0.25';
          card.style.zIndex = '3';
          card.style.pointerEvents = 'none';
        } else {
          card.style.transform = `translate3d(0, 0, -500px) scale(0.5)`;
          card.style.opacity = '0';
          card.style.zIndex = '1';
          card.style.pointerEvents = 'none';
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === centerIndex) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }

    function resetProgressBar() {
      progress = 0;
      if (progressBar) progressBar.style.width = '0%';
    }

    function startAutoPlay() {
      stopAutoPlay();
      resetProgressBar();

      progressTimer = setInterval(() => {
        progress += (INTERVAL_STEP / DURATION) * 100;
        if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress >= 100) {
          goToNext();
        }
      }, INTERVAL_STEP);
    }

    function stopAutoPlay() {
      if (progressTimer) clearInterval(progressTimer);
    }

    function goToNext() {
      currentIndex = (currentIndex + 1) % total;
      update3dPositions(currentIndex);
      startAutoPlay();
    }

    function goToPrev() {
      currentIndex = (currentIndex - 1 + total) % total;
      update3dPositions(currentIndex);
      startAutoPlay();
    }

    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (idx !== currentIndex) {
          currentIndex = idx;
          update3dPositions(currentIndex);
          startAutoPlay();
        }
      });
    });

    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goToNext(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goToPrev(); });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        currentIndex = idx;
        update3dPositions(currentIndex);
        startAutoPlay();
      });
    });

    const viewport = document.getElementById('services3dViewport');
    if (viewport) {
      viewport.addEventListener('mouseenter', stopAutoPlay);
      viewport.addEventListener('mouseleave', startAutoPlay);

      viewport.addEventListener('mousemove', (e) => {
        const activeCard = section.querySelector('.service-3d-card.active');
        if (!activeCard) return;

        const rect = viewport.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = (-y / rect.height) * 14;
        const rotateY = (x / rect.width) * 16;

        activeCard.style.transform = `translate3d(0, 0, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      });

      viewport.addEventListener('mouseleave', () => {
        const activeCard = section.querySelector('.service-3d-card.active');
        if (activeCard) {
          activeCard.style.transform = `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)`;
        }
      });
    }

    let touchStartX = 0;
    section.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    section.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) { goToNext(); }
      else if (touchEndX - touchStartX > 40) { goToPrev(); }
    }, { passive: true });

    update3dPositions(currentIndex);
    startAutoPlay();

    window.addEventListener('resize', () => {
      update3dPositions(currentIndex);
    });
  })();

});

