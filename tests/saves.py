# Save safety (Build 80 batch 2): each check below failed on the Build 70 code and passes now. Run by the gate:  python3 tests/saves.py
import asyncio, os, re, sys, glob
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEED = """() => { const F = window.__fk; F.newGame(5); F.act('close'); F.setPause(false); for (let i = 0; i < 120; i++) F.step(0.25); F.saveGame(true); return localStorage.getItem(F.SAVEKEY); }"""
JS = """(raw) => {
  // run after a reload with a save waiting: the Resume card and the hold come from boot itself (not set by hand)
  const F = window.__fk, bad = [], before = localStorage.getItem(F.SAVEKEY);
  if (!F.G.card || F.G.card.type !== 'resume') bad.push('boot did not show the Resume card for a waiting save');
  if (!F.holdSave) bad.push('boot did not hold the save while the Resume card waits');
  F.saveGame(true); if (localStorage.getItem(F.SAVEKEY) !== before) bad.push('a forced save overwrote the save the Resume card offers');
  F.act('close'); if (!F.G.card || F.G.card.type !== 'resume') bad.push('the Resume card closed into play');
  F.act('cardback'); if (!F.G.card || F.G.card.type !== 'resume') bad.push('back closed the Resume card');
  F.ui(true); const cl = document.querySelector('#card [data-act="close"]'); if (cl && !cl.classList.contains('dis')) bad.push('close is not dim on the Resume card');
  return bad;
}"""
REST = """(raw) => {
  const F = window.__fk, bad = [];
  if (F.holdSave || localStorage.getItem(F.SAVEKEY)) bad.push('the second page did not start clean: a save was left waiting');
  // an event with its own pieces on the map is ended on load (its end runs and the next is scheduled), not just dropped (first: the
  // damaged-save checks below count as errors, and after two the game stops saving)
  F.newGame(5); F.act('close'); F.step(0.25); F.G.ev.next = F.G.t; /* as when an event starts on time: its next is now */ F.startEvent('wildfire'); const t0 = F.G.t; F.saveGame(true); const sv = F.readSave();
  if (!sv) bad.push('the event check could not save its game'); else { F.loadGame(sv);
  if (F.G.ev.cur) bad.push('an event with its own pieces carried on after a load');
  else if (!(F.G.ev.next > t0)) bad.push('an event dropped on load was not ended: the next event was never scheduled'); }
  // a finished game leaves no backup to bring it back
  localStorage.setItem(F.SAVEKEY + '.bak', raw); F.clearSave();
  if (localStorage.getItem(F.SAVEKEY) || localStorage.getItem(F.SAVEKEY + '.bak')) bad.push('clearSave left a save or a backup');
  // the blank game has its threats
  if (!Array.isArray(F.blankGame(1).threats)) bad.push('blankGame has no threats list');
  // an old save naming a cut unit kind still migrates; a damaged save is kept aside, not overwritten
  const o = JSON.parse(raw); o.v = 35; o.blds = o.blds || []; if (o.blds[0]) o.blds[0].q = [{ kind: 'cutkind' }];
  try { F.MIGRATE[35](o); } catch (e) { bad.push('a cut unit kind stops an old save from opening'); }
  // a save from before the merge holding Printing opens with Printing press, and a queued Printing order is given back (N12); the sky
  // it rolled ahead becomes the list a forecast reads (N10)
  { const o = JSON.parse(raw); o.v = 40; o.P[0].techs = ['press', 'printing']; o.clim = { ...(o.clim || {}), next: true }; delete o.clim.ahead;
    const k = o.blds.find((b) => b.owner === 0 && b.kind === 'keep'), g0 = o.P[0].res.g || 0; k.q = [{ tech: 'printing', left: 10, total: 87, paid: { f: 550, g: 360 } }];
    o.P[0].spent = 2000; o.P[0].ledger = { in: {}, out: { research: 1000 } }; o.P[0].spent1 = { f: 550, g: 360 };
    const S = F.MIGRATE[40] ? F.MIGRATE[40](o) : o;
    if (S.P[0].techs.includes('printing') || !S.P[0].techs.includes('press')) bad.push('N12: an old save keeps Printing (' + S.P[0].techs.filter((t) => /pr/.test(t)) + ')');
    if (k.q.length || S.P[0].res.g !== g0 + 360) bad.push('N12: a queued Printing order was not given back');
    if (S.P[0].spent !== 2000 - 910 || S.P[0].ledger.out.research !== 1000 - 910) bad.push(`N12: the Printing refund is not a cancel: research spent ${S.P[0].spent} (want 1090), the ledger ${S.P[0].ledger.out.research} (want 90)`);
    if (!(Array.isArray(S.clim.ahead) && S.clim.ahead[0] === true && !('next' in S.clim))) bad.push('N10: an old save loses the sky it rolled ahead'); }
  // C6: a save from before the combat batch keeps a rout's end (routT); step 41 turns it into when the rout began, Engagement's halved run counted
  { const o = JSON.parse(raw); o.v = 41; o.P[0].techs = ['engage']; o.P[1].techs = [];
    const a = { ...o.units[0], owner: 0, state: 'rout', routT: 100 }, b = { ...o.units[0], owner: 1, state: 'rout', routT: 100 }; delete a.routAt; delete b.routAt; o.units.push(a, b);
    const S = F.MIGRATE[41](o), R = F.MORALE.rout;
    if (S.v !== 42) bad.push('C6: save step 41 does not lead to shape 42');
    if (a.routAt !== 100 - R / 2 || b.routAt !== 100 - R || 'routT' in a || 'routT' in b) bad.push('C6: an old rout opens with the wrong start (' + a.routAt + ', ' + b.routAt + '; want ' + (100 - R / 2) + ', ' + (100 - R) + ')'); }
  // Nov 2 (Albert): a save with four squads opens with three; the old fourth squad's soldiers go to the reserve, and its selection and plan go with it
  { const o = JSON.parse(raw); o.v = 43; o.bnPlan = [{}, {}, {}, { foot: 5 }]; o.form = [0, 0, 0, 1]; o.units[0].bn = 3; o.units[1].bn = 1; o.msn = [null, null, null, { name: 'Squad D' }]; o.sel = 3; o.temper = [1, 1, 1, 1, 2];
    const S = F.MIGRATE[43](o);
    if (S.v !== 44) bad.push('Nov 2: save step 43 does not lead to shape 44');
    if (S.bnPlan.length !== 3 || S.form.length !== 3 || S.msn.length !== 3) bad.push('Nov 2: an old four-squad save keeps a fourth squad (' + S.bnPlan.length + ')');
    if (o.units[0].bn !== undefined || o.units[1].bn !== 1) bad.push("Nov 2: the old fourth squad's soldiers do not go to the reserve");
    if (S.sel !== 'all' || S.temper.length !== 4 || S.temper[3] !== 2) bad.push("Nov 2: an old save's selection or temper is wrong after the fold"); }
  localStorage.setItem(F.SAVEKEY, '{"units":1,"P":[],"v":39,"blds":null,"x":'); F.readSave();
  if (!localStorage.getItem(F.SAVEKEY + '.lost')) bad.push('a damaged save was not kept aside');
  // two stale saves of different shapes each keep their own slot: the second never overwrites the first
  const S = JSON.parse(raw), v1 = S.v + 1, v2 = S.v + 2;
  for (const v of [v1, v2]) { localStorage.removeItem(F.SAVEKEY + '.old' + v); localStorage.setItem(F.SAVEKEY, JSON.stringify({ ...S, v })); F.readSave(); }
  if (!localStorage.getItem(F.SAVEKEY + '.old' + v1) || !localStorage.getItem(F.SAVEKEY + '.old' + v2)) bad.push('stale saves share one slot: the second overwrote the first');
  // an alert never waits for a voice; an effect does when the air is full
  if (!F.voiceFree('horn', F.VOICES.max + 5)) bad.push('an alert waits for a voice when the air is full');
  if (F.voiceFree('hit', F.VOICES.max)) bad.push('an effect takes a voice the alerts keep');
  // p44: no unit field comes back from a save as a detached copy of a building or a unit (u.site did: a soldier raised a copy of its camp
  // piece forever); every object a unit holds with an id is the one in the lists, or dropped
  { F.newGame(9); F.act('close'); F.step(0.25); const G = F.G, k = F.keepOf(0), P = G.P[0]; P.age = 3; P.techs.add('campwagons');
    const b = F.mkBld(0, 'medtent', k.x + 90, k.y + 90, 0); b.camp = 7; b.campKind = 'camp'; G.blds.push(b); F.navRebuild(); const u = F.addUnit(0, 'spear', k.x + 100, k.y + 100); u.state = 'home';
    for (let i = 0; i < 60 && !u.site; i++) F.step(1 / 30); if (!u.site) bad.push('p44: a soldier by an unraised camp piece took no site'); else { F.saveGame(true); const sv = F.readSave(); if (!sv) bad.push('p44: could not save with a site held'); else { F.loadGame(sv);
      const ids = new Map(); for (const x of F.G.blds) ids.set(x.id, x); for (const x of F.G.units) ids.set(x.id, x);
      for (const v of F.G.units) for (const key in v) { const o = v[key]; if (o && typeof o === 'object' && !Array.isArray(o) && o.id !== undefined && o.kind !== undefined && ids.has(o.id) && ids.get(o.id) !== o) { bad.push('p44: after a load, ' + v.kind + '.' + key + ' is a detached copy of ' + o.kind + ' ' + o.id); break; } } } } }
  // All hands, when on, wears its ring on the Emergency page of the row
  F.emgStart('hands'); F.hudPage('war'); F.G.hud.sub = 'alarm'; F.ui(true); const h = document.querySelector('#row [data-act="emg:hands"]');
  if (!h || !/●/.test(h.textContent)) bad.push('Garrison is on but its button on War · Alarm does not show it (a dot beside its icon)');
  return bad;
}"""
def static():
    bad = []; src = {f: open(f).read() for f in glob.glob(os.path.join(ROOT, 'src', '*.js'))}
    all_ = ''.join(src.values())
    if "'card:menu,land'" in all_: bad.append("House fix still points at 'card:menu,land'")
    # one home for the dice and the purse (batch 1): no Math.random in the sim files; no res += / -= outside earn, spend and payBack
    for f, t in src.items():
        n = os.path.basename(f)
        if re.match(r'1[0-7]-', n) and n != '10-world.js' and 'Math.random' in t.replace('Math.random() * 2 ** 31', ''): bad.append(n + ' rolls Math.random in the sim')
        if n not in ('08-core.js',) and re.search(r'\.res\[[^\]]+\]\s*[-+]=|\.res\.[a-z]+\s*[-+]=', t): bad.append(n + ' changes a purse outside earn, spend and payBack')
    return bad
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
        raw = await pg.evaluate(SEED); bad = []
        # the Welcome back card holds the whole screen: reload with the save waiting, then tap round it with a real finger
        await pg.reload(); await pg.wait_for_timeout(500)
        bad += await pg.evaluate(JS, raw)
        cam0 = await pg.evaluate("() => { const c = window.__fk.cam; window.__fk.G.follow = false; return [c.x, c.y, c.z]; }")
        await pg.locator('#tally [data-act="ctl:jobs"]').first.click(force=True); await pg.wait_for_timeout(100)
        box = await pg.locator('#cv').bounding_box(); cx, cy = box['x'] + box['width'] / 2, box['y'] + 140
        await pg.mouse.click(cx, cy); await pg.wait_for_timeout(100)
        await pg.mouse.move(cx, cy); await pg.mouse.wheel(0, 400); await pg.wait_for_timeout(150)
        await pg.mouse.move(cx, cy); await pg.mouse.down(); await pg.mouse.move(cx + 80, cy + 60, steps=6); await pg.mouse.up(); await pg.wait_for_timeout(150)
        cam1 = await pg.evaluate("() => { const c = window.__fk.cam; return [c.x, c.y, c.z]; }")
        if abs(cam1[2] - cam0[2]) > 1e-6: bad.append('the wheel zoomed the map behind the Welcome back card (' + str(round(cam0[2], 2)) + ' to ' + str(round(cam1[2], 2)) + ')')
        if abs(cam1[0] - cam0[0]) > 1e-6 or abs(cam1[1] - cam0[1]) > 1e-6: bad.append('a drag moved the map behind the Welcome back card')
        card = await pg.evaluate("() => window.__fk.G.card && window.__fk.G.card.type")
        if card != 'resume': bad.append('a tap outside the Welcome back card got through: another card (' + str(card) + ') opened over it')
        if await pg.locator('#card [data-act="resume"]').count(): await pg.locator('#card [data-act="resume"]').first.click(); await pg.wait_for_timeout(200)
        st = await pg.evaluate("() => [window.__fk.G.card && window.__fk.G.card.type, window.__fk.holdSave]")
        if st[0] == 'resume' or st[1]: bad.append('the Welcome back card does not answer its own choice (' + str(st) + ')')
        # the rest in a clean page, so a failure above cannot spill into it
        await pg.evaluate("() => { window.__fk.setHold(true); localStorage.clear(); }"); await pg.reload(); await pg.wait_for_timeout(300)  # held, so leaving the page saves nothing
        bad += await pg.evaluate(REST, raw); await br.close()
    bad = bad + static() + errs
    print(('PASS ' if not bad else 'FAIL ') + 'save safety (Welcome back holds the screen, force cannot overwrite, clear removes backup, stale slots, event ends on load, alerts, All hands, Printing and the rolled sky migrate)', '' if not bad else bad)
    sys.exit(1 if bad else 0)
asyncio.run(main())
