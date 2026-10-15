/* ═══════════════════ CHRONO CALENDAR (DIRECT MONTH/YEAR SELECTORS & CLEAN LABELS) ═══════════════════ */
const CalendarView = (() => {
  let subMode = "grid";
  let curYear = 2026;
  let curMonth = 3;

  const MONTH_NAMES = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  function collectAllWatchEvents(tiers) {
    const events = [];
    (tiers || []).forEach(tier => {
      (tier.items || []).forEach(item => {
        const seasons = normSeasons(item);
        seasons.forEach(s => {
          const dateRaw = s.date || (s.releaseYear ? String(s.releaseYear) : (item.year ? String(item.year) : ""));
          const parsed = parseFlexibleRuDate(dateRaw);
          if (!parsed) return;

          const hours = Number(s.episodes) > 0 ? (s.episodes * s.epMinutes) / 60 : 0;
          const displayPoster = item.posterInline || item.poster || "https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime";

          events.push({
            precision: parsed.precision,
            ms: parsed.ms,
            year: parsed.year,
            month: parsed.month,
            day: parsed.day,
            dateStr: parsed.raw,
            partTitle: s.title,
            partType: s.type,
            episodes: s.episodes,
            hours,
            poster: displayPoster,
            item,
            tier
          });
        });
      });
    });
    return events.sort((a, b) => b.ms - a.ms);
  }

  function getAvailableYears(events) {
    const yearsSet = new Set([2024, 2025, 2026, 2027, curYear]);
    events.forEach(e => {
      if (e.year) yearsSet.add(e.year);
    });
    const minYr = Math.min(...yearsSet, 2018);
    const maxYr = Math.max(...yearsSet, 2028);
    const list = [];
    for (let y = maxYr; y >= minYr; y--) {
      list.push(y);
    }
    return list;
  }

  function renderCalendar(tiers, onSelectItem) {
    const host = document.getElementById("calendarRoot");
    if (!host) return;
    const events = collectAllWatchEvents(tiers);

    if (events.length && !host.dataset.initialized) {
      const firstWithMonth = events.find(e => e.month !== null) || events[0];
      curYear = firstWithMonth.year;
      curMonth = firstWithMonth.month !== null ? firstWithMonth.month : new Date().getMonth();
      host.dataset.initialized = "1";
    }

    const availableYears = getAvailableYears(events);

    const toolbarHtml = `
      <div class="cal-toolbar">
        <div>
          <h2 style="margin:0;font-family:var(--serif);font-size:19px;">📅 Календарь просмотров</h2>
          <div style="font-size:11.5px;color:var(--ink-soft);">
            Всего записей в хронологии: <b>${events.length}</b>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <button type="button" class="btn ${subMode === "grid" ? "btn-primary" : ""}" data-cal-mode="grid">
            🗓 Календарная сетка
          </button>
          <button type="button" class="btn ${subMode === "months" ? "btn-primary" : ""}" data-cal-mode="months">
            📋 Список по месяцам и годам
          </button>
        </div>
      </div>
    `;

    let bodyHtml = "";
    if (subMode === "months") {
      const grouped = new Map();

      events.forEach(ev => {
        const isYearOnly = ev.precision === "year" || ev.month === null;
        const key = isYearOnly
          ? `${ev.year}-00-YEARONLY`
          : `${ev.year}-${String(ev.month + 1).padStart(2, "0")}`;
        // Чистая подпись без скобок: просто "2024 год"
        const label = isYearOnly
          ? `🗓 ${ev.year} год`
          : `${MONTH_NAMES[ev.month]} ${ev.year}`;

        if (!grouped.has(key)) {
          grouped.set(key, {
            label,
            items: [],
            totalHours: 0,
            totalEps: 0
          });
        }
        const g = grouped.get(key);
        g.items.push(ev);
        g.totalHours += ev.hours;
        g.totalEps += ev.episodes;
      });

      bodyHtml = `<div class="months-list">` +
        [...grouped.values()].map(g => `
          <div class="month-block">
            <div class="month-block-head">
              <strong style="font-family:var(--serif);font-size:17px;color:#ffd76a;">${esc(g.label)}</strong>
              <span style="font-size:12px;color:var(--ink-soft);">
                Записей: <b>${g.items.length}</b> · Серий/фильмов: <b>${g.totalEps}</b> · Время: <b style="color:#00f5ff;">${formatHours(g.totalHours)} ч.</b>
              </span>
            </div>
            <div class="month-entries-grid">
              ${g.items.map(ev => `
                <div class="month-entry-card" data-ev-uid="${esc(ev.item.uid)}" data-ev-tier="${esc(ev.tier.id)}">
                  <img src="${esc(ev.poster)}" alt="">
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:10px;color:#ffd76a;font-weight:700;">
                      ${esc(ev.dateStr)} · Тир ${esc(ev.tier.id)} · ${esc(ev.partType)}
                    </div>
                    <div style="font-size:13px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(ev.item.title)}</div>
                    <div style="font-size:11px;color:var(--ink-soft);">
                      ${esc(ev.partTitle)} (${ev.episodes === 0 ? "⏳ Анонс" : `${ev.episodes} эп. · ${formatHours(ev.hours)} ч.`})
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `).join("") +
      `</div>`;
    } else {
      const firstDay = new Date(curYear, curMonth, 1);
      const startOffset = (firstDay.getDay() + 6) % 7;
      const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();

      const monthOnlyEvents = events.filter(e => e.year === curYear && e.month === curMonth && e.precision === "month");
      const yearOnlyEvents = events.filter(e => e.year === curYear && e.precision === "year");

      const cells = [];
      for (let i = 0; i < startOffset; i++) cells.push(`<div class="cal-day" style="opacity:0.25;"></div>`);
      for (let d = 1; d <= daysInMonth; d++) {
        const dayEvents = events.filter(e => e.year === curYear && e.month === curMonth && e.precision === "day" && e.day === d);
        cells.push(`
          <div class="cal-day ${dayEvents.length ? "has-events" : ""}">
            <div class="cal-day-num">${d} ${MONTH_NAMES[curMonth].slice(0, 3)}</div>
            ${dayEvents.map(ev => `
              <div class="cal-event-chip" data-ev-uid="${esc(ev.item.uid)}" data-ev-tier="${esc(ev.tier.id)}">
                <img src="${esc(ev.poster)}" alt="">
                <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                  <b>${esc(ev.item.title)}</b><br>
                  <span style="color:var(--ink-soft);">${esc(ev.partTitle)} (${formatHours(ev.hours)}ч)</span>
                </div>
              </div>
            `).join("")}
          </div>
        `);
      }

      const monthOnlyBanner = monthOnlyEvents.length ? `
        <div class="month-block" style="margin-bottom:14px;padding:12px 16px;border-color:rgba(0,245,255,0.4);">
          <div style="font-size:13px;font-weight:800;color:#00f5ff;margin-bottom:8px;">
            📌 ${MONTH_NAMES[curMonth]} ${curYear}:
          </div>
          <div class="month-entries-grid">
            ${monthOnlyEvents.map(ev => `
              <div class="month-entry-card" data-ev-uid="${esc(ev.item.uid)}" data-ev-tier="${esc(ev.tier.id)}">
                <img src="${esc(ev.poster)}" alt="">
                <div style="flex:1;min-width:0;">
                  <div style="font-size:10px;color:#00f5ff;font-weight:700;">${esc(ev.dateStr)} · Тир ${esc(ev.tier.id)}</div>
                  <div style="font-size:13px;font-weight:700;color:#fff;">${esc(ev.item.title)}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${esc(ev.partTitle)} (${ev.episodes === 0 ? "⏳ Анонс" : `${formatHours(ev.hours)} ч.`})</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : "";

      const yearOnlyBanner = yearOnlyEvents.length ? `
        <div class="month-block" style="margin-top:16px;padding:14px 18px;border-color:rgba(255,215,106,0.45);">
          <div style="font-size:14px;font-weight:800;color:#ffd76a;margin-bottom:10px;font-family:var(--serif);">
            🗓 ${curYear} год
          </div>
          <div class="month-entries-grid">
            ${yearOnlyEvents.map(ev => `
              <div class="month-entry-card" data-ev-uid="${esc(ev.item.uid)}" data-ev-tier="${esc(ev.tier.id)}">
                <img src="${esc(ev.poster)}" alt="">
                <div style="flex:1;min-width:0;">
                  <div style="font-size:10px;color:#ffd76a;font-weight:700;">${esc(ev.dateStr)} год · Тир ${esc(ev.tier.id)} · ${esc(ev.partType)}</div>
                  <div style="font-size:13px;font-weight:700;color:#fff;">${esc(ev.item.title)}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${esc(ev.partTitle)} (${ev.episodes === 0 ? "⏳ Анонс" : `${ev.episodes} эп. · ${formatHours(ev.hours)} ч.`})</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : "";

      /* Прямой выбор конкретного месяца и года из раскрывающихся списков + быстрые стрелки */
      bodyHtml = `
        <div class="cal-nav-bar">
          <button type="button" class="btn btn-sm" id="calPrevBtn">◀ Пред. месяц</button>

          <div class="cal-direct-selectors">
            <select id="calMonthSelect" class="form-control cal-select-pill" title="Выберите месяц">
              ${MONTH_NAMES.map((mName, mIdx) => `<option value="${mIdx}" ${mIdx === curMonth ? "selected" : ""}>${mName}</option>`).join("")}
            </select>

            <select id="calYearSelect" class="form-control cal-select-pill" title="Выберите год">
              ${availableYears.map(y => `<option value="${y}" ${y === curYear ? "selected" : ""}>${y} год</option>`).join("")}
            </select>
          </div>

          <button type="button" class="btn btn-sm" id="calNextBtn">След. месяц ▶</button>
        </div>
        ${monthOnlyBanner}
        <div class="cal-grid">
          ${["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(w => `<div class="cal-weekday">${w}</div>`).join("")}
          ${cells.join("")}
        </div>
        ${yearOnlyBanner}
      `;
    }

    host.innerHTML = toolbarHtml + bodyHtml;

    host.querySelectorAll("[data-cal-mode]").forEach(btn => {
      btn.addEventListener("click", () => {
        subMode = btn.dataset.calMode;
        renderCalendar(tiers, onSelectItem);
      });
    });

    // Обработчики прямого выбора месяца и года
    host.querySelector("#calMonthSelect")?.addEventListener("change", e => {
      curMonth = parseInt(e.target.value, 10);
      renderCalendar(tiers, onSelectItem);
    });

    host.querySelector("#calYearSelect")?.addEventListener("change", e => {
      curYear = parseInt(e.target.value, 10);
      renderCalendar(tiers, onSelectItem);
    });

    host.querySelector("#calPrevBtn")?.addEventListener("click", () => {
      curMonth--;
      if (curMonth < 0) { curMonth = 11; curYear--; }
      renderCalendar(tiers, onSelectItem);
    });
    host.querySelector("#calNextBtn")?.addEventListener("click", () => {
      curMonth++;
      if (curMonth > 11) { curMonth = 0; curYear++; }
      renderCalendar(tiers, onSelectItem);
    });

    host.querySelectorAll("[data-ev-uid]").forEach(el => {
      el.addEventListener("click", () => {
        if (typeof onSelectItem === "function") {
          onSelectItem(el.dataset.evUid, el.dataset.evTier);
        }
      });
    });
  }

  return { renderCalendar };
})();
