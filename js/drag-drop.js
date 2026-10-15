/* ═══════════════════ RELIABLE DRAG & DROP REORDERING ENGINE ═══════════════════ */
const DragDropEngine = (() => {
  let draggedUid = null;
  let sourceTierId = null;

  function bindCardsAndGrids(onMoveCallback) {
    document.querySelectorAll(".card-unit").forEach(unit => {
      // Отключаем перетаскивание у вложенных картинок и ссылок, чтобы они не перехватывали dragstart у карточки
      unit.querySelectorAll("img").forEach(img => img.setAttribute("draggable", "false"));

      unit.addEventListener("dragstart", e => {
        if (!GitHubSync.isOwner()) {
          e.preventDefault();
          return;
        }
        draggedUid = unit.dataset.uid;
        sourceTierId = unit.dataset.tierId;
        unit.classList.add("dragging");
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          try { e.dataTransfer.setData("text/plain", draggedUid); } catch {}
        }
      });

      unit.addEventListener("dragend", () => {
        unit.classList.remove("dragging");
        document.querySelectorAll(".tier-grid, .tier").forEach(g => g.classList.remove("drag-over"));
      });
    });

    // Принимаем бросок карточки в любой части секции тира (.tier), даже если сетка пустая
    document.querySelectorAll(".tier").forEach(tierSection => {
      const grid = tierSection.querySelector(".tier-grid");
      const targetTierId = tierSection.dataset.tier;

      tierSection.addEventListener("dragover", e => {
        if (!GitHubSync.isOwner() || !draggedUid) return;
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
        grid?.classList.add("drag-over");
      });

      tierSection.addEventListener("dragleave", e => {
        if (!tierSection.contains(e.relatedTarget)) {
          grid?.classList.remove("drag-over");
        }
      });

      tierSection.addEventListener("drop", e => {
        if (!GitHubSync.isOwner() || !draggedUid) return;
        e.preventDefault();
        grid?.classList.remove("drag-over");

        const afterUnit = e.target.closest(".card-unit");
        const targetUid = afterUnit && afterUnit.dataset.uid !== draggedUid ? afterUnit.dataset.uid : null;

        if (typeof onMoveCallback === "function") {
          onMoveCallback(draggedUid, sourceTierId, targetTierId, targetUid);
        }
        draggedUid = null;
        sourceTierId = null;
      });
    });
  }

  return { bindCardsAndGrids };
})();
