/* ============================================================
   ProClean Germany — Main Application Script
============================================================ */

(function () {
  'use strict';

  // ── Loader ────────────────────────────────────────────────
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }, 1600);
  });

  // ── Sticky Navbar ────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = y;

    // Back to top visibility
    const btt = document.getElementById('backToTop');
    if (btt) {
      btt.classList.toggle('visible', y > 400);
    }
  }, { passive: true });

  // ── Mobile Menu ──────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a, button.lang-btn').forEach(el => {
      el.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Back to Top ──────────────────────────────────────────
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Smooth Scroll for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Intersection Observer: Animate on scroll ─────────────
  const animateEls = document.querySelectorAll('[data-animate]');
  const ioOptions  = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('animated'), delay);
      animateObserver.unobserve(el);
    });
  }, ioOptions);

  animateEls.forEach(el => animateObserver.observe(el));

  // ── Counter Animation ─────────────────────────────────────
  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const step     = 16;
    const steps    = Math.ceil(duration / step);
    let current    = 0;
    let count       = 0;

    const timer = setInterval(() => {
      count++;
      current = Math.round(easeOut(count / steps) * target);
      el.textContent = current.toLocaleString('de-DE') + (suffix || '');
      if (count >= steps) {
        el.textContent = target.toLocaleString('de-DE') + (suffix || '');
        clearInterval(timer);
      }
    }, step);
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  const counterEls = document.querySelectorAll('.trust-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));

  // ── Before / After Slider ────────────────────────────────
  const baSlider = document.querySelector('.ba-slider-wrap');
  const baAfter  = document.getElementById('baAfter');
  const baHandle = document.getElementById('baHandle');

  if (baSlider && baAfter && baHandle) {
    let dragging = false;

    function setPosition(clientX) {
      const rect  = baSlider.getBoundingClientRect();
      let   pos   = (clientX - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      const pct = (pos * 100).toFixed(1) + '%';
      baAfter.style.width  = pct;
      baHandle.style.left  = pct;
    }

    baHandle.addEventListener('mousedown',  () => { dragging = true; });
    baSlider.addEventListener('mousedown',  (e) => { dragging = true; setPosition(e.clientX); });
    window .addEventListener('mousemove',  (e) => { if (dragging) setPosition(e.clientX); });
    window .addEventListener('mouseup',    () => { dragging = false; });

    baSlider.addEventListener('touchstart', (e) => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
    window .addEventListener('touchmove',  (e) => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
    window .addEventListener('touchend',   () => { dragging = false; });

    // Animate handle into position on scroll
    const baObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        let pos = 80;
        const anim = setInterval(() => {
          pos -= 1;
          baAfter.style.width = pos + '%';
          baHandle.style.left = pos + '%';
          if (pos <= 50) clearInterval(anim);
        }, 20);
        baObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    baObserver.observe(baSlider);
  }

  // ── Testimonials Carousel ────────────────────────────────
  const track  = document.getElementById('testimonialsTrack');
  const dotsEl = document.getElementById('tcDots');
  const btnPrev= document.getElementById('tcPrev');
  const btnNext= document.getElementById('tcNext');

  if (track && dotsEl && btnPrev && btnNext) {
    const cards    = track.querySelectorAll('.testimonial-card');
    let   perView  = getPerView();
    let   current  = 0;
    let   total    = Math.ceil(cards.length / perView);
    let   autoTimer;

    function getPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640)  return 2;
      return 1;
    }

    function buildDots() {
      dotsEl.innerHTML = '';
      total = Math.ceil(cards.length / perView);
      for (let i = 0; i < total; i++) {
        const d = document.createElement('div');
        d.className = 'tc-dot' + (i === current ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
      }
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, total - 1));
      const offset = current * perView;
      const cardW  = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${offset * cardW}px)`;
      dotsEl.querySelectorAll('.tc-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAuto() {
      autoTimer = setInterval(() => {
        goTo(current >= total - 1 ? 0 : current + 1);
      }, 5000);
    }

    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    btnNext.addEventListener('click', () => { goTo(current >= total - 1 ? 0 : current + 1); resetAuto(); });
    btnPrev.addEventListener('click', () => { goTo(current <= 0 ? total - 1 : current - 1); resetAuto(); });

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? btnNext.click() : btnPrev.click(); }
    });

    window.addEventListener('resize', () => {
      const newPer = getPerView();
      if (newPer !== perView) {
        perView = newPer;
        current = 0;
        buildDots();
        goTo(0);
      }
    });

    buildDots();
    startAuto();
  }

  // ── Quote Form ──────────────────────────────────────────
  const form    = document.getElementById('quoteForm');
  const success = document.getElementById('formSuccess');

  if (form && success) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      if (!validateForm(form)) return;

      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Sending…';

      // Simulate async submission
      setTimeout(() => {
        form.classList.add('hidden');
        form.style.display = 'none';
        success.classList.remove('hidden');
      }, 1200);
    });
  }

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#ef4444';
        field.style.boxShadow   = '0 0 0 3px rgba(239,68,68,.1)';
        valid = false;
      }
    });
    return valid;
  }

  // ── Language switcher (UI only) ──────────────────────────
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ── Service card micro-interaction: ripple on click ──────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const rect    = this.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const ripple  = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;left:${x}px;top:${y}px;
        width:4px;height:4px;border-radius:50%;
        background:rgba(27,79,216,.2);
        transform:translate(-50%,-50%) scale(0);
        animation:rippleAnim .6s ease forwards;
        pointer-events:none;z-index:10;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Add ripple keyframes dynamically
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = '@keyframes rippleAnim{to{transform:translate(-50%,-50%) scale(60);opacity:0}}';
    document.head.appendChild(style);
  }

  // ── Parallax on hero (subtle) ─────────────────────────────
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroGrid.style.transform = `translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

  // ── Active nav link highlight ────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + id
            ? 'rgba(255,255,255,1)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

})();
