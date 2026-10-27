// ═════ 12-ui.js ═════
// ───────────────────────── The pages: what each thing is and does ─────────────────────────
function openCard(c) { hideStrip(); G.card = c; G.infoOpen = false; G.confirm = null; cardSig = ''; $('card').scrollTop = 0; renderCard(); }
function closeCard() { if (G) G.card = null; $('card').hidden = true; }
let cardSig = '', bannerSig = '';
// Live panels are patched, never rebuilt: the new markup is laid over the old node by node, and only the words, numbers
// and states that changed are touched. A button under a finger stays the same button, so no tap is ever lost.
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
const cap1 = t => t && t.indexOf('<') < 0 ? t.replace(/(^|· )([a-z])/g, (m, a, c) => a + c.toUpperCase()) : t;   // sentence case: a capital opens every label and every part after a dot
const btn = (act, title, sub, cls) => `<button data-act="${act}" class="${cls || ''}"><b>${cap1(title)}</b>${sub ? `<small>${cap1(sub)}</small>` : ''}</button>`;
// explanations live behind a small fold, closed unless you opened it; it stays as you left it while the card redraws
const FOLD = new Set();
// two-sided cards, one mold: two tabs; the chosen one is lit
const BOOK = '<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M2 3.5 Q5.2 2.4 8 4 Q10.8 2.4 14 3.5 V12.5 Q10.8 11.4 8 13 Q5.2 11.4 2 12.5 Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 4 V13" stroke="currentColor" stroke-width="1.2"/></svg>';
const TABIC = { train: '<svg class="ti" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 L9 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 3.5 L10 2 L13.5 5.5 L12 8.5 Z" fill="currentColor"/></svg>', research: '<svg class="ti" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3.5 Q5.2 2.4 8 4 Q10.8 2.4 14 3.5 V12.5 Q10.8 11.4 8 13 Q5.2 11.4 2 12.5 Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 4 V13" stroke="currentColor" stroke-width="1.2"/></svg>' };   // a hammer for making things, a book for learning them
const twoTabs = (key, opts, cur) => `<div class="acts tabs">${opts.map(([k, t, sub]) => btn(`${key}:${k}`, (TABIC[k] || '') + t, sub, cur === k ? 'on' : '')).join('')}</div>`;
const INFO = new Set(['why', 'bmore', 'about', 'menu', 'bnabout']); let infoBuf = [];   // the explaining text of a card waits behind the book icon
const fold = (id, title, html) => INFO.has(id) ? (html && infoBuf.push(html), '') : html ? `<details class="fold" data-f="${id}"${FOLD.has(id) ? ' open' : ''}><summary>${title}</summary>${html}</details>` : '';
const hpBar = (f, col) => `<div class="hp"><i style="width:${Math.round(100 * clamp(f, 0, 1))}%;background:${col}"></i></div>`;
const unitLine = (o, k) => { const S = stats(o, k), U = UNIT[k]; return `<p><b>${S.name}:</b> ${U.desc}${U.civ ? ` <i>${CIVS[U.civ].name} only.</i>` : ''}</p>`; };
function beatsText(o, k) {
  const S = stats(o, k), out = Object.entries(S.vs || {}).map(([t, m]) => `${UNIT[t] ? plural(stats(o, civKind(o, t)).name.toLowerCase()) : t === 'mounted' ? 'anything on horseback' : t === 'infantry' ? 'foot soldiers' : t === 'civ' ? 'workers and caravans' : t === 'heavy' ? 'armoured troops' : t === 'archer' ? 'archers' : t === 'elephant' ? 'elephants' : t === 'siege' ? 'siege engines' : t + 's'} ×${m}`);
  if (UNIT[k].bld && UNIT[k].bld !== 1) out.push(`buildings ×${UNIT[k].bld}`);
  if (UNIT[k].bonly) out.push('buildings only');
  return out.join(', ');
}
function trainButtons(kinds) {
  const p = G.P[0];
  return kinds.map(k => { const ck = civKind(0, k), U = UNIT[ck], why = trainWhy(0, k), n = queuedOf(0, k);
    const sub = U.age > p.age ? `${AGES[U.age].name} age` : !ready(0, U.at).length ? `needs a ${BLD[U.at].name.toLowerCase()}` : costText(U.cost);
    return btn(`train:${k}`, stats(0, ck).name, sub + (n ? ` ×${n}` : ''), why ? 'dis' : ''); }).join('');
}
// Research, in four looks you can tell without reading: ready (wax seal), short of something (red ink, what is missing), busy, locked (faded)
function techState(t) {
  if (G.P[0].techs.has(t.id)) return 'done';
  const why = researchWhy(0, t.id);
  return !why ? 'ready' : why === 'Being researched.' || why === 'That line is full.' ? 'busy' : why.startsWith('Not enough') ? 'short' : 'locked';
}
function techBtn(t, withAt) {
  const p = G.P[0], st = techState(t), miss = {};
  for (const r in t.cost) if ((p.res[r] || 0) < t.cost[r]) miss[r] = Math.ceil(t.cost[r] - (p.res[r] || 0));
  const sub = st === 'busy' ? 'researching' : st === 'short' ? `short ${costText(miss)}` : st === 'locked' ? researchWhy(0, t.id).replace(/\.$/, '') : costText(t.cost);
  return btn(`tech:${t.id}`, t.name, sub + (withAt ? ` · ${BLD[t.at].name}` : ''), st === 'ready' ? 'go' : st === 'short' ? 'dis short' : st === 'busy' ? 'dis' : 'dis lock');
}
function researchHTML() {   // everything you can research, across every building: ready first, then short, then locked
  const p = G.P[0], by = { ready: [], short: [], busy: [], locked: [] }, ageA = AGES[p.age + 1];
  for (const t of TECH) { const s = techState(t); if (s !== 'done') by[s].push(t); }
  const grid = L => `<div class="acts">${L.map(t => techBtn(t, true)).join('')}</div>`, ageR = ageA && !p.aging && afford(p, ageA.cost) && keepOf(0);
  let h = `<h3>Research<span class="who">${by.ready.length + (ageR ? 1 : 0)} ready now</span></h3>`;
  const cap = by.ready.filter(t => t.cap), rest = by.ready.filter(t => !t.cap);
  if (ageR) h += `<div class="sec">Next age</div><div class="acts">${keepAgeBtn()}</div>`;
  if (cap.length) h += `<div class="sec">Room to grow</div>${grid(cap)}`;
  if (rest.length) h += `<div class="sec">Ready</div>${grid(rest)}`;
  if (!by.ready.length && !ageR) h += `<p>Nothing to start right now.</p>`;
  if (by.busy.length) h += `<div class="sec">Under way</div>${grid(by.busy)}`;
  if (by.short.length) h += `<div class="sec">Short of something</div>${grid(by.short)}`;
  if (by.locked.length) h += fold('lockedR', `Locked · ${by.locked.length}`, grid(by.locked));
  return h;
}
const trainsAt = kind => Object.keys(UNIT).filter(k => (UNIT[k].at === kind || (UNIT[k].also || []).includes(kind)) && !UNIT[k].civ && UNIT[k].cost);
function renderCard() {
  const c = G.card; if (!c) return; infoBuf = [];
  const p = G.P[0]; let h = '';
  if (c.type === 'bld') {
    const b = G.blds.find(x => x.id === c.id); if (!b) { closeCard(); return; }
    const B = BLD[b.kind], mine = b.owner === 0, P = G.P[b.owner], M = maxHpB(b.owner, b.kind); let td = '', moreH = '';
    h += `<h3>${bldName(b.owner, b.kind)}<span class="who">${mine ? 'yours' : P.name + (P.civ ? ' · ' + CIVS[P.civ].name : '') + ' · ' + (P.lord === 0 ? (P.rebel ? 'in revolt' : 'your vassal') : G.rel[0][b.owner])}</span></h3>${b.hp < M - 1 ? hpBar(b.hp / M, '#b3261a') : ''}${mine && b.prog >= 1 ? '' : `<p>${B.desc}</p>`}`;
    if (b.kind === 'wonder' && P.civ) h += `<p><i>${CIVS[P.civ].wonder}:</i> ${WHY['wonder:' + P.civ]}</p>`;
    if (G.wonder && G.wonder.id === b.id) h += `<p><b>${clock(Math.max(0, G.wonder.end - G.t))} until ${mine ? 'you win' : 'they win'}.</b></p>`;
    if (b.prog < 1) h += `<p>Being built: ${Math.round(b.prog * 100)}%.${mine && !G.units.some(u => u.rep === b && u.job === 'repair') ? ' <b>Nobody is working it.</b>' : ''}</p>`;
    if (mine && b.fire > 0) h += `<p><b>On fire.</b> ${unitsOf(0, 'vil').filter(u => u.rep === b && u.job === 'repair').length} villagers with buckets.</p><div class="acts c1">${btn(`douse:${b.id}`, 'Send help', 'two more with buckets', 'warn')}</div>`;
    if (mine && b.kind !== 'keep') {
      const back = refundOf(b), quick = b.prog < 0.15 || B.wallish, hurtB = b.prog >= 1 && b.hp < M - 1, menders = unitsOf(0, 'vil').filter(u => u.rep === b && u.job === 'repair' && !u.inside).length;
      const crewN = unitsOf(0, 'vil').filter(u => u.rep === b && u.job === 'repair').length, row = `${b.prog < 1 ? btn(`sendbld:${b.id}`, 'Send a villager', crewN ? `${crewN} building` : 'nobody yet', crewN ? '' : 'go') : ''}${hurtB ? btn(`repair:${b.id}`, 'Repair', menders ? `${menders} mending` : costText(repairCost(0, b)), 'go') : ''}${B.crop && b.prog >= 1 && b.node ? btn(`sendvil:${b.node.id}`, 'Send a villager', b.node.wk > 0 ? `${b.node.wk} of ${slotsOf(b.node)}` : 'nobody yet', b.node.wk > 0 ? '' : 'go') : ''}`;
      if (row) h += `<div class="acts">${row}</div>`;
      td = `<div class="acts c1">${b.prog < 0.15 ? btn(`takedown:${b.id}`, 'Cancel', 'all back') : G.confirm === b.id ? btn(`takedown:${b.id}`, 'Tap again', 'to take down · ' + costText(back), 'warn') : btn(`takedown:${b.id}`, 'Take down', costText(back) + ' back')}</div>`;   // last on the card: it is the one you rarely want
    }
    if (mine && b.kind === 'keep') { h += `<div class="acts">${b.hp < M - 1 ? btn(`repair:${b.id}`, 'Repair', costText(repairCost(0, b)), 'go') : ''}</div>`; }
    if (mine && b.prog >= 1) {
      if (b.q.length) h += `<p>Working on: ${b.q.map((j, i) => (j.kind ? stats(0, j.kind).name : j.muster ? `muster ${j.bn !== undefined ? BN[j.bn] : ''}` : j.tech ? TECHBY[j.tech].name : AGES[j.age].name + ' age') + (i === 0 ? ` (${Math.ceil(j.left)} s)` : '')).join(', ')}${b.blocked ? ' · <b>needs room: House, Apartment or Aqueduct</b>' : ''}${b.stall > G.t ? ` · <b>stopped by sabotage: ${Math.ceil(b.stall - G.t)} s</b>` : ''}</p>`;
      const mk = b.kind === 'market', more = mk && G.mtab === 'more';   // the Market's two sides: trade, and caravans and ventures
      const tr = mk && !more ? [] : trainsAt(b.kind), techs = mk && !more ? [] : TECH.filter(t => t.at === b.kind && !p.techs.has(t.id)), done = mk && !more ? [] : TECH.filter(t => t.at === b.kind && p.techs.has(t.id));
      const ageB = b.kind === 'keep' ? keepAgeBtn() : '', hasR = techs.length || done.length || ageB, hd = t => tr.length && hasR ? `<div class="sec">${t}</div>` : '';   // one page: Train, then Research; the next age is research like any other
      if (mk) h += twoTabs('mtab', [['trade', 'Trade', 'sell and buy'], ['more', 'Caravans', 'and ventures']], more ? 'more' : 'trade');
      if (tr.length) h += hd('Train') + `<div class="acts">${trainButtons(tr)}</div>`;
      if (hasR) {
        h += hd('Research') + `<div class="acts">${ageB}`;
        for (const t of techs) h += techBtn(t);
        h += `</div>` + (done.length ? `<div class="chips">${done.map(t => `<span class="chip">✓ ${t.name}</span>`).join('')}</div>` : '');
      }
      // everything else about the building waits behind one More, closed until you open it
      moreH = (tr.length && b.kind !== 'keep' && b.kind !== 'town' ? tr.map(k => unitLine(0, civKind(0, k))).join('') : '') + techs.map(t => `<p><b>${t.name}:</b> ${t.desc}</p>`).join('') + (b.kind === 'keep' ? keepMoreHTML() : '');
      if (b.kind === 'farm') h += `<p>Worked by ${b.node && b.node.wk > 0 ? `${b.node.wk} of ${slotsOf(b.node)}` : 'nobody yet: tap Send a villager' + (b.node && b.node.type === 'food' ? ', or + under Farm' : '')}. This season: ${season().name}, ×${season().farm}${G.harvest !== 1 ? ` · this year's harvest ×${G.harvest}` : ''}${WEATHER[G.wx].crop ? ` · ${WEATHER[G.wx].name.toLowerCase()} ×${WEATHER[G.wx].crop}` : ''} · soil ${Math.round((b.fert ?? 1) * 100)}%${b.node && b.node.type === 'food' && bakeryNear(0, b.node) ? ' · a bakery near: ×1.15' : ''}.</p>`;
      if (b.kind === 'council') h += councilHTML(b);
      h += econCard(b);
      if (b.kind === 'treefarm') h += `<p>Tended by ${b.node && b.node.wk > 0 ? `${b.node.wk} of ${slotsOf(b.node)}` : 'nobody yet: tap Send a villager, or + under Wood'}. ${Math.round(b.node ? b.node.amt : 0)} wood left, then the plot is cut out.</p>`;
      if (b.kind === 'market' && G.mtab !== 'more') { const nm = k => GOODS[k] ? GOODS[k].name : RESOURCES[LONG[k]].name;
        h += `<div class="sec">Sell · 100 of a resource, 10 of a good</div><div class="acts c4">${MKT_SELL.map(k => btn(`trade:sell:${k}`, nm(k), `+${sellPrice(0, k)}g`, haveOf(p, k) < LOT(k) ? 'dis' : '')).join('')}</div>`
          + `<div class="sec">Buy</div><div class="acts c4">${MKT_BUY.map(k => btn(`trade:buy:${k}`, nm(k), `${buyPrice(k)}g`, p.res.g < buyPrice(k) ? 'dis' : '')).join('')}</div>`; }
      if (b.kind === 'market' && G.mtab === 'more') h += `<p>Two lanes. One: a caravan with a route takes goods from your Business Center to a trade stop and sells them. Two: a caravan with no route runs to an ally's Market or Town Center and earns distance² ÷ ${TRADE_DIV}, at most ${TRADE_CAP} gold. ${unitsOf(0, 'caravan').length} caravans; ${allyMarket(0, b) ? 'an ally to trade with' : 'no ally yet'}.</p>`;
    }
    if (!mine && b.kind === 'keep' && P.lord === 0) h += vassalHTML(P);
    else if (!mine && b.owner === FORT && b.kind === 'keep') h += diploHTML();
    else if (!mine && atWar(0, b.owner)) {
      const I = G.intel[b.owner];
      if (I) h += `<p><b>A spy's report</b> (${clock(G.t - I.t)} ago): ${costText(I.res)} in store · ${AGES[I.age].name} age · ${I.techs} researched · ${Object.entries(I.army).map(([k, n]) => n + ' ' + stats(b.owner, k).name.toLowerCase()).join(', ') || 'no army'}.</p>`;
      const spies = unitsOf(0, 'spy').length;
      if (b.kind === 'keep') { const why = surrenderWhy(0, b.owner); h += `<div class="acts c1">${btn(`demand:${b.owner}`, 'Demand surrender', why ? why.replace(/\.$/, '') : 'they become your vassal and pay tax', why ? 'dis' : 'go')}</div>`; }
      h += `<div class="acts c1">${btn(`sab:${b.id}`, 'Sabotage', !B.sab ? 'too well guarded' : !spies ? 'needs a spy: Build → Courthouse' : guarded(b) ? 'defended: the spy would be shot' : 'a spy goes and is used up', B.sab && spies ? 'warn' : 'dis')}</div>${qsHTML(`qatk:${b.id}`, 'Attack with', b)}`;
    }
    if (mine && b.prog >= 1) h += fold('bmore', 'More', moreH + `<p>${B.desc}</p>` + (WHY[b.kind] ? `<p><i>Why:</i> ${WHY[b.kind]}</p>` : ''));
    h += td;
  } else if (c.type === 'find') {
    const f = G.finds.find(x => x.id === c.id); if (!f) { closeCard(); return; }
    const F = FINDS[f.kind], gl = G.units.filter(v => v.find === f.id && v.owner === WILD && v.hp > 0 && v.kind !== 'vagabond');
    h += `<h3>${F.name}<span class="who">${coord(f.x, f.y)}${f.done && !F.capture ? ' · taken' : ''}</span></h3><p>${F.desc}</p>`;
    if (gl.length) h += `<p>Guarded by ${gl.length} ${some(gl.length, UNIT[gl[0].kind].name.toLowerCase())}.</p>`;
    if (F.got && !f.done) h += `<p>Inside: ${costText(Object.fromEntries(Object.entries(F.got).map(([k, v]) => [k, Math.round(v * (G.fantasy ? 1.5 : 1))])))}${F.tech ? ' and a free research' : ''}.</p>`;
    if (F.capture) { h += `<p>${f.owner === null ? 'Nobody holds it.' : f.owner === 0 ? 'Yours: it pays you.' : `Held by ${G.P[f.owner].name}.`}</p>`; if (f.owner !== 0) h += `<div class="acts c1">${btn(`shrine:${f.id}`, 'Send a priest', unitsOf(0, 'priest').length ? 'it stands there and takes it' : 'needs a priest: Build → Temple', unitsOf(0, 'priest').length ? 'go' : 'dis')}</div>`; }
    if (F.hire && !f.done) { const why = hireWhy(0, f); h += `<div class="acts c1">${btn(`hire:${f.id}`, `Hire ${F.hire.n} vagabonds`, why ? why.replace(/\.$/, '') : costText(F.hire.cost), why ? 'dis' : 'go')}</div>`; }
    h += qsHTML(`qgo:${Math.round(f.x)},${Math.round(f.y)}`, 'Send', f) + (unitsOf(0, 'scout').length ? `<div class="acts c1">${btn(`scoutgo:${Math.round(f.x)},${Math.round(f.y)}`, 'Send the scout', 'fast, but it does not fight')}</div>` : '');
    if (F.stop) h += stopHTML(f);
    h += fold('why', 'Why?', `<p>${WHY[f.kind]}</p>`);
  } else if (c.type === 'unit') {
    const u = G.units.find(x => x.id === c.id); if (!u) { closeCard(); return; }
    const U = UNIT[u.kind], o = u.owner, S = o === WILD ? U : stats(o, u.kind), P = G.P[o];
    h += `<h3>${S.name}<span class="who">${o === 0 ? 'yours' + (u.bn !== undefined ? ' · ' + BN[u.bn] : '') : o === WILD ? 'the wild' : P.name + (P.civ ? ' · ' + CIVS[P.civ].name : '')}</span></h3>${hpBar(u.hp / u.max, o === WILD ? '#c9b48a' : P.color)}`;
    h += `<p>Health ${Math.round(u.hp)}/${Math.round(u.max)}${U.dmg ? ` · hits ${Math.round(S.dmg * 10) / 10} · reach ${Math.round(S.rng)}` : ''} · speed ${Math.round(S.spd)}${o !== WILD && isSoldier(u) ? ` · takes ${Math.round(S.armor * 100)}% damage` : ''}.</p>`;
    if (o === WILD && U.meat && U.tick === 'wild') { const who = unitsOf(0, 'vil').filter(v => v.hunt === u).length; h += `<div class="acts c1">${btn(`hunt:${u.id}`, 'Send a hunter', who ? `${who} hunting` : 'nobody yet', 'go')}</div>`; }
    if (o === 0 && u.kind === 'vil') {   // this villager's work, and sending them home
      h += `<div class="sec">Work${u.job ? ': ' + (u.job === 'repair' ? 'building' : u.job) : ': idle'}</div><div class="acts c3">${JOBS.map(j => btn(`vjob:${u.id},${j}`, j[0].toUpperCase() + j.slice(1), u.job === j ? 'tap to rest' : '', u.job === j ? 'on' : '')).join('')}</div>`;
      h += `<div class="acts c1">${G.confirm === 'v' + u.id ? btn(`vgo:${u.id}`, 'Tap again', 'to send them home for good', 'warn') : btn(`vgo:${u.id}`, 'Dismiss', 'frees a place')}</div>`;
    }
    if (o === 0 && u.kind === 'vil') {   // pick this villager to raise an unfinished building
      const sites = G.blds.filter(s => s.owner === 0 && s.hp > 0 && s.prog < 1 && u.rep !== s).sort((a, b) => dist(a, u) - dist(b, u)).slice(0, 3);
      if (sites.length) h += `<div class="sec">Build</div><div class="acts c1">${sites.map(s => btn(`buildat:${u.id},${s.id}`, bldName(0, s.kind), `${Math.round(s.prog * 100)}% · ${Math.round(dist(s, u))} away`, 'go')).join('')}</div>`;
    }
    if (o === 0 && u.kind === 'caravan') h += caravanHTML(u);
    if (u.sick > G.t) h += `<p><b>${u.plague ? 'Plague' : 'Sick'}:</b> works and fights at half strength. A Hospital or a medic nearby cures it.</p>`;
    const bt = o !== WILD && beatsText(o, u.kind); if (bt) h += `<p><i>Strong against:</i> ${bt}.</p>`;
    if (o !== 0 && atWar(0, o)) h += qsHTML(`qfoe:${u.id}`, 'Attack with', u);
    h += fold('about', 'About', `<p>${U.desc}</p>` + (WHY[u.kind] ? `<p><i>Why:</i> ${WHY[u.kind]}</p>` : ''));
  } else if (c.type === 'info') {
    const B = BLD[c.kind];
    h += `<h3>${bldName(0, c.kind)}<span class="who">${AGES[B.age].name} age · ${costText(B.cost)}</span></h3><p>${B.desc}</p><p>Unlocks in the ${AGES[B.age].name} age. Advance at your Town Center.</p>`;
  } else if (c.type === 'ground') {   // ⋯ on the send strip: the rally point, the scout, the spy
    h += `<h3>Here<span class="who">${coord(c.x, c.y)}</span></h3>`;
    h += `<div class="acts">${btn(`rally:${Math.round(c.x)},${Math.round(c.y)}`, 'New soldiers here', G.rally0 ? 'set: tap to clear' : 'off')}</div>`;
    h += `<div class="acts">${unitsOf(0, 'scout').length ? btn(`scoutgo:${Math.round(c.x)},${Math.round(c.y)}`, 'Send the scout', '') : ''}${unitsOf(0, 'spy').length ? btn(`spygo:${Math.round(c.x)},${Math.round(c.y)}`, 'Send a spy here', 'to look') : ''}</div>`;
    h += fold('about', 'About', `<p>Soldiers you send hold the spot and fight what comes. Drag the map to look around; tap the small map to jump.</p>`);
  } else if (c.type === 'box') {
    const V = c.vils.map(id => G.units.find(u => u.id === id)).filter(Boolean), left = G.nodes.filter(n => n.kind === 'tree' && n.amt > 0 && inBox(n, c.r)).length;
    h += `<h3>Picked<span class="who">${left ? left + ' trees' : ''}${left && V.length ? ' · ' : ''}${V.length ? V.length + ' villagers' : ''}</span></h3>`;
    if (left) h += `<div class="sec">Cut these trees</div><div class="acts c3">${[1, 3, 5].map(n => btn(`boxcut:${n}`, `Send ${n}`, n === 1 ? 'villager' : 'villagers', 'go')).join('')}</div><p>They cut from the edge inward, then go back to their work. Cut a way through to open a road.</p>`;
    if (V.length) h += `<div class="sec">Put the ${V.length} on</div><div class="acts c3">${JOBS.map(j => btn(`boxjob:${j}`, j[0].toUpperCase() + j.slice(1), '')).join('')}${G.blds.some(b => b.owner === 0 && b.prog < 1 && b.hp > 0) ? btn('boxbuild', 'Build', 'the nearest site', 'go') : ''}</div>`;
  } else if (c.type === 'fault') {
    h += `<h3>Something went wrong<span class="who">your game is saved</span></h3><p>Restart to carry on from the save.</p><div class="acts">${btn('reload', 'Restart', 'from the save', 'go')}${btn('close', 'Carry on', 'as it is')}</div>`;
  } else if (c.type === 'resume') {
    h += `<h3>Welcome back<span class="who">saved on this phone</span></h3><p>Your game from ${clock(c.t)}: ${CIVS[c.civ] ? CIVS[c.civ].name + ', ' : ''}${AGES[c.age].name} age. Resume it, or start a new one.</p><div class="acts">${btn('resume', 'Resume', clock(c.t), 'go')}${btn('card:setup', 'New game', '')}</div>`;
  } else if (c.type === 'setup') {
    h += `<h3>A new game<span class="who">pick your people</span></h3><div class="acts c3">${CIVK.map(k => btn(`civ:${k}`, CIVS[k].name, UNIT[CIVS[k].uu].name, SET.civ === k ? 'on' : '')).join('')}</div>`;
    const C = CIVS[SET.civ]; h += `<p><i>${C.name}:</i> ${C.bonus} Unique soldier: ${UNIT[C.uu].name} (in place of the ${UNIT[UNIT[C.uu].replaces].name.toLowerCase()}). Wonder: ${C.wonder}.</p>` + fold('why', 'Why?', `<p>${WHY['bonus:' + SET.civ]}</p>`);
    if (staleSave) h += `<p class="dim">Your last game came from an older version (${staleSave}) and cannot be opened. It is kept aside, not deleted.</p>`;
    h += `<div class="acts c1">${btn('fresh', 'Start', `${C.name} · ${MODES[SET.mode].name} · ${SET.fantasy ? 'fantasy' : 'real world'} · ${SET.diff}`, 'go')}</div>` + fold('settings', 'Game settings', settingsHTML()) + fold('about', 'About', `<p>The other three sides take three of the other civilisations at random. Every civilisation has the same rules; only the unique soldier, the bonus and the wonder differ.</p>`);
  } else if (c.type === 'node') {
    const n = G.nodes.find(x => x.id === c.id); if (!n) { closeCard(); return; }
    const who = unitsOf(0, 'vil').filter(u => u.node === n).length, dr = dropFor(0, n.type, n), far = dr ? Math.round(dist(dr, n)) : null, dropName = RESOURCES[n.type].drop;
    h += `<h3>${nodeName(n)}<span class="who">${coord(n.x, n.y)} · ${Math.round(n.amt)} ${n.type} left</span></h3>${n.max > 0 && isFinite(n.max) ? hpBar(Math.min(1, n.amt / n.max), RESOURCES[n.type].col) : ''}`;
    h += `<div class="acts c1">${btn(`sendvil:${n.id}`, 'Send a villager here', who ? `${who} working` : 'nobody there yet', 'go')}</div>`;
    h += `<p>${far === null ? `No drop-off for ${n.type} yet: build a ${dropName}.` : far > 110 ? `Nearest drop-off is ${far} away: build a ${dropName} closer.` : `Nearest drop-off: ${far} away.`}</p>`;
    h += fold('about', 'About', `<p>The nearest idle villager goes; if none is idle, one from the job you hold the most of.</p>`);
  } else if (c.type === 'army') {
    const S = armyOf(0), by = {}; for (const u of S) { const nm = stats(0, u.kind).name; by[nm] = (by[nm] || 0) + 1; }
    const V = unitsOf(0, 'vil'), idle = V.filter(u => !u.job);
    h += `<h3>People<span class="who">${V.length} villagers · ${S.length} soldiers</span></h3><div class="acts c1">${btn('card:research', 'Research', (() => { let r = 0; for (const v of G.rdy.values()) r += v; const g = G.blds.reduce((n, b) => n + (b.owner === 0 ? b.q.filter(j => j.tech || j.age).length : 0), 0); return `${r} ready · ${g} under way`; })(), (() => { for (const v of G.rdy.values()) if (v) return 'go'; return ''; })())}</div><div class="sec">Villagers</div><p>${JOBS.map(r => `${V.filter(u => u.job === r).length} ${r}`).join(' · ')} · <b>${idle.length} idle</b></p>${idle.length ? `<div class="acts c1">${btn('idlego', 'Show an idle villager', `${idle.length} idle`)}</div>` : ''}<div class="sec">Army</div><p>${Object.entries(by).map(([n, k]) => `${k} ${some(k, n.toLowerCase())}`).join(' · ') || 'Nobody yet.'}</p>`;
    if (S.length && hasCmd()) h += `<div class="sec">Orders go to</div><div class="acts c4">` + [['all', 'All', S.length]].concat(BN.map((n, i) => [i, n, S.filter(u => u.bn === i).length])).map(([k, n, cnt]) => btn(`sel:${k}`, n, `${cnt}`, G.sel === k ? 'on' : '')).join('') + `</div>`;
    if (S.length) h += `<div class="sec">Orders for the ${selName()}</div><div class="acts">${btn('recall', 'Recall home', '')}${btn('attack:near', 'Attack nearest', oddsText(orderSet(), foeNearest()), orderSet().length ? 'warn' : 'dis')}</div>`;
    if (S.length && p.techs.has('engage')) { const sn = G.sel === 'all' ? (G.stance.every(x => x === G.stance[0]) ? G.stance[0] : -1) : G.stance[G.sel]; h += `<div class="acts c1">${btn('stance', 'Stance: ' + (sn < 0 ? 'mixed' : STANCE[sn].name), '', sn > 0 ? 'on' : '')}</div>`; }
    if (S.length) { const hold = G.sel === 'all' ? G.hold.every(x => x) : !!G.hold[G.sel]; h += `<div class="acts c1">${btn('hold', 'Hold ground', hold ? 'on' : 'off', hold ? 'on' : '')}</div>`; }
    if (S.length && ready(0, 'temple').length) { const why = zealWhy(0, orderSet()); h += `<div class="acts c1">${btn('zeal', 'Zeal', why ? why.replace(/\.$/, '') : `${costText(zealCost(0))} · ${ZEAL.secs} s of harder blows`, why ? 'dis' : 'go')}</div>`; }
    const kinds = ARMYK.filter(k => !UNIT[k].civ && UNIT[civKind(0, k)].age <= p.age + 1);
    h += fold('armytrain', 'Train soldiers', `<div class="acts">${trainButtons(kinds)}</div>`);
    h += fold('about', 'About orders', `<p>Tap open ground: Send ¼, All, or a battalion by name. Tap an enemy to pick how many attack. The War Council opens stances, battalions, formations and Muster; a gold ring marks the one picked here.</p><p><b>Stance:</b> ${STANCE.map(s => `${s.name}: ${s.note}`).join('. ')}.</p><p><b>Hold ground:</b> on, they fight only what comes within reach and do not chase.</p>`);
  } else if (c.type === 'keep') { const k = keepOf(0); if (k) { G.card = { type: 'bld', id: k.id }; renderCard(); return; } closeCard(); return; }
  else if (c.type === 'fortress') h += `<h3>The Fortress<span class="who">${G.P[FORT].alive ? G.rel[0][FORT] + (G.P[FORT].civ ? ' · ' + CIVS[G.P[FORT].civ].name : '') : 'fallen'}</span></h3>` + diploHTML();
  else if (c.type === 'menu') {
    const M = MENUS.find(m => m.id === c.id); G.lastMenu = c.id;
    h += `<h3>Build<span class="who">${M.blurb}</span></h3><div class="acts c5 chipsrow">${MENUS.map(m => btn(`menu:${m.id}`, m.name, '', m.id === c.id ? 'on' : '')).join('')}</div><div class="acts c3">` + M.items.map(k => { const B = BLD[k], lock = B.age > p.age, cp = capFor(0, k), n = bldsOf(0, k).length, full = !lock && n >= cp; return btn(`build:${k}`, bldName(0, k), lock ? `${AGES[B.age].name} age` : full ? `limit ${cp}` : costText(B.cost) + (cp > 1 && cp < 99 ? ` · ${n}/${cp}` : ''), lock || full || !afford(p, B.cost) ? 'dis' : ''); }).join('') + '<button class="ghost" disabled aria-hidden="true" tabindex="-1"><b>.</b><small>.</small></button>'.repeat(Math.max(0, MENUS[0].items.length - M.items.length)) + `</div>`;   // blank places keep every menu as tall as the biggest, so the page never changes height
    h += fold('menu', 'What each one does', M.items.map(k => `<p><b>${bldName(0, k)}:</b> ${BLD[k].desc}</p>`).join(''));
  } else if (c.type === 'research') {
    h += researchHTML();
  } else if (c.type === 'score') {
    scoreAll(); const rows = G.P.filter(q => q.id !== WILD), cats = [['people', 'People'], ['army', 'Army'], ['tech', 'Tech'], ['bld', 'Buildings'], ['wealth', 'Wealth'], ['total', 'Score']];
    h += `<h3>Score<span class="who">${MODES[G.mode].secs ? `${clock(Math.max(0, MODES[G.mode].secs - G.t))} to the bell` : 'conquest'}</span></h3><table><tr><th></th>${rows.map(q => `<th style="border-bottom:3px solid ${q.color}">${q.id === 0 ? 'You' : `<button class="lnk" data-act="seek:${q.id}">${q.name}</button>`}</th>`).join('')}</tr>${cats.map(([k, n]) => `<tr><td>${n}</td>${rows.map(q => `<td>${q.alive || k === 'total' ? fmt(q.score[k]) : '–'}</td>`).join('')}</tr>`).join('')}</table>`;
    h += `<p>People and Army: what you hold, cost ÷ ${SCORE.unit}. Tech: research and ages paid ÷ ${SCORE.tech}. Buildings: standing, cost ÷ ${SCORE.bld}. Wealth: everything gathered, traded, found and plundered ÷ ${SCORE.wealth}. ${G.wonder ? `A wonder stands: ${clock(Math.max(0, G.wonder.end - G.t))} left.` : ''}</p>`;
  } else if (c.type === 'guide') {
    const pg = c.page || 'bld';
    h += `<h3>Guide<span class="who">what leads to what, and why</span></h3><div class="acts c3">${[['bld', 'Buildings'], ['unit', 'Units'], ['tech', 'Research'], ['age', 'Ages'], ['civ', 'Peoples'], ['rule', 'Rules']].map(([k, n]) => btn(`guide:${k}`, n, '', pg === k ? 'on' : '')).join('')}</div>` + guideHTML(pg);
  } else if (c.type === 'sound') {
    const row = (k, name, v) => `<div class="acts c3">${btn(`vol:${k},-`, '−', '')}<div class="lvl"><b>${name}</b><small>${Math.round(v * 100)}%</small></div>${btn(`vol:${k},+`, '+', '')}</div>`;
    h += `<h3>Sound</h3><div class="acts">${btn('sound', 'Sound', SND.on ? 'on' : 'off', SND.on ? 'on' : '')}${btn('vibe', 'Vibration', SET.vibe ? 'on' : 'off', SET.vibe ? 'on' : '')}</div>
      ${row('all', 'All', SND.vol)}${row('fx', 'Effects', SET.mix.fx)}${row('amb', 'Ambience', SET.mix.amb)}${row('alert', 'Alerts', SET.mix.alert)}
      <p>Effects: work and battle. Ambience: birds, wind, crickets, thunder. Alerts: horn, ready, done, a new age. Your phone's silent switch mutes the game.</p>`;
  } else if (c.type === 'help') {
    h += `<h3>How to play<span class="who">build ${BUILD}</span></h3>
      <div class="acts">${btn('guide:bld', 'Guide', 'what leads to what, and why', 'go')}${btn('guide:rule', 'Rules', 'what triggers what')}</div>
      <p><b>Grow:</b> train villagers at the Town Center; + and − under each job move one on or off. Houses give room.</p>
      <p><b>Build:</b> pick a menu, then a building. It waits above your finger: drag it, then tap Build. Villagers raise it.</p>
      <p><b>Army:</b> tap open ground: Send ¼ or All. Tap an enemy to attack. The War Council opens stances, battalions, formations and Muster.</p>
      <p><b>Forest:</b> trees are a wall until cut. Hold, then drag a box over trees to cut a road.</p>
      <p><b>Trade:</b> caravans sell goods at the four trade stops, or trade with an ally. A Trade post holds a stop.</p>
      <p><b>The world:</b> seasons, weather, harvests and sickness change what pays. Guarded finds wait in every corner.</p>
      <p><b>Win</b> by conquest, a wonder held ${WONDER_HOLD / 60} minutes, or the top score at the bell. Score is top right. The Guide and Rules above hold every number.</p>
      ${settingsHTML()}
      <div class="acts c3">${btn('tips', 'Tips', SET.tips ? 'on' : 'off', SET.tips ? 'on' : '')}${btn('msgs', 'Messages', SET.msgs !== false ? 'on' : 'off', SET.msgs !== false ? 'on' : '')}${btn('soundpage', 'Sound', SND.on ? Math.round(SND.vol * 100) + '%' : 'off')}</div>
      ${Object.keys(SET.hush).length ? `<div class="acts c1">${btn('unhush', 'Unmute all messages', Object.keys(SET.hush).length + ' kinds silenced')}</div>` : ''}
      <div class="acts">${btn('newgame', G.confirm === 'new' ? 'Tap again' : 'New game', G.confirm === 'new' ? 'this one is lost' : 'pick your people', G.confirm === 'new' ? 'warn' : '')}</div>
      <p>The game saves itself every ${SAVE_EVERY} seconds on this phone. World, game length and people take effect in the next game.</p>`;
  }
  const info = infoBuf.join(''), bookOn = !!info && G.infoOpen;
  if (bookOn) h = h.replace('</h3>', `</h3><div class="infoP">${info}</div>`);
  if (h !== cardSig) { cardSig = h; patchHTML($('card'), (info ? `<button id="cardI" class="${bookOn ? 'on' : ''}" data-act="info" aria-label="About this">${BOOK}</button>` : '') + `<button id="cardX" data-act="close" aria-label="Close">×</button>` + h); }
  $('card').classList.toggle('full', ['setup', 'resume', 'help', 'guide', 'score', 'end', 'research'].includes(c.type) || (c.type === 'bld' && (G.blds.find(b => b.id === c.id) || {}).kind === 'market')); $('card').hidden = false;
}
$('card').addEventListener('toggle', e => { const id = e.target.dataset && e.target.dataset.f; if (id) { if (e.target.open) FOLD.add(id); else FOLD.delete(id); } }, true);
function settingsHTML() {
  return `<div class="sec">Difficulty</div><div class="acts">${btn('diff:easy', 'Easy', `they think slower; no raid before ${clock(EASY_SAFE)}`, SET.diff === 'easy' ? 'on' : '')}${btn('diff:normal', 'Normal', 'they think once a second', SET.diff === 'normal' ? 'on' : '')}</div>
    <div class="sec">Game</div><div class="acts c3">${Object.entries(MODES).map(([k, m]) => btn(`mode:${k}`, m.name, k === 'conquest' ? 'no limit' : 'top score wins', SET.mode === k ? 'on' : '')).join('')}</div>
    <div class="sec">World</div><div class="acts">${btn('fantasy:0', 'Real', 'wolves, bandits, robbers', !SET.fantasy ? 'on' : '')}${btn('fantasy:1', 'Fantasy', 'dire wolves, goblins, trolls', SET.fantasy ? 'on' : '')}</div>`;
}
// Attack with: on an enemy or a find card, from the whole army or one battalion, how many of each type, then go. The nearest of each type go.
const qsPool = () => armyOf(0).filter(u => u.kind !== 'spy' && u.state !== 'shrine' && (G.qs.from === 'all' || u.bn === G.qs.from));
function qsPick(to) {
  const by = {}; for (const u of qsPool()) (by[u.kind] = by[u.kind] || []).push(u);
  const out = []; for (const k in by) { by[k].sort((a, b) => dist(a, to) - dist(b, to)); out.push(...by[k].slice(0, Math.min(by[k].length, G.qs.n[k] ?? by[k].length))); }
  return out;
}
function qsHTML(verb, label, to) {
  if (!hasCmd()) G.qs.from = 'all';
  let h = hasCmd() ? `<div class="acts c4">${[['all', 'All'], ...BN.map((n, i) => [i, n])].map(([k, n]) => btn(`qsfrom:${k}`, n, String(armyOf(0).filter(u => u.kind !== 'spy' && (k === 'all' || u.bn === k)).length), G.qs.from === k ? 'on' : '')).join('')}</div>` : '';
  const by = {}; for (const u of qsPool()) by[u.kind] = (by[u.kind] || 0) + 1;
  if (!Object.keys(by).length) return h + `<p>No soldiers${G.qs.from === 'all' ? ' yet: train them at a Barracks, Range or Stable' : ' in ' + BN[G.qs.from]}.</p>`;
  h += Object.entries(by).map(([k, have]) => `<div class="qs"><b>${stats(0, k).name}</b>${btn(`qsn:${k},-`, '−')}<span>${Math.min(have, G.qs.n[k] ?? have)} of ${have}</span>${btn(`qsn:${k},+`, '+')}</div>`).join('');
  const S = qsPick(to), foe = to.owner !== undefined && to.owner !== 0 && to.owner !== WILD ? to.owner : null;
  return h + `<div class="acts c1">${btn(verb, `${label} ${S.length}`, foe !== null ? oddsText(S, foe) : '', S.length ? (foe !== null ? 'warn' : 'go') : 'dis')}</div>`;
}
// The send strip: tap open ground and a small row of choices sits at your finger: a quarter, all, a battalion, more, cancel.
// A quarter takes a quarter of each type, nearest first, so the mix of the army goes along.
const sendable = () => armyOf(0).filter(u => u.kind !== 'spy' && u.state !== 'shrine' && u.state !== 'escort');   // guards keep to what they guard
// Guards: up to 12 soldiers escort one caravan or garrison one trade stop; 4 more at a tap, the nearest free ones
const guardsOf = (t, id) => armyOf(0).filter(u => u.state === 'escort' && (t === 'f' ? u.escF === id : u.escId === id));
function guardRow(t, id) {
  const n = guardsOf(t, id).length, free = sendable().length, verb = t === 'f' ? 'Garrison' : 'Escort';
  return `<div class="acts">${btn(`guard:${t},${id}`, `${verb} +4`, n >= POST.guard ? `full: ${n}/${POST.guard}` : free ? `${n}/${POST.guard} · ${free} free` : 'no free soldiers', n < POST.guard && free ? '' : 'dis')}${btn(`unguard:${t},${id}`, 'Release', n ? `${n} go home` : 'none here', n ? '' : 'dis')}</div>`;
}
function sendPick(from, to) {
  const A = sendable(), by = {};
  for (const u of A) if (from === 'q' || from === 'all' || u.bn === from) (by[u.kind] = by[u.kind] || []).push(u);
  const out = []; for (const k in by) { const a = by[k].sort((p, q) => dist(p, to) - dist(q, to)); out.push(...a.slice(0, from === 'q' ? Math.ceil(a.length / 4) : a.length)); }
  return out;
}
function showStrip(sx, sy, x, y) {
  closeCard(); const el = $('strip'), at = `${Math.round(x)},${Math.round(y)}`, to = { x, y }, n = from => sendPick(from, to).length;
  const bns = hasCmd() ? BN.map((nm, i) => [i, nm]).filter(([i]) => n(i)) : [];
  el.innerHTML = (n('all') ? btn(`sendto:q,${at}`, 'Send ¼', String(n('q')), 'go') + btn(`sendto:all,${at}`, 'All', String(n('all'))) + bns.map(([i, nm]) => btn(`sendto:${i},${at}`, nm, String(n(i)))).join('') : '')
    + btn(`more:${at}`, '⋯', '') + `<button data-act="nostrip" aria-label="Cancel">✕</button><small class="sn">Hold, then drag to box a group</small>`;
  el.hidden = false; G.strip = to;
  const r = $('stage').getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
  el.style.left = clamp(sx - w / 2, 4, r.width - w - 4) + 'px'; el.style.top = clamp(sy - h - 18, 4, r.height - h - 4) + 'px';
}
function hideStrip() { const el = $('strip'); if (el && !el.hidden) { el.hidden = true; if (G) G.strip = null; } }
// the War Council: six battalions, what each holds by type, its stance and formation
// what a battalion still lacks: its plan, less the members it has and the soldiers already mustering for it
function musterGap(i) {
  const gap = { ...G.bnPlan[i] };
  for (const u of armyOf(0)) if (u.bn === i && gap[u.kind]) gap[u.kind]--;
  for (const b of G.blds) if (b.owner === 0) for (const j of b.q) if (j.muster && j.bn === i) for (const k in j.muster) gap[k] = (gap[k] || 0) - j.muster[k];
  for (const k in gap) if (gap[k] <= 0) delete gap[k];
  return gap;
}
function councilHTML(b) {
  const p0 = G.P[0];
  if (!hasCmd()) return `<p>${p0.techs.has('engage') ? 'Stances are open: set them in the Army card. Next: Battalions, six of them, Alpha to Zeta.' : 'Research Engagement first: stances for your army. Then Battalions, Formations and Muster.'}</p>`;
  const p = G.P[0], i = G.bnEdit, plan = G.bnPlan[i], S = armyOf(0).filter(u => u.kind !== 'spy');
  let h = `<div class="sec">Battalions</div><div class="acts c3">${BN.map((n, j) => btn(`bned:${j}`, n, `${S.filter(u => u.bn === j).length} in it`, j === i ? 'on' : '')).join('')}</div>`;
  const kinds = [...new Set([...S.map(u => u.kind), ...Object.keys(plan)])];
  h += `<div class="sec">${BN[i]} holds</div>` + (kinds.length ? kinds.map(k => `<div class="qs"><b>${stats(0, k).name}</b>${btn(`bnn:${k},-`, '−')}<span>${plan[k] || 0} · has ${S.filter(u => u.bn === i && u.kind === k).length}</span>${btn(`bnn:${k},+`, '+')}</div>`).join('') : '<p>Train soldiers first.</p>');
  const f = FORM[G.form[i] || 0];
  h += `<div class="acts">${btn('bnstance', 'Stance: ' + STANCE[G.stance[i] || 0].name, '')}${p.techs.has('formations') ? btn('bnform', 'Formation: ' + f.name, f.note) : ''}</div>`;
  if (p.techs.has('muster')) { const miss = musterGap(i), why = musterWhy(0, miss), mc = musterCost(0, miss); h += `<div class="acts c1">${btn(`muster:${i}`, `Muster ${BN[i]}: +${musterN(miss)}`, why ? why.replace(/\.$/, '') : `${costText(mc.cost)} · ${mc.t} s`, why ? 'dis' : 'go')}</div>`; }
  return h + fold('bnabout', 'About battalions', `<p>New soldiers fill each battalion up to what you set; the rest are the reserve. Send a battalion from the strip: tap open ground, then its name.</p><p><b>Formations:</b> ${FORM.map(F => `${F.name}: ${F.note}`).join('. ')}.</p>`);
}
// the side at war with you whose Town Center is nearest yours
function foeNearest() { const k = keepOf(0); let bd = 1e9, t = null; if (k) for (const q of G.P) if (q.alive && q.id !== WILD && atWar(0, q.id)) { const d = hyp(q.keep[0] - k.x, q.keep[1] - k.y); if (d < bd) { bd = d; t = q.id; } } return t; }
// the odds the computers use (07-ai.js): the square law on strength, bent by who counters whom, against their army, towers and Town Center
function oddsText(S, t) { if (t === null || t === undefined || !S.length) return ''; const r = powerOf(S) / estPower(0, t) * matchup(S, soldiersOf(t)), p = r * r / (1 + r * r); return `odds ${p > 0.65 ? 'strong' : p > 0.4 ? 'even' : 'weak'}`; }
// The Town Center: the age on its Research side; your people, goods and the whole research tree under More
function keepAgeBtn() {   // the next age, as one research button; the reason waits behind the book
  const p = G.P[0], A = AGES[p.age + 1]; if (!A) return '';
  fold('why', 'Why this age?', `<p>${WHY['age' + (p.age + 1)]}</p>`);
  return btn('age', `${A.name} age`, p.aging ? 'advancing' : costText(A.cost), p.aging || !afford(p, A.cost) ? 'dis' : 'go');
}
function keepMoreHTML() {
  const p = G.P[0], C = CIVS[p.civ];
  let h = `<div class="acts c1">${btn('dismiss', 'Dismiss villager', 'frees a place')}</div>`;
  h += `<p><i>${C.name}.</i> ${C.bonus} Unique soldier: ${UNIT[C.uu].name}. Wonder: ${C.wonder}.</p>`;
  h += `<p><i>Food:</i> your people eat ${Math.round(p.eats || 0)} a minute${p.hungry ? ' · <b>none left: work and fighting −25%, no training</b>' : ''}. ${vassalsOf(0).length ? `<i>Vassals:</i> ${vassalsOf(0).map(q => `${q.name} (${q.rebel ? 'in revolt' : `unrest ${Math.round(q.unrest)}%`})`).join(', ')}.` : ''}</p>`;
  h += `<p><i>Goods:</i> ${goodsText(p.goods) || 'none yet'}. <i>Wanted by others here:</i> ${G.P.filter(q => q.id && q.id !== WILD && q.alive).map(q => `${q.name} ${q.wants.map(k => GOODS[k].name.toLowerCase()).join(' and ')}`).join('; ')}.</p>`;
  const done = TECH.filter(t => p.techs.has(t.id)), going = [], open = TECH.filter(t => !p.techs.has(t.id) && !researchWhy(0, t.id));
  for (const b of G.blds) if (b.owner === 0) b.q.forEach((j, i) => { if (j.tech) going.push(`${TECHBY[j.tech].name}${i === 0 ? ` (${Math.ceil(j.left)} s)` : ' (waiting)'}`); });
  h += `<p><b>Research: ${done.length} of ${TECH.length} done.</b>${going.length ? ` <i>Under way:</i> ${going.join(' · ')}.` : ''}${open.length ? ` <i>Ready now:</i> ${open.map(t => `${t.name} (${BLD[t.at].name})`).join(' · ')}.` : ''}</p>`;
  h += AGES.map((A, i) => { const T = TECH.filter(t => t.age === i); return T.length ? `<p><b>${A.name}:</b> ${T.map(t => p.techs.has(t.id) ? `<span class="done">✓ ${t.name}</span>` : `<span class="dim">${t.name}</span>`).join(' · ')}</p>` : ''; }).join('');
  return h;
}
function diploHTML() {
  const F = G.P[FORT], p = G.P[0];
  if (!F.alive) return '<p>The Fortress has fallen.</p>';
  let h = `<p>They stay home behind their walls and ally with whoever helps them survive. ${F.ally !== null ? `Allied with ${F.ally === 0 ? 'you' : G.P[F.ally].name}.` : 'No ally yet.'}</p>`;
  if (G.rel[0][FORT] === 'war') return h + '<p>You are at war with them.</p>';
  if (F.ally === 0) return h + `<div class="acts">${btn('askhelp', 'Ask for troops', 'to your army', 'go')}${btn('overlord', 'Offer to be overlord', powerOf(soldiersOf(0)) >= 2 * powerOf(soldiersOf(FORT)) ? 'they pay a light tax and you protect them' : 'needs twice their army', powerOf(soldiersOf(0)) >= 2 * powerOf(soldiersOf(FORT)) ? 'go' : 'dis')}</div><p>As your ally they send part of their surplus every 45 seconds and defend your town when it is attacked.</p>`;
  const terms = F.terms && F.terms[0];
  h += `<div class="acts">${btn('envoy', 'Send emissary', p.age < 1 ? 'Bronze age' : p.envoyOut ? 'on the way' : costText(UNIT.envoy.cost), p.age < 1 || p.envoyOut || !afford(p, UNIT.envoy.cost) ? 'dis' : 'go')}`;
  if (terms) h += btn('terms', 'Pay their terms', `${terms}g`, p.res.g >= terms ? 'go' : 'dis');
  return h + `</div><p>Attacking them is an act of war.</p>`;
}

// ───────────────────────── The guide, written by the game from its own tables ─────────────────────────
function guideModel() {
  const unitsAt = k => Object.values(UNIT).filter(U => U.at === k && !U.civ).map(U => U.name), techsAt = k => TECH.filter(t => t.at === k).map(t => t.name);
  const menuOf = {}; MENUS.forEach(m => m.items.forEach(i => { menuOf[i] = m.name; }));
  const buildings = Object.entries(BLD).map(([id, B]) => ({ id, name: B.name + (B.name3 ? ` (${B.name3} in the Medieval age)` : ''), menu: id === 'keep' ? 'you start with it' : menuOf[id], age: AGES[B.age || 0].name, cost: costText(B.cost) || 'free', secs: B.t ? B.t + ' s' : '', squares: B.fp + '×' + B.fp, trains: unitsAt(id), research: techsAt(id), what: B.desc, why: WHY[id] }));
  const tierNames = id => TECH.filter(t => t.tier && t.tier.unit === id).map(t => `${t.tier.name} (${t.name})`);
  const units = Object.entries(UNIT).filter(([, U]) => U.cost).map(([id, U]) => ({ id, name: U.name, at: U.at ? BLD[U.at].name : 'the Town Center', age: AGES[U.age || 0].name, cost: costText(U.cost), secs: U.t + ' s', hp: U.hp, dmg: U.dmg || 0, rng: U.rng || 0, spd: U.spd, civ: U.civ ? CIVS[U.civ].name : '', replaces: U.replaces ? UNIT[U.replaces].name : '',
    beats: Object.entries(U.vs || {}).map(([k, m]) => (UNIT[k] ? UNIT[k].name : k) + ' ×' + m).concat(U.bld && U.bld !== 1 ? ['buildings ×' + U.bld] : []).concat(U.bonly ? ['buildings only'] : []),
    tiers: tierNames(id), what: U.desc, why: WHY[id] }));
  const techs = TECH.map(t => ({ id: t.id, name: t.name, at: BLD[t.at].name, age: AGES[t.age].name, need: t.need ? TECHBY[t.need].name : '', cost: costText(t.cost), secs: t.t + ' s', what: t.desc, why: WHY[t.id] }));
  const ages = AGES.map((A, i) => ({ id: 'age' + i, name: A.name, cost: i ? costText(A.cost) : 'where you start', secs: i ? A.t + ' s' : '',
    opens: { buildings: Object.entries(BLD).filter(([k, B]) => k !== 'keep' && (B.age || 0) === i).map(([, B]) => B.name), units: Object.values(UNIT).filter(U => U.cost && !U.civ && (U.age || 0) === i).map(U => U.name), research: TECH.filter(t => t.age === i).map(t => t.name) }, why: WHY['age' + i] }));
  const civs = CIVK.map(k => ({ id: k, name: CIVS[k].name, unit: UNIT[CIVS[k].uu].name, replaces: UNIT[UNIT[CIVS[k].uu].replaces].name, bonus: CIVS[k].bonus, wonder: CIVS[k].wonder, why: WHY['bonus:' + k], wwhy: WHY['wonder:' + k], uwhy: WHY[CIVS[k].uu] }));
  const finds = Object.entries(FINDS).map(([id, F]) => ({ id, name: F.name, what: F.desc, why: WHY[id] }));
  const rules = TRIGGERS().map(([when, then, why]) => ({ when, then, why }));
  return { buildings, units, techs, ages, civs, finds, rules };
}
function guideHTML(pg) {
  const g2 = guideModel(), E = (t, m, lines) => `<div class="g"><b>${t}</b><small>${m}</small>${lines.filter(Boolean).map(l => `<p>${l}</p>`).join('')}</div>`;
  if (pg === 'bld') return g2.buildings.map(b => E(b.name, `${b.menu} · ${b.age} age · ${b.cost}${b.secs ? ' · ' + b.secs : ''}`, [b.what, (b.trains.length ? `<i>Trains:</i> ${b.trains.join(', ')}. ` : '') + (b.research.length ? `<i>Researches:</i> ${b.research.join(', ')}.` : ''), b.why && `<i>Why:</i> ${b.why}`])).join('');
  if (pg === 'unit') return g2.units.map(u => E(u.name, `${u.civ ? u.civ + ' only, in place of the ' + u.replaces + ' · ' : ''}${u.at} · ${u.age} age · ${u.cost} · ${u.secs}`, [u.what, `<i>Health</i> ${u.hp}${u.dmg ? ` · <i>hits</i> ${u.dmg} · <i>reach</i> ${u.rng}` : ''} · <i>speed</i> ${u.spd}`, u.beats.length ? `<i>Strong against:</i> ${u.beats.join(', ')}` : '', u.tiers.length ? `<i>Becomes:</i> ${u.tiers.join(', then ')}` : '', u.why && `<i>Why:</i> ${u.why}`])).join('');
  if (pg === 'tech') return g2.techs.map(t => E(t.name, `${t.at} · ${t.age} age · ${t.cost} · ${t.secs}${t.need ? ' · needs ' + t.need : ''}`, [t.what, t.why && `<i>Why:</i> ${t.why}`])).join('');
  if (pg === 'age') return g2.ages.map(a => E(a.name + ' age', `${a.cost}${a.secs ? ' · ' + a.secs : ''}`, [`<i>Opens:</i> ${[a.opens.buildings.join(', '), a.opens.units.join(', '), a.opens.research.join(', ')].filter(Boolean).join(' · ')}`, `<i>Why:</i> ${a.why}`])).join('');
  if (pg === 'civ') return g2.civs.map(c => E(c.name, `${c.unit} (in place of the ${c.replaces}) · ${c.wonder}`, [c.bonus, `<i>Why:</i> ${c.why}`, `<i>${c.unit}:</i> ${c.uwhy}`, `<i>${c.wonder}:</i> ${c.wwhy}`])).join('') + g2.finds.map(f => E(f.name, 'in the wild', [f.what, f.why && `<i>Why:</i> ${f.why}`])).join('');
  return g2.rules.map(r => E(r.when, '', [r.then, `<i>Why:</i> ${r.why}`])).join('');
}
function guideMd() {
  const g2 = guideModel(), L = [], cell = s => String(s || '-').replace(/\|/g, '/');
  L.push(`# First Keep (build ${BUILD}): what triggers what, what begets what, and why`, '', 'Written by the game from its own rule tables, so it cannot disagree with the game.', '');
  L.push('## Ages', '', '| Age | Costs | Opens | Why |', '|---|---|---|---|');
  for (const a of g2.ages) L.push(`| ${a.name} | ${a.cost}${a.secs ? ', ' + a.secs : ''} | ${cell([a.opens.buildings.join(', '), a.opens.units.join(', '), a.opens.research.join(', ')].filter(Boolean).join('; '))} | ${cell(a.why)} |`);
  L.push('', '## Peoples', '', '| People | Unique soldier | Bonus | Wonder | Why |', '|---|---|---|---|---|');
  for (const c of g2.civs) L.push(`| ${c.name} | ${c.unit} (for the ${c.replaces}) | ${c.bonus} | ${c.wonder} | ${cell(c.why + ' ' + c.uwhy + ' ' + c.wwhy)} |`);
  L.push('', '## Buildings', '', '| Building | Menu | Age | Costs | Trains / researches | What it does | Why |', '|---|---|---|---|---|---|---|');
  for (const b of g2.buildings) L.push(`| ${b.name} | ${cell(b.menu)} | ${b.age} | ${b.cost}${b.secs ? ', ' + b.secs : ''} | ${cell([b.trains.length ? 'trains ' + b.trains.join(', ') : '', b.research.length ? 'researches ' + b.research.join(', ') : ''].filter(Boolean).join('; '))} | ${cell(b.what)} | ${cell(b.why)} |`);
  L.push('', '## Units', '', '| Unit | From | Age | Costs | Health | Strong against | Becomes | Why |', '|---|---|---|---|---|---|---|---|');
  for (const u of g2.units) L.push(`| ${u.name}${u.civ ? ' (' + u.civ + ')' : ''} | ${u.at} | ${u.age} | ${u.cost}, ${u.secs} | ${u.hp} | ${cell(u.beats.join(', '))} | ${cell(u.tiers.join(', '))} | ${cell(u.why)} |`);
  L.push('', '## Research', '', '| Research | At | Age | Needs | Costs | Effect | Why |', '|---|---|---|---|---|---|---|');
  for (const t of g2.techs) L.push(`| ${t.name} | ${t.at} | ${t.age} | ${cell(t.need)} | ${t.cost}, ${t.secs} | ${cell(t.what)} | ${cell(t.why)} |`);
  L.push('', '## The wild', '', '| Find | What | Why |', '|---|---|---|');
  for (const f of g2.finds) L.push(`| ${f.name} | ${cell(f.what)} | ${cell(f.why)} |`);
  L.push('', '## Rules: what triggers what', '', '| When | Then | Why |', '|---|---|---|');
  for (const r of g2.rules) L.push(`| ${cell(r.when)} | ${cell(r.then)} | ${cell(r.why)} |`);
  return L.join('\n');
}

// ───────────────────────── The orders panel ─────────────────────────
function buildPanel() {
  $('jobs').innerHTML = JOBS.map(r => `<div class="jobc"><button class="jn" data-act="job:${r}"><b>${r[0].toUpperCase() + r.slice(1)}</b><small id="j${r}">0</small></button><div class="pm"><button data-act="less:${r}" aria-label="One fewer on ${r}">−</button><button data-act="move:${r}" aria-label="One more on ${r}">+</button></div></div>`).join('');
  }
const refresh = () => { cardSig = ''; ui(true); };
// every button's verb, in one table
const ACT = {
  pause() { setPause(!G.paused); },
  speed() { G.speed = G.speed >= 3 ? 1 : G.speed + 1; paceBtn(); },   // ×1, ×2, ×3, back to ×1; it never pauses
  again() { $('end').hidden = true; openCard({ type: 'setup' }); },
  free() { G.over = null; G.free = true; $('end').hidden = true; setPause(false); say('Free play: no clock, no victory.', '', 6); },
  next() { const p = G.P[0], keep = { age: p.age, techs: [...p.techs] }; $('end').hidden = true; newGame(undefined, keep); setPause(false); say('A new land. You keep your age and research.', 'good', 8); saveGame(true); },
  close() { if (G.card && (G.card.type === 'resume' || G.card.type === 'setup') && G.paused) { setPause(false); } closeCard(); if (G.over) $('end').hidden = false; },   // backing out of New game brings the end screen back
  cancel() { cancelPlace(); },
  placeok() { commitPlace(); },
  help() { openCard({ type: 'help' }); },
  reload() { location.reload(); },
  vibe() { SET.vibe = !SET.vibe; saveSet(); feel('snap'); refresh(); },
  menu(a) { const keep = G.card && G.card.type === 'menu'; openCard({ type: 'menu', id: a }); if (keep) $('card').scrollTop = 0; },
  buildcard() { if (G.card && G.card.type === 'menu') { closeCard(); return; } openCard({ type: 'menu', id: G.lastMenu || 'home' }); },
  idlego() { const u = unitsOf(0, 'vil').find(v => !v.job); if (!u) return; cam.x = u.x; cam.y = u.y; clampCam(); closeCard(); },
  seek(a) { const o = Number(a), k = keepOf(o) || G.blds.find(b => b.owner === o); if (!k) { say('Nothing of theirs stands.', '', 3); return; } cam.x = k.x; cam.y = k.y; clampCam(); if (k.kind === 'keep') { G.card = null; openCard({ type: 'bld', id: k.id }); } else closeCard(); },
  guide(a) { openCard({ type: 'guide', page: a }); },
  info() { G.infoOpen = !G.infoOpen; cardSig = ''; renderCard(); },
  map() { SET.mini = !SET.mini; saveSet(); applyMini(); },
  home() { const k = keepOf(0); if (k) { cam.x = k.x; cam.y = k.y; clampCam(); } },
  resume() { const S = readSave(); if (S) loadGame(S); else { closeCard(); setPause(false); } refresh(); },
  fresh() { clearSave(); holdSave = false; newGame(); closeCard(); setPause(false); saveGame(true); refresh(); },
  newgame() { if (G.confirm === 'new') { openCard({ type: 'setup' }); return; } G.confirm = 'new'; refresh(); },
  civ(a) { SET.civ = a; saveSet(); refresh(); },
  diff(a) { SET.diff = a; G.diff = a; saveSet(); refresh(); },
  mode(a) { SET.mode = a; saveSet(); refresh(); },
  fantasy(a) { SET.fantasy = a === '1'; saveSet(); refresh(); },
  tips() { SET.tips = !SET.tips; saveSet(); refresh(); },
  msgs() { SET.msgs = SET.msgs === false; saveSet(); refresh(); },
  hush(a) { const t = decodeURIComponent(a || $('tipT').textContent), k = hushKey(t), m = G.log.find(x => x.text === t);
    if (m && m.cls === 'warn') (G.hushW = G.hushW || {})[k] = G.t + 120; else { (SET.hush = SET.hush || {})[k] = 1; saveSet(); }
    G.log = G.log.filter(x => hushKey(x.text) !== k); ui(true); },
  unhush() { SET.hush = {}; G.hushW = {}; saveSet(); refresh(); },
  sound() { SND.on = !SND.on; saveSnd(); sndInit(); sfx('tap'); muteBtn(); refresh(); },
  soundpage() { openCard({ type: 'sound' }); },
  // one step rule for every volume: tenths, 0 to 100%
  vol(a) { const [k, d] = a.split(','), step = v => clamp(Math.round((v + (d === '+' ? 0.1 : -0.1)) * 10) / 10, 0, 1);
    if (k === 'all') SND.vol = step(SND.vol); else SET.mix[k] = step(SET.mix[k]); saveSnd(); sndInit(); sfx(k === 'amb' ? 'bird' : k === 'alert' ? 'ready' : 'tap'); refresh(); },
  jump(a) { const [x, y] = a.split(',').map(Number); cam.x = x; cam.y = y; clampCam(); },
  card(a) { openCard({ type: a }); },
};
// orders that change the game: refused once it is over
const PLAY = {
  job(a) { G.P[0].rally = a; unitsOf(0, 'vil').forEach(u => { if (!u.job) u.job = a; }); },
  move(a) { if (!unitsOf(0, 'vil').some(u => !u.job)) { say('Nobody is idle. Use − on another job.', '', 3); return; } moveVil(0, a); }, less(a) { moveVil(0, a, true); },
  mtab(a) { G.mtab = a; },
  sel(a) { G.sel = a === 'all' ? 'all' : Number(a); },
  sendto(a) { const [f, x, y] = a.split(','), to = { x: Number(x), y: Number(y) }, S = sendPick(f === 'q' || f === 'all' ? f : Number(f), to);
    S.forEach(u => { u.state = 'goto'; u.px = to.x; u.py = to.y; u.idleT = 0; u.focus = null; }); if (S.length) { say(`${S.length} on the way.`, '', 3); ripple(to.x, to.y, '#ffd35e'); } hideStrip(); },
  nostrip() { hideStrip(); },
  more(a) { const [x, y] = a.split(',').map(Number); openCard({ type: 'ground', x, y }); },
  qsfrom(a) { G.qs.from = a === 'all' ? 'all' : Number(a); },
  qsn(a) { const [k, d] = a.split(','), have = qsPool().filter(u => u.kind === k).length, cur = Math.min(have, G.qs.n[k] ?? have); G.qs.n[k] = clamp(cur + (d === '+' ? 1 : -1), 0, have); },
  qgo(a) { const [x, y] = a.split(',').map(Number), S = qsPick({ x, y }); S.forEach(u => { u.state = 'goto'; u.px = x; u.py = y; u.idleT = 0; u.focus = null; }); if (S.length) { say(`${S.length} on the way.`, '', 3); ripple(x, y, '#ffd35e'); } closeCard(); },
  qatk(a) { const b = G.blds.find(x => x.id === Number(a) && x.hp > 0); if (!b) return; const S = qsPick(b); S.forEach(u => { u.state = 'attack'; u.target = b.owner; u.bid = b.id; u.focus = null; }); if (S.length) { say(`${S.length} march on the ${bldName(b.owner, b.kind).toLowerCase()}.`, '', 3); ripple(b.x, b.y, '#ff8a70'); } closeCard(); },
  qfoe(a) { const v = G.units.find(x => x.id === Number(a) && x.hp > 0); if (!v) return; const S = qsPick(v); S.forEach(u => { u.state = 'goto'; u.px = v.x; u.py = v.y; u.idleT = 0; u.focus = v; }); if (S.length) ripple(v.x, v.y, '#ff8a70'); closeCard(); },
  bned(a) { G.bnEdit = Number(a); },
  muster(a) { const i = Number(a); if (muster(0, musterGap(i), i)) sfx('place'); else sfx('err'); },
  bnn(a) { const [k, d] = a.split(','), P = G.bnPlan[G.bnEdit], cur = P[k] || 0, st = d === '+' ? (cur < 10 ? 1 : 5) : (cur <= 10 ? 1 : 5); P[k] = clamp(cur + (d === '+' ? st : -st), 0, ARMYMAX); if (!P[k]) delete P[k]; rebattalion(); },
  bnstance() { const i = G.bnEdit; G.stance[i] = ((G.stance[i] || 0) + 1) % STANCE.length; },
  bnform() { const i = G.bnEdit; G.form[i] = ((G.form[i] || 0) + 1) % FORM.length; },
  sendvil(a) { sendVil(0, Number(a)); },
  boxcut(a) { if (G.card && G.card.type === 'box') boxCut(G.card.r, Number(a)); closeCard(); },
  boxjob(a) { const c = G.card; if (!c || c.type !== 'box') return; for (const id of c.vils) { const u = G.units.find(x => x.id === id); if (u) { u.patch = null; setJob(u, a); } } say(`${c.vils.length} on ${a}.`, '', 3); closeCard(); },
  boxbuild() { const c = G.card; if (!c || c.type !== 'box') return; for (const id of c.vils) { const u = G.units.find(x => x.id === id), s = u && nearest(G.blds, u, b => b.owner === 0 && b.prog < 1 && b.hp > 0); if (s) sendBuild(0, s.id, u.id); } closeCard(); },
  demand(a) { demandSurrender(0, Number(a)); closeCard(); },
  overlord() { if (powerOf(soldiersOf(0)) >= 2 * powerOf(soldiersOf(FORT)) && G.P[FORT].ally === 0) makeVassal(FORT, 0, 'light'); },
  tax(a) { const [q, t] = a.split(','), P = G.P[Number(q)]; if (P && P.lord === 0 && TAX[t]) { P.tax = t; say(`Tax on ${P.name}: ${t}.`, '', 3); } },
  venture(a) { if (!venture(0, Number(a))) say('Needs Medieval age, gold, and under 3 ventures.', '', 4); },
  douse(a) { const b = G.blds.find(x => x.id === Number(a) && x.owner === 0); let n = 0; if (b && b.fire > 0) for (let i = 0; i < 2; i++) { const v = pickVil(0, b, null, b); if (v) { if (v.job !== 'repair') v.pj = v.job; setJob(v, 'repair'); v.rep = b; v.fireman = true; n++; } } G.log = G.log.filter(m => m.act !== 'douse:' + a); if (n) say(`${n} more run to the fire.`, '', 3); else if (b && b.fire > 0) say('No villager is free.', '', 3); },
  tpost(a) { const f = G.finds.find(x => x.id === Number(a)); if (!f) return; const why = canPlace(0, 'tpost', f.x, f.y); if (why) { say(why + '.', '', 3); return; } if (!afford(G.P[0], BLD.tpost.cost)) { say(`Not enough: ${costText(BLD.tpost.cost)}.`, '', 3); return; } if (G.P[0].age < BLD.tpost.age) { say('Trade posts need the Bronze age.', '', 3); return; } build(0, 'tpost', f.x, f.y); say('A villager sets out to build the trade post.', '', 4); },
  want(a) { const f = G.finds.find(x => x.id === Number(a)); if (f && f.owner === 0) { f.want = WARES[(WARES.indexOf(f.want) + 1) % WARES.length]; } },
  route(a) { const [cid, s, id] = a.split(','), c = G.units.find(u => u.id === Number(cid) && u.owner === 0), t = s === 's' ? G.finds.find(f => f.id === Number(id)) : G.blds.find(b => b.id === Number(id)); if (c && t) { if (!homeBiz(0, c)) { say('Build a Business Center first: Build → Business Center.', '', 4); return; } setRoute(c, t, true, s === 's'); say('The caravan takes the route, and repeats it.', '', 3); } },
  rrep(a) { const c = G.units.find(u => u.id === Number(a)); if (c && c.route) c.route.rep = !c.route.rep; },
  rsp(a) { const c = G.units.find(u => u.id === Number(a)); if (c && c.route) c.route.spice = !c.route.spice; },
  rclr(a) { const c = G.units.find(u => u.id === Number(a)); if (c) { c.route = null; c.dest = null; } }, sendbld(a) { sendBuild(0, Number(a)); }, buildat(a) { const [v, s] = a.split(',').map(Number); sendBuild(0, s, v); }, hunt(a) { sendHunt(0, Number(a)); }, repair(a) { sendRepair(0, Number(a)); },
  takedown(a) { const id = Number(a), b = G.blds.find(x => x.id === id && x.owner === 0); if (b && b.kind !== 'keep') { if (BLD[b.kind].wallish || b.prog < 0.15 || G.confirm === id) { demolish(0, id); G.confirm = null; closeCard(); } else G.confirm = id; } },
  train(a) { if (!train(0, a)) say(trainWhy(0, a) || 'Not now.', '', 3); },
  tech(a) { if (!research(0, a)) say(researchWhy(0, a) || 'Not now.', '', 3); },
  age() { ageUp(0); },
  scoutgo(a) { const [x, y] = a.split(',').map(Number), s = unitsOf(0, 'scout')[0]; if (s) { s.state = 'goto'; s.px = x; s.py = y; say('The scout rides out.', '', 3); } closeCard(); },
  rally(a) { const [x, y] = a.split(',').map(Number); G.rally0 = G.rally0 ? null : { x, y }; },
  recall() { orderSet().forEach(u => { u.state = 'home'; u.fid = null; }); closeCard(); },
  attack(a) {
    const target = a === 'near' ? foeNearest() : Number(a);
    if (target !== null) { orderSet().forEach(u => { u.state = 'attack'; u.target = target; u.bid = null; }); say(`Marching on the ${G.P[target].name}.`, '', 3); }
    closeCard();
  },
  envoy() { sendEnvoy(0, FORT); }, terms() { payTerms(0); }, askhelp() { askHelp(0); },
  vjob(a) { const [id, j] = a.split(','), u = G.units.find(x => x.id === Number(id)); if (u && u.owner === 0) { setJob(u, u.job === j ? null : j); u.pj = null; u.idleT = 0; } },
  vgo(a) { const u = G.units.find(x => x.id === Number(a)); if (!u) return; if (G.confirm !== 'v' + u.id) { G.confirm = 'v' + u.id; return; } G.confirm = null; setJob(u, null); u.hp = 0; u.gone = true; say('A villager was sent home.', '', 3); closeCard(); },
  dismiss() { const v = unitsOf(0, 'vil').sort((a, b) => a.carry - b.carry)[0]; if (v) { v.hp = 0; v.gone = true; say('A villager was sent home.', '', 3); } },
  sab(a) { const b = G.blds.find(x => x.id === Number(a)), sp = b && unitsOf(0, 'spy').filter(u => u.state !== 'sab').sort((x, y) => dist(x, b) - dist(y, b))[0]; if (!b || !BLD[b.kind].sab || !sp) { say(!sp ? 'You have no free spy.' : 'That cannot be sabotaged.', '', 3); return; } sp.state = 'sab'; sp.tid = b.id; say('A spy slips away to sabotage it.', '', 4); closeCard(); },
  spygo(a) { const [x, y] = a.split(',').map(Number), sp = unitsOf(0, 'spy').filter(u => u.state !== 'sab').sort((p, q) => dist(p, { x, y }) - dist(q, { x, y }))[0]; if (!sp) { say('You have no free spy.', '', 3); return; } sp.state = 'goto'; sp.px = x; sp.py = y; say('A spy goes to look.', '', 3); closeCard(); },
  shrine(a) { const f = G.finds.find(x => x.id === Number(a)), pr = f && unitsOf(0, 'priest').sort((p, q) => dist(p, f) - dist(q, f))[0]; if (!pr) { say('You have no priest: Build → Temple.', '', 3); return; } pr.state = 'shrine'; pr.fid = f.id; say('A priest walks to the shrine.', '', 3); closeCard(); },
  hire(a) { const f = G.finds.find(x => x.id === Number(a)); if (f && !hire(0, f)) say(hireWhy(0, f), '', 3); },
  guard(a) { const [t, i] = a.split(','), id = Number(i), at = t === 'f' ? G.finds.find(f => f.id === id) : G.units.find(v => v.id === id); if (!at) return;
    const room = POST.guard - guardsOf(t, id).length, S = sendable().sort((p, q) => dist(p, at) - dist(q, at)).slice(0, Math.max(0, Math.min(4, room)));
    S.forEach(u => { u.state = 'escort'; u.esc = null; u.focus = null; if (t === 'f') { u.escF = id; u.escId = undefined; } else { u.escId = id; u.escF = undefined; } }); if (S.length) ripple(at.x, at.y, '#ffd35e'); },
  unguard(a) { const [t, i] = a.split(','); guardsOf(t, Number(i)).forEach(u => { u.state = 'home'; u.esc = null; u.escId = u.escF = undefined; }); },
  trade(a) { const [dir, k] = a.split(':'); if (!marketTrade(0, k, dir)) say(dir === 'sell' ? 'Not enough to sell.' : 'Not enough gold.', '', 3); },
  stance() { const cur = G.sel === 'all' ? (G.stance.every(x => x === G.stance[0]) ? G.stance[0] : -1) : G.stance[G.sel], nx = (cur + 1) % STANCE.length; if (G.sel === 'all') G.stance = Array(BNS + 1).fill(nx); else G.stance[G.sel] = nx; },
  hold() { const on = G.sel === 'all' ? !G.hold.every(x => x) : !G.hold[G.sel]; if (G.sel === 'all') G.hold = Array(BNS + 1).fill(Number(on)); else G.hold[G.sel] = Number(on); },
  zeal() { if (!zeal(0, orderSet())) say(zealWhy(0, orderSet()) || 'Not now.', '', 3); },
};
function act(a) {
  const [verb, arg] = a.split(/:(.*)/s);
  if (ACT[verb]) { ACT[verb](arg); return; }
  if (G.over || !PLAY[verb]) return;
  PLAY[verb](arg); learnAct(verb, arg); refresh();
}
// Hints retire once learned: each counts the times you did what it teaches, kept on this phone; at 3 it is not shown again. Warnings (hunger, fire, plague, unrest) always show.
const L = k => ((SET.learned || {})[k] || 0) >= 3;
function learn(k) { SET.learned = SET.learned || {}; if ((SET.learned[k] || 0) >= 3) return; SET.learned[k] = (SET.learned[k] || 0) + 1; saveSet(); }
function learnAct(verb, arg) {
  if (verb === 'train') learn('train:' + arg);
  else if (verb === 'move' || verb === 'job') { learn('job'); learn('job:' + arg); }
  else if (verb === 'sendvil') { learn('job'); const n = G.nodes.find(x => x.id === Number(arg)); if (n) learn('job:' + (n.kind === 'farm' && n.type === 'food' ? 'farm' : n.type)); }
  else if (verb === 'boxjob') { learn('job'); learn('job:' + arg); }
  else if (['sendbld', 'buildat', 'age', 'goto', 'envoy', 'trade'].includes(verb)) learn(verb === 'buildat' ? 'sendbld' : verb);
}
document.addEventListener('click', e => { const el = e.target.closest('[data-act]'); if (!el) return; e.stopPropagation(); sndInit(); sfx('tap'); act(el.dataset.act); });
for (const ev of ['pointerup', 'touchend']) document.addEventListener(ev, sndInit, { passive: true });   // Safari unlocks audio on the finger lifting, not landing

function say(text, cls, secs, at, act) { if (!G) return; if (SET.msgs === false && cls !== 'warn') return; if (hushed(text)) return;   // Messages off: warnings only; a silenced kind stays quiet
  const same = G.log.find(m => m.text === text && m.until > G.t); if (same) { same.until = G.t + (secs || 4); return; }   // the same line never shows twice at once
  G.log.unshift({ text, cls, act, until: G.t + (secs || 4), at: at ? { x: Math.round(at.x), y: Math.round(at.y) } : null }); G.log = G.log.slice(0, 3); }
// The next useful step, read from your situation. One line, shown for six seconds, then at most one more every 45; a warning (starts with !) stays until fixed. Tap × to hide one.
// Silence: 🔕 on any message or tip mutes its kind (numbers ignored) until Unmute all; a warning comes back after 2 minutes, in case the danger is new
const hushKey = t => t.replace(/[\d,.]+/g, '#');
function hushed(t) { const k = hushKey(t), w = G.hushW && G.hushW[k]; return !!(SET.hush && SET.hush[k]) || (w !== undefined && G.t < w); }
function advise() {
  const p = G.P[0], k = keepOf(0); if (!k || G.over) return '';
  const V = unitsOf(0, 'vil'), on = j => V.filter(u => u.job === j).length, S = soldiersOf(0);
  if (V.some(u => u.noPath && G.t - (u.noPathT || -9) < 4) && !L('build:gate')) return 'Some villagers cannot get through your wall: Build → Gate.';
  if ((k.blocked || (popOf(0) >= capOf(0) && capOf(0) < POPMAX && !bldsOf(0, 'house').some(b => b.prog < 1))) && !L('build:house')) return p.age >= 2 ? 'You are full: Build → House, Apartment or Aqueduct.' : `You are full: Build → House (${costText(BLD.house.cost)}).`;
  if (V.length < 6 && !k.q.length && afford(p, UNIT.vil.cost) && !L('train:vil')) return 'Train villagers: more hands bring in more of everything.';
  if (V.length >= 3 && (on('wood') === 0 || (p.res.w < 80 && on('wood') < 2)) && !L('job:wood')) return 'Wood is low. Tap + under Wood.';
  if (G.blds.some(b => b.owner === 0 && b.hp > 0 && b.prog < 1 && !V.some(v => v.rep === b && v.job === 'repair')) && !L('sendbld')) return 'Nobody is building. Tap the site, send a villager.';
  { const idle = V.filter(u => u.idle).length; if (idle && G.t > 20 && !L('job')) return `${idle} villager${idle > 1 ? 's' : ''} idle (z). Tap + under a job.`; }
  if (bldsOf(0, 'farm').some(b => b.prog >= 1 && b.node && !(b.node.wk > 0)) && !L('job:farm')) return 'A field has no workers. Tap + under Farm.';
  if (!bldsOf(0, 'barracks').length && G.t > 75 && !L('build:barracks')) return G.diff === 'easy' ? 'Raiders come after minute 6 on Easy: Build → Barracks before then.' : 'Raiders often come around minute 3 or 4: Build → Barracks.';
  if (ready(0, 'barracks').length && S.length < 3 && G.t < 600 && !L('train:spear')) return 'Train spearmen: tap Army, or tap your Barracks.';
  if (on('wood') >= 3 && !bldsOf(0, 'lumber').length && !L('build:lumber')) return 'Wood is far. Build → Lumber camp, by trees.';
  if (G.nodes.filter(n => n.kind === 'bush' && dist(n, k) < 300).length < 3 && !bldsOf(0, 'farm').length && !L('build:farm')) return 'Berries are running low. Build → Farm, or hunt deer.';
  if (p.age === 0 && !p.aging && V.length >= 10 && !L('age')) return 'Ready to grow: Town Center, then Bronze age.';
  if (S.length >= 8 && G.finds.some(f => !f.done && FINDS[f.kind].got && dist(f, k) < 600) && !L('goto')) return 'Treasure nearby. Tap it, then send your army.';
  if (p.age >= 1 && G.P[FORT].alive && G.rel[0][FORT] === 'peace' && G.P[FORT].ally === null && !p.envoyOut && !L('envoy')) return 'The Fortress is neutral: tap its star, send an emissary.';
  if (p.hungry) return '!Hungry. Put villagers on Food or Farm.';
  if (!p.hungry && p.res.f < (p.eats || 0) * 1.5 && G.t > 120 && !L('job:food')) return `Food runs out in 90 seconds. Add Food workers.`;
  if (vassalsOf(0).some(q => q.unrest > 70 && !q.rebel)) return '!A vassal is restless. Cut tax or add soldiers.';
  if (p.res.g < 50 && (p.res.w > 300 || p.res.s > 300 || p.res.f > 300) && !L('trade')) return ready(0, 'market').length ? 'Gold is low: sell wood, food or stone at the Market.' : 'Gold is low: Build → Market, then sell what you have too much of.';
  if (G.blds.some(b => b.owner === 0 && b.fire > 0 && !G.units.some(u => u.rep === b && u.job === 'repair'))) return '!Fire, and nobody is there. Tap it, send a villager.';
  if (G.units.some(u => u.owner === 0 && u.sick > G.t) && !ready(0, 'hospital').length && p.age >= 2 && !L('build:hospital')) return 'Your people are sick: Build → Hospital cures them.';
  if (on('gold') === 0 && p.age >= 1 && !L('job:gold')) return 'Gold buys riders and research. Put villagers on Gold.';
  return '';
}
const SEASON_ICON = { Spring: '🌱', Summer: '☀️', Autumn: '🍂', Winter: '❄️' }, WX_ICON = { rain: '🌧', drought: '🔥', frost: '🧊' };
function applyMini() { mini.hidden = !SET.mini; $('mapB').hidden = !!SET.mini; $('miniX').hidden = !SET.mini; $('stage').classList.toggle('mapOn', !!SET.mini); }
let uiAt = 0;
function ui(force) {
  const now = performance.now(); if (!force && now - uiAt < 150) return; uiAt = now;
  const p = G.P[0], R = p.res;
  document.body.classList.toggle('night', G.night > 0.5);
  $('rf').textContent = fmt(R.f); $('rw').textContent = fmt(R.w); $('rs').textContent = fmt(R.s); $('rg').textContent = fmt(R.g); $('ri').textContent = fmt(R.i);
  const rank = 1 + G.P.filter(q => q.id && q.id !== WILD && q.score.total > p.score.total).length;
  $('scoreN').textContent = `★${fmt(p.score.total)}`; $('scoreR').textContent = ['1st', '2nd', '3rd', '4th', '5th'][rank - 1] || rank + 'th';
  if (G.t - (G.rdyT ?? -9) > 1 || G.t < G.rdyT) { G.rdyT = G.t; G.rdy = new Map(); for (const t of TECH) if (techState(t) === 'ready') G.rdy.set(t.at, (G.rdy.get(t.at) || 0) + 1); { const A = AGES[p.age + 1]; if (A && !p.aging && keepOf(0) && afford(p, A.cost)) G.rdy.set('keep', (G.rdy.get('keep') || 0) + 1); } }   // building kind → how many researches you can start there now
  let tip = SET.tips ? advise() : ''; const urgent = tip[0] === '!'; if (urgent) tip = tip.slice(1);
  const T = G.tipS || (G.tipS = { text: '', at: -99, last: -99 });
  if (tip !== T.text && (urgent || G.t > 20 && G.t - T.last > 45)) { T.text = tip; T.at = G.t; if (tip) T.last = G.t; }
  const showTip = tip && T.text === tip && (urgent || G.t - T.at < 6) && !hushed(tip) && !G.card && !G.place && !G.over;
  if ($('tipT').textContent !== tip) $('tipT').textContent = tip; $('tip').hidden = !showTip;
  { const lim = MODES[G.mode].secs, clk = G.wonder ? `wonder ${clock(Math.max(0, G.wonder.end - G.t))}` : lim ? `${clock(Math.max(0, lim - G.t))}` : clock(G.t);
    let train = 0, going = 0; for (const b of G.blds) if (b.owner === 0) for (const j of b.q) { if (j.kind) train++; else if (j.muster) train += musterN(j.muster); else going++; }
    let ready = 0; for (const v of G.rdy.values()) ready += v;   // research you can start now (the age counts: it is research too)
    const S = armyOf(0), out = S.filter(u => u.state === 'attack' || u.state === 'goto').length, idleN = unitsOf(0, 'vil').filter(u => !u.job).length, part = (n, t) => n ? `${t} ${n}` : '';
    const l1 = `${CIVS[p.civ].name} · ${AGES[p.age].name} age · ${SEASON_ICON[season().name]}${WX_ICON[G.wx] || ''}${G.night > 0.5 ? '🌙' : ''} ${clk} · ${Math.round(cam.z * 100)}%`;
    const l2 = [part(train, 'Training'), part(going, 'Researching'), part(ready, 'Ready'), part(idleN, 'Idle')].filter(Boolean).join(' · '), l3 = [part(S.length, 'Army'), part(out, 'Marching')].filter(Boolean).join(' · ');
    for (const [id, t] of [['sL1', l1], ['sL2', l2], ['sL3', l3]]) if ($(id).textContent !== t) $(id).textContent = t;
    $('clock').classList.toggle('glow', ready > 0 && !G.card); }
  const V = unitsOf(0, 'vil');
  for (const r of JOBS) { $('j' + r).textContent = V.filter(u => u.job === r).length; document.querySelector(`[data-act="job:${r}"]`).classList.toggle('on', p.rally === r); }
  const nq = queuedOf(0, 'vil'), room = Math.max(0, capOf(0) - popOf(0)), S = armyOf(0), idle = V.filter(u => !u.job).length; $('bVil').classList.toggle('dis', !!trainWhy(0, 'vil'));
  // have / can have now: the ceiling is what your homes allow, up to the most of each kind; idle hands are what + can place
  $('bVil').querySelector('small').textContent = `${V.length}/${Math.min(VILMAX, V.length + room)}` + (nq ? ` +${nq}` : '') + ` · Idle ${idle}`;
  $('bBuild').classList.toggle('on', !!(G.card && G.card.type === 'menu'));
  { const k = keepOf(0), away = !k || SX(k.x) < -20 || SX(k.x) > cw + 20 || SY(k.y) < -20 || SY(k.y) > ch + 20; $('homeB').hidden = !away; }   // home shows only when your Town Center is off the screen
  $('stage').classList.toggle('busy', !!(G.card || G.place));
  if (G.place) { const B = BLD[G.place.kind], t = !G.place.at ? (G.place.kind === 'wall' ? 'Press and drag a line of wall' : `Press where the ${B.name.toLowerCase()} goes · drag empty ground to look around`) : G.place.why ? G.place.why : G.place.kind === 'wall' ? `${(G.place.cells || [1]).length} pieces: tap Build, or drag again` : `${B.name}: tap Build, or drag it to move · drag empty ground to look`; if ($('placeT').textContent !== t) $('placeT').textContent = t; $('placeOk').classList.toggle('dis', !G.place.at || !!G.place.why); }
  const msgs = G.log.filter(m => m.until > G.t);
  let html = msgs.map(m => `<div class="msg ${m.cls || ''}"><span${m.act ? ` data-act="${m.act}"` : m.at ? ` data-act="jump:${m.at.x},${m.at.y}"` : ''}>${m.text}</span><button data-act="hush:${encodeURIComponent(m.text)}" aria-label="Silence this kind of message">🔕</button></div>`).join('');
  if (G.paused && !(G.card && (G.card.type === 'resume' || G.card.type === 'setup'))) html = '<div class="msg"><span>Paused · ▶ to carry on</span></div>' + html;
  if (html !== bannerSig) { bannerSig = html; patchHTML($('banner'), html); }
  if (G.card) renderCard();
}


// ── trade, goods and health on the cards
const goodsText = g => GOODK.filter(k => g[k] >= 1).map(k => `${Math.floor(g[k])} ${GOODS[k].name.toLowerCase()}`).join(', ');
function econCard(b) {
  const p = G.P[0], n = b.node; let h = '';
  if (b.kind === 'pasture') h += `<p>${b.sheep || 0} sheep · ${Math.floor(n ? n.amt : 0)} wool to bring in. Shorn each spring, when lambs come too. Tended by ${n && n.wk > 0 ? 'a shepherd' : 'nobody yet: tap Send a villager'}.</p>`;
  if (BLD[b.kind].from) { const [k, r] = Object.entries(BLD[b.kind].from)[0], kn = GOODS[k] ? GOODS[k].name.toLowerCase() : LONG[k]; h += `<p>In store: ${Math.floor(k in p.res ? p.res[k] : p.goods[k] || 0)} ${kn} (${r} make 1 ${GOODS[BLD[b.kind].crop].name.toLowerCase()}). Worked by ${n && n.wk > 0 ? (G.units.some(u => u.node === n && u.wait) ? 'a villager, waiting for ' + kn : 'a villager') : 'nobody yet: tap Send a villager'}.</p>`; }
  if (b.kind === 'bizc') {
    const cs = unitsOf(0, 'caravan'), on = cs.filter(c => c.route).length;
    h += `<p><i>In store:</i> ${goodsText(p.goods) || 'nothing yet'}.</p><p>${cs.length} caravans, ${on} on routes. Tap a caravan to give it a route.</p>`;
  }
  if (b.kind === 'market') {
    const P = p, more = G.mtab === 'more';
    if (!more) h += fold('prices', 'Going prices', `<p>${MKTK.map(k => `${GOODS[k] ? GOODS[k].name : RESOURCES[LONG[k]].name} ×${mkt(k).toFixed(2)}`).join(' · ')} (1 = normal)</p>`);
    const V = P.ventures || [];
    if (more) h += `<div class="sec">Ventures</div><p>${P.age < VENTURE.age ? 'From the Medieval age: put gold into a merchant venture.' : `Back in a year with ${Math.round((VENTURE.back - 1) * 100)}% more; about 1 in ${Math.round(1 / VENTURE.lost)} is lost.`} ${V.length ? 'Out: ' + V.map(v => `${v.amt}g (${clock(Math.max(0, v.due - G.t))})`).join(', ') + '.' : ''}</p>`;
    if (more && P.age >= VENTURE.age) h += `<div class="acts c3">${VENTURE.sizes.map(a => btn(`venture:${a}`, `${a} gold`, '', P.res.g < a || V.length >= VENTURE.max ? 'dis' : '')).join('')}</div>`;
  }
  if (b.kind === 'tpost') { const f = G.finds.find(x => x.id === b.sid); if (f) h += `<p>Holds the stop at ${coord(f.x, f.y)}: tap the stop for prices and what it wants.</p>`; }
  return h;
}
function stopHTML(f) {
  const p = G.P[0], from = homeBiz(0, f) || keepOf(0), pt = postAt(f), mine = f.owner === 0;
  let h = `<p>Route ${f.route === 0 ? 'west–east' : 'north–south'}. ${f.owner === null ? (pt ? 'A post is going up.' : 'Nobody holds it.') : mine ? `Yours: ${Math.round(POST.cut[stopsHeld(0, f.route)] * 100)}% of everyone else's sales here (you hold ${stopsHeld(0, f.route)} of this route's 4${stopsHeld(0, f.route) === 4 ? `, so it pays ${Math.round(POST.all * 60)} gold a minute` : ''}).` : `Held by ${G.P[f.owner].name}: they take ${Math.round(POST.cut[stopsHeld(f.owner, f.route)] * 100)}% of your sales here.`} Wants <b>${GOODS[f.want].name.toLowerCase()}</b> (×1.5).</p>`;
  h += `<p><i>Paid here, per good from your ${homeBiz(0, f) ? 'Business Center' : 'Town Center'}:</i> ${WARES.filter(k => k !== 'spice').map(k => `${GOODS[k].name} ${Math.round(priceAt(0, k, f, from))}g`).join(' · ')}. Spice costs ${GOODS.spice.buy}g here.</p>`;
  if (!pt && !guardsLeft(f)) h += `<div class="acts c1">${btn(`tpost:${f.id}`, 'Build a Trade post', p.age < 1 ? 'Bronze age' : costText(BLD.tpost.cost), p.age < 1 || !afford(p, BLD.tpost.cost) ? 'dis' : 'go')}</div>`;
  if (mine) h += guardRow('f', f.id);
  if (mine) h += `<div class="acts c1">${btn(`want:${f.id}`, `Wanted: ${GOODS[f.want].name.toLowerCase()}`, 'yours: tap to change what it buys dear')}</div>`;
  return h;
}
function caravanHTML(u) {
  const r = u.route, t = targetOf(r), h0 = homeBiz(0, u), d = !r && u.dest ? G.blds.find(b => b.id === u.dest) : null;
  let h = `<p>${r && t ? `Lane one: to the trade stop at ${coord(t.x, t.y)}${r.rep ? ', again and again' : ''}. ${u.leg === 'go' ? 'Carrying ' + (goodsText(u.goods || {}) || 'nothing') : u.leg === 'back' ? 'Coming home' + (u.goods && u.goods.spice ? ' with ' + u.goods.spice + ' spice' : '') : 'Loading'}.` : d && d.owner !== 0 ? `Lane two: to ${G.P[d.owner].name}' ${bldName(d.owner, d.kind).toLowerCase()}, ${u.cargo} gold on arrival.` : allyMarket(0, u) ? 'Lane two: on its way to trade with your ally.' : 'No route, and no ally to trade with: it waits at your Market.'}</p>`;
  h += guardRow('c', u.id);
  if (!h0) return h + '<p>Build a Business Center (Trade) to send goods to the trade stops.</p>';
  const T = tradeTargets(0).map(t => [t, estPay(0, t, h0)]).sort((a, b) => b[1] - a[1]).slice(0, 4);
  h += `<div class="sec">Send it to</div><div class="acts c1">${T.map(([t, v]) => btn(`route:${u.id},s,${t.id}`, `Trade stop ${coord(t.x, t.y)}`, `about ${v}g a load · ${Math.round(dist(h0, t))} away`, r && t === targetOf(r) ? 'on' : '')).join('') || '<p>No stop open: clear one of its guards first.</p>'}</div>`;
  if (r) h += `<div class="acts">${btn(`rrep:${u.id}`, 'Repeat', r.rep ? 'on' : 'off', r.rep ? 'on' : '')}${btn(`rsp:${u.id}`, 'Buy spice', r.spice ? 'on' : 'off', r.spice ? 'on' : '')}${btn(`rclr:${u.id}`, 'No route', 'trade with an ally')}</div>`;
  return h;
}

function vassalHTML(P) {
  const L = loyaltyParts(P);
  let h = `<p><b>Your vassal.</b> ${P.rebel ? `<b>In revolt</b> since ${clock(G.t - P.rebel.t0)}: kill three quarters of their force to crush it, or they are free in ${clock(Math.max(0, VASSAL.freeAfter - (G.t - P.rebel.t0)))}.` : `Unrest ${Math.round(P.unrest)}% · loyalty ${Math.round(P.loyal)}% · paid ${Math.round(P.paid || 0)} in the last 10 s.`}</p>`;
  if (P.rebel) return h;
  h += `<div class="sec">Tax</div><div class="acts c3">${Object.keys(TAX).map(t => btn(`tax:${P.id},${t}`, t[0].toUpperCase() + t.slice(1), `${Math.round(TAX[t].take * 100)}% of what they gather`, P.tax === t ? 'on' : '')).join('')}</div>`;
  h += `<p><i>Loyalty heads for</i> 20 + ${L.invest} (your buildings near them) + ${L.garrison} (your soldiers there) + ${L.protect} (enemies you killed near them) − ${L.hate} (the tax) = <b>${Math.round(L.target)}</b>. Unrest moves by ${TAX[P.tax].push} − loyalty/25 every 10 s.${P.loyal >= VASSAL.shareAt ? ` You get ${VASSAL.share * 100}% of their trade profit.` : ` At ${VASSAL.shareAt} loyalty you get ${VASSAL.share * 100}% of their trade profit;`} ${P.loyal >= VASSAL.giftAt ? 'They send gifts.' : `at ${VASSAL.giftAt} they send gifts.`}</p>`;
  return h;
}
