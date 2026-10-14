/* ═══════════════════ 3D FX CONTROLLER, STARFIELD & INTERSECTION OBSERVER ═══════════════════ */
const FXController = (() => {
  let io = null;

  function init() {
    // 1. Set Emblem Mode
    const savedMode = localStorage.getItem("mta_emblem_mode") || "emblems-realism";
    setEmblemMode(savedMode, false);

    // 2. Bind FX Drawer Toggle
    const fxBtn = document.getElementById("btnToggleFx");
    const fxPanel = document.getElementById("fxPanel");
    if (fxBtn && fxPanel) {
      fxBtn.addEventListener("click", () => {
        fxPanel.classList.toggle("show");
        window.dispatchEvent(new CustomEvent("fx-change"));
      });
    }

    // 3. Mode Buttons inside #fxPanel
    document.querySelectorAll("[data-emblem-mode]").forEach(btn => {
      btn.addEventListener("click", () => {
        setEmblemMode(btn.dataset.emblemMode, true);
      });
    });

    // 4. Tilt & Motion Toggles
    const tiltChk = document.getElementById("chkTilt");
    if (tiltChk) {
      tiltChk.addEventListener("change", () => {
        document.body.classList.toggle("fx-tilt", tiltChk.checked);
      });
    }
    const motionChk = document.getElementById("chkMotion");
    if (motionChk) {
      motionChk.addEventListener("change", () => {
        window.reduceMotion = !motionChk.checked;
        document.body.classList.toggle("fx-tier-motion", motionChk.checked);
        window.dispatchEvent(new CustomEvent("motion-change"));
      });
    }

    // 5. Global Pointer Tilt Delegation for Cards & Seals
    document.addEventListener("pointermove", e => {
      if (!document.body.classList.contains("fx-tilt")) return;
      const card = e.target.closest(".card");
      if (card) {
        tiltToward(card, e, ["--cry", "--crx"], 14);
      }
      const badge = e.target.closest(".tier-badge");
      if (badge) {
        tiltToward(badge, e, ["--brx", "--bry"], 22);
      }
    });

    document.addEventListener("pointerout", e => {
      const card = e.target.closest(".card");
      if (card && !card.contains(e.relatedTarget)) {
        card.style.setProperty("--crx", "0deg");
        card.style.setProperty("--cry", "0deg");
      }
      const badge = e.target.closest(".tier-badge");
      if (badge && !badge.contains(e.relatedTarget)) {
        badge.style.setProperty("--brx", "0deg");
        badge.style.setProperty("--bry", "0deg");
      }
    });

    initStarfield();
  }

  function setEmblemMode(mode, save = true) {
    document.body.classList.remove("emblems-realism", "emblems-elements", "emblems-orbits");
    document.body.classList.add(mode);
    if (save) localStorage.setItem("mta_emblem_mode", mode);
    document.querySelectorAll("[data-emblem-mode]").forEach(b => {
      b.classList.toggle("active", b.dataset.emblemMode === mode);
    });
    window.dispatchEvent(new CustomEvent("fx-change"));
  }

  function observeTiers() {
    if (io) io.disconnect();
    io = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        ent.target.classList.toggle("in-view", ent.isIntersecting);
      });
    }, { threshold: 0.05 });

    document.querySelectorAll(".tier").forEach(t => {
      t.classList.add("in-view");
      io.observe(t);
    });
    if (typeof window.__syncRealismCanvases === "function") {
      window.__syncRealismCanvases();
    }
  }

  function initStarfield() {
    const cv = document.getElementById("bgStarsCanvas");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let w = (cv.width = window.innerWidth);
    let h = (cv.height = window.innerHeight);

    const stars = Array.from({ length: 75 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.65 + 0.15,
      s: Math.random() * 0.25 + 0.05
    }));

    window.addEventListener("resize", () => {
      w = cv.width = window.innerWidth;
      h = cv.height = window.innerHeight;
    });

    function drawStars() {
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        st.y -= st.s;
        if (st.y < 0) st.y = h;
        ctx.fillStyle = `rgba(235, 230, 255, ${st.a})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!window.reduceMotion) requestAnimationFrame(drawStars);
    }
    drawStars();
  }

  return { init, observeTiers, setEmblemMode };
})();
