# Save safety (Build 80 batch 2): each check below failed on the Build 70 code and passes now. Run by the gate:  python3 tests/saves.py
import asyncio, os, re, sys, glob
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEED = """() => { const F = window.__fk; F.newGame(5); F.act('close'); F.setPause(false); for (let i = 0; i < 80; i++) F.step(0.25); F.saveGame(true); return localStorage.getItem(F.SAVEKEY); }"""
JS = """(raw) => {
  const F = window.__fk, bad = [];
  // a waiting Resume card: force-save, close and back do not touch the save or start a game
  F.newGame(9); localStorage.setItem(F.SAVEKEY, raw); const before = raw;
  F.openCard({ type: 'resume', t: 30, age: 0, civ: 'roman' }); F.setPause(true);
  const hs = F.holdSave; if (!hs) { /* boot sets it; set it as boot does */ }
  F.setHold && F.setHold(true);
  F.saveGame(true); if (localStorage.getItem(F.SAVEKEY) !== before) bad.push('a forced save overwrote the save the Resume card offers');
  F.act('close'); if (!F.G.card || F.G.card.type !== 'resume') bad.push('the Resume card closed into play');
  F.act('cardback'); if (!F.G.card || F.G.card.type !== 'resume') bad.push('back closed the Resume card');
  F.refresh&&F.refresh(); if (!/data-act="close"[^>]*class="dis"/.test(document.body.innerHTML)) bad.push('close is not dim on the Resume card');
  // a finished game leaves no backup to bring it back
  localStorage.setItem(F.SAVEKEY + '.bak', raw); F.clearSave();
  if (localStorage.getItem(F.SAVEKEY) || localStorage.getItem(F.SAVEKEY + '.bak')) bad.push('clearSave left a save or a backup');
  // the blank game has its threats
  if (!Array.isArray(F.blankGame(1).threats)) bad.push('blankGame has no threats list');
  // an old save naming a cut unit kind still migrates; a damaged save is kept aside, not overwritten
  const o = JSON.parse(raw); o.v = 35; o.blds = o.blds || []; if (o.blds[0]) o.blds[0].q = [{ kind: 'cutkind' }];
  try { F.MIGRATE[35](o); } catch (e) { bad.push('a cut unit kind stops an old save from opening'); }
  localStorage.setItem(F.SAVEKEY, '{"units":1,"P":[],"v":39,"blds":null,"x":'); F.readSave();
  if (!localStorage.getItem(F.SAVEKEY + '.lost')) bad.push('a damaged save was not kept aside');
  return bad;
}"""
def static():
    bad = []; src = {f: open(f).read() for f in glob.glob(os.path.join(ROOT, 'src', '*.js'))}
    all_ = ''.join(src.values())
    if "'card:menu,land'" in all_: bad.append("House fix still points at 'card:menu,land'")
    if 'G.ev.cur = null;\n\t} // an event' in all_: bad.append('a dropped event on load is not ended')
    if not re.search(r"CHAN\[name\] !== 'alert' &&", all_): bad.append('an alert still waits for a voice')
    if not re.search(r"on\('hands'\)", all_): bad.append('All hands never shows on')
    if '.old\' + S.v' not in all_: bad.append('stale saves share one .old slot')
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
        raw = await pg.evaluate(SEED); bad = await pg.evaluate(JS, raw); await br.close()
    bad = bad + static() + errs
    print(('PASS ' if not bad else 'FAIL ') + 'save safety (Resume locked, force cannot overwrite, clear removes backup, event ends on load)', '' if not bad else bad)
    sys.exit(1 if bad else 0)
asyncio.run(main())
