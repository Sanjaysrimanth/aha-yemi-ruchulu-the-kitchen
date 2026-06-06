/* ═══════════════════════════════════
   CATERING PAGE — catering.js
═══════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCateringCounters();
  initPackageHighlight();
  initCateringForm();
  initServiceCardHover();
});

/* ── ANIMATED COUNTERS ── */
function initCateringCounters() {
  const els = document.querySelectorAll('.cat-stat-num[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animCateringCount(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

function animCateringCount(el) {
  const end    = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const dur    = 1800;
  const t0     = performance.now();
  const tick   = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const v = Math.floor((1 - Math.pow(1 - p, 3)) * end);
    el.textContent = (v >= 1000 ? v.toLocaleString() : v) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ── PACKAGE CARD CLICK HIGHLIGHT ── */
function initPackageHighlight() {
  const cards = document.querySelectorAll('.pkg-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      // Auto-fill service type in enquiry form
      const pkgName = card.querySelector('.pkg-name')?.textContent || '';
      const select  = document.getElementById('service-type');
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.toLowerCase().includes('wedding') && pkgName.toLowerCase().includes('royal')) {
            select.selectedIndex = i; break;
          }
        }
      }
      // Smooth scroll to enquiry form
      document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Add selected style via JS
  const style = document.createElement('style');
  style.textContent = `.pkg-card.selected { border-color: var(--gld) !important; box-shadow: 0 0 0 1px var(--gld), 0 24px 56px rgba(199,154,59,.15) !important; }`;
  document.head.appendChild(style);
}

/* ── SERVICE CARD HOVER RIPPLE ── */
function initServiceCardHover() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(199,154,59,0.06), var(--card) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
}

/* ── CATERING ENQUIRY FORM ── */
function initCateringForm() {
  const form = document.getElementById('catering-form');
  if (!form) return;

  // Guest count display
  const guestInput   = form.querySelector('#guest-count');
  const guestDisplay = form.querySelector('#guest-display');
  if (guestInput && guestDisplay) {
    guestInput.addEventListener('input', () => {
      guestDisplay.textContent = parseInt(guestInput.value).toLocaleString();
    });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('cat-submit') || form.querySelector('button[type="submit"]');
    const errEl = document.getElementById('catering-form-error');
    if (!btn) return;

    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--red)';
        valid = false;
        setTimeout(() => { field.style.borderColor = ''; }, 2500);
      }
    });
    if (!valid) return;

    const defaultLabel = 'Send Catering Enquiry';
    const payload = {
      yourName:            (document.getElementById('cat-name')?.value || '').trim(),
      phone:               (document.getElementById('cat-phone')?.value || '').trim(),
      eventType:           (document.getElementById('service-type')?.value || '').trim(),
      eventDate:           (document.getElementById('cat-date')?.value || '').trim(),
      location:            (document.getElementById('cat-location')?.value || '').trim(),
      guestCount:          (document.getElementById('cat-guests')?.value || '').trim(),
      packageInterest:     (document.getElementById('cat-package')?.value || '').trim(),
      specialRequirements: (document.getElementById('cat-notes')?.value || '').trim(),
    };

    btn.disabled = true;
    btn.textContent = 'Sending…';
    if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }

    let ok = false;
    if (typeof AYR_API !== 'undefined') {
      const result = await AYR_API.call('submitCatering', payload);
      ok = result && result.success;
      if (!ok && errEl) {
        errEl.textContent = (result && result.error) || 'Could not send enquiry. Please call +91 73311 44804.';
        errEl.style.display = 'block';
      }
    } else {
      ok = true;
    }

    if (ok) {
      btn.textContent = 'Enquiry Sent — We\'ll Call You Within 2 Hours ✓';
      btn.style.background = 'transparent';
      btn.style.color = 'var(--gld)';
      btn.style.borderColor = 'var(--gld)';
      form.reset();
      if (guestDisplay) guestDisplay.textContent = '0';
      setTimeout(() => {
        btn.textContent = defaultLabel;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 4000);
    } else {
      btn.textContent = defaultLabel;
      btn.disabled = false;
    }
  });
}

/* ── PROCESS STEP HOVER CONNECTOR ── */
document.querySelectorAll('.process-step').forEach((step, i, all) => {
  step.addEventListener('mouseenter', () => {
    const arrow = step.querySelector('.process-arrow');
    if (arrow) arrow.style.color = 'var(--gld)';
  });
  step.addEventListener('mouseleave', () => {
    const arrow = step.querySelector('.process-arrow');
    if (arrow) arrow.style.color = 'rgba(199,154,59,0.3)';
  });
});
