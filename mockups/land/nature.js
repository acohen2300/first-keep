// nature.js: the mock's maker for Draft 1 (the nature-made land). Injected into the real game (v100) by mock.py; nothing in the game files changes.
// It replaces makeTerrain for one run: the seed shapes the land (fBm), water is found from that shape once.
// Sources (Draft 1): Priority-Flood (Barnes, Lehman & Mulla 2014); channel head A·S^1.27 >= 380, A in m² (Jefferson & McGee 2013);
// width ∝ √A (Leopold & Maddock 1953, b ≈ 0.5); marsh where ln(a / tan β) > 10.5 (Beven & Kirkby 1979; Qiu, Lyon & Creveling 2020).
(() => {
  const NAT = (window.NAT = { rough: 10, on: true });
  const hash = (x, y, s) => { let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const vnoise = (x, y, s) => { const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s); return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1; };
  const fbm = (x, y, s) => { let v = 0, amp = 1, f = 1 / 700, norm = 0; for (let o = 0; o < 5; o++) { v += amp * vnoise(x * f, y * f, (s + o * 7919) | 0); norm += amp; amp *= 0.5; f *= 2; } return v / norm; };
  const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
  const W8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  const heap = () => { const a = [], b = []; return { size: () => a.length,
    push(v, k) { let i = a.length; a.push(v); b.push(k); while (i) { const p = (i - 1) >> 1; if (a[p] <= a[i]) break; [a[p], a[i]] = [a[i], a[p]]; [b[p], b[i]] = [b[i], b[p]]; i = p; } },
    pop() { const v = a[0], k = b[0], lv = a.pop(), lk = b.pop(); if (a.length) { a[0] = lv; b[0] = lk; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && a[l] < a[m]) m = l; if (r < a.length && a[r] < a[m]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; [b[m], b[i]] = [b[i], b[m]]; i = m; } } return [v, k]; } }; };
  // the game's corner frame, read back
  const toCorner = (c, bx, by) => { const [cx, cy] = CORNERS[c], a = (A.corner + c * QT) * RAD, dx = bx - cx, dy = by - cy; return [dx * Math.cos(a) + dy * Math.sin(a), -dx * Math.sin(a) + dy * Math.cos(a)]; };
  const oldTerrain = window.makeTerrain, oldRender = window.renderGround;

  window.makeTerrain = function (roll) {
    if (!NAT.on) return oldTerrain(roll);
    const n = N * N, T = D.tile, LAND = D.land, tileM = T / D.upm, cellA = tileM * tileM, pocket = D.zone[0], plains = D.zone[2], blend = 200, plainsAmp = 0.25;
    const base = Float32Array.from(H), E = new Float32Array(n), seaSeed = new Uint8Array(n), graded = new Uint8Array(n), BX = new Float32Array(n), BY = new Float32Array(n);
    const TC = [0, 1, 2, 3].map((c) => corner(c, ...D.tc));
    for (let k = 0; k < n; k++) { const i = k % N, j = (k - i) / N, [bx, by] = toBoard((i + 0.5) * T, (j + 0.5) * T); BX[k] = bx; BY[k] = by;
      const b = base[k], coastF = Math.min(1, Math.max(0, b / LAND)) ** 2; let c = 0, d = Infinity; TC.forEach(([x, y], q) => { const r = Math.hypot(bx - x, by - y); if (r < d) { d = r; c = q; } });
      const [u, v] = toCorner(c, bx, by), Rc = fbm(u, v, seed ^ 0x5bd1), Rg = fbm(bx, by, seed), w = smooth(plains, plains + blend, d), R = Rc + (Rg - Rc) * w, amp = plainsAmp + (1 - plainsAmp) * w; // the same land at every home; the wilds beyond
      let e = b + NAT.rough * 2 * amp * R * coastF; const dm = Math.hypot(bx - MID, by - MID), gm = 1 - smooth(D.middle, D.middle + 100, dm), gp = 1 - smooth(pocket, pocket + 100, d), g = Math.max(gm, gp);
      if (g > 0 && b > 0) { e += (LAND - e) * g; if (g >= 1) graded[k] = 1; } E[k] = e; }
    // the cove: the sea reaches in by a channel to the home pond's spot (his sketch, 09:27), the same at every corner
    const carve = (bx, by, r, deep) => stamp(bx, by, r, (k) => { E[k] = Math.min(E[k], -deep); seaSeed[k] = 1; graded[k] = 0; });
    for (let c = 0; c < 4; c++) { const [cu, cv] = D.pond; carve(...corner(c, cu, cv), D.pondR, D.lakeDeep); for (let vv = cv; vv >= -150; vv -= 5) carve(...corner(c, cu, vv), 15, 6); }
    // Priority-Flood: the sea is the sink
    const W = new Float32Array(n), to = new Int32Array(n).fill(-1), order = new Int32Array(n), seen = new Uint8Array(n), sea = new Uint8Array(n), Q = heap(); let m = 0;
    for (let k = 0; k < n; k++) if (base[k] <= 0 || seaSeed[k]) { sea[k] = seen[k] = 1; W[k] = E[k]; Q.push(E[k], k); }
    while (Q.size()) { const [lv, k] = Q.pop(); order[m++] = k; const i = k % N, j = (k - i) / N; for (const [dx, dy] of W8) { const x = i + dx, y = j + dy; if (x < 0 || y < 0 || x >= N || y >= N) continue; const q = y * N + x; if (seen[q]) continue; seen[q] = 1; W[q] = Math.max(E[q], lv); to[q] = k; Q.push(W[q], q); } }
    const Acc = new Float32Array(n).fill(1); for (let p = m - 1; p >= 0; p--) { const k = order[p]; if (to[k] >= 0 && !sea[k]) Acc[to[k]] += Acc[k]; }
    const S = new Float32Array(n); for (let k = 0; k < n; k++) { if (sea[k]) continue; const i = k % N, j = (k - i) / N; let s = 0; for (const [dx, dy] of W8) { const x = i + dx, y = j + dy; if (x < 0 || y < 0 || x >= N || y >= N) continue; const dd = (E[k] - E[y * N + x]) / (Math.hypot(dx, dy) * T); if (dd > s) s = dd; } S[k] = s; }
    const out = new Uint8Array(n), depth = new Float32Array(n); // 0 land, 1 sea, 2 lake, 3 river, 4 marsh
    for (let k = 0; k < n; k++) { if (sea[k]) { out[k] = 1; depth[k] = -E[k]; } else if (W[k] - E[k] > 3) { out[k] = 2; depth[k] = W[k] - E[k]; } }
    const chan = new Uint8Array(n); let Amax = 1;
    for (let k = 0; k < n; k++) if (!sea[k] && !graded[k] && Acc[k] * cellA * Math.max(S[k], 1e-4) ** 1.27 >= 380) chan[k] = 1;
    for (let k = 0; k < n; k++) if (chan[k]) { let q = to[k]; while (q >= 0 && !sea[q] && !chan[q]) { chan[q] = 1; q = to[q]; } }
    for (let k = 0; k < n; k++) if (chan[k] && out[k] === 0 && Acc[k] > Amax) Amax = Acc[k];
    for (let k = 0; k < n; k++) if (chan[k] && out[k] === 0) { const r = Math.max(0.5, (40 / T) * Math.sqrt(Acc[k] / Amax)), i = k % N, j = (k - i) / N, rr = Math.ceil(r);
      for (let y = j - rr; y <= j + rr; y++) for (let x = i - rr; x <= i + rr; x++) { if (x < 0 || y < 0 || x >= N || y >= N) continue; const q = y * N + x; if (Math.hypot(x - i, y - j) <= r && out[q] === 0 && !graded[q]) { out[q] = 3; depth[q] = Math.min(12, 2 + r * 2); } } }
    let land = 0, water = 0, marsh = 0, river = 0;
    for (let k = 0; k < n; k++) { if (base[k] <= 0) continue; land++; if (out[k] || graded[k]) continue; if (Math.log((Acc[k] * cellA) / tileM / Math.max(S[k], 1e-3)) > 10.5) { out[k] = 4; marsh++; } }
    for (let k = 0; k < n; k++) { if (base[k] > 0 && (out[k] === 2 || out[k] === 3 || (out[k] === 1 && seaSeed[k]))) water++; if (out[k] === 3) river++; }
    // into the game: water cut into H now (so the forest and finds keep off it); the land's relief laid on at render
    lakes = []; RIV = []; const lab = new Uint8Array(n);
    for (let k = 0; k < n; k++) { if (out[k] === 1 && !(base[k] <= 0) || out[k] === 2 || out[k] === 3) H[k] = Math.min(H[k], -Math.max(1, depth[k])); }
    // banks: land within D.bank of water slopes down to it, as the game's lake() and channel() do (E26, E28)
    const far = new Float32Array(n).fill(Infinity), fr = []; for (let k = 0; k < n; k++) if (H[k] <= 0 && base[k] > 0) { far[k] = 0; fr.push(k); }
    for (let h = 0; h < fr.length; h++) { const k = fr[h], i = k % N, j = (k - i) / N; for (const [dx, dy] of W8) { const x = i + dx, y = j + dy; if (x < 0 || y < 0 || x >= N || y >= N) continue; const q = y * N + x, d = far[k] + Math.hypot(dx, dy) * T; if (d < far[q] && d < D.bank) { far[q] = d; fr.push(q); } } }
    for (let k = 0; k < n; k++) if (H[k] > 0 && far[k] < D.bank) { H[k] = Math.min(H[k], (LAND * far[k]) / D.bank); E[k] = Math.min(E[k], H[k]); }
    for (let k = 0; k < n; k++) if (out[k] === 2 && !lab[k]) { const st = [k]; lab[k] = 1; let sz = 0, sx = 0, sy = 0; while (st.length) { const q = st.pop(); sz++; sx += BX[q]; sy += BY[q]; const i = q % N, j = (q - i) / N;
        for (const [dx, dy] of W8.slice(0, 4)) { const x = i + dx, y = j + dy; if (x < 0 || y < 0 || x >= N || y >= N) continue; const r = y * N + x; if (out[r] === 2 && !lab[r]) { lab[r] = 1; st.push(r); } } }
      if (sz >= 6) lakes.push({ x: sx / sz, y: sy / sz, r: Math.sqrt((sz * T * T) / Math.PI) }); }
    NAT.E = E; NAT.far = far; NAT.out = out; NAT.base = base; NAT.graded = graded;
    NAT.stats = { lakes: lakes.length, river, waterPct: +((100 * water) / land).toFixed(1), marshPct: +((100 * marsh) / land).toFixed(1) };
  };

  window.renderGround = function () {
    if (NAT.on && NAT.E) { const { E, out, base, far } = NAT;
      for (let k = 0; k < N * N; k++) { if (base[k] >= D.land && far[k] >= D.bank && (out[k] === 0 || out[k] === 4)) H[k] = Math.max(E[k], D.dirtTop); if (out[k] === 4) MARSH[k] = 1; } // relief on the plateau; marsh from the wetness index
      const dh = (i, j) => (i < 0 || j < 0 || i >= N || j >= N ? 0 : Math.max(0, H[j * N + i])); // the corners, as makeGround does (E21)
      for (let cj = 0; cj <= N; cj++) for (let ci = 0; ci <= N; ci++) { const round = [[ci - 1, cj - 1, 3], [ci, cj - 1, 2], [ci - 1, cj, 1], [ci, cj, 0]].filter(([i, j]) => i >= 0 && j >= 0 && i < N && j < N).map(([i, j, slot]) => [dh(i, j), (j * N + i) * 4 + slot]).sort((a, b) => a[0] - b[0]);
        for (let a = 0; a < round.length; ) { let b = a + 1; while (b < round.length && round[b][0] - round[b - 1][0] <= REPOSE) b++; let s = 0; for (let q = a; q < b; q++) s += round[q][0]; for (let q = a; q < b; q++) CH[round[q][1]] = s / (b - a); a = b; } }
      for (const t of things) { if (!(t.k >= 0)) continue; const [vx, vy] = toView(t.bx, t.by, H[t.k]); t.vx = vx; t.vy = vy; } things.sort((a, b) => a.vy - b.vy); NAT.E = null; }
    return oldRender();
  };
})();
