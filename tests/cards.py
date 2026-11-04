# The cards of v80 (Albert's pictures, Oct 31; the audit's group E): each check below failed on the code before it and passes now. Run by the
# gate:  python3 tests/cards.py
#   Setup: each setting its own rank, its name quiet on the left, its choices one selector right-justified; Fog and Daily say their word once
#   p46 (Nov 3): the floor (every card's last rank at the screen's foot over the controller; New game and Welcome back may rise over the top bar);
#     New game, every question its own line, the Hazards label, the one info line; the villager and item mold (footprint, nine cells, outside tap)
#   Relations: a rank a side, the gift a slider with its switch, the stance three icons in two slots, a ✓ a row that sends that row only;
#     a friend's gift locked; the words friend, neutral, foe
#   Mail: six lines a page, Previous and Next, the 30 kept are five pages; the Market's goods one selector
#   E1 the Army card's Train fold has no commas; E2 a workshop counts what it made; E4 a find under the fog cannot be tapped; E5 a pinch lets
#   go of the box and the crosshair's glow; E6 a dim Train button says why; E7 the pause follows the tab; E11 a burning Market has Send help
#   The row: Emergency a slot on the cycle button's rank with its word; no panel behind it (Nov 2); a locked place in the line names its
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
    // Nov 3 (Albert: "all to be on their own line"): all seven settings on their own rank (name, choices), the last selector at the card's right edge
    const single = ranks.filter((r) => r.children.length === 2), paired = ranks.filter((r) => r.children.length === 4);
    if (single.length !== 7 || paired.length !== 0) bad.push(`Setup: ${single.length} settings on their own rank and ${paired.length} paired ranks, not 7 and 0 (Nov 3: every question its own line)`);
    for (const r of ranks) { const bars = r.querySelectorAll('.bar.sel'), b = bars[bars.length - 1].getBoundingClientRect(), n = r.querySelector('.info.quiet').getBoundingClientRect();
      if (Math.abs(b.right - card.right) > 1 || n.left > b.left) bad.push('Setup: a setting is not its name on the left and its choices right-justified: ' + r.textContent.trim().slice(0, 20)); }
    { const c = $('#card'); if (c.scrollHeight > c.clientHeight + 1 && innerWidth <= 375) bad.push('Setup: the start page scrolls at ' + innerWidth + ' px (' + c.scrollHeight + ' of ' + c.clientHeight + ')'); }
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
    if (!$(`#card [data-act="douse:${m.id}"]`) || !$('#card .tb h3.life')) bad.push('Market: a burning Market has no Send help or no health bar on its title (it skips the shared page)');
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
    F.setJob(G.units.find((u) => u.owner === 0 && u.kind === 'vil'), null); // a building takes an idle villager only (D-089)
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
  // S1, S2 (Albert, Nov 2): your own building's card has no "yours" line; its last rank is Send help (on what can burn), Repair and Raze, one slot each
  try {
  { const k0 = F.keepOf(0), sp = F.findSpot(0, 'house', k0.x, k0.y, 60, 300), h = sp && F.build(0, 'house', sp.x, sp.y); if (!h) bad.push('S1: no ground for a house'); else { h.prog = 1; h.hp = F.BLD.house.hp; F.built(h);
    F.openCard({ type: 'bld', id: h.id }); F.ui(true); const sub = document.querySelector('#card .sub');
    if (sub && /yours/.test(sub.innerText)) bad.push('S1: your own house says "yours" on a line of its own');
    const last = [...document.querySelectorAll('#card .fm')].find((r) => r.querySelector('[data-act^="takedown:"]'));
    if (!last) bad.push('S2: no Raze on the house card');
    else { const acts = [...last.children].map((c) => (c.dataset.act || '').split(':')[0]);
      if (acts.join() !== 'douse,repair,takedown') bad.push('S2: the last rank is ' + acts.join(', ') + ', not Help, Repair, Raze');
      if (!last.classList.contains('c6')) bad.push('S2: the last rank is not one slot each');
      if (!/Raze/.test(last.innerText)) bad.push('S2: the last button does not say Raze'); }
    F.closeCard(); } }
  } catch (e) { bad.push('S2: the check could not run: ' + e.message); }
  // T1 (Albert, Nov 2): on a building card, Train and Research are double-wide, three a rank, a short rank filled with empty places
  try {
  { const h = G.blds.find((x) => x.owner === 0 && x.kind === 'house' && x.prog >= 1) || F.keepOf(0); F.openCard({ type: 'bld', id: h.id }); F.ui(true);
    const R = [...document.querySelectorAll('#card .fm.c3')].filter((r) => r.querySelector('[data-act^="train:"], [data-act^="tech:"], [data-act^="research:"]'));
    if (!R.length) bad.push('T1: no Train or Research rank on the ' + h.kind + ' card');
    for (const r of R) if (r.children.length % 3) bad.push('T1: a Train or Research rank of ' + r.children.length + ' places, not filled to three (' + r.innerText.replace(/\n/g, ' ').slice(0, 60) + ')');
    F.closeCard(); }
  } catch (e) { bad.push('T1: the check could not run: ' + e.message); }
  // Q1 (Albert, Nov 2): the line sits in its steel box above the Train rank, not under it
  try {
  { const keep = F.keepOf(0); keep.q.length = 0; F.train(0, 'vil'); F.openCard({ type: 'bld', id: keep.id }); F.ui(true);
    const q = $('#card .fm.queue'), t = $('#card [data-act^="train:"]');
    if (!q) bad.push('Q1: the training line has no steel box'); else if (t && !(q.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING)) bad.push('Q1: the training line sits under the Train rank, not above it');
    keep.q.length = 0; F.closeCard(); }
  } catch (e) { bad.push('Q1: the check could not run: ' + e.message); }
  // the levels (Albert, Nov 2): a dim tech's edge is faint white, a dim Train's the slot's edge; the cycle button the same on every page
  try {
  { const keep = F.keepOf(0); keep.q.length = 0; for (let i = 0; i < 12; i++) F.train(0, 'vil'); F.openCard({ type: 'bld', id: keep.id }); F.ui(true);
    const a = $('#card [data-act^="tech:"].dis'), b = $('#card [data-act^="train:"].dis'), ec = (e) => getComputedStyle(e).borderTopColor;
    if (!a || !b) bad.push('the levels: no dim tech and dim Train button on the Town Center card'); else if (ec(a) === ec(b)) bad.push(`the levels: a dim tech's edge (${ec(a)}) is the same as a dim Train button's`);
    keep.q.length = 0; F.closeCard(); }
  } catch (e) { bad.push('the levels: the check could not run: ' + e.message); }
  // card sizes (Albert, Nov 2; Nov 3: on the floor): a card is as tall as it holds; on the House, the Barracks and the Town Center the last
  // button sits one gap above the screen's foot (over the controller), nothing scrolls, and the next card does not keep the last one's height
  try {
  for (const kind of ['house', 'barracks', 'keep']) { const b = G.blds.find((x) => x.owner === 0 && x.kind === kind && x.prog >= 1) || put(kind); F.openCard({ type: 'bld', id: b.id }); F.ui(true);
    const c = $('#card'), last = Math.max(...[...c.querySelectorAll('button')].map((x) => x.getBoundingClientRect().bottom));
    if (Math.abs(innerHeight - last - 6) > 1.5 || c.scrollHeight > c.clientHeight + 1) bad.push(`card sizes: on the ${kind} the last button is ${Math.round(innerHeight - last)} px above the screen's foot (one gap is 6)${c.scrollHeight > c.clientHeight + 1 ? ', and it scrolls' : ''}`);
    F.closeCard(); }
  } catch (e) { bad.push('card sizes: the check could not run: ' + e.message); }
  // the floor (Albert, Nov 3, "scooch this down 2 rows to start at the floor"): a card's last rank is at the screen's foot, over the controller;
  // the Build card and a building's keep the top bar in sight, New game and Welcome back may rise over it; #app wears cardUp while a card shows
  try {
  for (const [name, open, over] of [['the Build card', () => F.act('menu:land'), false], ['a House', () => F.openCard({ type: 'bld', id: put('house').id }), false], ['New game', () => F.openCard({ type: 'setup' }), true], ['Welcome back', () => F.openCard({ type: 'resume', t: 300, age: 1, civ: P.civ }), true]]) {
    open(); F.ui(true); const r = $('#card').getBoundingClientRect(), t = $('#tally').getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, innerHeight - 20);
    if (Math.abs(innerHeight - r.bottom - 3) > 1.5) bad.push(`floor: ${name} stands ${Math.round(innerHeight - r.bottom)} px above the screen's foot, not 3 (it sits on the controller)`);
    if (!e || !e.closest('#card')) bad.push(`floor: ${name} is drawn under the controller`);
    if (!$('#app').classList.contains('cardUp')) bad.push(`floor: #app does not wear cardUp while ${name} shows`);
    if (!over && r.top < t.bottom - 1) bad.push(`floor: ${name} covers the top bar (its top ${Math.round(r.top)}, the bar's foot ${Math.round(t.bottom)})`);
    F.closeCard(); if ($('#app').classList.contains('cardUp')) bad.push(`floor: #app keeps cardUp after ${name} closed`); }
  } catch (e) { bad.push('floor: the check could not run: ' + e.message); }
  // New game (Albert, Nov 3): every question its own line, the hazards under a label line, the people with none, ONE info line above Start: the last
  // option tapped says what it means (its sentence from SET_WHY, a hazard's desc, a people's bonus); nothing tapped, the picked people's bonus
  try {
  F.openCard({ type: 'setup' }); F.ui(true);
  { const rows = [...$$('#card .cin > .fm')], names = ['Difficulty', 'Length', 'Scenario', 'World', 'Fog', 'Tension', 'Daily'], q = rows.filter((r) => r.querySelector('.info.quiet') && r.querySelector('.bar.sel')), lefts = q.map((r) => Math.round(r.querySelector('.info.quiet').getBoundingClientRect().left));
    if (q.map((r) => r.querySelector('.info.quiet').textContent.trim()).join() !== names.join()) bad.push('newgame: the lines are ' + q.map((r) => r.querySelector('.info.quiet').textContent.trim()).join() + ', not ' + names.join());
    if (new Set(lefts).size !== 1) bad.push('newgame: the labels do not start at one indent: ' + lefts.join());
    const hz = $('#card [data-act^="hz:"]').closest('.fm'), lab = hz.previousElementSibling, ppl = $('#card [data-act^="civ:"]').closest('.fm');
    if (!lab || !/^Hazards/.test(lab.textContent.trim()) || !lab.querySelector('.quiet')) bad.push('newgame: the hazards have no label line saying what the numbers are');
    else if (!/point/.test(lab.textContent)) bad.push('newgame: the hazards label does not say the numbers are points');
    if (ppl.children.length !== 1 || ppl.querySelector('.quiet')) bad.push('newgame: the people row has a label');
    if ($$('#card .info.say').length !== 1) bad.push('newgame: ' + $$('#card .info.say').length + ' info lines, not one');
    const line = () => $('#card .info.say').innerText.replace(/\s+/g, ' ').trim(), bt = (a) => { const b = $(`#card [data-act="${a}"]`); if (!b) bad.push('newgame: no option ' + a); else b.click(); };
    if (!line().includes(F.CIVS[F.SET.civ].bonus)) bad.push('newgame: with nothing tapped the info line is "' + line() + '", not the people\'s bonus');
    if (!($('#card .info.say').compareDocumentPosition($('#card [data-act="fresh"], #card [data-act="today"]')) & Node.DOCUMENT_POSITION_FOLLOWING) || $('#card .info.say').closest('.fm').nextElementSibling !== $('#card [data-act="fresh"], #card [data-act="today"]').closest('.fm')) bad.push('newgame: the info line is not just above Start');
    for (const [a, want] of [['diff:hard', F.SET_WHY.diff.hard], ['mode:t15', F.SET_WHY.mode.t15], ['scen:siege', F.SET_WHY.scen.siege], ['fantasy:1', F.SET_WHY.fantasy[1]], ['fog:0', F.SET_WHY.fog[0]], ['tension:winner', F.SET_WHY.tension.winner], ['daily:1', F.SET_WHY.daily[1]], ['hz:plague', F.HAZARDS.plague.desc], ['civ:han', F.CIVS.han.bonus]]) {
      bt(a); F.ui(true); if (!line().includes(want)) bad.push(`newgame: after ${a} the info line is "${line().slice(0, 50)}", not "${want.slice(0, 40)}"`); }
    if (F.SET.diff !== 'hard' || F.SET.mode !== 't15' || !F.SET.fantasy) bad.push('newgame: a tapped option was not selected');
    for (const s of Object.values(F.SET_WHY).flatMap((o) => Object.values(o))) { if (s.split(/\s+/).length > 10) bad.push('newgame: a sentence over ten words: ' + s); if (/'/.test(s)) bad.push('newgame: an apostrophe in a sentence: ' + s); }
    F.act('diff:normal'); F.act('mode:t60'); F.act('fantasy:0'); F.act('daily:0'); F.act('hz:plague'); F.act('civ:roman'); F.openCard({ type: 'setup' }); F.ui(true);
    if (F.G.card.tip) bad.push('newgame: a new card kept the last card\'s tap'); }
  F.closeCard();
  } catch (e) { bad.push('newgame: the check could not run: ' + e.message); }
  // the villager's card and the item cards, one mold (Albert, Nov 3): columns 3 to 5 of the controller's seven, a tab over column 3 holding the kind's
  // icon, nine cells; no title, no close; a tap anywhere outside closes it; Go picks the villager, so the next tap on the ground is their order
  const foot = () => { const c = $('#card'), col = (innerWidth - 30) / 7; return { m: c.querySelector('.mb').getBoundingClientRect(), t: c.querySelector('.mt').getBoundingClientRect(), col }; };
  const acts9 = () => [...$$('#card .mb > *')].map((c) => (c.dataset.act ? c.dataset.act.split(':')[0] : c.classList.contains('empty') ? '_' : '-')).join();
  const outside = () => $('#tally').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 9 }));
  try {
  const v = G.units.find((u) => u.owner === 0 && u.kind === 'vil'); F.openCard({ type: 'unit', id: v.id }); F.ui(true); v.carry = 8; v.carryType = 'wood'; F.ui(true);
  { const { m, t, col } = foot(), cells = [...$$('#card .mb > *')], one = JSON.stringify([m.left, m.width, innerHeight - m.bottom].map(Math.round));
    if (!$('#card').classList.contains('mold') || cells.length !== 9) bad.push(`villager: ${cells.length} cells, not a 3 x 3 mold`);
    if ($('#card .tb') || $('#card [data-act="close"]') || $('#card .sub') || $('#card h3')) bad.push('villager: a title bar, a close button or a title is still on the card');
    if (Math.abs(m.left - (6 + 2 * (col + 3))) > 1 || Math.abs(m.width - (3 * col + 6)) > 1.5 || Math.abs(innerHeight - m.bottom - 6) > 1.5) bad.push(`villager: the footprint is x ${Math.round(m.left)} w ${Math.round(m.width)} foot ${Math.round(innerHeight - m.bottom)}, not columns 3 to 5 on the floor`);
    if (Math.abs(t.left - m.left) > 1 || Math.abs(t.width - col) > 1.5 || !$('#card .mt svg') || $('#card .mt button')) bad.push('villager: the tab is not one plain icon cell over column 3');
    if (cells.some((c) => Math.abs(c.getBoundingClientRect().height - 44) > 0.5 || Math.abs(c.getBoundingClientRect().width - col) > 1.5)) bad.push('villager: a cell is not one column wide and 44 tall');
    if (Math.abs(cells[1].getBoundingClientRect().left - cells[0].getBoundingClientRect().right - 3) > 0.6) bad.push('villager: the gap between cells is not 3');
    if (acts9() !== 'vwalk,pbuild,vjob,-,-,-,vstop,vhome,vgo') bad.push('villager: the cells are ' + acts9() + ', not Go, Build, Job, Doing, Health, Carrying, Stop, Home, Dismiss');
    const tx = (i) => cells[i].innerText.replace(/\s+/g, ' ').trim();
    if (/\s/.test(tx(3).replace(/ doing$/, ''))) bad.push('villager: Doing is more than one word: ' + tx(3));
    if (tx(4) !== `${Math.round(v.hp)}/${Math.round(v.max)} health`) bad.push('villager: Health reads "' + tx(4) + '"');
    if (tx(5) !== '8 Wood') bad.push('villager: Carrying reads "' + tx(5) + '", not "8 Wood"'); v.carry = 0; F.ui(true); if (tx(5) !== 'Nothing carrying') bad.push('villager: nothing carried reads "' + tx(5) + '"'); v.carry = 8; F.ui(true);
    if (/\b(age|speed)\b/i.test($('#card').innerText)) bad.push('villager: age or speed is still on the card');
    const cs = (e, p) => getComputedStyle(e)[p];
    if (cs(cells[0], 'backgroundColor') === cs(cells[3], 'backgroundColor') || cs(cells[0], 'borderTopColor') === cs(cells[3], 'borderTopColor')) bad.push('villager: a tap cell and an info cell look alike');
    const o = getComputedStyle($('#card .mb'), '::before'); if (o.borderTopColor !== getComputedStyle($('#card .mt'), '::before').borderTopColor || o.borderTopRightRadius !== '9px' || o.borderTopLeftRadius !== '0px') bad.push('villager: the gold outline is not one radius-9 outline round the tab and the body');
    const j0 = v.job; $('#card [data-act^="vjob:"]').click(); F.ui(true); if (v.job !== F.RES[(F.RES.indexOf(j0) + 1) % F.RES.length]) bad.push('villager: Job did not take the next job');
    if (G.pickSet && G.pickSet.has('unit' + v.id)) bad.push('villager: picked before Go');
    $('#card [data-act^="vwalk:"]').click(); F.ui(true); if (!G.pickSet.has('unit' + v.id) || !G.card) bad.push('villager: Go did not pick them and keep the card');
    outside(); if (G.card) bad.push('villager: a tap outside the card did not close it');
    // with them picked a tap on open ground is their order: it orders and the card is gone
    F.setPick([]); v.post = null; G.fogOn = false;
    let p = null; for (let y = 260; y < 500 && !p; y += 23) for (let x = 60; x < 330 && !p; x += 23) if (F.hitAt(x, y).t === 'ground') p = [x, y];
    F.openCard({ type: 'unit', id: v.id }); F.ui(true); $('#card [data-act^="vwalk:"]').click(); outside(); F.tapAt(...p); if (!v.post || G.card) bad.push('villager: a tap on open ground with them picked was not their order and a close');
    F.openCard({ type: 'unit', id: v.id }); F.ui(true); $('#card .mb').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 9 })); if (!G.card) bad.push('villager: a tap inside the card closed it');
    $('#card [data-act^="vgo:"]').click(); F.ui(true); if (!$('#card [data-act^="vgo:"]').classList.contains('warn') || v.hp <= 0) bad.push('villager: Dismiss did not ask first');
    F.closeCard(); G.confirm = null;
    // item cards: the same footprint, the same nine cells (a berry bush, a tree, a bear)
    const k = F.keepOf(0), near = (kind) => G.nodes.filter((n) => n.kind === kind && n.amt > 0).sort((a, c) => Math.hypot(a.x - k.x, a.y - k.y) - Math.hypot(c.x - k.x, c.y - k.y))[0];
    for (const kind of ['bush', 'tree']) { const n = near(kind); F.openCard({ type: 'node', id: n.id }); F.ui(true); const w = JSON.stringify([foot().m.left, foot().m.width, innerHeight - foot().m.bottom].map(Math.round)), cl = [...$$('#card .mb > *')], tt = (i) => cl[i].innerText.replace(/\s+/g, ' ').trim();
      if (w !== one) bad.push(`items: the ${kind} card's footprint ${w} is not the villager's ${one}`);
      if (acts9() !== 'sendvil,jump,info,-,-,-,-,-,-' || cl.length !== 9 || $('#card .tb') || $('#card [data-act="close"]')) bad.push(`items: the ${kind} cells are ${acts9()}, not Send, Locate, Info, then six info cells, no title bar`);
      const dr = F.dropFor(0, n.type, n), mul = F.gatherMul(0, n);
      if (tt(3) !== `${Math.round(n.amt)} left`) bad.push(`items: Left reads "${tt(3)}" for ${Math.round(n.amt)}`);
      if (tt(4) !== `${dr ? Math.round(Math.hypot(dr.x - n.x, dr.y - n.y)) : 'none'} drop-off`) bad.push(`items: Drop reads "${tt(4)}", not the nearest drop-off's distance`);
      if (tt(7) !== `${Math.round((n.rate || F.RATE_OF[n.kind]) * mul * 60)} a minute` || tt(8) !== `${F.carryOf(0)} a trip` || !/^\d+\/\d+ working$/.test(tt(6))) bad.push(`items: the ${kind}'s last rank reads "${tt(6)}", "${tt(7)}", "${tt(8)}"`);
      $('#card [data-act="info"]').click(); F.ui(true); if (!$('#card .infoP') || !$('#card .infoP').innerText.includes(F.nodeName(n))) bad.push(`items: Info on the ${kind} did not open its book`); F.act('info'); F.closeCard(); }
    { const b = F.addUnit(F.WILD, 'bear', k.x + 80, k.y + 80); F.openCard({ type: 'unit', id: b.id }); F.ui(true); const cl = [...$$('#card .mb > *')], tt = (i) => cl[i].innerText.replace(/\s+/g, ' ').trim();
      if (acts9() !== 'hunt,jump,info,_,-,_,-,-,-') bad.push('items: the bear cells are ' + acts9() + ', not Send a hunter, Locate, Info, an empty Left, Drop, an empty Bonus, then three');
      if (tt(6) !== '150/150 health' || tt(7) !== `${Math.round(F.UNIT.bear.dmg)} danger` || tt(8) !== `${F.UNIT.bear.meat} meat`) bad.push(`items: the bear's last rank reads "${tt(6)}", "${tt(7)}", "${tt(8)}"`);
      const w = JSON.stringify([foot().m.left, foot().m.width, innerHeight - foot().m.bottom].map(Math.round)); if (w !== one) bad.push(`items: the bear card's footprint ${w} is not the villager's ${one}`);
      F.closeCard(); b.hp = 0; }
    const d = F.addUnit(F.WILD, 'deer', k.x + 90, k.y + 90); F.openCard({ type: 'unit', id: d.id }); F.ui(true); if (acts9() !== 'hunt,jump,info,_,-,_,-,_,-') bad.push('items: the deer cells are ' + acts9() + ', a deer has no danger'); F.closeCard(); d.hp = 0;
  }
  } catch (e) { bad.push('villager: the check could not run: ' + e.message); }
  // the title box (Albert, Nov 2): a building's health a bar under its name and its age the top edge; no second line on your own House;
  // a building going up wears the working ring instead
  try {
  { const H = put('house'); H.hp = F.BLD.house.hp / 2; F.openCard({ type: 'bld', id: H.id }); F.ui(true); const t = $('#card .tb h3');
    if (!t.classList.contains('life') || !t.classList.contains('a' + (F.BLD.house.age || 0)) || t.style.getPropertyValue('--hp') !== '50%') bad.push(`the title box: the House's title is "${t.className}" ${t.style.cssText}, not its health (50%) and age`);
    if ($('#card .sub')) bad.push('the title box: your own House still has a second line: ' + $('#card .sub').innerText);
    H.prog = 0.4; F.ui(true); if (!$('#card .tb h3').classList.contains('work')) bad.push('the title box: a House going up does not wear the working ring');
    H.prog = 1; H.hp = F.BLD.house.hp; F.closeCard(); }
  } catch (e) { bad.push('the title box: the check could not run: ' + e.message); }
  // the controller (Albert, Nov 3): one brown; the war tiles glow ember, the villagers' and the map tile do not; the open page a step lighter; Alarm a villager page inside War; the small map only in its box
  try {
  { F.closeCard(); F.hudPage('war'); F.ui(true); const cs = (sel, k) => $(sel) && getComputedStyle($(sel))[k], glow = (sel) => /0\.8\d+ 0\.3\d+ 0\.1\d+|214, 96, 48/.test(cs(sel, 'boxShadow'));
    if (cs('#row [data-act="wsq:0"]', 'backgroundColor') === cs('#row [data-act="ctl:jobs"]', 'backgroundColor')) bad.push('the controller: the open War page is not a step lighter than a tile at rest');
    if (!glow('#row [data-act="ctl:war"]') || !glow('#row [data-act="wsq:0"]')) bad.push('the controller: a war tile wears no ember glow');
    if (glow('#row [data-act="ctl:jobs"]')) bad.push('the controller: a villager tile glows ember');
    if (!$('#row [data-act="ctlsub:alarm"].vo')) bad.push('the controller: Alarm is not a villager page on the War page');
    F.act('ctlsub:alarm'); F.ui(true); if (!$('#row [data-act="emg:square"].v2')) bad.push('the controller: the Alarm orders are not a page under War');
    F.hudPage(null); F.ui(true); if (glow('#row [data-act="mapt"]')) bad.push('the controller: the map tile glows ember');
    G.incoming = true; F.ui(true); if (cs('#row [data-act="ctl:war"]', 'animationName') !== 'ember') bad.push('the controller: an attack coming does not breathe the War glow'); G.incoming = false; F.ui(true); F.hudPage('war'); F.ui(true);
    F.hudPage(null); F.ui(true); if ($('#mini').parentNode === $('#stage') || !$('#row .mapb #mini')) bad.push('the controller: the small map is not in its box at rest');
    F.act('mapt'); F.ui(true); if ($('#mini').parentNode !== $('#stage')) bad.push('the controller: the small map did not go back to the stage when taken down'); F.act('mapt'); F.ui(true); }
  } catch (e) { bad.push('the controller: the check could not run: ' + e.message); }
  // E6: a dim Train button says why it cannot (here the line is full), never its cost as if payable
  try {
  { const keep = F.keepOf(0); keep.q.length = 0; for (let i = 0; i < 12; i++) F.train(0, 'vil'); const why = F.trainWhy(0, 'vil'), d = document.createElement('div');
    d.innerHTML = F.trainButtons(['vil'])[0]; const b = d.firstElementChild;
    if (!why) bad.push('E6: the check could not fill the line'); else if (!b.classList.contains('dis') || b.querySelector('small.can') || !b.innerText.toLowerCase().includes('line full')) bad.push('E6: a dim Train button does not say why (its few words: line full, T1): ' + b.innerText.replace(/\n/g, ' '));
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
  // the row (Nov 3): no War button and no chevron above it; the small map never on the stage itself; no panel behind the row
  try {
  { if ($('#emgB') || $('#hudB')) bad.push('a button is still on the rank above the row');
    if ($('#stage > #mini') && getComputedStyle($('#stage > #mini')).display !== 'none') bad.push('the small map shows outside the controller');
    if (getComputedStyle($('#orders'), '::before').content !== 'none') bad.push('a panel is drawn behind the row (Albert, Nov 2: none)'); }
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
SMALL = r"""() => { const F = window.__fk, out = [], $ = (s) => document.querySelector(s); F.newGame(5); F.act('close'); const G = F.G;
  for (const [name, c] of [['New game', { type: 'setup' }], ['Welcome back', { type: 'resume', t: 300, age: 1, civ: G.P[0].civ }]]) { F.openCard(c); F.ui(true);
    const el = $('#card'), r = el.getBoundingClientRect(), t = $('#tally').getBoundingClientRect(), last = Math.max(...[...el.querySelectorAll('button')].map((x) => x.getBoundingClientRect().bottom));
    if (name === 'New game' && r.top >= t.bottom) out.push(name + ' does not rise over the top bar (its top ' + Math.round(r.top) + ', the bar\'s foot ' + Math.round(t.bottom) + ')');
    if (el.scrollHeight > el.clientHeight + 1) out.push(name + ' scrolls (' + el.scrollHeight + ' of ' + el.clientHeight + '): it is more than one page');
    if (Math.abs(innerHeight - last - 6) > 1.5) out.push(name + ' last rank is ' + Math.round(innerHeight - last) + ' px above the foot'); F.closeCard(); }
  const v = G.units.find((u) => u.owner === 0 && u.kind === 'vil'); F.openCard({ type: 'unit', id: v.id }); F.ui(true);
  for (const w of ['Quarrying', 'Butchery', 'Hiding', 'Guarding', 'Chopping', 'Standing', 'Working', 'Learning', 'Fighting', 'Carrying', 'Tending', 'Running']) { const b = $('#card .mb > .info b'); b.textContent = w; if (b.scrollWidth > b.clientWidth) out.push('the word ' + w + ' is cut in its cell (' + b.scrollWidth + ' over ' + b.clientWidth + ')'); }
  F.closeCard(); return out; }"""
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
        # the floor on the smallest phone (Albert, Nov 3): New game and Welcome back rise over the top bar, one page, their last rank at the screen's
        # foot; the villager's widest words fit their cell at 375
        try:
            await pg.set_viewport_size({'width': 375, 'height': 667}); await pg.wait_for_timeout(150)
            r = await pg.evaluate(SMALL); bad += [f'floor at 375x667: {x}' for x in r]
        except Exception as e: bad.append('the small-phone floor could not run: ' + str(e)[:200])
        await br.close()
    bad = bad + errs
    print(('PASS ' if not bad else 'FAIL ') + 'the cards of v80 (Setup stacked, Relations final, Mail pages, Market selector, E1 to E11, Emergency, no panel, map labels)', '' if not bad else bad)
    sys.exit(1 if bad else 0)
asyncio.run(main())
