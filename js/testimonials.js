/* ═══════════════════════════════════
   TESTIMONIALS PAGE — testimonials.js
═══════════════════════════════════ */

const REVIEWS_DATA = [
  { name:"kandipelli sagar", role:"Food Enthusiast · Visakhapatnam", img:"https://lh3.googleusercontent.com/a/ACg8ocKP0elhVwMs4Kr4Xt_WZFPdm9Byrl7XJSZjyHr6v0RsyE9H2bhQ=w36-h36-p-rp-mo-ba3-br100", text:"very very very very very good food. the staff are very friendly they have provided good service. the ambience is nice. overall its a good experience", platform:"Google" },
  { name:"Arjun Krishnamurthy", role:"Food Enthusiast · Hyderabad", img: src="assets/noo_profile.jpg", text:"The dedication to authentic Andhra spice profiles while presenting dishes with modern elegance is remarkable. Every plate is a love letter to Telugu heritage. Best Biryani I've had outside Hyderabad.", platform:"Zomato" },
  { name:"Mahesh Vanama", role:"Local Guide", img:"https://lh3.googleusercontent.com/a-/ALV-UjXmpeXlrXVxPhRmWni7OvqvD6VX-DNlbwkOkqtUVftypaNXlpnr4g=w36-h36-p-rp-mo-ba6-br100", text:"The food quality and taste are good. For vegitarians the spread is less. Portion is sufficient for two. Tandoori roti they will make thin and crispy, which will not be good. All of the staff will have bluetooth in ears and they always speaks each other or someone. Even though customers are less and staff are free they won't listen to customers. We need to shout for several times to get support. Seat cushions are not cleaned for so long as found stains in the seat near to entrance.", platform:"Google" },
  { name:"Shafi Sk", role:"Local Guide", img:"https://b.zmtcdn.com/data/user_profile_pictures/84b/10be9d1dfada70ea8587cfabf5f4c84b.jpg?fit=around%7C100%3A100&crop=100%3A100%3B%2A%2C%2A", text:"good food.", platform:"Zomato" },
  { name:"Keerthi Kella", role:"corporate officer", img:"https://lh3.googleusercontent.com/a-/ALV-UjURcbEtLhb33fRdXg1yQv66Wkeyn1DJsE22lyeiAgrvWFpW3G8=w72-h72-p-rp-mo-br100", text:"It's good experience with the complete resturant. And the songs that they played are feel good..full telugu vibes..finally ahaaa....", platform:"Google" }
];

document.addEventListener('DOMContentLoaded', () => {
  initFeaturedCarousel();
  initRatingBars();
  initReviewCardReveal();
});

/* ── FEATURED CAROUSEL ── */
function initFeaturedCarousel() {
  const textEl  = document.getElementById('rev-text');
  const imgEl   = document.getElementById('rev-img');
  const nameEl  = document.getElementById('rev-name');
  const roleEl  = document.getElementById('rev-role');
  const dotsWrap = document.getElementById('review-dots');
  const prevBtn = document.getElementById('rev-prev');
  const nextBtn = document.getElementById('rev-next');
  if (!textEl) return;

  let current = 0;
  let timer;

  // Build dots
  if (dotsWrap) {
    REVIEWS_DATA.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'rev-dot' + (i === 0 ? ' act' : '');
      dot.addEventListener('click', () => { clearInterval(timer); show(i); startTimer(); });
      dotsWrap.appendChild(dot);
    });
  }

  function show(idx) {
    current = (idx + REVIEWS_DATA.length) % REVIEWS_DATA.length;
    const r = REVIEWS_DATA[current];
    [textEl, imgEl, nameEl, roleEl].forEach(el => el && (el.style.opacity = '0'));
    setTimeout(() => {
      if (textEl) textEl.innerHTML = r.text;
      if (imgEl)  { imgEl.src = r.img; imgEl.alt = r.name; }
      if (nameEl) nameEl.innerHTML = r.name;
      if (roleEl) roleEl.innerHTML = r.role;
      document.querySelectorAll('.rev-dot').forEach((d, i) => d.classList.toggle('act', i === current));
      [textEl, imgEl, nameEl, roleEl].forEach(el => el && (el.style.opacity = '1'));
    }, 300);
  }

  prevBtn && prevBtn.addEventListener('click', () => { clearInterval(timer); show(current - 1); startTimer(); });
  nextBtn && nextBtn.addEventListener('click', () => { clearInterval(timer); show(current + 1); startTimer(); });

  function startTimer() {
    timer = setInterval(() => show(current + 1), 5500);
  }
  startTimer();
  show(0);
}

/* ── RATING BARS ANIMATION ── */
function initRatingBars() {
  const bars = document.querySelectorAll('.rating-bar-fill');
  if (!bars.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'barGrow 1.2s cubic-bezier(0.16,1,0.3,1) forwards';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => {
    bar.style.transform = 'scaleX(0)';
    io.observe(bar);
  });
}

/* ── STAGGER REVIEW CARDS ── */
function initReviewCardReveal() {
  const cards = document.querySelectorAll('.review-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = [...cards].indexOf(entry.target) % 2 === 0 ? 0 : 120;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), border-color 0.4s, background 0.4s, box-shadow 0.4s';
    io.observe(card);
  });
}

/* ── KEYBOARD NAV ── */
document.addEventListener('keydown', e => {
  const prevBtn = document.getElementById('rev-prev');
  const nextBtn = document.getElementById('rev-next');
  if (e.key === 'ArrowLeft') prevBtn?.click();
  if (e.key === 'ArrowRight') nextBtn?.click();
});
