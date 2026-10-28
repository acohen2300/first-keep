// ═════ 06-orders.js ═════
// ───────────────────────── Orders anyone can give (the computers use the same ones) ─────────────────────────
function trainWhy(o, kind) {   // why a unit cannot be ordered right now, or null
  const k = civKind(o, kind), U = UNIT[k], p = G.P[o];
  if (U.age > p.age) return `${plural(U.name)} need the ${AGES[U.age].name} age.`;
  if (!readyAt(o, U).length) return `Build a ${BLD[U.at].name.toLowerCase()} first.`;
  if (U.cls && clsCount(o, U.cls) >= clsMax(U.cls, o)) return U.cls === 'civ' ? `Worker limit: ${VILMAX}.` : ARMYFULL;
  if (p.hungry) return 'Your people are hungry: put villagers on Food.';
  if (!afford(p, U.cost)) return `Not enough: ${costText(U.cost)}.`;
  if (!readyAt(o, U).some(b => b.q.length < 5)) return 'That line is full (5 waiting).';
  return null;
}
function train(o, kind) {
  if (trainWhy(o, kind)) return false;
  const k = civKind(o, kind), U = UNIT[k], p = G.P[o], at = readyAt(o, U).sort((a, b) => a.q.length - b.q.length)[0];
  const t = U.t * stats(o, k).train;
  pay(p, U.cost); at.q.push({ kind: k, left: t, total: t }); return true;
}
function unTrain(o, kind) {   // cancel the newest villager waiting in any queue; the cost comes back
  for (const b of G.blds) if (b.owner === o) for (let i = b.q.length - 1; i >= 0; i--) { const j = b.q[i]; if (j.kind === kind || (j.kind && UNIT[j.kind].replaces === kind)) { b.q.splice(i, 1); const c = UNIT[j.kind].cost, p = G.P[o]; for (const r in c) p.res[r] += c[r]; return true; } }
  return false;
}
// Muster: a whole battalion in one order at the War Council: twice the cost and a quarter longer; the time is shared by every building that trains each kind
const musterN = plan => Object.values(plan).reduce((n, k) => n + k, 0);
function musterCost(o, plan) {
  const cost = {}; let t = 0;
  for (const k in plan) { const U = UNIT[k], n = plan[k]; for (const r in U.cost) cost[r] = (cost[r] || 0) + U.cost[r] * n * 2; t = Math.max(t, n * U.t * stats(o, k).train / Math.max(1, readyAt(o, U).length)); }
  return { cost, t: Math.ceil(t * 1.25) };
}
function musterWhy(o, plan) {
  const p = G.P[o], n = musterN(plan);
  if (!p.techs.has('muster')) return 'Needs Muster.';
  if (!n) return 'Nothing missing.';
  if (!ready(o, 'council').some(b => b.q.length < 5)) return 'Needs a War Council.';
  for (const k in plan) { const U = UNIT[k]; if (U.age > p.age || !readyAt(o, U).length) return `Needs a ${BLD[U.at].name.toLowerCase()}.`; }
  if (clsCount(o, 'army') + n > armyRoom(o)) return ARMYFULL;
  if (popOf(o) + n > capOf(o)) return 'Needs room: build homes.';
  if (p.hungry) return 'Your people are hungry.';
  const { cost } = musterCost(o, plan); if (!afford(p, cost)) return `Not enough: ${costText(cost)}.`;
  return null;
}
function muster(o, plan, bn) {
  if (musterWhy(o, plan)) return false;
  const { cost, t } = musterCost(o, plan), at = ready(o, 'council').sort((a, b) => a.q.length - b.q.length)[0];
  pay(G.P[o], cost); at.q.push({ muster: plan, bn, left: t, total: t }); return true;
}
function researchWhy(o, id) {
  const T = TECHBY[id], p = G.P[o];
  if (p.techs.has(id)) return 'Already known.';
  if (T.age > p.age) return `Needs the ${AGES[T.age].name} age.`;
  if (T.need && !p.techs.has(T.need)) return `Needs ${TECHBY[T.need].name}.`;
  if (G.blds.some(b => b.owner === o && b.q.some(j => j.tech === id))) return 'Being researched.';
  const at = ready(o, T.at)[0]; if (!at) return `Needs a ${BLD[T.at].name.toLowerCase()}.`;
  if (at.q.length >= 5) return 'That line is full.';
  if (!afford(p, T.cost)) return `Not enough: ${costText(T.cost)}.`;
  return null;
}
function research(o, id) {
  if (researchWhy(o, id)) return false;
  const T = TECHBY[id], p = G.P[o], at = ready(o, T.at)[0], tt = T.t * fxv(o, 'research').m;
  pay(p, T.cost); p.spent += sumCost(T.cost); at.q.push({ tech: id, left: tt, total: tt }); return true;
}
function ageUp(o) {
  const p = G.P[o], A = AGES[p.age + 1], k = keepOf(o);
  if (!A || p.aging || !k || !afford(p, A.cost) || k.q.length >= 5) return false;
  pay(p, A.cost); p.spent += sumCost(A.cost); k.q.push({ age: p.age + 1, left: A.t, total: A.t }); p.aging = true; return true;
}
function build(o, kind, x, y) {
  const B = BLD[kind], p = G.P[o];
  if (B.age > p.age || !afford(p, B.cost) || !keepOf(o) || canPlace(o, kind, x, y)) return null;
  const sp = snapPos(kind, x, y);
  if (kind === 'gate') { const w = NAV.occ[sp.gy * NC + sp.gx]; if (w && w.kind === 'wall') { w.hp = 0; w.gone = true; } }   // a gate takes the place of a wall square
  pay(p, B.cost);
  const b = mkBld(o, kind, x, y, 0); G.blds.push(b); navRebuild(); qcDrop(); if (o === 0) learn('build:' + kind);
  if (B.atStop) { const f = G.finds.find(f => f.kind === 'stop' && Math.abs(f.x - b.x) < 24 && Math.abs(f.y - b.y) < 24); b.sid = f && f.id; }
  if (o === 0) sfx('place');
  autoBuilder(o, b);
  return b;
}
// A site rises only while villagers work it. The nearest free villager goes at once; a line of wall gets two at most, who then work down it.
function autoBuilder(o, b) {
  if (BLD[b.kind].wallish && G.blds.filter(s => s.owner === o && s.prog < 1 && BLD[s.kind].wallish && unitsOf(o, 'vil').some(v => v.rep === s && v.job === 'repair')).length >= 2) return;
  const v = pickVil(o, b); if (v) sendBuilder(v, b);
}
function sendBuilder(v, b) { if (v.job !== 'repair') v.pj = v.job; setJob(v, 'repair'); v.rep = b; v.building = true; }
// Send one more to a site (or the one you picked)
function sendBuild(o, id, vid) {
  const b = G.blds.find(x => x.id === id && x.owner === o && x.hp > 0 && x.prog < 1); if (!b) return false;
  const v = vid ? unitsOf(o, 'vil').find(x => x.id === vid) : pickVil(o, b, 'repair', b);
  if (!v) { if (o === 0) say('No villager is free.', '', 3); return false; }
  sendBuilder(v, b); if (o === 0) say(`A villager goes to raise the ${bldName(o, b.kind).toLowerCase()}.`, '', 3); return true;
}
// Take a building down: half its cost back (all of it in the first 15% of the build); what was waiting inside comes back in full. Never the Town Center.
function refundOf(b) {
  const full = b.prog < 0.15, back = {};
  addRes(back, BLD[b.kind].cost, full ? 1 : 0.5);
  for (const j of b.q) addRes(back, j.kind ? UNIT[j.kind].cost : j.tech ? TECHBY[j.tech].cost : j.age ? AGES[j.age].cost : null);
  for (const k in back) back[k] = Math.floor(back[k]);
  return back;
}
function demolish(o, id) {
  const b = G.blds.find(x => x.id === id && x.owner === o && x.hp > 0); if (!b || b.kind === 'keep') return false;
  const p = G.P[o], back = refundOf(b), full = b.prog < 0.15;
  addRes(p.res, back); if (b.q.some(j => j.age)) p.aging = false;
  for (const j of b.q) if (j.tech) p.spent -= sumCost(TECHBY[j.tech].cost);
  b.by = undefined; b.hp = 0; b.q = []; b.gone = true; G.navDirty = true; if (BLD[b.kind].fx) fxDirty();
  if (o === 0) say(`${bldName(o, b.kind)} ${full ? 'cancelled' : 'taken down'}: ${costText(back)} back.`, '', 4);
  return true;
}

// ───────────────────────── Diplomacy: acts of war and acts of peace ─────────────────────────
function declareWar(a, b, why) {
  if (a === b || a === WILD || b === WILD || G.rel[a][b] === 'war') return;
  const wasAlly = G.rel[a][b] === 'ally';
  G.rel[a][b] = G.rel[b][a] = 'war'; G.navDirty = true;
  if (G.P[a].ally === b) G.P[a].ally = null; if (G.P[b].ally === a) G.P[b].ally = null;
  if (a === 0 || b === 0) say(`${G.P[a === 0 ? b : a].name}: ${wasAlly ? 'the alliance is broken. ' : ''}war, ${why}.`, 'warn', 6);
  else if (a === FORT || b === FORT) say(`${G.P[a].name} and ${G.P[b].name} are now at war.`, '', 5);
}
function sendEnvoy(o, to) {
  const p = G.P[o], k = keepOf(o), tk = keepOf(to);
  if (!k || !tk || p.envoyOut || p.age < 1 || !afford(p, UNIT.envoy.cost)) return false;
  pay(p, UNIT.envoy.cost);
  const u = addUnit(o, 'envoy', k.x, k.y); u.state = 'envoy'; u.target = to; p.envoyOut = true; p.envoyAt = G.t;
  if (o === 0) say('Your emissary rides to the Fortress.', '', 4);
  return true;
}
// The Fortress allies only with whoever raises its odds of surviving.
function judgeEnvoy(fort, from, envoy) {
  const F = G.P[fort];
  if (G.rel[fort][from] === 'war') { envoy.hp = 0; if (from === 0) say('The Fortress killed your emissary.', 'warn', 6); return; }
  if (F.ally !== null && F.ally !== from) { reply(from, envoy, `The Fortress is already allied with ${G.P[F.ally].name}.`); return; }
  if (F.ally === from) { reply(from, envoy, 'The Fortress is already your ally.'); return; }
  const est = o => estPower(fort, o), mine = powerOf(soldiersOf(fort)) + 600 + bldsOf(fort, 'tower').length * 120 + (bldsOf(fort, 'wall').length + bldsOf(fort, 'gate').length) * 7;
  let threat = -1, top = 0; for (const q of G.P) if (q.id !== fort && q.id !== WILD && q.alive && est(q.id) > top) { top = est(q.id); threat = q.id; }
  if (threat === from && est(from) > mine * 1.2) { reply(from, envoy, 'The Fortress sent your emissary back with nothing. You are the one they fear.'); return; }
  if (est(from) < top * 0.5) { F.terms = F.terms || {}; F.terms[from] = 150; reply(from, envoy, 'The Fortress sends terms: 150 gold for an alliance.'); return; }
  makeAlly(fort, from); reply(from, envoy, 'The Fortress accepts. You are allies.');
}
function reply(from, envoy, text) { envoy.state = 'return'; if (from === 0) say(text, text.includes('accepts') ? 'good' : '', 7); }
function payTerms(o) {
  const F = G.P[FORT], price = F.terms && F.terms[o];
  if (!price || G.P[o].res.g < price || G.rel[FORT][o] === 'war' || F.ally !== null) return false;
  G.P[o].res.g -= price; F.res.g += price; delete F.terms[o]; makeAlly(FORT, o);
  if (o === 0) say('Tribute paid. The Fortress is your ally.', 'good', 6);
  return true;
}
function makeAlly(a, b) {
  G.rel[a][b] = G.rel[b][a] = 'ally'; G.P[a].ally = b; G.P[b].ally = a; G.navDirty = true;
  if (b !== 0 && a !== 0) say(`${G.P[a].name} allied with ${G.P[b].name}.`, 'warn', 6);
}
function askHelp(o) {
  if (G.P[FORT].ally !== o) return false;
  const army = soldiersOf(o), pt = army.length ? { x: army.reduce((s, u) => s + u.x, 0) / army.length, y: army.reduce((s, u) => s + u.y, 0) / army.length } : keepOf(o);
  return sendHelp(FORT, pt, o === 0, true);
}
function sendHelp(f, pt, tell, asked) {
  const mine = soldiersOf(f).filter(u => u.state === 'home'), keep = Math.ceil(mine.length * 0.5), go = mine.slice(keep);
  if (!go.length || !pt) { if (tell && asked) say('The Fortress has no soldiers to spare yet.', '', 5); return false; }
  go.forEach(u => { u.state = 'assist'; u.px = pt.x; u.py = pt.y; u.idleT = 0; });
  if (tell) say(`The Fortress sends ${go.length} soldiers to help.`, 'good', 5);
  return true;
}

// ───────────────────────── Trade, zeal, spies, hiring ─────────────────────────
// The Market, one rule for everything it trades: resources by the 100, goods by the 10; it pays 80% of worth (90% with Coinage)
// and charges 125%, both moved by the going price. A trade stop pays full worth and more, which is why caravans go there.
const LOT = k => TRADE[k] ? 100 : 10;
const worth = k => TRADE[k] ? TRADE[k] / 100 : GOODS[k].buy || GOODS[k].base;   // spice is worth what it costs at a stop
const sellPrice = (o, k) => Math.floor(LOT(k) * worth(k) * (SELL + fxv(o, 'sell').a) * mkt(k));
const buyPrice = k => Math.ceil(LOT(k) * worth(k) * BUY * mkt(k));
const haveOf = (p, k) => TRADE[k] ? p.res[k] : p.goods[k] || 0;
function marketTrade(o, k, dir) {
  const p = G.P[o], n = LOT(k); if (!ready(o, 'market').length) return false;
  if (dir === 'sell') { if (!MKT_SELL.includes(k) || haveOf(p, k) < n) return false; const v = sellPrice(o, k); if (TRADE[k]) p.res[k] -= n; else p.goods[k] -= n; p.res.g += v; if (!TRADE[k]) p.gathered += v; mktHit(k, TRADE[k] ? 25 : n, -1); }
  else { if (!MKT_BUY.includes(k)) return false; const c = buyPrice(k); if (p.res.g < c) return false; p.res.g -= c; if (TRADE[k]) p.res[k] += n; else p.goods[k] = (p.goods[k] || 0) + n; mktHit(k, TRADE[k] ? 25 : n, 1); }
  if (o === 0) sfx('coin'); return true;
}
const zealCost = o => ({ g: Math.round(ZEAL.cost.g * fxv(o, 'zealcost').m) });
function zealWhy(o, list) {
  const p = G.P[o];
  if (!ready(o, 'temple').length) return 'Zeal needs a finished Temple.';
  if (p.zealT > G.t) return `Zeal is resting: ${Math.ceil(p.zealT - G.t)} s.`;
  if (!afford(p, zealCost(o))) return `Not enough gold: ${costText(zealCost(o))}.`;
  if (!list.some(isSoldier)) return 'Nobody to bless in that battalion.';
  if (!G.units.some(u => u.owner === o && u.kind === 'priest' && list.some(v => dist(u, v) < 120))) return 'A priest has to be with them.';
  return null;
}
function zeal(o, list) {
  if (zealWhy(o, list)) return false;
  const p = G.P[o]; pay(p, zealCost(o)); p.zealT = G.t + ZEAL.cd * fxv(o, 'zealcd').m;
  for (const u of list) if (isSoldier(u)) u.zeal = G.t + ZEAL.secs;
  if (o === 0) { say(`Zeal on the ${selName()} for ${ZEAL.secs} s.`, 'good', 5); sfx('zeal'); }
  return true;
}
// a spy stands unseen beyond 45 of soldiers and 140 of towers, the Town Center and Courthouses
const watchtower = b => b.prog >= 1 && b.hp > 0 && (BLD[b.kind].dmg || BLD[b.kind].spyonly);
const guarded = b => G.blds.some(d => d.owner === b.owner && watchtower(d) && dist(d, b) < BLD[d.kind].rng);
function sabotage(u, b) {
  const how = BLD[b.kind].sab; if (!how) return false;
  if (how === 'burn') { b.hp -= maxHpB(b.owner, b.kind) * SAB.burn; if (b.hp > 0) ignite(b, 'sabotage'); }
  else { b.stall = G.t + SAB.stall; const j = b.q.shift(); if (j && j.age) G.P[b.owner].aging = false; if (j && (j.tech || j.age)) G.P[b.owner].spent -= sumCost(j.tech ? TECHBY[j.tech].cost : AGES[j.age].cost); }   // lost research is not counted as research paid
  if (b.hp <= 0) b.by = undefined;   // a fire pays nobody
  u.hp = 0; sfx(how === 'burn' ? 'crash' : 'err', b.x, b.y);
  const nm = bldName(b.owner, b.kind);
  if (b.owner === 0) { const what = how === 'burn' ? 'on fire' : `stopped ${SAB.stall} s`; say(`Sabotage at ${coord(b.x, b.y)}: ${nm} ${what}.`, 'warn', 7, b); }
  else if (u.owner === 0) say(`Your spy ${how === 'burn' ? 'set fire to' : 'stalled'} their ${nm.toLowerCase()}.`, 'good', 5);
  return true;
}
function intel(o, owner) {
  if (o !== 0) return; const q = G.P[owner], army = {};
  for (const u of G.units) if (u.owner === owner && UNIT[u.kind].cls === 'army') army[u.kind] = (army[u.kind] || 0) + 1;
  G.intel[owner] = { t: G.t, res: { ...q.res }, age: q.age, techs: q.techs.size, army };
}
function hireWhy(o, f) {
  const H = FINDS[f.kind].hire; if (!H || f.done) return 'Gone.';
  if (!G.units.some(u => u.owner === o && u.kind !== 'envoy' && dist(u, f) < 80)) return 'Send a unit there first.';
  if (clsCount(o, 'army') + H.n > ARMYMAX) return `Army limit: ${ARMYMAX}.`;
  if (!afford(G.P[o], H.cost)) return `Not enough: ${costText(H.cost)}.`;
  return null;
}
function hire(o, f) {
  if (hireWhy(o, f)) return false;
  const H = FINDS[f.kind].hire; pay(G.P[o], H.cost); f.done = true; f.owner = o;
  for (const v of G.units) if (v.find === f.id && v.kind === 'vagabond') { v.hp = 0; v.gone = true; const s = addUnit(o, civKind(o, H.unit), v.x, v.y); s.state = 'home'; }
  if (o === 0) say(`${H.n} vagabonds join your army.`, 'good', 5);
  return true;
}

// ───────────────────────── Villager orders ─────────────────────────
function setJob(u, job, n) { if (u.node && u.node.farm) u.node.wk = Math.max(0, (u.node.wk || 0) - 1); u.job = job; u.node = n || null; if (n && n.farm) n.wk = (n.wk || 0) + 1; if (job !== 'repair') u.rep = null; }
// the villager to send: the nearest idle one; if none is idle, one from the job whose stock you hold the most of
function pickVil(o, to, skipJob, site) {
  const p = G.P[o], V = unitsOf(o, 'vil').filter(u => !u.inside && !(site && u.rep === site)), idle = V.filter(u => !u.job), other = V.filter(u => u.job && u.job !== skipJob && u.job !== 'repair' && !GOODK.includes(u.job));   // weavers, brewers and shepherds keep their posts unless nobody else can go
  const stock = u => p.res[KEY[u.job]] || 0;
  if (idle.length) return nearest(idle, to);
  const pool = other.length ? other : V.filter(u => u.job !== 'repair'); if (!pool.length) return null;   // nobody is pulled off a site: with all hands busy, the order waits
  return pool.sort((a, b) => (stock(b) - stock(a)) || (dist(a, to) - dist(b, to)))[0];
}
function moveVil(o, job, down) {
  const V = unitsOf(o, 'vil');
  if (down) { const v = V.filter(u => u.job === job).sort((a, b) => a.carry - b.carry)[0]; if (v) setJob(v, null); return; }
  let v = V.find(u => !u.job);
  if (!v) { const n = {}; V.forEach(u => { if (u.job && u.job !== job && u.job !== 'repair') n[u.job] = (n[u.job] || 0) + 1; }); const from = Object.entries(n).sort((a, b) => b[1] - a[1])[0]; if (from) v = V.filter(u => u.job === from[0]).sort((a, b) => a.carry - b.carry)[0]; }
  if (v) setJob(v, job);
}
function sendVil(o, id) {
  const n = G.nodes.find(x => x.id === id); if (!n || (n.amt <= 0 && n.kind !== 'farm')) return false;
  const job = n.type, v = pickVil(o, n, job);
  if (!v) { if (o === 0) say('No villager is free.', '', 3); return false; }
  setJob(v, job, n); if (o === 0) say(`A villager heads for the ${nodeName(n).toLowerCase()}.`, '', 3); return true;
}
function sendHunt(o, id) {   // tap game, send a hunter: the nearest idle villager, else one from another job
  const a = G.units.find(x => x.id === id && x.hp > 0 && x.owner === WILD && UNIT[x.kind].meat); if (!a) return false;
  const v = pickVil(o, a, 'food'); if (!v) { if (o === 0) say('No villager is free.', '', 3); return false; }
  setJob(v, 'food'); v.hunt = a; if (o === 0) say(`A villager goes hunting ${UNIT[a.kind].name.toLowerCase()}.`, '', 3); return true;
}
function sendRepair(o, id) {
  const b = G.blds.find(x => x.id === id && x.owner === o && x.hp > 0 && x.prog >= 1); if (!b || b.hp >= maxHpB(o, b.kind) - 0.5) return false;
  const v = pickVil(o, b); if (!v) { if (o === 0) say('No villager is free.', '', 3); return false; }
  setJob(v, 'repair'); v.rep = b; if (o === 0) say(`A villager goes to mend the ${bldName(o, b.kind).toLowerCase()}.`, '', 3); return true;
}
const repairCost = (o, b) => { const M = maxHpB(o, b.kind); return Object.fromEntries(Object.entries(BLD[b.kind].cost || { w: 200, s: 100 }).map(([k, v]) => [k, Math.ceil(v * 0.25 * (1 - b.hp / M))])); };
const nodeName = n => n.kind === 'farm' ? (n.type === 'wood' ? 'Tree farm' : 'Field') : { tree: 'Tree', bush: 'Berry bush', fish: 'Fish', stone: 'Stone', gold: 'Gold', iron: 'Iron', meat: 'Carcass' }[n.kind];


// ── the player's placing and box orders (the finger's work is in 11-input.js; what it orders is here)
function commitPlace() {
  const pl = G.place; if (!pl || !pl.at) return;
  const kind = pl.kind, B = BLD[kind], p = G.P[0];
  if (kind === 'wall') {
    const cells = pl.cells && pl.cells.length ? pl.cells : [toCell(pl.at)];
    let built = 0, blocked = 0, broke = false;
    for (const c of cells) { if (!afford(p, B.cost)) { broke = true; break; } if (build(0, 'wall', c.gx * NAVC + 5, c.gy * NAVC + 5)) built++; else blocked++; }
    say(built ? `${built} wall piece${built > 1 ? 's' : ''} going up${blocked ? `; ${blocked} blocked` : ''}${broke ? '; out of stone' : ''}.` : broke ? `Not enough stone: ${B.cost.s} a piece.` : 'Something is in the way.', '', 4);
    pl.cells = null; pl.a = null; pl.at = null; ui(true); return;
  }
  const why = canPlace(0, kind, pl.at.x, pl.at.y);
  if (why) { say(why + '.', '', 3); sfx('err'); return; }
  if (!afford(p, B.cost)) { say(`Not enough for a ${B.name.toLowerCase()}: ${costText(B.cost)}.`, '', 3); sfx('err'); return; }
  const b = build(0, kind, pl.at.x, pl.at.y);
  if (b && B.repeat) {
    const n = B.fp * NAVC + NAVC, spots = [[n, 0], [0, n], [-n, 0], [0, -n]].map(([dx, dy]) => snapPos(kind, b.x + dx, b.y + dy));
    pl.at = spots.find(s => !canPlace(0, kind, s.x, s.y)) || null;
    if (!pl.at) cancelPlace();
  } else cancelPlace();
  ui(true);
}
function boxCut(r, n) {   // send n villagers to cut the trees in the box, then back to their work
  const mid = { x: (r.x0 + r.x1) / 2, y: (r.y0 + r.y1) / 2 }, V = unitsOf(0, 'vil').filter(u => !u.inside && !u.patch && u.job !== 'repair').sort((a, b) => (!!a.job - !!b.job) || dist(a, mid) - dist(b, mid));   // idle first, then the nearest
  let sent = 0; for (const v of V.slice(0, n)) { v.pj = v.job === 'wood' ? null : v.job; setJob(v, 'wood'); v.patch = { ...r }; sent++; }
  say(sent ? `${sent} villager${sent > 1 ? 's go' : ' goes'} to cut the trees in the box.` : 'No villager is free.', '', 4);
}

// ── Orders you can follow: a group sent somewhere is stamped with its order; the map draws a line to where it is going, the People card
// lists it, and the game says when it gets there (Build 38: an attack that marched 90 seconds with no sign looked like it never left)
function march(S, to, label) {
  if (!S.length) return;
  const id = (G.ordN = (G.ordN || 0) + 1); (G.ords = G.ords || {})[id] = { id, x: Math.round(to.x), y: Math.round(to.y), label, t: G.t, arrived: false };
  for (const u of S) u.ord = id;
  say(`${S.length} marching: ${label}.`, '', 3);
}
function ordersTick() {   // once a second: who is still on each order, and has it arrived
  if (!G.ords) return;
  const by = {}; for (const u of G.units) if (u.owner === 0 && u.ord && u.hp > 0) (by[u.ord] = by[u.ord] || []).push(u);
  for (const id in G.ords) {
    const O = G.ords[id], S = by[id]; if (!S) { delete G.ords[id]; continue; }
    let x = 0, y = 0; for (const u of S) { x += u.x; y += u.y; } O.cx = x / S.length; O.cy = y / S.length; O.n = S.length; O.fight = S.some(u => u.tgt && u.tgt.hp > 0);
    if (!O.arrived && hyp(O.cx - O.x, O.cy - O.y) < 90) { O.arrived = true; say(`${S.length} arrived: ${O.label}.`, 'good', 4, O); }
    if (!O.arrived) { let spd = 1e9; for (const u of S) spd = Math.min(spd, stats(0, u.kind).spd); O.eta = Math.round(hyp(O.cx - O.x, O.cy - O.y) / Math.max(1, spd)); }
  }
  for (const u of G.units) if (u.ord && (!G.ords[u.ord] || u.state === 'home')) u.ord = undefined;   // called home: no longer on that order
}
