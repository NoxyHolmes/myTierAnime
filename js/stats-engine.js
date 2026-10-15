/* ═══════════════════ STATS RIBBON: AVERAGE SCORE & PROMINENT MOVIES/EPISODES ═══════════════════ */
const StatsEngine = (() => {
  function updateStats(tiers) {
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

    host.innerHTML = `
      <div class="stat-card">
        <div>
          <div class="stat-label">Всего просмотрено</div>
          <div class="stat-val">${totalTitles} <span style="font-size:13px;color:var(--ink-soft);">${titlesStr.replace(/^\d+\s*/, "")}</span></div>
          <div class="stat-sub">Средний балл коллекции: <b style="color:#ffd76a;">★ ${avgScore}</b></div>
        </div>
        <span style="font-size:26px;">📚</span>
      </div>

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

  return { updateStats };
})();
