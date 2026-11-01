# The map's base rules (decisions 2 and 5a, Albert, Oct 31), each shown failing on a planted bug. Run by the gate:  python3 tests/map.py
# Adds the 100-seed placement report with --seeds N (the gate runs 100).
import asyncio, json, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEEDS = int(sys.argv[sys.argv.index('--seeds') + 1]) if '--seeds' in sys.argv else 100

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
    if (F.canPlace(0, 'farm', a.x + ax * (n + F.BLD.farm.fp) * F.NAVC / 2, a.y + ay * (n + F.BLD.farm.fp) * F.NAVC / 2) === 'Leave a gap: two squares round each building') bad.push('a crop may not touch a house');
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
  return bad; }"""

# Decision 5a, the home zone, on SEEDS seeds: in every corner the same content (the five home finds at HOME.rich, each find's centre in the
# band), nothing else within the band, no find's centre within the clearing, no forest or water within CLEAR, every find of the corner and
# every home node reached from its Town Center on the walking grid (B4). Reports the worst case.
ZONE = """(seeds) => {
  const F = window.__fk, bad = [], H = F.HOME, b0 = H.clear, b1 = H.clear + H.band, want = { bush: 5, tree: 12, stone: 2, gold: 2, iron: 2 },
    carried = ['chest', 'ruins', 'den', 'cemetery', 'vagabonds'], base = { bush: 180, tree: 120, stone: 300, gold: 300, iron: 300 }, type = { bush: 'food', tree: 'wood' }, W = { band: [1e9, 0], wild: 1e9, edge: 1e9, clear: 1e9, dropped: 0 };
  for (let s = 1; s <= seeds; s++) {
    F.SET.scen = 'open'; F.newGame(s); const G = F.G, N = F.NAV, NC = F.NC, amt = F.LAND[G.land].amt;
    const isHome = (n) => base[n.kind] && Math.abs(n.max - base[n.kind] * F.RICH * H.rich * (amt[type[n.kind] || n.kind] || 1)) < 1e-6;
    const comp = (x, y, id) => { const cx = Math.floor(x / F.NAVC), cy = Math.floor(y / F.NAVC); let best = 0; for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) { const a = cx + i, b = cy + j; if (a < 0 || b < 0 || a >= NC || b >= NC) continue; const c = N.comp[b * NC + a]; if (c && (id ? c === id : N.size[c] > N.size[best])) best = c; } return best; };
    let finds = 0;
    for (let o = 0; o < 4; o++) {
      const k = F.keepOf(o), d = (q) => Math.hypot(q.x - k.x, q.y - k.y), mine = (q) => (q.x < F.MID) === (k.x < F.MID) && (q.y < F.MID) === (k.y < F.MID);
      const home = G.nodes.filter((n) => !n.farm && d(n) < F.CLEAR && isHome(n)), by = {};
      for (const n of home) (by[n.kind] = by[n.kind] || []).push(n);
      for (const kd in want) if ((by[kd] || []).length !== want[kd]) bad.push(s + '/' + o + ': ' + kd + ' ' + (by[kd] || []).length + ' of ' + want[kd] + ' in the home zone');
      const cen = Object.entries(by).flatMap(([kd, L]) => kd === 'bush' || kd === 'tree' ? [{ kd, L }] : [{ kd, L }]).map(({ kd, L }) => ({ kd, x: L.reduce((a, n) => a + n.x, 0) / L.length, y: L.reduce((a, n) => a + n.y, 0) / L.length }));
      for (const c of cen) { const r = d(c); W.band = [Math.min(W.band[0], r), Math.max(W.band[1], r)]; if (r < b0 - 6 || r > b1 + 6) bad.push(s + '/' + o + ': the home ' + c.kd + ' at ' + Math.round(r) + ', outside the band'); }   // 6: a grove's trees sit ±4 off their lattice
      for (const n of G.nodes) if (!n.farm && !isHome(n) && mine(n)) { const r = d(n); W.wild = Math.min(W.wild, r); if (r < b1) { bad.push(s + '/' + o + ': a ' + n.kind + ' not of the home zone at ' + Math.round(r)); break; } if (n.kind === 'tree' && n.max < 100 * F.RICH && r < F.CLEAR) { bad.push(s + '/' + o + ': forest within CLEAR'); break; } }
      for (const f of G.finds) if (mine(f) && carried.includes(f.kind)) { finds++; W.clear = Math.min(W.clear, d(f)); if (d(f) < b1) bad.push(s + '/' + o + ': the ' + f.kind + ' at ' + Math.round(d(f))); }
      if (G.lakes.slice(1).some((L) => d(L) < F.CLEAR + L.r)) bad.push(s + '/' + o + ': water within CLEAR');
      for (const n of home) W.edge = Math.min(W.edge, n.x, n.y, F.MAP - n.x, F.MAP - n.y);
      const l = Math.hypot(F.MID - k.x, F.MID - k.y), hc = comp(k.x + ((F.MID - k.x) / l) * 40, k.y + ((F.MID - k.y) / l) * 40);   // where the first villagers stand
      for (const n of home) if (n.kind !== 'tree' && !comp(n.x, n.y, hc)) bad.push(s + '/' + o + ': the home ' + n.kind + ' at ' + Math.round(n.x) + ',' + Math.round(n.y) + ' cannot be reached');
      if (!(by.tree || []).some((n) => comp(n.x, n.y, hc))) bad.push(s + '/' + o + ': the home grove cannot be reached');
      for (const n of G.nodes) if (mine(n) && !n.farm && n.kind !== 'tree' && n.kind !== 'fish' && !comp(n.x, n.y, hc)) bad.push(s + '/' + o + ': a ' + n.kind + ' at ' + Math.round(n.x) + ',' + Math.round(n.y) + ' cannot be reached');
      for (const f of G.finds) if (mine(f) && !comp(f.x, f.y, hc)) bad.push(s + '/' + o + ': the ' + f.kind + ' at ' + Math.round(f.x) + ',' + Math.round(f.y) + ' cannot be reached');
    }
    W.dropped += 4 * carried.length - finds;   // the carried-off finds that found no room
  }
  W.band = W.band.map(Math.round); W.wild = Math.round(W.wild); W.edge = Math.round(W.edge); W.clear = Math.round(W.clear);
  return [bad, W]; }"""

# The Throne's walls and gates symmetric about the Throne (QC 05 N1): each turned a quarter about it lands on another; every Town Center's
# nearest gate equally far. The Throne at the middle, the same distance from every Town Center.
CITADEL = """() => {
  const F = window.__fk, bad = []; F.SET.scen = 'open'; F.newGame(3); const G = F.G, T = G.blds.find((b) => b.kind === 'throne'), C = G.blds.filter((b) => b.citadel && (b.kind === 'wall' || b.kind === 'gate'));
  if (T.x !== F.MID || T.y !== F.MID) bad.push('the Throne at ' + T.x + ',' + T.y);
  for (const b of C) { const x = T.x - (b.y - T.y), y = T.y + (b.x - T.x); if (!C.some((c) => c.kind === b.kind && Math.abs(c.x - x) < 0.01 && Math.abs(c.y - y) < 0.01)) { bad.push('the ' + b.kind + ' at ' + b.x + ',' + b.y + ' has no twin a quarter turn round'); break; } }
  const g = [0, 1, 2, 3].map((o) => { const k = F.keepOf(o); return Math.min(...C.filter((b) => b.kind === 'gate').map((b) => Math.hypot(b.x - k.x, b.y - k.y))); });
  if (Math.max(...g) - Math.min(...g) > 0.01) bad.push('the nearest gate from each Town Center: ' + g.map(Math.round));
  const d = [0, 1, 2, 3].map((o) => { const k = F.keepOf(o); return Math.hypot(k.x - T.x, k.y - T.y); });
  if (Math.max(...d) - Math.min(...d) > 0.01) bad.push('the Throne from each Town Center: ' + d.map(Math.round));
  return bad; }"""

# A game saved on the 2000 map (save shape 39) opens set down in the middle of the 2160 map: every place moved by MID − 1000, the fog square
# for square, a wave given its progress fields. The old save is made here by moving a new one back.
MIGRATE = """() => {
  const F = window.__fk, bad = []; F.SET.scen = 'open'; F.newGame(3); F.act('close'); F.saveGame(true); const S = JSON.parse(localStorage.getItem(F.SAVEKEY)), D = F.MID - 1000, n0 = 50, FN = Math.ceil(F.MAP / 40);
  const O = JSON.parse(JSON.stringify(S)); O.v = 39;
  for (const u of O.units) { u.x -= D; u.y -= D; } for (const b of O.blds) { b.x -= D; b.y -= D; b.gx -= D / F.NAVC; b.gy -= D / F.NAVC; }
  for (const n of O.nodes) if (Array.isArray(n)) { n[1] -= D; n[2] -= D; } else { n.x -= D; n.y -= D; }
  for (const f of O.finds) { f.x -= D; f.y -= D; } for (const L of O.lakes) { L.x -= D; L.y -= D; } for (const p of O.P) { p.keep = p.keep.map((v) => v - D); delete p.ai.cool; }
  O.P[1].wave = { n: 5, t: 10 }; const old = new Uint8Array(n0 * n0); old[20 * n0 + 10] = 3; O.fog = btoa(String.fromCharCode(...old)); delete O.tread;
  const M = F.MIGRATE[39](O), near = (a, b) => Math.abs(a - b) < 0.02;
  if (M.v !== 40) bad.push('the step leaves shape ' + M.v);
  if (!M.units.every((u, i) => near(u.x, S.units[i].x) && near(u.y, S.units[i].y))) bad.push('a unit is not where the same game puts it');
  if (!M.blds.every((b, i) => near(b.x, S.blds[i].x) && b.gx === S.blds[i].gx && b.gy === S.blds[i].gy)) bad.push('a building is not on its squares');
  if (!M.nodes.every((n, i) => (Array.isArray(n) ? near(n[1], S.nodes[i][1]) : near(n.x, S.nodes[i].x)))) bad.push('a find is not where it was');
  if (!M.P.every((p, i) => near(p.keep[0], S.P[i].keep[0]) && p.ai.cool)) bad.push('a side has no Town Center place or no cool-downs');
  if (!(M.P[1].wave.pt === S.t && M.P[1].wave.d > 1e8)) bad.push('an old wave has no progress fields');
  const f = atob(M.fog); if (f.length !== FN * FN || f.charCodeAt((20 + D / 40) * FN + 10 + D / 40) !== 3) bad.push('the fog is not moved square for square');
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
        print(('PASS ' if not bad else 'FAIL ') + 'a wave is judged by its progress (D1)', '' if not bad else bad); fails += bool(bad)
        bad, errs = await run(CITADEL); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + "the Throne's walls and gates symmetric about it", '' if not bad else bad); fails += bool(bad)
        bad, errs = await run(MIGRATE); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + 'a game saved on the 2000 map opens in the middle of this one', '' if not bad else bad); fails += bool(bad)
        for w, h in ((375, 667), (390, 844), (393, 852), (430, 932)):
            pg = await br.new_page(viewport={'width': w, 'height': h}); await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(400)
            bad, worst = await pg.evaluate(CAMERA, 10); await pg.close()
            print(('PASS ' if not bad else 'FAIL ') + f'every home node can be seen and tapped in its corner at {w} x {h} (nearest {worst} px from the view\'s edge)', '' if not bad else bad[:6]); fails += bool(bad)
        res, errs = await run(ZONE, SEEDS); bad, W = res if len(res) == 2 and isinstance(res[1], dict) else (res, {'band': [0, 0], 'wild': 0, 'clear': 0, 'edge': 0, 'dropped': 0}); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + f'the home zone on {SEEDS} seeds: the same content in the band, the clearing clear, all reached (5a, B4)', '' if not bad else bad[:int(os.environ.get("SHOW", 8))] + [f'... {len(bad)} in all'])
        print(f'  worst case: home find centres {W["band"][0]} to {W["band"][1]} from their Town Center nearest other node {W["wild"]}; nearest find {W["clear"]}; nearest home node to the map edge {W["edge"]}; carried-off finds with no room {W["dropped"]}'); fails += bool(bad)
        await br.close()
    sys.exit(1 if fails else 0)
asyncio.run(main())
