/* ═══════════════════ CHRONO CALENDAR & MONTHLY LIST VIEW ENGINE ═══════════════════ */
const CalendarView = (() => {
  let subMode = "months";
  let curYear = 2026;
  let curMonth = 5;

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
          const ms = parseRuDate(s.date);
          if (!ms) return;
          const d = new Date(ms);
          const hours = (s.episodes * s.epMinutes) / 60;
          events.push({
            ms,
            year: d.getFullYear(),
            month: d.getMonth(),
            day: d.getDate(),
            dateStr: s.date,
            partTitle: s.title,
            partType: s.type,
            episodes: s.episodes,
            hours,
            item,
            tier
          });
        });
      });
    });
    return events.sort((a, b) => b.ms - a.ms);
  }

  function renderCalendar(tiers, onSelectItem) {
    const host = document.getElementById("calendarRoot");
    if (!host) return;
    const events = collectAllWatchEvents(tiers);

    if (events.length && !host.dataset.initialized) {
      curYear = events[0].year;
      curMonth = events[0].month;
      host.dataset.initialized = "1";
    }

    const toolbarHtml = `
      <div class="cal-toolbar">
        <div>
          <h2 style="margin:0;font-family:var(--serif);font-size:19px;">📅 Хронология просмотров · Канон ${curYear}</h2>
          <div style="font-size:11.5px;color:var(--ink-soft);">Всего зафиксировано сессий/сезонов: <b>${events.length}</b></div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <button type="button" class="btn ${subMode === "months" ? "btn-primary" : ""}" data-cal-mode="months">
            📋 Список по месяцам (Весь архив)
          </button>
          <button type="button" class="btn ${subMode === "grid" ? "btn-primary" : ""}" data-cal-mode="grid">
            🗓 Календарная сетка
          </button>
        </div>
      </div>
    `;

    let bodyHtml = "";
    if (subMode === "months") {
      const grouped = new Map();
      events.forEach(ev => {
        const key = `${ev.year}-${String(ev.month + 1).padStart(2, "0")}`;
        if (!grouped.has(key)) {
          grouped.set(key, {
            label: `${MONTH_NAMES[ev.month]} ${ev.year}`,
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
                Записей: <b>${g.items.length}</b> · Эпизодов/фильмов: <b>${g.totalEps}</b> · Время: <b style="color:#00f5ff;">${formatHours(g.totalHours)} ч.</b>
              </span>
            </div>
            <div class="month-entries-grid">
              ${g.items.map(ev => `
                <div class="month-entry-card" data-ev-uid="${esc(ev.item.uid)}" data-ev-tier="${esc(ev.tier.id)}">
                  <img src="${esc(ev.item.poster)}" alt="">
                  <div style="flex:1;">
                    <div style="font-size:10px;color:#ffd76a;font-weight:700;">
                      ${esc(ev.dateStr)} · Тир ${esc(ev.tier.id)} ·${esc(ev.partType)}
                    </div>
                    <div style="font-size:13px;font-weight:700;color:#fff;">${esc(ev.item.title)}</div>
                    <div style="font-size:11px;color:var(--ink-soft);">
                      ${esc(ev.partTitle)} (${ev.episodes} эп. · ${formatHours(ev.hours)} ч.)
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

      const cells = [];
      for (let i = 0; i < startOffset; i++) cells.push(`<div class="cal-day" style="opacity:0.25;"></div>`);
      for (let d = 1; d <= daysInMonth; d++) {
        const dayEvents = events.filter(e => e.year === curYear && e.month === curMonth && e.day === d);
        cells.push(`
          <div class="cal-day ${dayEvents.length ? "has-events" : ""}">
            <div class="cal-day-num">${d} ${MONTH_NAMES[curMonth].slice(0, 3)}</div>
            ${dayEvents.map(ev => `
              <div class="cal-event-chip" data-ev-uid="${esc(ev.item.uid)}" data-ev-tier="${esc(ev.tier.id)}">
                <img src="${esc(ev.item.poster)}" alt="">
                <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                  <b>${esc(ev.item.title)}</b><br>
                  <span style="color:var(--ink-soft);">${esc(ev.partTitle)} (${formatHours(ev.hours)}ч)</span>
                </div>
              </div>
            `).join("")}
          </div>
        `);
      }

      bodyHtml = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <button type="button" class="btn" id="calPrevBtn">◀ Предыдущий месяц</button>
          <strong style="font-family:var(--serif);font-size:18px;color:#ffd76a;">${MONTH_NAMES[curMonth]} ${curYear}</strong>
          <button type="button" class="btn" id="calNextBtn">Следующий месяц ▶</button>
        </div>
        <div class="cal-grid">
          ${["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(w => `<div class="cal-weekday">${w}</div>`).join("")}
          ${cells.join("")}
        </div>
      `;
    }

    host.innerHTML = toolbarHtml + bodyHtml;

    host.querySelectorAll("[data-cal-mode]").forEach(btn => {
      btn.addEventListener("click", () => {
        subMode = btn.dataset.calMode;
        renderCalendar(tiers, onSelectItem);
      });
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
