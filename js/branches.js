/* ═══════════════════════════════════
   BRANCHES PAGE — branches.js
═══════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initBranchTabs();
  initCopyAddress();
  initBranchStatus();
  initCounters();
});

/* ── BRANCH TAB QUICK-SCROLL ── */
function initBranchTabs() {
  const tabs = document.querySelectorAll('.branch-tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('act'));
      btn.classList.add('act');
      const targetId = btn.dataset.target;
      const target = document.getElementById(targetId);
      if (target) {
        const navH = 80;
        const y = target.getBoundingClientRect().top + window.pageYOffset - navH - 16;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // Auto-highlight tab on scroll
  const sections = ['branch-vizag', 'branch-gajuwaka', 'branch-anakapalli'];
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) {
        current = id;
      }
    });
    tabs.forEach(btn => {
      btn.classList.toggle('act', btn.dataset.target === current);
    });
  }, { passive: true });
}

/* ── COPY ADDRESS ── */
function initCopyAddress() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.address || btn.closest('[data-address]')?.dataset.address;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove('copied');
        }, 2500);
      }).catch(() => {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '⊞ Copy Address';
          btn.classList.remove('copied');
        }, 2500);
      });
    });
  });
}

/* ── LIVE OPEN/CLOSED STATUS ── */
function initBranchStatus() {
  const now   = new Date();
  const day   = now.getDay();   // 0=Sun ... 6=Sat
  const hour  = now.getHours();
  const min   = now.getMinutes();
  const time  = hour + min / 60;

  const schedules = {
    'status-vizag':      { open: 11, close: 23,   allWeek: true },
    'status-gajuwaka':   { open: 11, close: 22.5,  allWeek: true },
    'status-anakapalli': { open: 11, close: 22,    allWeek: true },
  };

  Object.entries(schedules).forEach(([id, sch]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const isOpen = time >= sch.open && time < sch.close;
    const dot  = el.querySelector('.status-dot');
    const text = el.querySelector('.status-text');
    if (!dot || !text) return;
    if (isOpen) {
      dot.classList.add('status-open');
      dot.classList.remove('status-closed');
      text.textContent = `Open Now · Closes ${formatTime(sch.close)}`;
      text.classList.add('status-text-open');
    } else {
      dot.classList.add('status-closed');
      dot.classList.remove('status-open');
      text.textContent = `Closed · Opens ${formatTime(sch.open)} tomorrow`;
      text.classList.add('status-text-closed');
    }
  });

  // Highlight today's row in hours tables
  const dayNames = ['sun','mon','tue','wed','thu','fri','sat'];
  document.querySelectorAll(`tr[data-day="${dayNames[day]}"]`).forEach(tr => {
    tr.classList.add('today');
  });
}

function formatTime(decimal) {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}${m ? ':' + String(m).padStart(2,'0') : ''} ${ampm}`;
}

/* ── COUNTERS ── */
function initCounters() {
  const els = document.querySelectorAll('.bov-num[data-count]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animBovCount(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

function animBovCount(el) {
  const end    = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const dur    = 1600;
  const t0     = performance.now();
  const tick   = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const v = Math.floor((1 - Math.pow(1 - p, 3)) * end);
    el.textContent = (v >= 1000 ? v.toLocaleString() : v) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ── DIRECTIONS LINKS ── */
document.querySelectorAll('.directions-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const query = encodeURIComponent(btn.dataset.query || 'Aha Yemi Ruchulu Visakhapatnam');
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener');
  });
});



