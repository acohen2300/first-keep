// ═════ 03-core.js ═════
// ───────────────────────── Small helpers ─────────────────────────
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const hyp = (x, y) => Math.sqrt(x * x + y * y);
const dist = (a, b) => { const dx = a.x - b.x, dy = a.y - b.y; return Math.sqrt(dx * dx + dy * dy); };
const clock = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const costText = c => Object.entries(c || {}).filter(([, v]) => v).map(([k, v]) => Math.round(v) + k).join(' ');
const afford = (p, c) => Object.entries(c || {}).every(([k, v]) => p.res[k] >= v);
const pay = (p, c) => { for (const [k, v] of Object.entries(c || {})) p.res[k] -= v; };
const addRes = (a, c, f = 1) => { for (const [k, v] of Object.entries(c || {})) a[k] = (a[k] || 0) + v * f; return a; };
const sumCost = c => Object.values(c || {}).reduce((s, v) => s + v, 0);
const fmt = n => n >= 10000 ? Math.round(n / 1000) + 'k' : n >= 1000 ? (Math.floor(n / 100) / 10) + 'k' : String(Math.floor(n));
const towardMid = (e, d) => { const tx = MID - e.x, ty = MID - e.y, l = hyp(tx, ty) || 1; return { x: e.x + tx / l * d, y: e.y + ty / l * d }; };
function nearest(list, from, ok, maxD = 1e9) { let best = null, bd = maxD; for (const e of list) { if (ok && !ok(e)) continue; const d = dist(from, e); if (d < bd) { bd = d; best = e; } } return best; }
// The simulation's dice are seeded, so a game can be replayed and tested; looks use Math.random.
function rng() { let t = (G.rs = (G.rs + 0x6D2B79F5) | 0); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const rnd = (a, b) => a + rng() * (b - a);
let NID = 1;
// one wolf, two wolves; one spearman, two spearmen; one man-at-arms, two men-at-arms
const plural = n => /^man-at-arms$/i.test(n) ? n.replace(/^(m)an/i, '$1en') : /man$/.test(n) ? n.slice(0, -3) + 'men' : /wolf$/i.test(n) ? n.slice(0, -1) + 'ves' : /[^aeiou]y$/.test(n) ? n.slice(0, -1) + 'ies' : /(s|x|ch|sh)$/.test(n) ? n + 'es' : n + 's';
const some = (k, n) => k === 1 ? n : plural(n);

// Settings remembered on this phone.
const SET = { diff: 'easy', tips: true, msgs: true, civ: 'roman', fantasy: false, mode: 't30', sound: true, vol: 0.6, mix: {}, hush: {}, mini: undefined, mapSeen: false, vibe: true, learned: {} };
try { Object.assign(SET, JSON.parse(localStorage.getItem('firstkeep.settings') || '{}')); } catch (e) {}
if (!CIVS[SET.civ]) SET.civ = 'roman';
SET.mix = Object.assign({ fx: 1, amb: 1, alert: 1 }, SET.mix);   // three volumes: effects, ambience, alerts
function saveSet() { try { localStorage.setItem('firstkeep.settings', JSON.stringify(SET)); } catch (e) {} }
const MODES = { conquest: { name: 'Conquest', secs: 0 }, t30: { name: '30 minutes', secs: 1800 }, t60: { name: '60 minutes', secs: 3600 } };

// ───────────────────────── The world ─────────────────────────
let G;
function blankGame(seed) {
  return { t: 0, tick: 0, speed: G ? G.speed : 1, over: null, seed, rs: seed, units: [], blds: [], nodes: [], finds: [], tracers: [], log: [],
    P: [], rel: [], card: null, place: null, sel: 'all', alertT: -99, warnT: -99, confirm: null, night: 0, loot: {}, lootT: 0,
    hold: Array(BNS + 1).fill(0), stance: Array(BNS + 1).fill(0), bnPlan: BN.map(() => ({})), form: BN.map(() => 0), bnEdit: 0, qs: { from: 'all', n: {} }, intel: {}, fantasy: SET.fantasy, mode: SET.mode, diff: SET.diff, wayT: WAYFARER_EVERY * 0.5, wayI: 0, wonder: null, navDirty: true, fxv: 1 };
}
function mkPlayer(i, civ) {
  const d = PLAYERS[i];
  return { id: i, name: d.name, pers: d.pers, color: d.color, keep: d.keep.slice(), civ, res: { f: 200, w: 200, s: 100, g: 50, i: 0 }, goods: Object.fromEntries(GOODK.map(k => [k, 0])), ventures: [], hungry: false, lord: null, tax: 'fair', unrest: 0, loyal: 0, health: 100, ration: 1, rations: {}, age: 0, aging: false, techs: new Set(),
    rally: 'food', ally: null, alive: i !== WILD, terms: null, envoyOut: false, envoyAt: -999, zealT: 0, wave: null, killer: undefined,
    ai: { t: 1 + i * 0.3, lastHelp: 0, tribute: 0, cyc: 0 }, gathered: 0, spent: 0, score: { people: 0, army: 0, tech: 0, bld: 0, wealth: 0, total: 0 }, fxc: null, uc: {} };
}
function newGame(seed, carry) {
  seed = seed === undefined ? (Math.random() * 2 ** 31) | 0 : seed;
  NID = 1; G = blankGame(seed); resetScars();
  const others = CIVK.filter(k => k !== SET.civ);
  for (let i = others.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [others[i], others[j]] = [others[j], others[i]]; }
  for (let i = 0; i <= WILD; i++) G.P.push(mkPlayer(i, i === 0 ? SET.civ : i === WILD ? null : others[i - 1]));
  // relations: 'war' | 'peace' | 'ally'. Raiders and Rivals are at war with everyone but the Fortress; the Fortress is at peace with all; the wild is at war with all.
  for (let a = 0; a <= WILD; a++) { G.rel[a] = []; for (let b = 0; b <= WILD; b++) G.rel[a][b] = a === b ? 'self' : a === WILD || b === WILD ? 'war' : (a === FORT || b === FORT ? 'peace' : 'war'); }
  makeMap(); initEconomy(); makeBg();
  navRebuild();
  const k = G.P[0].keep; cam.x = k[0] + 120; cam.y = k[1] - 120; cam.z = 1.3; clampCam();
  if (carry) { const p = G.P[0]; p.age = carry.age; p.techs = new Set(carry.techs); fxDirty(); }
  else say('Gather, grow, explore. Tap anything to see what it does.', '', 8);
}
const inBox = (p, r) => p.x >= r.x0 && p.x <= r.x1 && p.y >= r.y0 && p.y <= r.y1;
const node = (kind, type, x, y, amt) => ({ id: NID++, kind, type, x, y, amt, max: amt });
// One corner is laid out at random, then copied (mirrored) to all four, so every side is equal and no two games are alike.
// Local coordinates: the keep is (0,0); x and y grow toward the middle of the map.
const SHAPE = {
  bushes: [[-9, -15], [3, -1], [-17, 7], [11, -13], [-3, 15], [17, 5], [-19, -5], [9, 16]],
  pair: [[-8, -6], [8, 6]],
};
const LAYOUT = [   // what, nearest, farthest from the keep, room it needs; the last two (an angle range) put the home pocket in the corner behind the Town Center, away from every neighbour
  ['bushP', 80, 140, 38, -2.9, -1.75], ['groveP', 110, 190, 56, -2.9, -1.75], ['stoneP', 120, 190, 24, -2.9, -1.75], ['goldP', 140, 200, 24, -2.9, -1.75], ['ironP', 150, 210, 24, -2.9, -1.75],
  ['bushA', 90, 125, 38], ['groveA', 150, 230, 72], ['bushB', 135, 190, 38], ['stone', 170, 260, 24], ['gold', 190, 280, 24], ['groveB', 200, 290, 56],
  ['deerA', 160, 250, 44], ['deerB', 250, 350, 44], ['boar', 280, 380, 26], ['bushFar', 300, 420, 44],
  ['chest', 380, 520, 46], ['ruins', 330, 500, 46], ['den', 420, 560, 46], ['cemetery', 480, 640, 46], ['vagabonds', 480, 640, 46],
];
function makeLakes() {   // the great lake, and one more for each corner (same size, same place in each)
  const local = [];
  for (let t = 0; t < 80 && !local.length; t++) {
    const a = rnd(0.2, 1.37), d = rnd(430, 580), r = rnd(85, 120), x = Math.cos(a) * d, y = Math.sin(a) * d;
    if (x + r + 70 > 700 || y + r + 70 > 700) continue;                       // a wide lane along the middle lines
    if (hyp(x - 700, y - 700) < r + LAKE0.r + 110) continue;                   // and between it and the great lake
    local.push({ x, y, r });
  }
  if (!local.length) local.push({ x: 430, y: 330, r: 90 });
  return local;
}
// The dense forest, laid out for one corner and mirrored to all four like everything else (local: keep at 0,0, the middle at 700,700).
// Trees on a 26-unit lattice where an organic field runs high, thicker away from home; clear round the Town Center, the lakes, every find,
// stop and camp, along the trade lanes, and along three winding paths: to each neighbour's nearest stop and to the great lake. Anything left
// cut off is joined to home by a straight cut. About 375 trees a corner.
const FOREST = { step: 26, trees: 375, home: 360, path: 18, lane: 45 };
function makeForest(spot, loc) {
  const ph = [0, 1, 2, 3].map(() => rnd(0, 6.28)), field = (x, y) => Math.sin(x * 0.011 + ph[0]) + Math.sin(y * 0.013 + ph[1]) + Math.sin((x + y) * 0.007 + ph[2]) + Math.sin((x - y) * 0.009 + ph[3]) + Math.max(0, hyp(x, y) - 450) * 0.004;
  const keepOut = [{ x: 0, y: 0, r: FOREST.home }, { x: 700, y: 700, r: LAKE0.r + 40 }, ...loc.map(l => ({ x: l.x, y: l.y, r: l.r + 35 })),
    ...Object.entries(spot).map(([id, s]) => ({ x: s.x, y: s.y, r: id.startsWith('grove') ? 0 : id.startsWith('bush') ? 45 : 70 })),
    ...[[210, 700], [380, 700], [700, 210], [700, 380]].map(([x, y]) => ({ x, y, r: 80 })), { x: -140, y: 700, r: 90 }, { x: 700, y: -140, r: 90 },
    { x: 700, y: 430, r: 60 }, { x: 430, y: 700, r: 60 }, { x: 516, y: 516, r: 60 }];
  const lane = (x, y) => (y > 700 - FOREST.lane && x > -160 && x < 560) || (x > 700 - FOREST.lane && y > -160 && y < 560);
  const segGap = (x, y, a, b) => { const dx = b.x - a.x, dy = b.y - a.y, t = clamp(((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy || 1), 0, 1); return hyp(x - a.x - dx * t, y - a.y - dy * t); };
  const wind = (a, b) => { const pts = [a]; for (let i = 1; i < 4; i++) { const t = i / 4, nx = -(b.y - a.y), ny = b.x - a.x, l = hyp(nx, ny) || 1, w = rnd(-70, 70); pts.push({ x: a.x + (b.x - a.x) * t + nx / l * w, y: a.y + (b.y - a.y) * t + ny / l * w }); } pts.push(b); return pts; };
  const paths = [wind({ x: 0, y: 0 }, { x: 700, y: 210 }), wind({ x: 0, y: 0 }, { x: 210, y: 700 }), wind({ x: 0, y: 0 }, { x: 570, y: 570 })];
  const onPath = (x, y, P, r) => P.some(pts => pts.some((p, i) => i && segGap(x, y, pts[i - 1], p) < r));
  // the runway: finds along each path, beside it, so going out pays as you go (berries and stone toward one neighbour, gold and iron toward the other, berries and iron toward the lake)
  const along = (pts, f) => { const i = Math.min(pts.length - 2, Math.floor(f * (pts.length - 1))), t = f * (pts.length - 1) - i, a = pts[i], b = pts[i + 1], nx = -(b.y - a.y), ny = b.x - a.x, l = hyp(nx, ny) || 1; return { x: a.x + (b.x - a.x) * t + nx / l * 36, y: a.y + (b.y - a.y) * t + ny / l * 36 }; };
  const wet = p => [{ x: 700, y: 700, r: LAKE0.r }, ...loc].some(l => hyp(p.x - l.x, p.y - l.y) < l.r + 45);   // never in or at the edge of a lake: slide along the path until dry
  const dep = [['bush', 0, 0.45], ['stone', 0, 0.75], ['gold', 1, 0.45], ['iron', 1, 0.75], ['bush', 2, 0.5], ['iron', 2, 0.8]].map(([kind, pi, f]) => { let p = along(paths[pi], f); for (let k = 1; k < 8 && wet(p); k++) p = along(paths[pi], clamp(f + (k % 2 ? -1 : 1) * Math.ceil(k / 2) * 0.08, 0.2, 0.95)); return { kind, ...p }; });
  keepOut.push(...dep.map(d => ({ x: d.x, y: d.y, r: 45 })));
  let T = [];
  for (let y = -290; y < 690; y += FOREST.step) for (let x = -290; x < 690; x += FOREST.step) {
    const tx = x + rnd(-6, 6), ty = y + rnd(-6, 6);
    if (keepOut.some(q => hyp(q.x - tx, q.y - ty) < q.r) || lane(tx, ty) || onPath(tx, ty, paths, FOREST.path)) continue;
    T.push({ x: tx, y: ty, f: field(tx, ty) });
  }
  T.sort((a, b) => b.f - a.f); T = T.slice(0, FOREST.trees);
  // nothing may be walled in: join to home anything the trees cut off
  const W = 100, cell = (x, y) => clamp(Math.floor((y + 300) / 10), 0, W - 1) * W + clamp(Math.floor((x + 300) / 10), 0, W - 1);
  const reach = () => { const solid = new Uint8Array(W * W), seen = new Uint8Array(W * W);
    for (const l of [{ x: 700, y: 700, r: LAKE0.r }, ...loc]) for (let c = 0; c < W * W; c++) { const x = (c % W) * 10 - 295, y = Math.floor(c / W) * 10 - 295; if (hyp(x - l.x, y - l.y) < l.r) solid[c] = 1; }
    for (const t of T) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) solid[cell(t.x + i * 10, t.y + j * 10)] = 1;
    const Q = [cell(0, 30)]; seen[Q[0]] = 1; for (let h = 0; h < Q.length; h++) { const c = Q[h], x = c % W; for (const n of [x > 0 ? c - 1 : -1, x < W - 1 ? c + 1 : -1, c - W, c + W]) if (n >= 0 && n < W * W && !seen[n] && !solid[n]) { seen[n] = 1; Q.push(n); } }
    return seen; };
  const goals = [...Object.values(spot), ...dep, ...[[210, 700], [380, 700], [700, 210], [700, 380], [-140, 700], [700, -140], [700, 430], [430, 700], [516, 516]].map(([x, y]) => ({ x, y }))];
  for (let pass = 0; pass < 12; pass++) {
    const seen = reach(), g = goals.find(q => !seen[cell(q.x, q.y)]); if (!g) break;
    T = T.filter(t => segGap(t.x, t.y, g, { x: 0, y: 0 }) > FOREST.path);
  }
  return { trees: T, dep };
}
function makeMap() {
  const N = G.nodes, loc = makeLakes(), taken = [], spot = {};
  const room = [{ x: 700, y: 700, r: LAKE0.r + 25 }, ...loc.map(l => ({ x: l.x, y: l.y, r: l.r + 25 }))];
  for (const [id, r0, r1, clr, a0, a1] of LAYOUT) {
    let best = null;
    for (let t = 0; t < 150 && !best; t++) {
      const a = a0 === undefined ? rnd(-Math.PI, Math.PI) : rnd(a0, a1), d = rnd(r0, r1), x = Math.cos(a) * d, y = Math.sin(a) * d;
      if (x < -190 || y < -190 || x > 640 || y > 640) continue;
      if (taken.some(q => hyp(q.x - x, q.y - y) < q.r + clr) || room.some(q => hyp(q.x - x, q.y - y) < q.r + clr)) continue;
      best = { x, y };
    }
    spot[id] = best || { x: (r0 + r1) / 2 * 0.7 * (a0 === undefined ? 1 : -1), y: (r0 + r1) / 2 * 0.7 * (a0 === undefined ? 1 : -1) };
    taken.push({ x: spot[id].x, y: spot[id].y, r: clr });
  }
  const { trees: forest, dep } = makeForest(spot, loc);
  G.lakes = [{ ...LAKE0 }];
  for (const p of G.P) {
    if (p.id === WILD) continue;
    const [kx, ky] = p.keep, sx = kx < MID ? 1 : -1, sy = ky < MID ? 1 : -1, at = (dx, dy) => [kx + dx * sx, ky + dy * sy];
    for (const l of loc) { const [x, y] = at(l.x, l.y); G.lakes.push({ x, y, r: l.r }); }
    const c = id => at(spot[id].x, spot[id].y), P = (id, [dx, dy]) => at(spot[id].x + dx, spot[id].y + dy);
    for (const id of ['bushA', 'bushB']) for (const o of SHAPE.bushes) N.push(node('bush', 'food', ...P(id, o), 180 * RICH));
    for (let i = 0; i < 20; i++) N.push(node('tree', 'wood', ...P('groveA', [(i % 5 - 2) * 22 + rnd(-4, 4), (Math.floor(i / 5) - 1.5) * 22 + rnd(-4, 4)]), 120 * RICH));
    for (let i = 0; i < 14; i++) N.push(node('tree', 'wood', ...P('groveB', [(i % 5 - 2) * 20 + rnd(-4, 4), (Math.floor(i / 5) - 1) * 20 + rnd(-4, 4)]), 120 * RICH));
    for (const o of SHAPE.bushes.slice(0, 5)) N.push(node('bush', 'food', ...P('bushP', o), 180 * RICH));   // the home pocket: enough to start on, far from every neighbour
    for (let i = 0; i < 12; i++) N.push(node('tree', 'wood', ...P('groveP', [(i % 4 - 1.5) * 22 + rnd(-4, 4), (Math.floor(i / 4) - 1) * 22 + rnd(-4, 4)]), 120 * RICH));
    for (const [id, kind] of [['stoneP', 'stone'], ['goldP', 'gold'], ['ironP', 'iron']]) for (const o of SHAPE.pair) N.push(node(kind, kind, ...P(id, o), 300 * RICH));
    for (const o of SHAPE.pair) N.push(node('stone', 'stone', ...P('stone', o), 350 * RICH));
    for (const o of SHAPE.pair) N.push(node('gold', 'gold', ...P('gold', o), 350 * RICH));
    for (let i = 0; i < 6; i++) N.push(node('bush', 'food', ...P('bushFar', [rnd(-24, 24), rnd(-24, 24)]), 180 * RICH));
    for (const t of forest) N.push(node('tree', 'wood', ...at(t.x, t.y), 60 * RICH));
    for (const d of dep) { if (d.kind === 'bush') for (const [ox, oy] of SHAPE.bushes.slice(0, 4)) N.push(node('bush', 'food', ...at(d.x + ox, d.y + oy), 180 * RICH)); else for (const [ox, oy] of SHAPE.pair) N.push(node(d.kind, d.kind, ...at(d.x + ox, d.y + oy), 300 * RICH)); }   // a forest tree: half a grove tree's wood, so a way can be cut through
    G.blds.push(mkBld(p.id, 'keep', kx, ky, 1));
    const f = towardMid({ x: kx, y: ky }, 40);
    for (let i = 0; i < 3; i++) { const v = addUnit(p.id, 'vil', f.x + (i - 1) * 14, f.y + 6); v.job = i === 1 ? 'wood' : 'food'; }
    const sc = towardMid({ x: kx, y: ky }, 60); addUnit(p.id, 'scout', sc.x, sc.y);
    // the wild near home: two herds of game, and danger a little farther out
    for (const id of ['deerA', 'deerB']) for (let i = 0; i < 4; i++) wildAt('deer', ...P(id, [rnd(-20, 20), rnd(-20, 20)]));
    wildAt('boar', ...c('boar'));
    for (const id of ['chest', 'ruins', 'den', 'cemetery', 'vagabonds']) addFind(id, ...c(id));
    // a shrine on the great lake's shore facing this corner
    const s = towardMid({ x: kx, y: ky }, hyp(MID - kx, MID - ky) - LAKE0.r - 90); addFind('shrine', s.x, s.y);
  }
  // shared ground: a robbers' camp at the middle of each map edge, at the end of a trade route; gold and stone near the great lake
  for (const [x, y] of [[MID, 160], [MID, MAP - 160], [160, MID], [MAP - 160, MID]]) addFind('camp', x, y);
  for (const [x, y] of [[MID, MID - 270], [MID, MID + 270], [MID - 270, MID], [MID + 270, MID]]) N.push(node('gold', 'gold', x - 12, y, 500 * RICH), node('gold', 'gold', x + 12, y + 6, 500 * RICH), node('iron', 'iron', x - 2, y + 20, 500 * RICH), node('stone', 'stone', x + 4, y - 16, 400 * RICH));
  for (const L of G.lakes) { const n = Math.round(L.r / 10); for (let a = 0; a < n; a++) { const ang = a / n * Math.PI * 2; N.push(node('fish', 'food', L.x + Math.cos(ang) * (L.r - 8), L.y + Math.sin(ang) * (L.r - 8), 350 * RICH)); } }
}
function wildAt(kind, x, y, find) { const u = addUnit(WILD, kind, x, y); u.hx = x; u.hy = y; if (find) u.find = find.id; return u; }
function addFind(kind, x, y) {
  const F = FINDS[kind], f = { id: NID++, kind, x, y, owner: null, cap: null, done: false, guards: [] };
  if (F.guard) { const [real, fan, n] = F.guard, gk = G.fantasy ? fan : real; for (let i = 0; i < n; i++) { const a = i / n * 6.28 + rnd(0, 1); f.guards.push(wildAt(gk, x + Math.cos(a) * 26, y + Math.sin(a) * 26, f).id); } }
  if (F.hire) for (let i = 0; i < F.hire.n; i++) wildAt('vagabond', x + (i - 1) * 12, y + 14, f);
  G.finds.push(f); return f;
}
function mkBld(owner, kind, x, y, prog) {
  const sp = snapPos(kind, x, y), B = BLD[kind];
  const b = { id: NID++, owner, kind, x: sp.x, y: sp.y, gx: sp.gx, gy: sp.gy, prog, hp: 0, cd: 0, q: [] };
  b.hp = prog >= 1 ? maxHpB(owner, kind) : maxHpB(owner, kind) * 0.1;
  if (B.sheep) b.sheep = B.sheep;
  if (B.crop) { const r = 'reserve' in B ? B.reserve : Infinity; b.node = { id: NID++, kind: 'farm', type: B.crop, rate: B.rate, x: b.x, y: b.y, amt: r, max: r || Infinity, farm: b, worker: null }; G.nodes.push(b.node); }
  return b;
}
function addUnit(owner, kind, x, y) {
  const U = UNIT[kind];
  const u = { id: NID++, owner, kind, x, y, hp: 1, max: 1, cd: 0, carry: 0, carryType: null, job: null, node: null, state: 'home', px: 0, py: 0,
              ox: rnd(-30, 30), oy: rnd(-30, 30), target: null, idleT: 0, fx: 1, fy: 0 };
  u.max = u.hp = owner === WILD ? U.hp : maxHpU(owner, kind);
  G.units.push(u); return u;
}

// ───────────────────────── Queries ─────────────────────────
const keepOf = o => G.blds.find(b => b.owner === o && b.kind === 'keep' && b.hp > 0);
const bldsOf = (o, kind) => G.blds.filter(b => b.owner === o && b.kind === kind && b.hp > 0);
const ready = (o, kind) => bldsOf(o, kind).filter(b => b.prog >= 1);
const readyAt = (o, U) => [U.at, ...(U.also || [])].flatMap(k => ready(o, k));   // where a unit can be trained: its building, and any other that also trains it
const unitsOf = (o, kind) => G.units.filter(u => u.owner === o && (!kind || u.kind === kind));
const isSoldier = u => UNIT[u.kind].tick === 'sol';
const soldiersOf = o => G.units.filter(u => u.owner === o && isSoldier(u));
const armyOf = o => G.units.filter(u => u.owner === o && UNIT[u.kind].cls === 'army');
const popOf = o => G.units.filter(u => u.owner === o && UNIT[u.kind].cls).length;
const roomOf = (o, kind) => BLD[kind].room ? BLD[kind].room + fxv(o, 'room', [kind]).a : 0;   // people one home shelters, after research
const capOf = o => Math.min(POPMAX, G.blds.reduce((n, b) => n + (b.owner === o && b.prog >= 1 && b.hp > 0 ? roomOf(o, b.kind) : 0), 0));
// soldiers you may keep: each finished training place, castle, temple, courthouse or hospital makes room; at most ARMYMAX
const armyRoom = o => Math.min(ARMYMAX, G.blds.reduce((n, b) => n + (b.owner === o && b.prog >= 1 && b.hp > 0 && ARMYROOM[b.kind] ? ARMYROOM[b.kind] + fxv(o, 'armyroom', [b.kind]).a : 0), 0));
const clsMax = (c, o) => c === 'civ' ? VILMAX : armyRoom(o);
// how many of a building you may have now: by age, plus research
const capFor = (o, kind) => UNCAPPED.has(kind) ? Infinity : (CAPS[kind] ? CAPS[kind][G.P[o].age] : 1) + fxv(o, 'limit', [kind]).a;
const atCap = (o, kind) => bldsOf(o, kind).length >= capFor(o, kind);
function capWhy(o, kind) {   // why no more of this building, or null
  if (!atCap(o, kind)) return null;
  const c = capFor(o, kind), A = G.P[o].age, more = CAPS[kind] && A < 4 && CAPS[kind][A + 1] > CAPS[kind][A];
  return c ? `At the limit of ${c}` + (more ? '. A new age allows more' : '') : 'A later age allows it';
}
const clsCount = (o, c) => G.units.filter(u => u.owner === o && UNIT[u.kind].cls === c).length + G.blds.reduce((n, b) => n + (b.owner === o ? b.q.reduce((m, j) => m + (j.kind && UNIT[j.kind].cls === c ? 1 : j.muster && c === 'army' ? Object.values(j.muster).reduce((x, y) => x + y, 0) : 0), 0) : 0), 0);   // a muster counts all it will bring
const queuedOf = (o, kind) => G.blds.reduce((n, b) => n + (b.owner === o ? b.q.filter(j => j.kind && (!kind || j.kind === kind || UNIT[j.kind].replaces === kind)).length : 0), 0);
const BN = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];
const orderSet = () => armyOf(0).filter(u => u.kind !== 'spy' && u.state !== 'shrine' && (G.sel === 'all' || u.bn === G.sel));   // spies and priests holding a shrine keep their own work
const selName = () => G.sel === 'all' ? 'army' : BN[G.sel];
const hasCmd = () => G.P[0].techs.has('command');
const formOf = u => u.owner === 0 && u.bn !== undefined && G.P[0].techs.has('formations') ? G.form[u.bn] || 0 : 0;
// Battalions, once Command is researched: each holds what you set for it, by type; members stay put, gaps fill from the rest, the rest are the reserve
function rebattalion() {
  const S = armyOf(0).filter(u => u.kind !== 'spy');
  if (!hasCmd()) { for (const u of S) u.bn = undefined; return; }
  const have = BN.map(() => ({})), take = (u, i) => { have[i][u.kind] = (have[i][u.kind] || 0) + 1; u.bn = i; };
  for (const u of S) if (u.bn !== undefined) { if ((have[u.bn][u.kind] || 0) < (G.bnPlan[u.bn][u.kind] || 0)) take(u, u.bn); else u.bn = undefined; }
  for (const u of S) if (u.bn === undefined) for (let i = 0; i < BNS; i++) if ((have[i][u.kind] || 0) < (G.bnPlan[i][u.kind] || 0)) { take(u, i); break; }
}
const atWar = (a, b) => a !== b && G.rel[a][b] === 'war';
const friendly = (a, b) => a === b || G.rel[a][b] === 'ally';
const season = () => SEASONS[Math.floor(G.t / SEASON_LEN) % 4];
function nightness() { const ph = (G.t % DAY_LEN) / DAY_LEN; return ph < 0.62 ? 0 : ph < 0.7 ? (ph - 0.62) / 0.08 : ph < 0.94 ? 1 : 1 - (ph - 0.94) / 0.06; }
const civOf = o => CIVS[G.P[o].civ];
// the kind a side actually trains for a common unit (its civilisation's own, if it has one)
const civKind = (o, kind) => { const c = G.P[o] && civOf(o); return c && UNIT[c.uu].replaces === kind ? c.uu : kind; };
const baseKind = kind => UNIT[kind].replaces || kind;
const bldName = (o, kind) => kind === 'wonder' && civOf(o) ? civOf(o).wonder : BLD[kind].name3 && G.P[o].age >= 3 ? BLD[kind].name3 : BLD[kind].name;

// ───────────────────────── Effects: research, civilisation and buildings, by table ─────────────────────────
// Each side keeps a small cache of its active effects; it is rebuilt when research finishes or a building with effects stands or falls.
function fxList(o) {
  const p = G.P[o];
  if (p.fxc && p.fxc.v === G.fxv) return p.fxc;
  const c = { v: G.fxv }, add = list => { for (const f of list || []) (c[f.s] = c[f.s] || []).push(f); };
  for (const id of p.techs) add(TECHBY[id].fx);
  if (p.civ) add(CIVS[p.civ].fx);
  const seen = new Set(); for (const b of G.blds) if (b.owner === o && b.prog >= 1 && b.hp > 0 && BLD[b.kind].fx && !seen.has(b.kind)) { seen.add(b.kind); add(BLD[b.kind].fx); }
  p.fxc = c; p.uc = {}; return c;
}
// the combined effect on one stat for something with these keys: m multiplies, a adds, min keeps the lowest
function fxv(o, stat, keys) {
  const L = o === WILD ? null : fxList(o)[stat]; let m = 1, a = 0, mn = 1;
  if (L) for (const f of L) if (!f.k || f.k === '*' || (keys && keys.includes(f.k))) { if (f.m) m *= f.m; if (f.a) a += f.a; if (f.min) mn = Math.min(mn, f.min); }
  return { m, a, min: mn };
}
const fxDirty = () => { G.fxv++; };
const unitKeys = kind => { const U = UNIT[kind], k = [kind, baseKind(kind)]; for (const t of U.tags || []) k.push('#' + t); if (U.tick === 'sol') k.push('#soldier'); return k; };
const bldKeys = kind => { const B = BLD[kind], k = [kind]; if (B.wallish) k.push('#wallish'); if (B.dmg && !B.spyonly) k.push('#guard'); return k; };
// what a side's unit of this kind is, after its research: name, health, damage, reach, speed, what it beats
function stats(o, kind) {
  if (o === WILD) return UNIT[kind];
  const p = G.P[o]; fxList(o);
  if (p.uc[kind]) return p.uc[kind];
  const U = UNIT[kind], base = baseKind(kind), keys = unitKeys(kind);
  let name = U.name, hp = U.hp, dmg = U.dmg || 0, rng_ = U.rng || 0, spd = U.spd, vs = U.vs || {}, tier = 0;
  for (const T of TECH) if (T.tier && T.tier.unit === base && p.techs.has(T.id)) {
    const R = T.tier; tier++; if (!U.civ) name = R.name; hp *= R.hp || 1; dmg += R.dmg || 0; rng_ += R.rng || 0; spd *= R.spd || 1; if (R.vs) vs = { ...vs, ...R.vs };
  }
  const S = { name, tier, kit: ['leather', 'chain', 'plate'].filter(id => p.techs.has(id)).length, hp: hp * fxv(o, 'uhp', keys).m, dmg: U.dmg ? dmg + fxv(o, 'dmg', keys).a : 0, rng: rng_ + fxv(o, 'rng', keys).a,
    spd: spd * fxv(o, 'spd', keys).m, vs, armor: fxv(o, 'armor', keys).min, train: fxv(o, 'train', keys).m };
  return (p.uc[kind] = S);
}
const maxHpU = (o, kind) => stats(o, kind).hp;
const maxHpB = (o, kind) => BLD[kind].hp * (o === WILD ? 1 : fxv(o, 'bhp', ['*', ...bldKeys(kind)]).m);
const dmgOf = u => stats(u.owner, u.kind).dmg * (FORM[formOf(u)].dmg && hasTag(u.kind, 'mounted') ? FORM[formOf(u)].dmg : 1) * (u.zeal > G.t ? ZEAL.mul : 1) * (u.sick > G.t ? 0.6 : 1) * hungerOf(u.owner);
const rngOf = u => { const r = stats(u.owner, u.kind).rng; return r > 20 ? r * (WEATHER[G.wx] && WEATHER[G.wx].rng || 1) : r; };
const sightOf = e => ((UNIT[e.kind] || BLD[e.kind]).sight || 100) * (1 - (1 - NIGHT_SIGHT) * G.night);
const carryOf = o => CARRY + fxv(o, 'carry').a;
function gatherMul(o, n) {
  let m = fxv(o, 'gather', [n.type, n.kind]).m;
  if (n.kind === 'farm') {
    m *= fxv(o, 'crop', [n.type]).m;
    if (n.type === 'food') { m *= season().farm * (G.harvest || 1) * (WEATHER[G.wx].crop || 1) * (n.farm.fert ?? 1); if (n.type === 'food' && bakeryNear(o, n)) m *= BLD.bakery.aura.m; }
  }
  return m;
}
const bakeryNear = (o, n) => G.blds.some(b => b.owner === o && b.kind === 'bakery' && b.prog >= 1 && b.hp > 0 && dist(b, n) < BLD.bakery.aura.r);
// after research or a new building: every unit and building of that side takes its new health at once (same share of it)
function rehealth(o) {
  fxDirty();
  for (const u of G.units) if (u.owner === o) { const M = maxHpU(o, u.kind); if (Math.abs(M - u.max) > 0.01) { u.hp *= M / u.max; u.max = M; } }
  for (const b of G.blds) if (b.owner === o && b.prog >= 1) { const M = maxHpB(o, b.kind); if (b.mx && Math.abs(M - b.mx) > 0.01) b.hp *= M / b.mx; b.mx = M; }
}
const unitPower = u => u.hp * Math.max(1, dmgOf(u)) / 6 * (UNIT[u.kind].bonly ? 0.3 : 1);
const powerOf = list => list.reduce((s, u) => s + (isSoldier(u) ? unitPower(u) : 0), 0);

