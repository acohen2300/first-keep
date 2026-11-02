# The computers batch (branch ai81, Nov 1): answer 10 by need, the famine runway (W6), the shift to plots, N7 (no villager ceiling, the
# payback test), N8 (peace mode), N6 (the crowns), N16a (the raid's mark), D2 to D5. Each check fails on d6bbc07, the build before it.
# Run by the gate:  python3 tests/ai.py
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = """() => {
  const F = window.__fk, bad = [], T = 1 / 30, W = () => F.G.P.length - 1;
  const T_ = (id, f) => { try { f(); } catch (e) { bad.push(id + ': the check stopped: ' + e.message); } }; // one check's crash does not hide the others
  const fresh = (seed = 7) => { F.newGame(seed); F.act('close'); F.setPause(false); const G = F.G; G.fogOn = false; G.ev.next = 1e9; G.ev.cur = null;
    for (const u of G.units) if (u.kind === 'vil') { u.job = null; u.node = null; u.hunt = null; u.post = { x: u.x, y: u.y }; }
    F.step(T); return G; };
  const cost = (c) => Object.values(c || {}).reduce((a, b) => a + b, 0);
  // a computer side with n villagers on one job, its own first villagers gone, its stores set
  const side = (G, o, pers, n, job, res) => { const p = G.P[o], k = F.keepOf(o); p.pers = pers;
    for (const u of G.units) if (u.owner === o && u.kind === 'vil') { u.hp = 0; u.gone = true; } G.units = G.units.filter((u) => u.hp > 0);
    const V = []; for (let i = 0; i < n; i++) { const v = F.addUnit(o, 'vil', k.x + 40 + (i % 6) * 6, k.y + 40 + Math.floor(i / 6) * 6); if (job) F.setJob(v, job); V.push(v); }
    Object.assign(p.res, { f: 0, w: 0, s: 0, g: 0, i: 0 }, res); return { p, k, V }; };
  const wait = (v) => { v.node = null; v.hunt = null; v.idle = true; v.nnT = F.G.t + 5; }; // waiting with no find in reach (its Zs)

  // ── answer 10: a waiting villager goes to the bottleneck (the longest time to afford the goal), not to the best rate ──
  T_('A10', () => { const G = fresh(), o = 1, { p, V } = side(G, o, 'bal', 14, 'food', { f: 1000 }); // Bronze: 300 food, 100 wood; nobody on wood
    const w = V[13]; wait(w); G.nodes.push({ id: 9e6 + 1, kind: 'bush', type: 'food', x: w.x + 12, y: w.y, amt: 3000, max: 3000 }); // the best rate, beside it
    F.think(p);
    if (w.job !== 'wood') bad.push('A10: a waiting villager went to ' + w.job + ', not to the bottleneck (wood: 100 short for Bronze, nobody on it)');
    if (V.filter((v) => v.job === 'wood').length < 2) bad.push('A10: no worker moved from food (not needed) to wood (the bottleneck)'); });
  T_('A10', () => { const G = fresh(), o = 1, { p } = side(G, o, 'aggr', 4, 'food', {});
    const g = F.goalOf(p, F.PERS.aggr, null), b = F.goalOf(p, F.PERS.bal, null);
    if (!b || b.what !== F.PERS.bal.build[0][0]) bad.push('A10: the balanced goal with no age due is not its first building'); });

  // ── W6: the famine runway. Store ÷ (eaten − gathered) under the time to rebuild food income: food first, though the goal needs none ──
  T_('W6', () => { const G = fresh(), o = 1, { p, V } = side(G, o, 'bal', 14, 'wood', { f: 400 }); p.eats = 3000; // 50 a second from the store
    const w = V[13]; wait(w); G.nodes.push({ id: 9e6 + 2, kind: 'tree', type: 'wood', x: w.x + 12, y: w.y, amt: 3000, max: 3000, open: true });
    F.think(p);
    if (w.job !== 'food') bad.push('W6: with 8 s of food left and nobody on food, a waiting villager went to ' + w.job + ' (the reorder point is passed)');
    p.eats = 0; const v = V[12]; v.job = 'wood'; wait(v); F.think(p);
    if (v.job === 'food') bad.push('W6: with nothing eaten from the store, a waiting villager still went to food (no famine near)'); });

  // ── the shift to plots: a quarry once no natural stone is in reach (any personality); no field while the berries beat it; none past payback ──
  T_('P1', () => { const G = fresh(), o = 1, { p } = side(G, o, 'aggr', 3, 'stone', { f: 5000, w: 5000, s: 5000, g: 5000 }); p.age = 2;
    G.nodes = G.nodes.filter((n) => n.type !== 'stone' || n.kind === 'farm'); F.think(p);
    if (!G.blds.some((b) => b.owner === o && b.kind === 'quarry')) bad.push('P1: no natural stone in reach and three on stone, yet no quarry (the plot beats the wild)'); });
  T_('P2', () => { const G = fresh(), o = 1, { p, k } = side(G, o, 'bal', 6, 'food', { w: 500 });
    G.nodes = G.nodes.filter((n) => !(n.type === 'food' && Math.hypot(n.x - k.x, n.y - k.y) < 420));
    for (const a of G.units) if (a.owner === W() && F.UNIT[a.kind].meat) { a.hp = 0; a.gone = true; } G.units = G.units.filter((u) => u.hp > 0);
    for (let i = 0; i < 2; i++) G.nodes.push({ id: 9e6 + 10 + i, kind: 'bush', type: 'food', x: k.x + 50, y: k.y + (i ? 60 : -60), amt: 3000, max: 3000 });
    const farms = () => G.blds.filter((b) => b.owner === o && b.kind === 'farm').length, f0 = farms(); // each computer now starts with one (EXCEPTIONS #16)
    F.think(p);
    if (farms() > f0) bad.push('P2: a field was built while two rich berry bushes by the Town Center beat it'); });
  T_('P3', () => { const G = fresh(), o = 1, { p } = side(G, o, 'aggr', 3, 'stone', { f: 5000, w: 5000, s: 5000, g: 5000 }); p.age = 2;
    G.nodes = G.nodes.filter((n) => n.type !== 'stone' || n.kind === 'farm'); G.mode = 't15'; G.t = 899; F.think(p);
    if (G.blds.some((b) => b.owner === o && b.kind === 'quarry')) bad.push('P3: a quarry was built a second before the bell (it cannot pay back its cost)'); });

  // ── N7: no flat villager ceiling; a villager is trained while ΔR × T_left > its cost ──
  T_('N7', () => { const G = fresh(), o = 1, { p, k } = side(G, o, 'bal', 30, 'wood', { f: 5000, w: 5000, s: 5000, g: 5000 });
    for (let i = 0; i < 12; i++) G.blds.push(F.mkBld(o, 'house', k.x - 150 + (i % 4) * 30, k.y - 150 + Math.floor(i / 4) * 30, 1)); F.navRebuild();
    F.think(p);
    if (!k.q.some((j) => j.kind === 'vil')) bad.push('N7: 30 villagers with room for more, and no villager trained (the flat ceiling of 26)');
    k.q.length = 0; G.mode = 't15'; G.t = 899; F.think(p);
    if (k.q.some((j) => j.kind === 'vil')) bad.push('N7: a villager trained a second before the bell (ΔR × T_left is under its cost)'); });

  // ── N8: at peace with every court, a computer keeps PEACE.stand.keep of its ceiling and does not retrain what it stood down ──
  T_('N8', () => { const G = fresh(3), o = 1, p = G.P[o], k = F.keepOf(o); p.age = 1; for (const r in p.res) p.res[r] = 5000;
    G.blds.push(F.mkBld(o, 'barracks', k.x + 120, k.y, 1)); F.navRebuild();
    for (let i = 0; i < 30; i++) { const u = F.addUnit(o, 'spear', k.x + 60 + (i % 6) * 8, k.y + 60 + Math.floor(i / 6) * 8); u.state = 'home'; }
    for (let i = 0; i < 12; i++) G.blds.push(F.mkBld(o, 'house', k.x - 150 + (i % 4) * 30, k.y - 150 + Math.floor(i / 4) * 30, 1)); // room to train: only the aim holds it
    for (let i = 0; i < 12; i++) F.addUnit(o, 'vil', k.x - 40, k.y - 40 + i * 4); // past the personality's first villagers (PERS.early)
    for (const a of G.P) for (const q of G.P) if (a.id !== q.id && a.id !== W() && q.id !== W()) G.rel[a.id][q.id] = 'peace';
    F.standDown(o, true); const left = F.soldiersOf(o).length;
    for (let i = 0; i < 5; i++) { p.envoyAt = G.t; F.think(p); for (const r in p.res) p.res[r] = 5000; } // no notice of war of its own (its diplomacy waits)
    const q = G.blds.filter((b) => b.owner === o).reduce((n, b) => n + b.q.filter((j) => j.kind && F.UNIT[j.kind].cls === 'army').length, 0);
    if (q > 0) bad.push('N8: at peace with every court, ' + q + ' soldiers queued again after standing down to ' + left); });

  // ── N6: Wealth is everything gathered, once; War is the cost value of enemy people and buildings destroyed, no animals; Wellbeing by the sick share ──
  T_('N6', () => { const G = fresh(), w = W(), P0 = G.P[0], k1 = F.keepOf(1); G.rel[0][1] = G.rel[1][0] = 'war';
    P0.gathered = 100; P0.res.f = 5000; let C = F.crownsOf();
    if (C.wealth.find((r) => r.id === 0).v !== 100) bad.push('N6: Wealth is ' + C.wealth.find((r) => r.id === 0).v + ' with 100 gathered (the stores are counted again)');
    const sp = F.addUnit(0, 'spear', k1.x + 200, k1.y), wf = F.addUnit(w, 'wolf', sp.x + 5, sp.y), en = F.addUnit(1, 'spear', sp.x - 5, sp.y);
    F.hurt(0, sp, wf, 1e6); F.hurt(0, sp, en, 1e6);
    const h = F.mkBld(1, 'house', k1.x + 160, k1.y + 60, 1); G.blds.push(h); h.hp = 0; h.by = 0; h.byT = G.t; F.step(T);
    const want = cost(F.UNIT.spear.cost) + cost(F.BLD.house.cost); C = F.crownsOf();
    if (C.war.find((r) => r.id === 0).v !== want) bad.push('N6: War is ' + C.war.find((r) => r.id === 0).v + ', not ' + want + ' (an enemy spearman and a house, by cost; the wolf not counted)');
    const ppl = G.units.filter((u) => u.owner === 0 && F.UNIT[u.kind].cls === 'civ'); ppl.slice(0, 2).forEach((u) => (u.sick = G.t + 100));
    const care = G.blds.filter((b) => b.owner === 0 && b.hp > 0 && b.prog >= 1 && ['hospital', 'temple', 'baths', 'theatre', 'tavern'].includes(b.kind)).length;
    const wb = (ppl.length - 2) * F.PEACE.crown.people + care * F.PEACE.crown.bld + (P0.laurels || 0) * F.PEACE.crown.laurel; C = F.crownsOf();
    if (C.wellbeing.find((r) => r.id === 0).v !== Math.round(wb)) bad.push('N6: Wellbeing is ' + C.wellbeing.find((r) => r.id === 0).v + ', not ' + Math.round(wb) + ' (two of ' + ppl.length + ' sick)'); });

  // ── N16a: the raid's mark: a load in transport draws it, a guard it cannot beat bars it; seeded dice ──
  T_('N16a', () => { const G = fresh(), w = W(), k = F.keepOf(0); G.rel[0][w] = G.rel[w][0] = 'peace'; F.gangState('rob').rel[0] = 'war';
    for (const u of G.units) if (u.owner === 0 && (u.kind === 'vil' || u.kind === 'caravan')) { u.hp = 0; u.gone = true; } G.units = G.units.filter((u) => u.hp > 0);
    const A = F.addUnit(0, 'vil', k.x + 120, k.y), B = F.addUnit(0, 'vil', k.x - 120, k.y), C = F.addUnit(0, 'vil', k.x, k.y + 160); A.carry = 10; C.carry = 10;
    for (let i = 0; i < 30; i++) F.addUnit(0, 'spear', C.x + (i % 6) * 6 - 15, C.y + 8 + Math.floor(i / 6) * 6);
    const n = { A: 0, B: 0, C: 0, other: 0 }; G.rs = 12345;
    for (let i = 0; i < 400; i++) { F.natState().raidAt = 0.001; F.natState().raidLast = null; G.t = Math.max(G.t, 1200); F.natRaid();
      const h = G.units.filter((u) => u.horde && u.back); const m = h.length && h[0].aggro; n[m === A ? 'A' : m === B ? 'B' : m === C ? 'C' : 'other']++;
      for (const u of h) { u.horde = false; u.back = 0; u.aggro = null; } }
    if (n.C) bad.push('N16a: a villager guarded by thirty spearmen was raided ' + n.C + ' times (the band cannot beat it)');
    const s = n.A / Math.max(1, n.A + n.B); // w = 1 + 2 × 10/10 = 3 against 1: three in four
    if (!(n.A + n.B > 300) || Math.abs(s - 0.75) > 0.07) bad.push('N16a: the loaded villager drew ' + n.A + ' of ' + (n.A + n.B) + ' raids (' + JSON.stringify(n) + '), not about three in four');
    G.rs = 777; const r1 = []; for (let i = 0; i < 20; i++) r1.push(F.roulette([1, 2, 3])); G.rs = 777; const r2 = []; for (let i = 0; i < 20; i++) r2.push(F.roulette([1, 2, 3]));
    if (r1.join() !== r2.join()) bad.push('N16a: the weighted draw does not follow the seeded dice'); });

  // ── D2: a wanted research is reached through the first step it waits on ──
  T_('D2', () => { const G = fresh(), o = 1, { p, k } = side(G, o, 'bal', 6, 'wood', { f: 5000, w: 5000, s: 5000, g: 5000 }); p.age = 1;
    G.blds.push(F.mkBld(o, 'lumber', k.x + 100, k.y + 100, 1)); F.navRebuild(); p.techs.delete('hafting'); p.techs.delete('axes');
    F.think(p);
    if (!G.blds.some((b) => b.owner === o && b.q.some((j) => j.tech === 'hafting'))) bad.push('D2: Bronze axes is first on the list, and Hafted axes (the step it waits on) was not researched'); });

  // ── D3: saving for an age buys nothing else; a venture only from gold over the next age's; no spice on a computer's routes ──
  T_('D3', () => { const G = fresh(), o = 1, { p, k } = side(G, o, 'bal', 6, 'wood', { f: 5000, w: 5000, s: 5000 }); p.age = 1; G.t = 400; // no gold: the age waits
    for (let i = 0; i < 18; i++) F.addUnit(o, 'vil', k.x - 40, k.y - 40 + i * 4); // 24: the Classical age is due, and it saves
    const kinds = () => G.blds.filter((b) => b.owner === o && ['market', 'tpost', 'pasture', 'workshop'].includes(b.kind)).length, n0 = kinds(); F.think(p);
    if (p.ai.saving !== 1) bad.push('D3: the side is not saving for the Classical age'); else if (kinds() !== n0 || (p.ventures || []).length) bad.push('D3: saving for an age, the computer still bought a market, a post or a venture');
    for (const u of G.units) if (u.owner === o && u.kind === 'vil' && u.x < k.x - 30) { u.hp = 0; u.gone = true; } G.units = G.units.filter((u) => u.hp > 0); p.ai.save = null;
    p.age = 3; p.res.g = 1000; G.blds.push(F.mkBld(o, 'market', k.x + 100, k.y - 100, 1)); F.navRebuild(); F.think(p);
    if ((p.ventures || []).length) bad.push('D3: a venture went out with 1000 gold, under the next age\\'s 900 and a venture\\'s 900 over it');
    for (const f of G.finds) if (F.FINDS[f.kind].stop) for (const u of G.units) if (u.find === f.id) { u.hp = 0; u.gone = true; } G.units = G.units.filter((u) => u.hp > 0); // the stops open
    p.res.s = 0; const c = F.addUnit(o, 'caravan', k.x + 90, k.y - 90); c.route = null; G.tick = 300 - (c.id % 300); F.aiEconomy(p, k, p.res, () => null, () => 1, false);
    if (!c.route) bad.push('D3: no route formed to check the spice on'); else if (c.route.spice) bad.push('D3: a computer caravan buys spice it never sells'); });

  // ── D4: the mix is rebuilt from the goal: a resource over 600 the goal still needs is not cut (it was × 0.4) ──
  T_('D4', () => { const G = fresh(), o = 1, { p, V } = side(G, o, 'bal', 24, 'wood', { f: 700, s: 5000 }); p.age = 2; // Medieval: 300 food and 500 gold short
    for (let i = 0; i < 12; i++) { F.think(p); for (let j = 0; j < 30; j++) F.step(T); p.res.f = 700; p.res.g = 0; }
    const n = V.filter((v) => v.job === 'food').length; // the time to afford is equal at 3 food to 5 gold: about 7 of 20 on food
    if (n < 6) bad.push('D4: 300 food short of the Medieval age with 700 in store, only ' + n + ' of 24 on food after twelve beats (a store over 600 is cut)'); });

  // ── D5: a save once begun holds until the age is bought: a death under the mark does not reset it ──
  T_('D5', () => { const G = fresh(), o = 1, { p, V } = side(G, o, 'bal', 13, 'food', { f: 100 }); F.think(p); const S = p.ai.save; // 13 against the mark of 12
    V[0].hp = 0; V[1].hp = 0; G.units = G.units.filter((u) => u.hp > 0); F.think(p);
    if (!S || p.ai.save !== S) bad.push('D5: two deaths took the town under the mark and the save for the age was reset'); });
  return bad;
}"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
        try: bad = await pg.evaluate(JS)
        except Exception as e: bad = ['the computers checks stopped: ' + str(e)[:200]]
        await br.close()
    bad += errs
    for b in bad: print('FAIL ' + b)
    print(('PASS ' if not bad else 'FAIL ') + 'the computers (by need, famine runway, plots, villagers, peace mode, crowns, raids, research, economy, mix, save)')
    sys.exit(1 if bad else 0)
asyncio.run(main())
