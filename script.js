/* ========== GSAP REGISTER FIRST ========== */
gsap.registerPlugin(ScrollTrigger);

/* ========== LENIS SMOOTH SCROLL (synced with GSAP ticker) ========== */
const lenis = new Lenis({
  duration: 1.0,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  wheelMultiplier: 1,
  touchMultiplier: 1.5
});

// Sync Lenis with GSAP ticker — single RAF loop
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* ========== NAVBAR (throttled) ========== */
const navbar = document.querySelector('.navbar');
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

mobileToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  mobileToggle.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    mobileToggle.classList.remove('open');
  });
});

/* ========== HELPER: safe scroll animation ========== */
function animateIn(selector, fromVars, triggerEl) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  // Set initial hidden state via class
  elements.forEach(el => el.classList.add('gs-hidden'));

  gsap.from(selector, {
    ...fromVars,
    scrollTrigger: {
      trigger: triggerEl || selector,
      start: 'top 85%',
      toggleActions: 'play none none none',
      onEnter: () => {
        elements.forEach(el => el.classList.remove('gs-hidden'));
      }
    }
  });

  // Fallback: make visible after 3s no matter what
  setTimeout(() => {
    elements.forEach(el => el.classList.remove('gs-hidden'));
  }, 3000);
}

/* ========== HERO ANIMATIONS ========== */
const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTL
  .to('.hero-content h1', { opacity: 1, y: 0, duration: 1, delay: 0.2 })
  .to('.hero-content p', { opacity: 1, y: 0, duration: 1 }, '-=0.7')
  .to('.btn-primary', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');

// Hero parallax
gsap.to('.hero-bg', {
  yPercent: 15,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 }
});

/* ========== ABOUT SECTION ========== */
animateIn('.about-image', { x: -60, opacity: 0, duration: 0.8, ease: 'power2.out' }, '.about-grid');
animateIn('.about-text', { x: 60, opacity: 0, duration: 0.8, ease: 'power2.out' }, '.about-grid');

/* ========== STATS COUNTER ========== */
document.querySelectorAll('.stat-number').forEach(el => {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    onEnter: () => {
      const duration = 1500;
      const startTime = performance.now();
      function updateCounter(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - (1 - progress) * (1 - progress);
        el.textContent = Math.floor(easedProgress * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(updateCounter);
      }
      requestAnimationFrame(updateCounter);
    },
    once: true
  });
});

/* ========== SCROLL-IN ANIMATIONS ========== */
animateIn('.service-card', { y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '.services-grid');
animateIn('.team-card', { y: 40, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '.team-grid');
animateIn('.gallery-item', { y: 30, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, '.gallery-grid');
animateIn('.process-step', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '.process-steps');
animateIn('.blog-card', { y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '.blog-grid');
animateIn('.appointment-image', { x: -50, opacity: 0, duration: 0.8, ease: 'power2.out' }, '.appointment-wrapper');
animateIn('.appointment-right', { x: 50, opacity: 0, duration: 0.8, ease: 'power2.out' }, '.appointment-wrapper');

// Force a ScrollTrigger refresh after everything is set up
ScrollTrigger.refresh();

/* ========== SWIPER TESTIMONIALS ========== */
new Swiper('.testimonial-swiper', {
  slidesPerView: 1,
  spaceBetween: 32,
  loop: true,
  autoplay: { delay: 5000, disableOnInteraction: false },
  effect: 'fade',
  fadeEffect: { crossFade: true },
  pagination: { el: '.swiper-pagination', clickable: true },
  speed: 600
});

/* ========== LIGHTBOX ========== */
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');
const lightboxClose = lightbox.querySelector('.lightbox-close');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lenis.stop();
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox(); });

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lenis.start();
}

/* ========== FORM SUBMISSION ========== */
const form = document.getElementById('appointmentForm');
const formSuccess = document.querySelector('.form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.style.display = 'none';
  formSuccess.classList.add('show');
  setTimeout(() => {
    form.style.display = '';
    formSuccess.classList.remove('show');
    form.reset();
  }, 4000);
});

/* ========== SMOOTH ANCHOR SCROLL ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#' || href === '#!') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    }
  });
});
