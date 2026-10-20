/* ═══════════════════ SAFE STATS ENGINE STUB (v22.0) ═══════════════════ */
var StatsEngine = window.StatsEngine || {
  updateStats: function (tiers) {
    if (typeof window.__renderTopStatsRibbon === "function") {
      window.__renderTopStatsRibbon(tiers);
    }
  },
  openDetailedStatsModal: function (tiers, onSelectAnime) {
    if (typeof window.__openDetailedStatsModal === "function") {
      window.__openDetailedStatsModal(tiers, onSelectAnime);
    }
  }
};
window.StatsEngine = StatsEngine;
