# The quick action (Albert, Nov 3, "yes yes"; build 80 preview 46): with nothing picked, a tap on open ground or on a foe puts ONE joined block of
# four cells at the finger. Run by the gate:  python3 tests/quick.py
#   Q1 the joined 2x2 on open ground: two controller columns wide, 88 tall, four cells of 44, no gaps, dividers stopping 8 short of the edge,
#      on the screen; Sword is dim with nobody to send; a tap elsewhere only closes it
#   Q2 Sword opens All · 1/2 · 1/4 · More with the counts; the third tap sends that share of the NEAREST idle soldiers at once; the bullseye shows
#   Q3 Build opens the Build card, the ghost goes on that spot (and keeps it through a tab turn)   Q4 Rally sets the rally point at the spot
#   Q5 a foe: Sword · Close / Squad · More; Sword sends the idle ones; Squad lists the squads and sends the one tapped; More opens its card;
#      with a soldier picked a tap on a foe attacks at once, no block
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = r"""async () => {
  const F = window.__fk, bad = [], $ = (s) => document.querySelector(s), qa = $('#qa'), hy = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  F.newGame(5); F.act('close'); const G = F.G, P = F.G.P[0], k = F.keepOf(0); F.setPause(true); G.fogOn = false; P.age = 3; for (const r of ['f', 'w', 's', 'g', 'i']) P.res[r] = 9999;
  const tap = async (x, y) => { await new Promise((r) => setTimeout(r, 360)); F.tapAt(x, y); };   // a second tap on the same ground inside 320 ms is a double tap, which does nothing
  const ground = (x0, y0) => { for (let y = y0; y < 520; y += 23) for (let x = x0; x < 330; x += 23) if (F.hitAt(x, y).t === 'ground' && !F.hitAt(x + 40, y).e?.owner && F.hitAt(x + 40, y).t === 'ground') return [x, y]; };
  const p = ground(60, 260), spot = F.hitAt(...p).e, col = (innerWidth - 30) / 7, up = () => !!G.qa && !qa.hidden;
  const words = () => [...qa.querySelectorAll('.cell')].map((c) => c.innerText.replace(/\s+/g, ''));
  const mk = (n, bn) => Array.from({ length: n }, (_, i) => { const u = F.addUnit(0, 'spear', k.x + 40 + i * 8, k.y + 40); u.bn = bn; return u; });
  const sent = (S) => S.filter((u) => u.state === 'goto' || u.ord || u.focus || u.tx !== undefined);
  const arcs = () => { const c = $('#cv').getContext('2d'), a0 = c.arc.bind(c); let n = 0; c.arc = (...a) => { if (a[2] === 2) n++; return a0(...a); }; F.draw(); c.arc = a0; return n; };
  // Q1: the joined block
  await tap(...p);
  if (!up()) bad.push('Q1 joined: a tap on open ground put no block down');
  else {
    const r = qa.getBoundingClientRect(), C = [...qa.querySelectorAll('.cell')].map((c) => c.getBoundingClientRect());
    if (Math.abs(r.width - 2 * col) > 1 || Math.abs(r.height - 88) > 1) bad.push(`Q1 joined: the block is ${r.width.toFixed(1)} x ${r.height.toFixed(1)}, not ${(2 * col).toFixed(1)} x 88`);
    if (C.length !== 4 || C.some((c) => Math.abs(c.height - 44) > 1 || Math.abs(c.width - col) > 1)) bad.push('Q1 joined: not four cells of one column by 44');
    if (C.length === 4 && (Math.abs(C[1].left - C[0].right) > 0.5 || Math.abs(C[2].top - C[0].bottom) > 0.5)) bad.push('Q1 joined: gaps between the cells (it is not squashed together)');
    const d1 = getComputedStyle(qa.children[1], '::before'), d2 = getComputedStyle(qa.children[2], '::after');
    if (d1.top !== '8px' || d1.bottom !== '8px' || d1.width !== '1px' || d2.left !== '8px' || d2.right !== '8px' || d2.height !== '1px') bad.push('Q1 joined: the dividers do not stop 8 short of the edge');
    if (!/ring-w|236, 229, 211|ece5d3/i.test(getComputedStyle(qa).boxShadow) && !getComputedStyle(qa).boxShadow.includes('236')) bad.push('Q1 joined: no white outline');
    if (getComputedStyle(qa).borderRadius !== '9px') bad.push('Q1 joined: the outline is not radius 9');
    if (r.left < 0 || r.right > innerWidth || r.top < $('#hud').getBoundingClientRect().bottom || r.bottom > $('#orders').getBoundingClientRect().top) bad.push('Q1 joined: the block is off its place on the screen');
    if (words().join('|') !== 'Sword|Close|Build|Rally') bad.push('Q1 joined: the cells say ' + words().join('|'));
    if (!qa.children[0].classList.contains('dis')) bad.push('Q1 joined: with no soldiers the Sword was not dim');
    F.act('qa:sword'); if (up()) bad.push('Q1 joined: the Sword with nobody to send left the block up');
    await tap(...p); await tap(p[0], p[1] + 60); if (up() || G.card) bad.push('Q1 joined: a tap elsewhere did more than close it');
    await tap(...p); F.act('qa:close'); if (up()) bad.push('Q1 joined: Close did not close it');
  }
  // Q2: the share
  let S = mk(8, null); const sp = S.map((u) => u).sort((a, b) => hy(a, spot) - hy(b, spot));
  await tap(...p); F.act('qa:sword');
  if (!up() || words().join('|') !== '8All|41/2|21/4|More') bad.push('Q2 share: Sword shows ' + (up() ? words().join('|') : 'nothing') + ', not All 8 · 1/2 4 · 1/4 2 · More');
  if (sent(S).length) bad.push('Q2 share: soldiers were sent before the third tap');
  F.act('qa:s1');
  { const go = sent(S); for (const u of go) u.mvT = G.t; /* on the move, as the sim would have it */ if (go.length !== 4) bad.push(`Q2 share: 1/2 sent ${go.length} of 8, not 4`);
    else if (!sp.slice(0, 4).every((u) => go.includes(u))) bad.push('Q2 share: the ones sent are not the nearest to the spot');
    if (up()) bad.push('Q2 share: the block stayed up after a share was tapped (no confirm tap)');
    if (!G.qFlash) bad.push('Q2 bullseye: no bullseye after a share');
    else { const n1 = arcs(); G.qFlash.until = performance.now() - 1; const n2 = arcs(); if (n1 <= n2) bad.push('Q2 bullseye: the crosshair is not drawn on the spot'); if (G.qFlash) bad.push('Q2 bullseye: it never goes'); } }
  await tap(...p); F.act('qa:sword'); if (words().slice(0, 3).join('|') !== '4All|21/2|11/4') bad.push('Q2 share: the idle left show ' + words().join('|'));
  F.act('qa:s2'); if (sent(S).length !== 5) bad.push('Q2 share: 1/4 of the four left sent ' + (sent(S).length - 4) + ', not 1');
  await tap(...p); F.act('qa:sword'); F.act('qa:s0'); if (sent(S).length !== 8) bad.push('Q2 share: All left some behind');
  for (const u of S) u.hp = 0;
  // Q3: Build at the spot
  await tap(...p); F.act('qa:build');
  if (up() || !G.card || G.card.type !== 'menu') bad.push('Q3 Build: the Build cell did not open the Build card');
  else {
    const tabs = [...document.querySelectorAll('#card [data-act^="menu:"]')]; if (tabs[1]) { F.act(tabs[1].dataset.act); }
    if (!G.card || !G.card.at) bad.push('Q3 Build: a tab turned lost the spot');
    const t = document.querySelector('#card [data-act^="build:"]:not(.dis)'); if (t) F.act(t.dataset.act);
    if (!G.place || !G.place.at) bad.push('Q3 Build: no ghost to place');
    else if (hy(G.place.at, spot) > 120 || hy(G.place.at, spot) > hy(G.place.at, F.cam)) bad.push('Q3 Build: the ghost is not on the spot');
    G.place = null; F.closeCard();
  }
  // Q4: Rally at the spot
  G.rally0 = null; await tap(...p); F.act('qa:rally');
  if (!G.rally0 || hy(G.rally0, spot) > 1) bad.push('Q4 Rally: the rally point is not at the spot');
  if (up() || G.hud.aim) bad.push('Q4 Rally: it asked for another tap');
  // Q5: a foe
  G.rel[0][1] = G.rel[1][0] = 'war'; const q = ground(p[0] + 2, p[1] + 90) || [p[0], p[1] + 90], sp2 = F.hitAt(...q).e, e = F.addUnit(1, 'spear', sp2.x, sp2.y), eat = () => [F.SX(e.x), F.SY(e.y) - 6 * F.cam.z];
  P.techs.add('command'); F.fxDirty(); S = mk(3, 0).concat(mk(2, 1)); F.setPick([]);
  await tap(...eat());
  if (!up() || words().join('|') !== 'Sword|Close|Squad|More') bad.push('Q5 foe: a tap on a foe shows ' + (up() ? words().join('|') : 'nothing') + ', not Sword|Close|Squad|More');
  if (G.pick.length || G.card) bad.push('Q5 foe: the tap picked it or opened a card');
  F.act('qa:squad');
  if (words().join('|') !== '3Alpha|2Bravo|0Charlie|Close') bad.push('Q5 foe: Squad shows ' + words().join('|'));
  if (!qa.children[2].classList.contains('dis') || qa.children[0].classList.contains('dis')) bad.push('Q5 foe: an empty squad is not dim (or a full one is)');
  F.act('qa:q1');
  { const go = S.filter((u) => u.focus === e); if (go.length !== 2 || go.some((u) => u.bn !== 1)) bad.push(`Q5 foe: Bravo tapped, ${go.length} went and not just Bravo`); if (up()) bad.push('Q5 foe: the block stayed up after a squad was tapped'); }
  await tap(...eat()); F.act('qa:sword'); if (S.filter((u) => u.focus === e).length !== 5) bad.push('Q5 foe: Sword did not send every idle soldier at it');
  await tap(...eat()); F.act('qa:more'); if (up() || !G.card || G.card.type !== 'unit') bad.push('Q5 foe: More did not open its card'); F.closeCard();
  for (const u of S) { u.hp = 0; } const one = mk(1, null)[0]; F.setPick([{ t: 'unit', id: one.id }]); await tap(...eat());
  if (up() || one.focus !== e) bad.push('Q5 foe: with a soldier picked a tap on a foe did not attack at once (or put the block up)');
  return bad; }"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(viewport={'width': 390, 'height': 844}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(500)
        try: bad = await pg.evaluate(JS)
        except Exception as e: bad = ['the quick action checks could not run: ' + str(e)[:300]]
        await br.close()
    bad = bad + errs
    print(('PASS ' if not bad else 'FAIL ') + 'the quick action (the joined block, the shares and the bullseye, Build, Rally, a foe)', '' if not bad else bad)
    sys.exit(1 if bad else 0)
asyncio.run(main())
