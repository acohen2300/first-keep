const fs = require('fs'), S = process.argv[2], I = JSON.parse(fs.readFileSync(S + '/icons.json', 'utf8'));
const ic = (k) => (typeof I[k] === 'string' ? I[k] : '');
const T = (c, r, icon, word, cls = '', badge = '') => `<div class="t ${cls}" style="grid-column:${c};grid-row:${r}">${icon ? ic(icon) : ''}${word ? `<i>${word}</i>` : ''}${badge ? `<u>${badge}</u>` : ''}</div>`;
const W = (c, r, a, b, cls = '') => `<div class="t w ${cls}" style="grid-column:${c};grid-row:${r}"><b>${a}</b>${b ? `<i>${b}</i>` : ''}</div>`;
const PM = (c) => `<div class="pm" style="grid-column:${c};grid-row:2"><div class="t">${ic('minus')}</div><div class="t">${ic('plus')}</div></div>`;
const MAP = `<div class="map" style="grid-column:3/6;grid-row:1/3"><span></span><em></em></div>`;
const cell = (icon, word, cls = '') => `<div class="k ${cls}">${icon ? ic(icon) : ''}${word ? `<i>${word}</i>` : ''}</div>`;
const cw = (a, b, cls = '') => `<div class="k w ${cls}"><b>${a}</b>${b ? `<i>${b}</i>` : ''}</div>`;
const tight = (cells, x, y, n = 2, w = 58) => `<div class="tight" style="left:${x}px;top:${y}px;grid-template-columns:repeat(${n},${w}px)">${cells.join('')}</div>`;
// the controller: rank 1 Jobs … War; the chips: − on War, the map chip outside the map's top right
const chips = (mapOn) => `<div class="chip hide">−</div><div class="chip mapc ${mapOn ? 'on' : ''}">${ic('map')}</div>`;
const R1 = (mid, lit) => T(1, 1, 'basket', 'Jobs', lit === 'jobs' ? 'lit' : '') + mid + T(7, 1, 'swordup', 'War', lit === 'war' ? 'lit' : '', '');
const R2 = (mid, lit) => T(1, 2, 'people', 'People') + mid + T(7, 2, 'town', 'Town', lit === 'town' ? 'lit' : '', '1');
const ctl = (mid1, mid2, lit, mapOn) => `<div class="row">${R1(mid1, lit)}${R2(mid2, lit)}${mapOn ? MAP : ''}</div>${chips(mapOn)}`;
const jobs1 = T(2, 1, 'food', '4 Food', 'on') + T(3, 1, 'wood', '0 Wood') + T(4, 1, 'stone', '0 Stone') + T(5, 1, 'gold', '0 Gold') + T(6, 1, 'iron', '0 Iron');
const jobs2 = [2, 3, 4, 5, 6].map(PM).join('');
const JOBS = (mapOn) => ctl(jobs1, jobs2, 'jobs', mapOn);
const finger = (x, y) => `<div class="finger" style="left:${x - 10}px;top:${y - 10}px"></div>`;
const cross = (x, y) => `<div class="cross" style="left:${x - 16}px;top:${y - 16}px">${ic('aim')}</div>`;
const F = [];
const ph = (title, notes, body, bg = 'bg.png') => F.push(`<figure><div class="ph" style="background-image:url(${bg})">${body}</div><figcaption><b>${F.length + 1}. ${title}</b>${notes}</figcaption></figure>`);
ph('Jobs: the default', '<p>Opens here. Every job with − and + under it. People bottom left, Town bottom right. Two chips: − on War (hide), the map chip outside the map\'s top right.</p>', JOBS(false));
ph('The map chip: the centre 3×2', '<p>The map always takes columns 3 to 5, both ranks, on every page; what is under it waits. The chip again: it goes.</p>', JOBS(true));
ph('Town', '<p>Build and Research left of the map, Relations and Status right (Status: age, score, stores, mail, sound: Mute is there). Build opens the Build card.</p>',
  ctl(T(2, 1, 'hammer', 'Build') + T(6, 1, 'ally', 'Relations'), T(2, 2, 'book', 'Research', '', '1') + T(6, 2, 'gear', 'Status'), 'town', true));
ph('War', '<p>War as now: Aim, the three squads, Kinds; Alarm, Rally, Shape, Train, Set up. The map chip covers the centre the same way.</p>',
  ctl(T(2, 1, 'aim', 'Aim') + T(3, 1, 'squad', 'Alpha') + T(4, 1, 'squad', 'Bravo') + T(5, 1, 'squad', 'Charlie') + T(6, 1, 'kinds', 'Kinds'), T(2, 2, 'bell', 'Alarm') + T(3, 2, 'flag', 'Rally') + T(4, 2, 'list', 'Line') + T(5, 2, 'train', 'Train') + T(6, 2, 'gear', 'Set up'), 'war', false));
ph('A page with Back', '<p>War · Train, two pages: ← in the top rank of column 6, the page number under it. The same place on every page that has one.</p>',
  ctl(W(2, 1, 'Spear', '2 · 50f') + W(3, 1, 'Archer', '0 · 40w') + W(4, 1, 'Sword', '1 · 60f') + W(5, 1, 'Rider', '0 · 80f') + T(6, 1, 'back', 'Back'), PM(2) + PM(3) + PM(4) + PM(5) + W(6, 2, '1 of 2', ''), 'war', false));
ph('Hidden: one + chip', '<p>Tap − on War: the controller folds to one + chip, bottom right. Tap +: it comes back as it was.</p>', `<div class="chip show">+</div>`);
ph('Tap open ground', '<p>Four, tight at the finger: Sword, Close, Build (the Build card, placing there), More. One outline; the lines inside stop short of the edge.</p>', finger(186, 300) + tight([cell('sword', 'Sword', 'go'), cell('close', 'Close'), cell('hammer', 'Build'), cell('next', 'More')], 198, 270) + JOBS(false));
ph('Sword: how many', '<p>All, half, a quarter, or More (Foot, Archers, Riders, Siege). The crosshair goes up; tap it again and they go.</p>', cross(186, 300) + tight([cw('All', '24'), cw('Half', '12'), cw('Quarter', '6'), cell('next', 'More')], 198, 270) + JOBS(false));
ph('More: the hidden holds', '<p>Rally here, Ambush here (the cover nearest), Choke (drag the gap), Kinds. Nothing is a hold any more.</p>', finger(186, 300) + tight([cell('flag', 'Rally'), cw('Ambush', 'here'), cw('Choke', 'drag'), cell('kinds', 'Kinds')], 198, 270) + JOBS(false));
ph('Tap an enemy', '<p>Always four: Attack (then All, half, a quarter), War setup (War, the foe on the crosshair), Info (its card), Close.</p>', `<div class="foe" style="left:180px;top:292px"></div>` + tight([cw('Attack', '', 'red'), cw('War', 'setup'), cell('book', 'Info'), cell('close', 'Close')], 198, 270) + JOBS(false));
ph('A villager', '<p>Go (tap where), Build (the Build card; this villager builds it), Status (what it does), State (health, carry, tired).</p>', `<div class="sel" style="left:178px;top:292px"></div>` + tight([cell('gather', 'Go', 'go'), cell('hammer', 'Build'), cw('Status', 'wood 3/10'), cw('State', '25 · 8w')], 198, 270) + JOBS(false));
ph('An item: 3×3 over the controller', '<p>Bottom anchored, over the controller. Berry bush shown; a tree, a mine, game, a find and a hazard use the same nine, what does not apply dim.</p>',
  `<div class="card"><div class="ct">Berry bush <span>${ic('close')}</span></div>${tight([cw('Send', 'someone', 'go'), cw('Left', '320 food'), cell('book', 'Info'), cw('Where', 'by home'), cw('Drop-off', 'Mill · 60'), cw('Bonus', '×1.10'), cw('Danger', 'none'), cw('Hands', '2 of 4'), cw('Season', 'ripe')], 0, 0, 3, 115).replace('position:absolute', '').replace('class="tight"', 'class="tight in"')}</div>` + JOBS(false));
ph('A building card over the controller', '<p>Every card anchors to the bottom and covers the controller; closing it brings the controller back.</p>',
  `<div class="card"><div class="ct">Barracks <span>${ic('close')}</span></div><div class="ln2"><div class="b w"><b>Spear</b><i>50f 20w</i></div><div class="b w"><b>Sword</b><i>60f 40i</i></div><div class="b w dim"><b>Pike</b><i>Classical</i></div></div><div class="ln2"><div class="b w"><b>Drill</b><i>110f 70g</i></div><div class="b w"><b>Spear wall</b><i>90f 40w</i></div><div class="b w"><b>Rally</b><i>here</i></div></div><p class="ln">Health 400 · 2 in training · next 0:12</p></div>` + JOBS(false));
ph('Welcome back', '<p>Bottom anchored over the controller.</p>', `<div class="card"><div class="ct">Welcome back <span>${ic('close')}</span></div><p class="ln">Minute 14 · Classical · 2nd · ★ 182</p><div class="ln2"><div class="b w gold"><b>Resume</b></div><div class="b w"><b>New game</b></div><div class="b w"><b>Help</b></div></div></div>` + JOBS(false));
ph('The Start menu', '<p>As it was: every question on its own line (no pairs), bottom anchored over the controller.</p>', `<div class="card tall"><div class="ct">New game <span>${ic('close')}</span></div>${['Seat · Rome', 'Map · Rivers', 'World · real', 'Fog · on', 'Tension · normal', 'Daily · off', 'Game · 30 minutes', 'Hazards · at random'].map((t) => `<p class="ln">${t}</p>`).join('')}<div class="ln2"><div class="b w gold"><b>Start</b></div></div></div>`);
ph('The ground under the controller', '<p>Scrolled to the bottom: the map runs to the screen edge, the controller on real ground. The strip under it takes no building: a ghost there is red, "Under the controls".</p>', `<div class="pad"></div><div class="ghost"><i>Under the controls</i></div>` + JOBS(false), 'bgb.png');
const css = `
@font-face{font-family:B;src:url(barlow.woff)}@font-face{font-family:Fell;src:url(fell-sc.woff)}
body{margin:0;background:#1b140e;color:#ece5d3;font-family:B,sans-serif;font-size:13px;padding:24px}
h1{font-family:Fell;color:#e6b947;font-size:30px;margin:0 0 4px}h2{font-weight:400;color:#cbbfa6;margin:0 0 20px;font-size:15px;max-width:1500px}
.grid{display:grid;grid-template-columns:repeat(4,375px);gap:28px}
figure{margin:0}figcaption{margin-top:8px;line-height:1.35}figcaption b{color:#e6b947;font-size:15px;display:block;margin-bottom:2px}figcaption p{margin:3px 0}
.ph{position:relative;width:375px;height:667px;background:center/cover;border-radius:18px;overflow:hidden;box-shadow:0 0 0 1px #3a2a1c}
.row{position:absolute;left:6px;right:6px;bottom:6px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));grid-auto-rows:44px;gap:3px}
.t{position:relative;background:#33241a;border:1px solid #6b5230;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;box-shadow:0 2px 6px rgba(0,0,0,.45);min-width:0}
svg{width:18px;height:18px;color:#ece5d3;display:block}i{font-style:normal;font-size:12px;white-space:nowrap}b{font-weight:600;font-size:12px;white-space:nowrap}.w i{font-size:11px;color:#d7cdb6}
.t.lit{border-color:#e6b947;background:color-mix(in srgb,#ece5d3 12%,#33241a)}.t.lit i{color:#e6b947}.t.on{border-color:#5fd08a}
.pm{display:flex;flex-direction:row;gap:3px;min-width:0;background:none;border:none;box-shadow:none;padding:0}.pm>.t{flex:1 1 0}
.t u{position:absolute;top:-6px;right:-6px;background:#ff6b5b;color:#fff;border-radius:9px;min-width:16px;height:16px;font-size:11px;text-decoration:none;display:flex;align-items:center;justify-content:center}
.map{background:#2c3a22;border:1.5px solid #ece5d3;border-radius:6px;position:relative;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.45)}.map span{position:absolute;inset:0;background:radial-gradient(circle at 25% 65%,#4d6b34 0 16%,transparent 17%),radial-gradient(ellipse at 60% 35%,#3c5a7e 0 9%,transparent 10%),radial-gradient(circle at 80% 70%,#c9a14a 0 3%,transparent 4%),#33452a}.map em{position:absolute;left:18%;top:30%;width:18%;height:44%;border:1.5px solid #ece5d3}
.chip{position:absolute;width:26px;height:26px;border-radius:6px;background:#33241a;border:1px solid #6b5230;color:#ece5d3;font-size:20px;line-height:24px;text-align:center;font-weight:600;box-shadow:0 2px 6px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center}
.chip svg{width:15px;height:15px}.chip.on{border-color:#e6b947}.chip.on svg{color:#e6b947}
.chip.hide{right:16px;bottom:107px}.chip.mapc{left:258px;bottom:107px}.chip.show{right:6px;bottom:6px;width:44px;height:44px;font-size:26px}
.tight{position:absolute;display:grid;grid-auto-rows:46px;background:#33241a;border:1px solid #e6b947;border-radius:6px;box-shadow:0 3px 10px rgba(0,0,0,.55);overflow:hidden}
.tight.in{position:relative;border-color:#6b5230;box-shadow:none}
.k{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
.k::after{content:'';position:absolute;right:0;top:9px;bottom:9px;width:1px;background:#6b5230}.k::before{content:'';position:absolute;left:9px;right:9px;bottom:0;height:1px;background:#6b5230}
.tight .k:nth-child(2n)::after{display:none}.tight .k:nth-last-child(-n+2)::before{display:none}
.tight.in .k::after,.tight.in .k::before{display:block}.tight.in .k:nth-child(3n)::after{display:none}.tight.in .k:nth-child(2n)::after{display:block}.tight.in .k:nth-child(3n)::after{display:none}.tight.in .k:nth-last-child(-n+3)::before{display:none}
.k.go i,.k.go b{color:#5fd08a}.k.red b{color:#ff6b5b}
.cross{position:absolute;width:32px;height:32px}.cross svg{width:32px;height:32px;color:#ffd35e}
.finger{position:absolute;width:20px;height:20px;border-radius:50%;border:2px solid #ffd35e;background:rgba(255,211,94,.2)}
.foe{position:absolute;width:14px;height:14px;border-radius:50%;background:#ff6b5b;box-shadow:0 0 0 3px rgba(255,107,91,.35)}
.sel{position:absolute;width:16px;height:16px;border-radius:50%;border:2px solid #5fd08a}
.card{position:absolute;left:6px;right:6px;bottom:6px;z-index:5;background:#2a1d13;border:1px solid #e6b947;border-radius:8px;padding:6px;box-shadow:0 -4px 18px rgba(0,0,0,.55);display:flex;flex-direction:column;gap:3px}
.ct{font-family:Fell;color:#e6b947;font-size:18px;padding:6px 6px 6px 8px;display:flex;justify-content:space-between;align-items:center}.ct span svg{width:16px;height:16px}
.ln{margin:0;background:#33241a;border:1px solid #6b5230;border-radius:6px;height:42px;display:flex;align-items:center;padding-left:10px}
.ln2{display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:3px}.b{background:#33241a;border:1px solid #6b5230;border-radius:6px;height:44px;display:flex;flex-direction:column;align-items:center;justify-content:center}.b.gold{background:linear-gradient(#f2d27a,#b8862e);color:#2a1c10;border-color:#b8862e}.b.gold b{color:#2a1c10}.b.dim{opacity:.45}
.pad{position:absolute;left:0;right:0;bottom:0;height:112px;background:repeating-linear-gradient(135deg,rgba(255,107,91,.18) 0 8px,transparent 8px 16px)}
.ghost{position:absolute;left:150px;bottom:72px;width:60px;height:46px;border:2px solid #ff6b5b;background:rgba(255,107,91,.35);border-radius:4px;z-index:2}.ghost i{position:absolute;bottom:52px;left:-30px;background:#2a1d13;border:1px solid #ff6b5b;color:#ff6b5b;padding:3px 6px;border-radius:4px}
`;
fs.writeFileSync(S + '/plan-mock.html', `<!doctype html><meta charset="utf-8"><style>${css}</style><h1>The plan, drawn once · Nov 3</h1><h2>Your three pages and today's answers. Jobs default with − + under every job; the map always the centre 3×2, by its chip; hide on War; four tight tiles for every quick menu; the item 3×3; every card bottom anchored over the controller; the Start menu one question a line. Say what is wrong, or yes yes.</h2><div class="grid">${F.join('')}</div>`);
