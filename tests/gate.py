# The gate: what must hold before a build goes live, measured at four iPhone sizes, not judged by eye.
# No page errors; no two buildings alike at half zoom; nothing wider than the screen; every word inside its button; text at least 12 px; contrast at least 4.5:1 (target 7:1); no card but Help and the Guide needs scrolling from 390 × 844 up (the iPhone SE at 375 × 667 is too short for the biggest cards); every tap target at least 44 × 44 points (Apple's rule), except half slots: the − and + under each job and any half slot of the Formation (`.h`), 26 to 29 points wide (EXCEPTIONS.md #2); every card title fits its slots, and every word a slot of the row can show fits its slot, and every name a double-wide slot of a card can show fits it on one line (measured in the first slot of the Land tab, three a rank), and no cell of a card grows past its rank (Build 70; the vassal's page is not measured for that: it is Relations, Albert's open decision); the quick action's cells are slots, and its first icon opens under the finger, flipped near an edge (Build 70).
# Run from first-keep/:  python3 build.py && python3 wrap.py && python3 tests/gate.py   (add --soak for the long games, tests/soak.py)
import asyncio, json, os, subprocess, sys
from playwright.async_api import async_playwright
SIZES = [(375, 667), (390, 844), (393, 852), (430, 932)]
SETUP = """() => { const F = window.__fk; F.newGame(5); F.act('close'); const G = F.G, P = G.P[0], k = F.keepOf(0); F.setPause(true);
  P.age = 3; for (const r of ['f', 'w', 's', 'g', 'i']) P.res[r] = 9999; P.goods.cloth = 30; for (let i = 0; i < 12; i++) F.addUnit(0, 'spear', k.x + 60, k.y - 60);
  const put = kind => { const s = F.findSpot(0, kind, k.x, k.y, 70, 320); const b = F.build(0, kind, s.x, s.y); b.prog = 1; b.hp = F.BLD[kind].hp; F.built(b); return b.id; };
  window.IDS = { workshop: put('workshop'), farm: put('farm'), market: put('market'), house: put('house'), keep: k.id, vil: G.units.find((u) => u.owner === 0 && u.kind === 'vil').id }; F.navRebuild(); F.makeVassal(1, 0, 'fair'); window.IDS.vassal = F.keepOf(1).id;
  for (let i = 0; i < 7; i++) F.train(0, 'vil'); }"""
CARDS = [('help', "{type:'help'}"), ('setup', "{type:'setup'}"), ('army', "{type:'troops'}"), ('guide', "{type:'guide',page:'bld'}"),
         ('keep', "{type:'bld',id:IDS.keep}"), ('workshop', "{type:'bld',id:IDS.workshop}"), ('farm', "{type:'bld',id:IDS.farm}"),
         ('market', "{type:'bld',id:IDS.market}"), ('vassal', "{type:'bld',id:IDS.vassal}"), ('score', "{type:'score'}"), ('mail', "{type:'mail'}"), ('squad', "{type:'squad',i:0}"),
         ('villager', "{type:'unit',id:IDS.vil}"), ('stores', "{type:'stores'}"), ('house', "{type:'bld',id:IDS.house}"),
         # E8 (v80): the cards the gate never opened: Relations on its tab, Research, every milestone, and the Army card with Battalions (last: it researches)
         ('relations', "(window.__fk.G.ktab = 'rel', {type:'bld',id:IDS.keep})"), ('misfits', "(window.__fk.G.ktab = 'mis', {type:'bld',id:IDS.keep})"), ('research', "(window.__fk.G.ktab = 'town', {type:'research'})"),
         ('milestones', "(window.__fk.G.ms = Object.keys(window.__fk.MS_TEXT).map((id, i) => ({ id, t: 60 * i })), {type:'milestone'})"),
         ('army-squads', "(window.__fk.G.P[0].techs.add('command'), window.__fk.fxDirty(), {type:'troops'})")]
MEASURE = """() => {
  const lum = c => { const f = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const parse = s => { const m = s.match(/[\\d.]+/g), k = s.startsWith('color(') ? 255 : 1; return m ? [m[0] * k, m[1] * k, m[2] * k, m[3] == null ? 1 : +m[3]] : [0, 0, 0, 0]; };   // rgb(), and color(srgb …) as color-mix gives it
  const bg = el => { const st = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c[3] > 0) st.push(c); if (c[3] >= 1) break; } let col = [18, 23, 21]; for (let i = st.length - 1; i >= 0; i--) col = [0, 1, 2].map(j => st[i][j] * st[i][3] + col[j] * (1 - st[i][3])); return col; };
  const out = { wide: document.documentElement.scrollWidth > innerWidth + 1, tall: document.documentElement.scrollHeight > innerHeight + 1, small: [], size: [], font: [], low: [], clip: [], tap: [], scroll: '' };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const t = n.textContent.trim(), el = n.parentElement; if (!t || !el || el.closest('script,style,[hidden]')) continue;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el); if (!r.width || !r.height || cs.visibility === 'hidden' || r.bottom < 0 || r.top > innerHeight) continue;
    const px = parseFloat(cs.fontSize); if (px < 12) out.small.push(t.slice(0, 20) + ' ' + px);
    if (px !== 12 && px !== 18) out.size.push(t.slice(0, 20) + ' ' + px);   // two text sizes (v80, Albert): 12 and 18
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(); if (fam !== 'Barlow Semi Condensed' && fam !== 'IM Fell English SC') out.font.push(t.slice(0, 20) + ' ' + fam);
    else if (fam === 'Barlow Semi Condensed' && cs.fontWeight !== '600') out.font.push(t.slice(0, 20) + ' weight ' + cs.fontWeight);   // two fonts; Barlow at one weight, 600 (MAYBE)
    const fg = parse(cs.color), b = bg(el), L1 = lum(fg), L2 = lum(b), c = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); if (c < 4.5) out.low.push(t.slice(0, 20) + ' ' + c.toFixed(1));
  }
  for (const b of document.querySelectorAll('button')) { const r = b.getBoundingClientRect(); if (!r.width || b.closest('[hidden]')) continue; for (const e of b.querySelectorAll('b,small')) if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible') out.clip.push(e.textContent.slice(0, 24)); if (r.right > innerWidth + 1) out.clip.push('off screen: ' + b.textContent.slice(0, 20)); }
  for (const b of document.querySelectorAll('button,[data-act],summary')) { const r = b.getBoundingClientRect(); if (!r.width || b.closest('[hidden],.h,.hr,.thin') || r.bottom < 0 || r.top > innerHeight) continue; if (r.width < 44 || r.height < 44) out.tap.push((b.id || b.textContent.trim().slice(0, 14) || b.className) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); }
  out.grown = [...document.querySelectorAll('#card:not([hidden]) .fm>:not(.r2)')].filter((e) => e.getBoundingClientRect().height > 44.5).map((e) => e.textContent.trim().slice(0, 20) + ' ' + Math.round(e.getBoundingClientRect().height));   // a card is whole ranks: no cell taller than its slot (Build 70)
  { const c = document.getElementById('card'); out.scroll = c && !c.hidden && c.scrollHeight > c.clientHeight + 1 ? c.scrollHeight + '>' + c.clientHeight : ''; }
  for (const e of document.querySelectorAll('#card .info.line :is(b,small)')) if (e.scrollWidth > e.clientWidth + 1) out.clip.push('line: ' + e.textContent.slice(0, 16));   // a line of a card cut short (v80: a name in one slot)
  for (const e of document.querySelectorAll('.wd,.top .c')) { if (e.closest('[hidden]') || !e.getBoundingClientRect().width) continue; if (e.scrollWidth > e.clientWidth + 1) out.clip.push('tile: ' + e.textContent.slice(0, 16)); }
  return out; }"""
# Every title the game can show fits slots 2 to 4 of the title bar at 375 x 667, in the real font (MENU-SPEC §4, Build 70): the fixed titles (read
# from the source), every building name with its Medieval name and its research tiers, every unit of every people through stats at every rank, the
# wonders, the finds, the places, the squads. A name that does not fit fails the gate; its short form goes in TITLE_SHORT (src/07-text.js).
TITLES = """async (fixed) => { await document.fonts.ready; const F = window.__fk, P = F.G.P[0], names = new Set(fixed), civ = P.civ, had = P.techs;
  for (const k in F.BLD) { names.add(F.BLD[k].name); if (F.BLD[k].name3) names.add(F.BLD[k].name3); }
  for (const k in F.BTIER) for (const t of F.BTIER[k]) names.add(t.btier.name);
  for (const c in F.CIVS) { names.add(F.CIVS[c].wonder); P.civ = c; P.techs = new Set(); F.fxDirty(); const read = () => { for (const k in F.UNIT) if (!F.UNIT[k].civ) names.add(F.stats(0, F.civKind(0, k)).name); };
    read(); for (const t of F.TECH) if (t.tier) { P.techs.add(t.id); F.fxDirty(); read(); } }
  P.civ = civ; P.techs = had; F.fxDirty();
  for (const k in F.UNIT) names.add(F.UNIT[k].name); for (const k in F.FINDS) names.add(F.FINDS[k].name); for (const n of F.BN) names.add(n);
  for (const n of [{ kind: 'farm', type: 'food' }, { kind: 'farm', type: 'wood' }, ...['tree', 'bush', 'fish', 'stone', 'gold', 'iron', 'meat'].map((kind) => ({ kind }))]) names.add(F.nodeName(n));
  F.openCard({ type: 'stores' }); const h = document.querySelector('#card .tb h3'), out = [];
  for (const n of names) { h.textContent = F.TITLE_SHORT[n] || n; if (h.scrollWidth > h.clientWidth) out.push(`${n} ${h.scrollWidth}>${h.clientWidth}`); }
  F.act('close'); return [names.size, out]; }"""
# Every word a slot of the row can show fits its slot at 375 x 667, in the real font (MENU-SPEC §6, Build 70): the row's own words and the page names
# (ROW_WORD, the paces with them), the jobs, the squads, the four kinds; under a squad the longest time; beside an icon the widest count. Measured in a
# real slot of the War page, the cycle button and an info cell. A word that does not fit fails the gate:  --word "a long word"  shows it failing.
SLOT_WORDS = """async (extra) => { await document.fonts.ready; const F = window.__fk, out = [];
  F.newGame(5); F.act('close'); const G = F.G; G.P[0].techs.add('command'); F.fxDirty(); F.sqPlan(0, 'foot', 1); F.hudPage(null); F.ui(true);
  const words = [...Object.values(F.ROW_WORD).flat(2), ...F.RES.map((r) => F.RESOURCES[r].name), ...F.BN, ...F.CLS.map((c) => c[1]), ...F.MENUS.map((m) => m.name), 'Barracks', 'Mixed', '30 s', ...extra],
    put = (e, t) => { e.textContent = t; return e; };
  F.act('ctl:war'); F.ui(true);   // the controller (Nov 3): a cell of the War page and the War tile, the narrowest (seven columns)
  const slot = document.querySelector('#row [data-act="wsq:0"]'), top = slot.querySelector('.top'), end = document.querySelector('#row [data-act="ctl:war"] .wd');
  for (const t of words) for (const e of [slot.querySelector('.wd'), end]) if (put(e, t).scrollWidth > e.clientWidth) out.push(`${t} ${e.scrollWidth}>${e.clientWidth}`);
  if (put(top.querySelector('.c'), String(F.POPMAX)) && top.scrollWidth > top.clientWidth) out.push(`the count ${F.POPMAX} beside an icon`);
  F.act('ctl:war'); F.act('close'); return [words.length + 1, out]; }"""
# Every name a double-wide slot of a card can show fits it on one line at 375 x 667, in the real font (MENU-SPEC §3, §8, Build 70): every research
# step (its short name where it has one), every building (the Build menu), every soldier of every people at every rank (a Train button, its short
# name from TITLE_SHORT). A name that wraps grows its rank off the grid, so it fails: its short form goes in its record (TECH short, BLD short) or TITLE_SHORT.
DOUBLES = """async (extra) => { await document.fonts.ready; const F = window.__fk, P = F.G.P[0], civ = P.civ, had = P.techs, names = new Set(extra);
  for (const t of F.TECH) names.add(F.TITLE_SHORT[t.short] || t.short || t.name); for (const k in F.BLD) names.add(F.BLD[k].short || F.BLD[k].name);
  for (const c in F.CIVS) { P.civ = c; P.techs = new Set(); F.fxDirty(); const read = () => { for (const k in F.UNIT) if (!F.UNIT[k].civ) { const n = F.stats(0, F.civKind(0, k)).name; names.add(F.TITLE_SHORT[n] || n); } };
    read(); for (const t of F.TECH) if (t.tier) { P.techs.add(t.id); F.fxDirty(); read(); } }
  P.civ = civ; P.techs = had; F.fxDirty(); F.openCard({ type: 'bld', id: F.keepOf(0).id }); const b = document.querySelector('#card [data-act^="train:"] b'), out = [], one = b.getBoundingClientRect().height;
  for (const n of names) { b.textContent = n; if (b.scrollWidth > b.clientWidth + 0.5 || b.getBoundingClientRect().height > one + 1) out.push(n); }
  F.act('close'); return [names.size, out]; }"""
# The quick action (MENU-SPEC §7, Build 70), at every size: each of its four cells is the screen's slot (W − 42) ÷ 6 by 44; opened in the middle,
# at the right edge, above the row and in that corner, its first icon (the sword) is right under the finger (its column on it, half a slot
# below it; above it when flipped at the row); the sword turns it to All in the same place. Left open in the middle for the page's measures.
QUICK = """async () => { const F = window.__fk, G = F.G, out = [];   // the quick action (Albert, Nov 3) is tested in the main run; here the hold on a button and the small map
  F.act('close'); const k = F.keepOf(0); F.addUnit(0, 'spear', k.x + 40, k.y + 40); 
  // a hold on a button (data-hold) survives a thumb that rolls a pixel or two (an audit, Nov 2); the lift after it is not a tap
  F.hudPage('war'); F.ui(true); const b = document.querySelector('#row [data-hold="whome"]'), r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  const ev = (type, dx) => b.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x + dx, clientY: y, pointerId: 1 }));
  G.msn[0] = { name: 'test', sq: 0, ord: -1, n0: 0, kinds: {}, what: 'Go to', label: '', x: k.x, y: k.y, t: G.t, due: G.t, st: 'go', odds: 0.5 };
  ev('pointerdown', 0); ev('pointermove', 3); await new Promise((r) => setTimeout(r, 420)); ev('pointerup', 3); b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  if (G.msn[0]) out.push('a held button whose thumb rolls 3 px lost its hold (everyone home did not fire)'); F.hudPage(null); F.ui(true);
  // the small map (Albert, Nov 2): a tap jumps the camera, a drag sweeps it with the finger and launches nobody (the hold launch is cut)
  { F.hudPage(null); F.ui(true); const m = document.getElementById('mini'), mr = m.getBoundingClientRect(), mev = (type, fx, fy) => m.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: mr.left + mr.width * fx, clientY: mr.top + mr.height * fy, pointerId: 2 }));
    mev('pointerdown', 0.2, 0.2); mev('pointermove', 0.6, 0.6); const cx = F.cam.x; mev('pointermove', 0.8, 0.8); if (!(F.cam.x > cx)) out.push('a drag on the small map did not sweep the camera');
    await new Promise((r) => setTimeout(r, 420)); if (G.qa) out.push('a drag on the small map put the chips up'); mev('pointerup', 0.8, 0.8); F.hudPage(null); F.ui(true); }
  return out; }"""
def fixed_titles():
    import re, glob
    return sorted(set(re.findall(r"\btitle\(\s*'([^']+)'", ''.join(open(f).read() for f in sorted(glob.glob('src/*.js'))))))
# Readability: at half zoom, no two buildings may share both their average colour (within 18) and their size (within 5 px)
LOOK = """() => { const F=window.__fk; F.newGame(5); const G=F.G; const s=1;   // zoom 0.5 at dpr 2
 const kinds=Object.keys(F.BLD).filter(k=>!['wall','gate','wonder'].includes(k)&&!F.BLD[k].trap), D={};
 for (const k of kinds) { const c=F.bldSprite({kind:k,owner:0},s), x=c.getContext('2d').getImageData(0,0,c.width,c.height).data; let n=0,r=0,g=0,b=0,x0=1e9,x1=-1,y0=1e9,y1=-1;
   for (let i=0;i<x.length;i+=4) if (x[i+3]>128) { n++; r+=x[i]; g+=x[i+1]; b+=x[i+2]; const p=i/4, px=p%c.width, py=(p/c.width)|0; x0=Math.min(x0,px); x1=Math.max(x1,px); y0=Math.min(y0,py); y1=Math.max(y1,py); }
   D[k]={rgb:[r/n,g/n,b/n],w:x1-x0,h:y1-y0}; }
 const same=[]; for (let i=0;i<kinds.length;i++) for (let j=i+1;j<kinds.length;j++) { const a=D[kinds[i]], b=D[kinds[j]]; const dc=Math.hypot(...a.rgb.map((v,t)=>v-b.rgb[t])), ds=Math.abs(a.w-b.w)+Math.abs(a.h-b.h); if (dc<18 && ds<5) same.push(kinds[i]+'~'+kinds[j]+' '+dc.toFixed(0)+'/'+ds); }
 return same; }"""
# Behaviour: real taps on the page, not calls into the game. The Build menu was dead from Build 34 to 36 because the gate only measured layout.
PLAY = """async () => {
  const F = window.__fk, out = [], tap = sel => { const el = document.querySelector(sel); if (!el) { out.push('missing ' + sel); return; } el.click(); };
  F.setPause(false); F.newGame(5); F.act('close'); const G = F.G; G.P[0].res = { f: 9999, w: 9999, s: 9999, g: 9999, i: 9999 };
  // the controller (Albert, Nov 3): at rest the four tiles and the map; Town opens one column (People over Build); Build the groups; a group its buildings; Back one step; the lit tile again, rest
  F.ui(true); const acts = () => [...document.querySelectorAll('#row [data-act]')].map((e) => e.dataset.act);
  if (['ctl:jobs', 'ctl:town', 'ctl:war', 'ctlshut', 'mapt'].some((a) => !acts().includes(a)) || !document.querySelector('#row .mapb canvas')) out.push('the controller at rest is not Jobs, Town, War, Close and the map: ' + acts().join());
  tap('#row [data-act="ctl:town"]'); F.ui(true); if (G.hud.page !== 'town' || !acts().includes('train:vil') || !acts().includes('ctlsub:build') || acts().includes('ctlsub:home') || !document.querySelector('#row .mapb')) out.push('Town did not open just its column (People over Build) beside the map: ' + acts().join());
  tap('#row [data-act="ctlsub:build"]'); F.ui(true); if (F.MENUS.some((m) => !acts().includes('ctlsub:' + m.id)) || !acts().includes('card:research') || !acts().includes('relopen') || document.querySelector('#row .mapb')) out.push('Build did not show the build groups, Research and Relations: ' + acts().join());
  tap('#row [data-act="ctlsub:home"]'); F.ui(true); if (!acts().includes('build:house') || !acts().includes('ctlback')) out.push('Home did not show its buildings and Back');
  tap('#row [data-act="build:house"]'); if (!G.place || G.place.kind !== 'house') out.push('tapping House did not start placing');
  F.act('cancel'); if (G.place) out.push('Cancel left a placement'); F.ui(true);
  G.hud.page = 'town'; G.hud.sub = 'home'; F.ui(true); tap('#row [data-act="ctlback"]'); if (G.hud.sub !== 'build') out.push('Back from a group did not go back to the groups'); tap('#row [data-act="ctlback"]'); if (G.hud.sub) out.push('Back from the groups did not go back to Town');
  tap('#row [data-act="ctl:town"]'); if (G.hud.page) out.push('the lit Town tile did not close back to rest');
  tap('#row [data-act="ctl:jobs"]'); F.ui(true); if (['food', 'wood', 'stone', 'gold', 'iron'].some((r) => !acts().includes('job:' + r) || !acts().includes('move:' + r) || !acts().includes('less:' + r))) out.push('Jobs is not the five jobs with − and + under each'); tap('#row [data-act="ctl:jobs"]'); F.ui(true);
  tap('#row [data-act="mapt"]'); F.ui(true); if (G.hud.map || document.querySelector('#row .mapb')) out.push('the Map tile did not take the map down'); tap('#row [data-act="mapt"]'); F.ui(true); if (!document.querySelector('#row .mapb')) out.push('the Map tile did not bring the map back');
  tap('#row [data-act="ctlshut"]'); F.ui(true); if (acts().join() !== 'ctlshut') out.push('Close did not fold the controller to its one tile: ' + acts().join()); tap('#row [data-act="ctlshut"]'); F.ui(true); if (!acts().includes('ctl:war')) out.push('the folded tile did not open the controller again');
  { const cs = getComputedStyle(document.getElementById('row')), b = document.querySelector('#row [data-act="ctl:jobs"]').getBoundingClientRect(), w = (document.getElementById('row').clientWidth - 6 * 3) / 7;
    if (Math.abs(b.width - w) > 1 || cs.columnGap !== '3px') out.push(`the controller is ${Math.round(b.width)} a tile with ${cs.columnGap} gaps (want ${Math.round(w)}: 7 columns, 3px)`); if (b.width < 44 || b.height < 44) out.push(`a controller tile is ${Math.round(b.width)} x ${Math.round(b.height)}, under 44`); }
  { const c0 = { ...F.cam }; F.cam.y = 1e6; F.clampCam(); F.draw(); const cv = document.getElementById('cv'), x = cv.getContext('2d'), k = cv.width / F.view.cw, px = (y) => x.getImageData(Math.round(cv.width / 2), Math.round(y * k), 1, 1).data, a = px(F.SY(F.MAP) - 6), b = px(F.view.ch - 3);   // Nov 3: past the map's foot, under the row, the ground runs on
    if (b[0] + b[1] + b[2] < 150) out.push(`off the map shows dark under the row (${b.slice(0, 3)} under it, ${a.slice(0, 3)} at the foot)`); Object.assign(F.cam, c0); F.clampCam(); }
  // War (Nov 3): Aim · Go, the three squads, Kinds, Alarm, Rally, Formation, Train, Set Up; Kinds picks a kind; the second Aim · Go tap sends
  { G.mailN = 3; F.ui(true); if (document.getElementById('mailN').textContent !== '3') out.push('the mail button does not count the unread'); tap('#mailB'); if (!G.card || G.card.type !== 'mail' || G.mailN) out.push('the mail button did not open the Mail with the count cleared'); F.act('close'); }
  { G.mailN = 3; F.ui(true); const c = document.getElementById('mailB').getBoundingClientRect(), s = document.querySelector('#mailB svg').getBoundingClientRect(), b = document.getElementById('mailN').getBoundingClientRect();   // Mail (Albert, Nov 2): the icon dead centre, the count a badge on its top right, none at 0
    if (Math.abs(s.x + s.width / 2 - (c.x + c.width / 2)) > 1 || Math.abs(s.y + s.height / 2 - (c.y + c.height / 2)) > 1) out.push('the mail icon is not centred in its slot');
    if (b.x < s.x + s.width / 2 - 1 || b.y + b.height / 2 > s.y + 2) out.push('the mail count is not a badge on the icon top right');
    G.mailN = 0; F.ui(true); if (document.getElementById('mailN').getBoundingClientRect().width) out.push('the mail badge shows at 0'); G.mailN = 0; }
  { tap('#row [data-act="ctl:war"]'); F.ui(true); const want = ['aimgo', 'wsq:0', 'wsq:1', 'wsq:2', 'ctlsub:kinds', 'ctlsub:alarm', 'rallyat', 'shape:all', 'ctlsub:train', 'sqsetup'];
    if (want.some((a) => !acts().includes(a))) out.push('the War page is not its ten: ' + acts().join());
    const k = F.keepOf(0), S = [0, 1].map((i) => F.addUnit(0, 'spear', k.x + 40 + i * 8, k.y + 40)), A = F.addUnit(0, 'archer', k.x + 60, k.y + 40);
    F.act('ctlsub:kinds'); F.ui(true); F.act('kpick:0'); const ids = F.picked().map((u) => u.id).sort().join(); if (ids !== S.map((u) => u.id).sort().join()) out.push('Kinds › Foot did not pick every foot soldier and only them');
    { const E = [0, 1, 2, 3, 4, 5].map((i) => F.addUnit(0, 'spear', k.x - 80 - i * 25, k.y + 40)), N = S.length + E.length, n = () => F.picked().length;   // the share (Nov 3, 10:06): a tap on a kind is all, again half, again a quarter, again all
      F.setPick([]); F.act('kpick:0'); const steps = [n()]; F.act('kpick:0'); steps.push(n()); F.act('kpick:0'); steps.push(n()); F.act('kpick:0'); steps.push(n());
      if (steps.join() !== [N, Math.ceil(N / 2), Math.ceil(N / 4), N].join()) out.push('tapping a kind does not cycle all, half, a quarter, all: ' + steps.join());
      F.act('kpick:0'); const far = E[E.length - 1], spot = { x: far.x - 60, y: far.y + 40 };   // half picked; the map tapped by the far end of the line
      for (const u of [...S, ...E]) { u.state = 'home'; u.px = undefined; } F.cam.x = spot.x; F.cam.y = spot.y; F.draw(); F.tapAt(F.SX(spot.x), F.SY(spot.y));
      const sent = [...S, ...E].filter((u) => u.state === 'goto'), d = (u) => Math.hypot(u.x - spot.x, u.y - spot.y), rest = [...S, ...E].filter((u) => !sent.includes(u));
      if (sent.length !== Math.ceil(N / 2) || Math.max(...sent.map(d)) > Math.min(...rest.map(d))) out.push(`the share did not send the ones nearest the target (${sent.length} sent of ${N}; hit ${F.hitAt(F.SX(spot.x), F.SY(spot.y)).t}; picked ${F.picked().length})`);
      F.setPick([]); for (const u of E) u.hp = 0; }
    F.setPick([]); F.act('ctlback'); F.act('aimgo'); if (!G.hud.aim) out.push('Aim · Go did not put the crosshair up'); G.hud.h = { t: 'ground', e: { x: k.x + 200, y: k.y + 100 } }; F.act('aimgo'); if (G.hud.aim || ![...S, A].every((u) => u.state === 'goto' || G.msn.some(Boolean))) out.push('the second Aim · Go did not send them');
    F.act('rallyat'); if (G.hud.aim !== 'rally') out.push('Rally did not wait for a tap'); F.tapAt(150, 400); if (!G.rally0 || G.hud.aim) out.push('a tap after Rally did not set where new soldiers go');
    for (const u of [...S, A]) u.hp = 0; F.act('ctl:war'); }
  G.P[0].techs.add('command'); F.fxDirty(); F.act('ctl:war'); F.ui(true); F.act('sqcard:1'); if (!G.card || G.card.type !== 'squad' || G.card.i !== 1) out.push('a squad held did not open its card');
  { if (F.BN.join() !== 'Alpha,Bravo,Charlie') out.push('the squads are not Alpha, Bravo and Charlie'); F.act('close'); F.ui(true);   // Albert, Nov 2: three squads and Set Up
    if (['wsq:0', 'wsq:1', 'wsq:2', 'sqsetup'].some((a) => !acts().includes(a)) || acts().includes('wsq:3')) out.push('the War page has not Alpha, Bravo, Charlie and Set Up: ' + acts().join());
    F.act('sqsetup'); if (!G.card || G.card.type !== 'sqsetup') out.push('Set Up did not open the squad setup card'); else if (document.querySelectorAll('#card [data-act^="sqcard:"]').length !== 3) out.push('the Set Up card does not list the three squads'); F.act('close'); F.act('sqcard:1'); }
  tap('#card [data-act="sqpk:1,0,+"]'); if (G.bnPlan[1].foot !== 1) out.push('+ under Foot on the squad card added none'); tap('#card [data-act="sqcancel"]'); if (G.bnPlan[1].foot || G.card) out.push('Cancel did not put the squad back and close');
  G.P[0].techs.delete('command'); F.fxDirty(); G.hud.page = null; F.ui(true);
  F.news('trade', 'A test line for the mail.', '', 4); F.act('pvx'); if (G.pvAsk !== 'trade') out.push('× on news did not ask to hide its group'); F.act('pvhide:trade'); F.news('trade', 'Another quiet line.', '', 4); if ((G.mail[0] || {}).ru) out.push('a hidden group still previewed'); F.news('trade', 'Raiders took the caravan.', 'warn', 4); if (!(G.mail[0] || {}).ru) out.push('a red line from a hidden group did not show'); F.act('mailall');
  F.hudPage('town'); F.ui(true); const q0 = F.keepOf(0).q.length; tap('#row [data-act="train:vil"]'); if (F.keepOf(0).q.length !== q0 + 1) out.push('People did not queue a villager');
  F.act('qcancel:' + F.keepOf(0).id + ',' + q0); if (F.keepOf(0).q.length !== q0) out.push('a slot tap did not cancel the villager');
  F.hudPage('jobs'); F.ui(true); tap('[data-act="move:wood"]'); if (!F.G.units.some(u => u.owner === 0 && u.kind === 'vil' && u.job === 'wood')) out.push('+ under Wood put nobody on wood');
  
  // the quick action (Albert, Nov 3: a tap is a right click): nothing picked, a tap on open ground puts the sword and X there and sends nobody;
  // the sword sends every soldier; a tap anywhere else only closes them; with soldiers picked, a tap is their order and no chips come
  { F.act('close'); G.fogOn = false; let p = null; for (let y = 260; y < 500 && !p; y += 23) for (let x = 60; x < 330 && !p; x += 23) if (F.hitAt(x, y).t === 'ground') p = [x, y];
    const spot = F.hitAt(...p).e, qa = () => document.getElementById('qa'); F.tapAt(...p);
    if (!G.qa || qa().hidden) out.push('a tap on open ground put no sword down'); else if (!qa().querySelector('[data-act="qsword"].dis')) out.push('with no soldiers the sword was not dim');
    F.act('qsword'); if (G.qa || !qa().hidden) out.push('the sword with no soldiers left the chips up');
    if (F.HOLD_WORD.attack) out.push('the words "Hold to launch attack" are still in the game');
    const k = F.keepOf(0), S = [0, 1, 2].map((i) => F.addUnit(0, 'spear', k.x + 40 + i * 8, k.y + 40));
    const o0 = JSON.stringify(G.ords || {}), p2 = [p[0] + 60, p[1]]; F.tapAt(...p2); if (!G.qa) out.push('a tap on open ground put no sword down'); if (G.card) out.push('a tap on the ground opened a card');
    if (JSON.stringify(G.ords || {}) !== o0 || S.some((u) => u.state === 'goto')) out.push('the sword sent soldiers before it was tapped');
    F.act('qsword'); if (G.qa) out.push('the sword left the chips up'); if (!S.every((u) => u.state === 'goto' || u.ord || u.tx !== undefined || u.focus || (G.ords && Object.keys(G.ords).length))) out.push('the sword did not send the army');
    F.tapAt(...p); const n0 = !!G.qa; F.tapAt(p[0], p[1] + 60); if (n0 && G.qa) out.push('a tap elsewhere left the chips up (it only closes them)');
    F.tapAt(...p); F.act('qclose'); if (G.qa) out.push('X did not close the chips');
    for (const u of S) u.hp = 0;
    const s1 = F.addUnit(0, 'spear', k.x + 30, k.y + 30); F.setPick([{ t: 'unit', id: s1.id }]); F.tapAt(...p2); if (G.qa) out.push('with a soldier picked, a tap on the ground put the chips up (it is the order)'); if (s1.state !== 'goto') out.push('with a soldier picked, a tap on the ground did not send it'); F.setPick([]); s1.hp = 0;
    const e = F.addUnit(1, 'spear', spot.x, spot.y); G.rel[0][1] = G.rel[1][0] = 'war'; F.tapAt(F.SX(e.x), F.SY(e.y) - 6 * F.cam.z); if (G.qa) out.push('a tap on an enemy put the chips up (it opens its card)');
    F.act('close'); e.hp = 0; G.rel[0][1] = G.rel[1][0] = 'neutral'; G.fogOn = true;
    { const c2 = document.getElementById('cv').getContext('2d'), a0 = c2.arc.bind(c2), rs = []; c2.arc = (...a) => { rs.push(a[2]); return a0(...a); }; G.press = { x: 100, y: 300, t: performance.now() - 150 }; F.draw(); c2.arc = a0; G.press = null; if (rs.includes(26)) out.push("the hold's ring shows 150 ms into a touch (a tap must never see it)"); } }
  { const cx = document.getElementById('cv').getContext('2d'), f0 = cx.fillRect.bind(cx), seen = []; cx.fillRect = (...a) => { seen.push(a); return f0(...a); }; F.draw(); cx.fillRect = f0;   // the sky runs to the top (Albert, Nov 2)
    if (!seen.some((a) => a[1] === 0 && a[3] > 40 && a[3] < innerHeight * 0.4)) out.push('the sky does not run to the top of the screen'); }
  { const cv0 = document.getElementById('cv'), k0 = cv0.width / cv0.getBoundingClientRect().width; cv0.style.width = '200px'; await new Promise((r) => setTimeout(r, 250)); if (Math.abs(cv0.width / cv0.getBoundingClientRect().width - k0) > 0.05 || cv0.width > 200 * k0 + 4) out.push('the map did not measure itself again after its box changed'); cv0.style.width = ''; await new Promise((r) => setTimeout(r, 250));
    const h0 = cv0.height; cv0.height = Math.round(h0 * 0.75); await new Promise((r) => setTimeout(r, 250)); if (cv0.height !== h0) out.push('a drawing measured wrong for its box (a quarter short) was not measured again on the next frame'); }
  // the cards (Build 70): Villager on the Town Center queues one in its line, and a tap on the queued one gives it back; the Market sells the
  // good picked; › on the Stores opens the book on its why; Build on a villager's job picker names it the builder of what is placed next
  { const k = F.keepOf(0), q0 = k.q.length; F.openCard({ type: 'bld', id: k.id }); tap('#card [data-act="train:vil"]'); if (k.q.length !== q0 + 1) out.push('Villager on the Town Center did not queue one');
    F.ui(true); tap(`#card [data-act="qcancel:${k.id},${q0}"]`); if (k.q.length !== q0) out.push('a tap on a queued villager did not cancel it');
    const s = F.findSpot(0, 'market', k.x, k.y, 70, 320), m = F.build(0, 'market', s.x, s.y); m.prog = 1; m.hp = F.BLD.market.hp; F.built(m); F.openCard({ type: 'bld', id: m.id });
    tap('#card [data-act="mpick:s"]'); F.ui(true); const st = G.P[0].res.s; if (!document.querySelector('#card [data-act="mpick:s"]').classList.contains('on')) out.push('a picked good did not ring gold');
    tap('#card [data-act="trade:sell:s"]'); if (G.P[0].res.s !== st - 100) out.push('Sell did not sell the picked good'); F.demolish(0, m.id);
    F.openCard({ type: 'stores' }); tap('#card [data-act="storesk:w"]'); if (!G.infoOpen || !document.querySelector('#card .infoP') || !document.querySelector('#card .infoP').textContent.includes('Wood, the last minute')) out.push('› on the Stores did not open the why of wood');
    const v = G.units.find((u) => u.owner === 0 && u.kind === 'vil'); F.openCard({ type: 'unit', id: v.id }); tap(`#card [data-act="pbuild:${v.id}"]`); if (G.card || G.hud.page !== 'town' || G.hud.sub !== 'build' || String(G.buildBy) !== String(v.id)) out.push('Build on the villager card did not name it the builder and open Town · Build'); G.buildBy = null; F.hudPage(null); F.act('close'); }
  tap('#scoreP'); if (!G.card || G.card.type !== 'score') out.push('Score card did not open'); F.act('close');
  // back (Build 70): a card opened by a tap inside another remembers it; back returns to it; on the first card back closes, and closing forgets the way
  F.openCard({ type: 'help' }); tap('#card [data-act="guide:bld"]'); if (!G.card || G.card.type !== 'guide' || !G.card.from || G.card.from.type !== 'help') out.push('a card opened from Help did not remember Help');
  tap('#card [data-act="guide:unit"]'); tap('#card [data-act="cardback"]'); if (!G.card || G.card.type !== 'help') out.push('back did not return to Help (a page turned in the Guide is the same card)');
  tap('#card [data-act="cardback"]'); if (G.card) out.push('back on the first card did not close it');
  tap('#pauseB'); if (!G.paused) out.push('Pause did not pause'); tap('#pauseB'); if (G.paused) out.push('Pause did not resume');
  for (let i = 0; i < 90; i++) F.step(1 / 30); const t = G.t; F.saveGame(true); const S = F.readSave(); if (!S) out.push('no save written'); else { F.loadGame(S); if (Math.abs(F.G.t - t) > 0.5) out.push('reload lost the clock'); }
  // the save chain (Build 63): every old shape has a step; the oldest shape walks every step without throwing; a broken save falls back to the one before
  { const c = F.migrateChain(); if (c) out.push(c); const v0 = Math.min(...Object.keys(F.MIGRATE).map(Number)); let S0 = JSON.parse(localStorage.getItem(F.SAVEKEY)); S0.v = v0; try { while (S0.v < F.SAVEV) S0 = F.MIGRATE[S0.v](S0); if (S0.v !== F.SAVEV) out.push('migration stopped at ' + S0.v); } catch (e) { out.push('migration threw: ' + e.message); }
    F.saveGame(true); F.saveGame(true); const good = localStorage.getItem(F.SAVEKEY); localStorage.setItem(F.SAVEKEY, good.slice(0, 200)); if (!F.readSave()) out.push('a cut-off save did not fall back to the one before'); localStorage.setItem(F.SAVEKEY, good); }
  return out; }"""
# Every verb a control can send must have a handler: tests/verbs.py (run below with the other tests)
# The play fingerprint: a fixed game on a fixed seed, scripted the same way every time, and every side's counts at each minute.
# The game may not play differently by accident. A deliberate change to the rules is accepted with:  python3 tests/gate.py --accept "why"
# (the baseline is rewritten and the reason logged in CUTS.md). The simulation's dice are seeded, so this is exact, like SoRen's locked physics block.
BASELINE = 'tests/baseline.json'
FINGERPRINT = """() => { const F = window.__fk; F.newGame(7); F.act('close'); const G = F.G; F.setPause(true); G.diff = 'normal';
  const P = G.P[0], k = F.keepOf(0), put = (kind, dx, dy) => { const s = F.findSpot(0, kind, k.x + dx, k.y + dy, 40, 300); return s && F.build(0, kind, s.x, s.y); };
  const script = { 20: () => { F.train(0, 'vil'); F.train(0, 'vil'); }, 40: () => F.moveVil(0, 'wood'), 60: () => put('house', 60, -60), 90: () => { P.res.w += 150; put('barracks', -80, -80); }, 120: () => F.moveVil(0, 'stone'), 150: () => { P.res.f += 200; F.train(0, 'spear'); F.train(0, 'spear'); }, 200: () => { P.res.w += 200; put('farm', 90, 40); }, 240: () => { P.res.f += 400; P.res.g += 100; F.ageUp(0); } };
  const out = [];
  for (let i = 1; i <= 30 * 300; i++) { F.step(1 / 30); const t = i / 30; if (script[t]) script[t]();
    if (i % 1800 === 0) out.push(G.P.map(q => [Math.round(q.res.f), Math.round(q.res.w), Math.round(q.res.s), Math.round(q.res.g), G.units.filter(u => u.owner === q.id && u.hp > 0).length, G.blds.filter(b => b.owner === q.id && b.hp > 0).length, q.age].join('/')).join(' | ')); }
  return out; }"""
async def fingerprint(br):
    pg = await br.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(600)
    got = await pg.evaluate(FINGERPRINT); await pg.close()
    if errs: return ['page error: ' + errs[0][:120]], got
    accept = '--accept' in sys.argv
    if accept:
        why = sys.argv[sys.argv.index('--accept') + 1] if len(sys.argv) > sys.argv.index('--accept') + 1 else 'no reason given'
        json.dump({'why': why, 'minutes': got}, open(BASELINE, 'w'), indent=1); open('docs/5 Builds/v80/CUTS.md', 'a').write(f'\n- **Play fingerprint accepted:** {why}\n'); return [], got
    if not os.path.exists(BASELINE): return ['no baseline: run  python3 tests/gate.py --accept "first baseline"'], got
    want = json.load(open(BASELINE))['minutes']
    return [f'minute {i + 1}: {w}  now  {g}' for i, (w, g) in enumerate(zip(want, got)) if w != g] + (['length differs'] if len(want) != len(got) else []), got
# Every event does what its name says (Build 42: the clocks of the storm, flood, circus and dragon had tested a tick that never came, so they did nothing).
EVENTS_TEST = """() => { const F = window.__fk; F.SET.diff = 'normal'; F.newGame(3); F.act('close'); const G = F.G; G.fantasy = true; F.setPause(true);
  const bad = [], run = (s) => { for (let i = 0; i < s * 30; i++) F.step(1 / 30); };
  const clear = () => { F.endEvent(); G.bolts = []; G.ev.warned = null; };
  // the storm: a bolt every two seconds
  F.startEvent('storm'); run(42); if ((G.bolts || []).length < 15) bad.push('storm: ' + (G.bolts || []).length + ' bolts in 40 s'); clear();
  // the flood: a house at the shore loses health
  { const L = G.lakes.filter((l) => Math.hypot(l.x - F.MID, l.y - F.MID) > 400).sort((a, b) => a.r - b.r)[0], dx = L.x > F.MID ? 1 : -1;
    const b = F.mkBld(0, 'house', L.x + dx * (L.r + 30), L.y, 1); G.blds.push(b); F.navRebuild(); run(1); const hp = b.hp; F.startEvent('flood'); run(30); if (!(b.hp < hp)) bad.push('flood: the shore house lost nothing'); clear(); run(2); }
  // the dragon: a soldier under it is burned
  { F.startEvent('dragon'); run(2); const d = G.ev.cur.units[0], u = F.addUnit(0, 'spear', d.x, d.y); const hp = u.hp; run(2); if (!(u.hp < hp) && u.hp > 0) bad.push('dragon: nobody burned'); clear(); }
  // the travelling show: a villager beside the performers cheers
  { F.startEvent('circus'); run(3); const p = G.ev.cur.units[0], v = F.addUnit(0, 'vil', p.x + 10, p.y); run(3); if (!(v.cheer > G.t)) bad.push('circus: nobody cheered'); clear(); }
  // the army: a marched group has an order and a time, a hostile group heading in is named, a recall ends the order
  { G.fogOn = false; for (const u of G.units) if (u.owner !== 0) u.hp = 0; run(1); const home = G.blds.find((b) => b.owner === 0), a = F.addUnit(0, 'spear', home.x + 60, home.y), c = F.addUnit(0, 'spear', home.x + 70, home.y);
    const to = { x: home.x + 400, y: home.y }; for (const u of [a, c]) { u.state = 'goto'; u.px = to.x; u.py = to.y; u.idleT = 0; } F.march([a, c], to, 'test'); run(2); const O = Object.values(G.ords)[0];
    if (!O || !(O.eta > 0)) bad.push('army: no time left on the order'); if (F.armyStatus(a) !== 'march') bad.push('army: ' + F.armyStatus(a) + ', not marching');
    const e = F.addUnit(1, 'spear', home.x + 300, home.y + 100); e.state = 'attack'; run(1); if (!G.incoming || G.incoming.n < 1) bad.push('army: no attack named');
    e.hp = 0; run(2); if (G.incoming) bad.push('army: the attack is still named after it died'); }
  // the War room (Build 61): Go sends a squad on the crosshair as a mission with a promised time; a fight gives it odds; Abort frees the slot
  { const home = G.blds.find((b) => b.owner === 0), sp = []; for (let i = 0; i < 6; i++) sp.push(F.addUnit(0, 'spear', home.x + 40 + i * 6, home.y + 60)); for (let i = 0; i < 6; i++) F.addUnit(0, 'chariot', home.x + 40 + i * 6, home.y + 90);
    run(2); F.hudPage('war'); F.act('aimgo'); if (!G.hud.aim || !G.hud.h) bad.push('war room: Aim put no crosshair up'); F.aimAt(120, 300); if (!G.hud.moved) bad.push('war room: a tap on the map did not move the crosshair');
    G.hud.h = { t: 'ground', e: { x: home.x + 260, y: home.y + 60 } }; F.hudFire(null); const m = G.msn[0];
    if (!m || m.n0 < 12 || !(m.due > G.t)) bad.push('war room: Go made no mission with a time (' + (m && m.n0) + ')'); else {
      const foes = []; for (let i = 0; i < 8; i++) foes.push(F.addUnit(4, 'bandit', home.x + 250 + i * 5, home.y + 60)); let met = false; for (let i = 0; i < 24 && !met; i++) { run(1); met = m.st === 'act' || m.st === 'done'; } // rain or snow slows the march and shortens sight, so the fight is joined later
      if (!met) bad.push('war room: the mission is ' + m.st + ' at the fight');
      F.hudAbort(0); for (const f of foes) f.hp = 0; run(3); if (G.msn[0]) bad.push('war room: Abort left the mission'); }
    // a squad (Build 70: built on its card, by kind): two Riders set with + fill from the chariots at home; Go sends it, the squad at home and ready, and Abort calls it back
    G.P[0].techs.add('command'); F.fxDirty(); F.sqPlan(0, 'horse', 1); F.sqPlan(0, 'horse', 1); run(2); if (F.sqUnits(0).length !== 2) bad.push('squad: the plan did not fill (' + F.sqUnits(0).length + ')');
    G.hud.h = { t: 'ground', e: { x: home.x + 200, y: home.y + 60 } }; G.hud.aim = true; F.act('aimgo'); if (!G.msn[0] || G.msn[0].name !== F.BN[0] || G.msn[0].n0 !== 2) bad.push('squad: Attack did not send the squad that was ready'); F.act('whome'); if (G.msn[0]) bad.push('squad: Home (Attack held) left its mission');
    F.hudPage(null); G.P[0].techs.delete('command'); F.fxDirty(); for (let i = 0; i < 4; i++) G.msn[i] = null; G.bnPlan[0] = {}; }
  // the War Director (Albert, Nov 2): one move a kind, every soldier of it at once, from the station's middle. Shield wall: the foot stand to the
  // Square and hold; Loose: every archer's reload at zero, and the volley lands in one step; Charge: the riders burst; Wheel: they ride to the far
  // side of the foe; Bombard: the engines on the nearest enemy building to the crosshair; a hold is the second move (fall back)
  { const k = F.keepOf(0); G.fogOn = false; G.rel[0][1] = G.rel[1][0] = 'war';
    const add = (kind, n, dx) => { const L = []; for (let i = 0; i < n; i++) L.push(F.addUnit(0, kind, k.x + dx + (i % 4) * 9, k.y + 120 + ((i / 4) | 0) * 9)); return L; };
    const foot = add('spear', 4, -40), arch = add('archer', 4, 0), horse = add('chariot', 3, 40), eng = add('catapult', 2, 80), foes = [];
    for (let i = 0; i < 6; i++) foes.push(F.addUnit(1, 'spear', k.x + (i % 3) * 10, k.y + 250 + ((i / 3) | 0) * 10));
    for (const r of ['f', 'w', 's', 'g']) G.P[1].res[r] = 9999; const es = F.findSpot(1, 'house', k.x + 120, k.y + 300, 10, 200), eb = es && F.build(1, 'house', es.x, es.y); if (!eb) bad.push('director: the test could not place an enemy house'); if (eb) { eb.prog = 1; eb.hp = F.BLD.house.hp; F.built(eb); } // aside from the crosshair: only Bombard's search finds it
    F.hudPage('war'); G.hud.h = { t: 'ground', e: { x: k.x, y: k.y + 240 } }; F.act('ctlsub:kinds'); F.ui(true);
    if (!document.querySelector('#row [data-act="kpick:0"]') || document.querySelector('#row [data-act="kpick:1"]').dataset.hold !== 'direct:1') bad.push('director: War · Kinds has no kinds, or no drill on a hold');
    F.act('direct:0'); if (!foot.every((u) => u.wall > G.t) || F.shapeOf(foot[0]).name !== 'Square' || F.temperOf(foot[0]) !== F.T_HOLD) bad.push('director: Shield wall did not stand the foot to the Square and hold');
    run(4); const D = foot[0].drill; if (!D || D.shape !== 'line') bad.push('director: Shield wall set no line'); else { const slot = (u) => [u.gx * D.fx + u.gy * D.fy, -u.gx * D.fy + u.gy * D.fx], P = foot.map(slot), along = P.map((q) => q[0]), across = P.map((q) => q[1]), span = (L) => Math.max(...L) - Math.min(...L);   // Nov 3: the wall is a line facing the foe
      if (span(along) > 2 || span(across) < 3 * F.GRID.gap * 0.9) bad.push('director: the shield wall is not one rank across the foe (deep ' + span(along).toFixed(0) + ', wide ' + span(across).toFixed(0) + ')');
      const fd = Math.hypot(foes[0].x - foot[0].x, foes[0].y - foot[0].y); if (D && (D.fx * (foes[0].x - foot[0].x) + D.fy * (foes[0].y - foot[0].y)) / fd < 0.5) bad.push('director: the shield wall does not face the foe'); }
    for (const u of arch) u.cd = 2; F.act('direct:1'); if (!arch.every((u) => u.cd === 0)) bad.push('director: Loose did not line up the reload'); const h0 = foes.reduce((s, f) => s + f.hp, 0); run(4); if (!(foes.reduce((s, f) => s + f.hp, 0) < h0)) bad.push('director: the volley hit nobody');
    { const D = arch[0].drill; if (!D || D.shape !== 'arc' || !D.arc) bad.push('director: Loose set no arc'); else { const off = arch.map((u) => Math.abs(Math.hypot(u.px + u.gx - D.arc.x, u.py + u.gy - D.arc.y) - D.arc.r)); if (Math.max(...off) > 1) bad.push('director: the places of the archers are not on one arc round the foe (off by ' + Math.max(...off).toFixed(1) + ')');
      if (!(D.arc.r <= F.stats(0, 'archer').rng)) bad.push('director: the arc stands out of reach of the bows'); } }
    F.ui(true); if (!/[0-9]+ s/.test(document.querySelector('#row [data-act="kpick:1"]').innerText)) bad.push('director: the archers can volley again at once (no reload wait on the slot)');
    { const a = F.addUnit(0, 'archer', k.x - 300, k.y + 120), R = F.stats(0, 'archer').rng; a.state = 'goto'; a.px = a.x; a.py = a.y; a.gx = 0; a.gy = 0; a.drill = { shape: 'arc', fx: 0, fy: 1, until: G.t + 30, px: a.px, py: a.py, arc: { x: a.x, y: a.y + R, r: R } };   // in its place, a foe in sight but past its reach: it stays in the arc
      run(1); const f = F.addUnit(1, 'spear', a.x, a.y + R + 25); f.state = 'goto'; f.px = f.x; f.py = f.y; a.tgt = f; const x0 = a.x, y0 = a.y; run(1); if (Math.hypot(a.x - x0, a.y - y0) > 6) bad.push('director: an archer in the arc left its place to chase a foe past its reach'); a.hp = f.hp = 0; }
    { const n0 = G.mail.length; G.chargeT = { '0:all': G.t + 20 }; const was = horse.map((u) => [u.px, u.py].join()); F.act('direct:2'); if (horse.map((u) => [u.px, u.py].join()).join() !== was.join()) bad.push('director: winded riders were still sent'); G.chargeT = {}; }
    F.act('direct:2'); if (!horse.some((u) => u.chg > G.t)) bad.push('director: Charge did not set the riders charging'); F.ui(true); if (!/[0-9]+ s/.test(document.querySelector('#row [data-act="kpick:2"]').innerText)) bad.push('director: the wait of the riders is not on their slot');
    F.act('direct:3'); if (eb && !eng.every((u) => u.state === 'attack' && u.bid === eb.id)) bad.push('director: Bombard did not aim the engines at the enemy building'); run(20); if (eb && !(eb.hp < F.BLD.house.hp)) bad.push('director: Bombard did not hit the enemy building');
    for (const u of [...foot, ...arch, ...horse, ...eng, ...foes]) u.hp = 0; if (eb) eb.hp = 0; G.rel[0][1] = G.rel[1][0] = 'neutral'; F.hudPage(null); G.fogOn = true; }
  // emergencies (Build 70, four orders): Town square gathers everyone round the Town Center and Stop sends the villagers back to their work;
  // All hands: villagers take cover in the sturdiest building first, soldiers garrison; Stop sends the villagers back and the soldiers stay
  { const home = G.blds.find((b) => b.owner === 0), k = F.keepOf(0); for (let i = 0; i < 4; i++) F.addUnit(0, 'spear', home.x + 70 + i * 6, home.y + 40); const vil0 = G.units.filter((u) => u.owner === 0 && u.kind === 'vil'), ids = new Set(vil0.map((u) => u.id)), jobs = vil0.map((u) => u.job).join(',');   // the villagers there at the start: one trained meanwhile is not a job to restore
    { const V = G.units.filter((u) => u.owner === 0 && u.kind === 'vil' && u.hp > 0), near = (u, r) => Math.hypot(u.x - k.x, u.y - k.y) < r, V3 = V.filter((u) => near(u, 300));
      const S0 = new Set(G.units.filter((u) => u.owner === 0 && u.hp > 0 && F.UNIT[u.kind].tick === 'sol' && near(u, 300)).map((u) => u.id)); F.emgStart('square'); run(30); const S = G.units.filter((u) => S0.has(u.id) && u.hp > 0 && u.state !== 'escort'); // soldiers that were near at the start: one coming home from a far mission needs longer than 30 s
      if (!V.every((u) => u.post && near(u.post, 70) && !u.job)) bad.push('town square: villagers not sent round the Town Center');
      if (!V3.length || !V3.every((u) => near(u, 90))) bad.push('town square: ' + V3.filter((u) => !near(u, 90)).length + ' villagers from near by not round the Town Center in 30 s');   // the circus test's villager starts across the map
      if (!S.length || !S.every((u) => near(u, 140))) bad.push('town square: ' + S.filter((u) => !near(u, 140)).length + ' soldiers not round the Town Center');
      F.emgStop(); run(5); if (V.map((u) => u.job).join(',') !== jobs) bad.push('town square: Stop did not restore the jobs'); }
    F.emgStart('hands'); run(15); const v = G.units.filter((u) => ids.has(u.id)), s2 = G.units.filter((u) => u.owner === 0 && u.state === 'garrison');
    if (!s2.length || !s2.every((u) => u.inside)) bad.push('emergency: soldiers did not garrison'); if (!v.every((u) => u.inside || u.safe)) bad.push('emergency: villagers are not under cover');
    F.emgStop(); run(10); if (v.some((u) => u.inside || u.emg)) bad.push('emergency: Stop left villagers inside'); if (v.map((u) => u.job).join(',') !== jobs) bad.push('emergency: Stop did not restore the jobs'); if (!s2.every((u) => u.inside)) bad.push('emergency: Stop moved the soldiers'); }
  return bad; }"""
async def main():
    fails = 0
    for t in ('tests/science.py', 'tests/history.py', 'tests/tables.py', 'tests/text81.py', 'tests/saves.py', 'tests/moves.py', 'tests/combat.py', 'tests/wild.py', 'tests/ai.py', 'tests/map.py', 'tests/palette.py', 'tests/cards.py', 'tests/verbs.py', 'tests/testfield.py'):   # the equations against their sources; every research step in its age (Builds 54 and 58); the tables hold together (Build 60)
        r = subprocess.run([sys.executable, t], capture_output=True, text=True); print(r.stdout.strip() or ('FAIL ' + t + ' ' + r.stderr[-300:])); fails += r.returncode != 0
    w = subprocess.run([sys.executable, 'tests/words.py'], capture_output=True, text=True); print(('PASS ' if w.returncode == 0 else 'FAIL ') + 'toasts and tips: 10 words at most', w.stdout.strip() if w.returncode else ''); fails += w.returncode != 0
    async with async_playwright() as p:
        br = await p.chromium.launch()
        for page_file in ('first-keep.html', 'native/index.html'):
            for (W, H) in SIZES:
                pg = await br.new_page(viewport={'width': W, 'height': H}, device_scale_factor=2); errs = []
                pg.on('pageerror', lambda e: errs.append(str(e)))
                await pg.goto('file://' + os.path.abspath(page_file)); await pg.wait_for_timeout(600); await pg.evaluate(SETUP)
                bad = {}
                for name, c in [('map', None), ('quick', 'QUICK')] + CARDS + [('end', 'END')]:
                    q = []
                    if c == 'QUICK': q = await pg.evaluate(QUICK)
                    elif c == 'END': await pg.evaluate("() => { const F = window.__fk; F.closeCard && F.closeCard(); F.setPause(false); F.G.t = F.G.mode === 'conquest' ? F.G.t : 1799.9; F.G.mode = 't30'; for (let i = 0; i < 10; i++) F.step(1 / 30); }")
                    elif c: await pg.evaluate(f"window.__fk.openCard({c})")
                    await pg.wait_for_timeout(120); m = await pg.evaluate(MEASURE)
                    issues = q + [k for k in ('wide', 'tall') if m[k]] + ([f"scroll:{m['scroll']}"] if m['scroll'] and W >= 390 and name not in ('help', 'guide', 'research') else []) + [f'{k}:{v[:3] if k != "tap" else v}' for k, v in (('small', m['small']), ('size', m['size']), ('font', m['font']), ('low', m['low']), ('clip', m['clip']), ('tap', sorted(set(m['tap']))), ('grown', m['grown'])) if v]
                    if issues: bad[name] = issues
                if errs: bad['errors'] = errs[:2]
                print(('PASS ' if not bad else 'FAIL ') + f'{page_file} {W}x{H}', '' if not bad else json.dumps(bad)[:2500]); fails += bool(bad); await pg.close()
        pg = await br.new_page(); await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(600)
        why = await pg.evaluate("() => { const g = window.__fk.guideModel(), m = []; for (const k of ['buildings', 'units', 'techs', 'ages', 'civs', 'finds']) for (const e of g[k]) if (!e.why) m.push(k + ':' + e.id); return m; }")
        raw = await pg.evaluate("() => { const F = window.__fk, out = []; for (const pg of ['bld', 'unit', 'tech', 'age', 'civ', 'rule']) { F.openCard({ type: 'guide', page: pg }); const t = document.getElementById('card').textContent; if (t.includes('${')) out.push(pg); } for (const k of ['help', 'army', 'score', 'setup']) { F.openCard({ type: k }); if (document.getElementById('card').textContent.includes('${')) out.push(k); } F.act('close'); return out; }")
        print(('PASS ' if not raw else 'FAIL ') + 'no raw code on any card', '' if not raw else raw); fails += bool(raw)
        print(('PASS ' if not why else 'FAIL ') + 'every guide entry says why', '' if not why else why); fails += bool(why)
        same = await pg.evaluate(LOOK); print(('PASS ' if not same else 'FAIL ') + 'buildings tell apart at half zoom', '' if not same else same); fails += bool(same); await pg.close()
        pg = await br.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(600)
        play = await pg.evaluate(PLAY) + errs[:2]; print(('PASS ' if not play else 'FAIL ') + 'taps do what they say', '' if not play else play); fails += bool(play); await pg.close()
        pg = await br.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(600)
        evs = await pg.evaluate(EVENTS_TEST) + errs[:2]; print(('PASS ' if not evs else 'FAIL ') + 'events do what they say', '' if not evs else evs); fails += bool(evs); await pg.close()
        # a phone lays the page out at its own width (without the viewport line an iPhone uses 980: the tall, narrow column of Build 37)
        for page_file in ('first-keep.html', 'native/index.html'):
            ctx = await br.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, device_scale_factor=3); pg = await ctx.new_page()
            await pg.goto('file://' + os.path.abspath(page_file)); await pg.wait_for_timeout(400); w = await pg.evaluate('() => [document.documentElement.clientWidth, document.compatMode]'); await ctx.close()
            ok = w[0] == 390 and w[1] == 'CSS1Compat'; print(('PASS ' if ok else 'FAIL ') + f'{page_file} lays out at the phone width, standards mode', '' if ok else w); fails += not ok
        # every message and tip whole on the ticker's one line at 375 px (Albert, Build 38: "these sentences are too long"; Build 39: one ticker for all)
        L = json.loads(subprocess.run([sys.executable, 'tests/words.py', '--list'], capture_output=True, text=True).stdout)
        pg = await br.new_page(viewport={'width': 375, 'height': 667}); await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(500)
        wraps = await pg.evaluate("""(L) => { const F = window.__fk; F.newGame(5); F.act('close'); F.setPause(false); F.say('x', '', 60); F.ui(true); const e = document.querySelector('#pv .t span'), out = [];
          if (!e) return ['no preview']; for (const t of L) { e.textContent = t; if (e.scrollWidth > e.clientWidth + 1) out.push(t); } return out; }""", L); await pg.close()
        print(('PASS ' if not wraps else 'FAIL ') + f'{len(L)} messages fit the preview at 375 px', '' if not wraps else wraps[:6]); fails += bool(wraps)
        pg = await br.new_page(viewport={'width': 375, 'height': 667}); await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(600)
        n, wide = await pg.evaluate(TITLES, fixed_titles() + sys.argv[sys.argv.index('--title') + 1:sys.argv.index('--title') + 2] if '--title' in sys.argv else fixed_titles()); await pg.close()   # --title "a long name": see it fail
        print(('PASS ' if not wide else 'FAIL ') + f'{n} card titles fit slots 2 to 4 at 375 px', '' if not wide else wide); fails += bool(wide)
        pg = await br.new_page(viewport={'width': 375, 'height': 667}); await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(600)
        n, wide = await pg.evaluate(SLOT_WORDS, sys.argv[sys.argv.index('--word') + 1:sys.argv.index('--word') + 2] if '--word' in sys.argv else []); await pg.close()   # --word "a long word": see it fail
        print(('PASS ' if not wide else 'FAIL ') + f'{n} slot words fit their slots at 375 px', '' if not wide else wide); fails += bool(wide)
        pg = await br.new_page(viewport={'width': 375, 'height': 667}); await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(600)
        n, wide = await pg.evaluate(DOUBLES, sys.argv[sys.argv.index('--double') + 1:sys.argv.index('--double') + 2] if '--double' in sys.argv else []); await pg.close()   # --double "a long name": see it fail
        print(('PASS ' if not wide else 'FAIL ') + f'{n} names fit a double-wide slot at 375 px', '' if not wide else wide); fails += bool(wide)
        # the map's base rules hold on ten seeds (Build 70: the fairness measure and its re-roll cut): the Throne the same distance from every Town Center,
        # no water within the clear radius of one, and the four joined to each other and to the causeways on the walking grid (fords and gaps keep them so)
        pg = await br.new_page(); await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(400)
        base = await pg.evaluate("""() => { const F = window.__fk, N = F.NAV, out = [], comp = (x, y) => { let b = 0; for (let j = -5; j <= 5; j++) for (let i = -5; i <= 5; i++) { const c = N.comp[(Math.floor(y / F.NAVC) + j) * F.NC + Math.floor(x / F.NAVC) + i]; if (c && N.size[c] > N.size[b]) b = c; } return b; };
          for (let s = 1; s <= 10; s++) { F.newGame(s); const G = F.G, K = [0, 1, 2, 3].map((o) => F.keepOf(o)), T = G.blds.find((b) => b.kind === 'throne'), d = K.map((k) => Math.hypot(k.x - T.x, k.y - T.y));
            if (Math.max(...d) - Math.min(...d) > 0.01) out.push(s + ': the Throne at ' + d.map(Math.round));
            if (G.lakes.slice(1).some((L) => K.some((k) => Math.hypot(L.x - k.x, L.y - k.y) < F.CLEAR + L.r))) out.push(s + ': water in a clear radius');
            const c = [...K.map((k) => comp(k.x, k.y)), ...F.cross(F.LAKE0.r + 60).map(([x, y]) => comp(x, y))]; if (c.some((x) => x !== c[0])) out.push(s + ': not joined ' + c); }
          return out; }"""); await pg.close()
        print(('PASS ' if not base else 'FAIL ') + "the map's base rules hold on ten seeds", '' if not base else base); fails += bool(base)
        pg = await br.new_page(viewport={'width': 390, 'height': 844}); await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(400)
        ui = await pg.evaluate("""() => { const F = window.__fk; F.SET.fog = false; F.SET.scen = 'open'; F.newGame(3); F.act('close'); const G = F.G; G.P[0].age = 4; const k = F.keepOf(0);
          for (let i = 0; i < 5; i++) F.addUnit(0, 'spear', k.x + 30, k.y + 30); for (let i = 0; i < 10; i++) F.step(1 / 30); F.ui(true);
          const n = [...document.querySelectorAll('[data-act]')].filter((e) => !e.closest('#card') && !e.closest('#end') && e.offsetParent !== null && e.getBoundingClientRect().width > 0).length;
          return [n, F.UI_BUDGET]; }"""); await pg.close()
        print(('PASS ' if ui[0] <= ui[1] else 'FAIL ') + f'the play screen keeps to its button budget: {ui[0]} of {ui[1]}'); fails += ui[0] > ui[1]
        fp, _ = await fingerprint(br); print(('PASS ' if not fp else 'FAIL ') + 'the game plays as the baseline says', '' if not fp else '\n  ' + '\n  '.join(fp[:4]) + '\n  (a deliberate rule change: python3 tests/gate.py --accept "why")'); fails += bool(fp)
        await br.close()
    if '--soak' in sys.argv: fails += subprocess.run([sys.executable, 'tests/soak.py']).returncode != 0   # opt-in, about 3 minutes: long games on three seeds
    sys.exit(1 if fails else 0)
asyncio.run(main())
