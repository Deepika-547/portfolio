// ===================================================================
// Deepika Thota — Portfolio v2 interactions
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     Footer year
  --------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     Header scroll state
  --------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------------
     Mobile menu
  --------------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------------------------------------------------------------
     Scroll-spy navigation (active link highlight)
  --------------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => spyObserver.observe(section));
  }

  /* ---------------------------------------------------------------
     Reveal-on-scroll (with stagger)
  --------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  ['.hero-actions', '.cards-grid', '.cards-grid--certs', '.tech-grid', '.stats-row'].forEach(sel => {
    document.querySelectorAll(sel).forEach(parent => {
      Array.from(parent.children).forEach((child, i) => {
        if (child.hasAttribute('data-reveal')) child.style.setProperty('--stagger', i);
      });
    });
  });

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------
     Portfolio Showcase tabs
  --------------------------------------------------------------- */
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const tabIndicator = document.getElementById('tabIndicator');
  const panels = {
    projects: document.getElementById('panel-projects'),
    certificates: document.getElementById('panel-certificates'),
    techstack: document.getElementById('panel-techstack'),
  };

  function moveTabIndicator(tab) {
    if (!tab || !tabIndicator) return;
    const wrapRect = tab.parentElement.getBoundingClientRect();
    const rect = tab.getBoundingClientRect();
    tabIndicator.style.left = (rect.left - wrapRect.left) + 'px';
    tabIndicator.style.width = rect.width + 'px';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      moveTabIndicator(tab);

      Object.values(panels).forEach(p => p && p.classList.remove('active'));
      const target = panels[tab.getAttribute('data-tab')];
      if (target) {
        target.classList.add('active');
        // Reveal newly-shown cards
        target.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
      }
    });
  });

  if (tabs.length) {
    window.addEventListener('load', () => moveTabIndicator(document.querySelector('.tab.active')));
    window.addEventListener('resize', () => moveTabIndicator(document.querySelector('.tab.active')));
  }

  /* ---------------------------------------------------------------
     Animated stat counters
  --------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1000;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ---------------------------------------------------------------
     Contact form (Formspree AJAX submission)
  --------------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';
      status.textContent = '';
      status.className = 'form-status';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
          status.className = 'form-status success';
          form.reset();
        } else {
          status.textContent = 'Something went wrong. Please try again or email me directly.';
          status.className = 'form-status error';
        }
      } catch (err) {
        status.textContent = 'Network error. Please try again or email me directly.';
        status.className = 'form-status error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

});
