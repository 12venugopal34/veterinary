/* ========== GSAP REGISTER FIRST ========== */
gsap.registerPlugin(ScrollTrigger);

/* ========== LENIS SMOOTH SCROLL (synced with GSAP ticker) ========== */
const lenis = new Lenis({
  duration: 1.0,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  wheelMultiplier: 1,
  touchMultiplier: 1.5
});

// Sync Lenis with GSAP ticker — single RAF loop, no conflict
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
gsap.from('.about-image', {
  x: -60, opacity: 0, duration: 0.8, ease: 'power2.out',
  scrollTrigger: { trigger: '.about-grid', start: 'top 75%', toggleActions: 'play none none none' }
});
gsap.from('.about-text', {
  x: 60, opacity: 0, duration: 0.8, ease: 'power2.out',
  scrollTrigger: { trigger: '.about-grid', start: 'top 75%', toggleActions: 'play none none none' }
});

/* ========== STATS COUNTER (RAF-based) ========== */
document.querySelectorAll('.stat-number').forEach(el => {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
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
// Services cards
gsap.from('.service-card', {
  y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
  scrollTrigger: { trigger: '.services-grid', start: 'top 80%', toggleActions: 'play none none none' }
});

// Team cards
gsap.from('.team-card', {
  y: 40, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
  scrollTrigger: { trigger: '.team-grid', start: 'top 80%', toggleActions: 'play none none none' }
});

// Gallery items
gsap.from('.gallery-item', {
  y: 30, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out',
  scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%', toggleActions: 'play none none none' }
});

// Process steps
gsap.from('.process-step', {
  y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
  scrollTrigger: { trigger: '.process-steps', start: 'top 80%', toggleActions: 'play none none none' }
});

// Blog cards
gsap.from('.blog-card', {
  y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
  scrollTrigger: { trigger: '.blog-grid', start: 'top 80%', toggleActions: 'play none none none' }
});

// Appointment section
gsap.from('.appointment-image', {
  x: -50, opacity: 0, duration: 0.8, ease: 'power2.out',
  scrollTrigger: { trigger: '.appointment-wrapper', start: 'top 75%', toggleActions: 'play none none none' }
});
gsap.from('.appointment-right', {
  x: 50, opacity: 0, duration: 0.8, ease: 'power2.out',
  scrollTrigger: { trigger: '.appointment-wrapper', start: 'top 75%', toggleActions: 'play none none none' }
});

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
    if (href === '#' || href === '#!') return; // skip logo/empty anchors
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    }
  });
});
