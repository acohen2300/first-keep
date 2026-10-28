// ═════ 19-natives.js ═════
// ───────────────────────── The Natives: the fifth side's one brain, and the Throne ─────────────────────────
// Regard is what they think of each side (0..100). It is the one number behind peace, alliance, raids and the gate.
const throneB = () => G.blds.find(b => b.kind === 'throne' && b.hp > 0) || null;
const homeOf = o => o === WILD ? throneB() : keepOf(o);
const natState = () => G.nat || (G.nat = { regard: G.P.map(() => NATIVE.regard0), gifts: G.P.map(() => []), raidT: 0, handT: {}, said: {}, warBy: {} });
const regardOf = o => natState().regard[o];
function natRegard(o, d) { const N = natState(); N.regard[o] = clamp(N.regard[o] + d, 0, 100); natSync(o); }
// peace and war follow regard; an alliance needs an emissary and ends the moment regard falls under the line
function natSync(o) {
  if (o === WILD || !G.P[o].alive) return;
  const r = regardOf(o), rel = G.rel[o][WILD];
  if (rel === 'ally' && r < NATIVE.allyAt - 10) { makePeace(o, WILD); if (o === 0) say('The Natives end the alliance: regard fell.', 'warn', 6); }
  else if (rel !== 'ally') { const N = natState(); if (!N.warBy) N.warBy = {}; if (N.warBy[o] && r >= NATIVE.allyAt) N.warBy[o] = false; const want = N.warBy[o] ? 'war' : r >= NATIVE.peaceAt ? 'peace' : 'war'; if (want !== rel) { G.rel[o][WILD] = G.rel[WILD][o] = want; G.navDirty = true; if (o === 0) say(want === 'peace' ? 'The Natives leave you be: regard above 40.' : 'The Natives turn on you: regard under 40.', want === 'peace' ? 'good' : 'warn', 6); } }
}
// gifts: the Danegeld rule, each buys less than the last within the window
const giftsRecent = o => natState().gifts[o].filter(t => G.t - t < NATIVE.giftWindow).length;
const giftGain = (o, amt) => Math.max(1, Math.round(amt / 10 / (1 + NATIVE.danegeld * giftsRecent(o))));
function giftWhy(o, amt) { if (!throneB()) return 'The Throne is taken.'; if (G.P[o].res.g < amt) return `Not enough gold: ${amt}.`; return null; }
function giveGift(o, amt) {
  if (giftWhy(o, amt)) return false;
  const gain = giftGain(o, amt); G.P[o].res.g -= amt; natState().gifts[o].push(G.t); natRegard(o, gain);
  if (o === 0) say(`Natives: ${amt} gold, regard +${gain}${giftsRecent(o) > 1 ? '. They expect more' : ''}.`, 'good', 6);
  return true;
}
function judgeNatives(from, envoy, ask) {
  if (ask !== 'ally') { reply(from, envoy, 'The Natives answer only to regard, not to words.'); return; }
  if (regardOf(from) < NATIVE.allyAt) { reply(from, envoy, `The Natives send your emissary back: regard ${Math.round(regardOf(from))} of ${NATIVE.allyAt}.`); return; }
  makeAlly(WILD, from); reply(from, envoy, 'The Natives accept you. Their gate opens to you.');
}
// the citadel's garrison: warriors in the yard, bowmen on the walls; it grows back while the Natives hold the Throne
// Albert's rule: skilled, swift, light and many, with the ground on their side; not brawny, not advanced. Gunpowder is the game-changer: once a side has it, the garrison thins and guns tell
const gunAge = () => G.P.some(p => p.id !== WILD && p.alive && p.age >= NATIVE.gunAge);
const garrisonMax = () => Math.round((NATIVE.garrison + NATIVE.perAge * Math.max(0, ...G.P.filter(p => p.id !== WILD && p.alive).map(p => p.age))) * (gunAge() ? NATIVE.gunMax : 1));
function natSpawn(T, kind) { const u = addUnit(WILD, kind, T.x + rnd(-30, 30), T.y + 44 + rnd(-6, 6)); u.hb = T.id; u.state = 'home'; u.native = true; return u; }
const throneHold = () => THRONE.hold * (MODES[G.mode].secs ? MODES[G.mode].secs / 3600 : 1);
// the Throne changes hands: broken down, or sworn over by allied Natives; the walls and towers go with it, the garrison does not
function takeThrone(o, sworn) {
  const T = G.blds.find(b => b.kind === 'throne' && !b.gone); if (!T) return;
  const was = G.throne ? G.throne.owner : WILD;
  T.hp = sworn ? maxHpB(o, 'throne') : maxHpB(o, 'throne') / 3; T.mx = maxHpB(o, 'throne'); T.owner = o; T.by = undefined;
  for (const b of G.blds) if (b.citadel && b.hp > 0) { b.owner = o; b.by = undefined; }
  for (const u of G.units) if (u.native && u.hp > 0) { if (sworn) { u.owner = o; u.native = false; u.state = 'home'; } else { u.hp = 0; u.gone = true; } }
  G.throne = { owner: o, since: G.t }; G.navDirty = true; qcDrop();
  say(o === 0 ? (sworn ? 'The Natives swear: the Throne is yours.' : 'The Throne is yours. Hold it.') : `${G.P[o].name} ${sworn ? 'were sworn' : 'took'} the Throne!`, o === 0 ? 'good' : 'warn', 10, T); sfx(o === 0 ? 'win' : 'horn');
  if (was !== WILD && was !== o && G.P[was]) G.P[was].wave = null;
}
// Traps: hidden buildings (pits, nets, stakes) of any side. A foe who steps on one springs it; a scout within reach finds it for its side, who then step round it;
// allies walk free; a net takes a man, not an engine. The Natives keep four on each causeway and lay fresh ones while they hold the Throne.
const trapAt = (owner, kind, x, y) => { const b = mkBld(owner, kind, x, y, 1); b.seen = {}; G.blds.push(b); return b; };
function layTraps() {
  if (!throneB() || (G.throne && G.throne.owner !== WILD)) return;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const have = G.blds.filter(b => BLD[b.kind].trap && b.owner === WILD && b.hp > 0 && Math.sign(Math.round((b.x - MID) / 50)) === dx && Math.sign(Math.round((b.y - MID) / 50)) === dy).length;
    for (let i = have; i < NATIVE.traps; i++) { const d = THRONE.r + 20 + rnd(10, LAKE0.r - THRONE.r - 40), s = rnd(-THRONE.cause / 2 + 6, THRONE.cause / 2 - 6); trapAt(WILD, i % 2 ? 'net' : 'pit', MID + dx * d + dy * s, MID + dy * d + dx * s); }
  }
}
function trapsTick() {
  for (const b of G.blds) {
    if (!BLD[b.kind].trap || b.prog < 1 || b.hp <= 0) continue; const kind = BLD[b.kind].trap;
    unitsNear(b, NATIVE.scoutSees, v => {
      if (b.hp <= 0 || v.hp <= 0 || v.fly || v.herd || v.inside || v.owner === b.owner || friendly(v.owner, b.owner) || (v.owner === WILD && !v.horde)) return;
      if (v.kind === 'scout' && !b.seen[v.owner]) { b.seen[v.owner] = 1; if (v.owner === 0) say(`Your scout found ${kind === 'pit' ? 'a pit' : kind === 'net' ? 'a net' : 'stakes'} at ${coord(b.x, b.y)}.`, 'good', 5, b); return; }
      if (b.seen[v.owner] || dist(v, b) > NATIVE.trapR) return;
      b.hp = 0; b.gone = true; scarStrike(b.x, b.y);
      if (kind === 'pit') { v.hp -= v.max * NATIVE.pit; v.hurtT = G.t; v.stuck = G.t + NATIVE.stuck; if (v.owner === 0) say(`A pit! Your ${UNIT[v.kind].name.toLowerCase()} is hurt and stuck.`, 'warn', 5, b); else if (b.owner === 0) say(`Your pit took a ${UNIT[v.kind].name.toLowerCase()} of ${G.P[v.owner].name}.`, 'good', 4, b); }
      else if (kind === 'stakes') { v.hp -= v.max * (hasTag(v.kind, 'mounted') ? 0.45 : 0.25); v.hurtT = G.t; v.flashT = G.t; if (b.owner === 0) say(`Your stakes caught a ${UNIT[v.kind].name.toLowerCase()} of ${G.P[v.owner].name}.`, 'good', 4, b); }
      else if ((isSoldier(v) && !hasTag(v.kind, 'siege')) || v.kind === 'vil') takePrisoner(b.owner, v);
    });
  }
}
// Outlaw raids: every few minutes the camp nearest the side they regard least sends robbers at its drop-offs, who come back after a spell
function natRaid() {
  const N = natState(); if (G.t - N.raidT < NATIVE.raidEvery / (hz('horde') ? 2 : 1)) return;   // Hordes and gangs: twice as often N.raidT = G.t;
  const sides = G.P.filter(p => p.id !== WILD && p.alive && keepOf(p.id) && G.rel[p.id][WILD] === 'war').sort((a, b) => regardOf(a.id) - regardOf(b.id)); if (!sides.length) return;
  const q = sides[0], k = keepOf(q.id), camps = G.finds.filter(f => f.kind === 'camp' && !f.done && guardsLeft(f)).sort((a, b) => dist(a, k) - dist(b, k)); if (!camps.length) return;
  const f = camps[0], R = G.units.filter(u => u.find === f.id && u.hp > 0 && UNIT[u.kind].dmg).slice(0, NATIVE.raidN); if (!R.length) return;
  const mark = nearest(G.blds, f, b => b.owner === q.id && b.prog >= 1 && b.hp > 0 && BLD[b.kind].drop && b.kind !== 'keep') || k;
  for (const u of R) { u.camp = { x: u.hx, y: u.hy }; u.hx = mark.x; u.hy = mark.y; u.horde = true; u.back = G.t + NATIVE.raidSecs; }
  if (q.id === 0) say(`Outlaws ride for your ${bldName(0, mark.kind).toLowerCase()} (${coord(mark.x, mark.y)}).`, 'warn', 7, mark);
}
function nativesTick(dt) {
  if (G.tick % 10 === 5) trapsTick();
  if (G.tick % (NATIVE.relay * 30) === 900) layTraps();   // fresh traps for the Natives, every relay
  for (const u of G.units) if (u.back && G.t > u.back) { u.back = 0; u.horde = false; if (u.camp) { u.hx = u.camp.x; u.hy = u.camp.y; } }   // raiders go home
  if (G.tick % 150 !== 7) return;   // the rest every five seconds
  const N = natState(), T = throneB(), held = G.throne && G.throne.owner !== WILD;
  for (const p of G.P) if (p.id !== WILD && p.alive) { N.regard[p.id] += (NATIVE.regard0 - N.regard[p.id]) * NATIVE.decay / 100 * 5; natSync(p.id); }
  if (T && !held && G.units.filter(u => u.native && u.hp > 0).length < garrisonMax() && G.t - (N.grewT || 0) > NATIVE.regrow * (gunAge() ? NATIVE.gunRegrow : 1)) { N.grewT = G.t; natSpawn(T, rng() < 0.4 ? 'nativebow' : 'native'); }
  natRaid();
  prisonersTick();
  // the sworn handover: an ally with soldiers inside for a minute
  if (T && !held) for (const p of G.P) if (p.id !== WILD && p.alive && G.rel[p.id][WILD] === 'ally') {
    const n = G.units.filter(u => u.owner === p.id && isSoldier(u) && dist(u, T) < THRONE.r).length;
    if (n >= NATIVE.handoverMen) { N.handT[p.id] = (N.handT[p.id] || 0) + 5; if (p.id === 0 && N.handT[0] === 5) say(`Hold ${NATIVE.handoverMen} inside ${NATIVE.handover} s: they swear to you.`, 'good', 6); if (N.handT[p.id] >= NATIVE.handover) takeThrone(p.id, true); } else N.handT[p.id] = 0;
  }
  // the holder's score and the clock
  if (held && G.P[G.throne.owner].alive) G.P[G.throne.owner].gathered += THRONE.score * SCORE.wealth / 12;   // 50 score a minute, as wealth, in twelve beats
}
