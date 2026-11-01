# The cards of v80 (Albert's pictures, Oct 31; the audit's group E): each check below failed on the code before it and passes now. Run by the
# gate:  python3 tests/cards.py
#   Setup: each setting its own rank, its name quiet on the left, its choices one selector right-justified; Fog and Daily say their word once
#   Relations: a rank a side, the gift a slider with its switch, the stance three icons in two slots, a ✓ a row that sends that row only;
#     a friend's gift locked; the words friend, neutral, foe
#   Mail: six lines a page, Previous and Next, the 30 kept are five pages; the Market's goods one selector
#   E1 the Army card's Train fold has no commas; E2 a workshop counts what it made; E4 a find under the fog cannot be tapped; E5 a pinch lets
#   go of the box and the crosshair's glow; E6 a dim Train button says why; E7 the pause follows the tab; E11 a burning Market has Send help
#   The row: Emergency a slot on the cycle button's rank with its word; one steel panel holds both; a locked place in the line names its
#   research; the map's labels are 12 at the starting zoom and 9 at the floor; the vassal's Demand rank keeps its 44
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = r"""() => {
  const F = window.__fk, bad = [], $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  F.newGame(5); F.act('close'); const G = F.G, P = G.P[0], k = F.keepOf(0); F.setPause(true); G.fogOn = false; P.age = 3;
  for (const r of ['f', 'w', 's', 'g', 'i']) P.res[r] = 9999;
  const put = (kind) => { const s = F.findSpot(0, kind, k.x, k.y, 70, 320); const b = F.build(0, kind, s.x, s.y); b.prog = 1; b.hp = F.BLD[kind].hp; F.built(b); return b; };
  // Setup: six settings, each a rank: the name quiet in the slots on the left, the choices one selector ending at the card's right edge
  try {
  F.openCard({ type: 'setup' }); F.ui(true);
  { const ranks = $$('#card .cin > .fm').filter((r) => r.querySelector('.info.quiet') && r.querySelector('.bar.sel')), card = $('#card .tb').getBoundingClientRect();
    if (ranks.length < 7) bad.push(`Setup: ${ranks.length} settings stand on their own rank with their name, not 7 (six and Daily)`);
    for (const r of ranks) { const b = r.querySelector('.bar.sel').getBoundingClientRect(), n = r.querySelector('.info.quiet').getBoundingClientRect();
      if (Math.abs(b.right - card.right) > 1 || n.left > b.left || r.children.length !== 2) bad.push('Setup: a setting is not its name on the left and its choices right-justified: ' + r.textContent.trim().slice(0, 20)); }
    const words = $('#card .cin').innerText.split(/\s+/);
    for (const w of ['Fog', 'Daily']) if (words.filter((x) => x === w).length !== 1) bad.push(`Setup: ${w} says its word ${words.filter((x) => x === w).length} times`);
    if ($$('#card .tick').length) bad.push('Setup: the old tick boxes are still there'); }
  } catch (e) { bad.push('Setup: the check could not run: ' + e.message); }
  // Relations in two pages (answers 1 and 1b; picture Relations Misfits): Relations, a rank a computer, the stance only (no gifts to rivals);
  // Misfits, a rank each for the Natives, outlaws, bandits and robbers, a bribe (the slider with its switch) and a stance; three stance icons
  // in two slots; a ✓ a row. A stance picked and not sent reads "Foe → Neutral" under the name, each word in its colour
  try {
  G.rel[0][2] = G.rel[2][0] = 'ally'; G.ktab = 'rel'; F.openCard({ type: 'bld', id: k.id }); F.ui(true);
  { if ($$('#card .fo > .fm > button').map((b) => b.dataset.act).join() !== 'ktab:town,ktab:rel,ktab:mis') bad.push('Relations: the tabs are not Town, Relations, Misfits');
    const sides = G.P.filter((q) => q.id !== 0 && q.id !== F.WILD && q.alive).length, oks = $$('#card [data-act^="relok:"]');
    if (oks.length !== sides) bad.push(`Relations: ${oks.length} check marks for ${sides} computers: a check mark per row, the computers only`);
    for (const r of oks.map((o) => o.parentElement)) { const sel = r.querySelector('.bar.sel'); if (!sel || sel.querySelectorAll('svg').length !== 3 || !sel.classList.contains('s2')) bad.push('Relations: a row is not the three stance icons in two slots'); if (r.querySelector('.slt')) bad.push('Relations: a computer\'s row has a gift slot'); }
    if (F.REL_WORD.ally !== 'Friend' || F.REL_WORD.peace !== 'Neutral' || F.REL_WORD.war !== 'Foe') bad.push('Relations: the words are not friend, neutral, foe: ' + Object.values(F.REL_WORD).join(', '));
    if (/hostile|ally,/i.test($('#card').innerText)) bad.push('Relations: the card still says hostile or ally');
    // a stance picked and not sent: the change with an arrow, in the stances' colours
    G.rel[0][1] = G.rel[1][0] = 'war'; F.act('relwant:1,peace'); F.ui(true);
    { const c = $('#card [data-act="relok:1"]').parentElement.querySelector('.info small'), sp = c ? [...c.querySelectorAll('span')] : [];
      if (!c || !/^Foe → Neutral$/.test(c.textContent) || sp.length !== 2 || !sp[0].classList.contains('stance-war') || !sp[1].classList.contains('stance-peace')) bad.push(`Relations: a picked stance reads "${c && c.textContent}", not "Foe → Neutral" in red and white`); }
    // a side under notice reads "foe in 30 s" in the foe's colour, whole in its slot
    G.warAt['0,3'] = G.t + 30; F.ui(true); const n3 = $('#card [data-act="relok:3"]').parentElement.querySelector('.info small');
    if (!n3 || !/^foe in 30 s$/i.test(n3.textContent) || !n3.classList.contains('stance-war')) bad.push(`Relations: a side under notice reads "${n3 && n3.textContent}", not "foe in 30 s" in red`);
    else if (n3.scrollWidth > n3.clientWidth + 1) bad.push('Relations: "foe in 30 s" is cut in its slot');
    delete G.warAt['0,3'];
    if ($$('#card .thin').length !== oks.length || $$('#card .thin').some((t) => !t.querySelector('[data-act^="relwant:"]'))) bad.push(`Relations: ${$$('#card .thin').length} controls are marked thin, not the ${oks.length} stance sets (EXCEPTIONS #13)`);
    // Misfits
    F.act('ktab:mis'); F.ui(true);
    const mo = $$('#card [data-act^="relok:"]').map((o) => o.dataset.act.slice(6));
    if (mo.join() !== [F.WILD, 'out', 'ban', 'rob'].join()) bad.push('Misfits: the rows are ' + mo.join() + ', not the Natives, outlaws, bandits, robbers');
    for (const r of $$('#card [data-act^="relok:"]').map((o) => o.parentElement)) { const sel = r.querySelector('.bar.sel'), slt = r.querySelector('.slt');
      if (!sel || sel.querySelectorAll('svg').length !== 3 || !slt || !slt.querySelector('input[type=range]') || !/Bribe/.test(slt.innerText)) bad.push('Misfits: a row is not the bribe slider and the three stance icons in two slots'); }
    const was = G.rel[0][F.WILD]; G.rel[0][F.WILD] = G.rel[F.WILD][0] = 'ally'; F.ui(true);
    const nat = $(`#card [data-act="relok:${F.WILD}"]`), fr = nat && nat.parentElement.querySelector('.slt');
    if (!fr || !fr.classList.contains('dis')) bad.push("Misfits: a friend's bribe is not locked");
    G.rel[0][F.WILD] = G.rel[F.WILD][0] = was; F.ui(true);
    // a bribe to the Natives and a stance for the bandits, each waiting on its row; the Natives' ✓ sends the bribe only
    const g0 = P.res.g, r0 = F.regardOf(0); F.act(`relgift:${F.WILD},100`); F.act('relwant:ban,peace'); F.ui(true);
    if (P.res.g !== g0) bad.push('Misfits: the bribe went before its check mark');
    const ok = $(`#card [data-act="relok:${F.WILD}"]`); if (!ok || !ok.classList.contains('go')) bad.push("Misfits: the Natives' check mark is not ready after a bribe was picked");
    ok && ok.click(); F.ui(true);
    if (P.res.g !== g0 - 100 || !(F.regardOf(0) > r0)) bad.push("Misfits: the Natives' check mark did not send their bribe");
    if (!(G.relPick || {}).ban || G.relPick.ban.want !== 'peace') bad.push("Misfits: the Natives' check mark sent another row's pick");
    // a bribe to the robbers raises the robbers' regard alone
    const rr = F.regardOf(0, 'rob'), rb = F.regardOf(0, 'ban'); F.act('relgift:rob,100'); F.ui(true); $('#card [data-act="relok:rob"]').click(); F.ui(true);
    if (!(F.regardOf(0, 'rob') > rr) || F.regardOf(0, 'ban') !== rb) bad.push("Misfits: the robbers' bribe did not raise the robbers' regard alone");
    // sent: the line shows the new stance alone (turning on the outlaws needs no notice)
    F.gangState('out').regard[0] = 60; F.gangState('out').rel[0] = 'peace'; F.act('relwant:out,war'); F.ui(true);
    { const row = $('#card [data-act="relok:out"]').parentElement; if (!/Neutral\s*→\s*Foe/.test(row.querySelector('.info').innerText)) bad.push('Misfits: a picked stance does not show the change'); }
    $('#card [data-act="relok:out"]').click(); F.ui(true);
    { const sm = [...$('#card [data-act="relok:out"]').parentElement.querySelectorAll('.info small')]; if (sm.length !== 1 || sm[0].textContent !== 'Foe' || !sm[0].classList.contains('stance-war')) bad.push('Misfits: once sent, the line does not show the new stance alone: ' + sm.map((x) => x.textContent).join(' | ')); }
    if ($$('#card .thin').length !== 4) bad.push(`Misfits: ${$$('#card .thin').length} controls are marked thin, not the 4 stance sets (EXCEPTIONS #13)`);
    G.ktab = 'town'; }
  // the vassal's Demand rank keeps its 44 (EXCEPTIONS #12 gone; the gate measures every card at every size, the vassal now included)
  try {
  { F.makeVassal(1, 0, 'fair'); const v = F.keepOf(1); F.openCard({ type: 'bld', id: v.id }); F.ui(true);
    const tall = $$('#card [data-act^="demand:"]').filter((b) => b.getBoundingClientRect().height > 44.5);
    if (!$$('#card [data-act^="demand:"]').length) bad.push('the vassal card shows no Demand rank'); else if (tall.length) bad.push(`the vassal's Demand rank grows past its 44: ${tall.map((b) => Math.round(b.getBoundingClientRect().height)).join(', ')}`); F.act('close'); }
  } catch (e) { bad.push('vassal: the check could not run: ' + e.message); }
  } catch (e) { bad.push('Relations: the check could not run: ' + e.message); }
  // Mail: 30 lines, six a page, five pages; Previous dim on the first, Next dim on the last; nothing scrolls
  try {
  { G.mail = []; for (let i = 0; i < 40; i++) F.news('realm', 'A line of the mail number ' + 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN'[i] + '.', '', 4);
    F.act('mail'); F.ui(true); const pages = [];
    for (let p = 0; p < 6; p++) { pages.push($$('#card .mr').length); $('#card [data-act="mailp:1"]').click(); F.ui(true); }
    if (pages.slice(0, 5).join() !== '6,6,6,6,6' || G.mailP !== 4) bad.push(`Mail: pages of ${pages.join(', ')} lines, last page ${G.mailP + 1}: six lines a page, five pages`);
    if (!$('#card [data-act="mailp:1"]').classList.contains('dis')) bad.push('Mail: Next is not dim on the last page');
    F.act('mail'); F.ui(true); if (!$('#card [data-act="mailp:-1"]').classList.contains('dis')) bad.push('Mail: Previous is not dim on the first page');
    $('#card [data-act="mailp:1"]').click(); $('#card [data-act="mailp:1"]').click(); F.ui(true); const line = $$('#card .mr').find((b) => !/:\d/.test(b.dataset.act) || b.dataset.act === 'mailp:0');
    if (line) { line.click(); F.ui(true); if (G.mailP !== 2 || !G.card || G.card.type !== 'mail') bad.push(`Mail: a tap on a line on page 3 went to page ${G.mailP + 1}`); }
    const c = $('#card'); if (c.scrollHeight > c.clientHeight + 1) bad.push('Mail: the card scrolls'); }
  } catch (e) { bad.push('Mail: the check could not run: ' + e.message); }
  // the Market: its goods one selector; burning, it has Send help and its health (E11)
  try {
  { const m = put('market'); m.fire = 5; F.openCard({ type: 'bld', id: m.id }); F.ui(true);
    if (!$('#card .bar.sel [data-act^="mpick:"]')) bad.push('Market: the goods are not one selector');
    if ($('#card .thin')) bad.push('Market: the goods selector is marked thin, which EXCEPTIONS #13 does not name');
    if (!$(`#card [data-act="douse:${m.id}"]`) || !/health/.test($('#card').innerText)) bad.push('Market: a burning Market has no Send help or no health (it skips the shared page)');
    m.fire = 0; }
  } catch (e) { bad.push('the Market: the check could not run: ' + e.message); }
  // E1: the Army card's Train soldiers fold has no stray commas in its ranks
  try {
  { F.act('close'); P.techs.add('command'); F.fxDirty(); F.openCard({ type: 'troops' }); const f = $('#card [data-f="armytrain"]'); if (f) f.open = true; F.ui(true);
    const commas = $$('#card .fm').reduce((n, e) => n + [...e.childNodes].filter((x) => x.nodeType === 3 && x.textContent.trim() === ',').length, 0);
    if (commas) bad.push(`E1: ${commas} commas between the Army card's Train buttons`); P.techs.delete('command'); F.fxDirty(); }
  } catch (e) { bad.push('E1: the check could not run: ' + e.message); }
  // E2: a workshop counts what it makes, on the building: a worker sent to it for 90 s makes some, and the card says that many (not its
  // worker's life of gathering)
  try {
  { const w = put('workshop'); for (const g in P.goods) P.goods[g] = 200;
    F.sendVil(0, w.node.id); for (let i = 0; i < 30 * 90; i++) F.step(1 / 30);
    const wk = G.units.find((u) => u.owner === 0 && u.node === w.node); if (wk) wk.st.got += 512; // its worker's life of gathering, which the card must not show
    F.openCard({ type: 'bld', id: w.id }); F.ui(true);
    const made = Math.floor(w.made || 0), said = ($('#card').innerText.match(/(\d+) made/) || [])[1];
    if (!(made >= 1)) bad.push(`E2: the workshop made nothing in 90 s: its counter does not count (${w.made})`);
    else if (String(made) !== said) bad.push(`E2: the workshop says ${said} made, its counter ${made}`);
    if (wk) F.setJob(wk, null); F.act('close'); }
  } catch (e) { bad.push('E2: the check could not run: ' + e.message); }
  // E4: a find under the fog cannot be tapped open; the same find, once explored, can (the control: the test can fail)
  try {
  { F.act('close'); G.fogOn = true; const cell = (n) => Math.min(Math.max((n.y / 40) | 0, 0), Math.sqrt(G.fog.length) - 1) * Math.sqrt(G.fog.length) + Math.min(Math.max((n.x / 40) | 0, 0), Math.sqrt(G.fog.length) - 1);
    let done = false;
    for (const n of G.nodes.filter((x) => x.kind !== 'farm' && x.amt > 0 && F.fogAt(x.x, x.y) === 0)) {
      const c = cell(n), was = G.fog[c]; F.cam.x = n.x; F.cam.y = n.y; const at = [F.SX(n.x), F.SY(n.y) - 6 * F.cam.z];
      G.fog[c] = 1; const seen = F.hitAt(...at); G.fog[c] = 0; const hid = F.hitAt(...at); G.fog[c] = was;
      if (seen.t !== 'node' || seen.e !== n) continue; // something else is under the finger there: try another
      done = true; if (hid.t === 'node' && hid.e === n) bad.push(`E4: a ${n.kind} under the fog was tapped open`); break; }
    if (!done) bad.push('E4: no find under the fog to test'); G.fogOn = false; F.cam.x = k.x; F.cam.y = k.y; }
  } catch (e) { bad.push('E4: the check could not run: ' + e.message); }
  // E5: a second finger lets go of the box and the crosshair's glow
  try {
  { const cv = $('#cv'), r = cv.getBoundingClientRect(), ev = (t, id, x) => cv.dispatchEvent(new PointerEvent(t, { pointerId: id, clientX: r.left + x, clientY: r.top + 300, bubbles: true }));
    G.box = { mode: 'box', x0: 0, y0: 0, x1: 50, y1: 50 }; G.hud.drag = true; ev('pointerdown', 7, 100); ev('pointerdown', 8, 200);
    if (G.box || G.hud.drag) bad.push('E5: a pinch left the box drawn or the crosshair glowing'); ev('pointerup', 8, 200); ev('pointerup', 7, 100); }
  } catch (e) { bad.push('E5: the check could not run: ' + e.message); }
  // E6: a dim Train button says why it cannot (here the line is full), never its cost as if payable
  try {
  { const keep = F.keepOf(0); keep.q.length = 0; for (let i = 0; i < 12; i++) F.train(0, 'vil'); const why = F.trainWhy(0, 'vil'), d = document.createElement('div');
    d.innerHTML = F.trainButtons(['vil'])[0]; const b = d.firstElementChild;
    if (!why) bad.push('E6: the check could not fill the line'); else if (!b.classList.contains('dis') || b.querySelector('small.can') || !b.innerText.includes(why.replace(/\.$/, ''))) bad.push('E6: a dim Train button does not say why: ' + b.innerText.replace(/\n/g, ' '));
    keep.q.length = 0; }
  } catch (e) { bad.push('E6: the check could not run: ' + e.message); }
  // E7: the Town Center pauses on its Relations tab whichever way you came, and carries on when the tab turns back
  try {
  { F.act('close'); F.setPause(false); G.ktab = 'town'; F.openCard({ type: 'bld', id: k.id }); F.ui(true); if (G.paused) bad.push('E7: the Town tab paused the game');
    $('#card [data-act="ktab:rel"]').click(); F.ui(true); if (!G.paused) bad.push('E7: turning to the Relations tab did not pause the game');
    $('#card [data-act="ktab:town"]').click(); F.ui(true); if (G.paused) bad.push('E7: turning back to the Town tab left the game paused'); F.act('close'); F.setPause(true); }
  } catch (e) { bad.push('E7: the check could not run: ' + e.message); }
  // a locked place in the line names its research (+1 Records, +2 Guilds), not "research"
  try {
  { F.openCard({ type: 'bld', id: k.id }); F.ui(true); const l = $('#card [data-act^="qlock:"]');
    if (l && /^\+\d\s*research$/i.test(l.innerText.replace(/\n/g, ' ').trim())) bad.push('a locked place in the line says "' + l.innerText.replace(/\n/g, ' ') + '", not its research'); F.act('close'); }
  } catch (e) { bad.push('a locked place in the line names its res: the check could not run: ' + e.message); }
  // the row: Emergency a slot (the cycle button's width) on the cycle button's rank, its word under its icon; War's steel panel holds both
  try {
  { F.hudPage('war'); F.ui(true); const e = $('#emgB').getBoundingClientRect(), c = $('#hudB').getBoundingClientRect();
    if (Math.abs(e.width - c.width) > 0.6 || Math.abs(e.top - c.top) > 0.6 || Math.abs(e.right - (innerWidth - 6)) > 0.6) bad.push(`the Emergency button is ${e.width.toFixed(1)} wide at ${Math.round(e.top)}, not a slot on the cycle button's rank (${c.width.toFixed(1)} at ${Math.round(c.top)})`);
    if (!$('#emgB .wd') || $('#emgB .wd').textContent !== F.ROW_WORD.emg) bad.push('the Emergency button has no word under its icon');
    const top = parseFloat(getComputedStyle($('#orders'), '::before').top), o = $('#orders').getBoundingClientRect();
    if (!(o.top + top <= c.top - 5)) bad.push("the War page's steel panel stops under the cycle button");
    F.hudPage('jobs'); F.ui(true); }
  } catch (e) { bad.push('the row: the check could not run: ' + e.message); }
  // the map: a label is 12 at the starting zoom, larger zoomed in, 9 at the floor zoomed out
  try {
  { const z = F.cam.z, px = () => F.LABEL.px * F.labelK(); F.cam.z = F.ZOOM_START; const a = px(); F.cam.z = 0.2; const b = px(); F.cam.z = 3; const c = px(); F.cam.z = z;
    if (Math.abs(a - 12) > 0.01 || Math.abs(b - 9) > 0.01 || !(c > 12)) bad.push(`the map's labels are ${a.toFixed(1)} at the start, ${b.toFixed(1)} zoomed out, ${c.toFixed(1)} zoomed in: not 12, 9 and larger`); }
  } catch (e) { bad.push('the map: the check could not run: ' + e.message); }
  return bad;
}"""
DRAG = r"""() => { const F = window.__fk; F.newGame(5); F.act('close'); const G = F.G; G.P[0].res.g = 9999; G.ktab = 'mis'; F.openCard({ type: 'bld', id: F.keepOf(0).id }); F.ui(true);
}"""
# the Mail with a group's filter on, at four sizes: every page is the same height, nothing scrolls, Next stays where the finger is
MAILPAGES = r"""() => { const F = window.__fk; F.newGame(5); F.act('close'); const G = F.G; G.mail = [];
  for (let i = 0; i < 26; i++) F.news(i % 2 ? 'realm' : 'trade', 'A line of the mail, letter ' + 'abcdefghijklmnopqrstuvwxyz'[i] + '.', '', 4);
  F.act('mail'); F.act('mailg:realm'); F.ui(true); const out = [], at = [];
  for (let p = 0; p < 3; p++) { const c = document.getElementById('card'), n = document.querySelector('#card [data-act="mailp:1"]').getBoundingClientRect();
    if (c.scrollHeight > c.clientHeight + 1) out.push(`page ${p + 1} scrolls ${c.scrollHeight - c.clientHeight} px`); at.push(Math.round(n.top) + ',' + Math.round(n.left));
    document.querySelector('#card [data-act="mailp:1"]').click(); F.ui(true); }
  if (new Set(at).size > 1) out.push(`Next moves between pages: ${at.join(' / ')}`);
  if (!document.querySelector('#card [data-act^="mailtog:"]')) out.push('the preview switch is not on the card');
  return out; }"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(viewport={'width': 390, 'height': 844}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(500)
        try: bad = await pg.evaluate(JS)
        except Exception as e: bad = ['the card checks could not run: ' + str(e)[:300]]
        # the gift slider dragged with a finger from 0 to the far end: the switch turns on at the first step, and the drag goes on to the end
        try:
            await pg.evaluate(DRAG); await pg.wait_for_timeout(400)   # the card rises to its ranks first
            r = await pg.evaluate("() => { const el = document.querySelector(`#card input[data-in='relgift:${window.__fk.WILD}']`), r = el.getBoundingClientRect(); el.__dragged = true; return { x0: r.left + 8, x1: r.right - 2, y: r.top + r.height / 2 }; }")
            await pg.mouse.move(r['x0'], r['y']); await pg.mouse.down()
            for i in range(1, 13): await pg.mouse.move(r['x0'] + (r['x1'] - r['x0']) * i / 12, r['y']); await pg.wait_for_timeout(30)
            await pg.mouse.up(); got = await pg.evaluate("() => { const F = window.__fk, el = document.querySelector(`#card input[data-in='relgift:${F.WILD}']`); return [((F.G.relPick || {})[F.WILD] || {}).gift || 0, !!(el && el.__dragged), !!((F.G.relPick || {})[F.WILD] || {}).on]; }")
            if got[0] < 250 or not got[2]: bad.append(f'Relations: a drag across the gift slider stopped at {got[0]}g (switch on: {got[2]}): the slider was rebuilt under the finger')
            elif not got[1]: bad.append('Relations: the gift slider is a new node after the drag: a class change rebuilt it')
        except Exception as e: bad.append('the slider drag could not run: ' + str(e)[:200])
        try:
            for W, H in [(375, 667), (390, 844), (393, 852), (430, 932)]:
                await pg.set_viewport_size({'width': W, 'height': H}); await pg.wait_for_timeout(150)
                await pg.evaluate("() => { window.__fk.newGame(5); window.__fk.act('close'); }"); await pg.wait_for_timeout(50)
                r = await pg.evaluate(MAILPAGES); await pg.wait_for_timeout(300); r = await pg.evaluate(MAILPAGES)   # the second run: the card has risen to its ranks
                if W >= 390: bad += [f'Mail with a filter at {W}x{H}: {x}' for x in r]
                elif any(x.startswith('Next moves') or 'switch' in x for x in r): bad += [f'Mail with a filter at {W}x{H}: {x}' for x in r if not x.startswith('page')]
        except Exception as e: bad.append('the mail pages could not run: ' + str(e)[:200])
        await br.close()
    bad = bad + errs
    print(('PASS ' if not bad else 'FAIL ') + 'the cards of v80 (Setup stacked, Relations final, Mail pages, Market selector, E1 to E11, Emergency and the steel panel, map labels)', '' if not bad else bad)
    sys.exit(1 if bad else 0)
asyncio.run(main())
