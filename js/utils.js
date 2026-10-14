/* ═══════════════════ CORE UTILITIES & DATE/SVG HELPERS ═══════════════════ */
window.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Парсинг даты формата ДД.ММ.ГГГГ или ГГГГ-ММ-ДД */
function parseRuDate(str) {
  if (!str || typeof str !== "string") return 0;
  const s = str.trim();
  const ruMatch = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (ruMatch) {
    const [, d, m, y] = ruMatch;
    return new Date(+y, +m - 1, +d).getTime();
  }
  const iso = Date.parse(s);
  return isNaN(iso) ? 0 : iso;
}

function normWatched(w) {
  if (!w) return [];
  if (Array.isArray(w)) return w;
  if (typeof w === "string") return [{ date: w, note: "" }];
  return [];
}

function watchedLatest(list) {
  const arr = normWatched(list);
  if (!arr.length) return null;
  return [...arr].sort((a, b) => parseRuDate(b.date) - parseRuDate(a.date))[0];
}

function accentHue(tier) {
  if (tier && typeof tier.hue === "number") return tier.hue;
  const map = { S: 45, A: 185, B: 275, C: 148 };
  return map[tier?.id] || 45;
}

function floralFrame() {
  return `<span class="floral-frame" aria-hidden="true"></span>`;
}

function royalCrown(uid) {
  return `<svg viewBox="0 0 32 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 15L5 5L11 11L16 2L21 11L27 5L30 15H2Z" fill="url(#crown_${esc(uid)})" stroke="#FFF4CE" stroke-width="1.2"/>
    <defs>
      <linearGradient id="crown_${esc(uid)}" x1="0" y1="0" x2="32" y2="18" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFE8A3"/>
        <stop offset="0.5" stop-color="#FFD76A"/>
        <stop offset="1" stop-color="#FF8E53"/>
      </linearGradient>
    </defs>
  </svg>`;
}

function reactionHtml(item) {
  if (!item.reaction) return "";
  return `<span class="card-reaction">${esc(item.reaction)}</span>`;
}

function showToast(msg, borderCol = "#ffd76a") {
  const host = document.getElementById("toastContainer");
  if (!host) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.style.borderLeftColor = borderCol;
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s";
    setTimeout(() => el.remove(), 320);
  }, 3400);
}
