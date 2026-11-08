'use strict';
// E168
// E169
window.MENU = (() => {
const { D, B, U, SIDES, N, show } = FK, { zero: ZERO, one: ONE } = FK.D.count, things = FK.things, units = FK.units, [ME] = D.players;
// E170
const LAYERS = [['G', 'Grid'], ['Z', 'Zones'], ['T', 'Things'], ['R', 'Rim'], ['B', 'Buildings'], ['U', 'Units'], ['K', 'Climate'], ['V', 'View']]; // E171
const SCR = fromBook('screen'), GROUPS = SCR.tabs; // E172
const seatCode = () => FK.ticked('Seat')[0], born = () => FK.trains(seatCode())[0]; // E173
const classes = () => Object.values(D.trains).flat().filter((k) => !FK.SH[k]), kindOf = (cls) => FK.kinds(cls).find((c) => FK.aged(c, ME)) || FK.kinds(cls)[0]; // E174
const tall = (page) => !!(SCR[page] && SCR[page].ticks.includes('Tall')); // E175
const OPTS = { // E176
  diff: [['Easy'], ['Normal'], ['Hard']], len: [['Conquest', 0], ['15 min', 900], ['30 min', 1800], ['60 min', 3600]], scen: [['Open', 'open'], ['Siege', 'siege'], ['Silk Road', 'road'], ['Last Keep', 'last']],
  world: [['Real'], ['Fantasy']], tension: [['Winner'], ['Diplomacy']], daily: [['Off', false], ['On', true]],
  civ: [['Roman'], ['Han'], ['Persian'], ['Mongol'], ['Maurya'], ['Mali']], hazard: [['Hardest', 'hard'], ['Famine', 'starve'], ['Weather', 'winter'], ['Drought', 'drought'], ['Outlaws', 'horde'], ['Plague', 'plague']] };
const BUILT = { diff: true, len: true, daily: true, civ: true, scen: true }; // E177
const ICON = { food: '🍖', wood: '🪵', gold: '🪙', stone: '🪨', iron: '⛓' };
const ORDER = ['food', 'wood', 'stone', 'gold', 'iron'], NAME = { food: 'Food', wood: 'Wood', stone: 'Stone', gold: 'Gold', iron: 'Iron' }; // E178
// E179
const svg = (body, fill = 'none') => `<svg viewBox="0 0 24 24" width="22" height="22" fill="${fill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const SVG = {
  yard: svg('<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>'),
  war: svg('<path d="M4 21V5h3v3h3V5h4v3h3V5h3v16zM10 21v-5h4v5"/>'),
  people: svg('<circle cx="15" cy="8" r="4" fill="currentColor"/><path d="M8 21c0-4 3-6 7-6s7 2 7 6z" fill="currentColor"/><path d="M2 9h6M5 6v6"/>'),
  build: svg('<path d="M4 20l9-9M11 4l6 1 3 3-1 3-3-1-3 3-3-3 3-3z" fill="currentColor"/>'),
  food: svg('<path d="M12 9c0-3 2-5 5-6" style="stroke:var(--rg)"/><circle cx="8" cy="15" r="4.5" style="fill:var(--food);stroke:none"/><circle cx="16" cy="15" r="4.5" style="fill:var(--food);stroke:none"/><circle cx="12" cy="10.5" r="4.5" style="fill:var(--food);stroke:var(--b2);stroke-width:1.5"/>'), // E180
  wood: svg('<rect x="2" y="8" width="19" height="8" rx="4" style="fill:var(--wood);stroke:none"/><circle cx="17" cy="12" r="3.2" style="fill:color-mix(in srgb,var(--wood) 45%,var(--rw));stroke:none"/><circle cx="17" cy="12" r="1" style="fill:var(--wood);stroke:none"/>'),
  stone: svg('<path d="M3 9l7-4 10 3-1 10-9 3-6-5z" style="fill:var(--stone);stroke:var(--b3);stroke-width:1.5"/><path d="M10 5l1 8 8-5M11 13l-1 8" style="stroke:var(--b3);stroke-width:1.5"/>'),
  gold: svg('<circle cx="12" cy="12" r="9" style="fill:var(--gold);stroke:none"/><circle cx="12" cy="12" r="5.5" style="fill:none;stroke:var(--f2);stroke-width:2"/>'),
  book: svg('<path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5c-3-.5-6 0-8 1.5zM12 6v14.5"/>'),
  work: svg('<rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor"/>'), gather: svg('<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5"/>'),
  garrison: svg('<path d="M14 4l6-1-1 6-9 9-3-3zM7 15l-3 3 2 2 3-3"/>'), shelter: svg('<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/>'), squad: svg('<circle cx="12" cy="7" r="3" fill="currentColor"/><circle cx="5" cy="9" r="2.5" fill="currentColor"/><circle cx="19" cy="9" r="2.5" fill="currentColor"/><path d="M6 19c0-4 3-6 6-6s6 2 6 6zM0.5 18c0-3 2-5 4.5-5M23.5 18c0-3-2-5-4.5-5" fill="currentColor" stroke="none"/>'),
  direct: svg('<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 1v5M12 18v5M1 12h5M18 12h5"/>'), attack: svg('<path d="M14 4l6-1-1 6-9 9-3-3zM7 15l-3 3 2 2 3-3"/>'),
  spear: svg('<path d="M4 20L19 5M15 5h4v4"/>'), archer: svg('<path d="M8 3c6 3 6 15 0 18M8 3v18M3 12h18M18 9l3 3-3 3"/>'), cata: svg('<path d="M6 20l1-8c0-4 3-7 7-7l3 3-2 3 2 2-2 2-3-2-2 7"/>'), ram: svg('<path d="M5 12h14l-2-4H7zM12 8l3-4M4 12v3h16v-3"/><circle cx="7.5" cy="18" r="2"/><circle cx="16.5" cy="18" r="2"/>'),
  wall: svg('<path d="M4 20L19 5M15 5h4v4"/>'), loose: svg('<path d="M8 3c6 3 6 15 0 18M8 3v18M3 12h18M18 9l3 3-3 3"/>'), charge: svg('<path d="M6 20l1-8c0-4 3-7 7-7l3 3-2 3 2 2-2 2-3-2-2 7"/>'), bombard: svg('<path d="M5 12h14l-2-4H7zM12 8l3-4M4 12v3h16v-3"/><circle cx="7.5" cy="18" r="2"/><circle cx="16.5" cy="18" r="2"/>'),
  sound: svg('<path d="M4 9h4l5-4v14l-5-4H4zM16 8c2 2 2 6 0 8M19 5c4 4 4 10 0 14"/>'), play: svg('<path d="M7 4l13 8-13 8z" fill="currentColor"/>'), mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  star: svg('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor" stroke="none"/>'), shield: svg('<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6zM12 3v18"/>'),
  train: svg('<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/>'), check: svg('<path d="M5 12l5 5 9-10"/>'),
  spring: svg('<g style="fill:var(--food);stroke:none"><circle cx="12" cy="6" r="3.3"/><circle cx="17.7" cy="10.2" r="3.3"/><circle cx="15.5" cy="17" r="3.3"/><circle cx="8.5" cy="17" r="3.3"/><circle cx="6.3" cy="10.2" r="3.3"/></g><circle cx="12" cy="12" r="2.5" style="fill:var(--gold);stroke:none"/>'),
  summer: svg('<circle cx="12" cy="12" r="4.5" style="fill:var(--gold);stroke:none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" style="stroke:var(--gold)"/>'),
  autumn: svg('<path d="M5 19C5 10 10 5 20 4c-1 10-6 15-15 15zM5 19l8-8" style="fill:var(--age1);stroke:var(--age1)"/>'), winter: svg('<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 3 3-3M9 20l3-3 3 3" style="stroke:color-mix(in srgb,var(--rb) 45%,var(--rw))"/>'),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>'), back: svg('<path d="M20 12H5M11 6l-6 6 6 6"/>'),
  iron: svg('<path d="M2 17l4-7h12l4 7z" style="fill:var(--iron);stroke:none"/><path d="M6 10l2-3h8l2 3z" style="fill:color-mix(in srgb,var(--iron) 45%,var(--rw));stroke:none"/>'),
};
// E181
const COL = { b1: '#2a1d13', b2: '#33241a', b3: '#6b5230', g1: '#e6b947', s1: '#1e2329', s2: '#2a3038', s3: '#4d5a68', rb: '#6aaeff', rg: '#5fd08a', rr: '#ff6b5b', rw: '#ece5d3', f1: '#f2d27a', f2: '#b8862e', ink: '#2a1c10',
  food: '#e0708a', wood: '#c08a58', stone: '#b4bbc0', gold: '#f2cf55', iron: '#8fa3b5', age0: '#9a9890', age1: '#b5793a', age2: '#c9c2a6', age3: '#4d6b9e', age4: '#8e2f2a' };
const css = document.createElement('style'); css.textContent = `:root { ${Object.entries(COL).map(([k, v]) => `--${k}: ${v};`).join(' ')} --slot: ${SCR.mold.slot}px; --gap: ${SCR.mold.gap}px; --dim: 80%; --faint: 35%; --wdim: color-mix(in srgb, var(--rw) var(--dim), transparent); --wfaint: color-mix(in srgb, var(--rw) var(--faint), transparent); }
/* MENU-SPEC §1: one number, 6 (gaps and edges); slots 44 tall; radius 6, an outline round slots 9; text 14 and 18 (D-044), Barlow 600 */
#ui { position: fixed; left: var(--gap); right: var(--gap); bottom: calc(env(safe-area-inset-bottom, 0px) + var(--gap)); display: flex; flex-direction: column; gap: var(--gap); pointer-events: none; } #ui > * { pointer-events: auto; }
.cell { min-width: 0; height: var(--slot); box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; padding: 0 4px; background: var(--b2); color: var(--rw); border: 1px solid var(--b3); border-radius: 6px; font: 600 14px/1.1 var(--ui); text-align: center; white-space: nowrap; overflow: hidden; position: relative; }
.cell small { font-size: 14px; color: var(--wdim); } .cell .c { color: var(--rg); } .cell .t { display: flex; align-items: center; gap: 4px; } .cell svg { display: block; width: 18px; height: 18px; flex: none; }
/* §9 states: the ring is the slot's edge. Gold chosen, blue ready; dim drops the fill a step and quiets the words (COLORS: never faded) */
.cell.on { border-color: var(--g1); box-shadow: inset 0 0 0 1px var(--g1); color: var(--g1); } .cell.blue { border-color: var(--rb); box-shadow: inset 0 0 0 1px var(--rb); }
.cell.dim { background: var(--b1); color: var(--wdim); } .cell.dim small, .cell.dim .c { color: var(--wdim); } i.e, .row6 > i, .frame > i { background: var(--b1); border: 1px solid var(--b2); border-radius: 6px; height: var(--slot); box-sizing: border-box; pointer-events: none; } .row6 > i.gap { background: none; border: 0; }
.cell.title { align-items: flex-start; padding-left: 14px; font: 400 18px var(--display); font-variant: small-caps; letter-spacing: .03em; color: var(--g1); } .bar { position: absolute; left: 12px; right: 12px; height: 3px; border-radius: 2px; }
.cell.go { background: linear-gradient(var(--f1), var(--f2)); color: var(--ink); border-color: var(--f1); font-size: 18px; } .cell.go small { color: var(--ink); }
/* the grid: six slots a rank; a box is one decision, its choices one bar split by thin lines (§3) */
.row6 { display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--gap); align-items: center; } .lab { padding-left: 6px; color: var(--wdim); line-height: 1.2; }
.cells { display: grid; grid-template-columns: repeat(var(--n), 1fr); } .cells.seg { background: var(--b2); border: 1px solid var(--b3); border-radius: 9px; overflow: hidden; } .cells.seg .cell { background: none; border: 0; border-radius: 0; padding: 0 1px; } .cells.seg .cell + .cell { border-left: 1px solid var(--b3); } .cells.seg .cell.on { border-radius: 6px; box-shadow: inset 0 0 0 2px var(--g1); }
/* tabs are a file folder: the open tab joins one gold outline round its page (§1) */
.tabs .cell.on { height: calc(var(--slot) + var(--gap) + 1px); align-self: start; border-radius: 9px 9px 0 0; border-bottom: 0; box-shadow: none; background: var(--b1); z-index: 1; }
.frame { margin-top: calc(-1 * var(--gap) - 1px); border: 1px solid var(--g1); border-radius: 9px; padding: var(--gap); display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: var(--slot); gap: var(--gap); flex: 1; align-content: start; } .frame.f6 { grid-template-columns: repeat(6, 1fr); align-items: center; }
.row6 > .q { background: var(--s2); border: 1px solid var(--s3); } .row6 > i.q { background: var(--s1); border-color: var(--s2); } /* the queue: the mold's six slots, steel (§10 Q1) */
.blurb { margin: 0 6px; color: var(--wdim); line-height: 1.3; } .blurb b { color: var(--rw); }
.info { flex: 1; overflow-y: auto; border: 1px solid var(--b3); border-radius: 9px; padding: 8px 12px; line-height: 1.45; font-weight: 500; } .info p { margin: 0 0 8px; } .info b { font-weight: 600; }
/* the card: solid over the map, above the base (Base); one height, but a Tall page keeps its own (Albert, Nov 5) */
#panel { box-sizing: border-box; display: none; flex-direction: column; gap: var(--gap); } #panel.on { display: flex; background: var(--b1); border: 1px solid var(--b3); border-radius: 9px; padding: var(--gap); }
#base { display: flex; flex-direction: column; gap: var(--gap); } #rank:empty { display: none; } #rank i { visibility: hidden; } .badge { position: absolute; top: var(--gap); right: var(--gap); border-radius: var(--gap); background: var(--rr); color: var(--rw); font-weight: bold; font-size: smaller; line-height: normal; padding-inline: var(--gap); } .cell { position: relative; } .cell.left { align-items: flex-start; text-align: left; padding-inline: var(--gap); } .mid.map { background: none; } .frame.list { grid-template-columns: none; } .prog { position: absolute; inset-inline: var(--gap); bottom: var(--gap); height: var(--gap); border-radius: var(--gap); background: var(--rg); transform-origin: left; transform: scaleX(var(--f)); } .bar { display: flex; flex-direction: column; gap: var(--gap); background: var(--b1); border: 1px solid var(--rg); border-radius: 9px; padding: var(--gap); } .bar .cells { gap: var(--gap); } #spd { position: fixed; right: var(--gap); top: calc(env(safe-area-inset-top, 0px) + var(--slot) + var(--gap) + var(--gap)); width: calc((var(--slot) + var(--gap)) * var(--n)); } #spd:not(.on) { display: none; } .pairs { display: flex; gap: var(--gap); } .pairs .cell { flex: 1; padding: 0; } #base .pairs .cell { font-size: 18px; }
/* war: steel, the war tiles a faint red; the middle box one block, thin dividers, a white edge (§8 the battle station) */
.warbase { display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: var(--slot) var(--slot); gap: var(--gap); } .cell.red { background: color-mix(in srgb, var(--rr) 22%, var(--s2)); border-color: color-mix(in srgb, var(--rr) 30%, var(--s3)); } .cell.warx { background: var(--s1); border-color: var(--rr); box-shadow: inset 0 0 0 1px var(--rr); }
.mid { grid-column: 3 / 5; grid-row: 1 / 3; display: grid; grid-template-columns: 1fr 1fr; background: var(--s1); border: 2px solid var(--rw); border-radius: 9px; overflow: hidden; } .mid .cell { height: auto; border: 0; border-radius: 0; background: none; } .mid .cell:nth-child(odd) { border-right: 1px solid var(--s3); } .mid .cell:nth-child(-n+2) { border-bottom: 1px solid var(--s3); } .mid .cell.whole { grid-column: 1 / 3; grid-row: 1 / 3; border: 0; }
/* the top: framed bars with dividers */
.topbar { position: fixed; left: var(--gap); right: var(--gap); top: calc(env(safe-area-inset-top, 0px) + var(--gap)); display: flex; flex-direction: column; gap: var(--gap); z-index: 3; } #top { display: none; }
.strip { display: grid; grid-template-columns: repeat(8, 1fr); background: var(--b1); border: 1px solid var(--b3); border-radius: 9px; } .strip .cell { background: none; border: 0; border-radius: 0; height: 30px; } .strip .cell + .cell { border-left: 1px solid var(--b2); } .strip.big .cell { height: var(--slot); } .strip:not(.big) .cell { flex-direction: row; gap: 4px; }
#card { background: var(--b1); border: 1px solid var(--b3); border-radius: 9px; padding: 8px 10px; display: none; flex-direction: column; gap: var(--gap); } #card.on { display: flex; } #card h2 { font: 400 18px var(--display); color: var(--g1); margin: 0; } #card p { margin: 0; color: var(--wdim); } .row { display: flex; gap: var(--gap); } .row .cell { flex: 1; } .cell.w1 { flex: 0 0 var(--slot); }
#qa { position: fixed; display: none; gap: var(--gap); } #qa.on { display: flex; } #qa .cell { width: var(--slot); }
#toast { position: fixed; left: var(--gap); top: calc(env(safe-area-inset-top, 0px) + 2 * var(--slot) + 3 * var(--gap)); background: var(--b1); border: 1px solid var(--g1); color: var(--g1); border-radius: 9px; padding: 6px 12px; font: 600 14px var(--ui); opacity: 0; transition: opacity .3s; max-width: 45vw; z-index: 4; pointer-events: none; } #toast.on { opacity: 1; pointer-events: auto; }`;
document.head.appendChild(css);
const ui = document.createElement('div'); ui.id = 'ui'; ui.innerHTML = '<div id="card"></div><div id="panel"></div><div id="rank"></div><div id="base"></div>'; document.body.appendChild(ui);
const topEl = document.createElement('div'); topEl.className = 'topbar'; document.body.appendChild(topEl);
const toastEl = document.createElement('div'); toastEl.id = 'toast'; document.body.appendChild(toastEl);
const spdEl = document.createElement('div'); spdEl.id = 'spd'; spdEl.className = 'cells seg'; spdEl.style.setProperty('--n', [...D.speeds, 'new'].length); document.body.appendChild(spdEl); // E718
const $ = (id) => document.getElementById(id);
const S = { tab: 'Start', mailT: -Infinity, prev: null, htab: 'Town', war: false, mid: 'map', info: false, opt: { diff: 1, len: OPTS.len.findIndex((o) => o[1] === D.bell), scen: 0, world: 0, tension: 1, daily: 0, civ: 0, hz: new Set() }, group: 'Land', ghost: null, aim: null, qa: null, tool: null, more: false, tap: null, firedT: -Infinity, aimT: 0, subject: null, lock: {}, last: '', toastT: 0 }; // E182
try { Object.assign(S.lock, JSON.parse(localStorage.getItem('fk.lock') || '{}')); } catch (e) {}
const toast = (msg, secs = D.toast, at = null) => { toastEl.textContent = msg; toastEl.className = 'on'; S.toastT = secs; S.toastAt = at; }; toastEl.addEventListener('click', () => { if (S.toastAt) { FK.cam.follow = false; FK.camGo(...FK.toView(S.toastAt.bx, S.toastAt.by, D.land)); } toastEl.className = ''; S.toastT = ZERO; }); // E737
const WD = fromBook('words'), TW = WD.troops, TP_ = WD.pause, blessed = () => WAR.armyOf(ME).filter((u) => WAR.SQ.sel == null || u.bn === WAR.SQ.sel), SAY = D.say, WO = WD.orders, TO = D.touch, HUD = D.hud, RT = FK.SPRITE.reticle; // E272
const fmt = (n) => (n >= SAY.whole ? Math.round(n / SAY.thousand) + WD.thousand : n >= SAY.thousand ? Math.floor(n / SAY.tenth) / (SAY.thousand / SAY.tenth) + WD.thousand : String(Math.floor(n)));
const plural = (n) => { for (const [p, f, e] of WD.plural) { const re = new RegExp(p, f); if (re.test(n)) return n.replace(re, e); } }; // E273
const some = (k, n) => (k === 1 ? n : plural(n));
const orList = (L) => { const head = [...L], last = head.pop(); return [head.join(WD.list.and), last].filter(Boolean).join(WD.list.or); };
const slowPct = (f) => Math.round((f / (1 + f)) * SAY.percent); // E274
const coord = (bx, by) => { const n = Math.ceil(D.board / D.coord), at = (v) => Math.min(n - 1, Math.max(0, Math.floor((v - FK.B0) / D.coord))); return WD.squares[at(bx)] + (at(by) + 1); }; // E275
const ledgerLine = (o) => Object.entries(o || {}).filter(([, v]) => v >= D.flow.half).sort(([, a], [, b]) => b - a).map(([w, v]) => `${WD.ledger[w] || w} ${fmt(v)}`).join(WD.list.dot) || WD.none; // E276
const mixc = (a, b, t) => '#' + [0, 2, 4].map((i) => Math.round(parseInt(a.substr(i + 1, 2), 16) * (1 - t) + parseInt(b.substr(i + 1, 2), 16) * t).toString(16).padStart(2, '0')).join('');
const price = (c) => { const st = SIDES[ME].store, miss = Object.entries(c || {}).map(([y, n]) => [y, Math.ceil(n - (st[y] || 0)), n]).filter(([, m]) => m > 0); if (!miss.length) return `<small class="c">${costText(c)}</small>`;
  const f = Math.min(...miss.map(([, m, n]) => 1 - m / n)); return `<small style="color:${f < 0.5 ? mixc(COL.rr, COL.rw, f * 2) : mixc(COL.rw, COL.rg, f * 2 - 1)};opacity:1">${WD.short}</small>`; };
const clock = (t) => `${Math.floor(t / 60)}:${String(Math.ceil(t % 60) % 60).padStart(2, '0')}`;
const costText = (c) => Object.entries(c || {}).filter(([, n]) => n > 0).map(([y, n]) => `${n}${y[0]}`).join(' ') || 'free'; // E183
const own = (t) => t && t.side === ME, AW = WD.alarm, EW = WD.end, NEWS = WD.news, TELL = WD.say, WA = WD.army, DIALTECH = { temper: 'engage', form: 'formations', intent: 'command' }, TECHOF = FK.TK; // E404
const MUSTER = { tech: 'Needs Muster', none: 'Nothing missing', at: 'Needs a War Council', kind: 'Needs the building that trains it', army: 'The army is full', room: 'Needs room: build dwellings' };
const council = (t) => (own(t) && FK.has(t, 'Squad') ? row(...WA.squads.map((n, i) => vcell('squad', i, null, '', WAR.SQ.sel === i)), vcell('muster')) + row(...classes().map((c) => `<div class="pairs">${vcell('plan', c, '')}${vcell('plan', c, 'up')}</div>`)) : ''); // E405
const isVil = (u) => u && u.kind === 'unit' && FK.has(u, 'Gather') && own(u);
const isSoldier = (u) => u && u.kind === 'unit' && own(u) && WAR.armed(u);
const hall = () => { const h = FK.seatOf(ME); return h && h.done >= 1 ? h : null; };
const trainer = (c) => ECON.lineFor(ME, c), P = D.place, line = (c) => FK.SH[c].ticks.includes('Line'), walled = (c) => line(c) || FK.SH[c].ticks.includes('Gate'); // E332
const count = (c) => FK.blds().filter((t) => t.side === ME && t.code === c).length, picked = (c) => S.ghost && S.ghost.code === c;
const summary = () => `${OPTS.len[S.opt.len][0]} · Daily ${OPTS.daily[S.opt.daily][0].toLowerCase()}`;
const aging = (c) => `${plural(U[c][0])} need the ${FK.SH[c].age} age`; // E373
const isFind = (t) => t && t.kind !== 'unit' && t.kind !== 'bld' && ECON.yieldOf(t);
// E184
function read() { const s = SIDES[ME], r = ECON.result(); return { store: s.store, pop: ECON.popOf(ME), cap: ECON.popCap(ME), age: D.ages[s.age], aging: s.aging, ageCost: ECON.ageCost(ME), jobs: ECON.jobs(ME), rally: s.rally, army: WAR.armyOf(ME).length, wave: WAR.waves[0], sel: FK.sel(), subject: S.subject, time: ECON.time(), left: Math.max(0, D.bell - ECON.time()), score: ECON.score(ME), theirs: ECON.score(D.players[1]), result: r, next: D.ages[ECON.nextAge(ME)] || null, hall: hallRead() }; }
function hallRead() { const h = (S.subject && FK.has(S.subject, 'Seat') && own(S.subject) ? S.subject : hall()) || null; if (!h) return null; const q = h.q || []; let at = h.qt || 0;
  return { k: key(h), hp: h.hp, hpMax: h.hpMax, life: h.hp / h.hpMax, done: q.length ? 1 - h.qt / ECON.timeOf(h.side, q[0]) : 0, queue: q.slice(0, SCR.mold.slots).map((c, i) => [ECON.nameOf(c), i ? (at += ECON.timeOf(h.side, c)) : at]), more: Math.max(0, q.length - SCR.mold.slots + 1) }; }
// E185
const VERBS = {
  show: { label: (c) => 'Show', whyNot: () => '', run: (c) => { show[c] = !show[c]; FK.dirty(); } },
  lock: { label: () => 'Lock', whyNot: () => '', run: (c) => { S.lock[c] = !S.lock[c]; try { localStorage.setItem('fk.lock', JSON.stringify(S.lock)); } catch (e) {} } },
  fast: { label: () => 'Fast', whyNot: () => '', run: () => { show.fast = !show.fast; } },
  speed: { label: (n) => `×${n}`, whyNot: () => '', run: (n) => { show.speed = Number(n); if (FK.paused()) FK.pause(false); S.tab = null; } }, /* Base's spd (E718) */
  new: { label: () => 'New', whyNot: () => '', run: () => { S.prev = S.tab; S.tab = 'Start'; FK.pause(true); } },
  copylog: { label: () => WT.copy, whyNot: () => '', run: () => copyLog() },
  close: { label: () => SVG.close, whyNot: () => '', run: () => { S.tab = null; S.subject = null; S.ghost = null; FK.dirty(); } },
  back: { label: () => SVG.back, whyNot: () => '', run: () => { S.tab = S.prev; S.prev = null; } },
  squad: { label: (i) => `${WA.squads[i]}<small>${WAR.squad(i).length} ${msnSay(i)}</small>`, whyNot: () => (WAR.knows(ME, 'command') ? '' : 'Needs Battalions'), run: (i) => { if (WAR.SQ.sel === i) S.mid = 'setup'; else WAR.SQ.sel = i; } }, // E403
  setup: { label: () => WA.setup, whyNot: () => '', run: () => { S.mid = 'setup'; } },
  squads: { label: () => WA.back, whyNot: () => '', run: () => { S.mid = 'squad'; } },
  dial: { label: (k) => { const v = WAR.dialOf(k, WAR.SQ.sel); return `${WA[k]}<small>${!WAR.DIAL[k][v] ? WA.all : k === 'form' ? WA.forms[WAR.SHAPES[v]] : WAR.DIAL[k][v]}</small>`; }, whyNot: (k) => (WAR.knows(ME, DIALTECH[k]) ? '' : `Needs ${BOOKS.tech[TECHOF[DIALTECH[k]]].name}`), run: (k) => WAR.cycle(k, WAR.SQ.sel) },
  plan: { label: (c, up) => (up ? `${(WAR.SQ.plan[WAR.SQ.sel] || {})[c] || ''}<small>${c}</small>` : '−'), whyNot: () => (WAR.SQ.sel == null ? 'Pick a squad' : ''), run: (c, up) => WAR.plan(WAR.SQ.sel, c, !!up) },
  muster: { label: () => `${WA.muster}${WAR.SQ.sel == null ? '' : price(ECON.musterCost(ME, WAR.lack(WAR.SQ.sel)).cost)}`, whyNot: () => { if (WAR.SQ.sel == null) return 'Pick a squad'; const g = WAR.lack(WAR.SQ.sel), w = ECON.musterWhy(ME, g); return w === 'cost' ? `Needs ${costText(ECON.musterCost(ME, g).cost)}` : MUSTER[w] || ''; }, run: () => ECON.muster(ME, WAR.lack(WAR.SQ.sel), WAR.SQ.sel) },
  opt: { label: (k, i) => OPTS[k][i][0], whyNot: (k) => (BUILT[k] ? '' : 'Not built yet'), run: (k, i) => { S.opt[k] = i; } },
  war: { label: () => (S.war ? '' : `<span class="t">${SVG.war}</span>${WD.mail.groups.war}`), whyNot: () => '', run: () => { const [w, h] = FK.size(); S.war = !S.war; S.mid = 'map'; S.tab = null; S.tool = null; S.aim = S.aim || { k: tileK(w * P.half, h * P.half), t: null }; S.aimT = performance.now(); } },
  mid: { label: (m) => `<span class="t">${SVG[m]}</span>${{ train: 'Train', squad: 'Squad', direct: 'Direct' }[m]}`, whyNot: () => '', run: (m) => { S.mid = S.mid === m ? 'map' : m; } },
  kind: { label: (c) => `<span class="t">${SVG[FK.kinds(FK.SH[c].class).map((k) => FK.SH[k].look).find((l) => SVG[l])]}</span>${FK.rankName(c, ME)}`, whyNot: (c) => { const b = trainer(c); return !FK.aged(c, ME) ? aging(c) : !b ? `Build a ${B[Object.keys(D.trains).find((x) => FK.trains(x, ME).includes(c))][0]}` : VERBS.train.whyNot(c, b); }, run: (c) => ECON.queue(trainer(c), c) }, // E186
  htab: { label: (t) => t, whyNot: () => '', run: (t) => { S.htab = t; } },
  info: { label: () => SVG.book, whyNot: () => '', run: () => { S.info = !S.info; } },
  vol: { label: (c) => `${FK.HB.mix.names[c]} <small>${SOUND.mix(c)}</small>`, whyNot: () => '', run: (c) => SOUND.step(c) }, // E187
  mute: { label: () => `<span class="t" style="opacity:${window.SOUND && SOUND.on() ? 1 : 0.35}">${SVG.sound}</span>`, whyNot: () => '', run: () => SOUND.toggle() }, // E188
  alarm: { label: (k) => `<span class="t">${SVG[AW.cells[k].icon]}</span>${AW.cells[k].name}`, whyNot: () => (FK.seatOf(ME) ? '' : AW.noSeat), run: (k) => ECON.alarm(k) }, // E451
  work: { label: () => `<span class="t">${SVG[AW.cells.work.icon]}</span>${AW.cells.work.name}`, whyNot: () => '', run: () => ECON.allClear() },
  later: { label: (t) => SVG[t] || `${t}<small>Later</small>`, whyNot: () => 'Not built yet', run: () => {} }, // E189
  hazard: { label: (id) => `${OPTS.hazard.find(([, k]) => k === id)[0]}<small>${D.hazards.pts[id]}</small>`, whyNot: () => '', run: (id) => { S.opt.hz.has(id) ? S.opt.hz.delete(id) : S.opt.hz.add(id); } }, // E705
  start: { label: () => `Start<small>${summary()}</small>`, whyNot: () => '', run: () => { const o = (k) => OPTS[k][S.opt[k]][1], mine = civOf(S.opt.civ); ECON.deal([mine, ...PEOPLES().filter((k) => k !== mine)]); ECON.setBell(o('len') || Infinity); S.tab = null; FK.pause(false); if (!o('daily')) FK.restart(); else if (location.hash.length > 1) location.hash = ''; else FK.reset(); } }, // E190
  job: { label: (y, n) => (n > 0 ? '+' : '−'), whyNot: (y, n) => (VERBS.yield.whyNot(y) ? VERBS.yield.whyNot(y) : n > 0 && !ECON.villagersOf(ME).length ? 'No villagers' : n < 0 && !ECON.jobs(ME)[y] ? `No one on ${y}` : ''), run: (y, n) => { if (!ECON.assign(ME, y, n)) toast(n > 0 ? `No ${y} within reach` : `No one on ${y}`); } },
  people: { label: () => `<span class="t">${SVG.people}</span>People`, whyNot: () => { const h = hall(); return !h ? 'No hall' : VERBS.train.whyNot(born(), h); }, run: () => ECON.queue(hall(), born()) },
  yield: { label: (y) => `<span class="t">${SVG[y]}${ECON.jobs(ME)[y]}</span>${NAME[y]}`, whyNot: (y) => (ECON.yieldAge(y) > SIDES[ME].age ? WD.bar.opens.replace('{y}', NAME[y]).replace('{age}', D.ages[ECON.yieldAge(y)]) : ''), run: (y) => { SIDES[ME].rally = SIDES[ME].rally === y ? null : y; } }, // E191
  research: { label: (c) => `${TB[c].name}${price(ECON.priceOf(ME, c))}`, whyNot: (c) => { const w = ECON.researchWhy(ME, c), n = ECON.needsOf(c).find((x) => !SIDES[ME].techs.has(x)); return (w && WD.research[w] || '').replace('{age}', D.ages[TV(c).age]).replace('{name}', n && TB[n].name).replace('{cost}', costText(ECON.priceOf(ME, c))); }, run: (c) => ECON.research(ME, c) }, // E739
  ageUp: { label: () => { const r = read(); return !r.next ? 'Last age' : `${r.next} age${r.aging ? `<small>rising, ${Math.ceil(r.aging)}s</small>` : price(r.ageCost)}`; }, whyNot: () => { const c = ECON.ageCost(ME); return !c ? 'Last age' : SIDES[ME].aging ? 'Already rising' : !ECON.canPay(ME, c) ? `Needs ${costText(c)}` : ''; }, run: () => ECON.ageUp(ME) },
  pick: { label: (c) => { const w = picked(c) ? '' : ECON.capWhy(ME, c), lim = ECON.limitOf(ME, c); return `${B[c][0]} ${w && !lim ? '' : count(c) + (lim ? '/' + lim : '')}${picked(c) ? `<small>${ghostSay(S.ghost)}</small>` : w ? `<small>${w}</small>` : price(D.cost[c]).replace('</small>', (S.hint === c ? WD.place.fits : '') + '</small>')}`; }, // E192
    whyNot: (c) => (picked(c) ? VERBS.build.whyNot() : ECON.capWhy(ME, c) || (!ECON.canPay(ME, D.cost[c] || {}) ? `Needs ${costText(D.cost[c])}` : '')), run: (c) => { if (picked(c)) { S.ghost = null; S.tab = 'Build'; return; } S.tab = null; S.ghost = { code: c, i: -99, j: -99, ok: false, pts: [], cells: [] }; if (!line(c)) { const [w, h] = FK.size(); ghostTo(w * P.half, h * P.half, P.start); } } },
  build: { label: () => 'Build', whyNot: () => { const g = S.ghost; return !g ? 'Pick a building' : line(g.code) ? (!g.cells.length ? 'Tap the corners' : g.bad === g.cells.length ? 'Something is in the way' : '') : g.ok ? '' : g.why || 'Slide to place'; }, run: () => place(S.ghost) },
  group: { label: (g) => g, whyNot: () => '', run: (g) => { S.group = g; S.ghost = null; FK.dirty(); } },
  attack: { label: () => `<span class="t">${SVG.attack}</span>Attack<small>${msnSay(WA.all)}</small>`, whyNot: () => (!WAR.armyOf(ME).length ? 'No soldiers' : ''), run: () => { WAR.go(S.aim); S.firedT = performance.now(); } }, // E427
  allHome: { label: () => WO.homeCell, whyNot: () => (!WAR.armyOf(ME).length ? 'No soldiers' : ''), run: () => WAR.everyHome() },
  callHome: { label: () => WO.homeCell, whyNot: (i) => (WAR.MS[i] && !WAR.MS[i].end ? '' : WO.notOut), run: (i) => WAR.callHome(i) },
  rally: { label: () => `${WO.rallyCell}<small>${WO.ambushCell}</small>`, whyNot: () => '', run: () => { SIDES[ME].flag = aimK(); toast(WO.rally); } },
  ambush: { label: () => WO.ambushCell, whyNot: () => '', run: () => WAR.ambushAt(aimK(), toolSet()) },
  choke: { label: () => WO.chokeCell, whyNot: () => '', run: () => { S.tool = S.tool === 'choke' ? null : 'choke'; const [, , , , tell] = WO.choke; if (S.tool) toast(tell); } },
  reinforce: { label: () => WO.reinforceCell, whyNot: () => (Object.values(WAR.MS).some((m) => !m.end && m.st === 'act') ? '' : WO.late), run: () => { const [m, p] = Object.values(WAR.MS).filter((m) => !m.end && m.st === 'act').sort((a, b) => a.odds - b.odds).map((m) => [m, WAR.reinforcePlan(m)]).find(([, p]) => p && p.go.length) || [];
    if (!m) return toast(WO.late); WAR.reinforce(p.go, m); toast(WO.reinforce.replace('{n}', p.go.length).replace('{m}', m.name).replace('{list}', waveLine(p))); } },
  move: { label: (c) => { const [[, a], [, b]] = WO.direct[c], w = WAR.directWait(c); return `${a}<small>${b}${w ? ` ${w}s` : ''}</small>`; }, whyNot: () => '', run: (c, held) => WAR.direct(c, !!held, S.aim) },
  quick: { label: () => SVG.attack, whyNot: () => (!WAR.sendable().length ? WO.none : ''), run: () => { const q = S.qa, U = WAR.sendable(); S.qa = null; if (WAR.order(U, null, q.k)) ECON.orderCost(ME, U); } },
  qclose: { label: () => SVG.close, whyNot: () => '', run: () => { S.qa = null; } },
  sendTo: { label: (y) => `<span class="t">${SVG[y]}</span>`, whyNot: (y) => (FK.picked().filter(isVil).some((u) => ECON.bestFind(u, y)) ? '' : `No ${y} within reach`), run: (y) => { for (const u of FK.picked().filter(isVil)) { const t = ECON.bestFind(u, y); if (t) ECON.gatherAt(u, t); } } },
  cancel: { label: () => WD.place.cancel, whyNot: () => '', run: () => VERBS.close.run() },
  chargeP: { label: () => WD.bar.charge, whyNot: () => WAR.chargeWhy(FK.picked().filter(isSoldier)), run: () => WAR.charge(FK.picked().filter(isSoldier)) },
  fallBackP: { label: () => WD.bar.fallBack, whyNot: () => '', run: () => WAR.fallBack(FK.picked().filter(isSoldier)) },
  holdP: { label: () => WD.bar.hold, whyNot: () => '', run: () => { for (const u of FK.picked().filter(isSoldier)) Object.assign(u, { path: null, goal: u.k, job: 'hold', target: null, ord: null }); } },
  hunt3: { label: () => WD.bar.hunt3, whyNot: (t) => VERBS.hunt.whyNot(t), run: (t) => { for (let i = WD.bar.hunters; i--; ) ECON.hunt(ME, t); } },
  home: { label: () => `<span class="t">${SVG.garrison}</span>${WD.bar.home}`, whyNot: () => '', run: () => { const h = FK.seatOf(ME); if (h) { FK.cam.follow = false; FK.camGo(h.vx, h.vy); } } },
  unpick: { label: () => SVG.close, whyNot: () => '', run: () => { FK.select(null); S.more = false; FK.dirty(); } },
  follow: { label: () => `<span class="t">${SVG.direct}</span>`, whyNot: () => '', run: () => { FK.cam.follow = !FK.cam.follow; FK.dirty(); } },
  mail: { label: () => { const n = mail.filter((m) => m.t > S.mailT).length; return `<span class="t">${SVG.mail}${n ? `<b class="badge">${n}</b>` : ''}</span>`; }, whyNot: () => '', run: () => { S.tab = S.tab === 'Mail' ? null : 'Mail'; S.mailT = FK.K.t; } },
  goto: { label: (i) => { const m = mail[i]; return `<small>${MWD.groups[m.grp] || m.grp}</small>${m.text}${m.times.length > [m].length ? ` ×${m.times.length}` : ''}`; }, whyNot: () => '', run: (i) => { const m = mail[i]; if (m && m.at) { FK.cam.follow = false; FK.camGo(...FK.toView(m.at.bx, m.at.by, D.land)); S.tab = null; } } },
  pause: { label: () => (FK.paused() ? SVG.play : TP_.mark), whyNot: () => '', run: () => { FK.pause(); } }, // E702
  resume: { label: () => WD.back.resume, whyNot: () => '', run: () => { S.tab = null; FK.pause(false); } },
  newgame: { label: () => (S.sure ? TP_.sure : TP_.newGame).replace(' ', '<small>') + '</small>', whyNot: () => '', run: () => { if (!S.sure) { S.sure = true; return; } S.sure = false; S.prev = null; S.tab = 'Start'; FK.pause(true); } }, // E703
  recall: { label: () => 'Recall', whyNot: () => (!WAR.armyOf(ME).length ? 'No soldiers' : ''), run: () => WAR.recall(ME) },
  train: { label: (c, b) => `${FK.rankName(c, ME)}${price(ECON.priceOf(ME, c, b))}`, whyNot: (c, b) => (b.done < 1 ? 'Not built yet' : !FK.aged(c, ME) ? aging(c) : !ECON.room(b) ? 'That line is full' : !ECON.canPay(ME, ECON.priceOf(ME, c, b)) ? `Needs ${costText(ECON.priceOf(ME, c, b))}` : ECON.popOf(ME) >= ECON.popCap(ME) ? 'No room: build a dwelling' : ECON.soldier(c) && ECON.armyFull(ME) ? `Army at the ceiling: ${ECON.armyRoom(ME)}` : ECON.campWhyTrain(ME, c)), run: (c, b) => ECON.queue(b, c) },
  untrain: { label: () => '−', whyNot: (b) => (!b.q || !b.q.length ? 'Nothing queued' : ''), run: (b) => ECON.unqueue(b) },
  stop: { label: () => 'Stop', whyNot: (u) => (u.job === 'idle' ? 'Already idle' : ''), run: (u) => { if (u.load) ECON.carry(u); else ECON.idle(u); } },
  gather: { label: () => 'Gather', whyNot: (t) => (!isVil(FK.sel()) ? 'Pick a villager' : ''), run: (t) => ECON.gatherAt(FK.sel(), t) },
  send: { label: () => 'Send one', whyNot: (t) => (!ECON.villagersOf(ME).some((v) => v.job === 'idle' || v.job === 'wait') ? 'No idle villager' : ''), run: (t) => { const u = ECON.villagersOf(ME).filter((v) => v.job === 'idle' || v.job === 'wait').sort((a, b) => FK.dist(a, t) - FK.dist(b, t))[0]; ECON.gatherAt(u, t); } },
  raise: { label: (t) => (t.done < 1 ? 'Raise' : `Repair${price(ECON.repairCost(t))}`), whyNot: (t) => (!isVil(FK.sel()) ? 'Pick a villager' : t.done >= 1 && t.hp >= t.hpMax - D.repair.within ? 'Not hurt' : ''), run: (t) => ECON.buildAt(FK.sel(), t) },
  scrap: { label: (t) => (t.done < 1 ? 'Cancel site' : 'Demolish'), whyNot: (t) => (FK.has(t, 'Seat') && t.done >= 1 ? 'The hall stays' : ''), run: (t) => { toast(`${B[t.code][0]} ${t.done < D.refund.first ? 'cancelled' : 'taken down'}: ${costText(ECON.refund(t))} back`); ECON.cancel(t); S.subject = null; } },
  fight: { label: () => 'Attack this', whyNot: (t) => (!isSoldier(FK.sel()) ? 'Pick a soldier' : ''), run: (t) => { ECON.orderCost(ME, [FK.sel()]); WAR.fight(FK.sel(), t, true); } },
  here: { label: () => 'Soldiers here', whyNot: (t) => (!WAR.armyOf(ME).length ? 'No soldiers' : ''), run: (t) => { ECON.orderCost(ME, WAR.armyOf(ME)); WAR.attack(ME, t.kind === 'bld' ? FK.tileAt(t.bx, t.by) : t.k); } },
  hunt: { label: () => 'Hunt', whyNot: () => (!ECON.villagersOf(ME).length ? 'No villagers' : ''), run: (t) => toast(ECON.hunt(ME, t) ? TELL.hunt : TELL.hands) }, // E357
  replant: { label: (t) => `Replant${price(ECON.replantCost(t))}`, whyNot: (t) => { const w = ECON.replantWhy(ME, t); return w === 'cost' ? `Needs ${costText(ECON.replantCost(t))}` : w; }, run: (t) => ECON.replant(ME, t) },
  replantAll: { label: () => 'Replant all', whyNot: () => '', run: (t) => { const n = ECON.replantAll(ME, t); toast(n ? TELL.replanted.replace('{n}', n) : TELL.broke); } },
  teach: { label: (u) => `${TW.teach.label}${price(ECON.teachCost(ME, u))}`, whyNot: (u) => ECON.teachWhy(ME, u).replace('{cost}', costText(ECON.teachCost(ME, u))), run: (u) => ECON.teach(ME, u) }, // E476
  zeal: { label: (t) => `${TW.zeal.label}${price(ECON.zealCost(ME, t))}`, whyNot: (t) => ECON.zealWhy(ME, t, blessed()).replace('{cost}', costText(ECON.zealCost(ME, t))), run: (t) => ECON.zeal(ME, t, blessed()) },
  ransom: { label: (i) => { const x = ECON.prisonersOf(ME)[i]; return x ? `${TW.prison.label} ${FK.SH[x.code].name}${price({ gold: x.ransom })}` : ''; }, whyNot: (i) => { const x = ECON.prisonersOf(ME)[i]; return x && !ECON.canPay(ME, { gold: x.ransom }) ? `Needs ${costText({ gold: x.ransom })}` : ''; }, run: (i) => ECON.payRansom(ME, +i) },
};
function act(verb, arg, arg2) { const v = VERBS[verb], why = v.whyNot(arg, arg2); tapCount(verb, !!why); if (why) { FK.fire('event', 'err', null); toast(why); return false; } FK.fire('event', verb === 'build' ? 'place' : 'tap', null); learnAct(verb, arg, arg2); v.run(arg, arg2); render(true); return true; }
// E193
const cell = (text, cls = '', on = null) => `<button class="cell ${cls}" ${on ? `data-v="${on.join('|')}"` : ''}>${text}</button>`;
const vcell = (verb, arg, arg2, cls = '', on = false) => { const v = VERBS[verb], a = ARGS[arg] ?? arg, a2 = ARGS[arg2] ?? arg2, why = v.whyNot(a, a2); return cell(v.label(a, a2), `${cls} ${why && !why.startsWith('Needs ') ? 'dim' : ''} ${on ? 'on' : ''}`, [verb, String(arg ?? ''), String(arg2 ?? '')]); };
const ARGS = {}, held = (html, verb, a = '', a2 = '') => html.replace('<button ', `<button data-h="${verb}|${a}|${a2}" `); // E194
const key = (o) => { const k = o.kind + (o.code || '') + (o.k ?? o.i + '_' + o.j) + (o.side ?? ''); ARGS[k] = o; return k; };
// E195
// E196
const row = (...items) => `<div class="row6">${items.join('')}</div>`;
const span = (n, html) => html.replace('class="', `style="grid-column:span ${n}" class="`);
const part = (label, l, k, n) => `${label ? `<span class="lab" style="grid-column:span ${l}">${label}</span>` : ''}<div class="cells seg" style="grid-column:span ${n};--n:${OPTS[k].length}">${OPTS[k].map((o, i) => vcell('opt', k, i, '', S.opt[k] === i)).join('')}</div>`;
const frame = (cells) => `<div class="frame">${cells.join('')}</div>`;
const bar = (f, col, top) => `<span class="bar" style="${top ? 'top' : 'bottom'}:6px;background:linear-gradient(90deg,${col} ${f * SAY.percent}%,var(--wfaint) ${f * SAY.percent}%)"></span>`;
const gap = (n) => `<i class="gap" style="grid-column:span ${n}"></i>`;
const head = (title, back) => row(back ? vcell('back') : '', span(back ? 3 : 4, cell(title, 'title')), vcell('later', 'book'), vcell('close'));
const queue6 = (q, done, more) => { const n = SCR.mold.slots, shown = more ? q.slice(0, n - 1) : q.slice(0, n);
  return [...shown.map(([name, t], i) => cell(`${name}<small>${clock(t)}</small>`, 'q').replace('class="', i ? 'class="' : `style="background:linear-gradient(90deg,color-mix(in srgb,var(--rg) 35%,var(--s2)) ${done * SAY.percent}%,var(--s2) ${done * SAY.percent}%)" class="`)), ...(more ? [cell(`+${more}`, 'q')] : []), ...Array(n - shown.length - (more ? 1 : 0)).fill('<i class="q"></i>')]; };
const SCREENS = {
  Start: () => [head('A new game', !!S.prev), row(part('Difficulty', 3, 'diff', 3)), row(part('Length', 2, 'len', 4)), row(part('Scenario', 2, 'scen', 4)),
    row(part('World', 1, 'world', 2)), row(part('Tension', 1, 'tension', 2), part('Daily', 1, 'daily', 2)), row(part('', 0, 'civ', 6)),
    `<p class="blurb"><b>${civLine(civOf(S.opt.civ))}`.replace(',', '</b>,') + '</p>', row(`<div class="cells seg" style="grid-column:span 6;--n:6">${OPTS.hazard.map(([, id]) => vcell('hazard', id, null, 'two', S.opt.hz.has(id))).join('')}</div>`),
    row(span(6, vcell('start', null, null, 'go')))], // E718
  Build: () => { const g = GROUPS[S.group];
    return [head('Build'), `<div class="row6 tabs">${Object.keys(GROUPS).map((x) => vcell('group', x, null, '', S.group === x)).join('')}</div>`,
      `<div class="frame">${g.map((c) => (D.cost[c] ? vcell('pick', c, null, `two ${picked(c) || S.hint === c ? 'blue' : ''}`) : vcell('later', B[c][0], null, 'two'))).join('')}</div>`]; },
  Hall: () => { const r = read(), h = r.hall || {}; // E197
    const title = row(span(4, cell(`${bar(1, `var(--age${Math.min(4, SIDES[ME].age)})`, 1)}${FK.SH[seatCode()].name}${h.hp != null ? bar(h.life, h.life > 0.5 ? 'var(--rg)' : 'var(--rr)') : ''}`, 'title')), vcell('info', null, null, '', S.info), vcell('close'));
    if (S.info) return [title, `<div class="info"><p>Health ${h.hp != null ? `${Math.ceil(h.hp)}/${h.hpMax}` : '–'} · ${r.age} age · room for ${Math.max(0, r.cap - r.pop)}.</p><p><b>Food:</b> your people eat ${Math.round(r.pop * D.upkeep * 600 / D.day) / 10} a minute.</p><p><b>${r.next ? r.next + ' age' : 'Last age'}:</b> ${r.next ? `${costText(r.ageCost)}, ${D.age.time[ECON.nextAge(ME)]}s to rise` : 'reached'}.</p><p><b>Later:</b> the age's history, tech, the civilization, goods wanted by others.</p></div>`];
    const tabs = `<div class="row6 tabs">${['Town', 'Relations', 'Misfits'].map((t) => span(2, vcell('htab', t, null, '', S.htab === t))).join('')}</div>`;
    if (S.htab !== 'Town') return [title, tabs, stances(S.htab)];
    return [title, tabs, row(...queue6(h.queue || [], h.done, h.more)), frame([h.k ? vcell('train', born(), h.k, 'two') : '<i></i>', vcell('later', 'Scout', null, 'two'), '<i></i>',
      vcell('ageUp', null, null, 'two', !!r.aging), ...lines(hall()).map((c) => (c ? vcell('research', c, null, 'two') : '<i></i>')), vcell('later', 'All tech', null, 'two'), '<i></i>'])]; },
  Mail: () => [head(WD.mail.title), `<div class="frame list">${mail.map((m, i) => vcell('goto', i, null, 'two left')).join('') || `<p class="blurb">${WD.mail.empty}</p>`}</div>`], // E732
  Back: () => [row(span(SCR.mold.slots, cell(WD.back.title, 'title'))), row(span(D.speeds.length, vcell('resume')), span(D.speeds.length, vcell('newgame', null, null, '', S.sure)))], // E706
  Layers: () => [row(span(2, cell('Yard', 'title')), vcell('fast', null, null, '', show.fast), vcell('new'), vcell('later', 'book'), vcell('close')), ...[0, 2, 4, 6].map((i) => row(...LAYERS.slice(i, i + 2).map(([c, name]) => `<span class="lab" title="${name}">${c}</span><div class="cells seg" style="grid-column:span 2;--n:2">${vcell('show', c, null, '', show[c])}${vcell('lock', c, null, '', S.lock[c])}</div>`))), row(...Object.keys(FK.HB.mix.names).map((c, _, all) => span(SCR.mold.slots / all.length, vcell('vol', c))))], // E198
};
const page = () => (S.tab && SCREENS[S.tab] ? SCREENS[S.tab]().join('') : '');
const codeOf = (t) => t.code || FK.KIND[t.kind].code, nameOf = (t) => FK.rankName(codeOf(t), t.side);
const ROWS = { // E199
  title: (t) => `<h2>${nameOf(t)}${t.side >= 0 && !own(t) ? ' (theirs)' : ''}</h2>`,
  health: (t) => (t.hp == null ? '' : `<p>${t.done < 1 ? `site · ${Math.floor(t.done * SAY.percent)}% raised` : `${Math.ceil(t.hp)}/${t.hpMax} health`}${t.kind === 'unit' && !FK.has(t, 'Gather') ? ` · ${t.job}` : ''}</p>`),
  load: (t) => `<p>${ECON.jobOf(t) || t.job}${t.load ? `, carrying ${Math.floor(t.load)}` : ''}</p>`,
  store: (t) => `<p>${Math.floor(t.amount)} ${ECON.yieldOf(t)} left</p>`,
  flock: (t) => `<p>${t.sheep} sheep</p>`, // E358
  queue: (t) => (own(t) && t.q && t.q.length ? row(...queue6(((at) => t.q.map((c, i) => [ECON.nameOf(c), i ? (at += ECON.timeOf(t.side, c)) : at]))(t.qt), 1 - t.qt / ECON.timeOf(t.side, t.q[0]), Math.max(0, t.q.length - SCR.mold.slots + 1))) : ''),
  train: (t) => (own(t) && t.done >= 1 ? `<div class="row">${FK.trains(t.code, t.side).map((c) => vcell('train', c, key(t))).join('')}${t.q && t.q.length ? vcell('untrain', key(t), null, 'w1') : ''}</div>` : ''),
  tech: (t) => (own(t) && t.done >= 1 ? `<div class="row">${FK.has(t, 'Seat') ? vcell('ageUp', null, null, '', !!read().aging) : ''}${lines(t).filter(Boolean).map((c) => vcell('research', c)).join('')}</div>` : ''), // E738
  troops: (t) => { const k = key(t), I = !own(t) && FK.has(t, 'Seat') && SIDES[ME].intel[t.side], x = !own(t) ? '' : t.kind === 'unit' ? (ECON.teachTo(t) ? vcell('teach', k) : '') : (FK.has(t, 'Zeal') ? vcell('zeal', k) : '') + (FK.has(t, 'Seat') ? ECON.prisonersOf(ME).map((_, i) => vcell('ransom', i)).join('') : ''); // E477
    return (x ? `<div class="row">${x}</div>` : '') + (t.job === 'school' ? `<p>${TW.teach.left.replace('{n}', Math.ceil(t.schoolT - FK.K.t))}</p>` : '') + (I ? `<p>${TW.sab.intel.replace('{n}', Math.floor(FK.K.t - I.t)).replace('{store}', costText(I.store)).replace('{age}', D.ages[I.age]).replace('{techs}', I.techs).replace('{army}', Object.values(I.army).reduce((a, b) => a + b, null))}</p>` : ''); },
  acts: (t, r) => { const k = key(t), sq = council(t), a = t.kind === 'unit' ? (own(t) ? vcell('follow', null, null, '', FK.cam.follow) + (FK.has(t, 'Gather') ? vcell('stop', k) : vcell('recall')) : isSoldier(r.sel) ? vcell('fight', k) : FK.has(t, 'Prey') ? vcell('hunt', k) : WAR.armed(t) || t.side < 0 ? vcell('here', k) : '')
      : t.kind === 'bld' ? (own(t) ? (t.max ? vcell('replant', k) : ECON.cutOut(ME, t).length ? vcell('replantAll', k) : '') + vcell('raise', k) + vcell('scrap', k) : (isSoldier(r.sel) ? vcell('fight', k) : '') + vcell('here', k)) : vcell('gather', k) + vcell('send', k);
    return sq + (a ? `<div class="row">${a}</div>` : ''); },
};
function cardText(r) { const t = S.subject; if (S.ghost) return `<p>${ghostSay(S.ghost)}</p><div class="row">${vcell('build')}${vcell('cancel')}</div>`; if (!t) return ''; // E669
  return SCR.card.filter(([, tick]) => !tick || FK.has(t, tick)).map(([name]) => ROWS[name](t, r)).join(''); }
// E200
const tab = (t, label, icon, cls = '') => cell(`<span class="t">${SVG[icon]}</span>${label}`, `ic ${cls} ${S.tab === t ? 'on' : ''}`, ['tab', t]);
const offScreen = () => { const h = FK.seatOf(ME); if (!h) return false; const [x, y] = FK.toScreen(h.vx, h.vy), [w, hh] = FK.size(); return x < ZERO || y < ZERO || x > w || y > hh; }; // E736
const rank = (card) => { if (S.tab || card || S.ghost) return ''; const P = FK.picked(), V = P.filter((u) => own(u) && isVil(u)), A = P.filter(isSoldier), W = P.filter((u) => u.kind === 'unit' && !own(u) && !SIDES[u.side]); const bar = (n, cells) => `<div class="bar">${row(span(ORDER.length, cell(WD.bar.picked.replace('{n}', n), 'title')), vcell('unpick'))}<div class="cells" style="--n:${cells.length}">${cells.join('')}</div></div>`;
  if (V.length && !S.war) return bar(V.length, [...ORDER.map((y) => vcell('sendTo', y, null, 'ic')), tab('Build', `<span class="t">${SVG.build}</span>`, 'build'), vcell('follow', null, null, 'ic', FK.cam.follow)]);
  if (A.length && !S.war) return bar(A.length, [vcell('chargeP'), vcell('fallBackP'), vcell('holdP'), vcell('recall'), vcell('follow', null, null, 'ic', FK.cam.follow)]); // E733
  if (W.length) return bar(W.length, [vcell('hunt', key(W[ZERO])), vcell('hunt3', key(W[ZERO])), vcell('follow', null, null, 'ic', FK.cam.follow)]); return row(offScreen() ? vcell('home', null, null, 'ic') : '<i></i>', ...ORDER.slice([ORDER].length).map(() => '<i></i>'), S.war ? vcell('war', null, null, 'ic warx').replace('</button>', `${SVG.close}</button>`) : vcell('war', null, null, 'ic red')); }; // E724
const base = (r) => S.war ? warBase() : row(vcell('people', null, null, `ic ${ECON.jobs(ME).idle ? 'blue' : ''}`), ...ORDER.map((y) => vcell('yield', y, null, 'ic', r.rally === y))) // E704
  + row(tab('Build', 'Build', 'build').replace('</button>', `${siteBar()}</button>`), ...ORDER.map((y) => `<div class="pairs">${vcell('job', y, -1)}${vcell('job', y, 1)}</div>`));
// E201
const MID = { map: () => '', train: () => classes().map((k) => vcell('kind', kindOf(k), null, 'ic')).join(''),
  squad: () => WA.squads.map((n, i) => held(vcell('squad', i, null, 'two', WAR.SQ.sel === i), 'callHome', i)).join('') + vcell('setup', null, null, 'two'), setup: () => Object.keys(WAR.DIAL).map((k) => vcell('dial', k, null, 'two')).join('') + vcell('squads', null, null, 'two'), direct: () => classes().map((c) => held(vcell('move', c, null, 'two'), 'move', c, 'h')).join('') + held(vcell('rally', null, null, 'two'), 'ambush') + vcell('choke', null, null, 'two', S.tool === 'choke') + vcell('reinforce', null, null, 'two') }; // E731
const siteBar = () => { const sites = FK.blds().filter((t) => t.side === ME && t.done < [t].length); if (!sites.length) return ''; const f = sites.reduce((s, t) => s + t.done, ZERO) / sites.length; return `<i class="prog" style="--f:${f.toFixed(D.speeds.length)}"></i>`; }; // E735
const warBase = () => `<div class="warbase">${vcell('work', null, null, 'ic')}${vcell('alarm', 'square', null, 'ic')}<div class="mid ${S.mid}">${MID[S.mid]()}</div>${vcell('mid', 'train', null, 'ic red', S.mid === 'train')}${vcell('mid', 'squad', null, 'ic red', S.mid === 'squad')}`
  + `${vcell('alarm', 'hands', null, 'ic')}${vcell('alarm', 'shelter', null, 'ic')}${vcell('mid', 'direct', null, 'ic red', S.mid === 'direct')}${held(vcell('attack', null, null, 'ic red'), 'allHome')}</div>`;
// E202
// E203
const sword = svg('<path d="M14 4l6-1-1 6-9 9-3-3zM7 15l-3 3 2 2 3-3"/>').replace('currentColor', 'var(--rr)'), scales = svg('<path d="M12 4v16M7 20h10M5 7h14M5 7l-3 6h6zM19 7l-3 6h6z"/>'), hands = svg('<path d="M3 11l4-4 4 2 3-2 4 4 3 0M7 13l3 3c1 1 2 1 3 0l4-4"/>').replace('currentColor', 'var(--rg)');
const PEOPLE = { Relations: ['Raiders', 'Rivals', 'Fortress'], Misfits: ['Natives', 'Outlaws', 'Bandits', 'Robbers'] };
const stances = (t) => `<div class="frame f6">${PEOPLE[t].map((n) => `<span class="lab two-l" style="grid-column:span ${t === 'Misfits' ? 1 : 3}">${n}<br><span style="color:var(--rr)">Foe</span></span>${t === 'Misfits' ? span(2, vcell('later', 'Bribe', null, 'two')) : ''}<div class="cells seg dim" style="grid-column:span 2;--n:3">${cell(sword, 'dim on')}${cell(scales, 'dim')}${cell(hands, 'dim')}</div>${vcell('later', 'check', null, '')}`).join('')}<p class="blurb" style="grid-column:span 6">${t === 'Misfits' ? 'Pick a bribe or a stance, then its ✓' : 'Pick a stance, then its ✓'} · not built yet</p></div>`;
const TOPCELL = { mute: () => vcell('mute'), pause: () => vcell('pause', null, null, '', FK.paused()), mail: () => vcell('mail', null, null, 'ic', S.tab === 'Mail') }; // E701
const topbar = (r) => `<div class="strip big">${SCR.top.map((c) => (TOPCELL[c] ? TOPCELL[c]() : cell(`<span class="t">${SVG[c]}</span>${fmt(r.store[c])}`))).join('')}</div>`; // E204
let acc = 0;
function render(force) { for (const k in ARGS) delete ARGS[k]; const r = read(); // E693
  const tb = topbar(r); if (tb !== S.lastTop) { topEl.innerHTML = tb; S.lastTop = tb; }
  if (r.result) { S.tab = null; S.ghost = null; const you = r.result.winner === 0; $('card').className = 'on'; $('card').innerHTML = `<h2>${EW.head[+!you]}</h2><p>${r.result.text}</p><div class="row">${vcell('new')}${vcell('copylog')}</div>`; $('panel').className = ''; return; }
  if (S.subject && (S.subject.kind === 'unit' ? units().indexOf(S.subject) < 0 : things().indexOf(S.subject) < 0)) S.subject = null;
  const html = page(r), card = cardText(r), sig = html + card + S.tab + rank(card) + base(r); if (!force && sig === S.last) return; S.last = sig;
  $('panel').innerHTML = html; $('panel').style.height = tall(S.tab) || !PANEL ? '' : PANEL + 'px'; $('panel').className = S.tab ? 'on' : ''; $('card').innerHTML = card; $('card').className = card && !S.tab ? 'on' : ''; // E205
  $('base').innerHTML = base(r); $('rank').innerHTML = rank(card); { const mb = document.querySelector('.warbase .mid'); FK.miniBox(S.war && S.mid === 'map' && mb ? mb.getBoundingClientRect() : null); } spdEl.className = `cells seg ${FK.paused() && !r.result && !S.tab ? 'on' : ''}`; spdEl.innerHTML = span([...D.speeds, 'new'].length, cell(WD.back.paused, 'dim')) + D.speeds.map((n) => vcell('speed', n, null, '', show.speed === n)).join('') + vcell('newgame', null, null, 'two', S.sure) + (FK.TEST ? vcell('fast', null, null, '', show.fast) + tab('Layers', 'Yard', 'yard') : '') + Object.keys(FK.HB.mix.names).map((c) => vcell('vol', c, null, 'two')).join(''); qaEl.className = S.qa ? 'on' : ''; if (S.qa) { const m = SCR.mold, [w] = FK.size(); qaEl.innerHTML = vcell('quick', null, null, 'ic red') + vcell('qclose', null, null, 'ic'); qaEl.style.left = Math.min(w - qaEl.offsetWidth - m.gap, Math.max(m.gap, S.qa.px - m.slot * P.half)) + 'px'; qaEl.style.top = S.qa.py - m.slot * P.half + 'px'; }
}
const argOf = (a) => ARGS[a] ?? (a === '' || a == null ? null : isNaN(a) ? a : Number(a));
function click(e) { const b = e.target.closest('[data-v]'); if (S.held) { S.held = false; return; } if (!b) return; const [verb, a, a2] = b.dataset.v.split('|'); if (verb !== 'newgame') S.sure = false;
  if (verb === 'tab') { FK.fire('event', 'tap', null); S.tab = S.tab === a ? null : a; if (S.tab !== 'Build') S.ghost = null; else { const [w, h] = FK.size(); hintAt(tileK(w * P.half, h * P.half)); } render(true); return; } act(verb, argOf(a), argOf(a2)); } // E730
FK.on('begin', () => { S.game = { ...S.opt }; FK.HZ.clear(); for (const id of S.opt.hz) FK.HZ.add(id); if (!FK.HZ.size) for (const [, id] of OPTS.hazard) if (FK.rng() < D.hazards.lot) FK.HZ.add(id); }); // E705
const qaEl = document.createElement('div'); qaEl.id = 'qa'; document.body.appendChild(qaEl);
for (const el of [ui, topEl, qaEl]) el.addEventListener('click', click);
let lpT = 0; const lpStop = () => clearTimeout(lpT); // E428
FK.on('rest', () => !!(S.tab && tall(S.tab)) || !!ECON.result()); let lpAt = null; addEventListener('pointerdown', () => { lpStop(); S.held = false; }, true); // E692
ui.addEventListener('pointerdown', (e) => { lpStop(); S.held = false; lpAt = { x: e.clientX, y: e.clientY }; const b = e.target.closest('[data-h]'); if (!b) return; const [verb, a, a2] = b.dataset.h.split('|'); lpT = setTimeout(() => { S.held = true; act(verb, argOf(a), argOf(a2)); }, D.touch.hold); });
for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) ui.addEventListener(ev, lpStop); ui.addEventListener('pointermove', (e) => { if (lpAt && Math.hypot(e.clientX - lpAt.x, e.clientY - lpAt.y) > D.touch.move) lpStop(); });
// E206
const canvas = document.getElementById('map');
const tileUnder = (px, py) => { const [cw, ch] = FK.size(), c = FK.cam, vx = c.x + (px - cw / 2) / c.z, vy = c.y + (py - ch / 2) / c.z, [sx, sy] = FK.fromBoard(vx, (vy + D.land * Math.cos(FK.A.rise * Math.PI / 180)) / Math.sin(FK.A.rise * Math.PI / 180)); return [Math.floor(sx / D.tile), Math.floor(sy / D.tile)]; };
const ghostTo = (px, py, tol = Math.max(P.tol.least, P.tol.zoom / FK.cam.z)) => { const g = S.ghost, [i, j] = tileUnder(px, py), [, n] = B[g.code], h = Math.floor(n * P.half); [g.i, g.j] = ECON.snap(ME, g.code, i - h, j - h, tol); g.why = ECON.placeWhy(ME, g.code, g.i, g.j); g.ok = !g.why; FK.dirty(); }; // E333
const inN = (v) => Math.max(0, Math.min(N - 1, v)), tileK = (px, py) => { const [i, j] = tileUnder(px, py).map(inN); return j * N + i; }, ij = (k) => ECON.at(k), fits = (g, k) => ECON.canPlace(g.code, ...ij(k));
const wallSnap = (a, k) => { if (a == null) return k; const [ai, aj] = ij(a), [i, j] = ij(k); return Math.abs(j - aj) * P.flat < Math.abs(i - ai) ? aj * N + i : Math.abs(i - ai) * P.flat < Math.abs(j - aj) ? j * N + ai : k; }; // E334
const wallSet = (g) => { let prev = null; g.cells = g.pts.flatMap((k) => { const run = prev == null ? [k] : ECON.wallLine(prev, k).filter((q) => q !== prev); prev = k; return run; }); g.bad = g.cells.filter((k) => !fits(g, k)).length; g.seal = null; FK.dirty(); };
const onMap = (k) => FK.toScreen(...FK.toView(...FK.tileMid(k), Math.max(D.land, FK.H[k])));
function wallHit(g, x, y) { const at = g.pts.map(onMap), i = at.findIndex(([a, b]) => Math.hypot(a - x, b - y) < P.hit); if (i >= 0) return { i }; let q = null; // E335
  for (const [c, d] of at) { if (q) { const [a, b] = q, L = Math.hypot(c - a, d - b), along = ((x - a) * (c - a) + (y - b) * (d - b)) / L; if (along > -P.hit && along < L + P.hit && Math.abs((x - a) * (d - b) - (y - b) * (c - a)) / L < P.hit) return { k0: tileK(x, y), pts0: g.pts.slice() }; } q = [c, d]; }
  return null; }
function wallDrag(d, x, y) { const g = S.ghost, k = tileK(x, y), [i0, j0] = ij(d.k0 ?? k), [di, dj] = ij(k).map((v, n) => v - [i0, j0][n]); if (d.i != null) g.pts[d.i] = wallSnap(g.pts[d.i - 1] ?? g.pts[d.i + 1], k); else g.pts = d.pts0.map((q) => { const [i, j] = ij(q); return inN(j + dj) * N + inN(i + di); }); wallSet(g); }
const PW = WD.place, ghostSay = (g) => { const name = ECON.nameOf(g.code); if (line(g.code)) return g.cells.length ? PW.pieces.replace('{n}', g.cells.length) + (g.bad ? PW.blocked.replace('{n}', g.bad) : '') : PW.lineStart.replace('{line}', name.toLowerCase()); return g.i < -50 ? PW.start.replace('{name}', name.toLowerCase()) : g.ok ? PW.ok.replace('{Name}', name) : g.why; }; // E726
function place(g) { const sel = FK.sel(), [first] = Object.keys(D.cost[g.code] || {}); // E336
  if (line(g.code)) { const r = ECON.lay(ME, g.code, g.cells); toast(r.built ? `${r.built} ${some(r.built, ECON.nameOf(g.code).toLowerCase())} going up${r.blocked ? `; ${r.blocked} blocked` : ''}${r.broke ? `; out of ${first}` : ''}` : r.broke ? `Not enough: ${costText(D.cost[g.code])} a piece` : 'Something is in the way'); g.pts = []; wallSet(g); return; }
  const t = ECON.plan(ME, g.code, g.i, g.j); if (!t) return toast(g.why || 'Not here'); ECON.autoBuilder(ME, t, isVil(sel) ? sel : null);
  const k = t.n + P.next[FK.SH[t.code].material], at = !ECON.capWhy(ME, g.code) && ECON.canPay(ME, D.cost[g.code] || {}) && D.ways.filter(([a, b]) => !a || !b).map(([a, b]) => [t.i + a * k, t.j + b * k]).find(([i, j]) => ECON.canPlace(g.code, i, j));
  if (at) { [g.i, g.j] = at; g.ok = true; g.why = ''; } else S.ghost = null; FK.dirty(); }
let drag = null, edge = null;
for (const ev of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) canvas.addEventListener(ev, (e) => { const g = S.ghost; if (!g) return; // E337
  if (ev === 'pointerdown') { const lift = P.lift * (e.pointerType !== 'mouse'); if (line(g.code)) drag = wallHit(g, e.clientX, e.clientY); else { const [, n] = B[g.code], [gx, gy] = g.i > -50 ? FK.toScreen(...FK.toView(...FK.toBoard((g.i + n * P.half) * D.tile, (g.j + n * P.half) * D.tile), D.land)) : [NaN, NaN], r = Math.max(P.lift, n * D.tile * FK.cam.z * P.grab); drag = !(g.i > -50) || Math.min(Math.hypot(e.clientX - gx, e.clientY - gy), Math.hypot(e.clientX - gx, e.clientY - lift - gy)) < r ? { lift } : null; } } if (!drag) return; // E700
  if (ev === 'pointerup' || ev === 'pointercancel') { drag = edge = null; render(true); } else if (line(g.code)) { if (ev === 'pointermove') wallDrag(drag, e.clientX, e.clientY); } else { edge = { x: e.clientX, y: e.clientY }; ghostTo(edge.x, edge.y - drag.lift); }
  e.stopImmediatePropagation(); }, true);
const tints = new WeakMap(), tinted = (c, col) => { const T = tints.get(c) || {}; if (!T[col]) { const t = Object.assign(document.createElement('canvas'), { width: c.width, height: c.height }), x = t.getContext('2d'); Object.assign(t, { ax: c.ax, ay: c.ay, q: c.q }); x.drawImage(c, 0, 0); x.globalCompositeOperation = 'source-atop'; x.globalAlpha = P.tint; x.fillStyle = col; x.fillRect(0, 0, t.width, t.height); T[col] = t; tints.set(c, T); } return T[col]; }; // E338
function drawSeal(ctx, g) { if (!g.seal || FK.K.t - g.sealT > D.seal.every) { g.seal = ECON.sealPath(ME, line(g.code) ? g.cells.filter((k) => fits(g, k)) : g.ok ? [g.j * N + g.i] : []); g.sealT = FK.K.t; } // E339
  const p = g.seal, h = FK.seatOf(ME); if (!p || !h) return; if (!p.length) return FK.tag(ctx, 'Sealed', ...FK.toScreen(h.vx, h.vy));
  ctx.strokeStyle = COL.rr; ctx.lineWidth = P.width.seal; ctx.setLineDash(P.dash.seal); ctx.beginPath(); p.forEach((k, n) => ctx[n ? 'lineTo' : 'moveTo'](...onMap(k))); ctx.stroke(); ctx.setLineDash([]); FK.tag(ctx, 'Open: a foe walks in', ...onMap(p.at(-1))); }
FK.on('draw', (ctx, s) => { const g = S.ghost; if (!g) return; const [, n] = B[g.code], T = D.tile, h = FK.H[Math.max(0, g.j) * N + Math.max(0, g.i)] ?? D.land, at = (sx, sy, z = h) => FK.toScreen(...FK.toView(...FK.toBoard(sx * T, sy * T), Math.max(D.land, z))); ctx.save(); // E340
  if (walled(g.code)) drawSeal(ctx, g);
  if (line(g.code)) { ctx.globalAlpha = P.tint; for (const k of g.cells) { const [i, j] = ij(k); ctx.fillStyle = fits(g, k) ? COL.rg : COL.rr; ctx.beginPath(); P.quad.forEach(([a, b], q) => ctx[q ? 'lineTo' : 'moveTo'](...at(i + a, j + b, FK.H[k]))); ctx.fill(); }
    ctx.globalAlpha = P.ghost; ctx.lineWidth = P.width.knob; ctx.setLineDash([]); g.pts.forEach((k, q) => { ctx.fillStyle = COL.rw; ctx.strokeStyle = q ? COL.ink : COL.rg; ctx.beginPath(); ctx.arc(...onMap(k), P.knob, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); }); }
  else if (g.i > -50) { const ci = g.i + n * P.half, cj = g.j + n * P.half, seg = (a, z) => { ctx.moveTo(...at(...a)); ctx.lineTo(...at(...z)); }; ctx.strokeStyle = COL.rb; ctx.lineWidth = P.width.guide; ctx.setLineDash(P.dash.guide); ctx.beginPath();
    for (const b of things()) if (b.kind === 'bld' && b.side === ME && !ECON.wallish(b)) { const mi = b.i + b.n * P.half, mj = b.j + b.n * P.half, pad = P.pad + (n + b.n) * P.half; if (Math.abs(mi - ci) >= P.guide || Math.abs(mj - cj) >= P.guide || (mi === ci && mj === cj)) continue; const q = pad * Math.SQRT1_2, di = Math.sign(ci - mi), dj = Math.sign(cj - mj); // E716
      if (mi - mj === ci - cj || mi + mj === ci + cj) seg([mi - di * q, mj - dj * q], [ci + di * q, cj + dj * q]); }
    ctx.stroke(); const sp = tinted(FK.bldSprite(g.code, SIDES[ME].col, s, ...FK.levelOf({ code: g.code, side: ME })), g.ok ? COL.rg : COL.rr), [gx, gy] = at(ci, cj); FK.tag(ctx, g.ok ? `${ECON.nameOf(g.code)} · ${costText(D.cost[g.code] || {})}` : g.why, gx, gy - sp.ay * s - P.lift * P.half); ctx.globalAlpha = P.ghost; FK.blit(sp, gx, gy, s); } // E699
  ctx.restore(); });
// E207
const hintAt = (k) => { S.hint = onB(k) && !under(k) ? suggest(k) || null : null; if (S.hint) S.group = Object.keys(GROUPS).find((g) => GROUPS[g].includes(S.hint)) || S.group; }; // E730
function suggest(k) { const G = D.suggest, [bx, by] = FK.tileMid(k), [ki, kj] = ECON.at(k), R = G.r * D.tile, sc = {}, far = (t) => Math.hypot(t.bx - bx, t.by - by), add = (c, v) => { if (c && D.cost[c] && !ECON.capWhy(ME, c)) sc[c] = (sc[c] || 0) + v; }; // E343
  const bought = FK.bought, camp = (y) => bought('Drop-off').find((c) => FK.SH[c].drop.includes(y)), [house] = bought('House'), [wall] = bought('Line'), [gate] = bought('Gate'), [field] = bought('Field');
  const mine = FK.blds().filter((t) => t.side === ME && far(t) < R), near = (y) => mine.some((t) => !FK.has(t, 'Seat') && (FK.SH[t.code].drop || []).includes(y));
  new Set(things().filter((t) => t.kind !== 'bld' && t.amount > 0 && far(t) < R * G.near).filter((t) => { const d = FK.dropFor({ bx: t.bx, by: t.by, side: ME }, ECON.yieldOf(t)); return !d || FK.dist(d, t) > G.dropR * D.tile; }).map((t) => camp(ECON.yieldOf(t)))).forEach((c) => add(c, G.drop));
  for (const b of mine) add(FK.has(b, 'House') ? house : FK.has(b, 'Field') ? (near('food') ? field : camp('food')) : FK.has(b, 'Spawn') ? bought('Spawn').find((c) => !count(c)) || b.code : FK.has(b, 'Line') ? gate : null, FK.has(b, 'Seat') ? G.keep : G.kin);
  const disc = []; for (let j = kj - G.area; j <= kj + G.area; j++) for (let i = ki - G.area; i <= ki + G.area; i++) if (Math.hypot(i - ki, j - kj) <= G.area) disc.push(j * N + i);
  const solid = disc.filter((q) => !FK.walkable(q)).length / disc.length; if (solid > G.choke.lo && solid < G.choke.hi && FK.walkable(k)) add(mine.some((t) => FK.has(t, 'Line')) ? gate : wall, G.chokeW);
  if (ECON.popCap(ME) - ECON.popOf(ME) <= G.room) add(house, G.short);
  const [best] = Object.keys(sc).sort((a, b) => sc[b] - sc[a]); return best || null; }
const under = (k) => things().find((t) => t.kind === 'bld' ? k % N >= t.i && k % N < t.i + t.n && Math.floor(k / N) >= t.j && Math.floor(k / N) < t.j + t.n : t.k === k && !t.deep);
FK.on('tap', (k, u, px, py) => {
  if (S.ghost) { if (!line(S.ghost.code)) { ghostTo(px, py); render(true); } else if (k >= 0) { S.ghost.pts.push(wallSnap(S.ghost.pts.at(-1), k)); wallSet(S.ghost); render(true); } return true; }
  if (S.qa) { S.qa = null; render(true); return true; }
  if (S.war) { aimSpot(k, u); S.aimT = performance.now(); FK.fire('event', 'tap', null); return true; }
  if (FK.paused() && !S.tab && !S.ghost) { FK.pause(false); return true; } // E706
  if (S.tab === 'Build' && !u && onB(k) && !under(k)) { hintAt(k); render(true); return true; } // E341
  const t = u || (onB(k) && FK.inSight(under(k)) ? under(k) : null) || null, now = performance.now(), L = S.tap, dbl = L && L.key === t && now - L.t < TO.dbl && (t || Math.hypot(px - L.px, py - L.py) < TO.slop); S.tap = { key: t, t: now, px, py }; // E429
  if (dbl) { if (t) { FK.select(null); S.subject = t; if (own(t) && FK.has(t, 'Seat')) S.tab = 'Hall'; render(true); } return true; }
  if (u && own(u)) { pickToggle(u); return true; }
  const P = FK.picked().filter(own); if (P.length) { if (t || onB(k)) { const sol = P.filter(isSoldier); if (WAR.order(P, t, k)) ECON.orderCost(ME, sol); } S.more = false; if (!P.some(isSoldier)) FK.select(null); render(true); return true; }
  if (!t) { const O = ordAt(px, py); if (O) FK.select(units().filter((v) => v.ord === O)); else if (onB(k)) S.qa = { k, px, py }; S.subject = null; render(true); return true; }
  if (t.kind === 'bld' && own(t) && !ECON.replantWhy(ME, t)) { ECON.replant(ME, t); return true; }
  if (t.kind === 'unit') FK.select(t); else { FK.select(null); S.subject = t; if (own(t) && FK.has(t, 'Seat')) S.tab = 'Hall'; } render(true); return true;
});
function pickToggle(u, hold) { const P = FK.picked(); FK.select(S.more && !hold ? (P.includes(u) ? P.filter((v) => v !== u) : [...P, u]) : [u]); S.more = S.more || !!hold; S.subject = null; FK.fire('event', 'pick', u); render(true); }
const ordAt = (px, py) => { let best = null, bd = TO.ord; for (const O of WAR.ORD) { const d = O.n ? Math.hypot(...onMap(O.k).map((v, n) => v - [px, py][n])) : Infinity; if (d < bd) [best, bd] = [O, d]; } return best; };
const boardAt = (px, py) => { const [bx, by] = FK.tileMid(tileK(px, py)); return { bx, by }; }, aimK = () => (!S.aim ? null : S.aim.t ? FK.tileAt(S.aim.t.bx, S.aim.t.by) : S.aim.k), toolSet = () => { const P = FK.picked().filter(isSoldier); return P.length ? P : WAR.sendable(); };
const onB = (k) => k !== -1; // E433
function aimSpot(k, u) { const t = u || (onB(k) && FK.inSight(under(k)) ? under(k) : null); S.aim = { k: onB(k) ? k : S.aim.k, t: t && !own(t) && (t.kind === 'unit' || t.kind === 'bld' || isFind(t)) ? t : null }; } // E430
const aimNear = (px, py) => S.war && S.aim && Math.hypot(...aimAt().map((v, n) => v - [px, py][n])) < HUD.aim, aimAt = () => (S.aim.t ? FK.toScreen(S.aim.t.vx, S.aim.t.vy) : onMap(S.aim.k));
function aimColor() { const t = S.aim.t, C = FK.C; if (t && t.side === ME) return C.green; if (t && WAR.isFoe(ME, t)) return C.red; if (t && SIDES[t.side] && WAR.friendly(ME, t.side)) return C.blue; return WAR.foesNear(boardAt(...aimAt()), HUD.danger).length ? C.red : C.white; }
function boxPick(p) { const [x0, x1] = [p.x0, p.x].sort((a, b) => a - b), [y0, y1] = [p.y0, p.y].sort((a, b) => a - b), mine = units().filter((u) => (isSoldier(u) || isVil(u)) && !u.gone && ((x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1)(...FK.toScreen(u.vx, u.vy)));
  if (!mine.length) return toast(WO.boxNone); FK.select(mine); S.more = true; S.subject = null; render(true); }
FK.on('press', (p) => { if (S.qa) { S.qa = null; p.eat = true; render(true); } if (S.tool === 'choke' && !S.ghost) { p.mode = 'line'; S.line = p; } }); // E431
FK.on('hold', (p, k, u) => { if (S.ghost) return; if (aimNear(p.x0, p.y0)) { p.mode = 'ret'; S.drag = true; } else if (u && own(u) && !S.war) { pickToggle(u, true); p.mode = 'done'; } });
FK.on('drag', (p) => { if (p.mode === 'ret') aimSpot(...FK.hitAt(p.x, p.y)); });
FK.on('drop', (p, cancel) => { S.drag = false; S.line = null; if (cancel) return; if (p.mode === 'line') { S.tool = null; WAR.chokeAt(boardAt(p.x0, p.y0), boardAt(p.x, p.y), toolSet()); }
  else if (p.mode === 'box') { if (Math.max(Math.abs(p.x - p.x0), Math.abs(p.y - p.y0)) < TO.box) FK.tap(p.x, p.y); else boxPick(p); } render(true); });
FK.on('say', (msg, m) => say(msg, m && typeof m === 'object' ? m : {}));
const msnSay = (slot) => { const m = WAR.MS[slot]; return !m || m.end ? '' : m.st === 'act' ? `${Math.round(m.odds * SAY.percent)}%` : m.ord.eta ? clock(m.ord.eta) : ''; };
const waveLine = (p) => { const [first, more] = WO.wave; return p.waves.map((w, i) => { const [c, other] = new Set(w.list.map((r) => FK.SH[r.u.code].class)); return (i ? more : first).replace('{n}', w.list.length).replace('{who}', other ? WO.soldiers : c.toLowerCase()).replace('{t}', clock(w.t)); }).join(WD.list.and); };
const etaNow = () => { const F = WAR.free(), k = aimK(), key = [k, F.length, Math.floor(FK.K.t / HUD.settle)].join(); if (!F.length) return null; if (!S.eta || S.eta.key !== key) S.eta = { key, v: WAR.etaOf(F, k, WAR.routeK(FK.tileAt(...Object.values(WAR.centreOf(F))), k, F.at(-1))) }; return S.eta.v; };
FK.on('draw', (ctx, s) => { if (S.line) { const p = S.line, a = boardAt(p.x0, p.y0), b = boardAt(p.x, p.y), T0 = FK.SPRITE.touch; ctx.save(); ctx.strokeStyle = ctx.fillStyle = FK.C.gold; ctx.lineWidth = T0.choke; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p.x0, p.y0); ctx.lineTo(p.x, p.y); ctx.stroke(); // E432
    ctx.font = FK.mapFont(); ctx.textAlign = 'center'; ctx.fillText(WO.choke.find((w) => w.includes('across')).replace('{n}', Math.max(D.choke.min, Math.round(FK.dist(b, a) / D.tile / D.ranks.gap))), (p.x0 + p.x) * P.half, (p.y0 + p.y) * P.half - T0.up); ctx.restore(); }
  if (!S.war || !S.aim) return; if (S.aim.t && S.aim.t.gone) S.aim.t = null;
  const [x, y] = aimAt(), now = performance.now(), [r0, rz, rp] = RT.r, L = now - S.firedT < RT.settle * TO.ms, R0 = Math.max(r0, rz * s + rp), R = L ? R0 * RT.fired : R0, t = (now - S.aimT) / TO.ms, eta = etaNow(), seg = (a, b, c, d) => { ctx.moveTo(a, b); ctx.lineTo(c, d); }, turn = FK.SPRITE.marks.arc;
  ctx.save(); ctx.strokeStyle = ctx.fillStyle = L ? FK.C.green : aimColor(); ctx.lineWidth = RT.line;
  if (S.drag) { const [ga, gp] = RT.glow; ctx.save(); ctx.globalAlpha = ga; ctx.beginPath(); ctx.arc(x, y, R + gp, ...turn); ctx.fill(); ctx.restore(); }
  const q = R * RT.bracket; ctx.beginPath(); for (const a of [-R, R]) for (const b of [-R, R]) { seg(x + a, y + b - Math.sign(b) * q, x + a, y + b); seg(x + a, y + b, x + a - Math.sign(a) * q, y + b); } ctx.stroke();
  if (!L) { const [beat, fall, al, from, out] = RT.sonar, g = Math.ceil(t * beat) - t * beat, [csp, at, len, wid, n] = RT.chev, [ssp, ins] = RT.scan, [, whole] = turn; ctx.save(); ctx.globalAlpha = g ** fall * al; ctx.beginPath(); ctx.arc(x, y, from + (R - g * R) * out, ...turn); ctx.stroke(); ctx.restore(); ctx.beginPath();
    for (const i of Array(n).keys()) { const a = t * csp + (i * whole) / n, c = Math.cos(a), e = Math.sin(a), rot = (u, v) => [x + u * c - v * e, y + u * e + v * c], tip = [x + (R * at + len) * c, y + (R * at + len) * e]; seg(...rot(R * at, -wid), ...tip); seg(...rot(R * at, wid), ...tip); }
    const sy = y + Math.sin(t * ssp) * (R - ins); seg(x - R + ins, sy, x + R - ins, sy); ctx.stroke(); }
  const [out, g] = RT.arm; ctx.beginPath(); seg(x - R - out, y, x - g, y); seg(x + g, y, x + R + out, y); seg(x, y - R - out, x, y - g); seg(x, y + g, x, y + R + out); ctx.stroke();
  const [bx, by] = FK.tileMid(aimK()); ctx.font = FK.mapFont(); ctx.textAlign = 'center'; ctx.fillText(eta ? `${clock(eta)} · ${coord(bx, by)}` : coord(bx, by), x, y - R - RT.label); ctx.restore(); });
FK.on('event', (e, t, n) => { if (e === 'short') toast('Not enough to pay for repairs'); const w = NEWS[e]; if (w) toast((Array.isArray(w) ? w[n] : w).replace('{n}', n).replace('{m}', n * D.flock.mutton).replace('{at}', t && coord(t.bx, t.by))); }); // E359
FK.on('tick', (dt) => { const real = dt / (show.fast ? D.fast : 1); if (edge && drag && S.ghost) { const [w, h] = FK.size(), vx = (edge.x > w - P.edge) - (edge.x < P.edge), vy = (edge.y > h - P.edge) - (edge.y < P.edge), f = (P.scroll * real) / FK.cam.z; if (vx || vy) { FK.cam.x += vx * f; FK.cam.y += vy * f; FK.keepOn(); ghostTo(edge.x, edge.y - drag.lift); } } // E342
  acc += real; if (S.toastT > 0) { S.toastT -= real; if (S.toastT <= 0) toastEl.className = ''; } if (acc >= D.beatUi) { acc = 0; render(); } });
// E635
const MS = D.mail, TL = D.tell, MWD = WD.mail, PWD = WD.peace, CIVS = WD.civs, ML = D.milestones, mail = [], post = [], hush = (x) => x.replace(/[\d,.]+/g, '#'), [BEAT] = D.peaceBeat, seen = (at) => FK.inSight(at, ME), [, , ALLY] = fromBook('sides').stances; let newsT = -Infinity, newsI = null;
const dirOf = (a, b) => { const n = MWD.dirs.length; return MWD.dirs[(Math.round((Math.atan2(b.by - a.by, b.bx - a.bx) / (Math.PI + Math.PI)) * n) + n) % n]; }; // E636
function reach(text, m) { const at = m.at, h = FK.seatOf(ME); if (!at || m.told || seen(at)) return {}; const within = (L, r) => L.some((t) => !t.gone && FK.dist(t, at) < r * D.tile), blds = (side) => FK.blds().filter((t) => t.side === side), mine = blds(ME); // E637
  if (m.cls === MWD.urgent && within([...mine, ...FK.units().filter((u) => u.side === ME)], TL.hear * TL.gun ** (SIDES[ME].age >= TL.gunAge))) return { text: MWD.fight.replace('{dir}', dirOf(h || at, at)) };
  const ally = D.players.some((q) => q !== ME && WAR.stance(ME, q) === ALLY && within(blds(q), TL.near)), need = within(mine, TL.near) ? TL.levels.near : within(mine, TL.far) ? TL.levels.far : ally ? TL.levels.ally : TL.levels.all, lvl = FK.stat('', ME, 'news');
  if (lvl < need || !h) return null; const L = FK.wayLen(FK.tileAt(at.bx, at.by), h); return { delay: (L < Infinity ? L : FK.dist(h, at)) / D.upm / D.speed[lvl >= TL.ridesAt ? TL.ride : TL.foot] }; }
function say(text, m = {}) { if (S.tab === 'Start' && !m.told) return void post.push({ t: FK.K.t, text, m: { ...m, told: true } }); // E707
  const N = reach(text, m); if (!N) return; if (N.delay > BEAT) return void post.push({ t: FK.K.t + N.delay, text, m: { ...m, told: true, why: MWD.post } }); if (N.text) { text = N.text; m = { ...m, at: null }; } // E638
  const grp = m.grp || 'reply', key = hush(text), same = mail.find((x) => x.grp === grp && x.key === key && FK.K.t - x.t < MS.merge), quiet = MWD.quiet.includes(m.cls);
  if (same) Object.assign(same, { t: FK.K.t, text }).times.push(FK.K.t); else { mail.unshift({ text, grp, key, cls: m.cls || '', why: m.why || '', at: m.at ? { bx: m.at.bx, by: m.at.by } : null, times: [FK.K.t], t: FK.K.t }); mail.length = Math.min(mail.length, MS.keep); }
  if (!quiet) toast(same ? `${text} ×${same.times.length}` : text, MS.secs, m.at ? { bx: m.at.bx, by: m.at.by } : null); }
function postTick() { if (S.tab === 'Start') return; const due = post.filter((x) => x.t <= FK.K.t); if (!due.length) return; post.splice(null, post.length, ...post.filter((x) => x.t > FK.K.t)); for (const x of due) say(x.text, x.m); } // E639
function newsTick() { if (FK.K.t - newsT < TL.every || FK.K.t < TL.after) return; newsT = FK.K.t; const L = WD.world[SIDES[ME].age] || WD.world.at(-1); say(L[++newsI % L.length], { grp: 'chronicle', cls: 'news' }); } // E640
// E641
const PEOPLES = () => Object.keys(CIVS).filter((k) => CIVS[k].name), civOf = (i) => PEOPLES().find((k) => CIVS[k].name === OPTS.civ[i].find(String)), civLine = (k) => { const u = Object.keys(FK.SH).find((c) => FK.SH[c].civ === k); return !u ? '' : CIVS.blurb.replace('{unit}', FK.SH[u].name).replace('{base}', FK.SH[FK.SH[u].replaces].name.toLowerCase()).replace('{wonder}', CIVS[k].wonder).replace('{hall}', CIVS[k].hall); }; /* Base's two lines; the history stays in the Guide (E718) */
// E642
const MSW = WD.milestones, TIP = WD.tips, LEARN = 'fk.learned', learned = {}, mine = (tick) => FK.blds().filter((t) => t.side === ME && FK.has(t, tick) && t.done >= true), knows = (k) => SIDES[ME].techs.has(TECHOF[k]), army = () => WAR.armyOf(ME), marching = () => army().filter((u) => u.ord); let shown = new Set(), slipT = -Infinity, mustered = false, tipNow = '';
try { Object.assign(learned, JSON.parse(localStorage.getItem(LEARN) || '{}')); } catch (e) {}
const L = (k) => (learned[k] || []).length >= ML.learned, learn = (k) => { if (L(k)) return; learned[k] = [...(learned[k] || []), Math.round(FK.K.t)]; try { localStorage.setItem(LEARN, JSON.stringify(learned)); } catch (e) {} }; // E643
function learnAct(verb, a, b) { if (verb === 'train') learn('train:' + a); else if (verb === 'job' && b > null) { learn('job'); learn('job:' + a); } else if (verb === 'build' && S.ghost) learn('build:' + S.ghost.code); else if (verb === 'ageUp') learn('age'); } // E644
const HOME = () => FK.ticked('House').find((c) => !FK.SH[c].ticks.includes('Seat')), slowed = (y) => FK.units().find((u) => u.side === ME && FK.footing(u)[y] > ML[y]), msFill = (x, u) => { const f = u ? FK.pace(u) / FK.stat(u.code, ME, 'spd') : null; return x.replace('{room}', D.pop[HOME()]).replace('{pct}', Math.round(SAY.percent - f * SAY.percent)).replace('{spd}', Math.round(f * SAY.percent) / SAY.percent); };
const MS_TEST = { house: () => mine('House').some((t) => !FK.has(t, 'Seat')), field: () => mine('Field').length, drop: () => mine('Drop-off').some((t) => !FK.has(t, 'Seat')), soldier: () => army().length, squad: () => mustered, age: () => SIDES[ME].age, // E645
  mud: () => marching().some((u) => FK.footing(u).mud > ML.mud) && !knows('roads'), snow: () => !!slowed('snow') && !knows('snowclear'), ice: () => FK.K.t - slipT < ML.slip, hungry: () => SIDES[ME].hungry,
  fire: () => FK.things().some((t) => t.side === ME && t.fire > null), rout: () => FK.units().some((u) => u.side === ME && u.job === 'rout'), trade: () => FK.units().some((u) => u.side === ME && FK.has(u, 'Trade')), winter: () => FK.season() === D.health.winter };
const goldTight = () => { const s = SIDES[ME].store; return s.gold < ML.gold && ['wood', 'stone', 'food'].some((y) => s[y] > ML.full); }; // E646
function advise() { const s = SIDES[ME], h = FK.seatOf(ME), V = ECON.villagersOf(ME), on = (y) => (ECON.jobs(ME)[y] || null), idle = V.filter((u) => !u.job || u.job === 'idle').length, [spear] = FK.kinds('Foot'), bar = Object.keys(D.trains).find((c) => D.trains[c].includes(FK.SH[spear].class)), [W0, W1, W2] = ML.wood, [S0, S1] = ML.spear, [D0, D1] = ML.deficit, [vil] = FK.trains(h ? h.code : ''); if (!h) return ''; // E647
  if (ECON.popOf(ME) >= ECON.popCap(ME) && !L('build:' + HOME())) return TIP.full;
  if (V.length < ML.villagers && !(h.q || []).length && ECON.canPay(ME, D.cost[vil]) && !L('train:' + vil)) return TIP.more;
  if (V.length >= W0 && (!on('wood') || (s.store.wood < W1 && on('wood') < W2)) && !L('job:wood')) return TIP.wood;
  if (idle && FK.K.t > ML.idle && !L('job')) return TIP.idle.replace('{n}', idle);
  if (!mine('Spawn').some((t) => t.code === bar) && FK.K.t > ML.barracks && !L('build:' + bar)) return TIP.barracks;
  if (mine('Spawn').some((t) => t.code === bar) && army().length < S0 && FK.K.t < S1 && !L('train:' + spear)) return TIP.spear;
  if (!s.age && !s.aging && V.length >= ML.age && !L('age')) return TIP.next;
  if (s.hungry) return TIP.hungry; const net = ECON.netOf(ME, 'food');
  if (FK.K.t > D0 && net < null && s.store.food < -net * D1) return TIP.deficit.replace('{n}', Math.round(-net));
  if (goldTight() && !L('trade')) return mine('Trade').length ? TIP.sell : TIP.gold;
  if (FK.things().some((t) => t.side === ME && t.fire > null)) return TIP.fire;
  if (FK.units().some((u) => u.side === ME && u.sick > FK.K.t) && !mine('Heal').length) return TIP.sick;
  if (!on('gold') && s.age && !L('job:gold')) return TIP.goldjob; return ''; }
function lessonTick() { if (ECON.result() || !FK.seatOf(ME)) return; const tip = advise(); if (tip && tip !== tipNow) say(tip.replace(/^!/, ''), { grp: 'advice', cls: tip.startsWith('!') ? MWD.urgent : 'tip' }); tipNow = tip; // E648
  for (const id in MS_TEST) if (!shown.has(id) && MS_TEST[id]()) { shown.add(id); const [line] = MSW[id]; say(msFill(line, id === 'mud' ? marching().find((u) => FK.footing(u).mud > ML.mud) : slowed(id)), { grp: 'lesson', cls: 'good' }); return; } }
FK.on('event', (e) => { if (e === 'slip') slipT = FK.K.t; if (e === 'mustered') mustered = true; });
FK.on('start', () => { mail.length = post.length = newsI = null; newsT = -Infinity; shown = new Set(); slipT = -Infinity; mustered = false; tipNow = ''; });
FK.on('tick', () => { if (FK.every(D.peaceBeat)) { postTick(); newsTick(); } if (FK.every(D.lessonBeat)) lessonTick(); });
// E208
let PANEL = 0; function sizePanel() { const el = $('panel'), keep = S.tab; PANEL = 0; let h = 0; const keepH = S.htab; for (const t of Object.keys(SCREENS)) if (!tall(t)) for (const g of t === 'Build' ? Object.keys(GROUPS) : [S.group]) { const kg = S.group; S.tab = t; S.group = g; render(true); h = Math.max(h, el.offsetHeight); S.group = kg; } S.htab = keepH; PANEL = h; S.tab = keep; render(true); } // E209
addEventListener('resize', sizePanel); let sized = false; // E210
FK.on('start', () => { if (S.tab === 'Start' || S.tab === 'Back') FK.pause(true); if (!sized) { sized = true; (document.fonts ? document.fonts.ready : Promise.resolve()).then(sizePanel); } Object.assign(S, { subject: null, ghost: null, aim: null, qa: null, tool: null, more: false, tap: null, line: null, eta: null, last: '' }); const h = FK.seatOf(ME); if (h) { const [cw] = FK.size(); FK.cam.x = h.vx; FK.cam.y = h.vy; FK.cam.z = (cw * D.openShare) / (h.n * D.tile); FK.keepOn(); } render(true); }); // E211
$('ver').textContent = 'v' + D.version; document.title = 'First Keep v' + D.version; // E212
// E670
const WT = fromBook('words').start, LOG = { rows: [] }, TAPS = (() => { try { return JSON.parse(localStorage.getItem(D.log.taps)) || {}; } catch (e) { return {}; } })();
function tapCount(verb, dim) { const t = TAPS[verb] || (TAPS[verb] = [null, null]); t[+dim]++; try { localStorage.setItem(D.log.taps, JSON.stringify(TAPS)); } catch (e) {} }
FK.on('tick', () => { if (!FK.every([D.log.row, null])) return; const SD = FK.SIDES, soldier = (u, p) => u.side === p && FK.has(u, 'Fight') && !FK.has(u, 'Gather'); // E671
  LOG.rows.push({ m: Math.round(FK.K.t / D.log.row), s: D.players.map((p) => (ECON.fell(p) ? null : [SD[p].age, ECON.villagersOf(p).length, FK.units().filter((u) => soldier(u, p)).length, ...ORDER.map((y) => Math.round(SD[p].store[y] || null))])) }); });
const logText = () => JSON.stringify({ version: D.version, seed: FK.seed(), land: FK.land(), cols: ['age', 'villagers', 'soldiers', ...ORDER], rows: LOG.rows, mail: mail.filter((m) => m.grp === 'war' || m.grp === 'realm').map((m) => [clock(m.t), m.text]) });
function copyLog() { const t = logText(), ok = () => say(WT.copied), fall = () => { const a = Object.assign(document.createElement('textarea'), { value: t }); document.body.append(a); a.select(); const done = document.execCommand && document.execCommand('copy'); a.remove(); done ? ok() : say(WT.copyFail); }; // E672
  try { navigator.clipboard.writeText(t).then(ok, fall); } catch (e) { fall(); } }
FK.on('start', () => { LOG.rows = []; });
FK.on('save', (X) => { X.menu = { mail, post, newsI, newsT, shown, slipT, mustered, tipNow, opt: S.opt, game: S.game, log: LOG.rows }; }); // E673
FK.on('load', ({ menu: M }) => { FK.refill(mail, M.mail); FK.refill(post, M.post); ({ newsI, newsT, slipT, mustered, tipNow, shown } = M); Object.assign(S.opt, M.opt); S.game = M.game || { ...S.opt }; LOG.rows = M.log; S.tab = null; render(true); });
// E675
const GW = WD.guidebook, TB = BOOKS.tech, TV = (c) => TB[c].value, lines = (t) => [...new Set(Object.keys(TB).filter((c) => TV(c).at === t.code && (!TV(c).civ || TV(c).civ === SIDES[ME].civ)).map((c) => TV(c).line))].map((L) => ECON.nextStep(ME, Object.keys(TB).find((c) => TV(c).at === t.code && TV(c).line === L))), // E740
    SN = (c) => FK.SH[c].name, [AGE0] = D.ages, ageOf = (c) => FK.SH[c].age || D.ages[D.bldAge[c]] || AGE0, secs = (t) => (t ? t + GW.secs : '');
const homesOf = (c) => Object.keys(D.trains).filter((b) => FK.trains(b).includes(FK.SH[c].replaces || c)), homeOf = (c) => { const [h] = homesOf(c); return h; }, whyOf = (c) => WD.why[GW.key[c] || FK.SH[c].look], techWhy = (c) => WD.why['tech:' + TB[c].key] ?? WD.why[TB[c].key]; // E676
const fill = (s) => s.replace(/\{(\w+):([^}]+)\}/g, (_, k, p) => (k === 'D' ? p.split('.').reduce((o, x) => o[x], D) : k === 'S' ? SN(p) : k === 'J' ? WD[p] : Object.keys(TB).filter((c) => TV(c).fx.some((f) => f.s === p)).map((c) => TB[c].name).join(WD.list.and))); // E677
function guide() { // E678
  const T = Object.keys(TB).filter((c) => TV(c).at), UN = Object.keys(U).filter((c) => D.cost[c]), aged = (c, i) => D.ages.indexOf(ageOf(c)) === i, names = (L) => L.map((c) => TB[c].name);
  const buildings = Object.keys(B).map((c) => ({ id: c, name: SN(c), menu: Object.keys(SCR.tabs).find((m) => SCR.tabs[m].includes(c)) || GW.off[c], age: ageOf(c), cost: costText(D.cost[c]), secs: secs(D.buildTime[c]), squares: FK.ref(FK.SH[c].size) + GW.by + FK.ref(FK.SH[c].size),
    trains: UN.filter((u) => !FK.SH[u].civ && homeOf(u) === c).map(SN), research: names(T.filter((t) => TV(t).at === c)), why: whyOf(c) }));
  const units = UN.map((c) => { const s = FK.statRow(c, null), h = homesOf(c), e = FK.SH[c]; return { id: c, name: SN(c), at: h.length ? h.map(SN).join(WD.list.and) : GW.at, age: ageOf(c), cost: costText(D.cost[c]), secs: secs(D.train[c]), hp: s.hp, dmg: s.atk, rng: s.rng, spd: FK.ref(e.pace), civ: e.civ ? CIVS[e.civ].name : '', replaces: e.replaces ? SN(e.replaces) : '',
    beats: Object.entries(s.vs || {}).map(([k, m]) => k + GW.beats.times + m).concat(s.bld && s.bld !== D.bases.bld ? [GW.beats.bld + GW.beats.times + s.bld] : [], s.bonly ? [GW.beats.only] : []),
    tiers: T.filter((t) => (TV(t).rank || {}).k === c).map((t) => `${TV(t).rank.name} (${TB[t].name})`), why: whyOf(c) }; });
  const techs = T.map((c) => { const v = TV(c); return { id: c, name: TB[c].name, at: SN(v.at), age: D.ages[v.age], line: v.line, when: v.when, w: v.w, need: names(ECON.needsOf(c)).join(WD.list.and), cost: costText(v.cost), secs: secs(v.time), why: techWhy(c) }; });
  const ages = D.ages.map((name, i) => ({ id: 'age' + i, name, cost: i ? costText(D.age.cost[i]) : GW.start, secs: secs(D.age.time[i]), why: WD.why['age' + i],
    opens: { buildings: Object.keys(B).filter((c) => aged(c, i)).map(SN), units: UN.filter((c) => !FK.SH[c].civ && aged(c, i)).map(SN), research: names(T.filter((c) => TV(c).age === i)) } }));
  const civs = PEOPLES().map((k) => { const u = Object.keys(FK.SH).find((c) => FK.SH[c].civ === k); return { id: k, name: CIVS[k].name, unit: SN(u), replaces: SN(FK.SH[u].replaces), wonder: CIVS[k].wonder, why: WD.why['bonus:' + k], wwhy: WD.why['wonder:' + k], uwhy: whyOf(u) }; });
  const finds = Object.keys(D.finds.rows).map((c) => ({ id: c, name: SN(c), why: whyOf(c) }));
  return { buildings, units, techs, ages, civs, finds, rules: Object.entries(WD.guide).map(([when, [then, why]]) => ({ when: fill(when), then: fill(then), why: fill(why) })) };
}
const yearOf = (w) => { const s = String(w || ''), [, bc] = s.match(/([\d,]+)\s*BC/) || [], [, ad] = s.match(/(\d+)/) || []; return !w ? Infinity : bc ? -parseInt(bc.replace(/,/g, '')) : ad ? parseInt(ad) : GW.eras[s] || Infinity; }; // E679
const hist = () => guide().techs.filter((t) => t.when).map((t) => ({ ...t, y: yearOf(t.when) })).sort((a, b) => a.y - b.y), histText = (t) => `${[t.name, t.when, t.line].join(WD.list.dot)}, ${t.at}. ${t.why || ''}`;
function guideMd() { // E680
  const g = guide(), M = GW.md, L = WD.list, cell = (s) => String(s || '-').replace(/\|/g, '/'), then = (a, t) => [a, t].filter(Boolean).join(L.and), opens = (o) => [o.buildings, o.units, o.research].map((x) => x.join(L.and)).filter(Boolean).join('; ');
  const table = ([head, ...cols], rows) => ['', `## ${head}`, '', `| ${cols.join(' | ')} |`, `|${cols.map(() => '---|').join('')}`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)];
  return [M.title.replace('{v}', D.version), '', M.lede,
    ...table(M.ages, g.ages.map((a) => [a.name, then(a.cost, a.secs), opens(a.opens), a.why])),
    ...table(M.civs, g.civs.map((c) => [c.name, `${c.unit} (${M.for} ${c.replaces})`, c.wonder, [c.why, c.uwhy, c.wwhy].join(' ')])),
    ...table(M.buildings, g.buildings.map((b) => [b.name, b.menu, b.age, then(b.cost, b.secs), [b.trains.length ? `${M.trains} ${b.trains.join(L.and)}` : '', b.research.length ? `${M.research} ${b.research.join(L.and)}` : ''].filter(Boolean).join('; '), b.why])),
    ...table(M.units, g.units.map((u) => [u.name + (u.civ ? ` (${u.civ})` : ''), u.at, u.age, then(u.cost, u.secs), u.hp, u.beats.join(L.and), u.tiers.join(L.and), u.why])),
    ...table(M.techs, g.techs.map((t) => [t.name, t.at, t.age, t.need, then(t.cost, t.secs), t.why])),
    ...table(M.finds, g.finds.map((f) => [f.name, f.why])), ...table(M.rules, g.rules.map((r) => [r.when, r.then, r.why]))].join('\n');
}
const second = ([, x]) => x;
return { scen: () => second(OPTS.scen[S.opt.scen]), daily: () => second(OPTS.daily[S.opt.daily]), log: LOG, logText, copyLog, TAPS, clock, read, act, VERBS, S, render, SCR, fmt, plural, some, orList, slowPct, coord, ledgerLine, say, mail, post, reach, dirOf, advise, MS_TEST, learned, civLine, guide, hist, histText, guideMd };
})();
