/* ════════════════════════════════════════════════════════════
   franchise.js — Aha Yemi Ruchulu Franchise Page
   Particles · Scroll reveals · Counters · Testimonials 
   FAQ · Form · Timeline · Support scroll
════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHeroParticles();
    initScrollReveal();
    initCounters();
    initSupportScroll();
    initTimeline();
    initTestimonials();
    initFAQ();
    initFloatingForm();
    initEnquiryParticles();
    setActiveFAQ();
  });
  
  /* ════════════════════════════════════════
     NAVBAR — scroll behaviour
  ════════════════════════════════════════ */
  function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const check = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', check, { passive: true });
    check();
  
    // Mobile hamburger
    const ham   = document.getElementById('hamburger');
    const mob   = document.getElementById('mobile-menu');
    const close = document.getElementById('mobile-close');
    if (ham && mob) {
      ham.addEventListener('click',   () => mob.classList.add('open'));
      close?.addEventListener('click', () => mob.classList.remove('open'));
      mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mob.classList.remove('open')));
    }
  
    // Smooth anchor clicks
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  }
  
  /* ════════════════════════════════════════
     HERO PARTICLES — gold canvas particles
  ════════════════════════════════════════ */
  function initHeroParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const COUNT  = window.innerWidth < 768 ? 45 : 80;
    let particles = [];
    let W, H;
  
    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); });
  
    class Particle {
      constructor() { this.reset(true); }
      reset(initial) {
        this.x  = Math.random() * W;
        this.y  = initial ? Math.random() * H : H + 5;
        this.vy = -(Math.random() * 0.4 + 0.15);
        this.vx = (Math.random() - 0.5) * 0.25;
        this.r  = Math.random() * 1.4 + 0.3;
        this.maxA = Math.random() * 0.55 + 0.1;
        this.a  = initial ? this.maxA * Math.random() : 0;
        this.growing = !initial;
        // Gold tones
        const gold = [
          [199, 154, 59],
          [212, 168, 67],
          [232, 184, 75],
          [180, 140, 50]
        ][Math.floor(Math.random() * 4)];
        this.r_ = gold[0]; this.g_ = gold[1]; this.b_ = gold[2];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.growing) {
          this.a += 0.004;
          if (this.a >= this.maxA) this.growing = false;
        } else {
          this.a -= 0.0025;
        }
        if (this.a <= 0 || this.y < -8) this.reset(false);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.r_},${this.g_},${this.b_},${Math.max(0, this.a)})`;
        ctx.fill();
      }
    }
  
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    })();
  }
  
  /* ════════════════════════════════════════
     SCROLL REVEAL — IntersectionObserver
  ════════════════════════════════════════ */
  function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-tl');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = parseInt(e.target.dataset.delay || '0', 10);
          setTimeout(() => e.target.classList.add('in-view'), delay);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(t => io.observe(t));
  }
  
  /* ════════════════════════════════════════
     ANIMATED COUNTERS
  ════════════════════════════════════════ */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => io.observe(c));
  }
  
  function animateCounter(el) {
    const end    = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const dur    = 2200;
    const t0     = performance.now();
    const tick   = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val   = Math.floor(eased * end);
      el.textContent = (val >= 1000 ? val.toLocaleString() : val) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  
  /* ════════════════════════════════════════
     SUPPORT — horizontal drag scroll
  ════════════════════════════════════════ */
  // function initSupportScroll() {
  //   const track    = document.getElementById('supportTrack');
  //   const inner    = document.getElementById('supportInner');
  //   const progress = document.getElementById('supportProgress');
  //   if (!track || !inner) return;
  
  //   let isDown = false, startX = 0, scrollLeft = 0;
  
  //   track.addEventListener('mousedown', e => {
  //     isDown    = true;
  //     startX    = e.pageX - track.offsetLeft;
  //     scrollLeft= track.scrollLeft;
  //     track.classList.add('dragging');
  //   });
  //   window.addEventListener('mouseup', () => { isDown = false; track.classList.remove('dragging'); });
  //   track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('dragging'); });
  //   track.addEventListener('mousemove', e => {
  //     if (!isDown) return;
  //     e.preventDefault();
  //     const x    = e.pageX - track.offsetLeft;
  //     const walk = (x - startX) * 1.4;
  //     track.scrollLeft = scrollLeft - walk;
  //     updateProgress();
  //   });
function initSupportScroll() {
  const track    = document.getElementById('supportTrack');
  const inner    = document.getElementById('supportInner');
  const progress = document.getElementById('supportProgress');

  const prevBtn = document.getElementById('supportPrevBtn');
  const nextBtn = document.getElementById('supportNextBtn');

  if (!track || !inner) return;

  let isDown = false, startX = 0, scrollLeft = 0;

  track.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.classList.add('dragging');
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('dragging');
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.classList.remove('dragging');
  });

  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    track.scrollLeft = scrollLeft - walk;
    updateProgress();
  });

  let touchX = 0;

  track.addEventListener('touchstart', e => {
    touchX = e.touches[0].pageX;
  }, { passive: true });

  track.addEventListener('touchmove', e => {
    const dx = touchX - e.touches[0].pageX;
    track.scrollLeft += dx * 1.2;
    touchX = e.touches[0].pageX;
    updateProgress();
  }, { passive: true });

  track.addEventListener('scroll', updateProgress, { passive: true });

  function updateProgress() {
    if (!progress) return;

    const max = track.scrollWidth - track.clientWidth;
    const pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
    progress.style.width = pct + '%';
  }

  // LEFT / RIGHT BUTTONS
  const getScrollAmount = () => {
    const card = inner.querySelector('.support-card');
    return card ? card.offsetWidth + 24 : 400;
  };

  nextBtn?.addEventListener('click', () => {
    track.scrollBy({
      left: getScrollAmount(),
      behavior: 'smooth'
    });
  });

  prevBtn?.addEventListener('click', () => {
    track.scrollBy({
      left: -getScrollAmount(),
      behavior: 'smooth'
    });
  });

  // Auto-scroll hint
  setTimeout(() => {
    if (track.scrollLeft === 0) {
      track.scrollTo({ left: 60, behavior: 'smooth' });
      setTimeout(() => {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      }, 900);
    }
  }, 1200);

  updateProgress();
}
  
    // Touch support

  
  /* ════════════════════════════════════════
     TIMELINE SPINE — draws line as you scroll
  ════════════════════════════════════════ */
  function initTimeline() {
    const spine    = document.getElementById('timelineSpine');
    const timeline = document.querySelector('.journey-timeline');
    if (!spine || !timeline) return;
  
    function update() {
      const rect   = timeline.getBoundingClientRect();
      const winH   = window.innerHeight;
      const start  = rect.top;
      const total  = rect.height;
      const visible= winH - start;
      const pct    = Math.min(Math.max(visible / total * 1.1, 0), 1) * 100;
      spine.style.height = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
  
  /* ════════════════════════════════════════
     TESTIMONIALS — auto-sliding carousel
  ════════════════════════════════════════ */
  function initTestimonials() {
    const track    = document.getElementById('testimonialTrack');
    const dotsWrap = document.getElementById('tDots');
    const prevBtn  = document.getElementById('tPrev');
    const nextBtn  = document.getElementById('tNext');
    if (!track) return;
  
    const slides   = track.querySelectorAll('.testimonial-slide');
    const total    = slides.length;
    let   current  = 0;
    let   timer;
  
    // Build dots
    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 't-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', () => { clearInterval(timer); go(i); startTimer(); });
        dotsWrap.appendChild(dot);
      });
    }
  
    function go(idx) {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsWrap?.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }
  
    function startTimer() {
      timer = setInterval(() => go(current + 1), 4800);
    }
  
    prevBtn?.addEventListener('click', () => { clearInterval(timer); go(current - 1); startTimer(); });
    nextBtn?.addEventListener('click', () => { clearInterval(timer); go(current + 1); startTimer(); });
  
    // Keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { clearInterval(timer); go(current - 1); startTimer(); }
      if (e.key === 'ArrowRight'){ clearInterval(timer); go(current + 1); startTimer(); }
    });
  
    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) { clearInterval(timer); go(current + (dx > 0 ? 1 : -1)); startTimer(); }
    });
  
    startTimer();
    go(0);
  }
  
  /* ════════════════════════════════════════
     FAQ — accordion
  ════════════════════════════════════════ */
  function initFAQ() {
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item   = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }
  
  function setActiveFAQ() {
    const first = document.querySelector('.faq-item');
    if (first) first.classList.add('open');
  }
  
  /* ════════════════════════════════════════
     FLOATING LABEL FORM + SUBMIT
  ════════════════════════════════════════ */
  function initFloatingForm() {
    const form   = document.getElementById('enquiryForm');
    const btn    = document.getElementById('submitBtn');
    if (!form || !btn) return;
  
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateForm(form)) return;

      const text    = btn.querySelector('.submit-text');
      const icon    = btn.querySelector('.submit-icon');
      const loading = btn.querySelector('.submit-loading');
      const note    = form.querySelector('.form-note');
      const errId   = 'franchise-api-error';

      text.style.display    = 'none';
      icon.style.display    = 'none';
      loading.style.display = 'inline-flex';
      btn.disabled          = true;
      btn.style.pointerEvents = 'none';
      document.getElementById(errId)?.remove();

      const payload = {
        fullName:     (form.querySelector('#f-name')?.value || '').trim(),
        emailAddress: (form.querySelector('#f-email')?.value || '').trim(),
        phoneNumber:  (form.querySelector('#f-phone')?.value || '').trim(),
        location:     (form.querySelector('#f-city')?.value || '').trim(),
        message:      (form.querySelector('#f-message')?.value || '').trim(),
      };

      let ok = false;
      if (typeof AYR_API !== 'undefined') {
        const result = await AYR_API.call('submitFranchise', payload);
        ok = result && result.success;
        if (!ok && note) {
          const err = document.createElement('p');
          err.id = errId;
          err.className = 'form-note';
          err.style.color = 'rgba(239,83,80,.9)';
          err.textContent = (result && result.error) || 'Could not send enquiry. Please call us or try again.';
          form.querySelector('.form-submit-row')?.appendChild(err);
        }
      } else {
        ok = true;
      }

      loading.style.display = 'none';
      if (ok) {
        text.textContent      = 'Enquiry Sent ✓';
        text.style.display    = 'inline';
        btn.classList.add('success');
        form.reset();
        form.querySelectorAll('.f-input').forEach(input => input.dispatchEvent(new Event('input')));
        setTimeout(() => {
          text.textContent = 'Begin Your Journey';
          icon.style.display = 'inline';
          btn.classList.remove('success');
        }, 4000);
      } else {
        text.style.display = 'inline';
        icon.style.display = 'inline';
      }
      btn.disabled = false;
      btn.style.pointerEvents = 'auto';
    });
  }
  
  function validateForm(form) {
    let valid = true;
    ['f-name','f-email','f-phone','f-city'].forEach(id => {
      const input = form.querySelector('#' + id);
      if (!input) return;
      if (!input.value.trim()) {
        input.style.borderColor = 'rgba(140,29,24,0.7)';
        valid = false;
        setTimeout(() => { input.style.borderColor = ''; }, 3000);
      }
    });
    const email = form.querySelector('#f-email');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.style.borderColor = 'rgba(140,29,24,0.7)';
      valid = false;
      setTimeout(() => { email.style.borderColor = ''; }, 3000);
    }
    return valid;
  }
  
  /* ════════════════════════════════════════
     ENQUIRY SECTION CANVAS PARTICLES
  ════════════════════════════════════════ */
  function initEnquiryParticles() {
    const canvas = document.getElementById('enquiryCanvas');
    if (!canvas) return;
    const ctx   = canvas.getContext('2d');
    const COUNT = window.innerWidth < 768 ? 25 : 45;
    let W, H, particles = [];
  
    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);
  
    class P {
      constructor() { this.init(true); }
      init(rand) {
        this.x  = Math.random() * W;
        this.y  = rand ? Math.random() * H : H + 4;
        this.vy = -(Math.random() * 0.3 + 0.1);
        this.vx = (Math.random() - 0.5) * 0.15;
        this.r  = Math.random() * 1.2 + 0.2;
        this.maxA = Math.random() * 0.35 + 0.08;
        this.a  = rand ? this.maxA * Math.random() : 0;
        this.grow = !rand;
      }
      step() {
        this.x += this.vx; this.y += this.vy;
        if (this.grow) { this.a += 0.003; if (this.a >= this.maxA) this.grow = false; }
        else this.a -= 0.002;
        if (this.a <= 0 || this.y < -5) this.init(false);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(199,154,59,${Math.max(0, this.a)})`;
        ctx.fill();
      }
    }
    for (let i = 0; i < COUNT; i++) particles.push(new P());
  
    // Only animate when section is in view
    const section = document.querySelector('.f-enquiry');
    let active    = false;
    const io = new IntersectionObserver(([e]) => { active = e.isIntersecting; }, { threshold: 0.1 });
    if (section) io.observe(section);
  
    (function loop() {
      if (active) {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.step(); p.draw(); });
      }
      requestAnimationFrame(loop);
    })();
  }
  
  /* ════════════════════════════════════════
     WHY CARD — interactive glow on mousemove
  ════════════════════════════════════════ */
  document.querySelectorAll('.why-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      const glow = card.querySelector('.why-card-glow');
      if (glow) glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(199,154,59,0.14) 0%, transparent 65%)`;
    });
    card.addEventListener('mouseleave', () => {
      const glow = card.querySelector('.why-card-glow');
      if (glow) { glow.style.opacity = '0'; glow.style.background = ''; setTimeout(() => { glow.style.opacity = ''; }, 450); }
    });
  });
  
  /* ════════════════════════════════════════
     EXPERIENCE IMAGES — parallax on scroll
  ════════════════════════════════════════ */
  function initExpParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const imgs = document.querySelectorAll('.exp-img-wrap img');
    window.addEventListener('scroll', () => {
      imgs.forEach(img => {
        const rect   = img.closest('.exp-img-wrap').getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const offset = center * 0.07;
        img.style.transform = `translateY(${offset}px) scale(1.07)`;
      });
    }, { passive: true });
  }
  initExpParallax();
  
  /* ════════════════════════════════════════
     HERO AMBIENT — subtle mouse parallax
  ════════════════════════════════════════ */
  (function heroParallax() {
    const a1 = document.querySelector('.hero-ambient-1');
    const a2 = document.querySelector('.hero-ambient-2');
    if (!a1 || window.matchMedia('(pointer: coarse)').matches) return;
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      a1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px) scale(1)`;
      if (a2) a2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px) scale(1)`;
    });
  })();
  
  /* ════════════════════════════════════════
     SCROLL PROGRESS INDICATOR — thin gold line at top
  ════════════════════════════════════════ */
  (function scrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#C79A3B,#E8B84B);z-index:10000;transition:width .1s linear;width:0%';
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  })();
  
  /* ════════════════════════════════════════
     NAV — active section highlight
  ════════════════════════════════════════ */
  (function activeSection() {
    const sections = ['brand','why','experience','support','journey','testimonials','faq','enquiry'];
    const navLinks = document.querySelectorAll('.nav-links a');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => {
            a.classList.toggle('section-active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
  
    const style = document.createElement('style');
    style.textContent = `.nav-links a.section-active { color: var(--c-gold) !important; }`;
    document.head.appendChild(style);
  })();

