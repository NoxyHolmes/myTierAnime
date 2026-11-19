/* ═══════════════════ CORE UTILITIES: MODULAR UNIQUE ART FRAMES & REWATCH ENGINE (v28.0) ═══════════════════ */
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

function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tiltToward(el, e, vars, maxDeg = 14) {
  if (!el || !e) return;
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  el.style.setProperty(vars[0], `${(x * maxDeg * 2).toFixed(2)}deg`);
  el.style.setProperty(vars[1], `${(-y * maxDeg * 2).toFixed(2)}deg`);
}

function parseFlexibleRuDate(str) {
  if (str === null || str === undefined) return null;
  const s = String(str).trim();
  if (!s || s === "0" || s === "—" || s.toLowerCase() === "анонс") return null;

  const fullRu = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (fullRu) {
    const d = +fullRu[1], m = +fullRu[2] - 1, y = +fullRu[3];
    if (m >= 0 && m <= 11 && d >= 1 && d <= 31) {
      return { precision: "day", year: y, month: m, day: d, ms: new Date(y, m, d).getTime(), raw: s };
    }
  }

  const fullIso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (fullIso) {
    const y = +fullIso[1], m = +fullIso[2] - 1, d = +fullIso[3];
    if (m >= 0 && m <= 11 && d >= 1 && d <= 31) {
      return { precision: "day", year: y, month: m, day: d, ms: new Date(y, m, d).getTime(), raw: s };
    }
  }

  const monthYr = s.match(/^(\d{1,2})[./-](\d{4})$/);
  if (monthYr) {
    const m = +monthYr[1] - 1, y = +monthYr[2];
    if (m >= 0 && m <= 11) {
      return { precision: "month", year: y, month: m, day: null, ms: new Date(y, m, 1).getTime(), raw: s };
    }
  }

  const yrMonth = s.match(/^(\d{4})[./-](\d{1,2})$/);
  if (yrMonth) {
    const y = +yrMonth[1], m = +yrMonth[2] - 1;
    if (m >= 0 && m <= 11) {
      return { precision: "month", year: y, month: m, day: null, ms: new Date(y, m, 1).getTime(), raw: s };
    }
  }

  const textMonthMatch = s.toLowerCase().match(/([а-яё]{3,})\s*(\d{4})/);
  if (textMonthMatch) {
    const prefix = textMonthMatch[1].slice(0, 3);
    const y = +textMonthMatch[2];
    if (prefix in RU_MONTH_MAP) {
      const m = RU_MONTH_MAP[prefix];
      return { precision: "month", year: y, month: m, day: null, ms: new Date(y, m, 1).getTime(), raw: s };
    }
  }

  const yearOnly = s.match(/(?:^|\D)(19\d{2}|20\d{2})(?:\D|$)/);
  if (yearOnly) {
    const y = +yearOnly[1];
    return { precision: "year", year: y, month: null, day: null, ms: new Date(y, 11, 31, 23, 59, 59).getTime(), raw: String(y) };
  }

  return null;
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
  const baseYear = item.year !== undefined && item.year !== "" ? Number(item.year) : 2026;
  if (Array.isArray(item.seasons) && item.seasons.length > 0) {
    return item.seasons.map((s, idx) => {
      const parsedEp = parseInt(s.episodes, 10);
      const eps = isNaN(parsedEp) ? 1 : Math.max(0, parsedEp);
      const parsedMin = parseFloat(s.epMinutes);
      const epMin = isNaN(parsedMin) ? (s.type === "Фильм" ? 110 : 24) : Math.max(0, parsedMin);

      let relYr = baseYear;
      if (s.releaseYear !== undefined && s.releaseYear !== null && String(s.releaseYear).trim() !== "") {
        const parsedYr = parseInt(s.releaseYear, 10);
        if (!isNaN(parsedYr)) relYr = Math.max(0, parsedYr);
      } else if (eps === 0) {
        relYr = 0;
      }

      const rawDate = s.date !== undefined && s.date !== null ? String(s.date).trim() : "";
      return {
        title: s.title || `Сезон ${idx + 1}`,
        type: s.type || item.kind || "TV Сериал",
        releaseYear: relYr,
        episodes: eps,
        epMinutes: epMin,
        date: rawDate === "0" ? "" : rawDate,
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

function calcItemMetrics(item) {
  const rawSeasons = normSeasons(item);
  const seenByTitleMap = new Map();
  const groupedSeasons = [];

  let uniqueEpisodes = 0;
  let uniqueMovies = 0;
  let uniqueMinutes = 0;

  let viewedEpisodes = 0;
  let viewedMovies = 0;
  let viewedMinutes = 0;
  let rewatchCount = 0;

  let latestMs = 0;
  let latestYear = item?.year || "";
  let latestWatchStr = "";

  const seasons = rawSeasons.map(s => {
    const rawEp = parseInt(s.episodes, 10);
    const eps = isNaN(rawEp) ? 0 : Math.max(0, rawEp);
    const rawMin = parseFloat(s.epMinutes);
    const mins = isNaN(rawMin) ? (s.type === "Фильм" ? 110 : 24) : Math.max(0, rawMin);

    const exactTitleKey = `${String(s.type || "TV Сериал").trim().toLowerCase()}::${String(s.title || "").trim().toLowerCase()}`;
    const existingGroup = seenByTitleMap.get(exactTitleKey);
    const isRewatch = eps > 0 && !!existingGroup;
    const rewatchNumber = existingGroup ? (existingGroup.watchCount + 1) : 1;

    if (eps > 0) {
      const partMinutes = eps * mins;

      viewedMinutes += partMinutes;
      if (s.type === "Фильм") viewedMovies += eps;
      else viewedEpisodes += eps;

      if (!existingGroup) {
        uniqueMinutes += partMinutes;
        if (s.type === "Фильм") uniqueMovies += eps;
        else uniqueEpisodes += eps;

        const groupEntry = {
          ...s,
          isRewatch: false,
          watchCount: 1,
          watchHistory: [{ num: 1, date: s.date || "—", note: s.note || "" }]
        };
        seenByTitleMap.set(exactTitleKey, groupEntry);
        groupedSeasons.push(groupEntry);
      } else {
        rewatchCount++;
        existingGroup.watchCount++;
        existingGroup.isRewatch = true;
        existingGroup.watchHistory.push({
          num: existingGroup.watchCount,
          date: s.date || "Повтор",
          note: s.note || ""
        });
        if (s.date && String(s.date).trim()) {
          existingGroup.latestRewatchDate = String(s.date).trim();
        }
      }
    } else {
      groupedSeasons.push({
        ...s,
        isRewatch: false,
        watchCount: 0,
        watchHistory: []
      });
    }

    const parsedDate = parseFlexibleRuDate(s.date);
    if (parsedDate && parsedDate.ms >= latestMs) {
      latestMs = parsedDate.ms;
      latestYear = parsedDate.year;
      latestWatchStr = parsedDate.raw || s.date || "";
    }

    return {
      ...s,
      isRewatch,
      rewatchNumber
    };
  });

  const totalHours = uniqueMinutes / 60;
  const totalDays = totalHours / 24;
  const viewedHours = viewedMinutes / 60;
  const viewedDays = viewedHours / 24;

  return {
    seasons,
    groupedSeasons,
    kind: item?.kind || seasons[0]?.type || "TV Сериал",
    totalEpisodes: uniqueEpisodes,
    totalMovies: uniqueMovies,
    totalMinutes: uniqueMinutes,
    totalHours,
    totalDays,
    viewedEpisodes,
    viewedMovies,
    viewedMinutes,
    viewedHours,
    viewedDays,
    rewatchCount,
    latestMs,
    latestYear,
    latestWatchStr
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

function reactionHtml() {
  return "";
}

/* ═══════════════════ МОДУЛЬНЫЙ ГЕНЕРАТОР УНИКАЛЬНЫХ РАМОК (v28.0) ═══════════════════ */
(function injectUniqueArtFrameStyles() {
  if (document.getElementById("mtaUniqueArtFrameStyles")) return;
  const st = document.createElement("style");
  st.id = "mtaUniqueArtFrameStyles";
  st.textContent = `
    .anime-custom-frame {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      border-radius: inherit !important;
      pointer-events: none !important;
      z-index: 3 !important;
      overflow: hidden !important;
    }
    .acf-heavy-svg {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      display: block !important;
      pointer-events: none !important;
      filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.9));
      transition: filter 0.25s ease !important;
    }
    .card:hover .acf-heavy-svg,
    .recent-item-card:hover .acf-heavy-svg {
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 9px var(--fc1, #ffd76a)) !important;
    }
    .acf-img-overlay {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: fill !important;
      mix-blend-mode: screen !important;
      pointer-events: none !important;
      z-index: 4 !important;
    }
    .card:has(.anime-custom-frame) .rank {
      top: 28px !important;
      left: 7px !important;
      width: 17px !important;
      height: 17px !important;
      font-size: 8.5px !important;
    }
  `;
  if (document.head) document.head.appendChild(st);
  else window.addEventListener("DOMContentLoaded", () => document.head.appendChild(st));
})();

function svgClover5(cx, cy, r, fill, stroke) {
  let out = `<circle cx="${cx}" cy="${cy}" r="${r * 1.08}" fill="rgba(8,6,14,0.86)" stroke="${stroke}" stroke-width="1"/>`;
  for (let i = 0; i < 5; i++) {
    out += `<g transform="translate(${cx},${cy}) rotate(${-90 + i * 72})">
      <path d="M0,0 C-${r * 0.42},-${r * 0.35} -${r * 0.58},-${r * 0.95} -${r * 0.16},-${r * 0.98} C0,-${r * 0.82} 0,-${r * 0.82} ${r * 0.16},-${r * 0.98} C${r * 0.58},-${r * 0.95} ${r * 0.42},-${r * 0.35} 0,0 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>
    </g>`;
  }
  return out + `<circle cx="${cx}" cy="${cy}" r="${r * 0.16}" fill="#dc143c"/>`;
}

const FRAME_BORDERS = {
  parchment: (c1, c2, p) => `
    <path d="M0,0 H200 V300 H0 Z M18,34 C50,22 150,22 182,34 C190,85 190,215 180,268 C145,282 55,282 20,268 C10,215 10,85 18,34 Z" fill="#09070e" fill-rule="evenodd" opacity="0.88"/>
    <path d="M3,3 H197 V297 H3 Z M17,33 C50,22 150,22 183,33 C190,85 190,215 180,269 C145,282 55,282 20,269 C10,215 10,85 17,33 Z" fill="none" stroke="${p}" stroke-width="2"/>
    <path d="M20,36 C50,25 150,25 180,36 C187,85 187,215 177,266 C145,278 55,278 23,266 C13,215 13,85 20,36 Z" fill="none" stroke="${c1}" stroke-width="1.5" stroke-dasharray="12 5 3 5"/>`,
  cyber: (c1, c2) => `
    <path d="M0,0 H200 V300 H0 Z M16,28 L28,18 H172 L184,28 V272 L172,282 H28 L16,272 Z" fill="#060812" fill-rule="evenodd" opacity="0.85"/>
    <polyline points="2,42 2,14 14,2 42,2" fill="none" stroke="${c1}" stroke-width="3"/>
    <polyline points="198,42 198,14 186,2 158,2" fill="none" stroke="${c2}" stroke-width="3"/>
    <polyline points="2,258 2,286 14,298 42,298" fill="none" stroke="${c2}" stroke-width="3"/>
    <polyline points="198,258 198,286 186,298 158,298" fill="none" stroke="${c1}" stroke-width="3"/>
    <path d="M16,28 L28,18 H172 L184,28 V272 L172,282 H28 L16,272 Z" fill="none" stroke="${c1}" stroke-width="1.3" stroke-dasharray="16 4 2 4"/>`,
  japanese: (c1, c2, p) => `
    <path d="M0,0 H200 V300 H0 Z M16,26 H184 V274 H16 Z" fill="#0b0810" fill-rule="evenodd" opacity="0.86"/>
    <path d="M4,12 Q100,2 196,12 L192,22 Q100,14 8,22 Z" fill="${c1}" stroke="${p}" stroke-width="1.2"/>
    <rect x="4" y="4" width="192" height="292" fill="none" stroke="${p}" stroke-width="1.8"/>
    <rect x="14" y="25" width="172" height="250" fill="none" stroke="${c2}" stroke-width="1.4" stroke-dasharray="8 6"/>`,
  gothic: (c1, c2, p) => `
    <path d="M0,0 H200 V300 H0 Z M20,40 Q100,14 180,40 L185,264 Q100,286 15,264 Z" fill="#08050c" fill-rule="evenodd" opacity="0.9"/>
    <path d="M20,40 Q100,14 180,40 L185,264 Q100,286 15,264 Z" fill="none" stroke="${c1}" stroke-width="2"/>
    <path d="M4,4 L24,14 L14,24 Z M196,4 L176,14 L186,24 Z M4,296 L24,286 L14,276 Z M196,296 L176,286 L186,276 Z" fill="${c1}" stroke="${p}" stroke-width="0.9"/>`,
  floral: (c1, c2, p) => `
    <path d="M0,0 H200 V300 H0 Z M18,32 C60,20 140,20 182,32 C190,100 190,200 182,268 C140,280 60,280 18,268 C10,200 10,100 18,32 Z" fill="#0e0918" fill-rule="evenodd" opacity="0.82"/>
    <path d="M10,30 C50,14 150,14 190,30 M10,270 C50,286 150,286 190,270" fill="none" stroke="${c1}" stroke-width="2.2"/>
    <path d="M14,34 C6,100 6,200 14,266 M186,34 C194,100 194,200 186,266" fill="none" stroke="${c2}" stroke-width="1.8"/>`,
  frost: (c1, c2) => `
    <path d="M0,0 H200 V300 H0 Z M22,26 L100,18 L178,26 L186,150 L178,274 L100,282 L22,274 L14,150 Z" fill="#070e1c" fill-rule="evenodd" opacity="0.84"/>
    <polygon points="22,26 100,18 178,26 186,150 178,274 100,282 22,274 14,150" fill="none" stroke="${c1}" stroke-width="1.8"/>
    <polygon points="4,4 32,4 4,32" fill="${c1}" opacity="0.7"/>
    <polygon points="196,4 168,4 196,32" fill="${c2}" opacity="0.7"/>
    <polygon points="4,296 32,296 4,268" fill="${c2}" opacity="0.7"/>
    <polygon points="196,296 168,296 196,268" fill="${c1}" opacity="0.7"/>`,
  cinema: (c1, c2) => `
    <path d="M0,0 H200 V300 H0 Z M18,24 H182 V276 H18 Z" fill="#090710" fill-rule="evenodd" opacity="0.88"/>
    <rect x="18" y="24" width="164" height="252" fill="none" stroke="${c1}" stroke-width="1.6"/>
    ${[35,65,95,125,155,185,215,245].map(y => `<rect x="4" y="${y}" width="8" height="12" rx="1.5" fill="${c2}" opacity="0.75"/><rect x="188" y="${y}" width="8" height="12" rx="1.5" fill="${c2}" opacity="0.75"/>`).join("")}`,
  baroque: (c1, c2, p) => `
    <path d="M0,0 H200 V300 H0 Z M20,32 Q100,18 180,32 Q190,150 180,268 Q100,282 20,268 Q10,150 20,32 Z" fill="#0d0914" fill-rule="evenodd" opacity="0.88"/>
    <path d="M20,32 Q100,18 180,32 Q190,150 180,268 Q100,282 20,268 Q10,150 20,32 Z" fill="none" stroke="${p}" stroke-width="2"/>
    <circle cx="14" cy="14" r="9" fill="none" stroke="${c1}" stroke-width="1.8"/>
    <circle cx="186" cy="14" r="9" fill="none" stroke="${c1}" stroke-width="1.8"/>
    <circle cx="14" cy="286" r="9" fill="none" stroke="${c2}" stroke-width="1.8"/>
    <circle cx="186" cy="286" r="9" fill="none" stroke="${c2}" stroke-width="1.8"/>`
};

const LEFT_ARTS = {
  buster: (c1, c2, p) => `<g transform="translate(15,190) rotate(-6)">
    <line x1="0" y1="-88" x2="0" y2="-62" stroke="${p}" stroke-width="3"/>
    <path d="M-12,-62 H12 L8,-56 H-8 Z" fill="${p}"/>
    <polygon points="-6,-56 6,-56 8,66 0,86 -8,66" fill="#17131e" stroke="${p}" stroke-width="1.5"/>
    <line x1="0" y1="-52" x2="0" y2="76" stroke="${c1}" stroke-width="1.5"/>
  </g>`,
  kunai: (c1, c2, p) => `<g transform="translate(15,180) rotate(-5)">
    <circle cx="0" cy="-72" r="5" fill="none" stroke="${p}" stroke-width="2"/>
    <rect x="-2.5" y="-67" width="5" height="20" fill="${c1}"/>
    <polygon points="-9,-47 9,-47 4,-32 10,50 0,76 -10,50 -4,-32" fill="#181522" stroke="${p}" stroke-width="1.5"/>
  </g>`,
  katana: (c1, c2, p) => `<g transform="translate(14,185) rotate(-4)">
    <rect x="-2" y="-82" width="4" height="24" fill="${c2}" stroke="${p}" stroke-width="0.9"/>
    <ellipse cx="0" cy="-58" rx="8" ry="2.5" fill="${c1}" stroke="${p}" stroke-width="0.9"/>
    <path d="M-2.5,-55 L2.5,-55 Q5,20 0,82 Q-3,20 -2.5,-55 Z" fill="#dce4f0" stroke="${c1}" stroke-width="1.1"/>
  </g>`,
  staff: (c1, c2, p) => `<g transform="translate(15,185) rotate(-4)">
    <circle cx="0" cy="-74" r="9" fill="#0b0814" stroke="${p}" stroke-width="1.8"/>
    <polygon points="0,-81 5,-74 0,-67 -5,-74" fill="${c1}"/>
    <line x1="0" y1="-65" x2="0" y2="82" stroke="${p}" stroke-width="2.8"/>
  </g>`,
  chainsaw: (c1, c2, p) => `<g transform="translate(13,182)">
    <polyline points="-3,-75 6,-65 -3,-55 6,-45 -3,-35 6,-25 -3,-15 6,-5 -3,5 6,15 -3,25 6,35 -3,45 6,55 -3,65 2,78" fill="none" stroke="${p}" stroke-width="2"/>
    <line x1="-2" y1="-75" x2="-2" y2="78" stroke="${c1}" stroke-width="2.5"/>
  </g>`,
  guitar: (c1, c2, p) => `<g transform="translate(15,188) rotate(-5)">
    <line x1="0" y1="-76" x2="0" y2="10" stroke="${p}" stroke-width="2.8"/>
    <path d="M-9,10 C-14,25 -10,48 0,52 C10,48 14,25 9,10 Z" fill="${c1}" stroke="${p}" stroke-width="1.4"/>
    <circle cx="0" cy="30" r="4" fill="#09070e" stroke="${c2}" stroke-width="1.2"/>
  </g>`,
  wing: (c1, c2, p) => `<g transform="translate(14,175)">
    <path d="M-6,-55 C12,-40 16,-10 2,20 C12,5 12,35 -4,60 C-10,20 -10,-20 -6,-55 Z" fill="${c1}" stroke="${p}" stroke-width="1.3" opacity="0.9"/>
  </g>`,
  sakura_vine: (c1, c2, p) => `<g transform="translate(12,150)">
    <path d="M0,-90 Q10,-40 -2,0 T2,90" fill="none" stroke="${p}" stroke-width="1.8"/>
    <circle cx="4" cy="-50" r="5" fill="${c1}"/><circle cx="-2" cy="10" r="6" fill="${c2}"/><circle cx="4" cy="60" r="4.5" fill="${c1}"/>
  </g>`,
  tech_rail: (c1, c2) => `<g transform="translate(10,150)">
    <polyline points="-4,-90 4,-75 4,75 -4,90" fill="none" stroke="${c1}" stroke-width="2"/>
    <rect x="-2" y="-30" width="5" height="22" fill="${c2}"/><rect x="-2" y="10" width="5" height="22" fill="${c1}"/>
  </g>`
};

const RIGHT_ARTS = {
  grimoire_bull: (c1, c2, p) => `
    <g transform="translate(175,30) rotate(20)">
      <rect x="-12" y="-16" width="24" height="32" rx="2" fill="#120d16" stroke="${p}" stroke-width="1.5"/>
      ${svgClover5(0, 0, 6, p, "#090612")}
    </g>
    <g transform="translate(182,158)">
      <path d="M-14,-9 C-20,-16 -10,-20 -6,-11 H6 C10,-20 20,-16 14,-9 C10,-3 8,6 4,13 H-4 C-8,6 -10,-3 -14,-9 Z" fill="#0b0812" stroke="${p}" stroke-width="1.5"/>
      <circle cx="0" cy="-2" r="2.5" fill="${c1}"/>
    </g>`,
  scroll_shuriken: (c1, c2, p) => `
    <g transform="translate(176,32) rotate(18)">
      <rect x="-12" y="-6" width="24" height="12" rx="2" fill="${c1}" stroke="${p}" stroke-width="1.3"/>
    </g>
    <g transform="translate(183,155)">
      <polygon points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4" fill="#161224" stroke="${p}" stroke-width="1.4"/>
      <circle cx="0" cy="0" r="3" fill="${c2}"/>
    </g>`,
  castle: (c1, c2, p) => `<g transform="translate(182,150)">
    <polygon points="-12,24 -12,-6 -7,-22 -2,-6 2,-28 7,-6 12,-20 12,24" fill="#0c0914" stroke="${p}" stroke-width="1.3"/>
    <rect x="-2" y="6" width="4" height="8" fill="${c1}"/>
  </g>`,
  cards: (c1, c2, p) => `<g transform="translate(180,155)">
    <rect x="-10" y="-18" width="18" height="26" rx="2" transform="rotate(-12)" fill="#120d1a" stroke="${p}" stroke-width="1.4"/>
    <rect x="-6" y="-10" width="18" height="26" rx="2" transform="rotate(10)" fill="${c1}" stroke="${p}" stroke-width="1.4"/>
  </g>`,
  lantern: (c1, c2, p) => `<g transform="translate(184,150)">
    <line x1="0" y1="-26" x2="0" y2="-14" stroke="${p}" stroke-width="1.5"/>
    <ellipse cx="0" cy="0" rx="10" ry="14" fill="${c1}" stroke="${p}" stroke-width="1.4"/>
    <line x1="-9" y1="-5" x2="9" y2="-5" stroke="#090614" stroke-width="1"/>
    <line x1="-9" y1="5" x2="9" y2="5" stroke="#090614" stroke-width="1"/>
  </g>`,
  notes: (c1, c2, p) => `<g transform="translate(182,155)">
    <ellipse cx="-5" cy="8" rx="4.5" ry="3" fill="${c1}"/>
    <ellipse cx="6" cy="5" rx="4.5" ry="3" fill="${c2}"/>
    <polyline points="-1,8 -1,-12 10,-15 10,5" fill="none" stroke="${p}" stroke-width="2"/>
  </g>`,
  butterflies: (c1, c2, p) => `<g transform="translate(182,150)">
    <path d="M0,0 C-12,-14 -14,2 0,4 C14,2 12,-14 0,0 Z" fill="${c1}" stroke="${p}" stroke-width="1"/>
    <path d="M0,4 C-10,14 -8,2 0,4 C8,2 10,14 0,4 Z" fill="${c2}" stroke="${p}" stroke-width="0.9"/>
  </g>`,
  tech_hud: (c1, c2) => `<g transform="translate(186,150)">
    <circle cx="0" cy="0" r="10" fill="none" stroke="${c1}" stroke-width="1.4" stroke-dasharray="4 3"/>
    <circle cx="0" cy="0" r="4" fill="${c2}"/>
    <line x1="0" y1="-16" x2="0" y2="-10" stroke="${c1}" stroke-width="1.5"/>
    <line x1="0" y1="10" x2="0" y2="16" stroke="${c1}" stroke-width="1.5"/>
  </g>`,
  shield_sword: (c1, c2, p) => `<g transform="translate(182,155)">
    <path d="M-11,-12 H11 L9,4 L0,14 L-9,4 Z" fill="#0d0a16" stroke="${p}" stroke-width="1.5"/>
    <polygon points="0,-7 4,0 0,7 -4,0" fill="${c1}"/>
  </g>`
};

const BOTTOM_ARTS = {
  clover: (c1, c2, p) => svgClover5(100, 276, 12.5, "#07050a", p),
  spiral: (c1, c2, p) => `<g transform="translate(100,276)">
    <circle cx="0" cy="0" r="12" fill="#09070e" stroke="${p}" stroke-width="1.6"/>
    <path d="M0,0 m-1,0 a1.5,1.5 0 1,0 3,0 a3.5,3.5 0 1,0 -7,0 a6,6 0 1,0 12,0" fill="none" stroke="${c1}" stroke-width="1.8" stroke-linecap="round"/>
  </g>`,
  star6: (c1, c2, p) => `<g transform="translate(100,276)">
    <circle cx="0" cy="0" r="12" fill="#0b0714" stroke="${p}" stroke-width="1.4"/>
    <polygon points="0,-10 2.5,-2.5 10,0 2.5,2.5 0,10 -2.5,2.5 -10,0 -2.5,-2.5" fill="${c1}"/>
    <circle cx="0" cy="0" r="2.2" fill="${c2}"/>
  </g>`,
  crest: (c1, c2, p) => `<g transform="translate(100,276)">
    <path d="M-12,-10 H12 L10,4 L0,13 L-10,4 Z" fill="#09070e" stroke="${p}" stroke-width="1.6"/>
    <polygon points="0,-6 4,0 0,6 -4,0" fill="${c1}"/>
  </g>`,
  flower: (c1, c2, p) => svgClover5(100, 276, 11.5, c1, p),
  diamond: (c1, c2, p) => `<g transform="translate(100,276)">
    <polygon points="0,-12 12,0 0,12 -12,0" fill="#09070e" stroke="${p}" stroke-width="1.6"/>
    <polygon points="0,-6 6,0 0,6 -6,0" fill="${c1}"/>
  </g>`
};

const SIGNATURE_TITLES = {
  "чёрный клевер": { c1: "#dc143c", c2: "#ff1744", border: "parchment", left: "buster", right: "grimoire_bull", bottom: "clover", banner: "Black ♣ Clover" },
  "наруто": { c1: "#ff7b00", c2: "#ffd700", border: "japanese", left: "kunai", right: "scroll_shuriken", bottom: "spiral", banner: "Naruto 🍥 Shippuden" },
  "боруто: новое поколение": { c1: "#ff4081", c2: "#00e5ff", border: "cyber", left: "kunai", right: "scroll_shuriken", bottom: "spiral", banner: "Boruto ⚡" },
  "мастера меча онлайн": { c1: "#00f5ff", c2: "#2979ff", border: "cyber", left: "katana", right: "shield_sword", bottom: "diamond", banner: "Sword ⚔ Art Online" },
  "клинок, рассекающий демонов": { c1: "#ff3d00", c2: "#00e676", border: "japanese", left: "katana", right: "lantern", bottom: "flower", banner: "Demon 🗡 Slayer" },
  "атака титанов": { c1: "#b71c1c", c2: "#ff5722", border: "gothic", left: "wing", right: "castle", bottom: "crest", banner: "Attack ⚔ on Titan" },
  "киберпанк: бегущие по краю": { c1: "#ffea00", c2: "#00f5ff", border: "cyber", left: "tech_rail", right: "tech_hud", bottom: "diamond", banner: "Cyberpunk ⚡ 2077" },
  "звёздное дитя": { c1: "#ff1493", c2: "#00f5ff", border: "baroque", left: "sakura_vine", right: "notes", bottom: "star6", banner: "Oshi ★ no Ko" },
  "человек-бензопила": { c1: "#ff3d00", c2: "#ffea00", border: "gothic", left: "chainsaw", right: "shield_sword", bottom: "diamond", banner: "Chainsaw 🪚 Man" },
  "тетрадь смерти": { c1: "#d50000", c2: "#9e9e9e", border: "gothic", left: "wing", right: "cards", bottom: "crest", banner: "Death 🍎 Note" },
  "провожающая в последний путь фрирен": { c1: "#ffe57f", c2: "#80d8ff", border: "baroque", left: "staff", right: "castle", bottom: "flower", banner: "Frieren 🪄" },
  "поднятие уровня в одиночку": { c1: "#304ffe", c2: "#00e5ff", border: "frost", left: "katana", right: "tech_hud", bottom: "crest", banner: "Solo 🗡 Leveling" },
  "безумный азарт": { c1: "#d50000", c2: "#ffd600", border: "baroque", left: "buster", right: "cards", bottom: "diamond", banner: "Kakegurui 🎲" },
  "одинокий рокер!": { c1: "#ff4081", c2: "#ffea00", border: "cinema", left: "guitar", right: "notes", bottom: "star6", banner: "Bocchi 🎸 Rock!" },
  "вайолет эвергарден": { c1: "#00bfa5", c2: "#ffd54f", border: "floral", left: "sakura_vine", right: "butterflies", bottom: "flower", banner: "Violet ✉ Evergarden" },
  "песнь ночных сов": { c1: "#d500f9", c2: "#00e5ff", border: "cinema", left: "tech_rail", right: "butterflies", bottom: "star6", banner: "Call 🌙 of Night" },
  "унесенные призраками": { c1: "#ff5252", c2: "#ffd740", border: "japanese", left: "sakura_vine", right: "lantern", bottom: "flower", banner: "Spirited 🏮 Away" },
  "re:zero. жизнь с нуля в альтернативном мире": { c1: "#b57cff", c2: "#00e5ff", border: "frost", left: "staff", right: "castle", bottom: "star6", banner: "Re:Zero ❄" }
};

const BORDER_KEYS = Object.keys(FRAME_BORDERS);
const LEFT_KEYS = Object.keys(LEFT_ARTS);
const RIGHT_KEYS = Object.keys(RIGHT_ARTS);
const BOTTOM_KEYS = Object.keys(BOTTOM_ARTS);
const PALETTE_PAIRS = [
  ["#ff4081", "#ffd740"], ["#00e5ff", "#7c4dff"], ["#ff6d00", "#ffea00"], ["#00e676", "#00b0ff"],
  ["#ff1744", "#b57cff"], ["#ffd740", "#00bfa5"], ["#f48fb1", "#80d8ff"], ["#d500f9", "#ff5252"],
  ["#40c4ff", "#ffd54f"], ["#ff5252", "#69f0ae"], ["#b388ff", "#ff80ab"], ["#ffab40", "#4fc3f7"]
];

function getTitleCustomFrame(title) {
  if (!title) return null;
  const clean = String(title).trim();
  const key = clean.toLowerCase();
  if (SIGNATURE_TITLES[key]) {
    return { ...SIGNATURE_TITLES[key], exactTitle: clean };
  }
  let h1 = 2166136261, h2 = 16777619;
  for (let i = 0; i < key.length; i++) {
    h1 ^= key.charCodeAt(i);
    h1 = Math.imul(h1, 16777619) >>> 0;
    h2 = (h2 * 31 + key.charCodeAt(i) * (i + 3)) >>> 0;
  }
  const [c1, c2] = PALETTE_PAIRS[h1 % PALETTE_PAIRS.length];
  return {
    exactTitle: clean,
    c1,
    c2,
    border: BORDER_KEYS[h1 % BORDER_KEYS.length],
    left: LEFT_KEYS[(h1 >>> 4) % LEFT_KEYS.length],
    right: RIGHT_KEYS[h2 % RIGHT_KEYS.length],
    bottom: BOTTOM_KEYS[(h2 >>> 5) % BOTTOM_KEYS.length],
    banner: clean.length > 18 ? clean.slice(0, 17).trim() + "…" : clean
  };
}
window.getTitleCustomFrame = getTitleCustomFrame;

function renderTitleCustomFrameHtml(title) {
  const f = getTitleCustomFrame(title);
  if (!f) return "";
  const p = "#e2ceb0";
  const borderSvg = (FRAME_BORDERS[f.border] || FRAME_BORDERS.parchment)(f.c1, f.c2, p);
  const leftSvg = (LEFT_ARTS[f.left] || LEFT_ARTS.buster)(f.c1, f.c2, p);
  const rightSvg = (RIGHT_ARTS[f.right] || RIGHT_ARTS.castle)(f.c1, f.c2, p);
  const bottomSvg = (BOTTOM_ARTS[f.bottom] || BOTTOM_ARTS.crest)(f.c1, f.c2, p);

  return `
    <span class="anime-custom-frame" style="--fc1:${f.c1};--fc2:${f.c2};" aria-hidden="true">
      <svg class="acf-heavy-svg" viewBox="0 0 200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        ${borderSvg}
        <path d="M36,4 H164 L156,25 C120,21 80,21 44,25 Z" fill="#09070e" stroke="${p}" stroke-width="1.3"/>
        <text x="100" y="19" text-anchor="middle" fill="${p}" font-family="'Cinzel','Playfair Display',serif" font-weight="900" font-size="10.5" letter-spacing="0.04em">${esc(f.banner)}</text>
        ${leftSvg}
        ${rightSvg}
        ${bottomSvg}
      </svg>
    </span>
  `;
}
window.renderTitleCustomFrameHtml = renderTitleCustomFrameHtml;

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
