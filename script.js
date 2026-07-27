(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     Floating particles in hero
  --------------------------------------------------- */
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container || reduceMotion) return;
    const count = window.innerWidth < 600 ? 18 : 30;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = 2 + Math.random() * 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.setProperty('--drift', `${(Math.random() - 0.5) * 120}px`);
      const duration = 8 + Math.random() * 10;
      p.style.animationDuration = `${duration}s`;
      p.style.animationDelay = `${Math.random() * duration}s`;
      p.style.opacity = String(0.3 + Math.random() * 0.5);
      container.appendChild(p);
    }
  }

  /* ---------------------------------------------------
     Canvas network pulse — connectivity motif behind hero
  --------------------------------------------------- */
  function initPulseCanvas() {
    const canvas = document.getElementById('pulse-canvas');
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext('2d');
    let w, h, nodes, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.parentElement.offsetWidth;
      h = canvas.parentElement.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(38, Math.floor((w * h) / 26000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1 + Math.random() * 1.4
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(29,161,242,${0.16 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(111,208,255,0.55)';
        ctx.fill();
      }
      requestAnimationFrame(step);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------
     Ripple effect on download buttons
  --------------------------------------------------- */
  function initRipples() {
    document.querySelectorAll('.btn-download').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const ripple = btn.querySelector('.btn-download__ripple');
        if (!ripple) return;
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.4;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        ripple.classList.remove('is-active');
        // force reflow to restart animation
        void ripple.offsetWidth;
        ripple.classList.add('is-active');
      });
    });
  }

  /* ---------------------------------------------------
     Conversion tracking — fires on every "Download Now" /
     "Claim this price" tap, not just page load.
  --------------------------------------------------- */
  function initConversionTracking() {
    document.querySelectorAll('.btn-download').forEach((btn) => {
      btn.addEventListener('click', () => {
        const location = btn.closest('section')?.id || 'unknown';

        if (typeof fbq === 'function') {
          fbq('track', 'Lead', { content_name: 'download_click', section: location });
        }
        if (typeof gtag === 'function') {
          gtag('event', 'download_click', {
            event_category: 'engagement',
            event_label: location
          });
        }
      });
    });
  }

  /* ---------------------------------------------------
     Scroll-reveal for sections and cards
  --------------------------------------------------- */
  function initReveal() {
    const targets = document.querySelectorAll(
      '.glass-card, .review-card, .timeline__step, .section-title, .promo-card, .proof__phone, .proof__text'
    );
    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    targets.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)';
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------
     Nav background strengthens on scroll
  --------------------------------------------------- */
  function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => {
      nav.style.background = window.scrollY > 40
        ? 'rgba(8,28,45,0.85)'
        : 'rgba(8,28,45,0.45)';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initPulseCanvas();
    initRipples();
    initConversionTracking();
    initReveal();
    initNavScroll();
  });
})();
