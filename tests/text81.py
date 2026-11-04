# The Nov 1 text, science and combat batch (branch text81; Albert, Nov 1, 07:33, "yes yes yes"), each shown failing on a planted bug.
# The Aqueduct houses no one (D-060); the plague defences multiply, each by its measured effect (D-061); Weather glass is the measured gain
# of a forecast (D-062); Charcoal burning costs what its age and weight cost (D-063); studs on ice by measured friction (D-064); the text
# F2 to F9 and D16; combat C11, C12, C15, C16. Run by the gate:  python3 tests/text81.py
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = """() => {
  const F = window.__fk, bad = [], near = (what, got, want, tol) => { if (!(Math.abs(got - want) <= tol)) bad.push(`${what}: ${got} against ${want}`); };
  F.newGame(5); F.act('close'); F.setPause(false); const G = F.G, P = G.P[0], k = F.keepOf(0), set = (ids) => { P.techs = new Set(ids); F.fxDirty(); };
  const TR = () => F.TRIGGERS().map((r) => r.join(' ')).join(' ');
  // D-060: the Aqueduct houses no one, and no line says it makes room
  { if (F.BLD.aqueduct.room) bad.push('D-060: the Aqueduct has room');
    const said = [TR(), F.WHY.aqueduct, F.BLD.aqueduct.desc].join(' ');
    if (/House, Apartment or Aqueduct|Aqueduct finishes|More water, more people/.test(said)) bad.push('D-060: a line says the Aqueduct makes room'); }
  // D-061: clean water, sewers and quarantine each multiply the spread by the measured factor; together the product
  { const M = F.MEASURED; near('D-061 water e^-0.126', M.water, Math.exp(-0.126), 1e-12); near('D-061 sewers e^-0.123', M.sewer, Math.exp(-0.123), 1e-12); near('D-061 isolation 0.6', M.isolate, 0.6, 1e-12);
    for (const [id, m] of [['cleanwater', M.water], ['sewers', M.sewer], ['quarantine', M.isolate]]) { set([id]); near(`D-061 ${id} on the spread`, F.fxv(0, 'spread').m, m, 1e-12); }
    set(['cleanwater', 'sewers', 'quarantine']); near('D-061 the three multiply', F.fxv(0, 'spread').m, M.water * M.sewer * M.isolate, 1e-12); set([]);
    const line = TR(); if (!line.includes(Math.round(M.water * M.sewer * M.isolate * 100) + '% of it')) bad.push('D-061: the sickness line does not say the three multiply'); }
  // D-062: Weather glass raises a food field by the measured forecast gain, and nothing else food
  { const fld = { kind: 'farm', type: 'food', farm: { kind: 'farm' } }, bush = { kind: 'bush', type: 'food' };
    set([]); const f0 = F.gatherMul(0, fld), b0 = F.gatherMul(0, bush); set(['weathersigns', 'meteorology']);
    near('D-062 Weather glass on a field', F.gatherMul(0, fld) / f0, 46625 / 42300, 1e-9); near('D-062 Weather glass on a bush', F.gatherMul(0, bush) / b0, 1, 1e-12); set([]); }
  // D-063: Charcoal burning costs and takes what a step of its age and weight does (the median of its peers)
  { const C = F.TECHBY.charcoal, sum = (c) => Object.values(c).reduce((a, b) => a + b, 0), med = (L) => { L.sort((a, b) => a - b); return L[L.length >> 1]; },
      peers = F.TECH.filter((t) => t.age === C.age && t.w === C.w && !t.civ && t.id !== 'charcoal');
    if (sum(C.cost) !== med(peers.map((t) => sum(t.cost))) || C.t !== med(peers.map((t) => t.t))) bad.push(`D-063: Charcoal burning costs ${sum(C.cost)} in ${C.t} s; its age asks ${med(peers.map((t) => sum(t.cost)))} in ${med(peers.map((t) => t.t))}`); }
  // F2: the screen help names the three pages of the row and nothing the screen no longer has
  { const sc = F.TRIGGERS().find((r) => r[0] === 'The screen')[1];
    for (const w of [F.ROW_WORD.jobs, F.ROW_WORD.war, F.ROW_WORD.train, F.ROW_WORD.emg]) if (!sc.includes(w)) bad.push('F2: the screen help does not name ' + w);
    if (/speed|Build bottom right|swaps the jobs|cancels one waiting/.test(sc)) bad.push('F2: the screen help names what the screen no longer has'); }
  // F3: every rank research gives is in the upgrade list
  { const tl = TR(); for (const t of F.TECH) if (t.tier && !tl.includes(t.tier.name)) bad.push('F3: the upgrade list leaves out ' + t.tier.name); }
  // F4: the Legion research has its own why, not the Roman unit note
  if (/replaces the swordsman/.test(F.techWhy('legion') || '')) bad.push('F4: the Legion research card shows the Roman Legionary note');
  // F5: the chronicle and each milestone's first line are messages too: ten words at most
  { const n = (t) => t.trim().split(/\\s+/).length;
    for (const L of F.NEWS) for (const t of L) if (n(t) > 10) bad.push('F5: ' + n(t) + ' words: ' + t);
    for (const r of Object.values(F.MS_TEXT)) if (n(r[0]) > 10) bad.push('F5: ' + n(r[0]) + ' words: ' + r[0]); }
  // F6: the provable history errors stay corrected
  { const all = Object.values(F.WHY).join(' ') + ' ' + TR();
    for (const w of ['eleven aqueducts', 'counts over 11,000', 'in seven days', 'ruled for five centuries', 'Near East from about 10,000 years ago', 'unbeaten from Pavia', 'Hittite secret spread', 'pike squares at Morgarten', 'cut timber in Roman Hierapolis', 'for Dionysius of Syracuse in 399 BC', 'only learned to from the 1400s', 'reached Washington after the peace'])
      if (all.includes(w)) bad.push('F6: the text still says "' + w + '"'); }
  // F8: the elite ranks are written in good plurals
  for (const t of F.TECH.filter((t) => t.civ)) if (/mans\\b|ss\\b|Keshigs/.test(t.desc)) bad.push('F8: ' + t.desc);
  // F9: the numbers in the text are the tables'
  { const tx = TR() + ' ' + Object.values(F.MS_TEXT).map((r) => r.join(' ')).join(' ') + ' ' + Object.values(F.EV_TEXT).map((r) => [].concat(r).join(' ')).join(' ');
    const want = [F.BLD.house.room + ' more may live', 'lost about ' + F.MORALE.breakAt * 100 + '%', 'every ' + F.SEASON_LEN * 4 / 60 + ' minutes', 'the wagon, ' + F.UNIT.wagon.joins + ' join',
      Math.round(F.VASSAL.rise * 100) + '% of their villagers', 'hold out ' + F.VASSAL.freeAfter / 60 + ' minutes', F.TEACH.seats + ' learn at a time', 'Hard: every ' + F.DIFF.hard.react + ' s'];
    for (const w of want) if (!tx.includes(w)) bad.push('F9: the text does not read "' + w + '" from its table'); }
  // D16: every lesson climbs at least one age
  for (const [a, b] of Object.entries(F.TEACH_TO)) if (!(F.UNIT[b].age > F.UNIT[a].age)) bad.push(`D16: ${a} to ${b} is no newer age`);
  // C11: a load of 0.45 delivers 0.45, not 0
  { const u = G.units.find((x) => x.owner === 0 && x.kind === 'vil'); Object.assign(u, { x: k.x + 30, y: k.y, job: 'wood', node: null, hunt: null, carry: 0.45, carryType: 'wood', scared: false, inside: false });
    const w0 = P.res.w; for (let i = 0; i < 60 && u.carry > 0; i++) F.vilTick(u, 1 / 30, 1); near('C11: a load of 0.45 delivers', P.res.w - w0, 0.45, 1e-9); }
  // C11, the shop: a load carried to a foundry's door is stashed whole and counted whole
  { const fd = F.mkBld(0, 'foundry', k.x - 160, k.y + 160, 1); G.blds.push(fd); F.fxDirty(); const n = G.nodes.find((q) => q.farm === fd);
    if (!n) bad.push('C11 shop: no node for a foundry'); else {
      const u = F.addUnit(0, 'vil', fd.x, fd.y + F.halfOf(fd) + 3); Object.assign(u, { job: n.type, node: n, hunt: null, carry: 0.45, carryType: n.type, scared: false, inside: false, shop: null }); n.wk = 1;
      const tot = () => Object.values(P.res).reduce((a, b) => a + b, 0), w0 = tot(), g0 = u.st.got; F.vilTick(u, 0.001, 1);
      near('C11 shop: the load stashed', tot() - w0, 0.45, 1e-9); near('C11 shop: the load counted', u.st.got - g0, 0.45, 1e-9); } }
  // C12: a computer's spy on the look-out stays where it is between its checks
  { const s = F.addUnit(1, 'spy', 1000, 1000); s.state = 'look'; s.tk = 0; s.lookT = G.t; s.mvT = -9; const x = s.x, y = s.y;
    for (let i = 0; i < 40; i++) { G.tick++; if ((G.tick + s.id) % 15 === 0) G.tick++; F.spyTick(s, 0.1, 1); }
    if (s.x !== x || s.y !== y || s.mvT !== -9) bad.push('C12: a spy on the look-out walks home between its checks'); s.hp = 0; s.gone = true; }
  // C15: a sick worker works at half, the shepherd too; a fisher with no dock leaves the fish; a loss shakes only those within the circle
  { const u = G.units.find((x) => x.owner === 0 && x.kind === 'vil'); u.sick = 0; const w1 = F.workMul(u); u.sick = G.t + 60; near('C15 a sick worker', F.workMul(u) / w1, 0.5, 1e-12); u.sick = 0;
    const pa = F.mkBld(0, 'pasture', k.x + 160, k.y + 160, 1); G.blds.push(pa); F.fxDirty(); const n = G.nodes.find((q) => q.farm === pa);
    if (!n) bad.push('C15: no field node for a pasture'); else {
      pa.sheep = 6; const sh = F.addUnit(0, 'vil', n.x, n.y); Object.assign(sh, { job: 'food', node: n }); n.wk = 1; const milk = () => { const f0 = P.res.f; G.tick = 1; F.vilTick(sh, 1, 1); return P.res.f - f0; };
      const m1 = milk(); sh.sick = G.t + 60; const m2 = milk(); sh.sick = 0;
      if (!(m1 > 0)) bad.push('C15: the shepherd milks nothing'); else near('C15 a sick shepherd milks at half', m2 / m1, 0.5, 1e-9); sh.hp = 0; sh.gone = true; }
    const fish = G.nodes.filter((q) => q.kind === 'fish' && q.amt > 0 && !F.dockNear(0, q) && Math.hypot(q.x - F.MID, q.y - F.MID) > 400 /* not the great lake's: the citadel's ring holds them (preview 51: the nearest fish to the keep lay there) */).sort((a, b) => Math.hypot(a.x - k.x, a.y - k.y) - Math.hypot(b.x - k.x, b.y - k.y))[0];
    if (!fish) bad.push('C15: no fish to test'); else { const fi = F.addUnit(0, 'vil', k.x + 30, k.y), tick = () => { Object.assign(fi, { job: 'food', node: fish, carry: 0 }); fi.bad = {}; for (const q of G.nodes) if (q !== fish) fi.bad[q.id] = 1e9; /* the fish alone: no better find in reach pulls it off (preview 51: the nearest dockless fish lies by the home bushes) */ G.tick = 20 - (fi.id % 20); F.vilTick(fi, 1 / 30, 1); };
      const dk = F.mkBld(0, 'dock', fish.x, fish.y, 1); G.blds.push(dk); F.fxDirty(); tick(); if (fi.node !== fish) bad.push('C15: the control failed: a fisher with its dock left the fish'); dk.hp = 0; G.blds.splice(G.blds.indexOf(dk), 1);
      tick(); if (fi.node === fish) bad.push('C15: a fisher with no dock in reach keeps fishing'); fi.hp = 0; fi.gone = true; }
    const a = F.addUnit(0, 'spear', 900, 900), b = F.addUnit(0, 'spear', 930, 900), c = F.addUnit(0, 'spear', 935, 935); G.tick++; a.mor = b.mor = c.mor = 1;
    F.died(a); if (!(b.mor < 1)) bad.push('C15: a loss 30 away does not shake'); if (c.mor !== 1) bad.push('C15: a loss shakes a soldier 49 away, outside the circle of ' + F.MORALE.lossR); for (const x of [a, b, c]) { x.hp = 0; x.gone = true; } }
  // C16: muster pays the discounted price; hiring respects the same army ceiling as training; research takes the free line
  { set(['feudal']); const c = F.musterCost(0, { spear: 2 }).cost, u = F.unitCost(0, 'spear');
    for (const r in u) near('C16 muster at the discounted price, ' + r, c[r], u[r] * 2 * 2, 1e-9); set([]);
    const kind = Object.keys(F.FINDS).find((q) => F.FINDS[q].hire), f = { kind, x: k.x + 20, y: k.y, id: 9e7 }, H = F.FINDS[kind].hire;
    const arm = G.units.filter((x) => x.owner === 0 && F.isSoldier && F.isSoldier(x)).length; P.capA = -F.ARMYMAX + arm; for (const r in P.res) P.res[r] = 1e5;
    if (F.hireWhy(0, f) !== F.armyFull(0)) bad.push('C16: hiring past the army ceiling says ' + F.hireWhy(0, f)); P.capA = 0;
    P.age = 4; const T = F.TECH.find((t) => t.at === 'barracks' && !t.civ && !F.needsOf(t).length && t.age <= 2);
    const b1 = F.mkBld(0, 'barracks', k.x - 200, k.y - 200, 1), b2 = F.mkBld(0, 'barracks', k.x - 200, k.y + 200, 1); G.blds.push(b1, b2);
    for (const b of F.ready(0, 'barracks')) b.q.length = 0; for (let i = 0; i < 40; i++) b1.q.push({ tech: 'none', left: 1e9, total: 1e9, paid: {} });
    const why = F.researchWhy(0, T.id); if (why) bad.push('C16: research waits on a full line while another is free: ' + why);
    else { F.research(0, T.id); if (!F.ready(0, 'barracks').some((b) => b !== b1 && b.q.some((j) => j.tech === T.id))) bad.push('C16: research did not take the free line'); }
    b1.q.length = 0; }
  return bad;
}"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
        bad = await pg.evaluate(JS); await br.close()
    bad += errs
    print(('PASS ' if not bad else 'FAIL ') + 'the Nov 1 batch: Aqueduct, plague, Weather glass, Charcoal, the text F2 to F9, D16, combat C11, C12, C15, C16', '' if not bad else bad)
    sys.exit(1 if bad else 0)
asyncio.run(main())
