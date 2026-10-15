/* ═══════════════════ SETTINGS STUDIO, 8 LETTER 3D STYLES & INSTANT OWNER BG ═══════════════════ */
const FXController = (() => {
  let io = null;
  let bgEffect = localStorage.getItem("mta_bg_effect") || "sakura";
  let bgSpeed = parseFloat(localStorage.getItem("mta_bg_speed") || "1.0");
  let bgCount = parseInt(localStorage.getItem("mta_bg_count") || "65", 10);
  let bgWind  = parseFloat(localStorage.getItem("mta_bg_wind") || "0.5");

  let custom = {
    particleSize: 1.0,
    particleOpacity: 85,
    sealSpeed: 1.0,
    uiBrightness: 100,
    uiContrast: 100,
    uiSaturate: 100
  };

  let particles = [];

  const ALL_EMBLEM_CLASSES = [
    "emblems-realism", "emblems-quantum", "emblems-crystal", "emblems-eclipse",
    "emblems-runic", "emblems-synth", "emblems-galaxy", "emblems-cyber",
    "emblems-elements", "emblems-orbits"
  ];

  const ALL_LETTER_STYLE_CLASSES = [
    "letter-style-gold", "letter-style-prism", "letter-style-neon", "letter-style-plasma",
    "letter-style-holo", "letter-style-obsidian", "letter-style-ice", "letter-style-glitch"
  ];

  const ALL_LETTER_MOTION_CLASSES = [
    "motion-precession", "motion-spin360", "motion-float", "motion-pulse"
  ];

  function init(onRebuildLetters) {
    const savedMode = localStorage.getItem("mta_emblem_mode") || "emblems-realism";
    setEmblemMode(savedMode, false);

    const savedLetterStyle = localStorage.getItem("mta_letter_style") || "letter-style-gold";
    setLetterStyle(savedLetterStyle, false);

    const savedLetterMotion = localStorage.getItem("mta_letter_motion") || "motion-precession";
    setLetterMotion(savedLetterMotion, false);

    const settingsBtn = document.getElementById("btnToggleSettings");
    const fxPanel = document.getElementById("fxPanel");
    if (settingsBtn && fxPanel) {
      settingsBtn.addEventListener("click", () => {
        fxPanel.classList.toggle("show");
        window.dispatchEvent(new CustomEvent("fx-change"));
      });
    }

    document.querySelectorAll("[data-fx-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.fxTab;
        document.querySelectorAll("[data-fx-tab]").forEach(b => b.classList.toggle("active", b === btn));
        document.querySelectorAll(".fx-tab-pane").forEach(p => p.classList.toggle("active", p.id === target));
      });
    });

    document.getElementById("btnResetSettings")?.addEventListener("click", () => {
      localStorage.removeItem("mta_emblem_mode");
      localStorage.removeItem("mta_letter_style");
      localStorage.removeItem("mta_letter_motion");
      localStorage.removeItem("mta_letter_depth_step");
      location.reload();
    });

    document.querySelectorAll("[data-emblem-mode]").forEach(btn => {
      btn.addEventListener("click", () => setEmblemMode(btn.dataset.emblemMode, true));
    });

    document.querySelectorAll("[data-letter-style]").forEach(btn => {
      btn.addEventListener("click", () => setLetterStyle(btn.dataset.letterStyle, true));
    });

    document.querySelectorAll("[data-letter-motion]").forEach(btn => {
      btn.addEventListener("click", () => setLetterMotion(btn.dataset.letterMotion, true));
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

    document.querySelectorAll("[data-font-serif]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-font-serif]").forEach(b => b.classList.toggle("active", b === btn));
        document.documentElement.style.setProperty("--serif", `'${btn.dataset.fontSerif}', serif`);
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

    document.querySelectorAll("[data-setting]").forEach(inp => {
      inp.addEventListener("input", () => {
        applySingleSetting(inp.dataset.setting, parseFloat(inp.value), onRebuildLetters);
      });
    });

    const toggleMap = {
      showGimbalRings: "hide-gimbal-rings",
      showSealFloor: "hide-seal-floor",
      showLetterHalo: "hide-letter-halo",
      showSealCaption: "hide-seal-caption",
      showCardRank: "hide-card-rank",
      showCardScore: "hide-card-score",
      showCardYear: "hide-card-year",
      showCardReaction: "hide-card-reaction",
      showCardCrown: "hide-card-crown",
      showUnderMeta: "hide-under-meta",
      showTopRainbow: "hide-top-rainbow",
      showStatsRibbon: "hide-stats-ribbon"
    };

    document.querySelectorAll("[data-toggle]").forEach(chk => {
      chk.addEventListener("change", () => {
        const key = chk.dataset.toggle;
        if (key === "showCyberGrid") {
          document.body.classList.toggle("fx-cyber-grid", chk.checked);
        } else if (key === "showScanlines") {
          document.body.classList.toggle("fx-scanlines", chk.checked);
        } else if (toggleMap[key]) {
          document.body.classList.toggle(toggleMap[key], !chk.checked);
        }
      });
    });

    document.getElementById("chkTilt")?.addEventListener("change", e => {
      document.body.classList.toggle("fx-tilt", e.target.checked);
    });
    document.getElementById("chkMotion")?.addEventListener("change", e => {
      window.reduceMotion = !e.target.checked;
      document.body.classList.toggle("fx-tier-motion", e.target.checked);
      window.dispatchEvent(new CustomEvent("motion-change"));
    });

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

  function applySingleSetting(key, val, onRebuildLetters) {
    const root = document.documentElement;
    const lbl = document.querySelector(`[data-val="${key}"]`);

    if (key === "letterFontSize") {
      root.style.setProperty("--letter-font-size", val + "px");
      if (lbl) lbl.textContent = val + "px";
    } else if (key === "letterDepthStep") {
      window.letterDepthStep = val;
      localStorage.setItem("mta_letter_depth_step", String(val));
      if (lbl) lbl.textContent = val.toFixed(1) + "px";
      if (typeof onRebuildLetters === "function") onRebuildLetters();
    } else if (key === "gridCols") {
      root.style.setProperty("--grid-cols", String(val));
      if (lbl) lbl.textContent = String(val);
    } else if (key === "gridGap") {
      root.style.setProperty("--grid-gap", val + "px");
      if (lbl) lbl.textContent = val + "px";
    } else if (key === "cardRadius") {
      root.style.setProperty("--card-radius", val + "px");
      if (lbl) lbl.textContent = val + "px";
    } else if (key === "tierBgAlpha") {
      root.style.setProperty("--tier-bg-alpha", (val / 100).toFixed(2));
      if (lbl) lbl.textContent = val + "%";
    } else if (key === "glassBlur") {
      root.style.setProperty("--glass-blur", val + "px");
      if (lbl) lbl.textContent = val + "px";
    } else if (key === "containerWidth") {
      root.style.setProperty("--container-width", val + "px");
      if (lbl) lbl.textContent = val + "px";
    } else if (key === "sealScale") {
      root.style.setProperty("--seal-scale", (val / 100).toFixed(2));
      if (lbl) lbl.textContent = val + "%";
    } else if (key === "sealGlow") {
      root.style.setProperty("--seal-glow-mult", (val / 100).toFixed(2));
      if (lbl) lbl.textContent = val + "%";
    } else if (key === "metalSheenSpeed") {
      root.style.setProperty("--metal-sheen-dur", val + "s");
      if (lbl) lbl.textContent = val + "с";
    } else if (key in custom) {
      custom[key] = val;
      if (lbl) {
        if (key.startsWith("ui")) lbl.textContent = val + "%";
        else lbl.textContent = val.toFixed(1) + "x";
      }
      if (key.startsWith("ui")) {
        document.querySelector(".app-shell").style.filter =
          `brightness(${custom.uiBrightness}%) contrast(${custom.uiContrast}%) saturate(${custom.uiSaturate}%)`;
      }
    }
  }

  /* 100% НАДЁЖНОЕ ПРИМЕНЕНИЕ ФОНА ЧЕРЕЗ <img id="globalOwnerBgImg"> */
  function applyGlobalBackground(meta = {}) {
    const bgWrap = document.getElementById("globalOwnerBg");
    const bgImg = document.getElementById("globalOwnerBgImg");
    if (!bgWrap || !bgImg) return;

    const localBg = localStorage.getItem("mta_owner_bg_v8") || "";
    const src = (meta.bgImage || localBg || "").trim();
    const dim = meta.bgDim ?? 55;
    const blur = meta.bgBlur ?? 0;

    document.documentElement.style.setProperty("--owner-bg-dim", (dim / 100).toFixed(2));
    bgImg.style.filter = blur > 0 ? `blur(${blur}px)` : "none";

    if (src) {
      if (bgImg.getAttribute("src") !== src) {
        bgImg.setAttribute("src", src);
      }
      bgWrap.classList.add("has-bg");
      document.body.classList.add("has-custom-bg");
    } else {
      bgImg.removeAttribute("src");
      bgWrap.classList.remove("has-bg");
      document.body.classList.remove("has-custom-bg");
    }

    const dimInp = document.getElementById("rngOwnerBgDim");
    const blurInp = document.getElementById("rngOwnerBgBlur");
    const dimLbl = document.getElementById("lblOwnerBgDim");
    const blurLbl = document.getElementById("lblOwnerBgBlur");
    if (dimInp) dimInp.value = dim;
    if (blurInp) blurInp.value = blur;
    if (dimLbl) dimLbl.textContent = dim + "%";
    if (blurLbl) blurLbl.textContent = blur + "px";
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

  function setLetterStyle(styleClass, save = true) {
    document.body.classList.remove(...ALL_LETTER_STYLE_CLASSES);
    document.body.classList.add(styleClass);
    if (save) localStorage.setItem("mta_letter_style", styleClass);
    document.querySelectorAll("[data-letter-style]").forEach(b => {
      b.classList.toggle("active", b.dataset.letterStyle === styleClass);
    });
  }

  function setLetterMotion(motionClass, save = true) {
    document.body.classList.remove(...ALL_LETTER_MOTION_CLASSES);
    document.body.classList.add(motionClass);
    if (save) localStorage.setItem("mta_letter_motion", motionClass);
    document.querySelectorAll("[data-letter-motion]").forEach(b => {
      b.classList.toggle("active", b.dataset.letterMotion === motionClass);
    });
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
      alpha: Math.random() * 0.65 + 0.25,
      char: String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
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
        const sizeMult = custom.particleSize || 1;
        const opMult = (custom.particleOpacity ?? 85) / 100;

        for (const p of particles) {
          const sp = bgSpeed;
          if (bgEffect === "embers" || bgEffect === "fireflies" || bgEffect === "bubbles") {
            p.y -= p.vy * sp;
            p.x += (Math.sin(p.ang) * 0.5 + bgWind * 0.4) * sp;
            p.ang += p.spin * sp;
            if (p.y < -15) { p.y = h + 15; p.x = Math.random() * w; }
          } else if (bgEffect === "rain") {
            p.y += p.vy * 5.5 * sp;
            p.x += bgWind * 1.5 * sp;
            if (p.y > h + 15) { p.y = -15; p.x = Math.random() * w; }
          } else {
            p.y += p.vy * sp;
            p.x += (Math.sin(p.ang) * 0.45 + bgWind) * sp;
            p.ang += p.spin * sp;
            if (p.y > h + 15) { p.y = -15; p.x = Math.random() * w; }
          }
          if (p.x > w + 15) p.x = -15;
          if (p.x < -15) p.x = w + 15;

          const sz = p.size * sizeMult;
          const al = Math.min(1, p.alpha * opMult);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.ang);

          if (bgEffect === "sakura") {
            ctx.fillStyle = `rgba(255, 165, 205, ${al})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, sz * 1.3, sz * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (bgEffect === "crimsonLeaves") {
            ctx.fillStyle = `rgba(255, 90, 60, ${al})`;
            ctx.beginPath();
            ctx.moveTo(0, -sz * 1.3);
            ctx.lineTo(sz, 0);
            ctx.lineTo(0, sz * 1.3);
            ctx.lineTo(-sz, 0);
            ctx.closePath();
            ctx.fill();
          } else if (bgEffect === "embers") {
            ctx.fillStyle = `rgba(255, 190, 80, ${al})`;
            ctx.beginPath();
            ctx.arc(0, 0, sz * 0.45, 0, Math.PI * 2);
            ctx.fill();
          } else if (bgEffect === "fireflies") {
            ctx.fillStyle = `rgba(180, 255, 100, ${al})`;
            ctx.beginPath();
            ctx.arc(0, 0, sz * 0.55, 0, Math.PI * 2);
            ctx.fill();
          } else if (bgEffect === "rain") {
            ctx.strokeStyle = `rgba(0, 245, 255, ${al * 0.65})`;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(bgWind * 2, sz * 3.2);
            ctx.stroke();
          } else if (bgEffect === "snow") {
            ctx.fillStyle = `rgba(225, 242, 255, ${al})`;
            ctx.beginPath();
            ctx.arc(0, 0, sz * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (bgEffect === "hearts") {
            ctx.fillStyle = `rgba(255, 90, 160, ${al})`;
            ctx.beginPath();
            ctx.arc(-sz * 0.3, 0, sz * 0.4, 0, Math.PI * 2);
            ctx.arc(sz * 0.3, 0, sz * 0.4, 0, Math.PI * 2);
            ctx.fill();
          } else if (bgEffect === "feathers") {
            ctx.fillStyle = `rgba(245, 245, 255, ${al})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, sz * 1.8, sz * 0.38, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (bgEffect === "bubbles") {
            ctx.strokeStyle = `rgba(0, 245, 255, ${al})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(0, 0, sz * 0.9, 0, Math.PI * 2);
            ctx.stroke();
          } else if (bgEffect === "matrix") {
            ctx.rotate(-p.ang);
            ctx.fillStyle = `rgba(56, 239, 125, ${al})`;
            ctx.font = `${Math.round(sz * 2.2)}px monospace`;
            ctx.fillText(p.char, 0, 0);
          } else {
            ctx.fillStyle = `rgba(235, 230, 255, ${al * 0.85})`;
            ctx.beginPath();
            ctx.arc(0, 0, sz * 0.38, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }
      if (!window.reduceMotion) requestAnimationFrame(tick);
    }
    tick();
  }

  return { init, observeTiers, setEmblemMode, applyGlobalBackground };
})();
