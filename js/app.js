/* ═══════════════════ MAIN APPLICATION ORCHESTRATOR (myTierAnime v11.0 BGM & CLUSTER SYNC) ═══════════════════ */
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

  const SNAPSHOT_STORAGE_KEY = "mta_2026_instant_snapshot_v18";
  const LEGACY_KEYS = ["mta_2026_instant_snapshot_v17", "mta_2026_instant_snapshot_v16"];

  let appData = null;
  let searchQuery = "";
  let selectedGenre = "ALL";
  let genreFilterSearch = "";
  let selectedStudio = "ALL";
  let studioFilterSearch = "";
  let activeView = "tiers";
  let lastRenderedSignature = "";

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

  function ensureSixTiers(data) {
    if (!data || !Array.isArray(data.tiers) || data.tiers.length === 0) {
      return {
        meta: { title: "myTierAnime", bgImage: "", bgBlobSha: "", bgInline: "", bgDim: 55, bgBlur: 0, revision: 0 },
        tiers: JSON.parse(JSON.stringify(EMPTY_TIERS_SKELETON))
      };
    }
    data.meta = data.meta || {};
    data.meta.revision = Number(data.meta.revision || 1);
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
    return data;
  }

  function computeStateSignature(data) {
    if (!data || !Array.isArray(data.tiers)) return "";
    const tierSummary = data.tiers.map(t => `${t.id}:${(t.items || []).map(i => `${i.uid}_${i.score}_${i.posterBlobSha \vert{}\vert{} ""}_${(i.seasons || []).map(s => s.episodes).join("+")}`).join(",")}`).join("|");
    return `${data.meta?.revision || 0}_${tierSummary}_${data.meta?.bgBlobSha || ""}_${data.meta?.bgImage || ""}_${data.meta?.bgDim}_${data.meta?.bgBlur}`;
  }

  function readCachedSnapshot() {
    for (const key of [SNAPSHOT_STORAGE_KEY, ...LEGACY_KEYS]) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.tiers) && parsed.tiers.length > 0) {
            return ensureSixTiers(parsed);
          }
        } catch {}
      }
    }
    return null;
  }

  function writeCachedSnapshot(data) {
    if (!data) return;
    try {
      localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }

  async function loadInitialState() {
    const hasOwnerToken = typeof GitHubSync !== "undefined" && !!GitHubSync.getToken();
    const cachedSnapshot = readCachedSnapshot();

    if (cachedSnapshot) {
      appData = cachedSnapshot;
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
        const localRev = Number(cachedSnapshot?.meta?.revision || 0);
        const remoteRev = Number(remoteObj?.meta?.revision || 0);

        if (!cachedSnapshot) {
          appData = remoteObj;
          writeCachedSnapshot(appData);
        } else if (!hasOwnerToken) {
          if (remoteRev >= localRev) {
            appData = remoteObj;
            writeCachedSnapshot(appData);
          }
        } else {
          if (remoteRev > localRev) {
            appData = remoteObj;
            writeCachedSnapshot(appData);
          }
        }
      }
    } catch (e) {
      console.warn("Remote load fallback:", e);
    }

    if (!appData) {
      appData = ensureSixTiers(null);
    }

    const newSig = computeStateSignature(appData);
    if (newSig !== lastRenderedSignature || !cachedSnapshot) {
      lastRenderedSignature = newSig;
      render();
    } else if (typeof FXController !== "undefined" && typeof FXController.applyGlobalBackground === "function") {
      FXController.applyGlobalBackground(appData.meta || {});
    }
  }

  function startLiveViewerPolling() {
    async function checkRemote() {
      if (document.hidden || (typeof GitHubSync !== "undefined" && GitHubSync.isOwner())) return;
      try {
        if (typeof GitHubSync === "undefined" || typeof GitHubSync.fetchFreshTiersFromApi !== "function") return;
        const remoteRaw = await GitHubSync.fetchFreshTiersFromApi(true);
        if (!remoteRaw) return;
        const remoteObj = ensureSixTiers(remoteRaw);
        const newSig = computeStateSignature(remoteObj);
        if (newSig && newSig !== lastRenderedSignature) {
          appData = remoteObj;
          lastRenderedSignature = newSig;
          writeCachedSnapshot(appData);
          if (typeof FXController !== "undefined" && typeof FXController.applyGlobalBackground === "function") {
            await FXController.applyGlobalBackground(appData.meta || {});
          }
          render();
          showToast("✨ Информация обновлена!", "#00f5ff");
        }
      } catch {}
    }

    setInterval(checkRemote, 6000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !(typeof GitHubSync !== "undefined" && GitHubSync.isOwner())) checkRemote();
    });
    window.addEventListener("focus", () => {
      if (!(typeof GitHubSync !== "undefined" && GitHubSync.isOwner())) checkRemote();
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

    writeCachedSnapshot(appData);

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
        showToast("✔ Вся информация, музыка и фон успешно синхронизированы для всех браузеров!", "#38ef7d");
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

    const displayPosterSrc = item.posterInline || item.poster || "https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime";

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
          ${item.score ? `<span class="card-score-badge">★ ${esc(item.score)}</span>` : ""}

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
          <div class="cum-episodes-line" title="${esc(countLabel)}">
            🎞 ${countLabel}
          </div>
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
      host.querySelectorAll("img.card-poster").forEach(async img => {
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
        Modals.openEditor
