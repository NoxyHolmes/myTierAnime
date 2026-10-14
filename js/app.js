/* ═══════════════════ MAIN APPLICATION ORCHESTRATOR (myTierAnime 2026 v2.2) ═══════════════════ */
(() => {
  const LOCAL_STORAGE_KEY = "mta_2026_state_v2";
  let appData = null;
  let searchQuery = "";
  let selectedGenre = "ALL";
  let activeView = "tiers";

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
      return { meta: { title: "myTierAnime · Канон 2026" }, tiers: DEFAULT_TIERS_TEMPLATE };
    }
    DEFAULT_TIERS_TEMPLATE.forEach(def => {
      if (!data.tiers.find(t => t.id === def.id)) {
        data.tiers.push(JSON.parse(JSON.stringify(def)));
      }
    });
    return data;
  }

  async function loadInitialState() {
    try {
      const res = await fetch(`data/tiers.json?t=${Date.now()}`);
      if (res.ok) {
        appData = ensureSixTiers(await res.json());
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
        return;
      }
    } catch (e) {
      console.warn("Could not fetch remote tiers.json, checking local cache:", e);
    }

    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        appData = ensureSixTiers(JSON.parse(cached));
        return;
      } catch {}
    }
    appData = ensureSixTiers(null);
  }

  function saveLocalState() {
    if (!appData) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
    StatsEngine.updateStats(appData.tiers);
  }

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

          <div class="card-owner-bar">
            <button type="button" class="card-act-btn" data-action="edit" title="Редактировать тайтл">✎ Изм.</button>
            <button type="button" class="card-act-btn danger" data-action="delete" title="Удалить тайтл">✕</button>
          </div>

          <div class="card-info">
            <h3 class="card-title">${esc(item.title)}</h3>
            <div class="card-sub">
              <span>${esc(item.year || "")} · ${esc(item.studio || "")}</span>
            </div>
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
          <div class="cum-owner-actions">
            <button type="button" class="cum-edit-btn" data-action="edit" data-uid="${esc(item.uid)}" data-tier-id="${esc(tierId)}">
              ✎ Редактировать тайтл
            </button>
            <button type="button" class="cum-del-btn" data-action="delete" data-uid="${esc(item.uid)}" data-tier-id="${esc(tierId)}" title="Удалить">
              ✕
            </button>
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
        const matchGenre = selectedGenre === "ALL" || (it.genres || []).includes(selectedGenre);
        return matchText && matchGenre;
      });

      const badgeBodyHtml = `
        <span class="seal-index">ТИР <b>${String(tierIdx + 1).padStart(2, "0")} · ${tierActiveYear(tier)}</b></span>
        <div class="lstage">
          ${realismMarkup(tierIdx, tier)}${elementMarkup(tierIdx)}${orbitalMarkup()}
          <span class="seal-floor" aria-hidden="true"></span>
          <span class="ring r1"></span><span class="ring r2"></span>
          <div class="l3d" data-l="${esc(tier.id)}"></div>
        </div>
        <span class="seal-caption">
          <span class="caption-realism">${REALISM_NAMES[tierIdx % 6]} · ${tierActiveYear(tier)}</span>
          <span class="caption-elements">${ELEMENT_NAMES[tierIdx % 6]}</span>
          <span class="caption-orbits">${ORBIT_NAMES[tierIdx % 6]}</span>
        </span>
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
              <button type="button" class="btn owner-only" data-add-to-tier="${esc(tier.id)}">
                + Тайтл в ${esc(tier.id)}
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

  function populateGenreFilter() {
    const sel = document.getElementById("genreFilter");
    if (!sel || !appData) return;
    const genres = new Set();
    appData.tiers.forEach(t => {
      (t.items || []).forEach(it => (it.genres || []).forEach(g => genres.add(g)));
    });
    const current = sel.value || "ALL";
    sel.innerHTML = `<option value="ALL">Все жанры (${genres.size})</option>` +
      [...genres].sort().map(g => `<option value="${esc(g)}" ${g === current ? "selected" : ""}>${esc(g)}</option>`).join("");
  }

  function bindTierInteractions() {
    document.querySelectorAll("[data-add-to-tier]").forEach(btn => {
      btn.addEventListener("click", () => {
        Modals.openEditorModal(btn.dataset.addToTier, null);
      });
    });

    document.querySelectorAll(".card-unit").forEach(unit => {
      unit.addEventListener("click", e => {
        const uid = unit.dataset.uid;
        const tierId = unit.dataset.tierId;
        const tier = appData.tiers.find(t => t.id === tierId);
        const item = tier?.items.find(i => i.uid === uid);
        if (!item) return;

        const actBtn = e.target.closest("[data-action]");
        if (actBtn) {
          e.stopPropagation();
          if (actBtn.dataset.action === "edit") {
            Modals.openEditorModal(tierId, item);
          } else if (actBtn.dataset.action === "delete") {
            if (confirm(`Удалить «${item.title}» из тира ${tierId}?`)) {
              tier.items = tier.items.filter(i => i.uid !== uid);
              saveLocalState();
              render();
              showToast(`Тайтл «${item.title}» удалён`);
            }
          }
          return;
        }
        Modals.showAnimeDetails(item, tier);
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

  function bindGlobalUI() {
    document.querySelectorAll("[data-switch-view]").forEach(btn => {
      btn.addEventListener("click", () => {
        activeView = btn.dataset.switchView;
        document.querySelectorAll("[data-switch-view]").forEach(b => b.classList.toggle("active", b === btn));
        const tiersEl = document.getElementById("tiersRoot");
        const calEl = document.getElementById("calendarRoot");
        if (activeView === "calendar") {
          tiersEl.style.display = "none";
          calEl.style.display = "block";
          CalendarView.renderCalendar(appData.tiers, (uid, tierId) => {
            const tier = appData.tiers.find(t => t.id === tierId);
            const item = tier?.items.find(i => i.uid === uid);
            if (item && tier) Modals.showAnimeDetails(item, tier);
          });
        } else {
          calEl.style.display = "none";
          tiersEl.style.display = "flex";
        }
      });
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

      showToast("Проверка токена...");
      const user = await GitHubSync.verifyToken(tk);
      document.body.classList.add("is-owner");
      if (user) {
        updateOwnerBadge(user);
        Modals.closeModal("authModal");
        showToast(`Вход выполнен: ${user.login} (Кнопки «✎ Редактировать тайтл» активны)`, "#38ef7d");
      } else {
        updateOwnerBadge({ login: "Owner" });
        Modals.closeModal("authModal");
        showToast("Режим владельца включён! Кнопки «✎ Редактировать тайтл» появились на всех карточках.", "#ffd76a");
      }
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
      a.download = `myTierAnime-2026-backup.json`;
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
