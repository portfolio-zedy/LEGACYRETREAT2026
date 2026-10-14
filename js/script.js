/* ==========================================================
   LEGACY CONFERENCE 2026 — script.js (v3)
   Backend: Google Apps Script + Google Sheets + Paystack
   ========================================================== */

/* ============ CONFIGURATION ============ */
const CONFIG = {
  API_ENDPOINT: 'https://script.google.com/macros/s/AKfycbw11Ur9RwCvlziVR13iWl9SprFCMxswhefHHgR08yBv9PIvNHRqwM88-a-JuYzyH1SD/exec',

  // Put your real Paystack PUBLIC key here (pk_test_... while testing).
  PAYSTACK_PUBLIC_KEY: 'pk_test_436a68b37084a73946f24c1f812c5394b039f6cf',

  CURRENCY: 'NGN'
};

/* Startup diagnostic — check the browser console (F12) */
console.log('[LGC26] Backend URL set:', CONFIG.API_ENDPOINT !== '');
console.log('[LGC26] Paystack key configured:', !!CONFIG.PAYSTACK_PUBLIC_KEY && !CONFIG.PAYSTACK_PUBLIC_KEY.includes('REPLACE'));

/* ============ VENUE & PRICING DATA ============ */
const VENUES = [
  { id:'abuja',   name:'Abuja',                    desc:'Evergreen Events & Garden, Dakibiu · Weeks 1–3', price:10000 },
  { id:'lagos',   name:'Lagos',                    desc:'Alexandria Hall, Colossus Hotel, Ikeja · Weeks 1–3', price:10000 },
  { id:'phc',     name:'Port Harcourt',            desc:'FGBMFI ARK Event Centre, Rumuola · Weeks 1–3', price:10000 },
  { id:'virtual', name:'Virtual — Zoom (Bethel)',  desc:'Week 4 only (Nov 28) · 5:00 AM WAT · Free add-on', price:0, free:true }
];

/* ============ SPEAKERS DATA (photos in assets/speakers/) ============ */
const featuredSpeakers = [
  {name:"Dr. Chiefo Ejioforbiri", role:"Lead Speaker", initials:"CE", photo:"assets/speakers/chiefo-ejiofobiri.jpg", lead:true, badge:"Lead Speaker"},
  {name:"Pastor Chinwe Chiefo", role:"Featured Speaker · (Mapress)", initials:"CC", photo:"assets/speakers/chinwe-chiefo.jpg", badge:"Featured Speaker"}
];
const speakers = [
  {name:"Dr. Paschal Ohalehi", role:"Speaker", initials:"PO", photo:"assets/speakers/paschal-ohalehi.jpg"},
  {name:"Dr. Onyinye Wariboko", role:"Speaker", initials:"OW", photo:"assets/speakers/onyinye-wariboko.jpg"},
  {name:"Pst. James Ogbe", role:"Speaker", initials:"JO", photo:"assets/speakers/james-ogbe.jpg"},
  {name:"Prof. Mbang Femi-Oyewo", role:"Speaker", initials:"MF", photo:"assets/speakers/mbang-femi-oyewo.jpg"},
  {name:"Dr. Nnaemeka Ewelukwa", role:"Speaker", initials:"NE", photo:"assets/speakers/nnaemeka-ewelukwa.jpg"},
  {name:"Barr. Imah Adegoke", role:"Speaker", initials:"IA", photo:"assets/speakers/imah-adegoke.jpg"},
  {name:"Pst. Wisdom Osiri", role:"Speaker", initials:"WO", photo:"assets/speakers/wisdom-osiri.jpg"},
  {name:"Dr. Uju Agomoh", role:"Speaker", initials:"UA", photo:"assets/speakers/uju-agomoh.jpg"},
  {name:"Prof. Chinedum Babalola", role:"Speaker", initials:"CB", photo:"assets/speakers/chinedum-babalola.jpg"},
  {name:"Dr. Gori Olusina Daniel", role:"Speaker", initials:"GD", photo:"assets/speakers/gori-olusina-daniel.jpg"},
  {name:"Gbenga Aroge", role:"Speaker", initials:"GA", photo:"assets/speakers/gbenga-aroge.jpg"}
];

function featuredCard(s){
  return `<div class="featured-card ${s.lead ? 'lead' : ''}">
    <div class="featured-photo">
      <span class="initials">${s.initials}</span>
      <img src="${s.photo}" alt="${s.name}" onerror="this.remove()">
    </div>
    <div class="f-name">${s.name}</div>
    <div class="f-role">${s.role}</div>
    <span class="f-badge">${s.badge}</span>
  </div>`;
}
function speakerCard(s){
  return `<div class="speaker">
    <div class="avatar">
      <span class="initials">${s.initials}</span>
      <img src="${s.photo}" alt="${s.name}" loading="lazy" onerror="this.remove()">
    </div>
    <div class="s-name">${s.name}</div>
    <div class="s-role">${s.role}</div>
    <span class="s-badge">Ministering</span>
  </div>`;
}
document.getElementById('featuredGrid').innerHTML = featuredSpeakers.map(featuredCard).join('');
document.getElementById('gridAll').innerHTML = speakers.map(speakerCard).join('');

/* ============ LOGO FALLBACK ============ */
function attachLogoFallback(img){
  img.addEventListener('error', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 100 100');
    const use = document.createElementNS('http://www.w3.org/2000/svg','use');
    use.setAttribute('href','#ldnLogo');
    svg.appendChild(use);
    img.replaceWith(svg);
  });
  if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
}
document.querySelectorAll('img[data-fallback]').forEach(attachLogoFallback);

/* ============ COUNTDOWN ============ */
const target = new Date('2026-11-07T08:00:00+01:00').getTime();
function pad(n){ return String(n).padStart(2,'0'); }
function tick(){
  let diff = Math.max(0, target - Date.now());
  document.getElementById('cd-days').textContent  = pad(Math.floor(diff / 86400000));
  document.getElementById('cd-hours').textContent = pad(Math.floor(diff % 86400000 / 3600000));
  document.getElementById('cd-mins').textContent  = pad(Math.floor(diff % 3600000 / 60000));
  document.getElementById('cd-secs').textContent  = pad(Math.floor(diff % 60000 / 1000));
}
tick(); setInterval(tick, 1000);

/* ============ NAV ============ */
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ============ SCROLL REVEAL ============ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ============ HUB (1–31, omit 25) & TRIBE (1–87) ============ */
const hubSelect = document.getElementById('hub');
for (let i = 1; i <= 31; i++){
  if (i === 25) continue;
  hubSelect.add(new Option('Hub ' + i, 'Hub ' + i));
}
const tribeSelect = document.getElementById('tribe');
for (let i = 1; i <= 87; i++){
  tribeSelect.add(new Option('Tribe ' + i, 'Tribe ' + i));
}

/* ============ MEMBER / GUEST TOGGLE ============ */
const category = document.getElementById('category');
const membershipFields = document.getElementById('membershipFields');
const membershipNote = document.getElementById('membershipNote');

function toggleMembership(){
  const show = category.value === 'member';
  membershipFields.style.display = show ? 'grid' : 'none';
  membershipNote.style.display   = show ? 'block' : 'none';
  membershipFields.querySelectorAll('select').forEach(s => {
    s.disabled = !show;
    if (!show) s.closest('[data-field]').classList.remove('invalid');
  });
}
category.addEventListener('change', toggleMembership);
toggleMembership();

/* ============ VENUE CHECKBOXES + ORDER SUMMARY ============ */
const venueChecks = document.getElementById('venueChecks');
const orderLines  = document.getElementById('orderLines');
const orderTotal  = document.getElementById('orderTotal');
const payBtn      = document.getElementById('payBtn');
const venueGroup  = document.getElementById('venueGroup');
const fmt = n => '₦' + n.toLocaleString('en-NG');

venueChecks.innerHTML = VENUES.map(v => `
  <label class="venue-check ${v.free ? 'free' : ''}" id="vc-${v.id}">
    <input type="checkbox" id="v-${v.id}" data-price="${v.price}" data-name="${v.name}">
    <span class="vc-box"><svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>
    <span><span class="vc-name">${v.name}</span><span class="vc-desc">${v.desc}</span></span>
    <span class="vc-price ${v.free ? 'free' : ''}">${v.free ? 'FREE' : fmt(v.price)}</span>
  </label>
`).join('');

const venueInputs = [...venueChecks.querySelectorAll('input')];
const virtualInput   = document.getElementById('v-virtual');
const virtualWrapper = document.getElementById('vc-virtual');

function getSelectedVenues(){
  return venueInputs.filter(i => i.checked)
    .map(i => ({ name: i.dataset.name, price: Number(i.dataset.price) }));
}
function getTotal(){ return getSelectedVenues().reduce((s, v) => s + v.price, 0); }

function updateSummary(){
  const sel = getSelectedVenues();
  const paidCount = sel.filter(v => v.price > 0).length;

  venueChecks.querySelectorAll('.venue-check').forEach(l => {
    l.classList.toggle('selected', l.querySelector('input').checked);
  });

  /* Virtual is a free ADD-ON — lock it until a paid centre is chosen */
  virtualInput.disabled = paidCount === 0;
  virtualWrapper.classList.toggle('locked', paidCount === 0);
  if (paidCount === 0 && virtualInput.checked) virtualInput.checked = false;

  orderLines.innerHTML = sel.length === 0
    ? '<p class="order-empty">No centres selected yet.</p>'
    : sel.map(v => `<div class="order-line"><span>${v.name}</span><span>${v.price === 0 ? 'Free' : fmt(v.price)}</span></div>`).join('');

  const total = getTotal();
  orderTotal.textContent = fmt(total);

  if (paidCount === 0){
    payBtn.disabled = true;
    payBtn.textContent = 'Select at Least One Centre to Continue';
  } else {
    payBtn.disabled = false;
    payBtn.textContent = `Pay ${fmt(total)} & Register`;
  }
  if (paidCount > 0) venueGroup.classList.remove('invalid');
}
venueInputs.forEach(i => i.addEventListener('change', updateSummary));
updateSummary();

/* ============ APPS SCRIPT BRIDGE ============ */
async function postToAppsScript(body){
  const res = await fetch(CONFIG.API_ENDPOINT, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Apps Script error');
  return data;
}

/* Demo-mode fallback ID (only when no backend is configured) */
function makeRef(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  if (window.crypto && crypto.getRandomValues){
    const arr = new Uint8Array(6);
    crypto.getRandomValues(arr);
    arr.forEach(a => s += chars[a % chars.length]);
  } else {
    for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  }
  return 'LGC26-' + s;
}

/* ============ FORM VALIDATION ============ */
const form = document.getElementById('regForm');

function validateField(field){
  const input = field.querySelector('input, select');
  if (!input || input.disabled) return true;
  const v = input.value.trim();
  let ok = v.length > 0;
  if (ok && input.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  if (ok && input.id === 'phone') ok = v.replace(/\D/g,'').length >= 7;
  field.classList.toggle('invalid', !ok);
  return ok;
}
form.querySelectorAll('[data-field] input, [data-field] select').forEach(el => {
  const clear = () => el.closest('[data-field]').classList.remove('invalid');
  el.addEventListener('input', clear);
  el.addEventListener('change', clear);
});

/* ============ THANK-YOU MODAL ============ */
const modal = document.getElementById('successModal');
document.getElementById('modalClose').addEventListener('click', () => modal.classList.remove('show'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('show'); });

document.getElementById('copyUid').addEventListener('click', function(){
  const uid = document.getElementById('mUid').textContent;
  const done = () => { this.textContent = '✓ Copied!'; setTimeout(() => this.textContent = '⧉ Copy Registration ID', 2000); };
  if (navigator.clipboard) navigator.clipboard.writeText(uid).then(done);
  else {
    const t = document.createElement('textarea');
    t.value = uid; document.body.appendChild(t); t.select();
    document.execCommand('copy'); t.remove(); done();
  }
});

function showSuccess(ref, payload, paid, demo, pending){
  document.getElementById('mUid').textContent = ref;
  document.getElementById('mMsg').textContent =
    `${payload.name}, your seat at Legacy Conference 2026 is reserved. Your unique registration ID is:`;
  document.getElementById('mSummary').innerHTML = `
    <div><span>Centres</span><span>${payload.centres.join(', ')}</span></div>
    <div><span>Amount Paid</span><span>${paid ? fmt(payload.amount) : 'Free'}</span></div>
    <div><span>Status</span><span>${pending ? 'Payment received — verifying' : (paid ? 'Confirmed ✓' : 'Registered ✓')}</span></div>`;
  const tag = document.getElementById('mTag');
  tag.textContent = demo ? 'Demo Payment Simulated' : (paid ? 'Payment Successful' : 'Free Registration');
  tag.classList.toggle('demo', !!demo);
  modal.classList.add('show');

  form.style.display = 'none';
  document.getElementById('arName').textContent = payload.name.split(' ')[0];
  document.getElementById('arRef').textContent = ref;
  document.getElementById('afterReg').classList.add('show');
  document.getElementById('register').scrollIntoView({ behavior:'smooth' });
}

function resetBtn(label){
  payBtn.disabled = false;
  payBtn.textContent = label;
}

/* ============ SUBMIT → REGISTER → PAY → VERIFY ============ */
form.addEventListener('submit', async e => {
  e.preventDefault();

  /* 1. Validate form fields */
  const fields = [...form.querySelectorAll('[data-field]')];
  const allValid = fields.map(validateField).every(Boolean);

  /* 2. Validate centre selection — at least one PAID centre required */
  const selected = getSelectedVenues();
  const paidCount = selected.filter(v => v.price > 0).length;
  if (paidCount === 0) venueGroup.classList.add('invalid');
  if (!allValid || paidCount === 0){
    if (paidCount === 0) venueGroup.scrollIntoView({ behavior:'smooth', block:'center' });
    else fields.find(f => f.classList.contains('invalid'))?.querySelector('input, select')?.focus();
    return;
  }

  /* 3. Build payload */
  const isMember = category.value === 'member';
  const total = getTotal();
  const payload = {
    name:  document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    type:  isMember ? 'Member' : 'Guest',
    colony: isMember ? document.getElementById('colony').value : '',
    hub:    isMember ? document.getElementById('hub').value    : '',
    tribe:  isMember ? document.getElementById('tribe').value  : '',
    centres: selected.map(v => v.name),
    amount: total,
    currency: CONFIG.CURRENCY,
    referral: document.getElementById('referral').value || ''
  };

  payBtn.disabled = true;
  const originalLabel = payBtn.textContent;
  payBtn.textContent = 'Processing…';

  /* 4. Register on the backend → get the unique ID */
  let reference;
  try {
    if (CONFIG.API_ENDPOINT){
      const reg = await postToAppsScript({ action:'register', ...payload });
      reference = reg.reference;
    } else {
      reference = makeRef();
      console.warn('[LGC26] No API_ENDPOINT — demo mode.');
    }
  } catch (err){
    alert('We could not save your registration. Please check your connection and try again.\n\n' + err.message);
    resetBtn(originalLabel);
    return;
  }
  payload.reference = reference;

  /* 5. Paystack payment */
  const keyConfigured = !!CONFIG.PAYSTACK_PUBLIC_KEY && !CONFIG.PAYSTACK_PUBLIC_KEY.includes('REPLACE');

  if (!keyConfigured){
    const simulate = confirm(
      'PAYMENT GATEWAY NOT CONFIGURED\n\n' +
      'The Paystack public key has not been added to js/script.js, so the payment popup cannot open.\n\n' +
      'Registration ID: ' + reference + '\nTotal due: ' + fmt(total) + '\n\n' +
      'OK  = simulate a successful payment (testing only)\nCancel = stop here'
    );
    if (simulate) showSuccess(reference, payload, true, true);
    resetBtn(originalLabel);
    return;
  }

  if (typeof PaystackPop === 'undefined'){
    alert(
      'The payment gateway could not load.\n\n' +
      'Please check your internet connection and reload the page.\n' +
      'If you are opening the site as a local file (file://), serve it over http:// or https:// instead — e.g. with the free "Live Server" extension in VS Code.'
    );
    console.error('[LGC26] PaystackPop is undefined — check that https://js.paystack.co/v1/inline.js loads.');
    resetBtn(originalLabel);
    return;
  }

  payBtn.textContent = 'Opening secure payment…';

  /* Verification runs as a promise chain — NOT awaited inside the Paystack callback */
  function verifyAndFinish(ref){
    if (!CONFIG.API_ENDPOINT){
      showSuccess(ref, payload, true, false, false);
      resetBtn(originalLabel);
      return;
    }
    let pending = false;
    postToAppsScript({ action:'verify', reference: ref })
      .then(function(v){
        if (!v.verified) console.warn('[LGC26] Verify result:', v);
      })
      .catch(function(err){
        pending = true; // payment succeeded — webhook will reconcile the row
        console.error('[LGC26] Verification failed — webhook will reconcile.', err);
      })
      .finally(function(){
        showSuccess(ref, payload, true, false, pending);
        resetBtn(originalLabel);
      });
  }

  var completed = false;

  var handler = PaystackPop.setup({
    key: CONFIG.PAYSTACK_PUBLIC_KEY,
    email: payload.email,
    amount: total * 100,                  // kobo
    currency: CONFIG.CURRENCY,
    ref: reference,                       // ← same unique ID on Paystack dashboard
    firstname: payload.name.split(' ')[0],
    lastname:  payload.name.split(' ').slice(1).join(' ') || payload.name.split(' ')[0],
    metadata: {
      custom_fields: [
        { display_name:'Registration ID', variable_name:'registration_id', value: reference },
        { display_name:'Phone', variable_name:'phone', value: payload.phone },
        { display_name:'Registration Type', variable_name:'reg_type', value: payload.type },
        { display_name:'Centres', variable_name:'centres', value: payload.centres.join(', ') },
        { display_name:'Colony', variable_name:'colony', value: payload.colony || 'N/A' },
        { display_name:'Hub', variable_name:'hub', value: payload.hub || 'N/A' },
        { display_name:'Tribe', variable_name:'tribe', value: payload.tribe || 'N/A' }
      ]
    },
    callback: function(response){
      completed = true;
      verifyAndFinish(response.reference);
    },
    onClose: function(){
      resetBtn(originalLabel);
      if (!completed){
        alert('Payment window closed before completion.\n\nYour registration was saved but payment is still pending. If you were charged, the webhook will confirm it automatically and you will receive an email.');
      }
    }
  });
  handler.openIframe();
});