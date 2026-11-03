# The combat batch (Build 80, Nov 1): C1 to C9 with N4 and N5, item 5 (own spots at a tapped point and out of a building) and item 6 (the
# computers' waiting villagers). Each check fails on e4d0c82, the build before it. Run by the gate:  python3 tests/combat.py
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = """() => {
  const F = window.__fk, bad = [], T = 1 / 30, W = () => F.G.P.length - 1;
  const T_ = (f) => { try { f(); } catch (e) { bad.push('a check stopped: ' + e.message); } }; // one check's crash does not hide the others
  const run = (secs) => { for (let i = 0; i < secs * 30; i++) F.step(T); };
  const fresh = (seed = 7) => { F.newGame(seed); F.act('close'); F.setPause(false); const G = F.G; G.fogOn = false; G.ev.next = 1e9; G.ev.cur = null;
    for (const u of G.units) if (u.kind === 'vil') { u.job = null; u.node = null; u.hunt = null; u.post = { x: u.x, y: u.y }; }
    F.step(T); return G; };
  // open ground near home (150 to 400 from your Town Center, far from the Throne): the point farthest from every building and unit, off water
  const open = (G) => { const k = F.keepOf(0); let best = 0, P = null; for (let x = 100; x < F.MAP - 100; x += 20) for (let y = 100; y < F.MAP - 100; y += 20) {
      const dk = Math.hypot(x - k.x, y - k.y); if (dk < 150 || dk > 400 || F.blockedCell(F.gcell(x, y), 0) || G.lakes.some((L) => Math.hypot(L.x - x, L.y - y) < L.r + 40)) continue; const m = Math.min(...G.blds.map((b) => Math.hypot(b.x - x, b.y - y)), ...G.units.map((u) => Math.hypot(u.x - x, u.y - y)));
      if (m > best) { best = m; P = { x, y }; } } return P; };
  const clear = (G, P, r) => { for (const u of G.units) if (Math.hypot(u.x - P.x, u.y - P.y) < r) { u.hp = 0; u.gone = true; } G.units = G.units.filter((u) => u.hp > 0); };

  // ── C1: one hostility test. At peace with the Natives, the rest of the wild is still a foe; the Natives follow relations ──
  T_(() => { const G = fresh(), w = W(), P = open(G); clear(G, P, 300); G.rel[0][w] = G.rel[w][0] = 'peace';
    const sp = F.addUnit(0, 'spear', P.x, P.y), v = F.addUnit(0, 'vil', P.x + 40, P.y), wf = F.addUnit(w, 'wolf', P.x + 45, P.y); wf.hx = wf.x; wf.hy = wf.y; wf.tgt = v;
    if (F.nearestFoe(0, sp, 200) !== wf) bad.push('C1: at peace with the Natives, a soldier does not defend a villager from a wolf it sees');
    wf.hp = 0; G.units = G.units.filter((u) => u.hp > 0);
    const bd = F.addUnit(w, 'bandit', P.x + 50, P.y);
    if (F.nearestFoe(0, sp, 200) !== bd) bad.push('C1: at peace with the Natives, a bandit is not a foe');
    bd.horde = true; const h = F.mkBld(0, 'house', P.x + 80, P.y, 1); G.blds.push(h);
    if (F.nearestFoeBld(w, bd, undefined, 200) !== h) bad.push('C1: at peace with the Natives, the horde leaves buildings alone');
    bd.hp = 0; G.units = G.units.filter((u) => u.hp > 0);
    const na = F.addUnit(w, 'native', P.x + 50, P.y); na.native = true;
    if (F.nearestFoe(0, sp, 200) === na) bad.push('C1: a Native at peace is taken for a foe');
    G.rel[0][w] = G.rel[w][0] = 'war'; if (F.nearestFoe(0, sp, 200) !== na) bad.push('C1: a Native at war is not a foe');
    // the Natives' pits and nets, their walls and towers go by relations too: allied, none is a foe; at war, all are
    G.rel[0][w] = G.rel[w][0] = 'ally'; na.hp = 0; G.units = G.units.filter((u) => u.hp > 0); G.blds = G.blds.filter((b) => b !== h);
    const pit = F.mkBld(w, 'pit', P.x + 40, P.y, 1); G.blds.push(pit); const ram = F.addUnit(0, 'ram', P.x + 20, P.y);
    if (F.isFoe(0, pit) || F.nearestFoeBld(0, ram, undefined, 200) === pit) bad.push("C1: allied with the Natives, their pit is a foe");
    const tw = G.blds.find((b) => b.citadel && b.kind === 'tower'); if (tw && F.isFoe(0, tw)) bad.push("C1: allied with the Natives, their tower is a foe");
    G.rel[0][w] = G.rel[w][0] = 'war'; if (!F.isFoe(0, pit)) bad.push('C1: at war with the Natives, their pit is not a foe'); });

  // ── N4 / C4: half strength and no nerve for an animal only (the kind); a bandit, a Native and a citadel tower hit full and shake it ──
  T_(() => { const G = fresh(), w = W(), P = open(G); clear(G, P, 300);
    const t = F.addUnit(0, 'spear', P.x, P.y), blow = (a) => { t.hp = t.max; t.mor = 1; t.tgt = null; F.hurt(w, a, t, 10); return [t.max - t.hp, 1 - t.mor]; };
    const wf = F.addUnit(w, 'wolf', P.x + 10, P.y), bd = F.addUnit(w, 'bandit', P.x + 10, P.y + 2), na = F.addUnit(w, 'native', P.x + 10, P.y - 2); na.native = true;
    const [dw, mw] = blow(wf), [db, mb] = blow(bd), [, mn] = blow(na), [dt, mt] = blow(null);
    if (Math.abs(db - dw / F.MORALE.wild) > 1e-6) bad.push('C4: a bandit hits ' + db.toFixed(2) + ', a wolf ' + dw.toFixed(2) + ': not full against half');
    if (mw !== 0) bad.push('C4: a wolf shakes the nerve');
    if (!(mb > 0) || !(mn > 0) || !(mt > 0)) bad.push('C4: a bandit, a Native or a citadel tower does not shake the nerve (' + [mb, mn, mt].map((x) => x.toFixed(3)) + ')');
    if (Math.abs(dt - 10) > 1e-6 && Math.abs(dt - 10 * F.stats(0, 'spear').armor) > 1e-6) bad.push('C4: a citadel tower hits at ' + dt.toFixed(2) + ' of 10'); });

  // ── C3 and C5: a lone man engaged takes a blow from behind as from behind; the nerve is drained from the blow that lands ──
  T_(() => { const G = fresh(), P = open(G); clear(G, P, 300); G.rel[0][1] = G.rel[1][0] = 'war';
    const t = F.addUnit(0, 'spear', P.x, P.y), e = F.addUnit(1, 'sword', P.x + 10, P.y), a = F.addUnit(1, 'sword', P.x - 10, P.y); t.fx = 1; t.fy = 0; t.tgt = e;
    const f = F.fromWhere(t, a); if (!(f < -0.99)) bad.push('C3: a lone soldier engaged reads a blow from behind as ' + f.toFixed(2) + ', not from behind');
    const c = F.addUnit(0, 'spear', P.x + 35, P.y); c.fx = 1; c.fy = 0; // a comrade in the line, not covering the back
    const ratio = (eng) => { t.hp = t.max; t.mor = 1; t.tgt = eng ? e : null; F.hurt(1, a, t, 10); return (1 - t.mor) / (t.max - t.hp); };
    const front = ratio(false), rear = ratio(true);
    if (Math.abs(rear / front - F.MORALE.rear) > 1e-6) bad.push('C5: the nerve lost a point of damage from behind is ' + (rear / front).toFixed(3) + ' times the front, not ' + F.MORALE.rear + ' (drained before the flank)'); });

  // ── C2: a group's strength counts the soldier itself ──
  T_(() => { const G = fresh(), P = open(G); clear(G, P, 300); const s1 = F.addUnit(0, 'sword', P.x, P.y); G.tick++; const one = F.groupPower(s1);
    F.addUnit(0, 'sword', P.x + 10, P.y); G.tick++; const two = F.groupPower(s1);
    if (Math.abs(two - 2 * one) > 1e-6 || Math.abs(one - F.unitPower(s1)) > 1e-6) bad.push('C2: one sword ' + one.toFixed(1) + ', two swords ' + two.toFixed(1) + ' (two should be twice one)'); });

  // ── C6: Engagement does not erase the grace before a runner can be taken ──
  T_(() => { const G = fresh(), P = open(G); clear(G, P, 300); G.rel[0][1] = G.rel[1][0] = 'war'; G.P[1].techs.add('engage');
    const b = F.addUnit(1, 'spear', P.x, P.y), a = F.addUnit(0, 'spear', P.x + 5, P.y);
    G.tick = 4 * 1000 - (b.id % 4); b.mor = 0; b.tgt = a; F.solTick(b, T, 1); // engaged: the nerve does not settle back
    if (b.state !== 'rout') bad.push('C6: the test soldier did not break');
    else { G.tick = 4 * 1000 + 1 - (a.id % 4); a.tgt = b; a.state = 'home'; a.x = b.x + 5; a.y = b.y; F.solTick(a, T, 1);
      if (b.hp <= 0) bad.push('C6: with Engagement, a runner was taken the moment it broke (no ' + F.MORALE.capAfter + ' s to get away)');
      else { G.t += F.MORALE.capAfter + 0.5; a.tgt = b; a.x = b.x + 5; a.y = b.y; F.solTick(a, T, 1); if (b.hp > 0) bad.push('C6: a runner within reach after the grace was not taken'); } } });

  // ── C7 (N5, behaviour unchanged): a half-dead swordsman at a hospital is at 95% of full in τ ln 10 ──
  T_(() => { const G = fresh(), P = open(G); clear(G, P, 300); const H = F.mkBld(0, 'hospital', P.x, P.y, 1); G.blds.push(H);
    const s = F.addUnit(0, 'sword', P.x + F.halfOf(H) + 12, P.y), want = (s.max / F.BLD.hospital.heal) * Math.log(10); s.hp = s.max / 2; s.state = 'home';
    let t = 0; while (s.hp < 0.95 * s.max && t < 200) { s.x = P.x + F.halfOf(H) + 12; s.y = P.y; s.tgt = null; F.step(T); t += T; }
    if (Math.abs(t - want) > 0.5) bad.push('C7: a half-dead swordsman at a hospital is 95% healed in ' + t.toFixed(1) + ' s, not tau ln 10 = ' + want.toFixed(1) + ' s'); });

  // ── C8: a convert loses the Native mark and keeps to the ceiling ──
  T_(() => { const G = fresh(), w = W(), P = open(G); clear(G, P, 300); G.rel[0][w] = G.rel[w][0] = 'war';
    const p = F.addUnit(0, 'priest', P.x, P.y), n = F.addUnit(w, 'native', P.x + 10, P.y); n.native = true;
    const go = (t) => { p.state = 'convert'; p.cv = t.id; p.cvT = 1e9; p.cvCd = 0; F.priestTick(p, T, 1); };
    go(n); if (n.owner !== 0) bad.push('C8: the test conversion did not happen'); else if (n.native) bad.push('C8: a converted warrior keeps the Native mark');
    const n2 = F.addUnit(w, 'native', P.x + 12, P.y); n2.native = true; G.P[0].capA = F.clsCount(0, 'army') - F.armyRoom(0) + (G.P[0].capA || 0);
    go(n2); if (n2.owner === 0) bad.push('C8: a priest converted past the army ceiling (' + F.clsCount(0, 'army') + ' of ' + F.armyRoom(0) + ')'); });

  // ── C9: a wild attacker's reach to a building is measured once; a petard's splash pays its plunder ──
  T_(() => { const G = fresh(), w = W(), P = open(G); clear(G, P, 300);
    const h = F.mkBld(0, 'house', P.x, P.y, 1); G.blds.push(h); const half = F.halfOf(h), bd = F.addUnit(w, 'bandit', P.x + half + F.UNIT.bandit.rng + 8, P.y);
    bd.hx = bd.x; bd.hy = bd.y; bd.tgt = h; bd.cd = 0; G.tick = 5 * 1000 + 1 - (bd.id % 5); const hp = h.hp; F.wildTick(bd, T, 1);
    if (h.hp < hp) bad.push('C9: a bandit ' + (F.UNIT.bandit.rng + 8) + ' from a wall struck it (reach ' + F.UNIT.bandit.rng + ')');
    const h2 = F.mkBld(0, 'house', P.x, P.y + 30, 1), h3 = F.mkBld(0, 'house', P.x + 30, P.y + 30, 1); G.blds.push(h2, h3); F.learnTech(1, 'petards'); F.fxDirty();
    const g = F.addUnit(1, 'arquebus', P.x, P.y + 120); F.hurt(1, g, h2, 10);
    if (h3.by !== 1) bad.push("C9: a petard's splash on a neighbour records no attacker, so its plunder is never paid"); });

  // ── item 5: villagers sent to a tapped point each stand on their own spot; one out of a building steps onto a free spot of its outline ──
  for (const seed of [1, 3, 4, 6, 7, 9]) T_(() => { const G = fresh(seed), P = open(G); clear(G, P, 120); const k = F.keepOf(0), V = []; // six seeds: it passed on seed 7 alone by luck
    for (let i = 0; i < 12; i++) V.push(F.addUnit(0, 'vil', k.x + 40 + (i % 4) * 6, k.y + 40 + Math.floor(i / 4) * 6));
    F.order(V, { t: 'ground', e: { x: P.x, y: P.y } }); const d = F.SPACE, Rn = 0.525 * d * Math.sqrt(V.length);
    const key = V.map((u) => u.post && Math.round(u.post.x * 10) + ',' + Math.round(u.post.y * 10));
    if (new Set(key).size !== V.length) bad.push('item 5: villagers sent to one point share spots (' + new Set(key).size + ' spots for ' + V.length + ')');
    const far = Math.max(...V.map((u) => Math.hypot(u.post.x - P.x, u.post.y - P.y)));
    if (far > Rn + d) bad.push('item 5: the spots spread to ' + far.toFixed(1) + ', past the disc R = 0.525 d sqrt(n) = ' + Rn.toFixed(1));
    if (!(F.ARRIVE + 0.5 < d / 2)) bad.push('item 5: the arrival tolerance ' + F.ARRIVE.toFixed(2) + ' is not under half the spacing ' + (d / 2).toFixed(2));
    run(80); const off = V.filter((u) => Math.hypot(u.x - u.post.x, u.y - u.post.y) > F.ARRIVE + 0.5).length,
      wrong = V.filter((u) => V.some((w) => w !== u && Math.hypot(u.x - w.post.x, u.y - w.post.y) < Math.hypot(u.x - u.post.x, u.y - u.post.y))).length;
    if (off) bad.push('item 5 (seed ' + seed + '): ' + off + ' of ' + V.length + ' villagers sent to a point stand off their own spots');
    if (wrong) bad.push('item 5 (seed ' + seed + '): ' + wrong + ' of ' + V.length + " villagers stand nearer another's spot than their own"); });
  // item 5, what makes a spot free: open squares, the map's edge, the same side of a wall, nobody standing there, nobody's claim
  T_(() => { const G = fresh(), P = open(G); clear(G, P, 160); const k = F.keepOf(0), mk = (n, x = k.x + 40, y = k.y + 40) => { const V = []; for (let i = 0; i < n; i++) V.push(F.addUnit(0, 'vil', x + (i % 5) * 6, y + Math.floor(i / 5) * 6)); return V; };
    // two houses wall to wall: out of the first on the side they share, nobody lands on the second's squares
    const h = F.mkBld(0, 'house', P.x, P.y, 1), h2 = F.mkBld(0, 'house', P.x + 2 * F.halfOf(h), P.y, 1); G.blds.push(h, h2); F.navRebuild();
    const O = mk(10); for (const u of O) { u.inside = true; u.x = P.x + F.halfOf(h) - 1; u.y = P.y; F.stepOut(u, h); }
    if (O.some((u) => F.blockedCell(F.gcell(u.x, u.y), 0))) bad.push('item 5: one out of a building stands on a blocked square (in the house beside it)');
    const st = F.addUnit(0, 'vil', P.x + 60, P.y + 60), W2 = mk(6); F.postTo(W2, { x: st.x, y: st.y }); // one standing there already
    if (W2.some((u) => Math.hypot(u.post.x - st.x, u.post.y - st.y) < F.SPACE / 2)) bad.push('item 5: a post on a villager already standing there');
    const C1 = mk(6), C2 = mk(6, k.x + 70); F.postTo(C1, { x: P.x - 60, y: P.y - 60 }); F.postTo(C2, { x: P.x - 60, y: P.y - 60 }); // two taps on one point, nobody there yet
    const ck = [...C1, ...C2].map((u) => Math.round(u.post.x * 10) + ',' + Math.round(u.post.y * 10)); if (new Set(ck).size !== ck.length) bad.push("item 5: a second tap on a point takes the first one's spots");
    // the map's edge: a tap by the edge puts nobody within personal space of it
    let E = null; for (let y = 200; y < F.MAP - 200 && !E; y += 10) { let ok = true; for (let x = 0; x < 60 && ok; x += 5) for (let dy = -40; dy <= 40 && ok; dy += 5) ok = !F.blockedCell(F.gcell(x, y + dy), 0); if (ok) E = { x: 4, y }; }
    if (!E) bad.push('item 5: no open ground at the map edge to test on'); else { const M = mk(12); F.postTo(M, E); if (M.some((u) => u.post.x < F.SPACE)) bad.push('item 5: a post within personal space of the map edge'); }
    // a ring of wall round a point: the spots stay on its side
    const Q = { x: P.x - 5, y: P.y + 105 }, q = { cx: Math.floor(Q.x / F.NAVC), cy: Math.floor(Q.y / F.NAVC) };
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if (Math.max(Math.abs(i), Math.abs(j)) === 3) G.blds.push(F.mkBld(0, 'wall', (q.cx + i) * F.NAVC + 5, (q.cy + j) * F.NAVC + 5, 1));
    F.navRebuild(); const R = mk(60); F.postTo(R, { x: q.cx * F.NAVC + 5, y: q.cy * F.NAVC + 5 }); const cm = F.NAV.comp[F.gcell(q.cx * F.NAVC + 5, q.cy * F.NAVC + 5)];
    if (R.some((u) => u.post.b && F.NAV.comp[F.gcell(u.post.x, u.post.y)] !== cm)) bad.push('item 5: a post on the far side of a wall from the tapped point'); });
  T_(() => { const G = fresh(), k = F.keepOf(0), N = F.spotAt(k, 0).N, from = { x: k.x + 1, y: k.y + 3 };
    let i0 = 0; for (let i = 1; i < N; i++) if (Math.hypot(F.spotAt(k, i).x - from.x, F.spotAt(k, i).y - from.y) < Math.hypot(F.spotAt(k, i0).x - from.x, F.spotAt(k, i0).y - from.y)) i0 = i;
    for (const u of G.units) if (u.owner === 0 && u.kind === 'vil') { u.x = k.x + 200; u.y = k.y + 200; }
    const s0 = F.spotAt(k, i0), st = F.addUnit(0, 'vil', s0.x, s0.y), A = [0, 1].map(() => F.addUnit(0, 'vil', from.x, from.y));
    for (const u of A) { u.inside = true; u.hid = k.id; u.scared = true; u.emg = false; u.x = from.x; u.y = from.y; }
    for (const u of A) { G.tick = 10 * 1000 - (u.id % 10); F.vilTick(u, T, 1); }
    const on = (u) => { for (let i = 0; i < N; i++) { const s = F.spotAt(k, i); if (Math.hypot(s.x - u.x, s.y - u.y) < 1e-6) return i; } return -1; }, ia = A.map(on);
    if (A.some((u) => u.inside)) bad.push('item 5: the sheltering villagers did not come out');
    else if (ia.some((i) => i < 0)) bad.push('item 5: a villager out of a building is not on a spot of its outline (' + A.map((u) => Math.round(u.x - k.x) + ',' + Math.round(u.y - k.y)).join(' ') + ')');
    else if (ia[0] === ia[1] || ia.includes(i0)) bad.push('item 5: a villager out of a building stepped onto a taken spot');
    st.hp = 0; });

  // ── item 6: a computer's waiting villagers go to other work by the crowded rate: no pile-up on one find or animal, nothing out of reach ──
  T_(() => { const G = fresh(), o = 1, k = F.keepOf(o), V = []; G.fogOn = false;
    for (let i = 0; i < 12; i++) { const v = F.addUnit(o, 'vil', k.x + 30 + (i % 4) * 8, k.y + 30 + Math.floor(i / 4) * 8); F.setJob(v, 'stone'); v.was = 'stone'; v.node = null; v.hunt = null; v.idle = true; v.nnT = G.t + 5; V.push(v); }
    const dr = F.addUnit(W(), 'deer', k.x + 60, k.y + 60); dr.hx = dr.x; dr.hy = dr.y;
    // a rich bush beside them, walled in: the best rate on the map, and out of reach
    const B = { id: 9e6, kind: 'bush', type: 'food', x: k.x + 150, y: k.y - 150, amt: 3000, max: 3000 }, bc = { cx: Math.floor(B.x / F.NAVC), cy: Math.floor(B.y / F.NAVC) };
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if (Math.max(Math.abs(i), Math.abs(j)) === 3) G.blds.push(F.mkBld(W(), 'wall', (bc.cx + i) * F.NAVC + 5, (bc.cy + j) * F.NAVC + 5, 1));
    G.nodes.push(B); F.navRebuild(); for (const r in G.P[o].res) G.P[o].res[r] = 0; // nothing to build with: the waiters can only be given work
    G.nodes = G.nodes.filter((n) => n.type !== 'wood'); // no wood anywhere: by need (answer 10) the waiters go to food, the deer and the walled bush
    F.think(G.P[o]);
    const sent = V.filter((v) => v.node || v.hunt).length; if (sent < V.length) bad.push('item 6: ' + (V.length - sent) + ' of ' + V.length + " computer villagers waiting with nothing in reach were given no other work");
    const on = new Map(); for (const v of V) { const t = v.hunt || v.node; if (t) on.set(t, (on.get(t) || 0) + 1); }
    for (const [t, n] of on) { const room = F.UNIT[t.kind] ? F.FORAGE.room.carcass : F.FORAGE.room[t.kind] || 1; if (t.kind !== 'farm' && n > 2 * room) bad.push('item 6: ' + n + ' waiting villagers sent to one ' + t.kind + ' (room ' + room + ')'); }
    if (V.some((v) => v.node === B)) bad.push('item 6: a waiting villager was sent to a find it cannot walk to'); });
  // ── the juice pass (Nov 3): a charging blow shoves the one it lands on back and jolts the screen; a plain blow does not ──
  T_(() => { const G = fresh(), P = open(G); clear(G, P, 300); G.rel[0][1] = G.rel[1][0] = 'war';
    const a = F.addUnit(0, 'spear', P.x, P.y), t = F.addUnit(1, 'spear', P.x + 12, P.y); t.state = 'goto'; t.px = t.x; t.py = t.y;
    const x0 = t.x; F.cam.x = P.x; F.cam.y = P.y; F.hurt(0, a, t, 1); if (t.x !== x0 || G.jolt > G.t) bad.push('juice: a plain blow shoved or jolted');
    a.chg = G.t + 5; F.hurt(0, a, t, 1); if (!(t.x > x0 + F.JUICE.shove * 0.8)) bad.push('juice: a charging blow did not shove the one it hit back (' + (t.x - x0).toFixed(1) + ')'); if (!(G.jolt > G.t)) bad.push('juice: a charging blow on screen did not jolt');
    const x1 = t.x; F.hurt(0, a, t, 1); if (t.x !== x1) bad.push('juice: a second blow within a second shoved again'); });
  // ── the cost of an order (Nov 3, ORDER): a drill or a squad sent eats half a minute of the soldiers' shares and tires them ──
  T_(() => { const G = fresh(), P = open(G); clear(G, P, 300); const S = [0, 1, 2, 3].map((i) => F.addUnit(0, 'spear', P.x + i * 8, P.y)), f0 = G.P[0].res.f;
    const f = F.orderCost(0, S), want = Math.round(4 * 1.5 * F.UPKEEP.share * 60 * F.ORDER.mins);
    if (f !== want || G.P[0].res.f !== f0 - want) bad.push('order: four foot soldiers cost ' + f + ' food, not ' + want);
    if (!S.every((u) => u.tired > G.t)) bad.push('order: the soldiers are not tired after it');
    G.P[0].res.f = 1; if (F.orderCost(0, S) !== 1 || G.P[0].res.f !== 0) bad.push('order: with one food in the store the order took more'); });
  // ── war camps (Nov 3, CAMP): the wagon from the Stable, the strip and the square, trees burned, soldiers raising at 60%, the tent's price, the wounded sent home ──
  T_(() => { const G = fresh(), k = F.keepOf(0); let P = null; for (let r = 220; r < 700 && !P; r += 20) for (let t = 0; t < 12 && !P; t++) { const x = k.x + Math.cos(t) * r, y = k.y + Math.sin(t) * r; if (Math.abs(x - F.MID) > 300 || Math.abs(y - F.MID) > 300) if (!F.campWhy(0, 'camp', x, y)) P = { x, y }; }   // room for the square, off the Throne's lake
    if (!P) { bad.push('camp: no ground for a camp within 700 of the Town Center'); return; } clear(G, P, 300); G.P[0].age = 2; G.P[0].techs.add('campwagons'); { const q = F.findSpot(0, 'store', k.x, k.y, 80, 260); if (q) { const b = F.mkBld(0, 'store', q.x, q.y, 1); G.blds.push(b); F.navRebuild(); } } F.fxDirty();   // the Store a camp draws on
    const O = F.campLayout('outpost', P.x, P.y, 0, 1), C = F.campLayout('camp', P.x, P.y, 0, 1), cnt = (L, kind) => L.filter((p) => p.kind === kind).length;
    if (O.length !== 5 || cnt(O, 'camptower') !== 1 || !['medtent', 'traintent', 'messtent', 'depot'].every((t) => cnt(O, t) === 1)) bad.push('camp: the outpost is not four tents and a tower (' + O.map((p) => p.kind).join() + ')');
    if (Math.max(...O.map((p) => Math.abs(p.y - P.y))) > 1 || new Set(O.map((p) => Math.round(p.x))).size !== 5) bad.push('camp: the outpost is not one thin strip');
    const side = F.CAMP.side, want = 4 * side - 4 - 2; if (cnt(C, 'palisade') !== want || cnt(C, 'gate') !== 2 || cnt(C, 'camptower') !== 4 || !['medtent', 'traintent', 'messtent', 'depot'].every((t) => cnt(C, t) === 1)) bad.push('camp: the camp is not a palisade of ' + want + ' with a gate of two, four towers and the four tents (' + cnt(C, 'palisade') + ' stakes, ' + cnt(C, 'gate') + ' gate, ' + cnt(C, 'camptower') + ' towers)');
    const keys = new Set(C.map((p) => Math.round(p.x) + ',' + Math.round(p.y))); if (keys.size !== C.length) bad.push('camp: two pieces of the camp share a square');
    if (!C.filter((p) => p.kind === 'gate').every((p) => p.y > P.y)) bad.push('camp: the gate is not on the side facing home');
    const yard = C.filter((p) => p.kind !== 'palisade' && p.kind !== 'gate').map((p) => F.snapPos(p.kind, p.x, p.y)), inner = (side - 2) * (side - 2) - yard.length * 4, room = Math.floor(inner * 100 / (F.GRID.gap * F.GRID.gap)); if (room < F.CAMP.hold) bad.push('camp: the yard holds ' + room + ' at ' + F.GRID.gap + ' apart, not ' + F.CAMP.hold);
    // the limit: one of each; the Outpost from Bronze, the Camp from Classical with the research; a second with the next age
    G.P[0].age = 0; if (!F.campWhyTrain(0, 'outpost') || !F.campWhyTrain(0, 'camp')) bad.push('camp: a wagon is allowed in the Stone age'); G.P[0].age = 1; if (F.campWhyTrain(0, 'outpost') || !F.campWhyTrain(0, 'camp')) bad.push('camp: the Bronze age does not give the outpost alone');
    G.P[0].age = 2; G.P[0].techs.delete('campwagons'); if (!F.campWhyTrain(0, 'camp')) bad.push('camp: a Camp wagon without the research'); G.P[0].techs.add('campwagons'); { const st = G.blds.find((b) => b.owner === 0 && b.kind === 'store'); st.hp = 0; if (!F.campWhyTrain(0, 'camp')) bad.push('camp: a Camp wagon without a Store standing'); st.hp = 400; } if (F.campWhyTrain(0, 'camp')) bad.push('camp: a Camp wagon refused with the research');
    // the wagon unpacks on open ground; the trees under it burn; it is gone
    const w = F.addUnit(0, 'campcart', P.x, P.y); if (!F.campWhyTrain(0, 'camp')) bad.push('camp: a second Camp wagon allowed while one is out');
    const before = G.nodes.filter((n) => n.kind === 'tree' && Math.hypot(n.x - P.x, n.y - P.y) < side * 5 + 20).length;
    if (F.campWhy(0, 'camp', P.x, P.y)) bad.push('camp: open ground refused the camp: ' + F.campWhy(0, 'camp', P.x, P.y)); else {
      w.state = 'goto'; w.px = w.x; w.py = w.y; run(1); const pieces = G.blds.filter((b) => b.owner === 0 && b.camp);
      if (w.hp > 0 || pieces.length !== C.length) bad.push('camp: the wagon at its spot did not unpack into ' + C.length + ' sites (' + pieces.length + ', wagon ' + (w.hp > 0 ? 'still here' : 'gone') + ')');
      const after = G.nodes.filter((n) => n.kind === 'tree' && n.amt > 0 && pieces.some((b) => Math.hypot(n.x - b.x, n.y - b.y) < 16)).length; if (after) bad.push('camp: ' + after + ' trees still stand under the camp (' + before + ' were near)');
      if (!F.campWhyTrain(0, 'camp')) bad.push('camp: a second Camp wagon allowed while a camp stands');
      // a foot soldier raises a site at CAMP.build of a villager; a rider does not; Field logistics brings it to full
      const site = pieces.find((b) => b.kind === 'medtent'), s = F.addUnit(0, 'spear', site.x + 14, site.y), r = F.addUnit(0, 'chariot', site.x - 14, site.y); s.state = 'home'; r.state = 'home';
      run(2); site.crew = 0; for (let i = 0; i < 30; i++) { F.step(T); } if (!s.site) bad.push('camp: the idle spearman did not take to the site'); if (r.site) bad.push('camp: the chariot took to the site');
      const p0 = site.prog; run(4); const per = (site.prog - p0) / 4, vil = (1 / F.BLD.medtent.t) * Math.pow(F.CAMP.build, F.BUILDER_POW); if (!(Math.abs(per - vil) < vil * 0.25)) bad.push('camp: one spearman raises ' + per.toFixed(4) + ' a second, not about ' + vil.toFixed(4) + ' (60% of a villager)');
      G.P[0].techs.add('fieldlog'); F.fxDirty(); const p1 = site.prog; run(4); const per2 = (site.prog - p1) / 4; if (!(per2 > per * 1.3)) bad.push('camp: Field logistics did not quicken the soldier (' + per2.toFixed(4) + ' against ' + per.toFixed(4) + ')');
      for (const b of pieces) { b.prog = 1; F.built(b); } r.hp = 0;
      // the training tent charges a quarter more (a tenth with Field logistics), and is a place to train foot and villagers
      G.P[0].techs.delete('fieldlog'); F.fxDirty(); const tent = pieces.find((b) => b.kind === 'traintent'), c0 = F.unitCost(0, 'spear'), c1 = F.tentCost(0, tent, c0); if (c1.f !== Math.round(c0.f * (1 + F.CAMP.extra))) bad.push('camp: the tent charges ' + c1.f + ' food for ' + c0.f);
      G.P[0].techs.add('fieldlog'); F.fxDirty(); const c2 = F.tentCost(0, tent, c0); if (c2.f !== Math.round(c0.f * (1 + F.CAMP.extraLog))) bad.push('camp: with Field logistics the tent charges ' + c2.f + ' food for ' + c0.f);
      if (!F.readyAt(0, F.UNIT.spear).includes(tent) || !F.readyAt(0, F.UNIT.vil).includes(tent) || F.readyAt(0, F.UNIT.chariot).includes(tent)) bad.push('camp: the tent does not train foot and villagers, and only those');
      // a badly hurt soldier by the medical tent walks home to the Hospital; one with no Hospital stays and is bound
      s.hp = s.max * 0.3; s.state = 'home'; s.site = null; run(2); if (s.goingHome) bad.push('camp: a hurt soldier was sent home with no Hospital');
      const h = F.mkBld(0, 'hospital', k.x + 60, k.y + 60, 1); G.blds.push(h); run(2); if (!s.goingHome || Math.hypot(s.px - h.x, s.py - h.y) > 60) bad.push('camp: a soldier at 30% by the medical tent was not sent home to the Hospital');
      s.hp = s.max; run(2); if (s.goingHome) bad.push('camp: a healed soldier is still going home'); }
    // step 2: the depot feeds the camp and an empty one leaves it unsupplied; a caravan runs food out for the food and a fee; weather wears a piece and a soldier mends it; a wagon sinks deeper in mud; a camp is a pool for sickness
    if (G.blds.some((b) => b.owner === 0 && b.kind === 'depot' && b.prog >= 1)) { const dep = G.blds.find((b) => b.owner === 0 && b.kind === 'depot' && b.prog >= 1), S2 = [0, 1, 2].map((i) => F.addUnit(0, 'spear', dep.x + 20 + i * 8, dep.y + 20)); for (const u of S2) { u.state = 'home'; u.px = u.x; u.py = u.y; }
      dep.supply = 100; const eats = (u) => F.shareOf(u) * F.UPKEEP.share, f0 = G.P[0].res.f, fed = F.campEat(0, eats); if (!(fed > 0.2 && dep.supply < 100 && G.P[0].res.f === f0)) bad.push('camp: three soldiers by the depot did not eat from it (' + fed.toFixed(2) + ' food, supply ' + dep.supply.toFixed(1) + ')'); if (S2.some((u) => u.unfed)) bad.push('camp: a fed soldier counts as unsupplied');
      dep.supply = 0; F.campEat(0, eats); if (!S2.every((u) => u.unfed > 0 && u.tired > G.t)) bad.push('camp: an empty depot left the soldiers supplied'); dep.supply = 50; F.campEat(0, eats); if (S2.some((u) => u.unfed)) bad.push('camp: a restocked depot did not feed');
      // the caravan's run: a Market, a caravan, a depot under half; it loads at the Market for the food and the fee and unloads at the depot
      const mk = F.mkBld(0, 'market', k.x + 70, k.y - 70, 1); G.blds.push(mk); const c = F.addUnit(0, 'caravan', mk.x, mk.y + 30); c.lastId = mk.id; dep.supply = 0; G.P[0].res.f = 1000; G.P[0].res.g = 500; const g0 = G.P[0].res.g, f1 = G.P[0].res.f;
      run(2); if (!c.sup) bad.push('camp: the idle caravan did not take the supply run'); else { const fee = Math.ceil(F.CAMP.fee * Math.hypot(mk.x - dep.x, mk.y - dep.y) / 100); let secs = 0; while (c.sup && c.sup.leg === 'load' && secs < 60) { run(1); secs++; } const ate = secs * G.P[0].eats / 60 + 2;
        if (!(c.sup && c.sup.leg === 'go' && c.sup.food === F.CAMP.load && G.P[0].res.g === g0 - fee && f1 - G.P[0].res.f >= F.CAMP.load && f1 - G.P[0].res.f <= F.CAMP.load + ate)) bad.push('camp: the run did not take ' + F.CAMP.load + ' food and ' + fee + ' gold at the Market (food ' + (f1 - G.P[0].res.f) + ', gold ' + (g0 - G.P[0].res.g) + ', leg ' + (c.sup && c.sup.leg) + ')');
        secs = 0; while (dep.supply < F.CAMP.load - 1 && secs < 180) { run(1); secs++; } if (!(dep.supply >= F.CAMP.load - 1)) bad.push('camp: the caravan did not deliver (' + Math.round(dep.supply) + ' in the depot after 3 minutes, leg ' + (c.sup ? c.sup.leg : 'none') + ')'); }
      // weather wears, a soldier mends
      const pal = G.blds.find((b) => b.owner === 0 && b.kind === 'palisade' && b.prog >= 1), wx0 = G.wx; G.wx = 'rain'; const h0 = pal.hp; F.campWearTick(); if (!(pal.hp < h0)) bad.push('camp: a minute of rain wore nothing'); G.wx = 'clear'; F.campWearTick(); if (pal.hp !== h0 - F.CAMP.wear * F.maxHpB(0, 'palisade')) bad.push('camp: clear weather wore the palisade'); G.wx = wx0;
      pal.hp = F.maxHpB(0, 'palisade') * 0.3; const m = F.addUnit(0, 'spear', pal.x + 12, pal.y); m.state = 'home'; m.px = m.x; m.py = m.y; dep.supply = 600; run(12); if (!(pal.hp > F.maxHpB(0, 'palisade') * 0.4)) bad.push('camp: an idle spearman did not mend the worn palisade (' + pal.hp.toFixed(0) + ' of ' + F.maxHpB(0, 'palisade') + ')');
      // the wagon in mud: slower than a soldier by the wheels' share
      G.clim.mud = 1; const sp = (kind) => F.groundSpd(0, F.unitKeys(kind), null); if (!(sp('outpostcart') < sp('spear') * 0.8)) bad.push('camp: a wagon in mud is not slower than a soldier (' + sp('outpostcart').toFixed(2) + ' against ' + sp('spear').toFixed(2) + ')'); G.clim.mud = 0;
      // a camp is a pool for sickness: an outbreak far from home can take a soldier in camp
      const q = F.addUnit(0, 'spear', dep.x + 30, dep.y); if (!F.depotNear(q)) bad.push('camp: a soldier by the depot is not in the camp pool'); if (F.depotNear(F.addUnit(0, 'spear', dep.x + F.CAMP.reach + 40, dep.y))) bad.push('camp: a soldier far from the depot is in the camp pool'); for (const u of [...S2, m, q]) u.hp = 0; }
    else bad.push('camp: no depot standing for step 2');
    // the wagon on the road is a mark: a foe kills it
    const w2 = F.addUnit(0, 'outpostcart', P.x, P.y), e = F.addUnit(1, 'sword', P.x + 15, P.y); G.rel[0][1] = G.rel[1][0] = 'war'; if (F.nearestFoe(1, e, 50) !== w2) bad.push('camp: a foe beside the wagon does not take it for a mark'); F.hurt(1, e, w2, 10); if (!(w2.hp < F.UNIT.outpostcart.hp)) bad.push('camp: a blow on the wagon did nothing'); });
  // ── the Store (Nov 3, Albert 13:15): food spoils half as fast, soldiers eat a tenth less, prices swing half as far; a Camp wagon needs one; Learning by doing ──
  T_(() => { const G = fresh(), k = F.keepOf(0), P = G.P[0]; P.age = 2; P.techs.add('campwagons'); F.fxDirty();
    if (!F.campWhyTrain(0, 'camp') || !/Store/.test(F.campWhyTrain(0, 'camp'))) bad.push('store: a Camp wagon allowed with no Store standing (' + F.campWhyTrain(0, 'camp') + ')');
    const s0 = F.fxv(0, 'spoil').m, e0 = F.fxv(0, 'eat', F.unitKeys('spear')).m, v0 = F.fxv(0, 'eat', F.unitKeys('vil')).m;
    const sp = F.findSpot(0, 'store', k.x, k.y, 80, 260); if (!sp) { bad.push('store: no ground for one'); return; } const st = F.mkBld(0, 'store', sp.x, sp.y, 1); G.blds.push(st); F.navRebuild(); F.fxDirty();
    if (F.campWhyTrain(0, 'camp')) bad.push('store: a Camp wagon refused with a Store standing: ' + F.campWhyTrain(0, 'camp'));
    if (Math.abs(F.fxv(0, 'spoil').m / s0 - 0.5) > 1e-6) bad.push('store: food does not spoil half as fast (' + (F.fxv(0, 'spoil').m / s0).toFixed(2) + ')');
    if (Math.abs(F.fxv(0, 'eat', F.unitKeys('spear')).m / e0 - 0.9) > 1e-6 || F.fxv(0, 'eat', F.unitKeys('vil')).m !== v0) bad.push('store: the ration is not a tenth off for soldiers alone');
    { for (const u of G.units) if (u.owner === 0 && u.kind !== 'vil') u.hp = 0; for (let i = 0; i < 8; i++) { const u = F.addUnit(0, 'spear', k.x + 60 + i * 8, k.y + 60); u.state = 'goto'; u.px = u.x; u.py = u.y; } F.step(T);
      const bill = () => { const f0 = P.res.f; P.res.f = 5000; F.upkeepTick(); const d = 5000 - P.res.f; P.res.f = f0; return d; }; const with_ = bill(); st.hp = 0; F.fxDirty(); const without = bill(); st.hp = 400; F.fxDirty();
      const shares = 8 * 1.5 * F.UPKEEP.share * F.fxv(0, 'eat').m; if (!(Math.abs(without - with_ - shares * 0.1) < shares * 0.03)) bad.push('store: the upkeep did not fall by a tenth of the share of the soldiers (' + (without - with_).toFixed(3) + ' against ' + (shares * 0.1).toFixed(3) + ')'); }
    G.mkt = G.mkt || {}; G.mkt.f = 0.25; const m1 = F.mkt('f'), m0 = F.mkt('f', 0); if (!(m1 > 1.5 && Math.abs(m0 - 1 - (m1 - 1) * 0.5) < 1e-6)) bad.push('store: the price swing is not halved for its owner (' + m1.toFixed(2) + ' against ' + m0.toFixed(2) + ')'); G.mkt.f = 1;
    // Learning by doing: three farms standing, each yields 10% more; four, 15%; the cap at four past the first
    const farms = []; for (let i = 0; i < 6 && farms.length < 6; i++) { const q = F.findSpot(0, 'farm', k.x, k.y, 100, 400); if (!q) break; const b = F.mkBld(0, 'farm', q.x, q.y, 1); G.blds.push(b); F.navRebuild(); farms.push(b); }
    if (farms.length < 3) bad.push('store: no ground for three farms'); else { const n0 = F.gatherMul(0, farms[0].node); P.techs.add('learning'); F.fxDirty(); const n1 = F.gatherMul(0, farms[0].node), want = 1 + F.SCALE.per * Math.min(F.SCALE.cap, farms.length - 1);
      if (Math.abs(n1 / n0 - want) > 1e-6) bad.push('store: with ' + farms.length + ' farms Learning by doing gives ×' + (n1 / n0).toFixed(3) + ', not ×' + want.toFixed(3)); } });
  // ── field defences (Nov 3, Albert: yes): caltrops sown in a strip, the archers' stakes, pits in a band, the abatis of a camp by forest ──
  T_(() => { const G = fresh(), k = F.keepOf(0), P = G.P[0]; P.age = 2; P.res.i = 500; P.res.w = 900; G.rel[0][1] = G.rel[1][0] = 'war';
    if (!F.capWhy(0, 'caltrops')) bad.push('field: caltrops may be laid without the research'); P.techs.add('caltrops'); F.fxDirty(); if (F.capWhy(0, 'caltrops')) bad.push('field: caltrops refused with the research: ' + F.capWhy(0, 'caltrops'));
    if (!F.lineKind('caltrops') || !F.lineKind('pit') || F.lineKind('house')) bad.push('field: traps are not drawn as a line like a wall');
    let o = null; for (let r = 120; r < 500 && !o; r += 20) for (let t = 0; t < 12 && !o; t++) { const x = k.x + Math.cos(t) * r, y = k.y + Math.sin(t) * r; if (!F.canPlace(0, 'caltrops', x, y) && !F.canPlace(0, 'caltrops', x + 10, y) && !F.canPlace(0, 'caltrops', x + 20, y)) o = { x: Math.floor(x / 10) * 10 + 5, y: Math.floor(y / 10) * 10 + 5 }; }
    if (!o) { bad.push('field: no ground for a strip of three'); return; }
    const C = [0, 10, 20].map((dx) => F.build(0, 'caltrops', o.x + dx, o.y)); if (C.some((b) => !b)) bad.push('field: three caltrop squares side by side refused (a trap keeps no lane)'); for (const b of C) if (b) { b.prog = 1; F.built(b); }
    const e = F.addUnit(1, 'chariot', o.x, o.y); e.state = 'goto'; e.px = e.x; e.py = e.y; const h0 = e.hp; run(1); if (!(e.hp < h0 && e.stuck > G.t)) bad.push('field: a chariot on caltrops was not hurt and stuck (' + (h0 - e.hp).toFixed(1) + ')'); if (C[0] && C[0].hp <= 0) bad.push('field: one horse trod the caltrops flat'); if (C[0] && !C[0].seen[1]) bad.push('field: sprung caltrops are still unseen by that side');
    const ft = F.addUnit(1, 'spear', o.x, o.y); ft.state = 'goto'; ft.px = ft.x; ft.py = ft.y; const f0 = ft.hp; run(1); if (!(ft.hp < f0 && ft.hp > f0 - ft.max * F.CALTROPS.horse)) bad.push('field: a foot soldier on caltrops was hurt like a horse, or not at all'); e.hp = 0; ft.hp = 0;
    // the archers' stake: a shooter that has stood with the research; a horse that strikes it is hurt, its charge ends, it is thrown back
    const a = F.addUnit(0, 'archer', o.x + 60, o.y + 60), rd = F.addUnit(1, 'chariot', o.x + 66, o.y + 60); a.state = 'goto'; a.px = a.x; a.py = a.y; a.mvT = G.t - 10; rd.chg = G.t + 5;
    F.step(T); a.mvT = G.t - 10; F.step(T); if (a.staked) bad.push('field: a shooter without the research has a stake'); P.techs.add('archerstakes'); F.step(T); if (!a.staked) bad.push('field: a shooter that has stood five seconds has no stake');
    const r0 = rd.hp, rx = rd.x; F.hurt(1, rd, a, 1); if (!(rd.hp < r0 - rd.max * F.STAKES.dmg * 0.9 && rd.chg <= G.t && Math.abs(rd.x - rx) > F.STAKES.shove * 0.5)) bad.push('field: a horse on the stake was not hurt, stopped and thrown back (' + (r0 - rd.hp).toFixed(1) + ', moved ' + Math.abs(rd.x - rx).toFixed(1) + ')');
    a.mvT = G.t; F.step(T); if (a.staked) bad.push('field: a shooter that moved kept its stake'); rd.hp = 0; a.hp = 0; });
  // ── the Hall (Nov 3, Albert 13:15): one a side, named by the people; three specialities each, only for that people; the hooks the new fx need ──
  T_(() => { const G = fresh(), k = F.keepOf(0), P = G.P[0]; P.age = 2; Object.assign(P.res, { f: 9999, w: 9999, s: 9999, g: 9999, i: 9999 });
    const mine = F.TECH.filter((t) => t.at === 'hall'); if (mine.length !== 18 || Object.keys(F.CIVS).some((c) => mine.filter((t) => t.civ === c).length !== 3)) bad.push('hall: not three specialities for each of the six peoples (' + mine.length + ')');
    if (Object.keys(F.CIVS).some((c) => !F.CIVS[c].hall)) bad.push('hall: a people has no name for its Hall');
    P.civ = 'roman'; if (F.bldName(0, 'hall') !== 'Forum') bad.push('hall: the Roman Hall is not the Forum (' + F.bldName(0, 'hall') + ')');
    const other = mine.find((t) => t.civ === 'han'); if (!/another people/.test(F.researchWhy ? F.researchWhy(0, other.id) || '' : 'another people')) bad.push('hall: a Han speciality is open to Rome');
    const sp = F.findSpot(0, 'hall', k.x, k.y, 80, 300); if (!sp) { bad.push('hall: no ground'); return; } const h = F.mkBld(0, 'hall', sp.x, sp.y, 1); G.blds.push(h); F.navRebuild(); F.fxDirty();
    if (!F.readyAt || !F.ready(0, 'hall').length) bad.push('hall: the Hall is not standing for research');
    // the hooks: fx 'bld' on a blow at a building (Hastin), 'taxtake' and 'taxhate' (Satrapies, the sixth), 'spd' on foot (Via militaris)
    P.civ = 'maurya'; const el = F.addUnit(0, 'elephant', k.x + 80, k.y), tw = F.mkBld(1, 'tower', k.x + 120, k.y, 1); G.blds.push(tw); const hp0 = tw.hp; F.hurt(0, el, tw, 10); const d0 = hp0 - tw.hp; tw.hp = hp0; P.techs.add('hastin'); F.fxDirty(); F.hurt(0, el, tw, 10); const d1 = hp0 - tw.hp;
    if (!(Math.abs(d1 / d0 - 1.2) < 0.02)) bad.push('hall: Hastin does not make an elephant hit a building 20% harder (' + (d1 / d0).toFixed(2) + ')'); el.hp = 0; tw.hp = 0;
    P.civ = 'roman'; const s0 = F.stats(0, 'spear').spd; P.techs.add('viamil'); F.fxDirty(); if (!(Math.abs(F.stats(0, 'spear').spd / s0 - 1.2) < 0.02)) bad.push('hall: Via militaris does not quicken foot 20%'); if (F.stats(0, 'chariot').spd !== F.stats(1, 'chariot').spd) bad.push('hall: Via militaris quickened a chariot'); });
  // ── preview 44 (the audit of Nov 3, 14:53, every claim checked): the ids, the Mongol steps, the Store's line, the camps, the orders ──
  T_(() => { const G = fresh(), k = F.keepOf(0), P = G.P[0]; P.age = 3; Object.assign(P.res, { f: 9999, w: 9999, s: 9999, g: 9999, i: 9999 }); G.wx = 'clear';
    if (new Set(F.TECH.map((t) => t.id)).size !== F.TECH.length) bad.push('p44: two steps share an id');
    P.civ = 'roman'; P.techs.add('runners'); P.techs.add('horses'); F.fxDirty(); for (const id of ['royalroad', 'yam', 'remounts']) if (/another people/.test(F.researchWhy(0, id) || '')) bad.push('p44: ' + id + ' belongs to another people for Rome (the Hall took its id)');
    // the Mongol steps do what they say: a charge round sooner, horsemen see farther, horse archers reach farther
    P.civ = 'mongol'; const hs = F.addUnit(0, 'chariot', k.x + 80, k.y), ha = F.addUnit(0, 'harcher', k.x + 90, k.y), S = [hs];
    const cd = () => { G.chargeT = {}; hs.chg = 0; hs.tired = 0; F.charge(0, S, undefined, true); return (G.chargeT['0:all'] || 0) - G.t; };
    const c0 = cd(), s0 = F.sightOf(ha), r0 = F.rngOf(ha); P.techs.add('mongolyam'); P.techs.add('mongolremounts'); P.techs.add('tumen'); F.fxDirty(); const c1 = cd(), s1 = F.sightOf(ha), r1 = F.rngOf(ha);
    if (!(c0 > 0 && Math.abs(c1 / c0 - 0.75) < 0.02)) bad.push('p44: Remounts do not bring a charge round 25% sooner (' + c0.toFixed(1) + ' then ' + c1.toFixed(1) + ')');
    if (!(Math.abs(s1 / s0 - 1.2) < 0.02)) bad.push('p44: the Yam does not let a horseman see 20% farther (' + s0.toFixed(0) + ' then ' + s1.toFixed(0) + ')');
    if (!(Math.abs(r1 - r0 - 15) < 0.5)) bad.push('p44: the Tumen does not reach a horse archer 15 farther (' + r0 + ' then ' + r1 + ')'); hs.hp = 0; ha.hp = 0;
    // the Store's line: the mint once (×1.2, not ×1.32); Learning by doing on its five kinds, not a pasture
    P.civ = 'roman'; const mint = { kind: 'farm', type: 'gold', farm: { kind: 'mint' } }, past = { kind: 'farm', type: 'wool', farm: { kind: 'pasture' } };
    P.techs = new Set(); F.fxDirty(); const m0 = F.gatherMul(0, mint), p0 = F.gatherMul(0, past); P.techs = new Set(['learning', 'pinfactory']); F.fxDirty();
    if (Math.abs(F.gatherMul(0, mint) / m0 - 1.2) > 1e-6) bad.push('p44: Division of labour gives the mint ×' + (F.gatherMul(0, mint) / m0).toFixed(3) + ', not ×1.2');
    { const q = F.findSpot(0, 'pasture', k.x, k.y, 100, 400), q2 = q && F.findSpot(0, 'pasture', k.x + 60, k.y + 60, 100, 400); if (q && q2) { const a = F.mkBld(0, 'pasture', q.x, q.y, 1), b = F.mkBld(0, 'pasture', q2.x, q2.y, 1); G.blds.push(a, b); F.navRebuild(); F.fxDirty();
      if (Math.abs(F.gatherMul(0, past) / p0 - 1) > 1e-6) bad.push('p44: Learning by doing reaches the pasture (×' + (F.gatherMul(0, past) / p0).toFixed(3) + ')'); a.hp = 0; b.hp = 0; F.navRebuild(); } }
    // the camps: a cleared find does not block; a stone find does; a camp is its tents, not a last palisade; the wagon's spot is checked when it is sent
    { const o = open(G); if (!o) { bad.push('p44: no open ground'); return; } clear(G, o, 200);
      let oo = null; for (let r = 0; r < 200 && !oo; r += 20) for (let a = 0; a < 8 && !oo; a++) { const x = o.x + Math.cos(a) * r, y = o.y + Math.sin(a) * r; if (!F.campWhy(0, 'outpost', x, y)) oo = { x, y }; } if (!oo) { bad.push('p44: no ground for an outpost near the open spot'); return; } // an outpost: open ground near home is too small for a camp's square
      const f = { kind: 'chest', x: oo.x, y: oo.y, done: true }; G.finds.push(f); if (F.campWhy(0, 'outpost', oo.x, oo.y)) bad.push('p44: a cleared find blocks a camp (' + F.campWhy(0, 'outpost', oo.x, oo.y) + ')'); f.done = false; if (!/find/.test(F.campWhy(0, 'outpost', oo.x, oo.y) || '')) bad.push('p44: an uncleared find does not block a camp'); G.finds.splice(G.finds.indexOf(f), 1);
      const st = G.nodes.find((n) => n.kind === 'stone' && n.amt > 0); if (st && !/resource/.test(F.campWhy(0, 'camp', st.x, st.y) || '')) bad.push('p44: a camp may be unpacked on a stone find (' + F.campWhy(0, 'camp', st.x, st.y) + ')');
      const pal = F.mkBld(0, 'palisade', o.x, o.y, 1); pal.camp = 99; pal.campKind = 'camp'; G.blds.push(pal); if (F.campsOut(0, 'camp') !== 0) bad.push('p44: a lone palisade tile counts as a camp'); pal.hp = 0;
      P.techs.add('campwagons'); F.fxDirty(); const w = F.addUnit(0, 'outpostcart', k.x + 40, k.y + 40), by = { x: k.x + 30, y: k.y }; // a spot the wagon can walk to, where the square would lie across the Town Center
      if (!F.campWhy(0, 'outpost', by.x, by.y)) bad.push('p44: an outpost may lie across the Town Center'); else { F.order([w], { t: 'ground', e: by }); if (w.state === 'goto') bad.push('p44: a wagon was sent to a spot it cannot take without a word'); }
      F.order([w], { t: 'ground', e: oo }); if (w.state !== 'goto') bad.push('p44: a wagon sent to open ground did not go (' + w.state + ')'); w.hp = 0; w.state = 'home'; }
    // an order by tap costs the meals the controller's Go costs; a drilled soldier steps a rank toward what strikes its line; the B side's hold ends at home
    { let best = 0, o = null; for (let x = 250; x < F.MAP - 250; x += 20) for (let y = 250; y < F.MAP - 250; y += 20) { const dk = Math.hypot(x - k.x, y - k.y); if (dk < 150 || dk > 700 || G.lakes.some((L) => Math.hypot(L.x - x, L.y - y) < L.r + 60)) continue; let shut = false; for (let j = -7; j <= 7 && !shut; j++) for (let i = -7; i <= 7 && !shut; i++) if (F.blockedCell(F.gcell(x + i * 10, y + j * 10), 0)) shut = true; if (shut) continue; const m = Math.min(...G.blds.map((b) => Math.hypot(b.x - x, b.y - y)), ...G.units.map((u) => Math.hypot(u.x - x, u.y - y))); if (m > best) { best = m; o = { x, y }; } } // open ground away from the map's edge, clear 70 round (the step is walked, not wished)
      if (!o) { bad.push('p44: no ground for a choke'); return; } clear(G, o, 200); const sp = []; for (let i = 0; i < 4; i++) sp.push(F.addUnit(0, 'spear', k.x + 70 + i * 10, k.y + 70)); const f0 = P.res.f; F.order(sp, { t: 'ground', e: { x: o.x, y: o.y } }); if (!(P.res.f < f0)) bad.push('p44: an order by tap took no meals'); if (!(sp[0].tired > G.t)) bad.push('p44: an order by tap left nobody tired');
      for (const u of sp) { u.x = o.x; u.y = o.y; } G.pick = sp.map((u) => ({ t: 'unit', id: u.id })); F.chokeAt({ x: o.x - 20, y: o.y }, { x: o.x + 20, y: o.y }); G.pick = []; run(3); const front = sp.find((u) => F.drillOn(u)); if (!front) bad.push('p44: no soldier in the choke');
      else { const d = { x: front.drill.fx, y: front.drill.fy }; // an archer striking the line from past the blade's reach but within a rank's step is met; one twice as far is not chased
        const shot = (D) => { const ar = F.addUnit(1, 'archer', front.x + d.x * D, front.y + d.y * D); ar.kiting = false; ar.state = 'goto'; ar.px = ar.x; ar.py = ar.y; const x0 = front.x, y0 = front.y, h0 = ar.hp, dbg = 'd0=' + Math.hypot(ar.x - front.x, ar.y - front.y).toFixed(1) + ' off=' + Math.hypot(front.px + front.gx - front.x, front.py + front.gy - front.y).toFixed(1); for (let i = 0; i < 45; i++) { ar.tgt = front; F.step(T); } const r = { moved: Math.hypot(front.x - x0, front.y - y0), hit: ar.hp < h0, dbg: dbg + ' d1=' + Math.hypot(ar.x - front.x, ar.y - front.y).toFixed(1) + ' ftgt=' + (front.tgt && front.tgt.kind) + ' fstate=' + front.state + ' drillOn=' + F.drillOn(front) + ' tired=' + (front.tired > G.t) + ' rout=' + front.state }; ar.hp = 0; ar.tgt = null; run(1); return r; };
        const near = shot(28); if (!(near.moved > 4 || near.hit)) bad.push('p44: a drilled soldier does not step toward the archer striking its line at 28 (moved ' + near.moved.toFixed(1) + ' ' + near.dbg + ')'); const far = shot(60); if (far.moved > 8 || far.hit) bad.push('p44: a drilled soldier chased an archer at 60 (moved ' + far.moved.toFixed(1) + ')'); }
      for (const u of sp) u.hp = 0;
      const q = G.P[1]; q.ab = 'B'; const b = []; for (let i = 0; i < 3; i++) { const u = F.addUnit(1, 'spear', F.keepOf(1).x + 50, F.keepOf(1).y + 50 + i * 10); u.state = 'goto'; u.px = u.x; u.py = u.y; u.drill = { shape: 'choke', fx: 1, fy: 0, t0: G.t - 10, until: G.t - 1, px: u.x, py: u.y }; b.push(u); } F.think(q); if (b.some((u) => u.state !== 'home')) bad.push('p44: the B side keeps soldiers whose hold ended out of its pool'); for (const u of b) u.hp = 0; }
    // the fish on the drawn shore
    for (const n of G.nodes) if (n.kind === 'fish') { const L = G.lakes.slice().sort((a, b) => Math.hypot(a.x - n.x, a.y - n.y) - Math.hypot(b.x - n.x, b.y - n.y))[0]; if (L && !L.river && Math.hypot(L.x - n.x, L.y - n.y) > F.lakeRAt(L, Math.atan2(n.y - L.y, n.x - L.x))) { bad.push('p44: a fish lies on dry land outside the drawn shore'); break; } } });
  return bad;
}"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
        try: bad = await pg.evaluate(JS)
        except Exception as e: bad = ['the combat checks stopped: ' + str(e)[:200]]
        await br.close()
    bad += errs
    print(('PASS ' if not bad else 'FAIL ') + 'combat and spots (hostility, wild strength, flank, nerve, group, rout grace, healing, converts, reach, splash, own spots, waiting computers)', '' if not bad else bad)
    sys.exit(1 if bad else 0)
asyncio.run(main())
