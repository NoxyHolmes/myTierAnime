/* ═══════════════════ STATS RIBBON (DUAL TIME SPLIT) & RECENT TITLES STRIP ═══════════════════ */
const StatsEngine = (() => {
  function pluralDaysRu(n) {
    const abs = Math.floor(Math.abs(n));
    return window.pluralRu ? window.pluralRu(abs, "день", "дня", "дней") : "дней";
  }

  function pluralHoursRu(n) {
    const abs = Math.floor(Math.abs(n));
    return window.pluralRu ? window.pluralRu(abs, "час", "часа", "часов") : "часов";
  }

  function updateStats(tiers, onSelectRecent) {
    const host = document.getElementById("statsRibbon");
    if (!host || !Array.isArray(tiers)) return;

    let totalTitles = 0;
    let totalScoreSum = 0;
    let sumEpisodes = 0;
    let sumMovies = 0;
    let sumHours = 0;

    tiers.forEach(t => {
      const items = t.items || [];
      totalTitles += items.length;
      items.forEach(it => {
        totalScoreSum += parseFloat(it.score || 0);
        const m = calcItemMetrics(it);
        sumEpisodes += m.totalEpisodes;
        sumMovies += m.totalMovies;
        sumHours += m.totalHours;
      });
    });

    const avgScore = totalTitles ? (totalScoreSum / totalTitles).toFixed(2) : "0.00";
    const totalDays = (sumHours / 24).toFixed(1);
    const titlesStr = formatTitlesCount(totalTitles);
    const hoursStr = formatHours(sumHours);

    host.innerHTML = `
      <!-- 1. Всего просмотрено тайтлов + Средний балл -->
      <div class="stat-card">
        <div>
          <div class="stat-label">Всего просмотрено</div>
          <div class="stat-val">${totalTitles} <span style="font-size:13px;color:var(--ink-soft);">${titlesStr.replace(/^\d+\s*/, "")}</span></div>
          <div class="stat-sub">Средний балл: <b style="color:#ffd76a;">★ ${avgScore}</b></div>
        </div>
        <span style="font-size:26px;">📚</span>
      </div>

      <!-- 2. Серии и Фильмы (Двойной сплит) -->
      <div class="stat-card" style="padding:10px 12px;">
        <div class="stat-dual-split">
          <div class="stat-split-box">
            <div class="stat-label">🎞 Серии</div>
            <div class="stat-val" style="color:#ffd76a;font-size:20px;">${sumEpisodes}</div>
            <div style="font-size:9.5px;color:var(--ink-soft);">${formatEpisodesCount(sumEpisodes).replace(/^\d+\s*/, "")}</div>
          </div>
          <div class="stat-split-box movies-highlight">
            <div class="stat-label" style="color:#ffd6e7;font-weight:800;">🎬 Фильмы</div>
            <div class="stat-val" style="color:#ff5e7e;font-size:20px;text-shadow:0 0 12px rgba(255,94,126,0.55);">${sumMovies}</div>
            <div style="font-size:9.5px;color:#ffaec6;font-weight:700;">${formatMoviesCount(sumMovies).replace(/^\d+\s*/, "")}</div>
          </div>
        </div>
      </div>

      <!-- 3. ПЕРЕРАБОТАННЫЙ БЛОК ВРЕМЕНИ: Гармоничный двойной сплит (Часы + Дни) -->
      <div class="stat-card" style="padding:10px 12px;">
        <div class="stat-dual-split">
          <div class="stat-split-box time-hours-highlight">
            <div class="stat-label" style="color:#b8fbff;font-weight:800;">⏱ Всего часов</div>
            <div class="stat-val" style="color:#00f5ff;font-size:20px;text-shadow:0 0 12px rgba(0,245,255,0.45);">${hoursStr}</div>
            <div style="font-size:9.5px;color:#9ee8f0;font-weight:600;">${pluralHoursRu(sumHours)} просмотра</div>
          </div>
          <div class="stat-split-box time-days-highlight">
            <div class="stat-label" style="color:#ebd6ff;font-weight:800;">⏳ Всего дней</div>
            <div class="stat-val" style="color:#e2cdff;font-size:20px;text-shadow:0 0 12px rgba(181,124,255,0.5);">${totalDays}</div>
            <div style="font-size:9.5px;color:#cbb2f5;font-weight:600;">${pluralDaysRu(totalDays)} непрерывно</div>
          </div>
        </div>
      </div>
    `;

    renderRecentAdditions(tiers, onSelectRecent);
  }

  /* Адаптивная полоса последних добавленных тайтлов между статистикой и тирами:
     Автоматически вычисляет, сколько карточек идеально помещается в 1 ряд под текущий размер экрана сайта! */
  function renderRecentAdditions(tiers, onSelectRecent) {
    const recentHost = document.getElementById("recentAdditionsSection");
    if (!recentHost || !Array.isArray(tiers)) return;

    const allEntries = [];
    tiers.forEach(tier => {
      (tier.items || []).forEach((item, indexInTier) => {
        const m = calcItemMetrics(item);
        const uidTimestampMatch = String(item.uid || "").match(/anime-(\d{10,})/);
        const addedTime = uidTimestampMatch ? Number(uidTimestampMatch[1]) : 0;
        // Сортируем по новизне добавления (или свежей дате просмотра)
        const sortWeight = addedTime || m.latestMs || (2000 - indexInTier);
        allEntries.push({ item, tier, m, sortWeight });
      });
    });

    if (!allEntries.length) {
      recentHost.style.display = "none";
      return;
    }

    allEntries.sort((a, b) => b.sortWeight - a.sortWeight);

    // Вычисляем сколько карточек ровно влезает в 1 ряд под текущую ширину контейнера сайта
    const containerWidth = recentHost.clientWidth || Math.min(window.innerWidth - 40, 1740);
    const cardMinWidth = 225;
    const maxFittingCount = Math.max(2, Math.min(8, Math.floor((containerWidth - 20) / cardMinWidth)));
    const recentSlice = allEntries.slice(0, maxFittingCount);

    recentHost.style.display = "block";
    recentHost.innerHTML = `
      <div class="recent-strip-box">
        <div class="recent-strip-head">
          <div class="recent-strip-title">
            <span class="recent-pulse-dot"></span>
            <strong>Недавно добавленные и обновлённые тайтлы</strong>
          </div>
          <span class="recent-strip-sub">Показано последних: <b>${recentSlice.length}</b></span>
        </div>
        <div class="recent-strip-grid" style="grid-template-columns: repeat(${recentSlice.length}, minmax(0, 1fr));">
          ${recentSlice.map(({ item, tier, m }) => {
            const posterSrc = item.posterInline || item.poster || "https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime";
            const lastSeason = m.seasons[m.seasons.length - 1];
            const dateBadge = lastSeason?.date || item.year || "";
            return `
              <div class="recent-mini-card" data-recent-uid="${esc(item.uid)}" data-recent-tier="${esc(tier.id)}">
                <img class="rmc-poster" src="${esc(posterSrc)}" data-raw-path="${esc(item.poster || "")}" data-blob-sha="${esc(item.posterBlobSha || "")}" alt="${esc(item.title)}"
                     onerror="this.src='https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime'">
                <div class="rmc-info">
                  <div class="rmc-badges">
                    <span class="rmc-tier-tag">Тир ${esc(tier.id)}</span>
                    ${item.score ? `<span class="rmc-score">★ ${esc(item.score)}</span>` : ""}
                  </div>
                  <div class="rmc-title" title="${esc(item.title)}">${esc(item.title)}</div>
                  <div class="rmc-meta">
                    <span>${esc(m.kind)}</span>
                    ${dateBadge ? ` · <b>${esc(dateBadge)}</b>` : ""}
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    // Подгружаем постеры из GitHub Blob, если нужно
    if (typeof GitHubSync !== "undefined" && typeof GitHubSync.resolveAssetUrl === "function") {
      recentHost.querySelectorAll("img.rmc-poster").forEach(async img => {
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

    recentHost.querySelectorAll("[data-recent-uid]").forEach(card => {
      card.addEventListener("click", () => {
        if (typeof onSelectRecent === "function") {
          onSelectRecent(card.dataset.recentUid, card.dataset.recentTier);
        }
      });
    });
  }

  return { updateStats, renderRecentAdditions };
})();
