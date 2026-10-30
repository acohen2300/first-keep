# The gate: what must hold before a build goes live, measured at four iPhone sizes, not judged by eye.
# No page errors; no two buildings alike at half zoom; nothing wider than the screen; every word inside its button; text at least 12 px; contrast at least 4.5:1 (target 7:1); no card but Help and the Guide needs scrolling from 390 × 844 up (the iPhone SE at 375 × 667 is too short for the biggest cards); every tap target at least 44 × 44 points (Apple's rule), except the − and + tiles under each job (six columns leave them 26 to 29 points wide; kept by choice, Build 36).
# Run from first-keep/:  python3 build.py && python3 wrap.py && python3 tests/gate.py   (add --soak for the long games, tests/soak.py)
import asyncio, json, os, subprocess, sys
from playwright.async_api import async_playwright
SIZES = [(375, 667), (390, 844), (393, 852), (430, 932)]
SETUP = """() => { const F = window.__fk; F.newGame(5); F.act('close'); const G = F.G, P = G.P[0], k = F.keepOf(0); F.setPause(true);
  P.age = 3; for (const r of ['f', 'w', 's', 'g', 'i']) P.res[r] = 9999; P.goods.cloth = 30; for (let i = 0; i < 12; i++) F.addUnit(0, 'spear', k.x + 60, k.y - 60);
  const put = kind => { const s = F.findSpot(0, kind, k.x, k.y, 70, 320); const b = F.build(0, kind, s.x, s.y); b.prog = 1; b.hp = F.BLD[kind].hp; F.built(b); return b.id; };
  window.IDS = { workshop: put('workshop'), farm: put('farm'), market: put('market'), keep: k.id }; F.navRebuild(); F.makeVassal(1, 0, 'fair'); window.IDS.vassal = F.keepOf(1).id; }"""
CARDS = [('help', "{type:'help'}"), ('setup', "{type:'setup'}"), ('army', "{type:'troops'}"), ('home', "{type:'menu',id:'home'}"), ('guide', "{type:'guide',page:'bld'}"),
         ('keep', "{type:'bld',id:IDS.keep}"), ('workshop', "{type:'bld',id:IDS.workshop}"), ('farm', "{type:'bld',id:IDS.farm}"),
         ('market', "{type:'bld',id:IDS.market}"), ('vassal', "{type:'bld',id:IDS.vassal}"), ('score', "{type:'score'}")]
MEASURE = """() => {
  const lum = c => { const f = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const parse = s => { const m = s.match(/[\\d.]+/g); return m ? [+m[0], +m[1], +m[2], m[3] == null ? 1 : +m[3]] : [0, 0, 0, 0]; };
  const bg = el => { const st = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c[3] > 0) st.push(c); if (c[3] >= 1) break; } let col = [18, 23, 21]; for (let i = st.length - 1; i >= 0; i--) col = [0, 1, 2].map(j => st[i][j] * st[i][3] + col[j] * (1 - st[i][3])); return col; };
  const out = { wide: document.documentElement.scrollWidth > innerWidth + 1, tall: document.documentElement.scrollHeight > innerHeight + 1, small: [], low: [], clip: [], tap: [], scroll: '' };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const t = n.textContent.trim(), el = n.parentElement; if (!t || !el || el.closest('script,style,[hidden]')) continue;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el); if (!r.width || !r.height || cs.visibility === 'hidden' || r.bottom < 0 || r.top > innerHeight) continue;
    const px = parseFloat(cs.fontSize); if (px < 12) out.small.push(t.slice(0, 20) + ' ' + px);
    const fg = parse(cs.color), b = bg(el), L1 = lum(fg), L2 = lum(b), c = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); if (c < 4.5) out.low.push(t.slice(0, 20) + ' ' + c.toFixed(1));
  }
  for (const b of document.querySelectorAll('button')) { const r = b.getBoundingClientRect(); if (!r.width || b.closest('[hidden]')) continue; for (const e of b.querySelectorAll('b,small')) if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible') out.clip.push(e.textContent.slice(0, 24)); if (r.right > innerWidth + 1) out.clip.push('off screen: ' + b.textContent.slice(0, 20)); }
  for (const b of document.querySelectorAll('button,[data-act],summary')) { const r = b.getBoundingClientRect(); if (!r.width || b.closest('[hidden],.pm') || r.bottom < 0 || r.top > innerHeight) continue; if (r.width < 44 || r.height < 44) out.tap.push((b.id || b.textContent.trim().slice(0, 14) || b.className) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); }
  { const c = document.getElementById('card'); out.scroll = c && !c.hidden && c.scrollHeight > c.clientHeight + 1 ? c.scrollHeight + '>' + c.clientHeight : ''; }
  for (const e of document.querySelectorAll('.wd,.top .c,.strip button span')) { if (e.closest('[hidden]') || !e.getBoundingClientRect().width) continue; if (e.scrollWidth > e.clientWidth + 1) out.clip.push('tile: ' + e.textContent.slice(0, 16)); }
  return out; }"""
# Readability: at half zoom, no two buildings may share both their average colour (within 18) and their size (within 5 px)
LOOK = """() => { const F=window.__fk; F.newGame(5); const G=F.G; const s=1;   // zoom 0.5 at dpr 2
 const kinds=Object.keys(F.BLD).filter(k=>!['wall','gate','wonder'].includes(k)&&!F.BLD[k].trap), D={};
 for (const k of kinds) { const c=F.bldSprite({kind:k,owner:0},s), x=c.getContext('2d').getImageData(0,0,c.width,c.height).data; let n=0,r=0,g=0,b=0,x0=1e9,x1=-1,y0=1e9,y1=-1;
   for (let i=0;i<x.length;i+=4) if (x[i+3]>128) { n++; r+=x[i]; g+=x[i+1]; b+=x[i+2]; const p=i/4, px=p%c.width, py=(p/c.width)|0; x0=Math.min(x0,px); x1=Math.max(x1,px); y0=Math.min(y0,py); y1=Math.max(y1,py); }
   D[k]={rgb:[r/n,g/n,b/n],w:x1-x0,h:y1-y0}; }
 const same=[]; for (let i=0;i<kinds.length;i++) for (let j=i+1;j<kinds.length;j++) { const a=D[kinds[i]], b=D[kinds[j]]; const dc=Math.hypot(...a.rgb.map((v,t)=>v-b.rgb[t])), ds=Math.abs(a.w-b.w)+Math.abs(a.h-b.h); if (dc<18 && ds<5) same.push(kinds[i]+'~'+kinds[j]+' '+dc.toFixed(0)+'/'+ds); }
 return same; }"""
# Behaviour: real taps on the page, not calls into the game. The Build menu was dead from Build 34 to 36 because the gate only measured layout.
PLAY = """async () => {
  const F = window.__fk, out = [], tap = sel => { const el = document.querySelector(sel); if (!el) { out.push('missing ' + sel); return; } el.click(); };
  F.setPause(false); F.newGame(5); F.act('close'); const G = F.G; G.P[0].res = { f: 9999, w: 9999, s: 9999, g: 9999, i: 9999 };
  tap('#buildT'); if (!G.card || G.card.type !== 'menu') out.push('Build did not open the Build card');
  tap('[data-act="menu:home"]'); if (!G.card || G.card.id !== 'home') out.push('the Home tab did not open');
  tap('[data-act="build:house"]'); if (!G.place || G.place.kind !== 'house') out.push('tapping House did not start placing');
  F.act('cancel'); if (G.place) out.push('Cancel left a placement');
  const q0 = F.keepOf(0).q.length; tap('#tPeople'); if (F.keepOf(0).q.length !== q0 + 1) out.push('People did not queue a villager');
  F.act('qcancel:' + F.keepOf(0).id + ',' + q0); if (F.keepOf(0).q.length !== q0) out.push('a slot tap did not cancel the villager');
  tap('[data-act="move:wood"]'); if (!F.G.units.some(u => u.owner === 0 && u.kind === 'vil' && u.job === 'wood')) out.push('+ under Wood put nobody on wood');
  
  tap('#scoreP'); if (!G.card || G.card.type !== 'score') out.push('Score card did not open'); F.act('close');
  tap('#pauseB'); if (!G.paused) out.push('Pause did not pause'); tap('#pauseB'); if (G.paused) out.push('Pause did not resume');
  for (let i = 0; i < 90; i++) F.step(1 / 30); const t = G.t; F.saveGame(true); const S = F.readSave(); if (!S) out.push('no save written'); else { F.loadGame(S); if (Math.abs(F.G.t - t) > 0.5) out.push('reload lost the clock'); }
  return out; }"""
# Every verb a button can send must have a handler: the class of bug behind the dead Build menu
# The play fingerprint: a fixed game on a fixed seed, scripted the same way every time, and every side's counts at each minute.
# The game may not play differently by accident. A deliberate change to the rules is accepted with:  python3 tests/gate.py --accept "why"
# (the baseline is rewritten and the reason logged in CUTS.md). The simulation's dice are seeded, so this is exact, like SoRen's locked physics block.
BASELINE = 'tests/baseline.json'
FINGERPRINT = """() => { const F = window.__fk; F.newGame(7); F.act('close'); const G = F.G; F.setPause(true); G.diff = 'normal';
  const P = G.P[0], k = F.keepOf(0), put = (kind, dx, dy) => { const s = F.findSpot(0, kind, k.x + dx, k.y + dy, 40, 300); return s && F.build(0, kind, s.x, s.y); };
  const script = { 20: () => { F.train(0, 'vil'); F.train(0, 'vil'); }, 40: () => F.moveVil(0, 'wood'), 60: () => put('house', 60, -60), 90: () => { P.res.w += 150; put('barracks', -80, -80); }, 120: () => F.moveVil(0, 'stone'), 150: () => { P.res.f += 200; F.train(0, 'spear'); F.train(0, 'spear'); }, 200: () => { P.res.w += 200; put('farm', 90, 40); }, 240: () => { P.res.f += 400; P.res.g += 100; F.ageUp(0); } };
  const out = [];
  for (let i = 1; i <= 30 * 300; i++) { F.step(1 / 30); const t = i / 30; if (script[t]) script[t]();
    if (i % 1800 === 0) out.push(G.P.map(q => [Math.round(q.res.f), Math.round(q.res.w), Math.round(q.res.s), Math.round(q.res.g), G.units.filter(u => u.owner === q.id && u.hp > 0).length, G.blds.filter(b => b.owner === q.id && b.hp > 0).length, q.age].join('/')).join(' | ')); }
  return out; }"""
async def fingerprint(br):
    pg = await br.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(600)
    got = await pg.evaluate(FINGERPRINT); await pg.close()
    if errs: return ['page error: ' + errs[0][:120]], got
    accept = '--accept' in sys.argv
    if accept:
        why = sys.argv[sys.argv.index('--accept') + 1] if len(sys.argv) > sys.argv.index('--accept') + 1 else 'no reason given'
        json.dump({'why': why, 'minutes': got}, open(BASELINE, 'w'), indent=1); open('CUTS.md', 'a').write(f'\n- **Play fingerprint accepted:** {why}\n'); return [], got
    if not os.path.exists(BASELINE): return ['no baseline: run  python3 tests/gate.py --accept "first baseline"'], got
    want = json.load(open(BASELINE))['minutes']
    return [f'minute {i + 1}: {w}  now  {g}' for i, (w, g) in enumerate(zip(want, got)) if w != g] + (['length differs'] if len(want) != len(got) else []), got
# Every event does what its name says (Build 42: the clocks of the storm, flood, circus and dragon had tested a tick that never came, so they did nothing).
EVENTS_TEST = """() => { const F = window.__fk; F.SET.diff = 'normal'; F.newGame(3); F.act('close'); const G = F.G; G.fantasy = true; F.setPause(true);
  const bad = [], run = (s) => { for (let i = 0; i < s * 30; i++) F.step(1 / 30); };
  const clear = () => { F.endEvent(); G.bolts = []; G.ev.warned = null; };
  // the storm: a bolt every two seconds
  F.startEvent('storm'); run(42); if ((G.bolts || []).length < 15) bad.push('storm: ' + (G.bolts || []).length + ' bolts in 40 s'); clear();
  // the flood: a house at the shore loses health
  { const L = G.lakes.filter((l) => Math.hypot(l.x - 1000, l.y - 1000) > 400).sort((a, b) => a.r - b.r)[0], dx = L.x > 1000 ? 1 : -1;
    const b = F.mkBld(0, 'house', L.x + dx * (L.r + 30), L.y, 1); G.blds.push(b); F.navRebuild(); run(1); const hp = b.hp; F.startEvent('flood'); run(30); if (!(b.hp < hp)) bad.push('flood: the shore house lost nothing'); clear(); run(2); }
  // the dragon: a soldier under it is burned
  { F.startEvent('dragon'); run(2); const d = G.ev.cur.units[0], u = F.addUnit(0, 'spear', d.x, d.y); const hp = u.hp; run(2); if (!(u.hp < hp) && u.hp > 0) bad.push('dragon: nobody burned'); clear(); }
  // the travelling show: a villager beside the performers cheers
  { F.startEvent('circus'); run(3); const p = G.ev.cur.units[0], v = F.addUnit(0, 'vil', p.x + 10, p.y); run(3); if (!(v.cheer > G.t)) bad.push('circus: nobody cheered'); clear(); }
  // the alert bar: named while an event is coming and while it runs
  { G.ev.cur = null; G.ev.warned = 'eclipse'; G.ev.next = G.t + 9; let a = F.alertNow(); if (!a || a.name !== 'Eclipse' || a.now) bad.push('alert: not shown before the eclipse');
    G.ev.warned = null; F.startEvent('eclipse'); a = F.alertNow(); if (!a || !a.now || !(a.left > 0)) bad.push('alert: not shown during the eclipse'); clear(); }
  // the horde: named for its last 45 seconds
  { G.horde = { at: G.t + 30, said: 1 }; const a = F.alertNow(); if (!a || a.name !== 'Horde') bad.push('alert: the horde is not named'); G.horde = null; }
  // the army: a marched group has an order and a time, a hostile group heading in is named, a recall ends the order
  { G.fogOn = false; for (const u of G.units) if (u.owner !== 0) u.hp = 0; run(1); const home = G.blds.find((b) => b.owner === 0), a = F.addUnit(0, 'spear', home.x + 60, home.y), c = F.addUnit(0, 'spear', home.x + 70, home.y);
    const to = { x: home.x + 400, y: home.y }; for (const u of [a, c]) { u.state = 'goto'; u.px = to.x; u.py = to.y; u.idleT = 0; } F.march([a, c], to, 'test'); run(2); const O = Object.values(G.ords)[0];
    if (!O || !(O.eta > 0)) bad.push('army: no time left on the order'); if (F.armyStatus(a) !== 'march') bad.push('army: ' + F.armyStatus(a) + ', not marching');
    const e = F.addUnit(1, 'spear', home.x + 300, home.y + 100); e.state = 'attack'; run(1); if (!G.incoming || G.incoming.n < 1) bad.push('army: no attack named'); else { const t = F.alertNow(); if (!t || t.name !== 'Attack') bad.push('army: the bar does not show it'); }
    e.hp = 0; run(2); if (G.incoming) bad.push('army: the attack is still named after it died'); }
  // the War room (Build 61): Go sends a squad on the crosshair as a mission with a promised time; a fight gives it odds; Abort frees the slot
  { const home = G.blds.find((b) => b.owner === 0), sp = []; for (let i = 0; i < 6; i++) sp.push(F.addUnit(0, 'spear', home.x + 40 + i * 6, home.y + 60)); for (let i = 0; i < 6; i++) F.addUnit(0, 'chariot', home.x + 40 + i * 6, home.y + 90);
    run(2); F.hudPage('war'); if (!G.hud.aim || !G.hud.h) bad.push('war room: no crosshair on opening'); F.aimAt(120, 300); if (!G.hud.moved) bad.push('war room: a tap on the map did not move the crosshair');
    G.hud.h = { t: 'ground', e: { x: home.x + 260, y: home.y + 60 } }; F.hudFire(null); const m = G.msn[0];
    if (!m || m.n0 < 12 || !(m.due > G.t)) bad.push('war room: Go made no mission with a time (' + (m && m.n0) + ')'); else {
      const foes = []; for (let i = 0; i < 8; i++) foes.push(F.addUnit(4, 'bandit', home.x + 250 + i * 5, home.y + 60)); for (let i = 0; i < 12; i++) run(1);
      if (m.st !== 'act' && m.st !== 'done') bad.push('war room: the mission is ' + m.st + ' at the fight');
      F.hudAbort(0); for (const f of foes) f.hp = 0; run(3); if (G.msn[0]) bad.push('war room: Abort left the mission'); }
    // the Squad room: a plan set with + fills from the soldiers at home
    G.P[0].techs.add('command'); F.fxDirty(); F.hudPage('squad'); F.sqNew(); F.sqPlan(0, 'spear', 1); F.sqPlan(0, 'spear', 1); run(2); if (F.sqUnits(0).length !== 2) bad.push('squad room: the plan did not fill (' + F.sqUnits(0).length + ')');
    F.hudPage('jobs'); G.P[0].techs.delete('command'); F.fxDirty(); for (let i = 0; i < 4; i++) G.msn[i] = null; G.bnPlan[0] = {}; }
  // emergencies: villagers take cover in the sturdiest building first and Resume sends them back; soldiers garrison and stay
  { const home = G.blds.find((b) => b.owner === 0); for (let i = 0; i < 4; i++) F.addUnit(0, 'spear', home.x + 70 + i * 6, home.y + 40); const jobs = G.units.filter((u) => u.owner === 0 && u.kind === 'vil').map((u) => u.job).join(',');
    F.emgStart('hands'); run(15); const v = G.units.filter((u) => u.owner === 0 && u.kind === 'vil'), s2 = G.units.filter((u) => u.owner === 0 && u.state === 'garrison');
    if (!s2.length || !s2.every((u) => u.inside)) bad.push('emergency: soldiers did not garrison'); if (!v.every((u) => u.inside || u.safe)) bad.push('emergency: villagers are not under cover');
    F.emgResume(); run(10); if (v.some((u) => u.inside || u.emg)) bad.push('emergency: Resume left villagers inside'); if (v.map((u) => u.job).join(',') !== jobs) bad.push('emergency: Resume did not restore the jobs'); if (!s2.every((u) => u.inside)) bad.push('emergency: Resume moved the soldiers'); }
  return bad; }"""
def verbs():
    import re, glob
    s = open('src/33-verbs.js').read()
    def keys(name):
        i = s.index(f'const {name} = {{'); j = s.index('\n};', i); return set(re.findall(r'(?:^|[{;,]\s*|\n(?:\t| {2}))([a-z][a-zA-Z0-9]*)\(\w*\)\s*\{', s[i:j]))
    have = keys('ACT') | keys('PLAY')
    src = ''.join(open(f).read() for f in ['src/shell-head.html'] + sorted(glob.glob('src/*.js')))
    used = set(re.findall(r'data-act="([a-z]+)', src)) | set(re.findall(r"btn\([`']([a-z]+)", src))
    return sorted(used - have)
async def main():
    fails = 0
    v = verbs(); print(('PASS ' if not v else 'FAIL ') + 'every button verb has a handler', '' if not v else v); fails += bool(v)
    for t in ('tests/science.py', 'tests/history.py', 'tests/tables.py'):   # the equations against their sources; every research step in its age (Builds 54 and 58); the tables hold together (Build 60)
        r = subprocess.run([sys.executable, t], capture_output=True, text=True); print(r.stdout.strip() or ('FAIL ' + t + ' ' + r.stderr[-300:])); fails += r.returncode != 0
    w = subprocess.run([sys.executable, 'tests/words.py'], capture_output=True, text=True); print(('PASS ' if w.returncode == 0 else 'FAIL ') + 'toasts and tips: 10 words at most', w.stdout.strip() if w.returncode else ''); fails += w.returncode != 0
    async with async_playwright() as p:
        br = await p.chromium.launch()
        for page_file in ('first-keep.html', 'native/index.html'):
            for (W, H) in SIZES:
                pg = await br.new_page(viewport={'width': W, 'height': H}, device_scale_factor=2); errs = []
                pg.on('pageerror', lambda e: errs.append(str(e)))
                await pg.goto('file://' + os.path.abspath(page_file)); await pg.wait_for_timeout(600); await pg.evaluate(SETUP)
                bad = {}
                for name, c in [('map', None)] + CARDS + [('end', 'END')]:
                    if c == 'END': await pg.evaluate("() => { const F = window.__fk; F.closeCard && F.closeCard(); F.setPause(false); F.G.t = F.G.mode === 'conquest' ? F.G.t : 1799.9; F.G.mode = 't30'; for (let i = 0; i < 10; i++) F.step(1 / 30); }")
                    elif c: await pg.evaluate(f"window.__fk.openCard({c})")
                    await pg.wait_for_timeout(120); m = await pg.evaluate(MEASURE)
                    issues = [k for k in ('wide', 'tall') if m[k]] + ([f"scroll:{m['scroll']}"] if m['scroll'] and W >= 390 and name not in ('help', 'guide', 'research') else []) + [f'{k}:{v[:3] if k != "tap" else v}' for k, v in (('small', m['small']), ('low', m['low']), ('clip', m['clip']), ('tap', sorted(set(m['tap'])))) if v]
                    if issues: bad[name] = issues
                if errs: bad['errors'] = errs[:2]
                print(('PASS ' if not bad else 'FAIL ') + f'{page_file} {W}x{H}', '' if not bad else json.dumps(bad)[:2500]); fails += bool(bad); await pg.close()
        pg = await br.new_page(); await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(600)
        why = await pg.evaluate("() => { const g = window.__fk.guideModel(), m = []; for (const k of ['buildings', 'units', 'techs', 'ages', 'civs', 'finds']) for (const e of g[k]) if (!e.why) m.push(k + ':' + e.id); return m; }")
        raw = await pg.evaluate("() => { const F = window.__fk, out = []; for (const pg of ['bld', 'unit', 'tech', 'age', 'civ', 'rule']) { F.openCard({ type: 'guide', page: pg }); const t = document.getElementById('card').textContent; if (t.includes('${')) out.push(pg); } for (const k of ['help', 'army', 'score', 'setup']) { F.openCard({ type: k }); if (document.getElementById('card').textContent.includes('${')) out.push(k); } F.act('close'); return out; }")
        print(('PASS ' if not raw else 'FAIL ') + 'no raw code on any card', '' if not raw else raw); fails += bool(raw)
        print(('PASS ' if not why else 'FAIL ') + 'every guide entry says why', '' if not why else why); fails += bool(why)
        same = await pg.evaluate(LOOK); print(('PASS ' if not same else 'FAIL ') + 'buildings tell apart at half zoom', '' if not same else same); fails += bool(same); await pg.close()
        pg = await br.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(600)
        play = await pg.evaluate(PLAY) + errs[:2]; print(('PASS ' if not play else 'FAIL ') + 'taps do what they say', '' if not play else play); fails += bool(play); await pg.close()
        pg = await br.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(600)
        evs = await pg.evaluate(EVENTS_TEST) + errs[:2]; print(('PASS ' if not evs else 'FAIL ') + 'events do what they say', '' if not evs else evs); fails += bool(evs); await pg.close()
        # a phone lays the page out at its own width (without the viewport line an iPhone uses 980: the tall, narrow column of Build 37)
        for page_file in ('first-keep.html', 'native/index.html'):
            ctx = await br.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, device_scale_factor=3); pg = await ctx.new_page()
            await pg.goto('file://' + os.path.abspath(page_file)); await pg.wait_for_timeout(400); w = await pg.evaluate('() => [document.documentElement.clientWidth, document.compatMode]'); await ctx.close()
            ok = w[0] == 390 and w[1] == 'CSS1Compat'; print(('PASS ' if ok else 'FAIL ') + f'{page_file} lays out at the phone width, standards mode', '' if ok else w); fails += not ok
        # every message and tip whole on the ticker's one line at 375 px (Albert, Build 38: "these sentences are too long"; Build 39: one ticker for all)
        L = json.loads(subprocess.run([sys.executable, 'tests/words.py', '--list'], capture_output=True, text=True).stdout)
        pg = await br.new_page(viewport={'width': 375, 'height': 667}); await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(500)
        wraps = await pg.evaluate("""(L) => { const F = window.__fk; F.newGame(5); F.act('close'); F.setPause(true); const e = document.getElementById('tkT'), out = [];
          for (const t of L) { e.textContent = t; if (e.scrollWidth > e.clientWidth + 1) out.push(t); } return out; }""", L); await pg.close()
        print(('PASS ' if not wraps else 'FAIL ') + f'{len(L)} messages fit the ticker at 375 px', '' if not wraps else wraps[:6]); fails += bool(wraps)
        # the alert bar (an event coming, an event running) whole on the ticker's line at 375 px, for every event
        pg = await br.new_page(viewport={'width': 375, 'height': 667}); await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(500)
        cut = await pg.evaluate("""() => { const F = window.__fk; F.newGame(5); F.act('close'); F.setPause(true); const G = F.G, e = document.getElementById('tkT'), out = [];
          const test = (k, ph) => { const a = F.alertNow(); if (!a) { out.push(k + ' ' + ph + ': no alert'); return; } e.innerHTML = F.alertHTML(a); const i = e.querySelector('i'); if (i.scrollWidth > i.clientWidth + 1 || e.scrollWidth > e.clientWidth + 1) out.push(k + ' ' + ph + ': ' + e.textContent); };
          for (const k of Object.keys(F.EVENTS)) { G.ev.cur = null; G.ev.warned = k; G.ev.next = G.t + 12; test(k, 'coming'); G.ev.warned = null; F.startEvent(k); test(k, 'running'); F.endEvent(); } return out; }"""); await pg.close()
        print(('PASS ' if not cut else 'FAIL ') + 'the alert bar fits the ticker at 375 px, for every event', '' if not cut else cut[:6]); fails += bool(cut)
        # every map is fair (Build 49: corners are no longer copies): on ten seeds, the sides' walks to work, the Throne and a neighbour within FAIR.spread
        pg = await br.new_page(); await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(400)
        unfair = await pg.evaluate("() => { const F = window.__fk, out = []; for (let s = 1; s <= 10; s++) { F.newGame(s); const f = F.fairness(); if (f.worst > F.FAIR.spread) out.push(s + ': ' + JSON.stringify(f.spread)); } return out; }"); await pg.close()
        print(('PASS ' if not unfair else 'FAIL ') + 'maps are fair on ten seeds', '' if not unfair else unfair); fails += bool(unfair)
        pg = await br.new_page(viewport={'width': 390, 'height': 844}); await pg.goto('file://' + os.path.abspath('first-keep.html')); await pg.wait_for_timeout(400)
        ui = await pg.evaluate("""() => { const F = window.__fk; F.SET.fog = false; F.SET.scen = 'open'; F.newGame(3); F.act('close'); const G = F.G; G.P[0].age = 4; const k = F.keepOf(0);
          for (let i = 0; i < 5; i++) F.addUnit(0, 'spear', k.x + 30, k.y + 30); for (let i = 0; i < 10; i++) F.step(1 / 30); F.ui(true);
          const n = [...document.querySelectorAll('[data-act]')].filter((e) => !e.closest('#card') && !e.closest('#end') && !e.closest('#tkPop') && e.offsetParent !== null && e.getBoundingClientRect().width > 0).length;
          return [n, F.UI_BUDGET]; }"""); await pg.close()
        print(('PASS ' if ui[0] <= ui[1] else 'FAIL ') + f'the play screen keeps to its button budget: {ui[0]} of {ui[1]}'); fails += ui[0] > ui[1]
        fp, _ = await fingerprint(br); print(('PASS ' if not fp else 'FAIL ') + 'the game plays as the baseline says', '' if not fp else '\n  ' + '\n  '.join(fp[:4]) + '\n  (a deliberate rule change: python3 tests/gate.py --accept "why")'); fails += bool(fp)
        await br.close()
    if '--soak' in sys.argv: fails += subprocess.run([sys.executable, 'tests/soak.py']).returncode != 0   # opt-in, about 3 minutes: long games on three seeds
    sys.exit(1 if fails else 0)
asyncio.run(main())
