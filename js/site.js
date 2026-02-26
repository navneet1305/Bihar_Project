(() => {
  const header = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');

  const setScrolled = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });

  const closeNav = () => {
    if (!header) return;
    header.classList.remove('nav-open');
    document.body.classList.remove('nav-open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
  };

  if (mobileMenuBtn && header && navLinks) {
    mobileMenuBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = header.classList.toggle('nav-open');
      document.body.classList.toggle('nav-open', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        const firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus({ preventScroll: true });
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeNav());
    });

    document.addEventListener('click', (event) => {
      if (!header.classList.contains('nav-open')) return;
      if (header.contains(event.target)) return;
      closeNav();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = new Set();
    const addTargets = (selector) => {
      document.querySelectorAll(selector).forEach((el) => revealTargets.add(el));
    };

    addTargets('main section');
    addTargets('main article');
    addTargets('.card, .stat-card, .destination-card, .food-card, .blog-card, .festival-card');
    addTargets('.detail-card, .plan-card, .info-card, .timeline-card, .roadmap-item');
    addTargets('.highlight-card, .gallery-card, .curated-card, .season-card, .culture-card');

    const skipSelector = '.hero-section, .blogs-hero, .detail-hero, .contact-hero, .gastronomy-hero, .destinations-hero, .festivals-hero, .history-hero, .plan-hero, .film-hero';

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          entry.target.addEventListener(
            'transitionend',
            () => {
              entry.target.classList.remove('reveal');
            },
            { once: true }
          );
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    revealTargets.forEach((el) => {
      if (el.matches(skipSelector) || el.closest(skipSelector)) return;
      el.classList.add('reveal');
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.9;
      if (inView) {
        el.classList.add('is-visible');
        el.classList.remove('reveal');
        return;
      }
      observer.observe(el);
    });
  }

  document.querySelectorAll('img').forEach((img, index) => {
    if (!img.hasAttribute('loading')) {
      img.loading = index === 0 ? 'eager' : 'lazy';
    }
    if (!img.hasAttribute('decoding')) {
      img.decoding = 'async';
    }
    if (index === 0 && !img.hasAttribute('fetchpriority')) {
      img.fetchPriority = 'high';
    }
  });

  document.querySelectorAll('iframe').forEach((frame) => {
    if (!frame.hasAttribute('loading')) {
      frame.loading = 'lazy';
    }
  });
})();
