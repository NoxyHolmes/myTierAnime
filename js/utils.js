/* ═══════════════════ CORE UTILITIES: EXACT 122 FRAMES & REWATCH GROUPING (v24.0) ═══════════════════ */
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

/* ═══════════════════ УМНЫЙ РАСЧЁТ С ПОВТОРНЫМИ ПРОСМОТРАМИ ═══════════════════
   1) Если внутри одного тайтла название сезона/фильма совпадает в точности:
      - В самом тайтле (totalEpisodes, totalMovies, totalHours, totalDays) серии НЕ суммируются (остаются 100 серий)!
      - Для отображения в личной карточке формируется массив groupedSeasons, где одинаковые по названию сезоны
        объединены в одну строку с историей всех дат просмотра и красивой меткой «🔄 Просмотрено ×2 (Повтор)».
   2) В общий список просмотров всех тайтлов (viewedEpisodes, viewedMovies, viewedHours, viewedDays)
      суммируются И первый просмотр (100), И повторный просмотр (+100 = 200)! */
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

    // Точное совпадение названия сезона или фильма
    const exactTitleKey = `${String(s.type || "TV Сериал").trim().toLowerCase()}::${String(s.title || "").trim().toLowerCase()}`;
    const existingGroup = seenByTitleMap.get(exactTitleKey);
    const isRewatch = eps > 0 && !!existingGroup;
    const rewatchNumber = existingGroup ? (existingGroup.watchCount + 1) : 1;

    if (eps > 0) {
      const partMinutes = eps * mins;

      // В общий список просмотров ВСЕХ тайтлов идут и первый, и повторные просмотры (100 + 100 = 200)
      viewedMinutes += partMinutes;
      if (s.type === "Фильм") viewedMovies += eps;
      else viewedEpisodes += eps;

      if (!existingGroup) {
        // Первое вхождение этого сезона/фильма — прибавляем к уникальному объёму самого тайтла
        uniqueMinutes += partMinutes;
        if (s.type === "Фильм") uniqueMovies += eps;
        else uniqueEpisodes += eps;

        const groupEntry = {
          ...s,
          isRewatch: false,
          watchCount: 1,
          watchHistory: [
            {
              num: 1,
              date: s.date || "—",
              note: s.note || ""
            }
          ]
        };
        seenByTitleMap.set(exactTitleKey, groupEntry);
        groupedSeasons.push(groupEntry);
      } else {
        // Повторный просмотр того же сезона/фильма — серии в карточке тайтла НЕ прибавляем, а записываем факт повторного просмотра!
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
      // Анонс (0 серий)
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
    groupedSeasons, // Сгруппированный список без дублирования серий для личной карточки тайтла
    kind: item?.kind || seasons[0]?.type || "TV Сериал",
    // Уникальные показатели самого тайтла (для карточки и досье — 100 серий остаются 100 сериями):
    totalEpisodes: uniqueEpisodes,
    totalMovies: uniqueMovies,
    totalMinutes: uniqueMinutes,
    totalHours,
    totalDays,
    // Суммарные показатели всех просмотров с повторами (для общей статистики всех тайтлов — 100 + 100 = 200):
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

/* ═══════════════════ ПОЛНЫЙ РЕЕСТР 122 УНИКАЛЬНЫХ РАМОК ПО ТОЧНОМУ СОВПАДЕНИЮ НАЗВАНИЯ ═══════════════════ */
const EXACT_ANIME_FRAMES_RAW = [
  ["100 девушек, которые очень-очень-очень-очень-очень сильно тебя любят", "#ff1493", "#ff80ab", "💖", "sakura"],
  ["Аватар короля", "#ffd740", "#00e5ff", "👑", "royal"],
  ["Аватар: Легенда о Корре", "#00b0ff", "#ff6d00", "🌊", "frost"],
  ["Аватар: Легенда об Аанге", "#00e5ff", "#ffab00", "💨", "nature"],
  ["Агенты четырёх сезонов: Весенний танец", "#ff80ab", "#69f0ae", "🌸", "sakura"],
  ["Аля иногда кокетничает со мной по-русски", "#e0f7fa", "#ff4081", "❄️", "frost"],
  ["Ангел кровопролития", "#304ffe", "#ff1744", "🌙", "gothic"],
  ["Ангел по соседству", "#ffd54f", "#fff9c4", "🪽", "royal"],
  ["Ангельские ритмы!", "#00e5ff", "#ffffff", "🎹", "cyber"],
  ["Арифурэта: Сильнейший ремесленник в мире", "#ff1744", "#b0bec5", "🔫", "flame"],
  ["Атака титанов", "#b71c1c", "#ff5722", "⚔️", "flame"],
  ["Ателье колдовских колпаков", "#ffd740", "#80d8ff", "🪄", "star"],
  ["Безумный азарт", "#d50000", "#ffd600", "🎲", "royal"],
  ["Безэмоциональная Касивада и эмоциональный Ота", "#ff8a65", "#4fc3f7", "😊", "sakura"],
  ["Боруто: Новое Поколение", "#ff4081", "#00e5ff", "⚡", "cyber"],
  ["Вайолет Эвергарден", "#00bfa5", "#ffd54f", "✉️", "royal"],
  ["Ведьма и чудовище", "#b71c1c", "#9575cd", "🥀", "gothic"],
  ["Ведьмина служба доставки", "#ff1744", "#2979ff", "🧹", "star"],
  ["Военная хроника маленькой девочки", "#ffd600", "#bf360c", "⚙️", "flame"],
  ["Волшебник ледяного клинка правит миром", "#00e5ff", "#82b1ff", "🧊", "frost"],
  ["Восемьдесят шесть", "#ff1744", "#cfd8dc", "🕷️", "cyber"],
  ["Восхождение в тени", "#6200ea", "#00e5ff", "🌑", "gothic"],
  ["Голубая шкатулка", "#00e5ff", "#ff80ab", "🏸", "frost"],
  ["Город, в котором меня нет", "#00b0ff", "#ff1744", "🦋", "frost"],
  ["Дитя погоды", "#00b0ff", "#ffd740", "☀️", "star"],
  ["Добро пожаловать в класс превосходства", "#ff1744", "#d500f9", "♟️", "royal"],
  ["Забота об одарённой девушке: В престижной школе, полной высококлассных учеников, я буду тайно заботиться о самой красивой девушке (не имеющей никаких жизненных навыков)", "#ffd54f", "#f48fb1", "🎀", "sakura"],
  ["Задержи этот звук!", "#ffd54f", "#ff8a65", "🎶", "royal"],
  ["Звёздное дитя", "#ff1493", "#00f5ff", "⭐", "star"],
  ["Звучи, эуфониум", "#ffd740", "#ffab40", "🎺", "royal"],
  ["Зомбиапокалипсис и список из 100 дел, что я выполню перед смертью", "#00e676", "#ff1744", "🎨", "cyber"],
  ["Из мечтателя в реалиста", "#80d8ff", "#cfd8dc", "🍃", "frost"],
  ["Извращенка со вторым размером", "#ff4081", "#b388ff", "💋", "sakura"],
  ["Иллюзия рая", "#00e676", "#00b0ff", "🌿", "nature"],
  ["Иная", "#d50000", "#455a64", "👁️", "gothic"],
  ["История знакомства опытной тебя и неопытного меня", "#ff80ab", "#ffd54f", "🌅", "sakura"],
  ["История электричества в двадцатом веке", "#ffea00", "#00e5ff", "💡", "cyber"],
  ["Кабанэри железной крепости", "#ff3d00", "#ffb300", "🚂", "flame"],
  ["Как и ожидал, моя школьная романтическая жизнь не удалась", "#80d8ff", "#ff80ab", "☕", "frost"],
  ["Карманы лета", "#00e5ff", "#fff59d", "🦋", "nature"],
  ["Киберпанк: Бегущие по краю", "#ffea00", "#00f5ff", "⚡", "cyber"],
  ["Клинок, рассекающий демонов", "#ff3d00", "#00e676", "🗡️", "flame"],
  ["Корзинка фруктов", "#ff80ab", "#fff59d", "🍙", "sakura"],
  ["Королева со скальпелем", "#00e5ff", "#ffd740", "🩺", "royal"],
  ["Корона грешника", "#ff1744", "#7c4dff", "👑", "gothic"],
  ["Кошечка из Сакурасо", "#ff80ab", "#ffd740", "🎨", "sakura"],
  ["Ликорис Рикоил", "#ff1744", "#00b0ff", "🌺", "cyber"],
  ["Магическая битва", "#651fff", "#ff1744", "🤞", "gothic"],
  ["Мастера Меча Онлайн", "#00f5ff", "#2979ff", "⚔️", "cyber"],
  ["Мастера на все руки выгнали из отряда героев", "#00e5ff", "#ffd740", "🛡️", "royal"],
  ["Младшая сестра моего друга досаждает", "#ffab00", "#40c4ff", "😜", "star"],
  ["Может ли существовать дружба между мужчиной и женщиной? (Нет, это не так!)", "#2979ff", "#ff4081", "🌺", "sakura"],
  ["Мой сосед Тоторо", "#69f0ae", "#ffd54f", "🍃", "nature"],
  ["Молчаливая ведьма: Тайна молчаливой колдуньи", "#b388ff", "#80d8ff", "🔮", "star"],
  ["Монолог фармацевта", "#00e676", "#ffd740", "🌿", "nature"],
  ["Моя возлюбленная забыла свои очки", "#ffb74d", "#81d4fa", "👓", "sakura"],
  ["Наруто", "#ff7b00", "#ffd700", "🍥", "flame"],
  ["Не скрывая крик", "#ff1744", "#00e5ff", "🎸", "cyber"],
  ["Небесный замок Лапута", "#80d8ff", "#ffd740", "💎", "nature"],
  ["Непринуждённая жизнь в другом мире экс-кандидата в герои, оказавшегося читером со второго уровня", "#ffd740", "#69f0ae", "♾️", "royal"],
  ["Один танец", "#00f5ff", "#ff1493", "🕺", "cyber"],
  ["Одинокий рокер!", "#ff4081", "#ffea00", "🎸", "star"],
  ["Он — сильнейший учитель!", "#00e5ff", "#ffd740", "🎓", "royal"],
  ["Освободите эту ведьму", "#ff6d00", "#ffd740", "🔥", "flame"],
  ["Отчаянные бойцы Бакуган", "#ff3d00", "#00e676", "🐉", "flame"],
  ["Очень приятно, Бог", "#ff5252", "#ffd740", "🦊", "sakura"],
  ["Парад смерти", "#b57cff", "#00e5ff", "🍸", "gothic"],
  ["Песнь ночных сов", "#d500f9", "#00e5ff", "🌙", "cyber"],
  ["Пластиковые воспоминания", "#80d8ff", "#ff80ab", "🎡", "frost"],
  ["Плачущий призрак на пенсии", "#b388ff", "#ffd740", "👻", "star"],
  ["По велению адской сестры", "#ff1744", "#d500f9", "😈", "gothic"],
  ["Повар-боец Сома", "#ff6d00", "#ffd600", "🍽️", "flame"],
  ["Повелитель тайн: Клоун", "#ffd740", "#7e57c2", "🃏", "gothic"],
  ["Поднятие уровня в одиночку", "#304ffe", "#00e5ff", "🗡️", "cyber"],
  ["Покемон", "#ffea00", "#ff1744", "⚡", "star"],
  ["Полуночный мотив сердца", "#7c4dff", "#ff4081", "🎙️", "star"],
  ["Поцелуй сестёр", "#ff80ab", "#ff4081", "💋", "sakura"],
  ["Пощади меня, великий господин", "#ff1744", "#7c4dff", "🗡️", "flame"],
  ["Призматическое рондо", "#00e5ff", "#ff80ab", "🌈", "star"],
  ["Приключения пингвинёнка Лоло", "#80d8ff", "#ffffff", "🐧", "frost"],
  ["Провожающая в последний путь Фрирен", "#ffe57f", "#80d8ff", "🪄", "royal"],
  ["Проект «Мир»: Сломанный мир и непоющая Мику", "#00f5ff", "#ff4081", "🎤", "cyber"],
  ["Просто так!", "#ffb74d", "#80d8ff", "📷", "sakura"],
  ["Путешествие Элейны", "#b388ff", "#ffd54f", "🧹", "star"],
  ["Пять сантиметров в секунду", "#ff80ab", "#b39ddb", "🌸", "sakura"],
  ["Реинкарнация безработного: История о приключениях в другом мире", "#ffd54f", "#00e676", "🪄", "royal"],
  ["Рок — женская скромность", "#f48fb1", "#fff59d", "🎸", "sakura"],
  ["Рыбка Поньо на утесе", "#ff5252", "#40c4ff", "🐠", "nature"],
  ["С нынешними детективами ничего не поделаешь", "#ffd740", "#90a4ae", "🔍", "royal"],
  ["Связь сердец", "#ff80ab", "#00e5ff", "💞", "star"],
  ["Сказание об Аканэ", "#ff5252", "#ffd740", "🪭", "royal"],
  ["Судзумэ, закрывающая двери", "#00e5ff", "#ff5252", "🚪", "star"],
  ["Суперпринцесса Кагуя!", "#ffd740", "#ff80ab", "🎋", "royal"],
  ["Тацуки Фудзимото: С семнадцати до двадцати шести", "#ff3d00", "#00e5ff", "🎬", "cyber"],
  ["Твоё имя", "#00b0ff", "#ff4081", "☄️", "star"],
  ["Твоя апрельская ложь", "#80d8ff", "#ff80ab", "🎻", "sakura"],
  ["Тетрадь Смерти", "#d50000", "#9e9e9e", "🍎", "gothic"],
  ["Тоннель в лето, выход прощаний", "#ff6d00", "#00b0ff", "🍁", "nature"],
  ["ТораДора!", "#ff9100", "#ff4081", "🐯", "flame"],
  ["Троецарствие Японии", "#ff1744", "#ffd740", "🏯", "royal"],
  ["Тусовщик Кунмин", "#00f5ff", "#ffd740", "🪩", "cyber"],
  ["Убийца Акамэ!", "#ff1744", "#212121", "🩸", "gothic"],
  ["Убийца гоблинов", "#ff3d00", "#78909c", "🛡️", "flame"],
  ["Укрась прощальное утро цветами обещания", "#fff59d", "#81d4fa", "🌸", "sakura"],
  ["Унесенные призраками", "#ff5252", "#ffd740", "🏮", "nature"],
  ["Фармацевт из параллельного мира", "#00e5ff", "#69f0ae", "⚗️", "frost"],
  ["Форма голоса", "#80d8ff", "#ff80ab", "🌸", "sakura"],
  ["Ходячий замок", "#ff9100", "#40c4ff", "🔥", "flame"],
  ["Хоримия", "#ff4081", "#40c4ff", "💫", "sakura"],
  ["Хоть я и бездарная злодейка: Сказка о том, как бабочка и крыса поменялись местами в девичьем дворе", "#ff80ab", "#ffd740", "🦋", "royal"],
  ["Человек-бензопила", "#ff3d00", "#ffea00", "🪚", "flame"],
  ["Чёрный клевер", "#dc143c", "#7c0a02", "♣️", "gothic"],
  ["Чёрный факел", "#ff3d00", "#651fff", "🔥", "gothic"],
  ["Чудачества любви не помеха", "#d500f9", "#ffd740", "👁️", "star"],
  ["Шарлотта", "#00e5ff", "#ffd740", "☄️", "star"],
  ["Эта фарфоровая кукла влюбилась", "#ff4081", "#ffd740", "🎀", "sakura"],
  ["Этот замечательный мир!", "#ff3d00", "#ffd600", "💥", "flame"],
  ["Эхо террора", "#90a4ae", "#00e5ff", "🪶", "cyber"],
  ["Я подружился со второй самой симпатичной девушкой в классе", "#ffd740", "#80d8ff", "☀️", "sakura"],
  ["Я хочу съесть твою поджелудочную", "#ff80ab", "#80d8ff", "🌸", "sakura"],
  ["ID: Вторжение", "#00f5ff", "#ff1744", "🧩", "cyber"],
  ["Re:Zero. Жизнь с нуля в альтернативном мире", "#b57cff", "#00e5ff", "❄️", "gothic"]
];

/* Создаём хеш-таблицу точного совпадения названий (а также нормализованную по регистру и буквам ё/е для надёжности) */
const EXACT_ANIME_FRAMES_MAP = new Map();
const NORM_ANIME_FRAMES_MAP = new Map();

function normalizeTitleForExactMatch(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ");
}

EXACT_ANIME_FRAMES_RAW.forEach(([exactTitle, c1, c2, emblem, styleType], idx) => {
  const frameConfig = {
    id: idx + 1,
    exactTitle,
    c1,
    c2,
    emblem,
    styleType
  };
  EXACT_ANIME_FRAMES_MAP.set(exactTitle.trim(), frameConfig);
  NORM_ANIME_FRAMES_MAP.set(normalizeTitleForExactMatch(exactTitle), frameConfig);
});

function getTitleCustomFrame(title) {
  if (!title) return null;
  const trimmed = String(title).trim();

  // 1. Проверка точного совпадения 1-в-1 со списком
  if (EXACT_ANIME_FRAMES_MAP.has(trimmed)) {
    return EXACT_ANIME_FRAMES_MAP.get(trimmed);
  }

  // 2. Проверка совпадения с учётом регистра и ё/е
  const normKey = normalizeTitleForExactMatch(trimmed);
  if (NORM_ANIME_FRAMES_MAP.has(normKey)) {
    return NORM_ANIME_FRAMES_MAP.get(normKey);
  }

  return null;
}
window.getTitleCustomFrame = getTitleCustomFrame;

function renderTitleCustomFrameHtml(title) {
  const f = getTitleCustomFrame(title);
  if (!f) return "";
  return `
    <span class="anime-custom-frame frame-style-${esc(f.styleType)}" data-frame-id="${f.id}" style="--fc1:${f.c1};--fc2:${f.c2};" aria-hidden="true">
      <i class="acf-corner tl"></i>
      <i class="acf-corner tr"></i>
      <i class="acf-corner bl"></i>
      <i class="acf-corner br"></i>
      <em class="acf-emblem" title="${esc(f.exactTitle)}">${f.emblem}</em>
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
