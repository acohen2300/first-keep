// ═════ 08-ai.js ═════
// ───────────────────────── The computer brain: one brain, three personalities, the same rules as you ─────────────────────────
// Nobody has fog: everyone sees the whole map, so the computers' estimates are the real numbers, as yours are.
const estPower = (o, of) => powerOf(soldiersOf(of)) + bldsOf(of, 'tower').length * 120 + 250;
const nearestType = (type, from, kind) => nearest(G.nodes, from, n => n.type === type && n.amt > 0 && n.kind !== 'farm' && (!kind || n.kind === kind));
// the soldier that best answers what the enemies field, among those this side can train now
function bestCounter(o) {
  const foes = G.sol.filter(v => atWar(o, v.owner) && v.owner !== WILD), p = G.P[o];
  const can = SOLDIERK.filter(k => !UNIT[k].civ && !UNIT[k].bonly && UNIT[k].tick === 'sol' && !hasTag(k, 'siege') && UNIT[civKind(o, k)].age <= p.age && ready(o, UNIT[k].at).length);
  if (!can.length) return null;
  if (!foes.length) return can[p.ai.cyc++ % can.length];
  const sc = can.map(k => { const me = { owner: o, kind: civKind(o, k) }; let s = 0; for (const v of foes) s += vsMul(me, v) / Math.max(0.5, vsMul(v, me)); return [k, s / foes.length / (sumCost(UNIT[k].cost) / 100) ** 0.3]; });
  sc.sort((a, b) => b[1] - a[1]);
  return sc[(p.ai.cyc++ % Math.min(2, sc.length))][0];   // the best, mixed with the next best so an army is never one kind
}
function think(p) {
  const o = p.id, per = PERS[p.pers], k = keepOf(o); if (!k) return;
  const R = p.res, vils = unitsOf(o, 'vil'), nV = vils.length + queuedOf(o, 'vil'), building = kind => bldsOf(o, kind).some(b => b.prog < 1);
  const has = kind => bldsOf(o, kind).length, armyN = soldiersOf(o).length, jobsN = j => vils.filter(v => v.job === j).length;
  const put = (kind, x, y, r0, r1) => { const s = findSpot(o, kind, x, y, r0, r1); return s ? build(o, kind, s.x, s.y) : null; };
  // a site nobody is working (its builder died or was scared off) gets the nearest free villager
  if (G.tick % 90 === o) for (const b of G.blds) if (b.owner === o && b.hp > 0 && b.prog < 1 && !vils.some(v => v.rep === b && v.job === 'repair')) autoBuilder(o, b);
  // shelter before it is needed
  if (!building('house') && !building('apartment') && popOf(o) + queuedOf(o) >= capOf(o) - 2 && capOf(o) < POPMAX) put(p.age >= 2 && R.s >= 60 && R.w >= 120 ? 'apartment' : 'house', k.x, k.y, 60, 190);
  // drop-offs where the work is
  for (const [type, kind] of [['food', 'mill'], ['wood', 'lumber'], ['gold', 'mining'], ['stone', 'mining'], ['iron', 'mining']]) {
    if (jobsN(type) < 2 || building(kind)) continue;
    const n = nearestType(type, k); if (!n) continue;
    const d = dropFor(o, type, n); if (d && dist(d, n) < 110) continue;
    put(kind, n.x, n.y, 30, 70);
  }
  // food from the ground once the berries near home are gone; wood from tree farms once the forest thins
  const bushes = G.nodes.filter(n => n.kind === 'bush' && dist(n, k) < 300).length, farms = has('farm');
  if ((bushes < 3 || jobsN('food') > bushes + 4) && farms < Math.min(12, Math.ceil((jobsN('food') + 1) / 3)) && R.w >= 60) put('farm', k.x, k.y, 60, 170);   // fields take three each
  const trees = G.nodes.filter(n => n.kind === 'tree' && dist(n, k) < 300).length;
  if (trees < 6 && has('treefarm') < Math.min(4, Math.max(1, jobsN('wood') - 2)) && R.w >= 80) put('treefarm', k.x, k.y, 60, 170);
  if (farms >= 3 && !has('mill')) put('mill', k.x, k.y, 90, 170);
  // the ages: once the town is big enough, save for the next one
  const ageReady = p.age < per.ageTo && !p.aging && vils.length >= Math.min(per.vils, 12 + p.age * 4) && armyN >= per.ageArmy;
  if (ageReady) ageUp(o);
  // saving for the age stops other spending, but never for long: after 90 s of saving without getting there it spends again for a minute
  if (ageReady && !p.aging) { if (p.ai.saveT === undefined) p.ai.saveT = G.t; } else p.ai.saveT = undefined;
  const threat = G.threats.some(v => atWar(o, v.owner) && v.owner !== WILD && dist(v, k) < 400);
  const saving = ageReady && !p.aging && !threat && !(p.ai.saveT !== undefined && (G.t - p.ai.saveT) % 150 > 90), need = saving ? AGES[p.age + 1].cost : {};
  if (nV < per.vils && k.q.length < 2 && (!saving || R.f >= (need.f || 0) + 50)) train(o, 'vil');
  if (!unitsOf(o, 'scout').length && G.t > 60 && R.f > 200 && !queuedOf(o, 'scout')) train(o, 'scout');
  // what to build, in this personality's order
  for (const [kind, age, n, army, stock] of per.build) if (p.age >= age && has(kind) < n && armyN >= army && (!stock || afford(p, stock)) && (!saving || kind === 'barracks')) { if (put(kind, k.x, k.y, 90, 210)) break; }
  if (per.extraBarracks && ready(o, 'barracks').length && has('barracks') < 1 + per.extraBarracks && R.w > 250) put('barracks', k.x, k.y, 90, 220);
  // army room: when the army fills it, raise another place to train, the kind it has fewest of
  if (!saving && clsCount(o, 'army') >= armyRoom(o) - 2 && armyRoom(o) < armyCap(p) && R.w >= 250) { const kind = ['barracks', 'range', 'stable'].filter(x => p.age >= BLD[x].age && !building(x) && !atCap(o, x)).sort((a, b) => has(a) - has(b))[0]; if (kind) put(kind, k.x, k.y, 90, 220); }
  if (per.towers > has('tower') && p.age >= 1 && R.s >= 120) { const t = towardMid(k, 140); put('tower', t.x, t.y, 0, 90); }
  if (per.walls && p.age >= 1 && R.s >= 60) {
    const plan = p.ai.wallPlan || (p.ai.wallPlan = wallPlan(k)); let nb = 0;
    for (const c of plan) { if (nb >= 3 || p.res.s < 40) break; if (NAV.occ[c.gy * NC + c.gx]) continue; if (build(o, c.kind, c.gx * NAVC + 5, c.gy * NAVC + 5)) nb++; }
  }
  if (per.wonder && p.age >= 2 && !has('wonder') && !G.wonder && afford(p, addRes({ f: 300, w: 300, s: 300, g: 300 }, BLD.wonder.cost)) && armyN >= 12) put('wonder', k.x, k.y, 120, 260);
  // faith and care
  if (ready(o, 'temple').length) {
    if (armyN >= 8 && unitsOf(o, 'priest').length + queuedOf(o, 'priest') < (per.shrine ? 3 : 1)) train(o, 'priest');
    if (!(p.zealT > G.t) && R.g >= 100) { const eng = soldiersOf(o).filter(u => u.tgt && u.tgt.hp > 0 && !(u.zeal > G.t)); if (eng.length >= 8) zeal(o, eng.slice(0, BNSIZE)); }
    if (per.shrine && (G.rel[o][WILD] !== 'war' || (G.throne && G.throne.owner === o))) { const pr = unitsOf(o, 'priest').find(u => u.state !== 'shrine'); const f = pr && nearest(G.finds, k, f => FINDS[f.kind].capture && f.owner !== o && !G.units.some(v => v.kind === 'priest' && v.owner === o && v.fid === f.id)); if (f) { pr.state = 'shrine'; pr.fid = f.id; } }
  }
  if (ready(o, 'hospital').length && armyN >= 10 && unitsOf(o, 'medic').length + queuedOf(o, 'medic') < 2) train(o, 'medic');
  // siege, to break what soldiers cannot
  if (per.siege && ready(o, 'siege').length) {
    const sg = soldiersOf(o).filter(u => hasTag(u.kind, 'siege')).length + ['ram', 'catapult', 'stower', 'ballista', 'treb', 'bombard'].reduce((n, x) => n + queuedOf(o, x), 0);
    if (sg < per.siege + Math.floor(armyN / 12)) train(o, p.age >= 4 && sg % 3 === 2 ? 'bombard' : p.age >= 3 && sg % 3 === 2 ? 'treb' : ['ram', 'catapult', 'stower', 'ballista'][sg % 4]);
  }
  // trade: a couple of caravans once there is somewhere to take them (an ally, or goods for the stops); swap a big surplus for gold
  if (per.trade && p.age >= 1 && armyN >= 6) {
    const m = ready(o, 'market')[0];
    if (m && unitsOf(o, 'caravan').length + queuedOf(o, 'caravan') < 3 && R.w >= 150 && R.g >= 100) train(o, 'caravan');
    if (ready(o, 'market').length) for (const r of ['f', 'w', 's', 'i']) if (R[r] > 1200 && R.g < 150) { marketTrade(o, r, 'sell'); break; }
  }
  aiEconomy(p, k, R, put, has);
  if (per.spy && ready(o, 'courthouse').length && unitsOf(o, 'spy').length + queuedOf(o, 'spy') < 1 && R.g >= 150 && R.f >= 60) train(o, 'spy');
  if (!saving) { let did = false; for (const id of p.civ ? [...per.techs, 'elite_' + p.civ] : per.techs) if (research(o, id)) { did = true; break; }   // their own elite rank last
    if (!did && G.tick % 300 === o * 7) for (const t of TECH) if ((!t.civ || t.civ === p.civ) && isNext(o, t) && research(o, t.id)) break; }   // then whatever line is open: the tree is deep now
  // the army: the counter to what the enemies field; with Muster and gold to spare, eight at once from the War Council
  if (!saving && p.techs.has('muster') && armyN + queuedOf(o) - queuedOf(o, 'vil') + 8 <= armyCap(p)) { const want = bestCounter(o); if (want) muster(o, { [civKind(o, want)]: 8 }); }
  if (!saving && armyN + queuedOf(o) - queuedOf(o, 'vil') < armyCap(p) && vils.length >= Math.min(per.vils, per.early)) { const want = bestCounter(o); if (want) train(o, want); }
  // jobs: move one villager a beat toward the personality's mix
  const mix = { ...per.mix }; if (p.age === 0) { mix.food += mix.stone * 0.5 + mix.gold * 0.3; mix.wood += mix.stone * 0.5 + mix.gold * 0.2; mix.stone = 0; mix.gold *= 0.5; }
  if (p.age < 2) { mix.wood += mix.iron; mix.iron = 0; }   // iron is wanted from the Classical age
  if (per.wonder && p.age >= 2) for (const r of RES) mix[r] += 0.1;
  mix.food += (p.eats || 0) / 30 / Math.max(1, vils.length);   // enough hands on food to feed everyone (one feeds about 8)
  { const sn = season().name, keep = (p.eats || 0) * (sn === 'Autumn' || sn === 'Winter' ? 4 : 2); if (p.hungry || R.f < keep) mix.food += 0.3; }   // fields barely grow in winter: lay in food for it, as farmers did   // hungry, or food for less than two minutes: more on food
  for (const r of RES) { const have = R[KEY[r]]; if (have > 600) mix[r] *= 0.4; else if (have < 100 && mix[r] > 0) mix[r] *= 1.6; }
  const tot = RES.reduce((s, r) => s + mix[r], 0) || 1; for (const r of RES) mix[r] /= tot;
  const idle = vils.find(v => !v.job), short = RES.map(r => [r, mix[r] * vils.length - jobsN(r)]).sort((a, b) => b[1] - a[1]);
  if (idle) idle.job = short[0][0];
  else if (short[0][1] >= 1) { const over = short[short.length - 1][0], v = vils.find(x => x.job === over && x.carry < 3); if (v) setJob(v, short[0][0]); }
  // finds: a detachment clears the nearest guarded one when nothing else is going on; it hires vagabonds it walks past
  if (per.loot && armyN >= 10 && !p.wave) lootRun(p);
  throneRun(p, per);
  for (const f of G.finds) if (FINDS[f.kind].hire && !f.done && R.g >= 200) hire(o, f);
  // war: attack only when the odds beat this personality's nerve; a rival's wonder is attacked at once
  if (per.bold < 2) decideWar(p, per);
  if (per.diplo) aiDiplomacy(p, per);
  allyDuty(p);
}
// A computer's relations move by its odds, the way a court's did: losing badly, it asks for peace; at peace with nobody to fight and the odds in its favour, it gives notice
function aiDiplomacy(p, per) {
  const o = p.id; if (p.age < 1 || p.envoyOut || G.t - p.envoyAt < 180) return;
  const warOn = G.P.some(r => r.alive && r.id !== WILD && r.id !== o && atWar(o, r.id) && !(r.lord === o));
  for (const q of G.P) {
    if (!q.alive || q.id === o || q.id === WILD || q.lord === o || p.lord === q.id) continue;
    if (atWar(o, q.id) && oddsOf(o, q.id) < 0.3 && soldiersOf(o).length < per.waveMin) { if (setRel(o, q.id, 'peace')) return; }
    if (!warOn && G.rel[o][q.id] === 'peace' && !noticeLeft(o, q.id) && oddsOf(o, q.id) > per.bold + 0.15) { if (setRel(o, q.id, 'war')) return; }
    if (p.ally === null && q.ally === null && G.rel[o][q.id] === 'peace' && warOn && G.t > 600) { if (setRel(o, q.id, 'ally')) return; }   // at war with someone: court a friend
  }
  if (G.throne && G.throne.owner !== o && G.throne.owner !== WILD && G.rel[o][G.throne.owner] !== 'war' && !noticeLeft(o, G.throne.owner) && G.P[G.throne.owner].lord !== o && p.lord !== G.throne.owner) setRel(o, G.throne.owner, 'war');   // whoever takes the Throne finds every court against them
}
// an ally defends a friend's town under attack, never at the cost of its own
function allyDuty(p) {
  const o = p.id; if (p.ally === null || G.t - p.ai.lastHelp < 30) return;
  const ak = keepOf(p.ally), mk = keepOf(o), near = (k, side) => k && G.units.some(u => atWar(side, u.owner) && u.owner !== WILD && isSoldier(u) && dist(u, k) < 320);
  if (ak && mk && !near(mk, o) && near(ak, p.ally)) { p.ai.lastHelp = G.t; sendHelp(o, ak, p.ally === 0); }
}
// the army a side keeps grows with its age
const armyCap = p => Math.min(ARMYMAX, PERS[p.pers].armyCap + 10 * p.age);
function lootRun(p) {
  const o = p.id, k = keepOf(o), out = soldiersOf(o).filter(u => u.state === 'goto' && u.loot);
  if (out.length) { const f = G.finds.find(f => f.id === out[0].loot); if (!f || f.done || (!guardsLeft(f) && G.t - out[0].lootT > 30)) out.forEach(u => { u.state = 'home'; u.loot = null; }); return; }
  const f = nearest(G.finds, k, f => !f.done && (FINDS[f.kind].got || FINDS[f.kind].hire || (FINDS[f.kind].stop && guardsLeft(f) && p.age >= 1)) && dist(f, k) < (FINDS[f.kind].stop ? 1000 : 800));
  if (!f) return;
  const home = soldiersOf(o).filter(u => u.state === 'home' && !UNIT[u.kind].bonly), go = home.slice(0, Math.min(10, Math.ceil(home.length * 0.5)));
  if (go.length < 5) return;
  go.forEach(u => { u.state = 'goto'; u.px = f.x; u.py = f.y; u.loot = f.id; u.lootT = G.t; u.idleT = 0; });
}
// the Throne: from the Medieval age a side with siege and a big army marches on the citadel, or walks in as the Natives' ally
function throneRun(p, per) {
  const o = p.id, T = G.blds.find(b => b.kind === 'throne' && b.hp > 0); if (!T || p.wave || p.age < 3 || (G.throne && G.throne.owner === o)) return;
  const home = soldiersOf(o).filter(u => u.state === 'home'), sg = home.filter(u => hasTag(u.kind, 'siege')).length;
  const holder = G.throne ? G.throne.owner : WILD, odds = powerOf(home) / (powerOf(soldiersOf(holder).filter(u => dist(u, T) < 300)) + 800);
  if (home.length < 20 || (holder === WILD && sg < 2 && G.rel[o][WILD] !== 'ally') || odds < 1.2 || (holder !== WILD && !atWar(o, holder))) return;
  home.forEach(u => { u.state = 'attack'; u.target = holder; u.bid = T.id; }); p.wave = { n: home.length, t: G.t };
  say(`${p.name} march on the Throne.`, 'warn', 8, T);
}
function wallPlan(k) { // an arc 190 out from the keep, facing the middle of the map; the two squares nearest the middle are the gate
  const base = Math.atan2(MID - k.y, MID - k.x), cells = [], seen = new Set(); let pc = null;
  const add = (gx, gy) => { const key = gy * NC + gx; if (seen.has(key)) return; seen.add(key); const a = Math.atan2(gy * NAVC + 5 - k.y, gx * NAVC + 5 - k.x); cells.push({ gx, gy, kind: 'wall', da: Math.abs(Math.atan2(Math.sin(a - base), Math.cos(a - base))) }); };
  for (let i = -66; i <= 66; i++) {
    const a = base + i * 0.019, gx = Math.floor((k.x + Math.cos(a) * 190) / NAVC), gy = Math.floor((k.y + Math.sin(a) * 190) / NAVC);
    if (pc && gx !== pc.gx && gy !== pc.gy) add(gx, pc.gy);   // four-connected: no gap to slip through
    add(gx, gy); pc = { gx, gy };
  }
  cells.slice().sort((a, b) => a.da - b.da).slice(0, 2).forEach(c => c.kind = 'gate');
  return cells.filter(c => c.kind === 'gate').concat(cells.filter(c => c.kind !== 'gate'));   // the gate first, so the ring never closes without one
}
// how the two armies' units fare against each other: spearmen against horse, archers against spearmen
function matchup(A, B) {
  const a = A.slice(0, 10), b = B.slice(0, 10); if (!a.length || !b.length) return 1;
  let x = 0, y = 0; for (const u of a) for (const v of b) { x += vsMul(u, v); y += vsMul(v, u); }
  return clamp(x / y, 0.6, 1.6);
}
function decideWar(p, per) {
  const o = p.id, home = soldiersOf(o).filter(u => u.state === 'home' && !UNIT[u.kind].heal), out = soldiersOf(o).filter(u => u.state === 'attack');
  if (p.wave) {
    const hit = out.some(u => G.t - (u.hitT || -99) < 30);
    if (!p.wave.charged && out.some(u => u.tgt && !u.tgt.q)) { p.wave.charged = true; charge(o, out); }   // on contact, once a wave
    if (out.length < p.wave.n * 0.35 || (!hit && G.t - p.wave.t > 45)) { out.forEach(u => u.state = 'home'); p.wave = null; }   // beaten, or stalled: go home
    return;
  }
  const W = G.wonder && G.wonder.owner !== o && atWar(o, G.wonder.owner) ? G.wonder : null;
  if (home.length < (W ? 4 : per.waveMin + (G.diff === 'easy' ? 3 : 0))) return;
  const sn = season().name, toWinter = sn === 'Autumn' && SEASON_LEN - G.t % SEASON_LEN < HARD.waitForWinter;
  if (hz('hard') && toWinter && !W) return;   // hard: winter is a month away; they wait for it, as raiders did
  const bold = per.bold + (hz('hard') ? HARD.bold + (sn === 'Winter' ? HARD.winterBold : 0) : 0);
  const go = home.slice(Math.floor(home.length * (W ? 0 : per.guard))), mine = powerOf(go);
  let best = null, bp = 0;
  for (const q of G.P) if (q.alive && q.id !== WILD && atWar(o, q.id)) {
    if (q.id === 0 && G.diff === 'easy' && G.t < EASY_SAFE && !W) continue;   // Easy: nobody comes for you in the first six minutes
    const r = mine / estPower(o, q.id) * matchup(go, soldiersOf(q.id)), prob = r * r / (1 + r * r);   // the square law, as odds, bent by who counters whom
    const busy = per.opportunist && G.P.some(x => x.alive && x.id !== WILD && x.id !== o && x.id !== q.id && atWar(q.id, x.id));   // the opportunist: a side with another war on its hands
    const T = G.throne && G.throne.owner === q.id;
    const pr = (W && W.owner === q.id) || T ? Math.max(prob, 0.75) : prob * (busy ? per.opportunist : 1);
    if (pr > bp) { bp = pr; best = q.id; }
  }
  // a full army that sits at home is wasted: at its limit a side settles for even odds
  const full = soldiersOf(o).length >= armyCap(p) - 2;
  if (best !== null && bp > (full ? Math.min(bold, 0.4) : bold)) {
    const TB = G.throne && G.throne.owner === best && G.blds.find(b => b.kind === 'throne' && b.hp > 0);
    go.forEach(u => { u.state = 'attack'; u.target = best; u.bid = W && W.owner === best ? W.id : TB ? TB.id : null; u.loot = null; });
    p.wave = { n: go.length, t: G.t };
    if (per.raid) {   // a few riders go for the foe's lumber camps and mines instead of the Town Center: it draws the defence apart
      const fast = go.filter(u => (UNIT[u.kind].tags || []).includes('mounted')).slice(0, per.raid + (hz('hard') ? HARD.raid : 0)), k = keepOf(o);
      const mark = k && nearest(G.blds, k, b => b.owner === best && b.prog >= 1 && b.hp > 0 && b.kind !== 'keep' && BLD[b.kind].drop);
      if (mark) fast.forEach(u => { u.bid = mark.id; });
    }
    if (best === 0) say(`${p.name} march on you with ${go.length} soldiers.`, 'warn', 8, go[0]);
  }
}

