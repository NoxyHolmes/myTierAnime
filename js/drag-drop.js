/* ═══════════════════ OWNER DRAG & DROP REORDERING ENGINE ═══════════════════ */
const DragDropEngine = (() => {
  let draggedUid = null;
  let sourceTierId = null;

  function bindCardsAndGrids(onMoveCallback) {
    document.querySelectorAll(".card-unit").forEach(unit => {
      unit.addEventListener("dragstart", e => {
        if (!document.body.classList.contains("is-owner")) {
          e.preventDefault();
          return;
        }
        draggedUid = unit.dataset.uid;
        sourceTierId = unit.dataset.tierId;
        unit.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
      });

      unit.addEventListener("dragend", () => {
        unit.classList.remove("dragging");
        document.querySelectorAll(".tier-grid").forEach(g => g.classList.remove("drag-over"));
      });
    });

    document.querySelectorAll(".tier-grid").forEach(grid => {
      grid.addEventListener("dragover", e => {
        if (!document.body.classList.contains("is-owner") || !draggedUid) return;
        e.preventDefault();
        grid.classList.add("drag-over");
      });

      grid.addEventListener("dragleave", () => {
        grid.classList.remove("drag-over");
      });

      grid.addEventListener("drop", e => {
        if (!document.body.classList.contains("is-owner") || !draggedUid) return;
        e.preventDefault();
        grid.classList.remove("drag-over");
        const targetTierId = grid.dataset.tierId;
        const afterUnit = e.target.closest(".card-unit");
        const targetUid = afterUnit ? afterUnit.dataset.uid : null;

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
