/* ============================================
   Christian Hospital Sialkot - Main JavaScript
   ============================================ */


'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================
     1. STICKY HEADER
     ============================================ */
  const header = document.querySelector('.site-header');
  if (header) {
    function handleScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load
  }

  /* ============================================
     2. HAMBURGER MOBILE MENU
     ============================================ */
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  let navOverlay = document.querySelector('.nav-overlay');

  // Create overlay if not present
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  function openNav() {
    hamburger.classList.add('active');
    mainNav.classList.add('open');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    hamburger.classList.remove('active');
    mainNav.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      if (mainNav.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
  }

  // Close nav when a link is clicked
  if (mainNav) {
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ============================================
     3. ACTIVE NAV LINK
     ============================================ */
  (function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage ||
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  /* ============================================
     4. COUNTER ANIMATION
     ============================================ */
  function animateCounter(el, target, duration, suffix) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(function () {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start) + suffix;
    }, 16);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const target = parseInt(entry.target.dataset.counter, 10);
          const suffix = entry.target.dataset.suffix || '';
          const duration = parseInt(entry.target.dataset.duration || '2000', 10);
          animateCounter(entry.target, target, duration, suffix);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  initCounters();

  /* ============================================
     5. SCROLL REVEAL ANIMATION
     ============================================ */
  function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  initReveal();

  /* ============================================
     6. SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     7. DOCTOR SEARCH & FILTER
     ============================================ */
  const doctorSearch = document.getElementById('doctorSearch');
  const doctorFilter = document.getElementById('doctorFilter');
  const doctorCards = document.querySelectorAll('.doctor-card');

  function filterDoctors() {
    const query = doctorSearch ? doctorSearch.value.toLowerCase().trim() : '';
    const specialty = doctorFilter ? doctorFilter.value.toLowerCase() : '';

    doctorCards.forEach(function (card) {
      const name = (card.querySelector('h3') ? card.querySelector('h3').textContent : '').toLowerCase();
      const spec = (card.querySelector('.doctor-specialty') ? card.querySelector('.doctor-specialty').textContent : '').toLowerCase();
      const matchesSearch = !query || name.includes(query) || spec.includes(query);
      const matchesFilter = !specialty || spec.includes(specialty);
      card.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
    });
  }

  if (doctorSearch) doctorSearch.addEventListener('input', filterDoctors);
  if (doctorFilter) doctorFilter.addEventListener('change', filterDoctors);

  /* ============================================
     8. CONTACT FORM HANDLING — FormSubmit.co
        Delivers to himanshu6245554@gmail.com
     ============================================ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {

    // Set _next to current page so user returns here after submit
    const nextField = document.getElementById('nextField');
    if (nextField) nextField.value = window.location.href;

    contactForm.addEventListener('submit', function (e) {

      const nameField    = contactForm.querySelector('#name');
      const emailField   = contactForm.querySelector('#email');
      const messageField = contactForm.querySelector('#message');
      let valid = true;

      // Validate required fields
      [nameField, emailField, messageField].forEach(function (field) {
        if (field && !field.value.trim()) {
          field.style.borderColor = '#ef4444';
          field.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.15)';
          valid = false;
        } else if (field) {
          field.style.borderColor = '';
          field.style.boxShadow   = '';
        }
      });

      if (emailField && emailField.value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.style.borderColor = '#ef4444';
        emailField.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.15)';
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
        // Scroll to first error
        const firstErr = contactForm.querySelector('[style*="ef4444"]');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Show loading state — form will naturally POST to FormSubmit.co
      const submitBtn = document.getElementById('contactSubmitBtn');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled  = true;
      }
      // Let the browser submit the form normally to FormSubmit.co
    });

    // Clear error highlights on input
    contactForm.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
        this.style.boxShadow   = '';
      });
    });
  }

  /* ============================================
     9. BACK TO TOP BUTTON
     ============================================ */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.style.opacity = '1';
        backToTop.style.pointerEvents = 'auto';
        backToTop.style.transform = 'translateY(0)';
      } else {
        backToTop.style.opacity = '0';
        backToTop.style.pointerEvents = 'none';
        backToTop.style.transform = 'translateY(10px)';
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     10. DEPARTMENT CARD "LEARN MORE" LINKS
     ============================================ */
  document.querySelectorAll('.dept-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (!e.target.closest('a')) {
        window.location.href = 'departments.html';
      }
    });
  });

  /* ============================================
     11. LAZY LOAD IMAGES / PLACEHOLDERS
     ============================================ */
  // Add fade-in to all news card images, info cards, etc.
  document.querySelectorAll('.dept-card, .why-card, .news-card, .doctor-card, .value-card, .accred-card').forEach(function (el, i) {
    el.style.animationDelay = (i * 0.06) + 's';
    el.classList.add('reveal');
  });

  // Re-init after adding reveal classes
  initReveal();

  /* ============================================
     12. WINDOW RESIZE HANDLER
     ============================================ */
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 991) {
        closeNav();
      }
    }, 150);
  });

});
