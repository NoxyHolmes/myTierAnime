/* ═══════════════════ 3D LAYER GENERATOR, YEAR CALCULATOR & 14-LAYER EXTRUSION (S–E) ═══════════════════ */
const ELEMENT_NAMES = ["Сияние", "Призма", "Тушь", "Сакура", "Янтарь", "Пепел"];
const ELEMENT_ART   = ["radiance", "prism", "ink", "sakura", "amber", "ash"];
const ORBIT_NAMES   = ["Солнечная корона", "Двойная орбита", "Кристалл впечатлений", "Световая волна", "Маятник времени", "Кольцо забвения"];
const REALISM_NAMES = [
  "Астролябия Короны",
  "Тессеракт Дисперсии",
  "Магнитный Тор",
  "Био-Сфера Росы",
  "Янтарный Маятник",
  "Монолит Забвения"
];

function tierActiveYear(tier) {
  const curYr = new Date().getFullYear();
  if (!tier || !Array.isArray(tier.items)) return curYr;
  let maxYr = 0;
  tier.items.forEach(it => {
    const m = calcItemMetrics(it);
    if (m.latestYear && m.latestYear > maxYr) maxYr = m.latestYear;
  });
  return maxYr || curYr;
}

function realismMarkup(index, tier) {
  const yr = tierActiveYear(tier);
  const hue = tier ? accentHue(tier) : [45, 185, 275, 148, 28, 215][index % 6];
  return `<div class="realism-system" aria-hidden="true">
    <canvas class="seal-canvas-3d" width="220" height="220" data-seal-idx="${index % 6}" data-hue="${hue}"></canvas>
    <div class="realism-gimbal"><span class="rg-ring r-outer"></span><span class="rg-ring r-inner"></span></div>
  </div>
  <span class="seal-year-3d" aria-hidden="true"><i class="sy-dot"></i><b class="sy-yr">${yr}</b><small class="sy-tag">3D</small></span>`;
}

function elementMarkup(index) {
  const art = ELEMENT_ART[index % 6];
  return `<div class="element-system" data-art="${art}" aria-hidden="true">
    <div class="orbit-ring"></div>
  </div>`;
}

function orbitalMarkup() {
  return `<div class="orbit-system" aria-hidden="true">
    <div class="orbit-ring o1"></div>
    <div class="orbit-ring o2"></div>
  </div>`;
}

const LETTER_DEPTH = 14;
function build3DLetter(host, tier, idx) {
  if (!host) return;
  host.innerHTML = "";
  const inner = document.createElement("div");
  inner.className = "l3d-in";
  inner.style.animationDelay = (-idx * 1.4) + "s";
  const frag = document.createDocumentFragment();
  for (let i = LETTER_DEPTH; i >= 1; i--) {
    const s = document.createElement("span");
    s.className = "ll back";
    s.textContent = tier.id;
    s.style.transform = "translateZ(" + (-i * 2.1).toFixed(1) + "px)";
    s.style.opacity = (0.94 - i * 0.052).toFixed(3);
    frag.appendChild(s);
  }
  const face = document.createElement("span");
  face.className = "ll face";
  face.textContent = tier.id;
  frag.appendChild(face);

  const bevel = document.createElement("span");
  bevel.className = "ll bevel";
  bevel.textContent = tier.id;
  frag.appendChild(bevel);

  const halo = document.createElement("span");
  halo.className = "ll halo";
  halo.textContent = tier.id;
  frag.appendChild(halo);

  inner.appendChild(frag);
  host.appendChild(inner);
}

function tiltToward(el, e, vars, amt) {
  const r = el.getBoundingClientRect();
  const ux = (e.clientX - r.left) / r.width;
  const uy = (e.clientY - r.top) / r.height;
  const px = ux - 0.5;
  const py = uy - 0.5;
  el.style.setProperty(vars[0], (px * amt).toFixed(2) + "deg");
  el.style.setProperty(vars[1], (-py * amt).toFixed(2) + "deg");
  el.style.setProperty("--px", (ux * 100).toFixed(1) + "%");
  el.style.setProperty("--py", (uy * 100).toFixed(1) + "%");
  el.style.setProperty("--holo-ang", (Math.atan2(py, px) * 57.2958).toFixed(1));
}
