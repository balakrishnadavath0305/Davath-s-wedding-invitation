/* ============================================================
   Wedding Invitation – app.js
   Madhu & Sravanthi | 14 May 2026
   ============================================================ */

/* ─── LANGUAGE TOGGLE ─────────────────────────────────────── */
let currentLang = localStorage.getItem('weddingLang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('weddingLang', lang);

  // Toggle body class for Telugu-wide font rules
  document.body.classList.toggle('lang-te', lang === 'te');
  document.documentElement.lang = lang === 'te' ? 'te' : 'en';

  document.querySelectorAll('.en').forEach(el => {
    el.style.display = lang === 'en' ? '' : 'none';
  });
  document.querySelectorAll('.te').forEach(el => {
    el.style.display = lang === 'te' ? '' : 'none';
  });

  document.getElementById('btnEn').classList.toggle('active', lang === 'en');
  document.getElementById('btnTe').classList.toggle('active', lang === 'te');

  // (No RSVP form inputs to update)

}

/* ─── COUNTDOWN TIMER ─────────────────────────────────────── */
function updateCountdown() {
  // 14 May 2026, 11:35 AM IST (UTC+5:30)
  const wedding = new Date('2026-05-14T11:35:00+05:30');
  const now     = new Date();
  const diff    = wedding - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent  = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent  = '00';
    document.getElementById('cd-secs').textContent  = '00';
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ─── FALLING PETALS ──────────────────────────────────────── */
(function initPetals() {
  const canvas = document.getElementById('petals');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PETAL_COUNT = 38;
  const COLORS = ['#C9A84C','#E8C76D','#9B7B2E','#FFF0D0','#FF6B8A','#FF8FA3','#FFB3C6'];
  const SHAPES = ['❤','✿','❀','✦','⬟'];

  const petals = Array.from({ length: PETAL_COUNT }, () => createPetal());

  function createPetal(fromTop = false) {
    return {
      x:       Math.random() * window.innerWidth,
      y:       fromTop ? -20 : Math.random() * window.innerHeight,
      size:    12 + Math.random() * 18,
      speed:   0.6 + Math.random() * 1.4,
      drift:   (Math.random() - 0.5) * 0.8,
      spin:    (Math.random() - 0.5) * 0.04,
      angle:   Math.random() * Math.PI * 2,
      opacity: 0.4 + Math.random() * 0.5,
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      shape:   SHAPES[Math.floor(Math.random() * SHAPES.length)],
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.font       = `${p.size}px serif`;
    ctx.fillStyle  = p.color;
    ctx.fillText(p.shape, 0, 0);
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.y     += p.speed;
      p.x     += p.drift;
      p.angle += p.spin;
      if (p.y > canvas.height + 30) Object.assign(p, createPetal(true));
      drawPetal(p);
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ─── SCROLL REVEAL ───────────────────────────────────────── */
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // Stagger sibling cards
        const delay = (e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Give siblings a staggered delay
    el.dataset.delay = (i % 3) * 120;
    obs.observe(el);
  });
})();




/* ─── SMOOTH NAV ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);

  // Subtle parallax on hero
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (hero) hero.style.backgroundPositionY = `${y * 0.35}px`;
  }, { passive: true });
});
