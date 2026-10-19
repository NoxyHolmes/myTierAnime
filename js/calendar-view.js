/* ═══════════════════ COMPACT SPLIT CALENDAR & CHRONOLOGICAL LIST VIEW (v18.6) ═══════════════════ */
const CalendarView = (() => {
  const MONTHS_NOM = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];
  const MONTHS_GEN = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];
  const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const TIER_COLORS = {
    S: { bg: "rgba(255, 215, 106, 0.18)", border: "#ffd76a", text: "#ffe8a3" },
    A: { bg: "rgba(0, 245, 255, 0.16)", border: "#00f5ff", text: "#b8fbff" },
    B: { bg: "rgba(181, 124, 255, 0.2)", border: "#b57cff", text: "#e2cdff" },
    C: { bg: "rgba(56, 239, 125, 0.16)", border: "#38ef7d", text: "#b8ffd6" },
    D: { bg: "rgba(255, 159, 67, 0.18)", border: "#ff9f43", text: "#ffd8b0" },
    E: { bg: "rgba(140, 150, 190, 0.18)", border: "#8c96be", text: "#d0d6f2" }
  };

  let mode = "calendar"; // "calendar" | "list" | "nodate"
  let curYear = new Date().getFullYear();
  let curMonth = new Date().getMonth();
  let selectedDay = null; // null = показывать весь месяц, число = конкретный день
  let searchQuery = "";
  let filterYearSelect = "ALL";
  let initializedToLatest = false;

  function ensureCalendarStyles() {
    if (document.getElementById("mtaCompactCalendarStyles")) return;
    const st = document.createElement("style");
    st.id = "mtaCompactCalendarStyles";
    st.textContent = `
      .mta-cal-shell {
        background: rgba(14, 11, 28, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 22px;
        padding: 22px 26px 28px;
        box-shadow: 0 24px 60px -15px rgba(0, 0, 0, 0.9), 0 0 38px -18px rgba(181, 124, 255, 0.3);
        -webkit-backdrop-filter: blur(18px);
        backdrop-filter: blur(18px);
      }
      .mta-cal-top-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }
      .mta-cal-main-title {
        font-family: var(--serif, 'Cinzel', serif);
        font-size: 24px;
        font-weight: 900;
        margin: 0 0 4px;
        background: linear-gradient(135deg, #ffffff 0%, #ffe8a3 55%, #00f5ff 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .mta-cal-sub-counts {
        font-size: 12.5px;
        color: #9e97bf;
        font-weight: 600;
      }
      .mta-cal-search-row {
        display: grid;
        grid-template-columns: 1fr 140px;
        gap: 12px;
        margin-bottom: 14px;
      }
      .mta-cal-search-inp {
        width: 100%;
        background: rgba(22, 17, 46, 0.9);
        border: 1px solid rgba(255, 215, 106, 0.35);
        border-radius: 12px;
        padding: 10px 16px;
        color: #f5f3ff;
        font-size: 13px;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .mta-cal-search-inp:focus {
        border-color: #ffd76a;
        box-shadow: 0 0 18px -4px rgba(255, 215, 106, 0.45);
      }
      .mta-cal-year-sel {
        background: rgba(22, 17, 46, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 12px;
        padding: 10px 14px;
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }
      .mta-cal-tabs-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 18px;
      }
      .mta-cal-tab {
        padding: 7px 15px;
        border-radius: 10px;
        font-size: 12.5px;
        font-weight: 700;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.04);
        color: #cbc4eb;
        cursor: pointer;
        transition: all 0.18s ease;
      }
      .mta-cal-tab:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
      .mta-cal-tab.active {
        background: rgba(255, 215, 106, 0.16);
        border-color: #ffd76a;
        color: #ffe8a3;
        box-shadow: 0 0 16px -4px rgba(255, 215, 106, 0.4);
      }

      .mta-cal-split-layout {
        display: grid;
        grid-template-columns: 390px minmax(0, 1fr);
        gap: 24px;
        align-items: start;
      }
      .mta-cal-left-card {
        background: rgba(18, 14, 36, 0.94);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 18px;
        padding: 18px;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
      }
      .mta-cal-month-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
      }
      .mta-cal-nav-arrow {
        width: 34px;
        height: 34px;
        border-radius: 9px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.05);
        color: #f5f3ff;
        font-size: 14px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.15s;
      }
      .mta-cal-nav-arrow:hover {
        border-color: #00f5ff;
        color: #00f5ff;
        background: rgba(0, 245, 255, 0.12);
      }
      .mta-cal-month-label {
        font-family: var(--serif, 'Cinzel', serif);
        font-size: 16.5px;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: 0.03em;
      }
      .mta-cal-weekdays-row {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 6px;
        margin-bottom: 6px;
      }
      .mta-cal-wd {
        text-align: center;
        font-size: 11px;
        font-weight: 700;
        color: #8e87b0;
        padding: 4px 0;
      }
      .mta-cal-days-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 6px;
      }
      .mta-cal-cell {
        position: relative;
        height: 46px;
        border-radius: 10px;
        background: rgba(26, 21, 50, 0.65);
        border: 1px solid rgba(255, 255, 255, 0.06);
        padding: 6px 7px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        transition: all 0.16s ease;
        user-select: none;
      }
      .mta-cal-cell.empty {
        background: transparent;
        border-color: transparent;
        cursor: default;
      }
      .mta-cal-cell:not(.empty):hover {
        border-color: rgba(0, 245, 255, 0.5);
        background: rgba(38, 30, 72, 0.85);
      }
      .mta-cal-cell.has-watch {
        background: rgba(44, 31, 78, 0.88);
        border-color: rgba(181, 124, 255, 0.45);
      }
      .mta-cal-cell.is-today {
        border: 1.5px solid #ffd76a !important;
        box-shadow: 0 0 12px -2px rgba(255, 215, 106, 0.4);
      }
      .mta-cal-cell.is-selected {
        border: 2px solid #ff5e7e !important;
        background: linear-gradient(135deg, rgba(255, 60, 140, 0.25), rgba(181, 124, 255, 0.25)) !important;
        box-shadow: 0 0 16px -2px rgba(255, 94, 126, 0.6);
      }
      .mta-cell-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
      .mta-cell-daynum {
        font-size: 12.5px;
        font-weight: 700;
        color: #e5e1fa;
        line-height: 1;
      }
      .mta-cell-count {
        font-size: 9.5px;
        font-weight: 800;
        color: #b8fbff;
        opacity: 0.9;
        line-height: 1;
      }
      .mta-cell-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #00f5ff;
        box-shadow: 0 0 6px #00f5ff;
        margin: 0 auto;
      }
      .mta-cal-left-footer {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .mta-cal-summary-line {
        font-size: 11.5px;
        color: #a6a0c4;
        font-weight: 600;
      }
      .mta-cal-legend-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 11px;
        color: #9e97bf;
      }
      .mta-legend-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .mta-legend-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #ff5e7e;
        box-shadow: 0 0 6px #ff5e7e;
      }
      .mta-legend-today {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        border: 1.5px solid #ffd76a;
      }
      .mta-cal-quick-btns {
        display: flex;
        gap: 8px;
      }
      .mta-cal-qbtn {
        padding: 6px 13px;
        border-radius: 9px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.05);
        color: #e5e1fa;
        font-size: 11.5px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s;
      }
      .mta-cal-qbtn:hover {
        border-color: #ffd76a;
        color: #ffd76a;
      }

      .mta-cal-right-panel {
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-width: 0;
      }
      .mta-cal-right-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .mta-cal-right-title {
        font-size: 13.5px;
        font-weight: 700;
        color: #d6d0f5;
      }
      .mta-cal-right-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .mta-watch-row {
        display: grid;
        grid-template-columns: 92px 42px minmax(0, 1fr) auto;
        align-items: center;
        gap: 14px;
        background: rgba(22, 18, 44, 0.88);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 10px 14px;
        cursor: pointer;
        transition: transform 0.15s ease, border-color 0.2s ease, background 0.2s ease;
      }
      .mta-watch-row:hover {
        transform: translateX(3px);
        border-color: #ffd76a;
        background: rgba(32, 25, 62, 0.95);
      }
      .mta-watch-date {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        font-weight: 700;
        color: #ffd76a;
        white-space: nowrap;
      }
      .mta-watch-thumb {
        width: 42px;
        height: 58px;
        border-radius: 6px;
        object-fit: cover;
        border: 1px solid rgba(255,255,255,0.16);
      }
      .mta-watch-info {
        min-width: 0;
      }
      .mta-watch-title {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mta-watch-sub {
        font-size: 11.5px;
        color: #9e97bf;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mta-watch-tier-pill {
        width: 32px;
        height: 32px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--serif, 'Cinzel', serif);
        font-size: 14px;
        font-weight: 900;
      }

      @media (max-width: 960px) {
        .mta-cal-split-layout {
          grid-template-columns: 1fr;
        }
        .mta-cal-search-row {
          grid-template-columns: 1fr;
        }
        .mta-watch-row {
          grid-template-columns: 80px 38px minmax(0, 1fr) auto;
          gap: 10px;
        }
      }
    `;
    document.head.appendChild(st);
  }

  /* Собираем все записи. Если у анонса (0 серий) не заполнена дата, но указан Год (например 2026 или 2027), он получает precision="year" и встаёт в список за этот год! */
  function collectAllEntries(tiers) {
    const datedEntries = [];
    const noDateEntries = [];
    const uniqueTitlesWithDate = new Set();
    const yearsSet = new Set();

    (tiers || []).forEach(tier => {
      (tier.items || []).forEach(item => {
        const parts = normSeasons(item);
        const displayPoster = item.posterInline || item.poster || "https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime";

        parts.forEach(part => {
          let parsed = parseFlexibleRuDate(part.date);
          const isUpcoming = Number(part.episodes) === 0;
          const relYr = part.releaseYear !== undefined && part.releaseYear !== null ? Number(part.releaseYear) : 0;

          // Если дата не указана (или написано "Анонс"), но у сезона/анонса задан конкретный год (например 2026 или 2027 > 0), ставим его как запись с годом!
          if ((!parsed || !parsed.year) && relYr > 0) {
            parsed = {
              precision: "year",
              year: relYr,
              month: null,
              day: null,
              ms: new Date(relYr, 11, 31, 23, 59, 59).getTime(),
              raw: String(relYr)
            };
          }

          if (parsed && parsed.year) {
            uniqueTitlesWithDate.add(item.uid);
            yearsSet.add(parsed.year);
            datedEntries.push({
              uid: item.uid,
              tierId: tier.id,
              tierName: tier.name,
              title: item.title,
              poster: displayPoster,
              rawPoster: item.poster || "",
              blobSha: item.posterBlobSha || "",
              score: item.score,
              partTitle: part.title,
              partType: part.type,
              partNote: part.note || "",
              releaseYear: relYr > 0 ? relYr : parsed.year,
              episodes: part.episodes,
              epMinutes: part.epMinutes,
              partHours: isUpcoming ? 0 : (part.episodes * part.epMinutes) / 60,
              isUpcoming,
              precision: parsed.precision, // "day" | "month" | "year"
              year: parsed.year,
              month: parsed.month, // 0..11 или null
              day: parsed.day,     // 1..31 или null
              ms: parsed.ms,
              rawDate: parsed.raw
            });
          } else {
            noDateEntries.push({
              uid: item.uid,
              tierId: tier.id,
              tierName: tier.name,
              title: item.title,
              poster: displayPoster,
              rawPoster: item.poster || "",
              blobSha: item.posterBlobSha || "",
              score: item.score,
              partTitle: part.title,
              partType: part.type,
              partNote: part.note || "",
              releaseYear: relYr,
              episodes: part.episodes,
              epMinutes: part.epMinutes,
              partHours: isUpcoming ? 0 : (part.episodes * part.epMinutes) / 60,
              isUpcoming,
              rawDate: isUpcoming ? "Анонс (0 эп.)" : "Без даты"
            });
          }
        });
      });
    });

    datedEntries.sort((a, b) => b.ms - a.ms);
    const sortedYears = [...yearsSet].sort((a, b) => b - a);

    return {
      datedEntries,
      noDateEntries,
      titlesWithDateCount: uniqueTitlesWithDate.size,
      sortedYears
    };
  }

  function renderCalendar(tiers, onSelectCard) {
    ensureCalendarStyles();
    const host = document.getElementById("calendarRoot");
    if (!host) return;

    const { datedEntries, noDateEntries, titlesWithDateCount, sortedYears } = collectAllEntries(tiers);

    if (!initializedToLatest && datedEntries.length > 0) {
      const latestWithMonth = datedEntries.find(e => e.month !== null) || datedEntries[0];
      if (latestWithMonth) {
        curYear = latestWithMonth.year;
        if (latestWithMonth.month !== null) curMonth = latestWithMonth.month;
      }
      initializedToLatest = true;
    }

    const q = searchQuery.trim().toLowerCase();
    const matchSearchAndYear = e => {
      const matchText = !q ||
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.partTitle && e.partTitle.toLowerCase().includes(q)) ||
        (e.partNote && e.partNote.toLowerCase().includes(q));
      const matchYr = filterYearSelect === "ALL" || String(e.year) === String(filterYearSelect);
      return matchText && matchYr;
    };

    const filteredDated = datedEntries.filter(matchSearchAndYear);
    const filteredNoDate = noDateEntries.filter(e => {
      return !q ||
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.partTitle && e.partTitle.toLowerCase().includes(q));
    });

    // 1. Вкладка «Календарь»
    function buildCompactCalendarHtml() {
      const firstDayIndex = (new Date(curYear, curMonth, 1).getDay() + 6) % 7;
      const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();

      const monthEntries = filteredDated.filter(e =>
        e.year === curYear && e.month === curMonth
      );

      const byDay = {};
      monthEntries.forEach(e => {
        if (e.precision === "day" && e.day && e.month === curMonth) {
          (byDay[e.day] = byDay[e.day] || []).push(e);
        }
      });

      const daysWithAnimeCount = Object.keys(byDay).length;
      const now = new Date();
      const isCurrentRealMonth = now.getFullYear() === curYear && now.getMonth() === curMonth;
      const todayNum = now.getDate();

      let cellsHtml = "";
      for (let i = 0; i < firstDayIndex; i++) {
        cellsHtml += `<div class="mta-cal-cell empty"></div>`;
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const dayList = byDay[d] || [];
        const hasWatch = dayList.length > 0;
        const isToday = isCurrentRealMonth && d === todayNum;
        const isSelected = selectedDay === d;

        cellsHtml += `
          <div class="mta-cal-cell ${hasWatch ? "has-watch" : ""} ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""}" data-cal-day="${d}">
            <div class="mta-cell-top">
              <span class="mta-cell-daynum">${d}</span>
              ${hasWatch ? `<span class="mta-cell-count">${dayList.length}</span>` : ""}
            </div>
            ${hasWatch ? `<span class="mta-cell-dot"></span>` : `<span></span>`}
          </div>
        `;
      }

      const rightEntries = selectedDay !== null
        ? (byDay[selectedDay] || [])
        : monthEntries;

      const paddedDay = selectedDay !== null ? String(selectedDay).padStart(2, "0") : "";
      const paddedMonth = String(curMonth + 1).padStart(2, "0");
      const rightHeaderTitle = selectedDay !== null
        ? `Просмотрено ${paddedDay}.${paddedMonth}.${curYear}`
        : `Просмотры · ${MONTHS_NOM[curMonth].toLowerCase()} ${curYear} г.`;

      return `
        <div class="mta-cal-split-layout">
          <div class="mta-cal-left-card">
            <div class="mta-cal-month-nav">
              <button type="button" class="mta-cal-nav-arrow" id="calPrevMonthBtn" title="Предыдущий месяц">‹</button>
              <div class="mta-cal-month-label">${MONTHS_NOM[curMonth]} ${curYear} Г.</div>
              <button type="button" class="mta-cal-nav-arrow" id="calNextMonthBtn" title="Следующий месяц">›</button>
            </div>

            <div class="mta-cal-weekdays-row">
              ${WEEKDAYS.map(w => `<div class="mta-cal-wd">${w}</div>`).join("")}
            </div>

            <div class="mta-cal-days-grid">
              ${cellsHtml}
            </div>

            <div class="mta-cal-left-footer">
              <div class="mta-cal-summary-line">
                ${monthEntries.length} записей · ${daysWithAnimeCount} дней с аниме
              </div>
              <div class="mta-cal-legend-row">
                <span class="mta-legend-item"><span class="mta-legend-dot"></span> Есть просмотры</span>
                <span class="mta-legend-item"><span class="mta-legend-today"></span> Сегодня</span>
              </div>
              <div class="mta-cal-quick-btns">
                <button type="button" class="mta-cal-qbtn" id="calBtnToday">Сегодня</button>
                <button type="button" class="mta-cal-qbtn" id="calBtnLastWatch">Последний просмотр</button>
              </div>
            </div>
          </div>

          <div class="mta-cal-right-panel">
            <div class="mta-cal-right-head">
              <div class="mta-cal-right-title">${rightHeaderTitle}</div>
              ${selectedDay !== null ? `
                <div style="display:flex;gap:8px;">
                  <button type="button" class="mta-cal-qbtn" id="calBtnShowFullMonth">Весь месяц</button>
                </div>
              ` : ""}
            </div>

            <div class="mta-cal-right-list">
              ${rightEntries.length ? rightEntries.map(e => {
                const tc = TIER_COLORS[e.tierId] || TIER_COLORS.S;
                const dateBadge = e.precision === "day"
                  ? `${String(e.day).padStart(2, "0")}.${String(e.month + 1).padStart(2, "0")}.${e.year}`
                  : `${MONTHS_NOM[e.month]}${e.year}`;
                const timeOrUpcoming = e.isUpcoming
                  ? `<b style="color:#ffd76a;">⏳ Анонс</b>`
                  : `⏱ ${formatHours(e.partHours)} ч.`;
                return `
                  <div class="mta-watch-row" data-uid="${esc(e.uid)}" data-tier="${esc(e.tierId)}">
                    <div class="mta-watch-date">${esc(dateBadge)}</div>
                    <img class="mta-watch-thumb card-poster" src="${esc(e.poster)}" data-raw-path="${esc(e.rawPoster)}" data-blob-sha="${esc(e.blobSha)}" alt="">
                    <div class="mta-watch-info">
                      <div class="mta-watch-title">${esc(e.title)}</div>
                      <div class="mta-watch-sub">
                        ${esc(e.tierName)} · <b style="color:#ffd76a;">${esc(e.partTitle)}</b> (${esc(e.partType)}) ·${timeOrUpcoming}
                      </div>
                    </div>
                    <div class="mta-watch-tier-pill" style="background:${tc.bg};border:1px solid ${tc.border};color:${tc.text};">
                      ${esc(e.tierId)}
                    </div>
                  </div>
                `;
              }).join("") : `
                <div style="padding:28px 18px;text-align:center;color:var(--ink-soft);background:rgba(255,255,255,0.02);border-radius:12px;border:1px dashed rgba(255,255,255,0.1);">
                  За выбранный период записей просмотра нет.
                </div>
              `}
            </div>
          </div>
        </div>
      `;
    }

    // 2. Вкладка «Список» (годовые блоки стоят между Декабрём своего года и Январём следующего года, без текста "(указан только год)")
    function buildChronologicalListHtml() {
      const groupsMap = new Map();

      filteredDated.forEach(e => {
        if (e.precision === "year" || e.month === null) {
          // monthOrder = 12 ставит "2026 год" строго между Декабрём 2026 (11) и Январём 2027 (year 2027, monthOrder 0)!
          const key = `${e.year}-YEAR_TOP`;
          if (!groupsMap.has(key)) {
            groupsMap.set(key, {
              year: e.year,
              monthOrder: 12,
              title: `📌 ${e.year} год`,
              items: []
            });
          }
          groupsMap.get(key).items.push(e);
        } else {
          const key = `${e.year}-${String(e.month).padStart(2, "0")}`;
          if (!groupsMap.has(key)) {
            groupsMap.set(key, {
              year: e.year,
              monthOrder: e.month,
              title: `🗓 ${MONTHS_NOM[e.month]} ${e.year}`,
              items: []
            });
          }
          groupsMap.get(key).items.push(e);
        }
      });

      const sortedGroups = [...groupsMap.values()].sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.monthOrder - a.monthOrder;
      });

      if (!sortedGroups.length) {
        return `<div class="month-block">По вашему запросу записей не найдено.</div>`;
      }

      return `
        <div class="months-list">
          ${sortedGroups.map(g => {
            const totalGroupHours = g.items.reduce((acc, i) => acc + i.partHours, 0);
            const isYearOnlyBlock = g.monthOrder === 12;
            return `
              <div class="month-block" style="${isYearOnlyBlock ? "border-color:rgba(255,215,106,0.45);background:linear-gradient(135deg,rgba(32,24,52,0.92),rgba(16,13,32,0.95));" : ""}">
                <div class="month-block-head">
                  <h3 style="margin:0;font-family:var(--serif);font-size:18px;color:${isYearOnlyBlock ? "#ffd76a" : "#ffffff"};">
                    ${esc(g.title)}
                  </h3>
                  <span style="font-size:12px;color:#00f5ff;font-weight:700;">
                    Частей: ${g.items.length} · Затрачено: ${formatHours(totalGroupHours)} ч.
                  </span>
                </div>
                <div class="month-entries-grid">
                  ${g.items.map(e => {
                    const badgeDate = e.precision === "day"
                      ? `📅 ${e.day} ${MONTHS_GEN[e.month]} ${e.year}`
                      : (e.precision === "month" ? `🗓 ${MONTHS_NOM[e.month]} ${e.year}` : `📌 ${e.year} год`);

                    const statusOrHours = e.isUpcoming
                      ? `⏳ Анонс`
                      : `${formatHours(e.partHours)} ч.`;

                    return `
                      <div class="month-entry-card" data-uid="${esc(e.uid)}" data-tier="${esc(e.tierId)}">
                        <img class="card-poster" src="${esc(e.poster)}" data-raw-path="${esc(e.rawPoster)}" data-blob-sha="${esc(e.blobSha)}" alt="">
                        <div style="min-width:0;flex:1;">
                          <div style="font-size:11px;color:#ffd76a;font-weight:700;">
                            ${badgeDate} · Тир ${esc(e.tierId)}
                          </div>
                          <div style="font-size:13.5px;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            ${esc(e.title)}
                          </div>
                          <div style="font-size:11.5px;color:#00f5ff;font-weight:600;">
                            ${esc(e.partTitle)} (${esc(e.partType)}${e.releaseYear ? `, ${esc(e.releaseYear)} г.` : ""}) — ${statusOrHours}
                          </div>
                        </div>
                      </div>
                    `;
                  }).join("")}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    // 3. Вкладка «Без даты» (только те записи и анонсы, у которых год = 0 / неизвестен)
    function buildNoDateHtml() {
      if (!filteredNoDate.length) {
        return `<div class="month-block" style="text-align:center;color:var(--ink-soft);">Нет сезонов или анонсов без указанной даты.</div>`;
      }
      return `
        <div class="month-block">
          <div class="month-block-head">
            <h3 style="margin:0;font-family:var(--serif);font-size:18px;color:#ffd76a;">⏳ Анонсы без известного года и части без даты (${filteredNoDate.length})</h3>
          </div>
          <div class="month-entries-grid">
            ${filteredNoDate.map(e => `
              <div class="month-entry-card" data-uid="${esc(e.uid)}" data-tier="${esc(e.tierId)}">
                <img class="card-poster" src="${esc(e.poster)}" data-raw-path="${esc(e.rawPoster)}" data-blob-sha="${esc(e.blobSha)}" alt="">
                <div style="min-width:0;flex:1;">
                  <div style="font-size:11px;color:#ffd76a;font-weight:700;">
                    ⏳ ${esc(e.rawDate)} · Тир ${esc(e.tierId)}
                  </div>
                  <div style="font-size:13.5px;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${esc(e.title)}
                  </div>
                  <div style="font-size:11.5px;color:#00f5ff;font-weight:600;">
                    ${esc(e.partTitle)} (${esc(e.partType)}${e.releaseYear > 0 ? `, ${esc(e.releaseYear)} г.` : ", год не указан"})
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    host.innerHTML = `
      <div class="mta-cal-shell">
        <div class="mta-cal-top-header">
          <div>
            <h2 class="mta-cal-main-title">История просмотров</h2>
            <div class="mta-cal-sub-counts">
              ${titlesWithDateCount} тайтлов с датой · ${datedEntries.length} записей просмотра
            </div>
          </div>
        </div>

        <div class="mta-cal-search-row">
          <input type="search" id="calSearchInput" class="mta-cal-search-inp" placeholder="Найти аниме или сезон..." value="${esc(searchQuery)}">
          <select id="calYearFilterSelect" class="mta-cal-year-sel">
            <option value="ALL" ${filterYearSelect === "ALL" ? "selected" : ""}>Все годы</option>
            ${sortedYears.map(y => `<option value="${y}" ${String(filterYearSelect) === String(y) ? "selected" : ""}>${y}</option>`).join("")}
          </select>
        </div>

        <div class="mta-cal-tabs-row">
          <button type="button" class="mta-cal-tab ${mode === "calendar" ? "active" : ""}" data-cal-mode="calendar">Календарь</button>
          <button type="button" class="mta-cal-tab ${mode === "list" ? "active" : ""}" data-cal-mode="list">Список</button>
          <button type="button" class="mta-cal-tab ${mode === "nodate" ? "active" : ""}" data-cal-mode="nodate">Без даты · ${noDateEntries.length}</button>
        </div>

        <div id="calDynamicBody">
          ${mode === "calendar" ? buildCompactCalendarHtml() : (mode === "list" ? buildChronologicalListHtml() : buildNoDateHtml())}
        </div>
      </div>
    `;

    if (typeof GitHubSync !== "undefined" && typeof GitHubSync.resolveAssetUrl === "function") {
      host.querySelectorAll("img.card-poster").forEach(async img => {
        const curSrc = img.getAttribute("src") || "";
        if (curSrc.startsWith("data:")) return;
        const sha = img.dataset.blobSha;
        const rawPath = img.dataset.rawPath || curSrc;
        if (sha || (rawPath && !rawPath.startsWith("http") && !rawPath.startsWith("blob:"))) {
          const resolved = await GitHubSync.resolveAssetUrl(rawPath, sha);
          if (resolved) img.src = resolved;
        }
      });
    }

    host.querySelectorAll("[data-cal-mode]").forEach(btn => {
      btn.onclick = () => {
        mode = btn.dataset.calMode;
        renderCalendar(tiers, onSelectCard);
      };
    });

    const searchInp = document.getElementById("calSearchInput");
    if (searchInp) {
      searchInp.oninput = e => {
        searchQuery = e.target.value;
        const pos = searchInp.selectionStart;
        renderCalendar(tiers, onSelectCard);
        const newInp = document.getElementById("calSearchInput");
        if (newInp) {
          newInp.focus();
          try { newInp.setSelectionRange(pos, pos); } catch {}
        }
      };
    }

    const yrSel = document.getElementById("calYearFilterSelect");
    if (yrSel) {
      yrSel.onchange = e => {
        filterYearSelect = e.target.value;
        if (filterYearSelect !== "ALL") {
          curYear = parseInt(filterYearSelect, 10);
          selectedDay = null;
        }
        renderCalendar(tiers, onSelectCard);
      };
    }

    const prevBtn = document.getElementById("calPrevMonthBtn");
    if (prevBtn) {
      prevBtn.onclick = () => {
        curMonth--;
        if (curMonth < 0) { curMonth = 11; curYear--; }
        selectedDay = null;
        renderCalendar(tiers, onSelectCard);
      };
    }

    const nextBtn = document.getElementById("calNextMonthBtn");
    if (nextBtn) {
      nextBtn.onclick = () => {
        curMonth++;
        if (curMonth > 11) { curMonth = 0; curYear++; }
        selectedDay = null;
        renderCalendar(tiers, onSelectCard);
      };
    }

    host.querySelectorAll("[data-cal-day]").forEach(cell => {
      cell.onclick = () => {
        const d = parseInt(cell.dataset.calDay, 10);
        selectedDay = (selectedDay === d) ? null : d;
        renderCalendar(tiers, onSelectCard);
      };
    });

    const fullMonthBtn = document.getElementById("calBtnShowFullMonth");
    if (fullMonthBtn) {
      fullMonthBtn.onclick = () => {
        selectedDay = null;
        renderCalendar(tiers, onSelectCard);
      };
    }

    const todayBtn = document.getElementById("calBtnToday");
    if (todayBtn) {
      todayBtn.onclick = () => {
        const now = new Date();
        curYear = now.getFullYear();
        curMonth = now.getMonth();
        selectedDay = now.getDate();
        filterYearSelect = "ALL";
        renderCalendar(tiers, onSelectCard);
      };
    }

    const lastWatchBtn = document.getElementById("calBtnLastWatch");
    if (lastWatchBtn) {
      lastWatchBtn.onclick = () => {
        const latest = datedEntries.find(e => e.month !== null);
        if (latest) {
          curYear = latest.year;
          curMonth = latest.month;
          selectedDay = latest.precision === "day" ? latest.day : null;
          filterYearSelect = "ALL";
          renderCalendar(tiers, onSelectCard);
        }
      };
    }

    host.querySelectorAll("[data-uid]").forEach(el => {
      el.onclick = () => {
        if (typeof onSelectCard === "function") {
          onSelectCard(el.dataset.uid, el.dataset.tier);
        }
      };
    });
  }

  return { renderCalendar };
})();
