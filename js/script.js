/* ==========================================================================
   SHREE DAAN HOTEL — APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. LOADER ---------- */
  (function loader() {
    const loaderEl = document.getElementById('loader');
    const pctEl = document.getElementById('loaderPct');
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

    // Check if current page is not home page to give it a solid background immediately
    const pathname = window.location.pathname.toLowerCase();
    const isHomePage = pathname === '/' || pathname.endsWith('index.html') || pathname === '';
    
    if (!isHomePage) {
      header.classList.add('scrolled');
      header.classList.add('solid-bg');
      return; // Do not toggle on scroll for non-home pages
    }

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

    function go(i) {
      slides[index].classList.remove('active');
      if (dots[index]) dots[index].classList.remove('active');
      index = i;
      slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
      
      const video = slides[index].querySelector('.hero-video');
      if (video && video.paused) video.play().catch(() => {});
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
        if (!isHovered) nextSlide();
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

    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => { isHovered = true; });
      heroSection.addEventListener('mouseleave', () => { isHovered = false; });
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
    const stats = document.querySelectorAll('.stat strong[data-count]');
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
      id: 'deluxe', name: 'Deluxe Room', price: 4500, rating: 4.6,
      gradient: 'radial-gradient(ellipse at 30% 30%, #8a5a1f, #3d270e 60%, #14090C)',
      facilities: ['King Bed', 'City View', 'Free WiFi', 'Breakfast']
    },
    {
      id: 'premier', name: 'Premier Suite', price: 6800, rating: 4.8,
      gradient: 'radial-gradient(ellipse at 60% 40%, #6E1027, #2c0813 60%, #14090C)',
      facilities: ['Living Area', 'Balcony', 'Mini Bar', 'Bathtub']
    },
    {
      id: 'heritage', name: 'Heritage Suite', price: 9500, rating: 4.9,
      gradient: 'radial-gradient(ellipse at 40% 50%, #3f5240, #1c261d 60%, #14090C)',
      facilities: ['Courtyard View', 'Private Lounge', 'Butler Service', 'Spa Access']
    },
    {
      id: 'presidential', name: 'Presidential Suite', price: 15000, rating: 5.0,
      gradient: 'radial-gradient(ellipse at 50% 30%, #C9A227, #4A0A1A 55%, #14090C)',
      facilities: ['Panoramic View', 'Private Terrace', 'Dining Room', '24/7 Butler']
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
        <div class="room-image">
          <div class="room-bg" style="position:absolute;inset:0;background:${r.gradient};"></div>
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

    targetElement.querySelectorAll('[data-room]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = `booking.html?room=${btn.dataset.room}`;
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

  /* ---------- 14. BOOKING SUBMISSION -> INVOICE ---------- */
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

      const selectedOption = roomTypeEl.options[roomTypeEl.selectedIndex];
      const price = parseInt(selectedOption.dataset.price, 10);
      const total = nights * price;
      const bookingId = 'SD' + Date.now().toString().slice(-8);

      document.getElementById('invBookingId').textContent = bookingId;
      document.getElementById('invGuestName').textContent = 'Guest';
      document.getElementById('invRoomType').textContent = selectedOption.textContent.split(' — ')[0];
      document.getElementById('invCheckIn').textContent = formatDate(checkInEl.value);
      document.getElementById('invCheckOut').textContent = formatDate(checkOutEl.value);
      document.getElementById('invGuests').textContent = `${adultsEl.value} Adult${adultsEl.value > 1 ? 's' : ''}, ${childrenEl.value} Child${childrenEl.value == 1 ? '' : 'ren'}`;
      document.getElementById('invNights').textContent = nights;
      document.getElementById('invTotal').textContent = `₹${total.toLocaleString('en-IN')}`;

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

  /* ---------- 15. GALLERY ---------- */
  const GALLERY_ITEMS = [
    { label: 'Grand Facade', gradient: 'radial-gradient(ellipse at 30% 30%, #7a2338, #2c0813 60%, #14090C)', category: 'exterior', big: true },
    { label: 'Reception Lobby', gradient: 'radial-gradient(ellipse at 60% 40%, #8a5a1f, #3d270e 60%, #14090C)', category: 'interior' },
    { label: 'Deluxe Room', gradient: 'radial-gradient(ellipse at 40% 50%, #6E1027, #2c0813 60%, #14090C)', category: 'rooms' },
    { label: 'Golden Sparsh Spa', gradient: 'radial-gradient(ellipse at 50% 40%, #3f5240, #1c261d 60%, #14090C)', category: 'spa', tall: true },
    { label: 'Fine Dining', gradient: 'radial-gradient(ellipse at 40% 60%, #C9A227, #4A0A1A 55%, #14090C)', category: 'dining' },
    { label: 'Poolside', gradient: 'radial-gradient(ellipse at 60% 30%, #2f5a63, #14262c 60%, #14090C)', category: 'exterior' },
    { label: 'Heritage Suite', gradient: 'radial-gradient(ellipse at 50% 50%, #6E1027, #3d0e1c 60%, #14090C)', category: 'rooms' },
    { label: 'Evening Terrace', gradient: 'radial-gradient(ellipse at 30% 40%, #8a5a1f, #2c1a08 60%, #14090C)', category: 'exterior', big: true },
  ];

  let filteredGalleryItems = [...GALLERY_ITEMS];
  const galleryGrid = document.getElementById('galleryGrid');

  function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = filteredGalleryItems.map((item, i) => `
      <div class="gallery-item reveal-up in-view ${item.big ? 'span-2' : ''} ${item.tall ? 'span-2-row' : ''}" data-index="${i}">
        <div class="g-bg" style="position:absolute;inset:0;background:${item.gradient};"></div>
        <span class="g-label">${item.label}</span>
      </div>
    `).join('');

    galleryGrid.querySelectorAll('.gallery-item').forEach(el => {
      el.addEventListener('click', () => openLightbox(parseInt(el.dataset.index, 10)));
    });
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

  // Initialize Gallery Render
  if (galleryGrid) {
    renderGallery();
  }

  /* ---------- 15b. LIGHTBOX ---------- */
  let lightboxIndex = 0;
  const lightbox = document.getElementById('lightbox');
  const lightboxMedia = document.getElementById('lightboxMedia');

  function openLightbox(index) {
    if (!lightbox || !lightboxMedia) return;
    lightboxIndex = index;
    renderLightbox();
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  
  function renderLightbox() {
    if (!lightboxMedia) return;
    const item = filteredGalleryItems[lightboxIndex];
    if (item) {
      lightboxMedia.innerHTML = `<div class="g-bg" style="position:absolute;inset:0;background:${item.gradient};"></div><div class="lightbox-caption" style="position:absolute;bottom:20px;left:20px;color:white;font-family:var(--font-display);font-size:1.5rem;">${item.label}</div>`;
    }
  }

  const lightboxClose = document.getElementById('lightboxClose');
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  }
  
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  const lightboxPrev = document.getElementById('lightboxPrev');
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      lightboxIndex = (lightboxIndex - 1 + filteredGalleryItems.length) % filteredGalleryItems.length;
      renderLightbox();
    });
  }
  
  const lightboxNext = document.getElementById('lightboxNext');
  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
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

});
