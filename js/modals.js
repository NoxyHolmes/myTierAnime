/* ═══════════════════ MODALS: SELF-HEALING DOSSIER STYLES & SINGLETON BGM PLAYER ═══════════════════ */
const Modals = (() => {
  let deleteHandler = null;

  const bgmPlayer = new Audio();
  bgmPlayer.loop = true;
  bgmPlayer.preload = "auto";
  let bgmSessionId = 0;

  /* Гарантированная инжекция стилей карточки: защищает от обрезки или кэширования CSS в любом браузере */
  function ensureDossierStyles() {
    if (document.getElementById("dossierSelfContainedStyles")) return;
    const st = document.createElement("style");
    st.id = "dossierSelfContainedStyles";
    st.textContent = `
      .dossier-cinema-box {
        padding: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        max-width: 1280px !important;
        max-height: calc(100vh - 28px) !important;
        overflow: hidden !important;
        border: 1px solid rgba(255, 215, 106, 0.45) !important;
        background: #140f2d !important;
      }
      .dossier-sticky-topbar {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 12px !important;
        flex-wrap: wrap !important;
        padding: 12px 24px !important;
        background: #120e26 !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.14) !important;
        z-index: 10 !important;
        flex-shrink: 0 !important;
      }
      .dossier-badges-row {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        flex-wrap: wrap !important;
      }
      .dossier-badge-pill {
        display: inline-flex !important;
        align-items: center !important;
        padding: 4px 12px !important;
        border-radius: 999px !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        letter-spacing: 0.04em !important;
        text-transform: uppercase !important;
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.22) !important;
        color: #ffffff !important;
      }
      .dossier-badge-pill.gold {
        background: rgba(255, 215, 106, 0.22) !important;
        border-color: #ffd76a !important;
        color: #ffe8a3 !important;
      }
      .dossier-scroll-content {
        overflow-y: auto !important;
        flex: 1 !important;
      }
      .dossier-split-layout {
        position: relative !important;
        display: grid !important;
        grid-template-columns: 300px minmax(0, 1fr) !important;
        gap: 28px !important;
        padding: 24px 28px !important;
        align-items: start !important;
        overflow: hidden !important;
      }
      .dossier-hero-backdrop {
        position: absolute !important;
        top: -30px !important; left: -30px !important; right: -30px !important; bottom: -30px !important;
        background-size: cover !important;
        background-position: center !important;
        filter: blur(32px) saturate(1.4) brightness(0.42) !important;
        opacity: 0.55 !important;
        z-index: 0 !important;
        pointer-events: none !important;
      }
      .dossier-hero-scrim {
        position: absolute !important;
        top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
        background: linear-gradient(135deg, rgba(18, 13, 38, 0.55) 0%, rgba(20, 15, 45, 0.92) 70%, #140f2d 100%) !important;
        z-index: 1 !important;
        pointer-events: none !important;
      }
      .dossier-left-poster-col {
        position: relative !important;
        z-index: 5 !important;
      }
      .dossier-poster-large {
        position: relative !important;
        width: 100% !important;
        border-radius: 16px !important;
        overflow: hidden !important;
        border: 2px solid rgba(255, 215, 106, 0.65) !important;
        box-shadow: 0 18px 45px rgba(0, 0, 0, 0.9), 0 0 28px -6px rgba(255, 215, 106, 0.4) !important;
        background: #120f24 !important;
      }
      .dossier-poster-large img {
        width: 100% !important;
        aspect-ratio: 2 / 3 !important;
        object-fit: cover !important;
        display: block !important;
      }
      .dossier-score-orb {
        position: absolute !important;
        bottom: 12px !important;
        right: 12px !important;
        background: linear-gradient(135deg, #ffd76a, #ff5e7e) !important;
        color: #090614 !important;
        font-weight: 900 !important;
        font-size: 15px !important;
        padding: 5px 12px !important;
        border-radius: 999px !important;
        box-shadow: 0 4px 14px rgba(0,0,0,0.85) !important;
      }
      .dossier-right-info-col {
        position: relative !important;
        z-index: 5 !important;
        min-width: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 14px !important;
        color: #f5f3ff !important;
      }
      .dossier-title-main {
        margin: 0 0 4px !important;
        font-family: var(--serif, 'Cinzel', serif) !important;
        font-size: 26px !important;
        font-weight: 900 !important;
        color: #ffffff !important;
      }
      .dossier-title-orig {
        font-size: 13.5px !important;
        color: #cbc4eb !important;
        margin-bottom: 12px !important;
      }
      .dossier-metrics-row {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 10px !important;
        margin-bottom: 10px !important;
      }
      .dossier-metric-card {
        background: rgba(255, 255, 255, 0.07) !important;
        border: 1px solid rgba(255, 255, 255, 0.16) !important;
        border-radius: 10px !important;
        padding: 10px 14px !important;
      }
      .dossier-metric-card .dm-lbl {
        font-size: 10px !important;
        text-transform: uppercase !important;
        color: #bdb6de !important;
        margin-bottom: 3px !important;
      }
      .dossier-metric-card .dm-val {
        font-family: var(--serif, 'Cinzel', serif) !important;
        font-size: 17px !important;
        font-weight: 800 !important;
        color: #ffffff !important;
      }
      .dossier-comment-card {
        background: rgba(181, 124, 255, 0.12) !important;
        border: 1px solid rgba(181, 124, 255, 0.32) !important;
        border-left: 4px solid #ffd76a !important;
        border-radius: 9px !important;
        padding: 10px 14px !important;
        font-size: 13px !important;
        line-height: 1.45 !important;
        color: #f5f3ff !important;
        margin-bottom: 10px !important;
      }
      .dossier-genres-wrap {
        display: flex !important;
        gap: 7px !important;
        flex-wrap: wrap !important;
        margin-top: 2px !important;
      }
      .dossier-genre-tag {
        display: inline-block !important;
        padding: 4px 11px !important;
        border-radius: 999px !important;
        font-size: 11.5px !important;
        font-weight: 700 !important;
        background: rgba(0, 245, 255, 0.13) !important;
        border: 1px solid rgba(0, 245, 255, 0.38) !important;
        color: #b8fbff !important;
      }
      .dossier-seasons-block {
        background: rgba(14, 11, 30, 0.78) !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        border-radius: 14px !important;
        padding: 14px 16px !important;
        overflow-x: auto !important;
      }
      .dossier-seasons-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 10px !important;
        flex-wrap: wrap !important;
        margin: 0 0 12px !important;
      }
      .dossier-filter-pills {
        display: flex !important;
        gap: 6px !important;
        flex-wrap: wrap !important;
      }
      .dossier-pill-btn {
        padding: 5px 12px !important;
        border-radius: 999px !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        border: 1px solid rgba(255, 255, 255, 0.16) !important;
        background: rgba(255, 255, 255, 0.06) !important;
        color: #c4bede !important;
        cursor: pointer !important;
      }
      .dossier-pill-btn.active {
        background: rgba(0, 245, 255, 0.22) !important;
        border-color: #00f5ff !important;
        color: #ffffff !important;
      }
      /* СИНХРОННАЯ ТАБЛИЧНАЯ СЕТКА СЕЗОНОВ: все столбцы (Тип/Год, Объём, 1 серия, Время, Дата) двигаются синхронно и стоят ровно друг под другом! */
      .dossier-seasons-vertical-list {
        display: grid !important;
        grid-template-columns: minmax(220px, 1fr) max-content max-content max-content max-content max-content !important;
        row-gap: 8px !important;
        width: 100% !important;
      }
      .dossier-season-bar {
        grid-column: 1 / -1 !important;
        display: grid !important;
        grid-template-columns: subgrid !important;
        align-items: center !important;
        column-gap: 16px !important;
        background: linear-gradient(135deg, rgba(28, 22, 56, 0.94), rgba(18, 14, 38, 0.98)) !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        border-left: 3px solid #00f5ff !important;
        border-radius: 10px !important;
        padding: 10px 14px !important;
      }
      @supports not (grid-template-columns: subgrid) {
        .dossier-seasons-vertical-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
        }
        .dossier-season-bar {
          display: grid !important;
          grid-template-columns: minmax(220px, 1fr) 96px 125px 120px 92px 115px !important;
          align-items: center !important;
          column-gap: 14px !important;
        }
      }
      .dossier-season-bar.is-upcoming {
        border-left-color: #ffd76a !important;
        background: linear-gradient(135deg, rgba(42, 30, 22, 0.6), rgba(18, 14, 38, 0.96)) !important;
      }
      .dsb-col-left {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        min-width: 0 !important;
      }
      .dsc-num {
        font-size: 11px !important;
        font-weight: 900 !important;
        color: #090614 !important;
        background: #ffd76a !important;
        padding: 2px 7px !important;
        border-radius: 5px !important;
        flex-shrink: 0 !important;
      }
      .dsc-title-wrap {
        display: flex !important;
        flex-direction: column !important;
        gap: 2px !important;
        min-width: 0 !important;
      }
      .dsc-name {
        font-size: 13.5px !important;
        font-weight: 800 !important;
        color: #ffffff !important;
        line-height: 1.25 !important;
      }
      .dsb-note-inline {
        font-size: 11px !important;
        color: #cbc4eb !important;
        opacity: 0.9 !important;
      }
      /* Тип тайтла и год выпуска стоят строго ДРУГ ПОД ДРУГОМ и видны полностью без обрезания */
      .dsb-col-typeyear {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
        white-space: nowrap !important;
      }
      .dsb-col-typeyear .cum-kind {
        display: inline-block !important;
        font-size: 9px !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        padding: 2px 8px !important;
        border-radius: 5px !important;
        background: rgba(255, 215, 106, 0.14) !important;
        color: #ffd76a !important;
        border: 1px solid rgba(255, 215, 106, 0.5) !important;
        white-space: nowrap !important;
        overflow: visible !important;
        text-overflow: clip !important;
      }
      .dsc-year {
        display: inline-block !important;
        font-size: 10.5px !important;
        font-weight: 800 !important;
        color: #ffe8a3 !important;
        background: rgba(255, 255, 255, 0.07) !important;
        border: 1px solid rgba(255, 255, 255, 0.18) !important;
        padding: 1.5px 8px !important;
        border-radius: 5px !important;
        white-space: nowrap !important;
      }
      .dsb-col-stat {
        display: inline-flex !important;
        align-items: center !important;
        gap: 5px !important;
        white-space: nowrap !important;
        font-size: 12px !important;
        color: #ffffff !important;
        justify-self: start !important;
      }
      .dsc-lbl {
        color: #9e97bf !important;
        font-size: 11px !important;
      }
      .s-chip-vol {
        font-weight: 800 !important;
        color: #ffffff !important;
      }
      .s-chip-upcoming {
        font-weight: 800 !important;
        color: #ffd76a !important;
        font-size: 11.5px !important;
      }
      @media (max-width: 980px) {
        .dossier-split-layout { grid-template-columns: 1fr !important; }
        .dossier-left-poster-col { max-width: 250px !important; margin: 0 auto !important; }
        .dossier-seasons-vertical-list { display: flex !important; flex-direction: column !important; gap: 8px !important; }
        .dossier-season-bar { display: flex !important; flex-wrap: wrap !important; gap: 10px !important; }
      }
    `;
    document.head.appendChild(st);
  }

  function openModal(id) {
    ensureDossierStyles();
    document.getElementById(id)?.classList.add("open");
  }

  function closeModal(id) {
    if (id === "detailsModal") stopActiveBgm();
    document.getElementById(id)?.classList.remove("open");
  }

  function setDeleteHandler(fn) {
    deleteHandler = fn;
  }

  function stopActiveBgm() {
    bgmSessionId++;
    try {
      bgmPlayer.pause();
      bgmPlayer.removeAttribute("src");
      bgmPlayer.load();
    } catch {}
  }

  function syncEditorGenreChips() {
    const inp = document.getElementById("fGenres");
    const box = document.getElementById("editorGenreChips");
    if (!inp || !box) return;

    const genres = inp.value.split(",").map(s => s.trim()).filter(Boolean);
    if (!genres.length) {
      box.innerHTML = `<span style="font-size:11px;color:var(--ink-soft);">Жанры не выбраны (необязательно)</span>`;
      return;
    }

    box.innerHTML = genres.map((g, idx) => `
      <span class="editor-chip">
        <span>${esc(g)}</span>
        <button type="button" class="editor-chip-x" data-remove-genre-idx="${idx}" title="Удалить жанр «${esc(g)}»">✕</button>
      </span>
    `).join("");

    box.querySelectorAll("[data-remove-genre-idx]").forEach(btn => {
      btn.addEventListener("click", () => {
        const removeIdx = +btn.dataset.removeGenreIdx;
        const updated = genres.filter((_, i) => i !== removeIdx);
        inp.value = updated.join(", ");
        syncEditorGenreChips();
      });
    });
  }

  function showAnimeDetails(item, tier) {
    ensureDossierStyles();
    stopActiveBgm();
    const currentSession = bgmSessionId;

    const body = document.getElementById("detailsModalBody");
    const topBadges = document.getElementById("dossierTopBadges");
    const bgmBtn = document.getElementById("btnBgmToggle");
    if (!body) return;

    const m = calcItemMetrics(item);
    const displayPoster = item.posterInline || item.poster || "https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime";

    if (topBadges) {
      topBadges.innerHTML = `
        <span class="dossier-badge-pill gold">ТИР ${esc(tier.id)} · ${esc(tier.name)}</span>
        <span class="dossier-badge-pill">${esc(m.kind)}</span>
      `;
    }

    function renderSeasonsVerticalStack(filterType = "ALL") {
      const filtered = m.seasons.filter(s => {
        if (filterType === "ALL") return true;
        if (filterType === "TV") return s.type === "TV Сериал";
        if (filterType === "MOVIE") return s.type === "Фильм";
        return s.type !== "TV Сериал" && s.type !== "Фильм";
      });

      return filtered.map((s, idx) => {
        const isUpcoming = Number(s.episodes) === 0;
        const partHours = isUpcoming ? "0" : formatHours((s.episodes * s.epMinutes) / 60);
        const relYr = s.releaseYear || item.year || "2026";
        const volumeText = isUpcoming
          ? `<span class="s-chip-upcoming">⏳ Анонс (0 ${s.type === "Фильм" ? "ф." : "эп."})</span>`
          : `<b class="s-chip-vol">${s.type === "Фильм" ? formatMoviesCount(s.episodes) : formatEpisodesCount(s.episodes)}</b>`;

        const noteText = s.note ? String(s.note).trim() : "";

        return `
          <div class="dossier-season-bar ${isUpcoming ? "is-upcoming" : ""}">
            <div class="dsb-col-left">
              <span class="dsc-num">#${idx + 1}</span>
              <div class="dsc-title-wrap">
                <strong class="dsc-name">${esc(s.title)}</strong>
                ${noteText ? `<span class="dsb-note-inline">💬 ${esc(noteText)}</span>` : ""}
              </div>
            </div>

            <div class="dsb-col-typeyear">
              <span class="cum-kind">${esc(s.type)}</span>
              <span class="dsc-year">${esc(relYr)} г.</span>
            </div>

            <div class="dsb-col-stat">
              <span class="dsc-lbl">Объём:</span>
              ${volumeText}
            </div>

            <div class="dsb-col-stat">
              <span class="dsc-lbl">1 серия:</span>
              <b>${isUpcoming ? "—" : `${s.epMinutes} мин.`}</b>
            </div>

            <div class="dsb-col-stat">
              <span class="dsc-lbl">Время:</span>
              <b style="color:#00f5ff;">${partHours} ч.</b>
            </div>

            <div class="dsb-col-stat">
              <span class="dsc-lbl">Дата:</span>
              <b>${esc(s.date || (isUpcoming ? "Анонс" : "—"))}</b>
            </div>
          </div>
        `;
      }).join("");
    }

    const hasComment = item.comment && item.comment.trim().length > 0;

    body.innerHTML = `
      <div class="dossier-split-layout">
        <div id="dossierHeroBackdrop" class="dossier-hero-backdrop" style="background-image:url('${esc(displayPoster)}');"></div>
        <div class="dossier-hero-scrim"></div>

        <aside class="dossier-left-poster-col">
          <div class="dossier-poster-large">
            <img id="dossierMainPosterImg" src="${esc(displayPoster)}" alt="${esc(item.title)}"
                 onerror="this.src='https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime'">
            ${item.score ? `<span class="dossier-score-orb">★ ${esc(item.score)}</span>` : ""}
          </div>
        </aside>

        <div class="dossier-right-info-col">
          <div class="dossier-head-info">
            <h2 class="dossier-title-main">${esc(item.title)}</h2>
            <div class="dossier-title-orig">
              ${esc(item.origTitle || "")}
              ${item.year ? ` · <b>${esc(item.year)} г.</b>` : ""}
              ${item.studio ? ` · Студия: <b style="color:#ffd76a;">${esc(item.studio)}</b>` : ""}
            </div>

            <div class="dossier-metrics-row">
              <div class="dossier-metric-card">
                <div class="dm-lbl">🎞 Серии и Фильмы</div>
                <div class="dm-val" style="color:#ffd76a;">
                  ${formatEpisodesCount(m.totalEpisodes)} ${m.totalMovies ? `+ <span style="color:#ff5e7e;">${formatMoviesCount(m.totalMovies)}</span>` : ""}
                </div>
              </div>
              <div class="dossier-metric-card">
                <div class="dm-lbl">⏱ Затрачено часов</div>
                <div class="dm-val" style="color:#00f5ff;">${formatHours(m.totalHours)} ч.</div>
              </div>
              <div class="dossier-metric-card">
                <div class="dm-lbl">⏳ В пересчёте на дни</div>
                <div class="dm-val">${m.totalDays.toFixed(2)} дн.</div>
              </div>
            </div>

            ${hasComment ? `<div class="dossier-comment-card">${esc(item.comment)}</div>` : ""}

            ${(item.genres || []).length ? `
              <div class="dossier-genres-wrap">
                ${(item.genres || []).map(g => `<span class="dossier-genre-tag">${esc(g)}</span>`).join("")}
              </div>
            ` : ""}
          </div>

          <div class="dossier-seasons-block">
            <div class="dossier-seasons-header">
              <strong style="font-size:12px;text-transform:uppercase;color:#d6d0f5;letter-spacing:0.06em;">
                🎬 Хронология сезонов и частей (${m.seasons.length}):
              </strong>
              <div class="dossier-filter-pills">
                <button type="button" class="dossier-pill-btn active" data-s-filter="ALL">Все (${m.seasons.length})</button>
                <button type="button" class="dossier-pill-btn" data-s-filter="TV">Сериалы</button>
                <button type="button" class="dossier-pill-btn" data-s-filter="MOVIE">Фильмы</button>
                <button type="button" class="dossier-pill-btn" data-s-filter="OTHER">OVA / ONA / Спешлы</button>
              </div>
            </div>

            <div id="dossierSeasonsGrid" class="dossier-seasons-vertical-list">
              ${renderSeasonsVerticalStack("ALL")}
            </div>
          </div>
        </div>
      </div>
    `;

    body.querySelectorAll("[data-s-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        body.querySelectorAll("[data-s-filter]").forEach(b => b.classList.toggle("active", b === btn));
        const gridEl = document.getElementById("dossierSeasonsGrid");
        if (gridEl) gridEl.innerHTML = renderSeasonsVerticalStack(btn.dataset.sFilter);
      });
    });

    const closeBtn = document.getElementById("btnDetailsClose");
    if (closeBtn) closeBtn.onclick = () => closeModal("detailsModal");

    const editBtn = document.getElementById("btnDetailsEdit");
    if (editBtn) {
      editBtn.onclick = () => {
        if (!GitHubSync.isOwner()) {
          showToast("Редактирование доступно только владельцу", "#ff3c8c");
          return;
        }
        closeModal("detailsModal");
        openEditorModal(tier.id, item);
      };
    }

    const delBtn = document.getElementById("btnDetailsDelete");
    if (delBtn) {
      delBtn.onclick = () => {
        if (!GitHubSync.isOwner()) {
          showToast("Удаление доступно только владельцу", "#ff3c8c");
          return;
        }
        if (confirm(`Удалить тайтл «${item.title}» из тира ${tier.id}?`)) {
          closeModal("detailsModal");
          if (typeof deleteHandler === "function") deleteHandler(item.uid, tier.id);
        }
      };
    }

    openModal("detailsModal");

    if (!item.posterInline && typeof GitHubSync !== "undefined" && typeof GitHubSync.resolveAssetUrl === "function") {
      GitHubSync.resolveAssetUrl(item.poster, item.posterBlobSha, "image/jpeg", item.posterInline).then(resolvedUrl => {
        if (!resolvedUrl || currentSession !== bgmSessionId) return;
        const posterImg = document.getElementById("dossierMainPosterImg");
        const backdropEl = document.getElementById("dossierHeroBackdrop");
        if (posterImg) posterImg.src = resolvedUrl;
        if (backdropEl) backdropEl.style.backgroundImage = `url("${resolvedUrl}")`;
      }).catch(() => {});
    }

    if (item.bgmUrl || item.bgmBlobSha) {
      if (bgmBtn) {
        bgmBtn.style.display = "inline-flex";
        bgmBtn.innerHTML = "⏳ Загрузка музыки...";
        bgmBtn.onclick = () => {
          if (!bgmPlayer.src) return;
          if (bgmPlayer.paused) {
            bgmPlayer.play().then(() => {
              bgmBtn.innerHTML = "🔊 Музыка вкл.";
            }).catch(() => {});
          } else {
            bgmPlayer.pause();
            bgmBtn.innerHTML = "🔇 Музыка выкл.";
          }
        };
      }

      GitHubSync.resolveAssetUrl(item.bgmUrl, item.bgmBlobSha, "audio/mpeg").then(resolvedBgm => {
        if (!resolvedBgm || currentSession !== bgmSessionId) return;
        const modalEl = document.getElementById("detailsModal");
        if (!modalEl || !modalEl.classList.contains("open")) return;

        const globalVol = parseFloat(localStorage.getItem("mta_bgm_volume") || "0.3");
        bgmPlayer.volume = Math.min(1, Math.max(0, isNaN(globalVol) ? 0.3 : globalVol));
        bgmPlayer.src = resolvedBgm;
        bgmPlayer.currentTime = 0;

        bgmPlayer.play().then(() => {
          if (currentSession === bgmSessionId && bgmBtn) {
            bgmBtn.innerHTML = "🔊 Музыка вкл.";
          }
        }).catch(() => {
          if (currentSession === bgmSessionId && bgmBtn) {
            bgmBtn.innerHTML = "🔇 Включить музыку";
          }
        });
      }).catch(() => {
        if (bgmBtn) bgmBtn.style.display = "none";
      });
    } else {
      if (bgmBtn) bgmBtn.style.display = "none";
    }
  }

  function createSeasonRowElement(part = {}) {
    const row = document.createElement("div");
    row.className = "season-row";
    const type = part.type || "TV Сериал";
    const defaultMin = type === "Фильм" ? 110 : 24;
    const defaultYear = part.releaseYear || document.getElementById("fYear")?.value || 2026;
    const parsedEp = parseInt(part.episodes, 10);
    const eps = isNaN(parsedEp) ? (type === "Фильм" ? 1 : 12) : Math.max(0, parsedEp);
    const parsedMin = parseFloat(part.epMinutes);
    const mins = isNaN(parsedMin) ? defaultMin : Math.max(0, parsedMin);
    const dateStr = part.date !== undefined ? part.date : new Date().toLocaleDateString("ru-RU");
    const noteStr = part.note || "";

    row.innerHTML = `
      <input type="text" class="form-control s-title" placeholder="Сезон 1 / Фильм" value="${esc(part.title || "Сезон 1")}">
      <select class="form-control s-type">
        ${["TV Сериал", "Фильм", "OVA", "ONA", "Спешл"].map(t => `<option value="${t}" ${t === type ? "selected" : ""}>${t}</option>`).join("")}
      </select>
      <input type="number" min="1960" max="2040" class="form-control s-rel-year" title="Год выпуска этого сезона/фильма" placeholder="Год" value="${esc(defaultYear)}">
      <input type="number" min="0" class="form-control s-eps" title="Кол-во серий или фильмов (0 = ожидается / анонс)" value="${eps}">
      <input type="number" min="0" step="0.5" class="form-control s-mins" title="Длительность 1 серии (мин)" value="${mins}">
      <input type="text" class="form-control s-date" placeholder="ДД.ММ.ГГГГ, ММ.ГГГГ или Год" value="${esc(dateStr)}">
      <input type="text" class="form-control s-note" placeholder="Заметка" value="${esc(noteStr)}">
      <span class="s-calc">0 ч.</span>
      <button type="button" class="btn btn-sm s-remove" title="Удалить часть">✕</button>
    `;

    const typeSel = row.querySelector(".s-type");
    const epsInp = row.querySelector(".s-eps");
    const minsInp = row.querySelector(".s-mins");

    typeSel.addEventListener("change", () => {
      if (typeSel.value === "Фильм") {
        if (+epsInp.value > 1) epsInp.value = 1;
        if (+minsInp.value === 24) minsInp.value = 110;
      } else if (+minsInp.value === 110) {
        minsInp.value = 24;
      }
      recalculateSeasonsPreview();
    });

    epsInp.addEventListener("input", recalculateSeasonsPreview);
    minsInp.addEventListener("input", recalculateSeasonsPreview);
    row.querySelector(".s-remove").addEventListener("click", () => {
      if (document.querySelectorAll("#seasonsEditorList .season-row").length > 1) {
        row.remove();
        recalculateSeasonsPreview();
      } else {
        showToast("У тайтла должен быть хотя бы 1 сезон или фильм");
      }
    });

    return row;
  }

  function recalculateSeasonsPreview() {
    const rows = [...document.querySelectorAll("#seasonsEditorList .season-row")];
    let sumEps = 0;
    let sumMovies = 0;
    let sumMins = 0;

    rows.forEach(r => {
      const tp = r.querySelector(".s-type").value;
      const rawEp = parseInt(r.querySelector(".s-eps").value, 10);
      const ep = isNaN(rawEp) ? 0 : Math.max(0, rawEp);
      const rawMn = parseFloat(r.querySelector(".s-mins").value);
      const mn = isNaN(rawMn) ? 24 : Math.max(0, rawMn);

      if (ep > 0) {
        const partMins = ep * mn;
        sumMins += partMins;
        if (tp === "Фильм") sumMovies += ep;
        else sumEps += ep;
        r.querySelector(".s-calc").textContent = `${formatHours(partMins / 60)} ч.`;
      } else {
        r.querySelector(".s-calc").textContent = `Анонс (0 ч.)`;
      }
    });

    const preview = document.getElementById("seasonsTotalPreview");
    if (preview) {
      const hrs = sumMins / 60;
      preview.innerHTML = `
        <span>Итого просмотрено: <b>${formatEpisodesCount(sumEps)}</b> ${sumMovies ? `+ <b>${formatMoviesCount(sumMovies)}</b>` : ""}</span>
        <span>Суммарное время: <b style="color:#00f5ff;">${formatHours(hrs)} часов</b> (${(hrs / 24).toFixed(2)} дней)</span>
      `;
    }
  }

  function readSeasonsFromEditor() {
    const rows = [...document.querySelectorAll("#seasonsEditorList .season-row")];
    const fallbackYr = parseInt(document.getElementById("fYear")?.value, 10) || 2026;
    return rows.map((r, i) => {
      const rawEp = parseInt(r.querySelector(".s-eps").value, 10);
      const ep = isNaN(rawEp) ? 0 : Math.max(0, rawEp);
      const rawMn = parseFloat(r.querySelector(".s-mins").value);
      const mn = isNaN(rawMn) ? 24 : Math.max(0, rawMn);
      const relYr = parseInt(r.querySelector(".s-rel-year")?.value, 10) || fallbackYr;
      return {
        title: r.querySelector(".s-title").value.trim() || `Часть ${i + 1}`,
        type: r.querySelector(".s-type").value,
        releaseYear: relYr,
        episodes: ep,
        epMinutes: mn,
        date: r.querySelector(".s-date").value.trim(),
        note: r.querySelector(".s-note")?.value.trim() || ""
      };
    });
  }

  function openEditorModal(tierId = "S", existingItem = null) {
    if (!GitHubSync.isOwner()) {
      showToast("Для добавления или редактирования войдите как владелец", "#ff3c8c");
      openModal("authModal");
      return;
    }

    document.getElementById("editModalTitle").textContent = existingItem
      ? `✎ Редактировать тайтл: ${existingItem.title}`
      : "➕ Добавить новый тайтл";
    document.getElementById("fUid").value = existingItem ? existingItem.uid : "";
    document.getElementById("fTier").value = tierId || "S";
    document.getElementById("fKind").value = existingItem?.kind || "TV Сериал";
    document.getElementById("fTitle").value = existingItem ? existingItem.title : "";
    document.getElementById("fOrigTitle").value = existingItem ? existingItem.origTitle || "" : "";
    document.getElementById("fYear").value = existingItem ? existingItem.year || "" : "";
    document.getElementById("fStudio").value = existingItem ? existingItem.studio || "" : "";
    document.getElementById("fScore").value = existingItem ? existingItem.score ?? "" : "";

    const posterInp = document.getElementById("fPoster");
    posterInp.value = existingItem ? existingItem.poster || "" : "";
    posterInp.dataset.existingBlobSha = existingItem?.posterBlobSha || "";

    const fileInp = document.getElementById("fPosterFile");
    if (fileInp) fileInp.value = "";

    const bgmFileInp = document.getElementById("fBgmFile");
    if (bgmFileInp) bgmFileInp.value = "";
    const bgmUrlInp = document.getElementById("fBgmUrl");
    if (bgmUrlInp) {
      bgmUrlInp.value = existingItem ? existingItem.bgmUrl || "" : "";
      bgmUrlInp.dataset.existingBlobSha = existingItem?.bgmBlobSha || "";
    }
    const bgmFileLbl = document.getElementById("bgmFileNameLabel");
    if (bgmFileLbl) {
      bgmFileLbl.style.color = existingItem?.bgmUrl ? "#38ef7d" : "#ffd76a";
      bgmFileLbl.textContent = existingItem?.bgmUrl ? "🎵 Музыка загружена" : "Музыка не выбрана";
    }

    document.getElementById("fGenres").value = existingItem ? (existingItem.genres || []).join(", ") : "";
    document.getElementById("fComment").value = existingItem ? existingItem.comment || "" : "";

    syncEditorGenreChips();

    const listHost = document.getElementById("seasonsEditorList");
    listHost.innerHTML = "";
    const baseYear = existingItem?.year || 2026;
    const parts = existingItem
      ? normSeasons(existingItem)
      : [{ title: "Сезон 1", type: "TV Сериал", releaseYear: baseYear, episodes: 12, epMinutes: 24, date: String(baseYear), note: "" }];

    parts.forEach(p => listHost.appendChild(createSeasonRowElement(p)));
    recalculateSeasonsPreview();
    openModal("editorModal");
  }

  function addSeasonRow(type = "TV Сериал") {
    const listHost = document.getElementById("seasonsEditorList");
    if (!listHost) return;
    const idx = listHost.querySelectorAll(".season-row").length + 1;
    const defaultTitle = type === "Фильм" ? `Фильм ${idx}` : (type === "TV Сериал" ? `Сезон ${idx}` : `${type} ${idx}`);
    const baseYear = parseInt(document.getElementById("fYear")?.value, 10) || 2026;
    listHost.appendChild(createSeasonRowElement({
      title: defaultTitle,
      type,
      releaseYear: baseYear,
      episodes: type === "Фильм" ? 1 : 12,
      epMinutes: type === "Фильм" ? 110 : 24,
      date: String(baseYear),
      note: ""
    }));
    recalculateSeasonsPreview();
  }

  function setLiveBgmVolume(volFloat) {
    bgmPlayer.volume = Math.min(1, Math.max(0, volFloat));
  }

  return {
    openModal,
    closeModal,
    setDeleteHandler,
    syncEditorGenreChips,
    showAnimeDetails,
    openEditorModal,
    addSeasonRow,
    readSeasonsFromEditor,
    recalculateSeasonsPreview,
    setLiveBgmVolume
  };
})();
