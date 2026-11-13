/* ═══════════════════ CORE UTILITIES: BESPOKE SVG ART FRAMES FOR 122 TITLES & REWATCH ENGINE (v25.0) ═══════════════════ */
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

/* Умный расчёт метрик с разделением уникальных серий тайтла и общих просмотров с повторами */
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

/* ═══════════════════ ПРОЦЕДУРНЫЙ SVG-ДВИЖОК ТЕМАТИЧЕСКИХ РАМОК С УЗОРАМИ ДЛЯ 122 ТАЙТЛОВ ═══════════════════ */
(function injectBespokeSvgFrameStyles() {
  if (document.getElementById("mtaBespokeSvgFrameStyles")) return;
  const st = document.createElement("style");
  st.id = "mtaBespokeSvgFrameStyles";
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
    .acf-svg-overlay {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      display: block !important;
      pointer-events: none !important;
      filter: drop-shadow(0 0 4px var(--fc1, #ffd76a));
      transition: filter 0.3s ease, transform 0.3s ease !important;
    }
    .card:hover .acf-svg-overlay,
    .recent-item-card:hover .acf-svg-overlay {
      filter: drop-shadow(0 0 8px var(--fc1, #ffd76a)) drop-shadow(0 0 12px var(--fc2, #00f5ff)) !important;
    }
    .acf-top-crest {
      position: absolute !important;
      top: 5px !important;
      right: 5px !important;
      z-index: 5 !important;
      width: 24px !important;
      height: 24px !important;
      border-radius: 7px !important;
      background: radial-gradient(circle at 30% 30%, rgba(28, 22, 54, 0.95), rgba(8, 6, 16, 0.96)) !important;
      border: 1.4px solid var(--fc1, #ffd76a) !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.85), 0 0 10px -1px var(--fc2, #00f5ff) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      pointer-events: none !important;
    }
    .acf-top-crest svg {
      width: 16px !important;
      height: 16px !important;
      overflow: visible !important;
    }
  `;
  if (document.head) document.head.appendChild(st);
  else window.addEventListener("DOMContentLoaded", () => document.head.appendChild(st));
})();

/* 18 детализированных векторных архетипов узоров (клевер гримуара, кунаи/спираль Узумаки, скрещённые мечи SAO, узор Танджиро, крылья свободы, звезда Хошино Ай, цепь бензопилы и т.д.) */
function buildMotifSvgContent(motif, c1, c2, uidKey) {
  const gId = `fg_${uidKey}`;

  // Векторный угловой элемент и центральная гербовая печать под конкретную тему аниме
  let cornerUnit = "";
  let sidePattern = "";
  let crestIcon = "";
  let borderDash = "";

  switch (motif) {
    // 1. ЧЁРНЫЙ КЛЕВЕР: 5-листный клевер гримуара Асты в каждом углу + готическая антимагическая вязь
    case "clover5":
      cornerUnit = `
        <g transform="translate(14,14) scale(0.85)">
          <circle cx="0" cy="0" r="11" fill="rgba(8,5,12,0.9)" stroke="${c1}" stroke-width="1.3"/>
          <path d="M0,0 C-3,-9 3,-9 0,0 C-8,-6 -4,-11 0,0 C8,-6 4,-11 0,0 C-9,2 -6,8 0,0 C9,2 6,8 0,0 M0,0 L0,9" fill="#0b0710" stroke="${c1}" stroke-width="1.6" stroke-linejoin="round"/>
          <circle cx="0" cy="0" r="2" fill="${c2}"/>
        </g>
        <path d="M4,28 L4,6 Q4,4 6,4 L28,4" fill="none" stroke="${c1}" stroke-width="2.2"/>
        <path d="M8,22 L8,8 L22,8" fill="none" stroke="${c2}" stroke-width="1" stroke-dasharray="3 2"/>
      `;
      sidePattern = `
        <path d="M100,2 L95,8 L100,14 L105,8 Z" fill="#090612" stroke="${c1}" stroke-width="1.2"/>
        <path d="M2,150 L8,145 L14,150 L8,155 Z M198,150 L192,145 L186,150 L192,155 Z" fill="#090612" stroke="${c1}" stroke-width="1.2"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <path d="M0,-2 C-4,-11 4,-11 0,-2 C-10,-7 -5,-12 0,-2 C10,-7 5,-12 0,-2 C-11,3 -6,9 0,-2 C11,3 6,9 0,-2 M0,-2 L0,9" fill="#140810" stroke="${c1}" stroke-width="1.8"/>
          <circle cx="0" cy="-2" r="2.2" fill="${c2}"/>
        </svg>
      `;
      break;

    // 2. НАРУТО / БОРУТО: Спираль клана Узумаки, кунаи в углах, сюрикены на гранях и пламя чакры
    case "naruto_ninja":
      cornerUnit = `
        <path d="M3,32 L3,5 L32,5" fill="none" stroke="${c1}" stroke-width="2.5"/>
        <g transform="translate(15,15) rotate(-45)">
          <polygon points="0,-11 3.5,-2 0,4 -3.5,-2" fill="${c2}" stroke="#090614" stroke-width="0.8"/>
          <line x1="0" y1="4" x2="0" y2="8" stroke="${c1}" stroke-width="1.8"/>
          <circle cx="0" cy="10" r="2.3" fill="none" stroke="${c1}" stroke-width="1.4"/>
        </g>
      `;
      sidePattern = `
        <g transform="translate(6,150)">
          <polygon points="0,-6 2,-2 6,0 2,2 0,6 -2,2 -6,0 -2,-2" fill="${c2}" stroke="${c1}" stroke-width="0.9"/>
          <circle cx="0" cy="0" r="1.5" fill="#090614"/>
        </g>
        <g transform="translate(194,150)">
          <polygon points="0,-6 2,-2 6,0 2,2 0,6 -2,2 -6,0 -2,-2" fill="${c2}" stroke="${c1}" stroke-width="0.9"/>
          <circle cx="0" cy="0" r="1.5" fill="#090614"/>
        </g>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <circle cx="0" cy="0" r="9.5" fill="none" stroke="${c2}" stroke-width="1.5"/>
          <path d="M0,0 m-1,0 a1,1 0 1,0 2,0 a2.5,2.5 0 1,0 -5,0 a4.5,4.5 0 1,0 9,0 a6.5,6.5 0 1,0 -13,0" fill="none" stroke="${c1}" stroke-width="1.7" stroke-linecap="round"/>
        </svg>
      `;
      break;

    // 3. МАСТЕРА МЕЧА ОНЛАЙН / ФЭНТЕЗИ-МЕЧИ: Скрещённые клинки Elucidator & Dark Repulser + интерфейс Aincrad
    case "swords_crossed":
      cornerUnit = `
        <path d="M3,30 L3,8 L8,3 L30,3" fill="none" stroke="${c1}" stroke-width="2.2"/>
        <g transform="translate(15,15)">
          <line x1="-8" y1="8" x2="8" y2="-8" stroke="${c1}" stroke-width="2" stroke-linecap="round"/>
          <line x1="-5" y1="1" x2="-1" y2="5" stroke="${c2}" stroke-width="2"/>
          <line x1="8" y1="8" x2="-8" y2="-8" stroke="${c2}" stroke-width="2" stroke-linecap="round"/>
          <line x1="5" y1="1" x2="1" y2="5" stroke="${c1}" stroke-width="2"/>
        </g>
      `;
      sidePattern = `
        <polygon points="100,1 106,6 100,11 94,6" fill="rgba(0,245,255,0.2)" stroke="${c1}" stroke-width="1.2"/>
        <polyline points="4,130 9,138 9,162 4,170" fill="none" stroke="${c1}" stroke-width="1.4"/>
        <polyline points="196,130 191,138 191,162 196,170" fill="none" stroke="${c1}" stroke-width="1.4"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <path d="M-8,8 L8,-8 M-3,7 L-7,3" stroke="${c1}" stroke-width="2.1" stroke-linecap="round"/>
          <path d="M8,8 L-8,-8 M3,7 L7,3" stroke="${c2}" stroke-width="2.1" stroke-linecap="round"/>
          <polygon points="0,-4 3,0 0,4 -3,0" fill="#fff" stroke="${c1}" stroke-width="1"/>
        </svg>
      `;
      break;

    // 4. КЛИНОК, РАССЕКАЮЩИЙ ДЕМОНОВ: Клетчатый узор хаори Танджиро + гарда катаны Ничирин и пламя Хиноками Кагура
    case "demon_slayer":
      borderDash = `stroke-dasharray="8 6"`;
      cornerUnit = `
        <rect x="3" y="3" width="8" height="8" fill="${c2}" stroke="${c1}" stroke-width="0.8"/>
        <rect x="11" y="3" width="8" height="8" fill="#0b0914" stroke="${c1}" stroke-width="0.8"/>
        <rect x="3" y="11" width="8" height="8" fill="#0b0914" stroke="${c1}" stroke-width="0.8"/>
        <rect x="11" y="11" width="8" height="8" fill="${c2}" stroke="${c1}" stroke-width="0.8"/>
        <path d="M3,26 Q14,18 26,3" fill="none" stroke="${c1}" stroke-width="1.8"/>
      `;
      sidePattern = `
        <path d="M4,135 Q12,150 4,165 M196,135 Q188,150 196,165" fill="none" stroke="${c1}" stroke-width="2"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <circle cx="0" cy="0" r="8.5" fill="#14090c" stroke="${c1}" stroke-width="1.8"/>
          <path d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z" fill="${c1}" stroke="${c2}" stroke-width="0.9"/>
        </svg>
      `;
      break;

    // 5. АТАКА ТИТАНОВ / 86 / ВОЕННАЯ ХРОНИКА: Крылья Свободы, мечи УПМ и шестерёнки
    case "wings_blade":
      cornerUnit = `
        <path d="M3,32 L3,3 L32,3" fill="none" stroke="${c1}" stroke-width="2.4"/>
        <path d="M7,24 C7,12 12,7 24,7" fill="none" stroke="${c2}" stroke-width="1.6"/>
        <path d="M6,6 L18,12 L12,18 Z" fill="${c1}"/>
      `;
      sidePattern = `
        <polygon points="100,1 108,5 100,9 92,5" fill="${c1}"/>
        <line x1="4" y1="130" x2="8" y2="170" stroke="${c2}" stroke-width="1.5"/>
        <line x1="196" y1="130" x2="192" y2="170" stroke="${c2}" stroke-width="1.5"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <path d="M-9,4 C-9,-5 -3,-9 2,-9 C-2,-5 -2,0 3,4 Z" fill="#ffffff" stroke="${c1}" stroke-width="1"/>
          <path d="M9,4 C9,-5 3,-9 -2,-9 C2,-5 2,0 -3,4 Z" fill="${c2}" stroke="${c1}" stroke-width="1"/>
        </svg>
      `;
      break;

    // 6. КИБЕРПАНК / МАТРИЦА / ID:ВТОРЖЕНИЕ: Техно-скосы Sandevistan, микросхемы и HUD-прицел
    case "cyber_hud":
      cornerUnit = `
        <polyline points="2,34 2,10 10,2 34,2" fill="none" stroke="${c1}" stroke-width="2.6"/>
        <polyline points="7,26 7,13 13,7 26,7" fill="none" stroke="${c2}" stroke-width="1.3"/>
        <rect x="12" y="12" width="4" height="4" fill="${c1}"/>
        <line x1="16" y1="14" x2="26" y2="14" stroke="${c2}" stroke-width="1.2"/>
      `;
      sidePattern = `
        <polyline points="75,3 82,8 118,8 125,3" fill="none" stroke="${c2}" stroke-width="1.3"/>
        <polyline points="3,130 9,136 9,164 3,170" fill="none" stroke="${c1}" stroke-width="1.6"/>
        <polyline points="197,130 191,136 191,164 197,170" fill="none" stroke="${c1}" stroke-width="1.6"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <polygon points="-2,-10 5,-2 0,-2 3,10 -6,1 -1,1" fill="${c1}" stroke="${c2}" stroke-width="1"/>
        </svg>
      `;
      break;

    // 7. ЗВЁЗДНОЕ ДИТЯ (OSHI NO KO) / КОСМОС / ШАРЛОТТА: 6-лучевые звёзды глаз Хошино Ай в каждом углу
    case "idol_star":
      cornerUnit = `
        <path d="M4,28 Q4,4 28,4" fill="none" stroke="${c1}" stroke-width="2"/>
        <g transform="translate(14,14)">
          <circle cx="0" cy="0" r="8.5" fill="rgba(18,8,28,0.9)" stroke="${c1}" stroke-width="1.1"/>
          <polygon points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" fill="${c2}"/>
          <polygon points="-5,-5 -1,-2 5,-5 2,-1 5,5 1,2 -5,5 -2,1" fill="${c1}" opacity="0.85"/>
          <circle cx="0" cy="0" r="1.8" fill="#ffffff"/>
        </g>
      `;
      sidePattern = `
        <polygon points="100,2 102,6 106,8 102,10 100,14 98,10 94,8 98,6" fill="${c2}"/>
        <polygon points="6,150 8,146 12,150 8,154" fill="${c1}"/>
        <polygon points="194,150 192,146 188,150 192,154" fill="${c1}"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <polygon points="0,-10 2.5,-2.5 10,0 2.5,2.5 0,10 -2.5,2.5 -10,0 -2.5,-2.5" fill="${c1}" stroke="#fff" stroke-width="0.8"/>
          <circle cx="0" cy="0" r="2.4" fill="${c2}"/>
        </svg>
      `;
      break;

    // 8. ТЕТРАДЬ СМЕРТИ / ВОСХОЖДЕНИЕ В ТЕНИ / УБИЙЦА АКАМЭ / ИНАЯ: Готические шипы Синигами, кресты и шипы роз
    case "gothic_thorn":
      cornerUnit = `
        <path d="M3,34 L3,3 L34,3" fill="none" stroke="${c1}" stroke-width="2.4"/>
        <path d="M3,3 L16,9 L11,11 L19,19 L11,11 L9,16 Z" fill="${c1}" stroke="${c2}" stroke-width="0.8"/>
        <path d="M6,26 Q14,14 26,6" fill="none" stroke="${c2}" stroke-width="1.2"/>
      `;
      sidePattern = `
        <g transform="translate(100,8)">
          <line x1="0" y1="-6" x2="0" y2="8" stroke="${c1}" stroke-width="2"/>
          <line x1="-5" y1="-2" x2="5" y2="-2" stroke="${c1}" stroke-width="2"/>
        </g>
        <polygon points="2,145 9,150 2,155" fill="${c1}"/>
        <polygon points="198,145 191,150 198,155" fill="${c1}"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <path d="M0,-10 L2.5,-3 L9,-3 L3,1 L5,9 L0,4 L-5,9 L-3,1 L-9,-3 L-2.5,-3 Z" fill="${c1}" stroke="${c2}" stroke-width="1"/>
        </svg>
      `;
      break;

    // 9. ЧЕЛОВЕК-БЕНЗОПИЛА: Зубья цепи бензопилы по периметру рамки и стартер Почиты
    case "chainsaw_teeth":
      borderDash = `stroke-dasharray="6 4"`;
      cornerUnit = `
        <polyline points="2,34 8,26 2,20 8,12 2,4 12,8 20,2 26,8 34,2" fill="none" stroke="${c1}" stroke-width="2.2" stroke-linejoin="bevel"/>
        <circle cx="13" cy="13" r="4" fill="${c2}" stroke="#090614" stroke-width="1.2"/>
      `;
      sidePattern = `
        <polyline points="3,125 9,132 3,139 9,146 3,153 9,160 3,167" fill="none" stroke="${c1}" stroke-width="1.8"/>
        <polyline points="197,125 191,132 197,139 191,146 197,153 191,160 197,167" fill="none" stroke="${c1}" stroke-width="1.8"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <polygon points="-7,-4 7,-4 9,4 -9,4" fill="${c2}" stroke="${c1}" stroke-width="1.5"/>
          <line x1="0" y1="4" x2="0" y2="9" stroke="#fff" stroke-width="2"/>
        </svg>
      `;
      break;

    // 10. ФРИРЕН / РЕИНКАРНАЦИЯ БЕЗРАБОТНОГО / МАГИЯ: Магические круги, руны и эльфийская золотая филигрань
    case "magic_circle":
      cornerUnit = `
        <g transform="translate(14,14)">
          <circle cx="0" cy="0" r="10" fill="none" stroke="${c1}" stroke-width="1.3"/>
          <polygon points="0,-9 7.8,4.5 -7.8,4.5" fill="none" stroke="${c2}" stroke-width="1.1"/>
          <polygon points="0,9 7.8,-4.5 -7.8,-4.5" fill="none" stroke="${c1}" stroke-width="1.1"/>
          <circle cx="0" cy="0" r="2.2" fill="${c2}"/>
        </g>
        <path d="M3,30 L3,14 M14,3 L30,3" stroke="${c1}" stroke-width="2"/>
      `;
      sidePattern = `
        <circle cx="100" cy="5" r="3.5" fill="${c2}" stroke="${c1}" stroke-width="1.2"/>
        <circle cx="5" cy="150" r="3.5" fill="${c1}" stroke="${c2}" stroke-width="1.2"/>
        <circle cx="195" cy="150" r="3.5" fill="${c1}" stroke="${c2}" stroke-width="1.2"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <circle cx="0" cy="0" r="9" fill="none" stroke="${c1}" stroke-width="1.4"/>
          <polygon points="0,-8 7,4 -7,4" fill="none" stroke="${c2}" stroke-width="1.3"/>
          <polygon points="0,8 7,-4 -7,-4" fill="none" stroke="${c1}" stroke-width="1.3"/>
        </svg>
      `;
      break;

    // 11. САКУРА / РОМАНТИКА / КОРЗИНКА ФРУКТОВ / ВАЙОЛЕТ / ХОРИМИЯ: Цветы 5-лепестковой сакуры и ленты в углах
    case "sakura_bloom":
      cornerUnit = `
        <path d="M4,30 C4,12 12,4 30,4" fill="none" stroke="${c1}" stroke-width="2.2"/>
        <g transform="translate(13,13) scale(0.9)">
          <path d="M0,-2 C-3,-9 3,-9 0,-2 C-9,-5 -5,-10 0,-2 C9,-5 5,-10 0,-2 C-8,4 -3,9 0,-2 C8,4 3,9 0,-2" fill="${c1}" stroke="${c2}" stroke-width="1.2"/>
          <circle cx="0" cy="-2" r="2" fill="#fff"/>
        </g>
      `;
      sidePattern = `
        <path d="M94,5 Q100,11 106,5" fill="none" stroke="${c1}" stroke-width="1.5"/>
        <circle cx="5" cy="150" r="3" fill="${c1}"/>
        <circle cx="195" cy="150" r="3" fill="${c1}"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <path d="M0,0 C-4,-10 4,-10 0,0 C-10,-4 -6,-11 0,0 C10,-4 6,-11 0,0 C-9,6 -3,11 0,0 C9,6 3,11 0,0" fill="${c1}" stroke="#fff" stroke-width="0.9"/>
          <circle cx="0" cy="0" r="2.2" fill="${c2}"/>
        </svg>
      `;
      break;

    // 12. БЕЗУМНЫЙ АЗАРТ / ПОВЕЛИТЕЛЬ ТАЙН / КЛАСС ПРЕВОСХОДСТВА: Карточные масти, короны и шахматные ромбы
    case "cards_royal":
      cornerUnit = `
        <polyline points="3,30 3,3 30,3" fill="none" stroke="${c1}" stroke-width="2.4"/>
        <polygon points="13,6 19,13 13,20 7,13" fill="${c1}" stroke="#fff" stroke-width="0.9"/>
        <circle cx="24" cy="8" r="2" fill="${c2}"/>
        <circle cx="8" cy="24" r="2" fill="${c2}"/>
      `;
      sidePattern = `
        <polygon points="100,1 105,6 100,11 95,6" fill="${c2}" stroke="${c1}" stroke-width="1"/>
        <polygon points="5,145 9,150 5,155 1,150" fill="${c1}"/>
        <polygon points="195,145 199,150 195,155 191,150" fill="${c1}"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <path d="M-9,6 L-7,-5 L-2,1 L0,-7 L2,1 L7,-5 L9,6 Z" fill="${c1}" stroke="#fff" stroke-width="1"/>
        </svg>
      `;
      break;

    // 13. МУЗЫКА / ОДИНОКИЙ РОКЕР / ЗВУЧИ, ЭУФОНИУМ / АПРЕЛЬСКАЯ ЛОЖЬ: Скрипичные ключи, ноты и звуковые волны
    case "music_symphony":
      cornerUnit = `
        <path d="M3,28 Q3,3 28,3" fill="none" stroke="${c1}" stroke-width="2.2"/>
        <path d="M7,24 Q7,7 24,7" fill="none" stroke="${c2}" stroke-width="1.1"/>
        <g transform="translate(14,15)">
          <ellipse cx="-2" cy="3" rx="3.5" ry="2.4" transform="rotate(-20)" fill="${c1}"/>
          <line x1="1" y1="2" x2="1" y2="-7" stroke="${c1}" stroke-width="1.8"/>
          <path d="M1,-7 Q6,-5 5,0" fill="none" stroke="${c2}" stroke-width="1.6"/>
        </g>
      `;
      sidePattern = `
        <path d="M4,132 Q9,140 4,150 T4,168 M196,132 Q191,140 196,150 T196,168" fill="none" stroke="${c1}" stroke-width="1.5"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <ellipse cx="-4" cy="5" rx="3.5" ry="2.5" fill="${c1}"/>
          <ellipse cx="5" cy="3" rx="3.5" ry="2.5" fill="${c2}"/>
          <polyline points="-1,5 -1,-6 8,-8 8,3" fill="none" stroke="${c1}" stroke-width="2"/>
        </svg>
      `;
      break;

    // 14. СТУДИЯ GHIBLI / МОНОЛОГ ФАРМАЦЕВТА / ИЛЛЮЗИЯ РАЯ: Изумрудные ветви, фонарики духов и листья лотоса
    case "nature_ghibli":
      cornerUnit = `
        <path d="M4,30 C4,10 10,4 30,4" fill="none" stroke="${c1}" stroke-width="2.2"/>
        <path d="M10,10 C18,6 22,12 14,18 C8,22 6,16 10,10 Z" fill="${c1}" stroke="${c2}" stroke-width="1"/>
        <circle cx="22" cy="8" r="2" fill="${c2}"/>
      `;
      sidePattern = `
        <path d="M5,135 Q10,150 5,165 M195,135 Q190,150 195,165" fill="none" stroke="${c1}" stroke-width="1.8"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <path d="M0,8 C-8,2 -7,-7 0,-9 C7,-7 8,2 0,8 Z" fill="${c1}" stroke="${c2}" stroke-width="1.2"/>
          <line x1="0" y1="8" x2="0" y2="-5" stroke="#090614" stroke-width="1.3"/>
        </svg>
      `;
      break;

    // 15. ЛЁД / АЛЯ / СНЕЖНЫЕ И АКВА-ТАЙТЛЫ: Кристаллы снежинок и ледяные грани
    case "frost_crystal":
      cornerUnit = `
        <polyline points="3,28 3,3 28,3" fill="none" stroke="${c1}" stroke-width="2.2"/>
        <g transform="translate(14,14)">
          <line x1="-7" y1="0" x2="7" y2="0" stroke="${c1}" stroke-width="1.6"/>
          <line x1="0" y1="-7" x2="0" y2="7" stroke="${c1}" stroke-width="1.6"/>
          <line x1="-5" y1="-5" x2="5" y2="5" stroke="${c2}" stroke-width="1.4"/>
          <line x1="5" y1="-5" x2="-5" y2="5" stroke="${c2}" stroke-width="1.4"/>
          <polygon points="0,-3 3,0 0,3 -3,0" fill="#fff"/>
        </g>
      `;
      sidePattern = `
        <polygon points="100,1 104,6 100,11 96,6" fill="${c1}"/>
        <polygon points="5,145 9,150 5,155 1,150" fill="${c2}"/>
        <polygon points="195,145 199,150 195,155 191,150" fill="${c2}"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <path d="M0,-9 L0,9 M-9,0 L9,0 M-6,-6 L6,6 M-6,6 L6,-6" stroke="${c1}" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="0" cy="0" r="2.5" fill="${c2}"/>
        </svg>
      `;
      break;

    // 16. ОГОНЬ / ХОДЯЧИЙ ЗАМОК / КОНОСУБА / БАКУГАН / КУЛИНАРИЯ: Языки пламени и золотые искры
    default:
      cornerUnit = `
        <path d="M3,32 L3,3 L32,3" fill="none" stroke="${c1}" stroke-width="2.4"/>
        <path d="M6,24 C6,12 12,6 24,6 C16,10 14,14 18,18 C12,16 9,19 6,24 Z" fill="${c1}" stroke="${c2}" stroke-width="0.9"/>
      `;
      sidePattern = `
        <circle cx="100" cy="5" r="3" fill="${c2}"/>
        <path d="M4,140 L9,150 L4,160 M196,140 L191,150 L196,160" fill="none" stroke="${c1}" stroke-width="1.7"/>
      `;
      crestIcon = `
        <svg viewBox="-12 -12 24 24">
          <path d="M0,-10 C5,-4 8,1 4,7 C2,10 -3,10 -5,6 C-8,1 -4,-4 0,-10 Z" fill="${c1}" stroke="${c2}" stroke-width="1.2"/>
          <circle cx="0" cy="4" r="2.5" fill="${c2}"/>
        </svg>
      `;
      break;
  }

  return {
    svgHtml: `
      <svg class="acf-svg-overlay" viewBox="0 0 200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${gId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${c1}"/>
            <stop offset="50%" stop-color="${c2}"/>
            <stop offset="100%" stop-color="${c1}"/>
          </linearGradient>
        </defs>

        <!-- Внешний и внутренний контур рамки -->
        <rect x="1.5" y="1.5" width="197" height="297" rx="9" fill="none" stroke="url(#${gId})" stroke-width="2.2"/>
        <rect x="5.5" y="5.5" width="189" height="289" rx="6" fill="none" stroke="${c2}" stroke-width="0.9" stroke-opacity="0.72" ${borderDash}/>

        <!-- Боковые и верхние тематические узоры -->
        ${sidePattern}

        <!-- 4 тематических угла с узорами тайтла -->
        <g>${cornerUnit}</g>
        <g transform="translate(200,0) scale(-1,1)">${cornerUnit}</g>
        <g transform="translate(0,300) scale(1,-1)">${cornerUnit}</g>
        <g transform="translate(200,300) scale(-1,-1)">${cornerUnit}</g>
      </svg>
    `,
    crestHtml: `<span class="acf-top-crest">${crestIcon}</span>`
  };
}

/* ═══════════════════ ПОЛНАЯ БАЗА 122 ТАЙТЛОВ С ИХ ИНДИВИДУАЛЬНЫМИ АРХЕТИПАМИ УЗОРОВ ═══════════════════ */
const EXACT_ANIME_FRAMES_RAW = [
  ["100 девушек, которые очень-очень-очень-очень-очень сильно тебя любят", "#ff1493", "#ff80ab", "sakura_bloom"],
  ["Аватар короля", "#ffd740", "#00e5ff", "swords_crossed"],
  ["Аватар: Легенда о Корре", "#00b0ff", "#ff6d00", "frost_crystal"],
  ["Аватар: Легенда об Аанге", "#00e5ff", "#ffab00", "magic_circle"],
  ["Агенты четырёх сезонов: Весенний танец", "#ff80ab", "#69f0ae", "sakura_bloom"],
  ["Аля иногда кокетничает со мной по-русски", "#e0f7fa", "#ff4081", "frost_crystal"],
  ["Ангел кровопролития", "#304ffe", "#ff1744", "gothic_thorn"],
  ["Ангел по соседству", "#ffd54f", "#fff9c4", "sakura_bloom"],
  ["Ангельские ритмы!", "#00e5ff", "#ffffff", "music_symphony"],
  ["Арифурэта: Сильнейший ремесленник в мире", "#ff1744", "#b0bec5", "magic_circle"],
  ["Атака титанов", "#b71c1c", "#ff5722", "wings_blade"],
  ["Ателье колдовских колпаков", "#ffd740", "#80d8ff", "magic_circle"],
  ["Безумный азарт", "#d50000", "#ffd600", "cards_royal"],
  ["Безэмоциональная Касивада и эмоциональный Ота", "#ff8a65", "#4fc3f7", "sakura_bloom"],
  ["Боруто: Новое Поколение", "#ff4081", "#00e5ff", "naruto_ninja"],
  ["Вайолет Эвергарден", "#00bfa5", "#ffd54f", "sakura_bloom"],
  ["Ведьма и чудовище", "#b71c1c", "#9575cd", "gothic_thorn"],
  ["Ведьмина служба доставки", "#ff1744", "#2979ff", "nature_ghibli"],
  ["Военная хроника маленькой девочки", "#ffd600", "#bf360c", "wings_blade"],
  ["Волшебник ледяного клинка правит миром", "#00e5ff", "#82b1ff", "frost_crystal"],
  ["Восемьдесят шесть", "#ff1744", "#cfd8dc", "cyber_hud"],
  ["Восхождение в тени", "#6200ea", "#00e5ff", "gothic_thorn"],
  ["Голубая шкатулка", "#00e5ff", "#ff80ab", "frost_crystal"],
  ["Город, в котором меня нет", "#00b0ff", "#ff1744", "frost_crystal"],
  ["Дитя погоды", "#00b0ff", "#ffd740", "idol_star"],
  ["Добро пожаловать в класс превосходства", "#ff1744", "#d500f9", "cards_royal"],
  ["Забота об одарённой девушке: В престижной школе, полной высококлассных учеников, я буду тайно заботиться о самой красивой девушке (не имеющей никаких жизненных навыков)", "#ffd54f", "#f48fb1", "sakura_bloom"],
  ["Задержи этот звук!", "#ffd54f", "#ff8a65", "music_symphony"],
  ["Звёздное дитя", "#ff1493", "#00f5ff", "idol_star"],
  ["Звучи, эуфониум", "#ffd740", "#ffab40", "music_symphony"],
  ["Зомбиапокалипсис и список из 100 дел, что я выполню перед смертью", "#00e676", "#ff1744", "cyber_hud"],
  ["Из мечтателя в реалиста", "#80d8ff", "#cfd8dc", "frost_crystal"],
  ["Извращенка со вторым размером", "#ff4081", "#b388ff", "sakura_bloom"],
  ["Иллюзия рая", "#00e676", "#00b0ff", "nature_ghibli"],
  ["Иная", "#d50000", "#455a64", "gothic_thorn"],
  ["История знакомства опытной тебя и неопытного меня", "#ff80ab", "#ffd54f", "sakura_bloom"],
  ["История электричества в двадцатом веке", "#ffea00", "#00e5ff", "cyber_hud"],
  ["Кабанэри железной крепости", "#ff3d00", "#ffb300", "wings_blade"],
  ["Как и ожидал, моя школьная романтическая жизнь не удалась", "#80d8ff", "#ff80ab", "frost_crystal"],
  ["Карманы лета", "#00e5ff", "#fff59d", "nature_ghibli"],
  ["Киберпанк: Бегущие по краю", "#ffea00", "#00f5ff", "cyber_hud"],
  ["Клинок, рассекающий демонов", "#ff3d00", "#00e676", "demon_slayer"],
  ["Корзинка фруктов", "#ff80ab", "#fff59d", "sakura_bloom"],
  ["Королева со скальпелем", "#00e5ff", "#ffd740", "cards_royal"],
  ["Корона грешника", "#ff1744", "#7c4dff", "gothic_thorn"],
  ["Кошечка из Сакурасо", "#ff80ab", "#ffd740", "sakura_bloom"],
  ["Ликорис Рикоил", "#ff1744", "#00b0ff", "cyber_hud"],
  ["Магическая битва", "#651fff", "#ff1744", "gothic_thorn"],
  ["Мастера Меча Онлайн", "#00f5ff", "#2979ff", "swords_crossed"],
  ["Мастера на все руки выгнали из отряда героев", "#00e5ff", "#ffd740", "swords_crossed"],
  ["Младшая сестра моего друга досаждает", "#ffab00", "#40c4ff", "idol_star"],
  ["Может ли существовать дружба между мужчиной и женщиной? (Нет, это не так!)", "#2979ff", "#ff4081", "sakura_bloom"],
  ["Мой сосед Тоторо", "#69f0ae", "#ffd54f", "nature_ghibli"],
  ["Молчаливая ведьма: Тайна молчаливой колдуньи", "#b388ff", "#80d8ff", "magic_circle"],
  ["Монолог фармацевта", "#00e676", "#ffd740", "nature_ghibli"],
  ["Моя возлюбленная забыла свои очки", "#ffb74d", "#81d4fa", "sakura_bloom"],
  ["Наруто", "#ff7b00", "#ffd700", "naruto_ninja"],
  ["Не скрывая крик", "#ff1744", "#00e5ff", "music_symphony"],
  ["Небесный замок Лапута", "#80d8ff", "#ffd740", "nature_ghibli"],
  ["Непринуждённая жизнь в другом мире экс-кандидата в герои, оказавшегося читером со второго уровня", "#ffd740", "#69f0ae", "magic_circle"],
  ["Один танец", "#00f5ff", "#ff1493", "music_symphony"],
  ["Одинокий рокер!", "#ff4081", "#ffea00", "music_symphony"],
  ["Он — сильнейший учитель!", "#00e5ff", "#ffd740", "magic_circle"],
  ["Освободите эту ведьму", "#ff6d00", "#ffd740", "magic_circle"],
  ["Отчаянные бойцы Бакуган", "#ff3d00", "#00e676", "flame"],
  ["Очень приятно, Бог", "#ff5252", "#ffd740", "sakura_bloom"],
  ["Парад смерти", "#b57cff", "#00e5ff", "cards_royal"],
  ["Песнь ночных сов", "#d500f9", "#00e5ff", "idol_star"],
  ["Пластиковые воспоминания", "#80d8ff", "#ff80ab", "frost_crystal"],
  ["Плачущий призрак на пенсии", "#b388ff", "#ffd740", "magic_circle"],
  ["По велению адской сестры", "#ff1744", "#d500f9", "gothic_thorn"],
  ["Повар-боец Сома", "#ff6d00", "#ffd600", "flame"],
  ["Повелитель тайн: Клоун", "#ffd740", "#7e57c2", "cards_royal"],
  ["Поднятие уровня в одиночку", "#304ffe", "#00e5ff", "swords_crossed"],
  ["Покемон", "#ffea00", "#ff1744", "idol_star"],
  ["Полуночный мотив сердца", "#7c4dff", "#ff4081", "music_symphony"],
  ["Поцелуй сестёр", "#ff80ab", "#ff4081", "sakura_bloom"],
  ["Пощади меня, великий господин", "#ff1744", "#7c4dff", "swords_crossed"],
  ["Призматическое рондо", "#00e5ff", "#ff80ab", "idol_star"],
  ["Приключения пингвинёнка Лоло", "#80d8ff", "#ffffff", "frost_crystal"],
  ["Провожающая в последний путь Фрирен", "#ffe57f", "#80d8ff", "magic_circle"],
  ["Проект «Мир»: Сломанный мир и непоющая Мику", "#00f5ff", "#ff4081", "music_symphony"],
  ["Просто так!", "#ffb74d", "#80d8ff", "sakura_bloom"],
  ["Путешествие Элейны", "#b388ff", "#ffd54f", "magic_circle"],
  ["Пять сантиметров в секунду", "#ff80ab", "#b39ddb", "sakura_bloom"],
  ["Реинкарнация безработного: История о приключениях в другом мире", "#ffd54f", "#00e676", "magic_circle"],
  ["Рок — женская скромность", "#f48fb1", "#fff59d", "music_symphony"],
  ["Рыбка Поньо на утесе", "#ff5252", "#40c4ff", "nature_ghibli"],
  ["С нынешними детективами ничего не поделаешь", "#ffd740", "#90a4ae", "cards_royal"],
  ["Связь сердец", "#ff80ab", "#00e5ff", "idol_star"],
  ["Сказание об Аканэ", "#ff5252", "#ffd740", "sakura_bloom"],
  ["Судзумэ, закрывающая двери", "#00e5ff", "#ff5252", "idol_star"],
  ["Суперпринцесса Кагуя!", "#ffd740", "#ff80ab", "cards_royal"],
  ["Тацуки Фудзимото: С семнадцати до двадцати шести", "#ff3d00", "#00e5ff", "chainsaw_teeth"],
  ["Твоё имя", "#00b0ff", "#ff4081", "idol_star"],
  ["Твоя апрельская ложь", "#80d8ff", "#ff80ab", "music_symphony"],
  ["Тетрадь Смерти", "#d50000", "#9e9e9e", "gothic_thorn"],
  ["Тоннель в лето, выход прощаний", "#ff6d00", "#00b0ff", "nature_ghibli"],
  ["ТораДора!", "#ff9100", "#ff4081", "flame"],
  ["Троецарствие Японии", "#ff1744", "#ffd740", "swords_crossed"],
  ["Тусовщик Кунмин", "#00f5ff", "#ffd740", "music_symphony"],
  ["Убийца Акамэ!", "#ff1744", "#212121", "swords_crossed"],
  ["Убийца гоблинов", "#ff3d00", "#78909c", "swords_crossed"],
  ["Укрась прощальное утро цветами обещания", "#fff59d", "#81d4fa", "sakura_bloom"],
  ["Унесенные призраками", "#ff5252", "#ffd740", "nature_ghibli"],
  ["Фармацевт из параллельного мира", "#00e5ff", "#69f0ae", "magic_circle"],
  ["Форма голоса", "#80d8ff", "#ff80ab", "sakura_bloom"],
  ["Ходячий замок", "#ff9100", "#40c4ff", "flame"],
  ["Хоримия", "#ff4081", "#40c4ff", "sakura_bloom"],
  ["Хоть я и бездарная злодейка: Сказка о том, как бабочка и крыса поменялись местами в девичьем дворе", "#ff80ab", "#ffd740", "cards_royal"],
  ["Человек-бензопила", "#ff3d00", "#ffea00", "chainsaw_teeth"],
  ["Чёрный клевер", "#dc143c", "#ff1744", "clover5"],
  ["Чёрный факел", "#ff3d00", "#651fff", "gothic_thorn"],
  ["Чудачества любви не помеха", "#d500f9", "#ffd740", "magic_circle"],
  ["Шарлотта", "#00e5ff", "#ffd740", "idol_star"],
  ["Эта фарфоровая кукла влюбилась", "#ff4081", "#ffd740", "sakura_bloom"],
  ["Этот замечательный мир!", "#ff3d00", "#ffd600", "magic_circle"],
  ["Эхо террора", "#90a4ae", "#00e5ff", "cyber_hud"],
  ["Я подружился со второй самой симпатичной девушкой в классе", "#ffd740", "#80d8ff", "sakura_bloom"],
  ["Я хочу съесть твою поджелудочную", "#ff80ab", "#80d8ff", "sakura_bloom"],
  ["ID: Вторжение", "#00f5ff", "#ff1744", "cyber_hud"],
  ["Re:Zero. Жизнь с нуля в альтернативном мире", "#b57cff", "#00e5ff", "magic_circle"]
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

EXACT_ANIME_FRAMES_RAW.forEach(([exactTitle, c1, c2, motif], idx) => {
  const frameConfig = {
    id: idx + 1,
    exactTitle,
    c1,
    c2,
    motif
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
  const { svgHtml, crestHtml } = buildMotifSvgContent(f.motif, f.c1, f.c2, `${f.id}_${frameUidCounter}`);

  return `
    <span class="anime-custom-frame" data-frame-id="${f.id}" data-motif="${esc(f.motif)}" style="--fc1:${f.c1};--fc2:${f.c2};" aria-hidden="true">
      ${svgHtml}
      ${crestHtml}
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
