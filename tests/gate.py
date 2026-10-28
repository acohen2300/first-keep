# The gate: what must hold before a build goes live, measured at four iPhone sizes, not judged by eye.
# No page errors; no two buildings alike at half zoom; nothing wider than the screen; every word inside its button; text at least 12 px; contrast at least 4.5:1 (target 7:1); no card but Help and the Guide needs scrolling from 390 × 844 up (the iPhone SE at 375 × 667 is too short for the biggest cards); every tap target at least 44 × 44 points (Apple's rule), except the − and + tiles under each job (six columns leave them 26 to 29 points wide; kept by choice, Build 36).
# Run from first-keep/:  python3 build.py && python3 wrap.py && python3 tests/gate.py
import asyncio, json, os, subprocess, sys
from playwright.async_api import async_playwright
SIZES = [(375, 667), (390, 844), (393, 852), (430, 932)]
SETUP = """() => { const F = window.__fk; F.newGame(5); F.act('close'); const G = F.G, P = G.P[0], k = F.keepOf(0); F.setPause(true);
  P.age = 3; for (const r of ['f', 'w', 's', 'g', 'i']) P.res[r] = 9999; P.goods.cloth = 30; for (let i = 0; i < 12; i++) F.addUnit(0, 'spear', k.x + 60, k.y - 60);
  const put = kind => { const s = F.findSpot(0, kind, k.x, k.y, 70, 320); const b = F.build(0, kind, s.x, s.y); b.prog = 1; b.hp = F.BLD[kind].hp; F.built(b); return b.id; };
  window.IDS = { workshop: put('workshop'), farm: put('farm'), market: put('market'), keep: k.id }; F.navRebuild(); F.makeVassal(1, 0, 'fair'); window.IDS.vassal = F.keepOf(1).id; }"""
CARDS = [('help', "{type:'help'}"), ('setup', "{type:'setup'}"), ('army', "{type:'army'}"), ('home', "{type:'menu',id:'home'}"), ('guide', "{type:'guide',page:'bld'}"),
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
  tap('#buildB'); if (!G.card || G.card.type !== 'menu') out.push('Build did not open the Build card');
  tap('[data-act="menu:home"]'); if (!G.card || G.card.id !== 'home') out.push('the Home tab did not open');
  tap('[data-act="build:house"]'); if (!G.place || G.place.kind !== 'house') out.push('tapping House did not start placing');
  F.act('cancel'); if (G.place) out.push('Cancel left a placement');
  const q0 = F.keepOf(0).q.length; tap('#tVil'); if (F.keepOf(0).q.length !== q0 + 1) out.push('+ did not queue a villager');
  tap('#tUn'); if (F.keepOf(0).q.length !== q0) out.push('- did not cancel the villager');
  tap('[data-act="move:wood"]'); if (!F.G.units.some(u => u.owner === 0 && u.kind === 'vil' && u.job === 'wood')) out.push('+ under Wood put nobody on wood');
  tap('#tPeople'); if (!G.card || G.card.type !== 'army') out.push('People card did not open'); F.act('close');
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
def verbs():
    import re, glob
    s = open('src/16-verbs.js').read()
    def keys(name):
        i = s.index(f'const {name} = {{'); j = s.index('\n};', i); return set(re.findall(r'(?:^|[{;,]\s*|\n\s{2})([a-z][a-zA-Z0-9]*)\(\w*\)\s*\{', s[i:j]))
    have = keys('ACT') | keys('PLAY')
    src = ''.join(open(f).read() for f in ['src/shell-head.html'] + sorted(glob.glob('src/*.js')))
    used = set(re.findall(r'data-act="([a-z]+)', src)) | set(re.findall(r"btn\([`']([a-z]+)", src))
    return sorted(used - have)
async def main():
    fails = 0
    v = verbs(); print(('PASS ' if not v else 'FAIL ') + 'every button verb has a handler', '' if not v else v); fails += bool(v)
    import subprocess; w = subprocess.run([sys.executable, 'tests/words.py'], capture_output=True, text=True); print(('PASS ' if w.returncode == 0 else 'FAIL ') + 'toasts and tips: 10 words at most', w.stdout.strip() if w.returncode else ''); fails += w.returncode != 0
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
        fp, _ = await fingerprint(br); print(('PASS ' if not fp else 'FAIL ') + 'the game plays as the baseline says', '' if not fp else '\n  ' + '\n  '.join(fp[:4]) + '\n  (a deliberate rule change: python3 tests/gate.py --accept "why")'); fails += bool(fp)
        await br.close()
    sys.exit(1 if fails else 0)
asyncio.run(main())
