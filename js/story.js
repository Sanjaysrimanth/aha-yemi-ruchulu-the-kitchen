/* ═══════════════════════════════════
   STORY PAGE — story.js
═══════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initTimelineStagger();
  initHeritageCounters();
});

/* ── PARALLAX ON FOUNDER IMAGE ── */
function initParallax() {
  const imgs = document.querySelectorAll('.founder-img-wrapper img, .ingredients-img img');
  if (!imgs.length || window.innerWidth < 768) return;

  window.addEventListener('scroll', () => {
    imgs.forEach(img => {
      const rect = img.closest('div').getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = (rect.top + scrolled) * 0.04;
      img.style.transform = `translateY(${rate}px)`;
    });
  }, { passive: true });
}

/* ── TIMELINE ITEMS STAGGER REVEAL ── */
function initTimelineStagger() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(24px)';
    item.style.transition = `opacity 0.7s ${i * 0.12}s cubic-bezier(0.16,1,0.3,1), transform 0.7s ${i * 0.12}s cubic-bezier(0.16,1,0.3,1)`;
    io.observe(item);
  });
}

/* ── HERITAGE COUNTERS ── */
function initHeritageCounters() {
  const els = document.querySelectorAll('.heritage-highlight-num[data-count]');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animCount(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
}

function animCount(el) {
  const end    = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const dur    = 1800;
  const t0     = performance.now();
  const tick   = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const v = Math.floor((1 - Math.pow(1 - p, 3)) * end);
    el.textContent = v.toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ── VALUE CARD TILT ON HOVER (subtle) ── */
document.querySelectorAll('.value-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -6;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

