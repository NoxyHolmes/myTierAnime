/* ═══════════════════ MAIN APPLICATION ORCHESTRATOR (myTierAnime v6.2 OWNER BG DIM/BLUR SYNC) ═══════════════════ */
(() => {
  const LOCAL_STORAGE_KEY = "mta_2026_owner_draft_v12";
  let appData = null;
  let searchQuery = "";
  let selectedGenre = "ALL";
  let genreFilterSearch = "";
  let selectedStudio = "ALL";
  let studioFilterSearch = "";
  let activeView = "tiers";
  let lastRenderedSignature = "";
  let bgSliderDebounce = 0;

  const DEFAULT_TIERS_TEMPLATE = [
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

  function ensureSixTiers(data) {
    if (!data || !Array.isArray(data.tiers)) {
      return { meta: { title: "myTierAnime", bgImage: "", bgBlobSha: "", bgDim: 55, bgBlur: 0, revision: 1 }, tiers: DEFAULT_TIERS_TEMPLATE };
    }
    data.meta = data.meta || {};
    data.meta.revision = Number(data.meta.revision || 1);
    if (data.meta.bgDim === undefined) data.meta.bgDim = 55;
    if (data.meta.bgBlur === undefined) data.meta.bgBlur = 0;

    DEFAULT_TIERS_TEMPLATE.forEach(def => {
      if (!data.tiers.find(t => t.id === def.id)) {
        data.tiers.push(JSON.parse(JSON.stringify(def)));
      }
    });
    data.tiers.forEach(t => {
      if (CLEAN_TITLES_
