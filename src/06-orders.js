// ═════ 06-orders.js ═════
// ───────────────────────── Orders anyone can give (the computers use the same ones) ─────────────────────────
// what a unit costs this side now (Informers make spies cheaper)
const unitCost = (o, k) => { const m = fxv(o, 'cost', unitKeys(k)).m; if (m === 1) return UNIT[k].cost; const c = {}; for (const r in UNIT[k].cost) c[r] = Math.round(UNIT[k].cost[r] * m); return c; };
function trainWhy(o, kind) {   // why a unit cannot be ordered right now, or null
  const k = civKind(o, kind), U = UNIT[k], p = G.P[o];
  if (U.age > p.age) return `${plural(U.name)} need the ${AGES[U.age].name} age.`;
  if (!readyAt(o, U).length) return `Build a ${BLD[U.at].name.toLowerCase()} first.`;
  if (U.cls && clsCount(o, U.cls) >= clsMax(U.cls, o)) return U.cls === 'civ' ? `Worker limit: ${VILMAX}.` : armyFull(o);
  if (p.hungry) return 'Your people are hungry: put villagers on Food.';
  if (!afford(p, unitCost(o, k))) return `Not enough: ${costText(unitCost(o, k))}.`;
  if (!readyAt(o, U).some(b => b.q.length < qMax(o))) return `That line is full (${qMax(o)} waiting).`;
  return null;
}
function train(o, kind) {
  if (trainWhy(o, kind)) return false;
  const k = civKind(o, kind), U = UNIT[k], p = G.P[o], at = readyAt(o, U).sort((a, b) => a.q.length - b.q.length)[0];
  const t = U.t * stats(o, k).train;
  pay(p, unitCost(o, k)); at.q.push({ kind: k, left: t, total: t }); return true;
}
// cancel one order in a building's line: its cost comes back in full (a muster's too); research and the age give back what was paid
function cancelOrder(o, b, i) {
  const j = b.q[i], p = G.P[o]; if (!j || b.owner !== o) return false;
  b.q.splice(i, 1); const back = {};
  if (j.kind) addRes(back, UNIT[j.kind].cost); else if (j.muster) addRes(back, musterCost(o, j.muster).cost); else if (j.tech) { addRes(back, TECHBY[j.tech].cost); p.spent -= sumCost(TECHBY[j.tech].cost); } else if (j.age) { addRes(back, AGES[j.age].cost); p.spent -= sumCost(AGES[j.age].cost); p.aging = false; }
  addRes(p.res, back); return true;
}
function unTrain(o, kind) {   // cancel the newest villager waiting in any queue
  for (const b of G.blds) if (b.owner === o) for (let i = b.q.length - 1; i >= 0; i--) { const j = b.q[i]; if (j.kind === kind || (j.kind && UNIT[j.kind].replaces === kind)) return cancelOrder(o, b, i); }
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
  if (!lineFree(o, ['council'])) return 'Needs a War Council.';
  for (const k in plan) { const U = UNIT[k]; if (U.age > p.age || !readyAt(o, U).length) return `Needs a ${BLD[U.at].name.toLowerCase()}.`; }
  if (clsCount(o, 'army') + n > armyRoom(o)) return armyFull(o);
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
  if (T.civ && T.civ !== p.civ) return 'Belongs to another people.';
  if (T.age > p.age) return `Needs the ${AGES[T.age].name} age.`;
  for (const n of needsOf(T)) if (!p.techs.has(n)) return `Needs ${TECHBY[n].name}.`;
  if (G.blds.some(b => b.owner === o && b.q.some(j => j.tech === id))) return 'Being researched.';
  const at = ready(o, T.at)[0]; if (!at) return `Needs a ${BLD[T.at].name.toLowerCase()}.`;
  if (at.q.length >= qMax(o)) return 'That line is full.';
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
  if (!A || p.aging || !k || !afford(p, A.cost) || k.q.length >= qMax(o)) return false;
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

// ───────────────────────── Diplomacy: one table of relations, one way to change them ─────────────────────────
// Relations are ally, peace (neutral) or war (hostile), the same for every side. Hostile is declared with NOTICE seconds' warning (Rome's fetial
// priests declared war before a campaign; no ambush from peace). Neutral is granted at once by an ally, or asked of an enemy by an envoy.
// Ally needs the other side's yes, carried by an envoy. The computers answer by their odds, and change their own minds the same way.
function declareWar(a, b, why) {
  if (a === b || a === WILD || b === WILD || G.rel[a][b] === 'war') return;
  const wasAlly = G.rel[a][b] === 'ally';
  G.rel[a][b] = G.rel[b][a] = 'war'; G.navDirty = true; delete G.warAt[a + ',' + b]; delete G.warAt[b + ',' + a];
  if (G.P[a].ally === b) G.P[a].ally = null; if (G.P[b].ally === a) G.P[b].ally = null;
  if (a === 0 || b === 0) say(`${G.P[a === 0 ? b : a].name}: ${wasAlly ? 'the alliance is broken. ' : ''}war, ${why}.`, 'warn', 6);
  else say(`${G.P[a].name} and ${G.P[b].name} are now at war.`, '', 5);
}
function makePeace(a, b) { G.rel[a][b] = G.rel[b][a] = 'peace'; G.navDirty = true; if (G.P[a].ally === b) G.P[a].ally = null; if (G.P[b].ally === a) G.P[b].ally = null; for (const u of G.units) if ((u.owner === a && u.state === 'attack' && u.target === b) || (u.owner === b && u.state === 'attack' && u.target === a)) u.state = 'home'; }
function makeAlly(a, b) {
  G.rel[a][b] = G.rel[b][a] = 'ally'; G.P[a].ally = b; G.P[b].ally = a; G.navDirty = true;
  if (b !== 0 && a !== 0) say(`${G.P[a].name} allied with ${G.P[b].name}.`, 'warn', 6);
}
const noticeLeft = (a, b) => { const t = G.warAt[a + ',' + b]; return t === undefined ? 0 : Math.max(0, Math.ceil(t - G.t)); };
// why a side cannot take this stance toward another right now, or null
function relWhy(o, q, want) {
  const p = G.P[o], Q = G.P[q], rel = G.rel[o][q]; if (q === o || (q !== WILD && !Q.alive)) return 'Not now.';
  if (Q.lord === o && !Q.rebel) return 'Your vassal: see their card.';
  if (p.lord === q && !p.rebel) return 'Your overlord.';
  if (want === rel) return 'Already.';
  if (q === WILD && want === 'peace') return 'Their regard decides.';   // the Natives: peace comes from regard, alliance by emissary when regard is high
  if (q === WILD && want === 'ally' && regardOf(o) < NATIVE.allyAt) return `Needs regard ${NATIVE.allyAt}.`;
  if (want === 'war') return noticeLeft(o, q) ? `Notice given: ${noticeLeft(o, q)} s.` : null;
  if (want === 'ally' && rel === 'war') return 'Make peace first.';
  if (p.envoyOut) return 'Your emissary is out.';
  if (p.age < 1) return 'Needs the Bronze age.';
  if (!afford(p, UNIT.envoy.cost)) return `Not enough: ${costText(UNIT.envoy.cost)}.`;
  return null;
}
function setRel(o, q, want) {
  if (relWhy(o, q, want)) return false;
  const rel = G.rel[o][q];
  if (q === WILD && want === 'war') { makePeace(o, q); G.rel[o][q] = G.rel[q][o] = 'war'; G.navDirty = true; natRegard(o, -20); return true; }   // turning on the Natives costs regard, and needs no notice: they are not a court
  if (want === 'war') { if (rel === 'ally') makePeace(o, q); G.warAt[o + ',' + q] = G.t + NOTICE; if (o === 0 || q === 0) say(`${G.P[o === 0 ? q : o].name}: hostile in ${NOTICE} s${o === 0 ? ' (notice given)' : ''}.`, 'warn', 6); return true; }
  delete G.warAt[o + ',' + q];   // a side that was giving notice has thought again
  if (want === 'peace' && rel === 'ally') { makePeace(o, q); if (q === 0) say(`${G.P[o].name} ended the alliance.`, 'warn', 6); return true; }
  return sendEnvoy(o, q, want);   // peace from war, or an alliance: carried over, answered there
}
function noticeTick() { for (const k in G.warAt) if (G.t >= G.warAt[k]) { const [a, b] = k.split(',').map(Number); declareWar(a, b, 'the notice ran out'); } }
function sendEnvoy(o, to, ask) {
  const p = G.P[o], k = keepOf(o), tk = homeOf(to);
  if (!k || !tk || p.envoyOut || p.age < 1 || !afford(p, UNIT.envoy.cost)) return false;
  pay(p, UNIT.envoy.cost);
  const u = addUnit(o, 'envoy', k.x, k.y); u.state = 'envoy'; u.target = to; u.ask = ask || 'ally'; p.envoyOut = true; p.envoyAt = G.t;
  if (o === 0) say(`Your emissary rides to the ${G.P[to].name}: ${ask === 'peace' ? 'peace' : 'alliance'}.`, '', 4);
  return true;
}
// the square law on strength, bent by who counters whom: the odds q gives itself against o
const oddsOf = (q, o) => { const S = soldiersOf(q), r = powerOf(S) / estPower(q, o) * matchup(S, soldiersOf(o)); return r * r / (1 + r * r); };
function judgeEnvoy(to, from, envoy) {
  const T = G.P[to], ask = envoy.ask || 'ally';
  if (G.rel[to][from] === 'war' && ask !== 'peace') { envoy.hp = 0; if (from === 0) say(`The ${T.name} killed your emissary.`, 'warn', 6); return; }
  if (to === WILD) return judgeNatives(from, envoy, ask);
  const busy = G.P.some(q => q.alive && q.id !== WILD && q.id !== from && atWar(to, q.id));   // another war on their hands
  if (ask === 'peace') {
    if (G.rel[to][from] !== 'war') { reply(from, envoy, `The ${T.name} are already at peace with you.`); return; }
    if (oddsOf(to, from) > 0.6 + fxv(from, 'diplo').a && !busy && !T.rebel) { reply(from, envoy, `The ${T.name} want more of this war.`); return; }
    makePeace(to, from); reply(from, envoy, `The ${T.name} accept peace.`); return;
  }
  if (T.ally !== null && T.ally !== from) { reply(from, envoy, `The ${T.name} are already allied with ${G.P[T.ally].name}.`); return; }
  if (T.ally === from) { reply(from, envoy, `The ${T.name} are already your ally.`); return; }
  if (oddsOf(from, to) < 0.3) { reply(from, envoy, `The ${T.name} see no strength in you worth an alliance.`); return; }
  if (!busy && oddsOf(to, from) > 0.7 + fxv(from, 'diplo').a) { reply(from, envoy, `The ${T.name} need no ally today.`); return; }
  makeAlly(to, from); reply(from, envoy, `The ${T.name} accept. You are allies.`);
}
function reply(from, envoy, text) { envoy.state = 'return'; if (from === 0) say(text, text.includes('accept') ? 'good' : '', 7); }
// an ally sends half of what stands at home to a friend's town under attack (every computer does this for its ally, the Fortress included)
function sendHelp(f, pt, tell) {
  const mine = soldiersOf(f).filter(u => u.state === 'home'), keep = Math.ceil(mine.length * 0.5), go = mine.slice(keep);
  if (!go.length || !pt) return false;
  go.forEach(u => { u.state = 'assist'; u.px = pt.x; u.py = pt.y; u.idleT = 0; });
  if (tell) say(`${G.P[f].name} send ${go.length} soldiers to help.`, 'good', 5);
  return true;
}
// an ally twice your strength may be offered overlordship: they become your vassal at a light tax
function overlordWhy(o, q) { const Q = G.P[q]; if (!Q.alive || G.rel[o][q] !== 'ally') return 'Only an ally.'; if (powerOf(soldiersOf(o)) < 2 * powerOf(soldiersOf(q))) return 'Needs twice their army.'; return null; }
function offerOverlord(o, q) { if (overlordWhy(o, q)) return false; makeVassal(q, o, 'light'); return true; }

// ── A lord's hand on a vassal: cut them loose, demand, force tribute, call up their soldiers (Assyria taxed at spear-point; Rome's client kings sent auxiliaries)
function breakTies(L, q) {
  const Q = G.P[q]; if (Q.lord !== L) return false;
  Q.lord = null; Q.rebel = null; for (const u of G.units) if (u.levy === q && u.owner === L) releaseLevy(u);
  for (const v of vassalsOf(L)) v.unrest = clamp((v.unrest || 0) + DEMAND.tributeUnrest, 0, 100);   // the others grow warier of you
  declareWar(L, q, L === 0 ? 'you cut them loose' : `${G.P[L].name} cut them loose`); return true;
}
const demandCost = Q => DEMAND.loyal * (1 + (Q.demands || []).filter(t => G.t - t < DEMAND.recent).length);
function demandWhy(L, q, r) { const Q = G.P[q]; if (Q.lord !== L || Q.rebel) return 'Not now.'; if (!(Q.res[r] > 0)) return `They have no ${LONG[r]}.`; return null; }
function demand(L, q, r) {
  if (demandWhy(L, q, r)) return false;
  const Q = G.P[q], x = Math.min(DEMAND.amt, Math.floor(Q.res[r])), cost = demandCost(Q);
  Q.res[r] -= x; G.P[L].res[r] += x; Q.loyal = Math.max(0, (Q.loyal || 0) - cost); (Q.demands = Q.demands || []).push(G.t);
  if (L === 0) say(`${Q.name} hand over ${x} ${LONG[r]}: loyalty −${cost}.`, '', 4); return true;
}
const menAt = (L, q) => { const k = keepOf(q); return k ? G.units.filter(u => u.owner === L && isSoldier(u) && dist(u, k) < VASSAL.r).length : 0; };
function tributeWhy(L, q) { const Q = G.P[q]; if (Q.lord !== L || Q.rebel) return 'Not now.'; if (Q.forced > G.t) return `Already forced: ${Math.ceil(Q.forced - G.t)} s.`; if (menAt(L, q) < DEMAND.tributeMen) return `Stand ${DEMAND.tributeMen} soldiers at their town first.`; return null; }
function forceTribute(L, q) {
  if (tributeWhy(L, q)) return false;
  const Q = G.P[q]; Q.forced = G.t + DEMAND.tribute; Q.unrest = clamp((Q.unrest || 0) + DEMAND.tributeUnrest, 0, 100);
  if (L === 0) say(`${Q.name} pay double for ${DEMAND.tribute / 60} minutes.`, '', 4); return true;
}
const levyOf = (L, q) => G.units.filter(u => u.owner === L && u.levy === q && u.hp > 0);
function levyWhy(L, q, n) { const Q = G.P[q], home = soldiersOf(q).filter(u => u.state === 'home'); if (Q.lord !== L || Q.rebel) return 'Not now.'; if (!home.length) return 'None at home.'; if (n > Math.ceil(soldiersOf(q).length * DEMAND.levyMax)) return 'Half at most.'; return null; }
function levy(L, q, n) {   // their soldiers march under your colours until released; their dead cost loyalty
  if (levyWhy(L, q, n)) return false;
  const home = soldiersOf(q).filter(u => u.state === 'home').slice(0, n), k = keepOf(L);
  for (const u of home) { u.owner = L; u.levy = q; u.state = 'goto'; u.px = k ? k.x : u.x; u.py = k ? k.y : u.y; u.idleT = 0; u.hb = undefined; u.bn = G.sel !== 'all' && L === 0 ? G.sel : undefined; }
  if (L === 0) { say(`${home.length} of ${G.P[q].name}' soldiers march to you.`, 'good', 5); march(home, k || home[0], 'your town'); }
  return true;
}
function releaseLevy(u) { const q = u.levy; u.levy = undefined; u.owner = q; u.state = 'home'; u.bn = undefined; u.ord = undefined; u.focus = null; u.tgt = null; }
function releaseAll(L, q) { const S = levyOf(L, q); S.forEach(releaseLevy); if (L === 0 && S.length) say(`${S.length} soldiers go home to ${G.P[q].name}.`, '', 4); return S.length > 0; }

// ───────────────────────── Combat you steer: charge, fall back, prisoners ─────────────────────────
const chargeWhy = (o, S, bn) => { const t = (G.chargeT || {})[o + ':' + (bn ?? 'all')]; if (!S.some(u => isSoldier(u) && !UNIT[u.kind].bonly)) return 'Nobody to charge.'; if (t > G.t) return `Winded: ${Math.ceil(t - G.t)} s.`; return null; };
function charge(o, S, bn) {   // a burst of speed and blows for a few seconds, then tired; once a half minute a battalion
  if (chargeWhy(o, S, bn)) return false;
  (G.chargeT = G.chargeT || {})[o + ':' + (bn ?? 'all')] = G.t + CHARGE.cd;
  for (const u of S) if (isSoldier(u) && !UNIT[u.kind].bonly) { u.chg = G.t + CHARGE.secs; u.mor = Math.min(1, u.mor + 0.1); }
  if (o === 0) { say(`${bn !== undefined ? BN[bn] : 'The army'} charge!`, 'good', 4); sfx('horn'); } return true;
}
function fallBack(o, S, bn) {   // withdraw in order toward home: fewer losses than a rout, and no rout while it lasts
  const h = homeOf(o); if (!h) return false; let n = 0;
  for (const u of S) { if (!isSoldier(u)) continue; const f = nearestFoe(o, u, 200), dx = f ? u.x - f.x : h.x - u.x, dy = f ? u.y - f.y : h.y - u.y, dd = hyp(dx, dy) || 1; u.fb = G.t + FALLBACK.secs; u.state = 'goto'; u.px = clamp(u.x + dx / dd * FALLBACK.back, 20, MAP - 20); u.py = clamp(u.y + dy / dd * FALLBACK.back, 20, MAP - 20); u.idleT = 0; u.tgt = null; u.focus = null; u.ord = undefined; n++; }
  if (o === 0 && n) say(`${bn !== undefined ? BN[bn] : 'The army'} fall back.`, '', 4); return n > 0;
}
// Prisoners: a runner touched by a foe, or a man netted by the Natives. The owner may ransom them back; unransomed, they serve the captor.
function takePrisoner(by, v) {
  const ransom = Math.round(Math.max(40, sumCost(UNIT[v.kind].cost || { f: 40 }) * PRISON.ransom));
  (G.prisoners = G.prisoners || []).push({ o: v.owner, by, kind: v.kind, t: G.t, ransom }); v.hp = 0; v.gone = true;
  if (v.owner === 0) say(`${by === WILD ? 'Netted' : G.P[by].name + ' took a prisoner'}: your ${UNIT[v.kind].name.toLowerCase()}. Ransom ${ransom}g.`, 'warn', 7, v);
  else if (by === 0) say(`A prisoner taken: their ${UNIT[v.kind].name.toLowerCase()}.`, 'good', 4, v);
}
const prisonersOf = o => (G.prisoners || []).filter(x => x.o === o);
function payRansom(o, i) {
  const x = prisonersOf(o)[i]; if (!x || G.P[o].res.g < x.ransom) return false;
  G.P[o].res.g -= x.ransom; if (x.by !== WILD && G.P[x.by]) G.P[x.by].res.g += x.ransom; G.prisoners.splice(G.prisoners.indexOf(x), 1);
  const k = keepOf(o); if (k) { const u = addUnit(o, x.kind, k.x + 40, k.y + 40); u.state = 'home'; }
  if (o === 0) say(`Ransom paid: your ${UNIT[x.kind].name.toLowerCase()} walks home.`, 'good', 5); return true;
}
// ── Teach: a soldier of an older kind learns a newer one at the School. It stands frozen for the lesson; tuition is paid up front.
const teachTo = u => { const k = TEACH_TO[baseKind(u.kind)]; return k && UNIT[k].age > UNIT[baseKind(u.kind)].age ? k : null; };
const teachGap = u => UNIT[teachTo(u)].age - UNIT[baseKind(u.kind)].age;
function teachCost(o, u) { const A = unitCost(o, baseKind(u.kind)), B = unitCost(o, teachTo(u)), c = {}; for (const r in B) if ((B[r] || 0) - (A[r] || 0) > 0) c[r] = B[r] - (A[r] || 0); c.g = (c.g || 0) + TEACH.tuition * teachGap(u); return c; }
const teachSecs = (o, u) => UNIT[teachTo(u)].t * TEACH.mul * teachGap(u) * fxv(o, 'teach').m;
const schooling = o => G.units.filter(v => v.owner === o && v.state === 'school' && v.hp > 0).length;
function teachWhy(o, u) {
  const p = G.P[o], to = teachTo(u); if (!to) return 'Nothing newer to learn.';
  if (u.state === 'school') return 'Already learning.';
  if (fxv(o, 'teach').a < 1) return 'Research Veterans at the Barracks.';
  if (UNIT[to].age > p.age) return `Needs the ${AGES[UNIT[to].age].name} age.`;
  const S = ready(o, 'school'); if (!S.length) return 'Needs a School.';
  if (schooling(o) >= TEACH.seats * S.length) return 'The School is full.';
  if (!afford(p, teachCost(o, u))) return `Not enough: ${costText(teachCost(o, u))}.`;
  return null;
}
function teach(o, u) { if (teachWhy(o, u)) return false; pay(G.P[o], teachCost(o, u)); u.state = 'school'; u.schoolT = G.t + teachSecs(o, u); u.tgt = null; u.fb = 0; u.chg = 0; return true; }
function graduate(u) { const o = u.owner, to = civKind(o, teachTo(u)), f = u.hp / u.max; u.kind = to; u.max = maxHpU(o, to); u.hp = Math.max(1, u.max * f); u.state = 'home'; u.schoolT = 0; if (o === 0) say(`Taught: a ${stats(0, to).name.toLowerCase()} joins the ranks.`, 'good', 4, u); }
function prisonersTick() {   // every five seconds: the unransomed change sides
  for (const x of (G.prisoners || []).slice()) if (G.t - x.t > PRISON.secs) {
    G.prisoners.splice(G.prisoners.indexOf(x), 1); const T = throneB(), k = x.by === WILD ? T : keepOf(x.by);
    if (x.by === WILD) { if (T) natSpawn(T, 'native'); } else if (k && G.P[x.by].alive) { const u = addUnit(x.by, x.kind, k.x + 30, k.y + 30); u.state = 'home'; }
    if (x.o === 0) say(`Unransomed: your ${UNIT[x.kind].name.toLowerCase()} serves ${x.by === WILD ? 'the Natives' : G.P[x.by].name} now.`, 'warn', 6);
  }
}
// ───────────────────────── Trade, zeal, spies, hiring ─────────────────────────
// The Market, one rule for everything it trades: resources by the 100, goods by the 10; it pays 80% of worth (90% with Coinage)
// and charges 125%, both moved by the going price. A trade stop pays full worth and more, which is why caravans go there.
const LOT = k => TRADE[k] ? 100 : 10;
const worth = k => TRADE[k] ? TRADE[k] / 100 : GOODS[k].buy || GOODS[k].base;   // spice is worth what it costs at a stop
const coinOf = o => G.P[o].debased ? MINT.price : 1;   // debased coin: dearer to buy, less for what you sell
const sellPrice = (o, k) => Math.floor(LOT(k) * worth(k) * (SELL + fxv(o, 'sell').a) * mkt(k) / coinOf(o));
const buyPrice = (o, k) => Math.ceil(LOT(k) * worth(k) * BUY * mkt(k) * coinOf(o));
const haveOf = (p, k) => TRADE[k] ? p.res[k] : p.goods[k] || 0;
function marketTrade(o, k, dir) {
  const p = G.P[o], n = LOT(k); if (!ready(o, 'market').length) return false;
  if (dir === 'sell') { if (!MKT_SELL.includes(k) || haveOf(p, k) < n) return false; const v = sellPrice(o, k); if (TRADE[k]) p.res[k] -= n; else p.goods[k] -= n; p.res.g += v; if (!TRADE[k]) p.gathered += v; mktHit(k, TRADE[k] ? 25 : n, -1); }
  else { if (!MKT_BUY.includes(k)) return false; const c = buyPrice(o, k); if (p.res.g < c) return false; p.res.g -= c; if (TRADE[k]) p.res[k] += n; else p.goods[k] = (p.goods[k] || 0) + n; mktHit(k, TRADE[k] ? 25 : n, 1); }
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
  for (const u of list) if (isSoldier(u)) u.zeal = G.t + ZEAL.secs + fxv(o, 'zealsecs').a;
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
function setJob(u, job, n) { if (u.node && u.node.farm) u.node.wk = Math.max(0, (u.node.wk || 0) - 1); u.job = job; u.node = n || null; if (job) u.post = null; if (n && n.farm) n.wk = (n.wk || 0) + 1; if (job !== 'repair') u.rep = null; }
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
    if (!O.arrived && (hyp(O.cx - O.x, O.cy - O.y) < 90 || S.every(u => u.state === 'goto' && u.idleT > 1))) { O.arrived = true; say(`${S.length} arrived: ${O.label}.`, 'good', 4, O); }   // there, or every one has stopped: a straggler cannot hold the rest on the order
    if (!O.arrived) { let spd = 1e9; for (const u of S) spd = Math.min(spd, stats(0, u.kind).spd); O.eta = Math.round(hyp(O.cx - O.x, O.cy - O.y) / Math.max(1, spd)); }
  }
  for (const u of G.units) if (u.ord && (!G.ords[u.ord] || u.state === 'home')) u.ord = undefined;   // called home: no longer on that order
}
