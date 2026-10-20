/* ═══════════════════ STATS ENGINE & DETAILED ANALYTICS MODAL (v20.0) ═══════════════════ */
const StatsEngine = (() => {
  function ensureStatsModalStyles() {
    if (document.getElementById("mtaDetailedStatsStyles")) return;
    const st = document.createElement("style");
    st.id = "mtaDetailedStatsStyles";
    st.textContent = `
      .st-hero-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
        margin-bottom: 22px;
      }
      .st-kpi-box {
        background: linear-gradient(135deg, rgba(28, 22, 58, 0.9), rgba(16, 13, 34, 0.95));
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 14px;
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .st-kpi-lbl {
        font-size: 10.5px;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: #a6a0c4;
        font-weight: 700;
      }
      .st-kpi-val {
        font-family: var(--serif, 'Cinzel', serif);
        font-size: 23px;
        font-weight: 900;
        color: #ffffff;
      }
      .st-kpi-sub {
        font-size: 11.5px;
        color: #9e97bf;
      }
      .st-section-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
        margin-bottom: 18px;
      }
      .st-panel {
        background: rgba(16, 13, 34, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 16px;
        padding: 16px 18px;
      }
      .st-panel-full {
        grid-column: 1 / -1;
      }
      .st-panel-title {
        margin: 0 0 12px;
        font-family: var(--serif, 'Cinzel', serif);
        font-size: 15px;
        font-weight: 800;
        color: #ffe8a3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.09);
      }
      .st-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12.5px;
      }
      .st-table th {
        text-align: left;
        padding: 8px 10px;
        color: #9e97bf;
        font-size: 11px;
        text-transform: uppercase;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .st-table td {
        padding: 9px 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        color: #f5f3ff;
      }
      .st-bar-list {
        display: flex;
        flex-direction: column;
        gap: 9px;
      }
      .st-bar-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .st-bar-head {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-size: 12px;
        font-weight: 700;
      }
      .st-bar-track {
        width: 100%;
        height: 7px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.07);
        overflow: hidden;
      }
      .st-bar-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #ffd76a, #ff5e7e, #00f5ff);
      }
      .st-top-longest-row {
        display: grid;
        grid-template-columns: 28px 36px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        padding: 7px 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.07);
        cursor: pointer;
        transition: border-color 0.15s, background 0.15s;
      }
      .st-top-longest-row:hover {
        border-color: #ffd76a;
        background: rgba(255, 215, 106, 0.08);
      }
      .st-top-longest-row img {
        width: 36px;
        height: 50px;
        object-fit: cover;
        border-radius: 5px;
      }
      @media (max-width: 960px) {
        .st-section-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(st);
  }

  /* Верхняя лента из 3 карточек (без текста "Средний балл: ★ 0.00") */
  function updateStats(tiers) {
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
    const titlesStr = typeof formatTitlesCount === "function" ? formatTitlesCount(totalTitles) : (totalTitles + " тайтлов");
    const epStr = typeof formatEpisodesCount === "function" ? formatEpisodesCount(sumEpisodes) : (sumEpisodes + " серий");
    const mvStr = typeof formatMoviesCount === "function" ? formatMoviesCount(sumMovies) : (sumMovies + " фильмов");

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

  /* Максимально подробная и детализированная статистика в модальном окне */
  function openDetailedStatsModal(tiers, onSelectAnime) {
    ensureStatsModalStyles();
    const body = document.getElementById("statsModalBody");
    if (!body || !Array.isArray(tiers)) return;

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

        // Разбивка по частям/форматам и годам просмотра
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

        // Жанры
        (item.genres || []).forEach(g => {
          const clean = String(g).trim();
          if (!clean) return;
          const cur = genreMap.get(clean) || { name: clean, count: 0, hours: 0, episodes: 0 };
          cur.count++;
          cur.hours += m.totalHours;
          cur.episodes += m.totalEpisodes + m.totalMovies;
          genreMap.set(clean, cur);
        });

        // Студии
        const rawStudios = Array.isArray(item.studios) && item.studios.length
          ? item.studios
          : String(item.studio || "").split(",");
        rawStudios.map(s => s.trim()).filter(Boolean).forEach(st => {
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
      <!-- 1. Главные показатели коллекции -->
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
        <!-- 2. Детализация по каждому тиру (S, A, B, C, D, E) -->
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

        <!-- 3. Распределение по типам и форматам -->
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

        <!-- 4. Динамика просмотров по годам -->
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

        <!-- 5. Топ-10 самых длинных тайтлов по времени -->
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

        <!-- 6. Топ-15 любимых жанров -->
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

        <!-- 7. Топ-12 студий анимации -->
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
        if (typeof Modals !== "undefined") Modals.closeModal("statsModal");
        if (typeof onSelectAnime === "function") {
          onSelectAnime(row.dataset.stUid, row.dataset.stTier);
        }
      };
    });

    if (typeof Modals !== "undefined") {
      Modals.openModal("statsModal");
    }
  }

  return { updateStats, openDetailedStatsModal };
})();
window.StatsEngine = StatsEngine;
