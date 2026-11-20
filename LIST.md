# First Keep — The List

Agreed Nov 20. One build between previews. Order is top to bottom.

## Cleanup

- [x] Build 1: publish from `fresh`, the check, comments and citations books back
- [x] Build 2 (plays the same, proven on four seeded matches): restart no longer inherits the last game's unpaid upkeep · 0 and 1 back (1,552 uses) · null as zero gone (105) · the build ghost, two fallbacks and the load tolerance · the 120 unset units · the two debug overlays cut
- [ ] Left over from Build 2: 2,259 numbers inside book tables have no unit said (the 120 were only the labelled ones) · about 50 measured numbers still typed in `index.html` outside the art (the sun's tilt 23.44 among them) · book entries nothing reads (next, single, forestScale, sea and others) · some null may still stand for a number
- [x] Menu audit: the menus were already one mold (a fixed line, a control row, a tile row) with one cell maker; what was left in code was what each menu holds
- [ ] Human-side test: a test that plays as a person (every age, building, unit, card and button). It is the proof for the menu build, shrinks the 217 unsorted functions, and later proves each lost feature fixed
- [ ] Talk session, decisions only (before the standards step of Build 3): what red, green, blue, gold and cream mean; one look each for chosen, ready and unavailable; the text sizes; tap size 44
- [ ] Build 3, the menu build: what each menu holds becomes lists in the Screen book, every screen identical (proven by `tools/screens.py`, 173 screens)
  - [x] part 1: the control row's actions (SN52), the tile rows for jobs, build, a crew and ice (SN53), the card sections (SN54)
  - [x] part 2: the top bar is a single strip again (Albert, Nov 20): five stores, people, pause, Mail. The war controls and the jobs row are unique and stay as they are (Albert, Nov 20). Left to convert: the resource card's line, the top line
  - [ ] homes to find (Albert to say where): clock and season, time left, age, idle count, army count, rank, score. The Score sheet has no door until rank and score have a home
  - [ ] part 3: the seven sheets (new game, Build, Help, Stores, Score, Mail, Pause)
  - [ ] part 4: the screen built once and updated in place, not reassembled as text
  - [ ] then the standards, as edits to those lists and the stylesheet: colour meanings, one look each for chosen, ready and unavailable, the text sizes, tap size 44
  - Not covered by the screens test (no such thing on the board in its match): the Make, Sell and Buy sections, the ice menu, later-age buildings
- [ ] Build 4: pictures in memory (the big sheets first), cap the cache
- [ ] Sources, alongside: every number Sourced, Derived or Chosen with its reason; open reasons listed for Albert
- [ ] Units: the 2,259 numbers inside tables with no unit said
- [ ] Lost features (list below), one at a time
- [ ] Simulation speed, last: no freezing on the phone since about Nov 16 (Albert, Nov 20). Measured on a desktop: late Hard games with about 320 units cost 15 to 24 s of computer time a game minute, mostly path-finding and animals. Phone test with the frame meter first
- [ ] Prose out of the books into the comments book, with index numbers; lock finished parts byte for byte

## Parked (Albert, Nov 20)

- Merging the art's colours into one palette: dropped, not worth the time
- Sprite colours into the sprites book (about 50 buildings, the soldier parts and props are still typed in the code; colours can move unchanged, proven pixel for pixel): parked
- Building shapes as data: parked; the drawings are code with about 100 branches, a redesign of its own

## Function rulings (Albert, Nov 20)

Cut: the two debug overlays (done)

Kept (Albert, Nov 20, ruled again): rebellion, it goes with vassals · the replant button, it is not a duplicate

Keep, works: garrison · ice and floods · copy log · replant all · later-age building art · fronts (finds the army's groups for the look button) · unit history on the card

Keep, to fix after cleanup (lost features):
- Camps and wagons: tried, does not work
- Charge: broken
- Shelter, reinforce, boarding up: unfinished; one villager-defence feature with garrison
- Priests, spies, schooling, zeal: never seen
- Diplomacy (envoys, gifts, vassals, tribute): about 90% never seen
- Traps, ambushes, ransom: wait on the natives, which need a design pass
- Guide and help: not built out
- Trade: works, hard to use; must explain itself
- Hunt: design needs correcting
- Bank: keep; redesign (today it only pays interest on gold held, 1% a minute, at most 40)
- Repair: untested
- Army orders and commands as a whole: a pain point; nothing cut until the control redesign

Open: about 217 functions not yet sorted, waiting on a test that plays the human side
