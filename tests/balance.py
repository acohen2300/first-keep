# The balance harness: the computers play all four seats, headless, over many seeds, and it reports what balance looks like.
# A test tool, not a gate:  python3 build.py && python3 tests/balance.py [--seeds 20] [--minutes 40] [--from 1] [--jobs 2] [--html file]
# Seat 0 (yours) is played by the balanced computer, on the same clock as the others; nothing here changes a rule.
# Seat 0's civilisation turns with the seed, so every civilisation sits in every seat over enough seeds.
# It reports: who wins by civilisation and by seat, minutes to each age, kills per 100 resources by unit kind,
# villager-seconds stuck (a villager with a job, not working, that has not moved for 5 s or more), and caravan counts.
# "Winner" is the last side standing, or the highest score among the living when time runs out.
import asyncio, json, os, sys, time
from collections import defaultdict
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def arg(name, d):
    return int(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else d
HTML = sys.argv[sys.argv.index('--html') + 1] if '--html' in sys.argv else os.path.join(ROOT, 'first-keep.html')
SEEDS, MINUTES, FROM, JOBS = arg('--seeds', 20), arg('--minutes', 45), arg('--from', 1), arg('--jobs', 2)
GAME = """([seed, minutes]) => {
  const F = window.__fk, CV = Object.keys(F.CIVS); F.SET.diff = 'normal'; F.SET.fog = false; F.SET.civ = CV[seed % CV.length]; F.newGame(seed); F.act('close'); F.setPause(false);
  const G = F.G, P0 = G.P[0]; P0.pers = 'bal'; P0.ai.t = 1;
  const sides = [0, 1, 2, 3], ages = sides.map(() => [0]), fell = sides.map(() => null);
  const seen = new Map(), still = new Map(); let stuck = sides.map(() => 0), lostAt = null;
  const cost = (k) => Object.values(F.UNIT[k].cost || {}).reduce((a, b) => a + b, 0);
  const errs = []; const ce = console.error; console.error = (...a) => errs.push(String(a[0]).slice(0, 160));
  for (let sec = 0; sec < minutes * 60; sec++) {
    for (let i = 0; i < 30; i++) {
      try { F.step(1 / 30); } catch (e) { errs.push('step: ' + e.message + ' @ ' + String(e.stack).split(String.fromCharCode(10))[1].trim()); if (errs.length > 20) return { seed, crash: errs }; }
      if (G.over === 'lost') { lostAt = lostAt ?? Math.round(G.t); G.over = null; }
      if (P0.alive) { P0.ai.t -= 1 / 30; if (P0.ai.t <= 0) { P0.ai.t = F.react(); F.think(P0); } }
    }
    if (G.over) break;
    for (const s of sides) { const p = G.P[s]; while (ages[s].length <= p.age) ages[s].push(Math.round(G.t / 6) / 10); if (!p.alive && fell[s] === null) fell[s] = Math.round(G.t / 6) / 10; }
    for (const u of G.units) {
      if (u.owner > 3 || !F.UNIT[u.kind] || !F.UNIT[u.kind].cls) continue;
      const r = seen.get(u.id) || { kind: u.kind, o: u.owner, kills: 0 }; r.kills = Math.max(r.kills, (u.st && u.st.kills) || 0); seen.set(u.id, r);
      if (u.kind === 'vil' && u.job && !u.inside && G.t - (u.work ?? -9) > 2) {
        const w = still.get(u.id);
        if (w && Math.abs(w.x - u.x) < 1 && Math.abs(w.y - u.y) < 1) { w.n++; if (w.n >= 5) stuck[u.owner]++; }
        else still.set(u.id, { x: u.x, y: u.y, n: 0 });
      } else still.delete(u.id);
    }
  }
  console.error = ce; F.scoreAll();
  const alive = sides.filter((s) => G.P[s].alive);
  const winner = alive.length === 1 ? alive[0] : alive.sort((a, b) => G.P[b].score.total - G.P[a].score.total)[0];
  const units = {}; for (const r of seen.values()) { const k = r.kind, u = units[k] || (units[k] = { n: 0, spent: 0, kills: 0 }); u.n++; u.spent += cost(k); u.kills += r.kills; }
  const caravans = sides.map((s) => G.units.filter((u) => u.owner === s && u.kind === 'caravan').length);
  return { seed, t: Math.round(G.t), winner, lostAt, civ: sides.map((s) => G.P[s].civ), pers: sides.map((s) => G.P[s].pers), ages, fell,
    score: sides.map((s) => G.P[s].score.total), stuck, units, caravans, errs: errs.slice(0, 3) }; }"""
async def worker(br, q, out):
    ctx = await br.new_context(viewport={'width': 390, 'height': 844}); pg = await ctx.new_page(); perr = []
    pg.on('pageerror', lambda e: perr.append(str(e)[:160]))
    await pg.goto('file://' + os.path.abspath(HTML)); await pg.wait_for_timeout(400)
    while q:
        seed = q.pop(0); t0 = time.time()
        r = await pg.evaluate(GAME, [seed, MINUTES])
        if 'crash' in r: print(f'seed {seed}: CRASHED', r['crash'][:3], flush=True); continue
        r['secs'] = round(time.time() - t0); r['perr'] = perr[:]; perr.clear(); out.append(r)
        print(f"seed {seed}: winner seat {r['winner']} ({r['civ'][r['winner']]}), {r['t'] // 60} min, ages seat0 {r['ages'][0]}, {r['secs']} s", flush=True)
    await ctx.close()
def report(R):
    n = len(R); print(f'\n{n} games, {MINUTES} minutes each')
    wins, plays, seatw = defaultdict(int), defaultdict(int), defaultdict(int)
    for r in R:
        for s, c in enumerate(r['civ']): plays[c] += 1
        wins[r['civ'][r['winner']]] += 1; seatw[f"seat {r['winner']} ({r['pers'][r['winner']]})"] += 1
    print('\nwins by civilisation (wins of games played):')
    for c in sorted(plays, key=lambda c: -wins[c] / plays[c]): print(f'  {c:8} {wins[c]:3} of {plays[c]:3}  {100 * wins[c] / plays[c]:4.0f}%')
    print('wins by seat:', dict(seatw))
    print('\nminutes to each age (median over all sides that reached it):')
    from statistics import median
    for a, name in enumerate(['Stone', 'Bronze', 'Classical', 'Medieval', 'Gunpowder']):
        xs = [r['ages'][s][a] for r in R for s in range(4) if len(r['ages'][s]) > a]
        if xs: print(f'  {name:9} {median(xs):5.1f} min  reached by {len(xs)} of {4 * n} sides')
    fell = [(r['seed'], s, r['fell'][s]) for r in R for s in range(4) if r['fell'][s] is not None]
    print(f'\nsides that fell: {len(fell)} of {4 * n}' + (f'; median at {median([f[2] for f in fell]):.1f} min' if fell else ''))
    U = defaultdict(lambda: {'n': 0, 'spent': 0, 'kills': 0})
    for r in R:
        for k, u in r['units'].items():
            for f in ('n', 'spent', 'kills'): U[k][f] += u[f]
    print('\nunits trained (all seats), kills per 100 resources spent:')
    for k, u in sorted(U.items(), key=lambda kv: -(kv[1]['kills'] / kv[1]['spent'] if kv[1]['spent'] else 0)):
        if k != 'vil' and u['spent']: print(f"  {k:12} {u['n']:5}  {100 * u['kills'] / u['spent']:5.2f}")
    st = [sum(r['stuck']) for r in R]
    print(f'\nvillager-seconds stuck per game: median {median(st)}, max {max(st)}; per seat total {[sum(r["stuck"][s] for r in R) for s in range(4)]}')
    print('caravans at the end, per seat (summed):', [sum(r['caravans'][s] for r in R) for s in range(4)])
    bad = [(r['seed'], r['errs'] + r['perr']) for r in R if r['errs'] or r['perr']]
    if bad: print('\nerrors:', bad[:5])
async def main():
    q = list(range(FROM, FROM + SEEDS)); out = []
    async with async_playwright() as p:
        br = await p.chromium.launch()
        await asyncio.gather(*[worker(br, q, out) for _ in range(JOBS)])
        await br.close()
    out.sort(key=lambda r: r['seed']); report(out)
    path = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else os.path.join(ROOT, 'tests', 'balance-last.json'); json.dump(out, open(path, 'w')); print('\nraw results:', path)
asyncio.run(main())
