/* ═══════════════════════════════════════════
   RESERVE TABLE PAGE — reserve.js
   Multi-step wizard: Branch → Date/Time →
   Details → Confirm → Success
═══════════════════════════════════════════ */

/* ── STATE ── */
const STATE = {
  step: 1,
  branch: null,
  branchName: '',
  branchAddress: '',
  date: null,
  dateLabel: '',
  time: null,
  guests: 2,
  occasion: null,
  occasionLabel: '',
  name: '',
  phone: '',
  notes: '',
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
};

const STEPS = 4;

/* ── TIME SLOTS ── */
const LUNCH_SLOTS = [
  { t:'12:00 PM', avail:true }, { t:'12:30 PM', avail:true },
  { t:'01:00 PM', avail:false },{ t:'01:30 PM', avail:true },
  { t:'02:00 PM', avail:true }, { t:'02:30 PM', avail:true },
  { t:'03:00 PM', avail:false },
];
const EVENING_SLOTS = [
  { t:'06:00 PM', avail:true }, { t:'06:30 PM', avail:true },
  { t:'07:00 PM', avail:false },
];
const DINNER_SLOTS = [
  { t:'07:30 PM', avail:true }, { t:'08:00 PM', avail:true },
  { t:'08:30 PM', avail:false },{ t:'09:00 PM', avail:true },
  { t:'09:30 PM', avail:true }, { t:'10:00 PM', avail:true },
  { t:'10:30 PM', avail:false },
];

const BRANCHES = [
  {
    id: 'B001',
    badge: 'Main Branch',
    name: 'MVP Colony',
    address: ' Sector 10, Opposite Shankar Car Garage, MVP Colony, Visakhapatnam, Andhra Pradesh 530017',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
    hours: 'Mon–Sun: 11 AM – 11 PM',
    phone: '+91 891 234 5678',
  },
  {
    id: 'B002',
    badge: 'Branch',
    name: 'Gajuwaka',
    address: 'Plot 8, Steel Plant Rd, Gajuwaka — 530026',
    img: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=500&q=80',
    hours: 'Mon–Sun: 11 AM – 10:30 PM',
    phone: '+91 891 456 7890',
  },
  {
    id: 'B003',
    badge: 'Branch',
    name: 'Anakapalli',
    address: '15, Main Road, Near Bus Stand, Anakapalli — 531001',
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',
    hours: 'Mon–Sun: 11 AM – 10 PM',
    phone: '+91 8924 234 567',
  },
];

const OCCASIONS = [
  { id:'dining',     icon:'🍽️', label:'Regular Dining' },
  { id:'birthday',   icon:'🎂', label:'Birthday' },
  { id:'anniversary',icon:'💍', label:'Anniversary' },
  { id:'date',       icon:'🌹', label:'Date Night' },
  { id:'business',   icon:'💼', label:'Business Dinner' },
  { id:'family',     icon:'👨‍👩‍👧', label:'Family Gathering' },
];

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildBranchCards();
  renderCalendar();
  buildTimeSlots();
  buildOccasionCards();
  initGuestCounter();
  initStepNavigation();
  initContactFields();
  initFAQ();
  updateProgress();
  updateSummary();
});

/* ── BUILD BRANCH CARDS ── */
function buildBranchCards() {
  const grid = document.getElementById('branch-sel-grid');
  if (!grid) return;
  grid.innerHTML = BRANCHES.map(b => `
    <div class="branch-sel-card" data-branch="${b.id}" onclick="selectBranch('${b.id}')">
      <div class="branch-sel-img">
        <img src="${b.img}" alt="${b.name}" loading="lazy">
      </div>
      <div class="branch-sel-info">
        <span class="branch-sel-badge">${b.badge}</span>
        <div class="branch-sel-name">${b.name}</div>
        <div class="branch-sel-meta">${b.address}<br><span style="color:var(--gld);font-size:10px;">⏱ ${b.hours}</span></div>
      </div>
    </div>
  `).join('');
}

function selectBranch(id) {
  const branch = BRANCHES.find(b => b.id === id);
  if (!branch) return;
  STATE.branch = id;
  STATE.branchName = branch.name;
  STATE.branchAddress = branch.address;
  document.querySelectorAll('.branch-sel-card').forEach(c =>
    c.classList.toggle('selected', c.dataset.branch === id)
  );
  clearError('branch-error');
  updateSummary();
  // Auto-advance after short delay
  setTimeout(() => goToStep(2), 380);
}

/* ── CALENDAR ── */
function renderCalendar() {
  const grid = document.getElementById('cal-grid');
  const label = document.getElementById('cal-month-label');
  if (!grid || !label) return;

  const { calYear: y, calMonth: m } = STATE;
  const today = new Date();
  today.setHours(0,0,0,0);

  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  label.textContent = `${MONTHS[m]} ${y}`;

  const firstDay   = new Date(y, m, 1).getDay();
  const daysInMonth= new Date(y, m + 1, 0).getDate();

  let html = DAYS.map(d => `<div class="cal-day-header">${d}</div>`).join('');

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day empty"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d);
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();
    const isSel = STATE.date &&
      STATE.date.getFullYear() === y &&
      STATE.date.getMonth() === m &&
      STATE.date.getDate() === d;
    const cls = [
      'cal-day',
      isPast ? 'disabled' : '',
      isToday ? 'today' : '',
      isSel ? 'selected' : '',
    ].filter(Boolean).join(' ');
    const click = isPast ? '' : `onclick="selectDate(${y},${m},${d})"`;
    html += `<div class="${cls}" ${click}>${d}</div>`;
  }

  grid.innerHTML = html;
}

function selectDate(y, m, d) {
  STATE.date = new Date(y, m, d);
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAYS_F = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  STATE.dateLabel = `${DAYS_F[STATE.date.getDay()]}, ${d} ${MONTHS[m]} ${y}`;
  renderCalendar();
  clearError('date-error');
  updateSummary();
  // Scroll to time slots on mobile
  const slotWrap = document.getElementById('time-slots-section');
  if (slotWrap && window.innerWidth < 900) {
    slotWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

document.getElementById('cal-prev')?.addEventListener('click', () => {
  if (STATE.calMonth === 0) { STATE.calMonth = 11; STATE.calYear--; }
  else STATE.calMonth--;
  // Prevent going before current month
  const now = new Date();
  if (STATE.calYear < now.getFullYear() ||
     (STATE.calYear === now.getFullYear() && STATE.calMonth < now.getMonth())) {
    STATE.calMonth = now.getMonth(); STATE.calYear = now.getFullYear();
  }
  renderCalendar();
});

document.getElementById('cal-next')?.addEventListener('click', () => {
  if (STATE.calMonth === 11) { STATE.calMonth = 0; STATE.calYear++; }
  else STATE.calMonth++;
  renderCalendar();
});

/* ── TIME SLOTS ── */
function buildTimeSlots() {
  renderSlotGroup('slots-lunch',   LUNCH_SLOTS);
  renderSlotGroup('slots-evening', EVENING_SLOTS);
  renderSlotGroup('slots-dinner',  DINNER_SLOTS);
}

function renderSlotGroup(containerId, slots) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = slots.map(s => `
    <button
      class="time-slot${s.avail ? '' : ' unavailable'}${STATE.time === s.t ? ' selected' : ''}"
      ${s.avail ? `onclick="selectTime('${s.t}')"` : 'disabled'}
      title="${s.avail ? s.t : 'Slot unavailable'}"
    >${s.t}</button>
  `).join('');
}

function selectTime(t) {
  STATE.time = t;
  buildTimeSlots(); // re-render to update selected
  clearError('time-error');
  updateSummary();
}

/* ── GUEST COUNTER ── */
function initGuestCounter() {
  const display = document.getElementById('guest-count-display');
  const noteEl  = document.getElementById('guest-note');
  if (!display) return;
  renderGuests(display, noteEl);

  document.getElementById('guest-minus')?.addEventListener('click', () => {
    if (STATE.guests > 1) {
      STATE.guests--;
      bumpCounter(display);
      renderGuests(display, noteEl);
      updateSummary();
    }
  });
  document.getElementById('guest-plus')?.addEventListener('click', () => {
    if (STATE.guests < 20) {
      STATE.guests++;
      bumpCounter(display);
      renderGuests(display, noteEl);
      updateSummary();
    } else {
      // Shake on max
      display.style.color = 'var(--red)';
      setTimeout(() => { display.style.color = ''; }, 800);
    }
  });
}

function renderGuests(display, noteEl) {
  display.textContent = STATE.guests;
  if (noteEl) {
    if (STATE.guests >= 8) {
      noteEl.textContent = 'For large groups we may arrange a private section.';
      noteEl.style.color = 'rgba(199,154,59,.7)';
    } else {
      noteEl.textContent = `Perfect for a ${STATE.guests === 1 ? 'solo' : STATE.guests <= 2 ? 'cosy' : STATE.guests <= 4 ? 'small group' : 'group'} experience.`;
      noteEl.style.color = '';
    }
  }
}

function bumpCounter(el) {
  el.classList.remove('bump');
  void el.offsetWidth; // reflow
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 220);
}

/* ── OCCASION CARDS ── */
function buildOccasionCards() {
  const grid = document.getElementById('occasion-grid');
  if (!grid) return;
  grid.innerHTML = OCCASIONS.map(o => `
    <div class="occasion-card${STATE.occasion === o.id ? ' selected' : ''}"
         onclick="selectOccasion('${o.id}', '${o.label}')">
      <span class="occasion-icon">${o.icon}</span>
      <span class="occasion-label">${o.label}</span>
    </div>
  `).join('');
}

function selectOccasion(id, label) {
  STATE.occasion = id;
  STATE.occasionLabel = label;
  buildOccasionCards();
  updateSummary();
}

/* ── CONTACT FIELD SYNC ── */
function initContactFields() {
  const nameInput  = document.getElementById('res-name');
  const phoneInput = document.getElementById('res-phone');
  const notesInput = document.getElementById('res-notes');

  nameInput?.addEventListener('input', e => {
    STATE.name = e.target.value.trim();
    updateSummary();
    if (STATE.name) clearError('name-error');
  });
  phoneInput?.addEventListener('input', e => {
    STATE.phone = e.target.value.trim();
    updateSummary();
    if (STATE.phone.length >= 10) clearError('phone-error');
  });
  notesInput?.addEventListener('input', e => { STATE.notes = e.target.value; });
}

/* ── STEP NAVIGATION ── */
function initStepNavigation() {
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = parseInt(btn.dataset.step);
      if (validateStep(s)) goToStep(s + 1);
    });
  });
  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = parseInt(btn.dataset.step);
      goToStep(s - 1);
    });
  });
  // Progress step clicks (go back only)
  document.querySelectorAll('.prog-step').forEach(step => {
    step.addEventListener('click', () => {
      const s = parseInt(step.dataset.step);
      if (s < STATE.step) goToStep(s);
    });
  });
}

function scrollToStepContent(stepNum) {
  const panel = document.getElementById(`step-${stepNum}`);
  const el = panel?.querySelector('.step-heading') || panel;
  if (!el) return;

  requestAnimationFrame(() => {
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 80;
    const progressH = document.querySelector('.reservation-progress')?.offsetHeight ?? 77;
    const offset = navH + progressH + 20;
    const top = window.scrollY + el.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  });
}

function goToStep(n) {
  if (n < 1 || n > STEPS) return;
  // Hide all steps
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  // Show target step
  const target = document.getElementById(`step-${n}`);
  if (target) {
    target.classList.add('active');
    scrollToStepContent(n);
  }
  STATE.step = n;
  updateProgress();
  if (n === 4) buildConfirmSummary();
}

function validateStep(step) {
  let ok = true;
  if (step === 1) {
    if (!STATE.branch) { showError('branch-error', 'Please select a branch to continue.'); ok = false; }
  }
  if (step === 2) {
    if (!STATE.date)   { showError('date-error', 'Please choose a date.'); ok = false; }
    if (!STATE.time)   { showError('time-error', 'Please choose an available time slot.'); ok = false; }
  }
  if (step === 3) {
    if (!STATE.name)  { showError('name-error', 'Please enter your name.'); document.getElementById('res-name')?.focus(); ok = false; }
    if (!STATE.phone || STATE.phone.replace(/\D/g,'').length < 10) {
      showError('phone-error', 'Please enter a valid 10-digit phone number.'); ok = false;
    }
  }
  return ok;
}

/* ── PROGRESS BAR ── */
function updateProgress() {
  document.querySelectorAll('.prog-step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.toggle('active', s === STATE.step);
    el.classList.toggle('done',   s < STATE.step);
  });
  document.querySelectorAll('.prog-connector-fill').forEach((fill, i) => {
    fill.style.width = (i + 1) < STATE.step ? '100%' : '0%';
  });
}

/* ── SUMMARY SIDEBAR ── */
function updateSummary() {
  setSummary('sum-branch',  STATE.branchName  || null, '📍', 'Branch');
  setSummary('sum-date',    STATE.dateLabel   || null, '📅', 'Date');
  setSummary('sum-time',    STATE.time        || null, '⏱', 'Time');
  setSummary('sum-guests',  STATE.guests > 0 ? `${STATE.guests} Guest${STATE.guests > 1 ? 's' : ''}` : null, '👥', 'Guests');
  setSummary('sum-occasion',STATE.occasionLabel || null, '✨', 'Occasion');
  setSummary('sum-name',    STATE.name        || null, '👤', 'Name');
}

function setSummary(id, val, icon, label) {
  const el = document.getElementById(id);
  if (!el) return;
  const valEl = el.querySelector('.summary-item-val');
  if (valEl) {
    if (val) {
      valEl.textContent = val;
      valEl.classList.remove('empty-val');
      el.classList.remove('empty');
    } else {
      valEl.textContent = 'Not selected yet';
      valEl.classList.add('empty-val');
      el.classList.add('empty');
    }
  }
}

/* ── CONFIRM SUMMARY BUILD ── */
function buildConfirmSummary() {
  const rows = [
    { label: 'Branch',   val: STATE.branchName },
    { label: 'Address',  val: STATE.branchAddress },
    { label: 'Date',     val: STATE.dateLabel },
    { label: 'Time',     val: STATE.time },
    { label: 'Guests',   val: `${STATE.guests} Guest${STATE.guests > 1 ? 's' : ''}` },
    { label: 'Occasion', val: STATE.occasionLabel || 'Regular Dining' },
    { label: 'Name',     val: STATE.name },
    { label: 'Phone',    val: STATE.phone },
    { label: 'Notes',    val: STATE.notes || 'None' },
  ];
  const container = document.getElementById('confirm-rows');
  if (!container) return;
  container.innerHTML = rows.map(r => `
    <div class="confirm-row">
      <span class="confirm-row-label">${r.label}</span>
      <span class="confirm-row-val">${r.val}</span>
    </div>
  `).join('');
}

/* ── FORM SUBMISSION ── */
document.getElementById('confirm-submit')?.addEventListener('click', () => {
  const btn = document.getElementById('confirm-submit');
  btn.textContent = 'Confirming…';
  btn.disabled = true;
  btn.style.opacity = '.7';

  // Simulate API call
  setTimeout(() => {
    showSuccess();
  }, 1800);
});

function showSuccess() {
  // Hide step 4, show success
  document.getElementById('step-4')?.classList.remove('active');
  document.getElementById('success-screen')?.classList.add('show');
  // Generate booking ref
  const ref = 'AYR-' + Math.random().toString(36).substr(2,6).toUpperCase();
  const refEl = document.getElementById('booking-ref');
  if (refEl) refEl.textContent = `Booking Ref: ${ref}`;
  // Summary in success
  const summaryEl = document.getElementById('success-summary');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <strong style="color:var(--gld);">${STATE.branchName}</strong> branch ·
      <strong>${STATE.dateLabel}</strong> at <strong>${STATE.time}</strong> ·
      ${STATE.guests} Guest${STATE.guests > 1 ? 's' : ''}
    `;
  }
  // Update progress to all done
  STATE.step = 5;
  updateProgress();
  const successEl = document.getElementById('success-screen');
  if (successEl) {
    requestAnimationFrame(() => {
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 80;
      const progressH = document.querySelector('.reservation-progress')?.offsetHeight ?? 77;
      const offset = navH + progressH + 20;
      const top = window.scrollY + successEl.getBoundingClientRect().top - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  }
}

/* ── ERROR HELPERS ── */
function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  el.previousElementSibling?.classList?.add('error');
  setTimeout(() => { el.classList.remove('show'); }, 4000);
}
function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

/* ── FAQ ACCORDION ── */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
  // Open first by default
  document.querySelector('.faq-item')?.classList.add('open');
}

/* ── WHATSAPP LINK ── */
document.getElementById('whatsapp-cta')?.addEventListener('click', () => {
  const msg = encodeURIComponent(
    `Hi Aha Yemi Ruchulu! I'd like to reserve a table:\n` +
    `Branch: ${STATE.branchName}\nDate: ${STATE.dateLabel}\nTime: ${STATE.time}\n` +
    `Guests: ${STATE.guests}\nName: ${STATE.name}\nPhone: ${STATE.phone}`
  );
  window.open(`https://wa.me/918912345678?text=${msg}`, '_blank', 'noopener');
});
