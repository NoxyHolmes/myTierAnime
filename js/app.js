/* ═══════════════════ MAIN APPLICATION ORCHESTRATOR (myTierAnime v7.0 SELF-HEALING & CRASH-PROOF) ═══════════════════ */
(() => {
  /* 1. ВСТРОЕННЫЕ ЗАЩИТНЫЕ ФУНКЦИИ (на случай, если в браузере закешировался старый utils.js) */
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
  if (!Array.isArray(window.ALL_ANIME_STUDIOS)) {
    window.ALL_ANIME_STUDIOS = [
      "A-1 Pictures", "Bones", "CloverWorks", "CoMix Wave Films", "David Production",
      "Doga Kobo", "J.C.Staff", "Kyoto Animation", "Lerche", "Liber", "Liden Films",
      "Madhouse", "MAPPA", "OLM", "OLM / TOHO animation", "P.A. Works", "Pierrot",
      "Production I.G", "Science SARU", "Shaft", "Silver Link.", "Studio Bind",
      "Studio Deen", "Studio Ghibli", "Sunrise", "TMS Entertainment", "Toei Animation",
      "Trigger", "Ufotable", "White Fox", "Wit Studio"
    ];
  }

  const LOCAL_STORAGE_KEY = "mta_2026_owner_draft_v14";
  let appData = null;
  let searchQuery = "";
  let selectedGenre = "ALL";
  let genreFilterSearch = "";
  let selectedStudio = "ALL";
  let studioFilterSearch = "";
  let activeView = "tiers";
  let lastRenderedSignature = "";

  /* Встроенные стартовые данные, чтобы экран НИКОГДА не был пустым */
  const BUILTIN_FALLBACK_TIERS = [
    {
      id: "S", rank: 1, name: "Шедевры", subtitle: "Лучшие и незабываемые тайтлы на все времена", hue: 45,
      items: [
        {
          uid: "anime-cotn-2022", kind: "TV Сериал", title: "Песнь ночных сов", origTitle: "Yofukashi no Uta",
          year: 2022, studio: "Liden Films", score: 10.0, reaction: "👑 Шедевр",
          genres: ["Сверхъестественное", "Романтика", "Вампиры"],
          poster: "https://shikimori.one/system/animes/original/48926.jpg",
          comment: "Неоновая эстетика ночного города, потрясающий саундтрек Creepy Nuts и харизма Надзуны Нанакусы.",
          seasons: [
            { title: "Сезон 1", type: "TV Сериал", episodes: 13, epMinutes: 23, date: "12.08.2024", note: "Первый просмотр" },
            { title: "Сезон 1 (Rewatch)", type: "TV Сериал", episodes: 13, epMinutes: 23, date: "18.06.2026", note: "Пересмотр" }
          ]
        },
        {
          uid: "anime-frieren-2023", kind: "TV Сериал", title: "Провожающая в последний путь Фрирен", origTitle: "Sousou no Frieren",
          year: 2023, studio: "Madhouse", score: 9.9, reaction: "💎 Эталон",
          genres: ["Фэнтези", "Приключения", "Драма"],
          poster: "https://shikimori.one/system/animes/original/52991.jpg",
          comment: "Глубокая, меланхоличная и невероятно красивая история о течении времени и памяти о товарищах.",
          seasons: [
            { title: "Сезон 1", type: "TV Сериал", episodes: 28, epMinutes: 24, date: "24.04.2026", note: "Полный просмотр" }
          ]
        },
        {
          uid: "anime-oshinoko-2023", kind: "TV Сериал", title: "Звёздное дитя", origTitle: "Oshi no Ko",
          year: 2023, studio: "Doga Kobo", score: 9.8, reaction: "✨ Фаворит",
          genres: ["Драма", "Музыка", "Триллер"],
          poster: "https://shikimori.one/system/animes/original/52034.jpg",
          comment: "Феноменальная режиссура, пронзительный пролог и легендарный трек Idol от YOASOBI.",
          seasons: [
            { title: "Пролог", type: "Спешл", episodes: 1, epMinutes: 82, date: "10.05.2025", note: "Премьера" },
            { title: "Сезон 1", type: "TV Сериал", episodes: 10, epMinutes: 24, date: "15.05.2025", note: "1 сезон" },
            { title: "Сезон 2", type: "TV Сериал", episodes: 13, epMinutes: 24, date: "05.10.2026", note: "2 сезон" }
          ]
        }
      ]
    },
    {
      id: "A", rank: 2, name: "Отличные", subtitle: "Яркие и очень качественные работы", hue: 185,
      items: [
        {
          uid: "anime-apothecary-2023", kind: "TV Сериал", title: "Монолог фармацевта", origTitle: "Kusuriya no Hitorigoto",
          year: 2023, studio: "OLM / TOHO animation", score: 9.3, reaction: "🧪 Интрига",
          genres: ["Детектив", "Исторический", "Драма"],
          poster: "https://shikimori.one/system/animes/original/54492.jpg",
          comment: "Блестящий детективный сюжет в декорациях императорского двора.",
          seasons: [{ title: "Сезон 1", type: "TV Сериал", episodes: 24, epMinutes: 24, date: "14.03.2026", note: "1 сезон" }]
        },
        {
          uid: "anime-yourname-2016", kind: "Фильм", title: "Твоё имя", origTitle: "Kimi no Na wa.",
          year: 2016, studio: "CoMix Wave Films", score: 9.4, reaction: "☄️ Классика",
          genres: ["Романтика", "Драма", "Сверхъестественное"],
          poster: "https://shikimori.one/system/animes/original/32281.jpg",
          comment: "Визуальный шедевр Макото Синкая с музыкой RADWIMPS.",
          seasons: [{ title: "Полнометражный фильм", type: "Фильм", episodes: 1, epMinutes: 106, date: "19.01.2026", note: "4K" }]
        }
      ]
    },
    {
      id: "B", rank: 3, name: "Хорошие", subtitle: "Достойные внимания и атмосферные тайтлы", hue: 275,
      items: [
        {
          uid: "anime-sololeveling-2024", kind: "TV Сериал", title: "Поднятие уровня в одиночку", origTitle: "Ore dake Level Up na Ken",
          year: 2024, studio: "A-1 Pictures", score: 8.5, reaction: "🔥 Экшен",
          genres: ["Экшен", "Фэнтези", "Приключения"],
          poster: "https://shikimori.one/system/animes/original/52299.jpg",
          comment: "Отличная динамика боёв и музыка Хироюки Савано.",
          seasons: [{ title: "Сезон 1", type: "TV Сериал", episodes: 12, epMinutes: 24, date: "02.02.2026", note: "Просмотр" }]
        }
      ]
    },
    {
      id: "C", rank: 4, name: "Нормальные", subtitle: "Средние тайтлы на один вечер", hue: 148,
      items: [
        {
          uid: "anime-bartender-2024", kind: "TV Сериал", title: "Бармен: Бокал бога", origTitle: "Bartender: Kami no Glass",
          year: 2024, studio: "Liber", score: 7.9, reaction: "🍸 Уют",
          genres: ["Повседневность", "Драма"],
          poster: "https://shikimori.one/system/animes/original/53407.jpg",
          comment: "Спокойный вечерний сериал с приятной атмосферой камерного бара.",
          seasons: [{ title: "Сезон 1", type: "TV Сериал", episodes: 12, epMinutes: 24, date: "11.05.2026", note: "Вечерний отдых" }]
        }
      ]
    },
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
    if (!data || !Array.isArray(data.tiers) || data.tiers.length === 0) {
      return {
        meta: { title: "myTierAnime", bgImage: "", bgBlobSha: "", bgDim: 55, bgBlur: 0, revision: 1 },
        tiers: JSON.parse(JSON.stringify(BUILTIN_FALLBACK_TIERS))
      };
    }
    data.meta = data.meta || {};
    data.meta.revision = Number(data.meta.revision || 1);
    BUILTIN_FALLBACK_TIERS.forEach(def => {
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
    return data;
  }

  function computeStateSignature(data) {
    if (!data) return "";
    return `${data.meta?.updatedAt || ""}_${data.meta?.revision || 0}_${data.meta?.bgBlobSha || ""}_${data.meta?.bgImage || ""}_${data.meta?.bgDim}_${data.meta?.bgBlur}`;
  }

  async function loadInitialState() {
    // Сначала ставим стартовый шаблон, чтобы интерфейс отрисовался за 1 миллисекунду
    appData = ensureSixTiers(null);

    const hasOwnerToken = typeof GitHubSync !== "undefined" && !!GitHubSync.getToken();
    let localObj = null;

    if (hasOwnerToken) {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          localObj = ensureSixTiers(JSON.parse(cached));
          appData = localObj;
        } catch {}
      }
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
        if (!hasOwnerToken) {
          appData = remoteObj;
        } else {
          const localRev = Number(localObj?.meta?.revision || 0);
          const remoteRev = Number(remoteObj?.meta?.revision || 0);
          if (!localObj || remoteRev >= localRev) {
            appData = remoteObj;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
          }
        }
      }
    } catch (e) {
      console.warn("Remote load fallback:", e);
    }

    lastRenderedSignature = computeStateSignature(appData);
    if (typeof FXController !== "undefined" && typeof FXController.applyGlobalBackground === "function") {
      await FXController.applyGlobalBackground(appData.meta || {});
    }
  }

  function startLiveViewerPolling() {
    async function checkRemote() {
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
          if (typeof FXController !== "undefined" && typeof FXController.applyGlobalBackground === "function") {
            await FXController.applyGlobalBackground(appData.meta || {});
          }
          render();
          showToast("✨ Информация на странице обновлена владельцем!", "#00f5ff");
        }
      } catch {}
    }

    setInterval(checkRemote, 8000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !(typeof GitHubSync !== "undefined" && GitHubSync.isOwner())) checkRemote();
    });
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
    appData.meta = appData.meta || {};
    appData.meta.revision = Number(appData.meta.revision || 1) + 1;
    appData.meta.updatedAt = new Date().toISOString();
    lastRenderedSignature = computeStateSignature(appData);

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
    } catch {}

    if (typeof StatsEngine !== "undefined" && typeof StatsEngine.updateStats === "function") {
      StatsEngine.updateStats(appData.tiers);
    }

    if (typeof GitHubSync === "undefined" || !GitHubSync.isOwner()) return;

    if (isSyncing) {
      pendingSync = true;
      return;
    }

    isSyncing = true;
    setSyncIndicator("⏳ Синхронизация с GitHub...", "#00f5ff");
    const syncBtn = document.getElementById("btnSyncNowOwner");
    if (syncBtn) syncBtn.textContent = "⏳ Синхронизация...";

    try {
      await GitHubSync.commitTiersToGitHub(appData, reason);
      setSyncIndicator(`☁ Синхронизировано (${new Date().toLocaleTimeString("ru-RU")})`, "#38ef7d");
      if (syncBtn) syncBtn.textContent = "🔄 Синхронизировать со всеми";
      if (showSuccessToast) {
        showToast("✔ Вся информация и фон успешно синхронизированы со всеми пользователями по ссылке!", "#38ef7d");
      }
    } catch (err) {
      setSyncIndicator("⚠ Ошибка синхронизации: проверьте токен/репозиторий", "#ff5e7e");
      if (syncBtn) syncBtn.textContent = "🔄 Повторить синхронизацию";
      showToast("Ошибка отправки в GitHub: " + err.message, "#ff3c8c");
    } finally {
      isSyncing = false;
      if (pendingSync) {
        pendingSync = false;
        saveAndAutoSync("Queued sync", false);
      }
    }
  }

  function cardEl(item, idx, tierId) {
    const m = calcItemMetrics(item);
    const yr = m.latestYear || item.year || "";
    const yearBadgeHtml = yr ? `<span class="card-year-3d" aria-hidden="true">${yr}</span>` : "";

    const countLabel = m.totalMovies > 0 && m.totalEpisodes === 0
      ? window.formatMoviesCount(m.totalMovies)
      : `${window.formatEpisodesCount(m.totalEpisodes)}${m.totalMovies ? ` + ${window.formatMoviesCount(m.totalMovies)}` : ""}`;

    return `
      <div class="card-unit" draggable="true" data-uid="${esc(item.uid)}" data-tier-id="${esc(tierId)}">
        <article class="card" data-uid="${esc(item.uid)}" data-tier-id="${esc(tierId)}">
          <img class="card-poster" draggable="false" src="${esc(item.poster)}" data-blob-sha="${esc(item.posterBlobSha || "")}" alt="${esc(item.title)}" loading="lazy"
               onerror="this.src='https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime'">
          <div class="scrim"></div>
          <span class="holo-foil" aria-hidden="true"></span>
          ${tierId === "S" ? floralFrame() + `<span class="card-coronet" aria-hidden="true">${royalCrown("card" + item.uid)}</span>` : ""}
          <span class="rank">${idx + 1}</span>
          ${yearBadgeHtml}
          <span class="card-score-badge">★ ${esc(item.score)}</span>
          ${reactionHtml(item)}

          <div class="card-info">
            <h3 class="card-title">${esc(item.title)}</h3>
            <div class="card-sub">${esc(item.year || "")} · ${esc(item.studio || "")}</div>
          </div>
        </article>

        <div class="card-under-meta">
          <div class="cum-row">
            <span class="cum-kind">${esc(m.kind)}</span>
            <span class="cum-seasons-badge">Частей: <b>${m.seasons.length}</b></span>
          </div>
          <div class="cum-stats">
            <span>🎞 ${countLabel}</span>
            <span class="cum-hours">⏱ ${formatHours(m.totalHours)} ч.</span>
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

  function render() {
    const host = document.getElementById("tiersRoot");
    if (!host || !appData || !Array.isArray(appData.tiers)) return;

    if (typeof FXController !== "undefined" && typeof FXController.applyGlobalBackground === "function") {
      FXController.applyGlobalBackground(appData.meta || {});
    }

    let grandTotal = 0;
    appData.tiers.forEach(t => grandTotal += (t.items || []).length);

    const q = searchQuery.trim().toLowerCase();

    host.innerHTML = appData.tiers.map((tier, tierIdx) => {
      const filteredItems = (tier.items || []).filter(it => {
        const matchText = !q ||
          (it.title && it.title.toLowerCase().includes(q)) ||
          (it.origTitle && it.origTitle.toLowerCase().includes(q)) ||
          (it.studio && it.studio.toLowerCase().includes(q));
        const matchGenre = selectedGenre === "ALL" || (it.genres || []).some(g => g.toLowerCase() === selectedGenre.toLowerCase());
        const matchStudio = selectedStudio === "ALL" ||
          (it.studio && it.studio.toLowerCase().includes(selectedStudio.toLowerCase()));
        return matchText && matchGenre && matchStudio;
      });

      const tierCount = (tier.items || []).length;
      const tierPercent = grandTotal > 0 ? Math.round((tierCount / grandTotal) * 100) : 0;
      const titlesStr = window.formatTitlesCount(tierCount);

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
                <h2>
                  ${esc(tier.name)}
                  <span class="tier-count-pill">${tierCount} ${titlesStr.replace(/^\d+\s*/, "")} (${tierPercent}%)</span>
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
      host.querySelectorAll("img.card-poster[data-blob-sha]").forEach(async img => {
        const sha = img.dataset.blobSha;
        if (sha) {
          const resolved = await GitHubSync.resolveAssetUrl(img.getAttribute("src"), sha);
          if (resolved) img.src = resolved;
        }
      });
    }

    rebuildAll3DLetters();
    if (typeof FXController !== "undefined" && typeof FXController.observeTiers === "function") {
      FXController.observeTiers();
    }
    if (typeof StatsEngine !== "undefined" && typeof StatsEngine.updateStats === "function") {
      StatsEngine.updateStats(appData.tiers);
    }
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
    const set = new Set(window.ALL_ANIME_GENRES || []);
    appData?.tiers?.forEach(t => {
      (t.items || []).forEach(it => (it.genres || []).forEach(g => set.add(g)));
    });
    return [...set].sort((a, b) => a.localeCompare(b, "ru"));
  }

  function getSortedAllStudios() {
    const set = new Set(window.ALL_ANIME_STUDIOS || []);
    appData?.tiers?.forEach(t => {
      (t.items || []).forEach(it => {
        if (it.studio && it.studio.trim()) set.add(it.studio.trim());
      });
    });
    return [...set].sort((a, b) => a.localeCompare(b, "en"));
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

  function populateStudioDropdown() {
    const listEl = document.getElementById("studioOptionsList");
    const datalist = document.getElementById("studioPresetList");
    const sortedStudios = getSortedAllStudios();

    if (datalist && !datalist.dataset.populated) {
      datalist.innerHTML = sortedStudios.map(s => `<option value="${esc(s)}"></option>`).join("");
      datalist.dataset.populated = "1";
    }

    if (listEl) {
      const q = studioFilterSearch.trim().toLowerCase();
      const matching = sortedStudios.filter(s => !q || s.toLowerCase().includes(q));
      listEl.innerHTML =
        `<div class="genre-opt-item ${selectedStudio === "ALL" ? "active" : ""}" data-st-val="ALL">🎬 Все студии (${sortedStudios.length})</div>` +
        matching.map(s => `<div class="genre-opt-item ${selectedStudio === s ? "active" : ""}" data-st-val="${esc(s)}">${esc(s)}</div>`).join("");
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
      DragDropEngine.bindCardsAndGrids((uid, fromTierId, toTierId, targetUid) => {
        if (!GitHubSync.isOwner()) return;
        const fromTier = appData.tiers.find(t => t.id === fromTierId);
        const toTier = appData.tiers.find(t => t.id === toTierId);
        if (!fromTier || !toTier) return;
        const idx = fromTier.items.findIndex(i => i.uid === uid);
        if (idx === -1) return;
        const [moved] = fromTier.items.splice(idx, 1);

        if (targetUid) {
          const destIdx = toTier.items.findIndex(i => i.uid === targetUid);
          if (destIdx !== -1) toTier.items.splice(destIdx, 0, moved);
          else toTier.items.push(moved);
        } else {
          toTier.items.push(moved);
        }
        render();
        saveAndAutoSync(`Move ${moved.title} to ${toTierId}`, false);
        showToast(`«${moved.title}» перемещён в тир ${toTierId}`, "#00f5ff");
      });
    }
  }

  function toggleCalendarView(forceMode) {
    activeView = forceMode || (activeView === "tiers" ? "calendar" : "tiers");
    const tiersEl = document.getElementById("tiersRoot");
    const calEl = document.getElementById("calendarRoot");
    const calBtn = document.getElementById("btnToggleCalendar");

    if (activeView === "calendar") {
      tiersEl.style.display = "none";
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
      tiersEl.style.display = "flex";
      if (calBtn) {
        calBtn.classList.remove("active");
        calBtn.innerHTML = "📅 Календарь";
      }
    }
  }

  function bindGlobalUI() {
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
      Modals.openEditorModal("S", null);
    });

    document.getElementById("btnSyncNowOwner")?.addEventListener("click", async () => {
      if (!GitHubSync.isOwner()) return;
      await saveAndAutoSync("Manual owner full sync", true);
    });

    document.addEventListener("click", e => {
      const gMenu = document.getElementById("genreDropdownMenu");
      const stMenu = document.getElementById("studioDropdownMenu");

      if (e.target.closest("#genreDropdownBtn")) {
        e.preventDefault();
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

    const editorGSearch = document.getElementById("editorGenreSearch");
    editorGSearch?.addEventListener("input", () => {
      populateGenreDropdowns(editorGSearch.value);
    });

    const picker = document.getElementById("genreQuickPicker");
    picker?.addEventListener("change", () => {
      const val = picker.value;
      if (!val) return;
      const inp = document.getElementById("fGenres");
      const currentList = inp.value.split(",").map(s => s.trim()).filter(Boolean);
      if (!currentList.includes(val)) {
        currentList.push(val);
        inp.value = currentList.join(", ");
      }
      picker.value = "";
    });

    const posterFileInp = document.getElementById("fPosterFile");
    let pendingPosterBlobSha = "";
    posterFileInp?.addEventListener("change", async () => {
      const file = posterFileInp.files?.[0];
      if (!file) return;
      try {
        showToast("Загрузка оригинальной обложки в GitHub...", "#00f5ff");
        const uploaded = await GitHubSync.uploadAssetFile(file, "posters");
        document.getElementById("fPoster").value = uploaded.path;
        pendingPosterBlobSha = uploaded.blobSha;
        showToast("✔ Обложка загружена!", "#38ef7d");
      } catch (err) {
        showToast("Ошибка загрузки обложки: " + err.message, "#ff3c8c");
      }
    });

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
        showToast("⚡ Отправка фона в GitHub для всех зрителей...", "#00f5ff");

        const uploaded = await GitHubSync.uploadAssetFile(file, "backgrounds");
        appData.meta.bgImage = uploaded.path;
        appData.meta.bgBlobSha = uploaded.blobSha;
        appData.meta.bgMime = uploaded.mime;

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

    const shikiInput = document.getElementById("shikiSearchInput");
    const shikiBox = document.getElementById("shikiResults");
    let debounceTimer = 0;
    shikiInput?.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      const q = shikiInput.value.trim();
      if (q.length < 2) {
        shikiBox.classList.remove("show");
        return;
      }
      debounceTimer = setTimeout(async () => {
        const results = await AnimeSearchAPI.searchAnime(q);
        if (!results.length) {
          shikiBox.classList.remove("show");
          return;
        }
        shikiBox.innerHTML = results.map((r, i) => `
          <div class="shiki-item" data-idx="${i}">
            <img src="${esc(r.poster)}" alt="">
            <div>
              <div style="font-size:12.5px;font-weight:700;color:#fff;">${esc(r.title)}</div>
              <div style="font-size:11px;color:var(--ink-soft);">${esc(r.kind)} · ${esc(r.year)} · ${r.episodes} эп. · ★ ${esc(r.score)}</div>
            </div>
          </div>
        `).join("");
        shikiBox.classList.add("show");

        shikiBox.querySelectorAll(".shiki-item").forEach(el => {
          el.addEventListener("click", () => {
            const picked = results[+el.dataset.idx];
            document.getElementById("fTitle").value = picked.title;
            document.getElementById("fOrigTitle").value = picked.origTitle;
            document.getElementById("fKind").value = picked.kind;
            document.getElementById("fYear").value = picked.year;
            document.getElementById("fScore").value = picked.score;
            document.getElementById("fPoster").value = picked.poster;
            pendingPosterBlobSha = "";
            document.getElementById("fStudio").value = picked.studio;
            document.getElementById("fGenres").value = (picked.genres || []).join(", ");

            const firstRow = document.querySelector("#seasonsEditorList .season-row");
            if (firstRow) {
              firstRow.querySelector(".s-type").value = picked.kind;
              firstRow.querySelector(".s-eps").value = picked.episodes;
              firstRow.querySelector(".s-mins").value = picked.epMinutes;
              Modals.recalculateSeasonsPreview();
            }
            shikiBox.classList.remove("show");
            showToast("Метаданные заполнены!", "#38ef7d");
          });
        });
      }, 320);
    });

    document.getElementById("animeEditorForm")?.addEventListener("submit", e => {
      e.preventDefault();
      if (!GitHubSync.isOwner()) {
        showToast("Ошибка: сохранять может только владелец!", "#ff3c8c");
        return;
      }

      const uid = document.getElementById("fUid").value || ("anime-" + Date.now());
      const targetTierId = document.getElementById("fTier").value;
      const seasons = Modals.readSeasonsFromEditor();

      const newItem = {
        uid,
        kind: document.getElementById("fKind").value,
        title: document.getElementById("fTitle").value.trim(),
        origTitle: document.getElementById("fOrigTitle").value.trim(),
        year: parseInt(document.getElementById("fYear").value, 10) || 2026,
        studio: document.getElementById("fStudio").value.trim(),
        score: parseFloat(document.getElementById("fScore").value) || 9.0,
        reaction: document.getElementById("fReaction").value.trim(),
        poster: document.getElementById("fPoster").value.trim(),
        posterBlobSha: pendingPosterBlobSha || undefined,
        genres: document.getElementById("fGenres").value.split(",").map(s => s.trim()).filter(Boolean),
        comment: document.getElementById("fComment").value.trim(),
        seasons,
        watched: seasons.map(s => ({ date: s.date, note: s.title }))
      };
      pendingPosterBlobSha = "";

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
        destTier.items.unshift(newItem);
      }

      render();
      saveAndAutoSync(`Save ${newItem.title} in tier ${targetTierId}`, true);
      Modals.closeModal("editorModal");
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
        : "geraltschwarzenegger-svg/myTierAnime";
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

    document.getElementById("btnExportJson")?.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(appData, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `myTierAnime-backup.json`;
      a.click();
      showToast("JSON-база экспортирована");
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
    } catch (e) {
      console.warn("FX init warning:", e);
    }

    try {
      bindGlobalUI();
    } catch (e) {
      console.warn("UI bind warning:", e);
    }

    // Немедленно рисуем стартовые тиры, не дожидаясь сети
    appData = ensureSixTiers(null);
    render();

    if (typeof GitHubSync !== "undefined" && GitHubSync.getToken()) {
      document.body.classList.add("is-owner");
      GitHubSync.verifyToken().then(u => {
        if (u) updateOwnerBadge(u);
        else GitHubSync.logout();
      });
    }

    await loadInitialState();
    render();
    startLiveViewerPolling();
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", bootstrapApp);
  } else {
    bootstrapApp();
  }
})();
