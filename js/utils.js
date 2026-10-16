/* ═══════════════════ CORE UTILITIES v15.0 (MEMOIZED METRICS & FAST DATE CACHE) ═══════════════════ */
window.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
window.tiltPower = 14;

window.ALL_ANIME_GENRES = [
  "Авангард", "Автомобили", "Азартные игры", "Айдолы (Жен.)", "Айдолы (Муж.)", "Актрисы",
  "Альтернативная история", "Альтернативная реальность", "Ангелы", "Андроиды", "Антивойна",
  "Антигерой", "Антиутопия", "Антропоморфизм", "Апокалипсис", "Баскетбол", "Безумие",
  "Бисёнэн", "Боги и мифология", "Божества", "Боевик", "Боевые искусства", "Больница и медицина",
  "Вампиры", "Ведьмы", "Вестерн", "Видеоигры", "Виртуальная реальность", "Военная тематика",
  "Военное", "Война", "Волшебные девушки (Махо-сёдзё)", "Воры", "Выживание", "Гарем",
  "Гарем (для девочек)", "Гендерная интрига", "Гурман и кулинария", "Гэг-юмор", "Демоны",
  "Детектив", "Детское", "Дзёсэй", "Драконы", "Драма", "Дунхуа", "Жестокость и насилие",
  "Забота о детях", "Заговор", "Зомби", "Игры", "Игры разума", "Идолы", "Изобразительное искусство",
  "Инопланетные расы", "Инопланетяне", "Искусственный интеллект", "Искусство", "Исекай (Попаданцы)",
  "Исторический", "Исцеление (Иясикэй)", "Исэкай", "Киберпанк", "Киберспорт", "Киборги",
  "Китайское 3D", "Клубы по интересам", "Кодомо", "Комедия", "Космос", "Косплей", "Криминал",
  "Кроссдрессинг", "Кулинария", "Культивация", "Лоликон", "Любовный треугольник", "Магия",
  "Манга", "Мафия и якудза", "Мафия/Якудза", "Махо-сёдзё", "Машины", "Машины и гонки",
  "Медицина", "Меха", "Мистика", "Мотоциклы", "Моэ", "Музыка", "Мыльная опера", "Мюзикл",
  "Не японское", "Нелинейный сюжет", "Ниндзя", "Ночной вайб", "Обратный гарем", "Отаку-культура",
  "Охотники за головами", "Параллельный мир", "Пародия", "Перестрелки", "Пилотируемые роботы",
  "Пираты", "Повседневность", "Подземелья (Данжи)", "Политика", "Полицейские", "Полиция",
  "Полулюди", "Постапокалипсис", "Постапокалиптика", "Преступный мир", "Призраки", "Приключения",
  "Прокси бои", "Психологическое", "Психология", "Путешествия во времени", "Работа и офис",
  "Реинкарнация", "Ремейк", "Роботы", "Романтика", "Романтическая комедия", "Русалки",
  "Русские в аниме", "Самураи", "Сверхъестественное", "Сёдзё", "Сёдзё-ай", "Сэйнэн", "Сёнэн",
  "Сёнэн-ай", "Силовые костюмы", "Симулятор свиданий", "Сказка", "Скейтбординг", "Слэшер",
  "Смена пола", "Современное фэнтези", "Спорт", "Сражения на мечах", "Стимпанк", "Суккубы",
  "Суперсила", "Суперспособности", "Сурвайвал", "Тайный заговор", "Танцы", "Театр",
  "Темное фэнтези", "Тёмное фэнтези", "Темные эльфы", "Террористы", "Трагедия", "Трансформеры",
  "Триллер", "Убийцы", "Ужасы", "Учебное заведение", "Фантастика", "Феи", "Философия",
  "Фэнтези", "Хоррор", "Хулиганы", "Хулиганы (Янки)", "Целый фэнтези мир", "Цундэрэ",
  "Чёрный юмор", "Школа", "Школьная жизнь", "Шоу-бизнес", "Шпионаж", "Экшен", "Эльфы",
  "Эротика", "Этти", "Юри", "Яой", "Японский фольклор"
];

window.ALL_ANIME_STUDIOS = [
  "A-1 Pictures", "AIC", "Arms", "Artland", "Asread", "Bandai Namco Pictures", "Bibury Animation Studios",
  "Bones", "Brain's Base", "BUG FILMS", "C2C", "CloverWorks", "CoMix Wave Films", "CyberConnect2",
  "David Production", "Diomedéa", "Doga Kobo", "Drive", "Eight Bit (8bit)", "ENGI", "Feel.",
  "Gainax", "Geek Toys", "Geno Studio", "GoHands", "Gonzo", "Graphinica", "Hal Film Maker",
  "J.C.Staff", "Kinema Citrus", "Kyoto Animation", "Lapintrack", "Lerche", "Liber", "Liden Films",
  "Liden Films Kyoto", "Madhouse", "Manglobe", "MAPPA", "Maho Film", "Millepensee", "Nexus",
  "Nippon Animation", "Nut", "OLM", "OLM / TOHO animation", "Orange", "P.A. Works", "Passione",
  "Pierrot (Studio Pierrot)", "Polygon Pictures", "Production I.G", "Project No.9", "Satelight",
  "Science SARU", "Seven Arcs", "Shaft", "Shin-Ei Animation", "Silver Link.", "Studio 3Hz",
  "Studio Bind", "Studio Chizu", "Studio Comet", "Studio Deen", "Studio Ghibli", "Studio Gokumi",
  "Studio Kai", "Studio Mother", "Studio Ponoc", "Studio Voln", "Sunrise", "SynergySP",
  "Tatsunoko Production", "Tezuka Productions", "TMS Entertainment", "TNK", "Toei Animation",
  "Trigger", "Troyca", "Typhoon Graphics", "Ufotable", "White Fox", "Wit Studio", "Xebec",
  "Yostar Pictures", "Zero-G", "Zexcs"
];

const RU_MONTH_MAP = {
  "янв": 0, "фев": 1, "мар": 2, "апр": 3, "май": 4, "мая": 4, "июн": 5,
  "июл": 6, "авг": 7, "сен": 8, "окт": 9, "ноя": 10, "дек": 11
};

/* Кэш распарсенных дат и метрик тайтлов для мгновенного рендера за O(1) */
const DATE_PARSE_CACHE = new Map();
const ITEM_METRICS_CACHE = new WeakMap();

function pluralRu(number, one, few, many) {
  const n = Math.abs(number) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

function formatTitlesCount(n) {
  return `${n} ${pluralRu(n, "тайтл", "тайтла", "тайтлов")}`;
}

function formatEpisodesCount(n) {
  return `${n} ${pluralRu(n, "серия", "серии", "серий")}`;
}

function formatMoviesCount(n) {
  return `${n} ${pluralRu(n, "фильм", "фильма", "фильмов")}`;
}

const ESC_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/[&<>"]/g, ch => ESC_MAP[ch]);
}

function parseFlexibleRuDate(str) {
  if (!str && str !== 0) return null;
  const s = String(str).trim();
  if (!s) return null;

  if (DATE_PARSE_CACHE.has(s)) return DATE_PARSE_CACHE.get(s);

  let result = null;
  const fullRu = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (fullRu) {
    const d = +fullRu[1], m = +fullRu[2] - 1, y = +fullRu[3];
    if (m >= 0 && m <= 11 && d >= 1 && d <= 31) {
      result = { precision: "day", year: y, month: m, day: d, ms: new Date(y, m, d).getTime(), raw: s };
    }
  }

  if (!result) {
    const fullIso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (fullIso) {
      const y = +fullIso[1], m = +fullIso[2] - 1, d = +fullIso[3];
      if (m >= 0 && m <= 11 && d >= 1 && d <= 31) {
        result = { precision: "day", year: y, month: m, day: d, ms: new Date(y, m, d).getTime(), raw: s };
      }
    }
  }

  if (!result) {
    const monthYr = s.match(/^(\d{1,2})[./-](\d{4})$/);
    if (monthYr) {
      const m = +monthYr[1] - 1, y = +monthYr[2];
      if (m >= 0 && m <= 11) {
        result = { precision: "month", year: y, month: m, day: null, ms: new Date(y, m, 1).getTime(), raw: s };
      }
    }
  }

  if (!result) {
    const yrMonth = s.match(/^(\d{4})[./-](\d{1,2})$/);
    if (yrMonth) {
      const y = +yrMonth[1], m = +yrMonth[2] - 1;
      if (m >= 0 && m <= 11) {
        result = { precision: "month", year: y, month: m, day: null, ms: new Date(y, m, 1).getTime(), raw: s };
      }
    }
  }

  if (!result) {
    const textMonthMatch = s.toLowerCase().match(/([а-яё]{3,})\s*(\d{4})/);
    if (textMonthMatch) {
      const prefix = textMonthMatch[1].slice(0, 3);
      const y = +textMonthMatch[2];
      if (prefix in RU_MONTH_MAP) {
        const m = RU_MONTH_MAP[prefix];
        result = { precision: "month", year: y, month: m, day: null, ms: new Date(y, m, 1).getTime(), raw: s };
      }
    }
  }

  if (!result) {
    const yearOnly = s.match(/(?:^|\D)(19\d{2}|20\d{2})(?:\D|$)/);
    if (yearOnly) {
      const y = +yearOnly[1];
      result = { precision: "year", year: y, month: null, day: null, ms: new Date(y, 0, 1).getTime(), raw: String(y) };
    }
  }

  if (DATE_PARSE_CACHE.size > 2000) DATE_PARSE_CACHE.clear();
  DATE_PARSE_CACHE.set(s, result);
  return result;
}

function parseRuDate(str) {
  const parsed = parseFlexibleRuDate(str);
  return parsed ? parsed.ms : 0;
}

function normWatched(w) {
  if (!w) return [];
  if (Array.isArray(w)) return w;
  if (typeof w === "string") return [{ date: w, note: "" }];
  return [];
}

function normSeasons(item) {
  if (!item) return [];
  const baseYear = item.year || 2026;
  if (Array.isArray(item.seasons) && item.seasons.length > 0) {
    return item.seasons.map((s, idx) => {
      const parsedEp = parseInt(s.episodes, 10);
      const eps = isNaN(parsedEp) ? 1 : Math.max(0, parsedEp);
      const parsedMin = parseFloat(s.epMinutes);
      const epMin = isNaN(parsedMin) ? (s.type === "Фильм" ? 110 : 24) : Math.max(0, parsedMin);
      return {
        title: s.title || `Сезон ${idx + 1}`,
        type: s.type || item.kind || "TV Сериал",
        releaseYear: s.releaseYear || baseYear,
        episodes: eps,
        epMinutes: epMin,
        date: s.date !== undefined && s.date !== null ? String(s.date).trim() : "",
        note: s.note || ""
      };
    });
  }
  const rawEps = parseInt(String(item.episodes ?? "12").replace(/\D/g, ""), 10);
  const parsedEps = isNaN(rawEps) ? 12 : Math.max(0, rawEps);
  const kind = item.kind || "TV Сериал";
  const defaultMin = kind === "Фильм" ? 110 : 24;
  const w = normWatched(item.watched);
  return [
    {
      title: kind === "Фильм" ? "Полнометражный фильм" : "Сезон 1",
      type: kind,
      releaseYear: baseYear,
      episodes: kind === "Фильм" ? 1 : parsedEps,
      epMinutes: parseFloat(item.epMinutes) || defaultMin,
      date: w[0]?.date || String(baseYear),
      note: w[0]?.note || ""
    }
  ];
}

/* Мемоизированный расчёт метрик: если объект item не менялся, возвращает готовый результат за 0 мс */
function calcItemMetrics(item) {
  if (!item || typeof item !== "object") {
    return { seasons: [], kind: "TV Сериал", totalEpisodes: 0, totalMovies: 0, totalMinutes: 0, totalHours: 0, totalDays: 0, latestMs: 0, latestYear: 2026 };
  }

  const cacheSig = `${item.kind || ""}_${item.year || ""}_${(item.seasons || []).length}_${item.seasons ? item.seasons.map(s => `${s.type}:${s.episodes}:${s.epMinutes}:${s.date}`).join("|") : item.episodes}`;
  const cached = ITEM_METRICS_CACHE.get(item);
  if (cached && cached.sig === cacheSig) {
    return cached.value;
  }

  const seasons = normSeasons(item);
  let totalEpisodes = 0;
  let totalMovies = 0;
  let totalMinutes = 0;
  let latestMs = 0;
  let latestYear = item.year || 2026;
  let latestWatchStr = "";

  for (let i = 0; i < seasons.length; i++) {
    const s = seasons[i];
    const rawEp = parseInt(s.episodes, 10);
    const eps = isNaN(rawEp) ? 0 : Math.max(0, rawEp);
    const rawMin = parseFloat(s.epMinutes);
    const mins = isNaN(rawMin) ? (s.type === "Фильм" ? 110 : 24) : Math.max(0, rawMin);

    if (eps > 0) {
      const partMinutes = eps * mins;
      totalMinutes += partMinutes;
      if (s.type === "Фильм") totalMovies += eps;
      else totalEpisodes += eps;
    }

    const parsedDate = parseFlexibleRuDate(s.date);
    if (parsedDate && parsedDate.ms >= latestMs) {
      latestMs = parsedDate.ms;
      latestYear = parsedDate.year;
      latestWatchStr = parsedDate.raw || s.date || "";
    }
  }

  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;

  const computed = {
    seasons,
    kind: item.kind || seasons[0]?.type || "TV Сериал",
    totalEpisodes,
    totalMovies,
    totalMinutes,
    totalHours,
    totalDays,
    latestMs,
    latestYear,
    latestWatchStr
  };

  ITEM_METRICS_CACHE.set(item, { sig: cacheSig, value: computed });
  return computed;
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

function reactionHtml() {
  return "";
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
    el.style.transition = "opacity 0.25s";
    setTimeout(() => el.remove(), 260);
  }, 3200);
}
