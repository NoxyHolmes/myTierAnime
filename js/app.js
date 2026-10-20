/* ═══════════════════ MAIN APPLICATION ORCHESTRATOR (v21.0 BUILT-IN STATS MODAL & CLEAN SYNC BTN) ═══════════════════ */
(() => {
  if (typeof window.pluralRu !== "function") {
    window.pluralRu = function (number, one, few, many) {
      const n = Math.abs(number) % 100;
      const n1 = n % 10;
      if (n > 10 && n < 20) return many;
      if (n1 > 1 && n1 < 5) return few;
      if (n1 === 1) return one;
      return many;
    };
  }
  if (typeof window.formatTitlesCount !== "function") {
    window.formatTitlesCount = n => `${n} ${window.pluralRu(n, "тайтл", "тайтла", "тайтлов")}`;
  }
  if (typeof window.formatEpisodesCount !== "function") {
    window.formatEpisodesCount = n => `${n} ${window.pluralRu(n, "серия", "серии", "серий")}`;
  }
  if (typeof window.formatMoviesCount !== "function") {
    window.formatMoviesCount = n => `${n} ${window.pluralRu(n, "фильм", "фильма", "фильмов")}`;
  }

  const SNAPSHOT_STORAGE_KEY = "mta_2026_instant_snapshot_v14_restored";
  const CUSTOM_GENRES_KEY   = "mta_2026_custom_genres";
  const CUSTOM_STUDIOS_KEY  = "mta_2026_custom_studios";

  let appData = null;
  let searchQuery = "";
  let selectedKind = "ALL";
  let selectedGenre = "ALL";
  let genreFilterSearch = "";
  let selectedStudio = "ALL";
  let studioFilterSearch = "";
  let activeView = "tiers";
  let lastRenderedSignature = "";

  let pendingPosterBlobSha = "";
  let pendingPosterInline = "";
  let pendingBgmBlobSha = "";
  let pendingBgmUrl = "";
  let isUploadingAsset = false;

  const EMPTY_TIERS_SKELETON = [
    { id: "S", rank: 1, name: "Шедевры", subtitle: "Лучшие и незабываемые тайтлы на все времена", hue: 45, items: [] },
    { id: "A", rank: 2, name: "Отличные", subtitle: "Яркие и очень качественные работы", hue: 185, items: [] },
    { id: "B", rank: 3, name: "Хорошие", subtitle: "Достойные внимания и атмосферные тайтлы", hue: 275, items: [] },
    { id: "C", rank: 4, name: "Нормальные", subtitle: "Средние тайтлы на один вечер", hue: 148, items: [] },
    { id: "D", rank: 5, name: "Слабые", subtitle: "Проходные или скучные проекты", hue: 28, items: [] },
    { id: "E", rank: 6, name: "Плохие", subtitle: "Разочарования и брошенные тайтлы", hue: 215, items: [] }
  ];

  const CLEAN_TITLES_MAP = {
    S: { name: "Шедевры", subtitle: "Лучшие и незабываемые тайтлы на все времена" },
    A: { name: "Отличные", subtitle: "Яркие и очень качественные работы" },
    B: { name: "Хорошие", subtitle: "Достойные внимания и атмосферные тайтлы" },
    C: { name: "Нормальные", subtitle: "Средние тайтлы на один вечер" },
    D: { name: "Слабые", subtitle: "Проходные или скучные проекты" },
    E: { name: "Плохие", subtitle: "Разочарования и брошенные тайтлы" }
  };

  function extractItemStudios(item) {
    if (!item) return [];
    const rawList = Array.isArray(item.studios) && item.studios.length
      ? item.studios
      : String(item.studio || "").replace(/ {3,}/g, ", ").split(",");
    return rawList.map(s => String(s).trim()).filter(Boolean);
  }

  /* АВТОМАТИЧЕСКАЯ СОРТИРОВКА ТАЙТЛОВ В КАЖДОМ ТИРЕ ПО ВРЕМЕНИ (ОТ БОЛЬШЕГО К МЕНЬШЕМУ, СЛЕВА НАПРАВО) */
  function sortAllTiersByTimeDesc(dataObj) {
    if (!dataObj || !Array.isArray(dataObj.tiers)) return;
    dataObj.tiers.forEach(tier => {
      if (Array.isArray(tier.items) && tier.items.length > 1) {
        tier.items.sort((a, b) => {
          const ma = calcItemMetrics(a);
          const mb = calcItemMetrics(b);
          if (mb.totalMinutes !== ma.totalMinutes) {
            return mb.totalMinutes - ma.totalMinutes;
          }
          if (mb.totalEpisodes !== ma.totalEpisodes) {
            return mb.totalEpisodes - ma.totalEpisodes;
          }
          return String(a.title || "").localeCompare(String(b.title || ""), "ru");
        });
      }
    });
  }

  /* ──────── ГАРАНТИРОВАННЫЙ ВСТРОЕННЫЙ ДВИЖОК СТАТИСТИКИ И МОДАЛЬНОГО ОКНА «📊 Статистика» ──────── */
  function ensureStatsModalExists() {
    if (!document.getElementById("mtaDetailedStatsStyles")) {
      const st = document.createElement("style");
      st.id = "mtaDetailedStatsStyles";
      st.textContent = `
        .st-hero-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 22px; }
        .st-kpi-box { background: linear-gradient(135deg, rgba(28, 22, 58, 0.9), rgba(16, 13, 34, 0.95)); border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }
        .st-kpi-lbl { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.07em; color: #a6a0c4; font-weight: 700; }
        .st-kpi-val { font-family: var(--serif, 'Cinzel', serif); font-size: 23px; font-weight: 900; color: #ffffff; }
        .st-kpi-sub { font-size: 11.5px; color: #9e97bf; }
        .st-section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }
        .st-panel { background: rgba(16, 13, 34, 0.85); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 16px 18px; }
        .st-panel-full { grid-column: 1 / -1; }
        .st-panel-title { margin: 0 0 12px; font-family: var(--serif, 'Cinzel', serif); font-size: 15px; font-weight: 800; color: #ffe8a3; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-bottom: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.09); }
        .st-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
        .st-table th { text-align: left; padding: 8px 10px; color: #9e97bf; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .st-table td { padding: 9px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); color: #f5f3ff; }
        .st-bar-list { display: flex; flex-direction: column; gap: 9px; }
        .st-bar-item { display: flex; flex-direction: column; gap: 4px; }
        .st-bar-head { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; font-weight: 700; }
        .st-bar-track { width: 100%; height: 7px; border-radius: 999px; background: rgba(255, 255, 255, 0.07); overflow: hidden; }
        .st-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #ffd76a, #ff5e7e, #00f5ff); }
        .st-top-longest-row { display: grid; grid-template-columns: 28px 36px minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 10px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.07); cursor: pointer; transition: border-color 0.15s, background 0.15s; }
        .st-top-longest-row:hover { border-color: #ffd76a; background: rgba(255, 215, 106, 0.08); }
        .st-top-longest-row img { width: 36px; height: 50px; object-fit: cover; border-radius: 5px; }
        @media (max-width: 960px) { .st-section-grid { grid-template-columns: 1fr; } }
      `;
      document.head.appendChild(st);
    }

    // Если в HTML по какой-то причине ещё нет #statsModal, создаём его динамически
    let modal = document.getElementById("statsModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "statsModal";
      modal.className = "modal-backdrop";
      modal.innerHTML = `
        <div class="modal-box modal-box-wide dossier-cinema-box" style="max-width:1320px;">
          <div class="dossier-sticky-topbar">
            <div class="dossier-badges-row" style="margin:0;">
              <span class="dossier-badge-pill gold">📊 Полная аналитика коллекции</span>
              <span class="dossier-badge-pill">myTierAnime</span>
            </div>
            <div class="dossier-top-btns">
              <button type="button" class="btn btn-sm" id="btnCloseStatsModalDynamic">✕ Закрыть</button>
            </div>
          </div>
          <div id="statsModalBody" class="dossier-scroll-content" style="padding:22px 26px;"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector("#btnCloseStatsModalDynamic")?.addEventListener("click", () => {
        Modals.closeModal("statsModal");
      });
    }

    // Если в шапке нет кнопки #btnOpenStatsModal (если закеширован старый index.html), автоматически вставляем её рядом с Календарём
    if (!document.getElementById("btnOpenStatsModal")) {
      const calBtn = document.getElementById("btnToggleCalendar");
      if (calBtn && calBtn.parentNode) {
        const stBtn = document.createElement("button");
        stBtn.type = "button";
        stBtn.id = "btnOpenStatsModal";
        stBtn.className = "btn btn-neon-gold";
        stBtn.title = "Подробная аналитика и статистика коллекции";
        stBtn.innerHTML = "📊 Статистика";
        calBtn.parentNode.insertBefore(stBtn, calBtn.nextSibling);
      }
    }

    // Также принудительно обновляем внешний вид кнопки синхронизации (если index.html закеширован)
    const syncBtn = document.getElementById("btnSyncNowOwner");
    if (syncBtn) {
      syncBtn.classList.remove("btn-primary");
      syncBtn.classList.add("btn-neon-cyan");
      if (syncBtn.textContent.includes("Синхронизировать со всеми")) {
        syncBtn.textContent = "🔄 Синхронизировать";
      }
    }
  }

  function renderTopStatsRibbon(tiers) {
    const host = document.getElementById("statsRibbon");
    if (!host || !Array.isArray(tiers)) return;

    let totalTitles = 0;
    let sumEpisodes = 0;
    let sumMovies = 0;
    let sumHours = 0;
    let totalSeasonsParts = 0;

    tiers.forEach(t => {
      const items = t.items || [];
      totalTitles += items.length;
      items.forEach(it => {
        const m = calcItemMetrics(it);
        sumEpisodes += m.totalEpisodes;
        sumMovies += m.totalMovies;
        sumHours += m.totalHours;
        totalSeasonsParts += (m.seasons || []).length;
      });
    });

    const totalDays = (sumHours / 24).toFixed(1);
    const titlesStr = window.formatTitlesCount(totalTitles);
    const epStr = window.formatEpisodesCount(sumEpisodes);
    const mvStr = window.formatMoviesCount(sumMovies);

    host.innerHTML = `
      <div class="stat-card">
        <div>
          <div class="stat-label">Всего просмотрено</div>
          <div class="stat-val">${totalTitles} <span style="font-size:13px;color:var(--ink-soft);">${titlesStr.replace(/^\d+\s*/, "")}</span></div>
          <div class="stat-sub">Всего частей и сезонов: <b style="color:#ffd76a;">${totalSeasonsParts}</b></div>
        </div>
        <span style="font-size:26px;">📚</span>
      </div>
      <div class="stat-card" style="padding:10px 12px;">
        <div class="stat-dual-split">
          <div class="stat-split-box">
            <div class="stat-label">🎞 Серии</div>
            <div class="stat-val" style="color:#ffd76a;font-size:20px;">${sumEpisodes}</div>
            <div style="font-size:9.5px;color:var(--ink-soft);">${epStr.replace(/^\d+\s*/, "")}</div>
          </div>
          <div class="stat-split-box movies-highlight">
            <div class="stat-label" style="color:#ffd6e7;font-weight:800;">🎬 Фильмы</div>
            <div class="stat-val" style="color:#ff5e7e;font-size:20px;text-shadow:0 0 12px rgba(255,94,126,0.55);">${sumMovies}</div>
            <div style="font-size:9.5px;color:#ffaec6;font-weight:700;">${mvStr.replace(/^\d+\s*/, "")}</div>
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div>
          <div class="stat-label">Всего времени</div>
          <div class="stat-val" style="color:#00f5ff;">${formatHours(sumHours)} <span style="font-size:13px;color:var(--ink-soft);">часов</span></div>
          <div class="stat-sub">⏳ Общее количество дней: <b style="color:#fff;">${totalDays} дн.</b></div>
        </div>
        <span style="font-size:26px;">⏱️</span>
      </div>
    `;
  }

  function openDetailedStatsModalInternal() {
    ensureStatsModalExists();
    const tiers = appData?.tiers || [];
    const body = document.getElementById("statsModalBody");
    if (!body) return;

    let totalTitles = 0;
    let totalWatchedParts = 0;
    let totalUpcomingParts = 0;
    let totalEpisodes = 0;
    let totalMovies = 0;
    let totalMinutes = 0;
    let totalHours = 0;
    let titlesWithOst = 0;

    const formatBreakdown = {
      "TV Сериал": { parts: 0, eps: 0, hours: 0 },
      "Фильм":     { parts: 0, eps: 0, hours: 0 },
      "OVA":       { parts: 0, eps: 0, hours: 0 },
      "ONA":       { parts: 0, eps: 0, hours: 0 },
      "Спешл":     { parts: 0, eps: 0, hours: 0 }
    };

    const genreMap = new Map();
    const studioMap = new Map();
    const watchYearMap = new Map();
    const allItemsWithMetrics = [];
    const tierStatsRows = [];

    tiers.forEach(tier => {
      const items = tier.items || [];
      let tEps = 0, tMovies = 0, tHours = 0, tParts = 0;

      items.forEach(item => {
        totalTitles++;
        if (item.bgmUrl || item.bgmBlobSha) titlesWithOst++;

        const m = calcItemMetrics(item);
        totalEpisodes += m.totalEpisodes;
        totalMovies += m.totalMovies;
        totalMinutes += m.totalMinutes;
        totalHours += m.totalHours;

        tEps += m.totalEpisodes;
        tMovies += m.totalMovies;
        tHours += m.totalHours;
        tParts += (m.seasons || []).length;

        allItemsWithMetrics.push({ item, tier, m });

        (m.seasons || []).forEach(s => {
          const ep = parseInt(s.episodes, 10) || 0;
          const mn = parseFloat(s.epMinutes) || 24;
          const tp = s.type || "TV Сериал";

          if (ep === 0) {
            totalUpcomingParts++;
          } else {
            totalWatchedParts++;
            const ph = (ep * mn) / 60;
            if (!formatBreakdown[tp]) formatBreakdown[tp] = { parts: 0, eps: 0, hours: 0 };
            formatBreakdown[tp].parts++;
            formatBreakdown[tp].eps += ep;
            formatBreakdown[tp].hours += ph;

            const pd = typeof parseFlexibleRuDate === "function" ? parseFlexibleRuDate(s.date) : null;
            if (pd && pd.year) {
              const prevY = watchYearMap.get(pd.year) || { parts: 0, eps: 0, hours: 0 };
              prevY.parts++;
              prevY.eps += ep;
              prevY.hours += ph;
              watchYearMap.set(pd.year, prevY);
            }
          }
        });

        (item.genres || []).forEach(g => {
          const clean = String(g).trim();
          if (!clean) return;
          const cur = genreMap.get(clean) || { name: clean, count: 0, hours: 0, episodes: 0 };
          cur.count++;
          cur.hours += m.totalHours;
          cur.episodes += m.totalEpisodes + m.totalMovies;
          genreMap.set(clean, cur);
        });

        extractItemStudios(item).forEach(st => {
          const cur = studioMap.get(st) || { name: st, count: 0, hours: 0, episodes: 0 };
          cur.count++;
          cur.hours += m.totalHours;
          cur.episodes += m.totalEpisodes + m.totalMovies;
          studioMap.set(st, cur);
        });
      });

      tierStatsRows.push({
        id: tier.id,
        name: tier.name,
        titlesCount: items.length,
        partsCount: tParts,
        episodes: tEps,
        movies: tMovies,
        hours: tHours,
        days: tHours / 24
      });
    });

    const totalDays = totalHours / 24;
    const totalWeeks = totalDays / 7;
    const avgHoursPerTitle = totalTitles > 0 ? (totalHours / totalTitles) : 0;
    const avgEpsPerTitle = totalTitles > 0 ? Math.round((totalEpisodes + totalMovies) / totalTitles) : 0;

    allItemsWithMetrics.sort((a, b) => b.m.totalMinutes - a.m.totalMinutes);
    const top10Longest = allItemsWithMetrics.slice(0, 10);

    const topGenres = [...genreMap.values()].sort((a, b) => b.count - a.count || b.hours - a.hours).slice(0, 15);
    const maxGenreCount = topGenres[0]?.count || 1;

    const topStudios = [...studioMap.values()].sort((a, b) => b.count - a.count || b.hours - a.hours).slice(0, 12);
    const maxStudioCount = topStudios[0]?.count || 1;

    const sortedWatchYears = [...watchYearMap.entries()].sort((a, b) => b[0] - a[0]);
    const maxYearHours = Math.max(1, ...sortedWatchYears.map(([, v]) => v.hours));

    body.innerHTML = `
      <div class="st-hero-grid">
        <div class="st-kpi-box">
          <span class="st-kpi-lbl">📚 Всего тайтлов</span>
          <span class="st-kpi-val" style="color:#ffd76a;">${totalTitles}</span>
          <span class="st-kpi-sub">Просмотрено частей: <b>${totalWatchedParts}</b>${totalUpcomingParts ? ` · Анонсов: <b>${totalUpcomingParts}</b>` : ""}</span>
        </div>
        <div class="st-kpi-box">
          <span class="st-kpi-lbl">⏱ Суммарно часов</span>
          <span class="st-kpi-val" style="color:#00f5ff;">${formatHours(totalHours)} ч.</span>
          <span class="st-kpi-sub">${Math.round(totalMinutes).toLocaleString("ru-RU")} минут экранного времени</span>
        </div>
        <div class="st-kpi-box">
          <span class="st-kpi-lbl">⏳ Непрерывное время</span>
          <span class="st-kpi-val" style="color:#ff5e7e;">${totalDays.toFixed(2)} дн.</span>
          <span class="st-kpi-sub">${totalWeeks.toFixed(2)} недель без перерыва</span>
        </div>
        <div class="st-kpi-box">
          <span class="st-kpi-lbl">🎞 Серии и Фильмы</span>
          <span class="st-kpi-val">${totalEpisodes} <span style="font-size:14px;color:#a6a0c4;">эп.</span> + ${totalMovies} <span style="font-size:14px;color:#ff5e7e;">ф.</span></span>
          <span class="st-kpi-sub">В среднем ${avgEpsPerTitle} эп. (${formatHours(avgHoursPerTitle)} ч.) на 1 тайтл</span>
        </div>
        <div class="st-kpi-box">
          <span class="st-kpi-lbl">🎭 Охват индустрии</span>
          <span class="st-kpi-val" style="color:#b57cff;">${genreMap.size} <span style="font-size:14px;color:#a6a0c4;">жанров</span></span>
          <span class="st-kpi-sub">Студий в коллекции: <b>${studioMap.size}</b> · С музыкой OST: <b>${titlesWithOst}</b></span>
        </div>
      </div>

      <div class="st-section-grid">
        <div class="st-panel st-panel-full">
          <h4 class="st-panel-title">
            <span>🏛 Распределение по тирам (S – E)</span>
            <span style="font-size:11.5px;color:#9e97bf;font-family:var(--sans);">Полная сводка по каждому рангу</span>
          </h4>
          <div style="overflow-x:auto;">
            <table class="st-table">
              <thead>
                <tr>
                  <th>Тир</th>
                  <th>Тайтлов</th>
                  <th>Доля</th>
                  <th>Частей / Сезонов</th>
                  <th>Серий</th>
                  <th>Фильмов</th>
                  <th>Затрачено часов</th>
                  <th>Затрачено дней</th>
                </tr>
              </thead>
              <tbody>
                ${tierStatsRows.map(r => {
                  const pct = totalTitles > 0 ? Math.round((r.titlesCount / totalTitles) * 100) : 0;
                  const hrsPct = totalHours > 0 ? Math.round((r.hours / totalHours) * 100) : 0;
                  return `
                    <tr>
                      <td><b style="color:#ffd76a;">ТИР ${esc(r.id)}</b> ·${esc(r.name)}</td>
                      <td><b>${r.titlesCount}</b></td>
                      <td><span style="color:#00f5ff;font-weight:700;">${pct}%</span></td>
                      <td>${r.partsCount}</td>
                      <td><b style="color:#ffe8a3;">${r.episodes}</b></td>
                      <td><b style="color:#ff5e7e;">${r.movies}</b></td>
                      <td><b style="color:#00f5ff;">${formatHours(r.hours)} ч.</b> <span style="font-size:11px;color:#9e97bf;">(${hrsPct}%)</span></td>
                      <td><b>${r.days.toFixed(2)} дн.</b></td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="st-panel">
          <h4 class="st-panel-title"><span>📺 Статистика по форматам (TV, Фильмы, OVA, ONA, Спешлы)</span></h4>
          <table class="st-table">
            <thead>
              <tr>
                <th>Формат</th>
                <th>Частей</th>
                <th>Эпизодов / Фильмов</th>
                <th>Время (часы / дни)</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(formatBreakdown).map(([fmt, obj]) => `
                <tr>
                  <td><b>${esc(fmt)}</b></td>
                  <td>${obj.parts}</td>
                  <td><b style="color:#ffd76a;">${obj.eps}</b></td>
                  <td><b style="color:#00f5ff;">${formatHours(obj.hours)} ч.</b> (${(obj.hours / 24).toFixed(2)} дн.)</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="st-panel">
          <h4 class="st-panel-title"><span>📅 Активность просмотров по годам</span></h4>
          <div class="st-bar-list">
            ${sortedWatchYears.length ? sortedWatchYears.map(([yr, data]) => {
              const wPct = Math.round((data.hours / maxYearHours) * 100);
              return `
                <div class="st-bar-item">
                  <div class="st-bar-head">
                    <span style="color:#ffd76a;">${yr} год</span>
                    <span style="color:#cbc4eb;">Частей: <b>${data.parts}</b> · Эп.: <b>${data.eps}</b> · <b style="color:#00f5ff;">${formatHours(data.hours)} ч.</b> (${(data.hours / 24).toFixed(1)} дн.)</span>
                  </div>
                  <div class="st-bar-track"><div class="st-bar-fill" style="width:${wPct}%;"></div></div>
                </div>
              `;
            }).join("") : `<div style="color:var(--ink-soft);font-size:12px;">Нет данных по годам просмотра.</div>`}
          </div>
        </div>

        <div class="st-panel st-panel-full">
          <h4 class="st-panel-title">
            <span>🏆 Топ-10 самых масштабных тайтлов по затраченному времени</span>
            <span style="font-size:11px;color:#9e97bf;font-family:var(--sans);">Нажмите на тайтл, чтобы открыть его карточку</span>
          </h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:8px;">
            ${top10Longest.map((entry, idx) => {
              const it = entry.item;
              const m = entry.m;
              const src = it.posterInline || it.poster || "https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime";
              return `
                <div class="st-top-longest-row" data-st-uid="${esc(it.uid)}" data-st-tier="${esc(entry.tier.id)}">
                  <span style="font-weight:900;color:#ffd76a;font-size:12px;">#${idx + 1}</span>
                  <img class="card-poster" src="${esc(src)}" data-raw-path="${esc(it.poster \vert{}\vert{} "")}" data-blob-sha="${esc(it.posterBlobSha || "")}" alt="">
                  <div style="min-width:0;">
                    <div style="font-size:13px;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(it.title)}</div>
                    <div style="font-size:11px;color:#a6a0c4;">
                      Тир ${esc(entry.tier.id)} · ${formatEpisodesCount(m.totalEpisodes)}${m.totalMovies ? ` + ${formatMoviesCount(m.totalMovies)}` : ""}
                    </div>
                  </div>
                  <div style="text-align:right;white-space:nowrap;">
                    <div style="font-size:13px;font-weight:900;color:#00f5ff;">${formatHours(m.totalHours)} ч.</div>
                    <div style="font-size:10.5px;color:#9e97bf;">${m.totalDays.toFixed(2)} дн.</div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <div class="st-panel">
          <h4 class="st-panel-title"><span>🎭 Топ-15 жанров коллекции</span></h4>
          <div class="st-bar-list">
            ${topGenres.length ? topGenres.map(g => {
              const pct = Math.round((g.count / maxGenreCount) * 100);
              return `
                <div class="st-bar-item">
                  <div class="st-bar-head">
                    <span>${esc(g.name)}</span>
                    <span style="color:#ffd76a;">${formatTitlesCount(g.count)} · <b style="color:#00f5ff;">${formatHours(g.hours)} ч.</b></span>
                  </div>
                  <div class="st-bar-track"><div class="st-bar-fill" style="width:${pct}%;"></div></div>
                </div>
              `;
            }).join("") : `<div style="color:var(--ink-soft);font-size:12px;">Жанры ещё не указаны.</div>`}
          </div>
        </div>

        <div class="st-panel">
          <h4 class="st-panel-title"><span>🎬 Топ-12 студий анимации</span></h4>
          <div class="st-bar-list">
            ${topStudios.length ? topStudios.map(st => {
              const pct = Math.round((st.count / maxStudioCount) * 100);
              return `
                <div class="st-bar-item">
                  <div class="st-bar-head">
                    <span>${esc(st.name)}</span>
                    <span style="color:#ffd76a;">${formatTitlesCount(st.count)} · <b style="color:#00f5ff;">${formatHours(st.hours)} ч.</b></span>
                  </div>
                  <div class="st-bar-track"><div class="st-bar-fill" style="width:${pct}%;"></div></div>
                </div>
              `;
            }).join("") : `<div style="color:var(--ink-soft);font-size:12px;">Студии ещё не указаны.</div>`}
          </div>
        </div>
      </div>
    `;

    if (typeof GitHubSync !== "undefined" && typeof GitHubSync.resolveAssetUrl === "function") {
      body.querySelectorAll("img.card-poster").forEach(async img => {
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

    body.querySelectorAll("[data-st-uid]").forEach(row => {
      row.onclick = () => {
        Modals.closeModal("statsModal");
        const tier = appData?.tiers?.find(t => t.id === row.dataset.stTier);
        const item = tier?.items?.find(i => i.uid === row.dataset.stUid);
        if (item && tier && typeof Modals !== "undefined") {
          Modals.showAnimeDetails(item, tier);
        }
      };
    });

    Modals.openModal("statsModal");
  }

  function registerCustomGenresAndStudios(genresArr = [], studiosArr = []) {
    let savedGenres = [];
    let savedStudios = [];
    try { savedGenres = JSON.parse(localStorage.getItem(CUSTOM_GENRES_KEY) || "[]"); } catch {}
    try { savedStudios = JSON.parse(localStorage.getItem(CUSTOM_STUDIOS_KEY) || "[]"); } catch {}

    const gSet = new Set([
      ...(window.ALL_ANIME_GENRES || []),
      ...savedGenres,
      ...(appData?.meta?.customGenres || [])
    ]);
    const stSet = new Set([
      ...(window.ALL_ANIME_STUDIOS || []),
      ...savedStudios,
      ...(appData?.meta?.customStudios || [])
    ]);

    const gLowerMap = new Map([...gSet].map(x => [x.toLowerCase(), x]));
    const stLowerMap = new Map([...stSet].map(x => [x.toLowerCase(), x]));

    genresArr.forEach(g => {
      const clean = String(g).trim();
      if (clean && !gLowerMap.has(clean.toLowerCase())) {
        gSet.add(clean);
        savedGenres.push(clean);
        gLowerMap.set(clean.toLowerCase(), clean);
      }
    });

    studiosArr.forEach(st => {
      const clean = String(st).trim();
      if (clean && !stLowerMap.has(clean.toLowerCase())) {
        stSet.add(clean);
        savedStudios.push(clean);
        stLowerMap.set(clean.toLowerCase(), clean);
      }
    });

    window.ALL_ANIME_GENRES = [...gSet];
    window.ALL_ANIME_STUDIOS = [...stSet];

    try { localStorage.setItem(CUSTOM_GENRES_KEY, JSON.stringify([...new Set(savedGenres)])); } catch {}
    try { localStorage.setItem(CUSTOM_STUDIOS_KEY, JSON.stringify([...new Set(savedStudios)])); } catch {}

    if (appData && appData.meta) {
      appData.meta.customGenres = [...new Set([...(appData.meta.customGenres || []), ...savedGenres])];
      appData.meta.customStudios = [...new Set([...(appData.meta.customStudios || []), ...savedStudios])];
    }
  }

  function ensureSixTiers(data) {
    if (!data || !Array.isArray(data.tiers) || data.tiers.length === 0) {
      return {
        meta: { title: "myTierAnime", bgImage: "", bgBlobSha: "", bgInline: "", bgDim: 55, bgBlur: 0, bgmVolume: 30, revision: 1, customGenres: [], customStudios: [] },
        tiers: JSON.parse(JSON.stringify(EMPTY_TIERS_SKELETON))
      };
    }
    data.meta = data.meta || {};
    data.meta.revision = Number(data.meta.revision || 1);
    if (data.meta.bgmVolume !== undefined) {
      localStorage.setItem("mta_bgm_volume", String(Number(data.meta.bgmVolume) / 100));
    }
    EMPTY_TIERS_SKELETON.forEach(def => {
      if (!data.tiers.find(t => t.id === def.id)) {
        data.tiers.push(JSON.parse(JSON.stringify(def)));
      }
    });
    data.tiers.forEach(t => {
      if (CLEAN_TITLES_MAP[t.id]) {
        t.name = CLEAN_TITLES_MAP[t.id].name;
        t.subtitle = CLEAN_TITLES_MAP[t.id].subtitle;
      }
    });
    sortAllTiersByTimeDesc(data);
    return data;
  }

  function computeStateSignature(data) {
    if (!data || !Array.isArray(data.tiers)) return "";
    return `${data.meta?.revision || 0}_${JSON.stringify(data.tiers).length}_${data.meta?.bgBlobSha || ""}_${data.meta?.bgmVolume ?? 30}`;
  }

  function readCachedSnapshot() {
    const raw = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.tiers)) return ensureSixTiers(parsed);
      } catch {}
    }
    return null;
  }

  function writeCachedSnapshot(data) {
    if (!data) return;
    try {
      localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(data));
    } catch {
      try {
        const slimCopy = {
          meta: { ...data.meta, bgInline: "" },
          tiers: (data.tiers || []).map(t => ({
            ...t,
            items: (t.items || []).map(it => ({ ...it, posterInline: undefined }))
          }))
        };
        localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(slimCopy));
      } catch {}
    }
  }

  async function loadInitialState() {
    const cached = readCachedSnapshot();
    if (cached) {
      appData = cached;
      lastRenderedSignature = computeStateSignature(appData);
      render();
    }

    try {
      let remoteRaw = null;
      if (typeof GitHubSync !== "undefined" && typeof GitHubSync.fetchFreshTiersFromApi === "function") {
        remoteRaw = await GitHubSync.fetchFreshTiersFromApi(true);
      } else {
        const res = await fetch(`data/tiers.json?nocache=${Date.now()}`, { cache: "no-store" });
        if (res.ok) remoteRaw = await res.json();
      }

      if (remoteRaw) {
        const remoteObj = ensureSixTiers(remoteRaw);
        const localRev = Number(cached?.meta?.revision || 0);
        const remoteRev = Number(remoteObj?.meta?.revision || 0);
        const hasOwnerToken = typeof GitHubSync !== "undefined" && !!GitHubSync.getToken();

        if (!cached || !hasOwnerToken || remoteRev >= localRev) {
          appData = remoteObj;
          writeCachedSnapshot(appData);
        }
      }
    } catch (e) {
      console.warn("Remote load fallback:", e);
    }

    if (!appData) appData = ensureSixTiers(null);
    lastRenderedSignature = computeStateSignature(appData);
    render();
    if (typeof FXController !== "undefined" && typeof FXController.applyGlobalBackground === "function") {
      FXController.applyGlobalBackground(appData.meta || {});
    }
  }

  function startLiveViewerPolling() {
    setInterval(async () => {
      if (document.hidden || (typeof GitHubSync !== "undefined" && GitHubSync.isOwner())) return;
      try {
        if (typeof GitHubSync === "undefined" || typeof GitHubSync.fetchFreshTiersFromApi !== "function") return;
        const remoteRaw = await GitHubSync.fetchFreshTiersFromApi(false);
        if (!remoteRaw) return;
        const remoteObj = ensureSixTiers(remoteRaw);
        const newSig = computeStateSignature(remoteObj);
        if (newSig && newSig !== lastRenderedSignature) {
          appData = remoteObj;
          lastRenderedSignature = newSig;
          writeCachedSnapshot(appData);
          render();
          showToast("✨ Список обновлён!", "#00f5ff");
        }
      } catch {}
    }, 6000);
  }

  function setSyncIndicator(text, col = "#38ef7d") {
    const badge = document.getElementById("syncStatusBadge");
    if (!badge) return;
    badge.textContent = text;
    badge.style.color = col;
    badge.style.borderColor = col;
  }

  let isSyncing = false;
  let pendingSync = false;

  async function saveAndAutoSync(reason = "Sync via myTierAnime", showSuccessToast = false) {
    if (!appData) return;
    sortAllTiersByTimeDesc(appData);
    appData.meta = appData.meta || {};
    appData.meta.revision = Number(appData.meta.revision || 1) + 1;
    appData.meta.updatedAt = new Date().toISOString();
    lastRenderedSignature = computeStateSignature(appData);

    writeCachedSnapshot(appData);
    renderTopStatsRibbon(appData.tiers);

    if (typeof GitHubSync === "undefined" || !GitHubSync.isOwner()) return;

    if (isSyncing) {
      pendingSync = true;
      return;
    }

    isSyncing = true;
    setSyncIndicator("⏳ Синхронизация...", "#00f5ff");
    const syncBtn = document.getElementById("btnSyncNowOwner");
    if (syncBtn) syncBtn.textContent = "⏳ Синхронизация...";

    try {
      await GitHubSync.commitTiersToGitHub(appData, reason);
      setSyncIndicator(`☁ Синхронизировано`, "#38ef7d");
      if (syncBtn) syncBtn.textContent = "🔄 Синхронизировать";
      if (showSuccessToast) showToast("✔ Все изменения и музыка успешно сохранены!", "#38ef7d");
    } catch (err) {
      setSyncIndicator("⚠ Ошибка синхронизации", "#ff5e7e");
      if (syncBtn) syncBtn.textContent = "🔄 Повторить";
      showToast("Ошибка отправки в GitHub: " + err.message, "#ff3c8c");
    } finally {
      isSyncing = false;
      if (pendingSync) {
        pendingSync = false;
        saveAndAutoSync("Queued sync", false);
      }
    }
  }

  function renderRecentShowcase() {
    const recentHost = document.getElementById("recentSection");
    if (!recentHost || !appData || !Array.isArray(appData.tiers)) return;

    const allEntries = [];
    appData.tiers.forEach(tier => {
      (tier.items || []).forEach(item => {
        const m = calcItemMetrics(item);

        let latestWatchedMs = 0;
        let latestWatchStr = "";

        (m.seasons || []).forEach(s => {
          const eps = parseInt(s.episodes, 10) || 0;
          if (eps <= 0) return;

          const parsed = typeof parseFlexibleRuDate === "function" ? parseFlexibleRuDate(s.date) : null;
          if (!parsed) return;

          let watchMs = 0;
          if (parsed.precision === "day") {
            watchMs = new Date(parsed.year, parsed.month, parsed.day, 12, 0, 0).getTime();
          } else if (parsed.precision === "month") {
            watchMs = new Date(parsed.year, parsed.month, 1, 0, 0, 0).getTime();
          } else if (parsed.precision === "year") {
            watchMs = new Date(parsed.year, 0, 1, 0, 0, 0).getTime();
          }

          if (watchMs >= latestWatchedMs) {
            latestWatchedMs = watchMs;
            latestWatchStr = parsed.raw || s.date || "";
          }
        });

        const uidTimeMatch = String(item.uid || "").match(/anime-(\d{10,})/);
        const createdMs = uidTimeMatch ? Number(uidTimeMatch[1]) : 0;
        const actionTieBreaker = Math.max(Number(item.updatedAt || 0), createdMs);

        allEntries.push({
          item,
          tier,
          m,
          latestWatchedMs,
          actionTieBreaker,
          latestWatchStr: latestWatchStr || (item.year ? `${item.year} г.` : "Недавно")
        });
      });
    });

    if (allEntries.length === 0) {
      recentHost.innerHTML = "";
      recentHost.style.display = "none";
      return;
    }

    recentHost.style.display = activeView === "calendar" ? "none" : "block";

    allEntries.sort((a, b) => {
      if (b.latestWatchedMs !== a.latestWatchedMs) {
        return b.latestWatchedMs - a.latestWatchedMs;
      }
      return b.actionTieBreaker - a.actionTieBreaker;
    });

    const recentTop = allEntries.slice(0, 10);

    recentHost.innerHTML = `
      <div class="recent-showcase-box">
        <div class="recent-showcase-head">
          <h2 class="recent-showcase-title">
            <span>✨ Недавно добавленные и обновлённые тайтлы</span>
          </h2>
        </div>

        <div class="recent-showcase-grid">
          ${recentTop.map(entry => {
            const it = entry.item;
            const tr = entry.tier;
            const displayPoster = it.posterInline || it.poster || "https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime";
            const hasMusic = !!(it.bgmUrl || it.bgmBlobSha);
            const musicBadge = hasMusic
              ? `<span title="В карточке играет фоновая музыка" style="position:absolute;top:6px;right:6px;z-index:4;padding:1.5px 5px;border-radius:5px;font-size:8.5px;background:rgba(14,11,28,0.88);border:1px solid rgba(0,245,255,0.45);color:#00f5ff;pointer-events:none;">🎵 OST</span>`
              : "";

            return `
              <div class="recent-item-card" data-recent-uid="${esc(it.uid)}" data-recent-tier="${esc(tr.id)}">
                <div class="recent-poster-frame">
                  <img class="recent-poster-img card-poster" draggable="false" src="${esc(displayPoster)}" data-raw-path="${esc(it.poster || "")}" data-blob-sha="${esc(it.posterBlobSha \vert{}\vert{} "")}" alt="${esc(it.title)}" loading="lazy"
                       onerror="this.src='https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime'">
                  <div class="scrim" style="position:absolute;inset:0;background:linear-gradient(to top,rgba(6,5,14,0.95) 0%,rgba(6,5,14,0.45) 42%,transparent 75%);pointer-events:none;"></div>
                  <span class="recent-tier-badge">Тир ${esc(tr.id)}</span>${musicBadge}

                  <div class="card-info">
                    <h3 class="card-title">${esc(it.title)}</h3>
                    <div class="card-sub">${esc(entry.m.kind)} ·${esc(entry.latestWatchStr)}</div>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    recentHost.querySelectorAll("[data-recent-uid]").forEach(card => {
      card.onclick = () => {
        const uid = card.dataset.recentUid;
        const tierId = card.dataset.recentTier;
        const tier = appData.tiers.find(t => t.id === tierId);
        const item = tier?.items.find(i => i.uid === uid);
        if (item && tier && typeof Modals !== "undefined") {
          Modals.showAnimeDetails(item, tier);
        }
      };
    });
  }

  function cardEl(item, idx, tierId) {
    const m = calcItemMetrics(item);
    const yr = m.latestYear || item.year || "";
    const yearBadgeHtml = yr ? `<span class="card-year-3d" aria-hidden="true">${yr}</span>` : "";
    const countLabel = m.totalMovies > 0 && m.totalEpisodes === 0
      ? window.formatMoviesCount(m.totalMovies)
      : `${window.formatEpisodesCount(m.totalEpisodes)}${m.totalMovies ? ` + ${window.formatMoviesCount(m.totalMovies)}` : ""}`;
    const displayPosterSrc = item.posterInline || item.poster || "https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime";

    const hasMusic = !!(item.bgmUrl || item.bgmBlobSha);
    const musicCornerBadge = hasMusic
      ? `<span title="В карточке играет фоновая музыка" style="position:absolute;top:6px;right:6px;z-index:4;padding:1.5px 5px;border-radius:5px;font-size:8.5px;background:rgba(14,11,28,0.88);border:1px solid rgba(0,245,255,0.45);color:#00f5ff;pointer-events:none;">🎵 OST</span>`
      : "";

    const studiosList = extractItemStudios(item);
    const studiosDisplay = studiosList.join(", ");

    return `
      <div class="card-unit" draggable="true" data-uid="${esc(item.uid)}" data-tier-id="${esc(tierId)}">
        <article class="card" data-uid="${esc(item.uid)}" data-tier-id="${esc(tierId)}">
          <img class="card-poster" draggable="false" src="${esc(displayPosterSrc)}" data-raw-path="${esc(item.poster || "")}" data-blob-sha="${esc(item.posterBlobSha || "")}" alt="${esc(item.title)}" loading="lazy"
               onerror="this.src='https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime'">
          <div class="scrim"></div>
          <span class="holo-foil" aria-hidden="true"></span>
          ${tierId === "S" ? floralFrame() + `<span class="card-coronet" aria-hidden="true">${royalCrown("card" + item.uid)}</span>` : ""}
          <span class="rank">${idx + 1}</span>
          ${yearBadgeHtml}
          ${musicCornerBadge}

          <div class="card-info">
            <h3 class="card-title">${esc(item.title)}</h3>
            <div class="card-sub">${esc(item.year || "")}${studiosDisplay ? ` · ${esc(studiosDisplay)}` : ""}</div>
          </div>
        </article>

        <div class="card-under-meta">
          <div class="cum-row">
            <span class="cum-kind">${esc(m.kind)}</span>
            <span class="cum-seasons-badge">Частей: <b>${m.seasons.length}</b></span>
          </div>
          <div class="cum-episodes-line" title="${esc(countLabel)}">🎞 ${countLabel}</div>
          <div class="cum-hours-bar">
            <span>⏱ Время:</span>
            <b>${formatHours(m.totalHours)} ч.</b>
          </div>
        </div>
      </div>
    `;
  }

  function rebuildAll3DLetters() {
    if (!appData || typeof build3DLetter !== "function") return;
    document.querySelectorAll("#tiersRoot .tier").forEach((tierEl, idx) => {
      const l3dHost = tierEl.querySelector(".l3d");
      if (appData.tiers[idx]) build3DLetter(l3dHost, appData.tiers[idx], idx);
    });
    const demoSeal = document.querySelector("#fxDemo .l3d");
    if (demoSeal && appData.tiers[0]) {
      build3DLetter(demoSeal, appData.tiers[0], 0);
    }
  }

  function updateFilterClearButtons() {
    const kClear = document.getElementById("btnClearKindFilter");
    const gClear = document.getElementById("btnClearGenreFilter");
    const stClear = document.getElementById("btnClearStudioFilter");
    if (kClear) kClear.style.display = selectedKind === "ALL" ? "none" : "inline-flex";
    if (gClear) gClear.style.display = selectedGenre === "ALL" ? "none" : "inline-flex";
    if (stClear) stClear.style.display = selectedStudio === "ALL" ? "none" : "inline-flex";
  }

  function render() {
    ensureStatsModalExists();
    const host = document.getElementById("tiersRoot");
    if (!host || !appData || !Array.isArray(appData.tiers)) return;

    sortAllTiersByTimeDesc(appData);

    if (typeof FXController !== "undefined" && typeof FXController.applyGlobalBackground === "function") {
      FXController.applyGlobalBackground(appData.meta || {});
    }

    updateFilterClearButtons();
    renderRecentShowcase();

    let grandTotal = 0;
    appData.tiers.forEach(t => grandTotal += (t.items || []).length);
    const q = searchQuery.trim().toLowerCase();

    host.innerHTML = appData.tiers.map((tier, tierIdx) => {
      const allTierItems = tier.items || [];

      let tierEpisodes = 0;
      let tierMovies = 0;
      let tierHours = 0;
      allTierItems.forEach(it => {
        const m = calcItemMetrics(it);
        tierEpisodes += m.totalEpisodes;
        tierMovies += m.totalMovies;
        tierHours += m.totalHours;
      });
      const tierDays = (tierHours / 24).toFixed(1);

      const filteredItems = allTierItems.filter(it => {
        const itStudios = extractItemStudios(it);
        const m = calcItemMetrics(it);
        const seasonTypes = (m.seasons || []).map(s => (s.type || "").toLowerCase());
        const mainKindLower = String(m.kind || it.kind || "").toLowerCase();

        const matchText = !q ||
          (it.title && it.title.toLowerCase().includes(q)) ||
          (it.origTitle && it.origTitle.toLowerCase().includes(q)) ||
          mainKindLower.includes(q) ||
          seasonTypes.some(t => t.includes(q)) ||
          itStudios.some(s => s.toLowerCase().includes(q)) ||
          (it.genres || []).some(g => g.toLowerCase().includes(q));

        const matchKind = selectedKind === "ALL" ||
          (m.kind && m.kind.toLowerCase() === selectedKind.toLowerCase()) ||
          (m.seasons || []).some(s => (s.type || "").toLowerCase() === selectedKind.toLowerCase());

        const matchGenre = selectedGenre === "ALL" || (it.genres || []).some(g => g.toLowerCase() === selectedGenre.toLowerCase());
        const matchStudio = selectedStudio === "ALL" ||
          itStudios.some(s => s.toLowerCase() === selectedStudio.toLowerCase());

        return matchText && matchKind && matchGenre && matchStudio;
      });

      const tierCount = allTierItems.length;
      const tierPercent = grandTotal > 0 ? Math.round((tierCount / grandTotal) * 100) : 0;
      const titlesStr = window.formatTitlesCount(tierCount);
      const epStr = window.formatEpisodesCount(tierEpisodes);
      const mvStr = window.formatMoviesCount(tierMovies);

      const badgeBodyHtml = `
        <span class="seal-index">ТИР <b>${esc(tier.id)}</b></span>
        <div class="lstage">
          ${typeof realismMarkup === "function" ? realismMarkup(tierIdx, tier) : ""}
          ${typeof elementMarkup === "function" ? elementMarkup(tierIdx) : ""}
          ${typeof orbitalMarkup === "function" ? orbitalMarkup() : ""}
          <span class="seal-floor" aria-hidden="true"></span>
          <span class="ring r1"></span><span class="ring r2"></span>
          <div class="l3d" data-l="${esc(tier.id)}"></div>
        </div>
        <span class="seal-caption">${esc(tier.name)}</span>
      `;

      return `
        <section class="tier in-view" data-tier="${esc(tier.id)}" data-rank="${tierIdx + 1}">
          <aside class="tier-badge">
            ${badgeBodyHtml}
          </aside>
          <div class="tier-content">
            <header class="tier-header-bar">
              <div class="tier-title-group">
                <h2 style="flex-wrap:wrap;row-gap:6px;">
                  <span>${esc(tier.name)}</span>
                  <span class="tier-count-pill">${tierCount} ${titlesStr.replace(/^\d+\s*/, "")} (${tierPercent}%)</span>
                  <span class="tier-count-pill" style="border-color:rgba(255,215,106,0.45);color:#ffe8a3;background:rgba(255,215,106,0.1);">
                    🎞 ${epStr}${tierMovies > 0 ? ` + 🎬 ${mvStr}` : ""}
                  </span>
                  <span class="tier-count-pill" style="border-color:rgba(0,245,255,0.45);color:#b8fbff;background:rgba(0,245,255,0.1);">
                    ⏱ ${formatHours(tierHours)} ч. (${tierDays} дн.)
                  </span>
                </h2>
                <div class="tier-meta-sub">${esc(tier.subtitle || "")}</div>
              </div>
              <button type="button" class="btn btn-sm btn-neon-gold owner-only" data-add-to-tier="${esc(tier.id)}">
                ➕ Добавить в ${esc(tier.id)}
              </button>
            </header>
            <div class="tier-grid" data-tier-id="${esc(tier.id)}">
              ${filteredItems.map((item, idx) => cardEl(item, idx, tier.id)).join("")}
            </div>
          </div>
        </section>
      `;
    }).join("");

    if (typeof GitHubSync !== "undefined" && typeof GitHubSync.resolveAssetUrl === "function") {
      document.querySelectorAll("img.card-poster").forEach(async img => {
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

    rebuildAll3DLetters();
    if (typeof FXController !== "undefined" && typeof FXController.observeTiers === "function") {
      FXController.observeTiers();
    }
    renderTopStatsRibbon(appData.tiers);
    populateGenreDropdowns();
    populateStudioDropdown();
    bindTierInteractions();

    if (activeView === "calendar" && typeof CalendarView !== "undefined") {
      CalendarView.renderCalendar(appData.tiers, (uid, tierId) => {
        const tier = appData.tiers.find(t => t.id === tierId);
        const item = tier?.items.find(i => i.uid === uid);
        if (item && tier && typeof Modals !== "undefined") Modals.showAnimeDetails(item, tier);
      });
    }
  }

  function getSortedAllGenres() {
    let localCustom = [];
    try { localCustom = JSON.parse(localStorage.getItem(CUSTOM_GENRES_KEY) || "[]"); } catch {}

    const map = new Map();
    const addG = g => {
      const clean = String(g || "").trim();
      if (clean && !map.has(clean.toLowerCase())) map.set(clean.toLowerCase(), clean);
    };

    (window.ALL_ANIME_GENRES || []).forEach(addG);
    localCustom.forEach(addG);
    (appData?.meta?.customGenres || []).forEach(addG);
    appData?.tiers?.forEach(t => {
      (t.items || []).forEach(it => (it.genres || []).forEach(addG));
    });

    return [...map.values()].sort((a, b) => a.localeCompare(b, "ru"));
  }

  function getSortedAllStudios() {
    let localCustom = [];
    try { localCustom = JSON.parse(localStorage.getItem(CUSTOM_STUDIOS_KEY) || "[]"); } catch {}

    const map = new Map();
    const addSt = st => {
      const clean = String(st || "").trim();
      if (clean && !map.has(clean.toLowerCase())) map.set(clean.toLowerCase(), clean);
    };

    (window.ALL_ANIME_STUDIOS || []).forEach(addSt);
    localCustom.forEach(addSt);
    (appData?.meta?.customStudios || []).forEach(addSt);
    appData?.tiers?.forEach(t => {
      (t.items || []).forEach(it => {
        extractItemStudios(it).forEach(addSt);
      });
    });

    return [...map.values()].sort((a, b) => a.localeCompare(b, "en"));
  }

  function populateGenreDropdowns(editorSearchTerm = "") {
    const listEl = document.getElementById("genreOptionsList");
    const picker = document.getElementById("genreQuickPicker");
    const sorted = getSortedAllGenres();

    if (listEl) {
      const q = genreFilterSearch.trim().toLowerCase();
      const matching = sorted.filter(g => !q || g.toLowerCase().includes(q));
      listEl.innerHTML =
        `<div class="genre-opt-item ${selectedGenre === "ALL" ? "active" : ""}" data-g-val="ALL">🎭 Все жанры (${sorted.length})</div>` +
        matching.map(g => `<div class="genre-opt-item ${selectedGenre === g ? "active" : ""}" data-g-val="${esc(g)}">${esc(g)}</div>`).join("");
    }

    if (picker) {
      const eq = editorSearchTerm.trim().toLowerCase();
      const matchingEditor = sorted.filter(g => !eq || g.toLowerCase().includes(eq));
      picker.innerHTML = `<option value="">+ Выбрать жанр (${matchingEditor.length})...</option>` +
        matchingEditor.map(g => `<option value="${esc(g)}">${esc(g)}</option>`).join("");
    }
  }

  function populateStudioDropdown(editorSearchTerm = "") {
    const listEl = document.getElementById("studioOptionsList");
    const datalist = document.getElementById("studioPresetList");
    const studioPicker = document.getElementById("studioQuickPicker");
    const sortedStudios = getSortedAllStudios();

    if (datalist) {
      datalist.innerHTML = sortedStudios.map(s => `<option value="${esc(s)}"></option>`).join("");
    }

    if (listEl) {
      const q = studioFilterSearch.trim().toLowerCase();
      const matching = sortedStudios.filter(s => !q || s.toLowerCase().includes(q));
      listEl.innerHTML =
        `<div class="genre-opt-item ${selectedStudio === "ALL" ? "active" : ""}" data-st-val="ALL">🎬 Все студии (${sortedStudios.length})</div>` +
        matching.map(s => `<div class="genre-opt-item ${selectedStudio === s ? "active" : ""}" data-st-val="${esc(s)}">${esc(s)}</div>`).join("");
    }

    if (studioPicker) {
      const eq = editorSearchTerm.trim().toLowerCase();
      const matchingEditor = sortedStudios.filter(s => !eq || s.toLowerCase().includes(eq));
      studioPicker.innerHTML = `<option value="">+ Выбрать студию (${matchingEditor.length})...</option>` +
        matchingEditor.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join("");
    }
  }

  function bindTierInteractions() {
    document.querySelectorAll("[data-add-to-tier]").forEach(btn => {
      btn.onclick = () => {
        if (typeof GitHubSync === "undefined" || !GitHubSync.isOwner()) {
          showToast("Для добавления войдите как владелец", "#ff3c8c");
          Modals.openModal("authModal");
          return;
        }
        pendingPosterBlobSha = "";
        pendingPosterInline = "";
        pendingBgmBlobSha = "";
        pendingBgmUrl = "";
        Modals.openEditorModal(btn.dataset.addToTier, null);
      };
    });

    document.querySelectorAll(".card-unit").forEach(unit => {
      unit.onclick = () => {
        const uid = unit.dataset.uid;
        const tierId = unit.dataset.tierId;
        const tier = appData.tiers.find(t => t.id === tierId);
        const item = tier?.items.find(i => i.uid === uid);
        if (item && tier && typeof Modals !== "undefined") Modals.showAnimeDetails(item, tier);
      };
    });

    if (typeof DragDropEngine !== "undefined" && typeof DragDropEngine.bindCardsAndGrids === "function") {
      DragDropEngine.bindCardsAndGrids((uid, fromTierId, toTierId) => {
        if (!GitHubSync.isOwner()) return;
        const fromTier = appData.tiers.find(t => t.id === fromTierId);
        const toTier = appData.tiers.find(t => t.id === toTierId);
        if (!fromTier || !toTier) return;
        const idx = fromTier.items.findIndex(i => i.uid === uid);
        if (idx === -1) return;
        const [moved] = fromTier.items.splice(idx, 1);

        toTier.items.push(moved);
        sortAllTiersByTimeDesc(appData);

        render();
        saveAndAutoSync(`Move ${moved.title} to ${toTierId}`, false);
        showToast(`«${moved.title}» перемещён в тир ${toTierId} (отсортировано по времени)`, "#00f5ff");
      });
    }
  }

  function toggleCalendarView(forceMode) {
    activeView = forceMode || (activeView === "tiers" ? "calendar" : "tiers");
    const tiersEl = document.getElementById("tiersRoot");
    const recentEl = document.getElementById("recentSection");
    const calEl = document.getElementById("calendarRoot");
    const calBtn = document.getElementById("btnToggleCalendar");

    if (activeView === "calendar") {
      tiersEl.style.display = "none";
      if (recentEl) recentEl.style.display = "none";
      calEl.style.display = "block";
      if (calBtn) {
        calBtn.classList.add("active");
        calBtn.innerHTML = "🏛 Вернуться к тирам";
      }
      if (typeof CalendarView !== "undefined") {
        CalendarView.renderCalendar(appData.tiers, (uid, tierId) => {
          const tier = appData.tiers.find(t => t.id === tierId);
          const item = tier?.items.find(i => i.uid === uid);
          if (item && tier) Modals.showAnimeDetails(item, tier);
        });
      }
    } else {
      calEl.style.display = "none";
      if (recentEl) recentEl.style.display = "block";
      tiersEl.style.display = "flex";
      if (calBtn) {
        calBtn.classList.remove("active");
        calBtn.innerHTML = "📅 Календарь";
      }
    }
  }

  function bindGlobalUI() {
    ensureStatsModalExists();

    if (typeof Modals !== "undefined" && typeof Modals.setDeleteHandler === "function") {
      Modals.setDeleteHandler((uid, tierId) => {
        if (!GitHubSync.isOwner()) return;
        const tier = appData.tiers.find(t => t.id === tierId);
        if (!tier) return;
        const item = tier.items.find(i => i.uid === uid);
        tier.items = tier.items.filter(i => i.uid !== uid);
        render();
        saveAndAutoSync(`Delete ${item?.title || uid}`, true);
      });
    }

    document.getElementById("btnCloseFxPanel")?.addEventListener("click", () => {
      document.getElementById("fxPanel")?.classList.remove("show");
    });

    document.getElementById("btnToggleCalendar")?.addEventListener("click", () => toggleCalendarView());
    document.getElementById("brandHomeBtn")?.addEventListener("click", () => toggleCalendarView("tiers"));

    document.getElementById("btnAddTitleTop")?.addEventListener("click", () => {
      if (!GitHubSync.isOwner()) {
        showToast("Для добавления войдите как владелец", "#ff3c8c");
        Modals.openModal("authModal");
        return;
      }
      pendingPosterBlobSha = "";
      pendingPosterInline = "";
      pendingBgmBlobSha = "";
      pendingBgmUrl = "";
      Modals.openEditorModal("S", null);
    });

    document.getElementById("btnSyncNowOwner")?.addEventListener("click", async () => {
      if (!GitHubSync.isOwner()) return;
      await saveAndAutoSync("Manual owner full sync", true);
    });

    document.addEventListener("click", e => {
      // Глобальный перехват кнопки «📊 Статистика» (работает всегда, даже при динамической вставке)
      if (e.target.closest("#btnOpenStatsModal")) {
        e.preventDefault();
        openDetailedStatsModalInternal();
        return;
      }

      const kMenu = document.getElementById("kindDropdownMenu");
      const gMenu = document.getElementById("genreDropdownMenu");
      const stMenu = document.getElementById("studioDropdownMenu");

      if (e.target.closest("#kindDropdownBtn")) {
        e.preventDefault();
        gMenu?.classList.remove("open");
        stMenu?.classList.remove("open");
        kMenu?.classList.toggle("open");
        return;
      }

      const kOpt = e.target.closest("[data-k-val]");
      if (kOpt) {
        selectedKind = kOpt.dataset.kVal;
        const lbl = document.getElementById("kindDropdownLabel");
        if (lbl) lbl.textContent = selectedKind === "ALL" ? "Все типы" : selectedKind;
        document.querySelectorAll("#kindOptionsList .genre-opt-item").forEach(el => {
          el.classList.toggle("active", el === kOpt);
        });
        kMenu?.classList.remove("open");
        render();
        return;
      }

      if (e.target.closest("#genreDropdownBtn")) {
        e.preventDefault();
        kMenu?.classList.remove("open");
        stMenu?.classList.remove("open");
        gMenu?.classList.toggle("open");
        if (gMenu?.classList.contains("open")) {
          setTimeout(() => document.getElementById("genreSearchInput")?.focus(), 20);
        }
        return;
      }

      const gOpt = e.target.closest("[data-g-val]");
      if (gOpt) {
        selectedGenre = gOpt.dataset.gVal;
        const lbl = document.getElementById("genreDropdownLabel");
        if (lbl) lbl.textContent = selectedGenre === "ALL" ? "Все жанры" : selectedGenre;
        gMenu?.classList.remove("open");
        render();
        return;
      }

      if (e.target.closest("#studioDropdownBtn")) {
        e.preventDefault();
        kMenu?.classList.remove("open");
        gMenu?.classList.remove("open");
        stMenu?.classList.toggle("open");
        if (stMenu?.classList.contains("open")) {
          setTimeout(() => document.getElementById("studioSearchInput")?.focus(), 20);
        }
        return;
      }

      const stOpt = e.target.closest("[data-st-val]");
      if (stOpt) {
        selectedStudio = stOpt.dataset.stVal;
        const lbl = document.getElementById("studioDropdownLabel");
        if (lbl) lbl.textContent = selectedStudio === "ALL" ? "Все студии" : selectedStudio;
        stMenu?.classList.remove("open");
        render();
        return;
      }

      if (!e.target.closest("#kindDropdown")) kMenu?.classList.remove("open");
      if (!e.target.closest("#genreDropdown")) gMenu?.classList.remove("open");
      if (!e.target.closest("#studioDropdown")) stMenu?.classList.remove("open");
    });

    document.getElementById("genreSearchInput")?.addEventListener("input", e => {
      genreFilterSearch = e.target.value;
      populateGenreDropdowns();
    });

    document.getElementById("studioSearchInput")?.addEventListener("input", e => {
      studioFilterSearch = e.target.value;
      populateStudioDropdown();
    });

    document.getElementById("btnClearKindFilter")?.addEventListener("click", e => {
      e.stopPropagation();
      selectedKind = "ALL";
      const lbl = document.getElementById("kindDropdownLabel");
      if (lbl) lbl.textContent = "Все типы";
      document.querySelectorAll("#kindOptionsList .genre-opt-item").forEach(el => {
        el.classList.toggle("active", el.dataset.kVal === "ALL");
      });
      render();
    });

    document.getElementById("btnClearGenreFilter")?.addEventListener("click", e => {
      e.stopPropagation();
      selectedGenre = "ALL";
      const lbl = document.getElementById("genreDropdownLabel");
      if (lbl) lbl.textContent = "Все жанры";
      render();
    });

    document.getElementById("btnClearStudioFilter")?.addEventListener("click", e => {
      e.stopPropagation();
      selectedStudio = "ALL";
      const lbl = document.getElementById("studioDropdownLabel");
      if (lbl) lbl.textContent = "Все студии";
      render();
    });

    document.getElementById("btnClearEditorStudio")?.addEventListener("click", () => {
      const stInp = document.getElementById("fStudio");
      if (stInp) stInp.value = "";
      if (typeof Modals.syncEditorStudioChips === "function") Modals.syncEditorStudioChips();
    });

    document.getElementById("fStudio")?.addEventListener("input", () => {
      if (typeof Modals.syncEditorStudioChips === "function") Modals.syncEditorStudioChips();
    });

    const editorStSearch = document.getElementById("editorStudioSearch");
    editorStSearch?.addEventListener("input", () => {
      populateStudioDropdown(editorStSearch.value);
    });

    const studioPicker = document.getElementById("studioQuickPicker");
    studioPicker?.addEventListener("change", () => {
      const val = studioPicker.value;
      if (!val) return;
      const inp = document.getElementById("fStudio");
      const currentList = inp.value.replace(/ {3,}/g, ", ").split(",").map(s => s.trim()).filter(Boolean);
      if (!currentList.some(s => s.toLowerCase() === val.toLowerCase())) {
        currentList.push(val);
        inp.value = currentList.join(", ");
      }
      studioPicker.value = "";
      if (typeof Modals.syncEditorStudioChips === "function") Modals.syncEditorStudioChips();
    });

    document.getElementById("btnClearEditorPoster")?.addEventListener("click", () => {
      const pInp = document.getElementById("fPoster");
      if (pInp) { pInp.value = ""; pInp.dataset.existingBlobSha = ""; }
      pendingPosterBlobSha = "";
      pendingPosterInline = "";
    });

    document.getElementById("btnClearAllEditorGenres")?.addEventListener("click", () => {
      const gInp = document.getElementById("fGenres");
      if (gInp) gInp.value = "";
      if (typeof Modals.syncEditorGenreChips === "function") Modals.syncEditorGenreChips();
    });

    document.getElementById("fGenres")?.addEventListener("input", () => {
      if (typeof Modals.syncEditorGenreChips === "function") Modals.syncEditorGenreChips();
    });

    const editorGSearch = document.getElementById("editorGenreSearch");
    editorGSearch?.addEventListener("input", () => {
      populateGenreDropdowns(editorGSearch.value);
    });

    const picker = document.getElementById("genreQuickPicker");
    picker?.addEventListener("change", () => {
      const val = picker.value;
      if (!val) return;
      const inp = document.getElementById("fGenres");
      const currentList = inp.value.replace(/ {3,}/g, ", ").split(",").map(s => s.trim()).filter(Boolean);
      if (!currentList.some(g => g.toLowerCase() === val.toLowerCase())) {
        currentList.push(val);
        inp.value = currentList.join(", ");
      }
      picker.value = "";
      if (typeof Modals.syncEditorGenreChips === "function") Modals.syncEditorGenreChips();
    });

    const posterFileInp = document.getElementById("fPosterFile");
    posterFileInp?.addEventListener("change", async () => {
      const file = posterFileInp.files?.[0];
      if (!file) return;
      try {
        isUploadingAsset = true;
        showToast("⏳ Загрузка обложки в GitHub...", "#00f5ff");
        const uploaded = await GitHubSync.uploadAssetFile(file, "posters");
        const posterInputEl = document.getElementById("fPoster");
        posterInputEl.value = uploaded.path;
        posterInputEl.dataset.existingBlobSha = uploaded.blobSha;
        pendingPosterBlobSha = uploaded.blobSha;
        pendingPosterInline = uploaded.inlineDataUrl || "";
        showToast("✔ Обложка загружена!", "#38ef7d");
      } catch (err) {
        showToast("Ошибка загрузки обложки: " + err.message, "#ff3c8c");
      } finally {
        isUploadingAsset = false;
      }
    });

    const bgmFileInp = document.getElementById("fBgmFile");
    bgmFileInp?.addEventListener("change", async () => {
      const file = bgmFileInp.files?.[0];
      if (!file) return;
      const lbl = document.getElementById("bgmFileNameLabel");
      try {
        isUploadingAsset = true;
        if (lbl) {
          lbl.style.color = "#00f5ff";
          lbl.textContent = `⏳ Загрузка «${file.name}»...`;
        }
        showToast(`⏳ Загрузка аудиофайла «${file.name}» в GitHub...`, "#00f5ff");

        const uploaded = await GitHubSync.uploadAssetFile(file, "audio");
        const bgmUrlInp = document.getElementById("fBgmUrl");
        if (bgmUrlInp) {
          bgmUrlInp.value = uploaded.path;
          bgmUrlInp.dataset.existingBlobSha = uploaded.blobSha;
        }
        pendingBgmUrl = uploaded.path;
        pendingBgmBlobSha = uploaded.blobSha;

        if (lbl) {
          lbl.style.color = "#38ef7d";
          lbl.textContent = `🎵 Готово: ${file.name}`;
        }
        showToast("✔ Музыка успешно загружена! Теперь нажмите «Сохранить и синхронизировать».", "#38ef7d");
      } catch (err) {
        if (lbl) {
          lbl.style.color = "#ff5e7e";
          lbl.textContent = `⚠ Ошибка загрузки файла`;
        }
        showToast("Ошибка загрузки музыки: " + err.message, "#ff3c8c");
      } finally {
        isUploadingAsset = false;
      }
    });

    const rngBgmVol = document.getElementById("rngBgmVol");
    const lblBgmVol = document.getElementById("lblBgmVol");
    if (rngBgmVol) {
      const savedVol = localStorage.getItem("mta_bgm_volume") || "0.3";
      rngBgmVol.value = Math.round(parseFloat(savedVol) * 100);
      if (lblBgmVol) lblBgmVol.textContent = rngBgmVol.value + "%";
      rngBgmVol.addEventListener("input", () => {
        const pct = parseInt(rngBgmVol.value, 10);
        const volVal = pct / 100;
        if (lblBgmVol) lblBgmVol.textContent = pct + "%";
        localStorage.setItem("mta_bgm_volume", String(volVal));
        if (typeof Modals.setLiveBgmVolume === "function") {
          Modals.setLiveBgmVolume(volVal);
        }
        if (appData?.meta) {
          appData.meta.bgmVolume = pct;
        }
      });
    }

    const ownerBgFile = document.getElementById("ownerBgFileInput");
    ownerBgFile?.addEventListener("change", async () => {
      const file = ownerBgFile.files?.[0];
      if (!file) return;
      try {
        const localBlobUrl = URL.createObjectURL(file);
        appData.meta = appData.meta || {};
        if (typeof FXController !== "undefined") {
          await FXController.applyGlobalBackground(appData.meta, localBlobUrl);
        }
        showToast("⚡ Отправка фона в GitHub...", "#00f5ff");

        const uploaded = await GitHubSync.uploadAssetFile(file, "backgrounds");
        appData.meta.bgImage = uploaded.path;
        appData.meta.bgBlobSha = uploaded.blobSha;
        appData.meta.bgMime = uploaded.mime;
        appData.meta.bgInline = uploaded.inlineDataUrl || "";

        await saveAndAutoSync("Update global background image", true);
      } catch (err) {
        showToast("Ошибка публикации фона: " + err.message, "#ff3c8c");
      }
    });

    document.getElementById("rngOwnerBgDim")?.addEventListener("input", e => {
      const v = parseInt(e.target.value, 10);
      document.getElementById("lblOwnerBgDim").textContent = v + "%";
      if (appData?.meta) {
        appData.meta.bgDim = v;
        FXController.applyGlobalBackground(appData.meta);
      }
    });

    document.getElementById("rngOwnerBgBlur")?.addEventListener("input", e => {
      const v = parseInt(e.target.value, 10);
      document.getElementById("lblOwnerBgBlur").textContent = v + "px";
      if (appData?.meta) {
        appData.meta.bgBlur = v;
        FXController.applyGlobalBackground(appData.meta);
      }
    });

    document.getElementById("btnClearOwnerBg")?.addEventListener("click", () => {
      if (!GitHubSync.isOwner()) return;
      appData.meta = appData.meta || {};
      appData.meta.bgImage = "";
      appData.meta.bgBlobSha = "";
      appData.meta.bgInline = "";
      FXController.applyGlobalBackground(appData.meta);
      saveAndAutoSync("Clear global background", true);
    });

    document.getElementById("searchInput")?.addEventListener("input", e => {
      searchQuery = e.target.value;
      render();
    });

    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => Modals.closeModal(btn.dataset.closeModal));
    });

    document.querySelectorAll("[data-add-part]").forEach(btn => {
      btn.addEventListener("click", () => Modals.addSeasonRow(btn.dataset.addPart));
    });

    document.getElementById("animeEditorForm")?.addEventListener("submit", async e => {
      e.preventDefault();
      if (!GitHubSync.isOwner()) {
        showToast("Ошибка: сохранять может только владелец!", "#ff3c8c");
        return;
      }

      if (isUploadingAsset) {
        showToast("⏳ Подождите пару секунд, завершается загрузка файла в GitHub...", "#00f5ff");
        return;
      }

      const ruTitle = document.getElementById("fTitle").value.trim();
      if (!ruTitle) {
        showToast("Пожалуйста, укажите Название (RU)!", "#ff3c8c");
        document.getElementById("fTitle")?.focus();
        return;
      }

      const nowMs = Date.now();
      const uid = document.getElementById("fUid").value || ("anime-" + nowMs);
      const targetTierId = document.getElementById("fTier").value;
      const seasons = Modals.readSeasonsFromEditor();
      const posterInp = document.getElementById("fPoster");
      const rawPosterVal = posterInp.value.trim() || "https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime";
      const finalBlobSha = pendingPosterBlobSha || posterInp.dataset.existingBlobSha || undefined;

      let existingInline = "";
      let existingBgmUrl = "";
      let existingBgmSha = "";
      appData.tiers.forEach(t => {
        const found = (t.items || []).find(i => i.uid === uid);
        if (found && found.poster === posterInp.value.trim()) {
          existingInline = found.posterInline || "";
        }
        if (found) {
          existingBgmUrl = found.bgmUrl || "";
          existingBgmSha = found.bgmBlobSha || "";
        }
      });

      const bgmUrlInp = document.getElementById("fBgmUrl");
      const finalBgmUrl = pendingBgmUrl || bgmUrlInp?.value.trim() || existingBgmUrl || undefined;
      const finalBgmSha = pendingBgmBlobSha || bgmUrlInp?.dataset.existingBlobSha || existingBgmSha || undefined;

      const parsedYear = parseInt(document.getElementById("fYear").value, 10);

      const studiosArr = document.getElementById("fStudio").value
        .replace(/ {3,}/g, ", ")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
      const genresArr = document.getElementById("fGenres").value
        .replace(/ {3,}/g, ", ")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      registerCustomGenresAndStudios(genresArr, studiosArr);

      const newItem = {
        uid,
        updatedAt: nowMs,
        kind: document.getElementById("fKind").value,
        title: ruTitle,
        origTitle: document.getElementById("fOrigTitle").value.trim(),
        year: isNaN(parsedYear) ? "" : parsedYear,
        studio: studiosArr.join(", "),
        studios: studiosArr,
        poster: rawPosterVal,
        posterBlobSha: finalBlobSha,
        posterInline: pendingPosterInline || existingInline || undefined,
        bgmUrl: finalBgmUrl,
        bgmBlobSha: finalBgmSha,
        genres: genresArr,
        comment: document.getElementById("fComment").value.trim(),
        seasons,
        watched: seasons.map(s => ({ date: s.date, note: s.title }))
      };
      pendingPosterBlobSha = "";
      pendingPosterInline = "";
      pendingBgmBlobSha = "";
      pendingBgmUrl = "";

      let wasExisting = false;
      appData.tiers.forEach(t => {
        const idx = (t.items || []).findIndex(i => i.uid === uid);
        if (idx !== -1 && t.id === targetTierId) {
          t.items[idx] = newItem;
          wasExisting = true;
        } else if (idx !== -1) {
          t.items.splice(idx, 1);
        }
      });

      if (!wasExisting) {
        const destTier = appData.tiers.find(t => t.id === targetTierId) || appData.tiers[0];
        destTier.items.push(newItem);
      }

      sortAllTiersByTimeDesc(appData);

      Modals.closeModal("editorModal");
      render();
      await saveAndAutoSync(`Save ${newItem.title} in tier ${targetTierId}`, true);
    });

    document.getElementById("btnOwnerAuth")?.addEventListener("click", () => {
      document.getElementById("ghTokenInput").value = GitHubSync.getToken();
      document.getElementById("ghRepoInput").value = GitHubSync.getRepo();
      Modals.openModal("authModal");
    });

    document.getElementById("btnLogoutOwner")?.addEventListener("click", () => {
      GitHubSync.logout();
      updateOwnerBadge(null);
      Modals.closeModal("authModal");
      showToast("Вы вышли из режима владельца");
    });

    document.getElementById("authForm")?.addEventListener("submit", async e => {
      e.preventDefault();
      const tk = document.getElementById("ghTokenInput").value.trim();
      const dep = typeof GitHubSync.detectRepoFromLocation === "function"
        ? GitHubSync.detectRepoFromLocation()
        : "noxyholmes/myTierAnime";
      const rp = document.getElementById("ghRepoInput").value.trim() || dep;

      if (!tk) {
        GitHubSync.logout();
        updateOwnerBadge(null);
        Modals.closeModal("authModal");
        showToast("Вы вышли из режима владельца");
        return;
      }

      const user = await GitHubSync.verifyToken(tk);
      if (user) {
        GitHubSync.saveCredentials(tk, rp);
        document.body.classList.add("is-owner");
        updateOwnerBadge(user);
        Modals.closeModal("authModal");
        await saveAndAutoSync("Owner login initial sync", true);
      } else {
        GitHubSync.logout();
        updateOwnerBadge(null);
        showToast("Неверный токен GitHub!", "#ff3c8c");
      }
    });
  }

  function updateOwnerBadge(user) {
    const btn = document.getElementById("btnOwnerAuth");
    if (!btn) return;
    if (user) {
      btn.classList.add("btn-owner-active");
      btn.innerHTML = `🔓 ${esc(user.login)}`;
    } else {
      btn.classList.remove("btn-owner-active");
      btn.innerHTML = `🔑 Вход`;
    }
  }

  async function bootstrapApp() {
    try {
      if (typeof FXController !== "undefined" && typeof FXController.init === "function") {
        FXController.init(rebuildAll3DLetters);
      }
    } catch {}

    try {
      bindGlobalUI();
    } catch {}

    if (typeof GitHubSync !== "undefined" && GitHubSync.getToken()) {
      document.body.classList.add("is-owner");
      GitHubSync.verifyToken().then(u => {
        if (u) updateOwnerBadge(u);
        else GitHubSync.logout();
      });
    }

    await loadInitialState();
    startLiveViewerPolling();
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", bootstrapApp);
  } else {
    bootstrapApp();
  }
})();
