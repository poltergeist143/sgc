/**
 * SAVED BY GRACE CHURCH - OFFICIAL JAVASCRIPT
 * Modern, Interactive, Responsive Church Website Logic
 * Features: Mobile Nav, Smooth Scroll, Scrollspy, Reveal Animations,
 * Filterable Gallery & Lightbox, Sermon Player Modal, Event Countdown,
 * Interactive Modals (Visit, Ministry, Event), Form Validation, Toast System.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

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
     6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
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

  document.querySelectorAll('.open-event-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || 'Church Event';
      const date = btn.getAttribute('data-date') || 'Upcoming Date';
      const loc = btn.getAttribute('data-location') || 'Main Sanctuary, Saved by Grace Church';
      const desc = btn.getAttribute('data-desc') || 'Join us for worship, fellowship, and encouragement.';

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
    visitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('visitName')?.value || 'Guest';
      const serviceTime = document.getElementById('visitService')?.value || 'Sunday Service';

      visitModal.classList.remove('active');
      document.body.style.overflow = '';
      visitForm.reset();

      showToast(`Praise God, ${name}! We can't wait to welcome you for ${serviceTime}. A welcome packet has been emailed to you.`, 'success', 6000);
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

      if (!isValid) {
        showToast('Please fix the highlighted fields in the form.', 'error');
        return;
      }

      // Simulate sending
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        showToast('Grace and peace! Your message has been received. Our ministry pastoral team will get back to you shortly.', 'success', 6000);
      }, 1200);
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
        showToast('Thank you! You are now subscribed to Saved by Grace Church weekly devotionals.', 'success');
        newsletterForm.reset();
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
      splashListenBtn.innerHTML = '<i class="fa-solid fa-circle-stop text-gold"></i> <span>Stop Audio</span>';
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
  } else {
    if (splashScreen) {
      splashScreen.classList.remove('hidden');
      document.body.classList.add('splash-active');
      fetchBibleVerse('daily');
    }
  }

});
