'use strict';
// First Keep v100 · menu.js (floor 8): everything on the glass. Lives alone; it reads the world through one function, read(), and acts through one, act(verb, arg), backed by VERBS, where every verb carries its own whyNot. A dim button never runs: it says why. One cell mold (slot 44, gap 6), the dictionary's fonts.
window.MENU = (() => {
const { D, B, U, SIDES, N, show } = FK, things = FK.things, units = FK.units;
// its numbers live in books/measure.js (D); nothing is typed here
const LAYERS = [['G', 'Grid'], ['Z', 'Zones'], ['T', 'Things'], ['R', 'Rim'], ['B', 'Buildings'], ['U', 'Units'], ['K', 'Climate'], ['V', 'View']]; // the codes and their floors; Lock is a mark for us (no floor is locked yet)
const GROUPS = { Home: ['BTC1', 'BR1', 'BR2'], Land: ['BCL1', 'BCL3', 'BCL2', 'BCL4', 'BI1', 'BI4', 'BCT2', 'BI2', 'BI3'], War: ['BM1', 'BM2', 'BM3', 'BM4'], Walls: ['BW1', 'BW2', 'BW3', 'BW4', 'BF5'], Trade: ['BCR1', 'BCT1', 'BCR2', 'BI6'], Culture: ['BP1', 'BP2', 'BP3', 'BP4', 'BP5', 'BP6', 'BP7', 'BP8', 'BP9', 'BP10'] }; // Albert's six tabs; a building shows once econ prices it, a tab once it holds one
const built = (g) => GROUPS[g].filter((c) => D.cost[c]);
const OPTS = { // the new game's choices: the first is the label's row in Albert's template; built ones set the game, the rest wait (dim, they say why)
  diff: [['Easy'], ['Normal'], ['Hard']], len: [['Conquest', 0], ['15 min', 900], ['30 min', 1800], ['60 min', 3600]], scen: [['Open'], ['Siege'], ['Silk Road'], ['Last Keep']],
  world: [['Real'], ['Fantasy']], fog: [['Off', false], ['On', true]], tension: [['Winner'], ['Diplomacy']], daily: [['Off', false], ['On', true]],
  civ: [['Roman'], ['Han'], ['Persian'], ['Mongol'], ['Maurya'], ['Mali']], hazard: [['Hardest'], ['Famine'], ['Weather'], ['Drought'], ['Outlaws'], ['Plague']] };
const BUILT = { len: 1, fog: 1, daily: 1 }; // which choices are floors yet
const ICON = { food: '🍖', wood: '🪵', gold: '🪙', stone: '🪨', iron: '⛓' };
const ORDER = ['food', 'wood', 'stone', 'gold', 'iron'], NAME = { food: 'Food', wood: 'Wood', stone: 'Stone', gold: 'Gold', iron: 'Iron' }; // the base's columns, Albert's template
// the base's icons: one 24-unit box each, line icons in the cell's colour, finds in their own
const svg = (body, fill = 'none') => `<svg viewBox="0 0 24 24" width="22" height="22" fill="${fill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const SVG = {
  yard: svg('<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>'),
  war: svg('<path d="M4 21V5h3v3h3V5h4v3h3V5h3v16zM10 21v-5h4v5"/>'),
  people: svg('<circle cx="15" cy="8" r="4" fill="currentColor"/><path d="M8 21c0-4 3-6 7-6s7 2 7 6z" fill="currentColor"/><path d="M2 9h6M5 6v6"/>'),
  build: svg('<path d="M4 20l9-9M11 4l6 1 3 3-1 3-3-1-3 3-3-3 3-3z" fill="currentColor"/>'),
  food: svg('<path d="M12 9c0-3 2-5 5-6" style="stroke:var(--rg)"/><circle cx="8" cy="15" r="4.5" style="fill:var(--food);stroke:none"/><circle cx="16" cy="15" r="4.5" style="fill:var(--food);stroke:none"/><circle cx="12" cy="10.5" r="4.5" style="fill:var(--food);stroke:var(--b2);stroke-width:1.5"/>'), // the resources in their colours (COLORS.md)
  wood: svg('<rect x="2" y="8" width="19" height="8" rx="4" style="fill:var(--wood);stroke:none"/><circle cx="17" cy="12" r="3.2" style="fill:color-mix(in srgb,var(--wood) 45%,var(--rw));stroke:none"/><circle cx="17" cy="12" r="1" style="fill:var(--wood);stroke:none"/>'),
  stone: svg('<path d="M3 9l7-4 10 3-1 10-9 3-6-5z" style="fill:var(--stone);stroke:var(--b3);stroke-width:1.5"/><path d="M10 5l1 8 8-5M11 13l-1 8" style="stroke:var(--b3);stroke-width:1.5"/>'),
  gold: svg('<circle cx="12" cy="12" r="9" style="fill:var(--gold);stroke:none"/><circle cx="12" cy="12" r="5.5" style="fill:none;stroke:var(--f2);stroke-width:2"/>'),
  book: svg('<path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5c-3-.5-6 0-8 1.5zM12 6v14.5"/>'),
  work: svg('<rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor"/>'), gather: svg('<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5"/>'),
  garrison: svg('<path d="M14 4l6-1-1 6-9 9-3-3zM7 15l-3 3 2 2 3-3"/>'), shelter: svg('<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/>'), squad: svg('<circle cx="12" cy="7" r="3" fill="currentColor"/><circle cx="5" cy="9" r="2.5" fill="currentColor"/><circle cx="19" cy="9" r="2.5" fill="currentColor"/><path d="M6 19c0-4 3-6 6-6s6 2 6 6zM0.5 18c0-3 2-5 4.5-5M23.5 18c0-3-2-5-4.5-5" fill="currentColor" stroke="none"/>'),
  direct: svg('<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 1v5M12 18v5M1 12h5M18 12h5"/>'), attack: svg('<path d="M14 4l6-1-1 6-9 9-3-3zM7 15l-3 3 2 2 3-3"/>'),
  UM1: svg('<path d="M4 20L19 5M15 5h4v4"/>'), UM2: svg('<path d="M8 3c6 3 6 15 0 18M8 3v18M3 12h18M18 9l3 3-3 3"/>'), UM3: svg('<path d="M6 20l1-8c0-4 3-7 7-7l3 3-2 3 2 2-2 2-3-2-2 7"/>'), UM4: svg('<path d="M5 12h14l-2-4H7zM12 8l3-4M4 12v3h16v-3"/><circle cx="7.5" cy="18" r="2"/><circle cx="16.5" cy="18" r="2"/>'),
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
// the colours: COLORS.md, one name each, set once on :root; nothing below uses a colour that is not here (the map's own paint excepted)
const COL = { b1: '#2a1d13', b2: '#33241a', b3: '#6b5230', g1: '#e6b947', s1: '#1e2329', s2: '#2a3038', s3: '#4d5a68', rb: '#6aaeff', rg: '#5fd08a', rr: '#ff6b5b', rw: '#ece5d3', f1: '#f2d27a', f2: '#b8862e', ink: '#2a1c10',
  food: '#e0708a', wood: '#c08a58', stone: '#b4bbc0', gold: '#f2cf55', iron: '#8fa3b5', age0: '#9a9890', age1: '#b5793a', age2: '#c9c2a6', age3: '#4d6b9e', age4: '#8e2f2a' };
const css = document.createElement('style'); css.textContent = `:root { ${Object.entries(COL).map(([k, v]) => `--${k}: ${v};`).join(' ')} --dim: 80%; --faint: 35%; --glass: 92%; --wdim: color-mix(in srgb, var(--rw) var(--dim), transparent); --wfaint: color-mix(in srgb, var(--rw) var(--faint), transparent); }
/* MENU-SPEC §1: one number, 6 (gaps and edges); slots 44 tall; radius 6, an outline round slots 9; text 14 and 18 (D-044), Barlow 600 */
#ui { position: fixed; left: var(--gap); right: var(--gap); bottom: calc(env(safe-area-inset-bottom, 0px) + var(--gap)); display: flex; flex-direction: column; gap: var(--gap); pointer-events: none; } #ui > * { pointer-events: auto; }
.cell { min-width: 0; height: var(--slot); box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; padding: 0 4px; background: var(--b2); color: var(--rw); border: 1px solid var(--b3); border-radius: 6px; font: 600 14px/1.1 var(--ui); text-align: center; white-space: nowrap; overflow: hidden; position: relative; }
.cell small { font-size: 14px; color: var(--wdim); } .cell .c { color: var(--rg); } .cell .t { display: flex; align-items: center; gap: 4px; } .cell svg { display: block; width: 18px; height: 18px; flex: none; }
/* §9 states: the ring is the slot's edge. Gold chosen, blue ready; dim drops the fill a step and quiets the words (COLORS: never faded) */
.cell.on { border-color: var(--g1); box-shadow: inset 0 0 0 1px var(--g1); color: var(--g1); } .cell.blue { border-color: var(--rb); box-shadow: inset 0 0 0 1px var(--rb); }
.cell.dim { background: var(--b1); color: var(--wdim); } .cell.dim small, .cell.dim .c { color: var(--wdim); } i.e, .row6 > i, .frame > i { background: var(--b1); border: 1px solid var(--b2); border-radius: 6px; height: var(--slot); box-sizing: border-box; pointer-events: none; } .row6 > i.gap { background: none; border: 0; }
.cell.title { align-items: flex-start; padding-left: 14px; font: 400 18px var(--display); font-variant: small-caps; letter-spacing: .03em; color: var(--g1); } .bar { position: absolute; left: 12px; right: 12px; height: 3px; border-radius: 2px; }
.cell.go { height: calc(2 * var(--slot) + var(--gap)); background: linear-gradient(var(--f1), var(--f2)); color: var(--ink); border-color: var(--f1); font-size: 18px; } .cell.go small { color: var(--ink); }
/* the grid: six slots a rank; a box is one decision, its choices one bar split by thin lines (§3) */
.row6 { display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--gap); align-items: center; } .lab { padding-left: 6px; color: var(--wdim); line-height: 1.2; }
.cells { display: grid; grid-template-columns: repeat(var(--n), 1fr); } .cells.seg { background: var(--b2); border: 1px solid var(--b3); border-radius: 9px; overflow: hidden; } .cells.seg .cell { background: none; border: 0; border-radius: 0; padding: 0 1px; } .cells.seg .cell + .cell { border-left: 1px solid var(--b3); } .cells.seg .cell.on { border-radius: 6px; box-shadow: inset 0 0 0 2px var(--g1); }
/* tabs are a file folder: the open tab joins one gold outline round its page (§1) */
.tabs .cell.on { height: calc(var(--slot) + var(--gap) + 1px); align-self: start; border-radius: 9px 9px 0 0; border-bottom: 0; box-shadow: none; background: var(--b1); z-index: 1; }
.frame { margin-top: calc(-1 * var(--gap) - 1px); border: 1px solid var(--g1); border-radius: 9px; padding: var(--gap); display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: var(--slot); gap: var(--gap); flex: 1; align-content: start; } .frame.f6 { grid-template-columns: repeat(6, 1fr); align-items: center; }
.q6 { display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--gap); } .q6 > .cell, .q6 > i { background: var(--s2); border: 1px solid var(--s3); } .q6 > i { background: var(--s1); border-color: var(--s2); border-radius: 6px; } /* the queue: steel places (§10 Q1) */
.blurb { margin: 0 6px; color: var(--wdim); line-height: 1.3; } .blurb b { color: var(--rw); }
.info { flex: 1; overflow-y: auto; border: 1px solid var(--b3); border-radius: 9px; padding: 8px 12px; line-height: 1.45; font-weight: 500; } .info p { margin: 0 0 8px; } .info b { font-weight: 600; }
/* the card: glass over the map, bottom-anchored over the base, one height (Albert, Nov 4) */
#panel { position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; box-sizing: border-box; display: none; flex-direction: column; gap: var(--gap); } #panel.on { display: flex; background: color-mix(in srgb, var(--b1) var(--glass), transparent); border: 1px solid var(--b3); border-radius: 9px; padding: var(--gap); }
#base { display: flex; flex-direction: column; gap: var(--gap); } .pairs { display: flex; gap: var(--gap); } .pairs .cell { flex: 1; padding: 0; } #base .pairs .cell { font-size: 18px; }
/* war: steel, the war tiles a faint red; the middle box one block, thin dividers, a white edge (§8 the battle station) */
.warbase { display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: var(--slot) var(--slot); gap: var(--gap); } .cell.red { background: color-mix(in srgb, var(--rr) 22%, var(--s2)); border-color: color-mix(in srgb, var(--rr) 30%, var(--s3)); } .cell.warx { background: var(--s1); border-color: var(--rr); box-shadow: inset 0 0 0 1px var(--rr); }
.mid { grid-column: 3 / 5; grid-row: 1 / 3; display: grid; grid-template-columns: 1fr 1fr; background: var(--s1); border: 2px solid var(--rw); border-radius: 9px; overflow: hidden; } .mid .cell { height: auto; border: 0; border-radius: 0; background: none; } .mid .cell:nth-child(odd) { border-right: 1px solid var(--s3); } .mid .cell:nth-child(-n+2) { border-bottom: 1px solid var(--s3); } .mid .cell.whole { grid-column: 1 / 3; grid-row: 1 / 3; border: 0; }
/* the top: framed bars with dividers */
.topbar { position: fixed; left: var(--gap); right: var(--gap); top: calc(env(safe-area-inset-top, 0px) + var(--gap)); display: flex; flex-direction: column; gap: var(--gap); z-index: 3; } #top { display: none; }
.strip { display: grid; grid-template-columns: repeat(8, 1fr); background: var(--b1); border: 1px solid var(--b3); border-radius: 9px; } .strip .cell { background: none; border: 0; border-radius: 0; height: 30px; } .strip .cell + .cell { border-left: 1px solid var(--b2); } .strip.big .cell { height: var(--slot); } .strip:not(.big) .cell { flex-direction: row; gap: 4px; }
#card { background: color-mix(in srgb, var(--b1) var(--glass), transparent); border: 1px solid var(--b3); border-radius: 9px; padding: 8px 10px; display: none; flex-direction: column; gap: var(--gap); } #card.on { display: flex; } #card h2 { font: 400 18px var(--display); color: var(--g1); margin: 0; } #card p { margin: 0; color: var(--wdim); } .row { display: flex; gap: var(--gap); } .row .cell { flex: 1; } .cell.w1 { flex: 0 0 var(--slot); }
#toast { position: fixed; left: 50%; top: calc(env(safe-area-inset-top, 0px) + 2 * var(--slot) + 3 * var(--gap)); transform: translateX(-50%); background: var(--b1); border: 1px solid var(--g1); color: var(--g1); border-radius: 9px; padding: 6px 12px; font: 600 14px var(--ui); opacity: 0; transition: opacity .3s; pointer-events: none; max-width: 80vw; z-index: 4; }`;
document.head.appendChild(css);
const ui = document.createElement('div'); ui.id = 'ui'; ui.innerHTML = '<div id="card"></div><div id="panel"></div><div id="base"></div>'; document.body.appendChild(ui);
const topEl = document.createElement('div'); topEl.className = 'topbar'; document.body.appendChild(topEl);
const toastEl = document.createElement('div'); toastEl.id = 'toast'; document.body.appendChild(toastEl);
const $ = (id) => document.getElementById(id);
const S = { tab: 'Start', prev: null, htab: 'Town', war: false, mid: 'map', info: false, opt: { diff: 1, len: 0, scen: 0, world: 0, fog: 0, tension: 1, daily: 0, civ: 0, hazard: -1 }, group: 'Home', ghost: null, arming: false, subject: null, lock: {}, last: '', toastT: 0 }; // the glass's own state, nothing of the world's
try { Object.assign(S.lock, JSON.parse(localStorage.getItem('fk.lock') || '{}')); } catch (e) {}
const toast = (msg) => { toastEl.textContent = msg; toastEl.style.opacity = 1; S.toastT = D.toast; };
const mixc = (a, b, t) => '#' + [0, 2, 4].map((i) => Math.round(parseInt(a.substr(i + 1, 2), 16) * (1 - t) + parseInt(b.substr(i + 1, 2), 16) * t).toString(16).padStart(2, '0')).join('');
const price = (c) => { const st = SIDES[0].store, miss = Object.entries(c || {}).map(([y, n]) => [y, Math.ceil(n - (st[y] || 0)), n]).filter(([, m]) => m > 0); if (!miss.length) return `<small class="c">${costText(c)}</small>`;
  const f = Math.min(...miss.map(([, m, n]) => 1 - m / n)); return `<small style="color:${f < 0.5 ? mixc(COL.rr, COL.rw, f * 2) : mixc(COL.rw, COL.rg, f * 2 - 1)};opacity:1">Short ${miss.map(([y, m]) => m + y[0]).join(' ')}</small>`; };
const clock = (t) => `${Math.floor(t / 60)}:${String(Math.ceil(t % 60) % 60).padStart(2, '0')}`;
const costText = (c) => Object.entries(c || {}).filter(([, n]) => n > 0).map(([y, n]) => `${n}${y[0]}`).join(' ') || 'free'; // 60w 60f, as Albert's Build menu
const own = (t) => t && t.side === 0;
const isVil = (u) => u && u.kind === 'unit' && FK.has(u, 'Gather') && own(u);
const isSoldier = (u) => u && u.kind === 'unit' && own(u) && WAR.armed(u);
const hall = () => things().find((t) => t.side === 0 && FK.has(t, 'Seat') && t.done >= 1);
const trainer = (c) => things().find((t) => t.kind === 'bld' && t.side === 0 && t.done >= 1 && (D.trains[t.code] || []).includes(c));
const count = (c) => things().filter((t) => t.kind === 'bld' && t.side === 0 && t.code === c).length, picked = (c) => S.ghost && S.ghost.code === c;
const summary = () => `${OPTS.len[S.opt.len][0]} · Fog ${OPTS.fog[S.opt.fog][0].toLowerCase()} · Daily ${OPTS.daily[S.opt.daily][0].toLowerCase()}`;
const isFind = (t) => t && t.kind !== 'unit' && t.kind !== 'bld' && ECON.yieldOf(t);
// read: the one window onto the world the glass draws from
function read() { const s = SIDES[0], r = ECON.result(); return { store: s.store, pop: ECON.popOf(0), cap: ECON.popCap(0), age: D.ages[s.age], aging: s.aging, ageCost: ECON.ageCost(0), jobs: ECON.jobs(0), rally: s.rally, army: WAR.armyOf(0).length, wave: WAR.waves[0], sel: FK.sel(), subject: S.subject, time: ECON.time(), left: Math.max(0, D.bell - ECON.time()), score: ECON.score(0), theirs: ECON.score(D.players[1]), result: r, next: s.age + 1 < D.ages.length ? D.ages[s.age + 1] : null, hall: hallRead() }; }
function hallRead() { const h = (S.subject && FK.has(S.subject, 'Seat') && own(S.subject) ? S.subject : hall()) || null; if (!h) return null; const q = h.q || []; let at = h.qt || 0;
  return { k: key(h), hp: h.hp, hpMax: h.hpMax, life: h.hp / h.hpMax, done: q.length ? 1 - h.qt / D.train[q[0]] : 0, queue: q.slice(0, 5).map((c, i) => [U[c][0], i ? (at += D.train[c]) : at]), more: Math.max(0, q.length - 5) }; }
// VERBS: every way the player may act, each with its reason not to. act() asks whyNot first; a reason stops it and is said
const VERBS = {
  show: { label: (c) => 'Show', whyNot: () => '', run: (c) => { show[c] = !show[c]; FK.dirty(); } },
  lock: { label: () => 'Lock', whyNot: () => '', run: (c) => { S.lock[c] = !S.lock[c]; try { localStorage.setItem('fk.lock', JSON.stringify(S.lock)); } catch (e) {} } },
  fast: { label: () => 'Fast', whyNot: () => '', run: () => { show.fast = !show.fast; } },
  new: { label: () => 'New', whyNot: () => '', run: () => { S.prev = S.tab; S.tab = 'Start'; } },
  close: { label: () => SVG.close, whyNot: () => '', run: () => { S.tab = null; S.subject = null; S.ghost = null; S.arming = false; FK.dirty(); } },
  back: { label: () => SVG.back, whyNot: () => '', run: () => { S.tab = S.prev; S.prev = null; } },
  opt: { label: (k, i) => OPTS[k][i][0], whyNot: (k) => (BUILT[k] ? '' : 'Not built yet'), run: (k, i) => { S.opt[k] = i; } },
  war: { label: () => '', whyNot: () => '', run: () => { S.war = !S.war; S.mid = 'map'; S.tab = null; S.arming = false; } },
  mid: { label: (m) => `<span class="t">${SVG[m]}</span>${{ train: 'Train', squad: 'Squad', direct: 'Direct' }[m]}`, whyNot: () => '', run: (m) => { S.mid = S.mid === m ? 'map' : m; } },
  kind: { label: (c) => `<span class="t">${SVG[c]}</span>${U[c][0]}`, whyNot: (c) => { const b = trainer(c); return !b ? `Build a ${B[Object.keys(D.trains).find((x) => D.trains[x].includes(c))][0]}` : VERBS.train.whyNot(c, b); }, run: (c) => ECON.queue(trainer(c), c) }, // Train a kind: the nearest finished building that trains it
  htab: { label: (t) => t, whyNot: () => '', run: (t) => { S.htab = t; } },
  info: { label: () => SVG.book, whyNot: () => '', run: () => { S.info = !S.info; } },
  mute: { label: () => `<span class="t" style="opacity:${window.SOUND && SOUND.on() ? 1 : 0.35}">${SVG.sound}</span>`, whyNot: () => '', run: () => SOUND.toggle() }, // sound on or off
  later: { label: (t) => SVG[t] || `${t}<small>Later</small>`, whyNot: () => 'Not built yet', run: () => {} }, // a cell for what is drawn but not yet built: Albert's reminder
  start: { label: () => `Start<small>${summary()}</small>`, whyNot: () => '', run: () => { const o = (k) => OPTS[k][S.opt[k]][1]; D.bell = o('len') || Infinity; show.fog = o('fog'); S.tab = null; if (!o('daily')) FK.restart(); else if (location.hash.length > 1) location.hash = ''; else FK.reset(); } }, // the new game: the bell (D134), fog, the day's map or a fresh one
  job: { label: (y, n) => (n > 0 ? '+' : '−'), whyNot: (y, n) => (n > 0 && !ECON.villagersOf(0).length ? 'No villagers' : n < 0 && !ECON.jobs(0)[y] ? `No one on ${y}` : ''), run: (y, n) => { if (!ECON.assign(0, y, n)) toast(n > 0 ? `No ${y} within reach` : `No one on ${y}`); } },
  people: { label: () => `<span class="t">${SVG.people}</span>People`, whyNot: () => { const h = hall(); return !h ? 'No hall' : VERBS.train.whyNot('UV', h); }, run: () => ECON.queue(hall(), 'UV') },
  yield: { label: (y) => `<span class="t">${SVG[y]}${ECON.jobs(0)[y]}</span>${NAME[y]}`, whyNot: () => '', run: (y) => { SIDES[0].rally = SIDES[0].rally === y ? null : y; } }, // tap a yield: new villagers go there (the ring)
  ageUp: { label: () => { const r = read(); return !r.next ? 'Last age' : `${r.next} age${r.aging ? `<small>rising, ${Math.ceil(r.aging)}s</small>` : price(r.ageCost)}`; }, whyNot: () => { const c = ECON.ageCost(0); return !c ? 'Last age' : SIDES[0].aging ? 'Already rising' : !ECON.canPay(0, c) ? `Needs ${costText(c)}` : ''; }, run: () => ECON.ageUp(0) },
  pick: { label: (c) => `${B[c][0]} ${count(c)}${picked(c) ? '<small>' : ''}${picked(c) ? (S.ghost.i < -50 ? 'Slide to place' : S.ghost.ok ? 'Fits here' : 'Not here') : ''}</small>${picked(c) ? '' : price(D.cost[c])}`, // tap picks, slide places the ghost, tap again builds
    whyNot: (c) => (picked(c) ? VERBS.build.whyNot() : !ECON.canPay(0, D.cost[c] || {}) ? `Needs ${costText(D.cost[c])}` : ''), run: (c) => { if (picked(c)) return VERBS.build.run(); S.ghost = { code: c, i: -99, j: -99, ok: false }; S.arming = false; } },
  build: { label: () => 'Build', whyNot: () => (!S.ghost ? 'Pick a building' : !S.ghost.ok ? 'Not here: it needs flat, free ground' : ''), run: () => { const g = S.ghost, t = ECON.plan(0, g.code, g.i, g.j); if (!t) return toast('Not here'); const sel = FK.sel(), u = isVil(sel) ? sel : ECON.villagersOf(0).find((v) => v.job === 'idle' || v.job === 'wait') || ECON.villagersOf(0)[0]; if (u) ECON.buildAt(u, t); S.ghost = null; FK.dirty(); } },
  group: { label: (g) => g, whyNot: () => '', run: (g) => { S.group = g; S.ghost = null; FK.dirty(); } },
  target: { label: () => 'Set target', whyNot: () => '', run: () => { S.arming = !S.arming; S.ghost = null; if (S.arming) toast('Tap the map to aim'); } },
  attack: { label: () => `<span class="t">${SVG.attack}</span>Attack`, whyNot: () => (!WAR.armyOf(0).length ? 'No soldiers' : ''), run: () => { S.arming = true; S.ghost = null; toast('Tap the map where they go'); } },
  recall: { label: () => 'Recall', whyNot: () => (!WAR.armyOf(0).length ? 'No soldiers' : ''), run: () => WAR.recall(0) },
  train: { label: (c) => `${U[c][0]}${price(D.cost[c])}`, whyNot: (c, b) => (b.done < 1 ? 'Not built yet' : !ECON.canPay(0, D.cost[c]) ? `Needs ${costText(D.cost[c])}` : ECON.popOf(0) >= ECON.popCap(0) ? 'No room: build a home' : ''), run: (c, b) => ECON.queue(b, c) },
  untrain: { label: () => '−', whyNot: (b) => (!b.q || !b.q.length ? 'Nothing queued' : ''), run: (b) => ECON.unqueue(b) },
  stop: { label: () => 'Stop', whyNot: (u) => (u.job === 'idle' ? 'Already idle' : ''), run: (u) => { if (u.load) ECON.carry(u); else ECON.idle(u); } },
  gather: { label: () => 'Gather', whyNot: (t) => (!isVil(FK.sel()) ? 'Pick a villager' : ''), run: (t) => ECON.gatherAt(FK.sel(), t) },
  send: { label: () => 'Send one', whyNot: (t) => (!ECON.villagersOf(0).some((v) => v.job === 'idle' || v.job === 'wait') ? 'No idle villager' : ''), run: (t) => { const u = ECON.villagersOf(0).filter((v) => v.job === 'idle' || v.job === 'wait').sort((a, b) => Math.hypot(a.bx - t.bx, a.by - t.by) - Math.hypot(b.bx - t.bx, b.by - t.by))[0]; ECON.gatherAt(u, t); } },
  raise: { label: (t) => (t.done < 1 ? 'Raise' : 'Repair'), whyNot: (t) => (!isVil(FK.sel()) ? 'Pick a villager' : t.done >= 1 && t.hp >= t.hpMax ? 'Not hurt' : ''), run: (t) => ECON.buildAt(FK.sel(), t) },
  scrap: { label: (t) => (t.done < 1 ? 'Cancel site' : 'Demolish'), whyNot: (t) => (FK.has(t, 'Seat') && t.done >= 1 ? 'The hall stays' : ''), run: (t) => { ECON.cancel(t); S.subject = null; } },
  fight: { label: () => 'Attack this', whyNot: (t) => (!isSoldier(FK.sel()) ? 'Pick a soldier' : ''), run: (t) => WAR.fight(FK.sel(), t) },
  here: { label: () => 'Soldiers here', whyNot: (t) => (!WAR.armyOf(0).length ? 'No soldiers' : ''), run: (t) => WAR.attack(0, t.kind === 'bld' ? FK.tileAt(t.bx, t.by) : t.k) },
};
function act(verb, arg, arg2) { const v = VERBS[verb], why = v.whyNot(arg, arg2); if (why) { FK.fire('event', 'err', null); toast(why); return false; } FK.fire('event', verb === 'build' ? 'place' : 'tap', null); v.run(arg, arg2); render(true); return true; }
// the cells: one mold; a verb's cell is dim when its whyNot says so, and a dim cell only says why
const cell = (text, cls = '', on = null) => `<button class="cell ${cls}" ${on ? `data-v="${on.join('|')}"` : ''}>${text}</button>`;
const vcell = (verb, arg, arg2, cls = '', on = false) => { const v = VERBS[verb], a = ARGS[arg] ?? arg, a2 = ARGS[arg2] ?? arg2, why = v.whyNot(a, a2); return cell(v.label(a, a2), `${cls} ${why && !why.startsWith('Needs ') ? 'dim' : ''} ${on ? 'on' : ''}`, [verb, String(arg ?? ''), String(arg2 ?? '')]); };
const ARGS = {}; // a cell's object arguments live here by key, since the DOM holds strings
const key = (o) => { const k = o.kind + (o.code || '') + (o.k ?? o.i + '_' + o.j) + (o.side ?? ''); ARGS[k] = o; return k; };
// the mold: a ribbon is an optional label and a strip of n equal cells; seg puts them in one frame with one lit. Every screen is a list of ribbons
// the mold: every screen is rows on one six-column grid (the Formation). A row holds cells and parts; a part is an optional label and a strip of choices, seg puts them in one frame with one lit
const row = (...items) => `<div class="row6">${items.join('')}</div>`;
const span = (n, html) => html.replace('class="', `style="grid-column:span ${n}" class="`);
const part = (label, l, k, n) => `${label ? `<span class="lab" style="grid-column:span ${l}">${label}</span>` : ''}<div class="cells seg" style="grid-column:span ${n};--n:${OPTS[k].length}">${OPTS[k].map((o, i) => vcell('opt', k, i, '', S.opt[k] === i)).join('')}</div>`;
const frame = (cells) => `<div class="frame">${cells.join('')}</div>`;
const bar = (f, col, top) => `<span class="bar" style="${top ? 'top' : 'bottom'}:6px;background:linear-gradient(90deg,${col} ${f * 100}%,var(--wfaint) ${f * 100}%)"></span>`;
const gap = (n) => `<i class="gap" style="grid-column:span ${n}"></i>`;
const head = (title, back) => row(back ? vcell('back') : '', span(back ? 3 : 4, cell(title, 'title')), vcell('later', 'book'), vcell('close'));
const SCREENS = {
  Start: () => [head('A new game', !!S.prev), row(part('Difficulty', 3, 'diff', 3)), row(part('Length', 2, 'len', 4)), row(part('Scenario', 2, 'scen', 4)),
    row(part('World', 1, 'world', 2), part('Fog', 1, 'fog', 2)), row(part('Tension', 1, 'tension', 2), part('Daily', 1, 'daily', 2)), row(part('', 0, 'civ', 6)),
    `<p class="blurb"><b>${OPTS.civ[S.opt.civ][0]}</b><br>Civilizations: not built yet</p>`, row(`<div class="cells seg" style="grid-column:span 6;--n:6">${OPTS.hazard.map(([h]) => vcell('later', h, null, 'two')).join('')}</div>`),
    row(span(6, vcell('start', null, null, 'go')))],
  Build: () => { const g = GROUPS[S.group];
    return [head('Build'), `<div class="row6 tabs">${Object.keys(GROUPS).map((x) => vcell('group', x, null, '', S.group === x)).join('')}</div>`,
      `<div class="frame">${g.map((c) => (D.cost[c] ? vcell('pick', c, null, `two ${picked(c) ? 'blue' : ''}`) : vcell('later', B[c][0], null, 'two'))).join('')}</div>`]; },
  Hall: () => { const r = read(), h = r.hall || {}; // Albert's Town Center: the bars in the title, three tabs, the queue, train, tech
    const title = row(span(4, cell(`${bar(1, `var(--age${Math.min(4, SIDES[0].age)})`, 1)}${B.BTC1[0]}${h.hp != null ? bar(h.life, h.life > 0.5 ? 'var(--rg)' : 'var(--rr)') : ''}`, 'title')), vcell('info', null, null, '', S.info), vcell('close'));
    if (S.info) return [title, `<div class="info"><p>Health ${h.hp != null ? `${Math.ceil(h.hp)}/${h.hpMax}` : '–'} · ${r.age} age · room for ${Math.max(0, r.cap - r.pop)}.</p><p><b>Food:</b> your people eat ${Math.round(r.pop * D.upkeep * 600 / D.day) / 10} a minute.</p><p><b>${r.next ? r.next + ' age' : 'Last age'}:</b> ${r.next ? `${costText(r.ageCost)}, ${D.age.time}s to rise` : 'reached'}.</p><p><b>Later:</b> the age's history, tech, the civilization, goods wanted by others.</p></div>`];
    const tabs = `<div class="row6 tabs">${['Town', 'Relations', 'Misfits'].map((t) => span(2, vcell('htab', t, null, '', S.htab === t))).join('')}</div>`;
    if (S.htab !== 'Town') return [title, tabs, stances(S.htab)];
    const queue = h.queue || [], slots = [...queue.map(([n, t], i) => cell(`${n}<small>${clock(t)}</small>`, 'two').replace('class="', i ? 'class="' : `style="background:linear-gradient(90deg,color-mix(in srgb,var(--rg) 35%,var(--s2)) ${h.done * 100}%,var(--s2) ${h.done * 100}%)" class="`)), ...Array(5 - queue.length).fill('<i></i>'), h.more ? cell(`+${h.more}`) : '<i></i>'];
    return [title, tabs, frame([`<div class="q6" style="grid-column:span 3">${slots.join('')}</div>`, h.k ? vcell('train', 'UV', h.k, 'two') : '<i></i>', vcell('later', 'Scout', null, 'two'), '<i></i>',
      vcell('ageUp', null, null, 'two', !!r.aging), vcell('later', 'Tech', null, 'two'), vcell('later', 'Tech', null, 'two'), vcell('later', 'Tech', null, 'two'), vcell('later', 'All tech', null, 'two'), '<i></i>'])]; },
  Layers: () => [head('Yard'), ...[0, 2, 4, 6].map((i) => row(...LAYERS.slice(i, i + 2).map(([c, name]) => `<span class="lab" title="${name}">${c}</span><div class="cells seg" style="grid-column:span 2;--n:2">${vcell('show', c, null, '', show[c])}${vcell('lock', c, null, '', S.lock[c])}</div>`))), row(span(3, vcell('fast', null, null, '', show.fast)), span(3, vcell('new')))],
};
const page = () => (S.tab && SCREENS[S.tab] ? SCREENS[S.tab]().join('') : '');
function cardText(r) { const t = S.subject; if (!t) return '';
  if (t.kind === 'unit') { const st = WAR.stat(t), facts = `${t.hp != null ? Math.ceil(t.hp) + '/' + t.hpMax + ' health' : ''}${FK.has(t, 'Gather') ? ` · ${ECON.jobOf(t) || t.job}${t.load ? `, carrying ${Math.floor(t.load)}` : ''}` : ` · ${t.job}`}`;
    const acts = own(t) ? (FK.has(t, 'Gather') ? vcell('stop', key(t)) : `${vcell('recall')}`) : isSoldier(r.sel) ? vcell('fight', key(t)) : WAR.armed(t) || t.side < 0 ? vcell('here', key(t)) : '';
    return `<h2>${U[t.code][0]}${t.side >= 0 && !own(t) ? ' (theirs)' : ''}</h2><p>${facts}</p>${acts ? `<div class="row">${acts}</div>` : ''}`; }
  if (t.kind === 'bld') { const name = B[t.code][0], k = key(t), facts = t.done < 1 ? `site · ${Math.floor(t.done * 100)}% raised` : `${Math.ceil(t.hp)}/${t.hpMax} health${t.q && t.q.length ? ` · training ${t.q.map((c) => U[c][0]).join(', ')} (${Math.ceil(t.qt)}s)` : ''}`;
    if (!own(t)) return `<h2>${name} (theirs)</h2><p>${facts}</p><div class="row">${isSoldier(r.sel) ? vcell('fight', k) : ''}${vcell('here', k)}</div>`;
    const trains = (D.trains[t.code] || []).map((c) => vcell('train', c, k)).join('');
    return `<h2>${name}</h2><p>${facts}</p>${trains ? `<div class="row">${trains}${t.q && t.q.length ? vcell('untrain', k, null, 'w1') : ''}</div>` : ''}<div class="row">${FK.has(t, 'Research') && t.done >= 1 ? vcell('ageUp', null, null, '', !!r.aging) : ''}${vcell('raise', k)}${vcell('scrap', k)}</div>`; }
  return `<h2>${t.kind}</h2><p>${Math.floor(t.amount)} ${ECON.yieldOf(t)} left</p><div class="row">${vcell('gather', key(t))}${vcell('send', key(t))}</div>`;
}
// the base: Albert's template. Corners Yard and War; who works where; Build and − + under each yield
const tab = (t, label, icon, cls = '') => cell(`<span class="t">${SVG[icon]}</span>${label}`, `ic ${cls} ${S.tab === t ? 'on' : ''}`, ['tab', t]);
const base = (r) => S.war ? row(tab('Layers', 'Yard', 'yard'), gap(4), vcell('war', null, null, 'ic warx').replace('</button>', `${SVG.close}</button>`)) + warBase()
  : row(tab('Layers', 'Yard', 'yard'), gap(4), vcell('war', null, null, 'ic war').replace('</button>', `<span class="t">${SVG.war}</span>War</button>`))
  + row(vcell('people', null, null, 'ic'), ...ORDER.map((y) => vcell('yield', y, null, 'ic', r.rally === y)))
  + row(tab('Build', 'Build', 'build'), ...ORDER.map((y) => `<div class="pairs">${vcell('job', y, -1)}${vcell('job', y, 1)}</div>`));
// war mode: Albert's War rows. Left the people's orders, the middle box (map, squads, orders, kinds), right the army's
const MID = { map: () => vcell('later', 'Map', null, 'two whole'), train: () => ['UM1', 'UM2', 'UM3', 'UM4'].map((c) => vcell('kind', c, null, 'ic')).join(''),
  squad: () => ['Alpha', 'Bravo', 'Charlie', 'Set up'].map((n) => vcell('later', n, null, 'two')).join(''), direct: () => ['Wall', 'Loose!', 'Charge', 'Bombard'].map((n) => vcell('later', n, null, 'two')).join('') };
const ic = (name, icon) => vcell('later', name, null, 'ic').replace(/>[^<]*<small>Later<\/small>/, `><span class="t">${SVG[icon]}</span>${name}`);
const warBase = () => `<div class="warbase">${ic('Work', 'work')}${ic('Gather', 'gather')}<div class="mid">${MID[S.mid]()}</div>${vcell('mid', 'train', null, 'ic red', S.mid === 'train')}${vcell('mid', 'squad', null, 'ic red', S.mid === 'squad')}`
  + `${ic('Garrison', 'garrison')}${ic('Shelter', 'shelter')}${vcell('mid', 'direct', null, 'ic red', S.mid === 'direct')}${vcell('attack', null, null, 'ic red', S.arming)}</div>`;
// the top bar: Albert's two ribbons. The stores, sound, play, mail; the age, the clock, people, idle, records, rank, army
// Relations and Misfits: one row a people: who and where they stand, (a bribe for misfits), the three stances, ✓. Drawn now, built with diplomacy (Later)
const sword = svg('<path d="M14 4l6-1-1 6-9 9-3-3zM7 15l-3 3 2 2 3-3"/>').replace('currentColor', 'var(--rr)'), scales = svg('<path d="M12 4v16M7 20h10M5 7h14M5 7l-3 6h6zM19 7l-3 6h6z"/>'), hands = svg('<path d="M3 11l4-4 4 2 3-2 4 4 3 0M7 13l3 3c1 1 2 1 3 0l4-4"/>').replace('currentColor', 'var(--rg)');
const PEOPLE = { Relations: ['Raiders', 'Rivals', 'Fortress'], Misfits: ['Natives', 'Outlaws', 'Bandits', 'Robbers'] };
const stances = (t) => `<div class="frame f6">${PEOPLE[t].map((n) => `<span class="lab two-l" style="grid-column:span ${t === 'Misfits' ? 1 : 3}">${n}<br><span style="color:var(--rr)">Foe</span></span>${t === 'Misfits' ? span(2, vcell('later', 'Bribe', null, 'two')) : ''}<div class="cells seg dim" style="grid-column:span 2;--n:3">${cell(sword, 'dim on')}${cell(scales, 'dim')}${cell(hands, 'dim')}</div>${vcell('later', 'check', null, '')}`).join('')}<p class="blurb" style="grid-column:span 6">${t === 'Misfits' ? 'Pick a bribe or a stance, then its ✓' : 'Pick a stance, then its ✓'} · not built yet</p></div>`;
const topbar = (r) => { const sc = D.players.map((p) => [ECON.score(p).total, p]).sort((a, b) => b[0] - a[0]), rank = sc.findIndex(([, p]) => p === 0) + 1, t = isFinite(r.left) ? r.left : r.time;
  return `<div class="strip big">${['food', 'wood', 'stone', 'gold', 'iron'].map((y) => cell(`<span class="t">${SVG[y]}</span>${Math.floor(r.store[y])}`)).join('')}${vcell('mute')}${vcell('later', 'play')}${vcell('later', 'mail')}</div>`
    + `<div class="strip">${span(2, cell(`<span class="t">${SVG[['spring', 'summer', 'autumn', 'winter'][Math.floor(FK.K.t / D.season) % 4]]}</span>${String(Math.floor((FK.K.t % D.day) / D.day * 24)).padStart(2, '0')}:00`))}${cell(`${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`)}${cell(`${r.pop}/${r.cap}`)}${cell(`z ${r.jobs.idle}`)}${vcell('later', 'book')}${cell(`<span class="t">${SVG.star}</span>${rank}${['st', 'nd', 'rd'][rank - 1] || 'th'}`)}${cell(`<span class="t">${SVG.shield}</span>${r.army}`)}</div>`; };
let acc = 0;
function render(force) { const r = read();
  const tb = topbar(r); if (tb !== S.lastTop) { topEl.innerHTML = tb; S.lastTop = tb; }
  if (r.result) { S.tab = null; S.ghost = null; const you = r.result.winner === 0; $('card').className = 'on'; $('card').innerHTML = `<h2>${you ? 'You hold the keep' : 'The keep falls'}</h2><p>${r.result.how === 'bell' ? 'The bell rang' : you ? 'Their hall fell' : 'Your hall fell'} · you ${r.score.total}, they ${r.theirs.total}</p><div class="row">${vcell('new')}</div>`; $('panel').className = ''; return; }
  if (S.subject && (S.subject.kind === 'unit' ? units().indexOf(S.subject) < 0 : things().indexOf(S.subject) < 0)) S.subject = null;
  const html = page(r), card = cardText(r), sig = html + card + S.tab + base(r); if (!force && sig === S.last) return; S.last = sig;
  $('panel').innerHTML = html; $('panel').style.height = S.tab === 'Start' || !PANEL ? '' : PANEL + 'px'; $('panel').className = S.tab ? 'on' : ''; $('card').innerHTML = card; $('card').className = card && !S.tab ? 'on' : ''; // a page opens from the bottom edge, over the base's rows; the card waits behind it
  $('base').innerHTML = base(r);
}
function click(e) { const b = e.target.closest('[data-v]'); if (!b) return; const [verb, a, a2] = b.dataset.v.split('|'), arg = ARGS[a] ?? (a === '' ? null : isNaN(a) ? a : Number(a)), arg2 = ARGS[a2] ?? (a2 === '' ? null : isNaN(a2) ? a2 : Number(a2));
  if (verb === 'tab') { S.tab = S.tab === a ? null : a; if (S.tab !== 'Build') S.ghost = null; if (S.tab !== 'War') S.arming = false; render(true); return; } act(verb, arg, arg2); }
ui.addEventListener('click', click); topEl.addEventListener('click', click);
// the ghost: press and slide on the map moves it; the tile under the finger is its middle. Build confirms. Nothing of this reaches the canvas's own pan while a ghost is up
const canvas = document.getElementById('map');
const tileUnder = (px, py) => { const [cw, ch] = FK.size(), c = FK.cam, vx = c.x + (px - cw / 2) / c.z, vy = c.y + (py - ch / 2) / c.z, [sx, sy] = FK.fromBoard(vx, (vy + D.land * Math.cos(FK.A.rise * Math.PI / 180)) / Math.sin(FK.A.rise * Math.PI / 180)); return [Math.floor(sx / D.tile), Math.floor(sy / D.tile)]; };
const ghostTo = (px, py) => { const g = S.ghost, [i, j] = tileUnder(px, py), n = B[g.code][1]; g.i = i - Math.floor(n / 2); g.j = j - Math.floor(n / 2); g.ok = ECON.canPlace(g.code, g.i, g.j); FK.dirty(); };
let pressing = false;
for (const ev of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) canvas.addEventListener(ev, (e) => { if (!S.ghost) return; if (ev === 'pointerdown') pressing = true; if (ev === 'pointerup' || ev === 'pointercancel') { pressing = false; render(true); } if (pressing && (ev === 'pointerdown' || ev === 'pointermove')) ghostTo(e.clientX, e.clientY); e.stopImmediatePropagation(); }, true);
FK.on('draw', (ctx, s) => { const g = S.ghost; if (!g || g.i < -50) return; const n = B[g.code][1], T = D.tile, h = FK.H[Math.max(0, g.j) * N + Math.max(0, g.i)] ?? D.land, P = (sx, sy) => FK.toScreen(...FK.toView(...FK.toBoard(sx, sy), Math.max(D.land, h)));
  ctx.save(); ctx.globalAlpha = 0.5; const [bx, by] = FK.toBoard((g.i + n / 2) * T, (g.j + n / 2) * T), [vx, vy] = FK.toView(bx, by, Math.max(D.land, h)), [x, y] = FK.toScreen(vx, vy); FK.blit(FK.bldSprite(g.code, SIDES[0].col, s), x, y, s); ctx.globalAlpha = 0.9;
  ctx.strokeStyle = g.ok ? COL.rg : COL.rr; ctx.lineWidth = 2; ctx.beginPath(); [[0, 0], [n, 0], [n, n], [0, n]].forEach(([a, b], q) => { const [px, py] = P((g.i + a) * T, (g.j + b) * T); q ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); ctx.stroke(); ctx.restore(); });
// the tap: the glass answers first. A ghost takes it; aiming takes it; a unit or a thing under it becomes the subject, and a picked villager or soldier is sent at it
const under = (k) => things().find((t) => t.kind === 'bld' ? k % N >= t.i && k % N < t.i + t.n && Math.floor(k / N) >= t.j && Math.floor(k / N) < t.j + t.n : t.k === k && !t.deep);
FK.on('tap', (k, mine, px, py) => {
  if (S.ghost) { ghostTo(px, py); return true; }
  if (S.arming) { if (k < 0) return true; S.target = k; S.arming = false; if (WAR.armyOf(0).length) WAR.attack(0, k); toast('Attacking'); render(true); return true; }
  let other = null; for (const u of units()) if (u.side !== 0 && FK.inSight(u.k)) { const [x, y] = FK.toScreen(u.vx, u.vy), d = Math.hypot(x - px, y - py + 8 * FK.cam.z); if (d < 16 && (!other || d < other[1])) other = [u, d]; }
  const sel = FK.sel(), t = mine || (other && other[0]) || (k >= 0 && FK.inSight(k) ? under(k) : null);
  if (mine) { FK.select(mine); FK.fire('event', 'pick', mine); S.subject = mine; render(true); return true; }
  if (t && t.kind === 'unit') { if (isSoldier(sel) && WAR.enemies(sel, t)) { WAR.fight(sel, t); return true; } if (isVil(sel) && t.side < 0 && FK.has(t, 'Prey')) { toast('Hunting is not built yet'); } S.subject = t; render(true); return true; }
  if (t) { if (isVil(sel)) { if (isFind(t)) { ECON.gatherAt(sel, t); return true; } if (t.kind === 'bld' && own(t) && (t.done < 1 || t.hp < t.hpMax)) { ECON.buildAt(sel, t); return true; } } if (isSoldier(sel) && t.kind === 'bld' && !own(t)) { WAR.fight(sel, t); return true; } S.subject = t; if (own(t) && FK.has(t, 'Seat')) S.tab = 'Hall'; render(true); return true; }
  if (!sel) S.subject = null; else if (isSoldier(sel) && k >= 0 && FK.walkable(k)) { WAR.march(sel, k); return true; }
  render(true); return false;
});
FK.on('tick', (dt) => { acc += dt / (show.fast ? D.fast : 1); if (S.toastT > 0) { S.toastT -= dt / (show.fast ? D.fast : 1); if (S.toastT <= 0) toastEl.style.opacity = 0; } if (acc >= D.beatUi) { acc = 0; render(); } });
// one height for every page: each is laid out once, the tallest sets the panel, the others fill it (Albert: menus never move)
let PANEL = 0; function sizePanel() { const el = $('panel'), keep = S.tab; PANEL = 0; let h = 0; const keepH = S.htab; for (const t of Object.keys(SCREENS)) if (t !== 'Start') for (const ht of t === 'Hall' ? ['Town', 'Relations', 'Misfits'] : [S.htab]) { S.tab = t; S.htab = ht; render(true); h = Math.max(h, el.offsetHeight); } S.htab = keepH; PANEL = h; S.tab = keep; render(true); }
addEventListener('resize', sizePanel); let sized = false; // sized once the modules and fonts are in (the first start)
FK.on('start', () => { if (!sized) { sized = true; (document.fonts ? document.fonts.ready : Promise.resolve()).then(sizePanel); } S.subject = null; S.ghost = null; S.arming = false; S.target = null; S.last = ''; const h = things().find((t) => t.side === 0 && FK.has(t, 'Seat')); if (h) { const [cw] = FK.size(); FK.cam.x = h.vx; FK.cam.y = h.vy; FK.cam.z = (cw * D.openShare) / (h.n * D.tile); FK.keepOn(); } render(true); }); // the game opens on the player's hall
return { read, act, VERBS, S, render };
})();
