/* ═══════════════════ MODALS: ANIME DETAILS, EDITOR & GITHUB TOKEN AUTH ═══════════════════ */
const Modals = (() => {
  function openModal(id) {
    document.getElementById(id)?.classList.add("open");
  }

  function closeModal(id) {
    document.getElementById(id)?.classList.remove("open");
  }

  function showAnimeDetails(item, tier) {
    const body = document.getElementById("detailsModalBody");
    if (!body) return;
    const watches = normWatched(item.watched);
    const watchHtml = watches.length
      ? watches.map(w => `<li><b>${esc(w.date)}</b> — ${esc(w.note || "Просмотр")}</li>`).join("")
      : "<li>Нет записей о датах просмотра</li>";

    body.innerHTML = `
      <div style="display:grid;grid-template-columns:200px 1fr;gap:20px;align-items:start;">
        <img src="${esc(item.poster)}" alt="${esc(item.title)}" style="width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.18);">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span class="canon-pill">ТИР ${esc(tier.id)}</span>
            <span style="color:#ffd76a;font-weight:800;">★ ${esc(item.score)}</span>
            <span style="color:var(--ink-soft);font-size:12px;">${esc(item.year)} · ${esc(item.episodes || "")}</span>
          </div>
          <h2 style="margin:0 0 4px;font-family:var(--serif);">${esc(item.title)}</h2>
          <div style="font-size:12px;color:var(--ink-soft);margin-bottom:12px;">${esc(item.origTitle || "")} · Студия: <b>${esc(item.studio || "—")}</b></div>
          <p style="font-size:13.5px;line-height:1.55;color:var(--ink);background:rgba(255,255,255,0.04);padding:12px;border-radius:10px;">
            ${esc(item.comment || "Комментарий не добавлен.")}
          </p>
          <div style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap;">
            ${(item.genres || []).map(g => `<span class="tier-count-pill">${esc(g)}</span>`).join("")}
          </div>
          <h4 style="margin:16px 0 6px;font-size:12px;text-transform:uppercase;color:var(--ink-soft);">Хронология просмотров (Канон 2026):</h4>
          <ul style="margin:0;padding-left:18px;font-size:12.5px;color:var(--ink-soft);line-height:1.6;">
            ${watchHtml}
          </ul>
        </div>
      </div>
    `;
    openModal("detailsModal");
  }

  function openEditorModal(tierId = "S", existingItem = null) {
    document.getElementById("editModalTitle").textContent = existingItem
      ? "Редактировать тайтл"
      : "Добавить тайтл в Канон";
    document.getElementById("fUid").value = existingItem ? existingItem.uid : "";
    document.getElementById("fTier").value = tierId;
    document.getElementById("fTitle").value = existingItem ? existingItem.title : "";
    document.getElementById("fOrigTitle").value = existingItem ? existingItem.origTitle || "" : "";
    document.getElementById("fYear").value = existingItem ? existingItem.year || 2026 : 2026;
    document.getElementById("fEpisodes").value = existingItem ? existingItem.episodes || "12 эп." : "12 эп.";
    document.getElementById("fStudio").value = existingItem ? existingItem.studio || "" : "";
    document.getElementById("fScore").value = existingItem ? existingItem.score || 9.0 : 9.0;
    document.getElementById("fReaction").value = existingItem ? existingItem.reaction || "✨ Канон" : "✨ Канон";
    document.getElementById("fPoster").value = existingItem ? existingItem.poster || "" : "";
    document.getElementById("fGenres").value = existingItem ? (existingItem.genres || []).join(", ") : "";
    document.getElementById("fComment").value = existingItem ? existingItem.comment || "" : "";

    const w = existingItem ? normWatched(existingItem.watched) : [];
    const todayStr = new Date().toLocaleDateString("ru-RU");
    document.getElementById("fWatchDate").value = w[0]?.date || todayStr;
    document.getElementById("fWatchNote").value = w[0]?.note || "Просмотр";

    openModal("editorModal");
  }

  return { openModal, closeModal, showAnimeDetails, openEditorModal };
})();
