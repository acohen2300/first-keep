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
  return { bad, steps: F.TECH.length, scen: Object.keys(F.SCENARIOS).length };
}"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
        r = await pg.evaluate(JS); await br.close()
    bad = r['bad'] + errs
    print(('PASS ' if not bad else 'FAIL ') + f"the tables hold together ({r['steps']} steps, {r['scen']} scenarios, limits in every age, a cancel gives back what it paid)", '' if not bad else bad[:6])
    sys.exit(1 if bad else 0)
asyncio.run(main())
