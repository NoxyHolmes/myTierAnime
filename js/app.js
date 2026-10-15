/* ═══════════════════ MAIN APPLICATION ORCHESTRATOR (myTierAnime v6.0 STUDIO SEARCH & MANUAL/AUTO SYNC) ═══════════════════ */
(() => {
  const LOCAL_STORAGE_KEY = "mta_2026_owner_draft_v11";
  let appData = null;
  let searchQuery = "";
  let selectedGenre = "ALL";
  let genreFilterSearch = "";
  let selectedStudio = "ALL";
  let studioFilterSearch = "";
  let activeView = "tiers";
  let lastRenderedSignature = "";

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
    DEFAULT_TIERS_TEMPLATE.forEach(def => {
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
    const hasOwnerToken = !!GitHubSync.getToken();
    let localObj = null;

    if (hasOwnerToken) {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          localObj = ensureSixTiers(JSON.parse(cached));
          appData = localObj;
          FXController.applyGlobalBackground(appData.meta || {});
        } catch {}
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    try {
      const remoteRaw = await GitHubSync.fetchFreshTiersFromApi(true);
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

    if (!appData) appData = ensureSixTiers(null);
    lastRenderedSignature = computeStateSignature(appData);
    await FXController.applyGlobalBackground(appData.meta || {});
  }

  /* Безопасный фоновый опрос для зрителей (с использованием ETag, чтобы не исчерпывать лимит 60 запросов GitHub API) */
  function startLiveViewerPolling() {
    async function checkRemote() {
      if (document.hidden || GitHubSync.isOwner()) return;
      try {
        const remoteRaw = await GitHubSync.fetchFreshTiersFromApi(false);
        if (!remoteRaw) return;
        const remoteObj = ensureSixTiers(remoteRaw);
        const newSig = computeStateSignature(remoteObj);
        if (newSig && newSig !== lastRenderedSignature) {
          appData = remoteObj;
          lastRenderedSignature = newSig;
          await FXController.applyGlobalBackground(appData.meta || {});
          render();
          showToast("✨ Информация на странице обновлена владельцем!", "#00f5ff");
        }
      } catch {}
    }

    setInterval(checkRemote, 8000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !GitHubSync.isOwner()) checkRemote();
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
    } catch (e) {
      console.warn("LocalStorage quota warning:", e);
    }
    StatsEngine.updateStats(appData.tiers);

    if (!GitHubSync.isOwner()) return;

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
      ? formatMoviesCount(m.totalMovies)
      : `${formatEpisodesCount(m.totalEpisodes)}${m.totalMovies ? ` + ${formatMoviesCount(m.totalMovies)}` : ""}`;

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
    if (!appData) return;
    document.querySelectorAll("#tiersRoot .tier").forEach((tierEl, idx) => {
      const l3dHost = tierEl.querySelector(".l3d");
      build3DLetter(l3dHost, appData.tiers[idx], idx);
    });
    const demoSeal = document.querySelector("#fxDemo .l3d");
    if (demoSeal && appData.tiers[0]) {
      build3DLetter(demoSeal, appData.tiers[0], 0);
    }
  }

  function render() {
    const host = document.getElementById("tiersRoot");
    if (!host || !appData || !Array.isArray(appData.tiers)) return;

    FXController.applyGlobalBackground(appData.meta || {});

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
      const titlesStr = formatTitlesCount(tierCount);

      const badgeBodyHtml = `
        <span class="seal-index">ТИР <b>${esc(tier.id)}</b></span>
        <div class="lstage">
          ${realismMarkup(tierIdx, tier)}${elementMarkup(tierIdx)}${orbitalMarkup()}
          <span class="seal-floor" aria-hidden="true"></span>
          <span class="ring r1"></span><span class="ring r2"></span>
          <div class="l3d" data-l="${esc(tier.id)}"></div>
        </div>
        <span class="seal-caption">${REALISM_NAMES[tierIdx % 6]}</span>
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

    host.querySelectorAll("img.card-poster[data-blob-sha]").forEach(async img => {
      const sha = img.dataset.blobSha;
      if (sha) {
        const resolved = await GitHubSync.resolveAssetUrl(img.getAttribute("src"), sha);
        if (resolved) img.src = resolved;
      }
    });

    rebuildAll3DLetters();
    FXController.observeTiers();
    StatsEngine.updateStats(appData.tiers);
    populateGenreDropdowns();
    populateStudioDropdown();
    bindTierInteractions();

    if (activeView === "calendar") {
      CalendarView.renderCalendar(appData.tiers, (uid, tierId) => {
        const tier = appData.tiers.find(t => t.id === tierId);
        const item = tier?.items.find(i => i.uid === uid);
        if (item && tier) Modals.showAnimeDetails(item, tier);
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

      listEl.querySelectorAll(".genre-opt-item").forEach(itemEl => {
        itemEl.addEventListener("click", () => {
          selectedGenre = itemEl.dataset.gVal;
          document.getElementById("genreDropdownLabel").textContent =
            selectedGenre === "ALL" ? "Все жанры" : selectedGenre;
          document.getElementById("genreDropdownMenu")?.classList.remove("open");
          render();
        });
      });
    }

    if (picker) {
      const eq = editorSearchTerm.trim().toLowerCase();
      const matchingEditor = sorted.filter(g => !eq || g.toLowerCase().includes(eq));
      picker.innerHTML = `<option value="">+ Выбрать жанр (${matchingEditor.length})...</option>` +
        matchingEditor.map(g => `<option value="${esc(g)}">${esc(g)}</option>`).join("");
    }
  }

  /* Заполнение выпадающего списка и поиска по КОНКРЕТНОЙ СТУДИИ */
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

      listEl.querySelectorAll(".genre-opt-item").forEach(itemEl => {
        itemEl.addEventListener("click", () => {
          selectedStudio = itemEl.dataset.stVal;
          document.getElementById("studioDropdownLabel").textContent =
            selectedStudio === "ALL" ? "Все студии" : selectedStudio;
          document.getElementById("studioDropdownMenu")?.classList.remove("open");
          render();
        });
      });
    }
  }

  function bindTierInteractions() {
    document.querySelectorAll("[data-add-to-tier]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (!GitHubSync.isOwner()) {
          showToast("Для добавления войдите как владелец", "#ff3c8c");
          Modals.openModal("authModal");
          return;
        }
        Modals.openEditorModal(btn.dataset.addToTier, null);
      });
    });

    document.querySelectorAll(".card-unit").forEach(unit => {
      unit.addEventListener("click", () => {
        const uid = unit.dataset.uid;
        const tierId = unit.dataset.tierId;
        const tier = appData.tiers.find(t => t.id === tierId);
        const item = tier?.items.find(i => i.uid === uid);
        if (item && tier) Modals.showAnimeDetails(item, tier);
      });
    });

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
      CalendarView.renderCalendar(appData.tiers, (uid, tierId) => {
        const tier = appData.tiers.find(t => t.id === tierId);
        const item = tier?.items.find(i => i.uid === uid);
        if (item && tier) Modals.showAnimeDetails(item, tier);
      });
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
    Modals.setDeleteHandler((uid, tierId) => {
      if (!GitHubSync.isOwner()) return;
      const tier = appData.tiers.find(t => t.id === tierId);
      if (!tier) return;
      const item = tier.items.find(i => i.uid === uid);
      tier.items = tier.items.filter(i => i.uid !== uid);
      render();
      saveAndAutoSync(`Delete ${item?.title || uid}`, true);
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

    /* КНОПКА ПРИНУДИТЕЛЬНОЙ СИНХРОНИЗАЦИИ ДЛЯ ВЛАДЕЛЬЦА */
    document.getElementById("btnSyncNowOwner")?.addEventListener("click", async () => {
      if (!GitHubSync.isOwner()) return;
      await saveAndAutoSync("Manual owner full sync", true);
    });

    // Выпадающий список Жанров
    const gBtn = document.getElementById("genreDropdownBtn");
    const gMenu = document.getElementById("genreDropdownMenu");
    const gSearch = document.getElementById("genreSearchInput");
    gBtn?.addEventListener("click", e => {
      e.stopPropagation();
      document.getElementById("studioDropdownMenu")?.classList.remove("open");
      gMenu?.classList.toggle("open");
      if (gMenu?.classList.contains("open")) gSearch?.focus();
    });
    gSearch?.addEventListener("input", () => {
      genreFilterSearch = gSearch.value;
      populateGenreDropdowns();
    });

    // Выпадающий список Студий
    const stBtn = document.getElementById("studioDropdownBtn");
    const stMenu = document.getElementById("studioDropdownMenu");
    const stSearch = document.getElementById("studioSearchInput");
    stBtn?.addEventListener("click", e => {
      e.stopPropagation();
      gMenu?.classList.remove("open");
      stMenu?.classList.toggle("open");
      if (stMenu?.classList.contains("open")) stSearch?.focus();
    });
    stSearch?.addEventListener("input", () => {
      studioFilterSearch = stSearch.value;
      populateStudioDropdown();
    });

    document.addEventListener("click", e => {
      if (!e.target.closest("#genreDropdown")) gMenu?.classList.remove("open");
      if (!e.target.closest("#studioDropdown")) stMenu?.classList.remove("open");
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
        await FXController.applyGlobalBackground(appData.meta, localBlobUrl);
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

    document.getElementById("authForm")?.addEventListener("submit", async e => {
      e.preventDefault();
      const tk = document.getElementById("ghTokenInput").value.trim();
      const rp = document.getElementById("ghRepoInput").value.trim() || GitHubSync.detectRepoFromLocation();

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

  window.addEventListener("DOMContentLoaded", async () => {
    FXController.init(rebuildAll3DLetters);
    bindGlobalUI();

    if (GitHubSync.getToken()) {
      document.body.classList.add("is-owner");
      GitHubSync.verifyToken().then(u => {
        if (u) updateOwnerBadge(u);
        else GitHubSync.logout();
      });
    }

    await loadInitialState();
    render();
    startLiveViewerPolling();
  });
})();
