/* ═══════════════════ ANALYTICS & STATS RIBBON ENGINE ═══════════════════ */
const StatsEngine = (() => {
  function updateStats(tiers) {
    const host = document.getElementById("statsRibbon");
    if (!host || !Array.isArray(tiers)) return;

    let totalTitles = 0;
    let totalScoreSum = 0;
    let totalWatches = 0;
    let sTierCount = 0;

    tiers.forEach(t => {
      const items = t.items || [];
      totalTitles += items.length;
      if (t.id === "S") sTierCount = items.length;
      items.forEach(it => {
        totalScoreSum += parseFloat(it.score || 0);
        totalWatches += normWatched(it.watched).length || 1;
      });
    });

    const avgScore = totalTitles ? (totalScoreSum / totalTitles).toFixed(2) : "0.00";

    host.innerHTML = `
      <div class="stat-card">
        <div>
          <div class="stat-label">Всего в Каноне</div>
          <div class="stat-val">${totalTitles} <span style="font-size:12px;color:var(--ink-soft);">тайтлов</span></div>
        </div>
        <span style="font-size:24px;">📚</span>
      </div>
      <div class="stat-card">
        <div>
          <div class="stat-label">Ранг S · Корона</div>
          <div class="stat-val" style="color:#ffd76a;">${sTierCount} <span style="font-size:12px;color:var(--ink-soft);">шедевров</span></div>
        </div>
        <span style="font-size:24px;">👑</span>
      </div>
      <div class="stat-card">
        <div>
          <div class="stat-label">Средний балл</div>
          <div class="stat-val" style="color:#00f5ff;">${avgScore} <span style="font-size:12px;color:var(--ink-soft);">/ 10</span></div>
        </div>
        <span style="font-size:24px;">💎</span>
      </div>
      <div class="stat-card">
        <div>
          <div class="stat-label">Сессий просмотра</div>
          <div class="stat-val" style="color:#b57cff;">${totalWatches} <span style="font-size:12px;color:var(--ink-soft);">записей</span></div>
        </div>
        <span style="font-size:24px;">🎬</span>
      </div>
    `;
  }

  return { updateStats };
})();
