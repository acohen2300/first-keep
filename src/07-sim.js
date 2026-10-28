// ═════ 07-sim.js ═════
// ───────────────────────── The simulation ─────────────────────────
const isThreat = v => { const U = UNIT[v.kind]; return !v.inside && v.hp > 0 && (U.tick === 'sol' ? !U.bonly : U.tick === 'wild' && U.dmg && !U.flee && !U.passive); };
// once a second, and at once after a load: finds with live guards (villagers keep away from work beside them), and how many work each find (so workers spread out)
function recount() { G.guarded = G.finds.filter(f => !f.done && guardsLeft(f)); dangerMap(); for (const n of G.nodes) n.wk = 0; for (const u of G.units) if (u.node && u.kind === 'vil') u.node.wk++; }
function step(dt) {
  if (G.over) return;
  G.t += dt; G.tick++; G.night = nightness();
  G.threats = []; for (const v of G.units) if ((v.thr = isThreat(v))) G.threats.push(v);
  buildGrid();
  if (G.navDirty) navRebuild();
  NAV.budget = 4;
  const sp = season().spd, wsp = WEATHER[G.wx].spd || 1, SP = o => (1 - (1 - sp) * (o === WILD ? 1 : fxv(o, 'mud').m)) * wsp;
  const SPS = [SP(0), SP(1), SP(2), SP(3), SP(4)];
  for (const b of G.blds) if (b.hp > 0) bldTick(b, dt);
  econTick(dt);
  if (G.tick % 3 === 0) formUp();
  if (G.tick % 30 === 1) { recount(); ordersTick(); }
  for (const u of G.units) if (u.hp > 0) TICK[UNIT[u.kind].tick](u, dt, SPS[u.owner]);
  healTick(dt);
  collide();
  if (G.tick % 15 === 0) findsTick(0.5);
  wayfarers(dt);
  // the dead and the spent
  for (const u of G.units) if (u.hp <= 0) died(u);
  for (const u of G.units) if (u.hp <= 0 && !u.gone && !u.inside) scarFall(u);
  { let gone = false; for (const u of G.units) if (u.hp <= 0) { gone = true; break; } if (gone) G.units = G.units.filter(u => u.hp > 0); } G.ugTick = -1;
  let fxChange = false;
  for (const b of G.blds) if (b.node && b.node.amt <= 0 && b.hp > 0 && BLD[b.kind].reserve > 0) { b.hp = 0; if (b.owner === 0) say('A tree farm is cut out. Plant another.', '', 5); }   // a coppice plot, spent
  for (const b of G.blds) if (b.hp <= 0) { if (!b.gone && b.prog >= 1 && !BLD[b.kind].wallish) scarBurn(b); if (b.node) b.node.amt = 0; if (b.by !== undefined) plunderBld(b); if (BLD[b.kind].fx) fxChange = true; if (G.wonder && G.wonder.id === b.id) { say(`${G.P[b.owner].name === 'You' ? 'Your' : G.P[b.owner].name + '\'s'} wonder has fallen.`, b.owner === 0 ? 'warn' : 'good', 7); G.wonder = null; } }
  if (fxChange) fxDirty();
  if (G.lootT && G.t - G.lootT > 1.5) { say(`Plunder: ${costText(G.loot)}.`, 'good', 6); G.loot = {}; G.lootT = 0; }
  { let gone = false; for (const b of G.blds) if (b.hp <= 0) { gone = true; break; } if (gone) { G.blds = G.blds.filter(b => b.hp > 0); G.navDirty = true; qcDrop(); } }
  { let spent = false; for (const n of G.nodes) if (!(n.amt > 0 || (n.farm && n.farm.hp > 0))) { spent = true; break; } if (spent) { G.nodes = G.nodes.filter(n => n.amt > 0 || (n.farm && n.farm.hp > 0)); G.navDirty = true; } }   // a tree felled opens its ground the same step (held longer, cutters beside it stall); the list is copied only when something is spent
  for (const tr of G.tracers) tr.life -= dt;
  if (G.tracers.length && G.tracers[G.tracers.length - 1].life <= 0 || G.tracers.some(tr => tr.life <= 0)) G.tracers = G.tracers.filter(tr => tr.life > 0);
  for (const p of G.P) if (p.id && p.id !== WILD && p.alive) { p.ai.t -= dt; if (p.ai.t <= 0) { p.ai.t = react(); think(p); } }
  fortressDuties(dt);
  for (const p of G.P) if (p.alive && p.id !== WILD && !keepOf(p.id)) fall(p);
  if (G.tick % 30 === 0) { scoreAll(); rebattalion(); }
  watchHome();
  judge();
}
// An army stands in a grid: soldiers of one side that wait at home, or are going to the same spot, form rows, battalion beside battalion.
function formUp() {
  const grp = new Map();
  for (const u of G.units) {
    if (u.hp <= 0 || u.inside || UNIT[u.kind].tick !== 'sol' || (u.state !== 'home' && u.state !== 'goto' && u.state !== 'assist')) continue;
    const key = u.state === 'home' ? u.owner + 'h' : u.owner + 'g' + Math.round(u.px / 50) + ',' + Math.round(u.py / 50);
    const a = grp.get(key); if (a) a.push(u); else grp.set(key, [u]);
  }
  for (const [key, a] of grp) {
    a.sort((p, q) => (p.bn ?? 9) - (q.bn ?? 9) || p.id - q.id);
    const n = a.length, k = keepOf(a[0].owner), home = key.endsWith('h'), shape = home ? 'line' : FORM[formOf(a[0])].shape;   // marching, a battalion takes its formation's shape: narrow column, point-first wedge, closed square
    const cols = shape === 'column' ? Math.min(n, 3) : shape === 'square' ? Math.ceil(Math.sqrt(n)) : clamp(Math.round(Math.sqrt(n * GRID.rows)), 1, 14), wr = i => Math.floor((Math.sqrt(8 * i + 1) - 1) / 2), rows = shape === 'wedge' ? wr(n - 1) + 1 : Math.ceil(n / cols);
    // the line faces the way they look: out from the keep toward the middle at home, along the march when sent; the front rank is outermost, the rest stand behind it, and a unit standing at its place faces the same way
    const t = home ? (k ? towardMid(k, 90) : { x: 0, y: 1 }) : { x: a[0].px, y: a[0].py }, fx0 = k ? t.x - k.x : 0, fy0 = k ? t.y - k.y : 1, fl = hyp(fx0, fy0) || 1, fx = fx0 / fl, fy = fy0 / fl;
    for (let i = 0; i < n; i++) { const ri = shape === 'wedge' ? wr(i) : Math.floor(i / cols), c = (shape === 'wedge' ? i - ri * (ri + 1) / 2 - ri / 2 : (i % cols) - (cols - 1) / 2) * GRID.gap, r = (home ? rows - 1 - ri : -ri) * GRID.gap;   // at home the last rank stands at the usual place and the first stands furthest out; marching, ranks trail behind
     a[i].gx = -fy * c + fx * r; a[i].gy = fx * c + fy * r; if (!a[i].tgt && G.t - (a[i].mvT || -9) > 0.3) { a[i].fx = fx; a[i].fy = fy; } }
    if (!home) { let slow = 1e9; for (const u of a) if (!hasTag(u.kind, 'siege')) slow = Math.min(slow, stats(u.owner, u.kind).spd); for (const u of a) u.cap = u.tgt || slow === 1e9 || hasTag(u.kind, 'siege') ? 0 : slow; }   // a marching group keeps together at its slowest; engaged units run free; siege trails at its own pace
  }
  const atk = new Map();   // an attack goes at the pace of its battalion until a foe is in sight
  for (const u of G.units) if (u.hp > 0 && !u.inside && u.state === 'attack' && isSoldier(u)) { if (hasTag(u.kind, 'siege')) continue; const key = u.owner + ':' + (u.bn ?? 9) + ':' + (u.bid || 0); const s = stats(u.owner, u.kind).spd; atk.set(key, Math.min(atk.get(key) ?? 1e9, s)); }   // raiders sent at a camp make their own group
  for (const u of G.units) if (u.hp > 0 && isSoldier(u)) { if (u.state === 'attack') u.cap = u.tgt || hasTag(u.kind, 'siege') ? 0 : atk.get(u.owner + ':' + (u.bn ?? 9) + ':' + (u.bid || 0)) || 0; else if (u.state !== 'goto' && u.state !== 'assist') u.cap = 0; }
}
const react = () => REACT[G.diff] || 1;   // seconds between computer decisions: human-like, no cheats
function died(u) {
  if (u.node && u.node.farm) u.node.wk = Math.max(0, (u.node.wk || 0) - 1);
  if (u.kind === 'envoy') G.P[u.owner].envoyOut = false;
  if (u.kind === 'caravan' && u.by === WILD) robbed(u);
  else if (u.kind === 'caravan' && u.by !== undefined && u.by !== WILD) { if (u.cargo > 0) plunder(u.by, { g: u.cargo }); for (const k in u.goods || {}) G.P[u.by].goods[k] += u.goods[k]; }
  const U = UNIT[u.kind];
  if (U.meat && !u.gone) {   // game falls where it stands; the hunter butchers it there
    const m = node('meat', 'food', u.x, u.y, U.meat * RICH); G.nodes.push(m);
    for (const v of G.units) if (v.hunt === u) { v.hunt = null; v.node = m; }
  }
  if (u.owner === 0 && isSoldier(u) && !u.gone) G.lost = (G.lost || 0) + 1;
  if (u.by !== undefined && isSoldier(u)) for (const p of G.P) if (p.lord === u.by && !p.rebel && atWar(p.id, u.owner)) { const k = keepOf(p.id); if (k && dist(u, k) < VASSAL.r) p.protect = Math.min(VASSAL.protectMax, (p.protect || 0) + VASSAL.kill); }   // the lord who kills their enemies near them earns their thanks
}
function judge() {
  if (G.over) return;
  if (!G.P[0].alive) { finish(false, `Your keep fell. You held out ${clock(G.t)}.`); return; }
  if (G.free) return;   // free play: nothing to win; only your own fall ends it
  if (!G.P[1].alive && !G.P[2].alive) { finish(true, `Raiders and Rivals have fallen. ${clock(G.t)}`); return; }
  { const ruled = i => !G.P[i].alive || (G.P[i].lord === 0 && !G.P[i].rebel);   // or rule them as vassals for five minutes
    if (ruled(1) && ruled(2)) { G.reignT = G.reignT ?? G.t; if (G.t - G.reignT >= VASSAL.reign) { finish(true, `You have ruled the Raiders and the Rivals for ${VASSAL.reign / 60} minutes. ${clock(G.t)}`); return; } } else G.reignT = null; }
  if (G.wonder && G.t >= G.wonder.end) { const o = G.wonder.owner; finish(o === 0, o === 0 ? `Your ${civOf(0).wonder} stood for ${WONDER_HOLD / 60} minutes.` : `${G.P[o].name}' ${civOf(o).wonder} stood for ${WONDER_HOLD / 60} minutes.`); return; }
  const lim = MODES[G.mode].secs;
  if (lim && !G.bell) G.bell = {};
  if (lim) for (const m of [300, 60]) if (G.t >= lim - m && !G.bell[m]) { G.bell[m] = 1; if (G.t < lim - m + 5) say(`${m / 60} minute${m > 60 ? 's' : ''} left: top score wins.`, 'warn', 7); }
  if (lim && G.t >= lim) { scoreAll(); const top = G.P.filter(p => p.id !== WILD && p.alive).sort((a, b) => b.score.total - a.score.total)[0]; finish(top.id === 0, top.id === 0 ? `The bell: you lead with ${fmt(top.score.total)}.` : `The bell: ${top.name} lead with ${fmt(top.score.total)}; you have ${fmt(G.P[0].score.total)}.`); }
}

// ───────────────────────── Buildings ─────────────────────────
function bldTick(b, dt) {
  const B = BLD[b.kind], o = b.owner, p = G.P[o];
  if (b.prog < 1) {
    const n = b.crew || 0; b.crew = 0;   // builders who worked it since the last look: one takes the listed time, more help with diminishing returns
    if (!n) return;
    const BT = B.t * fxv(o, 'build').m, M = maxHpB(o, b.kind), k = dt / BT * Math.pow(n, BUILDER_POW) * (B.cost && B.cost.s && WEATHER[G.wx].stone || 1);   // frost: mortar will not set
    b.prog = Math.min(1, b.prog + k); b.hp = Math.min(M, b.hp + M * 0.9 * k);
    if (b.prog >= 1) built(b); else if (o === 0 && (G.tick + b.id) % 40 === 0) sfx('hammer', b.x, b.y);
    return;
  }
  const j = b.q[0];
  if (j && !(b.stall > G.t)) {
    if (j.kind && UNIT[j.kind].cls && popOf(o) >= capOf(o) || j.muster && popOf(o) + musterN(j.muster) > capOf(o)) b.blocked = true;
    else {
      b.blocked = false; j.left -= dt;
      if (j.left <= 0) { b.q.shift(); jobDone(b, j); }
    }
  } else if (!j) b.blocked = false;
  if (B.dmg) {
    b.cd = Math.max(0, b.cd - dt);
    if (b.cd <= 0) {
      const keys = bldKeys(b.kind), reach = B.rng + fxv(o, 'rng', keys).a;
      const t = B.spyonly ? G.units.find(v => v.kind === 'spy' && atWar(o, v.owner) && dist(v, b) < reach) : nearestFoe(o, b, reach);
      if (t) {
        const sheltered = BLD[b.kind].shelter ? Math.min(BLD[b.kind].shelter, G.units.filter(u => u.inside && u.hid === b.id).length) : 0;
        hurt(o, null, t, B.dmg + sheltered + (B.spyonly ? 0 : fxv(o, 'dmg', keys).a)); b.cd = B.cd;
        if (o === 0 && b.kind === 'tower' && G.t - (b.alarmT || -99) > 20) { b.alarmT = G.t; say(`Foes at your tower at ${coord(b.x, b.y)}.`, 'warn', 6, b); sfx('horn', b.x, b.y); }
        shot(b.x, b.y, B.h, t.x, t.y);
      }
    }
  }
}
function built(b) {
  const o = b.owner, B = BLD[b.kind]; b.mx = maxHpB(o, b.kind); b.hp = Math.max(b.hp, b.mx * 0.999); G.bldV = (G.bldV || 0) + 1;   // a new place to drop at: every villager picks again
  if (b.kind === 'gate') G.navDirty = true;
  if (B.fx) fxDirty();
  b.doneT = G.t; if (o === 0) { sfx('done', b.x, b.y); celebrate(b.kind === 'wonder' ? 3 : 1, b.x, b.y); }
  if (B.sheep && b.node) b.node.amt = (b.sheep || 0) * FLEECE * 0.5;   // a new flock comes with half a year's wool on its back
  if (b.kind === 'wonder') {
    G.wonder = { owner: o, id: b.id, end: G.t + WONDER_HOLD };
    say(o === 0 ? `Your wonder stands. Hold it ${WONDER_HOLD / 60} min to win.` : `${G.P[o].name} built a wonder: break it in ${WONDER_HOLD / 60} min!`, o === 0 ? 'good' : 'warn', 10, b);
    sfx('age');
  }
}
function jobDone(b, j) {
  const o = b.owner, p = G.P[o], B = BLD[b.kind];
  if (j.kind) {
    const s = towardMid(b, B.fp * 5 + 12), u = addUnit(o, j.kind, s.x + rnd(-8, 8), s.y + rnd(-8, 8));
    u.bornT = G.t; if (o === 0) sfx('ready', b.x, b.y);
    if (j.kind === 'vil') u.job = o === 0 ? p.rally : null;
    else if (j.kind === 'caravan') u.lastId = b.id;
    else if (o === 0 && G.rally0 && UNIT[j.kind].cls === 'army') { u.state = 'goto'; u.px = G.rally0.x; u.py = G.rally0.y; }
  } else if (j.muster) {
    for (const k in j.muster) for (let i = 0; i < j.muster[k]; i++) { const s = towardMid(b, B.fp * 5 + 12), u = addUnit(o, k, s.x + rnd(-14, 14), s.y + rnd(-14, 14)); u.bornT = G.t; if (j.bn !== undefined) u.bn = j.bn; }
    if (o === 0) { sfx('done', b.x, b.y); say(`${j.bn !== undefined ? BN[j.bn] : 'A battalion'} mustered: ${musterN(j.muster)} soldiers.`, 'good', 5, b); }
  } else if (j.tech) {
    learnTech(o, j.tech);
  } else if (j.age) {
    p.age = j.age; p.aging = false; fxDirty();
    if (o === 0) { say(`You enter the ${AGES[p.age].name} age.`, 'good', 6); sfx('age'); const k = keepOf(0); if (k) { k.doneT = G.t; celebrate(3, k.x, k.y); } } else say(`${p.name} entered the ${AGES[p.age].name} age.`, '', 4);
  }
}
function learnTech(o, id) {
  const T = TECHBY[id]; G.P[o].techs.add(id); rehealth(o);
  if (o === 0) { say(T.tier ? `${T.name}: your ${plural(UNIT[T.tier.unit].name.toLowerCase())} are now ${plural(stats(0, civKind(0, T.tier.unit)).name.toLowerCase())}.` : `${T.name} learned.`, 'good', 5); sfx('done');
    const hit = T.tier ? u => u.owner === 0 && baseKind(u.kind) === T.tier.unit : (T.fx || []).some(f => f.k === '#soldier') ? u => u.owner === 0 && isSoldier(u) : null;
    if (hit && G.units.some(hit)) { const c = keepOf(0); celebrate(2, c ? c.x : 0, c ? c.y : 0, hit); } }
}

// ───────────────────────── Villagers: gather, hunt, carry, mend, shelter ─────────────────────────
function dropFor(o, type, from) { return nearest(G.blds, from, b => b.owner === o && b.prog >= 1 && b.hp > 0 && BLD[b.kind].drop && BLD[b.kind].drop.includes(type)); }
const dockNear = (o, n) => G.blds.some(b => b.owner === o && b.kind === 'dock' && b.prog >= 1 && b.hp > 0 && Math.abs(b.x - n.x) < DOCKR && Math.abs(b.y - n.y) < DOCKR && dist(b, n) < DOCKR);
const nodeFits = (n, job) => n.type === job;
// Food takes a free field first if one is near (within FIELD_NEAR), else the nearest berries, fish, carcass or game.
const unsafe = p => (G.guarded || []).some(f => Math.abs(f.x - p.x) < 120 && Math.abs(f.y - p.y) < 120 && dist(f, p) < 120);
function nearestNode(u, job) {
  let best = null, bd = 1e9, bdist = 1e9, farm = null, fd = 1e9, drops = null, dropT = '';   // bd scores a find by the walk to it and the walk home with the load
  for (const n of G.nodes) {
    if (n.kind !== 'farm' && Math.abs(n.x - u.x) * 0.4 > bd) continue;   // the cheap tests first: most of the map is farther than the best so far
    if ((n.amt <= 0 && !(n.farm && BLD[n.farm.kind].sheep)) || !nodeFits(n, job) || (n.kind !== 'farm' && unsafe(n))) continue;
    if (n.kind === 'farm') {
      if (n.farm.owner !== u.owner || n.farm.prog < 1 || n.farm.hp <= 0 || (n.wk || 0) - (u.node === n ? 1 : 0) >= slotsOf(n)) continue;
      const d = dist(u, n); if (d < fd) { fd = d; farm = n; }
    } else { if (n.kind === 'fish' && !dockNear(u.owner, n)) continue; if (n.kind === 'tree' && (!n.open || (u.patch && !inBox(n, u.patch)))) continue; if (Math.abs(n.x - u.x) * 0.4 > bd) continue; const d = dist(u, n) * 0.4; if (d < bd) { if (n.kind !== 'fish' && dropT !== n.type) { dropT = n.type; drops = G.blds.filter(b => b.owner === u.owner && b.prog >= 1 && b.hp > 0 && BLD[b.kind].drop && BLD[b.kind].drop.includes(n.type)); } const dr = n.kind === 'fish' ? null : nearest(drops, n) || keepOf(u.owner), s = d + (dr ? dist(dr, n) * 0.6 : 0) + 25 * Math.max(0, (n.wk || 0) - (u.node === n ? 1 : 0)); if (s < bd) { bd = s; best = n; bdist = d / 0.4; } } }
  }
  if (farm && (fd < FIELD_NEAR || !best)) return farm;
  if (job === 'food') {   // game: deer and boar within reach of home, if nearer than anything else
    const k = keepOf(u.owner);
    const g = k && nearest(G.units, u, v => v.owner === WILD && UNIT[v.kind].meat && UNIT[v.kind].tick === 'wild' && dist(v, k) < 420 && !unsafe(v), Math.min(bdist, 420));
    if (g) return { hunt: g };
  }
  return best;
}
function vilTick(u, dt, SP) {
  u.idle = false;
  const kk = keepOf(u.owner), rb = (u.hid && G.blds.find(b => b.id === u.hid && b.hp > 0 && b.prog >= 1)) || kk;   // where it hides: the Town Center, or a tower with room
  if (u.inside) {   // sheltering: out again when no enemy soldier is near the place
    if (!rb) { u.inside = false; return; }
    if ((G.tick + u.id) % 10 === 0 && !nearU(rb, SHELTER.clear, v => v.thr && atWar(u.owner, v.owner))) { u.inside = false; u.scared = false; u.hid = 0; u.x = rb.x + u.ox * 0.8; u.y = rb.y + 30; }
    return;
  }
  if ((G.tick + u.id) % 5 === 0) {
    const was = u.scared, r = was ? SHELTER.flee * 1.6 : SHELTER.flee; let wild = 0, foe = 0;   // enemy soldiers scare everyone near; a lone beast or robber scares only the one it hits, three or more (a pack) scare all; once running, keeps running until well clear
    unitsNear(u, r, v => { if (v.thr && v !== u.hunt && atWar(u.owner, v.owner) && dist(u, v) < r) { if (v.owner === WILD) wild++; else foe++; } });
    u.scared = !!kk && (foe > 0 || (wild > 0 && (wild >= SHELTER.raid || G.t - (u.hurtT || -99) < SHELTER.hurt)));
    if (u.scared && !was) { const tw = nearest(G.blds, u, b => b.owner === u.owner && b.kind !== 'keep' && BLD[b.kind].shelter && b.prog >= 1 && b.hp > 0 && G.units.filter(v => v.inside && v.hid === b.id).length < BLD[b.kind].shelter, 220); u.hid = tw && dist(u, tw) < dist(u, kk) ? tw.id : kk.id; }
  }
  if (u.scared && kk) {
    if (moveTo(u, rb.x, rb.y, dt, BLD[rb.kind].fp * 5 + 4, SP)) { u.inside = true; setJob(u, u.job); u.node = null; u.hunt = null; }
    return;
  }
  const cap = carryOf(u.owner);
  if (u.carry > 0 && (u.carry >= cap - 1e-6 || u.carryType !== u.job || !u.job || (!u.hunt && (!u.node || u.node.amt <= 0)))) {
    if (!(u.drop && u.drop.hp > 0 && u.dropT === u.carryType && u.dropN === G.blds.length && u.dropR === G.blds && u.dropV === G.bldV && u.dropAt === u.node)) { u.drop = dropFor(u.owner, u.carryType, u); u.dropT = u.carryType; u.dropN = G.blds.length; u.dropR = G.blds; u.dropV = G.bldV; u.dropAt = u.node; }
    const drop = u.drop; if (!drop) { u.idle = true; return; }
    if (moveTo(u, drop.x, drop.y, dt, halfOf(drop) + 4, SP)) { stash(u.owner, u.carryType, Math.round(u.carry)); u.carry = 0; }
    if (u.carry > 0 || u.hunt || !u.node || u.node.amt > 0) return;
  }
  if (u.job === 'repair') { repairTick(u, dt, SP); return; }
  if (!u.job) { u.idle = true; if (kk) moveTo(u, kk.x + u.ox, kk.y + u.oy, dt, 2, SP); return; }
  if ((G.tick + u.id) % 20 === 0 && ((u.node && u.node.kind !== 'farm' && unsafe(u.node)) || (u.hunt && unsafe(u.hunt)))) { if (u.node && u.node.farm) u.node.wk = Math.max(0, (u.node.wk || 0) - 1); u.node = null; u.hunt = null; }   // work or game has strayed beside a guarded find: leave it
  if (u.hunt) { huntTick(u, dt, SP); return; }
  const flock = u.node && u.node.farm && BLD[u.node.farm.kind].sheep && u.node.farm.hp > 0;   // a shepherd stays with the flock between shearings
  if (!flock && (!u.node || u.node.amt <= 0 || !nodeFits(u.node, u.job) || (u.node.farm && u.node.wk > slotsOf(u.node)))) {
    if (u.node && u.node.farm) u.node.wk = Math.max(0, (u.node.wk || 0) - 1);
    if (u.nnT > G.t) { u.node = null; u.idle = true; return; }   // nothing was found a moment ago: wait, do not search every step
    const n = nearestNode(u, u.job); if (!n && !u.patch) u.nnT = G.t + 2 + rng();
    if (!n && u.patch) {   // nothing open inside the box: cut in from the nearest open tree outside it; when the box is clear, back to work
      const r = u.patch, mid = { x: (r.x0 + r.x1) / 2, y: (r.y0 + r.y1) / 2 }, left = G.nodes.some(t => t.kind === 'tree' && t.amt > 0 && inBox(t, r));
      const way = left && nearest(G.nodes, mid, t => t.kind === 'tree' && t.amt > 0 && t.open, 260);
      if (way) { u.node = way; return; }
      u.patch = null; const pj = u.pj; u.pj = null; if (pj && pj !== u.job) setJob(u, pj); return;
    }
    if (n && n.hunt) { u.hunt = n.hunt; u.node = null; return; }
    u.node = n; if (n && n.farm) n.wk = (n.wk || 0) + 1;
  } else if (u.job === 'food' && u.node.kind !== 'farm' && G.t > (u.chk || 0)) {   // a field has come free: fields first
    u.chk = G.t + 3 + rng() * 2; const f = nearestNode(u, 'food');
    if (f && f.kind === 'farm') { u.node = f; f.wk = (f.wk || 0) + 1; }
  }
  const n = u.node; if (!n) { u.idle = true; return; }
  // a worker already at work keeps its place a little further out (4 more), so crowd spacing and walking in no longer fight
  if (moveTo(u, n.x, n.y, dt, (n.kind === 'fish' ? 13 : n.kind === 'farm' ? 4 : 9) + (G.t - (u.work || -9) < 0.5 ? 4 : 0), SP)) {
    const rate = n.rate || RATE_OF[n.kind];
    let g = Math.min(rate * dt * gatherMul(u.owner, n) * (u.sick > G.t ? 0.5 : 1) * hungerOf(u.owner), n.amt, cap - u.carry);
    const from = n.farm && BLD[n.farm.kind].from;   // a workshop turns what is in store into goods: 2 wool make 1 cloth, 3 food 1 beer
    if (from) { const P = G.P[u.owner], box = k => k in P.res ? P.res : P.goods; for (const k in from) g = Math.min(g, (box(k)[k] || 0) / from[k]); if (g <= 1e-6) { u.wait = true; return; } for (const k in from) box(k)[k] -= g * from[k]; }
    u.wait = false; n.amt -= g; u.carry += g; n.workT = G.t; u.carryType = n.type; u.work = G.t; u.fx = Math.sign(n.x - u.x) || u.fx;
    if ((G.tick + u.id) % 40 === 0) sfx(n.type === 'wood' ? 'chop' : n.type === 'food' ? 'pick' : 'mine', u.x, u.y);
  }
}
function huntTick(u, dt, SP) {
  const a = u.hunt;
  if (!a || a.hp <= 0) { u.hunt = null; return; }
  u.cd = Math.max(0, u.cd - dt);
  if (dist(u, a) <= UNIT.vil.rng) { if (u.cd <= 0) { hurt(u.owner, u, a, UNIT.vil.dmg * 5); u.cd = UNIT.vil.cd; u.hitT = G.t; shot(u.x, u.y, 6, a.x, a.y); } u.fx = Math.sign(a.x - u.x) || u.fx; }
  else moveTo(u, a.x, a.y, dt, UNIT.vil.rng - 4, SP);
}
// Mending: three times the build time for a full repair, a quarter of the cost, paid as the work goes.
function repairTick(u, dt, SP) {
  let b = u.rep; const o = u.owner, p = G.P[o];
  if (b && b.hp > 0 && b.owner === o && b.prog >= 1 && u.building) {   // the site it was raising is done: the next unfinished piece of wall nearby, else back to what it was doing
    u.building = false;
    if (startWork(u, b)) return;   // a field, a workshop, a dock or a camp: the builders start working it
    const open = s => s.owner === o && s.hp > 0 && s.prog < 1 && !G.units.some(v => v !== u && v.rep === s && v.job === 'repair');
    const nx = (BLD[b.kind].wallish && nearest(G.blds, u, s => s.owner === o && s.hp > 0 && s.prog < 1 && BLD[s.kind].wallish, 60)) || nearest(G.blds, u, open, 220);
    if (nx) { u.rep = b = nx; u.building = true; } else { const pj = u.pj; u.pj = null; setJob(u, pj && pj !== 'repair' ? pj : null); return; }
  }
  if (u.fireman && !(b && b.hp > 0 && b.fire > 0)) { u.fireman = false; const pj = u.pj; u.pj = null; setJob(u, pj && pj !== 'repair' ? pj : null); return; }   // the fire is out: back to work
  if (!b || b.hp <= 0 || b.owner !== o) { u.building = false; setJob(u, null); return; }
  if (b.fire > 0) { if (rectGap(u.x, u.y, b) > 7 && !moveTo(u, b.x, b.y, dt, 8, SP)) return;
    if (!b.smoke && (b.spread || b.hp < maxHpB(o, b.kind) / 2) && rng() < FIRE_SMOKE * dt) { b.smoke = true; u.hp = 0; if (o === 0) say(`Smoke killed a villager at the ${bldName(0, b.kind).toLowerCase()}.`, 'warn', 6, b); return; }   // a big fire can take one of its fighters
    b.fire = Math.max(0, b.fire - 0.2 * dt); u.work = G.t; if (!b.fire && b.owner === 0) say(`The fire at the ${bldName(0, b.kind).toLowerCase()} is out.`, 'good', 4, b); return; }
  if (b.prog < 1) {   // raising a site: walk there and work it
    u.building = true;
    if (rectGap(u.x, u.y, b) > 7 && !moveTo(u, b.x, b.y, dt, 8, SP)) return;
    b.crew = (b.crew || 0) + 1; u.work = G.t; return;
  }
  if (b.hp >= maxHpB(o, b.kind) - 0.5) { setJob(u, null); return; }
  if (rectGap(u.x, u.y, b) > 7 && !moveTo(u, b.x, b.y, dt, 8, SP)) return;
  const M = maxHpB(o, b.kind), heal = Math.min(M - b.hp, M / (BLD[b.kind].t || 60) / 3 * dt), cost = BLD[b.kind].cost || { w: 200, s: 100 };
  b.rd = b.rd || {};
  const due = {}; let short = false;   // check every part of the bill before paying any of it
  for (const [k, v] of Object.entries(cost)) { const r = (b.rd[k] || 0) + v * 0.25 * heal / M, whole = Math.floor(r); due[k] = r; if (whole > 0 && p.res[k] < whole) short = true; }
  if (short) { setJob(u, null); if (o === 0 && G.t - (G.repSay || -99) > 5) { G.repSay = G.t; say('Not enough to pay for repairs.', '', 3); } return; }
  for (const k in due) { const whole = Math.floor(due[k]); p.res[k] -= whole; b.rd[k] = due[k] - whole; }
  b.hp += heal; u.work = G.t;
}

// ───────────────────────── Other people ─────────────────────────
const homeSpot = (u, d) => { const k = keepOf(u.owner); if (!k) return null; const g = towardMid(k, d); return { x: g.x + (u.gx ?? u.ox), y: g.y + (u.gy ?? u.oy) }; };
function scoutTick(u, dt, SP) {
  if (u.state === 'goto') { if (moveTo(u, u.px, u.py, dt, 6, SP)) u.state = 'home'; return; }
  // free treasure first (no guards left), then a loop of the map
  if ((G.tick + u.id) % 30 === 0) { const f = nearest(G.finds, u, f => !f.done && FINDS[f.kind].got && !guardsLeft(f) && !G.units.some(v => v.owner !== u.owner && v.owner !== WILD && dist(v, f) < 30), 900); u.goal = f ? { x: f.x, y: f.y } : null; }
  if (u.goal) { if (moveTo(u, u.goal.x, u.goal.y, dt, 8, SP)) u.goal = null; return; }
  if (!u.route) {
    const c = [[MID, MAP - 420], [MAP - 420, MID], [MID, 420], [420, MID], [520, 520], [MAP - 520, 520], [MAP - 520, MAP - 520], [520, MAP - 520], [MID - 300, MID - 300], [MID + 300, MID + 300]];
    u.route = c.map(([x, y]) => ({ x: x + rnd(-40, 40), y: y + rnd(-40, 40) })).sort((a, b) => Math.atan2(a.y - MID, a.x - MID) - Math.atan2(b.y - MID, b.x - MID));
    u.wp = u.route.reduce((bi, w, i, A) => dist(w, u) < dist(A[bi], u) ? i : bi, 0);
  }
  const w = u.route[u.wp % u.route.length];
  if (moveTo(u, w.x, w.y, dt, 8, SP)) u.wp = (u.wp + 1) % u.route.length;
}
function envoyTick(u, dt, SP) {
  if (u.state === 'envoy') { const k = keepOf(u.target); if (!k) { u.state = 'return'; return; } if (moveTo(u, k.x, k.y, dt, 30, SP)) judgeEnvoy(u.target, u.owner, u); }
  else { const k = keepOf(u.owner); if (!k || moveTo(u, k.x, k.y, dt, 20, SP)) { u.hp = 0; u.gone = true; } }
}
// a caravan with no route trades with an ally: out from your Market to theirs, paid by distance on arrival, then home again
function caravanTick(u, dt, SP) {
  const o = u.owner; u.idle = false;
  if (G.P[o].techs.has('armedcart') && (G.tick + u.id) % 30 === 0) { const f = nearestFoe(o, u, 24); if (f) hurt(o, u, f, 4); }   // armed caravans strike back
  if (u.route) { routeTick(u, dt, SP); return; }
  const home = G.blds.find(b => b.id === u.lastId && b.hp > 0 && b.owner === o && b.kind === 'market') || nearest(G.blds, u, b => b.owner === o && b.kind === 'market' && b.prog >= 1 && b.hp > 0);
  let d = u.dest ? G.blds.find(b => b.id === u.dest && b.hp > 0) : null;
  if (d && d.owner !== o && G.rel[o][d.owner] !== 'ally') d = null;   // the alliance broke: turn back
  if (!d) {
    const to = home && allyMarket(o, home);
    if (!to) { u.idle = true; u.dest = null; u.cargo = 0; if (home && dist(u, home) > halfOf(home) + 8) moveTo(u, home.x, home.y, dt, halfOf(home) + 4, SP); return; }
    u.dest = to.id; d = to; u.cargo = Math.min(TRADE_CAP, Math.floor(dist(home, to) ** 2 / TRADE_DIV * fxv(o, 'trade').m)); u.lastId = home.id;
  }
  if (moveTo(u, d.x, d.y, dt, halfOf(d) + 4, SP)) {
    if (d.owner !== o) { G.P[o].res.g += u.cargo; G.P[o].gathered += u.cargo; if (o === 0 && u.cargo) { say(`A caravan earns ${u.cargo} gold from your ally.`, 'good', 3, d); sfx('coin'); } u.dest = u.lastId; u.cargo = 0; }
    else u.dest = null;   // home: the next run
  }
}
function spyTick(u, dt, SP) {
  const o = u.owner, k = keepOf(o); u.idle = false;
  if ((G.tick + u.id) % 5 === 0) {
    const [sR, bR] = UNIT.spy.stealth;
    if (o !== 0) u.exposed = atWar(0, o) && (G.units.some(v => v.owner === 0 && dist(v, u) < sR) || G.blds.some(b => b.owner === 0 && watchtower(b) && dist(b, u) < bR));
    for (const b of G.blds) if (atWar(o, b.owner) && b.owner !== WILD && b.hp > 0 && edge(u, b) < 60) { intel(o, b.owner); break; }
  }
  if (u.state === 'sab') {
    const b = G.blds.find(x => x.id === u.tid && x.hp > 0);
    if (!b || !atWar(o, b.owner)) { u.state = 'home'; return; }
    if (edge(u, b) <= 14) { if (!sabotage(u, b)) u.state = 'home'; return; }
    moveTo(u, b.x, b.y, dt, 12 + halfOf(b), SP); return;
  }
  if (u.state === 'goto') { if (moveTo(u, u.px, u.py, dt, 4, SP) && o !== 0) u.state = 'look'; return; }
  if (o !== 0) {   // the computers' spy: stand off an enemy keep, take the first undefended target it can see
    if (u.state === 'look' && (G.tick + u.id) % 15 === 0) {
      const best = nearest(G.blds, u, b => atWar(o, b.owner) && b.hp > 0 && BLD[b.kind].sab && !guarded(b), sightOf(u));
      if (best) { u.state = 'sab'; u.tid = best.id; return; }
      if (!u.lookT || G.t - u.lookT > 15) { u.lookT = G.t; u.ang = (u.ang || 0) + 1.3; const tk = u.tk !== undefined && keepOf(u.tk); if (tk) { u.px = clamp(tk.x + Math.cos(u.ang) * 230, 20, MAP - 20); u.py = clamp(tk.y + Math.sin(u.ang) * 230, 20, MAP - 20); u.state = 'goto'; } }
      return;
    }
    if (u.state === 'home') {
      const q = G.P.find(q => q.alive && q.id !== WILD && atWar(o, q.id) && keepOf(q.id));
      if (q && k) { const kp = keepOf(q.id); u.tk = q.id; u.px = kp.x + (k.x - kp.x) * 0.25; u.py = kp.y + (k.y - kp.y) * 0.25; u.state = 'goto'; return; }
    }
  }
  if (k && (u.state === 'home' || u.state === 'look')) moveTo(u, k.x + u.ox, k.y + u.oy, dt, 2, SP);
}
// priests and medics walk with the battalion that is out; a priest sent to a shrine stands there
function followArmy(u, dt, SP) {
  const o = u.owner; let a = null, ad = 260;
  for (const v of G.sol) { if (v.owner !== o || (u.bn !== undefined && v.bn !== u.bn) || (v.state !== 'attack' && v.state !== 'goto' && v.state !== 'escort' && v.state !== 'assist')) continue; const d = dist(u, v); if (d < ad) { ad = d; a = v; } }
  if (a) { moveTo(u, a.x - (a.fx || 0) * 24 + u.ox * 0.3, a.y - (a.fy || 0) * 24 + u.oy * 0.3, dt, 10, SP); return true; }
  return false;
}
function priestTick(u, dt, SP) {
  if (u.state === 'shrine') { const f = G.finds.find(x => x.id === u.fid); if (f) { moveTo(u, f.x + u.ox * 0.2, f.y + 22, dt, 4, SP); return; } u.state = 'home'; }
  if (followArmy(u, dt, SP)) return;
  if (u.state === 'goto' || u.state === 'assist') { moveTo(u, u.px + u.ox * 0.6, u.py + u.oy * 0.6, dt, 3, SP); return; }
  const h = homeSpot(u, 90); if (h) moveTo(u, h.x, h.y, dt, 3, SP);
}
function medicTick(u, dt, SP) {
  if (followArmy(u, dt, SP)) return;
  if (u.state === 'goto' || u.state === 'assist') { moveTo(u, u.px + u.ox * 0.6, u.py + u.oy * 0.6, dt, 3, SP); return; }
  const h = homeSpot(u, 90); if (h) moveTo(u, h.x, h.y, dt, 3, SP);
}
// Healing: a hospital or a medic heals your own soldiers within reach. The best one in reach counts; they do not add up.
function healTick(dt) {
  if (G.tick % 3) return;
  const H = [];
  for (const b of G.blds) { const h = BLD[b.kind].heal; if (h && b.prog >= 1 && b.hp > 0) H.push(b.x, b.y, BLD[b.kind].hrng, h, b.owner); }
  for (const u of G.units) { const h = UNIT[u.kind].heal; if (h && !u.inside) H.push(u.x, u.y, UNIT[u.kind].hrng, h, u.owner); }
  if (!H.length) return;
  for (const u of G.units) {
    if (u.hp >= u.max - 0.01 || UNIT[u.kind].cls !== 'army') continue;
    let best = 0; for (let i = 0; i < H.length; i += 5) if (H[i + 4] === u.owner && H[i + 3] > best && hyp(H[i] - u.x, H[i + 1] - u.y) < H[i + 2]) best = H[i + 3];
    if (best) u.hp = Math.min(u.max, u.hp + best * fxv(u.owner, 'heal').m * dt * 3);
  }
}

// ───────────────────────── Soldiers ─────────────────────────
// a missile in the air: it flies for a time that grows with the distance, on a curve that rises with it
function shot(x1, y1, h1, x2, y2) { const d = hyp(x2 - x1, y2 - y1), dur = 0.12 + d / 600; G.tracers.push({ x1, y1, h1, x2, y2, life: dur, dur, arc: 4 + d * 0.16 }); }
// 0 Line, 1 Shield wall (foot who do not shoot), 2 Skirmish (shooters); a horse archer always rides away
function stanceOf(u) {
  const U = UNIT[u.kind], tg = U.tags || [], shoots = tg.includes('ranged'), foot = tg.includes('infantry') && !shoots;
  if (U.kite) return 2;
  const P = G.P[u.owner]; if (!P || !P.techs.has('engage')) return 0;   // stances come with Engagement, for every side
  const want = u.owner === 0 ? G.stance[u.bn ?? BNS] || 0 : shoots ? 2 : foot && u.state === 'home' ? 1 : 0;
  return want === 1 && foot ? 1 : want === 2 && shoots ? 2 : 0;
}
function solTick(u, dt, SP) {
  const U = UNIT[u.kind], o = u.owner, k = keepOf(o);
  u.cd = Math.max(0, u.cd - dt); u.stance = stanceOf(u);
  let tgt = u.tgt;   // looks for the nearest foe a few times a second, and keeps hitting the one it has between looks
  if (tgt && !(tgt.hp > 0 && !tgt.inside && atWar(o, tgt.owner) && (edge(u, tgt) < sightOf(u) * 1.4 || (u.state === 'home' && k && dist(tgt, k) < 320)))) tgt = u.tgt = null;   // the one it had is gone; a soldier at home keeps a foe it was sent after near the Town Center (Build 38: dropping it the next step made new soldiers spin)
  if ((G.tick + u.id) % 4 === 0) {   // its turn to look, about seven times a second: with a foe or without
    tgt = U.bonly ? nearestFoeBld(o, u, undefined, sightOf(u)) : nearestFoe(o, u, sightOf(u));
    if (u.state === 'home' && tgt && k && dist(tgt, k) > 320) tgt = null;
    if (!tgt && u.state === 'home' && k && !U.bonly) tgt = nearestFoe(o, u, 320, k);
    u.tgt = tgt;
  }
  if (u.focus) { if (u.focus.hp > 0 && !u.focus.inside && atWar(o, u.focus.owner)) { tgt = u.focus; u.tgt = tgt; } else u.focus = null; }   // told to hit this one
  if (tgt && o === 0 && u.state !== 'attack' && !u.focus && G.hold[u.bn ?? BNS] && edge(u, tgt) > rngOf(u) + (tgt.q ? 2 : 5)) tgt = null;   // hold ground: fight only what comes within reach
  if (u.state === 'escort') { escortPick(u); if (!u.esc) u.state = 'home'; else if (tgt && dist(tgt, u.esc) > 110) tgt = nearestFoe(o, u, 110, u.esc); }
  if (!tgt && u.blocker && u.blocker.hp > 0 && atWar(o, u.blocker.owner) && G.t - u.blockT < 1) tgt = u.blocker;
  if (!tgt && u.state === 'attack') {
    if (!(u.bt && u.bt.hp > 0 && u.bt.owner === u.target && atWar(o, u.bt.owner)) || (G.tick + u.id) % 5 === 0) u.bt = (u.bid && G.blds.find(b => b.id === u.bid && b.hp > 0)) || nearestFoeBld(o, u, u.target, 260);
    tgt = u.bt;
    if (!tgt) {
      const kp = keepOf(u.target);
      if (kp && edge(u, kp) > 40) { moveTo(u, kp.x + u.ox * 0.5, kp.y + u.oy * 0.5, dt, 20, SP); return; }
      tgt = nearestFoeBld(o, u, u.target); if (!tgt) u.state = 'home';
    }
  }
  if (tgt) {
    const reach = rngOf(u) + (tgt.q ? 2 : 5);
    if (edge(u, tgt) <= reach) {
      const fd = dist(u, tgt) || 1; u.fx = (tgt.x - u.x) / fd; u.fy = (tgt.y - u.y) / fd;
      if (u.stance === 2 && u.cd > 0 && (G.tick + u.id) % 3 === 0) {   // reloading with a foe on top of it: step back
        const f = nearestFoe(o, u, KITE); if (f && !f.q && UNIT[f.kind].rng <= 20) { const dx = u.x - f.x, dy = u.y - f.y, dd = hyp(dx, dy) || 1; const kx = clamp(u.x + dx / dd * 28, 15, MAP - 15), ky = clamp(u.y + dy / dd * 28, 15, MAP - 15); if (!blockedCell(gcell(kx, ky), o)) { u.kx = kx; u.ky = ky; u.kT = G.t; } }
      }
      if (u.kT > G.t - 0.5 && u.cd > 0) { moveTo(u, u.kx, u.ky, dt, 2, SP); return; }
      if (u.cd <= 0) { hurt(o, u, tgt, dmgOf(u)); u.cd = U.cd; u.hitT = G.t; if (U.rng > 20) shot(u.x, u.y, 9, tgt.x, tgt.y); }
    } else moveTo(u, tgt.x, tgt.y, dt, Math.max(2, reach - 2 + (tgt.q ? halfOf(tgt) : 0)), SP);
    u.idleT = 0; return;
  }
  if (u.state === 'escort' && u.esc) { moveTo(u, u.esc.x + u.ox * 0.5, u.esc.y + u.oy * 0.5, dt, 14, SP); return; }
  if (u.state === 'goto' || u.state === 'assist') {
    if (moveTo(u, u.px + (u.gx ?? u.ox * 0.6), u.py + (u.gy ?? u.oy * 0.6), dt, 3, SP)) { u.idleT += dt; if (u.state === 'assist' && u.idleT > 20) u.state = 'home'; }
    return;
  }
  const h = homeSpot(u, 90); if (h) moveTo(u, h.x, h.y, dt, 3, SP);
}
// a guard keeps to what it guards: a caravan (escort) or a trade stop you hold (garrison); when that is gone, it goes home
function escortPick(u) {
  if (u.escF !== undefined) { const f = G.finds.find(x => x.id === u.escF); u.esc = f && f.owner === u.owner ? f : null; if (!u.esc) u.escF = undefined; return; }
  if (u.esc && u.esc.hp > 0 && (G.tick + u.id) % 20) return;
  u.esc = u.escId !== undefined ? G.units.find(v => v.id === u.escId && v.hp > 0) || null : nearest(G.units, u, v => v.kind === 'caravan' && v.owner === u.owner);
  if (!u.esc) u.escId = undefined;
}

// ───────────────────────── The wild ─────────────────────────
// Guards stay by what they guard and attack whoever comes close; game grazes and runs; robbers raid within their reach.
function wildTick(u, dt, SP) {
  const U = UNIT[u.kind];
  if (U.passive) return;
  if (U.flee) {
    const hurtNow = G.t - (u.hurtT || -99) < 6;   // game ignores villagers (they are the hunters) until hit; soldiers always scare it
    if ((G.tick + u.id) % 6 === 0) { const t = nearU(u, 70, v => v.owner !== WILD && !v.inside && (hurtNow || v.kind !== 'vil')); u.run = t ? { x: u.x + (u.x - t.x), y: u.y + (u.y - t.y) } : null; }
    if (u.run) { const nx = clamp(u.run.x, 20, MAP - 20), ny = clamp(u.run.y, 20, MAP - 20); const sp = U.spd * (hurtNow ? 0.45 : 1); u.x += clamp(nx - u.x, -1, 1) * sp * dt; u.y += clamp(ny - u.y, -1, 1) * sp * dt; u.fx = Math.sign(nx - u.x) || u.fx; u.mvT = G.t; if (blockedCell(gcell(u.x, u.y), WILD)) { const f = freeNear(Math.floor(u.x / NAVC), Math.floor(u.y / NAVC), WILD, 6, u.x, u.y); if (f) { u.x = f.x; u.y = f.y; } } }
    else if (G.t > (u.graze || 0)) { u.graze = G.t + rnd(3, 8); u.gx = u.hx + rnd(-40, 40); u.gy = u.hy + rnd(-30, 30); }
    else if (u.gx !== undefined) moveTo(u, u.gx, u.gy, dt * 0.3, 3, 1);
    return;
  }
  u.cd = Math.max(0, u.cd - dt);
  const home = { x: u.hx, y: u.hy }, leash = (U.raid || 120) + 60;
  let t = u.tgt;
  if ((G.tick + u.id) % 5 === 0 || !(t && t.hp > 0 && !t.inside)) {
    t = null;
    if (u.aggro && u.aggro.hp > 0 && !u.aggro.inside && dist(u.aggro, home) < leash) t = u.aggro;
    if (!t) t = nearU(u, U.raid ? U.raid + 40 : 140, v => v.owner !== WILD && !v.inside && v.kind !== 'envoy' && dist(v, home) < (U.raid && hasTag(v.kind, 'civ') ? U.raid : 90) && !(U.raid && guardedCart(v)));
    u.tgt = t;
  }
  if (t && dist(t, home) > leash) { t = u.tgt = null; u.aggro = null; }
  if (t) {
    const reach = U.rng + 5;
    if (dist(u, t) <= reach) { u.fx = Math.sign(t.x - u.x) || u.fx; if (u.cd <= 0) { hurt(WILD, u, t, U.dmg); u.cd = U.cd; u.hitT = G.t; } }
    else moveTo(u, t.x, t.y, dt, reach - 2, SP);
    return;
  }
  if (dist(u, home) > 30) moveTo(u, u.hx + u.ox * 0.5, u.hy + u.oy * 0.5, dt, 6, SP);
}
function wayfarers(dt) {
  G.wayT -= dt; if (G.wayT > 0) return; G.wayT = WAYFARER_EVERY;
  const E = [[MID, 60], [MAP - 60, MID], [MID, MAP - 60], [60, MID]], i = G.wayI++ % 4, a = E[i], b = E[(i + 2) % 4];
  const w = addUnit(WILD, 'wayfarer', a[0], a[1]); w.px = b[0]; w.py = b[1];
  say('A wayfarer: reach him first to gain him.', '', 6, w);
}
function wayfarerTick(u, dt, SP) {
  if ((G.tick + u.id) % 6 === 0) {
    const m = nearU(u, 22, v => v.owner !== WILD && v.kind !== 'envoy' && !v.inside);
    if (m) {
      const o = m.owner; u.hp = 0; u.gone = true;
      if (clsCount(o, 'civ') < VILMAX) { const v = addUnit(o, 'vil', u.x, u.y); v.job = o === 0 ? G.P[0].rally : null; } else { G.P[o].res.f += 50; }
      if (o === 0) say('A wayfarer joins your people.', 'good', 5); return;
    }
  }
  if (moveTo(u, u.px, u.py, dt, 10, SP)) { u.hp = 0; u.gone = true; }
}
const guardsLeft = f => f.guards.length && G.units.some(v => v.find === f.id && v.owner === WILD && v.hp > 0 && v.kind !== 'vagabond');
function findsTick(dt) {
  for (const f of G.finds) {
    if (f.done && !FINDS[f.kind].capture) continue;
    const F = FINDS[f.kind];
    if (F.capture) {   // a holy site: priests take it, it pays its keeper
      const here = G.units.filter(u => u.kind === 'priest' && dist(u, f) < 30), sides = [...new Set(here.map(u => u.owner))];
      if (sides.length === 1 && sides[0] !== f.owner) {
        const o = sides[0]; if (!f.cap || f.cap.o !== o) f.cap = { o, t: 0 }; f.cap.t += dt;
        if (f.cap.t >= F.capture) { const was = f.owner; f.owner = o; f.cap = null; if (o === 0) say('Your priest holds the shrine.', 'good', 5); else if (was === 0) say(`${G.P[o].name} took your shrine.`, 'warn', 5, f); }
      } else if (!sides.length) f.cap = null;
      if (f.owner !== null && G.P[f.owner].alive) { f.acc = (f.acc || 0) + F.pay * dt; if (f.acc >= 1) { const g = Math.floor(f.acc); f.acc -= g; G.P[f.owner].res.g += g; G.P[f.owner].gathered += g; } }
      continue;
    }
    if (!F.got || guardsLeft(f)) continue;
    const m = nearU(f, 26, v => v.owner !== WILD && v.kind !== 'envoy' && !v.inside); if (!m) continue;
    const o = m.owner, got = {}; addRes(got, F.got, G.fantasy ? 1.5 : 1); if (f.hoard) got.g = (got.g || 0) + f.hoard; for (const k in got) got[k] = Math.round(got[k]);
    f.done = true; f.owner = o; addRes(G.P[o].res, got); G.P[o].gathered += sumCost(got);
    let extra = '';
    if (F.tech) { const T = TECH.find(T => !G.P[o].techs.has(T.id) && T.age <= G.P[o].age && (!T.need || G.P[o].techs.has(T.need)) && !T.tier && !G.blds.some(b => b.owner === o && b.q.some(j => j.tech === T.id))); if (T) { learnTech(o, T.id); extra = ` and a scroll: ${T.name}`; } }
    if (o === 0) { say(`${F.name}: ${costText(got)}${extra}.`, 'good', 6); sfx('coin'); }
    if (G.contract && G.contract.fid === f.id) { addRes(G.P[o].res, CONTRACT.pay); G.P[o].gathered += sumCost(CONTRACT.pay); G.contract = null; say(o === 0 ? `The Fortress pays you ${costText(CONTRACT.pay)} for the job.` : `${G.P[o].name} took the Fortress's job.`, o === 0 ? 'good' : '', 6); }
  }
}

// ───────────────────────── Finding foes, and hitting them ─────────────────────────
// Units are sorted into squares of 48 at the start of each step, so a search looks only at the squares around it.
const UG = 48, UGN = Math.ceil(MAP / UG), UGH = new Int32Array(UGN * UGN);
let UGX = new Int32Array(1024);
function buildGrid() {
  const U = G.units, n = U.length; if (UGX.length < n) UGX = new Int32Array(n * 2);
  UGH.fill(-1); G.sol = [];
  for (let i = 0; i < n; i++) { const u = U[i], c = clamp((u.y / UG) | 0, 0, UGN - 1) * UGN + clamp((u.x / UG) | 0, 0, UGN - 1); UGX[i] = UGH[c]; UGH[c] = i; if (isSoldier(u)) G.sol.push(u); }
  G.ugTick = G.tick;
}
// soldiers ignore grazing deer, drifters and wayfarers; spies are seen only up close
const ignorable = v => { const U = UNIT[v.kind]; return U.flee || U.passive || U.tick === 'wayfarer'; };
function nearestFoe(o, from, range, anchor) {
  const a = anchor || from, U = G.units, isB = !!from.q, sR = UNIT.spy.stealth[isB ? 1 : 0]; let best = null, bd = range;
  const grid = G.ugTick === G.tick, r = range + 3;
  const x0 = grid ? clamp(((a.x - r) / UG) | 0, 0, UGN - 1) : 0, x1 = grid ? clamp(((a.x + r) / UG) | 0, 0, UGN - 1) : 0, y0 = grid ? clamp(((a.y - r) / UG) | 0, 0, UGN - 1) : 0, y1 = grid ? clamp(((a.y + r) / UG) | 0, 0, UGN - 1) : 0;
  for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) for (let i = grid ? UGH[cy * UGN + cx] : U.length - 1; i >= 0; i = grid ? UGX[i] : i - 1) {
    const v = U[i]; if (v.inside || v.hp <= 0 || !atWar(o, v.owner) || ignorable(v)) continue;
    const dx = a.x - v.x, dy = a.y - v.y, d = Math.sqrt(dx * dx + dy * dy);
    if (d < bd && !(v.kind === 'spy' && d > sR)) { bd = d; best = v; }
  }
  return best;
}
// the nearest unit within r that passes ok, looking only at the squares around (the grid is rebuilt each step)
function nearU(from, r, ok) {
  if (G.ugTick !== G.tick) return nearest(G.units, from, ok, r);
  const U = G.units, x0 = clamp(((from.x - r) / UG) | 0, 0, UGN - 1), x1 = clamp(((from.x + r) / UG) | 0, 0, UGN - 1), y0 = clamp(((from.y - r) / UG) | 0, 0, UGN - 1), y1 = clamp(((from.y + r) / UG) | 0, 0, UGN - 1);
  let best = null, bd = r;
  for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) for (let i = UGH[cy * UGN + cx]; i >= 0; i = UGX[i]) { const v = U[i]; if (v === from || v.hp <= 0) continue; const d = dist(from, v); if (d < bd && ok(v)) { bd = d; best = v; } }
  return best;
}
function nearestFoeBld(o, from, owner, range) {
  let best = null, bd = range || 1e9;
  const ok = b => { if (b.hp > 0 && atWar(o, b.owner) && (owner === undefined || b.owner === owner)) { const d = rectGap(from.x, from.y, b); if (d < bd) { bd = d; best = b; } } };
  if (range) bldsNear(from.x, from.y, range + 40, ok); else for (const b of G.blds) ok(b);
  return best;
}
// Buildings and nodes stand still, so each is sorted into squares of 100 once, and redone only when one comes or goes.
const SGC = 100, SGN = Math.ceil(MAP / SGC);
const SG = { b: { ref: null, len: 0, cells: [] }, n: { ref: null, len: 0, cells: [] } };
function sgrid(which, list) {
  const g = SG[which]; if (g.ref === list && g.len === list.length) return g.cells;
  const cells = g.cells; cells.length = SGN * SGN; for (let i = 0; i < cells.length; i++) cells[i] = null;
  for (const e of list) { const c = clamp((e.y / SGC) | 0, 0, SGN - 1) * SGN + clamp((e.x / SGC) | 0, 0, SGN - 1); (cells[c] || (cells[c] = [])).push(e); }
  g.ref = list; g.len = list.length; return cells;
}
// calls fn for everything within r of (x, y) by its square (a little beyond r on the edges); stops and returns true when fn does
function sgNear(which, list, x, y, r, fn) {
  const cells = sgrid(which, list), x0 = clamp(((x - r) / SGC) | 0, 0, SGN - 1), x1 = clamp(((x + r) / SGC) | 0, 0, SGN - 1), y0 = clamp(((y - r) / SGC) | 0, 0, SGN - 1), y1 = clamp(((y + r) / SGC) | 0, 0, SGN - 1);
  for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) { const L = cells[cy * SGN + cx]; if (L) for (const e of L) if (fn(e)) return true; }
  return false;
}
const bldsNear = (x, y, r, fn) => sgNear('b', G.blds, x, y, r, fn), nodesNear = (x, y, r, fn) => sgNear('n', G.nodes, x, y, r, fn);
// the units within r of from, by the unit grid
function unitsNear(from, r, fn) {
  if (G.ugTick !== G.tick) { for (const v of G.units) if (v !== from && Math.abs(v.x - from.x) < r && Math.abs(v.y - from.y) < r) fn(v); return; }
  const U = G.units, x0 = clamp(((from.x - r) / UG) | 0, 0, UGN - 1), x1 = clamp(((from.x + r) / UG) | 0, 0, UGN - 1), y0 = clamp(((from.y - r) / UG) | 0, 0, UGN - 1), y1 = clamp(((from.y + r) / UG) | 0, 0, UGN - 1);
  for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) for (let i = UGH[cy * UGN + cx]; i >= 0; i = UGX[i]) { const v = U[i]; if (v !== from && Math.abs(v.x - from.x) < r && Math.abs(v.y - from.y) < r) fn(v); }
}
function vsMul(a, t) {
  const vs = a.owner === WILD ? UNIT[a.kind].vs : stats(a.owner, a.kind).vs; if (!vs) return 1;
  let m = vs[t.kind] || vs[baseKind(t.kind)] || 1; for (const tag of UNIT[t.kind].tags || []) if (vs[tag] > m) m = vs[tag];
  return m;
}
function hurt(o, a, t, base) {
  const A = a ? UNIT[a.kind] : {}, isB = !!t.q;
  let d = base;
  if (isB) d *= A.bld ?? 1;
  else {
    if (a) d *= vsMul(a, t);
    if (isSoldier(t) && t.owner !== WILD) {
      d *= stats(t.owner, t.kind).armor;
      if (t.stance === 1) d *= STANCE[1].hit;
      { const F = FORM[formOf(t)]; d *= F.hit || 1; if (F.vsMounted && a && hasTag(a.kind, 'mounted')) d *= F.vsMounted; }   // the battalion's formation
      if (a && A.rng <= 20 && t.fx !== undefined && ((a.x - t.x) * t.fx + (a.y - t.y) * t.fy) < -0.5 * (dist(a, t) || 1)) d *= FLANK;   // from behind the way it faces
    }
    if (UNIT[t.kind].rarmor && (!a || A.rng > 20)) d *= UNIT[t.kind].rarmor;   // roofed: arrows and bolts glance off
  }
  t.hp -= d; t.hurtT = G.t;
  if (a && A.knock && !isB && t.hp > 0 && t.kind !== 'caravan') {   // a heavy blow drives the target back and flashes it
    const dx = t.x - a.x, dy = t.y - a.y, dd = hyp(dx, dy) || 1, nx = t.x + dx / dd * A.knock, ny = t.y + dy / dd * A.knock;
    if (!blockedCell(gcell(nx, ny), t.owner)) { t.x = clamp(nx, 8, MAP - 8); t.y = clamp(ny, 8, MAP - 8); }
    t.flashT = G.t;
  }
  if (isB || t.kind === 'caravan') { if (o !== t.owner) t.by = o; } else if (t.owner === WILD) { t.aggro = a; t.by = o; }
  if (!lessMotion && SPARKS.length < 40) SPARKS.push({ x: t.x, y: t.y, t: G.t });
  sfx(A.gun ? (hasTag(a.kind, 'siege') ? 'boom' : 'shot') : isB ? 'bhit' : A.rng > 20 || !a ? 'arrow' : 'hit', t.x, t.y);
  if (o !== WILD && t.owner !== WILD && !atWar(o, t.owner) && o !== t.owner) declareWar(o, t.owner, o === 0 ? 'you attacked them' : `${G.P[o].name} attacked`);
  if (t.owner === 0 && o !== 0) { G.hitT = G.t; G.hitWild = o === WILD; if (G.t - G.alertT > 12) { G.alertT = G.t; if (o !== WILD) sfx('horn'); say(o === WILD ? `${plural(UNIT[a ? a.kind : 'wolf'].name)} attack at ${coord(t.x, t.y)}` : `Under attack at ${coord(t.x, t.y)}`, 'warn', 7, t); } }
}
// Crowd spacing, neighbours only: units are sorted into squares of 8 and each is compared with the units in its own and the next squares.
const CHW = Math.ceil(MAP / 8) + 1, CHEAD = new Int32Array(CHW * CHW), CHCELL = [];
let CHNEXT = new Int32Array(1024);
function pushApart(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y; if (dx > 8 || dx < -8 || dy > 8 || dy < -8) return;
  const d = hyp(dx, dy); if (d > 0 && d < 8) { const p = (8 - d) / 2 / d; a.x -= dx * p; a.y -= dy * p; b.x += dx * p; b.y += dy * p; }
}
function collide() {
  const U = G.units, n = U.length;
  if (CHNEXT.length < n) CHNEXT = new Int32Array(n * 2);
  CHEAD.fill(-1);
  for (let i = 0; i < n; i++) {
    const u = U[i]; if (u.inside) { CHCELL[i] = -1; continue; }
    const c = clamp((u.y / 8) | 0, 0, CHW - 1) * CHW + clamp((u.x / 8) | 0, 0, CHW - 1);
    CHCELL[i] = c; CHNEXT[i] = CHEAD[c]; CHEAD[c] = i;
  }
  for (let i = 0; i < n; i++) {
    const c = CHCELL[i]; if (c < 0) continue;
    const a = U[i], cx = c % CHW;
    for (let j = CHNEXT[i]; j >= 0; j = CHNEXT[j]) pushApart(a, U[j]);
    if (cx + 1 < CHW) for (let j = CHEAD[c + 1]; j >= 0; j = CHNEXT[j]) pushApart(a, U[j]);
    if (c + CHW < CHW * CHW) {
      for (let j = CHEAD[c + CHW]; j >= 0; j = CHNEXT[j]) pushApart(a, U[j]);
      if (cx + 1 < CHW) for (let j = CHEAD[c + CHW + 1]; j >= 0; j = CHNEXT[j]) pushApart(a, U[j]);
      if (cx > 0) for (let j = CHEAD[c + CHW - 1]; j >= 0; j = CHNEXT[j]) pushApart(a, U[j]);
    }
  }
  for (const u of U) {
    if (u.inside) continue;
    for (const L of G.lakes) { const dl = hyp(u.x - L.x, u.y - L.y); if (dl < L.r + 6) { const s = (L.r + 6) / (dl || 1); u.x = L.x + (u.x - L.x) * s; u.y = L.y + (u.y - L.y) * s; } }
    u.x = clamp(u.x, 6, MAP - 6); u.y = clamp(u.y, 6, MAP - 6);
    if (blockedCell(gcell(u.x, u.y), u.owner)) { const f = freeNear(Math.floor(u.x / NAVC), Math.floor(u.y / NAVC), u.owner, 8, u.x, u.y); if (f) { u.x = f.x; u.y = f.y; u.path = null; } }
  }
}

// ───────────────────────── Plunder, falls, the score ─────────────────────────
// A destroyed building pays its destroyer a quarter of its cost; a fallen Town Center pays the whole stockpile and a quarter of everything left standing.
function plunder(to, got) {
  const P = G.P[to]; let any = false;
  for (const [k, v] of Object.entries(got)) if (v > 0) { P.res[k] += v; P.gathered += v; any = true; if (to === 0) G.loot[k] = (G.loot[k] || 0) + v; }
  if (to === 0 && any) { G.lootT = G.t; sfx('coin'); }
}
function plunderBld(b) {
  const to = b.by; b.by = undefined; if (to === b.owner || !G.P[to] || to === WILD) return;
  if (b.kind === 'keep') G.P[b.owner].killer = to;
  const got = {}; for (const [k, v] of Object.entries(BLD[b.kind].cost || {})) got[k] = Math.floor(v * PLUNDER);
  plunder(to, got); sfx('crash', b.x, b.y);
}
function fall(p) {
  p.alive = false;
  const to = p.killer;
  if (to !== undefined && G.P[to] && to !== WILD) {
    const got = { ...p.res };
    for (const b of G.blds) if (b.owner === p.id && b.hp > 0) { for (const [k, v] of Object.entries(BLD[b.kind].cost || {})) got[k] = (got[k] || 0) + Math.floor(v * PLUNDER); b.by = undefined; }
    plunder(to, got); for (const k of Object.keys(p.res)) p.res[k] = 0;
  }
  G.units.forEach(u => { if (u.owner === p.id) { u.hp = 0; u.gone = true; } });
  G.blds.forEach(b => { if (b.owner === p.id) { b.hp = 0; b.gone = true; } });
  for (const f of G.finds) if (f.owner === p.id && FINDS[f.kind].capture) f.owner = null;
  if (p.ally !== null) { const q = G.P[p.ally]; if (q.ally === p.id) q.ally = null; }
  if (p.id) say(`${p.name} has fallen.`, p.id === FORT ? 'warn' : 'good', 7);
}
function scoreAll() {
  for (const p of G.P) {
    if (p.id === WILD) continue;
    const s = { people: 0, army: 0, tech: p.spent / SCORE.tech, bld: 0, wealth: p.gathered / SCORE.wealth };
    if (p.alive) {
      for (const u of G.units) if (u.owner === p.id && UNIT[u.kind].cls) s[UNIT[u.kind].cls === 'army' ? 'army' : 'people'] += sumCost(UNIT[u.kind].cost) / SCORE.unit;
      for (const b of G.blds) if (b.owner === p.id && b.prog >= 1 && b.hp > 0) s.bld += sumCost(BLD[b.kind].cost) / SCORE.bld;
    }
    for (const k in s) s[k] = Math.round(s[k]);
    s.total = s.people + s.army + s.tech + s.bld + s.wealth; p.score = s;
  }
}
function watchHome() {
  const k = keepOf(0); if (!k || G.tick % 15) return;
  const near = G.units.find(u => atWar(0, u.owner) && u.owner !== WILD && isSoldier(u) && dist(u, k) < 340);
  if (near && G.t - G.warnT > 20) { G.warnT = G.t; say('Enemies at your town!', 'warn', 7, near); }
}
function finish(won, text) {
  G.over = won ? 'won' : 'lost'; clearSave(); sfx(won ? 'win' : 'lose'); scoreAll(); if (won) { const k = keepOf(0); if (k) celebrate(3, k.x, k.y); }
  let best = null; try { best = Number(localStorage.getItem('firstkeep.best')) || null; } catch (e) {}
  const sc = G.P[0].score.total;
  if (won && (!best || sc > best)) { best = sc; try { localStorage.setItem('firstkeep.best', String(sc)); } catch (e) {} }
  showEnd(won, `${text} Score ${fmt(sc)}${best ? ' · best ' + fmt(best) : ''}.`);
}
const TICK = { vil: vilTick, scout: scoutTick, envoy: envoyTick, caravan: caravanTick, spy: spyTick, priest: priestTick, medic: medicTick, sol: solTick, wild: wildTick, wayfarer: wayfarerTick };


// builders who finish a place of work start on it: fields and workshops take them up to their places, a dock sets them fishing, a camp sends them to what it is for
const slotsOf = n => (n.farm && BLD[n.farm.kind].slots) || 1;
function startWork(u, b) {
  const B = BLD[b.kind], take = (job, n) => { u.pj = null; setJob(u, job, n); return true; };
  if (B.crop && b.node) return (b.node.wk || 0) < slotsOf(b.node) && take(b.node.type, b.node);
  if (b.kind === 'dock') { const f = nearest(G.nodes, b, n => n.kind === 'fish' && n.amt > 0, DOCKR); return !!f && take('food', f); }
  if (B.drop && B.drop.length <= 3) { const n = nearest(G.nodes, b, n => B.drop.includes(n.type) && n.kind !== 'farm' && n.amt > 0 && (n.kind !== 'tree' || n.open), 220); return !!n && take(n.type, n); }
  return false;
}
