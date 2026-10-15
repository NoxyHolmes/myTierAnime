/* ═══════════════════ 55+ SETTINGS STUDIO, 12 PARTICLE MODES & GLOBAL OWNER BG ═══════════════════ */
const FXController = (() => {
  let io = null;
  let bgEffect = localStorage.getItem("mta_bg_effect") || "sakura";
  let bgSpeed = parseFloat(localStorage.getItem("mta_bg_speed") || "1.0");
  let bgCount = parseInt(localStorage.getItem("mta_bg_count") || "65", 10);
  let bgWind  = parseFloat(localStorage.getItem("mta_bg_wind") || "0.5");

  let custom = {
    particleSize: 1.0,
    particleOpacity: 85,
    particleSway: 1.0,
    particleSpin: 1.0,
    particleGlow: 6,
    sealSpeed: 1.0,
    uiBrightness: 100,
    uiContrast: 100,
    uiSaturate: 100,
    uiHue: 0
  };

  let particles = [];

  const ALL_EMBLEM_CLASSES = [
    "emblems-realism", "emblems-quantum", "emblems-crystal", "emblems-eclipse",
    "emblems-runic", "emblems-synth", "emblems-galaxy", "emblems-cyber",
    "emblems-elements", "emblems-orbits"
  ];

  function init() {
    const savedMode = localStorage.getItem("mta_emblem_mode") || "emblems-realism";
    setEmblemMode(savedMode, false);

    // Открытие / закрытие панели настроек
    const settingsBtn = document.getElementById("btnToggleSettings");
    const fxPanel = document.getElementById("fxPanel");
    if (settingsBtn && fxPanel) {
      settingsBtn.addEventListener("click", () => {
        fxPanel.classList.toggle("show");
        window.dispatchEvent(new CustomEvent("fx-change"));
      });
    }

    // Переключение вкладок внутри панели настроек
    document.querySelectorAll("[data-fx-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.fxTab;
        document.querySelectorAll("[data-fx-tab]").forEach(b => b.classList.toggle("active", b === btn));
        document.querySelectorAll(".fx-tab-pane").forEach(p => p.classList.toggle("active", p.id === target));
      });
    });

    // Кнопка сброса всех настроек
    document.getElementById("btnResetSettings")?.addEventListener("click", () => {
      localStorage.removeItem("mta_custom_settings_v3");
      location.reload();
    });

    // Режимы 3D-эмблем
    document.querySelectorAll("[data-emblem-mode]").forEach(btn => {
      btn.addEventListener("click", () => setEmblemMode(btn.dataset.emblemMode, true));
    });

    // 12 видов частиц
    document.querySelectorAll("[data-bg-effect]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.bgEffect === bgEffect);
      btn.addEventListener("click", () => {
        bgEffect = btn.dataset.bgEffect;
        localStorage.setItem("mta_bg_effect", bgEffect);
        document.querySelectorAll("[data-bg-effect]").forEach(b => b.classList.toggle("active", b === btn));
        rebuildParticles();
      });
    });

    // Выбор шрифта заголовков
    document.querySelectorAll("[data-font-serif]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-font-serif]").forEach(b => b.classList.toggle("active", b === btn));
        document.documentElement.style.setProperty("--serif", `'${btn.dataset.fontSerif}', serif`);
      });
    });

    // Базовые слайдеры частиц и наклона
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

    // Универсальная привязка всех остальных 30+ ползунков [data-setting]
    document.querySelectorAll("[data-setting]").forEach(inp => {
      inp.addEventListener("input", () => {
        applySingleSetting(inp.dataset.setting, parseFloat(inp.value));
      });
    });

    // Универсальная привязка всех чекбоксов [data-toggle]
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

  function applySingleSetting(key, val) {
    const root = document.documentElement;
    const lbl = document.querySelector(`[data-val="${key}"]`);

    if (key === "gridCols") {
      root.style.setProperty("--grid-cols", String(val));
      if (lbl) lbl.textContent = String(val);
    } else if (key === "gridGap") {
      root.style.setProperty("--grid-gap", val + "px");
      if (lbl) lbl.textContent = val + "px";
    } else if (key === "cardRadius") {
      root.style.setProperty("--card-radius", val + "px");
      if (lbl) lbl.textContent = val + "px";
    } else if (key === "posterZoom") {
      root.style.setProperty("--poster-zoom", (val / 100).toFixed(2));
      if (lbl) lbl.textContent = val + "%";
    } else if (key === "holoOpacity") {
      root.style.setProperty("--holo-max-opacity", (val / 100).toFixed(2));
      if (lbl) lbl.textContent = val + "%";
    } else if (key === "scrimOpacity") {
      root.style.setProperty("--scrim-opacity", (val / 100).toFixed(2));
      if (lbl) lbl.textContent = val + "%";
    } else if (key === "cardTitleSize") {
      root.style.setProperty("--card-title-size", val + "px");
      if (lbl) lbl.textContent = val + "px";
    } else if (key === "tierBgAlpha") {
      root.style.setProperty("--tier-bg-alpha", (val / 100).toFixed(2));
      if (lbl) lbl.textContent = val + "%";
    } else if (key === "glassBlur") {
      root.style.setProperty("--glass-blur", val + "px");
      if (lbl) lbl.textContent = val + "px";
    } else if (key === "tierRadius") {
      root.style.setProperty("--tier-radius", val + "px");
      if (lbl) lbl.textContent = val + "px";
    } else if (key === "tierGap") {
      root.style.setProperty("--tier-gap", val + "px");
      if (lbl) lbl.textContent = val + "px";
    } else if (key === "badgeColWidth") {
      root.style.setProperty("--badge-col-width", val + "px");
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
    } else if (key === "letterPerspective") {
      root.style.setProperty("--letter-perspective", val + "px");
      if (lbl) lbl.textContent = val + "px";
    } else if (key === "metalSheenSpeed") {
      root.style.setProperty("--metal-sheen-dur", val + "s");
      if (lbl) lbl.textContent = val + "с";
    } else if (key === "vignetteStrength") {
      root.style.setProperty("--vignette-opacity", (val / 100).toFixed(2));
      if (lbl) lbl.textContent = val + "%";
    } else if (key in custom) {
      custom[key] = val;
      if (lbl) {
        if (key === "particleOpacity" || key.startsWith("ui")) lbl.textContent = val + (key === "uiHue" ? "°" : "%");
        else if (key === "particleGlow") lbl.textContent = val + "px";
        else lbl.textContent = val.toFixed(1) + "x";
      }
      if (key.startsWith("ui")) {
        document.querySelector(".app-shell").style.filter =
          `brightness(${custom.uiBrightness}%) contrast(${custom.uiContrast}%) saturate(${custom.uiSaturate}%) hue-rotate(${custom.uiHue}deg)`;
      }
    }
  }

  /* Применение глобального фона владельца (который видят все гости по ссылке) */
  function applyGlobalBackground(meta = {}) {
    const bgEl = document.getElementById("globalOwnerBg");
    if (!bgEl) return;
    const url = (meta.bgImage || "").trim();
    const dim = meta.bgDim ?? 65;
    const blur = meta.bgBlur ?? 4;

    document.documentElement.style.setProperty("--owner-bg-dim", (dim / 100).toFixed(2));
    bgEl.style.filter = blur > 0 ? `blur(${blur}px)` : "none";

    if (url) {
      bgEl.style.backgroundImage = `url("${url}")`;
      bgEl.classList.add("has-bg");
    } else {
      bgEl.style.backgroundImage = "none";
      bgEl.classList.remove("has-bg");
    }

    const urlInp = document.getElementById("ownerBgUrlInput");
    const dimInp = document.getElementById("rngOwnerBgDim");
    const blurInp = document.getElementById("rngOwnerBgBlur");
    const dimLbl = document.getElementById("lblOwnerBgDim");
    const blurLbl = document.getElementById("lblOwnerBgBlur");
    if (urlInp) urlInp.value = url;
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
        const swayMult = custom.particleSway ?? 1;
        const spinMult = custom.particleSpin ?? 1;

        for (const p of particles) {
          const sp = bgSpeed;
          if (bgEffect === "embers" || bgEffect === "fireflies" || bgEffect === "bubbles") {
            p.y -= p.vy * sp;
            p.x += (Math.sin(p.ang) * 0.5 * swayMult + bgWind * 0.4) * sp;
            p.ang += p.spin * spinMult * sp;
            if (p.y < -15) { p.y = h + 15; p.x = Math.random() * w; }
          } else if (bgEffect === "rain") {
            p.y += p.vy * 5.5 * sp;
            p.x += bgWind * 1.5 * sp;
            if (p.y > h + 15) { p.y = -15; p.x = Math.random() * w; }
          } else {
            p.y += p.vy * sp;
            p.x += (Math.sin(p.ang) * 0.45 * swayMult + bgWind) * sp;
            p.ang += p.spin * spinMult * sp;
            if (p.y > h + 15) { p.y = -15; p.x = Math.random() * w; }
          }
          if (p.x > w + 15) p.x = -15;
          if (p.x < -15) p.x = w + 15;

          const sz = p.size * sizeMult;
          const al = Math.min(1, p.alpha * opMult);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.ang);
          if (custom.particleGlow > 0) {
            ctx.shadowBlur = custom.particleGlow;
          }

          if (bgEffect === "sakura") {
            ctx.fillStyle = `rgba(255, 165, 205, ${al})`;
            ctx.shadowColor = "rgba(255, 130, 190, 0.6)";
            ctx.beginPath();
            ctx.ellipse(0, 0, sz * 1.3, sz * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (bgEffect === "crimsonLeaves") {
            ctx.fillStyle = `rgba(255, 90, 60, ${al})`;
            ctx.shadowColor = "rgba(255, 70, 40, 0.6)";
            ctx.beginPath();
            ctx.moveTo(0, -sz * 1.3);
            ctx.lineTo(sz, 0);
            ctx.lineTo(0, sz * 1.3);
            ctx.lineTo(-sz, 0);
            ctx.closePath();
            ctx.fill();
          } else if (bgEffect === "embers") {
            ctx.fillStyle = `rgba(255, 190, 80, ${al})`;
            ctx.shadowColor = "#ff6b35";
            ctx.beginPath();
            ctx.arc(0, 0, sz * 0.45, 0, Math.PI * 2);
            ctx.fill();
          } else if (bgEffect === "fireflies") {
            ctx.fillStyle = `rgba(180, 255, 100, ${al})`;
            ctx.shadowColor = "#7bed9f";
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
