/* ═════════════════════════════════════════
   AHA YEMI RUCHULU — main.js
   Handles: Navbar, Reveal, Counters, Tabs,
   Testimonials, Gallery Lightbox, Forms
═════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

  initNavbar();
  initReveal();
  initCounters();
  initMenuTabs();
  initTestimonials();
  initGallery();
  setActiveLink();

  const heroContainer = document.querySelector(".rfh-hero-wrapper");

  // Hero exists only on homepage
  if (!heroContainer) return;

  const titleLetters = heroContainer.querySelectorAll(".rfh-giant-title span");
  const foodShowcase = heroContainer.querySelector(".rfh-food-showcase");

  if (!foodShowcase) return;

  let mouseX = 0;
  let mouseY = 0;

  heroContainer.addEventListener("mousemove", (e) => {
    const rect = heroContainer.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    titleLetters.forEach((letter) => {
      const letterRect = letter.getBoundingClientRect();

      const letterX = letterRect.left + letterRect.width / 2 - rect.left;
      const letterY = letterRect.top + letterRect.height / 2 - rect.top;

      const distance = Math.hypot(mouseX - letterX, mouseY - letterY);

      if (distance < 220) {
        const intensity = 1 - distance / 220;
        const blurAmount = intensity * 14;
        const scaleAmount = 1 + intensity * 0.08;

        letter.style.filter = `blur(${blurAmount}px)`;
        letter.style.transform = `scale(${scaleAmount})`;
      } else {
        letter.style.filter = "blur(0px)";
        letter.style.transform = "scale(1)";
      }
    });
  });

  foodShowcase.addEventListener("mousemove", (e) => {
    const width = foodShowcase.clientWidth;
    const height = foodShowcase.clientHeight;

    const rect = foodShowcase.getBoundingClientRect();

    const localX = e.clientX - rect.left - width / 2;
    const localY = e.clientY - rect.top - height / 2;

    const tiltX = (localY / (height / 2)) * -12;
    const tiltY = (localX / (width / 2)) * 12;

    const img = foodShowcase.querySelector(".rfh-food-image");

    if (img) {
      img.style.transform =
        `scale(1.06) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
  });

  heroContainer.addEventListener("mouseleave", () => {
    titleLetters.forEach((letter) => {
      letter.style.filter = "blur(0px)";
      letter.style.transform = "scale(1)";
    });

    const img = foodShowcase.querySelector(".rfh-food-image");

    if (img) {
      img.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)";
    }
  });

});
/* ─── NAVBAR ─────────────────────────────── */
function initNavbar() {
  const nav  = document.getElementById("navbar");
  const ham  = document.getElementById("hamburger");
  const mob  = document.getElementById("mobile-menu");
  const close= document.getElementById("mobile-close");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });

  if (ham && mob) {
    ham.addEventListener("click", () => mob.classList.add("open"));
    close && close.addEventListener("click", () => mob.classList.remove("open"));
    mob.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mob.classList.remove("open")));
  }
}

/* ─── ACTIVE NAV LINK ─────────────────────── */
function setActiveLink() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
}

/* ─── SCROLL REVEAL ───────────────────────── */
function initReveal() {
  const opts = { threshold: 0.1, rootMargin: "0px 0px -40px 0px" };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("vis");
        io.unobserve(e.target);
      }
    });
  }, opts);
  document.querySelectorAll(".reveal, .reveal-l, .reveal-r").forEach(el => io.observe(el));
}

/* ─── ANIMATED COUNTERS ───────────────────── */
function initCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(el => io.observe(el));
}

function animateCounter(el) {
  const end    = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const dur    = 2000;
  const t0     = performance.now();
  const tick   = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const v = Math.floor((1 - Math.pow(1 - p, 3)) * end);
    el.textContent = v.toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ─── MENU TABS ───────────────────────────── */
function initMenuTabs() {
  const tabs = document.querySelectorAll(".menu-tab-btn");
  const panes= document.querySelectorAll(".menu-tab-content");
  if (!tabs.length) return;

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(t  => t.classList.remove("act"));
      panes.forEach(p => p.classList.remove("active"));
      btn.classList.add("act");
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add("active");
    });
  });
}

/* ─── TESTIMONIALS CAROUSEL ───────────────── */
function initTestimonials() {
  const track    = document.getElementById("rev-text");
  const img      = document.getElementById("rev-img");
  const name     = document.getElementById("rev-name");
  const role     = document.getElementById("rev-role");
  const dots     = document.querySelectorAll(".rev-dot");
  if (!track) return;

  const reviews = JSON.parse(document.getElementById("reviews-data")?.textContent || "[]");
  if (!reviews.length) return;

  let current = 0;
  let timer;

  function show(idx) {
    current = (idx + reviews.length) % reviews.length;
    const r = reviews[current];
    // Fade out
    [track, img, name, role].forEach(el => el && (el.style.opacity = "0"));
    setTimeout(() => {
      if (track) track.textContent = r.text;
      if (img)   { img.src = r.img; img.alt = r.name; }
      if (name)  name.textContent = r.name;
      if (role)  role.textContent = r.role;
      dots.forEach((d, i) => d.classList.toggle("act", i === current));
      [track, img, name, role].forEach(el => el && (el.style.opacity = "1"));
    }, 300);
  }

  dots.forEach((d, i) => d.addEventListener("click", () => { clearInterval(timer); show(i); startTimer(); }));

  function startTimer() {
    timer = setInterval(() => show(current + 1), 5500);
  }
  startTimer();
  show(0);
}

/* ─── GALLERY LIGHTBOX ────────────────────── */
function initGallery() {
  const lb    = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbClose= document.getElementById("lightbox-close");
  if (!lb) return;

  document.querySelectorAll(".gal-item").forEach(item => {
    item.addEventListener("click", () => {
      const src = item.querySelector("img")?.src;
      if (src && lbImg) {
        lbImg.src = src;
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
      }
    });
  });

  function closeLb() { lb.classList.remove("open"); document.body.style.overflow = ""; }
  lbClose && lbClose.addEventListener("click", closeLb);
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });
}

/* ─── RESERVATION FORM ────────────────────── */
const resForm = document.getElementById("reservation-form");
if (resForm) {
  resForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = resForm.querySelector("button[type=submit]");
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = "Reservation Confirmed ✓";
      btn.style.background = "#3B6D11";
      btn.style.borderColor = "#3B6D11";
      btn.style.color = "#F7F5F2";
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = "";
        btn.style.borderColor = "";
        btn.style.color = "";
        resForm.reset();
      }, 3500);
    }
  });
}

/* Catering form submit is handled in js/catering.js (Google Sheets API). */

/* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────── */
document.querySelectorAll("a[href^='#']").forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ─── DATE INPUT MIN DATE ─────────────────── */
const dateInputs = document.querySelectorAll("input[type='date']");
dateInputs.forEach(d => {
  const today = new Date().toISOString().split("T")[0];
  d.min = today;
});












































document.addEventListener("DOMContentLoaded", () => {
  // Scoped to avoid selecting items outside the restaurant hero element
  const heroContainer = document.querySelector(".rfh-hero-wrapper");

  // Reserve page doesn't have this section
  if (!heroContainer) return;

  const titleLetters = heroContainer.querySelectorAll(".rfh-giant-title span");
  const foodShowcase = heroContainer.querySelector(".rfh-food-showcase");

  if (!foodShowcase) return;

  let mouseX = 0;
  let mouseY = 0;

  // Track dynamic mouse positions inside hero zone
  heroContainer.addEventListener("mousemove", (e) => {
    const rect = heroContainer.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    // Apply fluid, dynamic blur to text characters based on distance from the mouse pointer
    titleLetters.forEach((letter) => {
      const letterRect = letter.getBoundingClientRect();
      const letterX = letterRect.left + letterRect.width / 2 - rect.left;
      const letterY = letterRect.top + letterRect.height / 2 - rect.top;

      // Calculate distance between mouse and each individual letter
      const distance = Math.hypot(mouseX - letterX, mouseY - letterY);

      // Trigger effect if mouse gets close (e.g., within 220 pixels)
      if (distance < 220) {
        // Closer coordinates create stronger blurs
        const intensity = (1 - distance / 220);
        const blurAmount = intensity * 14; // Max blur 14px
        const scaleAmount = 1 + intensity * 0.08; // Mild visual scale bulge

        letter.style.filter = `blur(${blurAmount}px)`;
        letter.style.transform = `scale(${scaleAmount})`;
      } else {
        // Reset styles cleanly if out of boundary lines
        letter.style.filter = "blur(0px)";
        letter.style.transform = "scale(1)";
      }
    });
  });

  // Smooth mouse-tilt interaction on the Food Image itself
  foodShowcase.addEventListener("mousemove", (e) => {
    const width = foodShowcase.clientWidth;
    const height = foodShowcase.clientHeight;
    
    const rect = foodShowcase.getBoundingClientRect();
    const localX = e.clientX - rect.left - width / 2;
    const localY = e.clientY - rect.top - height / 2;

    // Calculate subtilties ratios
    const tiltX = (localY / (height / 2)) * -12; // max tilt 12 degrees
    const tiltY = (localX / (width / 2)) * 12;

    const img = foodShowcase.querySelector(".rfh-food-image");
    img.style.transform = `scale(1.06) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  // Re-initialize uniform clean state when pointer leaves the region
  heroContainer.addEventListener("mouseleave", () => {
    titleLetters.forEach((letter) => {
      letter.style.filter = "blur(0px)";
      letter.style.transform = "scale(1)";
    });
    
    const img = foodShowcase.querySelector(".rfh-food-image");
    img.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)";
  });
});






document.addEventListener("DOMContentLoaded", () => {
  const scrollTopBtn = document.getElementById("scroll-top-btn");

  if (!scrollTopBtn) return;

  // Show button only after scrolling down 400px
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  // Execute smooth native scrolling reset back to the header
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});