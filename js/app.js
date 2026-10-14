/* ═══════════════════ MAIN APPLICATION ORCHESTRATOR (myTierAnime v2.3) ═══════════════════ */
(() => {
  const LOCAL_STORAGE_KEY = "mta_2026_state_v3";
  let appData = null;
  let searchQuery = "";
  let selectedGenre = "ALL";
  let activeView = "tiers"; // "tiers" или "calendar"

  const DEFAULT_TIERS_TEMPLATE = [
    { id: "S", rank: 1, name: "Абсолютный Канон", subtitle: "Астролябия Короны · Шедевры на все времена", hue: 45, items: [] },
    { id: "A", rank: 2, name: "Кристалл Спектра", subtitle: "Тессеракт Дисперсии · Выдающиеся тайтлы", hue: 185, items: [] },
    { id: "B", rank: 3, name: "Аметистовый Резонанс", subtitle: "Магнитный Тор · Достойные и атмосферные работы", hue: 275, items: [] },
    { id: "C", rank: 4, name: "Изумрудная Роса", subtitle: "Био-Сфера Росы · Расслабляющие и нишевые тайтлы", hue: 148, items: [] },
    { id: "D", rank: 5, name: "Янтарный Маятник", subtitle: "Хронометр · Спорные или проходные работы", hue: 28, items: [] },
    { id: "E", rank: 6, name: "Монолит Забвения", subtitle: "Обелиск Пепла · Разочарования и брошенные тайтлы", hue: 215, items: [] }
  ];

  function ensureSixTiers(data) {
    if (!data || !Array.isArray(data.tiers)) {
      return { meta: { title: "myTierAnime" }, tiers: DEFAULT_TIERS_TEMPLATE };
    }
    DEFAULT_TIERS_TEMPLATE.forEach(def => {
      if (!data.tiers.find(t => t.id === def.id)) {
        data.tiers.push(JSON.parse(JSON.stringify(def)));
      }
    });
    return data;
  }

  async function loadInitialState() {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        appData = ensureSixTiers(JSON.parse(cached));
        return;
      } catch {}
    }

    try {
      const res = await fetch(`data/tiers.json?t=${Date.now()}`);
      if (res.ok) {
        appData = ensureSixTiers(await res.json());
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
        return;
      }
    } catch (e) {
      console.warn("Could not fetch remote tiers.json:", e);
    }
    appData = ensureSixTiers(null);
  }

  function saveLocalState() {
    if (!appData) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
    StatsEngine.updateStats(appData.tiers);
  }

  /* Чистая карточка тайтла (без крестика и кнопок редактирования на постере — они внутри карточки при клике) */
  function cardEl(item, idx, tierId) {
    const m = calcItemMetrics(item);
    const yr = m.latestYear || item.year || "";
    const yearBadgeHtml = yr ? `<span class="card-year-3d" aria-hidden="true">${yr}</span>` : "";

    const countLabel = m.totalMovies > 0 && m.totalEpisodes === 0
      ? `${m.totalMovies} фильм(а)`
      : `${m.totalEpisodes} эп.${m.totalMovies ? ` + ${m.totalMovies} ф.` : ""}`;

    return `
      <div class="card-unit" draggable="true" data-uid="${esc(item.uid)}" data-tier-id="${esc(tierId)}">
        <article class="card" data-uid="${esc(item.uid)}" data-tier-id="${esc(tierId)}">
          <img class="card-poster" src="${esc(item.poster)}" alt="${esc(item.title)}" loading="lazy"
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

        <!-- Блок под карточкой: Тип тайтла + Общее кол-во серий + Часы -->
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

  function render() {
    const host = document.getElementById("tiersRoot");
    if (!host || !appData || !Array.isArray(appData.tiers)) return;

    const q = searchQuery.trim().toLowerCase();

    host.innerHTML = appData.tiers.map((tier, tierIdx) => {
      const filteredItems = (tier.items || []).filter(it => {
        const matchText = !q ||
          (it.title && it.title.toLowerCase().includes(q)) ||
          (it.origTitle && it.origTitle.toLowerCase().includes(q)) ||
          (it.studio && it.studio.toLowerCase().includes(q));
        const matchGenre = selectedGenre === "ALL" || (it.genres || []).some(g => g.toLowerCase() === selectedGenre.toLowerCase());
        return matchText && matchGenre;
      });

      const badgeBodyHtml = `
        <span class="seal-index">ТИР <b>${String(tierIdx + 1).padStart(2, "0")}</b></span>
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
                  <span class="tier-count-pill">${filteredItems.length}</span>
                </h2>
                <div class="tier-meta-sub">${esc(tier.subtitle || "")}</div>
              </div>
              <button type="button" class="btn btn-sm btn-neon-gold" data-add-to-tier="${esc(tier.id)}">
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

    host.querySelectorAll(".tier").forEach((tierEl, idx) => {
      const l3dHost = tierEl.querySelector(".l3d");
      build3DLetter(l3dHost, appData.tiers[idx], idx);
    });

    const demoSeal = document.querySelector("#fxDemo .l3d");
    if (demoSeal && appData.tiers[0]) {
      build3DLetter(demoSeal, appData.tiers[0], 0);
    }

    FXController.observeTiers();
    StatsEngine.updateStats(appData.tiers);
    populateGenreFilter();
    bindTierInteractions();

    if (activeView === "calendar") {
      CalendarView.renderCalendar(appData.tiers, (uid, tierId) => {
        const tier = appData.tiers.find(t => t.id === tierId);
        const item = tier?.items.find(i => i.uid === uid);
        if (item && tier) Modals.showAnimeDetails(item, tier);
      });
    }
  }

  /* Заполнение полного списка всех существующих жанров аниме */
  function populateGenreFilter() {
    const sel = document.getElementById("genreFilter");
    const picker = document.getElementById("genreQuickPicker");
    if (!sel || !appData) return;

    const allGenresSet = new Set(window.ALL_ANIME_GENRES || []);
    appData.tiers.forEach(t => {
      (t.items || []).forEach(it => (it.genres || []).forEach(g => allGenresSet.add(g)));
    });
    const sortedGenres = [...allGenresSet].sort((a, b) => a.localeCompare(b, "ru"));

    const current = sel.value || "ALL";
    sel.innerHTML = `<option value="ALL">Все жанры (${sortedGenres.length})</option>` +
      sortedGenres.map(g => `<option value="${esc(g)}" ${g === current ? "selected" : ""}>${esc(g)}</option>`).join("");

    if (picker && !picker.dataset.populated) {
      picker.innerHTML = `<option value="">+ Выбрать жанр из энциклопедии (${sortedGenres.length})...</option>` +
        sortedGenres.map(g => `<option value="${esc(g)}">${esc(g)}</option>`).join("");
      picker.dataset.populated = "1";
    }
  }

  function bindTierInteractions() {
    document.querySelectorAll("[data-add-to-tier]").forEach(btn => {
      btn.addEventListener("click", () => {
        Modals.openEditorModal(btn.dataset.addToTier, null);
      });
    });

    document.querySelectorAll(".card-unit").forEach(unit => {
      unit.addEventListener("click", () => {
        const uid = unit.dataset.uid;
        const tierId = unit.dataset.tierId;
        const tier = appData.tiers.find(t => t.id === tierId);
        const item = tier?.items.find(i => i.uid === uid);
        if (item && tier) {
          Modals.showAnimeDetails(item, tier);
        }
      });
    });

    DragDropEngine.bindCardsAndGrids((uid, fromTierId, toTierId, targetUid) => {
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
      saveLocalState();
      render();
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
    // Обработчик удаления тайтла из открытой карточки
    Modals.setDeleteHandler((uid, tierId) => {
      const tier = appData.tiers.find(t => t.id === tierId);
      if (!tier) return;
      const item = tier.items.find(i => i.uid === uid);
      tier.items = tier.items.filter(i => i.uid !== uid);
      saveLocalState();
      render();
      showToast(`Тайтл «${item?.title || ""}» удалён`);
    });

    // Кнопка Календаря
    document.getElementById("btnToggleCalendar")?.addEventListener("click", () => {
      toggleCalendarView();
    });

    // Клик по логотипу всегда возвращает к тирам
    document.getElementById("brandHomeBtn")?.addEventListener("click", () => {
      toggleCalendarView("tiers");
    });

    // Кнопка «➕ Добавить тайтл» в верхней шапке
    document.getElementById("btnAddTitleTop")?.addEventListener("click", () => {
      Modals.openEditorModal("S", null);
    });

    // Быстрое добавление жанра из энциклопедии в поле жанров редактора
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

    document.getElementById("searchInput")?.addEventListener("input", e => {
      searchQuery = e.target.value;
      render();
    });
    document.getElementById("genreFilter")?.addEventListener("change", e => {
      selectedGenre = e.target.value;
      render();
    });

    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => Modals.closeModal(btn.dataset.closeModal));
    });

    document.querySelectorAll("[data-add-part]").forEach(btn => {
      btn.addEventListener("click", () => Modals.addSeasonRow(btn.dataset.addPart));
    });

    // Shikimori Autocomplete
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
            showToast("Метаданные подтянуты из базы аниме!", "#38ef7d");
          });
        });
      }, 320);
    });

    // Сохранение тайтла
    document.getElementById("animeEditorForm")?.addEventListener("submit", e => {
      e.preventDefault();
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
        genres: document.getElementById("fGenres").value.split(",").map(s => s.trim()).filter(Boolean),
        comment: document.getElementById("fComment").value.trim(),
        seasons,
        watched: seasons.map(s => ({ date: s.date, note: s.title }))
      };

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

      saveLocalState();
      render();
      Modals.closeModal("editorModal");
      showToast(`«${newItem.title}» сохранён в тир ${targetTierId}`);
    });

    document.getElementById("btnOwnerAuth")?.addEventListener("click", () => {
      document.getElementById("ghTokenInput").value = GitHubSync.getToken();
      document.getElementById("ghRepoInput").value = GitHubSync.getRepo();
      Modals.openModal("authModal");
    });

    document.getElementById("authForm")?.addEventListener("submit", async e => {
      e.preventDefault();
      const tk = document.getElementById("ghTokenInput").value.trim();
      const rp = document.getElementById("ghRepoInput").value.trim();
      GitHubSync.saveCredentials(tk, rp);

      if (!tk) {
        GitHubSync.logout();
        updateOwnerBadge(null);
        Modals.closeModal("authModal");
        showToast("Вы вышли из режима владельца");
        return;
      }

      const user = await GitHubSync.verifyToken(tk);
      document.body.classList.add("is-owner");
      updateOwnerBadge(user || { login: "Owner" });
      Modals.closeModal("authModal");
      showToast("Режим владельца активирован!", "#38ef7d");
    });

    document.getElementById("btnSyncGitHub")?.addEventListener("click", async () => {
      try {
        showToast("Отправка коммита в GitHub (data/tiers.json)...", "#00f5ff");
        await GitHubSync.commitTiersToGitHub(appData);
        showToast("Успешно синхронизировано с GitHub Pages!", "#38ef7d");
      } catch (err) {
        showToast("Ошибка синхронизации: " + err.message, "#ff3c8c");
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
      btn.innerHTML = `🔓 Владелец: ${esc(user.login)}`;
    } else {
      btn.classList.remove("btn-owner-active");
      btn.innerHTML = `🔑 Вход владельца`;
    }
  }

  window.addEventListener("DOMContentLoaded", async () => {
    FXController.init();
    bindGlobalUI();
    await loadInitialState();
    render();

    if (GitHubSync.getToken()) {
      document.body.classList.add("is-owner");
      const u = await GitHubSync.verifyToken();
      updateOwnerBadge(u || { login: "Owner" });
    }
  });
})();
