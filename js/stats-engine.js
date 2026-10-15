/* ═══════════════════ ANALYTICS RIBBON: PROMINENT MOVIES & EPISODES COUNTER ═══════════════════ */
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
          <div class="stat-label">Всего просмотрено</div>
          <div class="stat-val">${totalTitles} <span style="font-size:13px;color:var(--ink-soft);">тайтлов</span></div>
        </div>
        <span style="font-size:26px;">📚</span>
      </div>

      <!-- Крупное разделение Серий и Фильмов, чтобы Фильмы было отлично видно -->
      <div class="stat-card" style="padding:10px 12px;">
        <div class="stat-dual-split">
          <div class="stat-split-box">
            <div class="stat-label">🎞 Серии</div>
            <div class="stat-val" style="color:#ffd76a;font-size:22px;">${sumEpisodes}</div>
          </div>
          <div class="stat-split-box movies-highlight">
            <div class="stat-label" style="color:#ffd6e7;font-weight:800;">🎬 Фильмы</div>
            <div class="stat-val" style="color:#ff5e7e;font-size:22px;text-shadow:0 0 12px rgba(255,94,126,0.55);">${sumMovies}</div>
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

      <div class="stat-card">
        <div>
          <div class="stat-label">Золотой фонд (S)</div>
          <div class="stat-val" style="color:#ffd76a;">${sTierCount} <span style="font-size:13px;color:var(--ink-soft);">тайтлов</span></div>
          <div class="stat-sub">Средний балл: <b style="color:#ffd76a;">★ ${avgScore}</b></div>
        </div>
        <span style="font-size:26px;">👑</span>
      </div>
    `;
  }

  return { updateStats };
})();
