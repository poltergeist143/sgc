/**
 * SAVED BY GRACE CHURCH - OFFICIAL JAVASCRIPT
 * Modern, Interactive, Responsive Church Website Logic
 * Features: Mobile Nav, Smooth Scroll, Scrollspy, Reveal Animations,
 * Filterable Gallery & Lightbox, Sermon Player Modal, Event Countdown,
 * Interactive Modals (Visit, Ministry, Event), Form Validation, Toast System.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const isMobile = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches
    || document.documentElement.classList.contains('lite-mode');
  // Lazy-load everything except images visible on first paint
  document.querySelectorAll('img').forEach(img => {
    if (img.matches('.hero-bg-image, .nav-logo-img, .hero-logo-img, .splash-logo-img')) return;
    img.loading = 'lazy';
    img.decoding = 'async';
  });
  /* ==========================================================================
     1. DYNAMIC YEAR IN FOOTER
     ========================================================================== */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     2. STICKY NAVBAR SCROLL STATE
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const handleNavbarScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ==========================================================================
     3. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileNav = () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobileNav = () => {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileNav);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close when clicking outside mobile drawer
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)) {
      closeMobileNav();
    }
  });

  /* ==========================================================================
     4. SMOOTH SCROLLING WITH NAVBAR OFFSET
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     5. SCROLLSPY (ACTIVE NAVIGATION HIGHLIGHTING)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const highlightActiveNav = () => {
    const scrollY = window.pageYOffset;
    const navHeight = navbar ? navbar.offsetHeight + 20 : 100;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - navHeight;
      const sectionId = current.getAttribute('id');
      const matchingNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingNavLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          matchingNavLink.classList.add('active');
        } else {
          matchingNavLink.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav();

  /* ==========================================================================
   6. SCROLL REVEAL ANIMATIONS (per-section styles + stagger)
   ========================================================================== */
  // [selector, variant class] - adds the effect without editing the HTML
  const revealMap = [
    ['.about-text-content', 'reveal-left'],
    ['.about-image-wrapper', 'reveal-right'],
    ['.about-highlight-card', 'reveal-pop'],
    ['.pastor-welcome-card', 'reveal-zoom'],
    ['.visitor-welcome-banner', 'reveal-zoom'],
    ['.visitor-perk', 'reveal-pop'],
    ['.featured-event-banner', 'reveal-zoom'],
    ['.countdown-segment', 'reveal-pop'],
    ['.gallery-item', 'reveal-blur'],
    ['.contact-info-col', 'reveal-left'],
    ['.contact-form-card', 'reveal-right'],
    ['.footer-top > div', 'reveal-on-scroll']   // plain fade-up
  ];

  revealMap.forEach(([selector, variant]) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal-on-scroll');
      if (variant !== 'reveal-on-scroll') el.classList.add(variant);
    });
  });

  // Stagger siblings: 0 / 120 / 240 ms, repeating every 3 so later rows don't wait long
  const revealElements = Array.from(document.querySelectorAll('.reveal-on-scroll'));
  const siblingCount = new Map();
  revealElements.forEach(el => {
    const parent = el.parentElement;
    const i = siblingCount.get(parent) || 0;
    siblingCount.set(parent, i + 1);
    el.style.setProperty('--reveal-delay', `${(i % 3) * 120}ms`);
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('revealed');
        observer.unobserve(el);

        // Clean up after the animation so hover effects and other transitions work normally
        setTimeout(() => {
          el.style.removeProperty('--reveal-delay');
          el.style.transitionDelay = '0ms';
        }, 1500);
      });
    }, { root: null, threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ----- "40+" years counter (replays every time it's on screen) ----- */
  const accentNumber = document.querySelector('.accent-number');
  if (accentNumber && 'IntersectionObserver' in window) {
    const target = parseInt(accentNumber.textContent, 10) || 40;
    let rafId = null;

    const runCounter = () => {
      cancelAnimationFrame(rafId);
      const start = performance.now();
      const duration = 1800;
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        accentNumber.textContent = Math.round(target * eased) + '+';
        if (p < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        runCounter();
      } else {
        // reset when it leaves the screen so it can count again
        cancelAnimationFrame(rafId);
        accentNumber.textContent = '0+';
      }
    }, { threshold: 0.6 });

    counterObserver.observe(accentNumber);
  }

  /* ----- Scroll progress bar + hero parallax ----- */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  const heroBg = document.querySelector('.hero-bg-wrapper');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;

    if (heroBg && !reduceMotion && !isMobile && window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    }
  }, { passive: true });

  /* ==========================================================================
   SECTION ENTRANCE EFFECTS (replays every time the section is scrolled to)
   ========================================================================== */
  // Split section titles into words
  document.querySelectorAll('.section-title').forEach(title => {
    const text = title.textContent.trim();
    title.setAttribute('aria-label', text);
    title.innerHTML = text.split(/\s+/).map((word, i) =>
      `<span class="word" aria-hidden="true"><span style="--i:${i}">${word}</span></span>`
    ).join(' ');
  });

  // Mark a section "in-view" while it crosses the middle band of the screen
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    }, { rootMargin: '-30% 0px -30% 0px', threshold: 0 });

    document.querySelectorAll('.section').forEach(sec => sectionObserver.observe(sec));
  } else {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('in-view'));
  }
  // Title words replay whenever the header itself is on screen (works both directions)
  if ('IntersectionObserver' in window) {
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.target.classList.toggle('header-in', entry.isIntersecting));
    }, { threshold: 0.5 });
    document.querySelectorAll('.section-header').forEach(h => headerObserver.observe(h));
  } else {
    document.querySelectorAll('.section-header').forEach(h => h.classList.add('header-in'));
  }

  /* ----- Hero content: replay entrance every time the hero is scrolled to ----- */
  const heroSection = document.getElementById('home');
  const heroContent = document.querySelector('.hero-content');
  if (heroSection && heroContent) {
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.intersectionRatio >= 0.15) {
            heroContent.classList.add('hero-play');
          } else if (!entry.isIntersecting) {
            // fully off screen: reset so it can play again
            heroContent.classList.remove('hero-play');
          }
        });
      }, { threshold: [0, 0.15] });
      heroObserver.observe(heroSection);
    } else {
      heroContent.classList.add('hero-play');
    }
  }
  /* ==========================================================================
     7. BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     8. TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  const toastContainer = document.getElementById('toastContainer');
  const showToast = (message, type = 'info', duration = 4500) => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

    toast.innerHTML = `
      <div class="toast-message">
        <i class="${iconClass}"></i>
        <span>${message}</span>
      </div>
      <button class="toast-close" style="color: rgba(255,255,255,0.7); cursor: pointer;" aria-label="Close notification">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  };
  /* ==========================================================================
    FORM SENDER (emails every form to the church inbox via Web3Forms)
    ========================================================================== */
  const FORM_KEY = 'fe322541-6bdf-48da-97e5-5e91d9f93432';

  // Spam protection:
  //  - Honeypot: every form has a hidden "botcheck" checkbox. People never see it;
  //    if a bot ticks it, Web3Forms rejects the submission.
  //  - hCaptcha: forms with a .h-captcha widget send its answer, which Web3Forms verifies.
  const getCaptchaToken = (form) => {
    const field = form && form.querySelector('[name="h-captcha-response"]');
    return field ? field.value : '';
  };

  const resetCaptcha = (form) => {
    if (form && form.querySelector('.h-captcha') && window.hcaptcha) {
      try { window.hcaptcha.reset(); } catch (e) { }
    }
  };

  const sendForm = async (subject, fields, form) => {
    const extra = {};
    const honeypot = form && form.querySelector('[name="botcheck"]');
    if (honeypot && honeypot.checked) extra.botcheck = true;

    if (form && form.querySelector('.h-captcha')) {
      extra['h-captcha-response'] = getCaptchaToken(form);
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: FORM_KEY,
          subject: subject,
          from_name: 'Saved by Grace Church Website',
          ...fields,
          ...extra
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Send failed');
    } finally {
      // A captcha answer can only be used once, so clear it after every attempt
      resetCaptcha(form);
    }
  };
  /* ==========================================================================
     9. EVENT COUNTDOWN TIMER
     ========================================================================== */
  const countdownDays = document.getElementById('countDays');
  const countdownHours = document.getElementById('countHours');
  const countdownMinutes = document.getElementById('countMins');
  const countdownSeconds = document.getElementById('countSecs');

  if (countdownDays && countdownHours && countdownMinutes && countdownSeconds) {
    // Set target date: Annual Grace Revival Conference - April 18, 2027, 2:00 PM
    const targetDate = new Date(2027, 3, 18, 14, 0, 0);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        countdownDays.textContent = '00';
        countdownHours.textContent = '00';
        countdownMinutes.textContent = '00';
        countdownSeconds.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownDays.textContent = String(days).padStart(2, '0');
      countdownHours.textContent = String(hours).padStart(2, '0');
      countdownMinutes.textContent = String(minutes).padStart(2, '0');
      countdownSeconds.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ==========================================================================
     10. FILTERABLE PHOTO GALLERY & LIGHTBOX
     ========================================================================== */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryList = [...galleryItems];
  let currentLightboxIndex = 0;

  // Filter gallery items
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterCategory === 'all' || itemCategory === filterCategory) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      currentGalleryList = galleryItems.filter(item => {
        return filterCategory === 'all' || item.getAttribute('data-category') === filterCategory;
      });
    });
  });

  const openLightbox = (index) => {
    if (!currentGalleryList[index]) return;
    currentLightboxIndex = index;
    const item = currentGalleryList[index];
    const imgEl = item.querySelector('img');
    const titleEl = item.querySelector('.gallery-overlay-title');

    if (lightboxImg && imgEl) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt || 'Church Photo';
    }
    if (lightboxTitle && titleEl) {
      lightboxTitle.textContent = titleEl.textContent;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${index + 1} of ${currentGalleryList.length}`;
    }

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  const showNextLightbox = () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryList.length;
    openLightbox(currentLightboxIndex);
  };

  const showPrevLightbox = () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryList.length) % currentGalleryList.length;
    openLightbox(currentLightboxIndex);
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const activeIndex = currentGalleryList.indexOf(item);
      if (activeIndex !== -1) {
        openLightbox(activeIndex);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevLightbox);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  window.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextLightbox();
      if (e.key === 'ArrowLeft') showPrevLightbox();
    }
  });
  /* ==========================================================================
     10b. GALLERY - STACKED CARDS (SHOW ALL IMAGES / SHOW LESS)
     ========================================================================== */
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryToggleBtn = document.getElementById('galleryToggleBtn');

  if (galleryGrid && galleryToggleBtn) {
    const galleryBtnText = galleryToggleBtn.querySelector('span');
    let galleryExpanded = false;

    // Columns match the CSS breakpoints: 3 / 2 / 1
    const getGalleryCols = () => (window.innerWidth <= 540 ? 1 : window.innerWidth <= 1024 ? 2 : 3);

    // "+N more" badge on every photo (only shown on the front ones)
    galleryItems.forEach(item => {
      const badge = document.createElement('span');
      badge.className = 'gallery-stack-badge';
      item.appendChild(badge);
    });

    // One visible photo per column; the rest hide behind it (respects the filter tabs)
    const layoutGalleryStack = () => {
      const cols = getGalleryCols();
      galleryGrid.style.setProperty('--gallery-cols', cols);

      const visible = galleryItems.filter(item => item.style.display !== 'none');

      visible.forEach((item, i) => {
        const depth = Math.floor(i / cols);
        item.style.setProperty('--col', (i % cols) + 1);
        item.style.setProperty('--depth', 0);
        item.style.setProperty('--i', i);
        item.classList.toggle('stack-top', depth === 0);
        item.classList.toggle('stack-hidden', depth > 0);

        if (depth === 0) {
          const inStack = Math.ceil((visible.length - (i % cols)) / cols);
          item.querySelector('.gallery-stack-badge').textContent =
            inStack > 1 ? `+${inStack - 1} more` : '';
        }
      });

      // Nothing to fold? Hide the button.
      galleryToggleBtn.parentElement.style.display = visible.length <= cols ? 'none' : '';
    };

    const setGalleryExpanded = (expand) => {
      galleryExpanded = expand;
      galleryToggleBtn.setAttribute('aria-expanded', String(expand));
      galleryBtnText.textContent = expand ? 'Show Less' : 'Show All Images';

      if (expand) {
        galleryGrid.classList.remove('is-stacked');
        galleryGrid.classList.add('is-fanning');
        setTimeout(() => galleryGrid.classList.remove('is-fanning'), 1200);
      } else {
        galleryGrid.classList.add('is-stacked');
        galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // While stacked, clicking a photo unfolds the stack instead of opening the lightbox
    galleryGrid.addEventListener('click', (e) => {
      if (!galleryExpanded && e.target.closest('.gallery-item')) {
        e.stopPropagation();
        setGalleryExpanded(true);
      }
    }, true);

    galleryToggleBtn.addEventListener('click', () => setGalleryExpanded(!galleryExpanded));

    // Re-stack whenever a filter tab is clicked (runs after section 10's filter)
    galleryFilterBtns.forEach(btn => btn.addEventListener('click', layoutGalleryStack));

    window.addEventListener('resize', layoutGalleryStack);

    layoutGalleryStack();
    galleryGrid.classList.add('is-stacked');
  }

  /* ==========================================================================
     11. MINISTRY DETAILS MODAL
     ========================================================================== */
  const ministryModal = document.getElementById('ministryModal');
  const ministryModalClose = document.getElementById('ministryModalClose');
  const ministryModalTitle = document.getElementById('ministryModalTitle');
  const ministryModalDesc = document.getElementById('ministryModalDesc');
  const ministryModalSchedule = document.getElementById('ministryModalSchedule');
  const ministryModalLeader = document.getElementById('ministryModalLeader');

  const ministryDetailsData = {
    'worship': {
      title: 'Spiritual Upliftment',
      desc: 'A meaningful gathering where brothers and sisters come together to strengthen their faith, encourage one another, and grow spiritually through God’s word, prayer and fellowship.',
      schedule: 'By Schedule or Appointment',
      leader: 'Pastor Joel Tatoy'
    },
    'youth': {
      title: 'Youth Fellowship',
      desc: 'Youth Fellowship is an authentic, energizing community for kids to teens to discover God\'s grace, build lifelong friendships, and grow into courageous disciples of Christ.',
      schedule: 'Youth Fellowship: Every First Sunday at 2:00 PM ',
      leader: 'Shiloh Tatoy'
    },
    'children': {
      title: 'Men And Women Fellowship',
      desc: 'A gathering dedicated to empowering men and women to discover their purpose, strengthen their character, and deepen their relationship with God through faith, unity, and fellowship.',
      schedule: 'By Schedule',
      leader: 'Pastor\s leader'
    },
    'prayer': {
      title: 'Prayer & Intercession Ministry',
      desc: 'A gathering where brothers and sisters unite in prayer, seeking God\'s guidance, expressing gratitude, and strengthening their faith through heartfelt worship and fellowship.',
      schedule: 'By Schedule',
      leader: 'Pastor\s Leader'
    },
    'outreach': {
      title: 'Sportsfest Fellowship',
      desc: 'A church activity that brings brothers and sisters together through friendly sports and games, promoting unity, teamwork, love, and fellowship while glorifying God through sportsmanship and Christian values.',
      schedule: 'Every 1st of May',
      leader: 'Pastor\s Leader'
    },
    'biblestudy': {
      title: 'Bible Study & Discipleship',
      desc: 'A gathering where believers and unbelievers come together to learn, understand, and reflect on God\'s Word, discover His truth, strengthen their faith, and grow in their relationship with Him.',
      schedule: 'By Schedule or Appointment',
      leader: 'Pastor Joel Tatoy'
    }
  };

  document.querySelectorAll('.open-ministry-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const ministryKey = btn.getAttribute('data-ministry');
      const data = ministryDetailsData[ministryKey];
      if (data && ministryModal) {
        if (ministryModalTitle) ministryModalTitle.textContent = data.title;
        if (ministryModalDesc) ministryModalDesc.textContent = data.desc;
        if (ministryModalSchedule) ministryModalSchedule.textContent = data.schedule;
        if (ministryModalLeader) ministryModalLeader.textContent = data.leader;

        ministryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (ministryModalClose) {
    ministryModalClose.addEventListener('click', () => {
      ministryModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  /* ==========================================================================
     13. EVENT DETAILS MODAL
     ========================================================================== */
  const eventModal = document.getElementById('eventModal');
  const eventModalClose = document.getElementById('eventModalClose');
  const eventModalTitle = document.getElementById('eventModalTitle');
  const eventModalDate = document.getElementById('eventModalDate');
  const eventModalLocation = document.getElementById('eventModalLocation');
  const eventModalDesc = document.getElementById('eventModalDesc');

  let currentEvent = null;
  document.querySelectorAll('.open-event-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || 'Church Event';
      const date = btn.getAttribute('data-date') || 'Upcoming Date';
      const loc = btn.getAttribute('data-location') || 'Main Sanctuary, Saved by Grace Church';
      const desc = btn.getAttribute('data-desc') || 'Join us for worship, fellowship, and encouragement.';
      currentEvent = { title, date, loc, desc, start: btn.dataset.start, end: btn.dataset.end };

      if (eventModalTitle) eventModalTitle.textContent = title;
      if (eventModalDate) eventModalDate.textContent = date;
      if (eventModalLocation) eventModalLocation.textContent = loc;
      if (eventModalDesc) eventModalDesc.textContent = desc;

      if (eventModal) {
        eventModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (eventModalClose) {
    eventModalClose.addEventListener('click', () => {
      eventModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  // RSVP: email it to the church
  const eventRsvpForm = document.getElementById('eventRsvpForm');
  if (eventRsvpForm) {
    eventRsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = eventRsvpForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      const name = document.getElementById('eventRsvpName').value.trim();
      const email = document.getElementById('eventRsvpEmail').value.trim();

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      try {
        await sendForm(`Event RSVP: ${currentEvent ? currentEvent.title : 'Church Event'}`, {
          name: name,
          email: email,
          event: currentEvent ? currentEvent.title : '',
          date: currentEvent ? currentEvent.date : '',
          location: currentEvent ? currentEvent.loc : ''
        });
        eventModal.classList.remove('active');
        document.body.style.overflow = '';
        eventRsvpForm.reset();
        showToast(`Thank you, ${name}! Your RSVP has been received.`, 'success', 6000);
      } catch (err) {
        showToast('Sorry, your RSVP could not be sent. Please try again or call (032) 260 5544.', 'error', 6000);
      }
      btn.disabled = false;
      btn.innerHTML = original;
    }, eventRsvpForm);
  }

  // Add to Calendar (opens Google Calendar with the event filled in)
  const eventCalBtn = document.getElementById('eventCalBtn');
  if (eventCalBtn) {
    eventCalBtn.addEventListener('click', () => {
      if (!currentEvent || !currentEvent.start) {
        showToast('Calendar details are not available for this event.', 'error');
        return;
      }
      const fmt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const start = new Date(currentEvent.start);
      const end = new Date(currentEvent.end || start.getTime() + 3 * 60 * 60 * 1000);
      const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
        + '&text=' + encodeURIComponent(currentEvent.title)
        + '&dates=' + fmt(start) + '/' + fmt(end)
        + '&details=' + encodeURIComponent(currentEvent.desc)
        + '&location=' + encodeURIComponent(currentEvent.loc);
      window.open(url, '_blank', 'noopener');
    });
  }
  /* ==========================================================================
     14. PLAN YOUR VISIT MODAL
     ========================================================================== */
  const visitModal = document.getElementById('visitModal');
  const visitModalClose = document.getElementById('visitModalClose');
  const visitForm = document.getElementById('visitForm');

  document.querySelectorAll('.open-visit-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (visitModal) {
        visitModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (visitModalClose) {
    visitModalClose.addEventListener('click', () => {
      visitModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (visitForm) {
    visitForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = visitForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      const val = (id) => document.getElementById(id)?.value || '';
      const name = val('visitName') || 'Guest';
      const serviceTime = val('visitService') || 'Sunday Service';

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      try {
        await sendForm(`Plan Your Visit: ${name}`, {
          name: name,
          email: val('visitEmail'),
          service: serviceTime,
          planned_date: val('visitDate'),
          guests: val('visitGuestsCount'),
          children: val('visitKids'),
          notes: val('visitNotes')
        }, visitForm);
        visitModal.classList.remove('active');
        document.body.style.overflow = '';
        visitForm.reset();
        showToast(`Praise God, ${name}! We can't wait to welcome you for ${serviceTime}.`, 'success', 6000);
      } catch (err) {
        showToast('Sorry, we could not send your reservation. Please try again or call (032) 260 5544.', 'error', 6000);
      }

      btn.disabled = false;
      btn.innerHTML = original;
    });
  }

  // Close any modal on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  /* ==========================================================================
     15. CONTACT FORM VALIDATION & SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setError = (input, message) => {
      const group = input.closest('.form-group');
      if (group) {
        group.classList.add('has-error');
        let errorEl = group.querySelector('.form-error-msg');
        if (!errorEl) {
          errorEl = document.createElement('span');
          errorEl.className = 'form-error-msg';
          group.appendChild(errorEl);
        }
        errorEl.textContent = message;
      }
    };

    const clearError = (input) => {
      const group = input.closest('.form-group');
      if (group) {
        group.classList.remove('has-error');
      }
    };

    // Live validation triggers on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
      if (inp) {
        inp.addEventListener('input', () => clearError(inp));
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        setError(nameInput, 'Please provide your full name (at least 2 letters).');
        isValid = false;
      } else {
        clearError(nameInput);
      }

      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        setError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(emailInput);
      }

      if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
        setError(subjectInput, 'Please enter a message subject.');
        isValid = false;
      } else {
        clearError(subjectInput);
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        setError(messageInput, 'Please write your message or prayer request (at least 10 characters).');
        isValid = false;
      } else {
        clearError(messageInput);
      }
      // hCaptcha must be completed
      const captchaBox = contactForm.querySelector('.h-captcha');
      if (captchaBox) {
        const captchaGroup = captchaBox.closest('.form-group');
        if (!getCaptchaToken(contactForm)) {
          if (captchaGroup) {
            captchaGroup.classList.add('has-error');
            captchaGroup.querySelector('.form-error-msg').textContent = 'Please complete the captcha ("I am human") check.';
          }
          isValid = false;
        } else if (captchaGroup) {
          captchaGroup.classList.remove('has-error');
        }
      }
      if (!isValid) {
        showToast('Please fix the highlighted fields in the form.', 'error');
        return;
      }

      // Simulate sending
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

      const categorySelect = document.getElementById('contactCategory');
      sendForm(`${categorySelect.options[categorySelect.selectedIndex].text}: ${subjectInput.value.trim()}`, {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        category: categorySelect.options[categorySelect.selectedIndex].text,
        message: messageInput.value.trim(),
        newsletter: document.getElementById('contactNewsletter').checked ? 'Yes' : 'No'
      }, contactForm)
        .then(() => {
          contactForm.reset();
          showToast('Grace and peace! Your message has been received. Our pastoral team will get back to you shortly.', 'success', 6000);
        })
        .catch(() => {
          showToast('Sorry, your message could not be sent. Please try again or call (032) 260 5544.', 'error', 6000);
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        });
    });
  }

  /* ==========================================================================
     16. NEWSLETTER SUBSCRIPTION FORM
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const email = input ? input.value.trim() : '';

      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        sendForm('New Grace Devotional subscriber', { email: email, message: 'Please add this email to the weekly devotional list.' }, newsletterForm)
          .then(() => {
            showToast('Thank you! You are now subscribed to Saved by Grace Church weekly devotionals.', 'success');
            newsletterForm.reset();
          })
          .catch(() => showToast('Could not subscribe right now. Please try again later.', 'error'));
      } else {
        showToast('Please enter a valid email address to subscribe.', 'error');
      }
    });
  }

  /* ==========================================================================
     17. DAILY BIBLE VERSE SPLASH PAGE & API INTEGRATION
     ========================================================================== */
  const splashScreen = document.getElementById('splashScreen');
  const splashSkipBtn = document.getElementById('splashSkipBtn');
  const splashEnterBtn = document.getElementById('splashEnterBtn');
  const splashRememberCheck = document.getElementById('splashRememberCheck');
  const splashDate = document.getElementById('splashDate');
  const splashLoader = document.getElementById('splashLoader');
  const splashScriptureContent = document.getElementById('splashScriptureContent');
  const splashVerseText = document.getElementById('splashVerseText');
  const splashRefText = document.getElementById('splashRefText');
  const splashListenBtn = document.getElementById('splashListenBtn');
  const splashListenText = document.getElementById('splashListenText');
  const splashCopyBtn = document.getElementById('splashCopyBtn');
  const splashCopyText = document.getElementById('splashCopyText');
  const splashShareBtn = document.getElementById('splashShareBtn');
  const splashNewVerseBtn = document.getElementById('splashNewVerseBtn');
  const openSplashTriggers = document.querySelectorAll('.open-splash-trigger');

  const STORAGE_KEY = 'sgc_splash_dismissed_date';
  const getTodayDateKey = () => new Date().toISOString().slice(0, 10);

  // Set formatted devotional date
  if (splashDate) {
    const now = new Date();
    splashDate.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Curated 31-Day King James Version (KJV) Devotionals for daily plan and offline fallback
  const KJV_DEVOTIONALS = [
    {
      reference: "Ephesians 2:8–9",
      text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.",
      version: "KJV"
    },
    {
      reference: "John 3:16",
      text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      version: "KJV"
    },
    {
      reference: "Proverbs 3:5–6",
      text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
      version: "KJV"
    },
    {
      reference: "Philippians 4:13",
      text: "I can do all things through Christ which strengtheneth me.",
      version: "KJV"
    },
    {
      reference: "Jeremiah 29:11",
      text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
      version: "KJV"
    },
    {
      reference: "Romans 8:28",
      text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
      version: "KJV"
    },
    {
      reference: "Psalm 23:1–3",
      text: "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
      version: "KJV"
    },
    {
      reference: "Isaiah 40:31",
      text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
      version: "KJV"
    },
    {
      reference: "Matthew 11:28–29",
      text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls.",
      version: "KJV"
    },
    {
      reference: "Isaiah 1:18",
      text: "Come now, and let us reason together, saith the LORD: though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool.",
      version: "KJV"
    },
    {
      reference: "2 Corinthians 5:17",
      text: "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.",
      version: "KJV"
    },
    {
      reference: "Joshua 1:9",
      text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",
      version: "KJV"
    },
    {
      reference: "Psalm 46:1",
      text: "God is our refuge and strength, a very present help in trouble.",
      version: "KJV"
    },
    {
      reference: "Romans 12:2",
      text: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.",
      version: "KJV"
    },
    {
      reference: "Hebrews 11:1",
      text: "Now faith is the substance of things hoped for, the evidence of things not seen.",
      version: "KJV"
    },
    {
      reference: "Galatians 2:20",
      text: "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me.",
      version: "KJV"
    },
    {
      reference: "2 Timothy 1:7",
      text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
      version: "KJV"
    },
    {
      reference: "Psalm 119:105",
      text: "Thy word is a lamp unto my feet, and a light unto my path.",
      version: "KJV"
    },
    {
      reference: "Romans 5:8",
      text: "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.",
      version: "KJV"
    },
    {
      reference: "1 John 4:19",
      text: "We love him, because he first loved us.",
      version: "KJV"
    },
    {
      reference: "Philippians 4:6–7",
      text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
      version: "KJV"
    },
    {
      reference: "Psalm 91:1–2",
      text: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.",
      version: "KJV"
    },
    {
      reference: "1 Thessalonians 5:16–18",
      text: "Rejoice evermore. Pray without ceasing. In every thing give thanks: for this is the will of God in Christ Jesus concerning you.",
      version: "KJV"
    },
    {
      reference: "Colossians 3:14–15",
      text: "And above all these things put on charity, which is the bond of perfectness. And let the peace of God rule in your hearts, to the which also ye are called in one body; and be ye thankful.",
      version: "KJV"
    },
    {
      reference: "Lamentations 3:22–23",
      text: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
      version: "KJV"
    },
    {
      reference: "James 1:5",
      text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.",
      version: "KJV"
    },
    {
      reference: "Psalm 27:1",
      text: "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?",
      version: "KJV"
    },
    {
      reference: "Proverbs 16:3",
      text: "Commit thy works unto the LORD, and thy thoughts shall be established.",
      version: "KJV"
    },
    {
      reference: "1 Peter 5:7",
      text: "Casting all your care upon him; for he careth for you.",
      version: "KJV"
    },
    {
      reference: "John 14:6",
      text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
      version: "KJV"
    },
    {
      reference: "Revelation 21:4",
      text: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",
      version: "KJV"
    }
  ];

  let currentVerse = {
    text: '',
    reference: '',
    version: 'KJV'
  };
  let isSpeaking = false;

  // Clean scripture text formatting
  const cleanVerseText = (str) => {
    return str
      .replace(/[\r\n]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/^[“"\s]+|[”"\s]+$/g, '')
      .trim();
  };

  // Render verse onto splash card with smooth entrance animation
  const renderVerse = (verse) => {
    currentVerse = {
      text: cleanVerseText(verse.text),
      reference: verse.reference.trim(),
      version: 'KJV'
    };

    if (splashVerseText) {
      splashVerseText.textContent = `“${currentVerse.text}”`;
    }
    if (splashRefText) {
      splashRefText.textContent = `${currentVerse.reference} (KJV)`;
    }
    if (splashLoader) splashLoader.style.display = 'none';
    if (splashScriptureContent) {
      splashScriptureContent.style.display = 'block';
      splashScriptureContent.style.opacity = '0';
      splashScriptureContent.style.transform = 'translateY(8px)';
      splashScriptureContent.style.transition = 'all 0.35s ease-out';
      requestAnimationFrame(() => {
        splashScriptureContent.style.opacity = '1';
        splashScriptureContent.style.transform = 'translateY(0)';
      });
    }
  };

  // Helper to fetch KJV text for a given scripture reference from Bible API
  const fetchKjvByReference = async (ref, signal) => {
    const formattedRef = encodeURIComponent(ref.trim());
    const apiUrl = `https://bible-api.com/${formattedRef}?translation=kjv`;
    const res = await fetch(apiUrl, { signal, headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`Bible-API HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.text) {
      return {
        text: data.text,
        reference: data.reference || ref,
        version: 'KJV'
      };
    }
    throw new Error('Invalid KJV data received');
  };

  // Fetch verse dynamically via King James Version Bible API
  const fetchBibleVerse = async (order = 'daily') => {
    if (splashLoader && splashScriptureContent) {
      splashLoader.style.display = 'flex';
      splashScriptureContent.style.display = 'none';
    }

    if (isSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      updateSpeechButton();
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    // Determine target scripture reference
    const now = new Date();
    const dayIndex = (now.getDate() + now.getMonth() * 31) % KJV_DEVOTIONALS.length;
    const defaultDevotional = order === 'daily'
      ? KJV_DEVOTIONALS[dayIndex]
      : KJV_DEVOTIONALS[Math.floor(Math.random() * KJV_DEVOTIONALS.length)];

    let targetRef = defaultDevotional.reference;

    try {
      if (order === 'daily') {
        // Attempt to check if today's global Verse of the Day reference is available
        try {
          const votdRes = await fetch('https://beta.ourmanna.com/api/v1/get/?format=json&order=daily', {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
          });
          if (votdRes.ok) {
            const votdData = await votdRes.json();
            if (votdData?.verse?.details?.reference) {
              targetRef = votdData.verse.details.reference;
            }
          }
        } catch (e) {
          // If OurManna fails, targetRef retains today's calendar reference
        }
      }

      // Fetch authentic King James Version (KJV) text
      const kjvVerse = await fetchKjvByReference(targetRef, controller.signal);
      clearTimeout(timeoutId);
      renderVerse(kjvVerse);
    } catch (err) {
      clearTimeout(timeoutId);
      // Seamlessly render our authentic King James Version devotional
      renderVerse(defaultDevotional);
    }
  };

  // Speech reader button UI update
  const updateSpeechButton = () => {
    if (!splashListenBtn) return;
    if (isSpeaking) {
      splashListenBtn.classList.add('active');
      splashListenBtn.innerHTML = '<i class="fa-solid fa-circle-stop text-gold"></i> <span>Stop</span>';
    } else {
      splashListenBtn.classList.remove('active');
      splashListenBtn.innerHTML = '<i class="fa-solid fa-volume-high text-gold"></i> <span>Listen</span>';
    }
  };

  // Listen / Read aloud audio in KJV
  if (splashListenBtn) {
    splashListenBtn.addEventListener('click', () => {
      if (!('speechSynthesis' in window)) {
        showToast('Speech audio narration is not available in this browser.', 'error');
        return;
      }

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        updateSpeechButton();
        return;
      }

      if (!currentVerse.text) return;

      const utterance = new SpeechSynthesisUtterance(
        `Today's scripture from Saved by Grace Church, King James Version. ${currentVerse.text}. From ${currentVerse.reference}.`
      );
      utterance.rate = 0.90;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        isSpeaking = false;
        updateSpeechButton();
      };
      utterance.onerror = () => {
        isSpeaking = false;
        updateSpeechButton();
      };

      isSpeaking = true;
      updateSpeechButton();
      window.speechSynthesis.speak(utterance);
    });
  }

  // Copy verse to clipboard in KJV
  if (splashCopyBtn) {
    splashCopyBtn.addEventListener('click', async () => {
      if (!currentVerse.text) return;
      const shareText = `“${currentVerse.text}” — ${currentVerse.reference} (KJV)\nSaved by Grace Church`;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareText);
        } else {
          const tempArea = document.createElement('textarea');
          tempArea.value = shareText;
          document.body.appendChild(tempArea);
          tempArea.select();
          document.execCommand('copy');
          document.body.removeChild(tempArea);
        }

        const btnText = splashCopyBtn.querySelector('span');
        if (btnText) {
          const orig = btnText.textContent;
          btnText.textContent = 'Copied!';
          setTimeout(() => {
            btnText.textContent = orig;
          }, 2000);
        }
        showToast('King James Bible verse copied to clipboard! Share the Word.', 'success');
      } catch (e) {
        showToast('Unable to copy automatically.', 'error');
      }
    });
  }

  // Share verse via Web Share API or WhatsApp
  if (splashShareBtn) {
    splashShareBtn.addEventListener('click', async () => {
      if (!currentVerse.text) return;
      const shareData = {
        title: "Daily Bible Verse (KJV) - Saved by Grace Church",
        text: `“${currentVerse.text}” — ${currentVerse.reference} (KJV)\nSaved by Grace Church`,
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // Share was cancelled by user
        }
      } else {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + '\n' + shareData.url)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }

  // Download the verse as a shareable image
  const splashImageBtn = document.getElementById('splashImageBtn');

  const makeVerseImage = async () => {
    try {
      await Promise.all([
        document.fonts.load('700 40px Cinzel'),
        document.fonts.load('italic 400 60px "Playfair Display"'),
        document.fonts.load('600 24px "Plus Jakarta Sans"')
      ]);
    } catch (e) { }

    const logo = await new Promise(res => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => res(null);
      i.src = (typeof LOGO_DATA !== 'undefined') ? LOGO_DATA : 'images/sgc logo.png';
    });

    const W = 1080, H = 1350, GOLD = '#d4af37', GOLD_L = '#ecd068';
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.textAlign = 'center';
    x.textBaseline = 'alphabetic';

    // Background
    const bg = x.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#0f203c');
    bg.addColorStop(1, '#070e19');
    x.fillStyle = bg; x.fillRect(0, 0, W, H);

    const glow = x.createRadialGradient(W / 2, 520, 50, W / 2, 520, 750);
    glow.addColorStop(0, 'rgba(212,175,55,0.20)');
    glow.addColorStop(1, 'rgba(212,175,55,0)');
    x.fillStyle = glow; x.fillRect(0, 0, W, H);

    // Gold frame
    x.strokeStyle = 'rgba(212,175,55,0.55)';
    x.lineWidth = 3;
    x.strokeRect(40, 40, W - 80, H - 80);

    // Logo
    const logoSize = 150, logoY = 110;
    x.save();
    x.beginPath();
    x.arc(W / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    x.closePath();
    x.fillStyle = '#0a192f'; x.fill();
    x.clip();
    if (logo) x.drawImage(logo, W / 2 - logoSize / 2 + 8, logoY + 8, logoSize - 16, logoSize - 16);
    x.restore();
    x.beginPath();
    x.arc(W / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    x.strokeStyle = GOLD_L; x.lineWidth = 4; x.stroke();

    // Church title (white + gold)
    x.font = '700 44px Cinzel, Georgia, serif';
    if ('letterSpacing' in x) x.letterSpacing = '5px';
    const t1 = 'SAVED BY GRACE ', t2 = 'CHURCH';
    const w1 = x.measureText(t1).width, w2 = x.measureText(t2).width;
    const startX = (W - (w1 + w2)) / 2;
    x.textAlign = 'left';
    x.fillStyle = '#ffffff'; x.fillText(t1, startX, 340);
    x.fillStyle = GOLD_L; x.fillText(t2, startX + w1, 340);
    if ('letterSpacing' in x) x.letterSpacing = '0px';
    x.textAlign = 'center';

    // Motto
    x.font = '700 26px "Times New Roman", Times, serif';
    x.fillStyle = '#ffffff';
    x.fillText('“ Where People are Saved, Live and Grow by God\'s Grace ”', W / 2, 395);

    // Date badge
    const dateText = ('Daily Scripture • ' + (splashDate ? splashDate.textContent : '')).toUpperCase();
    x.font = '700 24px "Plus Jakarta Sans", sans-serif';
    if ('letterSpacing' in x) x.letterSpacing = '2px';
    const bw = x.measureText(dateText).width + 80, bh = 62, bx = (W - bw) / 2, by = 440, r = bh / 2;
    x.beginPath();
    x.moveTo(bx + r, by);
    x.arcTo(bx + bw, by, bx + bw, by + bh, r);
    x.arcTo(bx + bw, by + bh, bx, by + bh, r);
    x.arcTo(bx, by + bh, bx, by, r);
    x.arcTo(bx, by, bx + bw, by, r);
    x.closePath();
    x.fillStyle = 'rgba(212,175,55,0.12)'; x.fill();
    x.strokeStyle = 'rgba(212,175,55,0.45)'; x.lineWidth = 2; x.stroke();
    x.fillStyle = GOLD_L;
    x.fillText(dateText, W / 2, by + 40);
    if ('letterSpacing' in x) x.letterSpacing = '0px';

    // Divider line
    x.fillStyle = 'rgba(255,255,255,0.10)';
    x.fillRect(100, 560, W - 200, 2);

    // Quote mark
    x.font = '400 150px "Playfair Display", Georgia, serif';
    x.fillStyle = 'rgba(212,175,55,0.75)';
    x.fillText('“', W / 2, 700);

    // Verse text: shrinks automatically so long verses still fit
    const verse = `“${currentVerse.text}”`;
    const maxW = W - 220, top = 770, bottom = 1130;
    const wrap = (text) => {
      const lines = []; let line = '';
      text.split(' ').forEach(word => {
        const t = line ? line + ' ' + word : word;
        if (x.measureText(t).width > maxW && line) { lines.push(line); line = word; } else line = t;
      });
      lines.push(line);
      return lines;
    };
    let size = 64, lines, lh;
    for (; size >= 30; size -= 2) {
      x.font = `italic 400 ${size}px "Playfair Display", Georgia, serif`;
      lines = wrap(verse);
      lh = size * 1.45;
      if (lines.length * lh <= bottom - top) break;
    }
    x.fillStyle = '#fffdfa';
    const blockH = lines.length * lh;
    let y = top + ((bottom - top) - blockH) / 2 + size;
    lines.forEach(l => { x.fillText(l, W / 2, y); y += lh; });

    // Reference with small cross
    const refText = `${currentVerse.reference} (KJV)`.toUpperCase();
    x.font = '700 38px Cinzel, Georgia, serif';
    if ('letterSpacing' in x) x.letterSpacing = '2px';
    const rw = x.measureText(refText).width;
    const refX = W / 2 + 22, refY = 1200;
    x.fillStyle = GOLD_L;
    x.fillText(refText, refX, refY);
    if ('letterSpacing' in x) x.letterSpacing = '0px';
    const cx = refX - rw / 2 - 28, cy = refY - 16;
    x.fillRect(cx - 3, cy - 18, 6, 36);
    x.fillRect(cx - 12, cy - 8, 24, 6);

    // Footer
    x.font = '600 22px "Plus Jakarta Sans", sans-serif';
    x.fillStyle = '#94a3b8';
    x.fillText('Saved by Grace Church  •  L. Abellar St., Pasil, Cebu City', W / 2, 1258);

    // Website
    x.font = '700 26px "Plus Jakarta Sans", sans-serif';
    x.fillStyle = GOLD_L;
    x.fillText('savedbygracepasil.com', W / 2, 1294);

    return new Promise(res => c.toBlob(res, 'image/png'));
  };

  if (splashImageBtn) {
    splashImageBtn.addEventListener('click', async () => {
      if (!currentVerse.text) return;
      const original = splashImageBtn.innerHTML;
      splashImageBtn.disabled = true;
      splashImageBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Preparing...</span>';

      try {
        const blob = await makeVerseImage();
        const name = 'bible-verse-' + currentVerse.reference.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.png';
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1500);
        showToast('Verse image saved! Share it on social media.', 'success');
      } catch (err) {
        showToast('Could not create the image. Please try again.', 'error');
      }

      splashImageBtn.disabled = false;
      splashImageBtn.innerHTML = original;
    });
  }

  // Inspire Me / Random KJV Verse button
  if (splashNewVerseBtn) {
    splashNewVerseBtn.addEventListener('click', () => {
      const icon = splashNewVerseBtn.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
      fetchBibleVerse('random').finally(() => {
        if (icon) icon.classList.remove('fa-spin');
      });
    });
  }

  // Close / Dismiss Splash Page
  const closeSplash = () => {
    if (!splashScreen) return;

    if (splashRememberCheck && splashRememberCheck.checked) {
      try {
        localStorage.setItem(STORAGE_KEY, getTodayDateKey());
      } catch (e) { }
    }

    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      updateSpeechButton();
    }

    splashScreen.classList.add('hidden');
    splashScreen.classList.remove('show-forced');
    document.body.classList.remove('splash-active');

    // NEW: show announcements after the daily verse
    if (window.sgcShowAnnouncements) setTimeout(window.sgcShowAnnouncements, 450);
  };

  // Open Splash Page
  const openSplash = () => {
    if (!splashScreen) return;
    document.documentElement.classList.remove('splash-already-dismissed');
    splashScreen.classList.remove('hidden');
    splashScreen.classList.add('show-forced');
    document.body.classList.add('splash-active');

    if (!currentVerse.text) {
      fetchBibleVerse('daily');
    }
  };

  if (splashSkipBtn) splashSkipBtn.addEventListener('click', closeSplash);
  if (splashEnterBtn) splashEnterBtn.addEventListener('click', closeSplash);

  // Close when clicking directly on the backdrop outside the card
  if (splashScreen) {
    splashScreen.addEventListener('click', (e) => {
      if (e.target === splashScreen) {
        closeSplash();
      }
    });
  }

  // Close when pressing Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && splashScreen && !splashScreen.classList.contains('hidden')) {
      closeSplash();
    }
  });

  // Attach open triggers (Navbar, Top Bar, Mobile Menu)
  openSplashTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSplash();
    });
  });

  // Startup initialization
  const isDismissedToday = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === getTodayDateKey();
    } catch (e) {
      return false;
    }
  })();

  if (isDismissedToday) {
    if (splashScreen) splashScreen.classList.add('hidden');
    document.body.classList.remove('splash-active');
    // NEW:
    setTimeout(() => window.sgcShowAnnouncements && window.sgcShowAnnouncements(), 700);
  } else {
    if (splashScreen) {
      splashScreen.classList.remove('hidden');
      document.body.classList.add('splash-active');
      fetchBibleVerse('daily');
    }
  }

  /* ==========================================================================
    17b. ANNOUNCEMENTS FLASH PAGE (shows after the daily verse splash)
    ========================================================================== */
  const announceScreen = document.getElementById('announceScreen');

  if (announceScreen && typeof ANNOUNCEMENTS !== 'undefined') {
    const stage = document.getElementById('announceStage');
    const dotsEl = document.getElementById('announceDots');
    const prevBtn = document.getElementById('announcePrev');
    const nextBtn = document.getElementById('announceNext');
    const progress = document.getElementById('announceProgress');
    const remember = document.getElementById('announceRememberCheck');
    const card = announceScreen.querySelector('.announce-card');
    const KEY = 'sgc_announce_dismissed';

    // Local date (not UTC), so it flips at midnight in the Philippines
    const localDateKey = () => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    const today = localDateKey();
    const active = ANNOUNCEMENTS.filter(a => (!a.start || a.start <= today) && (!a.end || a.end >= today));
    const signature = today + '|' + active.map(a => a.id).join(',');
    const icons = { Event: 'fa-calendar-days', Service: 'fa-church', Prayer: 'fa-hands-praying', Youth: 'fa-users', Notice: 'fa-bullhorn' };
    const escA = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    let index = 0;
    let shownThisVisit = false;

    // Build slides + dots
    stage.innerHTML = active.map((a, i) => `
      <article class="announce-slide${i === 0 ? ' active' : ''}">
        <div class="announce-media${a.image ? '' : ' no-image'}">
          ${a.image
        ? `<img src="${escA(a.image)}" alt="${escA(a.title)}" onerror="this.parentNode.classList.add('no-image');this.outerHTML='<i class=&quot;fa-solid fa-bullhorn&quot;></i>'">`
        : `<i class="fa-solid ${icons[a.category] || icons.Notice}"></i>`}
        </div>
        <span class="announce-cat">${escA(a.category || 'Notice')}</span>
        <h4 class="announce-title">${escA(a.title)}</h4>
        <div class="announce-meta">
          ${a.date ? `<span><i class="fa-regular fa-calendar"></i> ${escA(a.date)}</span>` : ''}
          ${a.place ? `<span><i class="fa-solid fa-location-dot"></i> ${escA(a.place)}</span>` : ''}
        </div>
        <p class="announce-text">${escA(a.text || '')}</p>
        ${a.link ? `<a href="${escA(a.link)}" class="btn btn-outline-gold btn-sm announce-link">${escA(a.linkText || 'Learn More')}</a>` : ''}
      </article>`).join('');

    dotsEl.innerHTML = active.map((a, i) =>
      `<button type="button" class="announce-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Announcement ${i + 1}"></button>`).join('');

    const slides = Array.from(stage.children);
    const dots = Array.from(dotsEl.children);
    card.classList.toggle('is-single', active.length <= 1);

    // Keep the stage tall enough for the biggest slide
    const fitStage = () => {
      stage.style.minHeight = '';
      const tallest = Math.max(0, ...slides.map(s => { const was = s.className; s.style.position = 'relative'; const h = s.offsetHeight; s.style.position = ''; return h; }));
      if (tallest) stage.style.minHeight = tallest + 'px';
    };

    const restartProgress = () => {
      progress.classList.remove('run');
      void progress.offsetWidth;                 // restart the animation
      if (active.length > 1) progress.classList.add('run');
    };

    const go = (i) => {
      if (!slides.length) return;
      const next = (i + slides.length) % slides.length;
      slides[index].classList.remove('active');
      slides[index].classList.add('leaving');
      const old = slides[index];
      setTimeout(() => old.classList.remove('leaving'), 500);
      index = next;
      slides[index].classList.add('active');
      dots.forEach((d, n) => d.classList.toggle('active', n === index));
      restartProgress();
    };

    progress.addEventListener('animationend', () => go(index + 1));  // auto-advance
    prevBtn.addEventListener('click', () => go(index - 1));
    nextBtn.addEventListener('click', () => go(index + 1));
    dotsEl.addEventListener('click', (e) => {
      const d = e.target.closest('.announce-dot');
      if (d) go(Number(d.dataset.i));
    });

    const openAnnounce = () => {
      announceScreen.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      fitStage();
      go(0);
    };

    const closeAnnounce = () => {
      if (remember && remember.checked) {
        try { localStorage.setItem(KEY, signature); } catch (e) { }
      }
      announceScreen.classList.add('hidden');
      progress.classList.remove('run');
      document.body.style.overflow = '';
    };

    // Called automatically after the daily verse splash closes (once per visit)
    window.sgcShowAnnouncements = () => {
      if (shownThisVisit || !active.length) return;
      shownThisVisit = true;
      try { if (localStorage.getItem(KEY) === signature) return; } catch (e) { }
      openAnnounce();
    };

    // Manual buttons (optional): any element with class "open-announce-btn"
    document.querySelectorAll('.open-announce-btn').forEach(btn => {
      btn.addEventListener('click', (e) => { e.preventDefault(); closeMobileNav(); shownThisVisit = true; openAnnounce(); });
    });

    document.getElementById('announceClose').addEventListener('click', closeAnnounce);
    announceScreen.addEventListener('click', (e) => { if (e.target === announceScreen) closeAnnounce(); });
    announceScreen.querySelectorAll('.announce-link').forEach(l => l.addEventListener('click', closeAnnounce));
    window.addEventListener('keydown', (e) => {
      if (announceScreen.classList.contains('hidden')) return;
      if (e.key === 'Escape') closeAnnounce();
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    });
    window.addEventListener('resize', () => { if (!announceScreen.classList.contains('hidden')) fitStage(); });
  }

  /* ==========================================================================
     18. CHURCH MEMBERS MODAL
     ========================================================================== */
  const membersModal = document.getElementById('membersModal');
  const membersModalClose = document.getElementById('membersModalClose');

  const openMembersModal = () => {
    if (!membersModal) return;

    // Shuffle only when the modal is actually opening
    if (!membersModal.classList.contains('active')) {
      shuffleMemberCards();
      buildMemberMarquee(shuffleArray(marqueeOriginals));
    }

    membersModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMembersModal = () => {
    if (!membersModal) return;
    membersModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.open-members-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openMembersModal();
    });
  });

  if (membersModalClose) membersModalClose.addEventListener('click', closeMembersModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && membersModal && membersModal.classList.contains('active')) {
      closeMembersModal();
    }
  });

  /* ==========================================================================
    19. CHURCH HISTORY MODAL
    ========================================================================== */
  const historyModal = document.getElementById('historyModal');
  const historyModalClose = document.getElementById('historyModalClose');

  const openHistoryModal = () => {
    if (!historyModal) return;
    historyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeHistoryModal = () => {
    if (!historyModal) return;
    historyModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.open-history-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openHistoryModal();
    });
  });

  if (historyModalClose) historyModalClose.addEventListener('click', closeHistoryModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && historyModal && historyModal.classList.contains('active')) {
      closeHistoryModal();
    }
  });

  /* ==========================================================================
     19b. MOTTO & FIVE E'S MODALS
     ========================================================================== */
  const setupSimpleModal = (modalId, closeId, openSelector) => {
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);
    if (!modal) return;

    const open = () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    document.querySelectorAll(openSelector).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        open();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', close);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });
  };

  setupSimpleModal('mottoModal', 'mottoModalClose', '.open-motto-btn');
  setupSimpleModal('fiveEsModal', 'fiveEsModalClose', '.open-fivees-btn');

  /* ==========================================================================
     20. MEMBERS INFINITE PHOTO CAROUSEL
     ========================================================================== */
  const memberMarquee = document.getElementById('memberMarquee');
  const memberMarqueeTrack = document.getElementById('memberMarqueeTrack');

  // Keep the original (un-cloned) items so the carousel can be rebuilt in any order
  const marqueeOriginals = memberMarqueeTrack ? Array.from(memberMarqueeTrack.children) : [];

  // Fisher-Yates shuffle (returns a new array)
  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Shuffle the member cards inside the modal
  const shuffleMemberCards = () => {
    const grid = document.querySelector('#membersModal .team-grid');
    if (!grid) return;
    shuffleArray(Array.from(grid.children)).forEach(card => grid.appendChild(card));
  };

  // Build (or rebuild) the carousel in the given order
  const buildMemberMarquee = (order = marqueeOriginals) => {
    if (!memberMarquee || !memberMarqueeTrack || !order.length) return;

    memberMarqueeTrack.innerHTML = '';
    order.forEach(el => memberMarqueeTrack.appendChild(el.cloneNode(true)));

    const items = Array.from(memberMarqueeTrack.children);
    const itemWidth = items[0].offsetWidth +
      parseFloat(getComputedStyle(items[0]).marginRight || 0);

    // Repeat the members until one set is wider than the screen
    const target = Math.max(window.innerWidth, memberMarquee.offsetWidth) + itemWidth;
    const repeats = Math.max(1, Math.ceil(target / (itemWidth * items.length)));

    for (let r = 1; r < repeats; r++) {
      items.forEach(el => memberMarqueeTrack.appendChild(el.cloneNode(true)));
    }

    // Duplicate the whole set once so the -50% loop is seamless
    const oneSet = Array.from(memberMarqueeTrack.children);
    oneSet.forEach(el => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      memberMarqueeTrack.appendChild(clone);
    });

    // Constant speed (about 45px per second)
    const setWidth = itemWidth * oneSet.length;
    memberMarqueeTrack.style.setProperty('--marquee-duration', `${Math.round(setWidth / 45)}s`);
  };

  buildMemberMarquee(shuffleArray(marqueeOriginals));
  shuffleMemberCards(); // also shuffles the members list in the modal on page load

  /* SUNDAY SCHOOLERS REVERSE CAROUSEL */
  const schoolersMarquee = document.getElementById('schoolersMarquee');
  const schoolersTrack = document.getElementById('schoolersMarqueeTrack');
  const schoolersOriginals = schoolersTrack ? Array.from(schoolersTrack.children) : [];

  const buildSchoolersMarquee = (order = schoolersOriginals) => {
    if (!schoolersMarquee || !schoolersTrack || !order.length) return;

    schoolersTrack.innerHTML = '';
    order.forEach(el => schoolersTrack.appendChild(el.cloneNode(true)));

    const items = Array.from(schoolersTrack.children);
    const itemWidth = items[0].offsetWidth +
      parseFloat(getComputedStyle(items[0]).marginRight || 0);

    const target = Math.max(window.innerWidth, schoolersMarquee.offsetWidth) + itemWidth;
    const repeats = Math.max(1, Math.ceil(target / (itemWidth * items.length)));
    for (let r = 1; r < repeats; r++) {
      items.forEach(el => schoolersTrack.appendChild(el.cloneNode(true)));
    }

    const oneSet = Array.from(schoolersTrack.children);
    oneSet.forEach(el => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      schoolersTrack.appendChild(clone);
    });

    const setWidth = itemWidth * oneSet.length;
    schoolersTrack.style.setProperty('--marquee-duration', `${Math.round(setWidth / 35)}s`);
  };

  buildSchoolersMarquee(shuffleArray(schoolersOriginals));

  /* ==========================================================================
     CAROUSEL CENTER ZOOM (photo at the center grows to 150%)
     ========================================================================== */
  const enableCenterZoom = (marquee, maxScale = 1.3) => {
    if (!marquee) return;
    const track = marquee.querySelector('.member-marquee-track');
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (isMobile) return;

    // Only animate while the carousel is on screen
    let onScreen = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
      }).observe(marquee);
    }
    // remember each element's stagger delay so it can replay
    revealElements.forEach(el => {
      el.dataset.delay = el.style.getPropertyValue('--reveal-delay') || '0ms';
    });

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.style.setProperty('--reveal-delay', el.dataset.delay);
            el.classList.add('revealed');
            // clear the delay afterwards so hover effects aren't delayed
            setTimeout(() => el.style.setProperty('--reveal-delay', '0ms'), 1500);
          } else {
            // reset when it leaves the screen, so it can animate again
            el.style.setProperty('--reveal-delay', '0ms');
            el.classList.remove('revealed');
          }
        });
      }, { root: null, threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('revealed'));
    }

    const tick = () => {
      if (onScreen) {
        const box = marquee.getBoundingClientRect();
        const centerX = box.left + box.width / 2;

        Array.from(track.children).forEach(item => {
          const r = item.getBoundingClientRect();
          const radius = r.width * 1.25;                  // how close to the center the zoom starts
          const dist = Math.abs(r.left + r.width / 2 - centerX);
          const t = Math.max(0, 1 - dist / radius);
          const eased = t * t * (3 - 2 * t);              // smooth grow and shrink
          const scale = 1 + (maxScale - 1) * eased;

          item.style.setProperty('--center-scale', scale.toFixed(3));
          item.style.zIndex = Math.round(scale * 100);    // enlarged photo sits on top of its neighbors
        });
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  enableCenterZoom(document.getElementById('memberMarquee'));
  enableCenterZoom(document.getElementById('schoolersMarquee'));   // remove if you don't have this carousel

  /* ==========================================================================
     21. CAROUSEL CLICK -> OPEN MEMBERS MODAL
     ========================================================================== */
  const marqueeTrack = document.getElementById('memberMarqueeTrack');

  const slowScrollTo = (container, targetTop, duration = 1500) => {
    const startTop = container.scrollTop;
    const distance = targetTop - startTop;
    let startTime = null;

    // ease-in-out curve: starts slow, speeds up, ends slow
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    const step = (now) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      container.scrollTop = startTop + distance * ease(progress);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };


  const openMemberFromCarousel = (item) => {
    const name = (item.querySelector('.marquee-name')?.textContent || '').trim();
    const img = item.querySelector('.marquee-photo');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const highlightMember = () => {
      const cards = document.querySelectorAll('#membersModal .team-member');
      cards.forEach(c => c.classList.remove('member-highlight'));

      const match = Array.from(cards).find(c =>
        c.querySelector('.team-name')?.textContent.trim() === name
      );

      if (match) {
        const scroller = document.querySelector('#membersModal .modal-window');
        const cardTop = match.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
        const target = cardTop - (scroller.clientHeight - match.offsetHeight) / 2;
        slowScrollTo(scroller, Math.max(0, target), 1800);
        match.classList.add('member-highlight');
        setTimeout(() => match.classList.remove('member-highlight'), 2500);
      }
    };

    // No animation if the user prefers reduced motion or there is no image
    if (!img || reduceMotion) {
      openMembersModal();
      setTimeout(highlightMember, 250);
      return;
    }

    // 1. Create a flying clone at the exact position of the clicked photo
    const rect = img.getBoundingClientRect();
    const fly = document.createElement('img');
    fly.src = img.src;
    fly.alt = '';
    fly.className = 'fly-photo';
    fly.style.top = `${rect.top}px`;
    fly.style.left = `${rect.left}px`;
    fly.style.width = `${rect.width}px`;
    fly.style.height = `${rect.height}px`;
    document.body.appendChild(fly);

    // 2. Animate it to the center of the screen, larger
    const size = Math.min(220, window.innerWidth * 0.5);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fly.style.width = `${size}px`;
        fly.style.height = `${size}px`;
        fly.style.top = `${(window.innerHeight - size) / 2}px`;
        fly.style.left = `${(window.innerWidth - size) / 2}px`;
      });
    });

    // 3. Open the modal with a soft fade while the photo is in flight
    membersModal.classList.add('from-carousel');
    setTimeout(openMembersModal, 300);

    // 4. Fade the flying photo out, then highlight the member card
    setTimeout(() => {
      fly.style.opacity = '0';
      highlightMember();
    }, 650);

    // 5. Clean up
    setTimeout(() => {
      fly.remove();
      membersModal.classList.remove('from-carousel');
    }, 1100);
  };

  if (marqueeTrack) {
    // One listener on the track covers all cloned items too
    marqueeTrack.addEventListener('click', (e) => {
      const item = e.target.closest('.marquee-item');
      if (item) openMemberFromCarousel(item);
    });

    marqueeTrack.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const item = e.target.closest('.marquee-item');
      if (item) {
        e.preventDefault();
        openMemberFromCarousel(item);
      }
    });
  }

  /* ==========================================================================
     22. STATEMENT OF FAITH - STACKED CARDS
     ========================================================================== */
  const faithGrid = document.getElementById('faithGrid');
  const faithToggleBtn = document.getElementById('faithToggleBtn');

  if (faithGrid && faithToggleBtn) {
    const faithCards = Array.from(faithGrid.querySelectorAll('.faith-pillar-card'));
    const faithBtnText = faithToggleBtn.querySelector('span');
    let faithExpanded = false;

    // Columns match the CSS breakpoints: 3 / 2 / 1
    const getCols = () => (window.innerWidth <= 700 ? 1 : window.innerWidth <= 1100 ? 2 : 3);

    // Add a "+N more" badge to every card (only shown on top cards)
    faithCards.forEach(card => {
      const badge = document.createElement('span');
      badge.className = 'faith-stack-badge';
      card.appendChild(badge);
    });

    const layoutStack = () => {
      const cols = getCols();
      faithGrid.style.setProperty('--faith-cols', cols);

      faithCards.forEach((card, i) => {
        const depth = Math.floor(i / cols);
        card.style.setProperty('--col', (i % cols) + 1);
        card.style.setProperty('--depth', Math.min(depth, 3));
        card.style.setProperty('--i', i);
        card.classList.toggle('stack-top', depth === 0);
        card.classList.toggle('stack-hidden', depth > 2);

        if (depth === 0) {
          const inStack = Math.ceil((faithCards.length - (i % cols)) / cols);
          card.querySelector('.faith-stack-badge').textContent = `+${inStack - 1} more`;
        }
      });
    };

    const setFaithExpanded = (expand) => {
      faithExpanded = expand;
      faithToggleBtn.setAttribute('aria-expanded', String(expand));
      faithBtnText.textContent = expand ? 'Show Less' : 'Show All Beliefs';

      if (expand) {
        faithGrid.classList.remove('is-stacked');
        faithGrid.classList.add('is-fanning');
        setTimeout(() => faithGrid.classList.remove('is-fanning'), 1200);
      } else {
        faithGrid.classList.add('is-stacked');
        faithGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // Click any card (while stacked) or the button
    faithCards.forEach(card => {
      card.addEventListener('click', () => {
        if (!faithExpanded) setFaithExpanded(true);
      });
    });

    faithToggleBtn.addEventListener('click', () => setFaithExpanded(!faithExpanded));

    window.addEventListener('resize', layoutStack);

    layoutStack();
    faithGrid.classList.add('is-stacked');
  }
  /* ==========================================================================
     QUIZ: TEST YOUR KNOWLEDGE ABOUT SAVED BY GRACE CHURCH
     ========================================================================== */
  const quizModal = document.getElementById('quizModal');

  if (quizModal && typeof QUIZ_QUESTIONS !== 'undefined' && QUIZ_QUESTIONS.length) {
    const quizBody = document.getElementById('quizBody');
    const ROUND_SIZE = Math.min(10, QUIZ_QUESTIONS.length);
    const quizEsc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const quizShuffle = (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    let seen = new Set();      // questions already asked (no repeats until all are used)
    let round = [];
    let qIndex = 0;
    let score = 0;

    const pickRound = () => {
      let pool = QUIZ_QUESTIONS.map((_, i) => i).filter(i => !seen.has(i));
      if (pool.length < ROUND_SIZE) { seen = new Set(); pool = QUIZ_QUESTIONS.map((_, i) => i); }
      const chosen = quizShuffle(pool).slice(0, ROUND_SIZE);
      chosen.forEach(i => seen.add(i));
      return chosen.map(i => {
        const item = QUIZ_QUESTIONS[i];
        return {
          q: item.q,
          why: item.why || '',
          options: quizShuffle([{ t: item.a, ok: true }, ...item.w.map(t => ({ t, ok: false }))])
        };
      });
    };

    const renderIntro = () => {
      quizBody.innerHTML = `
        <div class="quiz-intro">
          <div class="quiz-intro-icon"><i class="fa-solid fa-lightbulb"></i></div>
          <p>Answer ${ROUND_SIZE} random multiple-choice questions about the history, beliefs, and ministries of Saved by Grace Church. Every round is different!</p>
          <button type="button" class="btn btn-primary btn-lg" id="quizStart"><i class="fa-solid fa-play"></i> Start Quiz</button>
        </div>`;
      document.getElementById('quizStart').addEventListener('click', startRound);
    };

    const startRound = () => {
      round = pickRound();
      qIndex = 0;
      score = 0;
      renderQuestion();
    };

    const renderQuestion = () => {
      const item = round[qIndex];
      const letters = ['A', 'B', 'C', 'D', 'E'];
      quizBody.innerHTML = `
        <div class="quiz-progress">
          <span>Question ${qIndex + 1} of ${round.length}</span>
          <span class="quiz-score-live">Score: ${score}</span>
        </div>
        <div class="quiz-bar"><span style="width:${(qIndex / round.length) * 100}%"></span></div>
        <h4 class="quiz-question">${quizEsc(item.q)}</h4>
        <div class="quiz-options">
          ${item.options.map((o, i) => `
            <button type="button" class="quiz-option" data-i="${i}">
              <span class="quiz-letter">${letters[i]}</span><span>${quizEsc(o.t)}</span>
            </button>`).join('')}
        </div>
        <div id="quizAfter"></div>`;

      quizBody.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => answer(Number(btn.dataset.i)));
      });
    };

    const answer = (picked) => {
      const item = round[qIndex];
      const isRight = item.options[picked].ok;
      if (isRight) score++;

      quizBody.querySelectorAll('.quiz-option').forEach((btn, i) => {
        btn.disabled = true;
        if (item.options[i].ok) btn.classList.add('correct');
        else if (i === picked) btn.classList.add('wrong');
        else btn.classList.add('dim');
      });

      const last = qIndex === round.length - 1;
      document.getElementById('quizAfter').innerHTML = `
        <div class="quiz-feedback">
          <strong>${isRight ? '✓ Correct!' : '✗ Not quite.'}</strong>
          ${quizEsc(item.why)}
        </div>
        <div class="quiz-actions">
          <button type="button" class="btn btn-primary btn-sm" id="quizNext">
            ${last ? 'See My Score' : 'Next Question'} <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>`;
      quizBody.querySelector('.quiz-score-live').textContent = `Score: ${score}`;
      document.getElementById('quizNext').addEventListener('click', () => {
        if (last) renderResult();
        else { qIndex++; renderQuestion(); }
      });
      document.getElementById('quizNext').focus();
    };

    const renderResult = () => {
      const pct = Math.round((score / round.length) * 100);
      let title = 'Keep Learning!';
      let msg = 'Visit our About section and history to learn more about our church family.';
      let icon = 'fa-book-open';
      if (pct >= 90) { title = 'Excellent!'; msg = 'You know Saved by Grace Church very well. Praise God!'; icon = 'fa-trophy'; }
      else if (pct >= 70) { title = 'Great Job!'; msg = 'You know our church well. Try another round to get them all.'; icon = 'fa-medal'; }
      else if (pct >= 50) { title = 'Good Effort!'; msg = 'You are on your way. Another round will help you learn more.'; icon = 'fa-star'; }

      quizBody.innerHTML = `
        <div class="quiz-result">
          <div class="quiz-intro-icon"><i class="fa-solid ${icon}"></i></div>
          <h4>${title}</h4>
          <div class="quiz-result-score">${score} / ${round.length}</div>
          <p>${msg}</p>
          <div class="quiz-actions">
            <button type="button" class="btn btn-primary" id="quizAgain"><i class="fa-solid fa-rotate"></i> Play Again</button>
            <button type="button" class="btn btn-secondary" id="quizDone">Close</button>
          </div>
        </div>`;
      document.getElementById('quizAgain').addEventListener('click', startRound);
      document.getElementById('quizDone').addEventListener('click', closeQuiz);
    };

    const openQuiz = () => {
      renderIntro();
      quizModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeQuiz = () => {
      quizModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.open-quiz-btn').forEach(btn => {
      btn.addEventListener('click', (e) => { e.preventDefault(); openQuiz(); });
    });
    document.getElementById('quizModalClose').addEventListener('click', closeQuiz);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && quizModal.classList.contains('active')) closeQuiz();
    });
  }
  /* ==========================================================================
     DISABLE RIGHT-CLICK, IMAGE DRAGGING AND COMMON SAVE SHORTCUTS
     ========================================================================== */
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });

  /* ==========================================================================
   CHURCH SONGS (list modal + lyrics modal + image/text download)
   ========================================================================== */
  const songsModal = document.getElementById('songsModal');
  const lyricsModal = document.getElementById('lyricsModal');


  if (songsModal && lyricsModal && typeof SONGS !== 'undefined') {
    const listEl = document.getElementById('songsList');
    const searchEl = document.getElementById('songSearch');
    const emptyEl = document.getElementById('songsEmpty');
    const countEl = document.getElementById('songsCount');
    const filterBtns = document.querySelectorAll('#songFilters .gallery-filter-btn');
    let songLang = 'all';
    let currentSong = null;

    const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const langLabel = (l) => (l === 'bisaya' ? 'Bisaya' : 'English');
    const lyricsText = (s) => s.lyrics.map(l => l.text).join('\n\n');
    const fileName = (s) => s.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'song';
    /* ---------- lyrics text size (A- / A+) ---------- */
    const SIZE_KEY = 'sgc_lyrics_scale';
    const SIZE_STEPS = [0.8, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2];
    const smallerBtn = document.getElementById('lyricsSmaller');
    const largerBtn = document.getElementById('lyricsLarger');
    const sizeVal = document.getElementById('lyricsSizeVal');
    const lyricsBodyEl = document.getElementById('lyricsBody');

    let sizeIndex = 2;   // 100%
    try {
      const saved = parseFloat(localStorage.getItem(SIZE_KEY));
      const found = SIZE_STEPS.indexOf(saved);
      if (found !== -1) sizeIndex = found;
    } catch (e) { }

    const applySize = () => {
      const scale = SIZE_STEPS[sizeIndex];
      lyricsBodyEl.style.setProperty('--lyrics-scale', scale);
      sizeVal.textContent = Math.round(scale * 100) + '%';
      smallerBtn.disabled = sizeIndex === 0;
      largerBtn.disabled = sizeIndex === SIZE_STEPS.length - 1;
      try { localStorage.setItem(SIZE_KEY, String(scale)); } catch (e) { }
    };

    smallerBtn.addEventListener('click', () => { if (sizeIndex > 0) { sizeIndex--; applySize(); } });
    largerBtn.addEventListener('click', () => { if (sizeIndex < SIZE_STEPS.length - 1) { sizeIndex++; applySize(); } });
    applySize();
    /* ---------- list ---------- */
    const renderList = () => {
      const q = searchEl.value.trim().toLowerCase();
      const list = SONGS
        .filter(s => (songLang === 'all' || s.language === songLang) &&
          (!q || [s.title, s.writer, lyricsText(s)].join(' ').toLowerCase().includes(q)))
        .sort((a, b) => a.title.localeCompare(b.title));

      listEl.innerHTML = list.map(s => `
      <button type="button" class="song-row" data-id="${s.id}">
          <span class="song-row-main">
          <span class="song-row-title">${esc(s.title)}</span>
          <span class="song-row-writer">${esc(s.writer)}</span>
        </span>
        <span class="song-lang-badge">${langLabel(s.language)}</span>
      </button>`).join('');

      emptyEl.style.display = list.length ? 'none' : 'block';
      countEl.textContent = `${list.length} song${list.length === 1 ? '' : 's'}`;
    };

    /* ---------- open / close ---------- */
    const showList = () => {
      lyricsModal.classList.remove('active');
      songsModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeAllSongs = () => {
      songsModal.classList.remove('active');
      lyricsModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    const openLyrics = (id) => {
      const s = SONGS.find(x => String(x.id) === String(id));
      if (!s) return;
      currentSong = s;

      document.getElementById('lyricsMeta').textContent = langLabel(s.language);
      document.getElementById('lyricsTitle').textContent = s.title;
      document.getElementById('lyricsWriter').textContent = s.writer;

      const hasLyrics = s.lyrics.length > 0;
      document.getElementById('lyricsBody').innerHTML = hasLyrics
        ? s.lyrics.map(l => `<div class="stanza${l.chorus ? ' chorus' : ''}">${esc(l.text)}</div>`).join('')
        : '<p>Lyrics are not displayed for this song. Please use the link below.</p>';
      document.getElementById('lyricsActions').style.display = hasLyrics ? 'flex' : 'none';

      const linkEl = document.getElementById('lyricsLink');
      linkEl.style.display = s.link ? 'inline-flex' : 'none';
      if (s.link) linkEl.href = s.link;

      songsModal.classList.remove('active');   // swap modals, keep page scroll locked
      lyricsModal.classList.add('active');
      lyricsModal.querySelector('.modal-window').scrollTop = 0;
      document.body.style.overflow = 'hidden';
    };

    document.querySelectorAll('.open-songs-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileNav();
        showList();
        if (window.innerWidth > 820) setTimeout(() => searchEl.focus(), 250);
      });
    });

    listEl.addEventListener('click', (e) => {
      const row = e.target.closest('.song-row');
      if (row) openLyrics(row.dataset.id);
    });

    document.getElementById('songsModalClose').addEventListener('click', closeAllSongs);
    document.getElementById('lyricsModalClose').addEventListener('click', showList);
    document.getElementById('lyricsBackBtn').addEventListener('click', showList);
    lyricsModal.addEventListener('click', (e) => {
      if (e.target === lyricsModal) showList();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (lyricsModal.classList.contains('active')) showList();
      else if (songsModal.classList.contains('active')) closeAllSongs();
    });

    searchEl.addEventListener('input', renderList);
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      songLang = btn.dataset.lang;
      renderList();
    }));

    /* ---------- downloads ---------- */
    const saveBlob = (blob, name) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    };

    document.getElementById('songTxtBtn').addEventListener('click', () => {
      if (!currentSong) return;
      const s = currentSong;
      const txt = `${s.title}\n${s.writer} (${langLabel(s.language)})\n\n${lyricsText(s)}\n\n— Saved by Grace Church`;
      saveBlob(new Blob([txt], { type: 'text/plain;charset=utf-8' }), `${fileName(s)}.txt`);
      showToast('Lyrics downloaded as a text file.', 'success');
    });

    document.getElementById('songCopyBtn').addEventListener('click', async () => {
      if (!currentSong) return;
      try {
        await navigator.clipboard.writeText(`${currentSong.title}\n\n${lyricsText(currentSong)}`);
        showToast('Lyrics copied to clipboard!', 'success');
      } catch (err) {
        showToast('Unable to copy automatically.', 'error');
      }
    });

    // Draws the lyrics onto a branded PNG (no extra library needed)
    const makeLyricsImage = async (s) => {
      try {
        await Promise.all([
          document.fonts.load('700 52px Cinzel'),
          document.fonts.load('400 32px Merriweather'),
          document.fonts.load('italic 400 32px Merriweather'),
          document.fonts.load('600 24px "Plus Jakarta Sans"')
        ]);
      } catch (e) { }

      const logo = await new Promise(res => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => res(null);
        i.src = (typeof LOGO_DATA !== 'undefined') ? LOGO_DATA : 'images/sgc logo.png';
      });

      const render = (useLogo) => {
        const W = 1080, P = 90, LH = 54, maxW = W - P * 2;
        const NAVY = '#0a192f', GOLD = '#b89324', SLATE = '#475569';
        const bodyFont = '400 32px Merriweather, Georgia, serif';
        const chorusFont = 'italic 400 32px Merriweather, Georgia, serif';
        const titleFont = '700 52px Cinzel, Georgia, serif';
        const c = document.createElement('canvas');
        const x = c.getContext('2d');

        const wrap = (text, font, w) => {
          x.font = font;
          const out = [];
          text.split('\n').forEach(p => {
            let line = '';
            p.split(' ').forEach(word => {
              const t = line ? line + ' ' + word : word;
              if (x.measureText(t).width > w && line) { out.push(line); line = word; } else line = t;
            });
            out.push(line);
          });
          return out;
        };

        const titleLines = wrap(s.title, titleFont, maxW);
        const blocks = s.lyrics.map(l => ({
          chorus: !!l.chorus,
          lines: wrap(l.text, l.chorus ? chorusFont : bodyFont, maxW - (l.chorus ? 30 : 0))
        }));

        const layout = (draw) => {
          let y = 60;
          x.textAlign = 'left';
          const brand = 'SAVED BY GRACE CHURCH';
          const brandFont = '700 28px Cinzel, Georgia, serif';
          const logoSize = 72, gap = 18;
          x.font = brandFont;
          const textW = x.measureText(brand).width;
          const showLogo = useLogo && logo;
          const groupW = (showLogo ? logoSize + gap : 0) + textW;
          const startX = (W - groupW) / 2;

          if (showLogo && draw) x.drawImage(logo, startX, y, logoSize, logoSize);
          if (draw) {
            x.font = brandFont;
            x.fillStyle = GOLD;
            x.fillText(brand, startX + (showLogo ? logoSize + gap : 0), y + logoSize / 2 + 10);
          }
          y += logoSize + 40;
          x.textAlign = 'center';
          titleLines.forEach(t => {
            y += 52;
            if (draw) { x.font = titleFont; x.fillStyle = NAVY; x.fillText(t, W / 2, y); }
            y += 12;
          });
          y += 24;
          if (draw) { x.font = '600 24px "Plus Jakarta Sans", sans-serif'; x.fillStyle = SLATE; x.fillText(`${s.writer}  •  ${langLabel(s.language)}`, W / 2, y); }
          y += 36;
          if (draw) { x.fillStyle = GOLD; x.fillRect(W / 2 - 60, y, 120, 3); }
          y += 70;
          x.textAlign = 'left';
          blocks.forEach(b => {
            if (draw && b.chorus) { x.fillStyle = GOLD; x.fillRect(P, y - 32, 4, b.lines.length * LH - 4); }
            b.lines.forEach(t => {
              if (draw) { x.font = b.chorus ? chorusFont : bodyFont; x.fillStyle = NAVY; x.fillText(t, P + (b.chorus ? 30 : 0), y); }
              y += LH;
            });
            y += 34;
          });
          y += 10;
          if (draw) {
            x.textAlign = 'center'; x.font = '600 22px "Plus Jakarta Sans", sans-serif'; x.fillStyle = SLATE;
            x.fillText('Saved by Grace Church  •  L. Abellar St., Pasil, Cebu City', W / 2, y);
          }
          y += 42;
          if (draw) {
            x.textAlign = 'center'; x.font = '700 26px "Plus Jakarta Sans", sans-serif'; x.fillStyle = GOLD;
            x.fillText('savedbygracepasil.com', W / 2, y);
          }
          return y + 70;
        };

        const H = layout(false);
        c.width = W; c.height = H;
        x.fillStyle = '#fffdfa'; x.fillRect(0, 0, W, H);
        x.fillStyle = GOLD; x.fillRect(0, 0, W, 12); x.fillRect(0, H - 12, W, 12);
        layout(true);
        return new Promise(res => c.toBlob(res, 'image/png'));   // throws if canvas is tainted
      };

      try { return await render(true); }
      catch (e) { return await render(false); }   // e.g. opened from file:// -> retry without logo
    };

    document.getElementById('songImageBtn').addEventListener('click', async () => {
      if (!currentSong) return;
      const btn = document.getElementById('songImageBtn');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing...';
      try {
        const blob = await makeLyricsImage(currentSong);
        saveBlob(blob, `${fileName(currentSong)}.png`);
        showToast('Lyrics image saved to your device.', 'success');
      } catch (err) {
        showToast('Could not create the image. Please try again.', 'error');
      }
      btn.disabled = false;
      btn.innerHTML = original;
    });

    renderList();
  }

});
