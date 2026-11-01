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

# Decision 5a, the home zone, on SEEDS seeds, measured on nodes (each bush, tree, rock): no node of any find within HOME.clear of a Town
# Center; each of the five home finds (at HOME.rich) with its nearest node in the band; no other node within the band; no forest or water
# within CLEAR. Equal content: every corner holds the same finds and deposits (every node but trees and fish, by kind and amount, and the
# carried-off finds), its two camps and four stops, all reached from its Town Center on the walking grid (B4), the shared places on the
# middle lines by both corners beside them. Reports the worst case.
ZONE = """(seeds) => {
  const F = window.__fk, bad = [], H = F.HOME, b0 = H.clear, b1 = H.clear + H.band, want = { bush: 5, tree: 12, stone: 2, gold: 2, iron: 2 },
    carried = ['chest', 'ruins', 'den', 'cemetery', 'vagabonds'], base = { bush: 180, tree: 120, stone: 300, gold: 300, iron: 300 }, type = { bush: 'food', tree: 'wood' },
    W = { near: [1e9, 0], far: 0, any: 1e9, wild: 1e9, edge: 1e9 };
  for (let s = 1; s <= seeds; s++) {
    F.SET.scen = 'open'; F.newGame(s); const G = F.G, N = F.NAV, NC = F.NC, amt = F.LAND[G.land].amt, sig = [];
    const isHome = (n) => base[n.kind] && Math.abs(n.max - base[n.kind] * F.RICH * H.rich * (amt[type[n.kind] || n.kind] || 1)) < 1e-6;
    const comp = (x, y, id) => { const cx = Math.floor(x / F.NAVC), cy = Math.floor(y / F.NAVC); let best = 0; for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) { const a = cx + i, b = cy + j; if (a < 0 || b < 0 || a >= NC || b >= NC) continue; const c = N.comp[b * NC + a]; if (c && (id ? c === id : N.size[c] > N.size[best])) best = c; } return best; };
    for (let o = 0; o < 4; o++) {
      const k = F.keepOf(o), d = (q) => Math.hypot(q.x - k.x, q.y - k.y), mine = (q) => (k.x < F.MID ? q.x <= F.MID : q.x >= F.MID) && (k.y < F.MID ? q.y <= F.MID : q.y >= F.MID);
      const home = G.nodes.filter((n) => !n.farm && d(n) < F.CLEAR && isHome(n)), by = {};
      for (const n of home) (by[n.kind] = by[n.kind] || []).push(n);
      for (const kd in want) if ((by[kd] || []).length !== want[kd]) bad.push(s + '/' + o + ': ' + kd + ' ' + (by[kd] || []).length + ' of ' + want[kd] + ' in the home zone');
      for (const kd in by) { const r = Math.min(...by[kd].map(d)); W.near = [Math.min(W.near[0], r), Math.max(W.near[1], r)]; W.far = Math.max(W.far, ...by[kd].map(d)); if (r < b0 || r > b1) bad.push(s + '/' + o + ': the home ' + kd + "'s nearest node at " + Math.round(r) + ', outside the band'); }
      for (const n of G.nodes) if (!n.farm && mine(n)) { const r = d(n); W.any = Math.min(W.any, r); if (r < b0) { bad.push(s + '/' + o + ': a ' + n.kind + ' within the clearing, at ' + Math.round(r)); break; }
        if (!isHome(n)) { W.wild = Math.min(W.wild, r); if (r < b1) { bad.push(s + '/' + o + ': a ' + n.kind + ' not of the home zone at ' + Math.round(r)); break; } if (n.kind === 'tree' && n.max < 100 * F.RICH && r < F.CLEAR) { bad.push(s + '/' + o + ': forest within CLEAR'); break; } } }
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

# Decision 5a: the corner can be seen and played. At each phone size, at the zoom a game opens on, with the camera sent to each home node
# (and held by the map's edges, clampCam), the node stands inside the clear band between the bars, half a tap (22 px) or more from its edges.
CAMERA = """async (seeds) => {
  const F = window.__fk, bad = []; let worst = 1e9; F.SET.scen = 'open';
  const base = { bush: 180, tree: 120, stone: 300, gold: 300, iron: 300 }, type = { bush: 'food', tree: 'wood' };
  for (let s = 1; s <= seeds; s++) { F.newGame(s); F.act('close'); F.ui(true); const G = F.G, z = F.cam.z, H = F.HOME, amt = F.LAND[G.land].amt;
    const isHome = (n) => base[n.kind] && Math.abs(n.max - base[n.kind] * F.RICH * H.rich * (amt[type[n.kind] || n.kind] || 1)) < 1e-6;
    for (let o = 0; o < 4; o++) { const k = F.keepOf(o);
      for (const n of G.nodes) { if (n.farm || Math.hypot(n.x - k.x, n.y - k.y) > F.CLEAR || !isHome(n)) continue;
        F.cam.z = z; F.cam.x = n.x; F.cam.y = n.y; F.clampCam(); const V = F.view, top = V.ch / 2 + V.vy - V.bandH / 2, bot = top + V.bandH;
        const x = F.SX(n.x), y = F.SY(n.y), m = Math.min(x, V.cw - x, y - top, bot - y); worst = Math.min(worst, m);
        if (m < 22) { bad.push(s + '/' + o + ': a ' + n.kind + ' ' + Math.round(m) + ' px from the edge of the view'); break; } } } }
  return [bad, Math.round(worst)]; }"""

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
        bad, errs = await run(CITADEL); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + 'the citadel the same seen from every corner: four towers, the shrine on the Throne', '' if not bad else bad); fails += bool(bad)
        bad, errs = await run(MIGRATE, json.load(open(os.path.join(ROOT, 'tests', 'fixtures', 'save-v39.json')))); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + 'a game saved on the 2000 map opens in the middle of this one', '' if not bad else bad); fails += bool(bad)
        for w, h in SIZES:
            pg = await br.new_page(viewport={'width': w, 'height': h}); await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(400)
            bad, worst = await pg.evaluate(CAMERA, CAM_SEEDS); await pg.close()
            print(('PASS ' if not bad else 'FAIL ') + f'every home node can be seen and tapped in its corner at {w} x {h} (nearest {worst} px from the view\'s edge)', '' if not bad else bad[:6]); fails += bool(bad)
        res, errs = await run(ZONE, SEEDS); bad, W = res if len(res) == 2 and isinstance(res[1], dict) else (res, {'near': [0, 0], 'far': 0, 'any': 0, 'wild': 0, 'edge': 0}); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + f'the home zone on {SEEDS} seeds: nothing in the clearing, the home finds in the band, the same content in every corner, all reached (5a, B4)', '' if not bad else bad[:int(os.environ.get("SHOW", 8))] + [f'... {len(bad)} in all'])
        print(f'  worst case: a home find\'s nearest node {W["near"][0]} to {W["near"][1]} from its Town Center (its farthest {W["far"]}); nearest node of any find {W["any"]}; nearest node not of the zone {W["wild"]}; nearest home node to the map edge {W["edge"]}'); fails += bool(bad)
        await br.close()
    sys.exit(1 if fails else 0)
asyncio.run(main())
