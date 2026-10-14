/* ═══════════════════ CORE UTILITIES, FULL ANIME GENRES ENCYCLOPEDIA & METRICS ═══════════════════ */
window.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
window.tiltPower = 14;

/* Полный каталог всех существующих жанров, тем и демографий аниме (Shikimori / MAL / AniList) */
window.ALL_ANIME_GENRES = [
  "Авангард", "Автомобили", "Азартные игры", "Айдолы (Жен.)", "Айдолы (Муж.)", "Актрисы",
  "Альтернативная история", "Антропоморфизм", "Антигерой", "Антиутопия", "Апокалипсис",
  "Боевик", "Боевые искусства", "Боги и мифология", "Больница и медицина", "Вампиры",
  "Ведьмы", "Вестерн", "Видеоигры", "Виртуальная реальность", "Военное", "Война",
  "Волшебные девушки (Махо-сёдзё)", "Выживание", "Гарем", "Гендерная интрига", "Гурман и кулинария",
  "Гэг-юмор", "Демоны", "Детектив", "Детское", "Дзёсэй", "Драконы", "Драма", "Дунхуа",
  "Жестокость и насилие", "Забота о детях", "Заговор", "Зомби", "Игры разума", "Идолы",
  "Изобразительное искусство", "Инопланетяне", "Исекай (Попаданцы)", "Исторический", "Исцеление (Иясикэй)",
  "Киберпанк", "Киберспорт", "Клубы по интересам", "Кодомо", "Комедия", "Космос",
  "Косплей", "Криминал", "Кроссдрессинг", "Культивация", "Любовный треугольник", "Магия",
  "Мафия и якудза", "Машины и гонки", "Меха", "Мистика", "Моэ", "Музыка", "Мыльная опера",
  "Мюзикл", "Ниндзя", "Ночной вайб", "Обратный гарем", "Отаку-культура", "Пародия",
  "Пираты", "Повседневность", "Подземелья (Данжи)", "Политика", "Полиция", "Постапокалипсис",
  "Преступный мир", "Приключения", "Призраки", "Психологическое", "Путешествия во времени",
  "Работа и офис", "Реинкарнация", "Ремейк", "Роботы", "Романтика", "Романтическая комедия",
  "Самураи", "Сверхъестественное", "Сёдзё", "Сёдзё-ай", "Сэйнэн", "Сёнэн", "Сёнэн-ай",
  "Симулятор свиданий", "Сказка", "Скейтбординг", "Слэшер", "Смена пола", "Спорт",
  "Стимпанк", "Суперсила", "Сурвайвал", "Тайный заговор", "Танцы", "Театр", "Тёмное фэнтези",
  "Трагедия", "Триллер", "Ужасы", "Учебное заведение", "Фантастика", "Философия",
  "Фэнтези", "Хоррор", "Хулиганы (Янки)", "Цундэрэ", "Чёрный юмор", "Школа", "Шоу-бизнес",
  "Шпионаж", "Экшен", "Эротика", "Этти", "Юри", "Яой", "Японский фольклор"
];

function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

function normSeasons(item) {
  if (!item) return [];
  if (Array.isArray(item.seasons) && item.seasons.length > 0) {
    return item.seasons.map((s, idx) => ({
      title: s.title || `Сезон ${idx + 1}`,
      type: s.type || item.kind || "TV Сериал",
      episodes: Math.max(1, parseInt(s.episodes, 10) || 1),
      epMinutes: Math.max(1, parseFloat(s.epMinutes) || (s.type === "Фильм" ? 110 : 24)),
      date: s.date || "14.10.2026",
      note: s.note || ""
    }));
  }
  const parsedEps = parseInt(String(item.episodes || "12").replace(/\D/g, ""), 10) || 12;
  const kind = item.kind || "TV Сериал";
  const defaultMin = kind === "Фильм" ? 110 : 24;
  const w = normWatched(item.watched);
  return [
    {
      title: kind === "Фильм" ? "Полнометражный фильм" : "Сезон 1",
      type: kind,
      episodes: kind === "Фильм" ? 1 : parsedEps,
      epMinutes: parseFloat(item.epMinutes) || defaultMin,
      date: w[0]?.date || "14.10.2026",
      note: w[0]?.note || "Просмотр"
    }
  ];
}

function calcItemMetrics(item) {
  const seasons = normSeasons(item);
  let totalEpisodes = 0;
  let totalMovies = 0;
  let totalMinutes = 0;
  let latestMs = 0;
  let latestDateStr = "";

  seasons.forEach(s => {
    const eps = Math.max(1, parseInt(s.episodes, 10) || 1);
    const mins = Math.max(1, parseFloat(s.epMinutes) || (s.type === "Фильм" ? 110 : 24));
    const partMinutes = eps * mins;
    totalMinutes += partMinutes;

    if (s.type === "Фильм") {
      totalMovies += eps;
    } else {
      totalEpisodes += eps;
    }

    const ms = parseRuDate(s.date);
    if (ms >= latestMs) {
      latestMs = ms;
      latestDateStr = s.date;
    }
  });

  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;

  return {
    seasons,
    kind: item.kind || seasons[0]?.type || "TV Сериал",
    totalEpisodes,
    totalMovies,
    totalMinutes,
    totalHours,
    totalDays,
    latestMs,
    latestDateStr,
    latestYear: latestMs ? new Date(latestMs).getFullYear() : (item.year || 2026)
  };
}

function formatHours(hoursFloat) {
  const h = Number(hoursFloat || 0);
  return h % 1 === 0 ? h.toFixed(0) : h.toFixed(1);
}

function accentHue(tier) {
  if (tier && typeof tier.hue === "number") return tier.hue;
  const map = { S: 45, A: 185, B: 275, C: 148, D: 28, E: 215 };
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
