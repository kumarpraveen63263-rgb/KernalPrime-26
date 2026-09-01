/* ═══════════════════════════════════════════════════════════════════
   KERNEL PRIME '26 — FLAGSHIP INTERACTIVE ENGINE
   - Cinematic Splash Video -> Frozen Hero Background Transformation
   - Alive PCB Circuit Canvas Engine (Signals, Nodes, Dust, Mouse Light)
   - Live Countdown, Glassmorphism Navbar, FAQ & Modal
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. CONFIG & EVENT TIMINGS ────────────────────────────────── */
  const SPLASH_DURATION = 2700;   // 2.7s hard cutoff for intro video
  const FADE_DURATION   = 350;    // ms
  const EVENT_DATE      = new Date('2026-10-08T09:00:00+05:30');

  /* ── 2. DOM ELEMENTS ─────────────────────────────────────────── */
  const splash        = document.getElementById('splash');
  const splashVideo   = document.getElementById('splashVideo');
  const splashOverlay = document.getElementById('splashOverlay');
  const skipSplashBtn = document.getElementById('skipSplashBtn');
  const mainSite      = document.getElementById('mainSite');
  const heroBg        = document.getElementById('heroBg');
  const navbar        = document.getElementById('navbar');
  const navToggle     = document.getElementById('navToggle');
  const navMenu       = document.getElementById('navMenu');
  const cursorLight   = document.getElementById('cursorLight');
  const brochureBtn   = document.getElementById('brochureBtn');
  const brochureModal = document.getElementById('brochureModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  /* ── 3. CINEMATIC SPLASH TO HERO VIDEO TRANSITION ─────────────── */
  let splashTransitioned = false;

  function transitionSplashToHero() {
    if (splashTransitioned) return;
    splashTransitioned = true;

    if (splashOverlay) splashOverlay.classList.add('fade-in');

    setTimeout(() => {
      if (splashVideo && heroBg) {
        splashVideo.pause();
        heroBg.appendChild(splashVideo);
      }

      if (splash) splash.classList.add('hidden');
      document.body.classList.remove('splash-active');

      if (mainSite) mainSite.classList.add('visible');
      if (navbar) navbar.classList.add('visible');

    }, FADE_DURATION);
  }

  if (splashVideo) {
    splashVideo.addEventListener('ended', transitionSplashToHero);
    
    let splashCutoffTimer = setTimeout(transitionSplashToHero, SPLASH_DURATION);
    splashVideo.addEventListener('ended', () => clearTimeout(splashCutoffTimer));
    splashVideo.addEventListener('error', () => {
      clearTimeout(splashCutoffTimer);
      transitionSplashToHero();
    });
  }

  if (skipSplashBtn) {
    skipSplashBtn.addEventListener('click', transitionSplashToHero);
  }

  /* ── 4. ANIMATED PCB CIRCUIT CANVAS BACKGROUND ───────────────── */
  (function initCircuitEngine() {
    const canvas = document.getElementById('circuitCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    let mouseX = W / 2;
    let mouseY = H / 2;
    let scrollY = 0;

    const GRID     = 80;    // px between circuit nodes
    const OFFSET   = 30;
    const MAX_PULS = 30;    // max traveling data pulses
    const DUST_CNT = 55;    // floating semiconductor particles

    let nodes = [];
    let edges = [];
    let edgeLookup = new Map();
    let pulses = [];
    let dustParticles = [];

    function buildGrid() {
      nodes = [];
      edges = [];
      pulses = [];
      edgeLookup.clear();

      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;

      const cols = Math.ceil((W - OFFSET) / GRID) + 1;
      const rows = Math.ceil((H - OFFSET) / GRID) + 1;
      const nodeMap = {};

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const n = {
            x: OFFSET + c * GRID,
            y: OFFSET + r * GRID,
            glow: 0,
            neighbors: []
          };
          nodes.push(n);
          nodeMap[`${c},${r}`] = n;
        }
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const a = nodeMap[`${c},${r}`];
          if (!a) continue;

          if (c < cols - 1 && Math.random() > 0.35) {
            const b = nodeMap[`${c + 1},${r}`];
            if (b) addTrace(a, b);
          }
          if (r < rows - 1 && Math.random() > 0.35) {
            const b = nodeMap[`${c},${r + 1}`];
            if (b) addTrace(a, b);
          }
        }
      }

      dustParticles = [];
      for (let i = 0; i < DUST_CNT; i++) {
        dustParticles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          size: Math.random() * 2 + 0.8,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.5 + 0.1,
          color: Math.random() > 0.6 ? '#00f0ff' : (Math.random() > 0.5 ? '#f5c518' : '#7b2ff7')
        });
      }
    }

    function addTrace(a, b) {
      const e = { a, b, glow: 0 };
      edges.push(e);
      a.neighbors.push({ node: b, edge: e });
      b.neighbors.push({ node: a, edge: e });
      edgeLookup.set(`${a.x},${a.y}:${b.x},${b.y}`, e);
      edgeLookup.set(`${b.x},${b.y}:${a.x},${a.y}`, e);
    }

    function spawnPulse() {
      if (pulses.length >= MAX_PULS || !nodes.length) return;
      const start = nodes[Math.floor(Math.random() * nodes.length)];
      if (!start.neighbors.length) return;

      const path = [start];
      let cur = start;
      let prev = null;
      const hops = 4 + Math.floor(Math.random() * 8);

      for (let i = 0; i < hops; i++) {
        const options = cur.neighbors.filter(nb => nb.node !== prev);
        if (!options.length) break;
        const chosen = options[Math.floor(Math.random() * options.length)];
        path.push(chosen.node);
        prev = cur;
        cur = chosen.node;
      }

      if (path.length < 2) return;

      const isGold = Math.random() > 0.75;
      const isPurple = Math.random() > 0.8;
      const color = isGold ? '#f5c518' : (isPurple ? '#7b2ff7' : '#00f0ff');

      pulses.push({
        path,
        segIdx: 0,
        progress: 0,
        speed: 0.012 + Math.random() * 0.02,
        color
      });
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    });

    function renderCanvas() {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, W, H);

      const mouseGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 420);
      mouseGrad.addColorStop(0, 'rgba(0, 240, 255, 0.065)');
      mouseGrad.addColorStop(0.5, 'rgba(123, 47, 247, 0.02)');
      mouseGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, W, H);

      const pY = (scrollY * 0.08) % H;

      for (const e of edges) {
        const y1 = e.a.y - pY;
        const y2 = e.b.y - pY;
        const alpha = 0.04 + e.glow * 0.25;

        ctx.beginPath();
        ctx.moveTo(e.a.x, y1);
        ctx.lineTo(e.b.x, y2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (e.glow > 0.01) e.glow *= 0.95;
      }

      for (const n of nodes) {
        if (n.neighbors.length < 2) continue;
        const ny = n.y - pY;
        const r = n.glow > 0.1 ? 2.5 + n.glow * 3 : 1.8;
        const a = n.glow > 0.1 ? 0.15 + n.glow * 0.6 : 0.08;

        ctx.beginPath();
        ctx.arc(n.x, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${a})`;
        ctx.fill();

        if (n.glow > 0.01) n.glow *= 0.96;
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          p.progress -= 1;
          p.segIdx++;
          if (p.segIdx >= p.path.length - 1) {
            pulses.splice(i, 1);
            continue;
          }
          p.path[p.segIdx].glow = 1;
        }

        const from = p.path[p.segIdx];
        const to   = p.path[p.segIdx + 1];
        const edge = edgeLookup.get(`${from.x},${from.y}:${to.x},${to.y}`);
        if (edge) edge.glow = Math.min(1, edge.glow + 0.6);

        const px = from.x + (to.x - from.x) * p.progress;
        const py = (from.y + (to.y - from.y) * p.progress) - pY;

        const trailT = Math.max(0, p.progress - 0.28);
        const tx = from.x + (to.x - from.x) * trailT;
        const ty = (from.y + (to.y - from.y) * trailT) - pY;

        const grad = ctx.createLinearGradient(tx, ty, px, py);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, p.color + 'dd');

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (const d of dustParticles) {
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.globalAlpha = d.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      requestAnimationFrame(renderCanvas);
    }

    buildGrid();
    window.addEventListener('resize', buildGrid);
    setInterval(() => { spawnPulse(); spawnPulse(); }, 250);
    renderCanvas();
  })();

  /* ── 5. CURSOR LIGHT FOLLOWING ──────────────────────────────── */
  window.addEventListener('mousemove', (e) => {
    if (cursorLight) {
      cursorLight.style.left = e.clientX + 'px';
      cursorLight.style.top  = e.clientY + 'px';
    }
  });

  /* ── 6. NAVBAR SCROLL STATE & MOBILE TOGGLE ─────────────────── */
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('active');
    });
  });

  /* ── 7. LIVE FLIP COUNTDOWN TIMER ────────────────────────────── */
  const daysEl    = document.getElementById('cd-days');
  const hoursEl   = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  const pad = n => String(n).padStart(2, '0');

  function updateCountdown() {
    const diff = EVENT_DATE - Date.now();
    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    if (daysEl) daysEl.textContent    = pad(Math.floor(diff / 86400000));
    if (hoursEl) hoursEl.textContent   = pad(Math.floor((diff % 86400000) / 3600000));
    if (minutesEl) minutesEl.textContent = pad(Math.floor((diff %  3600000) /   60000));
    if (secondsEl) secondsEl.textContent = pad(Math.floor((diff %    60000) /    1000));
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ── 8. FAQ ACCORDION TOGGLE ────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const toggleBtn = item.querySelector('.faq-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  /* ── 9. BROCHURE MODAL ─────────────────────────────────────── */
  if (brochureBtn && brochureModal) {
    brochureBtn.addEventListener('click', (e) => {
      e.preventDefault();
      brochureModal.classList.add('open');
    });
  }

  if (closeModalBtn && brochureModal) {
    closeModalBtn.addEventListener('click', () => {
      brochureModal.classList.remove('open');
    });
  }

  if (brochureModal) {
    brochureModal.addEventListener('click', (e) => {
      if (e.target === brochureModal) {
        brochureModal.classList.remove('open');
      }
    });
  }

  /* ── 10. 3D GLASS CARD TILT EFFECT ───────────────────────────── */
  const tiltCards = document.querySelectorAll('.tilt-card, .glass-card, .glance-card, .problem-glass-card, .roadmap-node-card, .prize-tier-card, .prize-col-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });

  /* ── 11. SCROLL PROGRESS & INTERSECTION OBSERVER ────────────── */
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.glance-card, .glass-card, .problem-glass-card, .roadmap-node-card, .prize-tier-card, .prize-col-card, .mentor-profile-card, .faq-item').forEach(el => {
    scrollObserver.observe(el);
  });

  /* Roadmap Progress Line Calculator */
  window.addEventListener('scroll', () => {
    const roadmapWrapper = document.querySelector('.roadmap-timeline-wrapper');
    const fillBar = document.getElementById('roadmapProgressFill');

    if (roadmapWrapper && fillBar) {
      const rect = roadmapWrapper.getBoundingClientRect();
      const winH = window.innerHeight;
      const totalH = rect.height;

      if (rect.top <= winH && rect.bottom >= 0) {
        const scrolled = Math.max(0, winH - rect.top);
        const percent = Math.min(100, (scrolled / (totalH + winH * 0.3)) * 100);
        fillBar.style.height = `${percent}%`;
      }
    }
  });

})();
