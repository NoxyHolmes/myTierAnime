/* ═══════════════════ SETTINGS & ATMOSPHERE ENGINE (10 EMBLEM MODES + PARTICLES) ═══════════════════ */
const FXController = (() => {
  let io = null;
  let bgEffect = localStorage.getItem("mta_bg_effect") || "sakura";
  let bgSpeed = parseFloat(localStorage.getItem("mta_bg_speed") || "1.0");
  let bgCount = parseInt(localStorage.getItem("mta_bg_count") || "65", 10);
  let bgWind  = parseFloat(localStorage.getItem("mta_bg_wind") || "0.5");
  let particles = [];

  const ALL_EMBLEM_CLASSES = [
    "emblems-realism",
    "emblems-quantum",
    "emblems-crystal",
    "emblems-eclipse",
    "emblems-runic",
    "emblems-synth",
    "emblems-galaxy",
    "emblems-cyber",
    "emblems-elements",
    "emblems-orbits"
  ];

  function init() {
    const savedMode = localStorage.getItem("mta_emblem_mode") || "emblems-realism";
    setEmblemMode(savedMode, false);

    const settingsBtn = document.getElementById("btnToggleSettings");
    const fxPanel = document.getElementById("fxPanel");
    if (settingsBtn && fxPanel) {
      settingsBtn.addEventListener("click", () => {
        fxPanel.classList.toggle("show");
        window.dispatchEvent(new CustomEvent("fx-change"));
      });
    }

    document.querySelectorAll("[data-emblem-mode]").forEach(btn => {
      btn.addEventListener("click", () => setEmblemMode(btn.dataset.emblemMode, true));
    });

    document.querySelectorAll("[data-bg-effect]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.bgEffect === bgEffect);
      btn.addEventListener("click", () => {
        bgEffect = btn.dataset.bgEffect;
        localStorage.setItem("mta_bg_effect", bgEffect);
        document.querySelectorAll("[data-bg-effect]").forEach(b => b.classList.toggle("active", b === btn));
        rebuildParticles();
      });
    });

    const rngSpeed = document.getElementById("rngBgSpeed");
    const lblSpeed = document.getElementById("lblBgSpeed");
    if (rngSpeed) {
      rngSpeed.value = bgSpeed;
      if (lblSpeed) lblSpeed.textContent = bgSpeed.toFixed(1) + "x";
      rngSpeed.addEventListener("input", () => {
        bgSpeed = parseFloat(rngSpeed.value);
        if (lblSpeed) lblSpeed.textContent = bgSpeed.toFixed(1) + "x";
        localStorage.setItem("mta_bg_speed", String(bgSpeed));
      });
    }

    const rngCount = document.getElementById("rngBgCount");
    const lblCount = document.getElementById("lblBgCount");
    if (rngCount) {
      rngCount.value = bgCount;
      if (lblCount) lblCount.textContent = String(bgCount);
      rngCount.addEventListener("input", () => {
        bgCount = parseInt(rngCount.value, 10);
        if (lblCount) lblCount.textContent = String(bgCount);
        localStorage.setItem("mta_bg_count", String(bgCount));
        rebuildParticles();
      });
    }

    const rngWind = document.getElementById("rngBgWind");
    const lblWind = document.getElementById("lblBgWind");
    if (rngWind) {
      rngWind.value = bgWind;
      if (lblWind) lblWind.textContent = bgWind.toFixed(1);
      rngWind.addEventListener("input", () => {
        bgWind = parseFloat(rngWind.value);
        if (lblWind) lblWind.textContent = bgWind.toFixed(1);
        localStorage.setItem("mta_bg_wind", String(bgWind));
      });
    }

    const rngTilt = document.getElementById("rngTiltPower");
    const lblTilt = document.getElementById("lblTiltPower");
    if (rngTilt) {
      rngTilt.addEventListener("input", () => {
        window.tiltPower = parseInt(rngTilt.value, 10);
        if (lblTilt) lblTilt.textContent = window.tiltPower + "°";
      });
    }

    const tiltChk = document.getElementById("chkTilt");
    if (tiltChk) {
      tiltChk.addEventListener("change", () => document.body.classList.toggle("fx-tilt", tiltChk.checked));
    }
    const motionChk = document.getElementById("chkMotion");
    if (motionChk) {
      motionChk.addEventListener("change", () => {
        window.reduceMotion = !motionChk.checked;
        document.body.classList.toggle("fx-tier-motion", motionChk.checked);
        window.dispatchEvent(new CustomEvent("motion-change"));
      });
    }

    document.addEventListener("pointermove", e => {
      if (!document.body.classList.contains("fx-tilt")) return;
      const card = e.target.closest(".card");
      if (card) tiltToward(card, e, ["--cry", "--crx"], window.tiltPower || 14);
      const badge = e.target.closest(".tier-badge");
      if (badge) tiltToward(badge, e, ["--brx", "--bry"], 22);
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

    initAtmosphereCanvas();
  }

  function setEmblemMode(mode, save = true) {
    document.body.classList.remove(...ALL_EMBLEM_CLASSES);
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
      entries.forEach(ent => ent.target.classList.toggle("in-view", ent.isIntersecting));
    }, { threshold: 0.05 });

    document.querySelectorAll(".tier").forEach(t => {
      t.classList.add("in-view");
      io.observe(t);
    });
    if (typeof window.__syncRealismCanvases === "function") window.__syncRealismCanvases();
  }

  function rebuildParticles() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    particles = Array.from({ length: bgCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 5 + 3,
      vy: Math.random() * 1.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.8,
      ang: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.03,
      alpha: Math.random() * 0.65 + 0.25
    }));
  }

  function initAtmosphereCanvas() {
    const cv = document.getElementById("bgStarsCanvas");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let w = (cv.width = window.innerWidth);
    let h = (cv.height = window.innerHeight);
    rebuildParticles();

    window.addEventListener("resize", () => {
      w = cv.width = window.innerWidth;
      h = cv.height = window.innerHeight;
    });

    function tick() {
      ctx.clearRect(0, 0, w, h);
      if (bgEffect !== "none") {
        for (const p of particles) {
          const sp = bgSpeed;
          if (bgEffect === "embers") {
            p.y -= p.vy * sp;
            p.x += (p.vx + bgWind * 0.5) * sp;
            if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
          } else if (bgEffect === "rain") {
            p.y += p.vy * 5.5 * sp;
            p.x += bgWind * 1.5 * sp;
            if (p.y > h + 15) { p.y = -15; p.x = Math.random() * w; }
          } else {
            p.y += p.vy * sp;
            p.x += (Math.sin(p.ang) * 0.4 + bgWind) * sp;
            p.ang += p.spin * sp;
            if (p.y > h + 15) { p.y = -15; p.x = Math.random() * w; }
          }
          if (p.x > w + 15) p.x = -15;
          if (p.x < -15) p.x = w + 15;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.ang);

          if (bgEffect === "sakura") {
            ctx.fillStyle = `rgba(255, 165, 205, ${p.alpha})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 1.3, p.size * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (bgEffect === "embers") {
            ctx.fillStyle = `rgba(255, 190, 80, ${p.alpha})`;
            ctx.shadowColor = "#ff6b35";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
          } else if (bgEffect === "rain") {
            ctx.strokeStyle = `rgba(0, 245, 255, ${p.alpha * 0.6})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(bgWind * 2, p.size * 3.2);
            ctx.stroke();
          } else if (bgEffect === "snow") {
            ctx.fillStyle = `rgba(220, 240, 255, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = `rgba(235, 230, 255, ${p.alpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }
      if (!window.reduceMotion) requestAnimationFrame(tick);
    }
    tick();
  }

  return { init, observeTiers, setEmblemMode };
})();
