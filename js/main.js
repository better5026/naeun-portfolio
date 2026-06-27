/**
 * AI Portfolio — Interactions
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Particle Background ---- */
  const canvas = document.getElementById('particleCanvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(Math.floor(width * height / 18000), 45);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.1 + 0.4,
        opacity: Math.random() * 0.28 + 0.06,
      }));
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.035 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();
    window.addEventListener('resize', () => { resize(); createParticles(); });
  }

  /* ---- Navigation ---- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  const sections = document.querySelectorAll('section[id], footer[id]');

  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);

    if (navLinks) {
      const scrollPos = window.scrollY + (nav?.offsetHeight || 0) + 80;
      let current = '';
      sections.forEach((section) => {
        if (section.offsetTop <= scrollPos) current = section.id;
      });
      navLinks.querySelectorAll('a').forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---- Scroll Reveal ---- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          initSkillBars(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  function initSkillBars(container) {
    if (!container.classList.contains('skills-layout')) return;
    container.querySelectorAll('.skill-bar-fill').forEach((bar) => {
      const level = bar.dataset.level;
      if (level) bar.style.setProperty('--level', `${level}%`);
    });
  }

  /* ---- Pipeline Animation ---- */
  const pipelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          pipelineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('[data-pipeline]').forEach((el) => pipelineObserver.observe(el));

  /* ---- Publication Accordion ---- */
  document.querySelectorAll('.pub-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.pub-card');
      const isOpen = card.classList.contains('open');

      document.querySelectorAll('.pub-card.open').forEach((openCard) => {
        if (openCard !== card) {
          openCard.classList.remove('open');
          openCard.querySelector('.pub-toggle').setAttribute('aria-expanded', 'false');
        }
      });

      card.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---- Image Fallback ---- */
  document.querySelectorAll('.media-frame img').forEach((img) => {
    img.addEventListener('error', () => {
      const frame = img.closest('.media-frame');
      if (!frame || frame.classList.contains('media-frame--placeholder')) return;
      const alt = img.getAttribute('alt') || 'Image';
      frame.classList.add('media-frame--placeholder');
      frame.innerHTML = `<span>${alt}</span>`;
    });
  });

  /* ---- Smooth Scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
