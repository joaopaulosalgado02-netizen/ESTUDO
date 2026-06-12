// ===== MENU MOBILE =====
const menuToggle = document.querySelector('.menu-toggle');
const navMobile = document.querySelector('.nav-mobile');
if (menuToggle && navMobile) {
  menuToggle.addEventListener('click', () => {
    navMobile.classList.toggle('open');
  });
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navMobile.classList.remove('open'));
  });
}

// ===== ANIMATED COUNTERS =====
function animateValue(el, end, suffix = '', prefix = '') {
  const duration = 1600;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(end * eased);
    el.textContent = prefix + value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const raw = entry.target.textContent.trim();
      const match = raw.match(/^([+]?)(\d+)(.*)$/);
      if (match) {
        const prefix = match[1];
        const num = parseInt(match[2], 10);
        const suffix = match[3];
        animateValue(entry.target, num, suffix, prefix);
      }
    }
  });
}, { threshold: 0.4 });
counters.forEach(c => counterObserver.observe(c));

// ===== REVEAL ON SCROLL =====
const revealTargets = document.querySelectorAll(
  '.diff-card, .mvv-card, .produto, .step, .sobre-content, .sobre-visual, .loc-info, .loc-map, .processo-head, .mvv-head, .produtos-head, .cta-inner'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => revealObserver.observe(el));

// ===== HEADER ON SCROLL =====
const headerPill = document.querySelector('.header-pill');
window.addEventListener('scroll', () => {
  if (!headerPill) return;
  if (window.scrollY > 30) {
    headerPill.style.background = 'rgba(255, 255, 255, 0.95)';
    headerPill.style.boxShadow = '0 14px 36px rgba(15, 23, 42, 0.14)';
  } else {
    headerPill.style.background = 'rgba(255, 255, 255, 0.85)';
    headerPill.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.08)';
  }
});

// ===== SMOOTH ANCHOR SCROLL =====
function smoothScrollTo(targetY, duration = 900) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();
  const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();

    const isMobileOpen = navMobile && navMobile.classList.contains('open');
    if (isMobileOpen) navMobile.classList.remove('open');

    const offset = 100;
    const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
    smoothScrollTo(targetY, 900);
  });
});
