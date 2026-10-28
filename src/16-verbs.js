// ═════ 16-verbs.js ═════
// ───────────────────────── What every button does: one table ─────────────────────────
// every button's verb, in one table
const ACT = {
  pause() { setPause(!G.paused); },
  spd(a) { G.speed = clamp(Number(a), 1, 3); $('spdPop').hidden = true; if (G.paused) setPause(false); paceBtn(); },   // from the speed drop-down under the play button
  again() { $('end').hidden = true; openCard({ type: 'setup' }); },
  free() { G.over = null; G.free = true; $('end').hidden = true; setPause(false); say('Free play: no clock, no victory.', '', 6); },
  next() { const p = G.P[0], keep = { age: p.age, techs: [...p.techs] }; $('end').hidden = true; newGame(undefined, keep); setPause(false); say('New land. Your age and research stay.', 'good', 8); saveGame(true); },
  close() { if (G.card && (G.card.type === 'resume' || G.card.type === 'setup') && G.paused) { setPause(false); } closeCard(); if (G.over) $('end').hidden = false; },   // backing out of New game brings the end screen back
  cancel() { cancelPlace(); },
  placeok() { commitPlace(); },
  help() { openCard({ type: 'help' }); },
  reload() { location.reload(); },
  vibe() { SET.vibe = !SET.vibe; saveSet(); feel('snap'); refresh(); },
  menu(a) { const keep = G.card && G.card.type === 'menu'; openCard({ type: 'menu', id: a }); if (keep) $('card').scrollTop = 0; },
  buildrow() { G.buildAt = null; G.buildBy = null; if (G.card && G.card.type === 'menu') closeCard(); else openCard({ type: 'menu', id: G.lastMenu || MENUS[0].id }); },   // Build opens the Build card on the menu last used; again, it closes
  towncard() { const k = keepOf(0); if (k) openCard({ type: 'bld', id: k.id }); },
  unvil() { if (!unTrain(0, 'vil')) say('Nobody is waiting to train.', '', 3); },
  idlego() { const u = unitsOf(0, 'vil').find(v => !v.job); if (!u) return; cam.x = u.x; cam.y = u.y; clampCam(); closeCard(); },
  seek(a) { const o = Number(a), k = keepOf(o) || G.blds.find(b => b.owner === o); if (!k) { say('Nothing of theirs stands.', '', 3); return; } cam.x = k.x; cam.y = k.y; clampCam(); if (k.kind === 'keep') { G.card = null; openCard({ type: 'bld', id: k.id }); } else closeCard(); },
  guide(a) { openCard({ type: 'guide', page: a }); },
  copy(id) { const t = histRows().find(x => x.id === id); if (t) clip(histText(t)); },
  copyhist() { clip(`First Keep history (build ${BUILD}). ${HIST_NOTE}\n\n` + histRows().map(histText).join('\n')); },
  info() { G.infoOpen = !G.infoOpen; cardSig = ''; renderCard(); },
  map() { SET.mini = !SET.mini; saveSet(); applyMini(); },
  home() { const k = keepOf(0); if (k) { cam.x = k.x; cam.y = k.y; clampCam(); } },
  resume() { const S = readSave(); if (S) loadGame(S); else { closeCard(); setPause(false); } refresh(); },
  fresh() { clearSave(); holdSave = false; newGame(); closeCard(); setPause(false); saveGame(true); refresh(); },
  newgame() { if (G.confirm === 'new') { openCard({ type: 'setup' }); return; } G.confirm = 'new'; refresh(); },
  civ(a) { SET.civ = a; saveSet(); refresh(); },
  diff(a) { SET.diff = a; G.diff = a; saveSet(); refresh(); },
  mode(a) { SET.mode = a; saveSet(); refresh(); },
  fantasy(a) { SET.fantasy = a === '1'; saveSet(); refresh(); },
  hzq(a) { G.hzQ = G.hzQ === a ? null : a; refresh(); },   // the ? beside a hazard: what it does, one at a time
  hz(a) { SET.hz = { ...(SET.hz || HZ_DEFAULT) }; SET.hz[a] = SET.hz[a] ? 0 : 1; saveSet(); refresh(); },   // a hazard on or off; the points add up to the level
  today() { clearSave(); holdSave = false; newGame(todaySeed()); closeCard(); setPause(false); saveGame(true); refresh(); say(`Challenge of the day: level ${levelOf(G.hz)}.`, 'good', 8); },
  tips() { SET.tips = !SET.tips; saveSet(); refresh(); },
  msgs() { SET.msgs = SET.msgs === false; saveSet(); refresh(); },
  news() { SET.news = SET.news === false; saveSet(); refresh(); },
  fog() { SET.fog = !SET.fog; saveSet(); refresh(); },
  cardpause() { SET.cardPause = SET.cardPause === false; saveSet(); refresh(); },
  dockmin() { SET.dockMin = !SET.dockMin; saveSet(); ui(true); },
  dock(a) { G.sel = a === 'all' ? 'all' : Number(a); setPick(orderSet().map(u => ({ t: 'unit', id: u.id }))); feel('tick'); },   // the dock: a battalion picked in one tap; the pick bar then carries Charge, Fall back and Teach
  tkmin() { SET.tkMin = !SET.tkMin; saveSet(); G.tkN = 0; G.tkW = false; G.tkOpen = false; ui(true); fit(); },   // hide or show the ticker
  qlock(id) { const t = TECHBY[id]; say(`Research ${t.name} at the ${BLD[t.at].name} for more slots.`, '', 5); },
  tkclear() { G.log = []; G.tkOpen = false; G.tkN = 0; ui(true); },
  tklist() { G.tkOpen = !G.tkOpen && G.log.length > 0; ui(true); },   // the last five
  hush(a) { const t = decodeURIComponent(a || ''), k = hushKey(t), m = G.log.find(x => x.text === t);
    if (m && m.cls === 'warn') (G.hushW = G.hushW || {})[k] = G.t + 120; else { (SET.hush = SET.hush || {})[k] = 1; saveSet(); }
    G.log = G.log.filter(x => hushKey(x.text) !== k); ui(true); },
  unhush() { SET.hush = {}; G.hushW = {}; saveSet(); refresh(); },
  sound() { SND.on = !SND.on; saveSnd(); sndInit(); sfx('tap'); muteBtn(); refresh(); },
  soundpage() { openCard({ type: 'sound' }); },
  // one step rule for every volume: tenths, 0 to 100%
  vol(a) { const [k, d] = a.split(','), step = v => clamp(Math.round((v + (d === '+' ? 0.1 : -0.1)) * 10) / 10, 0, 1);
    if (k === 'all') SND.vol = step(SND.vol); else SET.mix[k] = step(SET.mix[k]); saveSnd(); sndInit(); sfx(k === 'amb' ? 'bird' : k === 'alert' ? 'ready' : 'tap'); refresh(); },
  jump(a) { const [x, y] = a.split(',').map(Number); cam.x = x; cam.y = y; clampCam(); },
  card(a) { openCard({ type: a }); },
};
// orders that change the game: refused once it is over
const PLAY = {
  job(a) { G.P[0].rally = a; unitsOf(0, 'vil').forEach(u => { if (!u.job) u.job = a; }); },
  move(a) { if (!unitsOf(0, 'vil').some(u => !u.job)) { say('Nobody is idle. Use − on another job.', '', 3); return; } moveVil(0, a); }, less(a) { moveVil(0, a, true); },
  mtab(a) { G.mtab = a; },
  ktab(a) { G.ktab = a; },
  sel(a) { G.sel = a === 'all' ? 'all' : Number(a); },
  sendto(a) { const [f, x, y] = a.split(','), to = { x: Number(x), y: Number(y) }, S = sendPick(/^(q|h|all|n\d+)$/.test(f) ? f : Number(f), to);
    S.forEach(u => { u.state = 'goto'; u.px = to.x; u.py = to.y; u.idleT = 0; u.focus = null; }); march(S, to, coord(to.x, to.y)); if (S.length) ripple(to.x, to.y, '#ffd35e'); hideStrip(); },
  nostrip() { hideStrip(); },
  striparmy() { const s = G.stripAt; if (s) showStrip(s.sx, s.sy, s.x, s.y, 1); },
  stripmore() { const s = G.stripAt; if (s) showStrip(s.sx, s.sy, s.x, s.y, 2); },
  buildhere(a) { const [x, y] = a.split(',').map(Number), hint = suggestAt(x, y), M = hint && MENUS.find(m => m.items.includes(hint)); hideStrip(); G.buildAt = { x, y, hint }; openCard({ type: 'menu', id: M ? M.id : G.lastMenu || MENUS[0].id }); },   // the hammer on open ground: the menu, on what fits there
  more(a) { const [x, y] = a.split(',').map(Number); openCard({ type: 'ground', x, y }); },
  qsfrom(a) { G.qs.from = a === 'all' ? 'all' : Number(a); },
  qsn(a) { const [k, d] = a.split(','), have = qsPool().filter(u => u.kind === k).length, cur = Math.min(have, G.qs.n[k] ?? have); G.qs.n[k] = clamp(cur + (d === '+' ? 1 : -1), 0, have); },
  qgo(a) { const [x, y] = a.split(',').map(Number), S = qsPick({ x, y }); S.forEach(u => { u.state = 'goto'; u.px = x; u.py = y; u.idleT = 0; u.focus = null; }); march(S, { x, y }, coord(x, y)); if (S.length) ripple(x, y, '#ffd35e'); closeCard(); },
  qatk(a) { const b = G.blds.find(x => x.id === Number(a) && x.hp > 0); if (!b) return; const S = qsPick(b); S.forEach(u => { u.state = 'attack'; u.target = b.owner; u.bid = b.id; u.focus = null; }); march(S, b, `the ${bldName(b.owner, b.kind)} of ${G.P[b.owner].name}`); if (S.length) ripple(b.x, b.y, '#ff8a70'); closeCard(); },
  qfoe(a) { const v = G.units.find(x => x.id === Number(a) && x.hp > 0); if (!v) return; const S = qsPick(v); S.forEach(u => { u.state = 'goto'; u.px = v.x; u.py = v.y; u.idleT = 0; u.focus = v; }); march(S, v, G.P[v.owner].name); if (S.length) ripple(v.x, v.y, '#ff8a70'); closeCard(); },
  bned(a) { G.bnEdit = Number(a); },
  muster(a) { const i = Number(a); if (muster(0, musterGap(i), i)) sfx('place'); else sfx('err'); },
  bnn(a) { const [k, d] = a.split(','), P = G.bnPlan[G.bnEdit], cur = P[k] || 0, st = d === '+' ? (cur < 10 ? 1 : 5) : (cur <= 10 ? 1 : 5); const others = Object.entries(P).reduce((n, [q, v]) => n + (q === k ? 0 : v), 0); P[k] = clamp(cur + (d === '+' ? st : -st), 0, Math.max(cur, BNSIZE - others)); if (!P[k]) delete P[k]; rebattalion(); },   // a battalion holds BNSIZE at most, every kind together
  bnstance() { const i = G.bnEdit; G.stance[i] = ((G.stance[i] || 0) + 1) % STANCE.length; },
  bnform() { const i = G.bnEdit; G.form[i] = ((G.form[i] || 0) + 1) % FORM.length; },
  sendvil(a) { sendVil(0, Number(a)); },
  boxcut(a) { if (G.card && G.card.type === 'box') boxCut(G.card.r, Number(a)); closeCard(); },
  unpick() { setPick([]); },
  pmore() { G.pickMore = !G.pickMore; ui(true); },   // + More: each tap on your people adds or drops one; Done stops
  pjob(j) { for (const u of picked()) if (u.kind === 'vil') { setJob(u, j); u.pj = null; u.post = null; u.idleT = 0; } say(`To ${j}.`, '', 2); setPick([]); },
  pbuild() { G.buildBy = picked().filter(u => u.kind === 'vil').map(u => u.id); setPick([]); openCard({ type: 'menu', id: G.lastMenu || MENUS[0].id }); },   // whatever you place next, the picked villagers raise it
  phold() { for (const u of picked()) if (isSoldier(u)) { u.state = 'goto'; u.px = u.x; u.py = u.y; u.focus = null; u.tgt = null; u.idleT = 0; } say('Holding here.', '', 2); },
  pvil() { setPick(picked().filter(u => u.kind === 'vil').map(u => ({ t: 'unit', id: u.id }))); },
  pcharge() { const S = picked(); if (!charge(0, S)) say(chargeWhy(0, S) || 'Not now.', '', 3); },
  pfall() { fallBack(0, picked()); },
  pteach() { const S = picked().filter(u => isSoldier(u) && teachTo(u)); let n = 0, why = null; for (const u of S) { if (teach(0, u)) n++; else why = why || teachWhy(0, u); } say(n ? `${n} to the School.` : why || 'Nobody here can be taught.', n ? 'good' : '', 3); },
  teach(id) { const u = G.units.find(x => x.id === +id); if (u && !teach(0, u)) say(teachWhy(0, u) || 'Not now.', '', 3); },
  charge() { const S = orderSet(), bn = G.sel === 'all' ? undefined : G.sel; if (!charge(0, S, bn)) say(chargeWhy(0, S, bn) || 'Not now.', '', 3); },
  fallback() { fallBack(0, orderSet(), G.sel === 'all' ? undefined : G.sel); closeCard(); },
  // relations and a lord's hand: one verb each, the reason on the card when it cannot be done
  rel(a) { const [q, want] = a.split(','); if (!setRel(0, Number(q), want)) say(relWhy(0, Number(q), want) || 'Not now.', '', 3); },
  breakties(a) { if (G.confirm !== 'bt' + a) { G.confirm = 'bt' + a; return; } G.confirm = null; breakTies(0, Number(a)); },
  demand(a) { const [q, r] = a.split(','); if (!demand(0, Number(q), r)) say(demandWhy(0, Number(q), r) || 'Not now.', '', 3); },
  tribute(a) { if (!forceTribute(0, Number(a))) say(tributeWhy(0, Number(a)) || 'Not now.', '', 3); },
  levy(a) { const [q, n] = a.split(',').map(Number); if (!levy(0, q, n === 0 ? Math.ceil(soldiersOf(q).length * DEMAND.levyMax) : n)) say(levyWhy(0, q, n || 1) || 'Not now.', '', 3); },
  release(a) { releaseAll(0, Number(a)); },
  qcancel(a) { const [b, i] = a.split(',').map(Number), B = G.blds.find(x => x.id === b); if (B && cancelOrder(0, B, i)) sfx('err'); },
  sellat(a) { const [f, k] = a.split(','), F = G.finds.find(x => x.id === Number(f)); if (F && F.owner === 0) { F.sell = F.sell || Object.fromEntries(WARES.map(w => [w, 1])); F.sell[k] = F.sell[k] ? 0 : 1; } },
  debase() { if (!debase(0)) say('Needs a finished Mint, once a game.', '', 3); },
  surrender(a) { demandSurrender(0, Number(a)); closeCard(); },
  overlord(a) { if (!offerOverlord(0, Number(a))) say(overlordWhy(0, Number(a)) || 'Not now.', '', 3); },
  tax(a) { const [q, t] = a.split(','), P = G.P[Number(q)]; if (P && P.lord === 0 && TAX[t]) { P.tax = t; say(`Tax on ${P.name}: ${t}.`, '', 3); } },
  venture(a) { if (!venture(0, Number(a))) say('Needs Medieval age, gold; 3 at most.', '', 4); },
  douse(a) { const b = G.blds.find(x => x.id === Number(a) && x.owner === 0); let n = 0; if (b && b.fire > 0) for (let i = 0; i < 2; i++) { const v = pickVil(0, b, null, b); if (v) { if (v.job !== 'repair') v.pj = v.job; setJob(v, 'repair'); v.rep = b; v.fireman = true; n++; } } G.log = G.log.filter(m => m.act !== 'douse:' + a); if (n) say(`${n} more run to the fire.`, '', 3); else if (b && b.fire > 0) say('No villager is free.', '', 3); },
  tpost(a) { const f = G.finds.find(x => x.id === Number(a)); if (!f) return; const why = canPlace(0, 'tpost', f.x, f.y); if (why) { say(why + '.', '', 3); return; } if (!afford(G.P[0], BLD.tpost.cost)) { say(`Not enough: ${costText(BLD.tpost.cost)}.`, '', 3); return; } if (G.P[0].age < BLD.tpost.age) { say('Trade posts need the Bronze age.', '', 3); return; } build(0, 'tpost', f.x, f.y); say('A villager sets out to build the trade post.', '', 4); },
  want(a) { const f = G.finds.find(x => x.id === Number(a)); if (f && f.owner === 0) { f.want = WARES[(WARES.indexOf(f.want) + 1) % WARES.length]; } },
  route(a) { const [cid, s, id] = a.split(','), c = G.units.find(u => u.id === Number(cid) && u.owner === 0), t = s === 's' ? G.finds.find(f => f.id === Number(id)) : G.blds.find(b => b.id === Number(id)); if (c && t) { if (!homeBiz(0, c)) { say('Build a Market first.', '', 4); return; } setRoute(c, t, true, s === 's'); say('The caravan runs the route on repeat.', '', 3); } },
  make(a) { const [b, t] = a.split(','), B = G.blds.find(x => x.id === Number(b) && x.owner === 0); if (B) setMake(B, t); },
  routeto(a) { const f = G.finds.find(x => x.id === Number(a)); if (!f || !homeBiz(0, f)) { say('Build a Market first.', '', 4); return; } const c = unitsOf(0, 'caravan').sort((p, q) => (!!p.route - !!q.route) || dist(p, f) - dist(q, f))[0]; if (!c) { say('No caravan: train one at the Market.', '', 3); return; } setRoute(c, f, true, true); say('A caravan takes the route, on repeat.', '', 3); },
  rrep(a) { const c = G.units.find(u => u.id === Number(a)); if (c && c.route) c.route.rep = !c.route.rep; },
  rsp(a) { const c = G.units.find(u => u.id === Number(a)); if (c && c.route) c.route.spice = !c.route.spice; },
  rclr(a) { const c = G.units.find(u => u.id === Number(a)); if (c) { c.route = null; c.dest = null; } }, sendbld(a) { sendBuild(0, Number(a)); }, buildat(a) { const [v, s] = a.split(',').map(Number); sendBuild(0, s, v); }, hunt(a) { sendHunt(0, Number(a)); }, repair(a) { sendRepair(0, Number(a)); },
  takedown(a) { const id = Number(a), b = G.blds.find(x => x.id === id && x.owner === 0); if (b && b.kind !== 'keep') { if (BLD[b.kind].wallish || b.prog < 0.15 || G.confirm === id) { demolish(0, id); G.confirm = null; closeCard(); } else G.confirm = id; } },
  train(a) { if (!train(0, a)) say(trainWhy(0, a) || 'Not now.', '', 3); },
  tech(a) { if (!research(0, a)) say(researchWhy(0, a) || 'Not now.', '', 3); },
  age() { ageUp(0); }, build(a) { startPlace(a); },
  scoutgo(a) { const [x, y] = a.split(',').map(Number), s = unitsOf(0, 'scout')[0]; if (s) { s.state = 'goto'; s.px = x; s.py = y; say('The scout rides out.', '', 3); } closeCard(); },
  rally(a) { const [x, y] = a.split(',').map(Number); G.rally0 = G.rally0 ? null : { x, y }; },
  recall() { orderSet().forEach(u => { u.state = 'home'; u.fid = null; }); closeCard(); },
  attack(a) {
    const target = a === 'near' ? foeNearest() : Number(a);
    if (target !== null) { orderSet().forEach(u => { u.state = 'attack'; u.target = target; u.bid = null; }); say(`Marching on the ${G.P[target].name}.`, '', 3); }
    closeCard();
  },
  gift(a) { const [q, amt] = a.split(',').map(Number); if (!giveGift(0, amt)) say(giftWhy(0, amt) || 'Not now.', '', 3); },
  ransom(a) { if (!payRansom(0, Number(a))) say('Not enough gold.', '', 3); },
  vjob(a) { const [id, j] = a.split(','), u = G.units.find(x => x.id === Number(id)); if (u && u.owner === 0) { setJob(u, u.job === j ? null : j); u.pj = null; u.idleT = 0; } },
  vgo(a) { const u = G.units.find(x => x.id === Number(a)); if (!u) return; if (G.confirm !== 'v' + u.id) { G.confirm = 'v' + u.id; return; } G.confirm = null; setJob(u, null); u.hp = 0; u.gone = true; say('A villager was sent home.', '', 3); closeCard(); },
  dismiss() { const v = unitsOf(0, 'vil').sort((a, b) => a.carry - b.carry)[0]; if (v) { setJob(v, null); v.hp = 0; v.gone = true; say('A villager was sent home.', '', 3); } },
  sab(a) { const b = G.blds.find(x => x.id === Number(a)), sp = b && unitsOf(0, 'spy').filter(u => u.state !== 'sab').sort((x, y) => dist(x, b) - dist(y, b))[0]; if (!b || !BLD[b.kind].sab || !sp) { say(!sp ? 'You have no free spy.' : 'That cannot be sabotaged.', '', 3); return; } sp.state = 'sab'; sp.tid = b.id; say('A spy slips away to sabotage it.', '', 4); closeCard(); },
  spygo(a) { const [x, y] = a.split(',').map(Number), sp = unitsOf(0, 'spy').filter(u => u.state !== 'sab').sort((p, q) => dist(p, { x, y }) - dist(q, { x, y }))[0]; if (!sp) { say('You have no free spy.', '', 3); return; } sp.state = 'goto'; sp.px = x; sp.py = y; say('A spy goes to look.', '', 3); closeCard(); },
  shrine(a) { const f = G.finds.find(x => x.id === Number(a)), pr = f && unitsOf(0, 'priest').sort((p, q) => dist(p, f) - dist(q, f))[0]; if (!pr) { say('You have no priest: Build → Temple.', '', 3); return; } pr.state = 'shrine'; pr.fid = f.id; say('A priest walks to the shrine.', '', 3); closeCard(); },
  hire(a) { const f = G.finds.find(x => x.id === Number(a)); if (f && !hire(0, f)) say(hireWhy(0, f), '', 3); },
  guard(a) { const [t, i] = a.split(','), id = Number(i), at = t === 'f' ? G.finds.find(f => f.id === id) : G.units.find(v => v.id === id); if (!at) return;
    const room = POST.guard - guardsOf(t, id).length, S = sendable().sort((p, q) => dist(p, at) - dist(q, at)).slice(0, Math.max(0, Math.min(4, room)));
    S.forEach(u => { u.state = 'escort'; u.esc = null; u.focus = null; if (t === 'f') { u.escF = id; u.escId = undefined; } else { u.escId = id; u.escF = undefined; } }); if (S.length) ripple(at.x, at.y, '#ffd35e'); },
  unguard(a) { const [t, i] = a.split(','); guardsOf(t, Number(i)).forEach(u => { u.state = 'home'; u.esc = null; u.escId = u.escF = undefined; }); },
  trade(a) { const [dir, k] = a.split(':'); if (!marketTrade(0, k, dir)) say(dir === 'sell' ? 'Not enough to sell.' : 'Not enough gold.', '', 3); },
  stance() { const cur = G.sel === 'all' ? (G.stance.every(x => x === G.stance[0]) ? G.stance[0] : -1) : G.stance[G.sel], nx = (cur + 1) % STANCE.length; if (G.sel === 'all') G.stance = Array(BNS + 1).fill(nx); else G.stance[G.sel] = nx; },
  hold() { const on = G.sel === 'all' ? !G.hold.every(x => x) : !G.hold[G.sel]; if (G.sel === 'all') G.hold = Array(BNS + 1).fill(Number(on)); else G.hold[G.sel] = Number(on); },
  zeal() { if (!zeal(0, orderSet())) say(zealWhy(0, orderSet()) || 'Not now.', '', 3); },
};
function act(a) {
  const [verb, arg] = a.split(/:(.*)/s);
  if (ACT[verb]) { ACT[verb](arg); return; }
  if (G.over || !PLAY[verb]) return;
  PLAY[verb](arg); learnAct(verb, arg); refresh();
}
// Hints retire once learned: each counts the times you did what it teaches, kept on this phone; at 3 it is not shown again. Warnings (hunger, fire, plague, unrest) always show.
const L = k => ((SET.learned || {})[k] || 0) >= 3;
function learn(k) { SET.learned = SET.learned || {}; if ((SET.learned[k] || 0) >= 3) return; SET.learned[k] = (SET.learned[k] || 0) + 1; saveSet(); }
function learnAct(verb, arg) {
  if (verb === 'train') learn('train:' + arg);
  else if (verb === 'move' || verb === 'job') { learn('job'); learn('job:' + arg); }
  else if (verb === 'sendvil') { learn('job'); const n = G.nodes.find(x => x.id === Number(arg)); if (n) learn('job:' + (n.kind === 'farm' && n.type === 'food' ? 'field' : n.type)); }
  else if (['sendbld', 'buildat', 'age', 'trade'].includes(verb)) learn(verb === 'buildat' ? 'sendbld' : verb);
}
document.addEventListener('click', e => { const el = e.target.closest('[data-act]'); if (!el) return; e.stopPropagation(); sndInit(); sfx('tap'); act(el.dataset.act); });
for (const ev of ['pointerup', 'touchend']) document.addEventListener(ev, sndInit, { passive: true });   // Safari unlocks audio on the finger lifting, not landing
