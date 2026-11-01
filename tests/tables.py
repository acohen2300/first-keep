# The tables hold together (Build 60): checks that read the rules as the game does, so a slip in a table fails the gate, not a player.
# No research step waits on itself; every step it waits on is real; every scenario names real steps; every capped building has a limit
# in every age; a cancelled order gives back exactly what it paid, discount and all. Run by the gate:  python3 tests/tables.py
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = """() => {
  const F = window.__fk, bad = [];
  // research: every need is a real step, and no chain comes back to itself
  for (const t of F.TECH) for (const n of F.needsOf(t)) if (!F.TECHBY[n]) bad.push(t.id + ' waits on ' + n + ', which is no step');
  const st = {};
  const walk = (id, path) => { if (st[id] === 2) return; if (st[id] === 1) { bad.push('research waits on itself: ' + path.slice(path.indexOf(id)).concat(id).join(' > ')); return; }
    st[id] = 1; for (const n of F.needsOf(F.TECHBY[id])) if (F.TECHBY[n]) walk(n, path.concat(id)); st[id] = 2; };
  for (const t of F.TECH) walk(t.id, []);
  // scenarios name real steps
  for (const [k, S] of Object.entries(F.SCENARIOS)) for (const t of S.techs || []) if (!F.TECHBY[t]) bad.push('scenario ' + k + ' names ' + t + ', which is no step');
  // a limit in every age
  F.newGame(1); F.act('close'); const G = F.G, P = G.P[0];
  for (let a = 0; a < F.AGES.length; a++) { P.age = a; for (const k in F.BLD) if (F.BLD[k].cap && !Number.isFinite(F.capFor(0, k))) bad.push(k + ' has no limit in the ' + F.AGES[a].name + ' age'); }
  P.age = 0;
  // a cancel gives back what was paid: with the Encyclopedie's discount on, research and cancel at the Town Center
  P.techs.add('encyclopedia'); F.fxDirty();
  const k = F.keepOf(0), T = F.TECH.find((t) => t.at === 'keep' && t.age === 0 && !F.needsOf(t).length && !P.techs.has(t.id));
  for (const r in P.res) P.res[r] = 5000;
  const nz = (o) => JSON.stringify(Object.fromEntries(Object.entries(o).filter(([, v]) => v))), before = JSON.stringify(P.res), out0 = nz(P.ledger.out), paid = F.techCost(0, T);
  if (JSON.stringify(paid) === JSON.stringify(T.cost)) bad.push('the Encyclopedie did not lower a research cost');
  if (!F.research(0, T.id)) bad.push('could not research ' + T.id);
  else { F.cancelOrder(0, k, k.q.length - 1);
    if (JSON.stringify(P.res) !== before) bad.push('a cancelled research gave back ' + JSON.stringify(P.res) + ', not ' + before);
    if (nz(P.ledger.out) !== out0) bad.push('a cancelled research stayed in the ledger'); }
  // research keeps to the finds its text names (decision N9): the harvest line on fields (Sickles on bushes too), the mining line on the
  // stone, gold and iron finds, never on the Quarry, Mint or Foundry, and none of them on fish or game
  { const nd = (kind, type, farm) => ({ kind, type, ...(farm ? { farm: { kind: farm } } : {}) }), base = {},
      N = { field: nd('farm', 'food', 'farm'), bush: nd('bush', 'food'), fish: nd('fish', 'food'), meat: nd('meat', 'food'), stone: nd('stone', 'stone'), gold: nd('gold', 'gold'), iron: nd('iron', 'iron'),
        quarry: nd('farm', 'stone', 'quarry'), mint: nd('farm', 'gold', 'mint'), foundry: nd('farm', 'iron', 'foundry') },
      want = { sickles: ['field', 'bush'], threshing: ['field'], plough: ['field'], horsecollar: ['field'], picks: ['stone', 'gold'], firesetting: ['stone', 'gold'], deep: ['stone', 'gold'], pumps: ['stone', 'gold', 'iron'], blasting: ['stone', 'iron'], ventilation: ['iron'] };
    P.techs = new Set(); F.fxDirty(); for (const k in N) base[k] = F.gatherMul(0, N[k]);
    for (const [id, on] of Object.entries(want)) { P.techs = new Set([id]); F.fxDirty();
      for (const k in N) { const r = F.gatherMul(0, N[k]) / base[k], m = F.TECHBY[id].fx[0].m; if (on.includes(k) ? Math.abs(r - m) > 1e-9 : Math.abs(r - 1) > 1e-9) bad.push(`N9: ${F.TECHBY[id].name} ${on.includes(k) ? 'misses' : 'reaches'} the ${k} (x${r.toFixed(3)})`); } }
    P.techs = new Set(); F.fxDirty(); }
  // Weather glass is a barometer, not a cloak (N10): no cold or wet cut; with Weather signs it tells the sky two minutes ahead
  { const W = F.TECHBY.meteorology; if ((W.fx || []).some((f) => f.s === 'cold' || f.s === 'wet')) bad.push('N10: Weather glass still cuts the cold or the wet');
    P.techs = new Set(['weathersigns', 'meteorology']); F.fxDirty(); F.skyTurn(); if ((F.G.clim.ahead || []).length !== 2) bad.push('N10: Weather glass and Weather signs roll the sky ' + (F.G.clim.ahead || []).length + ' minutes ahead, not 2');
    P.techs = new Set(); F.fxDirty(); F.skyTurn(); if ((F.G.clim.ahead || []).length !== 1) bad.push('N10: with no forecast the sky is rolled ' + (F.G.clim.ahead || []).length + ' minutes ahead, not 1'); }
  // the research card makes no cost formula claim (N11): the cost and time are set by hand
  for (const t of F.TECH) if (/Cost and time/.test(F.techBook(t))) { bad.push('N11: the research card says ' + t.name + "'s cost follows a formula"); break; }
  // the research oddities (N12): the caravans' guards hit for what their row says, and the card says it; Charcoal burning with the Foundry; Printing once
  { const A = F.UNIT.caravan.armed || {}; if (!A.dmg || !F.TECHBY.armedcart.desc.includes(String(A.dmg))) bad.push('N12: the Armed caravans card does not name the hit of the guards from the caravan row');
    const G = F.G, k = F.keepOf(0), drop = (d) => { A.dmg = d; const c = F.addUnit(0, 'caravan', k.x + 200, k.y + 200), b = F.addUnit(4, 'bandit', c.x + 10, c.y); b.hp = b.max = 1000;
      P.techs = new Set(['armedcart']); F.fxDirty(); for (let i = 0; i < 30; i++) F.step(1 / 30); const lost = 1000 - b.hp; c.hp = b.hp = 0; for (let i = 0; i < 2; i++) F.step(1 / 30); return lost; };
    F.setPause(false); const d0 = A.dmg, l1 = drop(d0), l2 = drop(2 * d0); A.dmg = d0; P.techs = new Set(); F.fxDirty();
    if (!(l1 > 0 && Math.abs(l2 / l1 - 2) < 0.01)) bad.push(`N12: the caravan's strike does not follow its row (hit ${l1.toFixed(2)}, then ${l2.toFixed(2)} at twice the row)`);
    if (F.TECHBY.charcoal.age !== F.BLD.foundry.age) bad.push('N12: Charcoal burning sits in the ' + F.AGES[F.TECHBY.charcoal.age].name + ' age, the Foundry in the ' + F.AGES[F.BLD.foundry.age].name);
    if (F.TECHBY.printing) bad.push('N12: Printing is still a step of its own');
    if (Math.abs(F.TECHBY.press.fx.find((f) => f.s === 'research').m - 0.8 * 0.85) > 1e-9) bad.push('N12: Printing press is not 0.8 x 0.85'); }
  // the text says what the tables do (F1, N14): the Open start's villagers; snow against mud and where it falls; the ground marks; which cards pause
  { F.SET.scen = 'open'; F.newGame(2); const n = F.G.units.filter((u) => u.owner === 0 && u.kind === 'vil').length;
    if (!F.SCEN_TEXT.open[1].includes(n + ' villagers')) bad.push(`F1: the Open start gives ${n} villagers and its text says: ${F.SCEN_TEXT.open[1]}`);
    const C = F.CLIMATE, sn = F.MS_TEXT.snow[1], pc = (f) => Math.round((1 - 1 / (1 + f)) * 100);
    if (!sn.includes(C.snowAt + ' °C and below') || !sn.includes(pc(C.terrain.snow) + '%') || !sn.includes(pc(C.terrain.mud) + '%')) bad.push('F1: the snow line does not read the tables: ' + sn);
    const T = F.TRIGGERS().map((r) => r.join(' ')).join(' ');
    if (/for looks only and is not saved/.test(T)) bad.push('F1: the ground marks line says the ruts are not saved');
    if (/Opening any card pauses/.test(T)) bad.push('F1: the rules say any card pauses the game'); }
  return { bad, steps: F.TECH.length, scen: Object.keys(F.SCENARIOS).length };
}"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
        r = await pg.evaluate(JS); await br.close()
    bad = r['bad'] + errs
    print(('PASS ' if not bad else 'FAIL ') + f"the tables hold together ({r['steps']} steps, {r['scen']} scenarios, limits in every age, a cancel gives back what it paid, research keyed and worded by its tables)", '' if not bad else bad[:8])
    sys.exit(1 if bad else 0)
asyncio.run(main())
