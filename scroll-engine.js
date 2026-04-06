/* ============================================================
   TraceMe — Scroll Animation Engine
   Progress bar · Parallax · Velocity Glitch · 3D Tilt
   Row Cascade · Scan Sweeps · Section Nav · Word Reveal
   ============================================================ */

(function ScrollEngine() {
  'use strict';

  // ── State ───────────────────────────────────────────────
  let lastScrollY = 0;
  let scrollVelocity = 0;
  let velocityHistory = [];
  let ticking = false;
  let glitchTimeout = null;
  let scanTimeouts = [];

  const progressBar = document.getElementById('scroll-progress');
  const headline    = document.querySelector('.glitch-text');
  const heroContent = document.querySelector('.hero-content');
  const heroBgRadar = document.querySelector('.hero-bg-radar');
  const matrixCanvas = document.getElementById('matrix-canvas');
  const sections    = ['hero', 'dashboard', 'education'];
  const navDots     = document.querySelectorAll('.nav-dot');

  // ── Scroll Progress Bar ──────────────────────────────────
  function updateProgress() {
    const doc = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  // ── Velocity Calculation ─────────────────────────────────
  function calcVelocity(currentY) {
    const delta = Math.abs(currentY - lastScrollY);
    velocityHistory.push(delta);
    if (velocityHistory.length > 5) velocityHistory.shift();
    scrollVelocity = velocityHistory.reduce((a, b) => a + b, 0) / velocityHistory.length;
    lastScrollY = currentY;
  }

  // ── Velocity Glitch on Headline ──────────────────────────
  function triggerVelocityGlitch(velocity) {
    if (!headline) return;
    if (velocity > 40) {
      headline.classList.add('velocity-glitch');
      clearTimeout(glitchTimeout);
      glitchTimeout = setTimeout(() => {
        headline.classList.remove('velocity-glitch');
      }, Math.min(velocity * 4, 600));
    }
  }

  // ── Parallax ─────────────────────────────────────────────
  function updateParallax(scrollY) {
    // Hero content moves up slower than scroll (parallax depth)
    if (heroContent) {
      const y = scrollY * 0.25;
      heroContent.style.transform = `translateY(${y}px)`;
    }
    // Radar bg drifts at a different rate
    if (heroBgRadar) {
      const y = scrollY * 0.15;
      heroBgRadar.style.transform = `translateY(calc(-50% + ${y}px))`;
    }
    // Matrix canvas opacity fades as you scroll away from hero
    if (matrixCanvas) {
      const fade = Math.max(0.02, 0.06 - scrollY * 0.00005);
      matrixCanvas.style.opacity = fade;
    }
  }

  // ── Section Nav Dots ─────────────────────────────────────
  function updateSectionNav(scrollY) {
    sections.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
      if (navDots[i]) navDots[i].classList.toggle('active', inView);
    });
  }

  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Bento Card Scan Sweep on Enter Viewport ──────────────
  const scanTargets = [
    { cardId: 'card-browser',  scanId: 'scan-browser' },
    { cardId: 'card-identity', scanId: 'scan-identity' },
  ];

  function triggerScan(scanEl) {
    if (!scanEl || scanEl.dataset.scanned) return;
    scanEl.dataset.scanned = '1';
    scanEl.classList.add('sweeping');
    setTimeout(() => scanEl.classList.remove('sweeping'), 1300);
  }

  const scanObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const scanId = entry.target.querySelector('.scan-line');
        if (scanId) {
          setTimeout(() => triggerScan(scanId), 300);
        }
        scanObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // ── Data Row Cascade ─────────────────────────────────────
  const rowObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const rows = entry.target.querySelectorAll('.data-row');
      rows.forEach((row, i) => {
        setTimeout(() => row.classList.add('row-visible'), i * 55);
      });
      rowObs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  // ── Section Title Word-by-word reveal ───────────────────
  function splitWords(el) {
    if (!el || el.dataset.split) return;
    el.dataset.split = '1';
    el.innerHTML = el.textContent.split(' ').map(
      (w, i) => `<span class="word" style="transition-delay:${i * 80}ms">${w}</span>`
    ).join(' ');
  }

  const titleObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const title = entry.target.querySelector('.section-title');
      if (title) {
        splitWords(title);
        setTimeout(() => title.classList.add('words-visible'), 50);
      }
      titleObs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  // ── 3D Magnetic Card Tilt ───────────────────────────────
  function initCardTilt() {
    document.querySelectorAll('.bento-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotX = -dy * 5;  // max 5deg
        const rotY =  dx * 5;
        card.classList.add('tilting');
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('tilting');
        card.style.transform = '';
      });
    });
  }

  // ── Horizontal Glowing Scan on fast scroll ───────────────
  let fastScrollScanScheduled = false;
  function scheduleFastScrollScan(velocity) {
    if (velocity < 25 || fastScrollScanScheduled) return;
    fastScrollScanScheduled = true;
    const cards = document.querySelectorAll('.bento-card');
    let delay = 0;
    cards.forEach(card => {
      const scanEl = card.querySelector('.scan-line');
      if (!scanEl) {
        // create temporary scan for cards that don't have one
        const s = document.createElement('div');
        s.className = 'scan-line';
        card.appendChild(s);
        setTimeout(() => {
          s.classList.add('sweeping');
          setTimeout(() => { s.classList.remove('sweeping'); card.removeChild(s); }, 1300);
        }, delay);
      } else {
        if (!scanEl.classList.contains('sweeping')) {
          setTimeout(() => {
            scanEl.classList.add('sweeping');
            setTimeout(() => scanEl.classList.remove('sweeping'), 1300);
          }, delay);
        }
      }
      delay += 80;
    });
    setTimeout(() => { fastScrollScanScheduled = false; }, 2000);
  }

  // ── Header Scroll Style ──────────────────────────────────
  function updateHeader(scrollY) {
    const header = document.getElementById('main-header');
    if (!header) return;
    if (scrollY > 60) {
      header.style.background = 'rgba(8,8,16,0.97)';
      header.style.boxShadow = '0 1px 24px rgba(124,58,237,0.12)';
    } else {
      header.style.background = '';
      header.style.boxShadow = '';
    }
  }

  // ── Background hue shift on deep scroll ─────────────────
  function updateBgShift(scrollY) {
    const body = document.body;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollY / Math.max(maxScroll, 1);
    // Subtle purple → dark-blue gradient shift
    const hue = 240 + pct * 20; // 240–260 range
    body.style.background = `hsl(${hue}, 20%, 4%)`;
  }

  // ── Reveal Observer (enhanced bi-directional) ────────────
  function initEnhancedReveal() {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay);
        }
        // Note: we intentionally don't remove 'visible' on un-intersect
        // to avoid content disappearing when scrolling back
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-left, .reveal-right').forEach(el => {
      revealObs.observe(el);
    });
  }

  // ── Master Scroll Handler ────────────────────────────────
  function onScroll() {
    const scrollY = window.scrollY;
    calcVelocity(scrollY);

    updateProgress();
    updateParallax(scrollY);
    updateSectionNav(scrollY);
    updateHeader(scrollY);
    updateBgShift(scrollY);
    triggerVelocityGlitch(scrollVelocity);
    scheduleFastScrollScan(scrollVelocity);

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    window.addEventListener('scroll', requestTick, { passive: true });

    // Set up observers for cards and rows
    document.querySelectorAll('.bento-card').forEach(card => {
      scanObs.observe(card);
      rowObs.observe(card);
    });

    // Section title reveals
    document.querySelectorAll('.bento-section, .edu-section').forEach(sec => {
      titleObs.observe(sec);
    });

    initCardTilt();
    initEnhancedReveal();

    // Initial tick
    onScroll();
  }

  // Wait for DOM + boot to be done
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Small delay so boot screen / main init runs first
    setTimeout(init, 200);
  }

})();
