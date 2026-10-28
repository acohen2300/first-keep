// ═════ 14-guide.js ═════
function guideModel() {
  const unitsAt = k => Object.values(UNIT).filter(U => U.at === k && !U.civ).map(U => U.name), techsAt = k => TECH.filter(t => t.at === k).map(t => t.name);
  const menuOf = {}; MENUS.forEach(m => m.items.forEach(i => { menuOf[i] = m.name; }));
  const buildings = Object.entries(BLD).map(([id, B]) => ({ id, name: B.name + (B.name3 ? ` (${B.name3} in the Medieval age)` : ''), menu: id === 'keep' ? 'you start with it' : menuOf[id], age: AGES[B.age || 0].name, cost: costText(B.cost) || 'free', secs: B.t ? B.t + ' s' : '', squares: B.fp + '×' + B.fp, trains: unitsAt(id), research: techsAt(id), what: B.desc, why: WHY[id] }));
  const tierNames = id => TECH.filter(t => t.tier && t.tier.unit === id).map(t => `${t.tier.name} (${t.name})`);
  const units = Object.entries(UNIT).filter(([, U]) => U.cost).map(([id, U]) => ({ id, name: U.name, at: U.at ? BLD[U.at].name : 'the Town Center', age: AGES[U.age || 0].name, cost: costText(U.cost), secs: U.t + ' s', hp: U.hp, dmg: U.dmg || 0, rng: U.rng || 0, spd: U.spd, civ: U.civ ? CIVS[U.civ].name : '', replaces: U.replaces ? UNIT[U.replaces].name : '',
    beats: Object.entries(U.vs || {}).map(([k, m]) => (UNIT[k] ? UNIT[k].name : k) + ' ×' + m).concat(U.bld && U.bld !== 1 ? ['buildings ×' + U.bld] : []).concat(U.bonly ? ['buildings only'] : []),
    tiers: tierNames(id), what: U.desc, why: WHY[id] }));
  const techs = TECH.map(t => ({ id: t.id, name: t.name, at: BLD[t.at].name, age: AGES[t.age].name, line: t.line, when: t.when || '', w: t.w || 0, need: needsOf(t).map(n => TECHBY[n].name).join(', '), cost: costText(t.cost), secs: t.t + ' s', what: t.desc, why: WHY[t.id] }));
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
  if (pg === 'tech') return g2.techs.map(t => E(t.name, `${t.at} · ${t.line} · ${t.age} age${t.when ? ' · ' + t.when : ''}${t.w ? ' · weight ' + t.w : ''} · ${t.cost} · ${t.secs}${t.need ? ' · needs ' + t.need : ''}`, [t.what, t.why && `<i>Why:</i> ${t.why}`])).join('');
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
