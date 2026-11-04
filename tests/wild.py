# The wild batch (branch wild81, Nov 1): the wild by kind (answer 1b), decision 4b, answers 11 and 12, and the hunt of Nov 1 (A and B),
# with Albert's three Victory sightings. Each check fails on main 66a68a5, the build before it. Run by the gate:  python3 tests/wild.py
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = """() => {
  const F = window.__fk, bad = [], T = 1 / 30, W = () => F.G.P.length - 1;
  const T_ = (n, f) => { try { f(); } catch (e) { bad.push(n + ': a check stopped: ' + e.message + ' @ ' + String(e.stack).split(String.fromCharCode(10)).slice(1,4).join(' | ')); } };
  const run = (secs) => { for (let i = 0; i < secs * 30; i++) F.step(T); };
  const fresh = (seed = 7) => { F.newGame(seed); F.act('close'); F.setPause(false); const G = F.G; G.fogOn = false; G.ev.next = 1e9; G.ev.cur = null; G.wx = 'clear'; G.clim.wet = false; G.clim.snow = 0; G.clim.mud = 0; G.clim.ice = 0; F.step(T); return G; };   // a clear sky: the walking speed is not the test's subject (preview 52: seed 3 opened in a blizzard and the builder arrived late)
  const open = (G) => { const k = F.keepOf(0); let best = 0, P = null; for (let x = 100; x < F.MAP - 100; x += 20) for (let y = 100; y < F.MAP - 100; y += 20) {
      const dk = Math.hypot(x - k.x, y - k.y); if (dk < 150 || dk > 400 || F.blockedCell(F.gcell(x, y), 0) || G.lakes.some((L) => Math.hypot(L.x - x, L.y - y) < L.r + 40)) continue; const m = Math.min(...G.blds.map((b) => Math.hypot(b.x - x, b.y - y)), ...G.units.map((u) => Math.hypot(u.x - x, u.y - y)));
      if (m > best) { best = m; P = { x, y }; } } return P; };
  const clear = (G, P, r) => { for (const u of G.units) if (Math.hypot(u.x - P.x, u.y - P.y) < r) { u.hp = 0; u.gone = true; } G.units = G.units.filter((u) => u.hp > 0); };
  const gone = (G, ...us) => { for (const u of us) u.hp = 0; G.units = G.units.filter((u) => u.hp > 0); };

  // ── answer 1b: animals are everyone's foe; the Natives, outlaws, bandits and robbers each by their own regard and stance ──
  T_('1b', () => { const G = fresh(), w = W(), P = open(G); clear(G, P, 300);
    const sp = F.addUnit(0, 'spear', P.x, P.y), bd = F.addUnit(w, 'bandit', P.x + 40, P.y), rb = F.addUnit(w, 'robber', P.x, P.y + 200), wf = F.addUnit(w, 'wolf', P.x - 200, P.y);
    bd.hx = bd.x; bd.hy = bd.y; rb.hx = rb.x; rb.hy = rb.y; wf.hx = wf.x; wf.hy = wf.y;
    if (F.gangOf(bd) !== 'ban' || F.gangOf(rb) !== 'rob' || F.gangOf(wf) !== 'beast') bad.push(`1b: the groups are ${[bd, rb, wf].map(F.gangOf)}, not bandits, robbers, a beast`);
    const r0 = [F.regardOf(0, 'nat'), F.regardOf(0, 'rob'), F.regardOf(0, 'out')];
    G.P[0].res.g = 9000; for (let i = 0; i < 8 && F.regardOf(0, 'ban') < F.REGARD.peaceAt; i++) F.giveGift(0, 300, 'ban');
    if (!(F.regardOf(0, 'ban') >= F.REGARD.peaceAt)) bad.push('1b: bribes did not raise the bandits to the peace line: ' + F.regardOf(0, 'ban'));
    if (F.regardOf(0, 'nat') !== r0[0] || F.regardOf(0, 'rob') !== r0[1] || F.regardOf(0, 'out') !== r0[2]) bad.push("1b: a bribe to the bandits moved another group's regard");
    if (F.gangRel(0, 'ban') !== 'peace') bad.push('1b: the bandits did not make peace when their regard passed the line');
    if (F.isFoe(0, bd) || F.isFoe(w, sp, bd)) bad.push('1b: at peace with the bandits, a bandit and your soldier are still foes');
    if (!F.isFoe(0, rb) || !F.isFoe(w, sp, rb)) bad.push('1b: at peace with the bandits, the robbers are not foes');
    if (!F.isFoe(0, wf) || !F.isFoe(w, sp, wf)) bad.push('1b: an animal is not a foe');
    bd.horde = true; if (F.gangOf(bd) !== 'out' || !F.isFoe(0, bd)) bad.push('1b: the horde is not the outlaws, at war by their own regard'); bd.horde = false;
    const h0 = sp.hp; run(3); if (sp.hp < h0) bad.push('1b: a bandit at peace attacked your soldier at its camp');
    const rb0 = F.regardOf(0, 'ban'); F.setRel(0, 'ban', 'war'); if (F.gangRel(0, 'ban') !== 'war' || !F.isFoe(0, bd)) bad.push('1b: turning on the bandits did not make them foes');
    if (Math.abs(rb0 - F.regardOf(0, 'ban') - F.REGARD.warCost) > 1e-9) bad.push('1b: turning on the bandits did not cost ' + F.REGARD.warCost + ' regard'); });

  // ── decision 4b: the wild's people start nothing with a computer; a camp fights only who struck it, for a minute, on its own ground ──
  T_('4b', () => { const G = fresh(), w = W();
    const f = G.finds.find((x) => x.kind === 'ruins' && !x.done), g = G.units.find((u) => u.find === f.id && u.hp > 0);
    const cv = F.addUnit(1, 'vil', g.x + 25, g.y); cv.job = null; cv.post = { x: cv.x, y: cv.y };
    if (F.isFoe(w, cv, g)) bad.push("4b: a bandit guard takes a computer's villager that never struck it for a foe");
    const pv = F.addUnit(0, 'vil', g.x - 25, g.y); if (!F.isFoe(w, pv, g)) bad.push("4b: the player's rules changed: a guard leaves your villager be");
    gone(G, pv); const c0 = cv.hp; run(3); if (cv.hp < c0) bad.push("4b: a guard attacked a computer's villager that never struck it");
    const s1 = F.addUnit(1, 'spear', g.x + 30, g.y), s2 = F.addUnit(1, 'spear', g.x, g.y + 30);
    F.hurt(1, s1, g, 1);
    if (!F.isFoe(w, s1, g)) bad.push('4b: the camp does not fight the computer soldier that struck it');
    if (F.isFoe(w, s2, g)) bad.push('4b: the camp turns on a computer soldier that did not strike it');
    const x0 = s1.x; s1.x = g.x + 900; if (F.isFoe(w, s1, g)) bad.push('4b: the camp chases its instigator off its own ground'); s1.x = x0;
    G.t += F.NATIVE.struck + 1; if (F.isFoe(w, s1, g)) bad.push('4b: the camp still remembers its instigator after a minute');
    const n = G.units.find((u) => u.native && u.hp > 0); G.rel[1][w] = G.rel[w][1] = 'war';
    const s3 = F.addUnit(1, 'spear', n.x + 20, n.y);
    if (F.isFoe(w, s3, n)) bad.push('4b: a Native takes a computer soldier at war with them, which never struck, for a foe');
    F.hurt(1, s3, n, 1); if (!F.isFoe(w, s3, n)) bad.push('4b: a Native does not fight the computer soldier that struck it');
    for (const p of G.P) if (p.id !== w) G.rel[p.id][w] = G.rel[w][p.id] = p.id === 0 ? 'peace' : 'war';
    F.gangState('rob').rel[0] = 'peace'; // only the computers are at war with the robbers
    F.natState().raidAt = 0.001; G.t = Math.max(G.t, 1200); F.natRaid(); if (G.units.some((u) => u.back)) bad.push('4b: a raid rode for a computer'); });

  T_('4b horde', () => { const G = fresh(); G.hz = { ...(G.hz || {}), horde: 1 }; G.diff = 'normal';
    { const k = F.keepOf(0); for (let i = 0; i < 30; i++) F.addUnit(0, 'sword', k.x + 30, k.y + 30); } // you are the strongest: the horde would go for a computer
    G.horde = { at: G.t, said: 2 }; const n0 = G.units.length; F.hordeTick(); const H = G.units.slice(n0).filter((u) => u.horde);
    const k0 = F.keepOf(0); if (!H.length) bad.push('4b horde: the check raised no horde'); else if (H.some((u) => u.hx !== k0.x || u.hy !== k0.y)) bad.push('4b horde: the horde went for a computer'); });
  T_('4b pits', () => { const G = fresh(), w = W(), M = F.MID, R = F.THRONE, x = M + R.isle + 40, y = M;
    const pit = F.mkBld(w, 'pit', x, y, 1); pit.seen = {}; G.blds.push(pit); const cu = F.addUnit(1, 'spear', x + 2, y); F.step(T); for (let i = 0; i < 12; i++) F.step(T);
    if (!(pit.hp > 0) || cu.hp < cu.max) bad.push("4b pits: the Natives' pit took a computer's soldier");
    const pu = F.addUnit(0, 'spear', x + 2, y); for (let i = 0; i < 12; i++) F.step(T); if (pit.hp > 0 && pu.hp >= pu.max) bad.push("4b pits: the Natives' pit let your soldier through (the player's rules changed)"); });
  T_('4b leash', () => { const G = fresh(), w = W(), n = G.units.find((u) => u.native && u.hp > 0), T0 = G.blds.find((b) => b.kind === 'throne');
    G.rel[1][w] = G.rel[w][1] = 'war'; const s = F.addUnit(1, 'spear', n.x + 20, n.y); F.hurt(1, s, n, 1);
    if (!F.isFoe(w, s, n)) bad.push('4b leash: a Native does not fight the one that struck it in its yard');
    const a = Math.atan2(s.y - T0.y, s.x - T0.x); s.x = T0.x + Math.cos(a) * (F.YARD + 30); s.y = T0.y + Math.sin(a) * (F.YARD + 30);
    if (F.isFoe(w, s, n)) bad.push('4b leash: a Native chases its instigator past its yard');
    s.x = T0.x + Math.cos(a) * (F.YARD - 30); s.y = T0.y + Math.sin(a) * (F.YARD - 30); if (!F.isFoe(w, s, n)) bad.push('4b leash: a Native lets its instigator go inside its yard'); });

  // ── answer 11: a conversion refused at the army ceiling says so, in Albert's words ──
  T_('11', () => { const G = fresh(), P = open(G); clear(G, P, 300); G.rel[0][1] = G.rel[1][0] = 'war';
    for (let i = 0; i < 400 && !/ceiling/.test(F.trainWhy(0, 'spear') || ''); i++) F.addUnit(0, 'spear', P.x - 60, P.y - 60);
    const pr = F.addUnit(0, 'priest', P.x, P.y), e = F.addUnit(1, 'spear', P.x + 20, P.y); pr.state = 'convert'; pr.cv = e.id; pr.cvT = 0;
    F.priestTick(pr, T, 1);
    if (!(G.mail || []).some((m) => m.text === 'At Maximum Occupancy Capacity')) bad.push('11: a conversion refused at the ceiling says nothing (' + ((G.mail || [])[0] || {}).text + ')');
    if (e.owner !== 1) bad.push('11: a soldier was converted past the ceiling'); });

  // ── answer 12, then Albert's decision 5 (Nov 1, 11:22): no ambush bonus for anyone, on any ground (v81 brings surprise and home ground) ──
  T_('12', () => { const G = fresh(), w = W(), P = open(G), M = F.MID, R = F.THRONE;
    const blow = (x, y) => { const a = F.addUnit(w, 'native', x, y); a.native = true; const t = F.addUnit(1, 'sword', x + 8, y); F.hurt(w, a, t, 10); const d = t.max - t.hp; gone(G, a, t); return d; };
    const tree = G.nodes.find((n) => n.kind === 'tree' && n.amt > 0 && Math.hypot(n.x - M, n.y - M) > 400);
    const d = [blow(P.x, P.y), blow(M + R.isle + 25, M), blow(M + (R.r + 10) * 0.7071, M + (R.r + 10) * 0.7071), blow(tree.x, tree.y)];
    if (new Set(d.map((x) => x.toFixed(6))).size !== 1) bad.push('12: a Native strikes harder on some ground (open, causeway, camp edge, wood): ' + d.map((x) => x.toFixed(2)).join(', ')); });

  // ── decision 6 (Albert, Nov 1, 11:29): an empty store is not a famine; a famine (no food in store or in reach) keeps full work two days,
  // then weakens (Keys 1950), and only then, under Famine, people leave; those working food eat from it ──
  const noFood = (G) => { G.nodes = G.nodes.filter((n) => n.type !== 'food'); for (const u of G.units) if (u.owner === W() && F.UNIT[u.kind].meat) u.hp = 0; G.units = G.units.filter((u) => u.hp > 0); };
  T_('H1', () => { const G = fresh(), p = G.P[0]; G.hz = { starve: 1 }; G.diff = 'normal'; p.res.f = 0; run(5);
    if (!p.hungry) bad.push('H1: no food in store did not make your side hungry');
    if (p.famT || F.hungerOf(0) !== 1) bad.push('H1: an empty store with food in reach counts as a famine (' + p.famT + ', work ' + F.hungerOf(0) + ')');
    if (!(G.mail || []).some((m) => m.text === 'Food stores empty: put villagers on food.')) bad.push('H1: no toast for an empty store');
    if ((G.mail || []).some((m) => m.text === 'Famine: no food in reach. Two days to recover.')) bad.push('H1: the famine toast spoke with food in reach'); });
  T_('H2', () => { const G = fresh(), p = G.P[0]; G.hz = {}; G.diff = 'normal'; p.res.f = 0; noFood(G); run(5);
    if (!(p.famT >= 3)) bad.push('H2: no food in store or in reach is not a famine (' + p.famT + ')');
    if (!(G.mail || []).some((m) => m.text === 'Famine: no food in reach. Two days to recover.')) bad.push('H2: no toast at the start of a famine');
    if ((G.mail || []).some((m) => m.text === 'Food stores empty: put villagers on food.')) bad.push('H2: both toasts spoke in a true famine');
    p.famT = 238; if (F.hungerOf(0) !== 1) bad.push('H2: a famine under two days already weakens the work: ' + F.hungerOf(0));
    run(3); if (Math.abs(F.hungerOf(0) - 0.72) > 1e-9) bad.push('H2: after two days (240 s) of famine work is ' + F.hungerOf(0) + ', not 0.72'); });
  T_('H3', () => { const G = fresh(), p = G.P[0]; G.hz = { starve: 1 }; G.diff = 'normal'; p.res.f = 0; noFood(G);
    const starve = (secs) => { for (let i = 0; i < secs; i++) { p.res.f = 0; run(1); } }; // nothing comes in: trade and tribute kept a little food arriving
    const n0 = F.unitsOf(0, 'vil').length; starve(130); if (F.unitsOf(0, 'vil').length < n0) bad.push('H3: people left before the famine weakened them');
    if (!(p.famT >= 60)) bad.push('H3: the check could not hold a famine (' + p.famT + ')');
    p.famT = 240 + 30 - 2; starve(4); if (!(F.unitsOf(0, 'vil').length < n0)) bad.push('H3: under Famine nobody left once the famine weakened them'); });
  T_('H4', () => { const G = fresh(), p = G.P[0], vs = F.unitsOf(0, 'vil'); p.res.f = 500;
    for (const v of vs) { v.job = 'wood'; v.node = null; v.hunt = null; } run(2); const all = p.eats;
    const bush = G.nodes.find((n) => n.type === 'food' && n.amt > 0 && isFinite(n.amt)), v = vs[0]; v.job = 'food'; v.node = bush; v.x = bush.x + 200; v.y = bush.y; v.carry = 0; const a0 = bush.amt; run(2);
    if (!(p.eats < all - 1e-9)) bad.push('H4: a villager working food still eats from the store (' + all.toFixed(3) + ' then ' + p.eats.toFixed(3) + ')');
    if (!(bush.amt < a0)) bad.push('H4: a villager working a bush does not eat from it'); });

    // ── hunt A #1, Victory sighting 3: the Games wait for the board's peace; no line for a war ──
  T_('A1', () => { const G = fresh(); G.gamesT = 0; G.t = 1500; const c0 = (G.chron || []).length, L0 = () => G.P.reduce((s, p) => s + (p.laurels || 0), 0);
    for (let i = 0; i < 24 * 6; i++) { G.t += 10; F.peaceTick(); } // 24 minutes at war: the Games never come, and no line says so
    if ((G.chron || []).slice(c0).some((c) => /not held/.test(c.text))) bad.push('A1 (Victory sighting 3): the chronicle says the Games were not held: war');
    if (L0()) bad.push('A1: the Games were held at war (' + L0() + ' laurels after 24 minutes)');
    const S = G.P.filter((p) => p.id !== W()).map((p) => p.id); for (const a of S) for (const b of S) if (a !== b) G.rel[a][b] = 'peace';
    G.warAt = {}; F.peaceTick(); if (L0() !== 4) bad.push('A1: the Games due were not held at the first peace (' + L0() + ' laurels)');
    const n = L0(); G.t += 60; F.peaceTick(); if (L0() !== n) bad.push('A1: the Games were held again before they were due'); });

  // ── hunt A #2: the danger disc stamped by rows marks exactly the squares the cell-by-cell disc did ──
  T_('A2', () => { const N = F.NC, A = new Uint8Array(N * N), B = new Uint8Array(N * N); let r = 1, diff = 0;
    const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
    for (let k = 0; k < 60; k++) { const px = rnd() * F.MAP, py = rnd() * F.MAP, rr = 10 + rnd() * 300; A.fill(0); B.fill(0); F.stampDanger(A, px, py, rr);
      const R = Math.ceil(rr / F.NAVC), cx = Math.floor(px / F.NAVC), cy = Math.floor(py / F.NAVC);
      for (let y = Math.max(0, cy - R); y <= Math.min(N - 1, cy + R); y++) for (let x = Math.max(0, cx - R); x <= Math.min(N - 1, cx + R); x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= R * R) B[y * N + x] = 1;
      for (let i = 0; i < A.length; i++) if (A[i] !== B[i]) diff++; }
    if (diff) bad.push(`A2 (an equivalence test: it passes on main too, and guards the speed-up): the row-stamped danger disc differs from the disc in ${diff} squares`); });

  // ── hunt A #3: a builder bitten by a boar fights back, then goes back to its site with its jobs kept ──
  T_('A3', () => { const G = fresh(3), k = F.keepOf(0), P = open(G); Object.assign(G.P[0].res, { f: 999, w: 999, s: 999, g: 999 });
    const v = F.unitsOf(0, 'vil')[0]; F.setJob(v, 'wood');
    let site = F.build(0, 'barracks', k.x + 120, k.y + 60) || F.build(0, 'barracks', k.x - 120, k.y + 60) || F.build(0, 'barracks', P.x, P.y); if (!site) { const sp = F.findSpot(0, 'barracks', k.x, k.y, 80, 260); site = sp && F.build(0, 'barracks', sp.x, sp.y); } if (!site) { bad.push('A3: no ground for a barracks near the Town Center'); return; }
    for (const u of G.units) if (u.rep === site && u !== v) F.setJob(u, null);
    F.sendBuilder(v, site); const b = F.addUnit(W(), 'boar', v.x + 5, v.y); F.hurt(W(), b, v, 1);
    if (v.job !== 'repair' || v.rep !== site || v.pj !== 'wood' || v.hunt !== b) bad.push(`A3: a bitten builder is on ${v.job}, its old job ${v.pj}, its site ${v.rep === site ? 'kept' : 'lost'}, the beast ${v.hunt === b ? 'its target' : 'not fought'}`);
    b.hp = 0; run(60);
    if (!(site.prog > 0.2)) bad.push(`A3: the site stood unworked after the bite (${site.prog.toFixed(2)})`); });

  T_('A3b', () => { const G = fresh(3), k = F.keepOf(0); Object.assign(G.P[0].res, { f: 999, w: 999, s: 999, g: 999 });
    const v = F.unitsOf(0, 'vil')[0], deer = F.addUnit(W(), 'deer', v.x + 280, v.y); F.setJob(v, 'food'); v.hunt = deer;
    const site = F.build(0, 'house', k.x + 90, k.y - 70) || F.build(0, 'house', k.x - 90, k.y + 70);
    for (const u of G.units) if (u.rep === site && u !== v) F.setJob(u, null);
    F.sendBuilder(v, site); run(8);
    if (v.hunt || !(site.prog > 0)) bad.push(`A3: a hunter sent to build went on hunting (hunt ${v.hunt ? v.hunt.kind : 'none'}, site ${site.prog.toFixed(2)} after 8 s)`); });

  T_('D1', () => { const G = fresh(), w = W(), f = G.finds.find((x) => x.kind === 'ruins' && !x.done && G.units.some((u) => u.find === x.id && F.gangOf(u) === 'ban')); F.dangerMap(); // the first ruin the bandits guard (the map's order is not fixed)
    G.guarded = (G.guarded || []).filter((g) => g.id === f.id); G.threats = []; // only this ruin's guards are tested: the map's other dens, chests and animals near it are not fixed
    const c = F.gcell(f.x, f.y), at = () => (F.dangerMap(), F.DANGER[0][c]);
    if (!at()) bad.push('D1: at war with the bandits, their guarded ruins are not danger to your gatherers');
    F.gangState('ban').regard[0] = 60; F.gangState('ban').rel[0] = 'peace';
    if (at()) bad.push('D1: at peace with the bandits, their guarded ruins are still danger to your gatherers');
    if (F.DANGER[1][c]) bad.push("D1: guards that start nothing with a computer (4b) mark danger for it"); });

  // ── hunt A #4: a beast or guard with no foe held looks every fifth tick, not every tick; a lost foe is looked past at once ──
  T_('A4', () => { const G = fresh(), w = W(), P = open(G); clear(G, P, 300);
    const g = F.addUnit(w, 'bandit', P.x, P.y); g.hx = g.x; g.hy = g.y; g.tgt = null;
    const v = F.addUnit(0, 'vil', P.x + 30, P.y); v.job = null; v.post = { x: v.x, y: v.y };
    while ((G.tick + g.id) % 5 === 0) G.tick++;
    F.wildTick(g, T, 1); if (g.tgt) bad.push('A4: a guard with no foe held looked again off its fifth tick');
    while ((G.tick + g.id) % 5 !== 0) G.tick++;
    F.wildTick(g, T, 1); if (g.tgt !== v) bad.push('A4: a guard did not look on its fifth tick');
    G.tick++; v.hp = 0; const v2 = F.addUnit(0, 'vil', P.x - 30, P.y); v2.job = null; v2.post = { x: v2.x, y: v2.y };
    F.wildTick(g, T, 1); if (g.tgt !== v2) bad.push('A4: a guard whose foe fell did not look again at once'); });

  // ── hunt A #5: the look-ahead runs when a corner is passed or four times a second, not every tick ──
  T_('A5', () => { const G = fresh(), N = F.NC, M = F.MAP; let r = 7, diff = 0; const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
    const ref = (x1, y1, x2, y2, o) => { const dx = x2 - x1, dy = y2 - y1, n = Math.ceil(Math.hypot(dx, dy) / 4); for (let i = 1; i <= n; i++) { const c = F.gcell(x1 + (dx * i) / n, y1 + (dy * i) / n); if (F.blockedCell(c, o)) return false; } return true; };
    for (let k = 0; k < 400; k++) { const x1 = rnd() * (M + 40) - 20, y1 = rnd() * (M + 40) - 20, x2 = x1 + (rnd() - 0.5) * 300, y2 = y1 + (rnd() - 0.5) * 300; if (F.lineClear(x1, y1, x2, y2, 0, false) !== ref(x1, y1, x2, y2, 0)) diff++; }
    if (diff) bad.push(`A5 (an equivalence test: it passes on main too, and guards the speed-up): the inlined line test disagrees with gcell's in ${diff} of 400 lines (edges included)`); });

  // ── hunt A #6: one flood a side, its buffer made once and reused ──
  T_('A6', () => { const G = fresh(), a = F.compOf(1), keep = a.slice(); G.rel[1][2] = G.rel[1][2] === 'war' ? 'peace' : 'war'; const b = F.compOf(1);
    if (a !== b) bad.push('A6: a new region buffer was made for each flood'); G.rel[1][2] = G.rel[1][2] === 'war' ? 'peace' : 'war'; const c = F.compOf(1);
    let d = 0; for (let i = 0; i < c.length; i++) if (c[i] !== keep[i]) d++; if (d) bad.push(`A6: the same grid floods to other regions (${d} squares)`); });

  // ── hunt A #7: only a spent tree rebuilds the walking grid ──
  T_('A7', () => { const G = fresh(); const bush = G.nodes.find((n) => n.kind === 'bush' && n.amt > 0), tree = G.nodes.find((n) => n.kind === 'tree' && n.amt > 0);
    G.navDirty = false; bush.amt = 0; F.reap(); if (G.navDirty) bad.push('A7: a picked bush rebuilt the walking grid');
    G.navDirty = false; tree.amt = 0; F.reap(); if (!G.navDirty) bad.push('A7: a felled tree did not rebuild the walking grid'); });

  // ── hunt A #8: a computer's wall plan laid in one think rebuilds the grid once ──
  T_('A8', () => { const G = fresh(); const p = G.P[1]; p.pers = 'bal'; p.age = 1; p.res = { f: 0, w: 0, s: 2000, g: 0, i: 0 }; p.ai.siteT = G.t;
    const n0 = G.blds.length, v0 = F.NAV.v; F.think(p); const walls = G.blds.slice(n0).filter((b) => b.kind === 'wall' || b.kind === 'gate').length, dv = F.NAV.v - v0, other = G.blds.length - n0 - walls;
    if (walls < 2) bad.push('A8: the check laid ' + walls + ' wall pieces, too few to tell');
    else if (dv > other + 1) bad.push(`A8: ${walls} wall pieces in one think rebuilt the grid ${dv - other} times`); });

  // ── hunt A #9: the dead fields are gone ──
  T_('A9', () => { const G = fresh(); const dead = [['yearN', G], ['gamesN', G], ['lost', G], ['ration', G.P[0]], ['rations', G.P[0]]].filter(([k, o]) => k in o).map(([k]) => k);
    F.step(T); if (dead.length) bad.push('A9: dead fields still made: ' + dead.join(', ')); });

  // ── hunt A #10: a slow tick's body reads its own period: regard settles the same whatever the beat ──
  T_('A10', () => { const out = [], b0 = F.BEAT.natives[0];
    for (const beat of [5, 10]) { const G = fresh(); F.BEAT.natives[0] = beat; F.gangState('nat').regard[0] = 80; run(120); out.push(F.regardOf(0)); }
    F.BEAT.natives[0] = b0;
    if (Math.abs(out[0] - out[1]) > 0.5) bad.push(`A10: two minutes of regard drift at a 5 s beat give ${out[0].toFixed(2)}, at a 10 s beat ${out[1].toFixed(2)}: the body does not read its beat`); });

  T_('S1', () => { const G = fresh(), k = F.keepOf(0); F.openCard({ type: 'bld', id: k.id }); F.act('ktab:mis'); F.gangState('ban').rel[0] = 'peace'; F.ui(true);
    const hs = document.querySelector('#card [data-act="relwant:ban,ally"]');
    if (!hs || hs.classList.contains('dis')) bad.push("S1: the bandits' handshake is dim: every misfit group can be a friend");
    F.act('relwant:ban,ally'); F.ui(true); const cell = document.querySelector('#card [data-act="relok:ban"]').parentElement.querySelector('.info');
    if (!/Neutral\\s*→\\s*Friend/.test(cell.innerText)) bad.push("S1: the bandits' handshake did not take the pick: " + cell.innerText.replace(/\\n/g, ' '));
    F.act('close');
    // a lord's row (a vassal) is dim and a tap there takes no pick
    F.makeVassal(1, 0, 'fair'); F.openCard({ type: 'bld', id: k.id }); F.act('ktab:rel'); F.ui(true); F.act('relwant:1,war');
    if ((G.relPick[1] || {}).want) bad.push("S1: a dim icon (your vassal's row) took the pick"); F.act('close'); });
  T_('G1', () => { const G = fresh(), w = W(), P = G.P[0]; P.age = 1; P.res.g = 999; Object.assign(P.res, { f: 999 });
    const f = G.finds.find((x) => x.kind === 'ruins' && !x.done), g = G.units.find((u) => u.find === f.id && u.hp > 0);
    F.gangState('ban').regard[0] = 80; F.gangState('ban').rel[0] = 'peace';
    if (!F.setRel(0, 'ban', 'ally')) bad.push('G1: no emissary went to the bandits at regard 80: ' + F.relWhy(0, 'ban', 'ally'));
    for (let i = 0; i < 240 && F.gangRel(0, 'ban') !== 'ally'; i++) run(1);
    if (F.gangRel(0, 'ban') !== 'ally') bad.push('G1: the bandits did not take you as a friend at regard 80');
    else if (F.isFoe(0, g) || F.isFoe(w, F.addUnit(0, 'spear', g.x + 20, g.y), g)) bad.push('G1: a friend of the bandits is still their foe');
    F.gangState('ban').regard[0] = 40; run(6); if (F.gangRel(0, 'ban') === 'ally') bad.push('G1: the bandits kept the alliance after regard fell'); });
  T_('G2', () => { const G = fresh(), w = W(); G.rel[0][w] = G.rel[w][0] = 'peace'; F.gangState('rob').rel[0] = 'war';
    F.natState().raidAt = 0.001; G.t = Math.max(G.t, 1200); F.natRaid();
    if (!G.units.some((u) => u.back && u.hx !== undefined)) bad.push('G2: at war with the robbers and at peace with the Natives, no raid rode for you (the robbers alone decide)'); });

  T_('G2 reverse', () => { const G = fresh(), w = W(); G.rel[0][w] = G.rel[w][0] = 'war'; F.gangState('rob').rel[0] = 'peace';
    F.natState().raidAt = 0.001; G.t = Math.max(G.t, 1200); F.natRaid();
    if (G.units.some((u) => u.back && u.hx !== undefined)) bad.push('G2 reverse: at peace with the robbers and at war with the Natives, a raid rode for you (the robbers alone decide)'); });
  // ── fresh review #7: a side at peace with the outlaws is not ridden for by the horde ──
  T_('horde at peace', () => { const G = fresh(); G.hz = { ...(G.hz || {}), horde: 1 }; G.diff = 'normal'; F.gangState('out').rel[0] = 'peace';
    G.horde = { at: G.t, said: 2 }; const n0 = G.units.length; F.hordeTick();
    if (G.units.slice(n0).some((u) => u.horde)) bad.push('horde at peace: the horde rode for a side at peace with the outlaws');
    if (G.horde !== 'done') bad.push('horde at peace: the horde stayed due with nobody at war to ride for');
    const G2 = fresh(); G2.hz = { ...(G2.hz || {}), horde: 1 }; G2.diff = 'normal'; F.gangState('out').rel[0] = 'war'; G2.horde = { at: G2.t, said: 2 }; const m0 = G2.units.length; F.hordeTick();
    if (!G2.units.slice(m0).some((u) => u.horde)) bad.push('horde at peace: at war with the outlaws, no horde rode (the check is blind)'); });
  // ── fresh review #8: the save's 42 to 43 step keeps the content, not only the positions ──
  T_('M42', () => { const S = { v: 42, gamesN: 3, P: [{ id: 0, ration: 1, rations: 2, res: { f: 5 } }], nat: { regard: [11, 22, 33, 44, 55], gifts: [[1], [], [], [], []], warBy: { a: 1 }, hitT: { b: 2 }, raidAt: 77 } };
    const O = F.MIGRATE[42](JSON.parse(JSON.stringify(S))), N = O.gang && O.gang.nat;
    if (O.v !== 43) bad.push('M42: the step did not reach shape 43');
    if (!N || JSON.stringify(N.regard) !== '[11,22,33,44,55]' || JSON.stringify(N.gifts) !== '[[1],[],[],[],[]]' || JSON.stringify(N.warBy) !== '{"a":1}' || JSON.stringify(N.hitT) !== '{"b":2}') bad.push('M42: the regard, gifts, warBy or hitT of the Natives did not move to gang.nat intact: ' + JSON.stringify(N));
    for (const k of ['regard', 'gifts', 'warBy', 'hitT']) if (k in O.nat) bad.push('M42: nat still holds ' + k);
    if (O.nat.raidAt !== 77) bad.push('M42: other fields of the Natives were lost');
    if ('gamesN' in O || 'ration' in O.P[0] || 'rations' in O.P[0]) bad.push('M42: a dead field stayed');
    if (O.P[0].res.f !== 5 || O.P[0].id !== 0) bad.push('M42: a live field of a side was lost'); });

  // ── Albert's sighting (Nov 1, 08:13 and 08:18; QC D10): "z 0" while villagers showed Zs. One predicate (freeVil) for the Zs, the strip and idlego ──
  T_('D10', () => { const G = fresh(); G.nodes = G.nodes.filter((n) => n.type !== 'food'); for (const u of G.units) if (u.owner === W() && F.UNIT[u.kind].meat) u.hp = 0; G.units = G.units.filter((u) => u.hp > 0);
    const vs = F.unitsOf(0, 'vil'); for (const u of vs) F.setJob(u, 'food'); run(6); F.ui(true);
    const waiting = vs.filter((u) => u.job && u.idle), z = document.getElementById('stIdl').innerText.replace(/\\s+/g, ' ').trim();
    if (!waiting.length) bad.push('D10: the check made no waiting villager');
    if (z !== 'z ' + vs.filter((u) => !u.inside && (u.idle || !u.job)).length) bad.push(`D10: the strip reads "${z}" while ${waiting.length} villagers wait with Zs`);
    F.act('idlego'); const c = F.cam; if (!waiting.some((u) => Math.abs(c.tx - u.x) < 1 && Math.abs(c.ty - u.y) < 1)) bad.push('D10: the idle button does not go to a waiting villager'); });

  // ── gatherer caps (Albert, Nov 1, 12:57): a find holds as many as its working spots (a tree one feller); the next goes elsewhere ──
  T_('K1', () => { const G = fresh(), k = F.keepOf(0); Object.assign(G.P[0].res, { f: 9999 });
    const b = G.nodes.filter((n) => n.kind === 'bush' && n.amt > 0).sort((a, c) => Math.hypot(a.x - k.x, a.y - k.y) - Math.hypot(c.x - k.x, c.y - k.y))[0], cap = F.findCap(b);
    if (cap !== Math.floor((2 * Math.PI * F.WORK_R.other) / F.SPACE)) bad.push('K1: a bush holds ' + cap + ', not its working spots');
    const V = []; for (let i = 0; i < cap + 5; i++) { const v = F.addUnit(0, 'vil', b.x + 30 + (i % 5) * 6, b.y + 30 + Math.floor(i / 5) * 6); F.setJob(v, 'food', b); V.push(v); }
    let most = 0; for (let s = 0; s < 20; s++) { run(1); most = Math.max(most, V.filter((v) => v.node === b && v.at === b.id).length); }
    if (most > cap) bad.push(`K1: ${most} worked one bush of ${cap} spots`);
    const wk = V.filter((v) => v.node === b).length; if (wk > cap) bad.push(`K1: ${wk} still hold one bush of ${cap} spots`);
    }); // (the ones turned away search as decision 1 says: within its radius, then from the drop-off)
  T_('K3', () => { const G = fresh(), k = F.keepOf(0); const b = G.nodes.filter((n) => n.kind === 'bush' && n.amt > 0).sort((a, c) => Math.hypot(a.x - k.x, a.y - k.y) - Math.hypot(c.x - k.x, c.y - k.y))[0], cap = F.findCap(b);
    const b2 = { id: 9e6 + 1, kind: 'bush', type: 'food', x: b.x + 45, y: b.y, amt: 500, max: 500 }; G.nodes.push(b2);
    for (let i = 0; i < cap; i++) { const v = F.addUnit(0, 'vil', b.x + 9, b.y); F.setJob(v, 'food', b); v.at = b.id; } run(1);
    const n = F.addUnit(0, 'vil', b.x - 30, b.y); F.setJob(n, 'food', b); run(6);
    { const p = { x: b.x + 3, y: b.y, owner: 0, node: null, carry: 0 }; b.wk = cap; const all = G.nodes; G.nodes = [b]; const got = F.nearestNode(p, 'food'); G.nodes = all; if (got === b) bad.push('K3: the search offers a full bush'); }
    if (n.node === b || n.at === b.id) bad.push('K3: the next villager crowded into a full bush');
    else if (!n.node || n.node.type !== 'food' || (n.node.wk || 0) > F.findCap(n.node)) bad.push('K3: the next villager did not go to another food find with a free spot (' + (n.node ? n.node.kind + ' ' + Math.round(Math.hypot(n.node.x - b.x, n.node.y - b.y)) : 'none') + ')'); });
  T_('K2', () => { const G = fresh(), k = F.keepOf(0); const t = G.nodes.find((n) => n.kind === 'tree' && n.amt > 0 && n.open && !n.wk && Math.hypot(n.x - k.x, n.y - k.y) < 400), ux = (k.x - t.x) / Math.hypot(k.x - t.x, k.y - t.y), uy = (k.y - t.y) / Math.hypot(k.x - t.x, k.y - t.y);
    if (F.findCap(t) !== 1) bad.push('K2: a tree holds ' + F.findCap(t) + ' fellers, not one');
    const V = [0, 1, 2].map((i) => { const v = F.addUnit(0, 'vil', t.x + ux * (30 + i * 6), t.y + uy * (30 + i * 6)); F.setJob(v, 'wood', t); return v; });
    let most = 0; for (let s = 0; s < 15; s++) { run(1); most = Math.max(most, V.filter((v) => v.node === t && v.at === t.id).length); }
    if (most < 1) bad.push('K2: no feller took the tree'); if (most > 1) bad.push(`K2: ${most} fellers worked one tree`);
    const on = V.filter((v) => v.node === t).length; if (on !== 1) bad.push(`K2: ${on} of 3 villagers still hold the one tree (one feller, the rest look again)`); });
  // ── fresh review #1: a spot held at one find is let go with the order, so a return to a full find is checked again ──
  T_('K4', () => { const G = fresh(), k = F.keepOf(0); Object.assign(G.P[0].res, { f: 9999 });
    const b = G.nodes.filter((n) => n.kind === 'bush' && n.amt > 0).sort((a, c) => Math.hypot(a.x - k.x, a.y - k.y) - Math.hypot(c.x - k.x, c.y - k.y))[0], cap = F.findCap(b);
    const v = F.addUnit(0, 'vil', b.x + 9, b.y); F.setJob(v, 'food', b); v.at = b.id; F.setJob(v, 'wood'); if (v.at) bad.push('K4: an order left the old spot held (setJob)');
    v.at = b.id; F.leaveWork(v, b); if (v.at) bad.push('K4: leaving a find left its spot held (leaveWork)');
    for (let i = 0; i < cap; i++) { const h = F.addUnit(0, 'vil', b.x + 9, b.y); F.setJob(h, 'food', b); h.at = b.id; } run(1);
    v.x = b.x - 30; v.y = b.y; F.setJob(v, 'food', b); run(6);
    if (v.node === b && v.at === b.id) bad.push('K4: a villager returned to a full bush and took a spot over the cap'); });
  // ── hunt B #5: the place bar goes with its game ──
  T_('B5', () => { fresh(); F.startPlace('house'); F.ui(true); if (document.getElementById('place').hidden) bad.push('B5: the place bar does not show while placing'); fresh(); F.ui(true); if (!document.getElementById('place').hidden) bad.push('B5: the place bar outlived its game'); });

  // ── hunt B #6: a fire on a building moves nothing on its card ──
  T_('B6', () => { const G = fresh(); Object.assign(G.P[0].res, { f: 999, w: 999, s: 999, g: 999 }); const k = F.keepOf(0);
    const b = F.mkBld(0, 'barracks', k.x + 140, k.y + 40, 1); G.blds.push(b); F.openCard({ type: 'bld', id: b.id }); F.ui(true);
    const top = () => { const e = document.querySelector('#card [data-act^="train"], #card [data-act^="tq"], #card [data-act^="tech:"]'); return e ? Math.round(e.getBoundingClientRect().top) : -1; };
    const t0 = top(); b.fire = 1; F.ui(true); const t1 = top(); b.fire = 0; F.act('close');
    if (t0 < 0 || t0 !== t1) bad.push(`B6: a fire moved the building card's buttons from ${t0} to ${t1}`); });

  // ── hunt B #7: the attack alarms' clocks survive a save ──
  T_('B7', () => { const G = fresh(); G.alertT = G.t - 3; G.warnT = G.t - 4; const a = G.alertT, w = G.warnT; F.saveGame(true); F.loadGame(F.readSave());
    if (!(Math.abs(F.G.alertT - a) < 0.01 && Math.abs(F.G.warnT - w) < 0.01)) bad.push(`B7: the alarm clocks came back as ${F.G.alertT}, ${F.G.warnT}, not ${a}, ${w}`); F.clearSave(); });

  // ── hunt B #8: the Guide builds its page once, not on every redraw ──
  T_('B8', () => { fresh(); F.openCard({ type: 'guide' }); F.ui(true); F.GUIDE_PG.h = '<p>KEPT</p>'; F.ui(true);
    if (!/KEPT/.test(document.getElementById('card').innerHTML)) bad.push('B8: the Guide rebuilt its page on a redraw'); F.act('close'); });

  // ── hunt B #10: art drawn into its own canvas gives the screen's ctx back, even when it throws ──
  T_('B10', () => { if (typeof F.drawOnce !== 'function') return bad.push('B10: no one home for art drawn into its own canvas'); const c0 = F.ctxNow; try { F.drawOnce(4, 4, () => { throw new Error('art'); }); } catch (e) {}
    if (F.ctxNow !== c0) bad.push('B10: a throw in sprite art left the screen drawing off screen'); });
  // ── review fixes (Nov 1): the status strip keeps the soldiers; the squad's − and + split the tile; a jump closes the card; a locked control's switch is dim ──
  T_('R1', () => { const G = fresh(); F.ui(true); const vis = (id) => [...document.getElementById(id).children].filter((e) => !e.hidden).length;
    if (document.getElementById('stArm').hidden) bad.push('R1: the status strip drops the soldier count in the ' + G.P[0].age + ' age');
    if (vis('status') !== vis('tally')) bad.push(`R1: the strip shows ${vis('status')} cells under ${vis('tally')}`); });
  T_('R2', () => { fresh(); F.openCard({ type: 'squad', i: 0 }); F.ui(true);
    const tile = document.querySelector('#card [data-act^="bldgo:"]'), m = document.querySelector('#card [data-act="sqpk:0,0,-"]'), p = document.querySelector('#card [data-act="sqpk:0,0,+"]');
    if (!tile || !m || !p) bad.push('R2: the squad card has no tile with − and + under it'); else { const t = tile.getBoundingClientRect(), a = m.getBoundingClientRect(), b = p.getBoundingClientRect();
      if (Math.abs(a.width - b.width) > 0.5 || Math.abs(a.left - t.left) > 0.5 || Math.abs(b.right - t.right) > 0.5) bad.push(`R2: − and + do not split their tile (${Math.round(a.left)}–${Math.round(a.right)}, ${Math.round(b.left)}–${Math.round(b.right)} under ${Math.round(t.left)}–${Math.round(t.right)})`); }
    F.act('close'); });
  T_('R3', () => { fresh(); F.openCard({ type: 'mail' }); F.ui(true); F.act('jump:500,500'); if (F.G.card) bad.push('R3: a jump from a card left the card open over the map it moved'); });
  T_('R4', () => { const G = fresh(), k = F.keepOf(0); G.rel[0][W()] = G.rel[W()][0] = 'ally'; G.ktab = 'mis'; F.openCard({ type: 'bld', id: k.id }); F.ui(true);
    const sw = document.querySelector(`#card .slt.dis [data-act="relon:${W()}"]`);
    if (!sw) bad.push('R4: the check found no locked bribe'); else { sw.click(); const c = sw.closest('.slt'); if (!c.classList.contains('nope') && !sw.classList.contains('nope')) bad.push('R4: a tap on a locked slider\\'s switch does not glow red'); }
    F.act('close'); G.ktab = 'town'; });
  return bad;
}"""
# The end card at Albert's phone (375 x 667), 23 lines of chronicle: Victory sightings 1 and 2 (hunt B #1, #2)
END = """() => { const F = window.__fk, bad = [], G = (F.newGame(7), F.act('close'), F.G);
  for (let i = 0; i < 23; i++) F.chron('A line of the chronicle number ' + i + ', long enough to need the whole width of the card and more.');
  F.showEnd(true, 'You hold the Throne.'); F.ui(true);
  const end = document.getElementById('end'), box = () => [...end.querySelectorAll('h2, p, #endX > *, #endActs')].reduce((a, e) => { const r = e.getBoundingClientRect(); return [Math.min(a[0], r.top), Math.max(a[1], r.bottom)]; }, [1e9, -1e9]);
  if (end.querySelector('details')) bad.push('Victory sighting 1: the chronicle is still a fold that grows the card');
  const hs = []; for (let p = 0; p < 4; p++) { const [t, b] = box(); hs.push(Math.round(b - t)); if (t < 0 || b > innerHeight) bad.push(`Victory sighting 1: page ${p + 1} runs off the screen (${Math.round(t)} to ${Math.round(b)})`); const nx = end.querySelector('[data-act="chronp:1"]'); if (nx) nx.click(); }
  if (new Set(hs).size > 1) bad.push('Victory sighting 1: the end card changes height between pages: ' + hs.join(', '));
  const acts = document.getElementById('endActs').getBoundingClientRect();
  for (const id of ['emgB', 'hudB']) { const f = document.getElementById(id); if (!f) continue; const r = f.getBoundingClientRect(), el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    if (r.width && el && !end.contains(el)) bad.push(`Victory sighting 2: the floating ${id} draws over the end card`); }
  const top = document.elementFromPoint(10, 30); if (top && !end.contains(top)) bad.push('Victory sighting 2: the top bar draws over the end card');
  return bad; }"""
# Relations at the smallest phone (375): a stance picked and not sent ("Neutral → Friend", the longest) fits its slot on both pages, and the
# row keeps its 44 (Albert, Nov 1)
FIT = """() => { const F = window.__fk, bad = [], G = (F.newGame(7), F.act('close'), F.G), k = F.keepOf(0);
  for (const tab of ['rel', 'mis']) { G.ktab = tab; F.openCard({ type: 'bld', id: k.id }); F.ui(true); G.relPick = {};
    const rows = tab === 'mis' ? [F.WILD, 'out', 'ban', 'rob'] : G.P.filter((q) => q.id && q.id !== F.WILD && q.alive).map((q) => q.id);
    for (const q of rows) { if (tab === 'mis') { if (q === F.WILD) G.rel[0][q] = G.rel[q][0] = 'peace'; else F.gangState(q).rel[0] = 'peace'; } else G.rel[0][q] = G.rel[q][0] = 'peace';
      F.act(`relwant:${q},ally`); } // the widest change a row can take: every row can go to friend
    F.ui(true);
    for (const q of rows) { const row = document.querySelector(`#card [data-act="relok:${q}"]`).parentElement, cell = row.querySelector('.info');
      if (!/Neutral\\s*→\\s*Friend/.test(cell.innerText)) bad.push(`Relations ${tab}: row ${q} does not show the change: ${cell.innerText.replace(/\\n/g, ' ')}`);
      for (const sm of cell.querySelectorAll('small')) if (sm.scrollWidth > sm.clientWidth + 1) bad.push(`Relations ${tab}: "${sm.textContent}" is cut in its slot at 375 (${sm.scrollWidth} of ${sm.clientWidth})`);
      if (cell.scrollHeight > cell.clientHeight + 1 || Math.round(row.getBoundingClientRect().height) > 44) bad.push(`Relations ${tab}: the change grows row ${q} past its 44`); }
    F.act('close'); }
  return bad; }"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); errs = []
        pg = await br.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
        try: bad = await pg.evaluate(JS)
        except Exception as e: bad = ['the wild checks stopped: ' + str(e)[:200]]
        pe = await br.new_page(viewport={'width': 375, 'height': 667}); pe.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pe.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pe.wait_for_timeout(300)
        try: bad += await pe.evaluate(END)
        except Exception as e: bad.append('the end card checks stopped: ' + str(e)[:200])
        await pe.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pe.wait_for_timeout(300)
        try: bad += await pe.evaluate(FIT)
        except Exception as e: bad.append('Relations: the fit checks stopped: ' + str(e)[:200])
        await br.close()
    bad += errs
    print(('PASS ' if not bad else 'FAIL ') + 'the wild batch (the wild by kind, 4b, answers 11 and 12, the hunt A and B, the Victory sightings, the stance change at 375)', '' if not bad else bad)
    sys.exit(1 if bad else 0)
asyncio.run(main())
