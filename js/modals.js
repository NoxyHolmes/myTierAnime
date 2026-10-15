/* ═══════════════════ MODALS: FULL-VIEW SEASONS GRID (NO SCROLLING NEEDED) ═══════════════════ */
const Modals = (() => {
  let deleteHandler = null;

  function openModal(id) {
    document.getElementById(id)?.classList.add("open");
  }

  function closeModal(id) {
    document.getElementById(id)?.classList.remove("open");
  }

  function setDeleteHandler(fn) {
    deleteHandler = fn;
  }

  async function showAnimeDetails(item, tier) {
    const body = document.getElementById("detailsModalBody");
    const topBadges = document.getElementById("dossierTopBadges");
    if (!body) return;

    const m = calcItemMetrics(item);

    if (topBadges) {
      topBadges.innerHTML = `
        <span class="dossier-badge-pill gold">ТИР ${esc(tier.id)} · ${esc(tier.name)}</span>
        <span class="dossier-badge-pill">${esc(m.kind)}</span>
      `;
    }

    function renderSeasonsCards(filterType = "ALL") {
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
          : `<span class="s-chip-vol">${s.type === "Фильм" ? formatMoviesCount(s.episodes) : formatEpisodesCount(s.episodes)}</span>`;

        const noteText = s.note || (isUpcoming ? "Ожидается" : "");

        return `
          <div class="dossier-season-card ${isUpcoming ? "is-upcoming" : ""}">
            <div class="dsc-top">
              <div class="dsc-title-group">
                <span class="dsc-num">#${idx + 1}</span>
                <strong class="dsc-name">${esc(s.title)}</strong>
              </div>
              <div class="dsc-badges">
                <span class="cum-kind">${esc(s.type)}</span>
                <span class="dsc-year">${esc(relYr)} г.</span>
              </div>
            </div>

            <div class="dsc-metrics">
              <div class="dsc-cell">
                <span class="dsc-lbl">Объём:</span>
                ${volumeText}
              </div>
              <div class="dsc-cell">
                <span class="dsc-lbl">1 серия:</span>
                <b>${isUpcoming ? "—" : `${s.epMinutes} мин.`}</b>
              </div>
              <div class="dsc-cell">
                <span class="dsc-lbl">Время:</span>
                <b style="color:#00f5ff;">${partHours} ч.</b>
              </div>
              <div class="dsc-cell">
                <span class="dsc-lbl">Просмотр:</span>
                <b>${esc(s.date)}</b>
              </div>
            </div>

            ${noteText ? `<div class="dsc-note">💬 ${esc(noteText)}</div>` : ""}
          </div>
        `;
      }).join("");
    }

    const hasComment = item.comment && item.comment.trim().length > 0;

    body.innerHTML = `
      <div class="dossier-hero-banner">
        <div id="dossierHeroBackdrop" class="dossier-hero-backdrop" style="background-image:url('${esc(item.poster)}');"></div>
        <div class="dossier-hero-scrim"></div>

        <div class="dossier-hero-grid">
          <div class="dossier-poster-wrap">
            <img id="dossierMainPosterImg" src="${esc(item.poster)}" alt="${esc(item.title)}"
                 onerror="this.src='https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime'">
            <span class="dossier-score-orb">★ ${esc(item.score)}</span>
          </div>

          <div style="min-width:0;">
            <div class="dossier-head-row">
              <div>
                <h2 class="dossier-title-main">${esc(item.title)}</h2>
                <div class="dossier-title-orig">
                  ${esc(item.origTitle || "")}
                  ${item.year ? ` · <b>${esc(item.year)} г.</b>` : ""}
                  ${item.studio ? ` · Студия: <b style="color:#ffd76a;">${esc(item.studio)}</b>` : ""}
                </div>
              </div>
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

            <div class="dossier-genres-wrap">
              ${(item.genres || []).map(g => `<span class="dossier-genre-tag">${esc(g)}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <div class="dossier-body-section">
        <div class="dossier-seasons-header">
          <strong style="font-size:12px;text-transform:uppercase;color:#d6d0f5;letter-spacing:0.06em;">
            🎬 Все сезоны, фильмы и части перед глазами (${m.seasons.length}):
          </strong>
          <div class="dossier-filter-pills">
            <button type="button" class="dossier-pill-btn active" data-s-filter="ALL">Все (${m.seasons.length})</button>
            <button type="button" class="dossier-pill-btn" data-s-filter="TV">Сериалы</button>
            <button type="button" class="dossier-pill-btn" data-s-filter="MOVIE">Фильмы</button>
            <button type="button" class="dossier-pill-btn" data-s-filter="OTHER">OVA / ONA / Спешлы</button>
          </div>
        </div>

        <!-- Сетка всех сезонов без внутреннего скроллбара — всё сразу на экране! -->
        <div id="dossierSeasonsGrid" class="dossier-seasons-grid">
          ${renderSeasonsCards("ALL")}
        </div>
      </div>
    `;

    if (typeof GitHubSync !== "undefined" && typeof GitHubSync.resolveAssetUrl === "function") {
      GitHubSync.resolveAssetUrl(item.poster, item.posterBlobSha).then(resolvedUrl => {
        if (!resolvedUrl) return;
        const posterImg = document.getElementById("dossierMainPosterImg");
        const backdropEl = document.getElementById("dossierHeroBackdrop");
        if (posterImg) posterImg.src = resolvedUrl;
        if (backdropEl) backdropEl.style.backgroundImage = `url("${resolvedUrl}")`;
      }).catch(() => {});
    }

    body.querySelectorAll("[data-s-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        body.querySelectorAll("[data-s-filter]").forEach(b => b.classList.toggle("active", b === btn));
        const gridEl = document.getElementById("dossierSeasonsGrid");
        if (gridEl) gridEl.innerHTML = renderSeasonsCards(btn.dataset.sFilter);
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
    const dateStr = part.date || new Date().toLocaleDateString("ru-RU");
    const noteStr = part.note || "";

    row.innerHTML = `
      <input type="text" class="form-control s-title" placeholder="Сезон 1 / Фильм" value="${esc(part.title || "Сезон 1")}" required>
      <select class="form-control s-type">
        ${["TV Сериал", "Фильм", "OVA", "ONA", "Спешл"].map(t => `<option value="${t}" ${t === type ? "selected" : ""}>${t}</option>`).join("")}
      </select>
      <input type="number" min="1960" max="2040" class="form-control s-rel-year" title="Год выпуска этого сезона/фильма" placeholder="Год" value="${esc(defaultYear)}" required>
      <input type="number" min="0" class="form-control s-eps" title="Кол-во серий или фильмов (0 = ожидается / анонс)" value="${eps}" required>
      <input type="number" min="0" step="0.5" class="form-control s-mins" title="Длительность 1 серии (мин)" value="${mins}" required>
      <input type="text" class="form-control s-date" placeholder="ДД.ММ.ГГГГ" value="${esc(dateStr)}" required>
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
        date: r.querySelector(".s-date").value.trim() || new Date().toLocaleDateString("ru-RU"),
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
    document.getElementById("fYear").value = existingItem ? existingItem.year || 2026 : 2026;
    document.getElementById("fStudio").value = existingItem ? existingItem.studio || "" : "";
    document.getElementById("fScore").value = existingItem ? existingItem.score || 9.0 : 9.0;

    const posterInp = document.getElementById("fPoster");
    posterInp.value = existingItem ? existingItem.poster || "" : "";
    posterInp.dataset.existingBlobSha = existingItem?.posterBlobSha || "";

    const fileInp = document.getElementById("fPosterFile");
    if (fileInp) fileInp.value = "";
    document.getElementById("fGenres").value = existingItem ? (existingItem.genres || []).join(", ") : "";
    document.getElementById("fComment").value = existingItem ? existingItem.comment || "" : "";

    const listHost = document.getElementById("seasonsEditorList");
    listHost.innerHTML = "";
    const baseYear = existingItem?.year || 2026;
    const parts = existingItem
      ? normSeasons(existingItem)
      : [{ title: "Сезон 1", type: "TV Сериал", releaseYear: baseYear, episodes: 12, epMinutes: 24, date: new Date().toLocaleDateString("ru-RU"), note: "" }];

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
      date: new Date().toLocaleDateString("ru-RU"),
      note: ""
    }));
    recalculateSeasonsPreview();
  }

  return {
    openModal,
    closeModal,
    setDeleteHandler,
    showAnimeDetails,
    openEditorModal,
    addSeasonRow,
    readSeasonsFromEditor,
    recalculateSeasonsPreview
  };
})();
