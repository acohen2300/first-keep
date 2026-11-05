'use strict';
// First Keep v100 · menu.js (floor 8): everything on the glass. Lives alone; it reads the world through one function, read(), and acts through one, act(verb, arg), backed by VERBS, where every verb carries its own whyNot. A dim button never runs: it says why. One cell mold (slot 44, gap 6), the dictionary's fonts.
window.MENU = (() => {
const { D, B, U, SIDES, N, show } = FK, things = FK.things, units = FK.units;
Object.assign(D, { beatUi: 0.25, toast: 2.5 }); // D162 the glass redraws this often, D163 a reason stays this long
const LAYERS = [['G', 'Grid'], ['Z', 'Zones'], ['T', 'Things'], ['R', 'Rim'], ['B', 'Buildings'], ['U', 'Units'], ['K', 'Climate'], ['V', 'View']]; // the codes and their floors; Lock is a mark for us (no floor is locked yet)
const GROUPS = { Town: ['BTC1', 'BR1', 'BCL1'], Camps: ['BI1', 'BI2', 'BI3'], Army: ['BM1', 'BM2', 'BM3', 'BM4'], Walls: ['BW1', 'BW2', 'BW3', 'BW4'] };
const ICON = { food: '🍖', wood: '🪵', gold: '🪙', stone: '🪨', iron: '⛓' };
const css = document.createElement('style'); css.textContent = `
#ui { position: fixed; left: var(--gap); right: var(--gap); bottom: calc(env(safe-area-inset-bottom, 0px) + var(--gap)); display: flex; flex-direction: column; gap: var(--gap); pointer-events: none; }
#ui > * { pointer-events: auto; }
.row { display: flex; gap: var(--gap); }
.cell { flex: 1; min-width: 0; height: var(--slot); box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 0 8px; background: #2a1d13; color: #ece5d3; border: 1px solid #785c3a; border-radius: 6px; font: inherit; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cell.on { border: 2px solid #e6b947; color: #e6b947; } .cell.dim { opacity: .45; } .cell.w1 { flex: 0 0 var(--slot); padding: 0; } .cell.w2 { flex: 0 0 calc(2 * var(--slot) + var(--gap)); } .cell.txt { justify-content: flex-start; }
#card { background: #2a1d13; border: 1px solid #785c3a; border-radius: 6px; padding: 8px 10px; display: none; flex-direction: column; gap: var(--gap); } #card.on { display: flex; }
#card h2 { font-family: var(--display); font-weight: 400; font-size: 18px; color: #e6b947; margin: 0; } #card p { margin: 0; font-size: 12px; opacity: .8; }
#panel { display: none; flex-direction: column; gap: var(--gap); } #panel.on { display: flex; }
#strip { display: flex; gap: var(--gap); overflow-x: auto; scrollbar-width: none; } #strip .cell { flex: 0 0 auto; }
#top { flex-wrap: wrap; height: auto; min-height: var(--slot); padding: 4px 12px; row-gap: 0; } #top #store { flex: 1 0 100%; margin: 0; font-size: 13px; } #seed { display: none; }
#toast { position: fixed; left: 50%; top: calc(env(safe-area-inset-top, 0px) + var(--slot) + 3 * var(--gap)); transform: translateX(-50%); background: #2a1d13; border: 1px solid #e6b947; color: #e6b947; border-radius: 6px; padding: 6px 12px; font-size: 13px; opacity: 0; transition: opacity .3s; pointer-events: none; max-width: 80vw; }`;
document.head.appendChild(css);
const ui = document.createElement('div'); ui.id = 'ui'; ui.innerHTML = '<div id="card"></div><div id="panel"></div><div id="bar" class="row"></div>'; document.body.appendChild(ui);
const toastEl = document.createElement('div'); toastEl.id = 'toast'; document.body.appendChild(toastEl);
const $ = (id) => document.getElementById(id);
const S = { tab: null, group: 'Town', ghost: null, arming: false, subject: null, lock: {}, last: '', toastT: 0 }; // the glass's own state, nothing of the world's
try { Object.assign(S.lock, JSON.parse(localStorage.getItem('fk.lock') || '{}')); } catch (e) {}
const toast = (msg) => { toastEl.textContent = msg; toastEl.style.opacity = 1; S.toastT = D.toast; };
const costText = (c) => Object.entries(c || {}).filter(([, n]) => n > 0).map(([y, n]) => `${ICON[y]}${n}`).join(' ') || 'free';
const own = (t) => t && t.side === 0;
const isVil = (u) => u && u.kind === 'unit' && u.code === 'UV' && own(u);
const isSoldier = (u) => u && u.kind === 'unit' && own(u) && WAR.armed(u);
const isFind = (t) => t && t.kind !== 'unit' && t.kind !== 'bld' && ECON.yieldOf(t);
// read: the one window onto the world the glass draws from
function read() { const s = SIDES[0], r = ECON.result(); return { store: s.store, pop: ECON.popOf(0), cap: ECON.popCap(0), age: D.ages[s.age], aging: s.aging, ageCost: ECON.ageCost(0), jobs: ECON.jobs(0), rally: s.rally, army: WAR.armyOf(0).length, wave: WAR.waves[0], sel: FK.sel(), subject: S.subject, time: ECON.time(), left: Math.max(0, D.bell - ECON.time()), score: ECON.score(0), theirs: ECON.score(D.players[1]), result: r }; }
// VERBS: every way the player may act, each with its reason not to. act() asks whyNot first; a reason stops it and is said
const VERBS = {
  show: { label: (c) => 'Show', whyNot: () => '', run: (c) => { show[c] = !show[c]; FK.dirty(); } },
  lock: { label: () => 'Lock', whyNot: () => '', run: (c) => { S.lock[c] = !S.lock[c]; try { localStorage.setItem('fk.lock', JSON.stringify(S.lock)); } catch (e) {} } },
  fast: { label: () => 'Fast', whyNot: () => '', run: () => { show.fast = !show.fast; } },
  new: { label: () => 'New', whyNot: () => '', run: () => FK.restart() },
  job: { label: (y, n) => (n > 0 ? '+' : '−'), whyNot: (y, n) => (n > 0 && !ECON.villagersOf(0).length ? 'No villagers' : n < 0 && !ECON.jobs(0)[y] ? `No one on ${y}` : ''), run: (y, n) => { if (!ECON.assign(0, y, n)) toast(n > 0 ? `No ${y} within reach` : `No one on ${y}`); } },
  rally: { label: (y) => '★', whyNot: () => '', run: (y) => { SIDES[0].rally = SIDES[0].rally === y ? null : y; } },
  ageUp: { label: () => 'Age up', whyNot: () => { const c = ECON.ageCost(0); return !c ? 'Last age' : SIDES[0].aging ? 'Already rising' : !ECON.canPay(0, c) ? `Needs ${costText(c)}` : ''; }, run: () => ECON.ageUp(0) },
  pick: { label: (c) => B[c][0], whyNot: (c) => (!ECON.canPay(0, D.cost[c] || {}) ? `Needs ${costText(D.cost[c])}` : ''), run: (c) => { S.ghost = { code: c, i: -99, j: -99, ok: false }; S.arming = false; } },
  build: { label: () => 'Build', whyNot: () => (!S.ghost ? 'Pick a building' : !S.ghost.ok ? 'Not here: it needs flat, free ground' : ''), run: () => { const g = S.ghost, t = ECON.plan(0, g.code, g.i, g.j); if (!t) return toast('Not here'); const sel = FK.sel(), u = isVil(sel) ? sel : ECON.villagersOf(0).find((v) => v.job === 'idle' || v.job === 'wait') || ECON.villagersOf(0)[0]; if (u) ECON.buildAt(u, t); S.ghost = null; FK.dirty(); } },
  cancel: { label: () => 'Cancel', whyNot: () => '', run: () => { S.ghost = null; S.arming = false; FK.dirty(); } },
  group: { label: (g) => g, whyNot: () => '', run: (g) => { S.group = g; } },
  target: { label: () => 'Set target', whyNot: () => '', run: () => { S.arming = !S.arming; S.ghost = null; if (S.arming) toast('Tap the map to aim'); } },
  attack: { label: () => 'Attack', whyNot: () => (!WAR.armyOf(0).length ? 'No soldiers' : S.target == null ? 'Aim first' : ''), run: () => { WAR.attack(0, S.target); } },
  recall: { label: () => 'Recall', whyNot: () => (!WAR.armyOf(0).length ? 'No soldiers' : ''), run: () => WAR.recall(0) },
  train: { label: (c) => `${U[c][0]} ${costText(D.cost[c])}`, whyNot: (c, b) => (b.done < 1 ? 'Not built yet' : !ECON.canPay(0, D.cost[c]) ? `Needs ${costText(D.cost[c])}` : ECON.popOf(0) >= ECON.popCap(0) ? 'No room: build a home' : ''), run: (c, b) => ECON.queue(b, c) },
  untrain: { label: () => '−', whyNot: (b) => (!b.q || !b.q.length ? 'Nothing queued' : ''), run: (b) => ECON.unqueue(b) },
  stop: { label: () => 'Stop', whyNot: (u) => (u.job === 'idle' ? 'Already idle' : ''), run: (u) => { if (u.load) ECON.carry(u); else ECON.idle(u); } },
  gather: { label: () => 'Gather', whyNot: (t) => (!isVil(FK.sel()) ? 'Pick a villager' : ''), run: (t) => ECON.gatherAt(FK.sel(), t) },
  send: { label: () => 'Send one', whyNot: (t) => (!ECON.villagersOf(0).some((v) => v.job === 'idle' || v.job === 'wait') ? 'No idle villager' : ''), run: (t) => { const u = ECON.villagersOf(0).filter((v) => v.job === 'idle' || v.job === 'wait').sort((a, b) => Math.hypot(a.bx - t.bx, a.by - t.by) - Math.hypot(b.bx - t.bx, b.by - t.by))[0]; ECON.gatherAt(u, t); } },
  raise: { label: (t) => (t.done < 1 ? 'Raise' : 'Repair'), whyNot: (t) => (!isVil(FK.sel()) ? 'Pick a villager' : t.done >= 1 && t.hp >= t.hpMax ? 'Not hurt' : ''), run: (t) => ECON.buildAt(FK.sel(), t) },
  scrap: { label: (t) => (t.done < 1 ? 'Cancel site' : 'Demolish'), whyNot: (t) => (t.code === 'BTC1' && t.done >= 1 ? 'The hall stays' : ''), run: (t) => { ECON.cancel(t); S.subject = null; } },
  fight: { label: () => 'Attack this', whyNot: (t) => (!isSoldier(FK.sel()) ? 'Pick a soldier' : ''), run: (t) => WAR.fight(FK.sel(), t) },
  here: { label: () => 'Soldiers here', whyNot: (t) => (!WAR.armyOf(0).length ? 'No soldiers' : ''), run: (t) => WAR.attack(0, t.kind === 'bld' ? FK.tileAt(t.bx, t.by) : t.k) },
};
function act(verb, arg, arg2) { const v = VERBS[verb], why = v.whyNot(arg, arg2); if (why) { toast(why); return false; } v.run(arg, arg2); render(true); return true; }
// the cells: one mold; a verb's cell is dim when its whyNot says so, and a dim cell only says why
const cell = (text, cls = '', on = null) => `<button class="cell ${cls}" ${on ? `data-v="${on.join('|')}"` : ''}>${text}</button>`;
const vcell = (verb, arg, arg2, cls = '', on = false) => { const v = VERBS[verb], a = ARGS[arg] ?? arg, a2 = ARGS[arg2] ?? arg2, why = v.whyNot(a, a2); return cell(v.label(a, a2), `${cls} ${why ? 'dim' : ''} ${on ? 'on' : ''}`, [verb, String(arg ?? ''), String(arg2 ?? '')]); };
const ARGS = {}; // a cell's object arguments live here by key, since the DOM holds strings
const key = (o) => { const k = o.kind + (o.code || '') + (o.k ?? o.i + '_' + o.j) + (o.side ?? ''); ARGS[k] = o; return k; };
function page(r) {
  if (S.tab === 'Layers') return LAYERS.map(([c, name]) => `<div class="row">${cell(`${c} · ${name}`, 'txt')}${vcell('show', c, null, 'w2', show[c])}${vcell('lock', c, null, 'w2', S.lock[c])}</div>`).join('') + `<div class="row">${vcell('fast', null, null, '', show.fast)}${vcell('new')}</div>`;
  if (S.tab === 'Jobs') { const j = r.jobs; return `<div class="row">${cell(`People ${r.pop}/${r.cap}`, 'txt')}${cell(`🔨 ${j.build} · idle ${j.idle}`, 'txt')}</div>` + ECON.YIELDS.map((y) => `<div class="row">${cell(`${ICON[y]} ${y} · ${j[y]}`, 'txt')}${vcell('rally', y, null, 'w1', r.rally === y)}${vcell('job', y, -1, 'w1')}${vcell('job', y, 1, 'w1')}</div>`).join('') + `<div class="row">${cell(r.aging ? `${r.age} → next in ${Math.ceil(r.aging)}s` : `${r.age}${r.ageCost ? ' · next ' + costText(r.ageCost) : ''}`, 'txt')}${vcell('ageUp', null, null, 'w2', !!r.aging)}</div>`; }
  if (S.tab === 'Build') return S.ghost ? `<div class="row">${cell(`${B[S.ghost.code][0]} · press and slide on the map`, 'txt')}</div><div class="row">${vcell('build', null, null, '', S.ghost.ok)}${vcell('cancel')}</div>`
    : `<div class="row">${Object.keys(GROUPS).map((g) => vcell('group', g, null, '', S.group === g)).join('')}</div><div id="strip">${GROUPS[S.group].map((c) => vcell('pick', c, null, '', false).replace('</button>', `<span style="opacity:.7;font-size:11px">${costText(D.cost[c])}</span></button>`)).join('')}</div>`;
  if (S.tab === 'War') return `<div class="row">${cell(`Soldiers ${r.army}${r.wave ? ' · in the field' : ''}`, 'txt')}${vcell('target', null, null, 'w2', S.arming)}</div><div class="row">${vcell('attack')}${vcell('recall')}</div>`;
  return '';
}
function cardText(r) { const t = S.subject; if (!t) return '';
  if (t.kind === 'unit') { const st = WAR.stat(t), facts = `${t.hp != null ? Math.ceil(t.hp) + '/' + t.hpMax + ' health' : ''}${t.code === 'UV' ? ` · ${ECON.jobOf(t) || t.job}${t.load ? `, carrying ${Math.floor(t.load)}` : ''}` : ` · ${t.job}`}`;
    const acts = own(t) ? (t.code === 'UV' ? vcell('stop', key(t)) : `${vcell('recall')}`) : isSoldier(r.sel) ? vcell('fight', key(t)) : WAR.armed(t) || t.side < 0 ? vcell('here', key(t)) : '';
    return `<h2>${U[t.code][0]}${t.side >= 0 && !own(t) ? ' (theirs)' : ''}</h2><p>${facts}</p>${acts ? `<div class="row">${acts}</div>` : ''}`; }
  if (t.kind === 'bld') { const name = B[t.code][0], k = key(t), facts = t.done < 1 ? `site · ${Math.floor(t.done * 100)}% raised` : `${Math.ceil(t.hp)}/${t.hpMax} health${t.q && t.q.length ? ` · training ${t.q.map((c) => U[c][0]).join(', ')} (${Math.ceil(t.qt)}s)` : ''}`;
    if (!own(t)) return `<h2>${name} (theirs)</h2><p>${facts}</p><div class="row">${isSoldier(r.sel) ? vcell('fight', k) : ''}${vcell('here', k)}</div>`;
    const trains = (D.trains[t.code] || []).map((c) => vcell('train', c, k)).join('');
    return `<h2>${name}</h2><p>${facts}</p>${trains ? `<div class="row">${trains}${t.q && t.q.length ? vcell('untrain', k, null, 'w1') : ''}</div>` : ''}<div class="row">${t.code === 'BTC1' && t.done >= 1 ? vcell('ageUp', null, null, '', !!r.aging) : ''}${vcell('raise', k)}${vcell('scrap', k)}</div>`; }
  return `<h2>${t.kind}</h2><p>${Math.floor(t.amount)} ${ECON.yieldOf(t)} left</p><div class="row">${vcell('gather', key(t))}${vcell('send', key(t))}</div>`;
}
let acc = 0;
function render(force) { const r = read();
  const st = ECON.YIELDS.map((y) => `${ICON[y]}${Math.floor(r.store[y])}`).join(' ') + ` · ${r.pop}/${r.cap} · ${r.age} · ${Math.floor(r.left / 60)}:${String(Math.floor(r.left % 60)).padStart(2, '0')}`; if ($('store').textContent !== st) $('store').textContent = st;
  if (r.result) { S.tab = null; S.ghost = null; const you = r.result.winner === 0; $('card').className = 'on'; $('card').innerHTML = `<h2>${you ? 'You hold the keep' : 'The keep falls'}</h2><p>${r.result.how === 'bell' ? 'The bell rang' : you ? 'Their hall fell' : 'Your hall fell'} · you ${r.score.total}, they ${r.theirs.total}</p><div class="row">${vcell('new')}</div>`; $('panel').className = ''; return; }
  if (S.subject && (S.subject.kind === 'unit' ? units().indexOf(S.subject) < 0 : things().indexOf(S.subject) < 0)) S.subject = null;
  const html = page(r), card = cardText(r), sig = html + card + S.tab; if (!force && sig === S.last) return; S.last = sig;
  $('panel').innerHTML = html; $('panel').className = S.tab ? 'on' : ''; $('card').innerHTML = card; $('card').className = card ? 'on' : '';
  $('bar').innerHTML = ['Layers', 'Jobs', 'Build', 'War'].map((t) => cell(t, S.tab === t ? 'on' : '', ['tab', t])).join('');
}
ui.addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (!b) return; const [verb, a, a2] = b.dataset.v.split('|'), arg = ARGS[a] ?? (a === '' ? null : isNaN(a) ? a : Number(a)), arg2 = ARGS[a2] ?? (a2 === '' ? null : isNaN(a2) ? a2 : Number(a2));
  if (verb === 'tab') { S.tab = S.tab === a ? null : a; if (S.tab !== 'Build') S.ghost = null; if (S.tab !== 'War') S.arming = false; render(true); return; } act(verb, arg, arg2); });
// the ghost: press and slide on the map moves it; the tile under the finger is its middle. Build confirms. Nothing of this reaches the canvas's own pan while a ghost is up
const canvas = document.getElementById('map');
const tileUnder = (px, py) => { const [cw, ch] = FK.size(), c = FK.cam, vx = c.x + (px - cw / 2) / c.z, vy = c.y + (py - ch / 2) / c.z, [sx, sy] = FK.fromBoard(vx, (vy + D.land * Math.cos(FK.A.rise * Math.PI / 180)) / Math.sin(FK.A.rise * Math.PI / 180)); return [Math.floor(sx / D.tile), Math.floor(sy / D.tile)]; };
const ghostTo = (px, py) => { const g = S.ghost, [i, j] = tileUnder(px, py), n = B[g.code][1]; g.i = i - Math.floor(n / 2); g.j = j - Math.floor(n / 2); g.ok = ECON.canPlace(g.code, g.i, g.j); FK.dirty(); };
let pressing = false;
for (const ev of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) canvas.addEventListener(ev, (e) => { if (!S.ghost) return; if (ev === 'pointerdown') pressing = true; if (ev === 'pointerup' || ev === 'pointercancel') { pressing = false; render(true); } if (pressing && (ev === 'pointerdown' || ev === 'pointermove')) ghostTo(e.clientX, e.clientY); e.stopImmediatePropagation(); }, true);
FK.on('draw', (ctx, s) => { const g = S.ghost; if (!g || g.i < -50) return; const n = B[g.code][1], T = D.tile, h = FK.H[Math.max(0, g.j) * N + Math.max(0, g.i)] ?? D.land, P = (sx, sy) => FK.toScreen(...FK.toView(...FK.toBoard(sx, sy), Math.max(D.land, h)));
  ctx.save(); ctx.globalAlpha = 0.5; const [bx, by] = FK.toBoard((g.i + n / 2) * T, (g.j + n / 2) * T), [vx, vy] = FK.toView(bx, by, Math.max(D.land, h)), [x, y] = FK.toScreen(vx, vy); FK.blit(FK.bldSprite(g.code, SIDES[0].col, s), x, y, s); ctx.globalAlpha = 0.9;
  ctx.strokeStyle = g.ok ? '#5fd08a' : '#ff6b5b'; ctx.lineWidth = 2; ctx.beginPath(); [[0, 0], [n, 0], [n, n], [0, n]].forEach(([a, b], q) => { const [px, py] = P((g.i + a) * T, (g.j + b) * T); q ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); ctx.stroke(); ctx.restore(); });
// the tap: the glass answers first. A ghost takes it; aiming takes it; a unit or a thing under it becomes the subject, and a picked villager or soldier is sent at it
const under = (k) => things().find((t) => t.kind === 'bld' ? k % N >= t.i && k % N < t.i + t.n && Math.floor(k / N) >= t.j && Math.floor(k / N) < t.j + t.n : t.k === k && !t.deep);
FK.on('tap', (k, mine, px, py) => {
  if (S.ghost) { ghostTo(px, py); return true; }
  if (S.arming) { if (k < 0) return true; S.target = k; S.arming = false; toast('Aimed'); render(true); return true; }
  let other = null; for (const u of units()) if (u.side !== 0 && FK.inSight(u.k)) { const [x, y] = FK.toScreen(u.vx, u.vy), d = Math.hypot(x - px, y - py + 8 * FK.cam.z); if (d < 16 && (!other || d < other[1])) other = [u, d]; }
  const sel = FK.sel(), t = mine || (other && other[0]) || (k >= 0 && FK.inSight(k) ? under(k) : null);
  if (mine) { FK.select(mine); S.subject = mine; render(true); return true; }
  if (t && t.kind === 'unit') { if (isSoldier(sel) && WAR.enemies(sel, t)) { WAR.fight(sel, t); return true; } if (isVil(sel) && t.side < 0 && t.code === 'MW3') { toast('Hunting is not built yet'); } S.subject = t; render(true); return true; }
  if (t) { if (isVil(sel)) { if (isFind(t)) { ECON.gatherAt(sel, t); return true; } if (t.kind === 'bld' && own(t) && (t.done < 1 || t.hp < t.hpMax)) { ECON.buildAt(sel, t); return true; } } if (isSoldier(sel) && t.kind === 'bld' && !own(t)) { WAR.fight(sel, t); return true; } S.subject = t; render(true); return true; }
  if (!sel) S.subject = null; else if (isSoldier(sel) && k >= 0 && FK.walkable(k)) { WAR.march(sel, k); return true; }
  render(true); return false;
});
FK.on('tick', (dt) => { acc += dt / (show.fast ? D.fast : 1); if (S.toastT > 0) { S.toastT -= dt / (show.fast ? D.fast : 1); if (S.toastT <= 0) toastEl.style.opacity = 0; } if (acc >= D.beatUi) { acc = 0; render(); } });
FK.on('start', () => { S.subject = null; S.ghost = null; S.arming = false; S.target = null; S.last = ''; const h = things().find((t) => t.kind === 'bld' && t.side === 0 && t.code === 'BTC1'); if (h) { FK.cam.x = h.vx; FK.cam.y = h.vy + 40; FK.cam.z = 2.2; FK.keepOn(); } render(true); }); // the game opens on the player's hall
return { read, act, VERBS, S, render };
})();
