window.$ring = (h, d0, d1, f) => { for (let d = d0; d < d1; d++) for (const [i, j] of [[h.i + d, h.j], [h.i - d, h.j], [h.i, h.j + d], [h.i, h.j - d]]) { const r = f(i, j); if (r) return r; } };
window.$run = (t, pin) => { for (let i = 0; i < t * 10; i++) { if (pin) pin(); FK.sim(0.1); } };
window.$calm = (a, b) => { FK.reset(); Object.assign(FK.K, { rain: 0, snowing: 0, temp: 10 }); if (b != null) WAR.treaty(a, b, 'war'); };
window.$rich = (s) => Object.assign(FK.SIDES[s].store, { food: 1e4, wood: 1e4, gold: 1e4, stone: 1e4, iron: 1e4 });
window.$tk = (k) => Object.keys(BOOKS.tech).find((c) => BOOKS.tech[c].key === k);
window.$put = (code, side, d0 = 8, d1 = 60, chk) => $ring(FK.seatOf(side), d0, d1, (i, j) => { if (chk && !ECON.canPlace(code, i, j, side)) return; const t = FK.build(code, i, j, FK.SIDES[side].col); if (t) { if (chk) t.side = side; t.done = 1; t.hp = t.hpMax = WAR.hpMax(t); return t; } });