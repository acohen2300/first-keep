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
    run(40); const off = V.filter((u) => Math.hypot(u.x - u.post.x, u.y - u.post.y) > F.ARRIVE + 0.5).length,
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
