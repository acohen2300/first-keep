// ═════ 13-cards.js ═════
// ───────────────────────── The cards: one engine, one table ─────────────────────────
// A card is a page of the book. CARDS[type] writes its page from the game's tables; the engine lays the new page over the old one
// node by node, so only the words and numbers that changed are touched and a button under a finger stays the same button.
function openCard(c) { hideStrip(); G.card = c; G.infoOpen = false; G.confirm = null; cardSig = ''; $('card').scrollTop = 0; tick(); renderCard(); }
function closeCard() { if (G) { G.card = null; tick(); } $('card').hidden = true; }   // the ticker steps aside or back at once, so the card gets its room on the first frame
let cardSig = '';
const sig = x => x.nodeType === 3 ? '#' : x.nodeName + '|' + (x.getAttribute('data-act') || x.getAttribute('data-f') || x.getAttribute('class') || '');
function patchKids(a, b) {
  const B = [...b.childNodes];
  B.forEach((y, i) => {
    const x = a.childNodes[i], k = sig(y);
    let m = x && sig(x) === k ? x : null;
    if (!m) for (let j = i + 1; j < a.childNodes.length; j++) if (sig(a.childNodes[j]) === k) { m = a.childNodes[j]; a.insertBefore(m, x); break; }   // a line came or went above it: the same node moves up, it is not rebuilt
    if (!m) { a.insertBefore(y, x || null); return; }
    if (m.nodeType === 3) { if (m.nodeValue !== y.nodeValue) m.nodeValue = y.nodeValue; } else patch(m, y);
  });
  while (a.childNodes.length > B.length) a.lastChild.remove();
}
function patch(a, b) {
  const own = a.nodeName === 'DETAILS' && a.dataset.f === b.dataset.f;   // a fold the player is opening or closing keeps its own state
  for (const { name, value } of [...b.attributes]) if (!(own && name === 'open') && a.getAttribute(name) !== value) a.setAttribute(name, value);
  for (const { name } of [...a.attributes]) if (!(own && name === 'open') && !b.hasAttribute(name)) a.removeAttribute(name);
  patchKids(a, b);
}
const tpl = document.createElement('div');
function patchHTML(el, html) { tpl.innerHTML = html; patchKids(el, tpl); }
// ── the pieces every card is made of
const cap1 = t => t && t.indexOf('<') < 0 ? t.replace(/(^|· )([a-z])/g, (m, a, c) => a + c.toUpperCase()) : t;   // sentence case: a capital opens every label and every part after a dot
const btn = (act, title, sub, cls) => `<button data-act="${act}" class="${cls || ''}"><b>${cap1(title)}</b>${sub ? `<small${sub.startsWith('short ') ? ' class="need"' : ''}>${cap1(sub)}</small>` : ''}</button>`;   // a sub-line that says what is short reads in red
const FOLD = new Set();   // explanations live behind a small fold, closed unless you opened it; it stays as you left it while the card redraws
// the book entry of a research step: the date, what it changed, and its weight, which is its cost
const techBook = t => `<p><b>${t.name}</b>${t.when ? ` · ${t.when}` : ''}${t.w ? ` · weight ${t.w} of 10` : ''}: ${t.desc}${WHY[t.id] ? ` ${WHY[t.id]}` : ''}${t.w ? ` Cost and time ×${(0.5 + 0.1 * t.w).toFixed(1)} for its age.` : ''}</p>`;
const twoTabs = (key, opts, cur) => `<div class="acts tabs">${opts.map(([k, t, sub]) => btn(`${key}:${k}`, (ICON.tab[k] || '') + t, sub, cur === k ? 'on' : '')).join('')}</div>`;   // two-sided cards, one mold: two tabs; the chosen one is lit
const INFO = new Set(['why', 'bmore', 'about', 'menu', 'bnabout']); let infoBuf = [];   // the explaining text of a card waits behind the book icon
const fold = (id, title, html) => INFO.has(id) ? (html && infoBuf.push(html), '') : html ? `<details class="fold" data-f="${id}"${FOLD.has(id) ? ' open' : ''}><summary>${title}</summary>${html}</details>` : '';
const hpBar = (f, col) => `<div class="hp"><i style="width:${Math.round(100 * clamp(f, 0, 1))}%;background:${col}"></i></div>`;
const sec = t => `<div class="sec">${t}</div>`;
const acts = (h, cls) => `<div class="acts${cls ? ' ' + cls : ''}">${h}</div>`;
const title = (t, who) => `<h3>${t}<span class="who">${who}</span></h3>`;
const unitLine = (o, k) => { const S = stats(o, k), U = UNIT[k]; return `<p><b>${S.name}:</b> ${U.desc}${U.civ ? ` <i>${CIVS[U.civ].name} only.</i>` : ''}</p>`; };
const VS_WORD = { mounted: 'anything on horseback', infantry: 'foot soldiers', civ: 'workers and caravans', heavy: 'armoured troops', archer: 'archers', elephant: 'elephants', siege: 'siege engines' };
function beatsText(o, k) {
  const S = stats(o, k), out = Object.entries(S.vs || {}).map(([t, m]) => `${UNIT[t] ? plural(stats(o, civKind(o, t)).name.toLowerCase()) : VS_WORD[t] || t + 's'} ×${m}`);
  if (UNIT[k].bld && UNIT[k].bld !== 1) out.push(`buildings ×${UNIT[k].bld}`);
  if (UNIT[k].bonly) out.push('buildings only');
  return out.join(', ');
}
function trainButtons(kinds) {
  const p = G.P[0];
  return kinds.map(k => { const ck = civKind(0, k), U = UNIT[ck], why = trainWhy(0, k), n = queuedOf(0, k);
    const full = U.cls && clsCount(0, U.cls) >= clsMax(U.cls, 0);
    const cost = unitCost(0, ck), sub = U.age > p.age ? `${AGES[U.age].name} age` : !ready(0, U.at).length ? `needs a ${BLD[U.at].name.toLowerCase()}` : full ? `short of room ${clsCount(0, U.cls)}/${clsMax(U.cls, 0)}` : !afford(p, cost) ? `short ${need(cost)}` : costText(cost);
    return btn(`train:${k}`, stats(0, ck).name, sub + (n ? ` ×${n}` : ''), why ? 'dis' : ''); }).join('');
}
// Research, in four looks you can tell without reading: ready (wax seal), short of something (red ink, what is missing), busy, locked (faded)
function techState(t) {
  if (G.P[0].techs.has(t.id)) return 'done';
  const why = researchWhy(0, t.id);
  return !why ? 'ready' : why === 'Being researched.' || why === 'That line is full.' ? 'busy' : why.startsWith('Not enough') ? 'short' : 'locked';
}
function techBtn(t, withAt) {
  const st = techState(t);
  const sub = st === 'busy' ? 'researching' : st === 'short' ? `short ${need(t.cost)}` : st === 'locked' ? researchWhy(0, t.id).replace(/\.$/, '') : costText(t.cost);
  return btn(`tech:${t.id}`, t.name, sub + (withAt ? ` · ${BLD[t.at].name}` : ''), `a${t.age} ` + (st === 'ready' ? 'go' : st === 'short' ? 'dis short' : st === 'busy' ? 'dis' : 'dis lock'));   // a${age}: the top edge wears the age's colour
}
const trainsAt = kind => Object.keys(UNIT).filter(k => (UNIT[k].at === kind || (UNIT[k].also || []).includes(kind)) && !UNIT[k].civ && UNIT[k].cost);
function keepAgeBtn() {   // the next age, as one research button; the reason waits behind the book
  const p = G.P[0], A = AGES[p.age + 1]; if (!A) return '';
  fold('why', 'Why this age?', `<p>${WHY['age' + (p.age + 1)]}</p>`);
  return btn('age', `${A.name} age`, p.aging ? 'advancing' : costText(A.cost), p.aging || !afford(p, A.cost) ? 'dis' : 'go');
}
// what one of yours is doing, in words read from its state; and what it has done in its life
function statusOf(u) {
  const nm = b => bldName(0, b.kind).toLowerCase();
  if (u.inside) return 'sheltering inside';
  if (u.state === 'school') return `learning at the School, ${Math.ceil(u.schoolT - G.t)} s`;
  if (u.kind === 'vil') {
    if (u.scared) return 'running for shelter';
    if (u.job === 'repair') return !u.rep ? 'looking for work' : u.rep.fire > 0 ? `fighting the fire at the ${nm(u.rep)}` : u.rep.prog < 1 ? `raising the ${nm(u.rep)}, ${Math.round(u.rep.prog * 100)}%` : `mending the ${nm(u.rep)}`;
    if (u.hunt) return `hunting ${UNIT[u.hunt.kind].name.toLowerCase()}`;
    const full = u.carry > 0 && (u.carry >= carryOf(0) - 1e-6 || !u.node || u.node.amt <= 0 || u.carryType !== u.job);
    if (full) return `carrying ${Math.round(u.carry)} ${u.carryType} to the ${u.drop ? nm(u.drop) : 'drop-off'}`;
    if (!u.job) return u.post ? 'standing where you sent them' : 'idle';
    if (!u.node) return `looking for ${u.job}`;
    const n = u.node, at = u.work && G.t - u.work < 0.6, verb = n.kind === 'farm' ? (n.type === 'wood' ? 'tending the coppice' : n.type === 'wool' ? 'tending the flock' : BLD[n.farm.kind].from ? `working the ${nm(n.farm)}` : 'working the field') : { tree: 'chopping', bush: 'picking berries', fish: 'fishing', stone: 'quarrying', gold: 'digging gold', iron: 'digging iron', meat: 'butchering' }[n.kind];
    return at ? `${verb} · ${Math.round(u.carry)} of ${carryOf(0)} ${n.type} in hand` : `walking to the ${nodeName(n).toLowerCase()}`;
  }
  if (u.kind === 'caravan') return u.route ? (u.leg === 'go' ? 'on the way to sell' : u.leg === 'back' ? 'coming home' : 'loading') : u.dest ? 'off to trade with your ally' : 'waiting at the Market';
  if (u.tgt && u.tgt.hp > 0) return `fighting ${u.tgt.q ? `their ${bldName(u.tgt.owner, u.tgt.kind).toLowerCase()}` : UNIT[u.tgt.kind].name.toLowerCase()}`;
  return u.state === 'attack' ? `marching on the ${G.P[u.target] ? G.P[u.target].name : 'enemy'}` : u.state === 'goto' ? (u.idleT > 1 ? 'holding the spot' : 'marching') : u.state === 'escort' ? 'guarding' : u.state === 'shrine' ? 'holding the shrine' : u.state === 'assist' ? 'helping an ally' : u.state === 'sab' ? 'slipping toward a target' : u.levy !== undefined ? `on levy from ${G.P[u.levy].name}` : 'at home';
}
function lifeText(u) {
  const S = u.st || {}, parts = [`${clock(Math.max(0, G.t - (u.bornT || 0)))} old`];
  if (u.kind === 'vil') parts.push(`gathered ${fmt(S.got || 0)} in ${S.trips || 0} ${some(S.trips || 0, 'trip')}`, `raised ${S.built || 0} ${some(S.built || 0, 'building')}`); else if (isSoldier(u)) parts.push(`${S.kills || 0} ${some(S.kills || 0, 'kill')}`);
  parts.push(`walked ${fmt(S.walk || 0)}`); return parts.join(' · ');
}
// the math of a find or a field: what a worker takes a minute (the table's rate after research, soil and season), how many are on it, how long it lasts
function yieldText(n, o) {
  const rate = (n.rate || RATE_OF[n.kind]) * gatherMul(o, n) * 60, wk = n.wk || 0, fin = isFinite(n.amt), carry = carryOf(o);
  return `<p>${wk ? `<i>${wk} at work:</i> ` : ''}each takes ${Math.round(rate)} ${n.type} a minute and carries ${carry} a trip${wk ? `; together about ${Math.round(rate * wk)} a minute` : ''}${fin && wk ? `; gone in about ${clock(n.amt / (rate * wk) * 60)}` : ''}.${fin && n.max > 0 ? ` Taken so far: ${Math.round(n.max - n.amt)} of ${Math.round(n.max)}.` : ''}</p>`;
}
const goodsText = g => GOODK.filter(k => g[k] >= 1).map(k => `${Math.floor(g[k])} ${GOODS[k].name.toLowerCase()}`).join(', ');
const ownTech = t => !t.civ || t.civ === G.P[0].civ;   // research this people can do: the others' elite ranks stay out of sight
const need = c => { const p = G.P[0], miss = {}; for (const r in c) if ((p.res[r] || 0) < c[r]) miss[r] = Math.ceil(c[r] - (p.res[r] || 0)); return costText(miss); };   // what a cost is short of now
const slotText = n => n && n.wk > 0 ? `${n.wk} of ${slotsOf(n)}` : 'nobody yet';
const qName = j => j.kind ? stats(0, j.kind).name : j.muster ? `muster ${j.bn !== undefined ? BN[j.bn] : ''}` : j.tech ? TECHBY[j.tech].name : AGES[j.age].name + ' age';
// the side at war with you whose Town Center is nearest yours
function foeNearest() { const k = keepOf(0); let bd = 1e9, t = null; if (k) for (const q of G.P) if (q.alive && q.id !== WILD && atWar(0, q.id)) { const d = hyp(q.keep[0] - k.x, q.keep[1] - k.y); if (d < bd) { bd = d; t = q.id; } } return t; }
// the odds the computers use (07-ai.js): the square law on strength, bent by who counters whom, against their army, towers and Town Center
function oddsText(S, t) { if (t === null || t === undefined || !S.length) return ''; const r = powerOf(S) / estPower(0, t) * matchup(S, soldiersOf(t)), p = r * r / (1 + r * r); return `odds ${p > 0.65 ? 'strong' : p > 0.4 ? 'even' : 'weak'}`; }

// ── Attack with: on an enemy or a find card, from the whole army or one battalion, how many of each type, then go. The nearest of each type go.
const qsPool = () => armyOf(0).filter(u => u.kind !== 'spy' && u.state !== 'shrine' && (G.qs.from === 'all' || u.bn === G.qs.from));
function qsPick(to) {
  const by = {}; for (const u of qsPool()) (by[u.kind] = by[u.kind] || []).push(u);
  const out = []; for (const k in by) { by[k].sort((a, b) => dist(a, to) - dist(b, to)); out.push(...by[k].slice(0, Math.min(by[k].length, G.qs.n[k] ?? by[k].length))); }
  return out;
}
function qsHTML(verb, label, to) {
  if (!hasCmd()) G.qs.from = 'all';
  let h = hasCmd() ? acts([['all', 'All'], ...BN.map((n, i) => [i, n])].map(([k, n]) => btn(`qsfrom:${k}`, n, String(armyOf(0).filter(u => u.kind !== 'spy' && (k === 'all' || u.bn === k)).length), G.qs.from === k ? 'on' : '')).join(''), 'c4') : '';
  const by = {}; for (const u of qsPool()) by[u.kind] = (by[u.kind] || 0) + 1;
  if (!Object.keys(by).length) return h + `<p>No soldiers${G.qs.from === 'all' ? ' yet: train them at a Barracks, Range or Stable' : ' in ' + BN[G.qs.from]}.</p>`;
  h += Object.entries(by).map(([k, have]) => `<div class="qs"><b>${stats(0, k).name}</b>${btn(`qsn:${k},-`, '−')}<span>${Math.min(have, G.qs.n[k] ?? have)} of ${have}</span>${btn(`qsn:${k},+`, '+')}</div>`).join('');
  const S = qsPick(to), foe = to.owner !== undefined && to.owner !== 0 && to.owner !== WILD ? to.owner : null;
  return h + acts(btn(verb, `${label} ${S.length}`, foe !== null ? oddsText(S, foe) : '', S.length ? (foe !== null ? 'warn' : 'go') : 'dis'), 'c1');
}
// ── The send strip: tap open ground and a small row of choices sits at your finger: a quarter, all, a battalion, more, cancel.
// A quarter takes a quarter of each type, nearest first, so the mix of the army goes along.
const sendable = () => armyOf(0).filter(u => u.kind !== 'spy' && u.state !== 'shrine' && u.state !== 'escort');   // guards keep to what they guard
const onOrder = u => u.state === 'attack' || (u.ord && G.ords && G.ords[u.ord] && !G.ords[u.ord].arrived);   // marching or attacking under an order you gave
const free = () => sendable().filter(u => !onOrder(u));   // All, a quarter, 8 and 12 never pull a raid off its way (Build 38)
const guardsOf = (t, id) => armyOf(0).filter(u => u.state === 'escort' && (t === 'f' ? u.escF === id : u.escId === id));   // up to 12 soldiers escort one caravan or garrison one trade stop
function guardRow(t, id) {
  const n = guardsOf(t, id).length, free = sendable().length, verb = t === 'f' ? 'Garrison' : 'Escort';
  return acts(btn(`guard:${t},${id}`, `${verb} +4`, n >= POST.guard ? `full: ${n}/${POST.guard}` : free ? `${n}/${POST.guard} · ${free} free` : 'no free soldiers', n < POST.guard && free ? '' : 'dis') + btn(`unguard:${t},${id}`, 'Release', n ? `${n} go home` : 'none here', n ? '' : 'dis'));
}
function sendPick(from, to) {   // 'q' a quarter of each type, 'all', 'n8' the nearest eight, or a battalion by its number
  if (typeof from === 'string' && from[0] === 'n') return free().sort((p, q) => dist(p, to) - dist(q, to)).slice(0, Number(from.slice(1)));
  const A = typeof from === 'number' ? sendable() : free(), by = {};
  for (const u of A) if (from === 'q' || from === 'all' || u.bn === from) (by[u.kind] = by[u.kind] || []).push(u);
  const out = []; for (const k in by) { const a = by[k].sort((p, q) => dist(p, to) - dist(q, to)); out.push(...a.slice(0, from === 'q' ? Math.ceil(a.length / 4) : a.length)); }
  return out;
}
function showStrip(sx, sy, x, y) {
  closeCard(); const el = $('strip'), at = `${Math.round(x)},${Math.round(y)}`, to = { x, y }, n = from => sendPick(from, to).length;
  const bns = hasCmd() ? BN.map((nm, i) => [i, nm]).filter(([i]) => n(i)) : [];
  const nAll = n('all'), quick = [8, 12].filter(k => nAll > k).map(k => btn(`sendto:n${k},${at}`, String(k), 'quick')).join('');   // a quick 8 or 12: the nearest free ones
  el.innerHTML = (nAll ? btn(`sendto:q,${at}`, 'Send ¼', String(n('q')), 'go') + quick + btn(`sendto:all,${at}`, 'All', String(nAll)) + bns.map(([i, nm]) => btn(`sendto:${i},${at}`, nm, String(n(i)))).join('') : '')
    + btn(`more:${at}`, '⋯', '') + `<button data-act="nostrip" aria-label="Cancel">✕</button><small class="sn">Hold, then drag to box a group</small>`;
  el.hidden = false; G.strip = to;
  const r = $('stage').getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
  el.style.left = clamp(sx - w / 2, 4, r.width - w - 4) + 'px'; el.style.top = clamp(sy - h - 18, 4, r.height - h - 4) + 'px';
}
function hideStrip() { const el = $('strip'); if (el && !el.hidden) { el.hidden = true; if (G) G.strip = null; } }
// ── the War Council: six battalions, what each holds by type, its stance and formation
function musterGap(i) {   // what a battalion still lacks: its plan, less the members it has and the soldiers already mustering for it
  const gap = { ...G.bnPlan[i] };
  for (const u of armyOf(0)) if (u.bn === i && gap[u.kind]) gap[u.kind]--;
  for (const b of G.blds) if (b.owner === 0) for (const j of b.q) if (j.muster && j.bn === i) for (const k in j.muster) gap[k] = (gap[k] || 0) - j.muster[k];
  for (const k in gap) if (gap[k] <= 0) delete gap[k];
  return gap;
}

// ───────────────────────── What a building's page says, by kind ─────────────────────────
// The generic page (health, crew, train, research, more) is one function; what a kind adds to it is one line here, never a branch in the page.
const BLD_PAGE = {
  castle: b => { const n = G.units.filter(u => u.owner === 0 && isSoldier(u) && u.hp < u.max && dist(u, b) < GARRISON.r).length; return `<p>Soldiers resting here heal ${GARRISON.heal * fxv(0, 'garrison').m} a second${n ? `: ${n} mending now` : ''}.</p>`; },
  school: b => { const n = schooling(0), S = ready(0, 'school').length; return `<p>Teaching ${n} of ${TEACH.seats * S} seats${fxv(0, 'teach').a < 1 ? ' · research Veterans at the Barracks to send soldiers' : ' · tap a soldier, then Teach'}.</p>`; },
  farm: b => `<p>Worked by ${b.node && b.node.wk > 0 ? slotText(b.node) : 'nobody yet: tap Send a villager' + (b.node && b.node.type === 'food' ? ', or + under Food' : '')}. This season: ${season().name}, ×${season().farm}${G.harvest !== 1 ? ` · this year's harvest ×${G.harvest}` : ''}${WEATHER[G.wx].crop ? ` · ${WEATHER[G.wx].name.toLowerCase()} ×${WEATHER[G.wx].crop}` : ''} · soil ${Math.round((b.fert ?? 1) * 100)}%.</p>` + (b.node ? yieldText(b.node, 0) : ''),
  treefarm: b => `<p>Tended by ${b.node && b.node.wk > 0 ? slotText(b.node) : 'nobody yet: tap Send a villager, or + under Wood'}. ${Math.round(b.node ? b.node.amt : 0)} wood left, then the plot is cut out.</p>`,
  pasture: b => `<p>${b.sheep || 0} sheep: ${b.node && b.node.wk > 0 ? `milk and meat, about ${Math.round((b.sheep || 0) * BLD.pasture.milk * 60 * gatherMul(0, b.node))} food a minute` : 'nobody tends them: tap Send a villager'}. ${Math.floor(b.node ? b.node.amt : 0)} wool to bring in${ready(0, 'workshop').length ? '' : ' · <b>wool waits for a Workshop</b>'}. Shorn each spring, when lambs come too.</p>`,
  throne: b => { const T = G.throne, mine = b.owner === 0; return `<p>${!T ? 'The Natives hold it. Regard opens its gate; siege breaks it.' : `${mine ? 'Yours' : G.P[T.owner].name + ' hold it'} since ${clock(T.since)}: ${clock(Math.max(0, throneHold() - (G.t - T.since)))} to ${mine ? 'win' : 'their win'}. A tithe of ${THRONE.tithe * 100}% of everyone else's gathering, ${THRONE.score} score a minute.`}</p>`; },
  tpost: b => { const f = G.finds.find(x => x.id === b.sid); return f ? `<p>Holds the stop at ${coord(f.x, f.y)}: tap the stop for prices and what it wants.</p>` : ''; },
  council: b => councilHTML(b),
  mint: () => G.P[0].debased ? `<p>The coin is debased: prices at your Market are ×${MINT.price}.</p>` : acts(btn('debase', 'Debase the coin', `+${MINT.debase} gold now · Market prices ×${MINT.price} for good`, 'warn'), 'c1'),
  market: b => marketHTML(b),
};
// A building's line: one slot per order it can hold. A filled slot shows the order and how far along it is; tap it and the order is cancelled, its cost back.
function slotsHTML(b) {
  const n = qMax(0), cells = [];
  for (let i = 0; i < n; i++) { const j = b.q[i]; cells.push(j ? `<button class="slot" data-act="qcancel:${b.id},${i}" style="--p:${i === 0 ? Math.round(100 * (1 - j.left / j.total)) : 0}%" aria-label="Cancel ${qName(j)}">${qName(j)}${i === 0 ? `<br>${Math.ceil(j.left)} s` : ''}<i></i></button>` : `<button class="slot empty" disabled>·</button>`); }
  return `<div class="slots" style="--qn:${n}">${cells.join('')}</div>` + (b.blocked ? '<p><b>Needs room: House, Apartment or Aqueduct.</b></p>' : b.stall > G.t ? `<p><b>Stopped by sabotage: ${Math.ceil(b.stall - G.t)} s.</b></p>` : '');
}
// Relations, at the Town Center: one row per side, the stance you take toward them. Neutral keeps both swords sheathed; Hostile takes effect after notice; Ally needs their yes.
function nativesHTML() {
  const o = 0, r = Math.round(regardOf(o)), rel = G.rel[0][WILD], P = (G.prisoners || []).filter(x => x.o === 0);
  let h = acts(`<div class="lbl"><b>Natives</b><small>regard ${r} · ${REL_WORD[rel].toLowerCase()}</small></div>` + NATIVE.gifts.map(a => btn(`gift:${WILD},${a}`, `Gift ${a}g`, giftWhy(0, a) ? giftWhy(0, a).replace(/\.$/, '') : `regard +${giftGain(0, a)}`, giftWhy(0, a) ? 'dis' : '')).join('') + btn(`rel:${WILD},ally`, 'Ally', rel === 'ally' ? '' : relWhy(0, WILD, 'ally') ? relWhy(0, WILD, 'ally').replace(/\.$/, '') : 'by emissary', rel === 'ally' ? 'on' : relWhy(0, WILD, 'ally') ? 'dis' : ''), 'c4');
  if (P.length) h += sec('Your people held') + acts(P.map((x, i) => btn(`ransom:${i}`, `Ransom ${UNIT[x.kind].name.toLowerCase()}`, `${x.ransom}g · ${x.by === WILD ? 'Natives' : G.P[x.by].name} · ${clock(Math.max(0, x.t + PRISON.secs - G.t))}`, G.P[0].res.g >= x.ransom ? 'warn' : 'dis')).join(''), 'c2');
  { const H = (G.prisoners || []).filter(x => x.by === 0); if (H.length) h += `<p><i>You hold ${H.length}:</i> ${H.map(x => `${G.P[x.o].name}' ${UNIT[x.kind].name.toLowerCase()}`).join(', ')}. Unransomed in ${PRISON.secs / 60} minutes, they serve you.</p>`; }
  return h;
}
function relHTML() {
  let h = sec('Relations') + nativesHTML();
  for (const q of G.P) {
    if (q.id === 0 || q.id === WILD || !q.alive) continue;
    const rel = G.rel[0][q.id], nl = noticeLeft(0, q.id) || noticeLeft(q.id, 0), who = `${q.name}${q.civ ? ' · ' + CIVS[q.civ].name : ''}`;
    if (q.lord === 0 && !q.rebel) { h += `<p><i>${who}:</i> your vassal.</p>`; continue; }
    if (G.P[0].lord === q.id && !G.P[0].rebel) { h += `<p><i>${who}:</i> your overlord.</p>`; continue; }
    h += acts(`<div class="lbl"><b>${q.name}</b><small>${nl ? `hostile in ${nl} s` : q.ally !== null && q.ally !== 0 ? `with ${G.P[q.ally].name}` : q.civ ? CIVS[q.civ].name : ''}</small></div>`
      + ['ally', 'peace', 'war'].map(w => { const why = relWhy(0, q.id, w); return btn(`rel:${q.id},${w}`, REL_WORD[w], w === rel ? '' : why ? why.replace(/\.$/, '') : w === 'war' ? `${NOTICE} s notice` : 'by emissary', w === rel ? 'on' : why ? 'dis' : w === 'war' ? 'warn' : ''); }).join(''), 'c4');
  }
  return h;
}
// a workshop turns what is in store into goods: the same line for every one of them
function workshopHTML(b) {
  const p = G.P[0], n = b.node, B = BLD[b.kind], cur = b.cropT || B.crop, mk = B.makes[cur], [k, r] = Object.entries(mk.from)[0], kn = GOODS[k] ? GOODS[k].name.toLowerCase() : LONG[k], nm = t => GOODS[t] ? GOODS[t].name : RESOURCES[LONG[t]].name, keys = Object.keys(B.makes);
  return (keys.length > 1 ? acts(keys.map(t => btn(`make:${b.id},${t}`, nm(t), `${Object.entries(B.makes[t].from).map(([a, q]) => q + ' ' + (GOODS[a] ? GOODS[a].name.toLowerCase() : LONG[a])).join(', ')} make 1`, t === cur ? 'on' : '')).join(''), 'c2') : '')
    + `<p>In store: ${Math.floor(k in p.res ? p.res[k] : p.goods[k] || 0)} ${kn} (${r} make 1 ${nm(cur).toLowerCase()}, ${Math.round(mk.rate * 60 * fxv(0, 'make', [cur]).m)} a minute). Worked by ${n && n.wk > 0 ? (G.units.some(u => u.node === n && u.wait) ? 'a villager, waiting for ' + kn : 'a villager') : 'nobody yet: tap Send a villager'}.</p>`;
}
function marketHTML(b) {   // the Market's two sides: trade, and caravans and ventures
  const p = G.P[0], more = G.mtab === 'more', V = p.ventures || [], nm = k => GOODS[k] ? GOODS[k].name : RESOURCES[LONG[k]].name; let h = '';
  if (!more) {
    h += sec('Sell · 100 of a resource, 10 of a good') + acts(MKT_SELL.map(k => btn(`trade:sell:${k}`, nm(k), `+${sellPrice(0, k)}g`, haveOf(p, k) < LOT(k) ? 'dis' : '')).join(''), 'c4')
      + sec('Buy') + acts(MKT_BUY.map(k => btn(`trade:buy:${k}`, nm(k), `${buyPrice(0, k)}g`, p.res.g < buyPrice(0, k) ? 'dis' : '')).join(''), 'c4');
    h += fold('prices', 'Going prices', `<p>${MKTK.map(k => `${nm(k)} ×${mkt(k).toFixed(2)}`).join(' · ')} (1 = normal)</p>`);
  } else {
    h += `<p>Two lanes. One: a caravan with a route takes goods from here to a trade stop and sells them. Two: a caravan with no route runs to an ally's Market or Town Center and earns distance² ÷ ${TRADE_DIV}, at most ${TRADE_CAP} gold. ${unitsOf(0, 'caravan').length} caravans; ${allyMarket(0, b) ? 'an ally to trade with' : 'no ally yet'}.</p>`;
    h += sec('Ventures') + `<p>${p.age < VENTURE.age ? 'From the Medieval age: put gold into a merchant venture.' : `Back in a year with ${Math.round((VENTURE.back - 1) * 100)}% more; about 1 in ${Math.round(1 / VENTURE.lost)} is lost.`} ${V.length ? 'Out: ' + V.map(v => `${v.amt}g (${clock(Math.max(0, v.due - G.t))})`).join(', ') + '.' : ''}</p>`;
    if (p.age >= VENTURE.age) h += acts(VENTURE.sizes.map(a => btn(`venture:${a}`, `${a} gold`, '', p.res.g < a || V.length >= VENTURE.max ? 'dis' : '')).join(''), 'c3');
  }
  return h;
}
function councilHTML(b) {
  const p = G.P[0];
  if (!hasCmd()) return `<p>${p.techs.has('engage') ? 'Stances are open: set them in the Army card. Next: Battalions, six of them, Alpha to Zeta.' : 'Research Engagement first: stances for your army. Then Battalions, Formations and Muster.'}</p>`;
  const i = G.bnEdit, plan = G.bnPlan[i], S = armyOf(0).filter(u => u.kind !== 'spy');
  let h = sec('Battalions') + acts(BN.map((n, j) => btn(`bned:${j}`, n, `${S.filter(u => u.bn === j).length} in it`, j === i ? 'on' : '')).join(''), 'c3');
  const kinds = [...new Set([...S.map(u => u.kind), ...Object.keys(plan)])];
  h += sec(`${BN[i]} holds`) + (kinds.length ? kinds.map(k => `<div class="qs"><b>${stats(0, k).name}</b>${btn(`bnn:${k},-`, '−')}<span>${plan[k] || 0} · has ${S.filter(u => u.bn === i && u.kind === k).length}</span>${btn(`bnn:${k},+`, '+')}</div>`).join('') : '<p>Train soldiers first.</p>');
  const f = FORM[G.form[i] || 0];
  h += acts(btn('bnstance', 'Stance: ' + STANCE[G.stance[i] || 0].name, '') + (p.techs.has('formations') ? btn('bnform', 'Formation: ' + f.name, f.note) : ''));
  if (p.techs.has('muster')) { const miss = musterGap(i), why = musterWhy(0, miss), mc = musterCost(0, miss); h += acts(btn(`muster:${i}`, `Muster ${BN[i]}: +${musterN(miss)}`, why ? why.replace(/\.$/, '') : `${costText(mc.cost)} · ${mc.t} s`, why ? 'dis' : 'go'), 'c1'); }
  return h + fold('bnabout', 'About battalions', `<p>New soldiers fill each battalion up to what you set; the rest are the reserve. Send a battalion from the strip: tap open ground, then its name.</p><p><b>Formations:</b> ${FORM.map(F => `${F.name}: ${F.note}`).join('. ')}.</p>`);
}
function keepMoreHTML() {   // the Town Center's More: your people, goods and the whole research tree
  const p = G.P[0], C = CIVS[p.civ];
  let h = acts(btn('dismiss', 'Dismiss villager', 'frees a place'), 'c1');
  h += `<p><i>${C.name}.</i> ${C.bonus} Unique soldier: ${UNIT[C.uu].name}. Wonder: ${C.wonder}.</p>`;
  h += `<p><i>Food:</i> your people eat ${Math.round(p.eats || 0)} a minute${p.hungry ? ' · <b>none left: work and fighting −25%, no training</b>' : ''}. ${vassalsOf(0).length ? `<i>Vassals:</i> ${vassalsOf(0).map(q => `${q.name} (${q.rebel ? 'in revolt' : `unrest ${Math.round(q.unrest)}%`})`).join(', ')}.` : ''}</p>`;
  h += `<p><i>Goods:</i> ${goodsText(p.goods) || 'none yet'}. <i>Wanted by others here:</i> ${G.P.filter(q => q.id && q.id !== WILD && q.alive).map(q => `${q.name} ${q.wants.map(k => GOODS[k].name.toLowerCase()).join(' and ')}`).join('; ')}.</p>`;
  const done = TECH.filter(t => p.techs.has(t.id)), going = [], open = TECH.filter(t => ownTech(t) && !p.techs.has(t.id) && !researchWhy(0, t.id));
  for (const b of G.blds) if (b.owner === 0) b.q.forEach((j, i) => { if (j.tech) going.push(`${TECHBY[j.tech].name}${i === 0 ? ` (${Math.ceil(j.left)} s)` : ' (waiting)'}`); });
  h += `<p><b>Research: ${done.length} of ${TECH.filter(ownTech).length} done.</b>${going.length ? ` <i>Under way:</i> ${going.join(' · ')}.` : ''}${open.length ? ` <i>Ready now:</i> ${open.map(t => `${t.name} (${BLD[t.at].name})`).join(' · ')}.` : ''}</p>`;
  h += AGES.map((A, i) => { const T = TECH.filter(t => ownTech(t) && t.age === i); return T.length ? `<p><b>${A.name}:</b> ${T.map(t => p.techs.has(t.id) ? `<span class="done">✓ ${t.name}</span>` : `<span class="dim">${t.name}</span>`).join(' · ')}</p>` : ''; }).join('');
  return h;
}
function vassalHTML(P) {
  const L = loyaltyParts(P);
  let h = `<p><b>Your vassal.</b> ${P.rebel ? `<b>In revolt</b> since ${clock(G.t - P.rebel.t0)}: kill three quarters of their force to crush it, or they are free in ${clock(Math.max(0, VASSAL.freeAfter - (G.t - P.rebel.t0)))}.` : `Unrest ${Math.round(P.unrest)}% · loyalty ${Math.round(P.loyal)}% · paid ${Math.round(P.paid || 0)} in the last 10 s.`}</p>`;
  if (P.rebel) return h;
  h += sec('Tax · a share of what they gather') + acts(Object.keys(TAX).map(t => btn(`tax:${P.id},${t}`, t[0].toUpperCase() + t.slice(1), `${Math.round(TAX[t].take * 100)}%`, P.tax === t ? 'on' : '')).join(''), 'c3');
  fold('about', 'Loyalty', `<p><i>Loyalty heads for</i> 20 + ${L.invest} (your buildings near them) + ${L.garrison} (your soldiers there) + ${L.protect} (enemies you killed near them) − ${L.hate} (the tax) = <b>${Math.round(L.target)}</b>. Unrest moves by ${TAX[P.tax].push} − loyalty/25 every 10 s.${P.loyal >= VASSAL.shareAt ? ` You get ${VASSAL.share * 100}% of their trade profit.` : ` At ${VASSAL.shareAt} loyalty you get ${VASSAL.share * 100}% of their trade profit;`} ${P.loyal >= VASSAL.giftAt ? 'They send gifts.' : `at ${VASSAL.giftAt} they send gifts.`}</p><p>A demand costs more loyalty each time within two minutes. Forced tribute needs ${DEMAND.tributeMen} of your soldiers at their town. A levied soldier who dies costs ${DEMAND.levyLoyal} loyalty.</p>`);
  // a lord's hand: demand, force, call up, cut loose
  const dc = demandCost(P);
  h += sec(`Demand now · loyalty −${dc}`) + acts(['f', 'w', 's', 'g', 'i'].map(r => btn(`demand:${P.id},${r}`, RESOURCES[LONG[r]].name, `${Math.min(DEMAND.amt, Math.floor(P.res[r]))} of ${Math.floor(P.res[r])}`, P.res[r] > 0 ? '' : 'dis')).join(''), 'c5');
  const tw = tributeWhy(0, P.id), lv = levyOf(0, P.id).length, half = Math.ceil(soldiersOf(P.id).length * DEMAND.levyMax);
  h += acts(btn(`tribute:${P.id}`, 'Force tribute', P.forced > G.t ? `double tax: ${Math.ceil(P.forced - G.t)} s` : tw ? tw.replace(/\.$/, '') : `double tax ${DEMAND.tribute / 60} min · unrest +${DEMAND.tributeUnrest}`, P.forced > G.t ? 'on' : tw ? 'dis' : 'warn') + btn(`breakties:${P.id}`, G.confirm === 'bt' + P.id ? 'Tap again' : 'Break ties', G.confirm === 'bt' + P.id ? 'war, and the others grow wary' : 'cut them loose', 'warn'));
  h += sec(`Call up their soldiers · ${lv} with you`) + acts([4, 8].map(n => btn(`levy:${P.id},${n}`, `+${n}`, levyWhy(0, P.id, n) ? levyWhy(0, P.id, n).replace(/\.$/, '') : 'march to you', levyWhy(0, P.id, n) ? 'dis' : '')).join('') + btn(`levy:${P.id},0`, 'Half', `${half}`, levyWhy(0, P.id, half) ? 'dis' : '') + btn(`release:${P.id}`, 'Release', lv ? `${lv} go home` : 'none', lv ? '' : 'dis'), 'c4');
  return h;
}
function stopHTML(f) {
  const p = G.P[0], from = homeBiz(0, f) || keepOf(0), pt = postAt(f), mine = f.owner === 0, held = stopsHeld(mine ? 0 : f.owner, f.route);
  let h = `<p>Route ${f.route === 0 ? 'west–east' : 'north–south'}. ${f.owner === null ? (pt ? 'A post is going up.' : 'Nobody holds it.') : mine ? `Yours: ${Math.round(POST.cut[held] * 100)}% of everyone else's sales here (you hold ${held} of this route's 4${held === 4 ? `, so it pays ${Math.round(POST.all * 60)} gold a minute` : ''}).` : `Held by ${G.P[f.owner].name}: they take ${Math.round(POST.cut[held] * 100)}% of your sales here.`} Wants <b>${GOODS[f.want].name.toLowerCase()}</b> (×${POST.want}).</p>`;
  h += `<p><i>Paid here, per good from your ${homeBiz(0, f) ? 'Market' : 'Town Center'}:</i> ${WARES.filter(k => k !== 'spice').map(k => `${GOODS[k].name} ${Math.round(priceAt(0, k, f, from))}g`).join(' · ')}. Spice costs ${GOODS.spice.buy}g here.</p>`;
  if (!pt && !guardsLeft(f)) h += acts(btn(`tpost:${f.id}`, 'Build a Trade post', p.age < 1 ? 'Bronze age' : costText(BLD.tpost.cost), p.age < 1 || !afford(p, BLD.tpost.cost) ? 'dis' : 'go'), 'c1');
  if (mine) { const sl = f.sell || {}; h += guardRow('f', f.id) + acts(btn(`want:${f.id}`, `Wanted: ${GOODS[f.want].name.toLowerCase()}`, 'yours: tap to change what it buys dear'), 'c1')
    + sec('Your caravans sell here') + acts(WARES.filter(k => k !== 'spice').map(k => btn(`sellat:${f.id},${k}`, GOODS[k].name, (f.sell ? sl[k] : 1) ? `${Math.floor(p.goods[k] || 0)} in store` : 'kept home', (f.sell ? sl[k] : 1) ? 'on' : '')).join(''), 'c3'); }
  h += acts(btn(`routeto:${f.id}`, 'Send a caravan here', homeBiz(0, f) ? `${unitsOf(0, 'caravan').filter(c => c.route && c.route.to === f.id).length} on this route` : 'needs a Market', homeBiz(0, f) && unitsOf(0, 'caravan').length ? 'go' : 'dis'), 'c1');
  return h;
}
function caravanHTML(u) {
  const r = u.route, t = targetOf(r), h0 = homeBiz(0, u), d = !r && u.dest ? G.blds.find(b => b.id === u.dest) : null;
  let h = `<p>${r && t ? `Lane one: to the trade stop at ${coord(t.x, t.y)}${r.rep ? ', again and again' : ''}. ${u.leg === 'go' ? 'Carrying ' + (goodsText(u.goods || {}) || 'nothing') : u.leg === 'back' ? 'Coming home' + (u.goods && u.goods.spice ? ' with ' + u.goods.spice + ' spice' : '') : 'Loading'}.` : d && d.owner !== 0 ? `Lane two: to ${G.P[d.owner].name}' ${bldName(d.owner, d.kind).toLowerCase()}, ${u.cargo} gold on arrival.` : allyMarket(0, u) ? 'Lane two: on its way to trade with your ally.' : 'No route, and no ally to trade with: it waits at your Market.'}</p>`;
  h += guardRow('c', u.id);
  if (!h0) return h + '<p>Build a Market (Trade) to send goods to the trade stops.</p>';
  const T = tradeTargets(0).map(t => [t, estPay(0, t, h0)]).sort((a, b) => b[1] - a[1]).slice(0, 4);
  h += sec('Send it to') + acts(T.map(([t, v]) => btn(`route:${u.id},s,${t.id}`, `Trade stop ${coord(t.x, t.y)}`, `about ${v}g a load · ${Math.round(dist(h0, t))} away`, r && t === targetOf(r) ? 'on' : '')).join('') || '<p>No stop open: clear one of its guards first.</p>', 'c1');
  if (r) h += acts(btn(`rrep:${u.id}`, 'Repeat', r.rep ? 'on' : 'off', r.rep ? 'on' : '') + btn(`rsp:${u.id}`, 'Buy spice', r.spice ? 'on' : 'off', r.spice ? 'on' : '') + btn(`rclr:${u.id}`, 'No route', 'trade with an ally'));
  return h;
}
function researchHTML() {   // everything you can research, across every building: ready first, then short, then locked
  const p = G.P[0], by = { ready: [], short: [], busy: [], locked: [] }, ageA = AGES[p.age + 1];
  for (const t of TECH) { if (!ownTech(t) || !isNext(0, t)) continue; const s = techState(t); if (s !== 'done') by[s].push(t); }
  const grid = L => acts(L.map(t => techBtn(t, true)).join('')), ageR = ageA && !p.aging && afford(p, ageA.cost) && keepOf(0);
  let h = title('Research', `${by.ready.length + (ageR ? 1 : 0)} ready now`);
  const cap = by.ready.filter(t => t.cap), rest = by.ready.filter(t => !t.cap);
  if (ageR) h += sec('Next age') + acts(keepAgeBtn());
  if (cap.length) h += sec('Room to grow') + grid(cap);
  if (rest.length) h += sec('Ready') + grid(rest);
  if (!by.ready.length && !ageR) h += `<p>Nothing to start right now.</p>`;
  if (by.busy.length) h += sec('Under way') + grid(by.busy);
  if (by.short.length) h += sec('Short of something') + grid(by.short);
  if (by.locked.length) h += fold('lockedR', `Locked · ${by.locked.length}`, grid(by.locked));
  return h;
}
// the Challenge: each hazard a switch with its points; the sum is the level, and the level multiplies the score
function hazardsHTML() {
  const H = SET.hz || HZ_DEFAULT, lv = levelOf(H);
  return sec(`Challenge · level ${lv} · score ×${(1 + lv / 10).toFixed(1)}`) + acts(HZK.map(k => btn(`hz:${k}`, HAZARDS[k].name, `${HAZARDS[k].pts} pt${HAZARDS[k].pts > 1 ? 's' : ''}`, H[k] ? 'on' : '')).join(''), 'c3') + fold('hazards', 'What each hazard does', HZK.map(k => `<p><b>${HAZARDS[k].name}:</b> ${HAZARDS[k].desc}</p>`).join('') + `<p>Easy keeps the polite game whatever is on. Everything a hazard sends is announced first.</p>`);
}
function settingsHTML() {
  return sec('Difficulty') + acts(btn('diff:easy', 'Easy', `they think slower; no raid before ${clock(EASY_SAFE)}`, SET.diff === 'easy' ? 'on' : '') + btn('diff:normal', 'Normal', 'they think once a second', SET.diff === 'normal' ? 'on' : ''))
    + sec('Game') + acts(Object.entries(MODES).map(([k, m]) => btn(`mode:${k}`, m.name, k === 'conquest' ? 'no limit' : 'top score wins', SET.mode === k ? 'on' : '')).join(''), 'c3')
    + sec('World') + acts(btn('fantasy:0', 'Real', 'wolves, bandits, robbers', !SET.fantasy ? 'on' : '') + btn('fantasy:1', 'Fantasy', 'dire wolves, goblins, trolls', SET.fantasy ? 'on' : ''));
}

// ───────────────────────── The cards, one entry each ─────────────────────────
// Each takes the card's description (G.card) and returns its page, or null when what it showed is gone.
const CARDS = {
  bld(c) {
    const b = G.blds.find(x => x.id === c.id); if (!b) return null;
    const p = G.P[0], B = BLD[b.kind], mine = b.owner === 0, P = G.P[b.owner], M = maxHpB(b.owner, b.kind), crew = unitsOf(0, 'vil').filter(u => u.rep === b && u.job === 'repair'); let h = '', td = '', moreH = '';
    h += title(bldName(b.owner, b.kind), mine ? 'yours' : P.name + ' · ' + (P.lord === 0 ? (P.rebel ? 'in revolt' : 'your vassal') : REL_WORD[G.rel[0][b.owner]].toLowerCase())) + (b.hp < M - 1 ? hpBar(b.hp / M, '#b3261a') : '') + ((mine && b.prog >= 1) || (!mine && b.kind === 'keep') ? '' : `<p>${B.desc}</p>`);   // their Town Center needs no blurb about yours
    if (b.kind === 'wonder' && P.civ) h += `<p><i>${CIVS[P.civ].wonder}:</i> ${WHY['wonder:' + P.civ]}</p>`;
    if (b.kind === 'throne' && !mine) h += BLD_PAGE.throne(b);
    if (G.wonder && G.wonder.id === b.id) h += `<p><b>${clock(Math.max(0, G.wonder.end - G.t))} until ${mine ? 'you win' : 'they win'}.</b></p>`;
    if (b.prog < 1) h += `<p>Being built: ${Math.round(b.prog * 100)}%.${mine && !crew.length ? ' <b>Nobody is working it.</b>' : ''}</p>`;
    if (mine && b.fire > 0) h += `<p><b>On fire.</b> ${crew.length} villagers with buckets.</p>` + acts(btn(`douse:${b.id}`, 'Send help', 'two more with buckets', 'warn'), 'c1');
    if (mine && b.kind !== 'keep') {
      const back = refundOf(b), hurtB = b.prog >= 1 && b.hp < M - 1, menders = crew.filter(u => !u.inside).length;
      const row = `${b.prog < 1 ? btn(`sendbld:${b.id}`, 'Send a villager', crew.length ? `${crew.length} building` : 'nobody yet', crew.length ? '' : 'go') : ''}${hurtB ? btn(`repair:${b.id}`, 'Repair', menders ? `${menders} mending` : costText(repairCost(0, b)), 'go') : ''}${B.crop && b.prog >= 1 && b.node ? btn(`sendvil:${b.node.id}`, 'Send a villager', slotText(b.node), b.node.wk > 0 ? '' : 'go') : ''}`;
      if (row) h += acts(row);
      td = acts(b.prog < 0.15 ? btn(`takedown:${b.id}`, 'Cancel', 'all back') : G.confirm === b.id ? btn(`takedown:${b.id}`, 'Tap again', 'to take down · ' + costText(back), 'warn') : btn(`takedown:${b.id}`, 'Take down', costText(back) + ' back'), 'c1');   // last on the card: it is the one you rarely want
    }
    if (mine && b.kind === 'keep') h += acts(b.hp < M - 1 ? btn(`repair:${b.id}`, 'Repair', costText(repairCost(0, b)), 'go') : '');
    if (mine && b.prog >= 1) {
      if (!(b.kind === 'keep' && G.ktab === 'rel') && (trainsAt(b.kind).length || TECH.some(t => t.at === b.kind) || b.kind === 'keep')) h += slotsHTML(b);
      const mk = b.kind === 'market', kp = b.kind === 'keep', trade = (mk && G.mtab !== 'more') || (kp && G.ktab === 'rel');   // the Market's trade side and the Town Center's relations side show no training or research
      const tr = trade ? [] : trainsAt(b.kind), techs = trade ? [] : TECH.filter(t => ownTech(t) && t.at === b.kind && isNext(0, t)), done = trade ? [] : TECH.filter(t => t.at === b.kind && p.techs.has(t.id));   // one step per line: the next
      const ageB = kp && !trade ? keepAgeBtn() : '', hasR = techs.length || done.length || ageB, hd = t => tr.length && hasR ? sec(t) : '';   // one page: Train, then Research; the next age is research like any other
      if (mk) h += twoTabs('mtab', [['trade', 'Trade', 'sell and buy'], ['more', 'Caravans', 'and ventures']], trade ? 'trade' : 'more');
      if (kp) h += twoTabs('ktab', [['town', 'Town', 'train and research'], ['rel', 'Relations', 'ally, neutral, hostile']], trade ? 'rel' : 'town');
      if (tr.length) h += hd('Train') + acts(trainButtons(tr));
      if (hasR) h += hd('Research') + acts(ageB + techs.map(t => techBtn(t)).join('')) + (done.length ? `<div class="chips">${done.map(t => `<span class="chip">✓ ${t.name}</span>`).join('')}</div>` : '');
      moreH = (tr.length && b.kind !== 'keep' && b.kind !== 'town' ? tr.map(k => unitLine(0, civKind(0, k))).join('') : '') + techs.map(techBook).join('') + (b.kind === 'keep' ? keepMoreHTML() : '');
      if (BLD_PAGE[b.kind]) h += BLD_PAGE[b.kind](b);
      if (kp && trade) h += relHTML();
      if (B.makes) h += workshopHTML(b);
    }
    if (!mine && b.kind === 'keep' && P.lord === 0) h += vassalHTML(P);
    else if (!mine && b.kind === 'keep' && G.rel[0][b.owner] === 'ally') { const why = overlordWhy(0, b.owner); h += acts(btn(`overlord:${b.owner}`, 'Offer overlordship', why ? why.replace(/\.$/, '') : 'they become your vassal at a light tax', why ? 'dis' : 'go'), 'c1'); }
    else if (!mine && atWar(0, b.owner)) {
      const I = G.intel[b.owner], spies = unitsOf(0, 'spy').length;
      if (I) h += `<p><b>A spy's report</b> (${clock(G.t - I.t)} ago): ${costText(I.res)} in store · ${AGES[I.age].name} age · ${I.techs} researched · ${Object.entries(I.army).map(([k, n]) => n + ' ' + stats(b.owner, k).name.toLowerCase()).join(', ') || 'no army'}.</p>`;
      if (b.kind === 'keep') { const why = surrenderWhy(0, b.owner); h += acts(btn(`surrender:${b.owner}`, 'Demand surrender', why ? why.replace(/\.$/, '') : 'they become your vassal and pay tax', why ? 'dis' : 'go'), 'c1'); }
      h += acts(btn(`sab:${b.id}`, 'Sabotage', !B.sab ? 'too well guarded' : !spies ? 'needs a spy: Build → Courthouse' : guarded(b) ? 'defended: the spy would be shot' : 'a spy goes and is used up', B.sab && spies ? 'warn' : 'dis'), 'c1') + qsHTML(`qatk:${b.id}`, 'Attack with', b);
    }
    if (mine && b.prog >= 1) h += fold('bmore', 'More', moreH + `<p>${B.desc}</p>` + (WHY[b.kind] ? `<p><i>Why:</i> ${WHY[b.kind]}</p>` : ''));
    return h + td;
  },
  find(c) {
    const f = G.finds.find(x => x.id === c.id); if (!f) return null;
    const F = FINDS[f.kind], gl = G.units.filter(v => v.find === f.id && v.owner === WILD && v.hp > 0 && v.kind !== 'vagabond'), at = `${Math.round(f.x)},${Math.round(f.y)}`;
    let h = title(F.name, coord(f.x, f.y) + (f.done && !F.capture ? ' · taken' : '')) + `<p>${F.desc}</p>`;
    if (gl.length) h += `<p>Guarded by ${gl.length} ${some(gl.length, UNIT[gl[0].kind].name.toLowerCase())}.</p>`;
    if (F.got && !f.done) h += `<p>Inside: ${costText(Object.fromEntries(Object.entries(F.got).map(([k, v]) => [k, Math.round(v * (G.fantasy ? 1.5 : 1))])))}${F.tech ? ' and a free research' : ''}.</p>`;
    if (F.capture) { h += `<p>${f.owner === null ? 'Nobody holds it.' : f.owner === 0 ? 'Yours: it pays you.' : `Held by ${G.P[f.owner].name}.`}</p>`; if (f.owner !== 0) { const pr = unitsOf(0, 'priest').length; h += acts(btn(`shrine:${f.id}`, 'Send a priest', pr ? 'it stands there and takes it' : 'needs a priest: Build → Temple', pr ? 'go' : 'dis'), 'c1'); } }
    if (F.hire && !f.done) { const why = hireWhy(0, f); h += acts(btn(`hire:${f.id}`, `Hire ${F.hire.n} vagabonds`, why ? why.replace(/\.$/, '') : costText(F.hire.cost), why ? 'dis' : 'go'), 'c1'); }
    h += qsHTML(`qgo:${at}`, 'Send', f) + (unitsOf(0, 'scout').length ? acts(btn(`scoutgo:${at}`, 'Send the scout', 'fast, but it does not fight'), 'c1') : '');
    if (F.stop) h += stopHTML(f);
    return h + fold('why', 'Why?', `<p>${WHY[f.kind]}</p>`);
  },
  unit(c) {
    const u = G.units.find(x => x.id === c.id); if (!u) return null;
    const U = UNIT[u.kind], o = u.owner, S = o === WILD ? U : stats(o, u.kind), P = G.P[o], mine = o === 0 && u.kind === 'vil';
    let h = title(S.name, o === 0 ? 'yours' + (u.bn !== undefined ? ' · ' + BN[u.bn] : '') : o === WILD ? 'the wild' : P.name + (P.civ ? ' · ' + CIVS[P.civ].name : '')) + hpBar(u.hp / u.max, o === WILD ? '#c9b48a' : P.color);
    h += `<p>Health ${Math.round(u.hp)}/${Math.round(u.max)}${U.dmg ? ` · hits ${Math.round(S.dmg * 10) / 10} · reach ${Math.round(S.rng)}` : ''} · speed ${Math.round(S.spd)}${o !== WILD && isSoldier(u) ? ` · takes ${Math.round(S.armor * 100)}% damage` : ''}.</p>`;
    if (o === 0) h += `<p><i>Now:</i> ${statusOf(u)}.</p><p><i>Life:</i> ${lifeText(u)}.</p>`;
    if (o === WILD && U.meat && U.tick === 'wild') { const who = unitsOf(0, 'vil').filter(v => v.hunt === u).length; h += acts(btn(`hunt:${u.id}`, 'Send a hunter', who ? `${who} hunting` : 'nobody yet', 'go'), 'c1'); }
    if (mine) {   // this villager's work, sending them home, and the unfinished buildings they could raise
      h += sec(`Work${u.job ? ': ' + (u.job === 'repair' ? 'building' : u.job) : ': idle'}`) + acts(JOBS.map(j => btn(`vjob:${u.id},${j}`, cap1(j), u.job === j ? 'tap to rest' : '', u.job === j ? 'on' : '')).join(''), 'c3');
      h += acts(G.confirm === 'v' + u.id ? btn(`vgo:${u.id}`, 'Tap again', 'to send them home for good', 'warn') : btn(`vgo:${u.id}`, 'Dismiss', 'frees a place'), 'c1');
      const sites = G.blds.filter(s => s.owner === 0 && s.hp > 0 && s.prog < 1 && u.rep !== s).sort((a, b) => dist(a, u) - dist(b, u)).slice(0, 3);
      if (sites.length) h += sec('Build') + acts(sites.map(s => btn(`buildat:${u.id},${s.id}`, bldName(0, s.kind), `${Math.round(s.prog * 100)}% · ${Math.round(dist(s, u))} away`, 'go')).join(''), 'c1');
    }
    if (o === 0 && u.kind === 'caravan') h += caravanHTML(u);
    if (o === 0 && isSoldier(u) && teachTo(u)) { const why = teachWhy(0, u); h += acts(u.state === 'school' ? btn(`teach:${u.id}`, `Learning: ${stats(0, teachTo(u)).name}`, `${Math.ceil(u.schoolT - G.t)} s left`, 'dis') : btn(`teach:${u.id}`, `Teach: ${stats(0, teachTo(u)).name}`, why ? why.replace(/\.$/, '') : `${costText(teachCost(0, u))} · ${Math.round(teachSecs(0, u))} s at the School`, why ? 'dis' : 'go'), 'c1'); }   // a soldier learns a newer kind
    if (u.sick > G.t) h += `<p><b>${u.plague ? 'Plague' : 'Sick'}:</b> works and fights at half strength. A Hospital or a medic nearby cures it.</p>`;
    const bt = o !== WILD && beatsText(o, u.kind); if (bt) h += `<p><i>Strong against:</i> ${bt}.</p>`;
    if (o !== 0 && atWar(0, o)) h += qsHTML(`qfoe:${u.id}`, 'Attack with', u);
    return h + fold('about', 'About', `<p>${U.desc}</p>` + (WHY[u.kind] ? `<p><i>Why:</i> ${WHY[u.kind]}</p>` : ''));
  },
  info(c) { const B = BLD[c.kind]; return title(bldName(0, c.kind), `${AGES[B.age].name} age · ${costText(B.cost)}`) + `<p>${B.desc}</p><p>Unlocks in the ${AGES[B.age].name} age. Advance at your Town Center.</p>`; },
  ground(c) {   // ⋯ on the send strip: the rally point, the scout, the spy
    const at = `${Math.round(c.x)},${Math.round(c.y)}`;
    return title('Here', coord(c.x, c.y)) + acts(btn(`rally:${at}`, 'New soldiers here', G.rally0 ? 'set: tap to clear' : 'off'))
      + acts((unitsOf(0, 'scout').length ? btn(`scoutgo:${at}`, 'Send the scout', '') : '') + (unitsOf(0, 'spy').length ? btn(`spygo:${at}`, 'Send a spy here', 'to look') : ''))
      + fold('about', 'About', `<p>Soldiers you send hold the spot and fight what comes. Drag the map to look around; tap the small map to jump.</p>`);
  },
  box(c) {
    const left = G.nodes.filter(n => n.kind === 'tree' && n.amt > 0 && inBox(n, c.r)).length; if (!left) return null;
    return title('Trees', `${left} in the box`) + sec('Cut these trees') + acts([1, 3, 5].map(n => btn(`boxcut:${n}`, `Send ${n}`, n === 1 ? 'villager' : 'villagers', 'go')).join(''), 'c3') + `<p>They cut from the edge inward, then go back to their work. Cut a way through to open a road.</p>`;
  },
  stores() {   // what you hold, what came in over the last minute, and who is on it
    const p = G.P[0], V = unitsOf(0, 'vil'), el = (G.tick % 1800) / 30, rt = p.rate && Object.keys(p.rate).length ? p.rate : Object.fromEntries(Object.entries(p.flow || {}).map(([k, v]) => [k, v * 60 / Math.max(10, el)]));   // the last full minute; before there is one, the pace so far
    let h = title('Stores', 'the last minute') + `<table><tr><th></th><th>Have</th><th>In</th><th>Out</th><th>On it</th></tr>${RES.map(r => { const k = KEY[r]; return `<tr><td>${RESOURCES[r].name}</td><td>${fmt(p.res[k])}</td><td>+${Math.round(rt[k] || 0)}</td><td>${r === 'food' ? '−' + Math.round(p.eats || 0) : ''}</td><td>${V.filter(u => u.job === r).length}</td></tr>`; }).join('')}</table>`;
    h += `<p><i>Goods:</i> ${GOODK.map(k => `${GOODS[k].name} ${Math.floor(p.goods[k] || 0)}${rt[k] ? ` (+${Math.round(rt[k])})` : ''}`).join(' · ')}. Goods wait in your Business Center for caravans; wool for a Weaver.</p>`;
    return h + `<p>In: gathered and brought home in the last minute. Out: what your people eat a minute${p.hungry ? ' · <b>they are hungry</b>' : ''}.</p>`;
  },
  fault: () => title('Something went wrong', 'your game is saved') + `<p>Restart to carry on from the save.</p>` + acts(btn('reload', 'Restart', 'from the save', 'go') + btn('close', 'Carry on', 'as it is')),
  resume: c => title('Welcome back', 'saved on this phone') + `<p>Your game from ${clock(c.t)}: ${CIVS[c.civ] ? CIVS[c.civ].name + ', ' : ''}${AGES[c.age].name} age. Resume it, or start a new one.</p>` + acts(btn('resume', 'Resume', clock(c.t), 'go') + btn('card:setup', 'New game', '')),
  setup() {
    const C = CIVS[SET.civ];
    let h = title('A new game', 'pick your people') + acts(CIVK.map(k => btn(`civ:${k}`, CIVS[k].name, UNIT[CIVS[k].uu].name, SET.civ === k ? 'on' : '')).join(''), 'c3');
    h += `<p><i>${C.name}:</i> ${C.bonus} Unique soldier: ${UNIT[C.uu].name} (in place of the ${UNIT[UNIT[C.uu].replaces].name.toLowerCase()}). Wonder: ${C.wonder}.</p>` + fold('why', 'Why?', `<p>${WHY['bonus:' + SET.civ]}</p>`);
    if (staleSave) h += `<p class="dim">Your last game came from an older version (${staleSave}) and cannot be opened. It is kept aside, not deleted.</p>`;
    return h + acts(btn('fresh', 'Start', `${C.name} · ${MODES[SET.mode].name} · ${SET.fantasy ? 'fantasy' : 'real world'} · ${SET.diff} · level ${levelOf(SET.hz || HZ_DEFAULT)}`, 'go') + btn('today', "Today's challenge", `level ${levelOf(TODAY_HZ)} on today's map, for everyone`), 'c1') + hazardsHTML() + fold('settings', 'Game settings', settingsHTML()) + fold('about', 'About', `<p>The other three sides take three of the other civilisations at random. Every civilisation has the same rules; only the unique soldier, the bonus and the wonder differ.</p>`);
  },
  node(c) {
    const n = G.nodes.find(x => x.id === c.id); if (!n) return null;
    const who = unitsOf(0, 'vil').filter(u => u.node === n).length, dr = dropFor(0, n.type, n), far = dr ? Math.round(dist(dr, n)) : null, dropName = RESOURCES[n.type].drop;
    return title(nodeName(n), `${coord(n.x, n.y)} · ${Math.round(n.amt)} ${n.type} left`) + (n.max > 0 && isFinite(n.max) ? hpBar(Math.min(1, n.amt / n.max), RESOURCES[n.type].col) : '')
      + acts(btn(`sendvil:${n.id}`, 'Send a villager here', who ? `${who} working` : 'nobody there yet', 'go'), 'c1') + yieldText(n, 0)
      + `<p>${far === null ? `No drop-off for ${n.type} yet: build a ${dropName}.` : far > 110 ? `Nearest drop-off is ${far} away: build a ${dropName} closer.` : `Nearest drop-off: ${far} away.`}</p>`
      + fold('about', 'About', `<p>The nearest idle villager goes; if none is idle, one from the job you hold the most of.</p>`);
  },
  army() {
    const p = G.P[0], S = armyOf(0), by = {}; for (const u of S) { const nm = stats(0, u.kind).name; by[nm] = (by[nm] || 0) + 1; }
    const V = unitsOf(0, 'vil'), idle = V.filter(u => !u.job); let r = 0; if (G.rdy) for (const v of G.rdy.values()) r += v; const going = G.blds.reduce((n, b) => n + (b.owner === 0 ? b.q.filter(j => j.tech || j.age).length : 0), 0);
    let h = title('People', `${V.length} villagers · ${S.length} soldiers`) + acts(btn('card:research', 'Research', `${r} ready · ${going} under way`, r ? 'go' : '') + btn('help', 'How to play', 'the guide and the rules'));
    h += sec('Villagers') + `<p>${JOBS.map(j => `${V.filter(u => u.job === j).length} ${j}`).join(' · ')} · <b>${idle.length} idle</b></p>` + (idle.length ? acts(btn('idlego', 'Show an idle villager', `${idle.length} idle`), 'c1') : '');
    h += sec('Army') + `<p>${Object.entries(by).map(([n, k]) => `${k} ${some(k, n.toLowerCase())}`).join(' · ') || 'Nobody yet.'}</p>`;
    const ords = Object.values(G.ords || {}).filter(O => O.n);
    if (ords.length) h += sec('Out on orders') + ords.map(O => `<p data-act="jump:${O.x},${O.y}"><b>${O.n}</b> ${O.fight ? 'fighting near' : O.arrived ? 'at' : 'marching to'} ${O.label}${!O.arrived && O.eta ? ` · ${O.eta} s` : ''}</p>`).join('');   // tap a line to look
    if (S.length && hasCmd()) h += sec('Orders go to') + acts([['all', 'All', S.length]].concat(BN.map((n, i) => [i, n, S.filter(u => u.bn === i).length])).map(([k, n, cnt]) => btn(`sel:${k}`, n, `${cnt}`, G.sel === k ? 'on' : '')).join(''), 'c4');
    if (S.length) {
      h += sec(`Orders for the ${selName()}`) + acts(btn('recall', 'Recall home', '') + btn('attack:near', 'Attack nearest', oddsText(orderSet(), foeNearest()), orderSet().length ? 'warn' : 'dis'));
      { const bn = G.sel === 'all' ? undefined : G.sel, cw = chargeWhy(0, orderSet(), bn), S = orderSet(), nerve = S.length ? Math.round(100 * S.reduce((a, u) => a + (u.mor ?? 1), 0) / S.length) : 0; h += acts(btn('charge', 'Charge', cw ? cw.replace(/\.$/, '') : `${CHARGE.secs} s of speed and blows, then tired`, cw ? 'dis' : 'warn') + btn('fallback', 'Fall back', `withdraw ${FALLBACK.back}, fewer losses`)) + `<p><i>Nerve:</i> ${nerve}%${nerve < 40 ? ' · <b>close to breaking</b>' : ''}.</p>` + fold('about', 'Nerve', '<p>Blows from the side and behind drain nerve; rest, a wall, a tower or a priest restore it. Under 20% a soldier runs.</p>'); }
      if (p.techs.has('engage')) { const sn = G.sel === 'all' ? (G.stance.every(x => x === G.stance[0]) ? G.stance[0] : -1) : G.stance[G.sel]; h += acts(btn('stance', 'Stance: ' + (sn < 0 ? 'mixed' : STANCE[sn].name), '', sn > 0 ? 'on' : ''), 'c1'); }
      const hold = G.sel === 'all' ? G.hold.every(x => x) : !!G.hold[G.sel]; h += acts(btn('hold', 'Hold ground', hold ? 'on' : 'off', hold ? 'on' : ''), 'c1');
      if (ready(0, 'temple').length) { const why = zealWhy(0, orderSet()); h += acts(btn('zeal', 'Zeal', why ? why.replace(/\.$/, '') : `${costText(zealCost(0))} · ${ZEAL.secs} s of harder blows`, why ? 'dis' : 'go'), 'c1'); }
    }
    const kinds = ARMYK.filter(k => !UNIT[k].civ && UNIT[civKind(0, k)].age <= p.age + 1);
    h += fold('armytrain', 'Train soldiers', acts(trainButtons(kinds)));
    return h + fold('about', 'About orders', `<p>Tap open ground: Send ¼, All, or a battalion by name. Tap an enemy to pick how many attack. The War Council opens stances, battalions, formations and Muster; a gold ring marks the one picked here.</p><p><b>Stance:</b> ${STANCE.map(s => `${s.name}: ${s.note}`).join('. ')}.</p><p><b>Hold ground:</b> on, they fight only what comes within reach and do not chase.</p>`);
  },
  keep() { const k = keepOf(0); if (!k) return null; G.card = { type: 'bld', id: k.id }; return CARDS.bld(G.card); },
  menu(c) {
    const p = G.P[0], M = MENUS.find(m => m.id === c.id); G.lastMenu = c.id;
    const item = k => { const B = BLD[k], lock = B.age > p.age, cp = capFor(0, k), n = bldsOf(0, k).length, full = !lock && n >= cp; return btn(`build:${k}`, B.short || bldName(0, k), lock ? AGES[B.age].name : full ? `limit ${cp}` : !afford(p, B.cost) ? `short ${need(B.cost)}` : costText(B.cost) + (cp > 1 && cp < 99 ? ` · ${n}/${cp}` : ''), lock || full || !afford(p, B.cost) ? 'dis' : ''); };
    const most = Math.max(...MENUS.map(m => m.items.length)), ghosts = '<button class="ghost" disabled aria-hidden="true" tabindex="-1"><b>.</b><small>.</small></button>'.repeat(most - M.items.length);   // blank places keep every menu as tall as the biggest (two rows), so the page never changes height
    return title('Build', '') + acts(MENUS.map(m => btn(`menu:${m.id}`, m.name, '', m.id === c.id ? 'on' : '')).join(''), 'c6 chipsrow') + acts(M.items.map(item).join('') + ghosts, 'c4 menu')
      + fold('menu', 'What each one does', M.items.map(k => `<p><b>${bldName(0, k)}:</b> ${BLD[k].desc}</p>`).join(''));
  },
  research: () => researchHTML(),
  score() {
    scoreAll(); const rows = G.P.filter(q => q.id !== WILD), cats = [['people', 'People'], ['army', 'Army'], ['tech', 'Tech'], ['bld', 'Buildings'], ['wealth', 'Wealth'], ['total', 'Score']];
    return title('Score', (MODES[G.mode].secs ? `${clock(Math.max(0, MODES[G.mode].secs - G.t))} to the bell` : 'conquest') + (levelOf(G.hz) ? ` · level ${levelOf(G.hz)} ×${levelMul().toFixed(1)}` : ''))
      + `<table><tr><th></th>${rows.map(q => `<th style="border-bottom:3px solid ${q.color}">${q.id === 0 ? 'You' : `<button class="lnk" data-act="seek:${q.id}">${q.name}</button>`}</th>`).join('')}</tr>${cats.map(([k, n]) => `<tr><td>${n}</td>${rows.map(q => `<td>${q.alive || k === 'total' ? fmt(q.score[k]) : '–'}</td>`).join('')}</tr>`).join('')}</table>`
      + `<p>People and Army: what you hold, cost ÷ ${SCORE.unit}. Tech: research and ages paid ÷ ${SCORE.tech}. Buildings: standing, cost ÷ ${SCORE.bld}. Wealth: everything gathered, traded, found and plundered ÷ ${SCORE.wealth}. ${G.wonder ? `A wonder stands: ${clock(Math.max(0, G.wonder.end - G.t))} left.` : ''}</p>`;
  },
  guide(c) {
    const pg = c.page || 'bld';
    return title('Guide', 'what leads to what, and why') + acts([['bld', 'Buildings'], ['unit', 'Units'], ['tech', 'Research'], ['age', 'Ages'], ['civ', 'Peoples'], ['rule', 'Rules']].map(([k, n]) => btn(`guide:${k}`, n, '', pg === k ? 'on' : '')).join(''), 'c3') + guideHTML(pg);
  },
  sound() {
    const row = (k, name, v) => acts(btn(`vol:${k},-`, '−', '') + `<div class="lvl"><b>${name}</b><small>${Math.round(v * 100)}%</small></div>` + btn(`vol:${k},+`, '+', ''), 'c3');
    return `<h3>Sound</h3>` + acts(btn('sound', 'Sound', SND.on ? 'on' : 'off', SND.on ? 'on' : '') + btn('vibe', 'Vibration', SET.vibe ? 'on' : 'off', SET.vibe ? 'on' : ''))
      + row('all', 'All', SND.vol) + row('fx', 'Effects', SET.mix.fx) + row('amb', 'Ambience', SET.mix.amb) + row('alert', 'Alerts', SET.mix.alert)
      + `<p>Effects: work and battle. Ambience: birds, wind, crickets, thunder. Alerts: horn, ready, done, a new age. Your phone's silent switch mutes the game.</p>`;
  },
  help() {
    return title('How to play', `build ${BUILD}`) + acts(btn('guide:bld', 'Guide', 'what leads to what, and why', 'go') + btn('guide:rule', 'Rules', 'what triggers what'))
      + `<p><b>Grow:</b> train villagers at the Town Center; + and − under each job move one on or off. Houses give room.</p>
      <p><b>Build:</b> pick a menu, then a building. It waits above your finger: drag it, then tap Build. Villagers raise it.</p>
      <p><b>The finger:</b> tap to pick, tap twice to open a page, hold to pick more (or box a group on open ground). With yours picked, tap a target: they attack, hunt, gather, build, mend or walk there.</p>
      <p><b>Army:</b> tap open ground with nothing picked: Send ¼ or All. The War Council opens stances, battalions, formations and Muster.</p>
      <p><b>Forest:</b> trees are a wall until cut. Hold, then drag a box over trees to cut a road.</p>
      <p><b>Trade:</b> caravans sell goods at the four trade stops, or trade with an ally. A Trade post holds a stop.</p>
      <p><b>The world:</b> seasons, weather, harvests and sickness change what pays. Guarded finds wait in every corner.</p>
      <p><b>Win</b> by conquest, a wonder held ${WONDER_HOLD / 60} minutes, or the top score at the bell. Score is top right. The Guide and Rules above hold every number.</p>`
      + settingsHTML()
      + acts(btn('tips', 'Tips', SET.tips ? 'on' : 'off', SET.tips ? 'on' : '') + btn('msgs', 'Messages', SET.msgs !== false ? 'on' : 'off', SET.msgs !== false ? 'on' : '') + btn('news', 'World news', SET.news !== false ? 'on' : 'off', SET.news !== false ? 'on' : '') + btn('fog', 'Fog of war', SET.fog ? 'on' : 'off', SET.fog ? 'on' : '') + btn('soundpage', 'Sound', SND.on ? Math.round(SND.vol * 100) + '%' : 'off'), 'c3')
      + (Object.keys(SET.hush).length ? acts(btn('unhush', 'Unmute all messages', Object.keys(SET.hush).length + ' kinds silenced'), 'c1') : '')
      + acts(btn('newgame', G.confirm === 'new' ? 'Tap again' : 'New game', G.confirm === 'new' ? 'this one is lost' : 'pick your people', G.confirm === 'new' ? 'warn' : ''))
      + `<p>The game saves itself every ${SAVE_EVERY} seconds on this phone. World, game length and people take effect in the next game.</p>`;
  },
};
const FULL = new Set(['setup', 'resume', 'help', 'guide', 'score', 'end', 'research']);   // the cards that take the whole height
function renderCard() {
  const c = G.card; if (!c || !CARDS[c.type]) return; infoBuf = [];
  let h = CARDS[c.type](c); if (h === null) { closeCard(); return; }
  const info = infoBuf.join(''), bookOn = !!info && G.infoOpen;
  if (bookOn) h = h.replace('</h3>', `</h3><div class="infoP">${info}</div>`);
  if (h !== cardSig) { cardSig = h; patchHTML($('card'), (info ? `<button id="cardI" class="${bookOn ? 'on' : ''}" data-act="info" aria-label="About this">${ICON.book}</button>` : '') + `<button id="cardX" data-act="close" aria-label="Close">×</button>` + h); }
  const cc = G.card; $('card').classList.toggle('full', FULL.has(cc.type) || (cc.type === 'bld' && (G.blds.find(b => b.id === cc.id) || {}).kind === 'market')); $('card').hidden = false;
}
$('card').addEventListener('toggle', e => { const id = e.target.dataset && e.target.dataset.f; if (id) { if (e.target.open) FOLD.add(id); else FOLD.delete(id); } }, true);
