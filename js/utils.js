/* ═══════════════════ CORE UTILITIES: HEAVY ENGRAVED ART FRAMES (v26.0 BLACK CLOVER EDITION) ═══════════════════ */
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

/* ═══════════════════ ИЛЛЮСТРАТИВНЫЙ ГРАВЮРНЫЙ ДВИЖОК РАМОК (ПО РЕФЕРЕНСУ BLACK CLOVER) ═══════════════════ */
(function injectHeavyArtFrameStyles() {
  if (document.getElementById("mtaHeavyArtFrameStyles")) return;
  const st = document.createElement("style");
  st.id = "mtaHeavyArtFrameStyles";
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
      filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.92));
      transition: transform 0.35s ease, filter 0.35s ease !important;
    }
    .card:hover .acf-heavy-svg,
    .recent-item-card:hover .acf-heavy-svg {
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 10px var(--fc1, #dc143c)) !important;
    }
    /* Если у карточки есть богатая гравюрная рамка — отодвигаем кружок ранга чуть ниже, чтобы не перекрывать верхний клевер/герб */
    .card:has(.anime-custom-frame) .rank {
      top: 30px !important;
      left: 7px !important;
      width: 17px !important;
      height: 17px !important;
      font-size: 8.5px !important;
    }
  `;
  if (document.head) document.head.appendChild(st);
  else window.addEventListener("DOMContentLoaded", () => document.head.appendChild(st));
})();

/* Функция рисования 5-листного клевера гримуара (с прожилками и состаренным пергаментным контуром, как на референсе) */
function svgFiveLeafClover(cx, cy, r, fillCol = "#08060c", strokeCol = "#e4d0b2") {
  const leaves = [];
  for (let i = 0; i < 5; i++) {
    const deg = -90 + i * 72;
    leaves.push(`
      <g transform="translate(${cx},${cy}) rotate(${deg})">
        <path d="M0,0 C-${r * 0.42},-${r * 0.35} -${r * 0.58},-${r * 0.95} -${r * 0.16},-${r * 0.98} C0,-${r * 0.82} 0,-${r * 0.82} ${r * 0.16},-${r * 0.98} C${r * 0.58},-${r * 0.95} ${r * 0.42},-${r * 0.35} 0,0 Z"
              fill="${fillCol}" stroke="${strokeCol}" stroke-width="1.35" stroke-linejoin="round"/>
        <line x1="0" y1="-1" x2="0" y2="-${r * 0.65}" stroke="${strokeCol}" stroke-width="0.75" opacity="0.75"/>
      </g>
    `);
  }
  return `
    <g class="clover-five-unit">
      <circle cx="${cx}" cy="${cy}" r="${r * 1.08}" fill="rgba(10,7,14,0.85)" stroke="${strokeCol}" stroke-width="1"/>
      ${leaves.join("")}
      <path d="M${cx},${cy} Q${cx + r * 0.18},${cy + r * 0.75} ${cx - r * 0.12},${cy + r * 1.15}" fill="none" stroke="${strokeCol}" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.14}" fill="#dc143c" stroke="${strokeCol}" stroke-width="0.7"/>
    </g>
  `;
}

/* Полноразмерная иллюстративная SVG-рамка (масштаб 200x300) в стиле тёмного гравюрного фэнтези с пергаментом, клубами дыма, оружием, замками и гербами */
function buildHeavyEngravedFrameSvg(frameCfg, uidKey) {
  const { motif, c1, c2, bannerText } = frameCfg;
  const parchment = "#e2ceb0";
  const parchmentDark = "#9e8768";
  const obsidian = "#09070e";

  // Общая рваная гравюрная кайма пергамента и клубов дыма по всему периметру (как на скриншоте Black Clover)
  const outerEngravedParchment = `
    <!-- Внешняя состаренная пергаментная рама с фигурным вырезом внутри -->
    <path d="M0,0 L200,0 L200,300 L0,300 Z
             M22,36
             C45,24 155,24 178,36
             C188,65 188,235 176,268
             C145,282 55,282 24,268
             C12,235 12,65 22,36 Z"
          fill="${obsidian}" fill-rule="evenodd" opacity="0.92"/>

    <!-- Светлая гравюрная кайма пергамента с клубами дыма и волнами -->
    <path d="M3,3 L197,3 L197,297 L3,297 Z
             M17,32
             C32,20 65,24 100,22
             C135,24 168,20 183,32
             C191,58 184,95 187,150
             C184,205 191,242 180,271
             C152,283 125,277 100,281
             C75,277 48,283 20,271
             C9,242 16,205 13,150
             C16,95 9,58 17,32 Z"
          fill="none" stroke="${parchment}" stroke-width="2.2" stroke-linejoin="round"/>

    <!-- Внутренний резной контур с багровыми/тематическими всполохами энергии -->
    <path d="M20,35 C50,24 150,24 180,35 C187,80 187,220 177,266 C145,279 55,279 23,266 C13,220 13,80 20,35 Z"
          fill="none" stroke="${c1}" stroke-width="1.6" stroke-dasharray="14 6 4 6" opacity="0.9"/>

    <!-- Клубы дыма и волны антимагии/стихии снизу и по углам -->
    <path d="M4,296 C18,268 38,282 56,266 C72,276 86,262 100,270 C114,262 128,276 144,266 C162,282 182,268 196,296 Z"
          fill="${obsidian}" stroke="${parchment}" stroke-width="1.4"/>
    <path d="M6,290 C28,272 52,286 78,272 M194,290 C172,272 148,286 122,272"
          fill="none" stroke="${c1}" stroke-width="2.2" stroke-linecap="round"/>

    <!-- Верхний королевский свод с короной (как надпись Black Clover на примере) -->
    <path d="M34,4 L166,4 L158,27 C120,23 80,23 42,27 Z"
          fill="${obsidian}" stroke="${parchment}" stroke-width="1.5"/>
    <!-- Корона по центру сверху -->
    <path d="M90,10 L93,3 L97,8 L100,2 L103,8 L107,3 L110,10 Z"
          fill="${parchment}" stroke="${c1}" stroke-width="0.8"/>
    <text x="100" y="21.5" text-anchor="middle" fill="${parchment}" stroke="#000" stroke-width="0.4"
          font-family="'Cinzel', 'Playfair Display', serif" font-weight="900" font-size="11.5" letter-spacing="0.06em">
      ${esc(bannerText)}
    </text>
  `;

  let bespokeSideArt = "";

  if (motif === "clover5") {
    /* ──────── ТОЧНАЯ КОМПОЗИЦИЯ С ВАШЕГО СКРИНШОТА BLACK CLOVER ────────
       1) Слева сверху: большой 5-листный клевер в круге с завитушками
       2) Справа сверху: наклонённый Гримуар Асты с 5-листным клевером на обложке и багровым свечением
       3) Вдоль всего левого борта: огромный двуручный меч Убийца Демонов (Demon-Slayer Sword), уходящий вниз
       4) Справа посередине: силуэт замка Клевера + эмблема ордена «Чёрный Бык» (череп быка с рогами)
       5) Снизу по центру и по бокам: 5-листные клеверы в клубах дыма и силуэт Асты с крылом */
    bespokeSideArt = `
      <!-- 1. Левый верхний большой 5-листный клевер -->
      ${svgFiveLeafClover(22, 30, 14, "#07050a", parchment)}

      <!-- 2. Правый верхний наклонённый Гримуар Асты -->
      <g transform="translate(174, 30) rotate(22)">
        <rect x="-13" y="-17" width="26" height="34" rx="2.5" fill="#120d16" stroke="${parchment}" stroke-width="1.6"/>
        <rect x="-10" y="-14" width="20" height="28" rx="1.5" fill="none" stroke="${c1}" stroke-width="1"/>
        ${svgFiveLeafClover(0, 0, 6.5, parchment, "#090612")}
      </g>

      <!-- 3. Огромный двуручный меч Асты (Demon-Slayer Sword) вдоль левого борта (от y=105 до y=282) -->
      <g transform="translate(16, 192) rotate(-7)">
        <!-- Алые потоки антимагии вокруг клинка -->
        <path d="M-8,-75 C6,-40 -10,10 8,55 M6,-60 C-8,-20 10,25 -6,70" fill="none" stroke="${c1}" stroke-width="2.2" stroke-linecap="round"/>
        <!-- Рукоять и навершие -->
        <line x1="0" y1="-92" x2="0" y2="-66" stroke="${parchment}" stroke-width="3.2" stroke-linecap="round"/>
        <circle cx="0" cy="-94" r="3.5" fill="${obsidian}" stroke="${parchment}" stroke-width="1.5"/>
        <!-- Крестовина (гарда) -->
        <path d="M-13,-66 L13,-66 L9,-61 L-9,-61 Z" fill="${parchment}" stroke="#000" stroke-width="1"/>
        <!-- Массивное широкое лезвие Убийцы Демонов -->
        <polygon points="-6.5,-61 6.5,-61 9,68 0,88 -9,68" fill="#18141f" stroke="${parchment}" stroke-width="1.6"/>
        <line x1="0" y1="-58" x2="0" y2="78" stroke="${c1}" stroke-width="1.3" opacity="0.85"/>
        <line x1="-3.5" y1="-45" x2="-5" y2="62" stroke="${parchmentDark}" stroke-width="0.9"/>
      </g>

      <!-- 4. Силуэт Замка Королевства Клевера справа (y=85..140) -->
      <g transform="translate(182, 112)">
        <polygon points="-14,22 -14,-5 -10,-18 -6,-5 -6,-12 -1,-28 4,-12 4,-5 9,-20 13,-5 13,22"
                 fill="#0c0914" stroke="${parchment}" stroke-width="1.2"/>
        <rect x="-3" y="4" width="5" height="9" rx="2" fill="${parchment}"/>
      </g>

      <!-- 5. Герб ордена «Чёрный Бык» (Black Bulls) справа ниже замка (y=158) -->
      <g transform="translate(180, 162)">
        <path d="M-16,-10 C-22,-18 -12,-22 -7,-12 L7,-12 C12,-22 22,-18 16,-10 C12,-4 9,6 5,14 L-5,14 C-9,6 -12,-4 -16,-10 Z"
              fill="#0b0812" stroke="${parchment}" stroke-width="1.6"/>
        <polygon points="0,-6 2,-1 7,-1 3,2 4,7 0,4 -4,7 -3,2 -7,-1 -2,-1" fill="${parchment}"/>
      </g>

      <!-- 6. Боковые малые клеверы в клубах дыма и центральный нижний 5-листный клевер -->
      ${svgFiveLeafClover(191, 68, 7.5, "#07050a", parchment)}
      ${svgFiveLeafClover(14, 224, 7.5, "#07050a", parchment)}
      ${svgFiveLeafClover(185, 232, 8.5, "#07050a", parchment)}
      ${svgFiveLeafClover(100, 276, 13.5, "#07050a", parchment)}
    `;
  } else if (motif === "naruto_ninja") {
    /* НАРУТО / БОРУТО: Кунаи вдоль бортов, свиток призыва сверху, спирали Узумаки и пламя Курамы */
    bespokeSideArt = `
      ${svgFiveLeafClover(22, 30, 11, c1, parchment)}
      <!-- Свиток ниндзя справа сверху -->
      <g transform="translate(176, 30) rotate(20)">
        <rect x="-13" y="-7" width="26" height="14" rx="3" fill="${c1}" stroke="${parchment}" stroke-width="1.5"/>
        <rect x="-16" y="-9" width="4" height="18" rx="1" fill="${obsidian}" stroke="${parchment}" stroke-width="1.2"/>
        <rect x="12" y="-9" width="4" height="18" rx="1" fill="${obsidian}" stroke="${parchment}" stroke-width="1.2"/>
      </g>
      <!-- Огромный кунай Минато вдоль левого борта -->
      <g transform="translate(15, 185) rotate(-6)">
        <circle cx="0" cy="-75" r="5" fill="none" stroke="${parchment}" stroke-width="2"/>
        <rect x="-2.5" y="-70" width="5" height="22" fill="${c1}" stroke="${parchment}" stroke-width="1.2"/>
        <polygon points="-9,-48 9,-48 4,-32 11,55 0,82 -11,55 -4,-32" fill="#181522" stroke="${parchment}" stroke-width="1.6"/>
        <line x1="0" y1="-44" x2="0" y2="72" stroke="${c2}" stroke-width="1.4"/>
      </g>
      <!-- Сюрикены и знак листа справа -->
      <g transform="translate(182, 145)">
        <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#161224" stroke="${parchment}" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3.5" fill="${obsidian}" stroke="${c2}" stroke-width="1.2"/>
      </g>
      <!-- Центральная печать Узумаки снизу -->
      <g transform="translate(100, 276)">
        <circle cx="0" cy="0" r="13" fill="${obsidian}" stroke="${parchment}" stroke-width="1.8"/>
        <path d="M0,0 m-1,0 a1.5,1.5 0 1,0 3,0 a3.5,3.5 0 1,0 -7,0 a6,6 0 1,0 12,0 a8.5,8.5 0 1,0 -17,0" fill="none" stroke="${c1}" stroke-width="2" stroke-linecap="round"/>
      </g>
    `;
  } else if (motif === "swords_crossed" || motif === "wings_blade" || motif === "demon_slayer") {
    /* МЕЧИ И КЛИНКИ (SAO, Атака Титанов, Клинок Демонов, Убийца Акамэ, Соло Левелинг):
       Два массивных клинка вдоль левого и правого бортов + гербовый щит снизу */
    bespokeSideArt = `
      <!-- Верхние угловые гербы со скрещёнными клинками -->
      <g transform="translate(22, 30)">
        <circle cx="0" cy="0" r="12" fill="${obsidian}" stroke="${parchment}" stroke-width="1.6"/>
        <path d="M-7,7 L7,-7 M7,7 L-7,-7" stroke="${c1}" stroke-width="2.4" stroke-linecap="round"/>
        <polygon points="0,-5 4,0 0,5 -4,0" fill="${parchment}"/>
      </g>
      <g transform="translate(178, 30)">
        <circle cx="0" cy="0" r="12" fill="${obsidian}" stroke="${parchment}" stroke-width="1.6"/>
        <polygon points="0,-9 8,0 0,9 -8,0" fill="${c1}" stroke="${parchment}" stroke-width="1.2"/>
      </g>

      <!-- Левый полноразмерный рыцарский/демонический клинок -->
      <g transform="translate(15, 188) rotate(-5)">
        <line x1="0" y1="-88" x2="0" y2="-62" stroke="${parchment}" stroke-width="3"/>
        <path d="M-12,-62 L12,-62 L8,-56 L-8,-56 Z" fill="${c2}" stroke="${parchment}" stroke-width="1.2"/>
        <polygon points="-5.5,-56 5.5,-56 7.5,64 0,85 -7.5,64" fill="#151221" stroke="${parchment}" stroke-width="1.6"/>
        <line x1="0" y1="-52" x2="0" y2="75" stroke="${c1}" stroke-width="1.5"/>
      </g>

      <!-- Правый клинок и башня/щит -->
      <g transform="translate(185, 188) rotate(5)">
        <line x1="0" y1="-88" x2="0" y2="-62" stroke="${parchment}" stroke-width="3"/>
        <path d="M-12,-62 L12,-62 L8,-56 L-8,-56 Z" fill="${c1}" stroke="${parchment}" stroke-width="1.2"/>
        <polygon points="-5.5,-56 5.5,-56 7.5,64 0,85 -7.5,64" fill="#151221" stroke="${parchment}" stroke-width="1.6"/>
        <line x1="0" y1="-52" x2="0" y2="75" stroke="${c2}" stroke-width="1.5"/>
      </g>

      <!-- Нижний королевский герб в клубах дыма -->
      <g transform="translate(100, 276)">
        <path d="M-13,-11 L13,-11 L11,4 L0,14 L-11,4 Z" fill="${obsidian}" stroke="${parchment}" stroke-width="1.8"/>
        <polygon points="0,-7 4,0 0,7 -4,0" fill="${c1}" stroke="${parchment}" stroke-width="0.9"/>
      </g>
    `;
  } else if (motif === "chainsaw_teeth" || motif === "gothic_thorn") {
    /* ЧЕЛОВЕК-БЕНЗОПИЛА / ТЕТРАДЬ СМЕРТИ / МАГИЧЕСКАЯ БИТВА / ВОСХОЖДЕНИЕ В ТЕНИ:
       Шипованные готические цепи, лезвия пилы вдоль бортов, череп/печать Синигами */
    bespokeSideArt = `
      <g transform="translate(22, 30)">
        <circle cx="0" cy="0" r="12" fill="${obsidian}" stroke="${parchment}" stroke-width="1.6"/>
        <polygon points="0,-10 3,-3 10,0 3,3 0,10 -3,3 -10,0 -3,-3" fill="${c1}" stroke="${parchment}" stroke-width="1"/>
      </g>
      <g transform="translate(178, 30) rotate(18)">
        <rect x="-11" y="-14" width="22" height="28" rx="2" fill="${obsidian}" stroke="${parchment}" stroke-width="1.5"/>
        <line x1="0" y1="-9" x2="0" y2="9" stroke="${c1}" stroke-width="2.2"/>
        <line x1="-6" y1="-3" x2="6" y2="-3" stroke="${c1}" stroke-width="2.2"/>
      </g>
      <!-- Зубчатое лезвие вдоль левого борта -->
      <g transform="translate(14, 185)">
        <polyline points="-4,-75 6,-65 -4,-55 6,-45 -4,-35 6,-25 -4,-15 6,-5 -4,5 6,15 -4,25 6,35 -4,45 6,55 -4,65 2,80"
                  fill="none" stroke="${parchment}" stroke-width="2.2" stroke-linejoin="bevel"/>
        <line x1="-2" y1="-75" x2="-2" y2="78" stroke="${c1}" stroke-width="2.4"/>
      </g>
      <!-- Готический замок и печать справа -->
      <g transform="translate(184, 155)">
        <polygon points="-11,25 -11,-10 -5,-26 0,-10 6,-22 11,-8 11,25" fill="${obsidian}" stroke="${parchment}" stroke-width="1.4"/>
        <circle cx="0" cy="6" r="5" fill="${c1}" stroke="${parchment}" stroke-width="1"/>
      </g>
      <g transform="translate(100, 276)">
        <circle cx="0" cy="0" r="13" fill="${obsidian}" stroke="${parchment}" stroke-width="1.8"/>
        <polygon points="0,-10 3,-2 10,-2 4,3 6,10 0,5 -6,10 -4,3 -10,-2 -3,-2" fill="${c1}" stroke="${parchment}" stroke-width="0.9"/>
      </g>
    `;
  } else {
    /* ФЭНТЕЗИ / РОМАНТИКА / МУЗЫКА / КИБЕРПАНК / МАГИЧЕСКИЕ ГРИМУАРЫ (Фрирен, Ре:Зеро, Звёздное дитя, Повелитель тайн и др.):
       Гримуар в правом верхнем углу, магический посох/клинок вдоль левого борта, замок справа и цветок/звезда снизу */
    bespokeSideArt = `
      ${svgFiveLeafClover(22, 30, 12, c1, parchment)}
      <!-- Книга заклинаний / Таро справа сверху -->
      <g transform="translate(175, 30) rotate(20)">
        <rect x="-12" y="-16" width="24" height="32" rx="2" fill="#120e1c" stroke="${parchment}" stroke-width="1.6"/>
        <polygon points="0,-9 6,0 0,9 -6,0" fill="${c1}" stroke="${parchment}" stroke-width="1"/>
      </g>
      <!-- Посох / декоративное древко вдоль левого борта -->
      <g transform="translate(15, 190) rotate(-5)">
        <circle cx="0" cy="-76" r="9" fill="${obsidian}" stroke="${parchment}" stroke-width="1.8"/>
        <polygon points="0,-83 5,-76 0,-69 -5,-76" fill="${c1}" stroke="${parchment}" stroke-width="1"/>
        <line x1="0" y1="-67" x2="0" y2="82" stroke="${parchment}" stroke-width="3.2"/>
        <line x1="0" y1="-67" x2="0" y2="82" stroke="${c1}" stroke-width="1.2" stroke-dasharray="6 4"/>
      </g>
      <!-- Башни замка и геральдический щит справа -->
      <g transform="translate(182, 135)">
        <polygon points="-12,20 -12,-6 -7,-20 -2,-6 2,-24 7,-6 12,-18 12,20" fill="${obsidian}" stroke="${parchment}" stroke-width="1.3"/>
      </g>
      <g transform="translate(181, 182)">
        <path d="M-11,-10 L11,-10 L9,4 L0,13 L-9,4 Z" fill="${obsidian}" stroke="${parchment}" stroke-width="1.6"/>
        <circle cx="0" cy="-1" r="4" fill="${c1}" stroke="${parchment}" stroke-width="0.9"/>
      </g>
      <!-- Центральная нижняя розетка в клубах дыма -->
      ${svgFiveLeafClover(100, 276, 13, c1, parchment)}
    `;
  }

  return `
    <svg class="acf-heavy-svg" viewBox="0 0 200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      ${outerEngravedParchment}
      ${bespokeSideArt}
    </svg>
  `;
}

/* ═══════════════════ ПОЛНАЯ БАЗА 122 ТАЙТЛОВ (С АНГЛИЙСКИМИ/ГОТИЧЕСКИМИ ТИТУЛАМИ ДЛЯ ВЕРХНЕЙ АРКИ КАК НА РЕФЕРЕНСЕ) ═══════════════════ */
const EXACT_ANIME_FRAMES_RAW = [
  ["100 девушек, которые очень-очень-очень-очень-очень сильно тебя любят", "#ff1493", "#ff80ab", "sakura_bloom", "100 ❀ Girlfriends"],
  ["Аватар короля", "#ffd740", "#00e5ff", "swords_crossed", "King's ⚔ Avatar"],
  ["Аватар: Легенда о Корре", "#00b0ff", "#ff6d00", "frost_crystal", "Legend 🌊 Korra"],
  ["Аватар: Легенда об Аанге", "#00e5ff", "#ffab00", "magic_circle", "Avatar 💨 Aang"],
  ["Агенты четырёх сезонов: Весенний танец", "#ff80ab", "#69f0ae", "sakura_bloom", "Four ❀ Seasons"],
  ["Аля иногда кокетничает со мной по-русски", "#e0f7fa", "#ff4081", "frost_crystal", "Roshidere ❄ Alya"],
  ["Ангел кровопролития", "#304ffe", "#ff1744", "gothic_thorn", "Angels 🌙 Death"],
  ["Ангел по соседству", "#ffd54f", "#fff9c4", "sakura_bloom", "Angel 🪽 Next Door"],
  ["Ангельские ритмы!", "#00e5ff", "#ffffff", "music_symphony", "Angel 🎹 Beats!"],
  ["Арифурэта: Сильнейший ремесленник в мире", "#ff1744", "#b0bec5", "swords_crossed", "Arifureta 🔫"],
  ["Атака титанов", "#b71c1c", "#ff5722", "wings_blade", "Attack ⚔ on Titan"],
  ["Ателье колдовских колпаков", "#ffd740", "#80d8ff", "magic_circle", "Witch 🪄 Hat"],
  ["Безумный азарт", "#d50000", "#ffd600", "cards_royal", "Kakegurui 🎲"],
  ["Безэмоциональная Касивада и эмоциональный Ота", "#ff8a65", "#4fc3f7", "sakura_bloom", "Kashiwada ❀ Ota"],
  ["Боруто: Новое Поколение", "#ff4081", "#00e5ff", "naruto_ninja", "Boruto ⚡ Naruto"],
  ["Вайолет Эвергарден", "#00bfa5", "#ffd54f", "sakura_bloom", "Violet ✉ Evergarden"],
  ["Ведьма и чудовище", "#b71c1c", "#9575cd", "gothic_thorn", "Witch 🥀 Beast"],
  ["Ведьмина служба доставки", "#ff1744", "#2979ff", "nature_ghibli", "Kiki's 🧹 Delivery"],
  ["Военная хроника маленькой девочки", "#ffd600", "#bf360c", "wings_blade", "Youjo ⚙ Senki"],
  ["Волшебник ледяного клинка правит миром", "#00e5ff", "#82b1ff", "swords_crossed", "Iceblade 🧊 Sorcerer"],
  ["Восемьдесят шесть", "#ff1744", "#cfd8dc", "wings_blade", "Eighty 🕷 Six · 86"],
  ["Восхождение в тени", "#6200ea", "#00e5ff", "gothic_thorn", "Eminence 🌑 Shadow"],
  ["Голубая шкатулка", "#00e5ff", "#ff80ab", "frost_crystal", "Blue 🏸 Box"],
  ["Город, в котором меня нет", "#00b0ff", "#ff1744", "frost_crystal", "Erased 🦋 Revival"],
  ["Дитя погоды", "#00b0ff", "#ffd740", "idol_star", "Weathering ☀ You"],
  ["Добро пожаловать в класс превосходства", "#ff1744", "#d500f9", "cards_royal", "Classroom ♟ Elite"],
  ["Забота об одарённой девушке: В престижной школе, полной высококлассных учеников, я буду тайно заботиться о самой красивой девушке (не имеющей никаких жизненных навыков)", "#ffd54f", "#f48fb1", "sakura_bloom", "Gifted 🎀 Lady"],
  ["Задержи этот звук!", "#ffd54f", "#ff8a65", "music_symphony", "Kono 🎶 Oto Tomare"],
  ["Звёздное дитя", "#ff1493", "#00f5ff", "idol_star", "Oshi ★ no Ko"],
  ["Звучи, эуфониум", "#ffd740", "#ffab40", "music_symphony", "Hibike! 🎺 Euphonium"],
  ["Зомбиапокалипсис и список из 100 дел, что я выполню перед смертью", "#00e676", "#ff1744", "chainsaw_teeth", "Zom 100 🎨 Bucket"],
  ["Из мечтателя в реалиста", "#80d8ff", "#cfd8dc", "frost_crystal", "Dreamer 🍃 Realist"],
  ["Извращенка со вторым размером", "#ff4081", "#b388ff", "sakura_bloom", "B-Cup 💋 Romance"],
  ["Иллюзия рая", "#00e676", "#00b0ff", "nature_ghibli", "Heavenly 🌿 Delusion"],
  ["Иная", "#d50000", "#455a64", "gothic_thorn", "Another 👁 Curse"],
  ["История знакомства опытной тебя и неопытного меня", "#ff80ab", "#ffd54f", "sakura_bloom", "Kimizero 🌅 Love"],
  ["История электричества в двадцатом веке", "#ffea00", "#00e5ff", "cyber_hud", "20th ⚡ Century"],
  ["Кабанэри железной крепости", "#ff3d00", "#ffb300", "wings_blade", "Kabaneri 🚂 Iron"],
  ["Как и ожидал, моя школьная романтическая жизнь не удалась", "#80d8ff", "#ff80ab", "frost_crystal", "OreGairu ☕ Genuine"],
  ["Карманы лета", "#00e5ff", "#fff59d", "nature_ghibli", "Summer 🦋 Pockets"],
  ["Киберпанк: Бегущие по краю", "#ffea00", "#00f5ff", "cyber_hud", "Cyberpunk ⚡ 2077"],
  ["Клинок, рассекающий демонов", "#ff3d00", "#00e676", "demon_slayer", "Demon 🗡 Slayer"],
  ["Корзинка фруктов", "#ff80ab", "#fff59d", "sakura_bloom", "Fruits 🍙 Basket"],
  ["Королева со скальпелем", "#00e5ff", "#ffd740", "cards_royal", "Doctor 🩺 Elise"],
  ["Корона грешника", "#ff1744", "#7c4dff", "gothic_thorn", "Guilty 👑 Crown"],
  ["Кошечка из Сакурасо", "#ff80ab", "#ffd740", "sakura_bloom", "Sakurasou 🎨 Pet"],
  ["Ликорис Рикоил", "#ff1744", "#00b0ff", "cyber_hud", "Lycoris 🌺 Recoil"],
  ["Магическая битва", "#651fff", "#ff1744", "gothic_thorn", "Jujutsu 🤞 Kaisen"],
  ["Мастера Меча Онлайн", "#00f5ff", "#2979ff", "swords_crossed", "Sword ⚔ Art Online"],
  ["Мастера на все руки выгнали из отряда героев", "#00e5ff", "#ffd740", "swords_crossed", "Handyman 🛡 Hero"],
  ["Младшая сестра моего друга досаждает", "#ffab00", "#40c4ff", "idol_star", "ImoUza ★ Tease"],
  ["Может ли существовать дружба между мужчиной и женщиной? (Нет, это не так!)", "#2979ff", "#ff4081", "sakura_bloom", "Danjo 🌺 Friendship"],
  ["Мой сосед Тоторо", "#69f0ae", "#ffd54f", "nature_ghibli", "My Neighbor 🍃 Totoro"],
  ["Молчаливая ведьма: Тайна молчаливой колдуньи", "#b388ff", "#80d8ff", "magic_circle", "Silent 🔮 Witch"],
  ["Монолог фармацевта", "#00e676", "#ffd740", "nature_ghibli", "Apothecary 🌿 Diaries"],
  ["Моя возлюбленная забыла свои очки", "#ffb74d", "#81d4fa", "sakura_bloom", "Forgot 👓 Glasses"],
  ["Наруто", "#ff7b00", "#ffd700", "naruto_ninja", "Naruto 🍥 Shippuden"],
  ["Не скрывая крик", "#ff1744", "#00e5ff", "music_symphony", "Girls 🎸 Band Cry"],
  ["Небесный замок Лапута", "#80d8ff", "#ffd740", "nature_ghibli", "Castle 💎 in the Sky"],
  ["Непринуждённая жизнь в другом мире экс-кандидата в герои, оказавшегося читером со второго уровня", "#ffd740", "#69f0ae", "magic_circle", "Lv2 ♾ Cheat Hero"],
  ["Один танец", "#00f5ff", "#ff1493", "music_symphony", "Wandance 🕺 Stage"],
  ["Одинокий рокер!", "#ff4081", "#ffea00", "music_symphony", "Bocchi 🎸 the Rock!"],
  ["Он — сильнейший учитель!", "#00e5ff", "#ffd740", "magic_circle", "Ultimate 🎓 Otaku"],
  ["Освободите эту ведьму", "#ff6d00", "#ffd740", "magic_circle", "Release 🔥 that Witch"],
  ["Отчаянные бойцы Бакуган", "#ff3d00", "#00e676", "flame", "Bakugan 🐉 Battle"],
  ["Очень приятно, Бог", "#ff5252", "#ffd740", "sakura_bloom", "Kamisama 🦊 Kiss"],
  ["Парад смерти", "#b57cff", "#00e5ff", "cards_royal", "Death 🍸 Parade"],
  ["Песнь ночных сов", "#d500f9", "#00e5ff", "idol_star", "Call 🌙 of the Night"],
  ["Пластиковые воспоминания", "#80d8ff", "#ff80ab", "frost_crystal", "Plastic 🎡 Memories"],
  ["Плачущий призрак на пенсии", "#b388ff", "#ffd740", "magic_circle", "Grieving 👻 Soul"],
  ["По велению адской сестры", "#ff1744", "#d500f9", "gothic_thorn", "Testament 😈 Sister"],
  ["Повар-боец Сома", "#ff6d00", "#ffd600", "flame", "Food 🍽 Wars! Soma"],
  ["Повелитель тайн: Клоун", "#ffd740", "#7e57c2", "cards_royal", "Lord 🃏 of Mysteries"],
  ["Поднятие уровня в одиночку", "#304ffe", "#00e5ff", "swords_crossed", "Solo 🗡 Leveling"],
  ["Покемон", "#ffea00", "#ff1744", "idol_star", "Pokémon ⚡ Master"],
  ["Полуночный мотив сердца", "#7c4dff", "#ff4081", "music_symphony", "Mayonaka 🎙 Heart"],
  ["Поцелуй сестёр", "#ff80ab", "#ff4081", "sakura_bloom", "Kiss 💋 x Sis"],
  ["Пощади меня, великий господин", "#ff1744", "#7c4dff", "swords_crossed", "Spare 🗡 Me, Lord!"],
  ["Призматическое рондо", "#00e5ff", "#ff80ab", "idol_star", "Prism 🌈 Rondo"],
  ["Приключения пингвинёнка Лоло", "#80d8ff", "#ffffff", "frost_crystal", "Lolo 🐧 Adventures"],
  ["Провожающая в последний путь Фрирен", "#ffe57f", "#80d8ff", "magic_circle", "Frieren 🪄 Journey"],
  ["Проект «Мир»: Сломанный мир и непоющая Мику", "#00f5ff", "#ff4081", "music_symphony", "Project 🎤 Sekai"],
  ["Просто так!", "#ffb74d", "#80d8ff", "sakura_bloom", "Just 📷 Because!"],
  ["Путешествие Элейны", "#b388ff", "#ffd54f", "magic_circle", "Wandering 🧹 Witch"],
  ["Пять сантиметров в секунду", "#ff80ab", "#b39ddb", "sakura_bloom", "5cm 🌸 per Second"],
  ["Реинкарнация безработного: История о приключениях в другом мире", "#ffd54f", "#00e676", "magic_circle", "Mushoku 🪄 Tensei"],
  ["Рок — женская скромность", "#f48fb1", "#fff59d", "music_symphony", "Rock 🎸 Modesty"],
  ["Рыбка Поньо на утесе", "#ff5252", "#40c4ff", "nature_ghibli", "Ponyo 🐠 on the Cliff"],
  ["С нынешними детективами ничего не поделаешь", "#ffd740", "#90a4ae", "cards_royal", "Detectives 🔍 Today"],
  ["Связь сердец", "#ff80ab", "#00e5ff", "idol_star", "Kokoro 💞 Connect"],
  ["Сказание об Аканэ", "#ff5252", "#ffd740", "sakura_bloom", "Akane 🪭 Banashi"],
  ["Судзумэ, закрывающая двери", "#00e5ff", "#ff5252", "idol_star", "Suzume 🚪 Locking"],
  ["Суперпринцесса Кагуя!", "#ffd740", "#ff80ab", "cards_royal", "Princess 🎋 Kaguya"],
  ["Тацуки Фудзимото: С семнадцати до двадцати шести", "#ff3d00", "#00e5ff", "chainsaw_teeth", "Fujimoto 🎬 17–26"],
  ["Твоё имя", "#00b0ff", "#ff4081", "idol_star", "Your ☄ Name."],
  ["Твоя апрельская ложь", "#80d8ff", "#ff80ab", "music_symphony", "Your 🎻 Lie in April"],
  ["Тетрадь Смерти", "#d50000", "#9e9e9e", "gothic_thorn", "Death 🍎 Note"],
  ["Тоннель в лето, выход прощаний", "#ff6d00", "#00b0ff", "nature_ghibli", "Summer 🍁 Tunnel"],
  ["ТораДора!", "#ff9100", "#ff4081", "flame", "ToraDora! 🐯"],
  ["Троецарствие Японии", "#ff1744", "#ffd740", "swords_crossed", "Three 🏯 Kingdoms"],
  ["Тусовщик Кунмин", "#00f5ff", "#ffd740", "music_symphony", "Ya Boy 🪩 Kongming!"],
  ["Убийца Акамэ!", "#ff1744", "#212121", "swords_crossed", "Akame 🩸 ga Kill!"],
  ["Убийца гоблинов", "#ff3d00", "#78909c", "swords_crossed", "Goblin 🛡 Slayer"],
  ["Укрась прощальное утро цветами обещания", "#fff59d", "#81d4fa", "sakura_bloom", "Maquia 🌸 Promise"],
  ["Унесенные призраками", "#ff5252", "#ffd740", "nature_ghibli", "Spirited 🏮 Away"],
  ["Фармацевт из параллельного мира", "#00e5ff", "#69f0ae", "magic_circle", "Parallel ⚗ Pharmacy"],
  ["Форма голоса", "#80d8ff", "#ff80ab", "sakura_bloom", "A Silent 🌸 Voice"],
  ["Ходячий замок", "#ff9100", "#40c4ff", "flame", "Howl's 🔥 Castle"],
  ["Хоримия", "#ff4081", "#40c4ff", "sakura_bloom", "Horimiya 💫"],
  ["Хоть я и бездарная злодейка: Сказка о том, как бабочка и крыса поменялись местами в девичьем дворе", "#ff80ab", "#ffd740", "cards_royal", "Villainess 🦋 Court"],
  ["Человек-бензопила", "#ff3d00", "#ffea00", "chainsaw_teeth", "Chainsaw 🪚 Man"],
  ["Чёрный клевер", "#dc143c", "#ff1744", "clover5", "Black ♣ Clover"],
  ["Чёрный факел", "#ff3d00", "#651fff", "gothic_thorn", "Black 🔥 Torch"],
  ["Чудачества любви не помеха", "#d500f9", "#ffd740", "magic_circle", "Chuunibyou 👁 Love"],
  ["Шарлотта", "#00e5ff", "#ffd740", "idol_star", "Charlotte ☄"],
  ["Эта фарфоровая кукла влюбилась", "#ff4081", "#ffd740", "sakura_bloom", "Dress-Up 🎀 Darling"],
  ["Этот замечательный мир!", "#ff3d00", "#ffd600", "magic_circle", "KonoSuba! 💥"],
  ["Эхо террора", "#90a4ae", "#00e5ff", "cyber_hud", "Terror 🪶 Resonance"],
  ["Я подружился со второй самой симпатичной девушкой в классе", "#ffd740", "#80d8ff", "sakura_bloom", "Second ☀ Cutest"],
  ["Я хочу съесть твою поджелудочную", "#ff80ab", "#80d8ff", "sakura_bloom", "Pancreas 🌸 Spring"],
  ["ID: Вторжение", "#00f5ff", "#ff1744", "cyber_hud", "ID: 🧩 Invaded"],
  ["Re:Zero. Жизнь с нуля в альтернативном мире", "#b57cff", "#00e5ff", "magic_circle", "Re:Zero ❄ Starting"]
];

const EXACT_ANIME_FRAMES_MAP = new Map();
const NORM_ANIME_FRAMES_MAP = new Map();

function normalizeTitleForExactMatch(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ");
}

EXACT_ANIME_FRAMES_RAW.forEach(([exactTitle, c1, c2, motif, bannerText], idx) => {
  const frameConfig = {
    id: idx + 1,
    exactTitle,
    c1,
    c2,
    motif,
    bannerText: bannerText || exactTitle.slice(0, 18)
  };
  EXACT_ANIME_FRAMES_MAP.set(exactTitle.trim(), frameConfig);
  NORM_ANIME_FRAMES_MAP.set(normalizeTitleForExactMatch(exactTitle), frameConfig);
});

function getTitleCustomFrame(title) {
  if (!title) return null;
  const trimmed = String(title).trim();

  if (EXACT_ANIME_FRAMES_MAP.has(trimmed)) {
    return EXACT_ANIME_FRAMES_MAP.get(trimmed);
  }
  const normKey = normalizeTitleForExactMatch(trimmed);
  if (NORM_ANIME_FRAMES_MAP.has(normKey)) {
    return NORM_ANIME_FRAMES_MAP.get(normKey);
  }
  return null;
}
window.getTitleCustomFrame = getTitleCustomFrame;

let frameUidCounter = 0;
function renderTitleCustomFrameHtml(title) {
  const f = getTitleCustomFrame(title);
  if (!f) return "";
  frameUidCounter = (frameUidCounter + 1) % 99999;
  const svgMarkup = buildHeavyEngravedFrameSvg(f, `${f.id}_${frameUidCounter}`);

  return `
    <span class="anime-custom-frame" data-frame-id="${f.id}" data-motif="${esc(f.motif)}" style="--fc1:${f.c1};--fc2:${f.c2};" aria-hidden="true">
      ${svgMarkup}
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
