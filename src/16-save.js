// ═════ 16-save.js ═════
// ───────────────────────── Saving: on this phone, every 10 seconds and when you leave ─────────────────────────
const SAVEKEY = 'firstkeep.save', SAVEV = 29;   // the save's shape, not the build: raise it only when the shape changes, and add a step to MIGRATE for the old one
const MIGRATE = {   // { 24: S => S-in-the-shape-of-25 }, run in order
  27: S => { for (const p of S.P) if (p.techs && p.techs.includes('command') && !p.techs.includes('engage')) p.techs.push('engage'); S.v = 28; return S; },   // Build 31: Engagement comes before Battalions; who had them keeps stances
  28: S => { for (const u of S.units) if (u.job === 'farm') u.job = 'food'; for (const p of S.P) if (p.rally === 'farm') p.rally = 'food'; S.v = 29; return S; },   // Build 36: Farm is folded into Food
};
let staleSave = 0;   // the version of a save we could not open, so the setup card can say so
const SKIP_U = new Set(['focus', 'tgt', 'bt', 'esc', 'blocker', 'path', 'so', 'aggro', 'node', 'rep', 'hunt', 'lcOK', 'lcT', 'pv', 'pk', 'pfK', 'pfV', 'pfT', 'pi', 'partial', 'drop', 'dropR', 'dropN', 'dropT']);
let holdSave = false;   // while the Resume card waits, nothing may overwrite the save it offers
const inFight = () => G.units.some(u => u.owner === 0 && u.tgt && u.tgt.hp > 0);
let fightHold = 0;
function saveGame(force) {
  if (!G || G.over || (holdSave && !force)) return;
  if (!force && inFight() && (fightHold = fightHold || G.t) && G.t - fightHold < 60) return; fightHold = 0;   // the save stutters: not in the middle of a battle (at most a minute late)
  try {
    const units = G.units.map(u => { const r = {}; for (const k in u) if (!SKIP_U.has(k)) r[k] = u[k]; r.nodeId = u.node ? u.node.id : null; r.repId = u.rep ? u.rep.id : null; r.huntId = u.hunt ? u.hunt.id : null; return r; });
    const blds = G.blds.map(b => { const r = {}; for (const k in b) if (k !== 'node') r[k] = b[k]; if (b.node) { r.nodeId = b.node.id; r.res = isFinite(b.node.amt) ? b.node.amt : undefined; } return r; });
    const S = { v: SAVEV, at: Date.now(), t: G.t, tick: G.tick, speed: G.speed, seed: G.seed, rs: G.rs, nid: NID, sel: G.sel, rally0: G.rally0 || null, hold: G.hold, stance: G.stance, bnPlan: G.bnPlan, form: G.form, contract: G.contract || null, intel: G.intel, fantasy: G.fantasy, mode: G.mode, diff: G.diff, wayT: G.wayT, wayI: G.wayI, wonder: G.wonder, mkt: G.mkt || null, reignT: G.reignT ?? null, free: !!G.free, bell: G.bell || null, wx: G.wx, wxT: G.wxT, harvest: G.harvest, plague: G.plague, seasonN: G.seasonN,
      cam: { x: cam.x, y: cam.y, z: cam.z }, rel: G.rel, finds: G.finds, lakes: G.lakes,
      P: G.P.map(p => { const { fxc, uc, ...q } = p; return { ...q, techs: [...p.techs] }; }),
      nodes: G.nodes.filter(n => n.kind !== 'farm').map(n => n.kind === 'tree' ? [n.id, n.x, n.y, n.amt, n.max] : (({ open, wk, ...r }) => r)(n)), blds, units };   // trees are most of the map: five numbers each
    localStorage.setItem(SAVEKEY, JSON.stringify(S, (k, v) => typeof v === 'number' && !Number.isInteger(v) ? Math.round(v * 100) / 100 : v));   // hundredths are plenty: a third of the size
  } catch (e) {}
}
function readSave() {
  try {
    let S = JSON.parse(localStorage.getItem(SAVEKEY) || 'null');
    if (!S || !S.units || !S.P) return null;
    while (S.v < SAVEV && MIGRATE[S.v]) S = MIGRATE[S.v](S);
    if (S.v !== SAVEV) { localStorage.setItem(SAVEKEY + '.old', JSON.stringify(S)); localStorage.removeItem(SAVEKEY); staleSave = S.v; return null; }   // kept aside, never lost
    return S.P.length === 5 ? S : null;
  } catch (e) { return null; }
}
function clearSave() { try { localStorage.removeItem(SAVEKEY); } catch (e) {} }
function loadGame(S) {
  NID = S.nid; G = blankGame(S.seed); resetScars();
  Object.assign(G, { t: S.t, tick: S.tick || 0, speed: S.speed || 1, rs: S.rs, sel: S.sel === undefined ? 'all' : S.sel, rally0: S.rally0, hold: S.hold || Array(BNS + 1).fill(0), stance: S.stance || Array(BNS + 1).fill(0), bnPlan: S.bnPlan || BN.map(() => ({})), form: S.form || BN.map(() => 0), bnEdit: 0, qs: { from: 'all', n: {} }, contract: S.contract || null, intel: S.intel || {}, fantasy: !!S.fantasy, mode: S.mode || 'conquest', diff: S.diff || SET.diff, wayT: S.wayT, wayI: S.wayI, wonder: S.wonder || null, mkt: S.mkt || null, reignT: S.reignT ?? null, free: !!S.free, bell: S.bell || null, wx: S.wx || 'clear', wxT: S.wxT || WX_EVERY, harvest: S.harvest || 1, plague: S.plague || null, seasonN: S.seasonN || 0, rel: S.rel, finds: S.finds || [] });
  G.lakes = S.lakes; makeBg();
  G.P = S.P.map(p => ({ ...p, techs: new Set(p.techs), fxc: null, uc: {} }));
  G.nodes = S.nodes.map(n => Array.isArray(n) ? { id: n[0], kind: 'tree', type: 'wood', x: n[1], y: n[2], amt: n[3], max: n[4] } : { ...n });
  const byNode = new Map(G.nodes.map(n => [n.id, n]));
  for (const sb of S.blds) {
    const { nodeId, res, ...rest } = sb, b = { ...rest, q: sb.q || [] }; G.blds.push(b);
    if (BLD[b.kind].crop) { const B = BLD[b.kind], r0 = 'reserve' in B ? B.reserve : Infinity; const nd = { id: nodeId || NID++, kind: 'farm', type: b.cropT || B.crop, rate: B.rate, x: b.x, y: b.y, amt: res ?? r0, max: r0 || Infinity, farm: b, worker: null }; b.node = nd; G.nodes.push(nd); byNode.set(nd.id, nd); }
  }
  const byB = new Map(G.blds.map(b => [b.id, b]));
  for (const su of S.units) { const { nodeId, repId, huntId, ...u } = su; u.node = nodeId ? byNode.get(nodeId) || null : null; u.rep = repId ? byB.get(repId) || null : null; u._hunt = huntId; G.units.push(u); }
  const byU = new Map(G.units.map(u => [u.id, u])); for (const u of G.units) { if (u._hunt) u.hunt = byU.get(u._hunt) || null; delete u._hunt; }
  fxDirty(); navRebuild(); scoreAll();
  if (S.cam) { cam.x = S.cam.x; cam.y = S.cam.y; cam.z = clamp(S.cam.z, minZ(), ZOOM_MAX); clampCam(); }
  paceBtn(); muteBtn();
  $('end').hidden = true; closeCard(); cancelPlace(); holdSave = false; setPause(false);
}
document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });
window.addEventListener('pagehide', () => saveGame());

