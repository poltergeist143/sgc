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
    // Set target date: Annual Grace Revival Conference - April 27, 2027, 2:00 PM
    const targetDate = new Date(2027, 3, 27, 14, 0, 0);

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
     11. SERMON FILTER TABS & PLAYER MODAL
     ========================================================================== */
  const sermonFilterBtns = document.querySelectorAll('.sermon-filter-btn');
  const sermonCards = document.querySelectorAll('.sermon-card');
  const sermonModal = document.getElementById('sermonModal');
  const sermonModalClose = document.getElementById('sermonModalClose');
  const sermonModalTitle = document.getElementById('sermonModalTitle');
  const sermonModalSpeaker = document.getElementById('sermonModalSpeaker');
  const sermonModalScripture = document.getElementById('sermonModalScripture');

  sermonFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sermonFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      sermonCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.open-sermon-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.sermon-card');
      if (!card) return;

      const title = card.querySelector('.sermon-title')?.textContent || 'Church Sermon';
      const speaker = card.querySelector('.sermon-speaker')?.textContent || 'Pastor David Anderson';
      const scripture = card.querySelector('.sermon-scripture')?.textContent || 'Ephesians 2:8-9';

      if (sermonModalTitle) sermonModalTitle.textContent = title;
      if (sermonModalSpeaker) sermonModalSpeaker.textContent = speaker;
      if (sermonModalScripture) sermonModalScripture.textContent = scripture;

      if (sermonModal) {
        sermonModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (sermonModalClose) {
    sermonModalClose.addEventListener('click', () => {
      sermonModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  /* ==========================================================================
     12. MINISTRY DETAILS MODAL
     ========================================================================== */
  const ministryModal = document.getElementById('ministryModal');
  const ministryModalClose = document.getElementById('ministryModalClose');
  const ministryModalTitle = document.getElementById('ministryModalTitle');
  const ministryModalDesc = document.getElementById('ministryModalDesc');
  const ministryModalSchedule = document.getElementById('ministryModalSchedule');
  const ministryModalLeader = document.getElementById('ministryModalLeader');

  const ministryDetailsData = {
    'worship': {
      title: 'Worship Ministry',
      desc: 'Our Worship Ministry exists to exalt Jesus Christ, leading the congregation into genuine, transformative encounters with God through passionate praise, biblical hymns, and modern worship anthems.',
      schedule: 'Rehearsals: Thursdays at 7:00 PM | Sunday Soundcheck at 7:45 AM',
      leader: 'Marcus & Elena Sterling (Worship Directors)'
    },
    'youth': {
      title: 'Grace Generation Youth',
      desc: 'Grace Generation is an authentic, energizing community for 6th to 12th graders to discover God\'s grace, build lifelong friendships, and grow into courageous disciples of Christ.',
      schedule: 'Youth Night: Every Friday at 6:30 PM | Sunday Small Groups at 10:00 AM',
      leader: 'Pastor Joshua Rivera (Youth & Young Adults Pastor)'
    },
    'children': {
      title: 'Kingdom Kids Ministry',
      desc: 'Kingdom Kids provides a safe, joyful, and creative environment where babies, toddlers, and grade schoolers experience God’s love through scripture lessons, worship songs, and engaging crafts.',
      schedule: 'Sunday Morning Services: 9:00 AM & 11:00 AM (Check-in opens 20 mins prior)',
      leader: 'Hannah Henderson (Children\'s Ministry Director)'
    },
    'prayer': {
      title: 'Prayer & Intercession Ministry',
      desc: 'Prayer is the spiritual heartbeat of Saved by Grace Church. Our intercessory team continually brings our church family, community, and global missions before the throne of grace.',
      schedule: 'Midweek Prayer Meeting: Wednesdays at 7:00 PM | 24/7 Confidential Prayer Chain',
      leader: 'Elder Thomas Vance & Prayer Team'
    },
    'outreach': {
      title: 'Outreach & Missions Ministry',
      desc: 'Extending Christ’s hands and feet beyond our walls through monthly food pantries, homeless community meals, prison ministries, and annual international mission teams.',
      schedule: 'Community Blessing Pantry: 2nd & 4th Saturday mornings at 8:30 AM',
      leader: 'Deacon Caleb & Lydia Wright (Outreach Coordinators)'
    },
    'biblestudy': {
      title: 'Bible Study & Discipleship',
      desc: 'Rooted in the infallible Word of God, our discipleship groups foster deep scripture study, vulnerable fellowship, and everyday application in homes and classroom settings.',
      schedule: 'Men\'s & Women\'s Circles: Tuesdays 6:30 PM | Foundational Class: Sundays 10:00 AM',
      leader: 'Pastor David Anderson & Discipleship Elders'
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

});
