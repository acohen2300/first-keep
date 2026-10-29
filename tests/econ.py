# The economy meter: what each source pays a minute at about 85% research, what the bill is, and how long money makes you wait.
# A test tool, not a gate:  python3 build.py && python3 tests/econ.py [--live]   (--live adds a 4-minute run of a fully staffed farm town)
# Rates are the game's own (gatherMul, makeOf, UPKEEP, POST, TAX); nothing here is a second copy of a rule.
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIVE = '--live' in sys.argv
NOMINAL = """() => {
  const F = window.__fk; F.SET.diff = 'normal'; F.newGame(5); F.act('close'); F.setPause(true);
  const G = F.G, P = G.P[0], k = F.keepOf(0); P.age = 4;
  const mine = F.TECH.filter((t) => !t.civ || t.civ === P.civ).sort((a, b) => a.age - b.age || (a.w || 0) - (b.w || 0));
  const upto = Math.round(mine.length * 0.85); for (const t of mine.slice(0, upto)) F.learnTech(0, t.id);
  const put = (kind) => { const s = F.findSpot(0, kind, k.x, k.y, 60, 360); const b = F.build(0, kind, s.x, s.y); if (!b) return null; b.prog = 1; b.hp = b.mx || F.BLD[kind].hp; F.built(b); return b; };
  P.res = { f: 9999, w: 9999, s: 9999, g: 9999, i: 9999 };
  const out = { techs: upto + ' of ' + mine.length, perMin: {}, caps: {}, slots: {} };
  const rate = (n) => Math.round((n.rate || F.RATE_OF[n.kind]) * F.gatherMul(0, n) * 60 * 10) / 10;
  const farm = put('farm'), quarry = put('quarry'), mint = put('mint'), foundry = put('foundry');
  const nodeOf = (b) => b && (b.node || G.nodes.find((n) => n.farm === b));
  if (farm) out.perMin.farm_food = rate(nodeOf(farm));
  if (quarry) out.perMin.quarry_stone = rate(nodeOf(quarry));
  for (const [id, b] of [['mint_gold', mint], ['foundry_iron', foundry]]) if (b) { const m = F.makeOf(b), n = nodeOf(b); out.perMin[id] = Math.round(m.rate * F.gatherMul(0, n) * 60 * 10) / 10; out.perMin[id + '_input'] = JSON.stringify(m.from); }
  for (const kind of ['tree', 'gold', 'iron', 'stone', 'bush', 'meat']) { const n = G.nodes.find((x) => x.kind === kind); if (n) out.perMin[kind] = rate(n); }
  for (const kind of ['farm', 'quarry', 'mint', 'foundry']) { out.caps[kind] = F.BLD[kind].cap.join(','); out.slots[kind] = F.BLD[kind].slots || 1; }
  // the bill: 60 villagers and 120 foot soldiers eat; a share is one villager
  const shares = 60 + 120 * F.UPKEEP.foot; out.bill = { shares, foodPerMin: Math.round(shares * F.UPKEEP.share * 60) };
  out.posts = { allFour: F.POST.all * 60 + ' gold a minute per route held whole' };
  out.tax = JSON.stringify(F.TAX);
  // waits: the seconds of full-engine gold income that buy the next research steps of this age
  const gold = (t) => (t.cost && t.cost.g) || 0, next = F.TECH.filter((t) => (!t.civ || t.civ === P.civ) && !P.techs.has(t.id) && t.age <= 4);
  const cost = next.map(gold).filter((x) => x > 0).sort((a, b) => a - b);
  out.nextTechGold = { n: cost.length, median: cost[(cost.length / 2) | 0] || 0, max: cost[cost.length - 1] || 0 };
  return out; }"""
LIVE_RUN = """() => {
  const F = window.__fk; F.SET.diff = 'normal'; F.newGame(5); F.act('close'); const G = F.G, P = G.P[0], k = F.keepOf(0); P.age = 4;
  const mine = F.TECH.filter((t) => !t.civ || t.civ === P.civ).sort((a, b) => a.age - b.age || (a.w || 0) - (b.w || 0));
  for (const t of mine.slice(0, Math.round(mine.length * 0.85))) F.learnTech(0, t.id);
  P.res = { f: 99999, w: 9999, s: 9999, g: 9999, i: 9999 };
  const put = (dx, dy) => { const s = F.findSpot(0, 'farm', k.x + dx, k.y + dy, 40, 260); const b = s && F.build(0, 'farm', s.x, s.y); if (b) { b.prog = 1; b.hp = b.mx || F.BLD.farm.hp; F.built(b); } return b; };
  let farms = 0; for (let i = 0; i < 12 && farms < 12; i++) if (put(60 + 30 * i, -90 + 20 * i)) farms++;
  for (const [dx, dy] of [[150, -20], [300, 60]]) { const s = F.findSpot(0, 'mill', k.x + dx, k.y + dy, 10, 120); const b = s && F.build(0, 'mill', s.x, s.y); if (b) { b.prog = 1; b.hp = b.mx || F.BLD.mill.hp; F.built(b); } }
  F.navRebuild(); for (const u of G.units.filter((u) => u.owner === 0 && u.kind === 'vil')) u.hp = 0;
  const per = F.BLD.farm.slots || 1; for (let i = 0; i < 12; i++) { const v = F.addUnit(0, 'vil', k.x + 40, k.y + 40); F.setJob(v, 'food'); }
  F.setPause(false); let f0 = 0;
  for (let i = 0; i < 30 * 240; i++) { F.step(1 / 30); if (i === 30 * 60) f0 = P.gathered; }
  return { farms, slots: per, gatheredPerMin: Math.round((P.gathered - f0) / 3) }; }"""
# stone: six quarries (two workers each) round a mine; wood: a lumber camp in the thickest forest near the keep; twelve villagers each, four minutes, the first dropped
LIVE_JOB = """(kind) => {
  const F = window.__fk; F.SET.diff = 'normal'; F.newGame(5); F.act('close'); const G = F.G, P = G.P[0], k = F.keepOf(0); P.age = 4;
  const mine = F.TECH.filter((t) => !t.civ || t.civ === P.civ).sort((a, b) => a.age - b.age || (a.w || 0) - (b.w || 0));
  for (const t of mine.slice(0, Math.round(mine.length * 0.85))) F.learnTech(0, t.id);
  P.res = { f: 9999, w: 9999, s: 0, g: 0, i: 0 };
  const put = (kind, x, y, r0, r1) => { const s = F.findSpot(0, kind, x, y, r0, r1); const b = s && F.build(0, kind, s.x, s.y); if (b) { b.prog = 1; b.hp = b.mx || F.BLD[kind].hp; F.built(b); } return b; };
  let job = kind;
  if (kind === 'stone') { const c = put('mining', k.x + 120, k.y, 20, 200); for (let i = 0; i < 6; i++) put('quarry', k.x + 120 + 40 * (i % 3), k.y - 50 + 100 * ((i / 3) | 0), 10, 200); }
  else { const T = G.nodes.filter((n) => n.kind === 'tree' && n.amt > 0 && Math.hypot(n.x - k.x, n.y - k.y) < 700); let best = null, bc = 0;
    for (const n of T) { const c = T.filter((m) => Math.hypot(m.x - n.x, m.y - n.y) < 120).length; if (c > bc) { bc = c; best = n; } }
    if (!best) return { error: 'no forest' }; put('lumber', best.x, best.y, 10, 160); job = 'wood'; }
  F.navRebuild(); for (const u of G.units.filter((u) => u.owner === 0 && u.kind === 'vil')) u.hp = 0;
  for (let i = 0; i < 12; i++) { const v = F.addUnit(0, 'vil', k.x + 40, k.y + 40); F.setJob(v, job); }
  F.setPause(false); let g0 = 0; const res = kind === 'stone' ? 's' : 'w'; let spent0 = 0;
  for (let i = 0; i < 30 * 240; i++) { F.step(1 / 30); if (i === 30 * 60) g0 = P.gathered; }
  return { workers: 12, perMinTotal: Math.round((P.gathered - g0) / 3), perWorker: Math.round((P.gathered - g0) / 3 / 12) }; }"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:160]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(500)
        r = await pg.evaluate(NOMINAL)
        for k, v in r.items(): print(f'{k}: {v}')
        if LIVE:
            print('live food (12 farmers):', await pg.evaluate(LIVE_RUN))
            for job in ('stone', 'wood'): print('live ' + job + ':', await pg.evaluate(LIVE_JOB, job))
        await br.close()
    if errs: print('page errors:', errs); sys.exit(1)
asyncio.run(main())
