const WHATS = '5522999929040';
const waLink = (msg) => `https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`;

// Links de WhatsApp com mensagem pronta
document.querySelectorAll('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa); });

// Header + menu mobile
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const nav = document.getElementById('mainNav');
const toggle = document.getElementById('navToggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// ===== Agendamento =====
const form = document.getElementById('bookingForm');
const fFrom = document.getElementById('fFrom');
const fTo = document.getElementById('fTo');
const fDate = document.getElementById('fDate');
const fTime = document.getElementById('fTime');
const errorBox = document.getElementById('formError');

const today = new Date();
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
fDate.min = iso(today);

document.getElementById('swapBtn').addEventListener('click', () => {
  [fFrom.value, fTo.value] = [fTo.value, fFrom.value];
});

const pills = document.querySelectorAll('#routePills button');
pills.forEach((b) => b.addEventListener('click', () => {
  pills.forEach((p) => p.classList.remove('active'));
  b.classList.add('active');
  fFrom.value = b.dataset.from;
  fTo.value = b.dataset.to;
  fDate.focus();
}));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const required = [fFrom, fTo, fDate, fTime];
  required.forEach((f) => f.classList.toggle('invalid', !f.value.trim()));
  const missing = required.some((f) => !f.value.trim());
  errorBox.hidden = !missing;
  if (missing) return;

  const [y, m, d] = fDate.value.split('-');
  const pax = document.getElementById('fPax').value;
  const bags = document.getElementById('fBags').value;
  const flight = document.getElementById('fFlight').value.trim();
  const round = document.getElementById('fRound').checked;

  const lines = [
    'Olá, Leandro! Vim pelo site e quero agendar um transfer.',
    '',
    `Saída: ${fFrom.value.trim()}`,
    `Destino: ${fTo.value.trim()}`,
    `Data: ${d}/${m}/${y} às ${fTime.value}`,
    `Passageiros: ${pax} · Malas grandes: ${bags}`,
  ];
  if (flight) lines.push(`Voo: ${flight}`);
  lines.push(`Ida e volta: ${round ? 'sim' : 'não'}`);
  lines.push('', 'Pode me passar o valor?');

  window.open(waLink(lines.join('\n')), '_blank', 'noopener');
});

[fFrom, fTo, fDate, fTime].forEach((f) => f.addEventListener('input', () => f.classList.remove('invalid')));

// ===== Agenda de shows (some sozinho quando a data passa) =====
const SHOWS = [
  { date: '2026-10-04', label: '03·04', mon: 'out', name: "BK' · DLRE Tour", place: 'Fundição Progresso · Rio de Janeiro' },
  { date: '2026-11-15', label: '15', mon: 'nov', name: 'Luan Santana · Além do Registro', place: 'Caminho Niemeyer · Niterói' },
  { date: '2026-12-05', label: '05', mon: 'dez', name: 'Thiaguinho', place: 'Espaço Hall · Rio de Janeiro' },
  { date: '2026-12-12', label: '12', mon: 'dez', name: 'Jorge Vercillo', place: 'Rio de Janeiro' },
  { date: '2026-12-20', label: '20', mon: 'dez', name: 'Xuxa · A Última Nave', place: 'Maracanã · Rio de Janeiro' },
];

const list = document.getElementById('showsList');
const upcoming = SHOWS.filter((s) => s.date >= iso(today));
upcoming.forEach((s) => {
  const li = document.createElement('li');
  li.className = 'show reveal';
  const msg = `Olá, Leandro! Vim pelo site e quero reservar ida e volta pro show ${s.name} (${s.label}/${s.mon}).`;
  li.innerHTML = `
    <div class="show-date"><strong${s.label.length > 2 ? ' class="long"' : ''}>${s.label}</strong><span>${s.mon}</span></div>
    <div class="show-info"><h3>${s.name}</h3><p>${s.place}</p></div>
    <a class="btn btn-gold" href="${waLink(msg)}" target="_blank" rel="noopener">Reservar ida e volta</a>`;
  list.appendChild(li);
});
document.getElementById('showsEmpty').hidden = upcoming.length > 0;

// ===== Reveal on scroll =====
const revealTargets = document.querySelectorAll(
  '.section-head, .versus-card, .service, .booking, .agenda-intro, .car-photo, .car-info, .steps li, .about-photo, .about-text, .faq details, .show'
);
revealTargets.forEach((el) => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('in'));
}

document.getElementById('year').textContent = today.getFullYear();
