# The map's base rules (decisions 2 and 5a, Albert, Oct 31), each shown failing on a planted bug. Run by the gate:  python3 tests/map.py
# Adds the 100-seed placement report with --seeds N (the gate runs 100).
import asyncio, json, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUICK = bool(os.environ.get('FK_PLANT'))   # the planted-bug check (tests/handoff.py): fewer seeds and one phone size, each plant still caught
SEEDS = int(sys.argv[sys.argv.index('--seeds') + 1]) if '--seeds' in sys.argv else 25 if QUICK else 100
SIZES = ((375, 667),) if QUICK else ((375, 667), (390, 844), (393, 852), (430, 932))
CAM_SEEDS = 3 if QUICK else 10

# decision 2: two squares between non-wall buildings; a one-square gap is refused; the two-square lane is open ground; a crop may touch
GAP = """() => {
  const F = window.__fk, bad = []; F.SET.scen = 'open'; F.newGame(7); F.act('close'); const G = F.G, k = F.keepOf(0), n = F.BLD.house.fp, N = F.NC;
  let done = false;
  for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const s = F.findSpot(0, 'house', k.x, k.y, 90, 260); if (!s) continue;
    const a = F.build(0, 'house', s.x, s.y); a.prog = 1; F.built(a); F.navRebuild();
    const at = (g) => ({ x: a.x + ax * (n + g) * F.NAVC, y: a.y + ay * (n + g) * F.NAVC }), p1 = at(1), p2 = at(2), f = at(0);
    if (F.canPlace(0, 'house', p2.x, p2.y)) { a.hp = 0; F.navRebuild(); continue; }   // something else in the way here: another side
    done = true;
    if (!F.canPlace(0, 'house', p1.x, p1.y)) bad.push('a one-square gap between two buildings is allowed');
    const b = F.build(0, 'house', p2.x, p2.y); b.prog = 1; F.built(b); F.navRebuild();
    for (let i = 0; i < n; i++) for (let g = 1; g <= 2; g++) {   // the two lane squares along the shared side
      const gx = ax ? (ax > 0 ? a.gx + n - 1 + g : a.gx - g) : a.gx + i, gy = ay ? (ay > 0 ? a.gy + n - 1 + g : a.gy - g) : a.gy + i;
      if (F.NAV.solid[gy * N + gx]) { bad.push('the two-square lane between two buildings is shut at ' + gx + ',' + gy); i = n; break; }
    }
    const why = [[-ax, -ay], [ay, ax], [-ay, -ax]].map(([fx, fy]) => F.canPlace(0, 'farm', a.x + fx * (n + F.BLD.farm.fp) * F.NAVC / 2, a.y + fy * (n + F.BLD.farm.fp) * F.NAVC / 2));   // a field flush against the house, on its three other sides
    if (!why.includes(null)) bad.push('a crop may not touch a house: ' + why.join('; '));
    break;
  }
  if (!done) bad.push('no clear ground for the gap test');
  return bad; }"""

# D1: a wave is judged by its progress. A wave that keeps walking nearer is not recalled at WAVE.stall; one that neither nears nor fights
# for WAVE.stall goes home, and its target is left alone for WAVE.cool. Driven through the real decideWar, with the clock moved by hand.
WAVE = """() => {
  const F = window.__fk, bad = []; F.SET.scen = 'open'; F.newGame(3); F.act('close'); const G = F.G, W = F.WAVE, p = G.P[1], per = F.PERS[p.pers], k0 = F.keepOf(0), k1 = F.keepOf(1);
  G.rel[1][0] = G.rel[0][1] = 'war';
  const sq = []; for (let i = 0; i < 12; i++) { const u = F.addUnit(1, 'spear', k1.x + 60 + i * 4, k1.y + 60); u.state = 'attack'; u.target = 0; sq.push(u); }
  p.wave = { n: 12, t: G.t, to: 0, bid: null, d: 1e9, pt: G.t };
  const walk = (s) => { for (const u of sq) { const d = Math.hypot(k0.x - u.x, k0.y - u.y); u.x += ((k0.x - u.x) / d) * F.UNIT.spear.spd * s; u.y += ((k0.y - u.y) / d) * F.UNIT.spear.spd * s; u.hitT = -99; } G.t += s; };
  F.decideWar(p, per); for (let i = 0; i < 8; i++) { walk(10); F.decideWar(p, per); }
  if (!p.wave || sq.some((u) => u.state !== 'attack')) bad.push('a wave still walking nearer was recalled after ' + 80 + ' s');
  const t0 = G.t; for (let i = 0; i < 6 && p.wave; i++) { G.t += 10; F.decideWar(p, per); }
  if (p.wave) bad.push('a wave that neither neared nor fought for ' + (G.t - t0) + ' s was not recalled');
  else if (!((p.ai.cool[0] || 0) > G.t)) bad.push('a stalled target is not left alone');
  else { for (const u of sq) u.state = 'home'; F.decideWar(p, per); if (p.wave && p.wave.to === 0) bad.push('the stalled wave went straight back at the same target'); }
  // a win at stake is never waited out: a stalled wave on the Throne leaves no cool-down, and a side holding a wonder is attacked though cooled
  p.wave = null; p.ai.cool = {}; for (const u of sq) { u.state = 'attack'; u.target = 0; } const T = G.blds.find((b) => b.kind === 'throne');
  p.wave = { n: 12, t: G.t, to: 0, bid: T.id, d: 1e9, pt: G.t }; for (let i = 0; i < 6 && p.wave; i++) { G.t += 10; F.decideWar(p, per); }
  if (p.ai.cool[0] > G.t) bad.push('a stalled wave on the Throne put its holder on a cool-down');
  p.wave = null; for (const u of sq) u.state = 'home'; p.ai.cool[0] = G.t + 999; G.wonder = { owner: 0, id: k0.id }; F.decideWar(p, per);
  if (!(p.wave && p.wave.to === 0)) bad.push('a side building a wonder is waited out on a cool-down');
  G.wonder = null;
  // the map's lettered squares reach its far edge
  if (F.coord(F.MAP - 1, F.MAP - 1) === F.coord(F.MAP - 150, F.MAP - 150)) bad.push('the last squares of the map share a label: ' + F.coord(F.MAP - 1, F.MAP - 1));
  return bad; }"""

# Decision 5a and the three zones (Albert, Nov 1, answer 2), on SEEDS seeds, measured on nodes (each bush, tree, rock): no node of any find
# within HOME.clear of a Town Center. Zone 1: BACK.bushes bushes and BACK.trees trees holding Bronze's cost and its margin (worked out here
# from AGES, the villager and the house), every node behind the Town Center from the clearing to MID − CORNER, BACK.edge or more from the
# map's edge and LANE squares from any other find's node; a corner it does not fit fails. Zone 2: each of the five home finds (at HOME.rich) with its
# nearest node in the band. No other node within the band or in zone 1; no forest or water within CLEAR. Equal content: every corner holds the same finds and deposits (every node but trees and fish, by kind and amount, and the
# carried-off finds), its two camps and four stops, all reached from its Town Center on the walking grid (B4), the shared places on the
# middle lines by both corners beside them. Reports the worst case.
ZONE = """(seeds) => {
  const F = window.__fk, bad = [], H = F.HOME, b0 = H.clear, b1 = H.clear + H.band, want = { bush: 5, tree: 12, stone: 2, gold: 2, iron: 2 },
    carried = ['chest', 'ruins', 'den', 'cemetery', 'vagabonds'], base = { bush: 180, tree: 120, stone: 300, gold: 300, iron: 300 }, type = { bush: 'food', tree: 'wood' },
    W = { near: [1e9, 0], far: 0, any: 1e9, wild: 1e9, edge: 1e9, fit: 0, corners: 0, back: [1e9, 0], bedge: 1e9, bgap: 1e9 },
    B = F.BACK, gap = F.LANE * F.NAVC, deep = F.MID - F.CORNER,
    need = B && { bush: F.AGES[1].cost.f + F.BACK_MARGIN.vils * F.UNIT.vil.cost.f, tree: F.AGES[1].cost.w + F.BACK_MARGIN.houses * F.BLD.house.cost.w },
    count = B ? { bush: B.bushes, tree: B.trees } : {}, isBack = (n) => count[n.kind] && Math.abs(n.max - need[n.kind] / count[n.kind]) < 1e-6;
  if (!B) return [['no zone 1 (BACK) to lay'], W];
  const on0 = B.on; B.on = false; F.SET.scen = 'open'; F.newGame(1);   // held out (BACK.on false): nothing laid in zone 1, the keep-out kept
  for (let o = 0; o < 4; o++) { const k = F.keepOf(o), sx = k.x < F.MID ? 1 : -1, sy = k.y < F.MID ? 1 : -1;
    if (!on0 && F.G.nodes.some((n) => !n.farm && isBack(n))) bad.push('zone 1 is laid though it is held out');
    if (F.G.nodes.some((n) => !n.farm && (n.x - k.x) * sx <= 0 && (n.y - k.y) * sy <= 0 && Math.hypot(n.x - k.x, n.y - k.y) <= deep)) bad.push('1/' + o + ': a find in zone 1 while it is held out'); }
  B.on = true;   // the rest lays zone 1 to check it, whether or not it is in play
  for (let s = 1; s <= seeds; s++) {
    F.SET.scen = 'open'; F.newGame(s); const G = F.G, N = F.NAV, NC = F.NC, amt = F.LAND[G.land].amt, sig = [];
    const isHome = (n) => base[n.kind] && Math.abs(n.max - base[n.kind] * F.RICH * H.rich * (amt[type[n.kind] || n.kind] || 1)) < 1e-6;
    const comp = (x, y, id) => { const cx = Math.floor(x / F.NAVC), cy = Math.floor(y / F.NAVC); let best = 0; for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) { const a = cx + i, b = cy + j; if (a < 0 || b < 0 || a >= NC || b >= NC) continue; const c = N.comp[b * NC + a]; if (c && (id ? c === id : N.size[c] > N.size[best])) best = c; } return best; };
    for (let o = 0; o < 4; o++) {
      const k = F.keepOf(o), d = (q) => Math.hypot(q.x - k.x, q.y - k.y), mine = (q) => (k.x < F.MID ? q.x <= F.MID : q.x >= F.MID) && (k.y < F.MID ? q.y <= F.MID : q.y >= F.MID);
      const sx = k.x < F.MID ? 1 : -1, sy = k.y < F.MID ? 1 : -1, inBack = (q) => (q.x - k.x) * sx <= 0 && (q.y - k.y) * sy <= 0 && d(q) <= deep;
      const back = G.nodes.filter((n) => !n.farm && mine(n) && d(n) < F.CLEAR && isBack(n)), other = G.nodes.filter((n) => !n.farm && mine(n) && d(n) < F.CLEAR + 100 && !isBack(n)), tot = {};
      W.corners++;
      for (const kd in count) { const L = back.filter((n) => n.kind === kd); tot[kd] = L.reduce((a, n) => a + n.max, 0); if (L.length !== count[kd]) bad.push(s + '/' + o + ': zone 1 holds ' + L.length + ' of ' + count[kd] + ' ' + kd + (kd === 'bush' ? 'es' : 's') + ': it does not fit'); }
      if (back.length === B.bushes + B.trees) W.fit++;
      if (Math.abs(tot.bush - need.bush) > 1e-6 || Math.abs(tot.tree - need.tree) > 1e-6 || need.bush < F.AGES[1].cost.f || need.tree < F.AGES[1].cost.w) bad.push(s + '/' + o + ': zone 1 holds ' + Math.round(tot.bush) + ' food and ' + Math.round(tot.tree) + " wood, not Bronze's cost and its margin (" + need.bush + ', ' + need.tree + ')');
      for (const n of back) { const r = d(n), e = Math.min(n.x, n.y, F.MAP - n.x, F.MAP - n.y), g = Math.min(...other.map((q) => Math.hypot(q.x - n.x, q.y - n.y)), ...back.filter((q) => q.kind !== n.kind).map((q) => Math.hypot(q.x - n.x, q.y - n.y)));
        W.back = [Math.min(W.back[0], r), Math.max(W.back[1], r)]; W.bedge = Math.min(W.bedge, e); W.bgap = Math.min(W.bgap, g);
        if (!inBack(n) || r < b0) { bad.push(s + '/' + o + ': a zone 1 ' + n.kind + ' out of zone 1, at ' + Math.round(r) + ' and ' + Math.round((n.x - k.x) * sx) + ',' + Math.round((n.y - k.y) * sy) + ' from its Town Center'); break; }
        if (e < B.edge) { bad.push(s + '/' + o + ': a zone 1 ' + n.kind + ' ' + Math.round(e) + ' from the map edge'); break; }
        if (g < gap) { bad.push(s + '/' + o + ': a zone 1 ' + n.kind + ' ' + Math.round(g) + ' from another find'); break; } }
      for (const n of other) if (inBack(n)) { bad.push(s + '/' + o + ': a ' + n.kind + ' not of zone 1 in zone 1, at ' + Math.round(d(n))); break; }
      for (const f of G.finds) if (mine(f) && f.kind !== 'shrine' && inBack(f)) bad.push(s + '/' + o + ': the ' + f.kind + ' in zone 1');
      if (!back.some((n) => n.kind === 'tree' && comp(n.x, n.y, comp(k.x + ((F.MID - k.x) / Math.hypot(F.MID - k.x, F.MID - k.y)) * F.PLACES.start, k.y + ((F.MID - k.y) / Math.hypot(F.MID - k.x, F.MID - k.y)) * F.PLACES.start)))) bad.push(s + '/' + o + ': the zone 1 grove cannot be reached');
      const home = G.nodes.filter((n) => !n.farm && mine(n) && isHome(n)), by = {};
      for (const n of home) (by[n.kind] = by[n.kind] || []).push(n);
      for (const kd in want) if ((by[kd] || []).length !== want[kd]) bad.push(s + '/' + o + ': ' + kd + ' ' + (by[kd] || []).length + ' of ' + want[kd] + ' in the home zone');
      for (const kd in by) { const r = Math.min(...by[kd].map(d)); W.near = [Math.min(W.near[0], r), Math.max(W.near[1], r)]; W.far = Math.max(W.far, ...by[kd].map(d)); if (r < b0 || r > b1) bad.push(s + '/' + o + ': the home ' + kd + "'s nearest node at " + Math.round(r) + ', outside the band'); }
      for (const n of G.nodes) if (!n.farm && mine(n)) { const r = d(n); W.any = Math.min(W.any, r); if (r < b0) { bad.push(s + '/' + o + ': a ' + n.kind + ' within the clearing, at ' + Math.round(r)); break; }
        if (!isHome(n) && !isBack(n)) { W.wild = Math.min(W.wild, r); if (r < b1) { bad.push(s + '/' + o + ': a ' + n.kind + ' not of the home zone at ' + Math.round(r)); break; } if (n.kind === 'tree' && n.max < 100 * F.RICH && r < F.CLEAR) { bad.push(s + '/' + o + ': forest within CLEAR'); break; } } }
      for (const f of G.finds) if (mine(f) && f.kind !== 'shrine' && d(f) < b1) bad.push(s + '/' + o + ': the ' + f.kind + ' at ' + Math.round(d(f)));
      if (G.lakes.slice(1).some((L) => d(L) < F.CLEAR + L.r)) bad.push(s + '/' + o + ': water within CLEAR');
      for (const n of home) W.edge = Math.min(W.edge, n.x, n.y, F.MAP - n.x, F.MAP - n.y);
      const content = {}; for (const n of G.nodes) if (mine(n) && !n.farm && n.kind !== 'tree' && n.kind !== 'fish') { const key = n.kind + ' ' + Math.round(n.max); content[key] = (content[key] || 0) + 1; }
      for (const f of G.finds) if (mine(f) && f.kind !== 'shrine') content[f.kind] = (content[f.kind] || 0) + 1;
      sig.push(JSON.stringify(Object.keys(content).sort().map((key) => [key, content[key]])));
      if (content.camp !== 2 || content.stop !== 4) bad.push(s + '/' + o + ': ' + (content.camp || 0) + ' camps and ' + (content.stop || 0) + ' stops of its own, not 2 and 4');
      const l = Math.hypot(F.MID - k.x, F.MID - k.y), hc = comp(k.x + ((F.MID - k.x) / l) * F.PLACES.start, k.y + ((F.MID - k.y) / l) * F.PLACES.start);   // where the first villagers stand
      if (!(by.tree || []).some((n) => comp(n.x, n.y, hc))) bad.push(s + '/' + o + ': the home grove cannot be reached');
      for (const n of G.nodes) if (mine(n) && !n.farm && n.kind !== 'tree' && n.kind !== 'fish' && !comp(n.x, n.y, hc)) bad.push(s + '/' + o + ': a ' + n.kind + ' at ' + Math.round(n.x) + ',' + Math.round(n.y) + ' cannot be reached');
      for (const f of G.finds) if (mine(f) && f.kind !== 'shrine' && !comp(f.x, f.y, hc)) bad.push(s + '/' + o + ': the ' + f.kind + ' at ' + Math.round(f.x) + ',' + Math.round(f.y) + ' cannot be reached');
    }
    if (new Set(sig).size > 1) bad.push(s + ': the corners hold different finds: ' + sig.map((x, o) => o + ' ' + x).filter((x, o) => sig[o] !== sig[0] || o === 0).join(' | ').slice(0, 400));
  }
  B.on = on0;
  for (const key in W) W[key] = Array.isArray(W[key]) ? W[key].map(Math.round) : Math.round(W[key]);
  return [bad, W]; }"""

# The citadel the same seen from every corner (QC 05 N1-N3; Albert, Nov 1: four towers, the shrine on the Throne's square): the Throne and
# the shrine at the middle; every wall, gate and tower turned a quarter about the Throne lands on its twin; from every Town Center the same
# distances to each kind of structure, sorted; no tower on a wall or gate square.
CITADEL = """() => {
  const F = window.__fk, bad = []; F.SET.scen = 'open'; F.newGame(3); const G = F.G, T = G.blds.find((b) => b.kind === 'throne'), C = G.blds.filter((b) => b.citadel && b !== T), sh = G.finds.find((f) => f.kind === 'shrine');
  if (T.x !== F.MID || T.y !== F.MID) bad.push('the Throne at ' + T.x + ',' + T.y);
  if (!sh || sh.x !== T.x || sh.y !== T.y) bad.push('the shrine is not on the Throne: ' + (sh && sh.x + ',' + sh.y));
  for (const b of C) { const x = T.x - (b.y - T.y), y = T.y + (b.x - T.x); if (!C.some((c) => c.kind === b.kind && Math.abs(c.x - x) < 0.01 && Math.abs(c.y - y) < 0.01)) { bad.push('the ' + b.kind + ' at ' + b.x + ',' + b.y + ' has no twin a quarter turn round'); break; } }
  const seen = [0, 1, 2, 3].map((o) => { const k = F.keepOf(o); return JSON.stringify([...new Set(C.map((b) => b.kind))].sort().map((kd) => [kd, C.filter((b) => b.kind === kd).map((b) => Math.round(Math.hypot(b.x - k.x, b.y - k.y) * 100) / 100).sort((a, b) => a - b)]).concat([['throne', Math.hypot(T.x - k.x, T.y - k.y)], ['shrine', sh ? Math.round(Math.hypot(sh.x - k.x, sh.y - k.y) * 100) / 100 : 0]])); });
  if (new Set(seen).size > 1) bad.push('the citadel is not the same from every Town Center: ' + seen.map((x) => x.slice(0, 120)).join(' | '));
  const sq = (b) => { const n = F.BLD[b.kind].fp, out = []; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) out.push((b.gy + j) * F.NC + b.gx + i); return out; }, ring = new Set(C.filter((b) => b.kind !== 'tower').flatMap(sq));
  for (const b of C.filter((b) => b.kind === 'tower')) if (sq(b).some((c) => ring.has(c))) { bad.push('a tower stands on a wall square at ' + b.x + ',' + b.y); break; }
  if (C.filter((b) => b.kind === 'tower').length !== 4) bad.push(C.filter((b) => b.kind === 'tower').length + ' towers, not four');
  return bad; }"""

# A game saved on the 2000 map (save shape 39) opens set down in the middle of the 2160 map. The save is real: made by build 38001b9 (main
# before this branch), seed 3, four minutes and a Raiders' wave (tests/fixtures/save-v39.json). Every place moves by MID − 1000: units,
# buildings and their squares, trees, finds, lakes, Town Centers, an animal's graze point, a scout's loop; the fog and the ruts square for
# square; an old wave gets its progress fields. Then the game loads and plays 90 s with nothing off the map and no error.
MIGRATE = """(O) => {
  const F = window.__fk, bad = [], D = F.MID - 1000, n0 = 2000 / 40, FN = Math.ceil(F.MAP / 40), near = (a, b) => Math.abs(a - b) < 0.02;
  const M = F.MIGRATE[39](JSON.parse(JSON.stringify(O)));
  if (M.v !== 40) bad.push('the step leaves shape ' + M.v);
  if (M.P.some((p) => p.ai && p.ai.wallPlan)) bad.push("a computer keeps its wall plan's old squares");
  if (!M.units.every((u, i) => near(u.x, O.units[i].x + D) && near(u.y, O.units[i].y + D) && (u.px === undefined || near(u.px, O.units[i].px + D)))) bad.push('a unit is not moved');
  const an = M.units.filter((u, i) => O.units[i].graze !== undefined && O.units[i].gx !== undefined);
  if (!an.length || !an.every((u) => { const o = O.units[M.units.indexOf(u)]; return u.grazeAt && near(u.grazeAt.x, o.gx + D) && near(u.grazeAt.y, o.gy + D) && u.gx === undefined; })) bad.push('an animal grazes where it did on the old map');
  const sc = M.units.filter((u) => u.route); if (!sc.length || !sc.every((u) => { const o = O.units[M.units.indexOf(u)]; return u.route.every((w, i) => near(w.x, o.route[i].x + D) && near(w.y, o.route[i].y + D)); })) bad.push("a scout's loop is not moved");
  if (!M.blds.every((b, i) => near(b.x, O.blds[i].x + D) && b.gx === O.blds[i].gx + D / F.NAVC && b.gy === O.blds[i].gy + D / F.NAVC)) bad.push('a building is not on its squares');
  if (!M.nodes.every((n, i) => (Array.isArray(n) ? near(n[1], O.nodes[i][1] + D) && near(n[2], O.nodes[i][2] + D) : near(n.x, O.nodes[i].x + D)))) bad.push('a find is not moved');
  if (!M.finds.every((f, i) => near(f.x, O.finds[i].x + D)) || !M.lakes.every((L, i) => near(L.x, O.lakes[i].x + D))) bad.push('a find or a lake is not moved');
  if (!M.P.every((p, i) => near(p.keep[0], O.P[i].keep[0] + D) && p.ai.cool)) bad.push('a side has no Town Center place or no cool-downs');
  if (!(M.P[1].wave && M.P[1].wave.pt === O.t && M.P[1].wave.d > 1e8 && M.P[1].wave.to === 0)) bad.push('an old wave has no progress fields');
  const sq = (b64, w) => { const s = atob(b64), out = []; for (let i = 0; i < s.length; i++) out.push(s.charCodeAt(i)); return out; }, k = D / 40;
  for (const [key, w] of [['fog', 1], ['tread', 2]]) { const a = sq(O[key], w), b = sq(M[key], w); let ok = b.length === FN * FN * w && a.some(Boolean);
    for (let j = 0; j < n0 && ok; j++) for (let i = 0; i < n0 * w && ok; i++) ok = b[((j + k) * FN + k) * w + i] === a[j * n0 * w + i];
    if (!ok) bad.push('the ' + (key === 'fog' ? 'fog' : 'ruts') + ' are not moved square for square'); }
  F.loadGame(M); F.act('close'); F.setPause(true); const G = F.G; for (let i = 0; i < 30 * 90; i++) F.step(1 / 30);
  const off = G.units.filter((u) => !(u.x >= 0 && u.y >= 0 && u.x <= F.MAP && u.y <= F.MAP)).length; if (off) bad.push(off + ' units off the map after 90 s');
  return bad; }"""

# Every building LANE squares from every find (Albert, Nov 1 13:00; walls too, 14:16), the same gap as between buildings: a tree, a bush or
# a rock one hair inside LANE squares of the footprint refuses a house, a mine camp, a field and a wall; at LANE squares they stand. And the
# computers still find room at the start on SEEDS/5 seeds: a house round the Town Center, a mill, a lumber camp and a mine camp by the
# nearest find of each; and on SEEDS seeds every square of every corner's wall ring (WALL_R; the clearing is set past it so no find makes
# a hole).
FINDGAP = """(seeds) => {
  const F = window.__fk, bad = []; F.SET.scen = 'open'; F.newGame(7); F.act('close'); const G = F.G, k = F.keepOf(0), gap = F.LANE * F.NAVC;
  for (const kind of ['house', 'mining', 'farm', 'wall']) {
    const n = F.BLD[kind].fp * F.NAVC, s = F.findSpot(0, kind, k.x, k.y, 90, 300); if (!s) { bad.push('no ground for the ' + kind); continue; }
    const p = F.snapPos(kind, s.x, s.y), t = { id: -1, kind: 'tree', type: 'wood', x: p.x + n / 2 + gap - 0.5, y: p.y, amt: 1, max: 1 }; G.nodes.push(t);
    if (!F.canPlace(0, kind, p.x, p.y)) bad.push('a ' + kind + ' is allowed with a tree inside two squares of it');
    t.x = p.x + n / 2 + gap; t.y = p.y; const w = F.canPlace(0, kind, p.x, p.y); if (w) bad.push('a ' + kind + ' is refused with a tree two squares off: ' + w);
    t.x = p.x; t.y = p.y - n / 2 - gap + 0.5; if (!F.canPlace(0, kind, p.x, p.y)) bad.push('a ' + kind + ' is allowed with a tree inside two squares above it');
    const c = gap / Math.SQRT2; t.x = p.x + n / 2 + c - 0.5; t.y = p.y + n / 2 + c - 0.5; if (!F.canPlace(0, kind, p.x, p.y)) bad.push('a ' + kind + ' is allowed with a tree inside two squares of its corner');
    t.x = p.x + n / 2 + c + 0.5; t.y = p.y + n / 2 + c + 0.5; const wc = F.canPlace(0, kind, p.x, p.y); if (wc) bad.push('a ' + kind + ' is refused with a tree two squares off its corner: ' + wc);
    G.nodes.splice(G.nodes.indexOf(t), 1); }
  for (let sd = 1; sd <= seeds; sd++) { F.newGame(sd); F.act('close'); const G = F.G;
    for (let o = 0; o < 4; o++) { const k = F.keepOf(o), near = (ty) => G.nodes.filter((q) => q.type === ty && !q.farm).sort((a, b) => Math.hypot(a.x - k.x, a.y - k.y) - Math.hypot(b.x - k.x, b.y - k.y))[0];
      const holes = F.wallPlan(k).filter((c) => F.canPlace(o, c.kind, c.gx * F.NAVC + 5, c.gy * F.NAVC + 5)).length; if (holes) bad.push(sd + '/' + o + ': ' + holes + ' holes in its wall ring');
      if (sd > seeds / 5) continue; // the ring on every seed, the drop-offs on a fifth
      if (!F.findSpot(o, 'house', k.x, k.y, 60, 190)) bad.push(sd + '/' + o + ': no room for a house');
      for (const [ty, kind] of [['food', 'mill'], ['wood', 'lumber'], ['stone', 'mining'], ['gold', 'mining']]) { const q = near(ty); if (q && !F.findSpot(o, kind, q.x, q.y, 30, 70)) bad.push(sd + '/' + o + ': no room for a ' + kind + ' by its ' + ty); } } }
  return bad; }"""

# The start (Albert, Nov 1 14:18, 14:23): every side, player and computers, starts with 200 food, wood, stone and gold and no iron, from
# START_RES; and EXCEPTIONS #16 (LIVE TEST IN PROCESS): each computer, never the player, starts with HANDICAP's buildings finished beside its
# Town Center, the same in every computer's corner on SEEDS seeds, each where the placing rules (canPlace: lanes, the gap from finds) allow.
START = """(seeds) => {
  const F = window.__fk, bad = [], want = { f: 200, w: 200, s: 200, g: 200, i: 0 }, H = F.HANDICAP;
  for (let sd = 1; sd <= seeds; sd++) { F.SET.scen = 'open'; F.newGame(sd); const G = F.G;
    for (const p of G.P) if (p.id !== G.P.length - 1) for (const r in want) if (p.res[r] !== want[r]) { bad.push(sd + ': ' + p.name + ' starts with ' + p.res[r] + ' ' + r + ', not ' + want[r]); break; }
    const sig = [];
    for (let o = 0; o < 4; o++) { const k = F.keepOf(o), mine = G.blds.filter((b) => b.owner === o && b.kind !== 'keep');
      const kinds = mine.map((b) => b.kind + (b.prog >= 1 ? '' : ' unfinished')).sort().join(',');
      if (o === 0) { if (mine.length) bad.push(sd + ': the player starts with ' + kinds); continue; }
      sig.push(kinds); if (kinds !== H.blds.slice().sort().join(',')) bad.push(sd + '/' + o + ': the computer starts with ' + (kinds || 'nothing') + ', not ' + H.blds.join(','));
      for (const b of mine) { const d = Math.hypot(b.x - k.x, b.y - k.y); if (d > H.r[1] + 3 * F.NAVC) bad.push(sd + '/' + o + ': its ' + b.kind + ' ' + Math.round(d) + ' from its Town Center');
        const i = G.blds.indexOf(b); G.blds.splice(i, 1); if (b.node) G.nodes.splice(G.nodes.indexOf(b.node), 1); F.navRebuild(); const why = F.canPlace(o, b.kind, b.x, b.y); G.blds.splice(i, 0, b); if (b.node) G.nodes.push(b.node); F.navRebuild();
        if (why) { bad.push(sd + '/' + o + ': its ' + b.kind + ' stands where the rules refuse: ' + why); } } }
    if (new Set(sig).size > 1) bad.push(sd + ': the computers start unequal: ' + sig.join(' | ')); }
  return bad; }"""

# The ghost (Albert, Nov 1): while a building is placed no build grid and no footprint box is drawn (no line, no rectangle besides its
# label's), and the ghost's own art is tinted green where canPlace says it fits and red where it does not. Driven through the real
# drawGhost, away from your buildings so no line-up guide is due, with the glass's drawing calls counted.
GHOST = """() => {
  const F = window.__fk, bad = []; F.SET.scen = 'open'; F.newGame(5); F.act('close'); F.ui(true); const G = F.G, k = F.keepOf(0), ctx = F.ctx, calls = { line: 0, rect: 0, img: [] };
  const spy = (m, f) => { const o = ctx[m]; ctx[m] = function (...a) { f(a); return o.apply(this, a); }; return () => { ctx[m] = o; }; };
  const shade = (c) => { const g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data; let r = 0, gr = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200) { r += d[i]; gr += d[i + 1]; } return gr - r; };
  const look = (x, y) => { G.place = { kind: 'house', at: { x, y }, pts: [], cells: null }; F.cam.x = x; F.cam.y = y; F.clampCam(); calls.line = 0; calls.rect = 0; calls.img = [];
    const un = [spy('lineTo', () => calls.line++), spy('strokeRect', () => calls.rect++), spy('fillRect', () => calls.rect++), spy('drawImage', (a) => calls.img.push(a[0]))];
    try { F.drawGhost(); } finally { un.forEach((f) => f()); }
    const art = calls.img.find((c) => c && c.ax !== undefined && c.width > 8); return { why: F.canPlace(0, 'house', x, y), art }; };
  let fit = null, no = null;
  for (let r = 200; r < 600 && !(fit && no); r += 10) for (let a = 0; a < 6.28 && !(fit && no); a += 0.3) { const x = k.x + Math.cos(a) * r, y = k.y + Math.sin(a) * r;
    if (x < 30 || y < 30 || x > F.MAP - 30 || y > F.MAP - 30 || G.blds.some((b) => Math.hypot(b.x - x, b.y - y) < F.GUIDE_R + 40)) continue;
    const s = F.snapPos('house', x, y), w = F.canPlace(0, 'house', s.x, s.y); if (!w && !fit) fit = s; if (w && !no) no = s; }
  if (!fit || !no) return ['no open and no shut spot found for the ghost test'];
  for (const [s, want] of [[fit, 1], [no, -1]]) { const { why, art } = look(s.x, s.y);
    if (calls.line) bad.push('the build grid is drawn while placing (' + calls.line + ' lines)');
    if (calls.rect > 1) bad.push('a footprint box is drawn while placing (' + calls.rect + ' rectangles)');
    if (!art) { bad.push('the ghost is not drawn'); continue; }
    const t = shade(art); if (Math.sign(t) !== want) bad.push('the ghost is tinted ' + (t > 0 ? 'green' : 'red') + ' where canPlace says ' + (why || 'it fits')); }
  G.place = null; return bad; }"""

# Decision 5a: the corner can be seen and played. At each phone size, at the zoom a game opens on, with the camera sent to each home node
# (and held by the map's edges, clampCam), the node stands inside the clear band between the bars, half a tap (22 px) or more from its edges.
CAMERA = """async (seeds) => {
  const F = window.__fk, bad = []; let worst = 1e9; F.SET.scen = 'open';
  const base = { bush: 180, tree: 120, stone: 300, gold: 300, iron: 300 }, type = { bush: 'food', tree: 'wood' }, BK = F.BACK || {}, count = { bush: BK.bushes, tree: BK.trees },
    isBack = (n) => count[n.kind] && Math.abs(n.max - (n.kind === 'bush' ? BK.food : BK.wood) / count[n.kind]) < 1e-6;
  const on0 = BK.on; BK.on = true;   // zone 1 is checked whether or not it is in play
  for (let s = 1; s <= seeds; s++) { F.newGame(s); F.act('close'); F.ui(true); const G = F.G, z = F.cam.z, H = F.HOME, amt = F.LAND[G.land].amt;
    const isHome = (n) => base[n.kind] && Math.abs(n.max - base[n.kind] * F.RICH * H.rich * (amt[type[n.kind] || n.kind] || 1)) < 1e-6;
    for (let o = 0; o < 4; o++) { const k = F.keepOf(o);
      for (const n of G.nodes) { if (n.farm || Math.hypot(n.x - k.x, n.y - k.y) > F.CLEAR + F.HOME.band || !(isHome(n) || isBack(n))) continue;
        F.cam.z = z; F.cam.x = n.x; F.cam.y = n.y; F.clampCam(); const V = F.view, top = V.ch / 2 + V.vy - V.bandH / 2, bot = top + V.bandH;
        const x = F.SX(n.x), y = F.SY(n.y), m = Math.min(x, V.cw - x, y - top, bot - y); worst = Math.min(worst, m);
        if (m < 22) { bad.push(s + '/' + o + ': a ' + n.kind + ' ' + Math.round(m) + ' px from the edge of the view'); break; } } } }
  BK.on = on0; return [bad, Math.round(worst)]; }"""

async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); fails = 0
        async def run(js, arg=None):
            pg = await br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
            await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
            try: out = await pg.evaluate(js, arg) if arg is not None else await pg.evaluate(js)
            except Exception as e: out = ['the test could not run: ' + str(e).splitlines()[0][:160]]
            await pg.close()
            return out, errs
        bad, errs = await run(GAP); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + 'two squares between buildings (decision 2)', '' if not bad else bad); fails += bool(bad)
        bad, errs = await run(WAVE); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + 'a wave is judged by its progress (D1); the map labels reach its edge', '' if not bad else bad); fails += bool(bad)
        bad, errs = await run(FINDGAP, SEEDS); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + 'two squares between a building and any find; the computers find room', '' if not bad else bad[:6]); fails += bool(bad)
        bad, errs = await run(START, SEEDS); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + 'the start: 200 of each but iron for all; the computers\' handicap (EXCEPTIONS #16) equal and by the rules', '' if not bad else bad[:6]); fails += bool(bad)
        bad, errs = await run(GHOST); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + 'the ghost: no grid or footprint box, its art green where it fits and red where not', '' if not bad else bad[:4]); fails += bool(bad)
        bad, errs = await run(CITADEL); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + 'the citadel the same seen from every corner: four towers, the shrine on the Throne', '' if not bad else bad); fails += bool(bad)
        bad, errs = await run(MIGRATE, json.load(open(os.path.join(ROOT, 'tests', 'fixtures', 'save-v39.json')))); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + 'a game saved on the 2000 map opens in the middle of this one', '' if not bad else bad); fails += bool(bad)
        for w, h in SIZES:
            pg = await br.new_page(viewport={'width': w, 'height': h}); await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(400)
            bad, worst = await pg.evaluate(CAMERA, CAM_SEEDS); await pg.close()
            print(('PASS ' if not bad else 'FAIL ') + f'every home node can be seen and tapped in its corner at {w} x {h} (nearest {worst} px from the view\'s edge)', '' if not bad else bad[:6]); fails += bool(bad)
        res, errs = await run(ZONE, SEEDS); bad, W = res if len(res) == 2 and isinstance(res[1], dict) else (res, {'near': [0, 0], 'far': 0, 'any': 0, 'wild': 0, 'edge': 0, 'fit': 0, 'corners': 0, 'back': [0, 0], 'bedge': 0, 'bgap': 0}); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + f'the home zones on {SEEDS} seeds: nothing in the clearing, zone 1 behind with Bronze\'s cost (fits {W["fit"]} of {W["corners"]} corners), the home finds in the band, the same content in every corner, all reached (5a, B4)', '' if not bad else bad[:int(os.environ.get("SHOW", 8))] + [f'... {len(bad)} in all'])
        print(f'  worst case: a home find\'s nearest node {W["near"][0]} to {W["near"][1]} from its Town Center (its farthest {W["far"]}); nearest node of any find {W["any"]}; nearest node not of the zone {W["wild"]}; nearest home node to the map edge {W["edge"]}; zone 1 nodes {W["back"][0]} to {W["back"][1]} from the Town Center, {W["bedge"]} from the edge, {W["bgap"]} from another find'); fails += bool(bad)
        await br.close()
    sys.exit(1 if fails else 0)
asyncio.run(main())
