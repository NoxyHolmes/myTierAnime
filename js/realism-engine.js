/* ════════════════════ REAL-TIME 3D SEAL ENGINE + 6 NEW ARCHITECTURES ════════════════════ */
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

  function rot3D(x, y, z, rx, ry, rz) {
    const cx = Math.cos(rx), sx = Math.sin(rx);
    const cy = Math.cos(ry), sy = Math.sin(ry);
    const cz = Math.cos(rz), sz = Math.sin(rz);
    const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
    const x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
    const x3 = x2 * cz - y1 * sz, y3 = x2 * sz + y1 * cz;
    return [x3, y3, z2];
  }

  function proj(pt, cx, cy, scale, fov = 3.4) {
    const z = pt[2] + fov;
    const k = fov / Math.max(0.4, z);
    return [cx + pt[0] * scale * k, cy + pt[1] * scale * k, k, pt[2]];
  }

  /* ── Классические 6 печатей Реализма (S, A, B, C, D, E) ── */
  function drawSealS(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.38;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
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
    const rings = [
      { rad: 1.02, rx: t * 0.7 + 0.9,  ry: t * 0.45,       rz: 0.2,     w: 2.2, hShift: 0 },
      { rad: 0.84, rx: -t * 0.55 + 0.4, ry: t * 0.82 + 1.1, rz: -0.5,    w: 1.6, hShift: -12 },
      { rad: 0.66, rx: t * 0.9,         ry: -t * 0.6,       rz: t * 0.4, w: 1.2, hShift: 15 }
    ];
    rings.forEach(rg => {
      const segs = 36;
      for (let i = 0; i < segs; i++) {
        const a0 = (i / segs) * Math.PI * 2;
        const a1 = ((i + 1) / segs) * Math.PI * 2;
        const p0 = proj(rot3D(Math.cos(a0) * rg.rad, Math.sin(a0) * rg.rad, 0, rg.rx, rg.ry, rg.rz), cx, cy, R);
        const p1 = proj(rot3D(Math.cos(a1) * rg.rad, Math.sin(a1) * rg.rad, 0, rg.rx, rg.ry, rg.rz), cx, cy, R);
        const spec = Math.max(0, Math.sin(a0 * 2 + t * 2.2));
        ctx.strokeStyle = `hsla(${hue + rg.hShift}, 96%, ${62 + spec * 32}%, 0.75)`;
        ctx.lineWidth = rg.w * p0[2];
        ctx.beginPath();
        ctx.moveTo(p0[0], p0[1]);
        ctx.lineTo(p1[0], p1[1]);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  const TESS_VERTS = [];
  for (let i = 0; i < 16; i++) {
    TESS_VERTS.push([(i & 1) ? 0.62 : -0.62, (i & 2) ? 0.62 : -0.62, (i & 4) ? 0.62 : -0.62, (i & 8) ? 0.62 : -0.62]);
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
    const projected = TESS_VERTS.map(v => {
      const x = v[0] * c4 - v[3] * s4;
      const w4 = v[0] * s4 + v[3] * c4;
      const d4 = 1.65 / (2.2 - w4);
      return proj(rot3D(x * d4, v[1] * d4, v[2] * d4, t * 0.55, t * 0.72, 0.3), cx, cy, R);
    });
    ctx.strokeStyle = `hsla(${hue}, 100%, 82%, 0.78)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (const [a, b] of TESS_EDGES) {
      ctx.moveTo(projected[a][0], projected[a][1]);
      ctx.lineTo(projected[b][0], projected[b][1]);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawSealB(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.36;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const N = 60;
    for (let i = 0; i < N; i++) {
      const u0 = (i / N) * Math.PI * 2;
      const u1 = ((i + 1) / N) * Math.PI * 2;
      const ptAt = u => {
        const r = 0.72 + 0.28 * Math.cos(3 * u);
        return rot3D(r * Math.cos(2 * u), r * Math.sin(2 * u), 0.34 * Math.sin(3 * u), t * 0.6 + 0.5, t * 0.85, -0.3);
      };
      const p0 = proj(ptAt(u0), cx, cy, R);
      const p1 = proj(ptAt(u1), cx, cy, R);
      ctx.strokeStyle = `hsla(${hue}, 95%, 72%, 0.75)`;
      ctx.lineWidth = 2.0 * p0[2];
      ctx.beginPath();
      ctx.moveTo(p0[0], p0[1]);
      ctx.lineTo(p1[0], p1[1]);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSealC(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.37;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let s = 0; s < 2; s++) {
      const phase = s * Math.PI;
      for (let i = 0; i < 16; i++) {
        const k = (i / 15) * 2 - 1;
        const angle = k * Math.PI * 1.35 + t * 1.2 + phase;
        const rad = Math.sqrt(Math.max(0.12, 1 - k * k * 0.65)) * 0.95;
        const pr = proj(rot3D(Math.cos(angle) * rad, k * 0.88, Math.sin(angle) * rad, 0.35, t * 0.45, -0.18), cx, cy, R);
        ctx.fillStyle = `hsla(${hue}, 95%, 75%, 0.8)`;
        ctx.beginPath();
        ctx.arc(pr[0], pr[1], 3.2 * pr[2], 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawSealD(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.37;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const swing = Math.sin(t * 1.8) * 0.55;
    for (let i = 0; i < 24; i++) {
      const a0 = (i / 24) * Math.PI * 2 + swing;
      const a1 = ((i + 0.5) / 24) * Math.PI * 2 + swing;
      const r0 = i % 2 === 0 ? 0.98 : 0.82;
      const p0 = proj(rot3D(Math.cos(a0) * r0, Math.sin(a0) * r0, 0, 0.45, swing * 0.7, 0), cx, cy, R);
      const p1 = proj(rot3D(Math.cos(a1) * r0, Math.sin(a1) * r0, 0, 0.45, swing * 0.7, 0), cx, cy, R);
      ctx.strokeStyle = `hsla(${hue}, 95%, 68%, 0.78)`;
      ctx.lineWidth = 2 * p0[2];
      ctx.beginPath();
      ctx.moveTo(p0[0], p0[1]);
      ctx.lineTo(p1[0], p1[1]);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSealE(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.36;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const verts = [[0, -1.08, 0], [0, 1.08, 0], [-0.55, 0, -0.55], [0.55, 0, -0.55], [0.55, 0, 0.55], [-0.55, 0, 0.55]];
    const edges = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,3],[3,4],[4,5],[5,2]];
    const pts = verts.map(v => proj(rot3D(v[0], v[1], v[2], 0.35, t * 0.5, 0.15), cx, cy, R));
    ctx.strokeStyle = `hsla(${hue}, 35%, 78%, 0.72)`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (const [a, b] of edges) {
      ctx.moveTo(pts[a][0], pts[a][1]);
      ctx.lineTo(pts[b][0], pts[b][1]);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* ════════════════════ 6 НОВЫХ УНИКАЛЬНЫХ ВАРИАЦИЙ 3D-ЭМБЛЕМ ════════════════════ */

  /* Вариация 1: Квантовый Вихрь (emblems-quantum) */
  function drawQuantumVortex(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.39;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let arm = 0; arm < 3; arm++) {
      const armOffset = (arm * Math.PI * 2) / 3;
      ctx.beginPath();
      for (let i = 0; i < 32; i++) {
        const f = i / 31;
        const ang = f * Math.PI * 4 - t * 2.2 + armOffset;
        const rad = 0.2 + f * 0.85;
        const z = Math.sin(f * Math.PI * 2 - t * 1.5) * 0.45;
        const p = proj(rot3D(Math.cos(ang) * rad, Math.sin(ang) * rad, z, 0.65, t * 0.3, 0), cx, cy, R);
        if (i === 0) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
      }
      ctx.strokeStyle = `hsla(${(hue + arm * 28) % 360}, 100%, 74%, 0.75)`;
      ctx.lineWidth = 2.0;
      ctx.stroke();
    }
    ctx.restore();
  }

  /* Вариация 2: Кристальная Матрица / Икосаэдр (emblems-crystal) */
  const PHI = (1 + Math.sqrt(5)) / 2;
  const ICO_V = [
    [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
    [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
    [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]
  ].map(v => v.map(c => c * 0.56));

  function drawCrystalMatrix(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.38;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const pts = ICO_V.map(v => proj(rot3D(v[0], v[1], v[2], t * 0.55, t * 0.75, 0.2), cx, cy, R));
    ctx.strokeStyle = `hsla(${hue}, 100%, 80%, 0.62)`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = ICO_V[i][0] - ICO_V[j][0];
        const dy = ICO_V[i][1] - ICO_V[j][1];
        const dz = ICO_V[i][2] - ICO_V[j][2];
        if (dx*dx + dy*dy + dz*dz < 1.35) {
          ctx.moveTo(pts[i][0], pts[i][1]);
          ctx.lineTo(pts[j][0], pts[j][1]);
        }
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  /* Вариация 3: Солнечное Затмение Короны (emblems-eclipse) */
  function drawEclipseCorona(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.35;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2 + t * 0.25;
      const flare = 1.05 + 0.32 * Math.sin(i * 5 + t * 3.4);
      ctx.strokeStyle = `hsla(${hue + Math.sin(i)*20}, 100%, 72%, 0.55)`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * R * 0.78, cy + Math.sin(a) * R * 0.78);
      ctx.lineTo(cx + Math.cos(a) * R * flare, cy + Math.sin(a) * R * flare);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#080612";
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.74, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `hsla(${hue}, 100%, 88%, 0.92)`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  /* Вариация 4: Рунический Алтарь / Гексаграмма (emblems-runic) */
  function drawRunicAltar(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.38;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let tri = 0; tri < 2; tri++) {
      const baseAng = t * 0.6 + tri * (Math.PI / 3);
      ctx.beginPath();
      for (let k = 0; k <= 3; k++) {
        const a = baseAng + (k * Math.PI * 2) / 3;
        const p = proj(rot3D(Math.cos(a) * 0.98, Math.sin(a) * 0.98, 0, 0.45 * Math.sin(t * 0.8), 0.35, 0), cx, cy, R);
        if (k === 0) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
      }
      ctx.strokeStyle = `hsla(${hue + tri * 35}, 100%, 76%, 0.85)`;
      ctx.lineWidth = 2.0;
      ctx.stroke();
    }
    ctx.restore();
  }

  /* Вариация 5: Синтвейв Сетка (emblems-synth) */
  function drawSynthGrid(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.38;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createLinearGradient(cx, cy - R * 0.8, cx, cy + R * 0.3);
    g.addColorStop(0, `hsla(${hue}, 100%, 72%, 0.75)`);
    g.addColorStop(1, `hsla(${(hue + 80) % 360}, 100%, 60%, 0.15)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy - R * 0.12, R * 0.62, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `hsla(${(hue + 140) % 360}, 100%, 72%, 0.7)`;
    ctx.lineWidth = 1.2;
    for (let i = -4; i <= 4; i++) {
      const p0 = proj(rot3D(i * 0.25, 0.35, -0.4, 0.9, 0, 0), cx, cy, R);
      const p1 = proj(rot3D(i * 0.45, 1.05, 0.5, 0.9, 0, 0), cx, cy, R);
      ctx.beginPath();
      ctx.moveTo(p0[0], p0[1]);
      ctx.lineTo(p1[0], p1[1]);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* Вариация 6: Галактическая Спираль (emblems-galaxy) */
  function drawGalaxySpiral(ctx, w, h, t, hue) {
    const cx = w / 2, cy = h / 2, R = w * 0.4;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 64; i++) {
      const r = (i / 64) * 1.05;
      const a = i * 0.38 - t * 1.4 + (i % 2) * Math.PI;
      const p = proj(rot3D(Math.cos(a) * r, Math.sin(a) * r, Math.sin(r * 4 - t) * 0.15, 0.8, 0.25, 0), cx, cy, R);
      ctx.fillStyle = `hsla(${(hue + i * 1.5) % 360}, 100%, 80%, ${0.9 - r * 0.5})`;
      ctx.beginPath();
      ctx.arc(p[0], p[1], Math.max(1.2, (2.8 - r * 1.5) * p[2]), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function getActiveMode() {
    const cl = document.body.classList;
    if (cl.contains("emblems-quantum")) return "quantum";
    if (cl.contains("emblems-crystal")) return "crystal";
    if (cl.contains("emblems-eclipse")) return "eclipse";
    if (cl.contains("emblems-runic")) return "runic";
    if (cl.contains("emblems-synth")) return "synth";
    if (cl.contains("emblems-galaxy")) return "galaxy";
    if (cl.contains("emblems-cyber")) return "cyber";
    if (cl.contains("emblems-realism")) return "realism";
    return "other";
  }

  function drawAllSeals(t) {
    const mode = getActiveMode();
    if (mode === "other") return;
    const fxOpen = document.getElementById("fxPanel")?.classList.contains("show");
    for (const cv of sealCanvases) {
      if (!cv.isConnected) continue;
      const inDemo = !!cv.closest("#fxDemo");
      if (inDemo && !fxOpen) continue;
      const tierEl = cv.closest(".tier");
      if (tierEl && !tierEl.classList.contains("in-view")) continue;
      const ctx = cv.getContext("2d");
      if (!ctx) continue;
      const W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);
      const idx = (+cv.dataset.sealIdx) || 0;
      const hue = (+cv.dataset.hue) || 45;

      if (mode === "quantum") drawQuantumVortex(ctx, W, H, t, hue);
      else if (mode === "crystal") drawCrystalMatrix(ctx, W, H, t, hue);
      else if (mode === "eclipse") drawEclipseCorona(ctx, W, H, t, hue);
      else if (mode === "runic") drawRunicAltar(ctx, W, H, t, hue);
      else if (mode === "synth") drawSynthGrid(ctx, W, H, t, hue);
      else if (mode === "galaxy") drawGalaxySpiral(ctx, W, H, t, hue);
      else if (mode === "cyber") drawSealA(ctx, W, H, t, hue);
      else {
        if (idx === 0) drawSealS(ctx, W, H, t, hue);
        else if (idx === 1) drawSealA(ctx, W, H, t, hue);
        else if (idx === 2) drawSealB(ctx, W, H, t, hue);
        else if (idx === 3) drawSealC(ctx, W, H, t, hue);
        else if (idx === 4) drawSealD(ctx, W, H, t, hue);
        else drawSealE(ctx, W, H, t, hue);
      }
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
