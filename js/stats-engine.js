/* ═══════════════════ ANALYTICS RIBBON: EPISODES + MOVIES & TOTAL HOURS + DAYS ═══════════════════ */
const StatsEngine = (() => {
  function updateStats(tiers) {
    const host = document.getElementById("statsRibbon");
    if (!host || !Array.isArray(tiers)) return;

    let totalTitles = 0;
    let totalScoreSum = 0;
    let sTierCount = 0;
    let sumEpisodes = 0;
    let sumMovies = 0;
    let sumHours = 0;

    tiers.forEach(t => {
      const items = t.items || [];
      totalTitles += items.length;
      if (t.id === "S") sTierCount = items.length;
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

    host.innerHTML = `
      <div class="stat-card">
        <div>
          <div class="stat-label">Всего в Каноне</div>
          <div class="stat-val">${totalTitles} <span style="font-size:12px;color:var(--ink-soft);">тайтлов</span></div>
          <div class="stat-sub">В 6 тирах (S · A · B · C · D · E)</div>
        </div>
        <span style="font-size:24px;">📚</span>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-label">Серии и Фильмы</div>
          <div class="stat-val" style="color:#ffd76a;">${sumEpisodes} <span style="font-size:12px;color:var(--ink-soft);">серий</span></div>
          <div class="stat-sub">🎬 Полнометражных фильмов: <b style="color:#fff;">${sumMovies}</b></div>
        </div>
        <span style="font-size:24px;">🎞️</span>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-label">Всего времени</div>
          <div class="stat-val" style="color:#00f5ff;">${formatHours(sumHours)} <span style="font-size:12px;color:var(--ink-soft);">часов</span></div>
          <div class="stat-sub">⏳ Общее количество дней: <b style="color:#fff;">${totalDays} дн.</b></div>
        </div>
        <span style="font-size:24px;">⏱️</span>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-label">Ранг S · Корона</div>
          <div class="stat-val" style="color:#ff5e7e;">${sTierCount} <span style="font-size:12px;color:var(--ink-soft);">шедевров</span></div>
          <div class="stat-sub">Средний балл: <b style="color:#ffd76a;">★ ${avgScore}</b></div>
        </div>
        <span style="font-size:24px;">👑</span>
      </div>
    `;
  }

  return { updateStats };
})();
