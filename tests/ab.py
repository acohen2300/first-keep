# The A/B test of the computers (Albert, Nov 3, 11:10): A plays as shipped, with the handicap (a free mill and farm beside its Town Center);
# B plays without it and with pressure instead (AB in 17-ai: more riders on the busiest drop-off, the richest foe weighed, a choke claim on
# the road). The four seats are played by the computers; the seats are dealt A/B by the seed so every seat and every personality plays both.
# A test tool, not a gate:  python3 build.py && python3 tests/ab.py [--seeds 20] [--minutes 30] [--from 1] [--jobs 2]
# It reports: wins by variant, who fought whom (kills, side on side, summed by variant pair), ages reached, who fell and when, chokes held.
import asyncio, json, os, sys, time
from collections import defaultdict
from statistics import median
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def arg(name, d):
    return int(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else d
SEEDS, MINUTES, FROM, JOBS = arg('--seeds', 20), arg('--minutes', 30), arg('--from', 1), arg('--jobs', 2)
def deal(seed):
    # two of each; which seats get B turns with the seed, so seat and personality are spread over both variants
    k = seed % 6
    pairs = [(0, 1), (0, 2), (0, 3), (1, 2), (1, 3), (2, 3)][k]
    return ['B' if s in pairs else 'A' for s in range(4)]
GAME = """([seed, minutes, ab]) => {
  const F = window.__fk, CV = Object.keys(F.CIVS); F.SET.diff = 'normal'; F.SET.fog = false; F.SET.civ = CV[seed % CV.length]; F.SET.ab = ab; F.newGame(seed); F.SET.ab = null; F.act('close'); F.setPause(false);
  const G = F.G, P0 = G.P[0]; P0.pers = 'bal'; P0.ai.bot = true; P0.ai.t = 1;
  const sides = [0, 1, 2, 3], ages = sides.map(() => [0]), fell = sides.map(() => null);
  const errs = []; const ce = console.error; console.error = (...a) => errs.push(String(a[0]).slice(0, 160));
  for (let sec = 0; sec < minutes * 60; sec++) {
    for (let i = 0; i < 30; i++) {
      try { F.step(1 / 30); } catch (e) { errs.push('step: ' + e.message + ' @ ' + String(e.stack).split(String.fromCharCode(10))[1].trim()); if (errs.length > 20) return { seed, crash: errs }; }
      if (G.over === 'lost') G.over = null;
      if (P0.alive) { P0.ai.t -= 1 / 30; if (P0.ai.t <= 0) { P0.ai.t = F.react(); F.think(P0); } }
    }
    if (G.over) break;
    for (const s of sides) { const p = G.P[s]; while (ages[s].length <= p.age) ages[s].push(Math.round(G.t / 6) / 10); if (!p.alive && fell[s] === null) fell[s] = Math.round(G.t / 6) / 10; }
  }
  console.error = ce; F.scoreAll();
  const alive = sides.filter((s) => G.P[s].alive);
  const winner = alive.length === 1 ? alive[0] : alive.sort((a, b) => G.P[b].score.total - G.P[a].score.total)[0];
  return { seed, t: Math.round(G.t), winner, ab: sides.map((s) => G.P[s].ab), civ: sides.map((s) => G.P[s].civ), pers: sides.map((s) => G.P[s].pers), ages, fell,
    score: sides.map((s) => G.P[s].score.total), kills: G.kills.slice(0, 4).map((r) => r.slice(0, 4)), chokes: sides.map((s) => G.P[s].ai.chokes || 0),
    army: sides.map((s) => G.units.filter((u) => u.owner === s && F.isSoldier(u)).length), vils: sides.map((s) => G.units.filter((u) => u.owner === s && u.kind === 'vil').length), errs: errs.slice(0, 3) }; }"""
async def worker(br, q, out):
    ctx = await br.new_context(viewport={'width': 390, 'height': 844}); pg = await ctx.new_page(); perr = []
    pg.on('pageerror', lambda e: perr.append(str(e)[:160]))
    await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(400)
    while q:
        seed = q.pop(0); t0 = time.time()
        r = await pg.evaluate(GAME, [seed, MINUTES, deal(seed)])
        if 'crash' in r: print(f'seed {seed}: CRASHED', r['crash'][:3], flush=True); continue
        r['secs'] = round(time.time() - t0); r['perr'] = perr[:]; perr.clear(); out.append(r)
        print(f"seed {seed}: seats {''.join(r['ab'])}, winner seat {r['winner']} ({r['ab'][r['winner']]}, {r['pers'][r['winner']]}), {r['t'] // 60} min, fell {r['fell']}, chokes {r['chokes']}, {r['secs']} s", flush=True)
    await ctx.close()
def report(R):
    n = len(R); print(f'\n{n} games, {MINUTES} minutes each, two A and two B seats a game')
    wins = defaultdict(int); plays = defaultdict(int); fellN = defaultdict(int); fellAt = defaultdict(list); ageN = defaultdict(lambda: defaultdict(int))
    K = defaultdict(int); pers = defaultdict(lambda: defaultdict(int)); army = defaultdict(list); vils = defaultdict(list); scores = defaultdict(list)
    for r in R:
        for s in range(4):
            v = r['ab'][s]; plays[v] += 1; army[v].append(r['army'][s]); vils[v].append(r['vils'][s]); scores[v].append(r['score'][s])
            if r['fell'][s] is not None: fellN[v] += 1; fellAt[v].append(r['fell'][s])
            for a in range(len(r['ages'][s])): ageN[v][a] += 1
            for t in range(4):
                if t != s: K[(v, r['ab'][t])] += r['kills'][s][t]
        wins[r['ab'][r['winner']]] += 1; pers[r['ab'][r['winner']]][r['pers'][r['winner']]] += 1
    print('\nwins by variant:', {v: f'{wins[v]} of {n} games ({plays[v]} seats)' for v in ('A', 'B')}, ' by the winner\'s personality:', {v: dict(pers[v]) for v in ('A', 'B')})
    print('who fought whom (kills of soldiers and people, killer on victim, summed over all games):')
    for a in ('A', 'B'):
        for b in ('A', 'B'): print(f'  {a} killed {b}: {K[(a, b)]}')
    print('sides that fell:', {v: f'{fellN[v]} of {plays[v]}' + (f', median at {median(fellAt[v]):.1f} min' if fellAt[v] else '') for v in ('A', 'B')})
    print('ages reached (seats):', {v: {['Stone', 'Bronze', 'Classical', 'Medieval', 'Gunpowder'][a]: ageN[v][a] for a in range(5) if ageN[v][a]} for v in ('A', 'B')})
    print('at the end, median: soldiers', {v: median(army[v]) for v in ('A', 'B')}, ' villagers', {v: median(vils[v]) for v in ('A', 'B')}, ' score', {v: round(median(scores[v])) for v in ('A', 'B')})
    print('chokes held by B seats, per game (median, max):', median([sum(r['chokes'][s] for s in range(4) if r['ab'][s] == 'B') for r in R]), max([sum(r['chokes'][s] for s in range(4) if r['ab'][s] == 'B') for r in R]))
    bad = [(r['seed'], r['errs'] + r['perr']) for r in R if r['errs'] or r['perr']]
    if bad: print('\nerrors:', bad[:5])
async def main():
    q = list(range(FROM, FROM + SEEDS)); out = []
    async with async_playwright() as p:
        br = await p.chromium.launch()
        await asyncio.gather(*[worker(br, q, out) for _ in range(JOBS)])
        await br.close()
    out.sort(key=lambda r: r['seed']); report(out)
    json.dump(out, open(os.path.join(ROOT, 'tests', 'ab-last.json'), 'w'), indent=1)
asyncio.run(main())
