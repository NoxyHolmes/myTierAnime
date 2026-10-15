/* ═══════════════════ MODALS: COMPACT MULTI-SEASON DOSSIER & STRICT OWNER GUARD ═══════════════════ */
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

  function showAnimeDetails(item, tier) {
    const body = document.getElementById("detailsModalBody");
    if (!body) return;

    const m = calcItemMetrics(item);

    function renderSeasonsRows(filterType = "ALL") {
      const filtered = m.seasons.filter(s => {
        if (filterType === "ALL") return true;
        if (filterType === "TV") return s.type === "TV Сериал";
        if (filterType === "MOVIE") return s.type === "Фильм";
        return s.type !== "TV Сериал" && s.type !== "Фильм";
      });

      return filtered.map((s, idx) => {
        const partHours = formatHours((s.episodes * s.epMinutes) / 60);
        return `
          <tr>
            <td><b>#${idx + 1}</b> ${esc(s.title)}</td>
            <td><span class="cum-kind">${esc(s.type)}</span></td>
            <td>${s.episodes} ${s.type === "Фильм" ? "фильм(а)" : "эп."}</td>
            <td>${s.epMinutes} мин.</td>
            <td style="color:#00f5ff;font-weight:700;">${partHours} ч.</td>
            <td><b>${esc(s.date)}</b></td>
            <td style="color:var(--ink-soft);">${esc(s.note || "—")}</td>
          </tr>
        `;
      }).join("");
    }

    body.innerHTML = `
      <div style="display:grid;grid-template-columns:200px 1fr;gap:22px;align-items:start;">
        <img src="${esc(item.poster)}" alt="${esc(item.title)}"
             onerror="this.src='https://placehold.co/400x600/16122b/ffd76a?text=myTierAnime'"
             style="width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.18);">
        <div style="min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
            <span class="cum-kind">ТИР ${esc(tier.id)}</span>
            <span class="cum-kind">${esc(m.kind)}</span>
            <span style="color:#ffd76a;font-weight:800;">★ ${esc(item.score)}</span>
            <span style="color:var(--ink-soft);font-size:12px;">Релиз: ${esc(item.year)} · Студия: <b>${esc(item.studio || "—")}</b></span>
          </div>
          <h2 style="margin:0 0 4px;font-family:var(--serif);">${esc(item.title)}</h2>
          <div style="font-size:12px;color:var(--ink-soft);margin-bottom:12px;">${esc(item.origTitle || "")}</div>

          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px;background:rgba(255,255,255,0.03);padding:10px 14px;border-radius:10px;border:1px solid var(--border-subtle);">
            <div>
              <div style="font-size:10px;color:var(--ink-soft);text-transform:uppercase;">Серии / Фильмы</div>
              <div style="font-size:16px;font-weight:800;color:#ffd76a;">${m.totalEpisodes} эп. ${m.totalMovies ? `+ <span style="color:#ff5e7e;">${m.totalMovies} ф.</span>` : ""}</div>
            </div>
            <div>
              <div style="font-size:10px;color:var(--ink-soft);text-transform:uppercase;">Общее время</div>
              <div style="font-size:16px;font-weight:800;color:#00f5ff;">${formatHours(m.totalHours)} часов</div>
            </div>
            <div>
              <div style="font-size:10px;color:var(--ink-soft);text-transform:uppercase;">В пересчёте на дни</div>
              <div style="font-size:16px;font-weight:800;color:#fff;">${m.totalDays.toFixed(2)} дн.</div>
            </div>
          </div>

          <p style="font-size:13px;line-height:1.5;color:var(--ink);background:rgba(255,255,255,0.04);padding:10px 12px;border-radius:10px;margin:0 0 10px;">
            ${esc(item.comment || "Комментарий не добавлен.")}
          </p>

          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
            ${(item.genres || []).map(g => `<span class="tier-count-pill">${esc(g)}</span>`).join("")}
          </div>

          <!-- Компактная шапка сезонов с быстрыми вкладками-фильтрами и фиксированным скроллом -->
          <div class="dossier-seasons-header">
            <strong style="font-size:11.5px;text-transform:uppercase;color:var(--ink-soft);">
              Хронология сезонов и частей (${m.seasons.length}):
            </strong>
            <div class="dossier-filter-pills">
              <button type="button" class="dossier-pill-btn active" data-s-filter="ALL">Все (${m.seasons.length})</button>
              <button type="button" class="dossier-pill-btn" data-s-filter="TV">Сериалы</button>
              <button type="button" class="dossier-pill-btn" data-s-filter="MOVIE">Фильмы</button>
              <button type="button" class="dossier-pill-btn" data-s-filter="OTHER">OVA / ONA / Спешлы</button>
            </div>
          </div>

          <div class="seasons-scroll-box">
            <table class="seasons-table">
              <thead>
                <tr>
                  <th>Часть</th>
                  <th>Тип</th>
                  <th>Кол-во</th>
                  <th>1 серия</th>
                  <th>Часы</th>
                  <th>Дата</th>
                  <th>Заметка</th>
                </tr>
              </thead>
              <tbody id="dossierSeasonsTbody">${renderSeasonsRows("ALL")}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    body.querySelectorAll("[data-s-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        body.querySelectorAll("[data-s-filter]").forEach(b => b.classList.toggle("active", b === btn));
        const tbody = document.getElementById("dossierSeasonsTbody");
        if (tbody) tbody.innerHTML = renderSeasonsRows(btn.dataset.sFilter);
      });
    });

    const editBtn = document.getElementById("btnDetailsEdit");
    if (editBtn) {
      editBtn.onclick = () => {
        if (!GitHubSync.isOwner()) {
          showToast("Редактирование доступно только владельцу после входа по токену", "#ff3c8c");
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
          showToast("Удаление доступно только владельцу после входа по токену", "#ff3c8c");
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
    const eps = part.episodes ?? (type === "Фильм" ? 1 : 12);
    const mins = part.epMinutes ?? defaultMin;
    const dateStr = part.date || new Date().toLocaleDateString("ru-RU");
    const noteStr = part.note || "";

    row.innerHTML = `
      <input type="text" class="form-control s-title" placeholder="Сезон 1 / Фильм" value="${esc(part.title || "Сезон 1")}" required>
      <select class="form-control s-type">
        ${["TV Сериал", "Фильм", "OVA", "ONA", "Спешл"].map(t => `<option value="${t}" ${t === type ? "selected" : ""}>${t}</option>`).join("")}
      </select>
      <input type="number" min="1" class="form-control s-eps" title="Кол-во серий" value="${eps}" required>
      <input type="number" min="1" step="0.5" class="form-control s-mins" title="Длительность 1 серии (мин)" value="${mins}" required>
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
        epsInp.value = 1;
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
      const ep = Math.max(1, parseInt(r.querySelector(".s-eps").value, 10) || 1);
      const mn = Math.max(1, parseFloat(r.querySelector(".s-mins").value) || 24);
      const partMins = ep * mn;
      sumMins += partMins;
      if (tp === "Фильм") sumMovies += ep;
      else sumEps += ep;
      r.querySelector(".s-calc").textContent = `${formatHours(partMins / 60)} ч.`;
    });

    const preview = document.getElementById("seasonsTotalPreview");
    if (preview) {
      const hrs = sumMins / 60;
      preview.innerHTML = `
        <span>Итого по тайтлу: <b>${sumEps} серий</b> ${sumMovies ? `+ <b>${sumMovies} фильм(ов)</b>` : ""}</span>
        <span>Суммарное время: <b style="color:#00f5ff;">${formatHours(hrs)} часов</b> (${(hrs / 24).toFixed(2)} дней)</span>
      `;
    }
  }

  function readSeasonsFromEditor() {
    const rows = [...document.querySelectorAll("#seasonsEditorList .season-row")];
    return rows.map((r, i) => ({
      title: r.querySelector(".s-title").value.trim() || `Часть ${i + 1}`,
      type: r.querySelector(".s-type").value,
      episodes: Math.max(1, parseInt(r.querySelector(".s-eps").value, 10) || 1),
      epMinutes: Math.max(1, parseFloat(r.querySelector(".s-mins").value) || 24),
      date: r.querySelector(".s-date").value.trim() || new Date().toLocaleDateString("ru-RU"),
      note: r.querySelector(".s-note")?.value.trim() || ""
    }));
  }

  function openEditorModal(tierId = "S", existingItem = null) {
    if (!GitHubSync.isOwner()) {
      showToast("Для добавления или редактирования войдите как владелец по токену!", "#ff3c8c");
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
    document.getElementById("fReaction").value = existingItem ? existingItem.reaction || "✨ Шедевр" : "✨ Шедевр";
    document.getElementById("fPoster").value = existingItem ? existingItem.poster || "" : "";
    const fileInp = document.getElementById("fPosterFile");
    if (fileInp) fileInp.value = "";
    document.getElementById("fGenres").value = existingItem ? (existingItem.genres || []).join(", ") : "";
    document.getElementById("fComment").value = existingItem ? existingItem.comment || "" : "";

    const listHost = document.getElementById("seasonsEditorList");
    listHost.innerHTML = "";
    const parts = existingItem
      ? normSeasons(existingItem)
      : [{ title: "Сезон 1", type: "TV Сериал", episodes: 12, epMinutes: 24, date: new Date().toLocaleDateString("ru-RU"), note: "" }];

    parts.forEach(p => listHost.appendChild(createSeasonRowElement(p)));
    recalculateSeasonsPreview();
    openModal("editorModal");
  }

  function addSeasonRow(type = "TV Сериал") {
    const listHost = document.getElementById("seasonsEditorList");
    if (!listHost) return;
    const idx = listHost.querySelectorAll(".season-row").length + 1;
    const defaultTitle = type === "Фильм" ? `Фильм ${idx}` : (type === "TV Сериал" ? `Сезон ${idx}` : `${type} ${idx}`);
    listHost.appendChild(createSeasonRowElement({
      title: defaultTitle,
      type,
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
