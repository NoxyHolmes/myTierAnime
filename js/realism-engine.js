/* ════════════════════ REAL-TIME 3D PBR & VOLUMETRIC SEAL ENGINE (2026) ════════════════════ */
(() => {
  let sealCanvases = [];
  let sealRaf = 0;
  let lastT = 0;

  function collectCanvases() {
    sealCanvases = [...document.querySelectorAll(".seal-canvas-3d")];
    if (!sealRaf && !window.reduceMotion && !document.hidden) {
      sealRaf = requestAnimationFrame(tickSeals);
    } else if (window.reduceMotion) {
      drawAllSeals(performance.now() * 0.001);
    }
  }
  window.__syncRealismCanvases = collectCanvases;

  /* Матрица поворота точки (x, y, z) по трём осям Эйлера (rx, ry, rz) */
  function rot3D(x, y, z, rx, ry, rz) {
    const cx = Math.cos(rx), sx = Math.sin(rx);
    const cy = Math.cos(ry), sy = Math.sin(ry);
    const cz = Math.cos(rz), sz = Math.sin(rz);
    const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
    const x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
    const x3 = x2 * cz - y1 * sz, y3 = x2 * sz + y1 * cz;
    return [x3, y3, z2];
  }

  /* Перспективная проекция 3D-точки на 2D-холст с возвратом масштаба k и глубины Z */
  function proj(pt, cx, cy, scale, fov = 3.4) {
    const z = pt[2] + fov;
    const k = fov / Math.max(0.4, z);
    return [cx + pt[0] * scale * k, cy + pt[1] * scale * k, k, pt[2]];
  }

  /* ── ТИР S: Астролябия Короны (Solar Reliquary) ── */
  function drawSealS(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.38;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // 1. Объёмные солнечные лучи (Volumetric God-Rays)
    for (let i = 0; i < 8; i++) {
      const a = t * 0.35 + (i * Math.PI) / 4;
      const g = ctx.createLinearGradient(cx, cy, cx + Math.cos(a) * R * 1.25, cy + Math.sin(a) * R * 1.25);
      g.addColorStop(0, `hsla(${hue}, 100%, 78%, 0.16)`);
      g.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R * 1.22, cy + Math.sin(a) * R * 1.22);
      ctx.stroke();
    }

    // 2. Три ортогональных 3D-кардана из литого золота и рубина
    const rings = [
      { rad: 1.02, rx: t * 0.7 + 0.9,  ry: t * 0.45,       rz: 0.2,     w: 2.2, hShift: 0 },
      { rad: 0.84, rx: -t * 0.55 + 0.4, ry: t * 0.82 + 1.1, rz: -0.5,    w: 1.6, hShift: -12 },
      { rad: 0.66, rx: t * 0.9,         ry: -t * 0.6,       rz: t * 0.4, w: 1.2, hShift: 15 }
    ];
    rings.forEach(rg => {
      const segs = 40;
      for (let i = 0; i < segs; i++) {
        const a0 = (i / segs) * Math.PI * 2;
        const a1 = ((i + 1) / segs) * Math.PI * 2;
        const p0 = proj(rot3D(Math.cos(a0) * rg.rad, Math.sin(a0) * rg.rad, 0, rg.rx, rg.ry, rg.rz), cx, cy, R);
        const p1 = proj(rot3D(Math.cos(a1) * rg.rad, Math.sin(a1) * rg.rad, 0, rg.rx, rg.ry, rg.rz), cx, cy, R);
        const spec = Math.max(0, Math.sin(a0 * 2 + t * 2.2));
        const depthAlpha = Math.min(0.95, Math.max(0.18, (p0[3] + 1.3) * 0.48));
        ctx.strokeStyle = `hsla(${hue + rg.hShift}, 96%, ${62 + spec * 32}%, ${depthAlpha})`;
        ctx.lineWidth = rg.w * p0[2] * (0.85 + spec * 0.45);
        ctx.beginPath();
        ctx.moveTo(p0[0], p0[1]);
        ctx.lineTo(p1[0], p1[1]);
        ctx.stroke();
      }
    });

    // 3. Восемь вращающихся в 3D алмазных и рубиновых октаэдров
    for (let i = 0; i < 8; i++) {
      const ang = t * 1.15 + (i * Math.PI) / 4;
      const pt = rot3D(Math.cos(ang) * 1.05, Math.sin(ang) * 1.05, Math.sin(ang * 2 + t) * 0.28, 0.55, t * 0.35, 0.2);
      const pr = proj(pt, cx, cy, R);
      const sz = 4.2 * pr[2];
      const isRuby = i % 2 === 0;
      ctx.fillStyle = isRuby ? "rgba(255, 70, 125, 0.92)" : `hsla(${hue}, 100%, 86%, 0.95)`;
      ctx.beginPath();
      ctx.moveTo(pr[0], pr[1] - sz * 1.35);
      ctx.lineTo(pr[0] + sz, pr[1]);
      ctx.lineTo(pr[0], pr[1] + sz * 1.35);
      ctx.lineTo(pr[0] - sz, pr[1]);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /* ── ТИР A: Тессеракт Дисперсии (Chromatic 4D Tesseract) ── */
  const TESS_VERTS = [];
  for (let i = 0; i < 16; i++) {
    TESS_VERTS.push([
      (i & 1) ? 0.62 : -0.62,
      (i & 2) ? 0.62 : -0.62,
      (i & 4) ? 0.62 : -0.62,
      (i & 8) ? 0.62 : -0.62
    ]);
  }
  const TESS_EDGES = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      const diff = i ^ j;
      if (diff && !(diff & (diff - 1))) TESS_EDGES.push([i, j]);
    }
  }

  function drawSealA(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.38;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    const c4 = Math.cos(t * 0.85), s4 = Math.sin(t * 0.85);
    const pts3D = TESS_VERTS.map(v => {
      // 4D-вращение в гиперплоскости XW и перспективная 4D->3D проекция
      const x = v[0] * c4 - v[3] * s4;
      const w4 = v[0] * s4 + v[3] * c4;
      const d4 = 1.65 / (2.2 - w4);
      return rot3D(x * d4, v[1] * d4, v[2] * d4, t * 0.55, t * 0.72, 0.3);
    });
    const projected = pts3D.map(p => proj(p, cx, cy, R));

    // Оптическая RGB-дисперсия (3 спектральных прохода на гранях)
    const passes = [
      { dx: -1.6, dy: -0.6, col: `hsla(${(hue + 35) % 360}, 100%, 70%, 0.42)`, lw: 1.3 },
      { dx: 1.6,  dy: 0.6,  col: `hsla(${(hue + 145) % 360}, 100%, 72%, 0.38)`, lw: 1.3 },
      { dx: 0,    dy: 0,    col: `hsla(${hue}, 100%, 88%, 0.78)`, lw: 1.5 }
    ];
    passes.forEach(ps => {
      ctx.strokeStyle = ps.col;
      ctx.lineWidth = ps.lw;
      ctx.beginPath();
      for (const [a, b] of TESS_EDGES) {
        const p0 = projected[a], p1 = projected[b];
        ctx.moveTo(p0[0] + ps.dx, p0[1] + ps.dy);
        ctx.lineTo(p1[0] + ps.dx, p1[1] + ps.dy);
      }
      ctx.stroke();
    });

    // Зеркальные вспышки на 16 вершинах гиперкуба
    for (const p of projected) {
      const r = Math.max(1.2, 2.3 * p[2]);
      ctx.fillStyle = `hsla(${hue}, 100%, 94%, ${Math.min(0.9, (p[3] + 1.4) * 0.45)})`;
      ctx.beginPath();
      ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* ── ТИР B: Магнитный Тор (Arcane Torus-Knot p=2, q=3) ── */
  function drawSealB(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.36;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const N = 68;
    const segs = [];
    for (let i = 0; i < N; i++) {
      const u0 = (i / N) * Math.PI * 2;
      const u1 = ((i + 1) / N) * Math.PI * 2;
      const ptAt = u => {
        const r = 0.72 + 0.28 * Math.cos(3 * u);
        return rot3D(
          r * Math.cos(2 * u),
          r * Math.sin(2 * u),
          0.34 * Math.sin(3 * u),
          t * 0.6 + 0.5,
          t * 0.85,
          -0.3
        );
      };
      const p0 = proj(ptAt(u0), cx, cy, R);
      const p1 = proj(ptAt(u1), cx, cy, R);
      segs.push({ p0, p1, u: u0, z: (p0[3] + p1[3]) * 0.5 });
    }
    // Сортировка по оси Z для честного перекрытия витков тора
    segs.sort((a, b) => a.z - b.z);
    for (const s of segs) {
      const pulse = 0.5 + 0.5 * Math.sin(s.u * 3 - t * 3.2);
      const alpha = Math.min(0.92, Math.max(0.2, (s.z + 1.2) * 0.52));
      ctx.strokeStyle = `hsla(${hue + pulse * 26}, 95%, ${60 + pulse * 30}%, ${alpha})`;
      ctx.lineWidth = (1.6 + pulse * 2.2) * s.p0[2];
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(s.p0[0], s.p0[1]);
      ctx.lineTo(s.p1[0], s.p1[1]);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ── ТИР C: Био-Сфера Росы (Verdant Bio-Helix) ── */
  function drawSealC(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.37;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    const strands = 2, ptsPerStrand = 18;
    const spheres = [];
    for (let s = 0; s < strands; s++) {
      const phase = s * Math.PI;
      for (let i = 0; i < ptsPerStrand; i++) {
        const k = (i / (ptsPerStrand - 1)) * 2 - 1;
        const angle = k * Math.PI * 1.35 + t * 1.2 + phase;
        const rad = Math.sqrt(Math.max(0.12, 1 - k * k * 0.65)) * 0.95;
        const p3 = rot3D(Math.cos(angle) * rad, k * 0.88, Math.sin(angle) * rad, 0.35, t * 0.45, -0.18);
        const pr = proj(p3, cx, cy, R);
        spheres.push({ pr, k, s, i });
      }
    }
    // Энергетические мосты между нитями двойной спирали
    ctx.lineWidth = 1.1;
    for (let i = 0; i < ptsPerStrand; i += 2) {
      const a = spheres[i].pr, b = spheres[ptsPerStrand + i].pr;
      ctx.strokeStyle = `hsla(${hue}, 90%, 72%, 0.32)`;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    }
    // Сортировка 36 капель по Z и отрисовка со сферическим Phong-бликом
    spheres.sort((a, b) => a.pr[3] - b.pr[3]);
    for (const sp of spheres) {
      const [x, y, scale, z] = sp.pr;
      const rad = Math.max(1.8, (3.2 + (sp.i % 3) * 0.9) * scale);
      const alpha = Math.min(0.92, Math.max(0.22, (z + 1.2) * 0.5));
      const g = ctx.createRadialGradient(x - rad * 0.35, y - rad * 0.35, rad * 0.1, x, y, rad);
      g.addColorStop(0, `hsla(${hue}, 100%, 96%, ${alpha})`);
      g.addColorStop(0.45, `hsla(${hue}, 92%, 68%, ${alpha * 0.85})`);
      g.addColorStop(1, `hsla(${(hue + 25) % 360}, 88%, 40%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawAllSeals(t) {
    if (!document.body.classList.contains("emblems-realism")) return;
    const fxOpen = document.getElementById("fxPanel")?.classList.contains("show");
    for (const cv of sealCanvases) {
      if (!cv.isConnected) continue;
      const inDemo = !!cv.closest("#fxDemo");
      if (inDemo && !fxOpen) continue;
      const tierEl = cv.closest(".tier");
      if (tierEl && !tierEl.classList.contains("in-view") && !document.body.classList.contains("exporting")) continue;
      const ctx = cv.getContext("2d");
      if (!ctx) continue;
      const W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);
      const idx = (+cv.dataset.sealIdx) || 0;
      const hue = (+cv.dataset.hue) || 45;
      if (idx === 0) drawSealS(ctx, W, H, t, hue);
      else if (idx === 1) drawSealA(ctx, W, H, t, hue);
      else if (idx === 2) drawSealB(ctx, W, H, t, hue);
      else drawSealC(ctx, W, H, t, hue);
    }
  }

  function tickSeals(now = performance.now()) {
    sealRaf = 0;
    if (document.hidden || window.reduceMotion || !document.body.classList.contains("fx-tier-motion")) return;
    sealRaf = requestAnimationFrame(tickSeals);
    if (now - lastT < 22) return;
    lastT = now;
    drawAllSeals(now * 0.001);
  }

  addEventListener("fx-change", () => {
    cancelAnimationFrame(sealRaf);
    sealRaf = 0;
    collectCanvases();
    drawAllSeals(performance.now() * 0.001);
  });
  addEventListener("motion-change", () => {
    cancelAnimationFrame(sealRaf);
    sealRaf = 0;
    collectCanvases();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) collectCanvases();
  });
  setTimeout(collectCanvases, 60);
})();
