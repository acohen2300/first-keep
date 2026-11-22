// Book · A Angles, in degrees. The game reads it; INDEX.md is written from it. Edit here only.
BOOK("angles", {
 "A1": {"key":"turn","value":15,"name":"the grid's turn on the screen","cite":["N90"],"law":["QBD"]},
 "A2": {"key":"rise","value":41,"name":"the camera's rise over the ground","cite":["N91"],"law":["QBD"]},
 "A3": {"key":"repose","value":34,"name":"the angle of repose, dry sand: steeper is a face, not a slope","cite":["N64"],"law":["QBE"]},
 "A4": {"key":"round","value":360,"name":"a full turn: anything that goes round (a lake's fish spots, a ring of guards, the board's corners)","cite":["N170"],"law":[]},
 "A5": {"key":"loose","value":45,"name":"a missile is loosed at this rise (combat.js fly); the farthest reach only without drag and from the ground (Mid's rangeFrom): with QAJ's drag and the shooter's height the farthest lies lower","cite":["N39","N188"],"law":["QAJ"]},
 "A6": {"key":"corner","value":270,"name":"your corner: the board's corners go clockwise a quarter turn apart from the top left of the screen; yours, the first, is this far round, the bottom left, whatever the grid's turn (Albert, Nov 6 16:01)","cite":["N228"],"law":[]},
 "A7": {"key":"axis","value":23.44,"name":"the earth's axis leans this far from upright: the sun's height at noon swings this far either side of the equinox over the year","cite":["N2"],"law":["QA"]},
 "A8": {"key":"fade","value":10,"name":"the sun's height over which its shadows fade in: from the horizon up to this they darken to full (tuning)","cite":["N500"],"law":["QAT"]},
 "A9": {"key":"low","value":2,"name":"the lowest sun or moon a shadow is cast from: lower, the shadow is cast as from this height, so it stays finite and points away (tuning)","cite":["N500"],"law":["QAT"]}
});
